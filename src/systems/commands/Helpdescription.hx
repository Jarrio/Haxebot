package systems.commands;

import discord_js.MessageEmbed;
import discord_builder.BaseCommandInteraction;
import components.Command;
import systems.commands.Helppls.TStoreContent;

class Helpdescription extends CommandDbBase {
	function run(command:Command, interaction:BaseCommandInteraction) {
		switch (command.content) {
			case Helpdescription(description):
				if (!interaction.channel.isThread()) {
					interaction.reply('This command is only available in a thread.').then(null, err);
					return;
				}
				this.findThread(interaction, description);
			default:
		}
	}

	function findThread(interaction:BaseCommandInteraction, description:String) {
		var q:Query<TStoreContent> = query(collection(db, 'test'), where('thread_id', EQUAL_TO, interaction.channelId));
		var embed = new MessageEmbed();
		embed.setDescription(description);
		Firestore.getDocs(q).then(function(docs) {
			if (docs.empty) {
				embed.setTitle('Error Occured');
				trace(interaction);
				trace(description);

				interaction.reply({content: '<@151104106973495296>', embeds: [embed]});
				return;
			}
			docs.forEach((doc) -> {
				var data = doc.data();
				data.description = description;
				data.solved = true;
				Firestore.setDoc(doc.ref, data).then(function(succ) {
					embed.setTitle('Thread Solution');
					interaction.reply({content: 'Thanks! <@${interaction.user.id}>', embeds: [embed]}).then(function(succ) {
						var command = Main.getCommand(this.name);
						if (command != null) {
							command.setCommandPermission([{
								id: interaction.user.id,
								type: USER,
								permission: false
							}]);
						}
					}, err);
				}, err);
			});
		}, err);
	}

	function get_name():String {
		return 'helpdescription';
	}
}
