package discord_builder;

import discord_api_types.ButtonStyle;
import discord_builder.APIBaseComponent.ComponentType;
import discord_builder.JSONEncodable;

//@:jsRequire('@discordjs/builders', 'ButtonBuilder')
class ButtonBuilder extends APIButtonComponentBase {
	var label:String;
	var custom_id:String;
	var style:ButtonStyle;
	var emoji:String;
	var url:String;
	var disabled:Bool;

	public function setDisabled(disabled:Bool = true):ButtonBuilder {
		this.disabled = disabled;
		return this;
	}

	public function setCustomId(custom_id:String):ButtonBuilder {
		this.custom_id = custom_id;
		return this;
	}
	public function setEmoji(emoji:String):ButtonBuilder {
		this.emoji = emoji;
		return this;
	}
	public function setLabel(label:String):ButtonBuilder {
		this.label = label;
		return this;
	}
	public function setStyle(style:ButtonStyle):ButtonBuilder {
		this.style = style;
		return this;
	}

	public function setUrl(url:String):ButtonBuilder {
		this.url = url;
		return this;
	}
}



@:enum abstract ButtonStyle(Int) {
	//blurple
	var Primary = 1;
	//grey
	var Secondary = 2;
	//green
	var Success = 3;
	//red
	var Danger = 4;
	//grey
	var Link = 5;
}