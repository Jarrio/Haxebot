package vm2;

/**
	You can increase performance by using pre-compiled scripts.
	The pre-compiled VMScript can be run later multiple times. It is important to note that the code is not bound
	to any VM (context); rather, it is bound before each run, just for that run.
**/
@:jsRequire("vm2", "VMScript") extern class VMScript {
	@:overload(function(code:String, ?options:{ @:optional var filename : String; @:optional var lineOffset : Float; @:optional var columnOffset : Float; @:optional var compiler : ts.AnyOf2<CompilerFunction, String>; }):VMScript { })
	function new(code:String, path:String, ?options:{ @:optional var lineOffset : Float; @:optional var columnOffset : Float; @:optional var compiler : ts.AnyOf2<CompilerFunction, String>; });
	final code : String;
	final filename : String;
	final lineOffset : Float;
	final columnOffset : Float;
	final compiler : ts.AnyOf2<CompilerFunction, String>;
	/**
		Wraps the code
	**/
	function wrap(prefix:String, postfix:String):VMScript;
	/**
		Compiles the code. If called multiple times, the code is only compiled once.
	**/
	function compile():VMScript;
	static var prototype : VMScript;
}