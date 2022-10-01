package systems.commands;

import discord_js.MessageEmbed;
import vm2.NodeVM;
import sys.FileSystem;
import js.node.Fs;
import util.Random;
import discord_builder.BaseCommandInteraction;
import components.Command;
import js.node.ChildProcess.spawn;

class Trace extends CommandBase {
	var timeout = 5000;
	var haxe_version:String = null;
	var last_cleared:Float;
	override function update(_:Float) {
		super.update(_);
		if (this.haxe_version == null) {
			var process = './haxe/haxe';
			if (!FileSystem.exists(process)) {
				process = 'haxe';
			}
			var ls = spawn(process, ['--version']);
			ls.stdout.once('data', (data) -> {
				this.haxe_version = data.toString().substring(0, 5);
				ls.kill();
			});
		}
		this.cleanDirectory();
	}

	inline function cleanDirectory() {
		var now = Date.now().getTime();
		var clear_frame = 604800000;
		if (now - this.last_cleared < clear_frame) {
			return;
		}

		this.last_cleared = now;
		
		var before = null;
		
		try {
			var path = FileSystem.absolutePath('.') + '/haxebot';
			var folders = FileSystem.readDirectory(path);

			for (folder in folders) {
				before = Date.fromString(folder).getTime();
				if (now - before < clear_frame) {
					continue;
				}

				FileSystem.deleteDirectory('$path/$folder');
			}
		} catch (e) {
			trace(e);
		}
	}

	function parseError(error:String, code:String) {
		var embed = new MessageEmbed();
		embed.setTitle('Compilation Error');

		var regex = ~/(Main|Test).hx:([0-9]+): characters ([0-9]+)-([0-9]+) : (.*)/gm;
		if (regex.match(error)) {
			var line = regex.matched(2).parseInt();
			var start_char = regex.matched(3).parseInt();
			var end_char = regex.matched(4).parseInt();
			var str = '';
			var new_code = '';
			for (key => value in code.split('\n')) {
				if (key != (line - 1)) {
					new_code += value + '\n';
					continue;
				}

				for (i in 0...value.length) {
					var pos = i + 1;
					var char = value.charAt(i);
					if (pos < start_char) {
						str += char;
					} else if (pos == start_char) {
						str += '->$char';
					} else if (pos == end_char) {
						str += '${char}<-';
					}
				}
				new_code += str + '\n';
			}
			embed.setDescription('```hx\n' + new_code + '```');
			embed.addField('Error', error);
			return embed;
		}

		return null;
	}

	function run(command:Command, interaction:BaseCommandInteraction) {
		switch (command.content) {
			case Trace(code):
				if (!this.isSafe(code, interaction)) {
					interaction.reply("That code is not safe.");
				}
				this.runCode(code, interaction);
			default:
		}
	}

