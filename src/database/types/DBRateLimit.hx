package database.types;

import database.MyRecord;

class DBRateLimit extends MyRecord {
	@crecord public var user_id:String;
	@crecord public var user_tag:String;
	@crecord public var mod_id:String;
	@crecord public var mod_tag:String;
	@crecord public var count:Int;
	@crecord public var time:String;
	@record public var reason:String;
	@record public var silenced:Float;
	@record public var created:Float;
	@record public var id:Int;

	public function new(user_id:String, user_tag:String, mod_id:String, mod_tag:String, count:Int,
			time:String) {
		this.user_id = user_id;
		this.user_tag = user_tag;
		this.mod_id = mod_id;
		this.mod_tag = mod_tag;
		this.count = count;
		this.time = time;
		this.created = Date.now().getTime();
	}
}