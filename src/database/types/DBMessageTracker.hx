package database.types;

import database.MyRecord;

class DBMessageTracker extends MyRecord {
	@record public var messageId:String;
	@record public var userId:String;
	@record public var content:String;
	@record public var timestamp:Float;
	
	public function new() {
	}
}