	function runCode(code:String, interaction:BaseCommandInteraction) {
		var filename = 'T' + Date.now().getTime() + Math.floor(Math.random() * 100000);
		var final_code = this.insertLoopBreak('class $filename {\n\tstatic function main() {\n\t\ttrace($code);\n\t}\n}');
		var mention = '<@${interaction.user.id}>';

		Fs.appendFile('${this.base_path}/hx/$filename.hx', final_code + '\n//User:${interaction.user.tag} id: ${interaction.user.id}| time: ${Date.now()}',
			(error) -> {
				if (error != null) {
					trace(error);
				}

				var commands = [
					'-cp',
					'${this.base_path}/hx',
					'-main',
					filename,
					'-js',
					'${this.base_path}/bin/$filename.js'
				];

				var process = './haxe/haxe';
				if (!FileSystem.exists(process)) {
					process = 'haxe';
				}

				var ls = spawn(process, commands, {timeout: this.timeout});

				ls.stderr.once('data', (data) -> {
					trace('error: ' + data);
					
					var compile_output = this.cleanOutput(data, filename, "Main");
					var embed = this.parseError(compile_output, final_code);
					if (embed == null) {
						interaction.reply({content: mention + '```\n${compile_output}```'});
					} else {
						embed.description = this.cleanOutput(embed.description, filename, "Main");
						interaction.reply({embeds: [embed]});
					}
					
					ls.kill('SIGTERM');
					return;
				});

				ls.once('close', (data) -> {
					var response = "";
					var js_file = '${this.base_path}/bin/$filename.js';
					if (!FileSystem.exists(js_file)) {
						return trace('Code likely errored and didnt compile ($filename.js)');
					}
					var obj = null;

					var vm = new NodeVM({
						sandbox: obj,
						console: 'redirect',
						timeout: this.timeout,
					});

					vm.on('console.log', (data, info) -> {
						var regex = ~/T[0-9]*..hx:[0-9]*.: (.*)/gm;
						if (regex.match(data)) {
							data = regex.matched(1);
						}

						if (info != null) {
							response += '$info\n';
						} else {
							response += '$data\n';
						}
					});

					try {
						vm.run(sys.io.File.getContent(js_file));

						var x = response.split('\n');
						var truncated = false;
						if (x.length > 24) {
							truncated = true;
							response = "";

							for (line in x.slice(x.length - 23)) {
								response += line + "\n";
							}
						}

						var embed = new MessageEmbed();
						embed.type = 'article';
						var code_output = '';
						var split = response.split('\n');
						for (key => item in split) {
							if (key >= split.length - 1) {
								break;
							}
							code_output += '${key + 1}. $item \n';
						}

						if (truncated) {
							code_output += '\n//Output has been trimmed.';
						}

						var desc = '**Code:**\n```hx\n${code}``` **Output:**\n ```markdown\n' + code_output + '\n```';
						embed.setDescription(desc);

						var author = {
							name: '@' + interaction.user.tag,
							iconURL: interaction.user.displayAvatarURL()
						}

						embed.setAuthor(author);

						var date = Date.fromTime(interaction.createdTimestamp);
						var format_date = DateTools.format(date, "%d-%m-%Y %H:%M:%S");

						embed.setFooter({text: 'Haxe ${this.haxe_version}', iconURL: 'https://cdn.discordapp.com/emojis/567741748172816404.png?v=1'});
						if (response.length > 0 && data == 0) {
							interaction.reply({embeds: [embed]}).then((succ) -> {
								trace('${interaction.user.tag}(${interaction.user.id}) at ${format_date} with file id: ${filename}');
							}, err);
							ls.kill();
							return;
						}
					} catch (e) {
						var compile_output = this.cleanOutput(e.message, filename, 'Main');
						interaction.reply({content: mention + '```\n${compile_output}```'});
						trace(e);
					}
					return;
				});
			});
	}

	var base_path(get, never):String;

	function get_base_path():String {
		var path = FileSystem.absolutePath('.');
		if (!FileSystem.exists(path + '/haxebot')) {
			FileSystem.createDirectory(path + '/haxebot');
		}
		path += '/haxebot';
		var date = DateTools.format(Date.now(), '%F');
		path += '/$date';
		if (!FileSystem.exists(path)) {
			FileSystem.createDirectory(path);
		}

		if (!FileSystem.exists(path + '/hx')) {
			FileSystem.createDirectory(path + '/hx');
		}

		if (!FileSystem.exists(path + '/bin')) {
			FileSystem.createDirectory(path + '/bin');
		}
		return path;
	}

	function cleanOutput(data:String, filename:String, class_entry) {
		data = data.toString();
		var remove_vm = ~/(\[(.*|vm)\].*)$/igmu;

		data = data.replace(filename, class_entry).replace('', '');
		data = data.replace(this.base_path, "");
		data = data.replace("/hx/", "");
		data = data.replace("/bin/", "");

		return data;
	}

	function insertLoopBreak(code:String) {
		var varname = '';

		var regex = ~/(while\s*\(.*\)\s*\{|while\s*\(.*?\))/gmui;
		var copy = code;
		var matched = [];

		while (regex.match(code)) {
			matched.push(regex.matched(1));
			code = regex.matchedRight();
		}

		for (match in matched) {
			varname = '___' + Random.string(6);
			var start = 'final $varname = Date.now().getTime();';
			var condition = 'if (Date.now().getTime() - $varname > ${this.timeout}) { break; }';
			copy = copy.replace(match, start + '\n' + match + '\n' + condition);
		}
		return copy;
	}

	function isSafe(code:String, response:BaseCommandInteraction) {
		var check_http = new EReg('haxe.http|haxe.Http', 'gmu');
		if (check_http.match(code)) {
			return false;
		}

		if (!Main.config.macros) {
			if (~/@:.*[bB]uild/igmu.match(code)) {
				response.reply({content: "Currently no build macros allowed"});
				return false;
			}
		} else {
			if (code.contains('macro') || ~/macro|@:.*[bB]uild/igmu.match(code)) {
				return false;
			}
		}
		return !~/(sys|(("|')s(.*)y(.*)("|')s("|'))|eval|command|syntax.|require|location|untyped|@:.*[bB]uild)/igmu.match(code);
	}

	function get_name():String {
		return 'trace';
	}
}
