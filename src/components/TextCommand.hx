package components;

enum abstract TextCommand(String) to String {
	var mention = '!mention';
	var run = '!run';

	public static function list() {
		return [mention, run];
	}
}