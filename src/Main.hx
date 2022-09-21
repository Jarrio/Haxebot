import haxe.Rest;
import discord_api_types.Routes;
import discordjs.rest.REST;
import js.node.Timers;
import discord_js.ApplicationCommandManager.ApplicationCommandData;
import discord_js.Snowflake;
import discord_js.ApplicationCommand;
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
import discord_js.Client;
import haxe.Json;
import sys.io.File;
import ecs.Universe;
import haxe.Timer;
import systems.commands.*;
import systems.commands.mod.*;
import firebase.web.app.FirebaseApp;
import js.lib.Promise;
import components.*;

class Main {
	public static var app:FirebaseApp;
	public static var client:Client;
	public static var commands:Map<String, ApplicationCommand> = [];
	public static var commands_active:Bool = false;
	public static var connected:Bool = false;
	public static var config:TConfig;
	public static var universe:Universe;
	public static var dm_help_tracking:Map<String, Float> = [];

	#if block
	public static final guild_id:String = "416069724158427137";
	#else
	public static final guild_id:String = "162395145352904705";
	#end

	@:jsasync
	public static function token(rest:REST):Promise<Dynamic> {
		var commands = parseCommands();
		var get = rest.put(Routes.applicationGuildCommands(Main.config.client_id, Main.guild_id), {body: commands}).jsawait();
		return get;
	}

	public static function start() {
		universe = Universe.create({
			entities: 1000,
			phases: [
				{
					name: 'main',
					systems: [
						Hi,
						Archive,
						Help,
						Ban,
						Haxelib,
						Translate,
						Showcase,
						#if update
						Helppls, Ban, Helpdescription,
						#end
						React,
						Notify,
						Helpdescription,
						Rtfm,
						Roundup,
						Run,
						Api,
						Poll,
						Boop,
						ScamPrevention,
						Trace
					]
				}
			]
		});

		#if block
		trace('DEBUG BLOCK ACTIVE, CHANGE PROFILE FOR PRODUCTION DEBUG');
		#end

		client = new Client({
			intents: [
				IntentFlags.GUILDS,
				IntentFlags.GUILD_MESSAGES,
				IntentFlags.DIRECT_MESSAGES,
				IntentFlags.GUILD_MEMBERS,
				IntentFlags.GUILD_MESSAGE_REACTIONS
			]
		});

		client.once('ready', (clients) -> {
			trace('Ready!');
			Main.client = cast clients[0];
			connected = true;

			var get_commands = parseCommands();
			var rest = new REST({version: '9'}).setToken(Main.config.discord_token);
			var res = token(rest);
			res.then(function(foo:Array<Dynamic>) {
				commands_active = true;
				for (item in foo) {
					trace('${item.name} registered');
				}
			}, err);

			var count = 0;
			// function createCommand() {
			// 	Timers.setTimeout(function() {
			// 		Main.client.application.commands.create(cast get_commands[count]).then(function(command) {
			// 			saveCommand(command);

			// 			if (count + 1 != get_commands.length) {
			// 				createCommand();
			// 			} else {
			// 				trace('Commands activated!');
			// 				commands_active = true;
			// 			}
			// 			count++;
			// 		}, err);
			// 	}, 250);
			// }
			// createCommand();
		});

		client.on('messageCreate', (message:Message) -> {
			if (message.author.bot) {
				return;
			}
			var channel = (message.channel : TextChannel);
			trace(message.content);
			
			if (channel.type == DM) {
				if (dm_help_tracking.exists(message.author.id)) {
					universe.setComponents(universe.createEntity(), CommandForward.helppls, message);
				}
				return;
			}

			if (channel.type == GUILD_TEXT) {
				if (message.content.startsWith("!run")) {
					var code:RunMessage = message.toString();
					universe.setComponents(universe.createEntity(), code, message);
				}

				if (channel.id == '898957515654574121') {
					universe.setComponents(universe.createEntity(), CommandForward.showcase_message, message);
				}

				if (message.content.startsWith("!react")) {
					universe.setComponents(universe.createEntity(), CommandForward.react, message);
				}
			}

			if (channel.type == GUILD_PUBLIC_THREAD && (channel.parentId == '1019922106370232360')) {
				if (message.content.startsWith("[showcase]")) {
					universe.setComponents(universe.createEntity(), CommandForward.showcase, message);
				}
			}

			
			universe.setComponents(universe.createEntity(), CommandForward.scam_prevention, message);
		});

		client.on('ChatInputAutoCompleteEvent', (incoming) -> {
			trace('disconnected');
			trace(incoming);
		});

		client.on('interactionCreate', (interaction:BaseCommandInteraction) -> {
			if (interaction.isButton()) {
				if (interaction.customId == 'showcase_agree') {
					universe.setComponents(universe.createEntity(), CommandForward.showcase_agree, interaction);
				}

				if (interaction.customId == 'showcase_disagree') {
					universe.setComponents(universe.createEntity(), CommandForward.showcase_disagree, interaction);
				}
				
				return;
			}
			if (!interaction.isCommand() && !interaction.isAutocomplete() && !interaction.isChatInputCommand()) {
				return;
			}
			var command = createCommand(interaction);
			universe.setComponents(universe.createEntity(), command, interaction);
		});

		client.login(config.discord_token);

		new Timer(500).run = function() {
			if (!connected || !commands_active) {
				return;
			}
			universe.update(1);
		}
	}

