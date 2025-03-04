package commands;

import discord_js.User;
import discord_builder.BaseCommandInteraction;
import components.Command;
import systems.CommandBase;
import database.DBEvents;

class RoundupAnnouncer extends CommandBase {
	function run(command:Command, interaction:BaseCommandInteraction) {
		interaction.reply("Announcer has been set").then(function(_) {
			switch (command.content) {
				case Rrannouncer(user):
					var obj = {
						id: user.id,
						user: user.tag
					}

					//Main.state.announcer = obj;
					Main.updateState('announcer', obj);
					
					user.send({
						content: "
					You will be our roundup roundup announcer for this next event :) \n 
The way this will work is, when the host of the roundup starts the event, you will be given permission to @everyone in the #voice-text channel. Feel free to add a message if you'd like, just don't use any other tag.\n
							You will be dm'd on the day as a reminder! Thanks!
				"
					}, (err) -> trace(err));
				default:
			}
		});
	}

	function get_name():String {
		return 'rrannouncer';
	}
}
