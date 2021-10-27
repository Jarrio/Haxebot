package components;

import discord_js.User;

typedef Command = {
	var name:String;
	var content:CommandOptions;
}

enum CommandOptions {
	None;
	Hi;
	Notify(channel:String);
	Code(code:String);
	Help(category:String);
	Haxelib(command:String);
}