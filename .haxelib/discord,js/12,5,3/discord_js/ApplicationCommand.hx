package discord_js;

import discord_api_types.ChannelType;
import discord_api_types.ApplicationCommandOptionType;

extern class ApplicationCommand extends Base {
	public var applicationId:Snowflake;
	public var createdAt:Date;
	public var createdTimestamp:Float;
	public var defaultPermission:Bool;
	public var description:String;
	public var guild:Guild;
	public var guildId:Snowflake;
	public var id:Snowflake;
	public var manager:ApplicationCommandManager;
	public var name:String;
	public var options:Array<ApplicationCommandOption>;
	public var permissions:ApplicationCommandPermissionsManager;
}

typedef ApplicationCommandOption = {
	var type:ApplicationCommandOptionType;
	var name:String;
	var description:String;
	var required:Bool;
	var choices:Array<ApplicationCommandOptionChoice>;
	var options:Array<ApplicationCommandOption>;
	var channelTypes:Array<ChannelType>;
}

typedef ApplicationCommandOptionChoice = {
	var name:String;
	var value:String;
}