package commands;

import commands.types.Duration;
import systems.TextCommandBase;
import components.TextCommand;
import util.Random;
import vm2.NodeVM;
import js.node.Fs;
import haxe.Http;
import discord_js.TextChannel;
import discord_js.MessageEmbed;
import sys.FileSystem;
import discord_js.Message;
import js.node.ChildProcess.spawn;
import js.Browser;

private typedef Request = {
	action:Action,
	?input:String,
	?hxml:String,
};

private enum abstract Action(String) {
	var Run = "run";
	var HaxeVersion = "haxe_version";
	var HaxelibRun = "haxelib_run";
}

private enum abstract Status(String) {
	var Ok;
	var OhNo;
}

private typedef Response = {
	status:Status,
	?output:Null<String>,
	?error:Null<String>,
}

class Run2 extends TextCommandBase {
	var message_id:String;
	var haxe_version:String = null;
	var code_requests:Map<String, Array<Float>> = [];
	var channel:TextChannel;
	var checked:Bool = false;
	var timeout = 5000;
	var last_cleared:Float;
	final site = #if block "" #else "localhost" #end;

	override function onEnabled() {
		var http = new Http('http://$site:1337');
		http.onError = function(error) {
			trace(error);
		}

		http.setPostData('{
				"action": "haxe_version"
			}');

		http.onData = function(response) {
			var parse:Response = Json.parse(response);
			switch (parse.status) {
				case Ok:
					this.haxe_version = parse.output;
				default:
					trace(parse.output);
					trace(parse.error);
			}
		}

		http.request(true);
	}

	function run(message:Message, content:String) {
		if (this.haxe_version == null) {
			return;
		}
		this.extractCode(message.content, message);
	}

