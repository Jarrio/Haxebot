package discord_builder;

class APITextInputComponent extends APIBaseComponent {	
	var style:TextInputStyle;
	var custom_id:String;
	var label:String;
	var placeholder:String;
	var value:String;
	var min_length:Int;
	var max_length:Int;
	var required:Bool;

	public function new () {
		this.type = TextInput;
	}
	public function setStyle(style:TextInputStyle):APITextInputComponent {
		this.style = style;
		return this;
	}
	public function setCustomId(custom_id:String):APITextInputComponent {
		this.custom_id = custom_id;
		return this;
	}
	public function setLabel(label:String):APITextInputComponent {
		this.label = label;
		return this;
	}
	public function setPlaceholder(placeholder:String):APITextInputComponent {
		this.placeholder = placeholder;
		return this;
	}
	public function setValue(value:String):APITextInputComponent {
		this.value = value;
		return this;
	}
	public function setMinLength(min_length:Int):APITextInputComponent {
		this.min_length = min_length;
		return this;
	}

	public function setMaxLength(max_length:Int):APITextInputComponent {
		this.max_length = max_length;
		return this;
	}

	public function setRequired(required:Bool = true):APITextInputComponent {
		this.required = required;
		return this;
	}
}

@:enum abstract TextInputStyle(Int) {
	var Short = 1;
	var Paragraph = 2;
}