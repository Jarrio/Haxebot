package components;

enum abstract TextCommand(String) to String {
	var mention = '!mention';

	public static function list() {
		return [mention];
	}
}