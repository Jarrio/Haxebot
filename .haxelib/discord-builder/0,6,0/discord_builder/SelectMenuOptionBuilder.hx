package discord_builder;

import discord_builder.JSONEncodable;

@:jsRequire('@discordjs/builders', 'SelectMenuOptionBuilder')
extern class SelectMenuOptionBuilder implements JSONEncodable {
	public function new();

	public function setDefault(is_default:Bool = true):SelectMenuOptionBuilder;
	public function setDescription(description:String):SelectMenuOptionBuilder;
	public function setEmoji(emoji:String):SelectMenuOptionBuilder;
	public function setLabel(label:String):SelectMenuOptionBuilder;
	public function setValue(string:String):SelectMenuOptionBuilder;
	public function toJSON():Dynamic;
}