package discord_builder;

import haxe.Rest;

class APIActionRowComponent<T> extends APIBaseComponent {

	var components:Array<T> = [];
	public function new() {
		this.type = ActionRow;
	}

	public function addComponents(components:Rest<T>) {
		for (c in components) {
			this.components.push(c);
		}
		return this;
	}
}
