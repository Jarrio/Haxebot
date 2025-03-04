package systems;

import ecs.System;
import components.TextCommand;
import discord_js.Message;

abstract class TextCommandBase extends System {
	@:fastFamily var commands:{command:TextCommand, message:Message};

	override function update(_) {
		if (!Main.discord_connected || !Main.commands_active) {
			return;
		}
		iterate(commands, entity -> {
			if (command == this.name) {
				this.run(message, message.content.replace(this.name, ''));
				this.universe.deleteEntity(entity);
			}
		});
	}

	abstract function run(message:Message, content:String):Void;

	public var name(get, never):String;

	abstract function get_name():String;
}
