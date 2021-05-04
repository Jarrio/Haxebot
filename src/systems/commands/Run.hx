package systems.commands;

import discord_js.Message;
import components.Command;

class Run extends CommandBase {
	final super_mod_id:String = '198916468312637440';
	function run(command:Command, message:Message) {
		if (!hasRole(this.super_mod_id, message)) {
			message.react('❎').then(null, null);
			return;
		}
	}

	function get_name():String {
		return '!run';
	}
}
