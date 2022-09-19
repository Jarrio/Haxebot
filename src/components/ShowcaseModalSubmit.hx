package components;

import discord_builder.BaseCommandInteraction;

class ShowcaseModalSubmit {
	public var title_or_link:String;
	public var description:String;
	public function new(title:String, ?description:String) {
		this.title_or_link = title;
		this.description = description;
	}
}
