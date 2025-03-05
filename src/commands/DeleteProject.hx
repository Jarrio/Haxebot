package commands;

import js.Browser;
import commands.types.ContextMenuTypes;
import discord_js.ThreadChannel;
import discord_builder.BaseCommandInteraction;
import components.Command;
import systems.CommandBase;
import Main.CommandForward;
import discord_builder.ButtonBuilder;
import discord_builder.APIActionRowComponent;

class DeleteProject extends CommandBase {
	@:fastFamily var options:{route:ContextMenuTypes, interaction:BaseCommandInteraction};

	override function update(_) {
		iterate(options, entity -> {
			switch (route) {
				case DeleteProject:
					var author = interaction.user.id;
					if (interaction.channel.isThread()) {
						var confirm = new ButtonBuilder().setCustomId('deleteProjectConfirm').setLabel('Confirm Delete').setStyle(ButtonStyle.Danger);
						var cancel = new ButtonBuilder().setCustomId('deleteProjectCancel').setLabel('Cancel').setStyle(ButtonStyle.Secondary);
						var row = new APIActionRowComponent();
						row.addComponents(cancel, confirm);

						try {
							var thread = cast(interaction.channel, ThreadChannel);
							if (thread.ownerId == author) {
								interaction.reply({
									ephemeral: true,
									content: "Are you sure you want to delete this project? All messages within this thread will be erased - It is **permanent** and **cannot** be undone.",
									components: [row]
								}).then(function(response) {
									response.awaitMessageComponent({
										filter: function(a, b) {
											switch (a.customId) {
												case 'deleteProjectConfirm':
													thread.delete('User requested delete').then(null, (err) -> trace(err));
												default:
													a.update({content: "Request cancelled.", components: []}).then(null, (err) -> trace(err));
											}
										}
									}).then(null, function(err) {
										if ((err?.message : String).indexOf('threadDelete') != -1) {
											return;
										}
										trace(err);
									});
								}, (err) -> trace(err));
							} else {
								interaction.reply({content: "This isn't your thread! :angry:", ephemeral: true});
							}
						} catch (e ) {
							trace('thread cast failed');
						}
					} else {
						interaction.reply({
							content: '*This only works for threads :)*',
							ephemeral: true
						}).then(null, function(err) trace(err));
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
