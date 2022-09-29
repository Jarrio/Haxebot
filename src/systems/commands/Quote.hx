package systems.commands;

import discord_builder.APIActionRowComponent;
import discord_builder.APITextInputComponent;
import discord_builder.ModalBuilder;
import firebase.web.firestore.identifiers.WhereFilterOp;
import firebase.web.firestore.Timestamp;
import discord_js.MessageEmbed;
import discord_builder.BaseCommandInteraction;
import components.Command;
import Main.CommandForward;

enum abstract QuoteCommand(String) to String {
	var get;
	var set;
	var edit;
	var delete;
}

class Quote extends CommandDbBase {
	@:fastFamily var modal:{forward:CommandForward, interaction:BaseCommandInteraction};
	var cache:Map<String, Int> = [];

	override function update(_:Float) {
		super.update(_);
		iterate(modal, entity -> {
			switch (forward) {
				case quote_set:
					var name = interaction.fields.getTextInputValue('name');
					var description = interaction.fields.getTextInputValue('description');

					var data = {
						id: -1,
						name: this.nameArray(name),
						description: description,
						author: interaction.user.id,
						username: interaction.user.username,
						timestamp: Date.now()
					}

					if (!this.isValidName(name)) {
						interaction.reply({content: '*Names can only contain `_-` and/or spaces.*\nname: $name\n$description', ephemeral: true});
						return;
					}

					var doc = doc(db, 'discord/quotes');

					Firestore.runTransaction(this.db, function(transaction) {
						return transaction.get(doc).then(function(doc) {
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
						this.addDoc('discord/quotes/entries', data, function(_) {
							interaction.reply('*Quote #${data.id} added!*\nname: $name\n$description\n\nby: <@${data.author}>');
						}, err);
					}, err);
				case quote_edit:
					var col = collection(db, 'discord/quotes/entries');
					var query:Query<TQuoteData> = query(col, where('id', EQUAL_TO, this.cache.get(interaction.user.id)));
					Firestore.getDocs(query).then(function(resp) {
						if (resp.docs.length != 1) {
							interaction.reply('Something went wrong');
							trace(this.cache.get(interaction.user.id));
							return;
						}

						Firestore.updateDoc(resp.docs[0].ref, {description: interaction.fields.getTextInputValue('description')}).then(function(_) {
							interaction.reply('Quote updated!');
							this.cache.remove(interaction.user.id);
						}, err);
					}, err);
				default:
			}

			if (forward == quote_set || forward == quote_edit) {
				this.universe.deleteEntity(entity);
			}
		});
	}

	function run(command:Command, interaction:BaseCommandInteraction) {
		switch (command.content) {
			case Quote(type, name):
				var column = 'id';

				if (this.isName(name)) {
					if (name.length < 3) {
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
				var condition = isName(name) ? WhereFilterOp.ARRAY_CONTAINS : WhereFilterOp.EQUAL_TO;
				var query:Query<TQuoteData> = Firestore.query(col, where(column, EQUAL_TO, isName(name) ? this.nameArray(name) : name.parseInt()),
					where('author', EQUAL_TO, interaction.user.id));

				if (interaction.isAutocomplete() && type != get) {
					Firestore.getDocs(query).then(function(res) {
						var results = [];
						for (d in res.docs) {
							var data = d.data();
							results.push({
								name: '${data.username} - ' + data.description.substr(0, 25) + '...',
								value: '${data.id}'
							});
						}
						interaction.respond(results).then(null, err);
					}).then(null, err);
					return;
				}

				switch (type) {
					case set:
						if (!this.isValidName(name)) {
							interaction.reply({content: '*Names can only contain `_-` and/or spaces.*', ephemeral: true});
							return;
						}

						Firestore.getDocs(query).then(function(res) {
							if (res.docs.length >= 1) {
								interaction.reply('You already have a quote(#${res.docs[0].data().id}) with the name __${name}__').then(null, err);
								return;
							}

							var modal = new ModalBuilder().setCustomId('quote_set').setTitle('Creating a quote');

							var title_input = new APITextInputComponent().setCustomId('name')
								.setLabel('name')
								.setStyle(Short)
								.setValue(name.toLowerCase())
								.setMinLength(3)
								.setMaxLength(12);

							var desc_input = new APITextInputComponent().setCustomId('description')
								.setLabel('description')
								.setStyle(Paragraph)
								.setMinLength(10)
								.setMaxLength(2000);

							var action_a = new APIActionRowComponent().addComponents(title_input);
							var action_b = new APIActionRowComponent().addComponents(desc_input);
							modal.addComponents(action_a, action_b);

							interaction.showModal(modal);
							return;
						}, err);

					case edit:
						Firestore.getDocs(query).then(function(res) {
							if (res.docs.length == 0) {
								interaction.reply('Could not find quote');
								return;
							}

							var ref = null;
							var doc = null;

							for (d in res.docs) {
								if (interaction.user.id == d.data().author) {
									ref = d.ref;
									doc = d.data();
									break;
								}
							}

							if (doc == null) {
								interaction.reply("That isn't your quote!").then(null, err);
								return;
							}

							var modal = new ModalBuilder().setCustomId('quote_edit').setTitle('Editting quote #${doc.id}');

							var desc_input = new APITextInputComponent().setCustomId('description')
								.setLabel('${this.nameString(doc.name)}:')
								.setStyle(Paragraph)
								.setValue(doc.description)
								.setMinLength(10)
								.setMaxLength(2000);

							var action_b = new APIActionRowComponent().addComponents(desc_input);
							modal.addComponents(action_b);

							this.cache.set(interaction.user.id, doc.id);
							interaction.showModal(modal);
						}, err);
					case delete:
						Firestore.getDocs(query).then(function(res) {
							if (res.docs.length == 0) {
								interaction.reply("Cannot delete this quote").then(null, err);
								return;
							}

							if (res.docs.length > 1) {
								interaction.reply("An odd situation occured. <@151104106973495296>");
								trace(name);
								trace(interaction.user.id);
								return;
							}

							Firestore.deleteDoc(res.docs[0].ref).then(function(_) {
								interaction.reply("Quote deleted!");
							}, err);
						}, (err) -> trace(err));

					case get | _:
						query = Firestore.query(col, where(column, condition, (isName(name) ? name : name.parseInt())));

						if (interaction.isAutocomplete()) {
							Firestore.getDocs(query).then(function(res) {
								var results = [];
								for (d in res.docs) {
									var data = d.data();
									results.push({
										name: '${data.username} - ' + data.description.substr(0, 25) + '...',
										value: '${data.id}'
									});
								}
								interaction.respond(results).then(null, err);
							}).then(null, err);
							return;
						}

						Firestore.getDocs(query).then(function(res) {
							if (res.docs.length == 0) {
								interaction.reply('Could not find any quotes with that identifier');
								return;
							}
							var data = res.docs[0].data();
							var embed = new MessageEmbed();
							var user = interaction.client.users.cache.get(data.author);

							var from = cast(data.timestamp, Timestamp);
							var date = DateTools.format(from.toDate(), '%H:%M %d-%m-%Y');

							var icon = 'https://cdn.discordapp.com/emojis/567741748172816404.webp?size=96&quality=lossless';
							var content = data.username;
							if (user != null) {
								icon = user.avatarURL();
								content = user.username;
							}

							embed.setDescription('***${this.nameString(data.name)}***\n${data.description}');
							embed.setFooter({text: '$content | $date |\t#${data.id}', iconURL: icon});

							interaction.reply({embeds: [embed]}).then(null, err);
						}).then(null, err);
				}
			default:
				// interaction.reply();
		}
	}

	function nameArray(original:String) {
		var arr = original.toLowerCase().split(" ");
		for (k => v in arr) {
			arr[k] = v.trim();
		}
		return arr;
	}

	function nameString(arr:Array<String>) {
		var text = arr[0];
		for (i in 1...arr.length) {
			text += ' ' + arr[i];
		}
		return text.trim();
	}

	function isName(input:String) {
		var check_letters = ~/([a-z])/i;
		return check_letters.match(input);
	}

	function isValidName(input:String) {
		var check_letters = ~/^[A-Za-z0-9 _-]{3,16}$/i;
		return check_letters.match(input);
	}

	function get_name():String {
		return 'quote';
	}
}

typedef TQuoteData = {
	@:optional var id:Int;
	@:optional var name:Array<String>;
	@:optional var description:String;
	@:optional var author:String;
	@:optional var username:String;
	@:optional var timestamp:Date;
}
