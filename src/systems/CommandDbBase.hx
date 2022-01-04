package systems;

import firebase.firestore.Firestore;
import firebase.app.FirebaseApp;
import discord_builder.BaseCommandInteraction;
import components.Command;
import ecs.System;

abstract class CommandDbBase extends System {
	var db(get, never):Firestore;

	@:fastFamily var commands:{command:Command, interaction:BaseCommandInteraction};

	override function update(_) {
		if (!Main.connected) {
			return;
		}
		iterate(commands, entity -> {
			if (command.name == this.name) {
				this.run(command, interaction);
				this.commands.remove(entity);
			}
		});
	}

	private inline function get_db() {
		return Firestore.getFirestore(FirebaseApp.getApp());
	}

	abstract function run(command:Command, interaction:BaseCommandInteraction):Void;

	var name(get, never):String;
	abstract function get_name():String;
}