	public static function createCommand(interaction:BaseCommandInteraction) {
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

		return command;

		if (command.content == null) {
			trace(interaction);
			trace(enum_id);
			trace('Unmatched command. (${command.name})');
		}
		return null;
	}

	public static function getCommand(name:String) {
		if (Main.commands == null) {
			return null;
		}
		for (command in Main.commands) {
			if (name == command.name) {
				return command;
			}
		}
		return null;
	}

	static function err(err) {
		trace(err);
	}

	static function saveCommand(command:ApplicationCommand) {
		Main.commands.set(command.name, command);
		trace('registered ${command.name}');
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

		start();
	}

	static function parseCommands() {
		var command_defs = config.commands;
		if (command_defs == null || command_defs.length == 0) {
			throw 'No commands configured in the config.json file.';
		}

		var commands = new Array<AnySlashCommand>();
		for (command in command_defs) {
			#if block
			if (command.name != "scamprevention") {
				continue;
			}
			#end
			var permission = command.is_public == null ? true : command.is_public;
			var main_command = new SlashCommandBuilder().setName(command.name).setDescription(command.description).setDefaultPermission(permission);
			if (command.params != null) {
				for (param in command.params) {
					var autocomplete = false;
					if (param.autocomplete != null) {
						autocomplete = param.autocomplete;
					}

					switch (param.type) {
						case user:
							main_command.addUserOption(new SlashCommandUserOption().setName(param.name)
								.setDescription(param.description)
								.setRequired(param.required));
						case string:
							var cmd = new SlashCommandStringOption().setName(param.name).setRequired(param.required).setAutocomplete(autocomplete);
							if (param.description != null) {
								cmd = cmd.setDescription(param.description);
							}
							if (param.choices != null && !autocomplete) {
								var choices = [];
								for (option in param.choices) {
									choices.push({name: option.name, value: option.value});
								}
								cmd.addChoices(...Rest.of(choices));
							}
							if (param.name == 'api') {
								trace('here');
								trace(autocomplete);
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
	var deepl_key:String;
	var last_roundup_posted:Int;
	var commands:Array<TCommands>;
}

typedef Foo = ApplicationCommandData;

typedef TCommands = {
	var type:CommandType;
	var name:String;
	var description:String;
	@:optional var is_public:Bool;
	@:optional var params:Array<TCommands>;
	@:optional var required:Bool;
	@:optional var autocomplete:Bool;
	@:optional var choices:Array<{name:String, value:EitherType<Int, String>}>;
}

typedef RegisteredApplicationCommand = {
	public var application_id:Snowflake;
	public var default_permission:Bool;
	public var default_member_permission:Dynamic;
	public var description:String;
	public var guild_id:Snowflake;
	public var id:Snowflake;
	public var name:String;
	public var options:Array<ApplicationCommandOption>;
	public var type:CommandType;
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
	var react;
	var showcase;
	var showcase_agree;
	var showcase_disagree;
	var showcase_message;
}
