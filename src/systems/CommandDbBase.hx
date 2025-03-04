package systems;

import haxe.PosInfos;
import firebase.web.firestore.DocumentReference;
import firebase.web.app.FirebaseApp;
import firebase.web.firestore.Firestore;
import firebase.web.firestore.Firestore.*;
import discord_builder.BaseCommandInteraction;
import components.Command;
import ecs.System;

abstract class CommandDbBase extends System {
	var has_subcommands:Bool = false;
	var db(get, never):Firestore;

	@:fastFamily var commands:{command:Command, interaction:BaseCommandInteraction};

	override function update(_) {
		if (!Main.discord_connected || !Main.commands_active) {
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

	public inline function addDoc<T>(path:String, data:T, success:(doc:DocumentReference<T>) -> Void, failure:(error:Dynamic) -> Void) {
		Firestore.addDoc(collection(this.db, path), data).then(success, failure);
	}

	private inline function get_db() {
		return Firestore.getFirestore(FirebaseApp.getApp());
	}

	abstract function run(command:Command, interaction:BaseCommandInteraction):Void;

	var name(get, never):String;

	abstract function get_name():String;
}
