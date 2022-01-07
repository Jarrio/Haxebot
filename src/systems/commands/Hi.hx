package systems.commands;

import discord_builder.BaseCommandInteraction;
import components.Command;

class Hi extends CommandBase {
	function run(command:Command, interaction:BaseCommandInteraction) {
		var message = '';
		switch (interaction.user.id) {
			case '817154767733653524':
				message = 'Hello ${interaction.user.tag}, always a pleasure :)';
			case '726161533540761662':
				message = "Hi muffin, don't make me go sleep :(";
			case '415825875146375168': 
				message = "Hey semmi, got any cool music tonight?";
			default:
				
		}

		if (Math.random() > 0.3) {
			message = 'Hey there';
		}
		
		interaction.reply(message);
	}

	function get_name():String {
		return 'hi';
	}
}