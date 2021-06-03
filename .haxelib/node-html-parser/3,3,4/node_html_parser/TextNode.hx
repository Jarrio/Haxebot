package node_html_parser;

/**
	TextNode to contain a text element in DOM tree.
**/
@:jsRequire("node-html-parser", "TextNode") extern class TextNode extends Node {
	function new(rawText:String, parentNode:HTMLElement);
	@:optional
	private var _trimmedText : Dynamic;
	/**
		Returns text with all whitespace trimmed except single leading/trailing non-breaking space
	**/
	final trimmedText : String;
	/**
		Detect if the node contains only white space.
	**/
	final isWhitespace : Bool;
	static var prototype : TextNode;
}