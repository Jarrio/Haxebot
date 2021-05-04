package systems.commands;

import discord_js.Message;
import components.Command;

class Hi extends CommandBase {
	override function run(command:Command, message:Message) {
		message.reply('Hey there');
	}

	override function get_name():String {
		return '!hi';
	}
}
