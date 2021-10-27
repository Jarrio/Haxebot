package discord_js;

import js.lib.Promise;

@:jsRequire("discord.js", "ApplicationCommandManager")
extern class ApplicationCommandManager {
	public var cache:Collection<Snowflake, ApplicationCommand>; 
	public var permissions:ApplicationCommandPermissionsManager;
	function create(command:ApplicationCommandData, ?guildId:Snowflake):Promise<ApplicationCommand>;
	function delete(command:ApplicationCommandData, ?guildId:Snowflake):Promise<Null<ApplicationCommand>>;

}

typedef ApplicationCommandData = {
	var name:String;
	var description:String;
	@:optional var type:ApplicationCommandType;
	@:optional var options:Array<ApplicationCommandOptionData>;
	@:optional var defaultPermissions:Bool;
}

enum abstract ApplicationCommandType(String) {
	var CHAT_INPUT;
	var USER;
	var MESSAGE;
}

typedef ApplicationCommandOptionData = {
	//Complete @ https://discord.js.org/#/docs/main/stable/typedef/ApplicationCommandOptionData
}

