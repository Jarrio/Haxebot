package commands;

import discord_js.TextChannel;
import discord_js.User;
import discord_builder.BaseCommandInteraction;
import components.Command;
import systems.CommandBase;
import database.DBEvents;
import database.types.DBState;
import Query.query;

using StringTools;

class RoundupAnnouncer extends CommandBase {
	var channel:TextChannel;
	final channel_id = #if block "597067735771381771" #else "663246792426782730" #end;

	override function onEnabled() {
		Main.client.channels.fetch(channel_id).then(function(ch) {
			if (ch != null) {
				this.channel = ch;
				trace("RoundupAnnouncer got channel");
			}
		});
	}

	function run(command:Command, interaction:BaseCommandInteraction) {
		interaction.reply("Announcer has been set").then(function(_) {
			switch (command.content) {
				case Rrannouncer(user):
					var obj = {
						id: user.id,
						user: user.tag
					}

					Main.state.announcer = obj;
					Main.updateState('announcer');

					user.send({
						content: "
					You will be our roundup roundup announcer for this next event :) \n 
The way this will work is, when the host of the roundup starts the event, you will be given permission to @everyone in the #voice-text channel. Feel free to add a message if you'd like, just don't use any other tag.\n
							You will be dm'd on the day as a reminder! Thanks!
				"
					}).then(null, function(err) {
						if (err?.rawError?.message != null) {
							var error:String = err.rawError.message;
							if (error.indexOf('Cannot send messages') != -1) {
								trace("User has dms off");
								if (channel != null) {
									channel.send({content: '<@${user.id}> Please open a DM channel with me'}).then(null, (err) -> trace(err));
								}
							}
						} else {
							trace(Json.stringify(err));
						}
					});
				default:
			}
		});
	}

	function get_name():String {
		return 'rrannouncer';
	}
}
