package systems.commands;

import discord_js.Message;
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
			default: 'err';
		}
	}

	function run(command:Command, message:Message) {
		for (index => channel in command.content.split(' ')) {
			if (index == 0) {
				continue;
			}
			var role = this.getRole(channel);
			if (role == 'err') {
				message.react('❎');
				continue;
			}

			var found = false;
			for (key => _ in message.member.roles.cache) {
				if (key == role) {
					found = true;
					break;
				}
			}

			if (found) {
				message.member.roles.remove(role).then((success) -> {
					message.reply('Unsubscribed from $channel updates');
				});
			} else {
				message.member.roles.add(role).then((success) -> {
					message.reply('Subscribed to $channel updates');
				});
			}
		}
	}

	function get_name():String {
		return '!notify';
	}
}
