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

enum abstract QuestionType(String) to String {
	var general = 'General';
	var error_message = 'Error Message';
	var unexpected_behaviour = 'Unexpected Behaviour';

	@:from static function fromString(i:String) {
		return switch (i) {
			case "1": general;
			case "2": error_message;
			case "3": unexpected_behaviour;
			default: general;
		};
	}
}