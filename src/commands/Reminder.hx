package commands;

import commands.types.Duration;
import discord_js.MessageEmbed;
import discord_js.TextChannel;
import firebase.web.firestore.DocumentReference;
import components.Command;
import discord_builder.BaseCommandInteraction;
import systems.CommandDbBase;

class Reminder extends CommandDbBase {
	var channels:Map<String, TextChannel> = [];
	var checking = false;
	var reminders:Array<TReminder> = [];
	var sent:Array<TReminder> = [];
	final bot_channel = #if block '597067735771381771' #else '663246792426782730' #end;
	final casual_chat = '';
	


	override function onEnabled() {
		Firestore.onSnapshot(collection(this.db, 'discord/reminders/entries'), function(resp) {
			var arr = [];
			for (item in resp.docs) {
				arr.push(item.data());
			}
			this.reminders = arr;
		});
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
						interaction.reply('You marked `thread_reply` to true. Please trigger this command from a thread.');
						return;
					}
				}
				var channel_id = null;
				var category = interaction.channel.parent.name;
				if (category.toLowerCase() == 'offtopic') {
					channel_id = interaction.channelId;
				}

				var obj:TReminder = {
					channel_id: channel_id,
					sent: false,
					thread_reply: thread_reply,
					thread_id: thread_id,
					id: "",
					duration: Duration.fromString(when),
					timestamp: Date.now().getTime(),
					author: interaction.user.id,
					content: content,
					personal: personal
				}

				var min = #if block "0min" #else "4mins" #end;
				var duration = Duration.fromString(min);

				if (obj.duration == 0.) {
					interaction.reply('Your time formatting was likely incorrect. Use units like __m__in(s), __h__ou__r__(s), __d__ay(s), __w__ee__k__(s) and __mo__nth(s)');
					return;
				}

				if (obj.duration <= duration) {
					interaction.reply('Please set a reminder that is at least 5mins');
					return;
				}

				if (obj.duration >= Duration.fromString('366days')) {
					interaction.reply('A reminder can\'t be set for longer than 366 days');
					return;
				}

				var col = Firestore.collection(this.db, 'discord/reminders/entries');
				Firestore.addDoc(col, obj).then(function(doc) {
					var post_time = Math.round((obj.timestamp + obj.duration) / 1000);
					interaction.reply({
						ephemeral: personal,
						content: 'Your reminder has been set for <t:${post_time}>'
					}).then(function(msg) {
						obj.id = doc.id;
						Firestore.updateDoc(doc, obj).then(null, function(err) {
							trace(err);
						});
					}, err);
				}, err);
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
			if (reminder.sent) {
				continue;
			}
			
			if (reminder.channel_id != null && !this.channels.exists(reminder.channel_id)) {
				this.getChannel(reminder.channel_id);
			}

			var post_time = reminder.timestamp + reminder.duration;
			if (Date.now().getTime() < post_time) {
				continue;
			}

			reminder.sent = true;
			var parse = {parse: ['users']};
			var embed = new MessageEmbed();
			embed.setTitle("Reminder");
			embed.setDescription(reminder.content);
			embed.setFooter({text: '<t:${Math.round(reminder.timestamp / 1000)}>'});
			var message = '> <@${reminder.author}> Your reminder was sent <t:${Math.round(reminder.timestamp / 1000)}:R>';
			var content = '$message\n${reminder.content}';

			if (reminder.thread_reply) {
				Main.client.channels.fetch(reminder.thread_id).then(function(channel) {
					channel.send({content: content, allowedMentions: parse}).then(null, function(err) {
						trace(err);
						reminder.sent = false;
						reminder.duration += Duration.fromString('3hrs');
						this.channel.send({
							content: '<@${reminder.author}> I failed to post a reminder to your thread. Might be an issue.',
							allowedMentions: parse
						});
					});
				});
			} else if (reminder.personal) {
				Main.client.users.fetch(reminder.author).then(function(user) {
					user.send(content).then(null, function(err) {
						trace(err);
						reminder.sent = false;
						reminder.duration += day;
						this.channel.send({
							content: '<@${reminder.author}> I tried to DM you a reminder, but it failed. Do you accept messages from this server?',
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
					reminder.sent = false;
					reminder.duration += hour;
				});
			}
		}

		for (msg in this.reminders) {
			if (!msg.sent) {
				continue;
			}
			var doc = Firestore.doc(this.db, 'discord/reminders/entries/${msg.id}');
			Firestore.deleteDoc(doc).then(null, err);
			this.sent.remove(msg);
		}
	}

	function getChannel(channel_id:String) {
		if (!this.checking && this.channels.get(channel_id) == null) {
			this.checking = true;
			Main.client.channels.fetch(channel_id).then(function(channel) {
				this.channels.set(channel.id, channel);
				this.checking = false;
				trace('Found ${channel.name} channel');
			}, err);
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
