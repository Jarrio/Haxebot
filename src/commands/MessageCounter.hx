package commands;

import discord_js.TextChannel;
import discord_js.ThreadChannel;
import haxe.Timer;
import sys.FileSystem;
import js.Browser;
import discord_builder.BaseCommandInteraction;
import components.Command;
import systems.CommandBase;
import Main.CommandForward;
import discord_js.Message;
import sys.io.File;
import database.DBEvents;
import database.types.DBMessageCounter;
import Query.query;

class MessageCounter extends CommandBase {
	var loaded:Bool = false;
	var count:Map<String, DBMessageCounter> = [];
	@:fastFamily var messages:{command:CommandForward, message:Message};
	final path = "./config/threadcount.json";

	override function onEnabled() {
		loadCounts();
	}

	function loadCounts() {
		var e = DBEvents.GetAllRecords('message_counter', (resp) -> {
			switch (resp) {
				case Records(data):
					for (item in data) {
						if (item.hasField('_insertedId')) {
							item.removeField('_insertedId');
							trace('removed a field');
						}
						var r = DBMessageCounter.fromRecord(item);
						count.set(r.userId, r);
					}
					loaded = true;
					trace("Loaded user message counts");
				default:
					trace(resp);
			}
		});
		universe.setComponents(universe.createEntity(), e);
	}

	override function update(_:Float) {
		super.update(_);
		#if block
		return;
		#end
		if (!loaded) {
			return;
		}
		iterate(messages, (entity) -> {
			switch (command) {
				case message_counter:
					var userId = message.author.id;
					var db = null;
					if (this.count.exists(userId)) {
						db = this.count.get(userId);
						try {
							db.updatedTime = Date.now().getTime();
							db.count += 1;
							var e = DBEvents.Update('message_counter', db, query($userId == userId), (resp) -> {
								switch (resp) {
									case Success(_, _):
									default: trace(resp);
								}
							});
							EcsTools.set(e);
						} catch (e) {
							trace(e);
							trace(db);
							trace(db.userId);
							trace(db.count);
						}
					} else {
						db = new DBMessageCounter();
						db.userId = userId;
						db.updatedTime = db.startedTime = Date.now().getTime();
						db.count = 1;

						var e = DBEvents.Insert('message_counter', db, (resp) -> {
							switch (resp) {
								case Success(_, _):
								default: trace(resp);
							}
						});
						EcsTools.set(e);
					}
					this.count.set(userId, db);
					universe.deleteEntity(entity);
				default:
			}
		});
	}

	function run(command:Command, interaction:BaseCommandInteraction) {}

	function get_name():String {
		return 'messagecounter';
	}
}
