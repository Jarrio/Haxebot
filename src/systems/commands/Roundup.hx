package systems.commands;

import discord_builder.BaseCommandInteraction;
import discord_js.MessageEmbed;
import discord_js.TextChannel;
import discord_js.Message;
import components.Command;

class Roundup extends CommandBase {
	var last_checked:Float = -1;
	var active:Bool = false;
	var roundup:Int = -1;
	var channel:TextChannel;
	final super_mod_id:String = '198916468312637440';
	final announcement_channel:String = '286485321925918721';

	function getHaxeIoPage() {
		var data = new haxe.Http('https://raw.githubusercontent.com/skial/haxe.io/master/src/roundups/${this.roundup}.md');
		var embed = new MessageEmbed();
		data.onError = (error) -> {
			trace(error);
		}
		data.onData = (body) -> {
			var regex = ~/### News and Articles(.*?)##### _In case you missed it_/gmis;
			if (regex.match(body)) {
				
				embed.setTitle('Haxe Roundup #$roundup');
				embed.setURL('https://haxe.io/roundups/$roundup/');
				
				var desc_split = regex.matched(1).trim().split('\n');
				var desc = '\n**News And Articles**';
				for (item in desc_split) {
					if (desc.length + item.trim().length + 3 + 22 >= 2048) {
						continue;
					}
					desc += '\n' + item.trim();
				}
				desc += '\n...';
				embed.setDescription(desc);
				this.channel.send({content: '<@&761714325227700225>', embeds: [embed]}).then((_) -> {
					this.roundup++;
				});
			}
		}
		data.request();
	}

	override function update(_) {
		super.update(_);
		if (!this.active || this.roundup == -1 || Date.now().getTime() - last_checked <= 86400000) {
			return;
		}

		if (this.channel != null) {
			this.last_checked = Date.now().getTime();
			getHaxeIoPage();
		}
	}
	
	function run(command:Command, interaction:BaseCommandInteraction) {
		if (!hasRole(this.super_mod_id, interaction)) {
			interaction.reply('Invalid permissions').then(null, null);
			return;
		}
		
		switch (command.content) {
			case Roundup(number):
				if (this.active) {
					this.active = false;
					this.last_checked = -1;
					interaction.reply("Disabled haxe roundup monitoring");
					return;
				}
				trace(number);
				if (number <= 600) {
					interaction.reply("Please enter a more recent roundup issue.");
					return;
				}
		
				this.active = true;
				this.roundup = number.int();
		
				interaction.reply('Will start watching haxe roundups from **#$number**.');
				interaction.client.channels.fetch(this.announcement_channel).then(function(channel) {
					this.channel = cast channel;
				}, function(error) {
					trace(error);
				});
			default:
		}
	}

	function get_name():String {
		return 'roundup';
	}
}
