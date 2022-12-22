class Main {
	static function main() {
		var loop:Bool = true;
		function spam() {
			for (i in 0...999999) {
				trace(Std.random(99));
				trace(Std.random(99));
				trace(Std.random(99));
			}
		}
		final ___owneBL = Date.now().getTime();
		while (loop) {
			if (Date.now().getTime() - ___owneBL > 5000) {
				break;
			}
			for (i in 0...1000) {
				spam();
			}
		}
	}
}
