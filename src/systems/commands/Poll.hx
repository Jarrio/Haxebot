package systems.commands;

import haxe.Json;
import firebase.web.firestore.Timestamp;
import discord_js.Collection;
import discord_js.User;
import discord_js.MessageReaction;
import discord_js.MessageEmbed;
import Main.CommandForward;
import discord_js.Message;
import components.Command;
import discord_builder.BaseCommandInteraction;


class Poll extends CommandDbBase {
	@:fastFamily var dm_messages:{type:CommandForward, message:Message};
	var checked = false;

	override function update(_:Float) {
		super.update(_);
		if (!checked && Main.connected) {
			checked = true;
			Main.client.channels.fetch('286485321925918721').then(function(res) {
				res.messages.fetch('1022567873786413096').then(function(res) {

				}, err);
			}, err);
		}
	}

	function run(command:Command, interaction:BaseCommandInteraction) {
		switch (command.content) {
			case Poll(question, length, a, b, c, d, e, f, g, v):
				var time = PollTime.fromString(length);
				trace(time);

				if (a == null && b == null) {
					interaction.reply("You must have at least 2 answers");
					return;
				}

				var body = '';
				var collection = [a, b, c, d, e, f, g];
				var answers = new Map();
				var results = new Map();
				var votes = 1;

				if (v != null) {
					votes = v;
					if (votes > 7) {
						votes = 7;
					}
				}

				for (i => ans in collection) {
					if (ans == null) {
						continue;
					}

					var char = chars(i);
					
					results.set(char, 0);
					answers.set(char, ans);
					
					body += '$char - $ans\n';
				}

				var embed = new MessageEmbed();
				
				embed.setDescription('**Question**\n$question\n\n**Options**\n$body\n**Settings**\n**${v}** vote per user.');
				embed.setFooter({text: 'Poll will run for ${length}.'});

				var settings = new Map();
				settings.set(PollSetting.votes, votes);

				interaction.reply({embeds: [embed]}).then((_) -> {
					interaction.fetchReply().then(function(message) {
						for (k => _ in answers) {
							message.react(k);
						}

						var data:TPollData = {
							id: -1,
							active: true,
							results: Json.stringify(results),
							answers: answers.stringify(),
							question: question,
							duration: time,
							settings: settings.stringify(),
							timestamp: Timestamp.now(),
							author: interaction.user.id,
							message_id: message.id
						}

						Firestore.runTransaction(this.db, function(transaction) {
							return transaction.get(doc(this.db, 'discord/polls')).then(function(doc) {
								if (!doc.exists()) {
									return {id: -1};
								}
								var data:{id:Int} = (doc.data());
								data.id = data.id + 1;
								transaction.update(doc.ref, data);
								return data;
							});
						}).then(function(value) {
							data.id = value.id;
							Firestore.addDoc(Firestore.collection(this.db, 'discord/polls/entries'), data).then(function(_) {
								this.addCollector(message, data);
							}, err);
						}, err);
					}).then(null, err);
				}, err);
			default:
		}
	}

	function addCollector(message:Message, data:PollData) {

		
		var filter = this.filter(message, data);
		var collector = message.createReactionCollector({filter: filter, time: data.duration});

		collector.on('collect', (reaction:MessageReaction, user:User) -> {
			
		});

		collector.on('end', (collected:Collection<String, MessageReaction>, reason:String) -> {
			var check = 0.;
			var cross = 0.;

			if (collected.has('✅')) {
				check = collected.get('✅').count - 1;
			}

			if (collected.has('❎')) {
				cross = collected.get('❎').count - 1;
			}

			var embed = new MessageEmbed();
			var description = '${data.question}\n\n';
			description += '✅ Yes: ' + check.string() + '\n';
			description += '❎ No: ' + cross.string();

			embed.setDescription(description);

			var date = DateTools.format(Date.fromTime(message.createdTimestamp), '%d-%m-%Y %H:%M:%S');
			embed.setFooter({text: 'Poll results | Started $date'});
			message.reply({content: '<@${data.author}>', embeds: [embed]});
		});
	}

	function validEmojis() {
		
	}

	function get_name():String {
		return 'poll';
	}

	inline function filter(message:Message, data:PollData){
		var vvotes = data.settings.get(PollSetting.votes);
		var filter = (reaction:MessageReaction, user:User) -> {
			var votes = 0;
			for (reac in message.reactions.cache) {
				for (u in reac.users.cache) {
					if (u.id == user.id && !u.bot) {
						votes++;
					}
				}
			}

			if (votes > vvotes) {
				if (!user.bot) {
					reaction.users.remove(user);
				}
			}

			if (reaction.emoji.name == "🇦") {
				return true;
			}

			if (reaction.emoji.name == "🇧") {
				return true;
			}

			if (reaction.emoji.name == "🇨") {
				return true;
			}

			if (reaction.emoji.name == "🇩") {
				return true;
			}

			if (reaction.emoji.name == "🇪") {
				return true;
			}

			if (reaction.emoji.name == "🇫") {
				return true;
			}

			if (reaction.emoji.name == "🇬") {
				return true;
			}

			return false;
		}
		return filter;
	}

	function chars(char:Int) {
		return switch (char) {
			case 0: '🇦';
			case 1: '🇧';
			case 2: '🇨';
			case 3: '🇩';
			case 4: '🇪';
			case 5: '🇫';
			case 6: '🇬';
			default: '';
		}
	}
}

typedef TPoll = {
	var question:String;
	var type:PollTypes;
	var counter:Map<String, Int>;
}

enum abstract PollTypes(String) {
	var bool;
	var bool_maybe;
	var multiple_choice;
}

typedef TPollData = {
	var id:Int;
	var active:Bool;
	var message_id:String;
	var author:String;
	var question:String;
	var duration:Float;
	var timestamp:Timestamp;
	var settings:String;
	var answers:String;
	var results:String;
}

@:forward
abstract PollData(TPollData) from TPollData {
	public var answers(get, never):Map<String, Int>;
	function get_answers() {
		return Json.parse(this.answers);
	}

	public var results(get, never):Map<String, Int>;
	function get_results() {
		return Json.parse(this.results);
	}

	public var settings(get, never):Map<PollSetting, Int>;
	function get_settings() {
		return Json.parse(this.settings);
	}
}

enum abstract PollSetting(Int) to Int {
	var votes;
}

enum abstract PollTime(Float) to Float {
	var fifteen = 900000;
	var thirty = 1800000;
	var one_hour = 3600000;
	var four_hours = 14400000;
	var eight_hours = 28800000;
	var twelve_hours = 43200000;
	var one_day = 86400000;
	var three_days = 259200000;
	var five_days = 432000000;
	var one_week = 604800000;
	var two_weeks = 1210000000;

	function new(value) {
		this = value;
	}

	@:from public static function fromString(input:String) {
		return switch (input) {
			case "15m": PollTime.fifteen;
			case "30m": PollTime.thirty;
			case "1hr": PollTime.one_hour;
			case "4hr": PollTime.four_hours;
			case "8hr": PollTime.eight_hours;
			case "12hr": PollTime.twelve_hours;
			case "1d": PollTime.one_day;
			case "3d": PollTime.three_days;
			case "5d": PollTime.five_days;
			case "1w": PollTime.one_week;
			case "2w": PollTime.two_weeks;
			default: PollTime.one_hour;
		}
	}
}
