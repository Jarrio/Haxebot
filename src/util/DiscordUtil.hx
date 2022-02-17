package util;

import discord_js.User;
import discord_js.MessageReaction;
import discord_js.Message;
import discord_js.ApplicationCommandPermissionsManager;
import discord_js.ApplicationCommand;

class DiscordUtil {
	public static function setCommandPermission(command:ApplicationCommand, permissions:Array<ApplicationCommandPermissionData>, ?succ:Void->Void,
			?fail:Dynamic->Void) {
		command.permissions.set({
			guild: Main.guild_id,
			command: command.id,
			permissions: permissions
		}).then(function(_) {
			if (succ != null) {
				succ();
			}
			trace('Updated permissions for ' + command.name);
		}, function(err) {
			if (fail != null) {
				fail(err);
			}
			trace(err);
			trace('Failed to update permissions for ' + command.name);
		});
	}

	public static function reactionTracker(message:Message, track:(collected:MessageReaction, user:User)->Void, ?time:Float = -1) {
		var filter = (reaction:MessageReaction, user:User) -> {
			if (reaction.emoji.name == "✅") {
				return true;
			}
			if (reaction.emoji.name == "❎") {
				return true;
			}
			reaction.remove();
			return false;
		}

		if (time == -1) {
			time = 60000 * 60 * 4;
		}

		message.react("✅").then(null, err).then(function(_) {
			message.react("❎").then(null, err).then(function(_) {
				var collector = message.createReactionCollector({filter: filter, time: time});
				collector.on('collect', track);
			});
		});
	}

	static function err(err:Dynamic) {
		trace(err);
	}
}
