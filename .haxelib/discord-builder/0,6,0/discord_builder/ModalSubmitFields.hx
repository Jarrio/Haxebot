package discord_builder;

import discord_js.Collection;
import discord_builder.APIBaseComponent.ComponentType;

@:native
extern class ModalSubmitFields {
	public var components:Array<ActionRowModalData>;
	public var fields:Collection<String, ModalData>;
	public function getField(custom_id:String, ?type:ComponentType):ModalData;
	public function getTextInputValue(custom_id:String):String;
}

typedef ActionRowModalData = {
	var type:ComponentType;
	var components:Array<ModalData>;
}

typedef ModalData = {
	var value:String;
	var type:ComponentType;
	var customId:String;
}