	function codeSource(message:String) {
		var remote = ~/^(!run #([a-zA-Z0-9]{5,8}))/gi;
		var source = "";
		if (remote.match(message)) {
			source = 'https://try.haxe.org/#${remote.matched(2)}';
		}
		return source;
	}

	function extractCode(message:String, response:Message) {
		var check_code = ~/^(!run #([a-zA-Z0-9]{5,8}))/gi;
		if (check_code.match(message)) {
			var regex = ~/(<code class="prettyprint haxe">)(.*?)(<\/code>)/gmius;
			var get_code = new Http('https://try.haxe.org/embed/${check_code.matched(2)}');
			get_code.onData = (data) -> {
				if (regex.match(data)) {
					this.parse(regex.matched(2).htmlUnescape(), response);
				}
			}
			get_code.request();
			return;
		}

		check_code = ~/^(!run(\s|\n| \n|)```(haxe|hx|)(.*)```)/gmisu;
		if (check_code.match(message)) {
			this.parse(check_code.matched(4), response);
			return;
		}

		check_code = ~/!run[\s|\n| \n](.*)/gmis;
		if (check_code.match(message)) {
			this.parse(check_code.matched(1), response);
			return;
		}
		this.parse(null, response);
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

		//data = data.replace(filename, class_entry).replace('', '');
		data = data.replace(this.base_path, "");
		data = data.replace("/hx/", "");
		data = data.replace("/bin/", "");
		var reg = ~/Main.hx:[0-9].*?: /gm;
		data = reg.replace(data, '');

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

	function parse(code:String, response:Message) {
		if (code == null || code.length == 0) {
			response.reply(
				{content: 'Your `!run` command formatting is incorrect. Check the pin in <#663246792426782730>.'}
			);
			trace('hey');
			return;
		}

		var class_exists = ~/(class.*({|\n{))/mgu;

		if (class_exists.match(code)) {
			var check_class = ~/(^class\s(Test|Main)(\n|\s|\S))/mgu;
			if (!check_class.match(code)) {
				response.reply({content: 'You must have a class called `Test` or `Main`'});
				trace('hey');
				return;
			}
		}
		trace('hey');
		code = code.replace('```', '\\`\\`\\`');
		
		this.runCodeOnThread(code, response);
	}

	function parseError(error:String, code:String) {
		var embed = new MessageEmbed();
		embed.setTitle('Compilation Error');

		var regex = ~/(Main|Test).hx:([0-9]+): (character|characters) ([0-9]+)(-([0-9]+))? : (.*)/gm;
		if (regex.match(error)) {
			var line = regex.matched(2).parseInt();
			var start_char = regex.matched(4).parseInt();
			var end_char = regex.matched(6).parseInt();
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
			if (new_code.length > 3900) {
				new_code = new_code.substr(0, 3900);
			}
			embed.setDescription('```hx\n' + new_code + '``` **Error** \n $error');
			return embed;
		}

		return null;
	}

	function runCodeOnThread(code:String, message:Message) {
		var mention = '<@${message.author.id}>';

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
			var check_class = ~/(^class\s(Test|Main)(\n|\s|\S))/mg;
			var code_content = get_paths.code;
			var class_entry = "Main";

			if (check_class.match(get_paths.code)) {
				var parsed = check_class.matched(0);
				var replaced = "";
				if (parsed.contains("Test")) {
					code_content = code_content.replace('class Test', 'class Main');
				}
			} else {
				code_content = 'class $class_entry {\n\tstatic function main() {\n\t\t${get_paths.code}\n\t}\n}';
			}

			code_content = format + '\n' + code_content;
			var pre_loop = code_content;

			var http = new Http('http://$site:1337');
			http.onError = function(error) {
				trace(error);
			}

			http.onData = function(response) {
				var parse:Response = Json.parse(response);
				trace(response);
				switch (parse.status) {
					case Ok:
						
						var resp = '';
						var x = parse.output.split('\n');
						var truncated = false;
						if (x.length > 24) {
							truncated = true;
							resp = "";
							for (line in x.slice(x.length - 23)) {
								resp += line + "\n";
							}
						}

						var embed = new MessageEmbed();
						embed.type = 'article';
						var code_output = '';
						resp = parse.output;

						var split = resp.split('\n');
						for (key => item in split) {
							if (key >= split.length - 1) {
								break;
							}
							code_output += '$key. $item \n';
						}

						code_output = cleanOutput(code_output, 'Main.hx', 'Main');
//						trace(code_output);
						if (truncated) {
							code_output += '\n//Output has been trimmed.';
						}

						var desc = '**Code:**\n```hx\n${get_paths.code}``` **Output:**\n ```markdown\n'
							+ code_output
							+ '\n```';
						embed.setDescription(desc);

						var url = this.codeSource(message.content);
						var author = {
							name: '@' + message.author.tag,
							iconURL: message.author.displayAvatarURL()
						}

						if (url == "") {
							embed.setAuthor(author);
						} else {
							var tag = url.split('#')[1];
							embed.setTitle('TryHaxe #$tag');
							embed.setURL(url);
							embed.setAuthor(author);
						}

						var date = Date.fromTime(message.createdTimestamp);
						var format_date = DateTools.format(date, "%d-%m-%Y %H:%M:%S");

						embed.setFooter({
							text: 'Haxe ${this.haxe_version}',
							iconURL: 'https://cdn.discordapp.com/emojis/567741748172816404.png?v=1'
						});
						trace(resp);
						trace(parse);
						if (resp.length > 0) {
							message.reply({allowedMentions: {parse: []}, embeds: [embed]})
								.then((succ) -> {
									trace('${message.author.tag} at $format_date with file id:');
									if (message.deletable) {
										message.delete().then(null, function(err) {
											trace(err);
											Browser.console.dir(err);
										});
									}
								}, function(err) {
									trace(err);
									Browser.console.dir(err);
								});
							return;
						}
					case OhNo:
						var compile_output = this.cleanOutput(parse.error, null, class_entry);
						var errs = '';
						for (line in parse.error.split('\n')) {
							var split = line.split('/');
							errs += split[split.length - 1] + '\n';
						}

						var embed = parseError(errs, code_content);
						if (embed == null) {
							message.reply({
								allowedMentions: {parse: []},
								content: mention + '```\n${compile_output}```'
							});
						} else {
							message.reply({allowedMentions: {parse: []}, embeds: [embed]});
						}
				}
			}

			var libstr = "";
			for (lib in libs) {
				libstr += '$lib\n';
			}

			var request:Request = {
				action: Run,
				input: code_content,
				hxml: libstr
			}

			var str = Json.stringify(request);
			http.setPostData(str);
			http.request(true);
			return;
			var filename = "";
			Fs.appendFile(
				'${this.base_path}/hx/$filename.hx',
				code_content + '//User:${message.author.tag} | time: ${Date.now()}',
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
						pre_loop = pre_loop.replace(filename, class_entry);

						var embed = this.parseError(compile_output, pre_loop);

						if (embed == null) {
							message.reply({
								allowedMentions: {parse: []},
								content: mention + '```\n${compile_output}```'
							});
						} else {
							embed.setDescription(this.cleanOutput(embed.description, filename,
								class_entry));
							message.reply({allowedMentions: {parse: []}, embeds: [embed]});
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

							var url = this.codeSource(message.content);
							var author = {
								name: '@' + message.author.tag,
								iconURL: message.author.displayAvatarURL()
							}

							if (url == "") {
								embed.setAuthor(author);
							} else {
								var tag = url.split('#')[1];
								embed.setTitle('TryHaxe #$tag');
								embed.setURL(url);
								embed.setAuthor(author);
							}

							var date = Date.fromTime(message.createdTimestamp);
							var format_date = DateTools.format(date, "%d-%m-%Y %H:%M:%S");

							embed.setFooter({
								text: 'Haxe ${this.haxe_version}',
								iconURL: 'https://cdn.discordapp.com/emojis/567741748172816404.png?v=1'
							});
							if (response.length > 0 && data == 0) {
								message.reply({allowedMentions: {parse: []}, embeds: [embed]})
									.then((succ) -> {
										trace(
											'${message.author.tag} at $format_date with file id: ${filename}'
										);
										if (message.deletable) {
											message.delete().then(null, function(err) {
												trace(err);
												Browser.console.dir(err);
											});
										}
									}, function(err) {
										trace(err);
										Browser.console.dir(err);
									});
								ls.kill();
								return;
							}
						} catch (e ) {
							var compile_output = this.cleanOutput(e.message, filename, class_entry);
							message.reply({
								allowedMentions: {parse: []},
								content: mention + '```\n${compile_output}```'
							});
							trace(e);
						}
						return;
					});
				}
			);
			return;
		} catch (e:Dynamic ) {
			trace(e);
			this.channel.send({content: mention + "Code failed to execute."});
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
