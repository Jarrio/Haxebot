package systems;

import haxe.PosInfos;
import discord_builder.BaseCommandInteraction;
import components.Command;
import ecs.System;
import Main.TState;

abstract class CommandBase extends System {
	final has_subcommands:Bool = false;
	@:fastFamily var commands:{command:Command, interaction:BaseCommandInteraction};

	override function update(_) {
		if (!Main.connected || !Main.commands_active) {
			return;
		}
		iterate(commands, entity -> {
			if (this.has_subcommands) {
				if (command.name.indexOf(this.name, 0) != -1) {
					this.run(command, interaction);
					this.universe.deleteEntity(entity);
				}
			} else {
				if (command.name == this.name) {
					this.run(command, interaction);
					this.universe.deleteEntity(entity);
				}
			}
		});
	}

	abstract function run(command:Command, interaction:BaseCommandInteraction):Void;

	public var state(get, never):TState;
	function get_state() {
		return Main.state;
	}
	
	public var name(get, never):String;
	abstract function get_name():String;
}
