package commands.mod;

import js.Browser;
import discord_js.MessageEmbed;
import discord_js.Role;
import discord_js.User;
import components.Command;
import discord_builder.BaseCommandInteraction;
import systems.CommandDbBase;

class Mention extends CommandDbBase {
	function run(command:Command, interaction:BaseCommandInteraction) {
		switch (command.content) {
			case Mention(user, role):
				var query:Query<TMention> = Firestore.query(collection(this.db,
					'discord/admin/mentions'),
					where('user', EQUAL_TO, user.id));
				Firestore.getDocs(query).then(function(resp) {
					var obj:TMention = {
						user: user.id,
						roles: [role.id],
						added_by_name: interaction.user.tag,
						added_by_id: interaction.user.id,
						timestamp: Date.now().getTime()
					};

					var found = -1;
					if (!resp.empty) {
						obj = resp.docs[0].data();
						for (k => r in obj.roles) {
							if (r == role.id) {
								found = k;
								break;
							}
						}

						if (found != -1) {
							obj.roles.remove(role.id);
						} else {
							obj.roles.push(role.id);
						}
					}

					if (resp.empty) {
						Firestore.addDoc(collection(this.db, 'discord/admin/mentions'), obj)
							.then(function(_) {
								var embed = this.embed(role, (found != -1));
								interaction.reply({content: '<@${user.id}>', embeds: [embed]});
							});
					} else {
						Firestore.updateDoc(resp.docs[0].ref, obj).then(function(_) {
							var embed = this.embed(role, (found != -1));
							interaction.reply({content: '<@${user.id}>', embeds: [embed]});
						});
					}
				});
			default:
		}
	}

	function embed(role:Role, found:Bool) {
		var embed = new MessageEmbed();
		var desc = 'Role ${role.name} removed from user';
		if (!found) {
			desc = 'You can now use the `!mention` text command to ping the members of the <@&${role.id}> role!\n';
			desc += '**Example:**```\n!mention @${role.name} Hey I just updated things! Check it out and vote for the next feature!```';
			desc += 'Currently this does not support attachments, so send any attachments before/after the !mention command';
		}

		embed.setTitle('Permission Update');
		embed.setDescription(desc);

		return embed;
	}

	function parseTwitter(interaction:BaseCommandInteraction, tag:String, user:String) {
		if (tag == null && user == null) {
			interaction.reply('Invalid input').then(null, function(err) {
				trace(err);
				Browser.console.dir(err);
			});
			return;
		}

		if (tag != null) {
			var doc = Firestore.doc(db, 'discord/social');
			Firestore.updateDoc(doc, {
				twitter_tags: Firestore.arrayUnion(tag)
			}).then(function(_) {
				if (!interaction.replied) {
					interaction.reply('Updated collection!');
				}
			});
		}

		if (user != null) {
			var doc = Firestore.doc(db, 'discord/social');
			Firestore.updateDoc(doc, {
				twitter_users: Firestore.arrayUnion(user)
			}).then(function(_) {
				if (!interaction.replied) {
					interaction.reply('Updated collection!');
				}
			});
		}
	}

	function get_name():String {
		return 'mention';
	}
}

typedef TMention = {
	var user:String;
	var timestamp:Float;
	var added_by_id:String;
	var added_by_name:String;
	var roles:Array<String>;
}
