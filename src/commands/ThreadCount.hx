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
import database.types.DBThreadCount;
import Query.query;

class ThreadCount extends CommandBase {
	var count:Map<String, DBThreadCount> = [];
	@:fastFamily var messages:{command:CommandForward, message:Message};
	final path = "./config/threadcount.json";

	override function onEnabled() {
		// loadToDB();
		if (FileSystem.exists(path)) {
			count = Json.parse(File.getContent(path));
		}
		loadCounts();
	}

	function loadCounts() {
		var e = DBEvents.GetAllRecords('threadcount', (resp) -> {
			switch (resp) {
				case Records(data):
					for (item in data) {
						if (item.hasField('_insertedId')) {
							item.removeField('_insertedId');
							trace('removed a field');
						}
						var r = DBThreadCount.fromRecord(item);
						count.set(r.threadid, r);
					}
					trace("Loaded thread counts");
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
		iterate(messages, (entity) -> {
			switch (command) {
				case thread_count:
					var count = -1;
					var channel = message.channel.asType0;
					var db = null;
					if (this.count.exists(channel.id)) {
						db = this.count.get(channel.id);
						try {
							db.count += 1;
							var e = DBEvents.Update('threadcount', db, query($threadid == channel.id), (resp) -> {
								switch (resp) {
									case Success(_, _):
									default: trace(resp);
								}
							});
							EcsTools.set(e);
						} catch (e ) {
							trace(e);
							trace(db);
							trace(db.count);
						}
					} else {
						db = new DBThreadCount(channel.name, channel.id, 1);
						var e = DBEvents.Insert('threadcount', db, (resp) -> {
							switch (resp) {
								case Success(_, _):
								default: trace(resp);
							}
						});
						EcsTools.set(e);
					}
					this.count.set(channel.id, db);
					File.saveContent(path, Json.stringify(this.count));
					universe.deleteEntity(entity);
				default:
			}
		});
	}

	var arr = [];
	var i = 0;

	function loadToDB() {
		var file = File.getContent(path);
		var json:Map<String, Int> = Json.parse(file);
		for (key => value in json) {
			arr.push({
				thread: key,
				count: value
			});
		}
		trace(arr.length);
		var timer = new Timer(200);
		timer.run = function() {
			trace(i);
			if (i > arr.length) {
				timer.stop();
				return;
			}
			var data = arr[i];
			if (data == null) {
				return;
			}
			Main.client.channels.fetch(data.thread).then(function(ch) {
				var channel = ch.asType1;
				if (channel == null) {
					return;
				}
				var r = new DBThreadCount(channel.name, data.thread, data.count);
				var e = DBEvents.Insert('threadcount', r, (resp) -> {
					trace(resp);
				});
				EcsTools.set(e);
				i++;
			}, (err) -> trace(err));
			i++;
		}
	}

	function run(command:Command, interaction:BaseCommandInteraction) {
		if (this.count.exists(interaction.channelId)) {
			var count = this.count.get(interaction.channelId);
			interaction.reply({content: 'This thread has ${count} messages'}).then(null, function(err) {
				trace(err);
				Browser.console.dir(err);
			});
		} else {
			var content = '';
			content = switch (interaction.channel.type) {
				case PUBLIC_THREAD | ANNOUNCEMENT_THREAD | PRIVATE_THREAD:
					'Either a new thread or was created before 23/04/2024. Check back later.';
				default:
					'This is not a thread :angry:';
			}
			interaction.reply({content: content}).then(null, function(err) {
				trace(err);
				Browser.console.dir(err);
			});
		}
	}

	function get_name():String {
		return 'threadcount';
	}
}
