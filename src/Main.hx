import discord_js.Message;
import discord_js.Client;
import haxe.Json;
import sys.io.File;
import ecs.Universe;
import haxe.Timer;
import systems.Messages;
import components.Command;
import systems.commands.Hi;

class Main {
	public static var config:TConfig;
	public static var universe:Universe;
	public static function start() {
		universe = new Universe(1000);

		universe.setSystems(
			Hi,
			Messages
		);

		var client = new Client();
		client.on('ready', function(_) {
			trace("HaxeBot Ready!");
		});

		client.on('message', function(message:Message) {
			
			var split = message.content.split(' ');
			var first_word = split[0];
			var content = null;
			if (split.length > 1) {
				content = message.content.substring(first_word.length);
			}
			trace(first_word);
			for (prefix in config.prefixes) {
				if (prefix == first_word.charAt(0)) {
					var command = ({
						name: first_word, 
						content: content
					}:Command);
					universe.setComponents(universe.createEntity(), command, message);
					break;
				}
			}
		});

		client.login(config.discord_api_key).then(function(reply) {
			trace("HaxeBot logged in!");
		}, function(error) {
			trace("HaxeBot Error!");
			trace(error);
		});

		new Timer(100).run = function() {
			universe.update(1);
		}
	}

	static function main() {
		try {
			config = Json.parse(File.getContent('./bin/config.json'));
		} catch (e) {
			trace(e.message);
		}

		if (config == null || config.discord_api_key == 'TOKEN_HERE') {
			throw ('Enter your discord auth token.');
		}

		start();
	}
}

typedef TConfig = {
	var prefixes:Array<String>;
	var discord_api_key:String;
}