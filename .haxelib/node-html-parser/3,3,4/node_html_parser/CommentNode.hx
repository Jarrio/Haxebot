package node_html_parser;

@:jsRequire("node-html-parser", "CommentNode") extern class CommentNode extends Node {
	function new(rawText:String, parentNode:HTMLElement);
	function toString():Dynamic;
	static var prototype : CommentNode;
}