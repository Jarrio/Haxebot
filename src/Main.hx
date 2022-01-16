import haxe.extern.EitherType;
import discord_js.User;
import discord_builder.SlashCommandMentionableOption;
import discord_builder.SlashCommandRoleOption;
import discord_builder.SlashCommandChannelOption;
import discord_builder.SlashCommandBooleanOption;
import discord_builder.SlashCommandUserOption;
import discord_js.TextChannel;
import discord_js.Message;
import systems.commands.Run;
import discord_builder.SlashCommandNumberOption;
import discord_builder.SlashCommandStringOption;
import discord_builder.SharedSlashCommandOptions;
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
import systems.commands.Rtfm;
import systems.commands.Roundup;
import systems.commands.Api;
import systems.commands.Poll;
import systems.commands.ScamPrevention;
import firebase.web.app.FirebaseApp;

class Main {
	public static var app:FirebaseApp;
	public static var client:Client;
	public static var connected:Bool = false;
	public static var config:TConfig;
	public static var universe:Universe;
	public static var dm_help_tracking:Map<String, Float> = [];

	public static function start() {
		universe = Universe.create({
			entities: 1000,
			phases: [
				{
					name: 'main',
					systems: [Hi]
				}
			]
		});
		
		// universe.setSystems(Hi);
		// universe.setSystems(Help);
		// universe.setSystems(Haxelib);
		// universe.setSystems(Notify);
		// universe.setSystems(Rtfm);
		// universe.setSystems(Roundup);
		// universe.setSystems(Api);
		// universe.setSystems(Run);
		// universe.setSystems(Poll);
		// universe.setSystems(ScamPrevention);

		client = new Client({intents: [IntentFlags.GUILDS, IntentFlags.GUILD_MESSAGES, IntentFlags.DIRECT_MESSAGES, IntentFlags.GUILD_MEMBERS, IntentFlags.GUILD_MESSAGE_REACTIONS]});

		client.once('ready', (_) -> {
			trace('Ready!');
			connected = true;
		});

		client.on('messageCreate', (message:Message) -> {
			var channel = (message.channel : TextChannel);
			if (message.content.startsWith("!run")) {
				var code:RunMessage = message.toString();
				universe.setComponents(universe.createEntity(), code, message);
			}
			if (message.content.startsWith('@everyone') || message.content.startsWith('@here')) {
				universe.setComponents(universe.createEntity(), CommandForward.scam_prevention, message);
			}
		});

		client.on('ChatInputAutoCompleteEvent', (incoming) -> {
			trace('disconnected');
			trace(incoming);
		});

		client.on('interactionCreate', (interaction:BaseCommandInteraction) -> {
			if (!interaction.isCommand())
				return;

			var command:Command = {
				name: interaction.commandName,
				content: null
			}

			switch (command.name) {
				case 'helppls':
					var time = Date.now().getTime();
					dm_help_tracking.set(interaction.user.id, time);
				default:
			}
			var enum_id = command.name.charAt(0).toUpperCase() + command.name.substring(1);
			for (value in config.commands) {
				if (value.name != command.name) {
					continue;
				}
				if (value.params == null) {
					command.content = Type.createEnum(CommandOptions, enum_id);
					break;
				} else {
					var params = new Array<Dynamic>();
					for (param in value.params) {
						switch (param.type) {
							case user:
								params.push(interaction.options.getUser(param.name));
							case bool:
								params.push(interaction.options.getBoolean(param.name));
							case mention:
								params.push(interaction.options.getMentionable(param.name));
							case channel:
								params.push(interaction.options.getChannel(param.name));
							case role:
								params.push(interaction.options.getRole(param.name));
							case string:
								params.push(interaction.options.getString(param.name));
							case number:
								params.push(interaction.options.getNumber(param.name));
							default:
								throw 'Something went wrong.';
						}
					}
					command.content = Type.createEnum(CommandOptions, enum_id, params);
					break;
				}
			}

			if (command.content == null) {
				trace(interaction);
				trace(enum_id);
				trace('Unmatched command. (${command.name})');
				return;
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
			throw('Enter your discord auth token.');
		}

		Main.app = FirebaseApp.initializeApp(Main.config.firebase);
		var commands = parseCommands();

		var rest = new REST({version: '9'}).setToken(config.discord_token);

		rest.put(Routes.applicationGuildCommands(config.client_id, config.server_id), {body: commands})
			.then((_) -> trace('Successfully registered application commands.'), (err) -> trace(err));

		start();
	}

	static function parseCommands() {
		var command_defs = config.commands;
		if (command_defs == null || command_defs.length == 0) {
			throw 'No commands configured in the config.json file.';
		}

		var commands = new Array<AnySlashCommand>();
		for (command in command_defs) {
			var main_command = new SlashCommandBuilder().setName(command.name).setDescription(command.description);
			if (command.params != null) {
				for (param in command.params) {
					switch (param.type) {
						case user:
							main_command.addUserOption(new SlashCommandUserOption().setName(param.name)
								.setDescription(param.description)
								.setRequired(param.required));
						case string:
							var cmd = new SlashCommandStringOption().setName(param.name).setDescription(param.description).setRequired(param.required);
							if (param.choices != null) {
								for (option in param.choices) {
									cmd.addChoice(option.name, option.value);
								}
							}
							main_command.addStringOption(cmd);
						case bool:
							main_command.addBooleanOption(new SlashCommandBooleanOption().setName(param.name)
								.setDescription(param.description)
								.setRequired(param.required));
						case channel:
							main_command.addChannelOption(new SlashCommandChannelOption().setName(param.name)
								.setDescription(param.description)
								.setRequired(param.required));
						case role:
							main_command.addRoleOption(new SlashCommandRoleOption().setName(param.name)
								.setDescription(param.description)
								.setRequired(param.required));
						case mention:
							main_command.addMentionableOption(new SlashCommandMentionableOption().setName(param.name)
								.setDescription(param.description)
								.setRequired(param.required));
						case number:
							main_command.addNumberOption(new SlashCommandNumberOption().setName(param.name)
								.setDescription(param.description)
								.setRequired(param.required));
						default:
					}
				}
			}
			commands.push(main_command);
		}
		return commands;
	}

	public static var name(get, never):String;

	private static function get_name() {
		if (config == null || config.project_name == null) {
			return 'bot';
		}
		return config.project_name;
	}
}

typedef THelpPls = {
	var user:User;
	var content:String;
	var message:Message;
}

typedef TConfig = {
	var project_name:String;
	var firebase:FirebaseOptions;
	var macros:Bool;
	var client_id:String;
	var server_id:String;
	var discord_token:String;
	var commands:Array<TCommands>;
}

typedef TCommands = {
	var type:CommandType;
	var name:String;
	var description:String;
	@:optional var params:Array<TCommands>;
	@:optional var required:Bool;
	@:optional var choices:Array<{name:String, value:EitherType<Int, String>}>;
}

enum abstract CommandType(String) {
	var string;
	var number;
	var user;
	var channel;
	var role;
	var bool;
	var mention;
}

enum abstract CommandForward(String) {
	var helppls;
	var scam_prevention;
}
