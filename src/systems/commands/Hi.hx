package systems.commands;

import discord_builder.BaseCommandInteraction;
import components.Command;

class Hi extends CommandBase {
	function run(command:Command, interaction:BaseCommandInteraction) {
		var message = 'Hey there';
		if (Math.random() < 0.35) {
			message = switch (interaction.user.id) {
				case '817154767733653524': 'Hello ${interaction.user.tag}, always a pleasure :)';
				case '726161533540761662': "Hi muffin, having a good day? :)";
				case '781745960829059072': "Hi FS, don't make me go sleep :(";
				case '415825875146375168': "Hey semmi, got any cool music tonight? \\o/";
				case '215582414544699393': "Hello Bulby! ReAD ArCH NeWS! :face_with_hand_over_mouth:";
				case '231872730478280705': "Hey logo, how jammy are you feeling today? :jam:";
				default: "Hey you, what's up?";
			}
		}
		interaction.reply({content: message}).then(null, err);
	}

	function get_name():String {
		return 'hi';
	}
}
