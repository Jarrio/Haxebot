package vm2;

/**
	Options for creating a NodeVM
**/
typedef NodeVMOptions = {
	/**
		`inherit` to enable console, `redirect` to redirect to events, `off` to disable console (default: `inherit`).
	**/
	@:optional
	var console : String;
	/**
		`true` or an object to enable `require` options (default: `false`).
	**/
	@:optional
	var require : ts.AnyOf2<Bool, VMRequire>;
	/**
		`true` to enable VMs nesting (default: `false`).
	**/
	@:optional
	var nesting : Bool;
	/**
		`commonjs` (default) to wrap script into CommonJS wrapper, `none` to retrieve value returned by the script.
	**/
	@:optional
	var wrapper : String;
	/**
		File extensions that the internal module resolver should accept.
	**/
	@:optional
	var sourceExtensions : Array<String>;
	/**
		Array of arguments passed to `process.argv`. 
		This object will not be copied and the script can change this object.
	**/
	@:optional
	var argv : Array<String>;
	/**
		Environment map passed to `process.env`. 
		This object will not be copied and the script can change this object.
	**/
	@:optional
	var env : Dynamic;
	/**
		`javascript` (default) or `coffeescript` or custom compiler function (which receives the code, and it's filepath).
		  The library expects you to have coffee-script pre-installed if the compiler is set to `coffeescript`.
	**/
	@:optional
	var compiler : ts.AnyOf2<CompilerFunction, String>;
	/**
		VM's global object.
	**/
	@:optional
	var sandbox : Dynamic;
	/**
		Script timeout in milliseconds.  Timeout is only effective on code you run through `run`.
		Timeout is NOT effective on any method returned by VM.
	**/
	@:optional
	var timeout : Float;
	/**
		If set to `false` any calls to eval or function constructors (`Function`, `GeneratorFunction`, etc) will throw an
		`EvalError` (default: `true`).
	**/
	@:optional
	var eval : Bool;
	/**
		If set to `false` any attempt to compile a WebAssembly module will throw a `WebAssembly.CompileError` (default: `true`).
	**/
	@:optional
	var wasm : Bool;
	/**
		If set to `true` any attempt to run code using async will throw a `VMError` (default: `false`).
	**/
	@:optional
	var fixAsync : Bool;
};