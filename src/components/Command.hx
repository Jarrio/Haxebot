package components;

import discord_js.User;

typedef Command = {
	var name:String;
	var content:CommandOptions;
}

enum CommandOptions {
	None;
	Hi;
	Help(category:String);
	Haxelib(command:String);
}