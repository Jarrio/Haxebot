package commands;

import discord_js.TextChannel;
import js.html.URL;
import discord_js.MessageEmbed;
import haxe.Json;
import haxe.Http;
import discord_js.User;
import discord_js.Message;
import Main.CommandForward;
import discord_builder.BaseCommandInteraction;
import components.Command;
import systems.CommandBase;
import js.Browser;

class ScamPrevention extends CommandBase {
	final keywords:Array<String> = [
		'ticket',
		'contact',
		'mod',
		'admin',
		'support',
		'$',
		'crypto',
		'market',
		'help',
		'chat',
		'profit',
		'£',
		'nudes',
		'free',
		'gift',
		'steam',
		'telegram',
		'giftcard',
		'whatsapp',
		'girls',
		'sexy',
		'teen',
		'port',
		'nsfw',
		'%',
		'nitro',
		'airdrop',
		'forex',
		'pay'
	];

	@:fastFamily var messages:{forward:CommandForward, message:Message};

	var time_since:Map<String, Float> = new Map();
	var sequential_tags:Map<String, Int> = new Map();
	var user_list:Map<String, User> = new Map();
	var trigger_messages:Map<String, Array<Message>> = new Map();

	var phishing_urls:Array<String> = [];
	var phishing_update_time:Float;

	var timestamp(get, never):Float;
	final last_message_interval = 5000;

	final queue_time = 10000; // 40 seconds
	var hold_list:Map<String, Message> = [];

	function singleMessageCheck(message:Message) {
		if (message.author.id == state?.announcer?.id) {
			return false;
		}

		if (!message.content.contains('@everyone') && !message.content.contains('@here')) {
			trace('here');
			return false;
		}

		if (hasKeyword(message.content)) {
			return true;
		}

		if (hasLink(message.content)) {
			return true;
		}

		var counter = 0;
		if (checkContent([message])) {
			return true;
		}

		return false;
	}

	function hasLink(message:String) {
		var markdown = ~/\[.*?\]\(.*?\)/gmi;
		if (markdown.match(message)) {
			return true;
		}
		var https = ~/https:\/\/.*?\..*?[\/|\s]/gmi;
		if (https.match(message)) {
			return true;
		}

		return false;
	}

	public function isURLEncoded(url:String):Bool {
		var encodingRegex = ~/(%[0-9A-Fa-f]{2})/;
		return encodingRegex.match(url);
	}

	public function urlDecode(encodedUrl:String):String {
		if (encodedUrl == null)
			return "";

		var decoded = encodedUrl;

		// Replace URL encoded characters
		var regex = ~/(%[0-9A-Fa-f]{2})/g;
		decoded = regex.map(decoded, function(r) {
			var hex = r.matched(1).substr(1); // Remove the %
			var charCode = Std.parseInt("0x" + hex);
			return String.fromCharCode(charCode);
		});

		return decoded;
	}

