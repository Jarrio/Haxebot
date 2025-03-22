package commands.mod;

import database.DBEvents;
import discord_js.MessageEmbed;
import discord_js.User;
import js.Browser;
import components.Command;
import discord_builder.BaseCommandInteraction;
import systems.CommandBase;
import Main.CommandForward;
import discord_js.Message;
import discord_js.TextChannel;
import database.types.DBTracker;
import Query.query;

class Tracker extends CommandBase {
	var trackers:Map<Int, DBTracker> = [];
	var dm:Map<String, User> = [];
	@:fastFamily var messages:{command:CommandForward, message:Message};
	var init_trackers:Bool = false;

	override function onEnabled() {
		var e = DBEvents.GetAllRecords('trackers', (resp) -> {
			switch (resp) {
				case Records(data):
					for (record in data) {
						var tracker = DBTracker.fromRecord(record);
						#if block
						if (tracker.by != '151104106973495296') {
							// only load me if in debug mode
							continue;
						}
						#end
						trackers.set(tracker.id, tracker);
						if (!dm.exists(tracker.by)) {
							Main.client.users.fetch(tracker.by).then(function(user) {
								trace('added user ${user.tag}');
								this.dm.set(tracker.by, user);
							}, (err) -> trace(err));
						}
					}
					init_trackers = true;
				default:
					trace(resp);
			}
		});
		universe.setComponents(universe.createEntity(), e);
	}

	function string_compare(value:String, array:Array<String>) {
		for (a in array) {
			if (a == value) {
				return true;
			}
		}
		return false;
	}

	function excludeKeywords(message:Message, tracker:DBTracker) {
		var content = message.content;
		if (tracker.string_exclude == null) {
			return false;
		}

		for (word in tracker.string_exclude) {
			if (content.toLowerCase().contains(word)) {
				return true;
			}
		}
		return false;
	}

	function findKeywords(message:Message, tracker:DBTracker) {
		var content = message.content;
		for (word in tracker.keywords) {
			var before = content.indexOf(word) - 1;
			var regex = new EReg('\\b$word\\b', 'gmi');

			return regex.match(content);
		}
		return false;
	}

	function keywordParser(content:String, matcher:Array<String>) {}

	override function update(_:Float) {
		super.update(_);
		iterate(messages, (entity) -> {
			switch (command) {
				case keyword_tracker:
					for (tracker in trackers) {
						if (message.author.id == tracker.by) {
							#if !block
							continue;
							#end
						}

						var content = message.content;

						if (tracker.user_exclude != null && string_compare(message.author.id, tracker.user_exclude)) {
							continue;
						}

						if (tracker.channel_exclude != null
							&& string_compare((message.channel : TextChannel).id, tracker.channel_exclude)) {
							continue;
						}

						// will improve another time
						if (excludeKeywords(message, tracker)) {
							continue;
						}

						// will improve another time
						if (findKeywords(message, tracker)) {
							if (this.dm.exists(tracker.by) #if block && tracker.by == "151104106973495296" #end) {
								var embed = new MessageEmbed();
								embed.setTitle('${tracker.name}');
								var description = message.content;
								var channel = (message.channel : TextChannel).name;
								description += '\n ----- \n [Location: $channel](${message.url})';
								embed.setDescription(description);
								embed.setFooter({
									text: 'Keyword Tracker',
									iconURL: 'https://cdn.discordapp.com/emojis/567741748172816404.png?v=1'
								});
								var author = {
									name: '@' + message.author.tag,
									iconURL: message.author.displayAvatarURL()
								}
								embed.setAuthor(author);
								this.dm[tracker.by].send({embeds: [embed]}).then(null, (err) -> trace(err));
								continue;
							}
						}
					}
					universe.deleteEntity(entity);
				default:
			}
		});
	}

