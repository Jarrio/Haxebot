import firebase.web.firestore.Timestamp;
import discord_builder.BaseCommandInteraction;
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

function hasRole(role:String, interaction:BaseCommandInteraction) {
	var guild = interaction.member.roles.cache.get(role);
	return (interaction.guild.available && guild!.members!.has(interaction.user.id));
}

function dateWithinTimeout(a:Date, b:Date, timeout:Float) {
	if (a == null || b == null) {
		return false;
	}

	return a.getTime() - b.getTime() < timeout;
}

function fbDateWithinTimeout(a:Timestamp, b:Timestamp, timeout:Float) {
	if (a == null || b == null) {
		return false;
	}

	return a.toDate().getTime() - b.toDate().getTime() < timeout;
}

inline function err(err) {
	trace(err);
}