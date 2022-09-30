function foo() {
	var body = '';
	var answers = [];
	
	for (i => ans in answers) {
		if (ans == null) {
			continue;
		}
		body += switch (i) {
			case 0: '🇦';
			case 1: '🇧';
			case 2: '🇨';
			case 3: '🇩';
			case 4: '🇪';
			case 5: '🇫';
			case 6: '🇬';
			default: '';
		}
		body += ' - $ans\n';
	}
}
