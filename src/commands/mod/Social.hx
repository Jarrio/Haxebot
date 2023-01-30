package commands.mod;

import js.Browser;
import components.Command;
import discord_builder.BaseCommandInteraction;
import systems.CommandDbBase;

class Social extends CommandDbBase {
	function run(command:Command, interaction:BaseCommandInteraction) {
		switch (command.content) {
			case Social(tag, user):
				this.parseTwitter(interaction, tag, user);
			default:
		}
	}

	function parseTwitter(interaction:BaseCommandInteraction, tag:String, user:String) {
		if (tag == null && user == null) {
			interaction.reply('Invalid input').then(null, function(err) {
				trace(err);
				Browser.console.dir(err);
			});
			return;
		}

		if (tag != null) {
			var doc = Firestore.doc(db, 'discord/social');
			Firestore.updateDoc(doc, {
				twitter_tags: Firestore.arrayUnion(tag)
			}).then(function(_) {
				if (!interaction.replied) {
					interaction.reply('Updated collection!');
				}
			});
		}

		if (user != null) {
			var doc = Firestore.doc(db, 'discord/social');
			Firestore.updateDoc(doc, {
				twitter_users: Firestore.arrayUnion(user)
			}).then(function(_) {
				if (!interaction.replied) {
					interaction.reply('Updated collection!');
				}
			});
		}
	}

	function get_name():String {
		return 'social';
	}
}

typedef TSocial = {
	var twitter_tags:Array<String>;
	var twitter_users:Array<String>;
}

enum abstract SocialPlatform(String) from String {
	var twitter;
}
