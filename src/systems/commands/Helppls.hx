package systems.commands;

import js.lib.Promise;
import firebase.web.firestore.DocumentReference;
import shared.TStoreContent;
import shared.TSession;
import shared.HelpState;
import discord_js.User;
import discord_js.MessageReaction;
import discord_js.Collection;
import firebase.web.firestore.Firestore;
import firebase.web.firestore.Query;
import firebase.web.firestore.Firestore.*;
import haxe.Json;
import discord_js.MessageEmbed;
import Main.CommandForward;
import discord_js.Message;
import components.Command;
import discord_builder.BaseCommandInteraction;
import firebase.web.firestore.Timestamp;

typedef THelpQuestions = {
	var id:Int;
	var question:Array<String>;
	var valid_input:Null<Array<TValidInput>>;
	var state:HelpState;
}

typedef TValidInput = {
	var key:String;
	var name:String;
	var questions:Array<THelpQuestions>;
}

class Helppls extends CommandDbBase {
	@:fastFamily var dm_messages:{type:CommandForward, message:Message};
	var questions:Array<THelpQuestions> = [];
	var state:Map<String, HelpState> = [];
	var qid:Map<String, Int> = [];
	var session:Map<String, TSession> = [];
	var last_input:Map<String, TQuestionResponse> = [];
	#if block
	final review_thread = '946834684741050398';
	#else
	final review_thread = '';
	#end
	public function new(universe) {
		super(universe);
		this.questions = loadFile(this.name);
	}

	function checkExistingThreads(data:TStoreContent) {
		var timestamp = data.timestamp.toDate().getTime();

		if (Date.now().getTime() - timestamp < 60000) {
			trace('60 seconds has not passed');
			return;
		}

		var callback = function(messages:Collection<String, Message>) {
			var discussion = new Array<TMessage>();
			var respondants = new Map<String, Int>();
			for (key => message in messages) {
				if (message.author.bot) {
					continue;
				}
				var get = 0;
				if (respondants.exists(message.author.id)) {
					get = respondants.get(message.author.id);
				}
				respondants.set(message.author.id, get + 1);

				discussion.push({
					content: message.content,
					user: {
						id: message.author.id,
						username: message.author.username,
						avartarURL: message.author.avatarURL()
					},
					posted: Timestamp.fromDate(message.createdAt)
				});
			}

			discussion.sort(function(a, b) {
				return Math.round(a.posted.toDate().getTime() - b.posted.toDate().getTime());
			});

			var highest = -1;
			var highest_id = null;
			for (uid => messages in respondants) {
				if (messages > highest) {
					highest = messages;
					highest_id = uid;
				}
			}

			Main.client.channels.fetch(data.thread_id).then(function(channel) {
				channel.send({content: 'Was this thread solved?'}).then(function(message) {
					DiscordUtil.reactionTracker(message, (_, collected:MessageReaction, user:User) -> {
						if (user.bot) {
							return;
						}
						if (collected.emoji.name == "✅") {
							channel.send({content: 'Would you be willing to write a brief description on the solution?'}).then(function(message) {
								DiscordUtil.reactionTracker(message, (_, collected:MessageReaction, user:User) -> {
									if (user.bot) {
										return;
									}
									if (collected.emoji.name == "✅") {
										var command = Main.getCommand('helpdescription');
										if (command != null) {
											command.setCommandPermission([
												{
													id: user.id,
													type: USER,
													permission: true
												}
											], () -> {
												channel.send('<@${user.id}> could you run the `/helpdescription` command and give a brief description about the solution to the problem?');
												
												var q:Query<TStoreContent> = query(collection(db, 'test2', data.topic, 'threads'), where('thread_id', '==', data.thread_id));
												Firestore.getDocs(q).then((docs) -> {
													if (docs.size != 1) {
														return;
													}
													var content = docs.docs[0].data();
													content.solved = true;
													content.discussion = discussion;
													trace('here');
													this.validateThread(docs.docs[0].ref, content);
													Firestore.updateDoc(docs.docs[0].ref, 'discussion', discussion, 'solved', true);
												}, err);
											});
										}
									}
								});
							});
						}
					});
				}, err);
			}, err);
		}
		this.extractMessageHistory(data.start_message_id, data.thread_id, callback);
	}

