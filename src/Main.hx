import discord_api_types.Routes;
import discordjs.rest.REST;
import discord_js.ClientOptions.IntentFlags;
import discord_js.Message;
import discord_js.Client;
import haxe.Json;
import sys.io.File;
import ecs.Universe;
import haxe.Timer;
import components.Command;
import systems.commands.Haxelib;
import systems.commands.Run;
import systems.commands.Notify;
import systems.commands.Roundup;
import systems.commands.Rtfm;
import systems.commands.Help;
import systems.commands.ToggleMacros;
import systems.commands.Hi;
import systems.commands.Api;

typedef CommandTest = {
	var name:String;
	var description:String;
} 

class Main {
	public static var connected:Bool = false;
	public static var config:TConfig;
	public static var universe:Universe;
	public static function start() {
		universe = new Universe(1000);

		universe.setSystems(
			Haxelib,
			Run,
			Notify,
			Roundup,
			Rtfm,
			ToggleMacros,
			Help,
			Hi,
			Api
		);

		var client = new Client({intents: [IntentFlags.GUILDS]});
		client.on('ready', function(_) {
			connected = true;
			trace('$name Ready!');
		});

		var rest = new REST({'version': '9'});
		rest.setToken(Main.config.discord_api_key);
		rest.put(Routes.applicationGuildCommands('', ''), 
			{body: [{name: 'test', description: 'description test'}]}).then((test) -> trace(test), (err) -> trace(err));
		
	
		client.on('message', function(message:Message) {
			var split = message.content.split(' ');
			var first_word = split[0];
			var content = null;
			if (split.length > 1) {
				content = message.content.substring(first_word.length);
			}
			
			for (prefix in config.prefixes) {
				if (prefix == first_word.charAt(0)) {
					var command = ({
						name: first_word.trim(), 
						content: content == null ? null : content.trim()
					}:Command);
					universe.setComponents(universe.createEntity(), command, message);
					break;
				}
			}
		});

		client.login(config.discord_api_key).then(function(_) {
			trace('$name logged in!');
		}, function(error) {
			trace('$name Error!');
			trace(error);
		});

		new Timer(100).run = function() {
			universe.update(1);
		}
	}

	static function main() {
		try {
			config = Json.parse(File.getContent('./config.json'));
		} catch (e) {
			trace(e.message);
		}

		if (config == null || config.discord_api_key == 'TOKEN_HERE') {
			throw ('Enter your discord auth token.');
		}

		start();
	}

	public static var name(get, never):String;
	private static function get_name() {
		if (config == null || config.project_name == null) {
			return 'bot';
		}
		return config.project_name;
	}	
}

typedef TConfig = {
	var macros:Bool;
	var project_name:String;
	var prefixes:Array<String>;
	var discord_api_key:String;
}