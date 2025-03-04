package database;

import db.RecordSet;
import db.Record;
import Query.QueryExpr;
import db.ColumnDefinition;

typedef TRecord = {
	@:optional var record(get, never):Record;
}

enum DBEvents {
	Search(table:String, field:String, value:String, callback:Callback->Void);
	SearchBy(table:String, field:String, value:String, by_column:String, by_value:Any, callback:Callback->Void);
	Insert(table:String, value:TRecord, callback:Callback->Void);
	Update(table:String, value:TRecord, query:QueryExpr, callback:Callback->Void);
	InsertDontDuplicateLastRow(table:String, field:String, query:QueryExpr, data:TRecord, callback:Callback->Void);
	SearchAndUpdate(table:String, key:String, query:QueryExpr, value:TRecord, callback:Callback->Void);
	CreateTable(name:String, columns:Array<ColumnDefinition>);
	Page(table:String, page:Int, results:Int, query:QueryExpr, callback:Callback->Void);
	GetRecord(table:String, query:QueryExpr, callback:Callback->Void);
	GetRecords(table:String, query:QueryExpr, callback:Callback->Void);
	GetAllRecords(table:String, callback:Callback->Void);
	DeleteByValue(table:String, column:String, value:Any, callback:Callback->Void);
	DeleteRecord(table:String, value:Record, callback:Callback -> Void);
	Watch(table:String, condition:QueryExpr, callback:Callback->Void, ?rate:Float);
	Poll(event:DBEvents, ms:Int);
	GetLastRecord(table:String, where:String, value:String, column:String, callback:Callback->Void);
	GetRecentRecords(table:String, where:String, value:String, column:String, amount:Int, callback:Callback->Void);
}

enum Callback {
	Record(data:Record);
	Records(data:RecordSet);
	WatchResult(result:Array<Record>);
	Success(message:String, ?data:Any);
	Error(message:String, ?data:Any);
}

typedef TWatchCondition = {
	var column:String;
	var op:String;
	var value:Any;
}
