package commands;

import discord_js.ThreadChannel;
import discord_builder.BaseCommandInteraction;
import components.Command;
import systems.CommandDbBase;
import Main.CommandForward;

class PinMessage extends CommandDbBase {
	@:fastFamily var options:{route:CommandForward, interaction:BaseCommandInteraction};

	override function update(_) {
		iterate(options, entity -> {

			var author = interaction.user.id;
			if (interaction.channel.isThread()) {
				try {
					var thread = cast(interaction.channel, ThreadChannel);
					if (thread.ownerId == author) {
						if (interaction.targetMessage.pinned) {
							interaction.targetMessage.unpin();
							interaction.reply({content: 'Unpinned', ephemeral: true});
						} else {
							interaction.targetMessage.pin();
							interaction.reply({content: 'Pinned', ephemeral: true});
						}
					} else {
						interaction.reply({content: "This isn't your thread!", ephemeral: true});
					}
					return; 
				} catch (e) {
					trace('thread cast failed');
				}
			}

			interaction.reply({content: '*Currently this only works for user threads :)*', ephemeral: true});
			universe.deleteEntity(entity);
		});
	}

	function run(command:Command, interaction:BaseCommandInteraction) {
		trace('here');
	}

	function get_name():String {
		return 'pinmessage';
	}
}
