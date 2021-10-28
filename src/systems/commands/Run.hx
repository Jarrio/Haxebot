package systems.commands;

import discord_builder.BaseCommandInteraction;
import js.lib.Object;
import vm2.NodeVM;
import js.Browser;
import js.node.Process;
import vm2.VM;
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

	function run(command:Command, interaction:BaseCommandInteraction) {
		switch (command.content) {
			case Code(code):
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
				this.extractCode(code, interaction);
			default:
		}

	}

	function codeSource(code:String) {
		var remote = ~/^(!run #([a-zA-Z0-9]{5,8}))/gi;
		var source = "";
		if (remote.match(code)) {
			source = 'https://try.haxe.org/#${remote.matched(2)}';
		}
		return source;
	}

	function extractCode(code:String, interaction:BaseCommandInteraction) {
		if (code.length > 0) {
			this.parse(interaction, code);
		}
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

	function parse(message:BaseCommandInteraction, code:String) {
		var user = '<@${message.user.id}>';
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

	function isSafe(code:String, interaction:BaseCommandInteraction) {
		var check_http = new EReg('haxe.http|haxe.Http', 'gmu');
		if (check_http.match(code)) {
			return false;
		}

		if (!Main.config.macros) {
			if (~/@:.*[bB]uild/igmu.match(code)) {
				interaction.reply({content: "Currently no build macros allowed"});
				return false;
			}
		} else {
			if (code.contains('macro') || ~/macro|@:.*[bB]uild/igmu.match(code)) {
				return false;
			}
		}
		return !~/(\}\})|(sys|(("|')s(.*)y(.*)("|')s("|'))|eval|command|syntax.|require|location|untyped|@:.*[bB]uild)/igmu.match(code);
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
			var filename = 'H${interaction.user.id}_' + Date.now().getTime();
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

			Fs.appendFile('${this.base_path}/hx/$filename.hx', code_content + '//User:${interaction.user.username} | time: ${Date.now()}', (error) -> {
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
					interaction.reply({content: mention + '```\n${compile_output}```'});
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
					});

					vm.on('console.log', (data, info) -> {
						trace(data);
						trace(info);
						response += '$info\n';
					});

					try {
						vm.runFile(js_file);

						var x = response.split('\n');
						var truncated = false;
						if (x.length > 21) {
							truncated = true;
							response = "";
							for (line in x.slice(x.length - 20)) {
								response += line + "\n";
							}
						}

						var embed = new MessageEmbed();
						embed.type = 'article';
						var code_output = '';
						for (key => item in response.split('\n')) {
							code_output += '$key. $item \n';
						}

						if (truncated) {
							code_output += '\n//Output has been trimmed.';
						}
						trace(get_paths.code.charAt(0));
						trace(get_paths.code.charAt(1));
						var desc = '**Code:**\n```hx\n${get_paths.code}``` **Output:**\n ```markdown\n' + code_output + '\n```';
						trace(desc);

						embed.setDescription(desc);

						var url = this.codeSource(code);
						if (url == "") {
							embed.setAuthor('@${interaction.user.tag}', interaction.user.displayAvatarURL());
						} else {
							var tag = url.split('#')[1];
							embed.setTitle('TryHaxe #$tag');
							embed.setURL(url);
							embed.setAuthor('@${interaction.user.tag}', interaction.user.displayAvatarURL());
						}

						embed.setFooter('Haxe ${this.haxe_version}', 'https://cdn.discordapp.com/emojis/567741748172816404.png?v=1');
						
						if (response.length > 0 && data == 0) {
							interaction.reply({embeds: [embed]});
							ls.kill();
							return;
						}

					} catch (e) {
						trace(e);
					}
				});
			});
		} catch (e:Dynamic) {
			trace(e);
			interaction.reply({content: mention + "Code failed to execute."});
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
		return 'run';
	}
}