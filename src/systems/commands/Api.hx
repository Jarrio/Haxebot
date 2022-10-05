package systems.commands;

import sys.io.File;
import haxe.crypto.Base64;
import js.Browser;
import haxe.Serializer;
import haxe.Http;
import discord_builder.BaseCommandInteraction;
import discord_js.MessageEmbed;
import components.Command;

typedef Data = {
	var type:String;
	var name:String;
	var path:String;
	var link:String;
	var description:String;
}

typedef TField = {
	var id:String;
	var code:String;
	var doc:String;
}

typedef TFieldCache = {
	var size:Int;
	var fields:Map<String, TField>;
}

@:forward
abstract FieldCache(TFieldCache) from TFieldCache {
	public function new() {
		this = {
			size: 0,
			fields: []
		}
	}

	public function exists(pkg:String, key:String) {
		var path = pkg + '.' + key;
		return this.fields.exists(path);
	}

	public function set(pkg:String, value:TField) {
		var path = pkg + '.' + value.id;
		if (!this.fields.exists(path)) {
			this.size++;
		}

		this.fields.set(path, value);
	}

	public function get(pkg:String, id:String) {
		var path = pkg + '.' + id;
		if (!this.fields.exists(path)) {
			return null;
		}
		return this.fields.get(path);
	}
}

class Api extends CommandBase {
	var api:Map<String, Map<String, Data>> = [];
	var packages:Map<String, String> = [];
	var cache:FieldCache;
	var save_time:Float;
	var save_frequency:Float = 3600000;

	override function onEnabled() {
		this.api.set('haxe', loadFile('api/haxe'));
		this.api.set('flixel', loadFile('api/flixel'));
		this.api.set('heaps', loadFile('api/heaps'));
		this.api.set('ceramic', loadFile('api/ceramic'));
		this.api.set('openfl', loadFile('api/openfl'));
		this.cache = loadFile('api/cache/0');

		if (this.cache == null) {
			this.cache = new FieldCache();
		}

		for (type => index in api) {
			for (k => v in index) {
				packages.set(k, type);
			}
		}

		trace('loaded');
	}

	override function update(_) {
		super.update(_);
		var time = Date.now().getTime();
		if (time - this.save_time > this.save_frequency) {
			this.saveCache();
		}
	}

	inline function saveCache() {
		File.saveContent('./commands/api/cache/0.json', this.cache.stringify());
		this.save_time = Date.now().getTime();
	}

	function run(command:Command, interaction:BaseCommandInteraction) {
		if (command.content == null) {
			return;
		}

		switch (command.content) {
			case Api(path, field):
				var type = this.packages.get(path);
				var cls = null;

				if (this.packages.exists(path)) {
					cls = this.api.get(type).get(path);
				}

				if (interaction.isAutocomplete()) {
					if (!this.packages.exists(path)) {
						this.search(path, interaction);
					}

					if (this.packages.exists(path) && field != null && field.length > 2) {
						var ac = [];
						for (key => value in this.cache.fields) {
							var path = path + '.' + field;
							if (key == path) {
								ac.push({
									name: value.code.substr(0, 40) + '...',
									value: value.id
								});

								interaction.respond(ac);
								return;
							}

							if (key.contains(field)) {
								ac.push({
									name: value.code.substr(0, 40) + '...',
									value: value.id
								});
							}
						}
						this.getFieldPage(cls, field, interaction);
						return;
					}
					return;
				}

				var f = this.cache.get(path, field);
				var embed = new MessageEmbed();
				var title = '';
				var link = '';
				var cls_desc = '';
				var field_desc = '';

				if (this.packages.exists(path)) {
					title = cls.name;
					link = cls.link;
					cls_desc = cls.description;
				}

				if (this.cache.exists(path, field)) {
					title += '#' + f.id;
					link += '#' + f.id;
					field_desc = f.doc;
				}

				var desc = '$cls_desc';

				if (f != null) {
					desc += '```hx\n${f.code}\n```${f.doc}';
				}

				if (cls_desc == '' && field_desc == '') {
					desc = '*No description found*';
				}

				embed.setTitle(title);
				embed.setURL(link);
				embed.setDescription(desc);

				interaction.reply({embeds: [embed]});
				return;
			default:
		}
	}

