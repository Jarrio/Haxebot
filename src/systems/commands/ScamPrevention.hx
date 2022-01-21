package systems.commands;

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

	override function update(_:Float) {
		super.update(_);
		iterate(messages, _ -> {
			if (forward != scam_prevention) {
				continue;
			}

			this.incrementSequential(message.author.id);
			this.updateTime(message.author.id);
			this.addMessage(message.author.id, message);

			messages.remove(_);
		});

		this.getPhishingLinks();
		this.checkHistory();

		for (id => value in this.time_since) {
			if (this.timestamp - value > 10000) {
				this.resetChecks(id);
			}
		}
	}

	inline function resetChecks(id:String) {
		this.time_since.remove(id);
		this.sequential_tags.remove(id);
		this.user_list.remove(id);
		this.trigger_messages.remove(id);
	}

	inline function getLastMessage(id:String) {
		var messages = this.trigger_messages.get(id);
		if (messages == null) {
			return null;
		}

		if (messages.length != 3) {
			return null;
		}

		return messages[messages.length - 1];
	}

	inline function getPhishingLinks() {
		if (Date.now().getTime() - this.phishing_update_time < 1000 * 60 * 60 * 6) {
			return;
		}
		phishing_update_time = Date.now().getTime();
		var links = new Http('https://raw.githubusercontent.com/Discord-AntiScam/scam-links/main/urls.json');
		links.onData = function(data) {
			phishing_urls = Json.parse(data);
		}
		links.request();
	}

	function checkHistory() {
		for (id => time in time_since) {
			var tag_count = sequential_tags.get(id);
			if (tag_count < 3) {
				continue;
			}

			if (Date.now().getTime() - time < 10000) {
				var message = this.getLastMessage(id);

				if (message == null) {
					continue;
				}

				message.guild.members.fetch(id).then(function(guild_member) {
					this.time_since.set(id, time - 15000);
					guild_member.timeout(1000 * 60 * 60 * 12, 'You are spamming something that doesn\t need to be spammed. Wait for review.')
						.then(function(_) {
							var messages = this.trigger_messages.get(id);
							if (messages != null) {
								for (item in messages) {
									if (message.content != item.content || message.id == item.id) {
										continue;
									}
									item.delete();
								}
							}
							trace('user: ' + guild_member.user.tag + ' has been timed out');
							var channel = (message.channel : TextChannel);
							channel.sendTyping().then(function(_) {
								for (link in this.phishing_urls) {
									if (message.content.contains(link)) {
										channel.sendTyping().then(function(_) {
											guild_member.ban({
												days: 1,
												reason: "found phishing links, auto banned."
											});
											channel.send('User <@$id> has been auto banned for phishing links.');
										}, null);
										return;
									}
								}

								message.reply('A <@&198916468312637440> will need to review this further').then(function(_) {
									this.resetChecks(id);
								});
							}, (err) -> trace(err));
						}, (err) -> trace(err));
				}, (err) -> trace(err));
			}
		}
	}

	inline function incrementSequential(user:String) {
		var count = 0;
		if (this.sequential_tags.exists(user)) {
			count = sequential_tags.get(user);
		}
		this.sequential_tags.set(user, count + 1);
	}

	inline function updateTime(user:String) {
		this.time_since.set(user, Date.now().getTime());
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
