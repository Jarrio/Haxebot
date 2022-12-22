package commands;

import discord_builder.BaseCommandInteraction;
import components.Command;
import systems.CommandBase;

class Help extends CommandBase {
	var data:Array<THelpFormat>;

	override function onEnabled() {
		this.data = loadFile('help');
	}

	function run(command:Command, interaction:BaseCommandInteraction) {
		if (data == null || data.length == 0) {
			trace('no help content configured');
			return;
		}

		if (Main.dm_help_tracking.exists(interaction.user.id)) {
			for (content in this.data) {
				if (content.type != helppls_dm) {
					continue;
				}
				interaction.reply({content: content.content.toString()}).then(null, err);
				break;
			}
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
						if (item.type == HelpType.run) {
							msg += '- `!${item.type}`: ${item.content.toString()}';
						} else {
							msg += '- `/${item.type}`: ${item.content.toString()}';
						}
						if (key != data.length - 1) {
							msg += '\n';
						}
					} else {
						if (item.type == category) {
							msg = '/`${item.type}`: ${item.content.toString()}';
							break;
						}
					}
				}

				if (msg.length == 0 || msg == '' || msg == null) {
					msg = 'Nothing found, sorry :(';
				}

				interaction.reply(msg).then(null, err);
			default:
		}
	}

	function get_name():String {
		return 'help';
	}
}

typedef THelpFormat = {
	var show_help:Bool;
	var type:HelpType;
	var content:Array<String>;
}

enum abstract HelpType(String) from String {
	var run;
	var rtfm;
	var notify;
	var helppls;
	var helppls_dm;

	static function fromString(value:String) {
		return switch (value.toLowerCase()) {
			case 'run': run;
			case 'rtfm': rtfm;
			case 'notify': notify;
			case 'helppls_dm': helppls_dm;
			default:
				'Invalid help option.';
		};
	}
}
