package externs;

import js.html.Blob;
import js.lib.Promise;

@:jsRequire('node-fetch')
extern class Fetch {
	@:selfCall
	public static function fetch<T:{}>(url:String, ?options:FetchOptions):Promise<PromiseResponse<T>>;
}

extern class PromiseResponse<Data:{}> {
	public var ok:Bool;
	public var url:String;
	public var size:Float;
	public var timeout:Float;

	public var status:Int;
	public var statusText:String;
	public var headers:Map<String, Dynamic>;
	public function blob():Promise<Blob>;
	public function text():Promise<String>;
	public function json<T>():Promise<T>;
}

typedef FetchOptions = {
	@:optional var body:Dynamic;
	@:optional var method:HttpMethod;
	@:optional var headers:{};
	@:optional var compress:Bool;
}

enum abstract HttpMethod(String) from String to String {
	var REQUEST = 'REQUEST';
	var POST = 'POST';
	var GET = 'GET';
	var HEAD = 'HEAD';
	var PUT = 'PUT';
	var DELETE = 'DELETE';
	var TRACE = 'TRACE';
	var OPTIONS = 'OPTIONS';
	var CONNECT = 'CONNECT';
	var PATCH = 'PATCH';
}