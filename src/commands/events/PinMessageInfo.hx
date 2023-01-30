package commands.events;

import discord_js.Message;
import discord_js.ThreadChannel;
import Main.CommandForward;
import ecs.System;

class PinMessageInfo extends System {
	@:fastFamily var threads:{command:CommandForward, thread:ThreadChannel};
	var messages:Array<Message> = [];

	override function update(_dt:Float) {
		iterate(threads, entity -> {
			switch (command) {
				case thread_pin_message:
					var now = Date.now().getTime();
					if (now - thread.createdTimestamp < 10000) {
						continue;
					}
					thread.send(
						{content: '<@${thread.ownerId}> You can pin messages in your own threads by Right clicking a message -> Apps -> Pin Message\n\n*This message will selfdestruct in 30 seconds.*'}
					)
						.then(function(message) {
							this.messages.push(message);
						}, function(err) trace(err));
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
			});
		}
	}
}