	function validateThread(ref:DocumentReference<TStoreContent>, thread:TStoreContent) {
		if (thread.validated_by != null || !thread.solved) {
			return;
		}
		DiscordUtil.getChannel(this.review_thread, (channel) -> {
			if (channel == null) {
				return;
			}
			var embed = this.createThreadEmbed(thread);
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

	function createThreadEmbed(?remote:TStoreContent, ?local:TSession) {
		var embed = new MessageEmbed();
		var content = '';
		var session = null;

		if (remote == null) {
			session = local;
		} else {
			session = remote.session;
		}

		for (value in session.questions) {
			var answer:String = (value.answer);
			var output = '**${value.question}**';

			switch (value.state) {
				case HelpState.provide_code:
					answer = '```hx\n' + answer + '\n```';
				case title:
					continue;
				case question_type:
					answer = '${(answer:QuestionType)}';
				default:
			}
			content += '\n' + output + '\n' + answer;
		}

		embed.setDescription(content);
		return embed;
	}

	var toggle = false;

	function checkDocs() {
		var topics = ['haxe', 'haxeui', 'tools', 'flixel', 'heaps', 'ceramic','openfl'];
		var docs = [];
		for (item in topics) {
			
			var q:Query<TStoreContent> = query(collection(db, 'test2', item, 'threads'), where('solved', '==', false), orderBy('timestamp', DESCENDING));
			Firestore.getDocs(q).then(function(docs) {
				if (docs.empty) {
					return;
				}
				var now = Date.now().getTime();
				for (doc in docs.docs) {
					var data = doc.data();
					var start = data.timestamp.toDate().getTime();
					if (now - start < 60000) {
						continue;
					}
					this.checkExistingThreads(data);
				}

			}, err);
		}
	}

	override function update(_) {
		if (!this.toggle && Main.commands_active) {
			var q:Query<TStoreContent> = query(collection(db, 'test'), orderBy('timestamp', DESCENDING));
			this.checkDocs();
			Firestore.getDocs(q).then((docs) -> {
				docs.forEach((doc) -> {
					this.checkExistingThreads(doc.data());
				});
			}, err);
			toggle = true;
		}

		iterate(dm_messages, entity -> {
			if (type != CommandForward.helppls) {
				continue;
			}
			var author = message.author.id;
			var state = this.state.get(author);

			if (message.content.toLowerCase() == 'cancel' || message.content.toLowerCase() == 'c') {
				this.clearData(author);
				message.reply({content: 'Cancelled.'}).then(null, err);
				this.dm_messages.remove(entity);
				return;
			}

			if (state == title && message.content.length > 100) {
				message.reply({content: 'Titles have a character limit ${message.content.length}/**__100__**.'}).then(null, err);
				this.dm_messages.remove(entity);
				return;
			}

			if (message.content.length == 0) {
				message.reply({content: 'Please enter *something*'}).then(null, err);
				this.dm_messages.remove(entity);
				return;
			}

			if (state != none && message.content != 'skip') {
				var reply = message.content;
				switch (state) {
					case error_message:
						var data = this.parseVSCodeJson(reply);
						if (data != null) {
							reply = '```\n${data.resource}:${data.startLineNumber} - ${data.message}\n```';
						}
					default:
				}
				this.updateSessionAnswer(author, state, reply);
			}

			var question = this.getQuestion(this.qid.get(author), this.state.get(author));
			if (question.valid_input != null && question.valid_input.length > 0) {
				this.last_input.set(author, {qid: question.id, question: null, state: null, answer: message.content});
			}

			var question = this.nextQuestion(message.author.id);
			if (question.state == HelpState.finished) {
				this.handleFinished(message);
			} else {
				var out = question.question.toString();
				if (question.valid_input != null) {
					for (opt in question.valid_input) {
						if (opt.key == '-1') {
							continue;
						}
						out += '\n' + opt.key + ' - ' + opt.name;
					}
				}
				message.author.send({embeds: [this.createEmbed(out)]});
			}
			this.dm_messages.remove(entity);
		});
		super.update(_);
	}

	function clearData(author:String) {
		this.state.remove(author);
		this.last_input.remove(author);
		this.session.remove(author);
		this.qid.remove(author);
		Main.dm_help_tracking.remove(author);
	}

	function handleFinished(message:Message) {
		var author = message.author.id;
		var session = this.session.get(author);
		var topic = session.topic;
		var embed = this.createThreadEmbed(session);

		if (embed.description.length < 30) {
			trace(embed.description);
			this.clearData(author);
			message.reply({content: "Not enough answers to provide sufficient support"});
			return;
		}

		#if block
		topic = 'test';
		#end
		var title = this.getResponseFromSession(author, title).answer;

		message.client.channels.fetch(this.getChannelId(topic)).then(function(channel) {
			channel.send({embeds: [embed]}).then(function(channel_message) {
				channel_message.startThread({name: title}).then(function(thread) {
					this.remoteSaveQuestion(message, thread.id);
					message.author.send({content: 'Your thread(__<#${thread.id}>__) has been created!'});
					channel.send("**__Please reply to the above issue within the thread.__**");
					this.clearData(author);
				});
			});
		}, err);
	}

	function getResponseFromSession(author:String, state:HelpState) {
		var session = this.session.get(author);
		for (item in session.questions){
			if (item.state == state) {
				return item;
			}
		}
		return null;
	}

	function extractMessageHistory(start_id:String, thread_id:String, callback:(messages:Collection<String, Message>) -> Void) {
		if (!Main.connected) {
			return;
		}

		Main.client.channels.fetch(thread_id).then(function(channel) {
			channel.messages.fetch({after: start_id}, {force: true}).then(callback, err);
		}, err);
	}

	function remoteSaveQuestion(message:Message, thread:String) {
		var author = message.author.id;
		var session = this.session.get(author);
		var now = Timestamp.fromDate(Date.now());
		var title = this.getResponseFromSession(author, title).answer;

		var data:TStoreContent = {
			id: -1,
			title: title.split(' '),
			discussion: null,
			start_message_id: message.id,
			thread_id: thread,
			validated_by: null,
			solved: false,
			topic: session.topic,
			session: session,
			source_url: null,
			description: null,
			added_by: author,
			timestamp: now,
			checked: now
		};

		var doc = doc(db, 'test2/${session.topic}');

		Firestore.runTransaction(this.db, function(transaction) {
			return transaction.get(doc).then(function(doc) {
				if (!doc.exists()) {
					return {id: -1};
				}
				var data:{id:Int} = (doc.data());
				data.id = data.id + 1;
				transaction.update(doc.ref, data);
				return data;
			}); 
		}).then(function(value) {
			data.id = value.id;
			this.addDoc('test2/${session.topic}/threads', data, (_) -> trace('added'), err);
		}, err);
	}

	function updateSessionAnswer(user:String, state:HelpState, answer:String) {
		if (answer == null || answer == '') {
			return;
		}

		var qid = this.qid.get(user);
		var q = this.getQuestion(qid, state);

		var response = {
			qid: qid,
			question: q.question.toString(),
			state: state,
			answer: answer
		}
		
		this.session.get(user).questions.push(response);
	}

	function parseErrorMessage(input:String) {
		var regex = ~/```\n(.*):([0-9]+) - (.*)\n```/gmi;
		if (regex.match(input)) {
			return {
				file: regex.matched(1),
				line: regex.matched(2).parseInt(),
				message: regex.matched(3)
			}
		}
		return null;
	}

	function parseVSCodeJson(input:String) {
		try {
			var obj = (Json.parse(input) : Array<VSCodeErrorMessage>);
			var split = obj[0].resource.split('/');
			if (split.length >= 2) {
				obj[0].resource = split[split.length - 2] + '/' + split[split.length - 1];
			}
			return obj[0];
		} catch (e) {
			return null;
		}
	}

	function run(command:Command, interaction:BaseCommandInteraction) {
		switch (command.content) {
			case Helppls(topic):
				this.state.set(interaction.user.id, HelpState.question_type);
				this.session.set(interaction.user.id, {
					topic: topic.replace('<#', '').replace('>', ''),
					questions: [],
					author_id: interaction.user.id,
					timestamp: interaction.createdTimestamp
				});
				this.qid.set(interaction.user.id, 1);
				var question = this.getQuestion(1, question_type);
				var out = question.question.toString();
				if (question.valid_input != null) {
					for (opt in question.valid_input) {
						if (opt.key == '-1') {
							continue;
						}
						out += '\n' + opt.key + ' - ' + opt.name;
					}
				}
				interaction.user.send({embeds: [this.createEmbed(out)]});
			default:
		}
	}

	// new question process!!!!
	function nextQuestion(user:String) {
		var qid = this.qid.get(user);
		var last_input = this.last_input.get(user);

		for (value in this.questions) {
			if (value.id == last_input.qid && value.valid_input != null) {
				for (opts in value.valid_input) {
					if (opts.key == "-1") {
						continue;
					}

					if ((last_input.answer) == opts.key) {
						for (next_phase in opts.questions) {
							if (next_phase.id > qid && next_phase.id > last_input.qid) {
								this.qid.set(user, next_phase.id);
								this.state.set(user, next_phase.state);
								return next_phase;
							}
						}
					}
				}
			}

			if (value.id > qid) {
				this.qid.set(user, value.id);
				this.state.set(user, value.state);
				return value;
			}
		}
		return null;
	}

	function getQuestion(qid:Int, state:HelpState) {
		for (value in this.questions) {
			if (value.id == qid && value.state == state) {
				return value;
			}

			if (value.valid_input != null) {
				for (input_options in value.valid_input) {
					if (input_options.questions != null) {
						for (value_2 in input_options.questions) {
							if (value_2.id == qid && value_2.state == state) {
								return value_2;
							}
						}
					}
				}
			}
		}
		return null;
	}

	function getChannelId(channel:String) {
		return switch (channel) {
			// case 'haxe': '162395145352904705';
			// case 'haxeui': '565569107701923852';
			// case 'tools': '459827960006967325';
			// case 'heaps': '501408700142059520';
			// case 'ceramic': '853414608747364352';
			// case 'openfl': '769686284318146561';
			case 'test': '597067735771381771';
			default: channel;
		}
	}

	function getAnnouncementThreadId(channel:String) {
		return switch (channel) {
			case 'haxe': '';
			case 'haxeui': '';
			case 'tools': '';
			case 'heaps': '';
			case 'ceramic': '';
			case 'openfl': '';
			case 'test': '946810894162219048';
			default: channel;
		}
	}

	inline function createEmbed(content:String) {
		var embed = new MessageEmbed();

		embed.setDescription(content);
		return embed;
	}

	function get_name():String {
		return 'helppls';
	}
}

typedef VSCodeErrorMessage = {
	var resource:String;
	var owner:String;
	var code:String;
	var severity:Int;
	var message:String;
	var source:String;
	var startLineNumber:Int;
	var startColumn:Int;
	var endLineNumber:Int;
	var endColumn:Int;
}