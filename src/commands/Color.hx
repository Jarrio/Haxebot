package commands;

import Main.CommandForward;
import js.Browser;
import discord_builder.BaseCommandInteraction;
import components.Command;
import systems.CommandBase;

class Color extends CommandBase {
	var roles:Map<String, String>;
	override function onEnabled() {
		roles = [
			"Orange" => "1164160370232012830",
			"Yellow" => "1164236800747900948",
			"Purple" => "1164237188561653770",
			"Red" => "1164237399719673916",
			"Sky Blue" => "1134786690754555916",
			"Pink" => "1164238547293847622",
			"Green" =>  "1164239067353985084",
			"Black" => "1164239176686915672",
			"Default" => "Default"
		];
	}

	function run(command:Command, interaction:BaseCommandInteraction) {
		switch (command.content) {
			case Color(role_name):
				var role_id = this.roles.get(role_name);
				interaction.member.fetch(true).then(function(member) {
					var set_role = null;
					var found = false;
					if (role_id == "Default") {
						for (value in this.roles) {
							for (role in member.roles.cache) {
								if (value == role.id) {
									member.roles.remove(role.id).then(function(_) {
										interaction.reply('Color set to default');
									});
									return;
								}
							}
						}
						interaction.reply("You're already on the default color!");
						return;
					}

					for (value in member.roles.cache) {
						for (k => v in this.roles) {
							if (value.id == v) {
								member.roles.remove(value.id).then(null, (err) -> trace(err));
								break;
							}
						}
					}

					interaction.member.roles.add(role_id).then(function(success) {
						interaction.reply('Color changed!');
						if (found) {
							trace('found $set_role');
							
						}
					}, function(err) {
						trace(err);
						Browser.console.dir(err);
					});
					
				}, function(err) {
					trace(err);
					Browser.console.dir(err);
				});

			default:
		}
	}

	function rollRemoved(interaction:BaseCommandInteraction, response:Dynamic) {
		interaction.reply('Removed');
	}

	function get_name():String {
		return 'color';
	}
}
