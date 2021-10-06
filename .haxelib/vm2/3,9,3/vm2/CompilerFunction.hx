package vm2;

/**
	A custom compiler function for all of the JS that comes
	into the VM
**/
typedef CompilerFunction = (code:String, filename:String) -> String;