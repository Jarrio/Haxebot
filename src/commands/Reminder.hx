package commands;

import db.Record;
import commands.types.Duration;
import discord_js.MessageEmbed;
import discord_js.TextChannel;
import components.Command;
import discord_builder.BaseCommandInteraction;
import systems.CommandBase;
import js.Browser;
import database.DBEvents;
import database.types.DBReminder;
import Query.query;
class Reminder extends CommandBase {
	var channels:Map<String, TextChannel> = [];
	var checking = false;
	var reminders:Array<DBReminder> = [];
	var sent:Map<Int, DBReminder> = [];

	final bot_channel = #if block '597067735771381771' #else '663246792426782730' #end;
	final casual_chat = '';

	override function onEnabled() {
		var e = DBEvents.GetAllRecords('reminders', (resp) -> {
			switch(resp) {
				case Records(data):
					for (item in data) {
						var r = DBReminder.fromRecord(item);
						#if block
						if (r.author_id != "151104106973495296") {
							continue;
						}
						#end
						reminders.push(r);
					}
					trace("Loaded reminders");
				default:
					trace(resp);
			}
		});
		universe.setComponents(universe.createEntity(), e);
	}

	function run(command:Command, interaction:BaseCommandInteraction) {
		switch (command.content) {
			case Reminder(content, when, personal, thread_reply):
				if (personal == null) {
					personal = false;
				}

				var thread_id = '';
				if (thread_reply) {
					if (interaction.channel.isThread()) {
						thread_id = interaction.channel.id;
					} else {
						interaction.reply({
							content: 'You marked `thread_reply` to true. Please trigger this command from a thread.',
							ephemeral: personal
						});
						return;
					}
				}
				var channel_id = null;
				var category = interaction.channel.parent.name;
				if (category.toLowerCase() == 'offtopic') {
					channel_id = interaction.channelId;
				}

				var is_thread = (interaction.channel.isThread()) ? 1 : 0;
				var reminder = new DBReminder(interaction.user.id, content, Duration.fromString(when), channel_id, is_thread);
				reminder.username = interaction.user.username;
				
				if (is_thread == 1 && thread_reply) {
					reminder.thread_reply = 1;
					reminder.channel_id = thread_id;
				}
				reminder.personal = (personal) ? 1 : 0;

				var min = #if block "0min" #else "4mins" #end;
				var duration = Duration.fromString(min);

				if (reminder.duration == 0.) {
					interaction.reply({
						content: 'Your time formatting was likely incorrect. Use units like __m__in(s), __h__ou__r__(s), __d__ay(s), __w__ee__k__(s) and __mo__nth(s)',
						ephemeral: personal
					});
					return;
				}

				if (reminder.duration <= duration) {
					interaction.reply({content: 'Please set a reminder that is at least 5mins', ephemeral: personal});
					return;
				}

				if (reminder.duration >= Duration.fromString('366days')) {
					interaction.reply({content: 'A reminder can\'t be set for longer than 366 days', ephemeral: personal});
					return;
				}

				var e = DBEvents.Insert('reminders', reminder, (resp) -> {
					switch(resp) {
						case Success(_, data):
							var record:Record = data;
							reminder.id = record.field('id');
							var post_time = Math.round((reminder.timestamp + reminder.duration) / 1000);
							this.reminders.push(reminder);
							interaction.reply({
								ephemeral: personal,
								content: 'Your reminder has been set for <t:${post_time}>'
							}).then(null, (err) -> trace(err));
						default:
							trace(resp);
							interaction.reply({content: "Something went wrong", ephemeral: personal});
					}
				});

				EcsTools.set(e);
			default:
		}
	}

	override function update(_) {
		super.update(_);

		this.getChannel(bot_channel);

		if (this.channels[bot_channel] == null) {
			return;
		}

		for (reminder in this.reminders) {
			if (reminder.sent == 1) {
				continue;
			}

			if (reminder.channel_id != null && !this.channels.exists(reminder.channel_id)) {
				this.getChannel(reminder.channel_id);
			}

			var post_time = reminder.timestamp + reminder.duration;
			if (Date.now().getTime() < post_time) {
				continue;
			}

			reminder.sent = 1;
			var e = DBEvents.Update('reminders', reminder, query($id == reminder.id), (resp) -> {
				switch(resp) {
					case Success(_, _):
					default:
						trace(resp);
				}
			});
			EcsTools.set(e);

			var parse = {parse: ['users']};
			var embed = new MessageEmbed();
			var author = reminder.author_id;

			embed.setTitle("Reminder");
			embed.setDescription(reminder.content);
			embed.setFooter({text: '<t:${Math.round(reminder.timestamp / 1000)}>'});
			var message = '> <@$author> Your reminder was sent <t:${Math.round(reminder.timestamp / 1000)}:R>';
			var content = '$message\n${reminder.content}';

			if (reminder.thread_reply == 1) {
				Main.client.channels.fetch(reminder.channel_id).then(function(channel:TextChannel) {
					channel.send({content: content, allowedMentions: parse})
						.then(null, function(err) {
							trace(err);
							reminder.sent = 0;
							reminder.duration += Duration.fromString('3hrs');
							this.channel.send({
								content: '<@$author> I failed to post a reminder to your thread. Might be an issue.',
								allowedMentions: parse
							});
						});
				});
			} else if (reminder.personal == 1) {
				Main.client.users.fetch(author).then(function(user) {
					user.send(content).then(null, function(err) {
						trace(err);
						reminder.sent = 0;
						reminder.duration += day;
						this.channel.send({
							content: '<@$author> I tried to DM you a reminder, but it failed. Do you accept messages from this server?',
							allowedMentions: parse
						});
					});
				});
			} else {
				var channel = this.channel;
				if (reminder.channel_id != null && this.channels.exists(reminder.channel_id)) {
					channel = this.channels.get(reminder.channel_id);
				}

				channel.send({content: content, allowedMentions: parse}).then(null, function(err) {
					trace(err);
					reminder.sent = 0;
					reminder.duration += hour;
				});
			}
		}

		for (msg in this.reminders) {
			if (msg.sent == 0 || sent.exists(msg.id)) {
				continue;
			}
			this.sent.set(msg.id, msg);
			var e = DBEvents.DeleteByValue('reminders', 'id', msg.id, (resp) -> {
				switch(resp) {
					case Success(_, _):
						trace("Deleted");
						this.reminders.remove(msg);
						this.sent.remove(msg.id);

					default:
						this.sent.remove(msg.id);
						trace(resp);
				}
			});
			EcsTools.set(e);
		}
	}

	function getChannel(channel_id:String) {
		if (!this.checking && this.channels.get(channel_id) == null) {
			this.checking = true;
			Main.client.channels.fetch(channel_id).then(function(channel:TextChannel) {
				this.channels.set(channel.id, channel);
				this.checking = false;
				trace('Found ${channel.name} channel');
			}, function(err) {
				trace(err);
				Browser.console.dir(err);
			});
		}
	}

	var channel(get, never):TextChannel;

	function get_channel() {
		return this.channels[bot_channel];
	}

	function get_name():String {
		return 'reminder';
	}
}

typedef TReminder = {
	var sent:Bool;
	var thread_reply:Bool;
	var id:String;
	var channel_id:String;
	var thread_id:String;
	var duration:Duration;
	var timestamp:Float;
	var author:String;
	var content:String;
	var personal:Bool;
}
