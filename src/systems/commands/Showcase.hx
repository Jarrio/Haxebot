package systems.commands;

import discord_js.ThreadChannel;
import components.ShowcaseModalSubmit;
import discord_builder.APITextInputComponent;
import discord_builder.APIActionRowComponent;
import discord_builder.ModalBuilder;
import discord_js.TextChannel;
import discord_builder.BaseCommandInteraction;
import components.Command;
import Main.CommandForward;
import discord_js.Message;

class Showcase extends CommandBase {
	var channel:TextChannel;
	var checking = false;
	@:fastFamily var modal:{command:BaseCommandInteraction, modal:ShowcaseModalSubmit};
	@:fastFamily var xpost:{command:CommandForward, message:Message};

	override function update(_:Float) {
		super.update(_);
		if (this.channel == null && !checking) {
			checking = true;
			Main.client.channels.fetch('162664383082790912').then(function(channel) {
				this.channel = channel;
				checking = false;
				trace('loaded showcase channel');
			}, (err) -> trace(err));
		}

		iterate(modal, entity -> {
			this.channel.send('${modal.title_or_link} \n ${modal.description}').then(function(_) {
				command.reply('Your post was submitted to the showcase channel!');
			});

			this.universe.deleteEntity(entity);
		});

		iterate(xpost, entity -> {
			if (command != CommandForward.showcase && !channel.isThread()) {
				return;
			}

			var thread = cast(message.channel.asType0, ThreadChannel);
			if (thread.ownerId != message.author.id) {
				return;
			}

			var content = message.content.substring(10).trim();
			this.channel.send('Showcase: <#${thread.id}> \nBy: <@${message.author.id}>\n\n$content').then(null, (err) -> trace(err));
			
			this.universe.deleteEntity(entity);
		});
	}

	function run(command:Command, interaction:BaseCommandInteraction) {
		var modal = new ModalBuilder().setCustomId('showcase').setTitle('Showcase');

		var title_input = new APITextInputComponent().setCustomId('titlelink').setLabel('Title or Link').setStyle(Short).setRequired(true);
		var description_input = new APITextInputComponent().setCustomId('description').setLabel('Description').setRequired(false).setStyle(Paragraph);

		var row_1 = new APIActionRowComponent().addComponents(title_input);
		var row_2 = new APIActionRowComponent().addComponents(description_input);

		modal.addComponents(row_1, row_2);
		interaction.showModal(modal).then((succ) -> trace('win'), (err) -> trace(err));
	}

	function get_name():String {
		return 'showcase';
	}
}
/*
	{
	"name": "link",
	"type": "string",
	"description": "link",
	"required": false
	}, {
	"name": "title",
	"type": "string",
	"description": "link",
	"required": false
	}, {
	"name": "description",
	"type": "string",
	"description": "link",
	"required": false
	}
 */
