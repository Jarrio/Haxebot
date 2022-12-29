import discord_js.GuildMember;
import haxe.PosInfos;
import systems.CommandBase;
import discord_js.PermissionFlags;
import firebase.web.auth.Auth;
import haxe.Rest;
import discord_api_types.Routes;
import discordjs.rest.REST;
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
import commands.Run;
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
import commands.*;
import firebase.web.app.FirebaseApp;
import js.lib.Promise;
import commands.AutoRole;
import commands.mod.Social;


class Main {
	public static var app:FirebaseApp;
	public static var logged_in:Bool = false;
	public static var auth:firebase.web.auth.User;
	public static var client:Client;
	public static var registered_commands:Map<String, ApplicationCommand> = [];
	public static var commands_active:Bool = false;
	public static var connected:Bool = false;
	public static var keys:TKeys;
	public static var state:TState;
	public static var command_file:Array<TCommands>;
	public static var universe:Universe;
	public static var dm_help_tracking:Map<String, Float> = [];
	private static var active_systems:Map<String, Bool> = [];
	#if block
	public static final guild_id:String = "416069724158427137";
	#else
	public static final guild_id:String = "162395145352904705";
	#end

	public static var discord(get, never):TDiscordConfig;

	static function get_discord() {
		var config = null;
		#if block
		config = Main.keys.discord_test;
		#else
		config = Main.keys.discord_live;
		#end
		return config;
	}

	public static function token(rest:REST):Promise<Dynamic> {
		var commands = parseCommands();
		var get = rest.put(Routes.applicationGuildCommands(discord.client_id, Main.guild_id), {body: commands});
		return get;
	}

	public static function start() {
		universe = Universe.create({
			entities: 1000,
			phases: [
				{
					name: 'testing',
					enabled: #if block true #else false #end,
					systems: [
						Reminder
					],
				},
				{
					name: 'main',
					enabled: #if block false #else true #end,
					systems: [
						#if update
						Helppls Ban, Helpdescription,
						#end
						Reminder,
						Social,
						AutoRole,
						Twitter,
						Quote,
						ScamPrevention,
						Api,
						Haxelib,
						Trace,
						React,
						Notify,
						Rtfm,
						Poll,
						Boop,
						Archive,
						Help,
						Translate,
						Hi,
						Run,
						Roundup,
						Showcase
					]
				}
			]
		});

		client = new Client({
			intents: [
				IntentFlags.GUILDS,
				IntentFlags.MESSAGE_CONTENT,
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

			var rest = new REST({version: '9'}).setToken(discord.token);
			var res = token(rest);
			res.then(function(foo:Array<RegisteredApplicationCommand>) {
				commands_active = true;
				for (item in foo) {
					trace('DEBUG - ${item.name} is REGISTERED');
				}
				
				#if block
				trace('DEBUG - TESTING ON DEVELOPER TOKEN NOT FOR LIVE');
				#end
			}, err);
		});

		client.on('guildMemberAdd', (member:GuildMember) -> {
			trace('member ${member.user.tag}');
			universe.setComponents(universe.createEntity(), CommandForward.add_event_role, member);
		});

		client.on('messageCreate', (message:Message) -> {
			if (message.author.bot) {
				return;
			}
			var channel = (message.channel : TextChannel);

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

				if (channel.id == '162664383082790912') {
					universe.setComponents(universe.createEntity(), CommandForward.showcase_message, message);
				}

				if (message.content.startsWith("!react")) {
					universe.setComponents(universe.createEntity(), CommandForward.react, message);
				}
			}
			var check = false;

			#if block
			check = (channel.id == '597067735771381771');
			#else
			check = (channel.type == GUILD_PUBLIC_THREAD && (channel.parentId == '1019922106370232360'));
			#end

			if (check) {
				if (message.content.startsWith("[showcase]")) {
					trace('here');
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

			if (interaction.isModalSubmit()) {
				switch (interaction.customId) {
					case 'quote_set':
						universe.setComponents(universe.createEntity(), CommandForward.quote_set, interaction);
					case 'quote_edit':
						universe.setComponents(universe.createEntity(), CommandForward.quote_edit, interaction);
					default:
						trace(interaction.customId + ' - unhandled model');
				}
				return;
			}

			if (!interaction.isCommand() && !interaction.isAutocomplete() && !interaction.isChatInputCommand()) {
				return;
			}
			var command = createCommand(interaction);

			universe.setComponents(universe.createEntity(), command, interaction);
		});

		client.login(discord.token);
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

		for (value in command_file) {
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
		if (Main.registered_commands == null) {
			return null;
		}
		for (command in Main.registered_commands) {
			if (name == command.name) {
				return command;
			}
		}
		return null;
	}

	static function saveCommand(command:ApplicationCommand) {
		Main.registered_commands.set(command.name, command);
		trace('registered ${command.name}');
	}

	static function main() {
		try {
			keys = Json.parse(File.getContent('./config/keys.json'));
			command_file = Json.parse(File.getContent('./config/commands.json'));
			state = Json.parse(File.getContent('./config/state.json'));
		} catch (e) {
			trace(e.message);
		}

		if (keys == null || discord.token == null) {
			throw('Enter your discord auth token.');
		}

		Main.app = FirebaseApp.initializeApp(keys.firebase);
		Auth.signInWithEmailAndPassword(Auth.getAuth(), keys.username, keys.password).then(function(res) {
			trace('logged in');
			Main.auth = res.user;
			Main.logged_in = true;
		}, err);

		start();
	}

	static function parseCommands() {
		if (command_file == null || command_file.length == 0) {
			throw 'No commands configured in the config.json file.';
		}

		var commands = new Array<AnySlashCommand>();
		for (command in command_file) {
			if (command.is_public != null && !command.is_public) {
				continue;
			}

			var permission = CommandPermission.fromString(command.permissions);
			if (permission == null) {
				permission = everyone;
			}

			var main_command = new SlashCommandBuilder().setName(command.name).setDescription(command.description).setDefaultMemberPermissions(permission);

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
}

enum abstract CommandPermission(Int) to Int {
	var admin = PermissionFlags.ADMINISTRATOR;
	var supermod = PermissionFlags.BAN_MEMBERS;
	var everyone = VIEW_CHANNEL | SEND_MESSAGES;
	@:from public static function fromString(value:String):CommandPermission {
		return switch(value) {
			case "admin": admin;
			case "supermod": supermod;
			case "everyone": everyone;
			default: everyone;
		}
	}
}

typedef THelpPls = {
	var user:User;
	var content:String;
	var message:Message;
}

typedef TKeys = {
	var username:String;
	var password:String;
	var firebase:FirebaseOptions;
	var deepl_key:String;
	var discord_live:TDiscordConfig;
	var discord_test:TDiscordConfig;
	var twitter_token:String;
	var showcase_hook:String;
}

typedef TDiscordConfig = {
	var token:String;
	var secret:String;
	var server_id:String;
	var client_id:String;
}

typedef TState = {
	var macros:Bool;
	var project_name:String;
	var twitter_since_id:String;
	var last_roundup_posted:Int;
}

typedef Foo = ApplicationCommandData;

typedef TCommands = {
	var type:CommandType;
	var name:String;
	var description:String;
	@:optional var is_public:Bool;
	@:optional var permissions:String;
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
	var context_menu;
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
	var quote_set;
	var quote_edit;
	var add_event_role;
}
