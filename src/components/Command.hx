package components;

import discord_js.User;

typedef Command = {
	var name:String;
	var content:CommandOptions;
}

@:keep
enum CommandOptions {
	Hi;
	Ban(user:User, reason:String, delete_messages:String);
	React(emoji:String, message_id:String);
	Helppls(topic:String);
	Trace(code:String);
	Boop(user:User);
	Poll(question:String, time:Int);
	Roundup(number:Float);
	Session(type:String, id:String, name:String, description:String);
	Rtfm(channel:String);
	Helpdescription(description:String);
	Api(channel:String);
	Notify(channel:String);
	Code(code:String);
	Help(category:String);
	Haxelib(command:String);
}