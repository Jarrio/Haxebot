package commands.events;

import sys.FileSystem;
import sys.io.File;
import js.Browser;
import discord_js.Message;
import discord_js.ThreadChannel;
import Main.CommandForward;
import ecs.System;

class PinMessageInfo extends System {
	@:fastFamily var threads:{command:CommandForward, thread:ThreadChannel};
	var messages:Array<Message> = [];
	var notified:Map<String, Bool> = [];
	final path = './config/pinmessage.json';
	override function onEnabled() {
		if (FileSystem.exists(path)) {
			this.notified = Json.parse(File.getContent(path));
		}
	}

	function saveHistory(uid:String) {
		this.notified.set(uid, true);
		File.saveContent(path, Json.stringify(this.notified));
	}

	override function update(_dt:Float) {
		iterate(threads, entity -> {
			switch (command) {
				case thread_pin_message:
					if (notified.exists(thread.ownerId) || thread.parentId == "162664383082790912" /* showcase channel */) {
						this.universe.deleteEntity(entity);
						continue;
					}
					var now = Date.now().getTime();
					if (now - thread.createdTimestamp < 10000) {
						continue;
					}
					thread.send(
						{content: '<@${thread.ownerId}> You can pin messages in your own threads by Right clicking a message -> Apps -> Pin Message\n\n*This message will selfdestruct in 30 seconds.*'}
					)
						.then(function(message) {
							saveHistory(thread.ownerId);
							this.messages.push(message);
						}, function(err) {
							trace(err);
							Browser.console.dir(err);
						});
					this.universe.deleteEntity(entity);
				default:
			}
		});
		var now = Date.now().getTime();
		for (message in messages) {
			if (now - message.createdTimestamp < 30000) {
				continue;
			}

			message.delete().then(function(_) {
				this.messages.remove(message);
			}, (err) -> trace(err));
		}
	}
}
