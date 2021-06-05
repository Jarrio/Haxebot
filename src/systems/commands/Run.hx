package systems.commands;

import discord_js.Role;
import js.node.Fs;
import haxe.Http;
import discord_js.TextChannel;
import discord_js.MessageEmbed;
import sys.FileSystem;
import discord_js.Message;
import components.Command;
import js.node.ChildProcess.spawn;

class Run extends CommandBase {
	var message_id:String;
	var haxe_version:String = null;
	var code_requests:Map<String, Array<Float>> = [];

	function run(command:Command, message:Message) {
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
		
		this.extractCode(message);
	}

	function codeSource(message:Message) {
		var remote = ~/^(!run #([a-zA-Z0-9]{5,8}))/gi;
		var source = "";
		if (remote.match(message.content)) {
			source = 'https://try.haxe.org/#${remote.matched(2)}';
		}
		return source;
	}

	function extractCode(message:Message) {
		var check_code = ~/^(!run(\s|\n| \n|)```(haxe|hx)(.*)```)/gmisu;
		if (check_code.match(message.content)) {
			this.parse(message, check_code.matched(4));
			return;
		}

		check_code = ~/^(!run #([a-zA-Z0-9]{5,8}))/gi;
		if (check_code.match(message.content)) {
			var regex = ~/(<code class="prettyprint haxe">)(.*?)(<\/code>)/gmius;
			var get_code = new Http('https://try.haxe.org/embed/${check_code.matched(2)}');
			get_code.onData = (data) -> {
				if (regex.match(data)) {
					this.parse(message, regex.matched(2).htmlUnescape());
				}
			}
			get_code.request();
			return;
		}

		check_code = ~/!run (.*)/gmis;
		if (check_code.match(message.content)) {
			this.parse(message, check_code.matched(1));
			return;
		}
		this.parse(message, null);
	}

	function deleteFile(filename:String) {
		try {
			FileSystem.deleteFile('${this.base_path}/bin/$filename.js');
		} catch (e:Dynamic) {
			trace(e);
		}
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

	function canRequest(data:Array<Float>) {
		var timings = 0.0;
		var last = 0.0;
		var count = 1;
		for (i in 0...data.length) {
			if (data.length % 2 == 1 && (data.length - i) == 1) {
				break;
			}
			if (i % 2 == 0) {
				last = data[i];
				continue;
			}
			timings += data[i] - last;
			count++;
		}

		return (data.length < 6) || (timings / count) > 2000;
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

	function parse(message:Message, code:String) {
		var user = message.author.tag;
		if (this.code_requests[user] == null) {
			this.code_requests[user] = [];
		}
		this.code_requests[user].push(message.createdTimestamp);
		if (!this.canRequest(this.code_requests[user])) {
			message.reply({content: '$user - Wait 3 seconds before submitting code requests.'});
			return;
		}

		if (code == null) {
			message.reply({content: 'Your `!run` command formatting is incorrect. Check the pin in <#663246792426782730>.'});
			return;
		}

		var class_exists = ~/(class.*({|\n{))/mgu;

		if (class_exists.match(code)) {
			var check_class = ~/(^class\s(Test|Main)(\n|\s|\S))/mgu;
			if (!check_class.match(code)) {
				message.reply({content: 'You must have a class called `Test` or `Main`'});
				return;
			}
		}
		if (!this.isSafe(code, message)) {
			message.reply({content: 'Your code contains bad things.'});
			return;
		}
		this.runCodeOnThread(code, message);
	}

	function isSafe(code:String, message:Message) {
		var check_http = new EReg('haxe.http|haxe.Http', 'gmu');
		if (check_http.match(code)) {
			return false;
		}

		if (!Main.config.macros) {
			if (~/@:.*[bB]uild/igmu.match(code)) {
				message.reply({content: "Currently no build macros allowed"});
				return false;
			}
		} else {
			if (code.contains('macro') || ~/macro|@:.*[bB]uild/igmu.match(code)) {
				return false;
			}
		}
		return !~/(\}\})|(sys|(("|')s(.*)y(.*)("|')s("|'))|eval|command|syntax.|require|location|untyped|@:.*[bB]uild)/igmu.match(code);
	}

	function runCodeOnThread(code:String, message:Message) {
		if (!this.isSafe(code, message)) {
			message.reply({content: 'Your code contains bad things.'});
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
			var filename = 'H${message.author.id}_' + Date.now().getTime();
			var check_class = ~/(^class\s(Test|Main)(\n|\s|\S))/mg;
			var code_content = "";
			var class_entry = "Main";
			if (check_class.match(get_paths.code)) {
				var parsed = check_class.matched(0);
				var replaced = "";
				if (parsed.contains("Test")) {
					class_entry = "Test";
				}

				replaced = check_class.replace(parsed, StringTools.replace(parsed, class_entry, filename));
				code_content = get_paths.code.replace(parsed, replaced);
			} else {
				code_content = 'class $filename {static function main() {${get_paths.code}}}';
			}
			code_content = format + '\n' + code_content;

			Fs.appendFile('${this.base_path}/hx/$filename.hx', code_content + '//User:${message.author.username} | time: ${Date.now()}', (error) -> {
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

				var ls = spawn(process, libs.concat(commands), {timeout: 10000});
				
				//to debug code output
				// ls.stdout.on('data', (data:String) -> {
				// 	trace('stdout: ' + this.cleanOutput(data, filename, class_entry));
				// });

				ls.stderr.once('data', (data) -> {
					trace('error: ' + data);
					var compile_output = this.cleanOutput(data, filename, class_entry);
					message.reply({content: mention + '```\n${compile_output}```'});
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
					var process = spawn('node', [js_file], {timeout: 10000});

					process.stdout.on('data', (data) -> {
						data = this.cleanOutput(data, filename, class_entry);
						trace(data);
						response += data;
						trace(response);
					});

					process.stderr.on('data', (data) -> {
						trace('error: ' + data);
					});

					process.once('close', (data:Int) -> {
						trace('close: ' + data);

						var x = response.split('\n');
						var truncated = false;
						if (x.length > 21) {
							truncated = true;
							response = "";
							for (line in x.slice(x.length - 20)) {
								response += line + "\n";
							}
						}

						var output_numbers = [];
						var output_lines = [];
						var regex = ~/^(.*\.hx:)(\d*:)(.*)/gmiu;
						var embed = new MessageEmbed();
						embed.type = 'article';

						while (regex.match(response)) {
							output_numbers.push(regex.matched(2));
							output_lines.push(regex.matched(3).replace('\n', ' '));
							
							response = regex.matchedRight();
						}
						
						regex.replace(response, "");
						var code_output = '';
						for (key => value in output_lines) {
							code_output += '\n${key}. ' + value;
						}

						if (truncated) {
							code_output += '\n//Output has been trimmed.';
						}

						var desc = '**Code:**\n```hx\n${get_paths.code}```**Output:**\n```markdown\n' + code_output + '\n```';
						embed.setDescription(desc);

						var url = this.codeSource(message);
						if (url == "") {
							embed.setAuthor('@${message.author.tag}', message.author.displayAvatarURL());
						} else {
							var tag = url.split('#')[1];
							embed.setTitle('TryHaxe #$tag');
							embed.setURL(url);
							embed.setAuthor('@${message.author.tag}', message.author.displayAvatarURL());
						}

						embed.setFooter('Haxe ${this.haxe_version}', 'https://cdn.discordapp.com/emojis/567741748172816404.png?v=1');

						if (response.length > 0 && data == 0) {

							message.delete().then(null, (err) -> trace(err));
							(message.channel : TextChannel).send(embed);
							ls.kill();
							process.kill();
							
							return;
						}
					});
				});
			});
			return;
		} catch (e:Dynamic) {
			trace(e);
			message.reply({content: mention + "Code failed to execute."});
		}

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

	function get_name():String {
		return '!run';
	}
}