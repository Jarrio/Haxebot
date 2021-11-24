package systems.types;

import discord_js.User;

class Room {
	public var id:String;
	public var name:String;
	public var description:String;
	public var members:Array<User>;
	public var script:String;
	public var owner(get, never):User;
	public function new(id:String, user:User, name:String, description:String, script:String = '') {
		this.id = id;
		this.name = name;
		this.description = description;
		this.members = [user];
	}

	public function modScript(script:String) {
		this.script = script;
	}

	public function addMember(user:User) {
		this.members.push(user);
	}

	public function memberExists(user:User) {
		for (_user in this.members) {
			if (_user.id == user.id) {
				return true;
			}
		}
		return false;
	}

	public function removeMember(user:User) {
		trace(this.members.length);
		this.members.remove(user);
		trace(this.members.length);
		return false;
	}

	private function get_owner() {
		return this.members[0];
	}
}