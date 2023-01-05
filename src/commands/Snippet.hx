package commands;

import js.html.URL;
import externs.FuzzySort;
import firebase.web.firestore.DocumentSnapshot;
import discord_js.MessageEmbed;
import discord_js.TextChannel;
import firebase.web.firestore.DocumentReference;
import components.Command;
import discord_builder.BaseCommandInteraction;
import systems.CommandDbBase;

class Snippet extends CommandDbBase {
	var sent:Array<TSnippet> = [];
	var tags:Array<{name:String, value:String}> = [];

	override function onEnabled() {
		this.has_subcommands = true;
		Firestore.onSnapshot(doc(this.db, 'discord/snippets'), function(resp:DocumentSnapshot<{tags:Array<String>}>) {
			var arr = [];
			for (tag in resp.data().tags) {
				arr.push({
					name: tag,
					value: tag
				});
			}
			this.tags = arr;
			this.tags.sort(function(a, b) {
				if (a.name.charCodeAt(0) > b.name.charCodeAt(0)) {
					return 1;
				}

				if (a.name.charCodeAt(0) < b.name.charCodeAt(0)) {
					return -1;
				}

				return 0;
			});
		});
	}

	function run(command:Command, interaction:BaseCommandInteraction) {
		switch (command.content) {
			case SnippetAdd(title, description, url, taga, tagb, tagc, tagd, tage):
				var ac = taga;
				var obj:TSnippet = {
					id: -1,
					submitted_by: interaction.user.id,
					timestamp: Date.now().getTime(),
					title: title,
					description: description,
					url: url,
					tags: [taga]
				}

				if (tagb != null) {
					ac = tagb;
					obj.tags.push(tagb);
				}

				if (tagc != null) {
					ac = tagc;
					obj.tags.push(tagc);
				}

				if (tagd != null) {
					ac = tagd;
					obj.tags.push(tagd);
				}

				if (tage != null) {
					ac = tage;
					obj.tags.push(tage);
				}

				if (interaction.isAutocomplete()) {
					var results = this.autoComplete(ac);
					interaction.respond(results);
					return;
				}

				if (!validateURL(url)) {
					interaction.reply('Invalid URL format');
					return;
				}

				if (url.charAt(url.length - 1) == '/') {
					url = url.substring(0, url.length - 2);
				}

				for (tag in obj.tags) {
					var found = false;
					for (v in this.tags) {
						if (tag == v.name) {
							found = true;
							break;
						}
					}

					if (!found) {
						interaction.reply('The tag __${tag}__ is not available as an option currently.');
						return;
					}
				}

				var q = query(collection(db, 'discord/snippets/entries'), where('url', EQUAL_TO, url));
				Firestore.getDocs(q).then(function(resp) {
					if (!resp.empty) {
						interaction.reply('Snippet already exists');
						return;
					}
					
					var doc = doc(db, 'discord/snippets');
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
						obj.id = value.id;
						obj.tags.insert(0, '${value.id}');

						this.addDoc('discord/snippets/entries', obj, function(_) {
							interaction.reply('*Snippet #${value.id} added!*\ntitle: $title\n$description\n');
						}, err);
					}, err);
				}, err);
			case SnippetSearch(taga, tagb, tagc):
				var restraints = [];
				var search = '';
				if (isValidTag(taga)) {
					search = taga;
					restraints.push(taga);
				}

				if (isValidTag(tagb)) {
					search = tagb;
					restraints.push(tagb);
				}

				if (isValidTag(tagc)) {
					search = tagc;
					restraints.push(tagc);
				}

				if (interaction.isAutocomplete()) {
					var results = this.autoComplete(search);
					interaction.respond(results);
					return;
				}

