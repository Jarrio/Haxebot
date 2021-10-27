package systems.commands;

import discord_builder.BaseCommandInteraction;
import components.Command;

class Help extends CommandBase {
	var data:Array<THelpFormat>;
	override function onAdded() {
		this.data = loadFile('help');
	}

	function run(command:Command, interaction:BaseCommandInteraction) {
		if (data == null || data.length == 0) {
			trace('no help content configured');
			return;
		}
		
		switch (command.content) {
			case Help(category):
				var msg = '';
				for (key => item in data) {
					if (category == null) {
						if (!item.show_help) {
							continue;
						}
						msg += '- `/${item.type}`: ${item.content}';
						if (key != data.length - 1) {
							msg += '\n';
						}
					} else {
						if (item.type == category) {
							msg = '/`${item.type}`: ${item.content}';
							break;
						}
					}
				}
				interaction.reply(msg);
			default:
		}
		
		//(message.channel:TextChannel).send(msg);
	}

	function get_name():String {
		return 'help';
	}
}

typedef THelpFormat = {
	var show_help:Bool;
	var type:HelpType;
	var content:String;
}

enum abstract HelpType(String) from String {
	var run;
	var rtfm;
	var notify;
	static function fromString(value:String) {
		return switch(value.toLowerCase()) {
			case 'run': run;
			case 'rtfm': rtfm;
			case 'notify': notify;
			default: 
				'Invalid help option.';
		};
	}
}
