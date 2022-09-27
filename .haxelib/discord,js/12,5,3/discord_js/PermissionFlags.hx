package discord_js;

enum abstract PermissionFlags(Int) to Int {
	var CREATE_INSTANT_INVITE = 1 << 0;
	var KICK_MEMBERS = 1 << 1;
	var BAN_MEMBERS = 1 << 2;
	var ADMINISTRATOR = 1 << 3;
	var MANAGE_CHANNELS = 1 << 4;
	var MANAGE_GUILD = 1 << 5;
	var ADD_REACTIONS = 1 << 6;
	var VIEW_AUDIT_LOG = 1 << 7;
	var PRIORITY_SPEAKER = 1 << 8;
	var STREAM = 1 << 9;
	var VIEW_CHANNEL = 1 << 10;
	var SEND_MESSAGES = 1 << 11;
	var SEND_TTS_MESSAGES = 1 << 12;
	var MANAGE_MESSAGES = 1 << 13;
	var EMBED_LINKS = 1 << 14;
	var ATTACH_FILES = 1 << 15;
	var READ_MESSAGE_HISTORY = 1 << 16;
	var MENTION_EVERYONE = 1 << 17;
	var USE_EXTERNAL_EMOJIS = 1 << 18;
	var VIEW_GUILD_INSIGHTS = 1 << 19;
	var CONNECT = 1 << 20;
	var SPEAK = 1 << 21;
	var MUTE_MEMBERS = 1 << 22;
	var DEAFEN_MEMBERS = 1 << 23;
	var MOVE_MEMBERS = 1 << 24;
	var USE_VAD = 1 << 25;
	var CHANGE_NICKNAME = 1 << 26;
	var MANAGE_NICKNAMES = 1 << 27;
	var MANAGE_ROLES = 1 << 28;
	var MANAGE_WEBHOOKS = 1 << 29;
	var MANAGE_EMOJIS = 1 << 30;
}