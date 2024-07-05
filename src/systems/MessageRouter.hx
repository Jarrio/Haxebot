package systems;

import discord_js.TextChannel;
import discord_js.Message;
import ecs.System;
import Main.CommandForward;
import components.TextCommand;

class MessageRouter extends System {
	@:fastFamily var messages:{message:Message};

	override function update(_) {
		iterate(messages, (entity) -> {
			var channel:TextChannel = message.channel;

			EcsTools.set(CommandForward.rate_limit, message);
			EcsTools.set(CommandForward.scam_prevention, message);
			EcsTools.set(CommandForward.keyword_tracker, message);

			if (channel.id == "1234544675264925788") {
				EcsTools.set(CommandForward.suggestion_box, message);
			}

			switch (channel.type) {
				case GUILD_TEXT:
					this.guildTextChannel(message);
					universe.deleteEntity(entity);
				case PUBLIC_THREAD:
					this.publicThreadChannel(message);
				default:
			}
			universe.deleteEntity(entity);
		});
	}

	inline function publicThreadChannel(message:Message) {
		if (message.content.startsWith("[showcase]")) {
			EcsTools.set(CommandForward.showcase, message);
		}
		EcsTools.set(CommandForward.thread_count, message);
	}

	inline function guildTextChannel(message:Message) {
		var channel = message.channel.asType0;
		var showcase_channel = #if block "1100053767493255182" #else "162664383082790912" #end;
		if (channel.id == showcase_channel && !message.system) {
			EcsTools.set(CommandForward.showcase_message, message);
		}

		if (message.content.startsWith('!run')) {
			trace('here');
			universe.setComponents(universe.createEntity(), TextCommand.run, message);
		}
	}
}