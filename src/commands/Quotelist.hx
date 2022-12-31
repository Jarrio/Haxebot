package commands;

import commands.Quote.TQuoteData;
import firebase.web.firestore.CollectionReference;
import discord_js.MessageEmbed;
import discord_builder.BaseCommandInteraction;
import components.Command;
import Main.CommandForward;
import systems.CommandDbBase;

class Quotelist extends CommandDbBase {
	@:fastFamily var modal:{forward:CommandForward, interaction:BaseCommandInteraction};
	var cache:Map<String, Int> = [];
	final max_name_length = 20;

	function run(command:Command, interaction:BaseCommandInteraction) {
		switch (command.content) {
			case Quotelist(user):
				var sort = Firestore.orderBy('id', ASCENDING);
				var col:CollectionReference<TQuoteData> = collection(this.db, 'discord/quotes/entries');
				var query = Firestore.query(col, sort);
				if (user != null) {
					query = Firestore.query(col, where('author', EQUAL_TO, user.id), sort);
				}

				Firestore.getDocs(query).then(function(resp) {
					var embed = new MessageEmbed();
					embed.setTitle('List of Quotes');
					var body = '';
					for (doc in resp.docs) {
						var data = doc.data();
						body += '**#${data.id}** ${data.name} by <@${data.author}> \n';
					}
					embed.setDescription(body);
					embed.setColor(0xEA8220);
					interaction.reply({embeds: [embed]});
				}, err);
			default:
		}
	}

	function get_name():String {
		return 'quotelist';
	}
}
