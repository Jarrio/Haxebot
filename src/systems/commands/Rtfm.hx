package systems.commands;

import discord_builder.BaseCommandInteraction;
import discord_js.TextChannel;
import discord_js.Message;
import components.Command;

class Rtfm extends CommandBase {
	var data:Array<TRtfmFormat>;
	override function onAdded() {
		this.data = loadFile('rtfm');
	}
	
	function run(command:Command, interaction:BaseCommandInteraction) {
		if (this.data == null) {
			trace("failed to read rtfm data");
			return;
		}
		trace('here');
		switch (command.content) {
			case Rtfm(channel):
				var compare = '';
				if (channel == null) {
					compare = interaction.channel.name;
				}
				trace(compare);

				for (item in data) {
					trace(item.content);
					
					if(item.keys.exists((key) -> key == compare)) {
						interaction.reply(item.content);
						return;
					}
				}
			default:

		}


	}

	function get_name():String {
		return 'rtfm';
	}
}

typedef TRtfmFormat = {
	var keys:Array<String>;
	var content:String;
}