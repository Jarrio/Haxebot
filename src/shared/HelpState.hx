package shared;

enum abstract HelpState(String) from String {
	var none;
	var question_type;
	var describe;
	var error_message;
	var provide_code;
	var expected_behaviour;
	var what_is_happening;
	var title;
	var finished;
}