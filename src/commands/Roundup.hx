package commands;

import js.node.Http;
import js.node.http.Server;
import commands.types.Duration;
import discord_builder.BaseCommandInteraction;
import discord_js.MessageEmbed;
import discord_js.TextChannel;
import components.Command;
import systems.CommandBase;
import js.Browser;
import discord_js.User;
import haxe.Json;

class Roundup extends CommandBase {
	//post once a week
	var posted:Float = -1;
	var last_checked:Float = -1;
	var thursday_check:Float = -1;
	var active:Bool = true;
	var roundup(get, set):Int;
	var channel:TextChannel = null;
	var checking:Bool = false;
	var _check_now:Bool = false;
	var dmlist:Map<String, User> = ['367806496907591682' => null, '151104106973495296' => null];

	final super_mod_id:String = '198916468312637440';
	final news_role:String = '761714325227700225';
	final announcement_channel:String = #if block '597067735771381771' #else '286485321925918721' #end;

	var sent = false;
	// var server:Server;
	// override function onEnabled() {
	// 	trace('running');
	// 	Http.createServer((request, response) -> {
	// 		trace(request);
	// 		trace(response);
	// 	});
	// }

	function dmUser(title:String, content:String) {
		#if block
		return;
		#end
		var regex = ~/\((.*?)\)/gmis;
		content = regex.replace(content, "(<$1>)");
		for (key => user in dmlist) {
			if (user == null) {
				trace('skipping $key');
				continue;
			}
			user.send('## $title');
			var arr = content.split('\n');
			var half = Math.floor(arr.length / 2);
			var a = '';
			var b = '';
			for (i => line in arr) {
				if (i <= half) {
					a += line + '\n';
				} else {
					b += line + '\n';
				}
			}
			user.send(a).then((_) -> {
				user.send(b).then(null, (err) -> trace(err));
			}, (err) -> trace(err));
		}
	}

	function getHaxeIoPage() {
		var data = new haxe.Http(
			'https://raw.githubusercontent.com/skial/haxe.io/master/src/roundups/$roundup.md'
		);
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
					if (item.contains("#### ")) {
						item = item.replace("#### ", "### ");
					}
					desc += '\n' + item.trim();
				}
				desc += '\n...';
				embed.setDescription(desc);
				dmUser('Haxe Roundup #$roundup', desc);
				this.channel.send({
					content: '<@&$news_role>',
					allowedMentions: {roles: [news_role]},
					embeds: [embed]
				}).then((_) -> {
					this.roundup++;
				});
			}
		}
		data.request();
	}

	var set_permissions = false;

	override function update(_) {
		super.update(_);
		if (Main.state == null) {
			return;
		}

		if (this.channel == null && this.checking == false) {
			this.checking = true;
			Main.client.channels.fetch(this.announcement_channel).then(function(channel) {
				this.channel = cast channel;
				this.checking = false;
			}, function(err) {
				trace(err);
				Browser.console.dir(err);
			});

			for (key => user in this.dmlist) {
				if (user == null) {
					Main.client.users.fetch(key).then((user) -> {
						this.dmlist.set(key, user);
						trace('Got ${user.tag}');
					}, (err) -> trace(err));
				}
			}
		}

		if (this.roundup == -1 || this.channel == null) {
			return;
		}

		var today = Date.now();
		var diff = today.getTime() - last_checked;
		var day = today.getUTCDay() == 4 || today.getUTCDay() == 6;
		if (day || _check_now) {
			if (!this.shouldCheck()) {
				return;
			}
		} else {
			if (diff >= Duration.fromString('1d')) {
				return;
			}
			this.last_checked = Date.now().getTime();
		}

		getHaxeIoPage();
	}

	function shouldCheck() {
		var today = Date.now();
		var hour = today.getUTCHours();

		if (_check_now) {
			_check_now = false;
			return true;
		}

		if (hour < 11 || hour > 14) {
			return false;
		}

		var min = today.getUTCMinutes();
		if (min % 30 != 0) {
			return false;
		}

		var diff = today.getTime() - thursday_check;
		if (diff <= Duration.fromString('25m')) {
			return false;
		}

		thursday_check = today.getTime();
		return true;
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

				if (number <= 600) {
					interaction.reply("Please enter a more recent roundup issue.");
					return;
				}

				this.active = true;
				this.roundup = number.int();

				interaction.reply('Will start watching haxe roundups from **#$number**.');
				interaction.client.channels.fetch(this.announcement_channel)
					.then(function(channel) {
						this.channel = cast channel;
					}, function(err) {
						trace(err);
						Browser.console.dir(err);
					});
			default:
		}
	}

	inline function get_roundup() {
		return Main.state.next_roundup;
	}

	inline function set_roundup(value:Int) {
		Main.state.next_roundup = value;
		
		Main.updateState('next_roundup');

		return value;
	}

	function get_name():String {
		return 'roundup';
	}
}
