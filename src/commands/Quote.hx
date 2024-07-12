package commands;

import database.DBEvents;
import database.types.DBQuote;
import discord_js.User;
import js.Browser;
import discord_builder.APIActionRowComponent;
import discord_builder.APITextInputComponent;
import discord_builder.ModalBuilder;
import discord_js.MessageEmbed;
import discord_builder.BaseCommandInteraction;
import components.Command;
import Main.CommandForward;
import systems.CommandDbBase;
import commands.types.ActionList;
import Query;
import db.Record;

class Quote extends CommandDbBase {
	@:fastFamily var modal:{forward:CommandForward, interaction:BaseCommandInteraction};
	var cache:Map<String, DBQuote> = [];
	final max_name_length = 35;

	override function onEnabled() {
		this.has_subcommands = true;
	}

	override function update(_:Float) {
		super.update(_);
		iterate(modal, entity -> {
			switch (forward) {
				case quote_set:
					var id = interaction.user.id;
					var name = interaction.user.username;
					var title = interaction.fields.getTextInputValue('name');
					var description = interaction.fields.getTextInputValue('description');

					var quote = new DBQuote(id, name, title, description);

					if (!this.isValidName(name)) {
						interaction.reply({
							content: '*Names can only contain `_-.?:` and/or spaces.*\nname: $name\n$description',
							ephemeral: true
						});
						return;
					}

					var e = DBEvents.Insert('quotes', quote.record, function(resp) {
						switch (resp) {
							case Success(message, data):
								trace(message);
								quote = DBQuote.fromRecord(data);
								var embed = new MessageEmbed();
								embed.setTitle('Quote #${quote.id} added!');
								embed.setDescription('**${quote.title}**\n$description');
								interaction.reply({embeds: [embed]});
							default:
								interaction.reply('Something went wrong, try again later')
									.then(null, (err) -> trace(err));
								trace(resp);
								trace(quote);
						}
					});

					EcsTools.set(e);
				case quote_edit:
					var quote = this.cache.get(interaction.user.id);
					var title = interaction.fields.getTextInputValue('title');
					quote.description = interaction.fields.getTextInputValue('description');
					var e = DBEvents.DBEvents.GetRecord('quotes', Query.query($title == title && $author_id == interaction.user.id), function(resp) {
						switch (resp) {
							case Record(data):
								trace(title);
								trace(quote.title);
								if (data != null && title != quote.title) {
									interaction.reply(
										'You already have a quote with the title **__${title}__**'
									)
										.then(null, function(err) {
											trace(err);
											Browser.console.dir(err);
										});
									return;
								}
								quote.title = title.toLowerCase();
								var e = DBEvents.Update(
									'quotes',
									quote.record,
									Query.query($id == quote.id && $author_id == quote.author_id),
									function(resp) {
										switch (resp) {
											case Success(message, _):
												trace('$message');
												interaction.reply('Quote updated!');
											default:
												trace(this.cache.get(interaction.user.id));
												interaction.reply('Something went wrong');
												trace(resp);
										}
										this.cache.remove(interaction.user.id);
									}
								);
								EcsTools.set(e);
							default:
								trace(resp);
						}
					});

					EcsTools.set(e);
				default:
			}

			if (forward == quote_set || forward == quote_edit) {
				this.universe.deleteEntity(entity);
			}
		});
	}

	function parseGroupQuotes(interaction:BaseCommandInteraction, value:Callback) {
		switch (value) {
			case Records(data):
				if (data.length == 0) {
					interaction.reply("No quotes by that user!");
					return;
				}
				var embed = new MessageEmbed();
				embed.setTitle('List of Quotes');
				var body = '';
				for (item in data) {
					var quote = DBQuote.fromRecord(item);
					body += '**#${quote.id}** ${quote.title} by <@${quote.author_id}> \n';
				}
				embed.setDescription(body);
				embed.setColor(0xEA8220);
				interaction.reply({embeds: [embed]}).then(null, (err) -> trace(err));
			default:
				trace(value);
		}
	}

