package database.types;

import database.MyRecord;

class DBSnippet extends MyRecord {
	@crecord public var author_id:String;
	@crecord public var title:String;
	@crecord public var url:String;
	@crecord public var description:String;
	@record public var timestamp:Float;
	@record public var snippet_id:Int;

	public function new(author_id:String, title:String, description:String, url:String) {
		this.url = url;
		this.title = title;
		this.author_id = author_id;
		this.description = description;
		this.timestamp = Date.now().getTime();
	}
}