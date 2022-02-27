package systems.commands;

import ecs.Entity;
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
	var threads_last_checked:Float = -1;
	final valid_filters = ['skip', 'cancel', 'c'];
	final thread_timeout = 60000 * 30;
	#if block
	final check_threads_interval = 60000 * 30;
	final check_verified_interval = 60000;
	final review_thread = '946834684741050398';
	#else
	final review_thread = '';
	final check_threads_interval = 60000 * 30;
	final check_verified_interval = 60000 * 60 * 24;
	#end

	
	public function new(universe) {
		super(universe);
		this.questions = loadFile(this.name);
	}

	function checkExistingThreads(data:TStoreContent) {
		var timestamp = data.timestamp.toDate().getTime();

		if (Date.now().getTime() - timestamp < 60000) {
			return;
		}

		var callback = function(messages:Collection<String, Message>) {
			var discussion = new Array<TMessage>();
			for (message in messages) {
				if (message.author.bot) {
					continue;
				}

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
													content.discussion = discussion;
													content.solution = {
														description: null,
														authorised_id: user.id,
														timestamp: null,
														user: {
															id: user.id,
															name: user.tag,
															icon_url: user.avatarURL()
														}
													}
													
													Firestore.updateDoc(docs.docs[0].ref, 'discussion', discussion, 'solution', content.solution).then(null, err);
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
		if (thread.validated_by != null && !thread.solved) {
			return;
		}
		DiscordUtil.getChannel(this.review_thread, (channel) -> {
			if (channel == null) {
				return;
			}
			var embed = this.createThreadEmbed(thread);
			var title = thread.getQuestion(title);
			var topic = thread.topic;

			embed.setTitle(title.answer);
			embed.description += '\n Topic: ${topic}';

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
			embed.setAuthor({name: remote.author.name, iconURL: remote.author.icon_url});
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

	function checkDocs() {
		var topics = ['haxe', 'haxeui', 'tools', 'flixel', 'heaps', 'ceramic','openfl'];
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
		if (Date.now().getTime() - this.threads_last_checked > this.check_threads_interval && Main.commands_active) {
			this.checkDocs();
			this.threads_last_checked = Date.now().getTime();
		}

		for (key => value in Main.dm_help_tracking) {
			if (Date.now().getTime() - value < this.thread_timeout) {
				continue;
			}
			this.clearData(key);
		}

		iterate(dm_messages, entity -> {
			if (type != CommandForward.helppls) {
				continue;
			}

			var author = message.author.id;
			var state = this.state.get(author);
			var lowercase_content = message.content.toLowerCase();
			var question = this.getQuestion(this.state.get(author));

			if (state == question_type) {
				var matched = this.isValidInput(message.content, question.valid_input);

				if (!matched) {
					if (!this.isFilter(message.content)) {
						return this.reply(entity, message, 'Invalid input, please try again.');
					}
				}
			}

			if (lowercase_content == 'cancel' || lowercase_content == 'c') {
				this.clearData(author);
				return this.reply(entity, message, 'Cancelled.');
			}

			if (state == title && message.content.length > 100) {
				return this.reply(entity, message, 'Titles have a character limit ${message.content.length}/**__100__**.');
			}

			if (message.content.length == 0) {
				return this.reply(entity, message, 'Please enter *something*');
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

			
			if (question.valid_input != null && question.valid_input.length > 0) {
				this.last_input.set(author, {qid: question.id, question: null, state: null, answer: message.content});
			}

			question = this.nextQuestion(message.author.id);
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

	function reply(entity:Entity, message:Message, content:String) {
		message.reply({content: content}).then(null, err);
		this.dm_messages.remove(entity);
	}

	function isFilter(input:String) {
		for (item in this.valid_filters) {
			if (item == input) {
				return true;
			}
		}
		return false;
	}

	function isValidInput(content:String, input:Array<TValidInput>) {
		for (item in input) {
			if (content.toLowerCase() == item.key) {
				return true;
			}
		}
		return false;
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
		embed.setAuthor({name: message.author.tag, iconURL: message.author.avatarURL()});

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
					this.remoteSaveQuestion(message, channel_message.url, thread.id);
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

	function remoteSaveQuestion(message:Message, url:String, thread:String) {
		var author = message.author.id;
		var session = this.session.get(author);
		var now = Timestamp.fromDate(Date.now());
		var title = this.getResponseFromSession(author, title).answer;
		
		var data:TStoreContent = {
			author: {
				name: message.author.tag,
				id: message.author.id,
				icon_url: message.author.avatarURL()
			},
			id: -1,
			title: title.split(' '),
			discussion: null,
			start_message_id: message.id,
			thread_id: thread,
			validated_by: null,
			solved: false,
			topic: session.topic,
			session: session,
			source_url: url,
			added_by: author,
			timestamp: now,
			checked: now,
			solution: null,
			solution_requested: null
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
		var q = this.getQuestion(state);

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
				var question = this.getQuestion(question_type);
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

	function getQuestion(state:HelpState) {
		for (value in this.questions) {
			if (value.state == state) {
				return value;
			}

			if (value.valid_input != null) {
				for (input_options in value.valid_input) {
					if (input_options.questions != null) {
						for (value_2 in input_options.questions) {
							if (value_2.state == state) {
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