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
		'tlcket',
		'contact',
		'admin',
		'support',
		'$',
		'crypto',
		'market',
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
		'porn',
		'nsfw',
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
	final logChannelId = #if block "1060192351030628372" #else "952952631079362650" #end;
	var messageCount:Map<String, Int> = [];
	var messageLastSent:Map<String, Float> = [];
	var messagesTracked:Map<String, Array<Message>> = [];

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

		// Handle URLs wrapped in < > (including multi-line)
		var wrappedPattern = ~/<([^>]*?)>/gs;
		wrappedPattern.map(content, function(r) {
			var innerContent = r.matched(1);

			var cleanedUrl = ~/[\s\n\r\t]+/g.replace(innerContent, "");

			if (~/^https?:/i.match(cleanedUrl)) {
				if (isURLEncoded(cleanedUrl)) {
					cleanedUrl = urlDecode(cleanedUrl);
				}

				if (~/^https?:\/[^\/]/.match(cleanedUrl)) {
					cleanedUrl = ~/^(https?:)\//i.replace(cleanedUrl, "$1//");
				}

				if (!urls.contains(cleanedUrl)) {
					urls.push(cleanedUrl);
				}
			}
			return r.matched(0);
		});

		// Find any text that starts with http/https
		var spacedHttpPattern = ~/h\s*t\s*t\s*p\s*s?\s*:\s*\/\s*\/\s*[^\s]*(?:\s+[^\s<>]*)*(?=\s|$|<|>|\.)/gi;
		spacedHttpPattern.map(content, function(r) {
			var cleanedUrl = ~/\s+/g.replace(r.matched(0), "");

			cleanedUrl = ~/[<>].*$/g.replace(cleanedUrl, "");

			if (isURLEncoded(cleanedUrl)) {
				cleanedUrl = urlDecode(cleanedUrl);
			}

			cleanedUrl = ~/^(https?:)\/([^\/])/i.replace(cleanedUrl, "$1//$2");

			if (!urls.contains(cleanedUrl)) {
				urls.push(cleanedUrl);
			}
			return r.matched(0);
		});

		// Standard URLs (clean text)
		var cleanMessage = ~/\s+/g.replace(content, " ");
		var standardPattern = ~/https?:\/\/[^\s<>"']+/gi;
		standardPattern.map(cleanMessage, function(r) {
			var url = r.matched(0);
			if (isURLEncoded(url)) {
				url = urlDecode(url);
			}

			url = ~/^(https?:)\/([^\/])/i.replace(url, "$1//$2");

			if (!urls.contains(url)) {
				urls.push(url);
			}
			return r.matched(0);
		});

		// Multi-line reconstruction
		var lines = content.split('\n');
		var potentialUrl = "";
		var foundHttpStart = false;

		for (line in lines) {
			var trimmedLine = StringTools.trim(line);

			//
			if (~/^<?h\s*t\s*t\s*p/i.match(trimmedLine)) {
				foundHttpStart = true;
				potentialUrl = ~/\s+/g.replace(trimmedLine, "");
				potentialUrl = ~/^<|>$/g.replace(potentialUrl, "");
			} else if (foundHttpStart && trimmedLine.length > 0) {
				var cleanLine = ~/\s+/g.replace(trimmedLine, "");
				cleanLine = ~/^<|>$/g.replace(cleanLine, "");

				if (trimmedLine.charAt(trimmedLine.length - 1) == '>') {
					cleanLine = cleanLine.substr(0, cleanLine.length - 1);
					potentialUrl += cleanLine;

					if (~/^https?:/i.match(potentialUrl)) {
						if (isURLEncoded(potentialUrl)) {
							potentialUrl = urlDecode(potentialUrl);
						}

						potentialUrl = ~/^(https?:)\/([^\/])/i.replace(potentialUrl, "$1//$2");

						if (!urls.contains(potentialUrl)) {
							urls.push(potentialUrl);
						}
					}

					potentialUrl = "";
					foundHttpStart = false;
				} else {
					potentialUrl += cleanLine;
				}
			} else if (foundHttpStart) {
				if (~/^https?:/i.match(potentialUrl)) {
					if (isURLEncoded(potentialUrl)) {
						potentialUrl = urlDecode(potentialUrl);
					}

					potentialUrl = ~/^(https?:)\/([^\/])/i.replace(potentialUrl, "$1//$2");

					if (!urls.contains(potentialUrl)) {
						urls.push(potentialUrl);
					}
				}
				potentialUrl = "";
				foundHttpStart = false;
			}
		}

		// Handle case where URL continues to end of content
		if (foundHttpStart && ~/^https?:/i.match(potentialUrl)) {
			if (isURLEncoded(potentialUrl)) {
				potentialUrl = urlDecode(potentialUrl);
			}

			potentialUrl = ~/^(https?:)\/([^\/])/i.replace(potentialUrl, "$1//$2");

			if (!urls.contains(potentialUrl)) {
				urls.push(potentialUrl);
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

	function multipleMessageCheck(uid:String) {
		var firstMsgTime = messagesTracked[uid][0].createdTimestamp;
		var lastMsgTime = messageLastSent[uid];
		var totalMsgs = messagesTracked[uid].length;
		var timeDiff = lastMsgTime - firstMsgTime;
		var avgTimePerMsg = timeDiff / (totalMsgs - 1);

		var channels = [];
		for (msg in messagesTracked[uid]) {
			if (channels.contains(msg.channel.asType0.id)) {
				continue;
			}
			channels.push(msg.channel.asType0.id);
		}

		if (channels.length <= 2) {
			return false;
		}

		var data = 'AvgTimePerMsg=$avgTimePerMsg totalMsgs=$totalMsgs timeDiff=$timeDiff channels=${channels.length}';
		var embed = new MessageEmbed();

		embed.addFields(new Field('AvgTimePerMsg', '$avgTimePerMsg'), new Field('totalMsgs', '$totalMsgs'), new Field('timeDiff', '$timeDiff'),
			new Field('channels', '${channels.length}'));
		logStats(uid, embed);
		return true;
	}

	override function update(_:Float) {
		super.update(_);
		iterate(messages, entity -> {
			if (forward != scam_prevention) {
				continue;
			}
			var id = message.author.id;

			if (oneChanceChecks(message)) {
				// reviewMessage([message]);
			}

			// if (this.singleMessageCheck(message)) {
			// 	hold_list.set(message.id, message);
			// }

			if (withinTime(message.createdTimestamp, last_message_interval)) {
				this.updateTime(id);
				this.addMessage(id, message);
			}

			if (!messageCount.exists(id)) {
				messageCount[id] = 0;
				messageLastSent[id] = 0;
				messagesTracked[id] = [];
			}

			messageCount[id] = messageCount[id]++;
			messageLastSent[id] = message.createdTimestamp;
			messagesTracked[id].push(message);

			this.universe.deleteEntity(entity);
		});

		this.getPhishingLinks();

		for (id => time in messageLastSent) {
			var now = Date.now().getTime();
			if (now - time <= 30000) {
				continue;
			}

			if (multipleMessageCheck(id)) {
				this.reviewMessage(messagesTracked[id], false);
				this.resetChecks(id);
			}

			messageCount.remove(id);
			messageLastSent.remove(id);
			messagesTracked.remove(id);
		}

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

	function reviewMessage(messages:Array<Message>, logMessage = true) {
		var message = messages[0];
		var embed = this.reformatMessage('SPAM ALERT - Timed out', message);

		this.timeoutUser(message, logMessage, function(_) {
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

	function timeoutUser(message:Message, logMessage = true, ?callback:(_:Dynamic) -> Void) {
		message.guild.members.fetch(message.author.id).then(function(guild_member) {
			if (logMessage) {
				this.logMessage(message.author.id, this.reformatMessage('Original Message', message, false), TIMEOUT);
			}
			guild_member.timeout(1000 * 60 * 60 * 12, 'Stop spamming, a mod will review this at their convenience.').then(callback, function(err) {
				trace(err);
				trace('AuthorId=${message.author.id} User=${message.author.displayName}');
				trace(message.content);
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

	function logMessages(messages:Array<Message>, action:UserActions) {
		var embeds = [];
		var embed = new MessageEmbed();
		var uid = messages[0].author.id;
		for (key => msg in messages) {
			var sent = Date.fromTime(msg.createdTimestamp);
			var str = DateTools.format(sent, "%d/%m/%Y %T");
			embed.description = '${key + 1}) ${msg.content}\n**$str**';
		}

		Main.client.channels.fetch(logChannelId).then(function(channel:TextChannel) {
			channel.send({content: '<@$uid>', embeds: [embed]});
		}, function(err) {
			trace(err);
			Browser.console.dir(err);
		});
	}



	function logStats(uid:String, embed:MessageEmbed) {
		var messages = messagesTracked[uid];
		var fields = [];
		embed.title = "Bot Intervention";
		for (key => msg in messages) {
			var sent = Date.fromTime(msg.createdTimestamp);
			var str = DateTools.format(sent, "%d/%m/%Y %T");
			fields.push(new Field('Message ${key + 1}', msg.content + '\n**$str**\n'));
		}
		embed.addFields(...fields);

		Main.client.channels.fetch(logChannelId).then(function(channel:TextChannel) {
			channel.send({content: '<@$uid>', embeds: [embed]});
		}, function(err) {
			trace(err);
			Browser.console.dir(err);
		});
	}

	function logMessage(uid:String, embed:MessageEmbed, action:UserActions) {
		embed.description += '\n\n Action: **__${action}__**';

		Main.client.channels.fetch(logChannelId).then(function(channel:TextChannel) {
			channel.send({content: '<@$uid>', embeds: [embed]});
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
				trace(keyword);
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
