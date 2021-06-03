package node_html_parser;

@:jsRequire("node-html-parser", "NodeType") @:enum extern abstract NodeType(Int) from Int to Int {
	var ELEMENT_NODE;
	var TEXT_NODE;
	var COMMENT_NODE;
}