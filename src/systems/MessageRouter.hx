package systems;

import discord_js.TextChannel;
import discord_js.Message;
import ecs.System;
import Main.CommandForward;

class MessageRouter extends System {
	@:fastFamily var messages:{message:Message};

	override function update(_) {
		iterate(messages, (entity) -> {
			var channel:TextChannel = message.channel;
			switch (channel.type) {
				case GUILD_TEXT:
					this.guildTextChannel(message);
				case PUBLIC_THREAD:
					this.publicThreadChannel(message);
				default:
			}

			if (channel.id == "1234544675264925788") {
				EcsTools.set(CommandForward.suggestion_box, message);
			}

			EcsTools.set(CommandForward.scam_prevention, message);
			EcsTools.set(CommandForward.keyword_tracker, message);
			universe.deleteEntity(entity);
		});
	}

	function publicThreadChannel(message:Message) {
		if (message.content.startsWith("[showcase]")) {
			EcsTools.set(CommandForward.showcase, message);
		}
		EcsTools.set(CommandForward.thread_count, message);
	}

	function guildTextChannel(message:Message) {
		var showcase_channel = #if block "1100053767493255182" #else "162664383082790912" #end;
		if (message.channel.asType0.id == showcase_channel && !message.system) {
			EcsTools.set(CommandForward.showcase_message, message);
		}
	}
}