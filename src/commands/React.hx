package commands;

import discord_js.TextChannel;
import discord_builder.BaseCommandInteraction;
import components.Command;
import discord_js.Message;
import Main.CommandForward;
import systems.CommandBase;

class React extends CommandBase {
	function run(command:Command, interaction:BaseCommandInteraction) {
		switch (command.content) {
			case React(message_id, emoji):
				interaction.channel.messages.fetch(message_id).then(function(react_message) {
					react_message.asType0.react(emoji).then(function(_) {
						interaction.reply({content: '*reacted*', ephemeral: true}).then(null, (err) -> trace(err));
					}, (err) -> {
						interaction.reply({ephemeral: true, content: '*failed to react, not sure why. invalid emoji perhaps? ask notbilly if no obvious reason*'});
						trace(err);
					});
				});
			default:
		}
	}

	function get_name():String {
		return 'react';
	}
}
