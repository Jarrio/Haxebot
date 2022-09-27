package systems.commands;

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

class Api extends CommandBase {

	public static var _haxe:String = 'https://api.haxe.org/';
	public static var openfl:String = 'https://api.openfl.org/';
	public static var flixel:String = 'https://api.haxeflixel.com/';
	public static var heaps:String = 'https://heaps.io/api/';
	public static var lime:String = 'https://api.lime.software/';

	var api:Map<String, Map<String, Data>> = [];
	var packages:Map<String, String> = [];
	override function onEnabled() {
		this.api.set('haxe', loadFile('api/haxe'));
		this.api.set('flixel', loadFile('api/flixel'));
		this.api.set('heaps', loadFile('api/heaps'));
		
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
			case Api(content):
				if (interaction.isAutocomplete()) {
					this.search(content, interaction);
					return;
				}

				if (this.packages.exists(content)) {
					var type = this.packages.get(content);
					var data = this.api.get(type).get(content);
					var embed = new MessageEmbed();
					embed.setTitle(data.name);
					embed.setURL(data.link);
					embed.setDescription('**Description:**\n${data.description}');
					interaction.reply({embeds: [embed]});
					return;
				}

				interaction.reply('New api command isnt complete yet so there may still be things not working');
				return;

				var docs = switch (interaction.channel.id) {
					case '165234904815239168': flixel;
					case '501408700142059520': heaps;
					case '769686258049351722': lime;
					case '769686284318146561': openfl; // openfl channel
					default: _haxe;
				}

				if (content.contains('Flx') || content.contains('flixel.')) {
					docs = flixel;
				}

				if (content.contains('haxe.')) {
					docs = _haxe;
				}

				var check = ['h2d', 'h3d', 'hxd', 'hxsl'];
				for (item in check) {
					if (!content.contains(item)) {
						continue;
					}
					docs = heaps;
					break;
				}
			default:
		}
	
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

		interaction.respond(results).then(null, (err) -> trace(err));
	}

	function get_name():String {
		return 'api';
	}
}
