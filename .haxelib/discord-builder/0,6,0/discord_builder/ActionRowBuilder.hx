package discord_builder;

import haxe.Rest;
import discord_builder.JSONEncodable;

@:jsRequire('@discordjs/builders', 'ActionRowBuilder')
extern class ActionRowBuilder<T> implements JSONEncodable {
	public var components:Array<T>;
	public function new();

	public function addComponents(components:Rest<T>):ActionRowBuilder<T>;
	public function setComponents(components:Rest<T>):ActionRowBuilder<T>;
	public function toJSON():Dynamic;
}