import ecs.Universe;
import haxe.Timer;
import systems.Messages;

class Main {
	public static var universe:Universe;
	public static function start() {
		universe = new Universe(1000);

		universe.setSystems(
			Messages
		);
		
		new Timer(100).run = function() {
			universe.update(1);
		}
	}

	static function main() {
		start();
	}
}
