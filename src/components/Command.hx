package components;

import discord_js.Role;
import discord_js.User;

typedef Command = {
	var name:String;
	var content:CommandOptions;
}

@:keep
enum CommandOptions {
	Hi;
	Threadcount;
	Archive;
	SnippetTags;
	SnippetList(user:User, show_desc:Bool);
	Color(role:String);	
	TrackerCreate(name:String, keywords:String, description:String, string_exclude:String, channel_exclude:String, user_exclude:String);	
	TrackerDelete(name:String);	
	RatelimitCreate(user:User, counter:Int, time:String, reason:String);	
	RatelimitDelete(user:User);	
	SnippetEdit(id:String);	
	SnippetDelete(id:String);	
	SnippetSearch(taga:String, tagb:String, tagc:String);
	SnippetAdd(url:String, title:String, description:String, taga:String, tagb:String, tagc:String, tagd:String, tage:String);
	Reminder(content:String, when:String, personal:Null<Bool>, thread_reply:Null<Bool>);
	Social(tag:Null<String>, user:Null<String>);
	Ban(user:User, reason:String, delete_messages:String);
	Say(message:String, message_id:Null<String>);
	React(message_id:String, emoji:String);
	Helppls(topic:String);
	Run(code:String);
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
	Help(category:String);
	Haxelib(command:String);
	QuoteList(user:User);
	QuoteGet(name:String);
	QuoteDelete(name:String);
	QuoteEdit(name:String);
	QuoteCreate(name:String);
	Rrannouncer(name:User);
	EmojiGet(name:String, size:Null<String>);
	EmojiRemove(name:String);
	EmojiEdit(name:String);
	EmojiCreate(name:String, url:String, description:String);

	Everyone(content:String);
	//Mention(user:User, role:Role);
	Showcase;
	PinMessage;
	Code;
	CodeLineNumbers;
}
