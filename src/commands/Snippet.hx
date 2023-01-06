package commands;

import discord_js.Message;
import Main.CommandForward;
import discord_builder.APIActionRowComponent;
import discord_builder.ButtonBuilder;
import externs.FuzzySort;
import firebase.web.firestore.DocumentSnapshot;
import discord_js.MessageEmbed;
import components.Command;
import discord_builder.BaseCommandInteraction;
import systems.CommandDbBase;

class Snippet extends CommandDbBase {
	var sent:Array<TSnippet> = [];
	var tags:Array<{name:String, value:String}> = [];
	final results_per_page:Int = 5;
	final results_per_page_no_desc:Int = 20;
	var cache:Map<String, TListState> = [];
	@:fastFamily var button_events:{command:CommandForward, interaction:BaseCommandInteraction};

	override function onEnabled() {
		this.has_subcommands = true;
		Firestore.onSnapshot(doc(this.db, 'discord/snippets'),
			function(resp:DocumentSnapshot<{tags:Array<String>}>) {
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

	override function update(_) {
		super.update(_);
		iterate(button_events, entity -> {
			var cache = this.cache.get(interaction.user.id);
			if (cache != null) {
				switch (command) {
					case snippet_left:
						if (cache.page - 1 >= 0) {
							var embed = this.formatResultOutput(cache, -1);
							cache.message.edit({embeds: [embed]});
						}
						cache.interacted_at = Date.now().getTime();
						interaction.deferUpdate().then(null, err);
						universe.deleteEntity(entity);
					case snippet_right:
						var page = cache.page;
						var results_pp = (cache.desc) ? results_per_page : results_per_page_no_desc;
						var max = Math.ceil(cache.results.length / results_pp);
						if (page + 1 < max) {
							var embed = this.formatResultOutput(cache, 1);
							cache.message.edit({embeds: [embed]});
						}
						cache.interacted_at = Date.now().getTime();
						interaction.deferUpdate().then(null, err);
						universe.deleteEntity(entity);
					default:
				}
			}
			if (command == snippet_left || command == snippet_right) {
				universe.deleteEntity(entity);
			}
		});

		for (key => item in cache) {
			var now = Date.now().getTime();
			var diff = now - item.interacted_at;
			if (diff < 30000) {
				continue;
			}
			var embed = this.formatResultOutput(item, 0);
			item.message.edit({embeds: [embed], components: []}).then(function(_) {
				this.cache.remove(key);
			}, err);
		}
	}

	function run(command:Command, interaction:BaseCommandInteraction) {
		switch (command.content) {
			case SnippetAdd(url, title, description, taga, tagb, tagc, tagd, tage):
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
					url = url.substring(0, url.length - 1);
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
						interaction.reply(
							'The tag __${tag}__ is not available as an option currently.'
						);
						return;
					}
				}

				var q = query(collection(db, 'discord/snippets/entries'),
					where('url', EQUAL_TO, url));
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
							interaction.reply(
								'*Snippet #${value.id} added!*\ntitle: $title\n$description\n'
							);
						}, err);
					}, err);
				}, err);
			case SnippetSearch(taga, tagb, tagc):
				var restraints = [];
				var search = '';
				if (taga != null) {
					search = taga;
				}

				if (tagb != null) {
					search = tagb;
				}

				if (tagc != null) {
					search = tagc;
				}

				if (interaction.isAutocomplete()) {
					var results = this.autoComplete(search);
					interaction.respond(results);
					return;
				}

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

				var q = query(collection(this.db, 'discord/snippets/entries'),
					where('tags', ARRAY_CONTAINS_ANY, restraints));
				getDocs(q).then(function(resp) {
					var res = [];

					for (doc in resp.docs) {
						res.push(doc.data());
					}

					var obj = {
						page: 0,
						desc: true,
						message: null,
						results: res,
						interacted_at: Date.now().getTime()
					}

					this.handleSearchResponse(interaction, obj);
				}, err);
			case SnippetList(user, show_desc):
				if (show_desc == null) {
					show_desc = true;
				}

				var q = query(collection(this.db, 'discord/snippets/entries'),
					orderBy('id', ASCENDING));
				if (user != null) {
					q = query(collection(this.db, 'discord/snippets/entries'),
						where('submitted_by', EQUAL_TO, user.id), orderBy('id', ASCENDING));
				}

				getDocs(q).then(function(resp) {
					var res = [];

					for (doc in resp.docs) {
						res.push(doc.data());
					}

					var obj = {
						page: 0,
						desc: show_desc,
						message: null,
						results: res,
						interacted_at: Date.now().getTime()
					}

					this.handleSearchResponse(interaction, obj);
				}, err);
			case SnippetEdit(id):
				var q = query(collection(this.db, 'discord/snippets/entries'),
					where('id', EQUAL_TO, id),
					where('submitted_by', EQUAL_TO, interaction.user.id));
				getDocs(q).then(function(resp) {
					if (resp.empty && !interaction.isAutocomplete()) {
						interaction.reply(
							'No snippets with that id were found that could belong to you'
						);
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
				var q = query(collection(this.db, 'discord/snippets/entries'),
					where('id', EQUAL_TO, id.parseInt()),
					where('submitted_by', EQUAL_TO, interaction.user.id));
				getDocs(q).then(function(resp) {
					if (resp.empty && !interaction.isAutocomplete()) {
						interaction.reply(
							'No snippets with that id were found that could belong to you'
						);
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

	function handleSearchResponse(interaction:BaseCommandInteraction, state:TListState) {
		var builder = new APIActionRowComponent();
		builder.addComponents(
			new ButtonBuilder().setCustomId('snippet_left').setLabel('Prev').setStyle(Primary),
			new ButtonBuilder().setCustomId('snippet_right').setLabel('Next').setStyle(Primary)
		);

		var arr = [];
		var results_pp = (state.desc) ? results_per_page : results_per_page_no_desc;
		var max = Math.ceil(state.results.length / results_pp);
		if (max > 1) {
			arr = [builder];
		}

		var embed = formatResultOutput(state, 0);
		interaction.reply({embeds: [embed], components: arr, fetchReply: true})
			.then(function(message) {
				state.message = message;
				this.cache.set(interaction.user.id, state);
			}, err);
	}

	function formatResultOutput(state:TListState, forward:Int) {
		var embed = new MessageEmbed();
		var desc = 'No results found';
		var results = state.results;
		var results_pp = (state.desc) ? results_per_page : results_per_page_no_desc;
		var max = Math.ceil(results.length / results_pp);

		embed.setTitle('Snippets');
		if (results.length > 0) {
			desc = '';
			if (forward == -1) {
				state.page = state.page - 1;
			}

			if (forward == 1) {
				state.page = state.page + 1;
			}

			var start = 0;
			if (state.page > 0) {
				start = state.page * results_pp;
			}

			var end = start + results_pp;

			if (start < 0) {
				start = 0;
			}

			if (end > results.length) {
				end = results.length - 1;
			}

			for (i => data in results.slice(start, end)) {
				var count = start + i + 1;
				desc += '**$count) [${data.title}](${data.url})**\n';
				if (state.desc) {
					desc += data.description + '\n';
				}
			}
		}

		embed.setColor(0xEA8220);
		embed.setDescription(desc);
		embed.setFooter(
			{iconURL: 'https://cdn.discordapp.com/emojis/567741748172816404.png?v=1',
				text: 'Page ${state.page + 1} / $max'}
		);
		return embed;
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
		var algo = FuzzySort.go(term, this.tags, {key: 'name', limit: 15, threshold: -1000});

		for (a in algo) {
			results.push(a.obj);
		}

		if (results.length == 0) {
			results = this.tags.slice(0, 20);
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

	function get_name():String {
		return 'snippet';
	}
}

typedef TListState = {
	var page:Int;
	var desc:Bool;
	var interacted_at:Float;
	var message:Message;
	var results:Array<TSnippet>;
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
