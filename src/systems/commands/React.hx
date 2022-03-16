package systems.commands;

import discord_js.TextChannel;
import discord_builder.BaseCommandInteraction;
import components.Command;
import discord_js.Message;
import Main.CommandForward;

class React extends CommandBase {
	@:fastFamily var messages:{forward:CommandForward, message:Message};
	private var set_permission:Bool = false;

	override function update(_:Float) {
		super.update(_);
		iterate(messages, entity -> {
			if (forward != react || message.author.id != '151104106973495296') {
				continue;
			}

			var split = message.content.split(" ");
			var channel = split[1].replace('<#', '').replace('>', '');

			message.client.channels.fetch(channel).then(channel -> {
				channel.messages.fetch(split[2]).then(function(react_message){
					react_message.asType0.react(split[3]);
					message.delete();
				});
			});

			messages.remove(entity);
		});
	}

	function get_name():String {
		return 'react';
	}

	function run(command:Command, interaction:BaseCommandInteraction) {}
}
