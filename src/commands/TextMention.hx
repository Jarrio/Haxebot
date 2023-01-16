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
		var thumb = null;
		for (role in user.roles) {
			if (content.contains('<@&$role>')) {
				roles_found += '<@&$role>';
				content = content.replace('<@&$role>', '').trim();
				switch(role) {
					case '914171888748609546': //ceramic logo
						thumb = 'https://raw.githubusercontent.com/ceramic-engine/ceramic/master/tools/resources/AppIcon-128.png';
					case '1059447670344794142': //hxgodot
						thumb = 'https://camo.githubusercontent.com/f171b5935350515b274913adb4a080390e6075c46cafa43dd24efe3b37afb4f1/68747470733a2f2f6878676f646f742e6769746875622e696f2f6c6f676f322e706e67';
					case '761714697468248125': //flixel
						thumb = 'https://cdn.discordapp.com/emojis/230369617774641152.webp?size=96&quality=lossless';
					case '761714853403820052': //haxeui
						thumb = 'https://cdn.discordapp.com/emojis/567736760243847169.webp?size=96&quality=lossless';
					case '761714775902126080': //heaps
						thumb = 'https://cdn.discordapp.com/emojis/567739201341095946.webp?size=96&quality=lossless';
					default:
				}
				found++;
			}
		}

		if (found > 0) {
			var attachments = new js.lib.Map<String, MessageAttachment>();
			if (message.attachments.size > 0) {
				attachments = message.attachments;
			}
			if (thumb == null) {
				thumb = message.author.avatarURL();
			}
			var embed = new MessageEmbed();
			embed.setDescription(content);
			embed.setTitle('*${message.author.username}*');
			embed.setThumbnail(thumb);
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