package commands;

import sys.FileSystem;
import js.Browser;
import discord_builder.BaseCommandInteraction;
import components.Command;
import systems.CommandBase;
import Main.CommandForward;
import discord_js.Message;
import sys.io.File;

class ThreadCount extends CommandBase {
	var count:Map<String, Int> = [];
	@:fastFamily var messages:{command:CommandForward, message:Message};
	final path = "./config/threadcount.json";
	override function onEnabled() {
		if (FileSystem.exists(path)) {
			count = Json.parse(File.getContent(path));
		}
	}

	override function update(_:Float) {
		super.update(_);
		iterate(messages, (entity) -> {
			switch(command) {
				case thread_count:
					var count = -1;
					var channel = message.channel.asType0;
					if (this.count.exists(channel.id)) {
						count = this.count.get(channel.id) + 1;
					} else {
						count = 1;
					}
					this.count.set(channel.id, count);
					File.saveContent(path, Json.stringify(this.count));
					universe.deleteEntity(entity);
				default:
			}
		});
	}

	function run(command:Command, interaction:BaseCommandInteraction) {
		if (this.count.exists(interaction.channelId)) {
			var count = this.count.get(interaction.channelId);
			interaction.reply({content: 'This thread has ${count} messages'})
				.then(null, function(err) {
					trace(err);
					Browser.console.dir(err);
				});
		} else {
			interaction.reply({content: 'Either a new thread or was created before 23/04/2024. Check back later.'})
				.then(null, function(err) {
					trace(err);
					Browser.console.dir(err);
				});
		}
	}

	function get_name():String {
		return 'threadcount';
	}
}
