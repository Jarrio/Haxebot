package vm2;

/**
	Require options for a VM
**/
typedef VMRequire = {
	/**
		Array of allowed builtin modules, accepts ["*"] for all (default: none)
	**/
	@:optional
	var builtin : Array<String>;
	@:optional
	var context : String;
	/**
		`true`, an array of allowed external modules or an object with external options (default: `false`)
	**/
	@:optional
	var external : ts.AnyOf3<Bool, Array<String>, {
		var modules : Array<String>;
		var transitive : Bool;
	}>;
	/**
		Array of modules to be loaded into NodeVM on start.
	**/
	@:optional
	@:native("import")
	var import_ : Array<String>;
	/**
		Restricted path(s) where local modules can be required (default: every path).
	**/
	@:optional
	var root : ts.AnyOf2<String, Array<String>>;
	/**
		Collection of mock modules (both external or builtin).
	**/
	@:optional
	var mock : Dynamic;
	@:optional
	dynamic function resolve(moduleName:String, parentDirname:String):String;
};