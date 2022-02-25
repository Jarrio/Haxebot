package shared;

import firebase.web.firestore.Timestamp;

typedef TStoreContent = {
	var id:Int;
	var title:Array<String>;
	var start_message_id:String;
	var thread_id:String;
	var added_by:String;
	var topic:String;
	var timestamp:Timestamp;
	var checked:Timestamp;
	var session:TSession;
	var description:String;
	var source_url:String;
	var solved:Bool;
	var validated_by:String;
	var discussion:Array<TMessage>;
}

typedef TMessage = {
	var content:String;
	var user:{
		var id:String;
		var username:String;
		var avartarURL:String;
	}
	var posted:Timestamp;
}