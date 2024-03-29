package commands;

import js.Browser;
import systems.CommandBase;
import discord_js.GuildMember;
import discord_builder.BaseCommandInteraction;
import components.Command;
import Main;

class AutoRole extends CommandBase {
	@:fastFamily var users:{command:CommandForward, member:GuildMember};
	final news_role_id:String = "761714325227700225";
	final event_role_id:String = "1054432874473996408";

	override function update(_:Float) {
		super.update(_);
		iterate(users, (entity) -> {
			switch(command) {
				case add_event_role:
					member.roles.add(event_role_id).then(null, function(err) {
						trace(err);
						Browser.console.dir(err);
					});
					member.roles.add(news_role_id).then(null, function(err) {
						trace(err);
						Browser.console.dir(err);
					});
					this.universe.deleteEntity(entity);
				default:
			}
		});
	}

	function run(command:Command, interaction:BaseCommandInteraction) {}

	function get_name():String {
		return 'autorole';
	}
}
