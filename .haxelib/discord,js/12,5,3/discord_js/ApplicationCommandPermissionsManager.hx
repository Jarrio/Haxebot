package discord_js;

import discord_js.RoleResolvable;
import discord_js.UserResolvable;
import haxe.extern.EitherType;
import discord_js.GuildResolvable;
import js.lib.Promise;
import discord_js.Snowflake;

extern class ApplicationCommandPermissionsManager {
	var client:Client;
	var commandId:Snowflake;
	var guild:Guild;
	var guildId:Snowflake;
	function add(option:AddApplicationCommandPermissionsOptions):Promise<Array<ApplicationCommandPermissions>>;
	function fetch(option:BaseApplicationCommandPermissionsOptions):Promise<Array<ApplicationCommandPermissions>>;
	function has(option:AddApplicationCommandPermissionsOptions):Promise<Array<Bool>>;
	function remove(option:AddApplicationCommandPermissionsOptions):Promise<Array<ApplicationCommandPermissions>>;
	function set(option:SetApplicationCommandPermissionsOptions):Promise<Array<ApplicationCommandPermissions>>;
}

typedef SetApplicationCommandPermissionsOptions = {
	> AddApplicationCommandPermissionsOptions,
	@:optional var fullPermissions:Array<{}>;
}

typedef AddApplicationCommandPermissionsOptions = {
	@:optional var permissions:Array<ApplicationCommandPermissionData>;
}

typedef ApplicationCommandPermissionData = {
	var id:Snowflake;
	var type:Int;
	var permission:Bool;
}

typedef BaseApplicationCommandPermissionsOptions = {
	var guild:GuildResolvable;
	var command:EitherType<ApplicationCommand, Snowflake>;
}

typedef RemoveApplicationCommandPermissionsOptions = {
	var users:EitherType<UserResolvable, Array<UserResolvable>>;
	var roles:EitherType<RoleResolvable, Array<RoleResolvable>>;
}

typedef ApplicationCommandPermissions = ApplicationCommandPermissionData;

enum abstract ApplicationCommandPermissionType(String) {
	var ROLE;
	var USER;
}