	public function extractURLs(content:String):Array<String> {
		var urls = [];

		// Don't decode the entire content here - extract first, then decode individual URLs

		var cleanMessage = ~/\s+/g.replace(content, "");

		var standardPattern = ~/https?:\/\/[^\s<>"']+/gi;
		standardPattern.map(cleanMessage, function(r) {
			var url = r.matched(0);
			// Decode individual URL if it's encoded
			if (isURLEncoded(url)) {
				url = urlDecode(url);
			}
			if (!urls.contains(url)) {
				urls.push(url);
			}
			return r.matched(0);
		});

		// Spaced/obfuscated patterns in original message
		var spacedPattern = ~/h\s*t\s*t\s*p\s*s?\s*:\s*\/\s*\/\s*[^\s]*(?:\s+[^\s]*)*(?=\s|$|<|>)/gi;
		spacedPattern.map(content, function(r) {
			var cleanedUrl = ~/\s+/g.replace(r.matched(0), "");
			// Decode after cleaning spaces
			if (isURLEncoded(cleanedUrl)) {
				cleanedUrl = urlDecode(cleanedUrl);
			}
			if (!urls.contains(cleanedUrl)) {
				urls.push(cleanedUrl);
			}
			return r.matched(0);
		});

		// URLs wrapped in < >
		var wrappedPattern = ~/<\s*(h\s*t\s*t\s*p\s*s?\s*:.*?)\s*>/gi;
		wrappedPattern.map(content, function(r) {
			var cleanedUrl = ~/\s+/g.replace(r.matched(1), "");
			cleanedUrl = ~/[:：]/g.replace(cleanedUrl, ":");
			cleanedUrl = ~/[\\\/]+/g.replace(cleanedUrl, "/");
			// Decode after cleaning
			if (isURLEncoded(cleanedUrl)) {
				cleanedUrl = urlDecode(cleanedUrl);
			}
			if (!urls.contains(cleanedUrl)) {
				urls.push(cleanedUrl);
			}
			return r.matched(0);
		});

		// Multi-line URL extraction
		var lines = content.split('\n');
		var currentURL = "";
		var inURL = false;

		for (line in lines) {
			var cleanLine = ~/\s+/g.replace(line, "");
			var originalLine = line.trim(); // Keep original for bracket checking

			if (~/^h\s*t\s*t\s*p/i.match(line) || ~/^https?/i.match(cleanLine)) {
				inURL = true;
				currentURL = cleanLine;
			} else if (inURL && cleanLine.length > 0 && !~/[<>]/.match(originalLine)) {
				// Continue building URL only if no brackets in original line
				currentURL += cleanLine;
			} else if (inURL && (cleanLine.length == 0 || ~/[<>]/.match(originalLine))) {
				// End URL on empty line or line with brackets
				if (currentURL.length > 0 && ~/^https?:/i.match(currentURL)) {
					var finalUrl = currentURL;
					if (isURLEncoded(finalUrl)) {
						finalUrl = urlDecode(finalUrl);
					}
					if (!urls.contains(finalUrl)) {
						urls.push(finalUrl);
					}
				}
				currentURL = "";
				inURL = false;
			}
		}

		if (inURL && currentURL.length > 0 && ~/^https?:/i.match(currentURL)) {
			var finalUrl = currentURL;
			if (isURLEncoded(finalUrl)) {
				finalUrl = urlDecode(finalUrl);
			}
			if (!urls.contains(finalUrl)) {
				urls.push(finalUrl);
			}
		}

		return urls;
	}

	function hasInviteLink(message:String) {
		var links = ['discord.gg', 'discordapp.com'];
		for (link in links) {
			if (message.toLowerCase().contains(link)) {
				return true;
			}
		}
		return false;
	}

	function oneChanceChecks(message:Message) {
		var urls = extractURLs(message.content);

		if (urls.length > 0 && hasKeyword(message.content)) {
			trace(urls);
			trace(message.content);
			return true;
		}

		return false;
	}

	override function update(_:Float) {
		super.update(_);
		iterate(messages, entity -> {
			if (forward != scam_prevention) {
				continue;
			}

			if (oneChanceChecks(message)) {
				reviewMessage([message]);
			}

			// if (this.singleMessageCheck(message)) {
			// 	hold_list.set(message.id, message);
			// }

			if (withinTime(message.createdTimestamp, last_message_interval)) {
				this.updateTime(message.author.id);
				this.addMessage(message.author.id, message);
			}

			this.universe.deleteEntity(entity);
		});

		this.getPhishingLinks();

		for (messages in this.trigger_messages) {
			if (this.checkPhishingLinks(messages)) {
				this.banUser(messages);
				continue;
			}

			if (messages.length < 2) {
				continue;
			}

			// for (m in messages) {
			// 	if (this.hold_list.exists(m.id)) {
			// 		hold_list.remove(m.id);
			// 	}
			// }

			var review = false;
			if (this.checkTags(messages)) {
				review = true;
			}

			if (this.checkContent(messages)) {
				review = true;
			}

			if (this.checkEquality(messages)) {
				review = true;
			}

			if (!this.checkChannels(messages)) {
				review = false;
			}

			if (!review) {
				continue;
			}

			this.reviewMessage(messages);
			this.resetChecks(messages[0].author.id);
		}

		// for (key => value in hold_list) {
		// 	var now = Date.now().getTime() + queue_time;
		// 	trace(value.createdTimestamp);

		// 	if (withinTime(value.createdTimestamp, queue_time)) {
		// 		continue;
		// 	}
		// 	this.reviewMessage([value]);
		// 	this.resetChecks(value.author.id);
		// 	this.hold_list.remove(key);
		// }

		for (id => value in this.time_since) {
			if (this.timestamp - value > this.last_message_interval) {
				this.resetChecks(id);
			}
		}
	}

	function reviewMessage(messages:Array<Message>) {
		var message = messages[0];
		var embed = this.reformatMessage('SPAM ALERT - Timed out', message);

		this.timeoutUser(message, function(_) {
			message.reply({
				content: '<@&198916468312637440> Please review this message by: <@${message.author.id}>',
				embeds: [embed]
			}).then(function(_) {
				for (message in messages) {
					message.delete().then(null, function(err) {
						trace(err);
						Browser.console.dir(err);
					});
				}
			}, function(err) {
				trace(err);
				Browser.console.dir(err);
			});
		});
	}

	inline function resetChecks(id:String) {
		this.time_since.remove(id);
		this.user_list.remove(id);
		this.trigger_messages.remove(id);
	}

	inline function getPhishingLinks() {
		if (this.timestamp - this.phishing_update_time < 1000 * 60 * 60 * 6) {
			return;
		}
		phishing_update_time = this.timestamp;
		var links = new Http('https://raw.githubusercontent.com/Discord-AntiScam/scam-links/main/urls.json');
		links.onData = function(data) {
			try {
				phishing_urls = Json.parse(data);
			} catch (e ) {
				trace(e);
				trace('error parsing phishing links');
				this.phishing_update_time = this.timestamp - 1000 * 60 * 60 * 5;
			}
		}
		links.request();
	}

	function timeoutUser(message:Message, ?callback:(_:Dynamic) -> Void) {
		message.guild.members.fetch(message.author.id).then(function(guild_member) {
			this.logMessage(message.author.id, this.reformatMessage('Original Message', message, false), TIMEOUT);
			guild_member.timeout(1000 * 60 * 60 * 12, 'Stop spamming, a mod will review this at their convenience.').then(callback, function(err) {
				trace(err);
				Browser.console.dir(err);
			});
			this.resetChecks(message.author.id);
		}, function(err) {
			trace(err);
			Browser.console.dir(err);
		});
	}

	inline function checkChannels(messages:Array<Message>) {
		var channel_count = 1;
		for (k => m in messages) {
			if (k == 0) {
				continue;
			}
			var last = messages[k - 1];
			if (last.channel.asType0.id != m.channel.asType0.id) {
				channel_count++;
			}
		}
		return channel_count > 1;
	}

	function banUser(messages:Array<Message>, ?callback:(_:Dynamic) -> Void) {
		var message = messages[0];
		message.guild.members.fetch(message.author.id).then(function(guild_member) {
			for (message in messages) {
				this.logMessage(message.author.id, this.reformatMessage('Original Message', message, false), BAN);
			}
			guild_member.ban({
				days: 1,
				reason: "found phishing links, auto banned."
			}).then(null, function(err) {
				trace(err);
				Browser.console.dir(err);
			});
			this.resetChecks(message.author.id);
			message.channel.asType0.send('User <@${message.author.id}> has been auto banned for sending scam links.').then(callback, function(err) {
				trace(err);
				Browser.console.dir(err);
			});
		}, function(err) {
			trace(err);
			Browser.console.dir(err);
		});
	}

	function logMessage(id:String, embed:MessageEmbed, action:UserActions) {
		embed.description += '\n\n Action: **__${action}__**';

		Main.client.channels.fetch('952952631079362650').then(function(channel:TextChannel) {
			channel.send({content: '<@$id>', embeds: [embed]});
		}, function(err) {
			trace(err);
			Browser.console.dir(err);
		});
	}

	function checkContent(messages:Array<Message>) {
		for (m in messages) {
			for (key in keywords) {
				if (m.content.toLowerCase().contains(key)) {
					return true;
				}
			}
		}
		return false;
	}

	function hasKeyword(message:String) {
		for (keyword in keywords) {
			if (message.toLowerCase().contains(keyword)) {
				return true;
			}
		}
		return false;
	}

	function checkPhishingLinks(messages:Array<Message>) {
		for (message in messages) {
			for (link in this.phishing_urls) {
				if (message.content.contains(link)) {
					var regex = ~/((((https?:)(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/gm;
					if (regex.match(message.content)) {
						var url = new URL(regex.matched(1));
						var arr = [~/(.*)?.?(discordapp.com)/gu, ~/(.*)?.?(twitch.tv)/gu];
						var whitelisted = false;
						for (url_host_regex in arr) {
							if (url_host_regex.match(url.hostname)) {
								whitelisted = true;
							}
						}

						if (whitelisted) {
							return false;
						}

						if (url.hostname.length == 0 || url.hostname == null) {
							trace(regex.matched(1));
							return false;
						}

						if (link != url.hostname) {
							return false;
						}

						return true;
					}
				}
			}
		}
		return false;
	}

	function checkTags(messages:Array<Message>) {
		var tag_count = 0;

		for (message in messages) {
			if (message.content.contains('@everyone') || message.content.contains('@here')) {
				if (tag_count >= 3) {
					trace('here');
					break;
				}
				tag_count++;
			}
		}

		if (tag_count >= 2) {
			return true;
		}

		return false;
	}

	function checkEquality(messages:Array<Message>) {
		var equality_count = 0;
		var channel_count = 0;

		var compare = messages[0];
		for (message in messages) {
			try {
				var content = message.content;
				if (compare.content == content) {
					equality_count++;
				}
				if (compare.channel.asType0.id != message.channel.asType0.id) {
					channel_count++;
				}
			} catch (e ) {
				trace(e);
				trace(Json.stringify(messages));
			}
		}

		if (equality_count == messages.length && equality_count >= 3 && channel_count >= 4) {
			return true;
		}

		return false;
	}

	function reformatMessage(title:String, message:Message, format:Bool = true) {
		var embed = new MessageEmbed();
		var content = message.content;

		if (title != null) {
			embed.setTitle(title);
		}

		if (format) {
			var link_regex = ~/(https?:\/\/(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9])(:?\d*)\/?([a-z_\/0-9\-#.]*)\??([a-z_\/0-9\-#=&]*)/ig;

			if (link_regex.match(content)) {
				content = link_regex.replace(content, '[Link Removed]');
			}

			var markdown_regex = ~/\[.*\)/ig;

			if (markdown_regex.match(content)) {
				content = markdown_regex.replace(content, '[Content Removed]');
			}

			content = content.replace("#", "");
		}

		var rand = Math.random();
		var avatar = if (rand >= 0 && rand < 0.33) {
			muffin;
		} else if (rand >= 0.33 && rand < 0.66) {
			bulby;
		} else {
			bsod;
		}

		embed.setAuthor({name: '${message.author.tag}', iconURL: avatar});
		embed.setDescription(content);

		return embed;
	}

	inline function updateTime(user:String) {
		this.time_since.set(user, this.timestamp);
	}

	function run(command:Command, interaction:BaseCommandInteraction) {}

	private inline function get_timestamp() {
		return Date.now().getTime();
	}

	function get_name():String {
		return 'scamprevention';
	}

	function addMessage(id:String, message:Message) {
		var messages = this.trigger_messages.get(id);
		if (messages == null) {
			messages = [];
		}
		messages.push(message);
		this.trigger_messages.set(id, messages);
	}
}

enum abstract UserActions(String) {
	var NONE;
	var TIMEOUT;
	var BAN;
}

enum abstract CopLogo(String) to String {
	var muffin = 'https://github.com/Jarrio/Haxebot/blob/master/bin/resources/images/muffin_haxe_cop.png?raw=true&rf=1';
	var bulby = 'https://github.com/Jarrio/Haxebot/blob/master/bin/resources/images/bulby_haxe_cop.png?raw=true';
	var bsod = 'https://github.com/Jarrio/Haxebot/blob/master/bin/resources/images/bsod_haxe_cop.png?raw=true';
}
