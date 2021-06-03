package node_html_parser.dist.nodes;

@:jsRequire("node-html-parser/dist/nodes/html") @valueModuleOnly extern class Html {
	/**
		Parses HTML and returns a root element
		Parse a chuck of HTML source.
	**/
	static function base_parse(data:String, ?options:{ @:optional var lowerCaseTagName : Bool; @:optional var comment : Bool; @:optional var blockTextElements : { }; }):Array<node_html_parser.HTMLElement>;
	/**
		Parses HTML and returns a root element
		Parse a chuck of HTML source.
	**/
	static function parse(data:String, ?options:{ @:optional var lowerCaseTagName : Bool; @:optional var comment : Bool; @:optional var blockTextElements : { }; }):node_html_parser.HTMLElement;
}