package commands;

import discord_js.MessageEmbed;
import vm2.NodeVM;
import sys.FileSystem;
import js.node.Fs;
import util.Random;
import discord_builder.BaseCommandInteraction;
import components.Command;
import js.node.ChildProcess.spawn;
import systems.CommandBase;

class Run extends CommandBase {
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
		} catch (e ) {
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
			embed.description += ('**Error:** \n' + error);
			return embed;
		}

		return null;
	}

	function extractLibs(code:String) {
		var check_code = ~/(\/?\/?-l\W.*)/gmiu;
		if (!check_code.match(code)) {
			return [];
		}

		var libs = [];
		while (check_code.match(code)) {
			var split = check_code.matched(1).split(" ");
			libs.push('-L');
			libs.push(split[1]);
			code = check_code.matchedRight();
		}

		return libs;
	}

	function run(command:Command, interaction:BaseCommandInteraction) {
		switch (command.content) {
			case Run(code):
				if (!this.isSafe(code, interaction)) {
					interaction.reply("That code is not safe.");
				}
				this.runCodeOnThread(code, interaction);
			default:
		}
	}

	function getImportAndUsings(input:String, index:Int = 0) {
		var regex = new EReg('^(import|using)(.*);$', 'igmu');
		var matches = [];
		while (regex.match(input)) {
			matches.push(regex.matched(index));
			input = regex.matchedRight();
		}

		return {
			code: input,
			paths: matches
		};
	}

	function runCodeOnThread(code:String, interaction:BaseCommandInteraction) {
		if (!this.isSafe(code, interaction)) {
			interaction.reply({content: 'Your code contains bad things.'});
			return;
		}

		var mention = '';

		var libs = this.extractLibs(code);
		var lib_regex = ~/(\/?\/?-l\W.*)/gmiu;
		if (lib_regex.match(code)) {
			code = lib_regex.replace(code, "");
		}

		var get_paths = this.getImportAndUsings(code);
		var format = '';

		for (data in get_paths.paths) {
			format += data;
		}
		try {
			var filename = 'H' + Date.now().getTime() + Math.floor(Math.random() * 100000);
			var check_class = ~/(^class\s(Test|Main)(\n|\s|\S))/mg;
			var code_content = "";
			var class_entry = "Main";

			if (check_class.match(get_paths.code)) {
				var parsed = check_class.matched(0);
				var replaced = "";
				if (parsed.contains("Test")) {
					class_entry = "Test";
				}

				replaced = check_class.replace(parsed,
					StringTools.replace(parsed, class_entry, filename));
				code_content = get_paths.code.replace(parsed, replaced);
				var other_instances = new EReg(class_entry, 'gm');
				if (other_instances.match(code_content)) {
					code_content = other_instances.replace(code_content, filename);
				}
				code_content = code_content.replace(parsed, parsed);
			} else {
				code_content = 'class $filename {\n\tstatic function main() {\n\t\t${get_paths.code}\n\t}\n}';
			}

			code_content = format + '\n' + code_content;
			var pre_loop = code_content;
			code_content = this.insertLoopBreak(filename, code_content);

			Fs.appendFile(
				'${this.base_path}/hx/$filename.hx',
				code_content + '//User:${interaction.user.tag} | time: ${Date.now()}',
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

					var ls = spawn(process, libs.concat(commands), {timeout: this.timeout});

					// to debug code output
					// ls.stdout.on('data', (data:String) -> {
					// 	trace('stdout: ' + this.cleanOutput(data, filename, class_entry));
					// });

					ls.stderr.once('data', (data) -> {
						var compile_output = this.cleanOutput(data, filename, class_entry);
						var embed = this.parseError(compile_output, pre_loop);
						if (embed == null) {
							interaction.reply({content: mention + '```\n${compile_output}```'});
						} else {
							embed.description = this.cleanOutput(embed.description, filename,
								class_entry);
							interaction.reply({embeds: [embed]});
						}

						ls.kill('SIGTERM');
						return;
					});

					ls.once('close', (data) -> {
						var response = "";
						var js_file = '${this.base_path}/bin/$filename.js';
						if (!FileSystem.exists(js_file)) {
							trace('Code likely errored and didnt compile ($filename.js)');
							ls.kill('SIGTERM');
							return;
						}
						var obj = null;

						var vm = new NodeVM({
							sandbox: obj,
							console: 'redirect',
							timeout: this.timeout,
						});

						vm.on('console.log', (data, info) -> {
							var regex = ~/H[0-9]*..hx:[0-9]*.: (.*)/gm;
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
								code_output += '$key. $item \n';
							}

							if (truncated) {
								code_output += '\n//Output has been trimmed.';
							}

							var desc = '**Code:**\n```hx\n${get_paths.code}``` **Output:**\n ```markdown\n'
								+ code_output
								+ '\n```';
							embed.setDescription(desc);

							var url = this.codeSource(code_content);
							var author = {
								name: '@' + interaction.user.tag,
								iconURL: interaction.user.displayAvatarURL()
							}

							if (url == "") {
								embed.setAuthor(author);
							} else {
								var tag = url.split('#')[1];
								embed.setTitle('TryHaxe #$tag');
								embed.setURL(url);
								embed.setAuthor(author);
							}

							var date = Date.fromTime(interaction.createdTimestamp);
							var format_date = DateTools.format(date, "%d-%m-%Y %H:%M:%S");

							embed.setFooter(
								{text: 'Haxe ${this.haxe_version}',
									iconURL: 'https://cdn.discordapp.com/emojis/567741748172816404.png?v=1'}
							);
							if (response.length > 0 && data == 0) {
								interaction.reply({embeds: [embed]}).then((succ) -> {
									trace(
										'${interaction.user.tag} at $format_date with file id: ${filename}'
									);
								}, function(err) trace(err));
								ls.kill();
								return;
							}
						} catch (e ) {
							var compile_output = this.cleanOutput(e.message, filename,
								class_entry);
							interaction.reply({content: mention + '```\n${compile_output}```'});
							trace(e);
						}
						return;
					});
				}
			);
			return;
		} catch (e:Dynamic ) {
			trace(e);
			interaction.reply({content: mention + "Code failed to execute."});
		}
	}

	function codeSource(message:String) {
		var remote = ~/^(!run #([a-zA-Z0-9]{5,8}))/gi;
		var source = "";
		if (remote.match(message)) {
			source = 'https://try.haxe.org/#${remote.matched(2)}';
		}
		return source;
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

	var varname = '';

	function insertLoopBreak(name:String, code:String) {
		varname = '___' + Random.string(6);

		var regex = ~/((while|for)\s*\(.*\)\s*\{|(while|for)\s*\(.*?\))|(function.*?\(.*?\)\s*{)/gmui;
		var copy = code;

		copy = copy.replace(
			'class $name {',
			'class $name {\nstatic public final $varname = Date.now().getTime();'
		);
		copy = copy.replace(
			'class $name{',
			'class $name {\nstatic public final $varname = Date.now().getTime();'
		);
		var matched = [];

		while (regex.match(code)) {
			if (regex.matched(1) != null) {
				matched.push(regex.matched(1));
			}

			if (regex.matched(4) != null) {
				matched.push(regex.matched(4));
			}
			code = regex.matchedRight();
		}
		var throw_fun = 'public static function __time_fun() {if (Date.now().getTime() - $name.${varname} > ${this.timeout}) { throw "Code took too long to execute.";}}';
		var condition = '$name.__time_fun();';
		for (match in matched) {
			copy = copy.replace(match, '\n' + match + '\n' + condition);
		}

		copy = copy.replace('class $name {', 'class $name {\n\t$throw_fun\n\t');
		copy = copy.replace('class $name{', 'class $name {\n\t$throw_fun\n\t');
		return copy;
	}

	function isSafe(code:String, response:BaseCommandInteraction) {
		var check_http = new EReg('haxe.http|haxe.Http', 'gmu');
		if (check_http.match(code)) {
			return false;
		}

		if (!Main.state.macros) {
			if (~/@:.*[bB]uild/igmu.match(code)) {
				response.reply({content: "Currently no build macros allowed"});
				return false;
			}
		} else {
			if (code.contains('macro') || ~/macro|@:.*[bB]uild/igmu.match(code)) {
				return false;
			}
		}
		return
			!~/(sys|(("|')s(.*)y(.*)("|')s("|'))|eval|command|syntax.|require|location|untyped|@:.*[bB]uild)/igmu.match(code);
	}

	function get_name():String {
		return 'run';
	}
}
