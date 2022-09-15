package discord_builder;

import haxe.Rest;

@:jsRequire('@discordjs/builders', 'SlashCommandStringOption')
extern class SlashCommandStringOption extends SlashCommandOptionBase<SlashCommandStringOption> {
	public function new();
	public function addChoices(choices:Rest<{name:String, value:String}>):SlashCommandStringOption;
}