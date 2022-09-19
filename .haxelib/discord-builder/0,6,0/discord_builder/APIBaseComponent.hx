package discord_builder;

class APIBaseComponent {
	var type:ComponentType;
}

enum abstract ComponentType(Int) {
    var ActionRow = 1;
    var Button = 2;
    var SelectMenu = 3;
    var TextInput = 4;
}