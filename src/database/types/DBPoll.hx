package database.types;

import database.MyRecord;

class DBPoll extends MyRecord {
	@record public var id:Int;
	@record public var active:Int;
	@crecord public var author:String;
	@crecord public var channel:String;
	@crecord public var message_id:String;
	@crecord public var question:String;
	@crecord public var duration:Float;
	@record public var timestamp:Float;
	@record public var votes:Int;

	@record public var results:Map<String, Int>;
	@record public var answers:Map<String, String>;

	public function new(author:String, channel:String, message_id:String, question:String, duration:Float) {
		this.author = author;
		this.channel = channel;
		this.message_id = message_id;
		this.question = question;
		this.duration = duration;
		active = 1;
		votes = 1;
		this.timestamp = Date.now().getTime();
	}

	public var is_active(get, never):Bool;
	inline function get_is_active() {
		return active == 1;
	}
}