	function run(command:Command, interaction:BaseCommandInteraction) {
		switch (command.content) {
			case TrackerCreate(name, keywords, description, string_exclude, channel_exclude, user_exclude):
				var keywords = keywords.split(',');
				for (key => value in keywords) {
					keywords[key] = value.toLowerCase().trim();
				}

				var str_exclude = [];
				if (string_exclude != null) {
					str_exclude = string_exclude.split(',');
					for (key => value in str_exclude) {
						str_exclude[key] = value.toLowerCase();
					}
				}

				var chl_exclude = [];
				if (channel_exclude != null) {
					chl_exclude = channel_exclude.split(',');
				}

				var usr_exclude = [];
				if (user_exclude != null) {
					usr_exclude = user_exclude.split(',');
				}

				for (key => str in str_exclude) {
					str_exclude[key] = str.trim();
				}

				for (key => user in usr_exclude) {
					usr_exclude[key] = cleanDiscordThings(user).trim();
				}

				for (key => channel in chl_exclude) {
					chl_exclude[key] = cleanDiscordThings(channel).trim();
				}

				this.parseTracker(interaction, name, description, keywords, str_exclude, chl_exclude, usr_exclude);
			case TrackerList(name):
				if (name != null) {
					if (interaction.isAutocomplete()) {
						var e = DBEvents.SearchBy('trackers', 'name', name, 'by', interaction.user.id, (resp) -> {
							switch (resp) {
								case Records(data):
									var results = [];
									for (record in data) {
										var tracker = DBTracker.fromRecord(record);
										var name = tracker.name;
										if (tracker.description != null) {
											name += ' - ' + tracker.description;
										}
										results.push({
											name: name,
											value: tracker.id.string()
										});
									}

									interaction.respond(results).then(null, function(err) {
										trace(err);
										Browser.console.dir(err);
									});
								default:
									trace(resp);
							}
						});

						EcsTools.set(e);
						return;
					}
					var e = DBEvents.GetRecord('trackers', query($by == interaction.user.id && $id == name), (resp) -> {
						switch(resp) {
							case Record(data):
								var tracker = DBTracker.fromRecord(data);
								var embed = new MessageEmbed();
								embed.setTitle(tracker.name);
								embed.setDescription(tracker.description ?? "No description");
								embed.addFields(
									new Field('keywords', tracker.keywords.toString()),
									new Field('string exclusions', tracker.string_exclude?.toString() ?? "[]"),
									new Field('user exclusions', tracker.user_exclude?.toString() ?? '[]'),
									new Field('channel exclusions', tracker.channel_exclude?.toString() ?? '[]')
								);
								embed.setTimestamp(tracker.timestamp);
								interaction.reply({embeds: [embed], ephemeral: true}).then(null, (err) -> trace(err));
							default:
								trace(resp);
						}
					});
					EcsTools.set(e);
					return;
				}
				var e = DBEvents.GetRecords('trackers', query($by == interaction.user.id), (resp) -> {
					switch (resp) {
						case Records(data):
							if (data.length == 0) {
								interaction.reply({content: "No trackers found", ephemeral: true}).then(null, (err) -> trace(err));
								return;
							}
							var embed = new MessageEmbed();
							embed.setTitle('Trackers');
							for (record in data) {
								var t = DBTracker.fromRecord(record);
								embed.addFields(new Field(t.name, t.keywords.toString(), false));
							}
							interaction.reply({embeds: [embed], ephemeral: true}).then(null, (err) -> trace(err));
						default:
							trace(resp);
					}
				});
				EcsTools.set(e);
			case TrackerDelete(name):
				if (name != null) {
					if (interaction.isAutocomplete()) {
						var e = DBEvents.SearchBy('trackers', 'name', name, 'by', interaction.user.id, (resp) -> {
							switch (resp) {
								case Records(data):
									var results = [];
									for (record in data) {
										var tracker = DBTracker.fromRecord(record);
										var name = tracker.name;
										if (tracker.description != null) {
											name += ' - ' + tracker.description;
										}
										results.push({
											name: name,
											value: tracker.id.string()
										});
									}

									interaction.respond(results).then(null, function(err) {
										trace(err);
										Browser.console.dir(err);
									});
								default:
									trace(resp);
							}
						});

						EcsTools.set(e);
						return;
					}
					var id = Std.parseInt(name);
					var e = DBEvents.DeleteByValue('trackers', 'id', id, (resp) -> {
						switch (resp) {
							case Success(message, data):
								trackers.remove(id);
								interaction.reply({content: 'Tracker deleted!', ephemeral: true}).then(null, (err) -> trace(err));
							default:
								trace(resp);
						}
					});
					EcsTools.set(e);
				}
			default:
		}
	}

	function parseTracker(interaction:BaseCommandInteraction, name:String, description:String, keywords:Array<String>, string_exclude:Array<String>,
			channel_exclude:Array<String>, user_exclude:Array<String>) {
		var obj = new DBTracker();
		obj.name = name;
		obj.by = interaction.user.id;
		obj.username = interaction.user.username;
		obj.keywords = keywords;

		if (description != null) {
			obj.description = description;
		}

		if (string_exclude.length > 0) {
			obj.string_exclude = string_exclude;
		}

		if (channel_exclude.length > 0) {
			obj.channel_exclude = channel_exclude;
		}

		if (channel_exclude.length > 0) {
			obj.channel_exclude = channel_exclude;
		}

		var e = DBEvents.Insert('trackers', obj, (resp) -> {
			switch (resp) {
				case Success(_, data):
					var d = DBTracker.fromRecord(data);
					trackers.set(d.id, d);
					if (!dm.exists(interaction.user.id)) {
						dm.set(interaction.user.id, interaction.user);
					}
					interaction.reply({content: 'Your tracker is now active!', ephemeral: true}).then(null, (err) -> trace(err));
				default:
					trace(resp);
			}
		});
		EcsTools.set(e);
	}

	inline function cleanDiscordThings(string:String) {
		string = string.replace('<', '');
		string = string.replace('>', '');
		string = string.replace('#', '');
		string = string.replace('@', '');
		string = string.replace('&', '');
		trace(string);
		return string;
	}

	function get_name():String {
		return 'tracker';
	}
}
