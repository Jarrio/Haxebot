package systems.commands;

import discord_js.User;
import systems.types.Room;
import discord_builder.BaseCommandInteraction;
import components.Command;

class Session extends CommandBase {
	var rooms:Map<String, Room> = [];
	override function onAdded() {
		
	}
	
	function run(command:Command, interaction:BaseCommandInteraction) {
		switch (command.content) {
			case Session(type, id, name, description):
				switch (type) {
					case SessionType.create:
						this.create(id, interaction, name, description);
					case SessionType.join:
						this.join(id, interaction);
					case SessionType.leave:
						this.leave(id, interaction);
					default:
				}
			default:
		}
	}

	function create(id:String, message:BaseCommandInteraction, name:String, description:String) {
		if (rooms.exists(id)) {
			message.reply('A room with that ID already exists.');
			return;
		}
		this.rooms.set(id, new Room(id, message.user, name, description));
		message.reply('User ${message.user.tag} created room(#$id) $name');
	}

	function join(id:String, message:BaseCommandInteraction) {
		var room = this.rooms.get(id);
		if (room != null) {
			if (room.memberExists(message.user)) {
				message.reply('You are already in this room.');
			} else {
				room.addMember(message.user);
				message.reply('You have joined room(#$id) ${room.name}');
			}
		}
	}
		
	function leave(id:String, message:BaseCommandInteraction) {
		var room = this.rooms.get(id);
		if (room.memberExists(message.user)) {
			room.removeMember(message.user);
			message.reply('You have left room(#$id) ${room.name}');
		}
	}

	function get_name():String {
		return 'session';
	}
}



enum abstract SessionType(String) to String {
	var create;
	var join;
	var leave;
}