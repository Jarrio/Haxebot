package commands;

import firebase.web.firestore.Timestamp;
import discord_js.User;
import discord_js.MessageReaction;
import shared.TSession;
import firebase.web.firestore.DocumentReference;
import shared.TStoreContent;
import discord_js.MessageEmbed;
import discord_builder.BaseCommandInteraction;
import components.Command;
import systems.CommandDbBase;

class Helpdescription extends CommandDbBase {
	final validate_timout = 60000 * 60 * 24;
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
					interaction.reply('This command is only available in a thread.')
						.then(null, function(err) trace(err));
					return;
				}
				this.findThread(interaction, description);
			default:
		}
	}

	function findThread(interaction:BaseCommandInteraction, description:String) {
		var topic = this.getTopicFromChannel(interaction.channel.parentId);
		if (topic == null) {
			interaction.reply(
				'This channel is not a valid topic. Did you run the command from a valid thread?'
			)
				.then(null, function(err) trace(err));
			return;
		}
		var q:Query<TStoreContent> = query(collection(db, 'test2', 'haxe', 'threads'),
			where('thread_id', EQUAL_TO, interaction.channelId));
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
				interaction.reply(
					{content: 'Sorry, another user is working on summarising the solution!'}
				);
				return;
			}

			data.solved = true;
			data.solution.description = description;

			Firestore.setDoc(ref, data).then(function(succ) {
				interaction.reply(
					{content: 'Thanks! <@${interaction.user.id}>', embeds: [embed]}
				)
					.then(function(succ) {
						this.validateThread(ref, data);
						var command = Main.getCommand(this.name);
					}, function(err) trace(err));
			}, function(err) trace(err));
		}, function(err) trace(err));
	}

	function validateThread(ref:DocumentReference<TStoreContent>, thread:TStoreContent) {
		if (dateWithinTimeout(Date.now(), thread.validate_timestamp, this.validate_timout)) {
			return;
		}

		DiscordUtil.getChannel(this.review_thread, (channel) -> {
			if (channel == null) {
				return;
			}
			var embed = this.createThreadEmbed(thread);
			var topic = thread.topic;

			var solution_summary = '**Solution Summary**:\n${thread.solution.description}';
			if (thread.solution != null && thread.solution.description == null) {
				solution_summary = "";
			}

			var description = '**Topic**\n$topic ${embed.description}\n$solution_summary';

			embed.setDescription(description);

			channel.send(
				{embeds: [embed], content: "Should this thread be indexed?"}
			)
				.then(function(message) {
					Firestore.updateDoc(ref, 'validate_timestamp', Date.now());
					DiscordUtil.reactionTracker(message,
						(collector, collected:MessageReaction, user:User) -> {
							if (user.bot) {
								return;
							}

							var valid = null;

							if (collected.emoji.name == "✅") {
								valid = true;
							}

							if (collected.emoji.name == "❎") {
								valid = false;
							}

							if (valid == null) {
								return;
							}

							var doc = doc(db, 'test2/$topic');

							Firestore.runTransaction(this.db, function(transaction) {
								return transaction.get(doc).then(function(doc) {
									if (!doc.exists()) {
										return {id: -1, threads: 0};
									}
									var data:TThreadInfo = doc.data();
									data.id = data.id + 1;
									data.threads = data.threads + 1;
									transaction.update(doc.ref, data);
									return data;
								});
							}).then(function(value) {
								if (value.id == -1) {
									return;
								}
								Firestore.updateDoc(ref, 'valid', valid, 'validated_by', user.id,
									'validated_timestamp', Timestamp.now())
									.then(function(_) {
										collector.stop('Reviewed validation.');
									}, function(err) trace(err));
							}, function(err) trace(err));
						});
				});
		});
	}

	function createThreadEmbed(remote:TStoreContent) {
		var embed = new MessageEmbed();
		var content = '';
		var session = remote.session;

		var title = remote.getQuestion(title);
		embed.setTitle('__${title.answer}__');
		embed.setURL(remote.source_url);
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

typedef TThreadInfo = {
	var id:Int;
	var threads:Int;
};
