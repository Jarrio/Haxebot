package discord_builder;

@:jsRequire('@discordjs/builders', 'ComponentBuilder')
extern class ComponentBuilder implements JSONEncodable {
	public var data:Dynamic;
	public function toJSON():String;
}