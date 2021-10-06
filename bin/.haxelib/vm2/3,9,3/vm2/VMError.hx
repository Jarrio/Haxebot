package vm2;

/**
	Custom Error class
**/
@:jsRequire("vm2", "VMError") extern class VMError extends js.lib.Error {
	function new();
	static var prototype : VMError;
}