package commands;

import discord_builder.BaseCommandInteraction;
import components.Command;
import systems.CommandBase;

class Boop extends CommandBase {
	function run(command:Command, interaction:BaseCommandInteraction) {
		switch (command.content) {
			case Boop(user):
				interaction.reply('*boop* <@${user.id}>');
			default:
		}
	}

	function get_name():String {
		return 'boop';
	}
}
