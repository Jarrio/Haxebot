package database.types;

import database.MyRecord;

class DBState extends MyRecord {
	@record public var id:Int;
	@record public var key:String;
	@record public var value:Dynamic;

	public function new() {}
}