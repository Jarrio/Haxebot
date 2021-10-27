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