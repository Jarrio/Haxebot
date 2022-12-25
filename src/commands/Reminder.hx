package commands;

import discord_js.MessageEmbed;
import discord_js.TextChannel;
import firebase.web.firestore.DocumentReference;
import components.Command;
import discord_builder.BaseCommandInteraction;
import systems.CommandDbBase;

class Reminder extends CommandDbBase {
	var channel:TextChannel;
	var checking = false;
	var reminders:Array<TReminder> = [];
	var sent:Array<TReminder> = [];
	final bot_channel = #if block '597067735771381771' #else '663246792426782730' #end;

	override function onEnabled() {
		// var doc:DocumentReference<TReminder> = Firestore.doc(this.db, 'discord/reminders/entries');
		// var query:Query<TReminder> = Firestore.query(collection(this.db, 'discord/reminders/entries'));

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
			case Reminder(content, when, personal):
				if (personal == null) {
					personal = false;
				}

				var obj:TReminder = {
					sent: false,
					id: "",
					message_id: "",
					duration: Duration.fromString(when),
					timestamp: Date.now().getTime(),
					author: interaction.user.id,
					content: content,
					personal: personal
				}

				obj.content = obj.content.replace('@everyone', '');
				obj.content = obj.content.replace('@here', '');
				obj.content = obj.content.replace('<@1056701703833006102>', '');
				obj.content = obj.content.replace('<@1056701811211374764>', '');

				var col = Firestore.collection(this.db, 'discord/reminders/entries');
				Firestore.addDoc(col, obj).then(function(doc) {
					var post_time = Math.round((obj.timestamp + obj.duration) / 1000);
					interaction.reply({
						ephemeral: personal,
						content: 'Your reminder has been set for <t:${post_time}>'
					}).then(function(msg) {
						obj.id = doc.id;
						Firestore.updateDoc(doc, obj);
					}, err);
				}, err);
			default:
		}
	}

	override function update(_) {
		super.update(_);
		if (!checking && this.channel == null) {
			checking = true;
			Main.client.channels.fetch(bot_channel).then(function(succ) {
				this.channel = succ;
				checking = false;
				trace('Found reminder channel');
			}, err);
		}

		if (this.channel == null) {
			return;
		}

		for (reminder in this.reminders) {
			if (reminder.sent) {
				continue;
			}
			var post_time = reminder.timestamp + reminder.duration;
			if (Date.now().getTime() < post_time) {
				continue;
			}

			reminder.sent = true;
			if (reminder.personal) {
				Main.client.users.fetch(reminder.author).then(function(user) {
					user.send('*Reminder - ${reminder.content}*').then(null, function(err) {
						trace(err);
						reminder.sent = false;
						reminder.duration += day;
						this.channel.send('<@${reminder.author}> I tried to DM you a reminder, but it failed. Do you accept messages from this server?');
					});
				});
			} else {
				this.channel.send({content: '*${reminder.author}> - ${reminder.content}*'}).then(null, function(err) {
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

	function get_name():String {
		return 'reminder';
	}
}

typedef TReminder = {
	var sent:Bool;
	var id:String;
	var message_id:String;
	var duration:Float;
	var timestamp:Float;
	var author:String;
	var content:String;
	var personal:Bool;
}

enum abstract Duration(Float) to Float {
	var minute = 60000;
	var hour = 3600000;
	var day = 86400000;
	var week = 604800000;
	var month = 2419200000;

	function new(value) {
		this = value;
	}

	@:from public static function fromString(input:String):Duration {
		var time = 0.;

		var min_regex = ~/([0-9]+)[ ]?(m|min|mins)\b/gi;
		if (min_regex.match(input)) {
			var num = min_regex.matched(1).parseFloat();
			time = num * 60000;
		}

		var hour_regex = ~/([0-9]+)[ ]?(h|hr|hrs|hours)\b/gi;
		if (hour_regex.match(input)) {
			var num = hour_regex.matched(1).parseFloat();
			time = num * 3600000;
		}

		var day_regex = ~/([0-9]+)[ ]?(d|day|days)\b/gi;
		if (day_regex.match(input)) {
			var num = day_regex.matched(1).parseFloat();
			time = num * 86400000;
		}

		var week_regex = ~/([0-9]+)[ ]?(w|wk|wks|week|weeks)\b/gi;
		if (week_regex.match(input)) {
			var num = week_regex.matched(1).parseFloat();
			time = num * 604800000;
		}

		var month_regex = ~/([0-9]+)[ ]?(mo|mths|month|months)\b/gi;
		if (month_regex.match(input)) {
			var num = month_regex.matched(1).parseFloat();
			time = num * 2419200000;
		}

		return new Duration(time);
	}
}