	function run(command:Command, interaction:BaseCommandInteraction) {
		switch (command.content) {
			case QuoteList(user):
				var sort = Firestore.orderBy('id', ASCENDING);
				var e = DBEvents.GetAllRecords('quotes', parseGroupQuotes.bind(interaction));
				if (user != null) {
					e = DBEvents.GetRecords('quotes', Query.query($author_id == user.id),
						parseGroupQuotes.bind(interaction));
				}
				EcsTools.set(e);
			case QuoteGet(name) | QuoteCreate(name) | QuoteEdit(name) | QuoteDelete(name):
				var type = get;
				var enum_name = command.content.getName().toLowerCase();
				if (enum_name.contains('get')) {
					type = get;
				}

				if (enum_name.contains('create')) {
					type = set;
				}

				if (enum_name.contains('delete')) {
					type = delete;
				}

				if (enum_name.contains('edit')) {
					type = edit;
				}

				var column = 'id';
				if (name == null) {
					name = "";
				}

				if (this.isName(name) && type != get) {
					if (name.length < 2) {
						if (interaction.isAutocomplete()) {
							interaction.respond([]);
						}
						return;
					}

					if (this.isValidName(name)) {
						column = 'name';
						name = name.toLowerCase();
					}
				}

				var col = collection(db, 'discord/quotes/entries');

				var query:FQuery<TQuoteData> = Firestore.query(
					col,
					where(column, EQUAL_TO, isName(name) ? name : name.parseInt()),
					where('author', EQUAL_TO, interaction.user.id)
				);

				var column = 'title';
				if (isId(name)) {
					column = 'id';
				}

				if (interaction.isAutocomplete() && type != get) {
					var e = DBEvents.SearchBy('quotes', column, name, 'author_id',
						interaction.user.id, function(resp) {
							switch (resp) {
								case Records(data):
									var res = [];
									for (r in data) {
										var quote = DBQuote.fromRecord(r);
										res.push({
											name: this.dbacResponse(quote),
											value: '${quote.id}'
										});
									}
									trace(name);
									if (!interaction.responded) {
										interaction.respond(res).then(null, function(err) {
											trace(err);
											Browser.console.dir(err);
										});
									}
								default:
									trace(resp);
							}
					});
					EcsTools.set(e);
					return;
				}

				switch (type) {
					case set:
						var is_id = this.isId(name);
						if (!is_id && !this.isValidName(name)) {
							var error_msg = 'name can only be 3-$max_name_length characters long';
							if (name.length < this.max_name_length) {
								error_msg = '*Names can only contain `_.-?` and/or spaces.*';
							}
							interaction.reply({content: error_msg, ephemeral: true});
							return;
						}

						var column = (is_id) ? 'id' : 'title';

						var e = DBEvents.Search('quotes', column, name, function(resp) {
							switch (resp) {
								case Records(data):
									if (data.length >= 1) {
										interaction.reply(
											'You already have a quote with the title __${data[0].field('title')}__'
										)
											.then(null, function(err) {
												trace(err);
												Browser.console.dir(err);
											});
										return;
									}
									var modal = new ModalBuilder().setCustomId('quote_set')
										.setTitle('Creating a quote');

									var title_input = new APITextInputComponent()
										.setCustomId('name')
										.setLabel('title')
										.setStyle(Short)
										.setValue(name.toLowerCase())
										.setMinLength(3)
										.setMaxLength(this.max_name_length);

									var desc_input = new APITextInputComponent()
										.setCustomId('description')
										.setLabel('description')
										.setStyle(Paragraph)
										.setMinLength(10)
										.setMaxLength(2000);

									var action_a = new APIActionRowComponent()
										.addComponents(title_input);
									var action_b = new APIActionRowComponent()
										.addComponents(desc_input);
									modal.addComponents(action_a, action_b);

									interaction.showModal(modal);
								default:
									trace(resp);
							}
						});
						EcsTools.set(e);
					case edit:
						var e = DBEvents.GetRecord(
							'quotes',
							Query.query($id == name && $author_id == interaction.user.id),
							function(resp) {
								switch (resp) {
									case Record(data):
										if (data == null) {
											interaction.reply(
												'Could not find quote or you were not the author of the quote specified'
											);
											return;
										}

										var quote = DBQuote.fromRecord(data);
										var modal = new ModalBuilder().setCustomId('quote_edit')
											.setTitle('Editting quote #${quote.id}');
										var title_input = new APITextInputComponent()
											.setCustomId('title')
											.setLabel('title')
											.setStyle(Short)
											.setValue(quote.title.toLowerCase())
											.setMinLength(3)
											.setMaxLength(this.max_name_length);

										var desc_input = new APITextInputComponent()
											.setCustomId('description')
											.setLabel('${quote.title}:')
											.setStyle(Paragraph)
											.setValue(quote.description)
											.setMinLength(10)
											.setMaxLength(2000);

										var action_a = new APIActionRowComponent()
											.addComponents(title_input);
										var action_b = new APIActionRowComponent()
											.addComponents(desc_input);

										modal.addComponents(action_a, action_b);

										this.cache.set(interaction.user.id, quote);
										interaction.showModal(modal);
									default:
										trace(resp);
								}
							}
						);
						EcsTools.set(e);
					case delete:
						var record = new Record();
						record.field('author_id', interaction.user.id);
						record.field('id', name);

						var e = DBEvents.DeleteRecord('quotes', record, function(resp) {
							switch (resp) {
								case Success(message, data):
									interaction.reply("Quote deleted!")
										.then(null, (err) -> trace(err));
								case Error(message, data):
									trace(message);
									trace(data);
									interaction.reply("Cannot delete this quote")
										.then(null, function(err) {
											trace(err);
											Browser.console.dir(err);
										});
								default:
									trace(resp);
							}
						});
						EcsTools.set(e);
					case get | _:
						if (name != null) {
							var qid = Std.parseInt(name);
							if (interaction.isAutocomplete()) {
								var results = [];
								var e:DBEvents = null;

								if (name != null && name.length > 0) {
									if (qid != null && qid > 0) {
										e = DBEvents.GetRecord('quotes', Query.query($id == qid),
											function(response) {
												switch (response) {
													case Record(data):
														var quote = DBQuote.fromRecord(data);
														results.push({
															name: this.dbacResponse(quote),
															value: '${quote.id}'
														});
														interaction.respond(results)
															.then(null, function(err) {
																trace(err);
																Browser.console.dir(err);
															});
													default:
														trace(response);
												}
											});
									} else {
										e = DBEvents.Search('quotes', 'title', name,
											function(response) {
												switch (response) {
													case Records(data):
														for (item in data) {
															var quote = DBQuote.fromRecord(item);
															results.push({
																name: this.dbacResponse(quote),
																value: '${quote.id}'
															});
														}
														// trace(results);
														interaction.respond(results)
															.then(null, function(err) {
																trace(err);
																Browser.console.dir(err);
															});
													default:
														trace(response);
												}
											});
									}
									universe.setComponents(universe.createEntity(), e);
									return;
								} else {
									interaction.respond([]).then(null, function(err) {
										trace(err);
										Browser.console.dir(err);
									});
									return;
								}
								return;
							}

							var e = DBEvents.GetRecord('quotes', Query.query($id == name),
								function(resp) {
									switch (resp) {
										case Record(data):
											if (data == null) {
												interaction.reply('Could not find any quotes with that identifier')
													.then(null, (err) -> trace(err));
												return;
											}
											var q = DBQuote.fromRecord(data);
											var embed = new MessageEmbed();
											var user = interaction.client.users.cache.get(q.author_id);

											var from = Date.fromTime(q.timestamp);
											var date = DateTools.format(from, '%H:%M %d-%m-%Y');

											var icon = 'https://cdn.discordapp.com/emojis/567741748172816404.webp?size=96&quality=lossless';
											var content = user.tag;
											if (user != null) {
												icon = user.avatarURL();
												content = user.username;
											}

											embed.setDescription('***${q.title}***\n${q.description}');
											embed.setFooter({
												text: '$content | $date |\t#${q.id}',
												iconURL: icon
											});

											interaction.reply({embeds: [embed]})
												.then(null, function(err) {
													trace(err);
													Browser.console.dir(err);
												});
										default:
											trace(resp);
									}
								});
							EcsTools.set(e);
						}
				}
			default:
				// interaction.reply();
		}
	}

