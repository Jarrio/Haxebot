package database;

import db.Record;

@:autoBuild(ocean.database.DBMacros.makeRecord())
abstract class MyRecord {
	var _record:Record = new Record();
	public var record(get, never):Record;
	abstract function get_record():Record;
}
