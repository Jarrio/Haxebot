package systems.commands.mod;

import haxe.Json;
import sys.io.File;
import discord_js.MessageEmbed;
import discord_js.Message;
import discord_builder.BaseCommandInteraction;
import components.Command;

class Ban extends CommandBase {
	function run(command:Command, interaction:BaseCommandInteraction) {
		switch(command.content) {
			case Ban(user, reason, delete_messages):
				var member = interaction.channel.guild.members.cache.get(user.id);
				if (member == null) {
					interaction.reply("User not found.");
					return;
				}

				member.guild.channels.fetch({force: true}).then(function(response) {
					var channels = [];
					var history = [];

					for (channel in response.asType1) {
						if (channel.type != GUILD_TEXT) {
							continue;
						}
						channels.push(channel);
					}

					for (key => channel in channels) {
						if (channel.type != GUILD_TEXT) {
							break;
						}

						Main.client.channels.fetch(channel.id, {force: true}).then(function(channel) {
							channel.messages.fetch({force: true}).then(function(response) {
								var count = 0;
								var messages = response.asType1;
								for (message in messages) {
									if (message.author.id != user.id) {
										continue;
									}
									if (count >= 3) {
										break;
									}
									count++;
									history.push(message);
								}

								if (key + 1 == channels.length) {
									var log = new Array<BanLogOutput>();
									for (message in history) {
										if (message.content == null || message.content.length == 0) {
											continue;
										}

										log.push({
											user_tag: message.author.tag,
											user_id:  message.author.id,
											message: message.content,
											timestamp: message.createdTimestamp,
											user_joined: message.member.joinedTimestamp,
											channel: message.channel.asType0.name
										});
									}

									if (delete_messages == null) {
										delete_messages = "1";
									}

									if (reason == null) {
										reason = "Scam bot";
									}

									File.saveContent('./commands/ban_log.json', Json.stringify(log));
									DiscordUtil.getChannel('952952631079362650', function(channel){
										var embed = new MessageEmbed();
										embed.setAuthor({{
											name: interaction.user.tag,
											iconURL: interaction.user.avatarURL()
										}});
										embed.addField('Banned:', user.tag);
										embed.addField('Reason:', reason);
										embed.setFooter({text: 'Moderator: ${interaction.user.tag} banned a user'});
										
										interaction.reply({embeds: [embed]}).then(null, err);
										var files = null;
										if (log.length > 0) {
											files = ['./commands/ban_log.json'];
										}
										channel.send({embeds: [embed], files: files}).then(function(_) {
											var days = delete_messages.parseInt();
											if (days == null) {
												days = 1;
											}

											member.ban({
												days: days,
												reason: reason
											}).then(null, err);
										}, err);
									});
								}
							}, err);
						}, err);
					}

				});

			default:
		}
	}

	var set_permissions:Bool = false;
	override function update(_) {
		super.update(_);
		if (!this.set_permissions && Main.commands_active && Main.commands.exists(this.name)) {
			this.set_permissions = true;
			var command = Main.getCommand(this.name);
			if (command != null) {
				command.setCommandPermission([
					{
						id: '198916468312637440',
						type: ROLE,
						permission: true
					},
					{
						id: '738508312382799874',
						type: ROLE,
						permission: true
					}
				]);
			}
		}
	}

	function get_name():String {
		return 'ban';
	}
}

private typedef BanLogOutput = {
	var user_tag:String;
	var user_id:String;
	var channel:String;
	var message:String;
	var timestamp:Float;
	var user_joined:Float;
}
