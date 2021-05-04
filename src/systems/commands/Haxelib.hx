package systems.commands;

import discord_js.TextChannel;
import discord_js.MessageEmbed;
import sys.FileSystem;
import ecs.System;
import discord_js.Message;
import components.Command;
import js.node.ChildProcess.spawn;

class Haxelib extends System {
	@:fastFamily var commands:{command:Command, message:Message};
	var message_id:String;
	final super_mod_id:String = '198916468312637440';
	
	override function update(_dt:Float) {
		if (!Main.connected) {
			return;
		}

		iterate(commands, entity -> {
			if (command.name == this.get_name()) {
				this.run(command, message);
				this.commands.remove(entity);
			}
		});
	}	

	function run(command:Command, message:Message) {
		if (command.content != "list" || !hasRole(this.super_mod_id, message)) {
			message.react('❎').then(null, null);
			return;
		}
		var channel = (message.channel:TextChannel);
		var commands = [];
		for (c in command.content.split(' ')) {
			commands.push(c);
		}

		var process = './haxe/haxelib';
		if (!FileSystem.exists(process)) {
			process = 'haxelib';
		}

		var ls = spawn(process, commands);
		ls.stdout.on('data', function(data:String) {
			if (!data.contains("KB") && !data.contains("%")) {
				if (this.message_id == null) {
					var embed = new MessageEmbed();
					embed.setTitle('Status');
					embed.setDescription(data);
					channel.send(embed).then((data) -> {
						this.message_id = data.id;
					}, null);
				} else {
					channel.messages.fetch(this.message_id).then((response) -> {
						var embed = response.embeds[0];
						embed.description += '\n$data';
						response.edit(embed);
					}, null);
				}
			}
		});

		ls.stderr.on('data', (data) -> {
			var embed = new MessageEmbed();
			embed.type = 'article';
			embed.addField('Haxelib Error', data);

			channel.send(embed);
		});

		ls.on('close', (data) -> {
			this.message_id = null;
		});
	}

	function get_name():String {
		return '+haxelib';
	}
}