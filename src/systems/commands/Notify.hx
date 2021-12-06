package systems.commands;

import discord_builder.BaseCommandInteraction;
import components.Command;

class Notify extends CommandBase {
	function getRole(channel:String) {
		return switch (channel) {
			// #announcements
			case '<#286485321925918721>' | 'announcements': '761714325227700225';
			// #flixel
			case '<#165234904815239168>' | 'flixel': '761714697468248125';
			// #heaps
			case '<#501408700142059520>' | 'heaps': '761714775902126080';
			// #kha
			case '<#501447516852715525>' | 'kha': '761714809179209818';
			// #haxe-ui
			case '<#565569107701923852>' | 'haxeui': '761714853403820052';
			// #ceramic
			case '<#853414608747364352>' | 'ceramic': '914171888748609546';
			// #devserver notes test
			case '<#561254298449739776>' | 'dvorak': '903006951896666153';
			default: 'err';
		}
	}

	function run(command:Command, interaction:BaseCommandInteraction) {
		switch (command.content) {
			case Notify(channel):
				for (channel in channel.split(' ')) {
					var role = this.getRole(channel);
					if (role == 'err') {
						continue;
					}
		
					var found = false;
					for (key => _ in interaction.member.roles.cache) {
						if (key == role) {
							found = true;
							break;
						}
					}
		
					if (found) {
						interaction.member.roles.remove(role).then((success) -> {
							interaction.reply('Unsubscribed from $channel updates');
						});
					} else {
						interaction.member.roles.add(role).then((success) -> {
							interaction.reply('Subscribed to $channel updates');
						});
					}
				}
			default:
		}
	}

	function get_name():String {
		return 'notify';
	}
}