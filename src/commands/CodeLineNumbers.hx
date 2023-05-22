package commands;

import commands.types.ContextMenuTypes;
import discord_builder.BaseCommandInteraction;
import components.Command;
import systems.CommandBase;

class CodeLineNumbers extends CommandBase {
	@:fastFamily var options:{route:ContextMenuTypes, interaction:BaseCommandInteraction};

	override function update(_) {
		iterate(options, entity -> {
			switch (route) {
				case CodeLineNumbers:
					var message = interaction.targetMessage;
					if (message.author.id != interaction.member.id) {
						interaction.reply({
							content: "Hey, that isn't your message! :angry:",
							ephemeral: true
						}).then(null, (err) -> trace(err));
					}
					if (message != null && message.content.length > 0) {
						var replace = parseString(message.content);
						if (replace != null) {
							interaction.reply({content: replace}).then(function(_) {
								message.delete().then(null, (err) -> trace(err));
							}, (err) -> trace(err));
						} else {
							interaction.reply(
								{content: "No compatible code blocks were found. Only standard block or hx/haxe are supported.",
									ephemeral: true}
							)
								.then(null, (err) -> trace(err));
						}
					}
					universe.deleteEntity(entity);
				default:
			}
		});
	}

	function parseString(content:String) {
		var matched = [];
		var index = 0;
		var start = -1;
		var blocks = ['```hx\n', '```haxe\n', '```\n'];
		var selected = null;

		for (opt in blocks) {
			if (content.contains(opt)) {
				selected = opt;
				break;
			}
		}

		if (selected == null) {
			trace('no compatible code block');
			return null;
		}

		while (index != -1) {
			var pos = start;
			if (pos > -1) {
				pos += selected.length;
			} else {
				pos = 0;
			}
			index = content.indexOf(selected, pos);
			start = index;
			if (index == -1) {
				break;
			}

			var line_end = -1;
			var cursor = start - 1;
			while (line_end == -1) {
				var char = content.charAt(cursor);
				if (char == '\n') {
					line_end = cursor + 1;
					break;
				}
				cursor++;
			}

			matched.push({start: start, end: start + selected.length});
			if (selected != '```\n') {
				var end_tag = content.indexOf('```', index + selected.length);
				matched.push({start: end_tag, end: end_tag + selected.length});
			}
		}
		var replace = content;
		for (i => pos in matched) {
			if (i % 2 == 0) {
				continue;
			}
			var last = matched[i - 1];
			var ogcode = content.substring(last.end, pos.start);
			var lines = addLineNumbers(ogcode);
			replace = replace.replace(ogcode, lines);
		}

		return replace;
	}

	function addLineNumbers(code:String) {
		var new_code = '\n';
		code = code.rtrim();
		var split = code.split('\n');
		for (key => value in split) {
			var new_line = false;
			if (key + 1 < split.length) {
				new_line = true;
			}
			new_code += '${key + 1}: $value';
			if (new_line) {
				new_code += '\n';
			}
		}

		return new_code;
	}

	function cleanSpace(code:String) {
		var shallowest = 500;
		var largest = 0;
		var tabs = false;

		code = code.replace('`', '\\`');

		for (line in code.split('\n')) {
			var first_char_pos = -1;
			var depth = 0;

			for (i in 0...line.length) {
				var char = line.charAt(i);
				if (char == ' ' || char == '\t') {
					if (char == '\t') {
						tabs = true;
					}
					continue;
				}
				first_char_pos = i;
				depth = i;
				break;
			}

			if (depth < shallowest && depth != 0) {
				shallowest = depth;
			}

			if (depth > largest) {
				largest = depth;
			}
		}

		var new_code = '';
		for (line in code.split('\n')) {
			new_code += line.substring(shallowest) + '\n';
		}
		return new_code;
	}

	function run(command:Command, interaction:BaseCommandInteraction) {
		// trace('here');
	}

	function get_name():String {
		return 'codelinenumbers';
	}
}
