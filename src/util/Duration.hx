package util;

enum abstract Duration(Float) to Float {
	var minute = 60000;
	var hour = 3600000;
	var day = 86400000;
	var week = 604800000;
	var month = 2419200000;

	public function new(value) {
		this = value;
	}

	@:op(A > B) static function gt(a:Duration, b:Duration):Bool;

	@:op(A >= B) static function gtequalto(a:Duration, b:Duration):Bool;

	@:op(A < B) static function lt(a:Duration, b:Duration):Bool;

	@:op(A <= B) static function ltequalto(a:Duration, b:Duration):Bool;

	@:op(A == B) static function equality(a:Duration, b:Duration):Bool;

	@:op(A > B) static function gtfloat(a:Float, b:Duration):Bool;

	@:op(A >= B) static function gtequaltofloat(a:Float, b:Duration):Bool;

	@:op(A < B) static function ltfloat(a:Float, b:Duration):Bool;

	@:op(A <= B) static function ltequaltofloat(a:Float, b:Duration):Bool;

	@:op(A == B) static function equalityFloat(a:Float, b:Duration):Bool;

	@:op(A + B) static function addition(a:Duration, b:Duration):Duration;

	@:from public static function fromString(input:String):Duration {
		var time = 0.;

		var min_regex = ~/([0-9]+)[ ]?(m|min|mins)\b/gi;
		if (min_regex.match(input)) {
			var num = Std.parseFloat(min_regex.matched(1));
			time = num * 60000;
		}

		var hour_regex = ~/([0-9]+)[ ]?(h|hr|hrs|hours)\b/gi;
		if (hour_regex.match(input)) {
			var num = Std.parseFloat(hour_regex.matched(1));
			time = num * 3600000;
		}

		var day_regex = ~/([0-9]+)[ ]?(d|day|days)\b/gi;
		if (day_regex.match(input)) {
			var num = Std.parseFloat(day_regex.matched(1));
			time = num * 86400000;
		}

		var week_regex = ~/([0-9]+)[ ]?(w|wk|wks|week|weeks)\b/gi;
		if (week_regex.match(input)) {
			var num = Std.parseFloat(week_regex.matched(1));
			time = num * 604800000;
		}

		var month_regex = ~/([0-9]+)[ ]?(mo|mos|mths|month|months)\b/gi;
		if (month_regex.match(input)) {
			var num = Std.parseFloat(month_regex.matched(1));
			time = num * 2419200000;
		}

		return new Duration(time);
	}
}