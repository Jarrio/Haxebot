package shared;

typedef TSession = {
	var topic:String;
	var timestamp:Float;
	var author_id:String;
	var questions:Array<TQuestionResponse>;
}

typedef TQuestionResponse = {
	var qid:Int;
	var state:HelpState;
	var question:String;
	var answer:String;
}