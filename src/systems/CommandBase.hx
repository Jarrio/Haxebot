package systems;

import haxe.exceptions.NotImplementedException;
import discord_js.Message;
import components.Command;
import ecs.System;
class CommandBase extends System {
	@:fastFamily var commands:{command:Command, message:Message};
	override function update(_dt:Float) {
		if (!Main.connected) {
			return;
		}
		iterate(commands, entity -> {
			if (command.name == this.name) {
				this.run(command, message);
				this.commands.remove(entity);
			}
		});
	}

	function run(command:Command, message:Message):Void {
		throw NotImplementedException;
	}
	var block:Bool;
	var name(get, never):String;
	function get_name():String {
		throw NotImplementedException;
	}
}