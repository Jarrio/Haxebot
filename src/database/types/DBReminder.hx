package database.types;

import database.MyRecord;

class DBReminder extends MyRecord {
	@record public var id:Int;
	
	@crecord public var author_id:String;
	@crecord public var content:String;
	@crecord public var duration:Float;
	@crecord public var channel_id:String;
	@crecord public var is_thread:Int = 0;
	
	@record public var sent:Int = 0;
	@record public var personal:Int = 0;
	@record public var thread_reply:Int = 0;
	@record public var timestamp:Float;
	
	public function new(author_id:String, content:String, duration:Float, channel_id:String, is_thread:Int) {
		this.author_id = author_id;
		this.content = content;
		this.duration = duration;
		this.channel_id = channel_id;
		this.is_thread = is_thread;
		this.timestamp = Date.now().getTime();
	}
}