package node_html_parser;

/**
	HTMLElement, which contains a set of children.
	
	Note: this is a minimalist implementation, no complete tree
	   structure provided (no parentNode, nextSibling,
	   previousSibling etc).
**/
@:jsRequire("node-html-parser", "HTMLElement") extern class HTMLElement extends Node {
	/**
		Creates an instance of HTMLElement.
	**/
	function new(tagName:String, keyAttrs:node_html_parser.dist.nodes.html.KeyAttributes, rawAttrs:String, parentNode:Null<HTMLElement>);
	private var rawAttrs : Dynamic;
	private var _attrs : Dynamic;
	private var _rawAttrs : Dynamic;
	var rawTagName : String;
	var id : String;
	var classList : DOMTokenList;
	/**
		Quote attribute values
	**/
	private var quoteAttribute : Dynamic;
	/**
		Remove current element
	**/
	function remove():Void;
	/**
		Remove Child element from childNodes array
	**/
	function removeChild(node:Node):Void;
	/**
		Exchanges given child with new child
	**/
	function exchangeChild(oldNode:Node, newNode:Node):Void;
	final tagName : String;
	final localName : String;
	/**
		Get structured Text (with '\n' etc.)
	**/
	final structuredText : String;
	var innerHTML : String;
	function set_content(content:ts.AnyOf3<String, Node, Array<Node>>, ?options:Options):Void;
	function replaceWith(nodes:haxe.extern.Rest<ts.AnyOf2<String, Node>>):Void;
	final outerHTML : String;
	/**
		Trim element from right (in block) after seeing pattern in a TextNode.
	**/
	function trimRight(pattern:js.lib.RegExp):HTMLElement;
	/**
		Get DOM structure
	**/
	final structure : String;
	/**
		Remove whitespaces in this sub tree.
	**/
	function removeWhitespace():HTMLElement;
	/**
		Query CSS selector to find matching nodes.
	**/
	function querySelectorAll(selector:String):Array<HTMLElement>;
	/**
		Query CSS Selector to find matching node.
	**/
	function querySelector(selector:String):HTMLElement;
	/**
		traverses the Element and its parents (heading toward the document root) until it finds a node that matches the provided selector string. Will return itself or the matching ancestor. If no such element exists, it returns null.
	**/
	function closest(selector:String):Node;
	/**
		Append a child node to childNodes
	**/
	function appendChild<T>(node:T):T;
	/**
		Get first child node
	**/
	final firstChild : Node;
	/**
		Get last child node
	**/
	final lastChild : Node;
	/**
		Get attributes
	**/
	final attrs : node_html_parser.dist.nodes.html.Attributes;
	final attributes : { };
	/**
		Get escaped (as-it) attributes
	**/
	final rawAttributes : node_html_parser.dist.nodes.html.RawAttributes;
	function removeAttribute(key:String):Void;
	function hasAttribute(key:String):Bool;
	/**
		Get an attribute
	**/
	function getAttribute(key:String):Null<String>;
	/**
		Set an attribute value to the HTMLElement
	**/
	function setAttribute(key:String, value:String):Void;
	/**
		Replace all the attributes of the HTMLElement by the provided attributes
	**/
	function setAttributes(attributes:node_html_parser.dist.nodes.html.Attributes):Void;
	function insertAdjacentHTML(where:node_html_parser.dist.nodes.html.InsertPosition, html:String):Void;
	final nextSibling : Node;
	final nextElementSibling : HTMLElement;
	final classNames : String;
	static var prototype : HTMLElement;
}