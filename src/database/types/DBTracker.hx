package database.types;

import database.MyRecord;

class DBTracker extends MyRecord {
	@record public var id:Int;
	@record public var by:String;
	@record public var username:String;
	@record public var name:String;
	@record public var description:String;
	@record public var timestamp:Float;
	@record public var keywords:Array<String>;
	@record public var string_exclude:Array<String>;
	@record public var user_exclude:Array<String>;
	@record public var channel_exclude:Array<String>;

	public function new() {
		timestamp = Date.now().getTime();
	}
}