	inline function dbacResponse(data:DBQuote) {
		var name = data.title;
		if (name.length > 25) {
			name = name.substr(0, 25) + '...';
		}
		return '$name - ' + data.description.substr(0, 25) + '... by ${data.author_tag}';
	}

	function nameArray(original:String) {
		var arr = original.toLowerCase().split(" ");
		for (k => v in arr) {
			arr[k] = v.trim();
		}
		return arr;
	}

	function nameString(arr:Array<String>) {
		var text = arr[1];
		for (i in 2...arr.length) {
			text += ' ' + arr[i];
		}
		return text.trim();
	}

	function isName(input:String) {
		var check_letters = ~/([a-z])/i;
		return check_letters.match(input);
	}

	function isId(input:String) {
		var check_letters = ~/^[0-9]*$/;
		return check_letters.match(input);
	}

	function isValidName(input:String) {
		var check_letters = ~/^[A-Za-z0-9 :.?_-]{3,35}$/i;
		return check_letters.match(input);
	}

	function get_name():String {
		return 'quote';
	}
}

typedef TQuoteData = {
	@:optional var id:Int;
	@:optional var tags:Array<String>;
	@:optional var name:String;
	@:optional var description:String;
	@:optional var author:String;
	@:optional var username:String;
	@:optional var timestamp:Date;
}
