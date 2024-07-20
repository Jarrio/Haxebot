package commands;

import js.Browser;
import discord_builder.BaseCommandInteraction;
import discord_js.MessageEmbed;
import sys.FileSystem;
import components.Command;
import js.node.ChildProcess.spawn;
import systems.CommandBase;
import haxe.Http;

private typedef Request = {
	action:Action,
	?input:String,
	?hxml:String,
};

private enum abstract Action(String) {
	var Run = "run";
	var HaxeVersion = "haxe_version";
	var HaxelibRun = "haxelib_run";
}

private enum abstract Status(String) {
	var Ok;
	var OhNo;
}

private typedef Response = {
	status:Status,
	?output:Null<String>,
	?error:Null<String>,
}

typedef CommandHistory = {
	var timestamp:Float;
	var interaction:BaseCommandInteraction;
}

class Haxelib extends CommandBase {
	var last_interaction:BaseCommandInteraction;
	final super_mod_id:String = #if block '1114582456381747232' #else '198916468312637440' #end;
	var message_history:Map<String, MessageEmbed> = [];
	var http:Http;
	var site = #if block "" #else "localhost" #end;

	override function onEnabled() {
		#if block
		site = Main.keys.haxeip;
		#end
	}

	function run(command:Command, interaction:BaseCommandInteraction) {
		for (key => data in message_history) {
			var time = Date.now().getTime();
			if (time - data.timestamp > 5000) {
				message_history.remove(key);
			}
		}

		var role_status = hasRole(this.super_mod_id, interaction);
		switch (command.content) {
			case Haxelib(command):
				var route = command;
				var http = new Http('http://$site:1337');
				http.onError = function(error) {
					trace(error);
				}

				if (route.contains(" ")) {
					route = route.split(" ")[0];
				}

				if (route != "list" && route != "info" && route != "search") {
					if (!role_status) {
						interaction.reply('Invalid Permissions.').then(null, function(err) {
							trace(err);
							Browser.console.dir(err);
						});
						return;
					}
				}

				interaction.deferReply({}).then(function(_) {
					http.setHeader('Authorization', "Basic " + Main.keys.haxelib);
					trace(Main.keys.haxelib);
					http.onData = function(response) {
						var parse:Response = Json.parse(response);
						switch (parse.status) {
							case Ok:
								trace('parse');
								var output = '';
								for (line in parse.output.split('\n')) {
									if (line.contains('KB') || line.contains('%')) {
										continue;
									}
									output += line + '\n';
								}
								trace(output);
								var embed = new MessageEmbed().setTitle('Haxelib');
								if (output.length > 4000) {
									output = output.substr(0, 4000) + '...';
								}

								if (output.length == 0 || output == '') {
									output = "No libraries installed.";
								}

								embed.setDescription(output);
								interaction.editReply({embeds: [embed]}).then(null, function(err) {
									trace(err);
									Browser.console.dir(err);
								});
							default:
								var embed = new MessageEmbed();
								embed.type = 'article';
								var error = parse.error;
								embed.setDescription('Error \n + ${error}');

								interaction.editReply({embeds: [embed]})
									.then(null, (err) -> trace(err));
								trace(parse);
						}
					}

					var request:Request = {
						action: HaxelibRun,
						input: command
					}

					trace(request);

					var str = Json.stringify(request);
					http.setPostData(str);
					http.request(true);
				}, (err) -> trace(err));
			default:
		}
	}

	function addHistory(command:String, embed:MessageEmbed) {
		if (this.message_history.exists(command)) {
			return false;
		}

		this.message_history.set(command, embed);
		return true;
	}

	function get_name():String {
		return 'haxelib';
	}
}
