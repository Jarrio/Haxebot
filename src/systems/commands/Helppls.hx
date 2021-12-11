package systems.commands;

import Main.CommandForward;
import discord_js.Message;
import components.Command;
import discord_builder.BaseCommandInteraction;

class Helppls extends CommandBase {
	@:fastFamily var dm_messages:{type:CommandForward, message:Message};
	override function onAdded() {
	
	}

	override function update(_) {
		super.update(_);
	}

	function run(command:Command, interaction:BaseCommandInteraction) {
		switch (command.content) {
			case Helppls:
				interaction.user.send('test');
			default:
		}
	}

	function get_name():String {
		return 'helppls';
	}
}

typedef TQuestion = {
	var question:String;
	var answer:String;
}