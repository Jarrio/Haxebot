package systems.commands;

import discord_js.TextChannel;
import js.Browser.console;
import discord_js.MessageEmbed;
import haxe.Http;
import discord_js.Message;
import components.Command;
import NodeHtmlParser;

class Api extends CommandBase {
	public static final haxe:String = 'https://api.haxe.org/';
	public static final flixel:String = 'https://api.haxeflixel.com/';
	public static final heaps:String = 'https://heaps.io/api/';
	function run(command:Command, message:Message) {
		if (command.content == null) {
			return;
		}

		var docs = switch ((message.channel:TextChannel).id) {
			case '165234904815239168': flixel;
			case '501408700142059520': heaps;
			default: haxe;
		}

		if (command.content.contains('Flx') || command.content.contains('flixel.')) {
			docs = flixel;
		}

		if (command.content.contains('haxe.')) {
			docs = haxe;
		}

		var check = ['h2d', 'h3d', 'hxd', 'hxsl'];
		for (item in check) {
			if (!command.content.contains(item)) {
				continue;
			}
			docs = heaps;
			break;
		}

		extractDoxData(new ApiParams(docs, command), message);
	}

	function extractDoxData(info:ApiParams, message:Message) {
		var http = new Http(info.page);

		http.onData = (resp) -> {
			var body = NodeHtmlParser.parse(resp).querySelector('.body');
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
					
					if (id_check.match(field.innerHTML) && id_check.matched(1) == info.identifier) {
						var del_value_meta_regx = ~/(@:value\(.*?\)+)/gmi;
						var type = field.querySelector('.anchor').innerText.htmlUnescape();
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
						message.reply(embed);
						return;
					}
				}
			}
			
			if (cls_desc.trim().length > 0) {
				reply_body += '```\n$cls_desc\n```';
			}

			if (reply_body.length > 0) {
				embed.setDescription(reply_body.htmlUnescape());
				message.reply(embed);
			}
		}

		http.onError = function(msg) {
			console.log('Api.hx: 102 - $msg | ${http.url}');

			message.react('❎');
		}
		http.request();
	}

	function get_name():String {
		return '!api';
	}
}

@:forward
abstract ApiParams(TApiParams) {
	public inline function new(base:String, command:Command) {
		var split = command.content.split(' ');

		if (split[2] != null) {
			base = switch(split[2].toLowerCase()) {
				case 'flixel': Api.flixel;
				case 'haxe': Api.haxe;
				case 'heaps': Api.heaps;
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