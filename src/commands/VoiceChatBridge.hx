package commands;

import discord_js.MessageOptions;
import discord_js.TextChannel;
import discord_js.VoiceChannel;
import discord_builder.BaseCommandInteraction;
import discord_js.Message;
import components.Command;
import systems.CommandBase;
import discord_js.WebhookClient;
import discord_js.Collection;
import Main.CommandForward;
import discord_js.MessageMentionOptions;

class VoiceChatBridge extends CommandBase {
	var voice_text_chat:WebhookClient;
	var voice_channel_chat:WebhookClient;

	final mentions:MessageMentionOptions = {parse: []};
	final voicetext = #if block "714201892959289500" #else "220626116627529728" #end;
	final voice = #if block "416069724657418244" #else "198219256687493120" #end;

	var voice_channel:VoiceChannel;
	var text_channel:TextChannel;

	var map_cache:Map<String, String> = [];

	@:fastFamily var messages:{cmd:CommandForward, message:Message};

	override function onEnabled() {
		var obj = #if block Main.keys.debug_hooks #else Main.keys.hooks #end;
		var vc = obj.voice_channel;
		var vt_channel = obj.voice_text_channel;

		voice_channel_chat = new WebhookClient({url: vc});
		voice_text_chat = new WebhookClient({url: vt_channel});
		Main.client.channels.fetch(voicetext).then(function(channel:TextChannel) {
			trace("got voice text channel");
			text_channel = channel;
		}, (err) -> trace(err));

		Main.client.channels.fetch(voice).then(function(channel:VoiceChannel) {
			trace("got voice channel");
			voice_channel = channel;
		}, (err) -> trace(err));
	}

	override function update(_:Float) {
		super.update(_);

		iterate(messages, (entity) -> {
			var name = message.author.displayName;
			var msg:MessageOptions = {
				content: message.content,
				username: name,
				avatarURL: message.author.avatarURL(),
				attachments: message.attachments,
				allowedMentions: {
					users: []
				}
			}
			msg.allowedMentions.users.resize(0);
			switch (cmd) {
				case voice_chat_bridge:
					if (message.reference?.messageId != null) {
						text_channel.messages.fetch(message.reference.messageId).then((data:Message) -> {
							if (data.webhookId != null) {
								voice_channel.messages.fetch({limit: 1, around: message.reference.messageId})
									.then((msgs:Collection<String, Message>) -> {
										var key = "";
										var og_msg = null;
										for (k => v in msgs) {
											key = k;
											og_msg = v;
										}

										msg.content = '${og_msg.url} <@${og_msg.author.id}> ${msg.content}';

										msg.allowedMentions.users.push(og_msg.author.id);
										voice_channel_chat.send(msg).then(null, (err) -> trace(err));
									}, (err) -> trace(err));
							} else {
								voice_channel_chat.send(msg).then(null, (err) -> trace(err));
							}
						}, (err) -> trace(err));
					} else {
						voice_channel_chat.send(msg).then(null, (err) -> trace(err));
					}
					universe.deleteEntity(entity);
				case voice_channel_bridge:
					if (message.reference?.messageId != null) {
						voice_channel.messages.fetch(message.reference.messageId).then((data:Message) -> {
							if (data.webhookId != null) {
								text_channel.messages.fetch({limit: 1, around: message.reference.messageId})
									.then((msgs:Collection<String, Message>) -> {
										var key = "";
										var og_msg = null;
										for (k => v in msgs) {
											key = k;
											og_msg = v;
										}

										msg.content = '${og_msg.url} <@${og_msg.author.id}> ${msg.content}';

										msg.allowedMentions.users.push(og_msg.author.id);
										voice_text_chat.send(msg).then(null, (err) -> trace(err));
									}, (err) -> trace(err));
							} else {
								voice_text_chat.send(msg).then(null, (err) -> trace(err));
							}
						}, (err) -> trace(err));
					} else {
						voice_text_chat.send(msg).then(null, (err) -> trace(err));
					}
					
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