				var q = query(collection(this.db, 'discord/snippets/entries'), where('tags', ARRAY_CONTAINS_ANY, restraints));
				getDocs(q).then(function(resp) {
					var desc = 'No results found';

					if (resp.docs.length > 0) {
						desc = 'Results found for tags: ${restraints.toString()}\n\n';
					}

					for (i => doc in resp.docs) {
						var data = (doc.data() : TSnippet);
						desc += '**${i + 1}) [${data.title}](${data.url})**\n';
						desc += data.description + '\n';
					}

					var embed = new MessageEmbed();
					embed.setTitle('Snippet Search');
					embed.setDescription(desc);

					interaction.reply({embeds: [embed]});
				}, err);
			case SnippetList(user):
				var q = query(collection(this.db, 'discord/snippets/entries'), orderBy('id', ASCENDING));
				if (user != null) {
					q = query(collection(this.db, 'discord/snippets/entries'), where('submitted_by', EQUAL_TO, user.id), orderBy('id', ASCENDING));
				}
				getDocs(q).then(function(resp) {
					var desc = 'No results found';

					if (resp.docs.length > 0) {
						desc = '';
					}

					for (doc in resp.docs) {
						var data = (doc.data() : TSnippet);
						desc += '**${data.id}) [${data.title}](${data.url})**\n';
						desc += data.description + '\n';
					}

					var embed = new MessageEmbed();
					embed.setTitle('Snippet Search');
					embed.setDescription(desc);

					interaction.reply({embeds: [embed]});
				}, err);
			case SnippetEdit(id):
				var q = query(collection(this.db, 'discord/snippets/entries'), where('id', EQUAL_TO, id),
					where('submitted_by', EQUAL_TO, interaction.user.id));
				getDocs(q).then(function(resp) {
					if (resp.empty && !interaction.isAutocomplete()) {
						interaction.reply('No snippets with that id were found that could belong to you');
						return;
					}

					if (interaction.isAutocomplete()) {
						var res = [];
						if (resp.docs.length > 0) {
							var data = (resp.docs[0].data() : TSnippet);
							res.push({name: '${data.id} - ${data.title}', value: '${data.id}'});
						}

						interaction.respond(res);
						return;
					}

					interaction.reply('Editting currently not implemented');
				}, err);
			case SnippetDelete(id):
				var q = query(collection(this.db, 'discord/snippets/entries'), where('id', EQUAL_TO, id.parseInt()),
					where('submitted_by', EQUAL_TO, interaction.user.id));
				getDocs(q).then(function(resp) {
					if (resp.empty && !interaction.isAutocomplete()) {
						interaction.reply('No snippets with that id were found that could belong to you');
						return;
					}

					if (interaction.isAutocomplete()) {
						var res = [];
						if (resp.docs.length > 0) {
							var data = (resp.docs[0].data() : TSnippet);
							res.push({name: '${data.id} - ${data.title}', value: '${data.id}'});
						}

						interaction.respond(res);
						return;
					}

					Firestore.deleteDoc(resp.docs[0].ref).then(function(_) {
						interaction.reply('Your snippet(#$id) has been deleted.');
					}, err);
				}, err);
			default:
		}
	}

	function validateURL(content:String) {
		var regex = ~/((((https?:)(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/gm;
		if (regex.match(content)) {
			return true;
		}
		return false;
	}

	function autoComplete(term:String) {
		var results = [];
		var algo = FuzzySort.go(term, this.tags, {key: 'name', limit: 20, threshold: -100});

		for (a in algo) {
			results.push(a.obj);
		}

		if (results.length == 0) {
			results = this.tags;
		}

		return results;
	}

	function isValidTag(tag:String) {
		var found = false;
		for (v in this.tags) {
			if (tag == v.name) {
				found = true;
				break;
			}
		}
		return found;
	}

	function createEmbed(obj:TSnippet) {
		var embed = new MessageEmbed();
		embed.setTitle(obj.title);
		embed.setURL(obj.url);
		embed.setDescription(obj.description);
	}

	override function update(_) {
		super.update(_);
	}

	function get_name():String {
		return 'snippet';
	}
}

typedef TSnippet = {
	var id:Int;
	var submitted_by:String;
	var timestamp:Float;
	var url:String;
	var title:String;
	var description:String;
	var tags:Array<String>;
}
