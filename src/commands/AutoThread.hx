package commands;

import discord_js.ThreadChannel;
import discord_js.TextChannel;
import js.Browser;
import systems.CommandBase;
import discord_js.GuildMember;
import discord_builder.BaseCommandInteraction;
import components.Command;
import Main;

class AutoThread extends CommandBase {
	@:fastFamily var users:{command:CommandForward, member:GuildMember};
	final news_role_id:String = "761714325227700225";
	final event_role_id:String = "1054432874473996408";
	final announcement_channel:String = #if block '597067735771381771' #else '286485321925918721' #end;
	var announcement:TextChannel;
	var checking:Bool = false;
	final news_feed:String = '1030188275341729882';
	var news_feed_channel:ThreadChannel;
	override function update(_:Float) {
		super.update(_);
		if (this.announcement == null && !this.checking) {
			this.checking = true;
			Main.client.channels.fetch(announcement_channel).then(function(channel) {
				this.announcement = cast channel;
				this.checking = false;
			}, function(err) {
				trace(err);
				Browser.console.dir(err);
			});
		}

		if (this.announcement != null && !this.checking) {
			checking = true;
			this.announcement.threads.fetch(news_feed).then(function(succ) {
				this.news_feed_channel = succ;
				checking = false;
			}, (err) -> trace(err));
		}

		if (this.announcement == null && news_feed == null) {
			return;
		}

		iterate(users, (entity) -> {
			switch(command) {
				case auto_thread:
					news_feed_channel.members.add(member.id).then(null, (err) -> trace(err));
					this.universe.deleteEntity(entity);
				default:
			}
		});
	}

	function run(command:Command, interaction:BaseCommandInteraction) {}

	function get_name():String {
		return 'autothread';
	}
}
