package systems.commands;

import discord_js.ReactionEmoji;
import discord_js.MessageEmbed;
import Main.CommandForward;
import discord_js.Message;
import components.Command;
import discord_builder.BaseCommandInteraction;
import firebase.web.firestore.Firestore.*;

class Poll extends CommandBase {
	var active_polls:Map<String, TPoll> = [];
	var message:Map<String, Message> = [];

	@:fastFamily var dm_messages:{type:CommandForward, message:Message};

	function run(command:Command, interaction:BaseCommandInteraction) {
		switch (command.content) {
			case Poll(question, type):
				var embed = this.createEmbed(question);
				var filter = (reaction:Dynamic) -> {
					trace(reaction);
					if (reaction.emoji.name == "✅") {
						return true;
					}
					if (reaction.emoji.name == "❎") {
						return true;
					}
					return false;
				}
				interaction.reply({embeds: [embed]}).then((_) -> {
					interaction.fetchReply().then(function(message) {
						trace(message);
						message.react("✅").then(function(_) {
							message.react("❎").then(function(_) {
								var foo = message.createReactionCollector(filter);
								foo.on('collect', (collected) -> {
									trace(collected);
								});
							}, null);
						}, null);
					}, null);
				}, null);
			default:
		}
	}

	inline function createEmbed(content:String) {
		var embed = new MessageEmbed();

		embed.setDescription(content);
		return embed;
	}

	function get_name():String {
		return 'poll';
	}
}

typedef TPoll = {
	var question:String;
	var type:PollTypes;
	var counter:Map<String, Int>;
}

enum abstract PollTypes(String) {
	var bool;
	var bool_maybe;
	var multiple_choice;
}
