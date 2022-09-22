package discord_js;

import js.lib.Promise;
import discord_js.ThreadManager;

@:jsRequire("discord.js", "MessagePayload") extern class MessagePayload {
	private var _edits : Array<Message>;
	private function patch(data:Dynamic):Message;
	public var activity : Null<MessageActivity>;
	public var application : Null<ClientApplication>;
	public var attachments : Collection<String, MessageAttachment>;
	public var author : User;
	public var options: {};

	public function new(target:Message, ?options:{}):Void;

	public function toString():String;
	public function unpin(?options:{ @:optional var reason : String; }):js.lib.Promise<Message>;
	static var prototype : Message;
}