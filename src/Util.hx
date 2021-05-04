import discord_js.Message;
import sys.io.File;
import haxe.Json;
import haxe.PosInfos;

function loadFile(filename:String, ?pos:PosInfos):Dynamic {
	var data = null;
	try {
		data = Json.parse(File.getContent('./commands/$filename.json'));
	} catch (e) {
		trace(e);
		trace('Failed to load file or parse json', pos);
	}
	return data;
}

function hasRole(role:String, message:Message) {
	var guild = message.guild.roles.cache.get(role);
	return (message.guild.available && !guild!.members!.has(message.author.id));
}