package systems;

import discord_builder.BaseCommandInteraction;
import components.Command;
import ecs.System;

abstract class CommandBase extends System {
	@:fastFamily var commands:{command:Command, interaction:BaseCommandInteraction};

	override function update(_) {
		if (!Main.connected || !Main.commands_active) {
			return;
		}
		iterate(commands, entity -> {
			if (command.name == this.name) {
				this.run(command, interaction);
				this.universe.deleteEntity(entity);
			}
		});
	}

	abstract function run(command:Command, interaction:BaseCommandInteraction):Void;

	public var name(get, never):String;

	abstract function get_name():String;

	inline function err(err) {
		trace(err);
	}
}

