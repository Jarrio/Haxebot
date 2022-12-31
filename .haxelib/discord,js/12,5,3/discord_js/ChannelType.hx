package discord_js;

enum abstract ChannelType(Int) {
	var GUILD_TEXT = 0;
	var DM = 1;
	var GUILD_VOICE = 2;
	var GROUP_DM = 3;
	var GUILD_CATEGORY = 4;
	var GUILD_ANNOUNCEMENT = 5;
	var ANNOUNCEMENT_THREAD = 10;
	var PUBLIC_THREAD = 11;
	var PRIVATE_THREAD = 12;
	var GUILD_STAGE_VOICE = 13;
	var GUILD_DIRECTORY = 14;
	var GUILD_FORUM = 15;
}