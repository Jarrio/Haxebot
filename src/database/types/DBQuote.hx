package database.types;

import database.MyRecord;

class DBQuote extends MyRecord {
	@crecord public var author_id:String;
	@crecord public var author_tag:String;
	@crecord public var title:String;
	@crecord public var description:String;
	@record public var timestamp:Float;
	@record public var id:Int;

	public function new(author_id:String, author_tag:String, title:String, description:String) {
		this.author_id = author_id;
		this.author_tag = author_tag;
		this.title = title;
		this.description = description;
		this.timestamp = Date.now().getTime();
	}
}