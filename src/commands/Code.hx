package commands;

import discord_js.MessageEmbed;
import discord_builder.APIActionRowComponent;
import discord_builder.APITextInputComponent;
import discord_builder.ModalBuilder;
import discord_builder.BaseCommandInteraction;
import components.Command;
import systems.CommandBase;
import Main.CommandForward;

class Code extends CommandBase {
	@:fastFamily var something_else:{forward:CommandForward, interaction:BaseCommandInteraction};

	override function update(_:Float) {
		super.update(_);
		iterate(something_else, entity -> {
			trace('here');
			trace(forward);
			switch (forward) {
				case code_paste:
					var start = interaction.fields.getTextInputValue('start').parseInt();
					var problem = interaction.fields.getTextInputValue('problem');
					var code = cleanSpace(interaction.fields.getTextInputValue('code'));

					if (start == null) {
						start = 1;
					}

					var embed = new MessageEmbed();
					var desc = '';
					var new_code = '';
					for (key => value in code.split('\n')) {
						new_code += '${start + key}: $value\n';
					}
					
					var content = '**__Code__**\n```hx\n$new_code\n```\n**__Problem__**\n$problem';
					embed.setDescription(content);
					interaction.reply({embeds: [embed]}).then(null, (err) -> trace(err)); 
					this.universe.deleteEntity(entity);
				default:
			}
		});
	}

	function cleanSpace(code:String) {
		var shallowest = 500;
		var largest = 0;
		var tabs = false;

		code = code.replace('`', '\\`');

		for (line in code.split('\n')) {
			var first_char_pos = -1;
			var depth = 0;

			for (i in 0...line.length) {
				var char = line.charAt(i);
				if (char == ' ' || char == '\t') {
					if (char == '\t') {
						tabs = true;
					}
					continue;
				}
				first_char_pos = i;
				depth = i;
				break;
			}

			if (depth < shallowest && depth != 0) {
				shallowest = depth;
			}

			if (depth > largest) {
				largest = depth;
			}
		}

		var new_code = '';
		for (line in code.split('\n')) {
			new_code += line.substring(shallowest) + '\n';
		}
		return new_code;
	}

	function run(command:Command, interaction:BaseCommandInteraction) {
		var modal = new ModalBuilder().setCustomId('code_paste').setTitle('Code paste');

		var problem = new APITextInputComponent().setCustomId('problem')
			.setLabel('Problem description')
			.setStyle(Paragraph)
			.setRequired(true)
			.setPlaceholder('Describe your issue and post any error messages here');
		var from = new APITextInputComponent().setCustomId('start')
			.setLabel('First line number')
			.setStyle(Short)
			.setMinLength(1)
			.setMaxLength(5)
			.setPlaceholder('The starting line number of the code you are pasting');

		var code = new APITextInputComponent().setCustomId('code')
			.setLabel('Code')
			.setStyle(Paragraph)
			.setMinLength(10)
			.setMaxLength(2000);

		var action_a = new APIActionRowComponent().addComponents(from);
		var action_c = new APIActionRowComponent().addComponents(code);
		var action_d = new APIActionRowComponent().addComponents(problem);

		modal.addComponents(action_a, action_c, action_d);
		interaction.showModal(modal);
	}

	function get_name():String {
		return 'code';
	}
}
