package commands;

import js.Browser;
import discord_builder.BaseCommandInteraction;
import components.Command;
import systems.CommandBase;
import database.DBEvents;
import database.types.DBEmoji;
import db.Record;
import discord_builder.ModalBuilder;
import discord_builder.APITextInputComponent;
import discord_builder.APIActionRowComponent;
import Main.CommandForward;

class Emoji extends CommandBase {
	@:fastFamily var modal:{forward:CommandForward, interaction:BaseCommandInteraction};
	var cache:Map<String, DBEmoji> = [];
	final max_name_length = 35;
	final super_mod_id:String = #if block '1114582456381747232' #else '198916468312637440' #end;

	override function update(_:Float) {
		super.update(_);
		iterate(modal, entity -> {
			switch (forward) {
				case emoji_edit:
					var emoji = this.cache.get(interaction.user.id);
					var url = interaction.fields.getTextInputValue('url');
					emoji.description = interaction.fields.getTextInputValue('description');

					var e = DBEvents.GetRecord('emojis', Query.query($url == url), function(resp) {
						switch (resp) {
							case Record(data):
								if (data != null && data.field('name') != emoji.name) {
									interaction.reply('An emoji already exists with that image **__${data.field('name')}__**')
										.then(null, function(err) {
											trace(err);
											Browser.console.dir(err);
										});
									return;
								}
								emoji.name = name.toLowerCase();
								var e = DBEvents.Update('emojis', emoji, Query.query($id == emoji.id && $author_id == emoji.author_id),
									function(resp) {
										switch (resp) {
											case Success(message, _):
												trace('$message');
												interaction.reply('Emoji updated!').then(null, (err) -> trace(err));
											default:
												trace(this.cache.get(interaction.user.id));
												interaction.reply('Something went wrong').then(null, (err) -> trace(err));
												trace(resp);
										}
										this.cache.remove(interaction.user.id);
									});
								EcsTools.set(e);
							default:
								trace(resp);
						}
					});

					EcsTools.set(e);
				default:
			}

			if (forward == emoji_edit) {
				this.universe.deleteEntity(entity);
			}
		});
	}

