package vm2;

/**
	Options for creating a VM
**/
typedef VMOptions = {
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