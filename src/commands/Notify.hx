package commands;
import Main.CommandForward;
import js.Browser;
import discord_builder.BaseCommandInteraction;
import components.Command;
import systems.CommandBase;

class Notify extends CommandBase {
	function getRole(channel:String) {
		return switch (channel) {
			// #events
			case 'events': #if block '738508312382799874' #else '1054432874473996408' #end;
			// #announcements
			case 'announcements': '761714325227700225';
			// #flixel
			case 'flixel': '761714697468248125';
			// #heaps
			case 'heaps': '761714775902126080';
			// #kha
			case 'kha': '761714809179209818';
			// #haxe-ui
			case 'haxeui': '761714853403820052';
			// #ceramic
			case 'ceramic': '914171888748609546';
			case 'reflaxe': '1200065966445449286';
			// #devserver notes test
			case 'dvorak': '903006951896666153';
			case 'jam': '1058843687687295066';
			case 'godot': '1059447670344794142';
			default: 'err';
		}
	}

	function run(command:Command, interaction:BaseCommandInteraction) {
		switch (command.content) {
			case Notify(channel):
				var role = this.getRole(channel);
				if (role == 'err') {
					trace(channel);
					trace(interaction.command);
					interaction.reply('Invalid channel');
					return;
				}

				interaction.member.fetch(true).then(function(member) {
					var found = false;
					for (key => _ in member.roles.cache) {
						if (key == role) {
							found = true;
							break;
						}
					}

					if (found) {
						interaction.member.roles.remove(role).then(function(success) {
							interaction.reply('Unsubscribed to $channel updates');
						}, function(err) {
							trace(err);
							Browser.console.dir(err);
						});
					} else {
						interaction.member.roles.add(role).then(function(success) {
							if (channel == 'announcements') {
								universe.setComponents(
									universe.createEntity(),
									CommandForward.auto_thread, member
								);
							}
							interaction.reply('Subscribed to $channel updates');
						}, function(err) {
							trace(err);
							Browser.console.dir(err);
						});
					}
				}, function(err) {
					trace(err);
					Browser.console.dir(err);
				});

			default:
		}
	}

	function get_name():String {
		return 'notify';
	}
}
