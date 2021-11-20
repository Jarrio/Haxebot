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
				if (command != "list" && !role_status) {
					interaction.reply('Invalid Permissions.').then(null, null);
					return;
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
				var id = interaction.id;
				var ls = spawn(process, commands);
				ls.stdout.on('data', function(data:String) {
					trace(data);
					var embed = new MessageEmbed().setTitle('Haxelib');
					
					if (!data.contains("KB") && !data.contains("%")) {
						if (!this.message_history.exists(id)) {
							embed = embed.setDescription(data.toString());
							interaction.reply({embeds: [embed]}).then(function(data) {
								this.addHistory(command, embed);
							}, (err) -> trace(err));
						} else {
							embed = this.message_history.get(id);
							embed = embed.setDescription(embed.description + data.toString());
							interaction.editReply({embeds: [embed]}).then(null, (err) -> trace(err));
						}
					}
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