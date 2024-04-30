package commands;

import haxe.PosInfos;
import discord_js.WebhookClient;
import discord_builder.ButtonBuilder;
import discord_js.ThreadChannel;
import components.ShowcaseModalSubmit;
import discord_builder.APIActionRowComponent;
import discord_js.TextChannel;
import discord_builder.BaseCommandInteraction;
import components.Command;
import Main.CommandForward;
import discord_js.Message;
import systems.CommandBase;
import js.Browser;

class JamSuggestionBox extends CommandBase {
	var channel:TextChannel;
	#if block
	final channel_id = '1100053767493255182';
	#else
	final channel_id = '1234817988377706557';
	#end

	@:fastFamily var messages:{command:CommandForward, message:Message};

	var webhook:WebhookClient;
	public function new(_) {
		super(_);
		this.webhook = new WebhookClient({url: Main.keys.suggestionbox_hook});
	}

	override function update(_:Float) {
		super.update(_);

		iterate(messages, entity -> {
			switch(command) {
				case suggestion_box:
					var name = message.author.username;
					if (message.member.nickname != null && message.member.nickname.length > 0) {
						name = message.member.nickname;
					}
					this.webhook.send({
						username: name,
						content: '#theme ' + message.content,
						avatarURL: message.author.avatarURL()
					}).then(null, function(err:{message:String}) {
						trace(err);
					});
					message.delete().then(null, (err) -> trace(err));
					this.universe.deleteEntity(entity);
				default:
			}
		});
	}

	function run(command:Command, interaction:BaseCommandInteraction) {}

	function get_name():String {
		return 'jamsuggestionbox';
	}
}
