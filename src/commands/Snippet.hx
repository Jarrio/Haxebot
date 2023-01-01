package commands;

import discord_js.MessageEmbed;
import discord_js.TextChannel;
import firebase.web.firestore.DocumentReference;
import components.Command;
import discord_builder.BaseCommandInteraction;
import systems.CommandDbBase;

class Snippet extends CommandDbBase {
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
			case Snippet(title, tags):
				var obj:TSnippet = {
					submitted_by: "",
					tags: [],
					title: "",
					description: "",
					code: "",
					url: ""
				}

				var col = Firestore.collection(this.db, 'discord/reminders/entries');
				Firestore.addDoc(col, obj).then(function(doc) {
					var post_time = Math.round((obj.timestamp + obj.duration) / 1000);
					interaction.reply({
						ephemeral: personal,
						content: 'Your reminder has been set for <t:${post_time}>'
					}).then(function(msg) {
						obj.id = doc.id;
						Firestore.updateDoc(doc, obj).then(null, function(err) {
							trace(err);
						});
					}, err);
				}, err);
			default:
		}
	}

	override function update(_) {
		super.update(_);
	}

	function get_name():String {
		return 'snippet';
	}
}

typedef TSnippet = {
	var submitted_by:String;
	var url:String;
	var code:String;
	var title:String;
	var description:String;
	var tags:Array<String>;
}
