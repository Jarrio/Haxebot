package systems.commands;

import discord_builder.BaseCommandInteraction;
import components.Command;

class Rtfm extends CommandBase {
	var data:Array<TRtfmFormat>;
	override function onEnabled() {
		this.data = loadFile('rtfm');
	}
	
	function run(command:Command, interaction:BaseCommandInteraction) {
		if (this.data == null) {
			trace("failed to read rtfm data");
			return;
		}
		switch (command.content) {
			case Rtfm(channel):
				var compare = channel;
				if (channel == null) {
					compare = interaction.channel.name;
				}
				
				for (item in data) {
					for (val in item.keys) {
						if (val == compare) {
							interaction.reply(item.content);
							return;
						}
					}
				}
				interaction.reply('No information available.');
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