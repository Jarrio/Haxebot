package discord_js;

import discord_js.ThreadManager.BaseFetchOptions;

@:jsRequire("discord.js", "GuildManager") extern class GuildManager extends BaseManager<String, Guild, GuildResolvable> {
	function new(client:Client, ?iterable:Iterable<Dynamic>);
	public function create(name:String, ?options:GuildCreateOptions):js.lib.Promise<Guild>;
	public function fetch(id:String, ?options:FetchApplicationCommandOptions):js.lib.Promise<Guild>;
	static var prototype : GuildManager;
}

typedef FetchApplicationCommandOptions = {
	> BaseFetchOptions,
	@:optional var guildId:String;
}