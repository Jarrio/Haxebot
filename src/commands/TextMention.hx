package commands;

import discord_js.MessageEmbed;
import commands.mod.Mention.TMention;
import firebase.web.app.FirebaseApp;
import discord_js.Message;
import systems.TextCommandBase;

class TextMention extends TextCommandBase {
	var cached = false;
	var permissions:Map<String, TMention> = [];

	override function onEnabled() {
		var db = Firestore.getFirestore(FirebaseApp.getApp());
		Firestore.onSnapshot(collection(db, 'discord/admin/mentions'), function(resp) {
			for (doc in resp.docs) {
				var data = (doc.data() : TMention);
				permissions.set(data.user, data);
			}

			if (!cached) {
				cached = true;
			}
		});
	}

	function run(message:Message, content:String) {
		if (!cached) {
			return;
		}

		if (!this.permissions.exists(message.author.id)) {
			return;
		}

		var user = this.permissions.get(message.author.id);
		var found = 0;
		var roles_found = '';
		for (role in user.roles) {
			if (content.contains('<@&$role>')) {
				roles_found += '<@&$role>';
				content = content.replace('<@&$role>', '').trim();
				found++;
			}
		}

		if (found > 0) {
			var attachments = [];
			if (message.attachments.length > 0) {
				attachments = message.attachments;
			}
			var embed = new MessageEmbed();
			embed.setDescription(content);
			embed.setTitle('*${message.author.username}*');
			embed.setThumbnail(message.author.avatarURL());
			message.reply({content: roles_found, embeds: [embed], attachments: attachments, allowedMentions: {roles: user.roles}}).then(function(_) {
				message.delete();
			}, err);
		}
	}

	function get_name():String {
		return '!mention';
	}
}
