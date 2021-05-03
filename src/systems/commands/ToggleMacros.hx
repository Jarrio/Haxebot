package systems.commands;

import discord_js.Message;
import components.Command;

class ToggleMacros extends CommandBase {
	final super_mod_id:String = '198916468312637440';
	function run(command:Command, message:Message) {
		var guild = message.guild.roles.cache.get(super_mod_id);
		if (message.guild.available && !guild!.members!.has(message.author.id)) {
			message.react('❎').then(null, null);
			return;
		}
		Main.config.macros = !Main.config.macros;
		var reply = 'Macros toggled ';
		if (Main.config.macros) {
			reply += 'ON';
		} else {
			reply += 'OFF';
		}
		message.reply(reply);
	}

	function get_name():String {
		return '+toggle';
	}
}
