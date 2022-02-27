package shared;

import firebase.web.firestore.Timestamp;

typedef TThreadData = {
	var id:Int;
	var author:TAuthor;
	var title:Array<String>;
	var start_message_id:String;
	var thread_id:String;
	var added_by:String;
	var topic:String;
	var timestamp:Timestamp;
	var checked:Timestamp;
	var source_url:String;
	var session:TSession;
	var solved:Bool;
	var validated_by:String;
	var discussion:Array<TMessage>;
	var solution:TThreadSolution;
	var solution_requested:Timestamp;
}

typedef TThreadSolution = {
	var description:String;
	var user:TAuthor;
	var authorised_id:String;
	var timestamp:Timestamp;
}

typedef TAuthor = {
	var id:String;
	var name:String; 
	var icon_url:String;
}

@:forward
abstract TStoreContent(TThreadData) from TThreadData {
	public function new(value) {
		this = value;
	}

	public function getQuestion(state:HelpState) {
		for (item in this.session.questions) {
			if (item.state == state) {
				return item;
			}
		}
		return null;
	}
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