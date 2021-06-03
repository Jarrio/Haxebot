@:jsRequire("node-html-parser") @valueModuleOnly extern class NodeHtmlParser {
	/**
		Parses HTML and returns a root element
		Parse a chuck of HTML source.
	**/
	static function parse(data:String, ?options:{ @:optional var lowerCaseTagName : Bool; @:optional var comment : Bool; @:optional var blockTextElements : { }; }):node_html_parser.HTMLElement;
	/**
		Parses HTML and returns a root element
		Parse a chuck of HTML source.
	**/
	@:native("default")
	static function default_(data:String, ?options:{ @:optional var lowerCaseTagName : Bool; @:optional var comment : Bool; @:optional var blockTextElements : { }; }):node_html_parser.HTMLElement;
	/**
		Parses HTML and returns a root element
		Parse a chuck of HTML source.
	**/
	static function valid(data:String, ?options:{ @:optional var lowerCaseTagName : Bool; @:optional var comment : Bool; @:optional var blockTextElements : { }; }):Bool;
}