package components;

import systems.commands.Poll.PollTime;
import discord_js.User;

typedef Command = {
	var name:String;
	var content:CommandOptions;
}

@:keep
enum CommandOptions {
	Hi;
	Archive;
	Ban(user:User, reason:String, delete_messages:String);
	React(emoji:String, message_id:String);
	Helppls(topic:String);
	Trace(code:String);
	Boop(user:User);
	Poll(question:String, length:String, a:Null<String>, b:Null<String>, c:Null<String>, d:Null<String>, e:Null<String>, f:Null<String>, g:Null<String>,
		votes:Null<Int>);
	Roundup(number:Float);
	Rtfm(channel:String);
	Translate(to:String, message:String, from:String);
	Helpdescription(description:String);
	Api(content:String, field:String);
	Notify(channel:String);
	Code(code:String);
	Help(category:String);
	Haxelib(command:String);	
	Quote(type:String, name:String);	
	Showcase;
}

