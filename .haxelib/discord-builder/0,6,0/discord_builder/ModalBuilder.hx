package discord_builder;

import haxe.Rest;
import discord_builder.JSONEncodable;

@:jsRequire('@discordjs/builders', 'ModalBuilder')
extern class ModalBuildera {
	public var components:Array<ActionRowBuilder<TextInputBuilder>>;
	public function new();

	public function addComponents(components:Array<ActionRowBuilder<TextInputBuilder>>):ModalBuilder;
	public function setComponents(components:Array<ActionRowBuilder<TextInputBuilder>>):ModalBuilder;

	public function setCustomId(custom_id:String):ModalBuilder;
	public function setTitle(title:String):ModalBuilder;
	public function toJSON():Dynamic;
}

//@:jsRequire('@discordjs/builders', 'ButtonBuilder')
class ModalBuilder {
	var title:String;
	var custom_id:String;
	/**
	 * @TODO - Broaden the type declaration 
	 */
	public var components:Array<APIActionRowComponent<APITextInputComponent>> = [];
	public function new() {}

	public function setCustomId(custom_id:String):ModalBuilder {
		this.custom_id = custom_id;
		return this;
	}

	public function setTitle(title:String):ModalBuilder {
		this.title = title;
		return this;
	}

	public function addComponents(components:Rest<APIActionRowComponent<APITextInputComponent>>) {
		for (c in components) {
			this.components.push(c);
		}
		return this;
	}
}
