package commands;

import discord_js.MessageEmbed;
import discord_js.TextChannel;
import firebase.web.firestore.DocumentReference;
import components.Command;
import discord_builder.BaseCommandInteraction;
import systems.CommandDbBase;

class SnippetAdd extends CommandDbBase {
	var sent:Array<TSnippet> = [];

	override function onEnabled() {
		Firestore.onSnapshot(collection(this.db, 'discord/snippets/entries'), function(resp) {
			var arr = [];

			for (item in resp.docs) {
				arr.push(item.data());
			}
		});
	}

	function run(command:Command, interaction:BaseCommandInteraction) {
		switch (command.content) {
			case SnippetAdd(title, description, url, tags):
				var obj:TSnippet = {
					id: -1,
					submitted_by: interaction.user.id,
					timestamp: Date.now().getTime(),
					title: title,
					description: description,
					url: url,
					tags: []
				}

				if (tags.contains(',')) {
					obj.tags = tags.split(',');
					for (item in obj.tags) {
						item = StringTools.trim(item);
					}
				} else {
					obj.tags = [tags];
				}

				var doc = doc(db, 'discord/snippets');
				var col = Firestore.collection(this.db, 'discord/snippets/entries');
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
			default:
		}
	}

	override function update(_) {
		super.update(_);
	}

	function get_name():String {
		return 'snippetadd';
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
