package node_html_parser.dist;

@:jsRequire("node-html-parser/dist/parse") @valueModuleOnly extern class Parse {
	/**
		Parses HTML and returns a root element
		Parse a chuck of HTML source.
	**/
	@:native("default")
	static function default_(data:String, ?options:{ @:optional var lowerCaseTagName : Bool; @:optional var comment : Bool; @:optional var blockTextElements : { }; }):node_html_parser.HTMLElement;
}