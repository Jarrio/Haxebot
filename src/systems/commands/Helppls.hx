package systems.commands;

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

typedef TMessage = {
	var content:String;
	var user:{
		var id:String;
		var username:String;
		var avartarURL:String;
	}
	var posted:Timestamp;
}

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

enum abstract HelpState(String) from String {
	var question_type;
	var error_message;
	var provide_code;
	var expected_behaviour;
	var what_is_happening;
	var title;
}

typedef TSession = {
	var topic:String;
	var timestamp:Float;
	var author_id:String;
	var questions:Array<TQuestionResponse>;
}

typedef TQuestionResponse = {
	var qid:Int;
	var question:String;
	var answer:String;
}

class Helppls extends CommandDbBase {
	var questions:Array<THelpQuestions>;
	var state:Map<String, QuestionState> = [];
	var session:Map<String, Map<QuestionState, TQuestion>> = [];
	@:fastFamily var dm_messages:{type:CommandForward, message:Message};

	var new_state:Map<String, HelpState> = [];
	var question_position:Map<String, Int> = [];
	var new_session:Map<String, TSession> = [];

	// TODO: cheat for figuring out purposes
	var input_history:Map<String, Array<TQuestionResponse>> = [];
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

			if (state != none) {
				var reply = message.content;
				switch (state) {
					case channel:
						reply = this.getChannelId(this.getChannel(reply));
					case what_error_message:
						var data = this.parseVSCodeJson(reply);
						if (data != null) {
							reply = '```\n${data.resource}:${data.startLineNumber} - ${data.message}\n```';
						}
					default:
				}
				this.updateSessionAnswer(author, state, reply);
			}

			var question = this.getQuestion(this.question_position.get(author), this.new_state.get(author));
			if (question.valid_input != null && question.valid_input.length > 0) {
				this.last_input.set(author, {qid: question.id, question: null, answer: message.content});
			}

			var question = this.nextQuestion(message.author.id);
			message.author.send({embeds: [this.createEmbed(question.question.toString())]});
			this.dm_messages.remove(entity);
		});
		super.update(_);
	}

	inline function toggleState(author:String, state:QuestionState) {
		this.state.set(author, state);
	}

	function handleFinished(message:Message) {
		var author = message.author.id;
		var embed = new MessageEmbed();

		for (key => value in this.session.get(author)) {
			var answer = value.answer;

			switch (key) {
				case paste_some_code:
					var is_error_message = (this.session.get(author).exists(what_error_message));
					var json = null;
					if (is_error_message) {
						json = this.parseErrorMessage(this.session.get(author).get(what_error_message).answer);
					}

					if (json != null) {
						var from = json.line - 5;
						var to = json.line + 5;
						var split = answer.split('\n');
						var code = '';
						for (key => line in split) {
							code += '${key + from}   ${line.trim()} \n';
						}

						answer = '```hx\n' + code + '\n```';
					}
				case channel:
					answer = '<#$answer>';
				case is_there_an_error:
					continue;
				case what_title:
					continue;
				default:
			}

			if (key == is_there_an_error) {
				continue;
			}

			embed.addField(value.question, answer);
		}

		var title = this.session.get(author).get(what_title).answer;
		message.client.channels.fetch(this.getChannelId('other')).then(function(channel) {
			channel.send({embeds: [embed]}).then(function(channel_message) {
				channel_message.startThread({name: title}).then(function(thread) {
					this.remoteSaveQuestion(message, thread.id);
					message.author.send({content: 'Your thread(__<#${thread.id}>__) has been created!'});
					channel.send("**__Please reply to the above issue within the thread.__**");
				});
			});
		}, err);
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
		var now = Timestamp.fromDate(Date.now());
		var data:TStoreContent = {
			discussion: null,
			start_message_id: message.id,
			thread_id: thread,
			validated_by: null,
			solved: false,
			session: this.new_session.get(author),
			source_url: null,
			description: null,
			added_by: author,
			timestamp: now,
			checked: now
		};

		this.addDoc('test', data, (_) -> trace('added'), err);
	}

	function getStateAnswer(author:String, state:QuestionState) {
		var question = this.session.get(author).get(state);
		if (question == null || question.answer == null) {
			return null;
		}
		return this.session.get(author).get(state).answer;
	}

	function updateSessionAnswer(user:String, state:QuestionState, answer:String) {
		if (answer == null || answer == '') {
			return;
		}
		var active_session = this.session[user];
		active_session.get(state).answer = answer;

		this.session.set(user, active_session);

		var session = this.new_session.get(user);
		var qid = this.question_position.get(user);

		var response = {
			qid: qid,
			question: "",
			answer: answer
		}
		session.questions.push(response);
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
				this.new_state.set(interaction.user.id, HelpState.question_type);
				this.new_session.set(interaction.user.id, null);
				this.question_position.set(interaction.user.id, 1);
				interaction.user.send({embeds: [this.createEmbed(this.getQuestion(1, question_type).question.toString())]});

			default:
		}
	}

	// new question process!!!!
	function nextQuestion(user:String) {
		var qid = this.question_position.get(user);
		var last_input = this.last_input.get(user);

		for (value in this.questions) {
			if (value.id == last_input.qid && value.valid_input != null) {
				for (opts in value.valid_input) {
					if (opts.key == "-1") {
						continue;
					}

					if (last_input.answer == opts.key) {
						for (next_phase in opts.questions) {
							if (next_phase.id > qid && next_phase.id > last_input.qid) {
								this.question_position.set(user, next_phase.id);
								this.new_state.set(user, next_phase.state);
								return next_phase;
							}
						}
					}
				}
			}

			if (value.id > qid) {
				this.question_position.set(user, value.id);
				this.new_state.set(user, value.state);
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

typedef FileQuestions = {
	var question:String;
	var sub_request:String;
	var valid_answers:Array<String>;
}

typedef TQuestion = {
	var channel:String;
	var question:String;
	var answer:String;
}

typedef TStoreContent = {
	var start_message_id:String;
	var thread_id:String;
	var added_by:String;
	var timestamp:Timestamp;
	var checked:Timestamp;
	var session:TSession;
	var description:String;
	var source_url:String;
	var solved:Bool;
	var validated_by:String;
	var discussion:Array<TMessage>;
}

enum abstract QuestionType(Int) {
	var int;
	var string;
	var bool;
}

enum abstract QuestionState(Int) {
	var none;
	var channel;
	var what_title;
	var is_there_an_error;
	var what_error_message;
	var paste_some_code;
	var whats_happening;
	var expected_behaviour;
	var finished;
}
