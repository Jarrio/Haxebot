package discord_builder;

import discord_builder.APITextInputComponent;
import discord_builder.JSONEncodable;

@:jsRequire('@discordjs/builders', 'TextInputBuilder')
extern class TextInputBuilder implements JSONEncodable {
	public function new();

	public function setCustomId(custom_id:String):TextInputBuilder;
	public function setLabel(label:String):TextInputBuilder;
	public function setMaxLength(length:Int):TextInputBuilder;
	public function setMinLength(length:Int):TextInputBuilder;
	public function setPlaceholder(placeholder:String):TextInputBuilder;
	public function setRequired(required:Bool = true):TextInputBuilder;
	public function setStyle(style:TextInputStyle):TextInputBuilder;
	public function setValue(string:String):TextInputBuilder;
	public function toJSON():Dynamic;
}

