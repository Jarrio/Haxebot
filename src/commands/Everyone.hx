package commands;

import discord_js.MessageAttachment;
import discord_js.MessageEmbed;
import firebase.web.app.FirebaseApp;
import discord_js.Message;
import systems.CommandBase;
import discord_builder.BaseCommandInteraction;
import components.Command;
import discord_js.ThreadChannel;

class Everyone extends CommandBase {

	override function onEnabled() {}
	function run(command:Command, interaction:BaseCommandInteraction) {
		switch(command.content) {
			case Everyone(content):
				if (interaction.channel.isThread()) {
					var channel:ThreadChannel = cast interaction.channel;
					if (channel.ownerId != interaction.user.id) {
						// only thread owner can mention
						interaction.reply({
							ephemeral: true,
							content: "You're not the owner of this thread"
						}).then(null, (err) -> trace(err));
						return;
					}

					interaction.reply({
						content: '@everyone - $content',
						allowedMentions: {
							parse: [everyone]
						}
					}).then(null, (err) -> trace(err));
				} else {
					interaction.reply({
						ephemeral: true,
						content: "This command can only be activated from within a thread and one you must be the person who created it"
					}).then(null, (err) -> trace(err));
				}
			default:
		}
	}

	function get_name():String {
		return 'everyone';
	}
}