package systems.commands;

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
					DiscordUtil.reactionTracker(message, (collected:MessageReaction, user:User) -> {
						if (user.bot) {
							return;
						}
						if (collected.emoji.name == "✅") {
							channel.send({content: 'Would you be willing to write a brief description on the solution?'}).then(function(message) {
								DiscordUtil.reactionTracker(message, (collected:MessageReaction, user:User) -> {
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
												var q = query(collection(db, 'test'), where('thread_id', '==', data.thread_id));
												Firestore.getDocs(q).then((docs) -> {
													if (docs.size != 1) {
														return;
													}
													Firestore.updateDoc(docs.docs[0].ref, {discussion: discussion});
												});
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

	var toggle = false;

	override function update(_) {
		if (!this.toggle && Main.commands_active) {
			var q:Query<TStoreContent> = query(collection(db, 'test'), orderBy('timestamp', DESCENDING));
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
	}

	function handleFinished(message:Message) {
		var author = message.author.id;
		var embed = new MessageEmbed();
		var session = this.session.get(author);

		var content = '';
		for (value in session.questions) {
				var answer:String = (value.answer);
				var output = '${value.question}\n';

				switch (value.state) {
					case HelpState.provide_code:
							answer = '```hx\n' + answer + '\n```';
					case title:
						continue;
					default:
				}

				output += '$answer';

				if (value.state == HelpState.question_type) {
					continue;
				}

				content += answer;
		}

		embed.setDescription(content);

		if (content.length < 60) {
			message.reply({content: "Not enough answers to provide sufficient support"});
			return;
		}

		var title = this.getResponseFromSession(author, title).answer;
		message.client.channels.fetch(this.getChannelId('other')).then(function(channel) {
			channel.send({embeds: [embed]}).then(function(channel_message) {
				channel_message.startThread({name: (title)}).then(function(thread) {
					this.remoteSaveQuestion(message, thread.id);
					message.author.send({content: 'Your thread(__<#${thread.id}>__) has been created!'});
					channel.send("**__Please reply to the above issue within the thread.__**");
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
			channel.messages.fetch({after: '942949610924691518'}, {force: true}).then(callback, err);
		}, err);
	}

	function remoteSaveQuestion(message:Message, thread:String) {
		var author = message.author.id;
		var session = this.session.get(author);
		var now = Timestamp.fromDate(Date.now());
		var title = this.getResponseFromSession(author, title).answer;

		var data:TStoreContent = {
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

		this.addDoc('test', data, (_) -> trace('added'), err);
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
			case 'flixel': '165234904815239168';
			case 'heaps': '501408700142059520';
			case 'ceramic': '853414608747364352';
			case 'openfl': '769686284318146561';
			case 'lime': '769686258049351722';
			case 'nme': '162656395110514688';
			case 'haxe': '162395145352904705';
			// case 'other': '596744553030090880';
			case 'other': '597067735771381771';
			default: channel;
		}
	}

	function getChannel(channel:String) {
		return switch (channel) {
			case '1': 'flixel';
			case '2': 'heaps';
			case '3': 'ceramic';
			case '4': 'openfl';
			case '5': 'lime';
			case '6': 'nme';
			case '7': 'haxe';
			case '8': 'other';
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

enum abstract QuestionType(Int) {
	var int;
	var string;
	var bool;
}