package discord_builder;

@:jsRequire('@discordjs/builders', 'SlashCommandStringOption')
extern class SlashCommandStringOption extends SlashCommandOptionBase<SlashCommandStringOption> {
	public function addChoice(name:String, choice:String):SlashCommandStringOption;
	public function new();
}