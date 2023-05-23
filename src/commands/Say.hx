package commands;

import discord_builder.BaseCommandInteraction;
import components.Command;
import systems.CommandBase;

class Say extends CommandBase {
	function run(command:Command, interaction:BaseCommandInteraction) {
		switch (command.content) {
			case Say(message, message_id):
				if (message_id == null) {
					interaction.channel.sendTyping().then((_) -> {
						interaction.channel.send({content: message}).then(null, (err) -> trace(err));
						interaction.reply({content: "sent", ephemeral: true});
					});
				} else {
					interaction.channel.messages.fetch(message_id).then(function(reply) {
						reply.asType0.reply({content: message})
							.then(null, (err) -> trace(err));
						interaction.reply({content: "sent", ephemeral: true});
					}, (err) -> trace(err));
				}
			default:
		}
	}

	function get_name():String {
		return 'say';
	}
}
