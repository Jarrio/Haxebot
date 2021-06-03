package node_html_parser;

/**
	Node Class as base class for TextNode and HTMLElement.
**/
@:jsRequire("node-html-parser", "Node") extern class Node {
	function new(?parentNode:HTMLElement);
	var parentNode : HTMLElement;
	var nodeType : NodeType;
	var childNodes : Array<Node>;
	var text : String;
	var rawText : String;
	function toString():String;
	final innerText : String;
	var textContent : String;
	static var prototype : Node;
}