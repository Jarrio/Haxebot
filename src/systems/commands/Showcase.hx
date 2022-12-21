package systems.commands;

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

class Showcase extends CommandBase {
	var channel:TextChannel;
	#if block
	final channel_id = '597067735771381771';
	#else
	final channel_id = '162664383082790912';
	#end

	var webhook:WebhookClient;
	var checking = false;
	@:fastFamily var modal:{command:BaseCommandInteraction, modal:ShowcaseModalSubmit};
	@:fastFamily var messages:{command:CommandForward, message:Message};
	@:fastFamily var interactions:{command:CommandForward, interaction:BaseCommandInteraction};

	public function new(_) {
		super(_);

		this.webhook = new WebhookClient({url: Main.keys.showcase_hook});
	}

	override function update(_:Float) {
		super.update(_);

		if (this.channel == null && !checking) {
			checking = true;
			Main.client.channels.fetch(this.channel_id).then(function(channel) {
				this.channel = channel;
				checking = false;
				trace('loaded showcase channel');
			}, err);
		}

		iterate(modal, entity -> {
			this.channel.send('${modal.title_or_link} \n ${modal.description}').then(function(_) {
				command.reply('Your post was submitted to the showcase channel!');
			});

			this.universe.deleteEntity(entity);
		});

		iterate(messages, entity -> {
			if (command == CommandForward.showcase_message) {
				var regex = ~/https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)/ig;
				if (!regex.match(message.content) && message.attachments.size == 0) {
					var content = '```\n${message.content}\n```';
					content += '\n Your message was removed due to not having any attachments or links. Please chat within threads only.';
					message.author.send(content).then(function(succ) {
						message.delete();
					}, err);
				}

				this.universe.deleteEntity(entity);
				return;
			}

			if (command != CommandForward.showcase && !channel.isThread()) {
				return;
			}


			#if !block
			var thread = cast(message.channel.asType0, ThreadChannel);
			if (thread.id != "1024905470621798410") { // TODO: (LD thread id) better solution
				if (thread.ownerId != message.author.id) {
					return;
				}
			}
			#else
			var thread = cast(message.channel.asType0, TextChannel);
			#end

			var arr = [];

			var content = message.content.substring(10).trim();
			for (a in message.attachments) {
				arr.push(a);
				trace(a);
			}
			var name = message.author.username;
			if (message.member.nickname != null && message.member.nickname.length > 0) {
				name = message.member.nickname;
			}
			var cont = () -> this.webhook.send({
				content: '***Continue the conversation at - <#${thread.id}>***',
				username: name,
				avatarURL: message.author.avatarURL()
			});

			//trace(message.attachments);
			this.webhook.send({
				content: content,
				username: name,
				avatarURL: message.author.avatarURL(),
				files: arr
			}).then(function(_) {
				cont();
			}, function (err:{message:String}, ?posInfo:PosInfos) {
				if (err!.message.contains("Request entity too large")) {
					this.webhook.send({
						content: content + '\n' + arr[0].url,
						username: name,
						avatarURL: message.author.avatarURL()
					}).then(function(_) {
						cont();
					});
				}
			});

			this.universe.deleteEntity(entity);
		});

		iterate(interactions, entity -> {
			if (command == CommandForward.showcase_agree) {
				interaction.member.roles.add('1021517470080700468').then(function(success) {
					interaction.reply({content: 'Thanks! You can now post in <#162664383082790912>', ephemeral: true});
				}, err);
			}

			if (command == CommandForward.showcase_disagree) {
				interaction.reply({content: "Keep on lurking :)", ephemeral: true});
			}

			this.universe.deleteEntity(entity);
		});
	}

	function run(command:Command, interaction:BaseCommandInteraction) {
		var text = 'If your post does not contain either an __**attachment**__ or a __**link**__, the post will be removed. Any comments on any of the works posted in the <#162664383082790912> channel should be made within threads. \n\n**Guidelines**\n1. Programming projects must be haxe related\n2. Comments on posts should be made within threads\n3. Art and Music showcases are allowed here';
		var agree_btn = new ButtonBuilder().setCustomId('showcase_agree').setLabel('Agree').setStyle(Primary);
		var disagree_btn = new ButtonBuilder().setCustomId('showcase_disagree').setLabel('Disagree').setStyle(Secondary);
		var row = new APIActionRowComponent().addComponents(agree_btn, disagree_btn);

		interaction.reply({content: text, components: [row], ephemeral: true});
	}

	function get_name():String {
		return 'showcase';
	}
}
