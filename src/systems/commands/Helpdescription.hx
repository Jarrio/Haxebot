package systems.commands;

import discord_js.User;
import discord_js.MessageReaction;
import shared.TSession;
import firebase.web.firestore.DocumentReference;
import shared.TStoreContent;
import discord_js.MessageEmbed;
import discord_builder.BaseCommandInteraction;
import components.Command;

class Helpdescription extends CommandDbBase {
	#if block
	final check_threads_interval = 60000 * 30;
	final check_verified_interval = 60000;
	final review_thread = '946834684741050398';
	#else
	final review_thread = '';
	final check_threads_interval = 60000 * 30;
	final check_verified_interval = 60000 * 60 * 24;
	#end

	function run(command:Command, interaction:BaseCommandInteraction) {
		switch (command.content) {
			case Helpdescription(description):
				if (!interaction.channel.isThread()) {
					interaction.reply('This command is only available in a thread.').then(null, err);
					return;
				}
				this.findThread(interaction, description);
			default:
		}
	}

	function findThread(interaction:BaseCommandInteraction, description:String) {
		var topic = this.getTopicFromChannel(interaction.channel.parentId);
		if (topic == null) {
			interaction.reply('This channel is not a valid topic. Did you run the command from a valid thread?').then(null, err);
			return;
		}
		var q:Query<TStoreContent> = query(collection(db, 'test2', 'flixel', 'threads'), where('thread_id', EQUAL_TO, interaction.channelId));
		var embed = new MessageEmbed();
		embed.setDescription(description);
		Firestore.getDocs(q).then(function(docs) {
			if (docs.empty) {
				embed.setTitle('Error Occured');
				trace(interaction);
				trace(description);
				trace(topic);

				interaction.reply({content: '*Boop <@151104106973495296>*', embeds: [embed]});
				return;
			}
			var ref = docs.docs[0].ref;
			var data = docs.docs[0].data();
			if (interaction.user.id != data.solution.user.id) {
				interaction.reply({content: 'Sorry, another user is working on summarising the solution!'});
				return;
			}

			data.solved = true;
			data.solution.description = description;
			
			Firestore.setDoc(ref, data).then(function(succ) {
				this.validateThread(ref, data);
				embed.setTitle('Thread Solution');
				interaction.reply({content: 'Thanks! <@${interaction.user.id}>', embeds: [embed]}).then(function(succ) {
					var command = Main.getCommand(this.name);
					if (command != null) {
						command.setCommandPermission([{
							id: interaction.user.id,
							type: USER,
							permission: false
						}]);
					}
				}, err);
			}, err);
		}, err);
	}

	function validateThread(ref:DocumentReference<TStoreContent>, thread:TStoreContent) {
		if (thread.validated_by != null && !thread.solved) {
			trace('somothing got out of sync? ${ref.id}');
			return;
		}
		DiscordUtil.getChannel(this.review_thread, (channel) -> {
			if (channel == null) {
				return;
			}
			var embed = this.createThreadEmbed(thread);
			var title = thread.getQuestion(title);
			var topic = thread.topic;

			embed.setTitle('__${title.answer}__');
			var description = '**Topic**\n$topic ${embed.description}\n**Solution Summary**:\n${thread.solution.description}';
			embed.setDescription(description);

			channel.send({embeds: [embed], content: "Should this thread be indexed?"}).then(function(message) {
				DiscordUtil.reactionTracker(message, (collector, collected:MessageReaction, user:User) -> {
					if (user.bot) {
						return;
					}
					if (collected.emoji.name == "✅") {
						thread.validated_by = user.id;
						Firestore.updateDoc(ref, 'validated_by', user.id).then(function(_) {
							collector.stop('validated');
						}, err);
					}
				});
			});
		});
	}

	function createThreadEmbed(remote:TStoreContent) {
		var embed = new MessageEmbed();
		var content = '';
		var session = remote.session;

		embed.setAuthor({name: remote.author.name, iconURL: remote.author.icon_url});
		

		for (value in session.questions) {
			var answer:String = (value.answer);
			var output = '**${value.question}**';

			switch (value.state) {
				case provide_code:
					answer = '```hx\n' + answer + '\n```';
				case title:
					continue;
				case question_type:
					answer = '${(answer : QuestionType)}';
				default:
			}
			content += '\n' + output + '\n' + answer;
		}

		embed.setDescription(content);
		return embed;
	}

	function getTopicFromChannel(channel:String) {
		return switch (channel) {
			case '162395145352904705': 'haxe';
			case '459827960006967325': 'tools';
			case '165234904815239168': 'flixel';
			case '501408700142059520': 'heaps';
			case '853414608747364352': 'ceramic';
			case '769686284318146561': 'openfl';
			case '565569107701923852': 'haxeui';
			default: #if block 'haxe' #else null #end;
		}
	}

	function get_name():String {
		return 'helpdescription';
	}
}
