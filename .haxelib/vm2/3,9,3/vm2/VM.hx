package vm2;

/**
	VM is a simple sandbox, without `require` feature, to synchronously run an untrusted code.
	Only JavaScript built-in objects + Buffer are available. Scheduling functions
	(`setInterval`, `setTimeout` and `setImmediate`) are not available by default.
**/
@:jsRequire("vm2", "VM") extern class VM {
	function new(?options:VMOptions);
	/**
		Direct access to the global sandbox object
	**/
	final sandbox : Dynamic;
	/**
		Timeout to use for the run methods
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
	function setGlobals(values:Dynamic):VM;
	/**
		Make a object visible as a global with a specific name
	**/
	function setGlobal(name:String, value:Dynamic):VM;
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
	static var prototype : VM;
}