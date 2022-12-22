package commands;

import systems.CommandBase;
import discord_js.GuildMember;
import discord_builder.BaseCommandInteraction;
import components.Command;
import Main;

class AutoRole extends CommandBase {
	@:fastFamily var users:{command:CommandForward, member:GuildMember};
	final news_role_id:String = "1053111948255953006";
	final event_role_id:String = "1054432874473996408";

	override function update(_:Float) {
		super.update(_);
		iterate(users, (entity) -> {
			member.roles.add(event_role_id).then(null, err);
			member.roles.add(news_role_id).then(null, err);
			this.universe.deleteEntity(entity);
		});
	}

	function run(command:Command, interaction:BaseCommandInteraction) {}

	function get_name():String {
		return 'autorole';
	}
}
