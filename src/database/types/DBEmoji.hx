package database.types;

import database.MyRecord;

class DBEmoji extends MyRecord {
	@crecord public var author_id:String;
	@crecord public var author_tag:String;
	@crecord public var name:String;
	@crecord public var url:String;
	@crecord public var description:String = null;
	@record public var timestamp:Float;
	@record public var id:Int;

	public function new(author_id:String, author_tag:String, name:String, url:String,
			description:String = null) {
		this.author_id = author_id;
		this.author_tag = author_tag;
		this.url = url;
		this.name = name.toLowerCase();
		this.description = description;
		this.timestamp = Date.now().getTime();
	}
}