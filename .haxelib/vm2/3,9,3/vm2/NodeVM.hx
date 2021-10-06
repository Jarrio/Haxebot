package vm2;

import js.node.events.EventEmitter;

/**
	A VM with behavior more similar to running inside Node.
**/
@:jsRequire("vm2", "NodeVM") extern class NodeVM extends EventEmitter<Dynamic> {
	function new(?options:NodeVMOptions);
	/**
		Require a module in VM and return it's exports.
	**/
	function require(module:String):Dynamic;
	/**
		Direct access to the global sandbox object
	**/
	final sandbox : Dynamic;
	/**
		Only here because of implements VM. Does nothing.
	**/
	@:optional
	var timeout : Float;
	/**
		Runs the code
		
		Runs the VMScript object
	**/
	@:overload(function(script:VMScript):Dynamic { })
	function run(js:String, ?path:String):Dynamic;
	/**
		Runs the code in the specific file
	**/
	function runFile(filename:String):Dynamic;
	/**
		Loads all the values into the global object with the same names
	**/
	function setGlobals(values:Dynamic):NodeVM;
	/**
		Make a object visible as a global with a specific name
	**/
	function setGlobal(name:String, value:Dynamic):NodeVM;
	/**
		Get the global object with the specific name
	**/
	function getGlobal(name:String):Dynamic;
	/**
		Freezes the object inside VM making it read-only. Not available for primitive values.
	**/
	function freeze(object:Dynamic, ?name:String):Dynamic;
	/**
		Protects the object inside VM making impossible to set functions as it's properties. Not available for primitive values
	**/
	function protect(object:Dynamic, ?name:String):Dynamic;
	static var prototype : NodeVM;
	/**
		Create NodeVM and run code inside it.
	**/
	static function code(script:String, ?filename:String, ?options:NodeVMOptions):Dynamic;
	/**
		Create NodeVM and run script from file inside it.
	**/
	static function file(filename:String, ?options:NodeVMOptions):Dynamic;
}