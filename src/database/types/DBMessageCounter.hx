package database.types;

import database.MyRecord;

class DBMessageCounter extends MyRecord {
	@record public var userId:String;
	@record public var count:Int;
	@record public var updatedTime:Float;
	@record public var startedTime:Float;
	
	public function new() {}
} 