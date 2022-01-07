package systems.commands;

import discord_js.Collection;
import discord_js.User;
import discord_js.MessageReaction;
import discord_js.MessageEmbed;
import Main.CommandForward;
import discord_js.Message;
import components.Command;
import discord_builder.BaseCommandInteraction;

class Poll extends CommandBase {
	@:fastFamily var dm_messages:{type:CommandForward, message:Message};

	function run(command:Command, interaction:BaseCommandInteraction) {
		switch (command.content) {
			case Poll(question, time):
				if (time > 4320) {
					interaction.reply("A poll can't (currently) last longer than 3 days.");
					return;
				}
				var embed = new MessageEmbed();
				embed.setTitle('Poll');
				embed.setDescription(question + '\n___');
				embed.setFooter('Poll will run for ${time} minutes.');

				interaction.reply({embeds: [embed]}).then((_) -> {
					interaction.fetchReply().then(function(message) {
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

						message.react("✅").then(null, null).then(function(_) {
							message.react("❎").then(null, null).then(function(_) {
								var collector = message.createReactionCollector({filter: filter, time: time * 60000});
								collector.on('end', (collected:Collection<String, MessageReaction>, reason:String) -> {
									var check = 0.;
									var cross = 0.;

									if (collected.has('✅')) {
										check = collected.get('✅').count - 1;
									}

									if (collected.has('❎')) {
										cross = collected.get('❎').count - 1;
									}

									var embed = new MessageEmbed();
									embed.setTitle(question);
									embed.addField('✅ Yes:', check.string());
									embed.addField('❎ No:', cross.string());
									var date = DateTools.format(Date.fromTime(message.createdTimestamp), '%d-%m-%Y %H:%M:%S');
									embed.setFooter('Poll results | Started $date');
									message.reply({embeds: [embed]});
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