	function run(command:Command, interaction:BaseCommandInteraction) {
		switch (command.content) {
			case EmojiEdit(name):
				if (interaction.isAutocomplete()) {
					var e = DBEvents.SearchBy('emojis', 'name', name, 'author_id', interaction.user.id, function(resp) {
						switch (resp) {
							case Records(data):
								var arr = [];
								for (r in data) {
									var e = DBEmoji.fromRecord(r);
									arr.push({
										name: e.name,
										value: e.id.string()
									});
								}
								interaction.respond(arr);
							default:
								trace(resp);
								interaction.respond([]);
						}
					});
					EcsTools.set(e);
					return;
				}
				var e = DBEvents.GetRecord('emojis', Query.query($id == name && $author_id == interaction.user.id), function(resp) {
					switch (resp) {
						case Record(data):
							if (data == null) {
								interaction.reply('Could not find emoji or you were not the author of the emoji specified');
								return;
							}

							var emoji = DBEmoji.fromRecord(data);
							var modal = new ModalBuilder().setCustomId('emoji_edit').setTitle('Editting emoji #${emoji.id}');

							var url_input = new APITextInputComponent().setCustomId('url')
								.setLabel('url')
								.setStyle(Short)
								.setValue(emoji.url)
								.setMinLength(8);

							var desc_input = new APITextInputComponent().setCustomId('description')
								.setLabel('Description:')
								.setStyle(Paragraph)
								.setValue(emoji.description)
								.setMinLength(5)
								.setMaxLength(50);

							var action_b = new APIActionRowComponent().addComponents(url_input);
							var action_c = new APIActionRowComponent().addComponents(desc_input);

							modal.addComponents(action_b, action_c);

							this.cache.set(interaction.user.id, emoji);
							interaction.showModal(modal);
						default:
							trace(resp);
					}
				});
				EcsTools.set(e);
			case EmojiRemove(name):
				if (interaction.isAutocomplete()) {
					search(name, function(arr) {
						interaction.respond(arr).then(null, (err) -> trace(err));
					});
					return;
				}
				var role_status = hasRole(this.super_mod_id, interaction);
				var record = new Record();
				if (!role_status) {
					record.field('author_id', interaction.user.id);
				}
				record.field('id', name);

				var e = DBEvents.DeleteRecord('emojis', record, function(resp) {
					switch (resp) {
						case Success(message, data):
							interaction.reply('Emoji ${name} deleted!').then(null, (err) -> trace(err));
						case Error(message, data):
							trace(message);
							interaction.reply({ephemeral: true, content: "Cannot delete this emoji"}).then(null, function(err) {
								trace(err);
								Browser.console.dir(err);
							});
						default:
							trace(resp);
					}
				});
				EcsTools.set(e);
			case EmojiGet(name, size):
				if (interaction.isAutocomplete()) {
					search(name, function(arr) {
						interaction.respond(arr).then(null, (err) -> trace(err));
					});
					return;
				}


				var e = DBEvents.GetRecord('emojis', Query.query($name == name || $id == name), function(resp) {
					switch (resp) {
						case Record(data):
							if (data != null) {
								var emoji = DBEmoji.fromRecord(data);
								var url = formatLink(emoji.url, size);
								interaction.reply({content: url}).then(null, (err) -> trace(err));
								return;
							}
							trace(resp);
							trace(data);
							interaction.reply({content: "Something went wrong", ephemeral: true}).then(null, (err) -> trace(err));
						default:
							interaction.reply({content: "Something went wrong", ephemeral: true}).then(null, (err) -> trace(err));
							trace(resp);
					}
				});
				EcsTools.set(e);
			case EmojiCreate(name, url, description):
				if (interaction.isAutocomplete()) {
					search(name, function(arr) {
						interaction.respond(arr).then(null, (err) -> trace(err));
					});
					return;
				}
				var e = DBEvents.GetRecord('emojis', Query.query($url == url), function(resp) {
					switch (resp) {
						case Record(data):
							if (data != null) {
								var emoji = DBEmoji.fromRecord(data);
								interaction.reply({ephemeral: true, content: 'Emoji already exists with name __${emoji.name}__'})
									.then(null, (err) -> trace(err));
								return;
							}
							var regex = ~/((((https?:)(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/gm;
							if (!regex.match(url)) {
								interaction.reply({ephemeral: true, content: 'URL does not appear to be valid'}).then(null, (err) -> trace(err));
								return;
							}
							var e = DBEvents.GetRecords('emojis', Query.query($name == name || $id == name), function(resp) {
								switch (resp) {
									case Records(data):
										if (data.length > 0) {
											interaction.reply({ephemeral: true, content: "An emoji exists with this name already"})
												.then(null, (err) -> trace(err));
											return;
										}
										var aname = interaction.user.username;
										var aid = interaction.user.id;

										var emoji = new DBEmoji(aid, aname, name, url, description);
										var e = DBEvents.Insert('emojis', emoji, function(resp) {
											switch (resp) {
												case Success(message, data):
													interaction.reply({content: 'Emoji $name has been created'}).then(null, (err) -> trace(err));
												default:
													interaction.reply({content: "Something went wrong", ephemeral: true})
														.then(null, (err) -> trace(err));
													trace(resp);
											}
										});
										EcsTools.set(e);
									default:
										interaction.reply({content: "Something went wrong", ephemeral: true}).then(null, (err) -> trace(err));
										trace(resp);
								}
							});
							EcsTools.set(e);
						default:
							interaction.reply({content: "Something went wrong", ephemeral: true}).then(null, (err) -> trace(err));
							trace(resp);
					}
				});
				EcsTools.set(e);
			default:
		}
	}

	function formatLink(url:String, size:String) {
		if (url.contains('cdn.discordapp.com')) {
			var split = url.split('?');
			if (split.length > 1) {
				if (size == null) {
					size = 'small';
				}

				var dimensions = switch(size) {
					case 'medium': 64;
					case 'large': 128;
					default: 48;
				}
				
				url = split[0] += '?quality=lossless&size=$dimensions';
				return url;
			}
		}
		return url;
	}

	function search(name:String, callback:Array<{name:String, value:String}>->Void) {
		var e = DBEvents.Search('emojis', 'name', name, function(resp) {
			switch (resp) {
				case Records(data):
					var arr = [];
					for (r in data) {
						var e = DBEmoji.fromRecord(r);
						arr.push({
							name: e.name,
							value: e.id.string()
						});
					}
					callback(arr);
				default:
					trace(resp);
					callback([]);
			}
		});

		EcsTools.set(e);
	}

	function isId(input:String) {
		var check_letters = ~/^[0-9]*$/;
		return check_letters.match(input);
	}

	function get_name():String {
		return 'emoji';
	}
}
