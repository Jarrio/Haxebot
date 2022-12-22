package commands;

import externs.Fetch;
import discord_builder.BaseCommandInteraction;
import components.Command;
import systems.CommandBase;

class Translate extends CommandBase {
	var usage:TUsage;

	override function onEnabled() {
		this.getCount();
	}

	function run(command:Command, interaction:BaseCommandInteraction) {
		switch (command.content) {
			case Translate(to, message, from):
				if (this.usage == null) {
					interaction.reply("An error occured");
					return;
				}

				if (this.usage.character_count + message.length > this.usage.character_limit) {
					interaction.reply("API has reached its limit unfortunately. Please wait till next month.");
					return;
				}

				this.getTranslation(interaction, from, to, message);
			default:
		}
	}

	function getCount() {
		this.request('/v2/usage').then((resp) -> {
			resp.json().then(function(body:TUsage) {
				this.usage = body;
				trace('Character count: ${this.usage.character_count}/${this.usage.character_limit}');
			}, err);
		});
	}

	function getTranslation(interaction:BaseCommandInteraction, from:String, to:String, message:String) {
		if (from == null) {
			from = '';
		}

		try {
			this.request('/v2/translate?source_lang=$from&target_lang=$to&text=$message').then((resp) -> {
				resp.json().then(function(body:{translations:Array<TTranslated>}) {
					var content = '';
					for (item in body.translations) {
						content += item.text + '\n';
					}
					interaction.reply(content).then((_) -> this.getCount(), err);
				}, err);
			});
		} catch (e) {
			trace('Deepl error');
			trace(e.details);
			trace(e.message);
			trace(e);
			interaction.reply('Deepl error?').then(null, err);
		}
	}

	function getLanguages() {
		this.request('/v2/languages').then((resp) -> {
			resp.json().then(function(body:Array<TLanguage>) {
				var str = '[';
				for (item in body) {
					str += '{
						"name": "${item.name}",
						"value": "${item.language}"
					},';
				}
				str += ']';
				trace(str);
			}, err);
		});
	}

	inline function request(endpoint:String) {
		return Fetch.fetch('https://api-free.deepl.com$endpoint', {
			method: HttpMethod.GET,
			headers: {
				'Authorization': 'DeepL-Auth-Key ' + Main.keys.deepl_key
			}
		});
	}

	function get_name():String {
		return 'translate';
	}
}

private typedef TUsage = {
	var character_count:Float;
	var character_limit:Float;
}

private typedef TLanguage = {
	var language:String;
	var name:String;
	var supports_formality:Bool;
}

private typedef TTranslated = {
	var text:String;
	var detected_source_language:String;
}
