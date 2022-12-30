package commands.types;

enum abstract ActionList(String) to String {
	var get;
	var set;
	var edit;
	var list;
	var delete;
}