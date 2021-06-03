package node_html_parser;

@jsInaccessible extern class DOMTokenList {
	function new(?valuesInit:Array<String>, ?afterUpdate:(t:DOMTokenList) -> Void);
	private var _set : Dynamic;
	private var _afterUpdate : Dynamic;
	private var _validate : Dynamic;
	function add(c:String):Void;
	function replace(c1:String, c2:String):Void;
	function remove(c:String):Void;
	function toggle(c:String):Void;
	function contains(c:String):Bool;
	final length : Float;
	function values():js.lib.IterableIterator<String>;
	final value : Array<String>;
	function toString():String;
	static var prototype : DOMTokenList;
}