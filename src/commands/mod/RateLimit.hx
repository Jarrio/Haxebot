package commands.mod;

import discord_js.GuildMember;
import util.Duration;
import database.DBEvents;
import discord_js.MessageEmbed;
import discord_js.User;
import externs.FuzzySort;
import js.Browser;
import components.Command;
import discord_builder.BaseCommandInteraction;
import systems.CommandBase;
import Main.CommandForward;
import discord_js.Message;
import discord_js.TextChannel;
import database.types.DBRateLimit;
import Query.query;

private typedef TTracker = {
	var counter:Int;
	var member:GuildMember;
	var last_message:Float;
}

class RateLimit extends CommandBase {
	var tracking:Map<String, TTracker> = [];
	var limits:Map<String, DBRateLimit> = [];
	var records:Bool = false;

	@:fastFamily var messages:{command:CommandForward, message:Message};

	final silence_role = #if block "1257723900813639801" #else "503359600712482827" #end;

	override function onEnabled() {
		var e = DBEvents.GetAllRecords('rate_limit', function(response) {
			switch (response) {
				case Records(data):
					for (r in data) {
						var obj = DBRateLimit.fromRecord(r);
						limits.set(obj.user_id, obj);
						var tracker = tracking.get(obj.user_id);
						if (!tracking.exists(obj.user_id)) {
							setTracker(obj);
						}
					}
					records = true;
				default:
					trace(response);
			}
		});
		universe.setComponents(universe.createEntity(), e);
	}

	override function update(_:Float) {
		super.update(_);
		if (!records) {
			return;
		}
		iterate(messages, (entity) -> {
			switch (command) {
				case rate_limit:
					for (limit in limits) {
						if (message.author.id != limit.user_id
							|| limit.silenced > -1
							|| message.channel.asType0.id == "663246792426782730") {
							continue;
						}

						var tracker = tracking.get(limit.user_id);
						if (tracker.counter >= limit.count) {
							// silence
							tracker.last_message = message.createdTimestamp;
							tracker.member.roles.add(silence_role).then(function(resp) {
								 //trace('${Date.now()} user ${limit.user_tag} silenced');
								limit.silenced = tracker.last_message;
								updateLimit(limit);
							}, (err) -> trace(err));
						} else {
							tracker.counter++;
						}
					}
					universe.deleteEntity(entity);
				default:
			}
		});

		for (limit in limits) {
			if (limit.silenced == -1 || !tracking.exists(limit.user_id)) {
				continue;
			}
			var now = Date.now().getTime();
			var dur:Float = Duration.fromString(limit.time);
			var diff = limit.silenced + dur;

			if (now > diff) {
				
				var tracker = tracking.get(limit.user_id);
				tracker.member.roles.remove(silence_role).then(function(response) {
					limit.silenced = -1;
					tracker.counter = 1;
					updateLimit(limit);
					 //trace('${Date.now()} user ${limit.user_tag} unsilenced');
				}, (err) -> trace(err));
			}
		}
	}

	function updateLimit(limit:DBRateLimit) {
		var e = DBEvents.Update('rate_limit', limit.record, query($user_id == limit.user_id),
			function(response) {
				switch (response) {
					case Success(message, data):
					default:
						trace(response);
				}
			});
		EcsTools.set(e);
	}

	function setTracker(obj:DBRateLimit) {
		var tracker = tracking.get(obj.user_id);
		if (!tracking.exists(obj.user_id)) {
			Main.client.guilds.cache.get(Main.guild_id)
				.members.fetch(obj.user_id)
				.then(function(member) {
					tracker = {
						member: member,
						counter: 1,
						last_message: -1
					}
					trace('Added ${obj.user_tag} to list');
					tracking.set(obj.user_id, tracker);
				}, (err) -> trace(err));
		}
	}

	function run(command:Command, interaction:BaseCommandInteraction) {
		switch (command.content) {
			case RatelimitCreate(user, counter, time, reason):
				var modid = interaction.user.id;
				var modtag = interaction.user.tag;
				var obj = new DBRateLimit(user.id, user.tag, modid, modtag, counter, time);
				obj.reason = reason;
				setTracker(obj);
				
				var e = DBEvents.SearchAndUpdate('rate_limit', 'user_id', query($user_id == obj.user_id), obj.record, function(response) {
					switch (response) {
						case Success(message, data):
							this.limits.set(user.id, DBRateLimit.fromRecord(data));
							trace('Inserted ${user.tag} rate limit');
							interaction.reply({
								content: '<@${user.id}> has been rate limited'
							}).then(null, (err) -> trace(err));
						default:
							interaction.reply({
								ephemeral: true,
								content: "An error occured, check logs"
							}).then(null, (err) -> trace(err));
							trace(response);
					}
				});
				EcsTools.set(e);
			case RatelimitDelete(user):
				var obj = limits.get(user.id);
				if (limits.exists(user.id)) {
					var e = DBEvents.DeleteByValue('rate_limit', 'user_id', obj.user_id, function(resp) {
						switch (resp) {
							case Success(message, data):
								tracking.remove(user.id);
								limits.remove(user.id);
								trace('removed slow mode from ${user.tag}');
								interaction.reply({
									content: 'Slow mode has been removed for <@${user.id}>'
								}).then(null, (err) -> trace(err));
							default:
								interaction.reply({
									ephemeral: true,
									content: "An error occured, check logs"
								}).then(null, (err) -> trace(err));
								trace(resp);
						}
					});
					EcsTools.set(e);
				}

			default:
		}
	}

	function get_name():String {
		return 'ratelimit';
	}
}
