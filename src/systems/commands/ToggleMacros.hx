package systems.commands;

import discord_builder.BaseCommandInteraction;
import discord_js.Message;
import components.Command;

class ToggleMacros extends CommandBase {
	final super_mod_id:String = '198916468312637440';
	function run(command:Command, interaction:BaseCommandInteraction) {
		if (!hasRole(this.super_mod_id, interaction)) {
			return;
		}
		Main.config.macros = !Main.config.macros;
		var reply = 'Macros toggled ';
		if (Main.config.macros) {
			reply += 'ON';
		} else {
			reply += 'OFF';
		}
		interaction.reply(reply);
	}

	function get_name():String {
		return 'toggle';
	}
}