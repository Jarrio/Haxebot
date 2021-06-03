package node_html_parser.dist;

@:jsRequire("node-html-parser/dist/valid") @valueModuleOnly extern class Valid {
	/**
		Parses HTML and returns a root element
		Parse a chuck of HTML source.
	**/
	@:native("default")
	static function default_(data:String, ?options:{ @:optional var lowerCaseTagName : Bool; @:optional var comment : Bool; @:optional var blockTextElements : { }; }):Bool;
}