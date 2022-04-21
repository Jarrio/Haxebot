package shared;

import firebase.web.firestore.Timestamp;

typedef TThreadData = {
	var id:Int;
	@:optional var uid:String;
	var author:TAuthor;
	var title:String;
	var start_message_id:String;
	var thread_id:String;
	var topic:String;
	var timestamp:Timestamp;
	var source_url:String;
	var session:TSession;
	var solved:Bool;
	var discussion:Array<TMessage>;
	var solution:TThreadSolution;
	var solution_requested:Timestamp;
	var valid:Bool;
	var posted_discord:Bool;
	var validated_by:String;
	var validated_timestamp:Timestamp;
}

typedef TThreadSolution = {
	var attempt:Int;
	var description:String;
	var user:TAuthor;
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

	public var solution_attempt(get, never):Int;
	function get_solution_attempt() {
		var count = 0;
		if (this.solution != null && this.solution.attempt != null) {
			count = this.solution.attempt;
		}
		return count;
	}

	public var is_valid(get, never):Bool;
	function get_is_valid() {
	 	if (this.valid == null || this.valid == false) {
	 		return false;
	 	}
		return true;
	}

	public var validate_timestamp(get, never):Date;
	private function get_validate_timestamp() {
		if (this.validated_timestamp == null) {
			return null;
		}
		return this.validated_timestamp.toDate();
	}

	public var is_validated(get, never):Bool;
	private function get_is_validated() {
		return this.valid != null && this.validated_by != null && this.validated_by.length > 0 && this.validated_timestamp != null;
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