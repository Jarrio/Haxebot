package commands.mod;

import discord_js.MessageEmbed;
import discord_js.User;
import externs.FuzzySort;
import js.Browser;
import components.Command;
import discord_builder.BaseCommandInteraction;
import systems.CommandDbBase;
import Main.CommandForward;
import discord_js.Message;
import discord_js.TextChannel;

class Tracker extends CommandDbBase {
	var trackers:Array<TTracker> = [];
	var dm:Map<String, User> = [];

	@:fastFamily var messages:{command:CommandForward, message:Message};

	override function onEnabled() {
		Firestore.onSnapshot(collection(this.db, 'discord/admin/trackers'), function(resp) {
			for (item in resp.docs) {
				var data = item.data();
				trackers.push(data);
				if (!dm.exists(data.by)) {
					Main.client.users.fetch(data.by).then(function(user) {
						this.dm.set(data.by, user);
					}, (err) -> trace(err));
				}
			}
		});
	}

	function string_compare(value:String, array:Array<String>) {
		for (a in array) {
			if (a == value) {
				return true;
			}
		}
		return false;
	}

	function excludeKeywords(message:Message, tracker:TTracker) {
		var content = message.content;
		if (tracker.string_exclude == null) {
			return false;
		}

		for (word in tracker.string_exclude) {
			if (content.contains(word)) {
				return true;
			}
		}
		return false;
	}

	function findKeywords(message:Message, tracker:TTracker) {
		var content = message.content;
		for (word in tracker.keywords) {
			if (content.contains(word)) {
				return true;
			}
		}
		return false;
	}

	override function update(_:Float) {
		super.update(_);
		iterate(messages, (entity) -> {
			switch (command) {
				case keyword_tracker:
					for (tracker in trackers) {
						if (message.author.id == tracker.by) {
							continue;
						}

						var content = message.content;

						if (tracker.user_exclude != null
							&& string_compare(message.author.id, tracker.user_exclude)) {
							continue;
						}

						if (tracker.channel_exclude != null
							&& string_compare((message.channel : TextChannel).id,
								tracker.channel_exclude)) {
							continue;
						}

						// will improve another time
						if (excludeKeywords(message, tracker)) {
							continue;
						}

						// will improve another time
						if (findKeywords(message, tracker)) {
							if (this.dm.exists(tracker.by)) {
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
								this.dm[tracker.by].send({embeds: [embed]})
								.then(null, (err) -> trace(err));
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
			case TrackerCreate(name, keywords, description, string_exclude, channel_exclude,
				user_exclude):
				var keywords = keywords.split(',');

				var str_exclude = [];
				if (string_exclude != null) {
					str_exclude = string_exclude.split(',');
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

				this.parseTracker(interaction, name, description, keywords, str_exclude,
					chl_exclude, usr_exclude);
			case TrackerDelete(name):
				var col = collection(db, 'discord/admin/trackers');
				if (name != null) {
					var query = Firestore.query(col, where('name', GREATER_EQUALS, name),
						where('name', LESS_EQUALS, name + '~'),
						where('by', EQUAL_TO, interaction.user.id));

					if (interaction.isAutocomplete()) {
						Firestore.getDocs(query).then(function(res) {
							var results = [];
							for (d in res.docs) {
								var data = d.data();
								var name = data.name;
								if (data.description != null) {
									name += ' - ' + data.description;
								}
								results.push({
									name: name,
									value: d.id
								});
							}

							interaction.respond(results).then(null, function(err) {
								trace(err);
								Browser.console.dir(err);
							});
						}).then(null, function(err) {
							trace(err);
							Browser.console.dir(err);
						});
						return;
					}

					Firestore.deleteDoc(doc(db, 'discord/admin/trackers/$name')).then(function(_) {
						interaction.reply({content: 'Tracker deleted!', ephemeral: true}).then(null, (err) -> trace(err));
					}, function(err) {
						trace(err);
						Browser.console.dir(err);
					});
					trace(name);
				}
			default:
		}
	}

	function parseTracker(interaction:BaseCommandInteraction, name:String, description:String,
			keywords:Array<String>, string_exclude:Array<String>, channel_exclude:Array<String>,
			user_exclude:Array<String>) {
		var obj:TTracker = {
			name: name,
			by: interaction.user.id,
			discord_name: interaction.user.username,
			keywords: keywords,
			timestamp: Date.now().getTime()
		}

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

		Firestore.addDoc(collection(this.db, 'discord/admin/trackers'), obj).then(function(_) {
			interaction.reply({content: 'Your tracker is now active!', ephemeral: true})
				.then(null, (err) -> trace(err));
		}, (err) -> trace(err));
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

typedef TTracker = {
	var by:String;
	var name:String;
	var discord_name:String;
	var timestamp:Float;
	var keywords:Array<String>;
	@:optional var description:String;
	@:optional var string_exclude:Array<String>;
	@:optional var channel_exclude:Array<String>;
	@:optional var user_exclude:Array<String>;
}
