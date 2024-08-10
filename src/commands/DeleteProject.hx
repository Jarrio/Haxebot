package commands;

import commands.types.ContextMenuTypes;
import discord_js.ThreadChannel;
import discord_builder.BaseCommandInteraction;
import components.Command;
import systems.CommandDbBase;
import Main.CommandForward;

class DeleteProject extends CommandDbBase {
	@:fastFamily var options:{route:ContextMenuTypes, interaction:BaseCommandInteraction};

	override function update(_) {
		iterate(options, entity -> {
			switch (route) {
				case DeleteProject:
					var author = interaction.user.id;
					if (interaction.channel.isThread()) {
						try {
							var thread = cast(interaction.channel, ThreadChannel);
							if (thread.ownerId == author) {
								interaction.reply('Deleting...').then(function(_) {
									interaction.channel.delete('author requested').then(null, (err) -> trace(err));
								});
							} else {
								interaction.reply({content: "This isn't your thread! :angry:", ephemeral: true});
							}
						} catch (e) {
							trace('thread cast failed');
						}
					} else {
						interaction.reply(
							{content: '*This only works for threads :)*',
								ephemeral: true}
						).then(null, function(err) trace(err));
					}
					universe.deleteEntity(entity);
				default:
			}
		});
	}

	function run(command:Command, interaction:BaseCommandInteraction) {
		trace('here');
	}

	function get_name():String {
		return 'deleteproject';
	}
}
