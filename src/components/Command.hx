package components;

import systems.commands.Poll.PollTypes;
import discord_js.User;

typedef Command = {
	var name:String;
	var content:CommandOptions;
}

@:keep
enum CommandOptions {
	Hi;
	Poll(question:String, type:PollTypes);
	Roundup(number:Float);
	Rtfm(channel:String);
	Api(channel:String);
	Notify(channel:String);
	Code(code:String);
	Help(category:String);
	Haxelib(command:String);
}