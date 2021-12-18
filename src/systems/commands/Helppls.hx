package systems.commands;

import haxe.Json;
import discord_js.MessageEmbed;
import Main.CommandForward;
import discord_js.Message;
import components.Command;
import discord_builder.BaseCommandInteraction;

class Helppls extends CommandBase {
	var state:Map<String, QuestionState> = [];
	var session:Map<String, Map<QuestionState, TQuestion>> = [];
	@:fastFamily var dm_messages:{type:CommandForward, message:Message};

	public function new(universe) {
		super(universe);
	}

	override function onAdded() {}

	override function update(_) {
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
						reply = '<#${this.getChannelId(this.getChannel(reply))}>';
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
					trace('finished?');
					var embed = new MessageEmbed();

					for (key => value in this.session.get(author)) {
						var answer = value.answer;
						if (key == paste_some_code) {
							answer = '```hx\n' + answer + '\n```';
						}

						if (key == is_there_an_error) {
							continue;
						}

						embed.addField(value.question, answer);
					}

					message.author.send({embeds: [embed]}).then((_) -> {
						Main.dm_help_tracking.remove(author);
						this.session.remove(author);
						this.state.remove(author);
					}, null);
				default:
					trace('something else $state');
			}
			this.dm_messages.remove(entity);
		});
		super.update(_);
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
		this.state.set(message.author.id, is_there_an_error);
		var question = 'Is there an Error Message?';
		this.updateSessionQuestion(message.author.id, is_there_an_error, question);

		question += '\n1 - Yes\n2 - No';
		message.author.send({embeds: [this.createEmbed(question)]});
	}

	function questionWhatError(message:Message) {
		this.state.set(message.author.id, what_error_message);
		var question = 'Paste Error Message (VSCode - Problems Tab -> Right Click -> Copy)';
		this.updateSessionQuestion(message.author.id, what_error_message, question);
		message.author.send({embeds: [this.createEmbed(question)]});
	}

	function questionPasteSomeCode(message:Message) {
		var json = this.parseErrorMessage(this.session.get(message.author.id).get(what_error_message).answer);
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

		this.state.set(message.author.id, paste_some_code);
		
		this.updateSessionQuestion(message.author.id, paste_some_code, question);
		message.author.send({embeds: [this.createEmbed(question)]});
	}

	function questionExpectedBehaviour(message:Message) {
		this.state.set(message.author.id, expected_behaviour);
		var question = 'What do you expect to happen?';
		this.updateSessionQuestion(message.author.id, expected_behaviour, question);
		message.author.send({embeds: [this.createEmbed(question)]});
	}

	function questionWhatsHappening(message:Message) {
		this.state.set(message.author.id, whats_happening);
		var question = 'Briefly describe what is happening';
		this.updateSessionQuestion(message.author.id, whats_happening, question);

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
			var obj = (Json.parse(input):Array<VSCodeErrorMessage>);
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
				this.state.set(interaction.user.id, none);
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
			case 'other': '596744553030090880';
			default: channel;
		}
	}
	
	function getChannel(channel:String) {
		return switch(channel) {
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

enum abstract QuestionType(Int) {
	var int;
	var string;
	var bool;
}

enum abstract QuestionState(Int) {
	var none;
	var channel;
	var is_there_an_error;
	var what_error_message;
	var paste_some_code;
	var whats_happening;
	var expected_behaviour;
}