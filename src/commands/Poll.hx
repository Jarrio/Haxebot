package commands;

import database.DBEvents;
import commands.types.Duration;
import discord_js.TextChannel;
import js.Browser;
import haxe.Json;
import discord_js.Collection;
import discord_js.User;
import discord_js.MessageReaction;
import discord_js.MessageEmbed;
import Main.CommandForward;
import discord_js.Message;
import components.Command;
import discord_builder.BaseCommandInteraction;
import systems.CommandBase;
import database.types.DBPoll;
import Query.query;

class Poll extends CommandBase {
	@:fastFamily var dm_messages:{type:CommandForward, message:Message};
	var checked = false;
	var polls:Map<Int, DBPoll> = [];

	override function onEnabled() {
		var e = DBEvents.GetAllRecords('polls', (resp) -> {
			switch (resp) {
				case Records(data):
					var now = Date.now().getTime();
					for (record in data) {
						var poll = DBPoll.fromRecord(record);
						if (!poll.is_active) {
							var four_weeks = poll.timestamp + (PollTime.two_weeks : Float) * 2;
							if (now - four_weeks < 0) {
								continue;
							}
							var e = DBEvents.DeleteRecord('polls', poll.record, (resp) -> {
								switch (resp) {
									case Success(_, _):
									default:
										trace(resp);
								}
							});
							universe.setComponents(universe.createEntity(), e);
							continue;
						}
						var start = poll.timestamp;
						var finish = start + poll.duration;
						var time_left = 0.;

						if (finish < now) {
							time_left = 30000;
						} else {
							time_left = finish - now;
						}

						Main.client.channels.fetch(poll.channel).then(function(succ:TextChannel) {
							succ.messages.fetch(poll.message_id).then(function(message) {
								trace('Resyncing ${poll.id}');
								this.addCollector(message, poll, time_left);
							}, function(err) {
								trace(err);
								Browser.console.dir(err);
							});
						}, function(err) {
							trace(err);
							Browser.console.dir(err);
						});
						polls.set(poll.id, poll);
					}
				default:
					trace(resp);
			}
		});
		universe.setComponents(universe.createEntity(), e);
	}

	function run(command:Command, interaction:BaseCommandInteraction) {
		switch (command.content) {
			case Poll(question, length, a, b, c, d, e, f, g, h, i, j, k, v):
				var time = PollTime.fromString(length);

				if (a == null && b == null) {
					interaction.reply("You must have at least 2 answers");
					return;
				}

				var body = '';
				var collection = [a, b, c, d, e, f, g, h, i, j, k];
				var answers = new Map();
				var results = new Map();
				var votes = 1;
				var vtxt = 'vote';
				if (v == 0 || v > 1) {
					vtxt += 's';
				}

				if (v != null) {
					votes = v;
					if (votes > 11) {
						votes = 11;
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

				embed.setDescription('**Question**\n$question\n\n**Options**\n$body\n**Settings**\n**${votes}** $vtxt per user.');
				embed.setFooter({text: 'Poll will run for ${length}.'});

				var settings = new Map();
				settings.set(PollSetting.votes, votes);

				interaction.reply({embeds: [embed]}).then((_) -> {
					interaction.fetchReply().then(function(message) {
						for (k => _ in answers) {
							message.react(k);
						}
						var user = interaction.user.id;
						var channel = interaction.channel.id;
						var poll = new DBPoll(user, channel, message.id, question, time);
						poll.results = results;
						poll.answers = answers;

						var e = DBEvents.Insert('polls', poll, (resp) -> {
							switch (resp) {
								case Success(_, _):
									this.addCollector(message, poll);
								default:
									trace(resp);
							}
						});

						EcsTools.set(e);
					}).then(null, function(err) {
						trace(err);
						Browser.console.dir(err);
					});
				}, function(err) {
					trace(err);
					Browser.console.dir(err);
				});
			default:
		}
	}

	function addCollector(message:Message, data:DBPoll, ?time_left:Float) {
		var filter = this.filter(message, data);
		var time:Float = data.duration;
		#if block
		trace('Poll duration changed due to debug block on');
		time = Duration.fromString('1m');
		#end
		if (time_left != null) {
			time = time_left;
		}

		var collector = message.createReactionCollector({filter: filter, time: time});

		collector.on('collect', (reaction:MessageReaction, user:User) -> {});

		collector.on('end', (collected:Collection<String, MessageReaction>, reason:String) -> {
			var embed = new MessageEmbed();
			var body = '**Question**\n${data.question}\n**Results**\n';

			var options = data.answers;

			var sort = message.reactions.cache.sort(function(a, b, _, _) {
				return b.count - a.count;
			});

			for (k => v in sort) {
				var col = sort.get(k);
				var ans = options.get(k);
				var count = 0;

				if (col != null) {
					count = v.count;
				}

				body += '$k / $ans /  **${count - 1}** \n';
			}

			body += '\n*Poll ran for ${data.duration}*';

			body += '\n*Posted: <t:${Math.round(message.createdTimestamp / 1000)}:R>*';
			embed.setDescription(body);

			message.reply({content: '<@${data.author}>', embeds: [embed]}).then(function(_) {
				data.active = 0;
				var e = DBEvents.Update('polls', data, query($id == data.id), (resp) -> {
					switch (resp) {
						case Success(_, _):
						default:
							trace(resp);
					}
				});
				EcsTools.set(e);
			});
		});
	}

	function get_name():String {
		return 'poll';
	}

	function filter(message:Message, data:DBPoll) {
		var reactions = data.answers;
		var rcount = 0;
		for (_ in reactions) {
			rcount++;
		}

		var vvotes = data.votes;
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

			if (reaction.emoji.name == "🇦" && rcount >= 1) {
				return true;
			}

			if (reaction.emoji.name == "🇧" && rcount >= 2) {
				return true;
			}

			if (reaction.emoji.name == "🇨" && rcount >= 3) {
				return true;
			}

			if (reaction.emoji.name == "🇩" && rcount >= 4) {
				return true;
			}

			if (reaction.emoji.name == "🇪" && rcount >= 5) {
				return true;
			}

			if (reaction.emoji.name == "🇫" && rcount >= 6) {
				return true;
			}

			if (reaction.emoji.name == "🇬" && rcount >= 7) {
				return true;
			}
			if (reaction.emoji.name == "🇭" && rcount >= 8) {
				return true;
			}
			if (reaction.emoji.name == "🇮" && rcount >= 9) {
				return true;
			}
			if (reaction.emoji.name == "🇯" && rcount >= 10) {
				return true;
			}
			if (reaction.emoji.name == "🇰" && rcount >= 11) {
				return true;
			}
			trace('removed ${reaction.message.author.tag} reaction on message ${reaction.message}');
			reaction.remove();
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
			case 7: '🇭';
			case 8: '🇮';
			case 9: '🇯';
			case 10: '🇰';
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

	@:keep
	@:to function toString() {
		return switch (this) {
			case fifteen: "15mins";
			case thirty: "30mins";
			case one_hour: "1 hour";
			case four_hours: "4 hours";
			case eight_hours: "8 hours";
			case twelve_hours: "12 hours";
			case one_day: "1 day";
			case three_days: "3 days";
			case five_days: "5 days";
			case one_week: "1 week";
			case two_weeks: "2 weeks";
			default: '1 hour';
		}
	}
}
