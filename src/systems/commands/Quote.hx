package systems.commands;

import firebase.web.firestore.identifiers.WhereFilterOp;
import firebase.web.firestore.Timestamp;
import discord_js.MessageEmbed;
import discord_builder.BaseCommandInteraction;
import components.Command;

enum abstract QuoteCommand(String) to String {
	var get;
	var set;
	var edit;
	var delete;
}

class Quote extends CommandDbBase {
	function run(command:Command, interaction:BaseCommandInteraction) {
		switch (command.content) {
			case Quote(type, name, description):
				var column = 'id';

				if (this.isName(name) && type != set) {
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
				var query:Query<TQuoteData> = query(col, where(column, condition, (isName(name) ? name : name.parseInt())));

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

				switch (type) {
					case set:
						if (name.length < 3 || name.length > 16) {
							interaction.reply("A name can only contain 3-16 characters. Including `_-(space)`. Name's are case insensitive.");
							return;
						}

						if (description == null || description.length < 14) {
							interaction.reply("A description must have at least 14 characters");
							return;
						}

						var query:Query<TQuoteData> = Firestore.query(col, where('name', EQUAL_TO, this.nameArray(name)),
							where('author', EQUAL_TO, interaction.user.id));
						Firestore.getDocs(query).then(function(res) {
							if (res.docs.length == 1) {
								interaction.reply('You already have a quote(#${res.docs[0].data().id}) with the name __${name}__').then(null, err);
								return;
							}

							var data = {
								id: -1,
								name: this.nameArray(name),
								description: description,
								author: interaction.user.id,
								username: interaction.user.username,
								timestamp: Date.now()
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
						}, err);

					case edit:
						Firestore.getDocs(query).then(function(res) {
							if (res.docs.length == 0) {
								interaction.reply('Could not find quote');
								return;
							}

							var doc = null;
							for (d in res.docs) {
								if (interaction.user.id == d.data().author) {
									doc = d;
									break;
								}
							}

							if (doc == null) {
								interaction.reply("That isn't your quote!").then(null, err);
								return;
							}

							if (description == null || description.length < 20) {
								interaction.reply("A description must have at least 20 characters");
								return;
							}

							Firestore.updateDoc(doc.ref, {description: description}).then(function(_) {
								interaction.reply('Quote updated!');
							}, (err) -> trace(err));
						}, (err) -> trace(err));
					case delete:
						var query:Query<TQuoteData> = Firestore.query(col, where(column, EQUAL_TO, isName(name) ? name : name.parseInt()),
							where('author', EQUAL_TO, interaction.user.id));
						Firestore.getDocs(query).then(function(res) {
							if (res.docs.length == 0) {
								interaction.reply("Cannot delete this quote").then(null, err);
								return;
							}
							
							if (res.docs.length > 1) {
								interaction.reply("An odd situation occured. <@151104106973495296>");
								trace(name);
								trace(interaction.user.id);
								trace(description);
								return;
							}

							Firestore.deleteDoc(res.docs[0].ref).then(function(_) {
								interaction.reply("Quote deleted!");
							}, err);
						}, (err) -> trace(err));

					case get | _:
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
		var check_letters = ~/^[A-Za-z0-9_-]{3,16}/i;
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
