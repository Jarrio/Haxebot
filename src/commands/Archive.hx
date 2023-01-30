package commands;

import discord_builder.BaseCommandInteraction;
import components.Command;
import systems.CommandBase;

class Archive extends CommandBase {
	function run(command:Command, interaction:BaseCommandInteraction) {
		switch (command.content) {
			case Archive:
				// Archive role
				var role = '1019915584546291712';

				interaction.member.fetch(true).then(function(member) {
					var found = false;
					for (key => _ in member.roles.cache) {
						if (key == role) {
							found = true;
							break;
						}
					}

					if (found) {
						interaction.member.roles.remove(role).then(function(success) {
							interaction.reply('Archives are hidden');
						}, function(err) trace(err));
					} else {
						interaction.member.roles.add(role).then(function(success) {
							interaction.reply('Archives are shown');
						}, function(err) trace(err));
					}
				}, function(err) trace(err));

			default:
		}
	}

	function get_name():String {
		return 'archive';
	}
}
