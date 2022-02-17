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

class Helppls extends CommandDbBase {
	var state:Map<String, QuestionState> = [];
	var session:Map<String, Map<QuestionState, TQuestion>> = [];
	@:fastFamily var dm_messages:{type:CommandForward, message:Message};

	function checkExistingThreads(data:TStoreContent) {
		var timestamp = data.timestamp.toDate().getTime();

		if (Date.now().getTime() - timestamp < 60000) {
			trace('60 seconds has not passed');
			return;
		}

		var callback = function(messages:Collection<String, Message>) {
			var respondants = new Map<String, Int>();
			for (key => message in messages) {
				var get = 0;
				if (respondants.exists(message.author.id)) {
					get = respondants.get(message.author.id);
				}
				respondants.set(message.author.id, get + 1);
			}

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
											});
										}
									}
								});
							});
						}
						trace('collected');
					});
				}, err);
			}, err);
		}
		this.extractMessageHistory(data.thread_id, callback);
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

			switch (state) {
				case none:
					var question = this.questionChannel(message.author.id);
					message.author.send({embeds: [this.createEmbed(question)]});
				case channel:
					this.updateSessionChannel(author, state, this.getChannel(message.content));
					this.questionIsThereAnError(message);
				case is_there_an_error:
					if (message.content == '1') {
						this.questionWhatError(message);
					} else {
						this.questionPasteSomeCode(message);
					}
				case what_error_message:
					this.questionPasteSomeCode(message);
				case paste_some_code:
					this.questionExpectedBehaviour(message);
				case expected_behaviour:
					this.questionWhatsHappening(message);
				case whats_happening:
					this.questionWhatTitle(message);
				case what_title:
					this.handleFinished(message);
				default:
					trace('something else $state');
			}
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

	function extractMessageHistory(thread_id:String, callback:(messages:Collection<String, Message>) -> Void) {
		if (!Main.connected) {
			return;
		}

		Main.client.channels.fetch(thread_id).then(function(channel) {
			channel.messages.fetch({force: true}).then(callback, err);
		}, err);
	}

	function err(err:Dynamic) {
		trace(err);
	}

	function remoteSaveQuestion(message:Message, thread:String) {
		var author = message.author.id;
		var now = Timestamp.fromDate(Date.now());
		var data:TStoreContent = {
			thread_id: thread,
			validated_by: null,
			solved: false,
			title: this.getStateAnswer(author, what_title),
			topic: this.getStateAnswer(author, QuestionState.channel),
			error_message: this.getStateAnswer(author, QuestionState.what_error_message),
			code_lines: this.getStateAnswer(author, QuestionState.paste_some_code),
			expected_behaviour: this.getStateAnswer(author, QuestionState.expected_behaviour),
			whats_happening: this.getStateAnswer(author, QuestionState.whats_happening),
			source_url: null,
			description: null,
			added_by: message.author.id,
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

	function updateSessionQuestion(user:String, state:QuestionState, question:String) {
		var active_session = this.session[user];
		if (active_session == null) {
			active_session = new Map<QuestionState, TQuestion>();
		}

		active_session.set(state, {
			channel: '',
			question: question,
			answer: null
		});

		this.session.set(user, active_session);
	}

	function updateSessionChannel(user:String, state:QuestionState, channel:String) {
		var active_session = this.session[user];
		active_session.get(state).channel = this.getChannelId(channel);
		this.session.set(user, active_session);
	}

	function updateSessionAnswer(user:String, state:QuestionState, answer:String) {
		if (answer == null || answer == '') {
			return;
		}
		var active_session = this.session[user];
		active_session.get(state).answer = answer;

		this.session.set(user, active_session);
	}

	function questionChannel(user:String) {
		this.state.set(user, channel);
		var question = 'Which category best summarises your project?';
		this.updateSessionQuestion(user, channel, question);

		question += '\n1 - flixel\n2 - heaps\n3 - ceramic\n4 - openfl\n5 - lime\n6 - nme\n7 - haxe\n8 - other';
		return question;
	}

	function questionIsThereAnError(message:Message) {
		this.toggleState(message.author.id, is_there_an_error);
		var question = 'Is there an Error Message?';
		this.updateSessionQuestion(message.author.id, is_there_an_error, question);

		question += '\n1 - Yes\n2 - No';
		message.author.send({embeds: [this.createEmbed(question)]});
	}

	function questionWhatError(message:Message) {
		this.toggleState(message.author.id, what_error_message);
		var question = 'Paste Error Message (VSCode - Problems Tab -> Right Click -> Copy)';
		this.updateSessionQuestion(message.author.id, what_error_message, question);
		message.author.send({embeds: [this.createEmbed(question)]});
	}

	function questionPasteSomeCode(message:Message) {
		var is_error_message = (this.session.get(message.author.id).exists(what_error_message));
		var json = null;
		if (is_error_message) {
			json = this.parseErrorMessage(this.session.get(message.author.id).get(what_error_message).answer);
		}

		var from = 0;
		var to = 0;
		var question = '';
		if (json != null) {
			from = json.line - 5;
			to = json.line + 5;
			question = 'Paste lines **__${from}__**-**__${to}__** from file **${json.file}**';
		} else {
			question = 'Paste code lines from relevant file';
		}

		this.toggleState(message.author.id, paste_some_code);

		this.updateSessionQuestion(message.author.id, paste_some_code, question);
		message.author.send({embeds: [this.createEmbed(question)]});
	}

	function questionExpectedBehaviour(message:Message) {
		this.toggleState(message.author.id, expected_behaviour);
		var question = 'What do you expect to happen?';
		this.updateSessionQuestion(message.author.id, expected_behaviour, question);
		message.author.send({embeds: [this.createEmbed(question)]});
	}

	function questionWhatsHappening(message:Message) {
		this.toggleState(message.author.id, whats_happening);
		var question = 'Briefly describe what is happening';
		this.updateSessionQuestion(message.author.id, whats_happening, question);

		message.author.send({embeds: [this.createEmbed(question)]});
	}

	function questionWhatTitle(message:Message) {
		this.toggleState(message.author.id, what_title);
		var question = 'Please summarise a title for your issue';
		this.updateSessionQuestion(message.author.id, what_title, question);

		message.author.send({embeds: [this.createEmbed(question)]});
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
			case Helppls:
				this.session.set(interaction.user.id, []);
				this.toggleState(interaction.user.id, none);
				interaction.user.send({embeds: [this.createEmbed(this.questionChannel(interaction.user.id))]});

				interaction.reply(':white_check_mark:');
			default:
		}
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
	var thread_id:String;
	var added_by:String;
	var timestamp:Timestamp;
	var checked:Timestamp;
	var description:String;
	var source_url:String;
	var title:String;
	var topic:String;
	var solved:Bool;
	var validated_by:String;
	var error_message:String;
	var code_lines:String;
	var expected_behaviour:String;
	var whats_happening:String;
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
