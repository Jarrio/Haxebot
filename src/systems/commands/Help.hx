package systems.commands;

import discord_js.TextChannel;
import haxe.Json;
import sys.io.File;
import ecs.Universe;
import discord_js.Message;
import components.Command;

class Help extends CommandBase {
	var data:Array<THelpFormat>;
	public function new(universe:Universe) {
		super(universe);
		try {
			this.data = Json.parse(File.getContent('./commands/help.json'));
		} catch (e) {
			trace(e);
			trace('Failed to load file or parse json');
		}
	}

	function run(command:Command, message:Message) {
		if (data == null || data.length == 0) {
			trace('no help content configured');
			return;
		}
		
		var msg = '';
		
		for (key => item in data) {
			if (command.content == null) {
				msg += '`${item.type}: ${item.content}';
				if (key != data.length - 1) {
					msg += '\n';
				}
			} else {
				if (item.type == command.content) {
					msg = '`${item.type}: ${item.content}';
					break;
				}
			}
		}

		(message.channel:TextChannel).send(msg);
	}

	function get_name():String {
		return '!help';
	}
}

typedef THelpFormat = {
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
