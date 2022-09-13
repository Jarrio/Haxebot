package systems.commands;

import discord_builder.BaseCommandInteraction;
import discord_js.MessageEmbed;
import sys.FileSystem;
import components.Command;
import js.node.ChildProcess.spawn;

typedef CommandHistory = {
	var timestamp:Float;
	var interaction:BaseCommandInteraction;
}

class Haxelib extends CommandBase {
	var last_interaction:BaseCommandInteraction;
	final super_mod_id:String = '198916468312637440';
	var message_history:Map<String, MessageEmbed> = [];
	function run(command:Command, interaction:BaseCommandInteraction) {
		for (key => data in message_history) {
			var time = Date.now().getTime();
			if (time - data.timestamp > 5000) {
				message_history.remove(key);
			}
		}

		var role_status = hasRole(this.super_mod_id, interaction);
		switch (command.content) {
			case Haxelib(command):
				var route = command;

				if (route.contains(" ")) {
					route = route.split(" ")[0];
				}

				if (route != "list" && route != "info" && route != "search") {
					if (!role_status) {
						interaction.reply('Invalid Permissions.').then(null, err);
						return;
					}
				}
				var channel = (interaction.channel);
				var commands = [];
				for (c in command.split(' ')) {
					commands.push(c);
				}

				var process = './haxe/haxelib';
				if (!FileSystem.exists(process)) {
					process = 'haxelib';
				}

				var ls = spawn(process, commands);
				var output = '';
				ls.stdout.on('data', function(data:String) {
					//Filter out download progress from output message
					if (data.contains('KB') || data.contains('%')) {
						return;
					}
					output += data;
				});

				ls.stdout.once('close', (data) -> {
					var embed = new MessageEmbed().setTitle('Haxelib');
					if (output.length > 4000) {
						output = output.substr(0, 4000) + '...';
					}
					embed.setDescription(output);
					interaction.reply({embeds: [embed]}).then(null, err);
				});

				ls.stderr.on('data', (data) -> {
					var embed = new MessageEmbed();
					embed.type = 'article';
					embed.addField('Haxelib Error', data);

					channel.send(embed);
				});
			default:
	}

	}

	function addHistory(command:String, embed:MessageEmbed) {
		if (this.message_history.exists(command)) {
			return false;
		}

		this.message_history.set(command, embed);
		return true;
	}

	function get_name():String {
		return 'haxelib';
	}
}