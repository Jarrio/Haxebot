package discord_builder;

@:jsRequire('@discordjs/builders', 'JSONEncodable')
extern interface JSONEncodable {
	public function toJSON():Dynamic;
}