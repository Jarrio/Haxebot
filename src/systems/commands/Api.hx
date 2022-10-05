package systems.commands;

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

typedef TParsedField = {
	var id:String;
	var code:String;
	var doc:String;
}

class Api extends CommandBase {
	var api:Map<String, Map<String, Data>> = [];
	var packages:Map<String, String> = [];
	var results_cache:Map<String, TParsedField> = [];

	override function onEnabled() {
		this.api.set('haxe', loadFile('api/haxe'));
		this.api.set('flixel', loadFile('api/flixel'));
		this.api.set('heaps', loadFile('api/heaps'));
		this.api.set('ceramic', loadFile('api/ceramic'));
		this.api.set('openfl', loadFile('api/openfl'));

		for (type => index in api) {
			for (k => v in index) {
				packages.set(k, type);
			}
		}

		trace('loaded');
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
						this.getFieldPage(cls, field, interaction);
						return;
					}
					return;
				}
				
				var f = this.results_cache.get(field);
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

				if (this.results_cache.exists(field)) {
					title += '#' + f.id;
					link += '#' + f.id;
					field_desc = f.doc;
				}

				var desc = '$cls_desc```hx\n${f.code}\n```${f.doc}';

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

	function getFieldPage(cls:Data, find:String, interaction:BaseCommandInteraction) {
		var http = new Http(cls.link);

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
			var ac = [];
			for (r in results) {
				this.results_cache.set(r.id, r);
				ac.push({
					name: r.id,
					value: r.id
				});
			}

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
			doc.trim();

			var result = '';
			for (l in labels) {
				result += '$l ';
			}

			if (labels.length > 0) {
				result += '| ';
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

		for (key => _ in this.packages) {
			if (results.length >= 10) {
				break;
			}

			if (key.toLowerCase().contains(string.toLowerCase())) {
				results.push({
					name: key,
					value: key
				});
			}
		}

		interaction.respond(results).then(null, err);
	}

	function get_name():String {
		return 'api';
	}
}
