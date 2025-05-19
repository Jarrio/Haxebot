package commands.types;

enum abstract Timeframe(Float) to Float {
	public function new(value:Float) {
		this = value;
	}

	var none = -1;
	var one_min = 60000;
	var three_mins = 180000;
	var five_mins = 300000;
	var fifteen_mins = 900000;
	var thirty_mins = 1800000;
	var one_hour = 3600000;
	var two_hours = 7200000;
	var four_hours = 14400000;
	var six_hours = 21600000;
	var eight_hours = 28800000;
	var twelve_hours = 43200000;
	var one_day = 86400000;
	var three_days = 259200000;
	var one_week = 604800000;
	var one_month = 2419200000;

	@:op(A < B) static function lt(a:Timeframe, b:Timeframe):Bool;

	@:op(A <= B) static function ltg(a:Timeframe, b:Timeframe):Bool;

	public function toString():String {
		return switch (this) {
			case this if (this <= cast one_min): '${this / 1000} seconds';
			case this if (this <= cast one_hour): '${this / cast one_min} minutes';
			case this if (this <= cast one_day): '${this / cast one_hour} hours';
			case this if (this <= cast one_week): '${this / cast one_day} days';
			case this if (cast this <= 2419200000): '${this / 2419200000} weeks';
			default: {
					'${this / 1000}';
				}
		}
	}

	public function toShort():String {
		return switch (this) {
			case this if (this < cast one_min): '${this / 1000} seconds';
			case this if (this < cast one_hour): '${Std.int(this / cast one_min)}m';
			case this if (this < cast one_day): '${Std.int(this / cast one_hour)}hr';
			case this if (this < cast one_week): '${Std.int(this / cast one_day)}d';
			case this if (cast this <= 2419200000): '${this}w';
			default: {
					'${this}';
				}
		}
	}

	@:from public static function fromString(data:String) {
		return switch (data) {
			case "1m": one_min;
			case "3m": three_mins;
			case "5m": five_mins;
			case "15m": fifteen_mins;
			case "30m": thirty_mins;
			case "1hr": one_hour;
			case "4hr": four_hours;
			case "1d": one_day;
			case "1w": one_week;
			default: new Timeframe(Std.parseInt(data));
		};
	}
}