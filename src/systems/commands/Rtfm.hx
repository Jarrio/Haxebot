package systems.commands;

import discord_js.TextChannel;
import discord_js.Message;
import components.Command;

class Rtfm extends CommandBase {
	var data:Array<TRtfmFormat>;
	override function onAdded() {
		this.data = loadFile('rtfm');
	}
	
	function run(command:Command, message:Message) {
		if (this.data == null) {
			trace("failed to read rtfm data");
			return;
		}

		var compare = command.content;
		if (command.content == null) {
			compare = (message.channel:TextChannel).id;
		}

		for (item in data) {
			if(item.keys.exists((key) -> key == compare)) {
				(message.channel:TextChannel).send(item.content);
				return;
			}
		}
	}

	function get_name():String {
		return '!rtfm';
	}
}

typedef TRtfmFormat = {
	var keys:Array<String>;
	var content:String;
}