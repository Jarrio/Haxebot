package commands;

import discord_builder.BaseCommandInteraction;
import discord_js.Message;
import components.Command;
import systems.CommandBase;
import discord_js.WebhookClient;
import Main.CommandForward;

class VoiceChatBridge extends CommandBase {
	var voice_text_chat:WebhookClient;
	var voice_channel_chat:WebhookClient;
	final mentions = {parse: ['users']};

	@:fastFamily var messages:{cmd:CommandForward, message:Message};

	override function onEnabled() {
		var obj = #if block Main.keys.debug_hooks #else Main.keys.hooks #end;
		var vc = obj.voice_channel;
		var vt_channel = obj.voice_text_channel;

		voice_channel_chat = new WebhookClient({url: vc});
		voice_text_chat = new WebhookClient({url: vt_channel});
	}

	override function update(_:Float) {
		super.update(_);

		iterate(messages, (entity) -> {
			var name = message.author.displayName;
			var msg = {
				content: message.content,
				username: name,
				avatarURL: message.author.avatarURL(),
				files: message.attachments,
				allowedMentions: mentions
			}
			switch(cmd) {
				case voice_chat_bridge:
					voice_channel_chat.send(msg).then(null, (err) -> trace(err));
					universe.deleteEntity(entity);
				case voice_channel_bridge:
					voice_text_chat.send(msg).then(null, (err) -> trace(err));
					universe.deleteEntity(entity);
				default:
			}
		});
	}

	function run(command:Command, interaction:BaseCommandInteraction) {}

	function get_name():String {
		return '--nocommand';
	}
}
