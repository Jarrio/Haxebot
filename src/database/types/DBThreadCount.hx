package database.types;

import database.MyRecord;

class DBThreadCount extends MyRecord {
	@record public var id:Int;
	@crecord public var name:String;
	@crecord public var threadid:String;
	@crecord public var count:Int;
	
	public function new(name:String, threadid:String, count:Int) {
		this.name = name.toLowerCase();
		this.threadid = threadid;
		this.count = count;
	}
}