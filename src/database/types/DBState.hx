package database.types;

import database.MyRecord;

class DBState extends MyRecord {
	@record public var id:Int;
	@record public var key:String;
	@record public var value:Dynamic;
	@record public var int:Null<Int>;

	public function new() {}
}