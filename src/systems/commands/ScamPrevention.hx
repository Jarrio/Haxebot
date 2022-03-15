package systems.commands;

import discord_js.MessageEmbed;
import discord_js.TextChannel;
import sys.io.File;
import haxe.Json;
import haxe.Http;
import discord_js.User;
import discord_js.Message;
import Main.CommandForward;
import discord_builder.BaseCommandInteraction;
import components.Command;

class ScamPrevention extends CommandBase {
	@:fastFamily var messages:{forward:CommandForward, message:Message};
	var time_since:Map<String, Float> = new Map();
	var sequential_tags:Map<String, Int> = new Map();
	var user_list:Map<String, User> = new Map();
	var trigger_messages:Map<String, Array<Message>> = new Map();

	var phishing_urls:Array<String> = [];
	var phishing_update_time:Float;

	var timestamp(get, never):Float;
	final last_message_interval = 10000;

	override function update(_:Float) {
		super.update(_);
		iterate(messages, _ -> {
			if (forward != scam_prevention) {
				continue;
			}

			if (withinTime(message.createdTimestamp, last_message_interval)) {
				this.updateTime(message.author.id);
				this.addMessage(message.author.id, message);
			}

			messages.remove(_);
		});

		this.getPhishingLinks();

		for (messages in this.trigger_messages) {
			if (this.checkPhishingLinks(messages)) {
				this.banUser(messages[0]);
				continue;
			}

			if (messages.length < 3) {
				continue;
			}

			var review = false;
			if (this.checkTags(messages)) {
				review = true;
			}

			if (this.checkEquality(messages)) {
				review = true;
			}

			if (!review) {
				continue;
			}

			this.reviewMessage(messages);
			this.resetChecks(messages[0].author.id);
		}

		for (id => value in this.time_since) {
			if (this.timestamp - value > this.last_message_interval) {
				this.resetChecks(id);
			}
		}
	}

	function reviewMessage(messages:Array<Message>) {
		var message = messages[0];
		var embed = this.reformatMessage(null, message);
		if (embed == null || embed.description.length == 0) {
			return;
		}

		this.timeoutUser(message, function(_) {
			message.reply({content: '<@&198916468312637440> Please review this message by: <@${message.author.id}>', embeds: [embed]}).then(function(_) {
				for (message in messages) {
					message.delete().then(null, err);
				}
			}, err);
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
			} catch (e) {
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
			guild_member.timeout(1000 * 60 * 60 * 12, 'You are spamming something that doesn\t need to be spammed. Wait for review.').then(callback, err);
			this.resetChecks(message.author.id);
		}, err);
	}

	function banUser(message:Message, ?callback:(_:Dynamic) -> Void) {
		message.guild.members.fetch(message.author.id).then(function(guild_member) {
			this.logMessage(message.author.id, this.reformatMessage('Original Message', message, false), BAN);
			guild_member.ban({
				days: 1,
				reason: "found phishing links, auto banned."
			});
			this.resetChecks(message.author.id);
			message.channel.asType0.send('User <@${message.author.id}> has been auto banned for sending scam links.').then(callback, err);
		}, err);
	}

	function logMessage(id:String, embed:MessageEmbed, action:UserActions) {
		embed.description += '\n\n Action: **__${action}__**';

		Main.client.channels.fetch('952952631079362650').then(function(channel) {
			channel.send({content: '<@$id>', embeds: [embed]});
		}, err);
	}

	function checkPhishingLinks(messages:Array<Message>) {
		for (message in messages) {
			for (link in this.phishing_urls) {
				if (message.content.contains(link)) {
					return true;
				}
			}
		}
		return false;
	}

	function checkTags(messages:Array<Message>) {
		var tag_count = 0;

		for (message in messages) {
			if (message.content.startsWith('@everyone') || message.content.startsWith('@here')) {
				if (tag_count >= 3) {
					break;
				}
				tag_count++;
			}
		}

		if (tag_count >= 3) {
			return true;
		}

		return false;
	}

	function checkEquality(messages:Array<Message>) {
		var equality_count = 0;
		var channel_count = 0;

		var compare = messages[0];
		for (message in messages) {
			var content = message.content;
			if (compare.content == content) {
				equality_count++;
			}
			if (compare.channel.asType0.id != message.channel.asType0.id) {
				channel_count++;
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
