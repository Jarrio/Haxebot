package commands;

import discord_js.GuildMember;
import discord_js.User;
import discord_js.Collection;
import discord_js.MessageReaction;
import discord_js.Message;
import discord_js.VoiceState;
import discord_js.TextChannel;
import commands.types.Duration;
import discord_js.VoiceChannel;
import discord_js.GuildScheduledEvent;
import discord_js.GuildScheduleEventManager;
import discord_js.Guild;
import discord_builder.BaseCommandInteraction;
import components.Command;
import systems.CommandDbBase;
import Main.CommandForward;

typedef RoundupEndEvent = {
	var member:GuildMember;
}

class RoundupRoundup extends CommandDbBase {
	var guild(get, never):Guild;
	var voice_text:TextChannel;
	var voice_channel:VoiceChannel;
	var voice_last_updated:Float;
	var schedule(get, never):GuildScheduleEventManager;
	var event:GuildScheduledEvent;
	var waiting:Bool = false;
	var host_active:Bool = false;
	var started(get, never):Bool;
	final host = #if block "151104106973495296" #else "98998236320133120" #end;
	final voice_channel_id = #if block "416069724657418244" #else "198219256687493120" #end;
	final voice_text_id = #if block "597067735771381771" #else "220626116627529728" #end;
	final event_role = #if block "<@&1114582456381747232>" #else "" #end;

	var check_event_end:Bool = false;
	@:fastFamily var end_event:{data:RoundupEndEvent};
	@:fastFamily var voice_update_events:{forward:CommandForward, old:VoiceState, updated:VoiceState};

	override function update(_:Float) {
		super.update(_);

		iterate(voice_update_events, (entity) -> {
			switch (forward) {
				case roundup_member_update:
					var member = updated.member;
					if (member.id == host && updated.channel == null) {
						member.send(
							'Hi <@$host>, it looks like you left the voice channel. Should I end the event?'
						)
							.then(function(message) {
								this.addCollector(message, member);
								message.react("✅").then(null, (err) -> trace(err));
								message.react("❎").then(null, (err) -> trace(err));
							}, (err) -> trace(err));
					}
					universe.deleteEntity(entity);
				default:
			}
		});

		iterate(end_event, (entity) -> {
			event.setStatus(Completed, "Host ended the event.").then((_) -> {
				data.member.send('Event ended, thank you for hosting!').then(function(_) {
					event = null;
					host_active = false;
					waiting = true;
				}, (err) -> trace(err));
			}, (err) -> trace(err));
			universe.deleteEntity(entity);
		});

		if (voice_channel == null && !waiting) {
			waiting = true;
			Main.client.channels.fetch(voice_channel_id).then(function(channel:VoiceChannel) {
				this.voice_channel = channel;
				waiting = false;
			}, (err) -> trace(err));
		}

		if (voice_channel == null) {
			return;
		}

		if (voice_text == null && !waiting) {
			waiting = true;
			Main.client.channels.fetch(voice_text_id).then(function(channel:TextChannel) {
				waiting = false;
				this.voice_text = channel;
			}, (err) -> trace(err));
		}

		if (voice_text == null) {
			return;
		}

		if (!waiting && event == null) {
			waiting = true;
			// hard code event for now cause no time left before rr :D 1109898173763305585
			// 
			schedule.fetch('1109898173763305585').then(function(event) {
				trace('got');
				this.event = event;
				waiting = false;
			}, function(err) {
				trace(err);
				waiting = false;
			});
		}

		if (event == null) {
			return;
		}

		var now = Date.now().getTime();
		var left = event.scheduledStartTimestamp - now;
		if (!started) {
			if (left <= Duration.fromString('5m') && !host_active) {
				var passed = now - voice_last_updated;
				if (passed >= Duration.fromString('1m')) {
					for (member in voice_channel.members) {
						if (member.id == host) {
							host_active = true;
							trace('host active');
							break;
						}
					}
				}
			}
		}

		if (!host_active || started) {
			return;
		}

		if (left <= Duration.fromString('0s') && !waiting && !started) {
			waiting = true;
			event.setStatus(Active, 'Time to start the event!').then(function(event) {
				this.voice_text.send(
					'$event_role come and join the haxe roundup where we go over what has been happening in haxe for the last few weeks!\n\n If you received this event and want to opt out please go to <#663246792426782730> and type `/notify events`'
				)
					.then(null, (err) -> trace(err));
				trace('started');
				waiting = false;
				this.event = event;
			}, (err) -> trace(err));
		}
	}

	function run(command:Command, interaction:BaseCommandInteraction) {}

	function addCollector(message:Message, member:GuildMember) {
		var filter = this.filter(message);
		var time:Float = Duration.fromString('1d');
		var collector = message.createReactionCollector({filter: filter, time: time});

		collector.on('collect', (reaction:MessageReaction, user:User) -> {
			if (user.bot) {
				return;
			}
			switch(reaction.emoji.name) {
				case "✅": 
					var obj:RoundupEndEvent = {
						member: member
					}
					this.universe.setComponents(universe.createEntity(), obj);
				default:
			}
			collector.stop('User responded');
		});

		collector.on(
			'end',
			(collected:Collection<String, MessageReaction>, reason:String) -> {}
		);
	}

	function filter(message:Message) {
		var filter = (reaction:MessageReaction, user:User) -> {
			var votes = 0;
			for (reac in message.reactions.cache) {
				for (u in reac.users.cache) {
					if (u.id == user.id && !u.bot) {
						votes++;
					}
				}
			}

			if (votes > 1) {
				if (!user.bot) {
					reaction.users.remove(user);
				}
			}

			if (reaction.emoji.name == "✅") {
				return true;
			}

			if (reaction.emoji.name == "❎") {
				return true;
			}

			reaction.remove();
			return false;
		}

		return filter;
	}

	function get_name():String {
		return 'rounduproundup';
	}

	function createEvent() {
		var title = 'Haxe Roundup Roundup';
		var description = "A community hosted discussion event where we go over the latest things that has gone on in the haxe over the last few weeks. We also have a period where people can show off what they're working on - its open floor come and join if you want :D";
	}

	function get_guild() {
		return Main.client.guilds.cache.get(Main.guild_id);
	}

	function get_started() {
		return event.status == Active;
	}

	function get_schedule() {
		return guild.scheduledEvents;
	}
}

typedef TRoundupEventData = {
	var scheduled:Bool;
	var date:Float;
	var host:String;
	var host_confirmed:Bool;
	var reminders:Bool;
}
