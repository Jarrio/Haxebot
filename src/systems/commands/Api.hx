package systems.commands;

import externs.FuzzySort;
import sys.io.File;
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

typedef TAutoComplete = {
	var name:String;
	var value:String;
}

class Api extends CommandBase {
	var api:Map<String, Map<String, Data>> = [];
	var sapi:Map<String, Array<Data>> = [];
	var packages:Map<String, String> = [];
	var npackages:Array<TAutoComplete> = [];
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
			var arr = [];
			for (k => v in index) {
				packages.set(k, type);
				arr.push(v);
				this.npackages.push({
					name: k,
					value: v.path
				});
			}
			this.sapi.set(type, arr);
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
					var focused = null;
					for (item in interaction.options._hoistedOptions) {
						if (item.focused) {
							focused = item;
							break;
						}
					}

					switch (focused.name) {
						case 'package':
							this.search(path, interaction);
						case 'field':
							var ac = [];
							for (key => value in this.cache.fields) {
								var path = path + '.' + field;
								if (key == path) {
									ac.push({
										name: value.id,
										value: value.id
									});
									interaction.respond(ac);
									return;
								}
							}
							try {
								this.getFieldPage(cls, field, interaction);
							} catch (e) {
								trace(e);
								trace(cls);
								trace(field);
								trace(path);
							}
						default:
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
					title = cls.path;
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
		if (cls == null) {
			return;
		}

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
				var index_a = res.indexOf(headers.get(a));
				var index_b = res.indexOf(headers.get(b));
				if (index_a > index_b) {
					return 1;
				}

				if (index_a < index_b) {
					return -1;
				}
				return 0;
			});

			var a = null;
			var b = null;
			var last = 0;
			var response = [];
			var results = [];
			
			//trace(header_arr);
			
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

				response = response.concat(arr);
				var algo = FuzzySort.go(find, response, {key: 'id', limit: 10, threshold: -10000});

				for (a in algo) {
					results.push(a.obj);
				}

				a = b;
				b = null;

				if (a == 'last') {
					break;
				}
			}

			for (r in results) {
				this.cache.set(cls.path, r);
				var name = 'var ${r.id}';
				if (r.code.contains('(')) {
					name = 'fun ${r.id}';
				}

				ac.push({
					name: name,
					value: r.id
				});
			}
			ac.sort((a, b) -> a.name.length - b.name.length);
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

			result += '$identifier:$type';
			if (value != null) {
				result += ' = $value';
			}

			arr.push({
				id: identifier,
				code: result,
				doc: doc
			});
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

			arr.push({
				id: identifier,
				code: result,
				doc: doc
			});
		}
		return arr;
	}

	function search(string:String, interaction:BaseCommandInteraction) {
		var results = [];
		var narrow = new Array<Data>();
		var keywords = [
			"flixel" => ['flx', 'flixel'], 
			"heaps" => ['h2d', 'hxd', 'hxsl', 'h3d'],
			"ceramic" => ['ceramic', 'clay', 'spine'],
			"openfl" => ['openfl'],
			"haxe" => ['haxe']
		];

		for (k => v in keywords) {
			for (i in v) {
				if (string.contains(i)) {
					narrow = this.sapi.get(k);
					break;
				}
			}
		}

		if (narrow.length == 0) {
			var algo = FuzzySort.go(string, this.npackages, {key: 'name', limit: 10, threshold: -10000});
			for (a in algo) {
				results.push(a.obj);
			}
		} else {
			var algo = FuzzySort.go(string, narrow, {key: 'path', limit: 10, threshold: -10000});
			for (a in algo) {
				results.push({
					name: a.obj.path,
					value: a.obj.path
				});
			}
		}

		interaction.respond(results).then(null, err);
	}

	function get_name():String {
		return 'api';
	}
}
