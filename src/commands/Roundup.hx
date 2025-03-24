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

class Roundup extends CommandBase {
	var channel:TextChannel;
	final haxebot = #if block '416070484858372098' #else ' 661960123035418629' #end;
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
		switch (command.content) {
			case RoundupHost(user):
				state.roundup_roundup.host = user.id;
				Main.updateState('roundup_roundup');
				interaction.reply({content: 'Host has been set to <@${user.id}>', ephemeral: true}).then(null, (err) -> trace(err));
				user.send({
					content: "Just to confirm, you have been set to announce the next roundup roundup"
				}).then(null, dmError.bind(user));

			case RoundupAnnouncer(user):
				var obj = {
					id: user.id,
					user: user.tag
				}

				if (user.id == haxebot) {
					obj.id = null;
					obj.user = null;
				}

				Main.state.announcer = obj;
				Main.updateState('announcer');

				interaction.reply('Announcer has been set <@${user.id}>').then(null, (err) -> trace(err));
				if (obj.id == null) {
					return;
				}

				user.send({
					content: "
					You will be our roundup roundup announcer for this next event :) \n 
The way this will work is, when the host of the roundup starts the event, you will be given permission to @everyone in the #voice-text channel. 
**Wait until the host is ready and the event has been started!** The event time can change at any point, so make sure you're relatively free!
Feel free to add a message if you'd like, just don't use any other tag.\n
					You will be dm'd on the day as a reminder! Thanks!
				"
				}).then(null, dmError.bind(user));
			default:
		}
	}

	function dmError(user:User, err:Dynamic) {
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
	}

	function get_name():String {
		return 'roundup';
	}
}
