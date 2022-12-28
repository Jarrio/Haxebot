package discord_js;

import haxe.extern.EitherType;

typedef MessageOptions = {
	@:optional var tts:Bool;
	@:optional var ephemeral:Bool;
	@:optional var nonce:String;
	@:optional var content:String;
	@:optional var embeds:Array<MessageEmbed>;
	@:optional var allowedMentions:EitherType<Bool, Array<MessageMentionOptions>>;
	@:optional var files:Array<FileOptions>;
	// Not added to the externs
	// @:optional var components:Array<MessageActionR>;
	@:optional var attachments:Array<MessageAttachment>;
	@:optional var reply:ReplyOptions;
}

typedef ReplyOptions = {
	var messageReference:Message;
	@:optional var failIfNotExists:Bool;
}

