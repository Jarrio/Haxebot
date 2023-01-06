package commands;

import discord_js.MessageAttachment;
import discord_js.MessageEmbed;
import commands.mod.Mention.TMention;
import firebase.web.app.FirebaseApp;
import discord_js.Message;
import systems.TextCommandBase;

class TextMention extends TextCommandBase {
	var cached = false;
	var permissions:Map<String, TMention> = [];
	var roles:Map<String, String> = [];

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

		Firestore.getDoc(doc(db, 'discord/admin')).then(function(doc) {
			for (role in (doc.data().roles:Array<TTag>)) {
				this.roles.set(role.tag, role.id);
			}
		}, err);
	}

	function run(message:Message, content:String) {
		if (!cached || this.roles == null) {
			return;
		}

		if (!this.permissions.exists(message.author.id)) {
			return;
		}

		var user = this.permissions.get(message.author.id);
		var found = 0;
		var roles_found = '';

		for (tag => id in this.roles) {
			var copy = content.toLowerCase();
			if (copy.contains(tag)) {
				var pos = copy.indexOf(tag);
				var mention = content.substring(pos, pos + tag.length);
				content = content.replace(mention, '<@&$id>');
				break;
			}
		}

		for (role in user.roles) {
			if (content.contains('<@&$role>')) {
				roles_found += '<@&$role>';
				content = content.replace('<@&$role>', '').trim();
				found++;
			}
		}

		if (found > 0) {
			var attachments = new js.lib.Map<String, MessageAttachment>();
			if (message.attachments.size > 0) {
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

typedef TTag = {
	var tag:String;
	var id:String;
}