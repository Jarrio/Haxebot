package database.types;

import database.MyRecord;

class DBMessageCounter extends MyRecord {
	@record public var userId:String;
	@record public var count:Int;
	
	public function new() {
	}
} 