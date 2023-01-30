package commands;

import commands.types.ContextMenuTypes;
import discord_js.ThreadChannel;
import discord_builder.BaseCommandInteraction;
import components.Command;
import systems.CommandDbBase;
import Main.CommandForward;

class PinMessage extends CommandDbBase {
	@:fastFamily var options:{route:ContextMenuTypes, interaction:BaseCommandInteraction};

	override function update(_) {
		iterate(options, entity -> {
			switch (route) {
				case pin_message:
					var author = interaction.user.id;
					if (interaction.channel.isThread()) {
						try {
							var thread = cast(interaction.channel, ThreadChannel);
							if (thread.ownerId == author) {
								if (interaction.targetMessage.pinned) {
									interaction.targetMessage.unpin().then(function(_) {
										interaction.reply({content: 'Unpinned', ephemeral: true});
									}, function(err) trace(err));
								} else {
									interaction.targetMessage.pin().then(function(_) {
										interaction.reply({content: 'Pinned', ephemeral: true});
									}, function(err) {
										var message = null;
										switch(err.code) {
											case 50021:
												message = "Can't pin a system message";
											default: 
												message = err.message + '\n\n Contact NotBilly about this';
										}
										trace(err);
										interaction.reply(message).then(null, function(err) trace(err));
									});
								}
							} else {
								interaction.reply({content: "This isn't your thread!", ephemeral: true});
							}
						} catch (e) {
							trace('thread cast failed');
						}
					} else {
						interaction.reply(
							{content: '*Currently this only works for user threads :)*',
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
		return 'pinmessage';
	}
}
