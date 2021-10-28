package systems.commands;

import discord_builder.BaseCommandInteraction;
import discord_js.MessageEmbed;
import haxe.Http;
import components.Command;
import NodeHtmlParser;

class Api extends CommandBase {
	public static var haxe:String = 'https://api.haxe.org/';
	public static var openfl:String = 'https://api.openfl.org/';
	public static var flixel:String = 'https://api.haxeflixel.com/';
	public static var heaps:String = 'https://heaps.io/api/';
	public static var lime:String = 'https://api.lime.software/';

	function run(command:Command, interaction:BaseCommandInteraction) {
		if (command.content == null) {
			return;
		}

		switch (command.content) {
			case API(content):
				var docs = switch (interaction.channel.id) {
					case '165234904815239168': flixel;
					case '501408700142059520': heaps;
					case '769686258049351722': lime;
					case '769686284318146561': openfl; //openfl channel
					default: haxe;
				}
		
				if (content.contains('Flx') || content.contains('flixel.')) {
					docs = flixel;
				}
		
				if (content.contains('haxe.')) {
					docs = haxe;
				}
		
				//temporarily pull docs from flixel's doc because i think the parser is having issues with
				//openfl docs
				if (content.contains('openfl.')) {
					docs = openfl;
				}
		
				if (content.contains('lime.')) {
					docs = lime;
				}
		
				var check = ['h2d', 'h3d', 'hxd', 'hxsl'];
				for (item in check) {
					if (!content.contains(item)) {
						continue;
					}
					docs = heaps;
					break;
				}
		
				extractDoxData(new ApiParams(docs, command), interaction);
			default:
		}
	}

	function extractDoxData(info:ApiParams, interaction:BaseCommandInteraction) {
		var http = new Http(info.page);

		http.onData = (resp) -> {
			var body = NodeHtmlParser.parse(resp).querySelector('.body');

			if (body == null) {
				return;
			}
			
			var sections = body.querySelectorAll('.section');
			var cls_desc = body.querySelector('.doc-main').innerText;
			var embed = new MessageEmbed();
			var identifier = (info.identifier != null) ? '#${info.identifier}' : '';
			embed.setTitle(info.class_name + '$identifier');
			embed.setURL(http.url);

			var reply_body = '';
			
			for (key => item in body.querySelectorAll('.fields')) {
				var id_check = ~/<span class="identifier">(.*?)<\/span/gm;
				for (field in item.querySelectorAll('.field')) {
					if (info.identifier == null) {
						break;
					}

					if (id_check.match(field.innerHTML) && id_check.matched(1).toLowerCase() == info.identifier.toLowerCase()) {
						var del_value_meta_regx = ~/(@:value\(.*?\)+)/gmi;
						var type = field.querySelector('>h3').innerText.htmlUnescape();
						if (del_value_meta_regx.match(type)) {
							type = type.replace(del_value_meta_regx.matched(1), '');
						}
						type = type.replace('static', '');
						type = type.replace('read only', '(read only) ');
						var desc = field.querySelector('.doc').innerText;
						
						var section = sections[key].innerText;
						
						reply_body += '**${section.substr(0, section.length - 1)}** \n```hx\n$type\n```';
						if (desc.trim().length > 0) {
							reply_body += '**Description**\n```$desc```';
						}

						embed.setDescription(reply_body.htmlUnescape());
						interaction.reply({embeds: [embed]});
						return;
					}
				}
			}
			
			if (cls_desc.trim().length > 0) {
				reply_body += '```\n$cls_desc\n```';
			}

			if (reply_body.length > 0) {
				embed.setDescription(reply_body.htmlUnescape());
				interaction.reply({embeds: [embed]});
			}
		}

		http.onError = function(msg) {
			//trace('$msg | ${http.url}');
			interaction.reply('An error occured finding the request.');
			
		}
		http.request();
	}

	function get_name():String {
		return 'api';
	}
}

@:forward
abstract ApiParams(TApiParams) {
	public inline function new(base:String, command:Command) {
		var split = null;
		switch (command.content) {
			case API(path): 
				split = path.split(' ');
			default:
		}
		
		
		if (split[2] != null) {
			
			base = switch(split[2].toLowerCase()) {
				case 'flixel': Api.flixel;
				case 'haxe': Api.haxe;
				case 'heaps': Api.heaps;
				case 'lime': Api.lime;
				case 'openfl': Api.openfl;
				default: Api.haxe;
			}
		}

		var url = base + split[0].replace('.', '/') + '.html';
		this = {
			class_name: split[0].substring(split[0].lastIndexOf('.') + 1),
			path: split[0],
			identifier: split[1],
			page: (split[1] != null) ? url + '#${split[1]}' : url
		}
	}
}

private typedef TApiParams = {
	var class_name:String;
	var path:String;
	var identifier:String;
	var page:String;
}