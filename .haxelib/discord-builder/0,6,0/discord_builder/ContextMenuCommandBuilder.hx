package discord_builder;

import haxe.extern.EitherType;

@:jsRequire('@discordjs/builders', 'ContextMenuCommandBuilder')
extern class ContextMenuCommandBuilder {
	public var name:String;
	public var name_localizations:Array<String>;
	public var type:ContextMenuCommandType;
	public var dm_permission:Bool;
	public var default_member_permissions:String;
	public function new();
	public function setDMPermission(permissions:Bool):ContextMenuCommandBuilder;
	public function setDefaultMemberPermissions(permissions:EitherType<String, Int>):ContextMenuCommandBuilder;
	public function setName(command_name:String):ContextMenuCommandBuilder;
	public function setType(type:ContextMenuCommandType):ContextMenuCommandBuilder;
	public function setNameLocalization(locale:Locale, ?localised_name:String):ContextMenuCommandBuilder;
	public function toJSON():String;
}

enum abstract ContextMenuCommandType(String) {
	var USER;
	var MESSAGE;
}

enum abstract Locale(String) {
	var US = 'en-US';
	var GB = 'en-GB';
}