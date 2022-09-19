package discord_builder;

import discord_js.ApplicationCommand.ApplicationCommandOptionChoice;
import discord_js.MessageAttachment;
import discord_js.FileOptions;
import discord_js.MessageMentionOptions;
import discord_api_types.APIEmbed;
import haxe.extern.EitherType;
import discord_js.MessageEmbed;
import discord_js.User;
import discord_js.Message;
import js.lib.Promise;
import discord_api_types.InteractionType;
import discord_api_types.Snowflake;

@:jsRequire("discord.js", "CommandInteraction") 
extern class CommandInteraction extends Interaction {
	var ephemeral:Bool;
	var command:Dynamic;
	var commandId:Snowflake;
	var commandName:String;
	var deferred:Bool;
	var replied:Bool;
	var type:InteractionType;
	
	function reply():Promise<Message>;
	function showModal(modal:ModalBuilder):Promise<Void>;
}