	function getFieldPage(cls:Data, find:String, interaction:BaseCommandInteraction, ?ac:Array<{name:String, value:String}>) {
		var http = new Http(cls.link);
		if (ac == null) {
			ac = [];
		}

		var headers = [
			'static_vars' => '<h3 class="section">Static variables</h3>',
			'static_methods' => '<h3 class="section">Static methods</h3>',
			'constructor' => '<h3 class="section">Constructor</h3>',
			'variables' => '<h3 class="section">Variables</h3>',
			'methods' => '<h3 class="section">Methods</h3>',
			'last' => '<footer'
		];

		var header_arr = ['static_vars', 'static_methods', 'constructor', 'variables', 'methods', 'last'];

		http.onData = (res) -> {
			header_arr.sort(function(a, b) {
				var index_a = res.indexOf(a);
				var index_b = res.indexOf(b);
				if (index_a > index_b) {
					return 1;
				}

				if (index_a < index_b) {
					return -1;
				}
				return 0;
			});

			var a = header_arr[0];
			var b = null;
			var last = 0;
			var results = [];

			while (true) {
				for (k => v in header_arr) {
					if (a != null && b != null) {
						break;
					}

					if (res.contains(headers.get(v))) {
						if (a != null && b == null && k > last) {
							b = v;
							last = k;
						}

						if (a == null) {
							a = v;
						}
					}
				}

				var pos_a = res.indexOf(headers.get(a)) + headers.get(a).length;
				var pos_b = res.indexOf(headers.get(b));
				var fields = res.substring(pos_a, pos_b);

				var arr = switch (a) {
					case 'static_vars':
						searchVars(find, fields);
					case 'static_methods':
						searchMethods(find, fields);
					case 'constructor':
						searchMethods(find, fields);
					case 'variables':
						searchVars(find, fields);
					case 'methods':
						searchMethods(find, fields);
					case 'last': [];
					default: [];
				}

				results = results.concat(arr);
				a = b;
				b = null;

				if (a == 'last') {
					break;
				}
			}

			for (r in results) {
				this.cache.set(cls.path, r);
				ac.push({
					name: r.code.substr(0, 40) + '...',
					value: r.id
				});
			}

			this.saveCache();
			
			interaction.respond(ac);
			
		}
		http.request();
	}

	function searchVars(find:String, fields:String) {
		var parse = NodeHtmlParser.parse(fields);
		// grabs things like "static" or "read only" and the field identifier
		var arr = [];
		for (f in parse.querySelectorAll('.field')) {
			var labels = [];
			var identifier = '';
			var type = '';
			var doc = '';
			var value = '';

			for (m in f.querySelectorAll('span')) {
				if (m.classNames.contains('label') && !m.text.contains("@:")) {
					labels.push(m.text);
					// trace(m.text);
				}

				if (m.classNames.contains('identifier')) {
					identifier = m.text;
				}
			}

			value = f.querySelector('code').text.split('=')[2];

			var split = f.querySelector('code').text.split(':');
			if (split.length == 2) {
				type = split[1];
			}

			if (split.length == 3) {
				type = split[2];
			}

			for (p in f.querySelectorAll('p')) {
				if (p.classNames.contains('javadoc')) {
					break;
				}
				var line = p.text.replace('\n', '').replace('\t', '');
				if (line.length == 0) {
					continue;
				}

				doc += '$line ';
			}

			var result = '';
			for (l in labels) {
				result += '$l ';
			}

			result += '| $identifier:$type';
			if (value != null) {
				result += ' = $value';
			}

			if (identifier.toLowerCase().startsWith(find.toLowerCase())) {
				arr.push({
					id: identifier,
					code: result,
					doc: doc
				});
			}
		}
		return arr;
	}

	function searchMethods(find:String, fields:String) {
		var parse = NodeHtmlParser.parse(fields);
		// grabs things like "static" or "read only" and the field identifier
		var arr = [];
		for (f in parse.querySelectorAll('.field')) {
			var labels = [];
			var identifier = '';
			var parameters = '';
			var type = '';
			var doc = '';
			for (m in f.querySelectorAll('span')) {
				if (m.classNames.contains('label') && !m.text.contains("@:")) {
					labels.push(m.text.trim());
				}

				if (m.classNames.contains('identifier')) {
					identifier = m.text.trim();
				}
			}

			parameters = f.querySelector('code').text.split(identifier)[1].trim();

			var split = f.querySelector('code').text.split(':');
			if (split.length == 2) {
				type = split[1].trim();
			}

			if (split.length == 3) {
				type = split[2].trim();
			}

			for (p in f.querySelectorAll('p')) {
				if (p.classNames.contains('javadoc')) {
					break;
				}

				var line = p.text.replace('\n', '').replace('\t', '').trim();
				if (line.length == 0) {
					continue;
				}

				doc += '$line ';
			}

			var result = '';
			for (l in labels) {
				result += '$l ';
			}

			result += '$identifier$parameters';

			if (identifier.toLowerCase().startsWith(find.toLowerCase())) {
				arr.push({
					id: identifier,
					code: result,
					doc: doc
				});
			}
		}
		return arr;
	}

	function search(string:String, interaction:BaseCommandInteraction) {
		var results = [];

		if (this.packages.exists(string)) {
			var t = this.packages.get(string);
			var api = this.api.get(t).get(string);

			results.push({
				name: api.name,
				value: api.path
			});
			interaction.respond(results).then(null, err);
			return;
		}

		for (key => _ in this.packages) {
			if (results.length >= 10) {
				break;
			}

			if (key.toLowerCase().contains(string.toLowerCase())) {
				if (this.matchPercent(string, key) > 45) {
					results.push({
						name: key,
						value: key
					});
				}
			}
		}

		interaction.respond(results).then(null, err);
	}

	inline function matchPercent(input:String, compare:String) {
		var al = input.length;
		var bl = compare.length;
		var value = ((bl - al) / bl) * 100;
		return 100 - value;
	}

	function get_name():String {
		return 'api';
	}
}
