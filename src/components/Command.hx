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
	Helppls;
	Boop(user:User);
	Poll(question:String, time:Int);
	Roundup(number:Float);
	Rtfm(channel:String);
	Helpdescription(description:String);
	Api(channel:String);
	Notify(channel:String);
	Code(code:String);
	Help(category:String);
	Haxelib(command:String);
}