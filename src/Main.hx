import discord_builder.SlashCommandStringOption;
import discord_builder.SharedSlashCommandOptions;
import discord_builder.SlashCommandUserOption;
import components.Command;
import discord_builder.BaseCommandInteraction;
import discord_builder.SlashCommandBuilder;
import discord_js.ClientOptions.IntentFlags;
import discordjs.rest.REST;
import discord_api_types.Routes;
import discord_js.Client;
import haxe.Json;
import sys.io.File;
import ecs.Universe;
import haxe.Timer;
import systems.commands.Hi;
import systems.commands.Help;
import systems.commands.Haxelib;
import systems.commands.Notify;

class Main {
	public static var connected:Bool = false;
	public static var config:TConfig;
	public static var universe:Universe;
	public static function start() {
		universe = new Universe(1000);
		universe.setSystems(Hi);
		universe.setSystems(Help);
		universe.setSystems(Haxelib);
		universe.setSystems(Notify);

		var client = new Client({intents: [IntentFlags.GUILDS, IntentFlags.GUILD_MESSAGES]});

		client.once('ready', (_) -> {
			trace('Ready!');
			connected = true;
		});

		client.on('interactionCreate', (interaction:BaseCommandInteraction) -> {
			if (!interaction.isCommand()) return;
			
			var command:Command = {
				name: interaction.commandName,
				content: None
			}
			
			switch(interaction.commandName) {
				case 'hi':
					command.content = Hi;
				case 'help':
					command.content = Help(interaction.options.getString('category'));
				case 'haxelib':
					command.content = Haxelib(interaction.options.getString('command'));
				case 'notify':
					command.content = Notify(interaction.options.getString('channel'));
				default:
			}
			universe.setComponents(universe.createEntity(), command, interaction);
		});

		client.login(config.discord_token);

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

		if (config == null || config.discord_token == 'TOKEN_HERE') {
			throw ('Enter your discord auth token.');
		}

		var commands = new Array<AnySlashCommand>();
		var hi = new SlashCommandBuilder().setName('hi').setDescription('Replies with hi!');
		var help = new SlashCommandBuilder().setName('help').setDescription('Haxebot commands list').addStringOption(
			new SlashCommandStringOption().setName('category').setDescription('help section')
		);
		var haxelib = new SlashCommandBuilder().setName('haxelib').setDescription('Haxelib').addStringOption(
			new SlashCommandStringOption().setName('command').setDescription('Haxe library manager')
		);
		var notify = new SlashCommandBuilder().setName('notify').setDescription('Subscribe to channel specific updates').addStringOption(
			new SlashCommandStringOption().setName('channel').setDescription('Channels to subscribe to separated by a space')
		);
		
		commands.push(hi);
		commands.push(help);
		commands.push(haxelib);
		commands.push(notify);
		
		var rest = new REST({ version: '9' }).setToken(config.discord_token);
		
		rest.put(Routes.applicationGuildCommands(config.client_id, config.server_id), { body: commands })
			.then((_) -> trace('Successfully registered application commands.'), (err) -> trace(err));

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
	var project_name:String;
	var macros:Bool;
	var client_id:String;
	var server_id:String;
	var discord_token:String;
}