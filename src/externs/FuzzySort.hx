package externs;

import js.html.Blob;
import js.lib.Promise;

@:jsRequire('fuzzysort')
extern class FuzzySort {
	public static function go<T>(search:String, targets:Dynamic, ?options:FuzzySortOptions):Array<FuzzyResults<T>>;
}

typedef FuzzySortOptions = {
	@:optional var threshold:Int;
	@:optional var limit:Int;
	@:optional var all:Bool;
	@:optional var key:String;
	@:optional var keys:Array<String>;
	@:optional var scoreFn:Dynamic;
}

typedef FuzzyResults<T> = {
	var obj:T;
	var target:String;
	var score:Int;
}