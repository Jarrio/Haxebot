package commands;

import js.Browser;
import discord_js.ReactionCollector;
import Main.TRoundup;
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
import discord_js.GuildScheduledEvent;

typedef RoundupEndEvent = {
	var member:GuildMember;
}

class RoundupRoundup extends CommandDbBase {
	var guild(get, never):Guild;
	var state(get, never):TRoundup;

	var voice_text:TextChannel;
	var announcement:TextChannel;
	var voice_channel:VoiceChannel;
	var host_m:GuildMember;
	var last_checked:Float;
	var schedule(get, never):GuildScheduleEventManager;
	var event:GuildScheduledEvent;
	var waiting:Bool = false;
	var host_active:Bool = false;
	var host_contacted:Bool = false;
	var new_event_collector:ReactionCollector;
	var end_event_collector:ReactionCollector;

	final voice_channel_id = #if block "416069724657418244" #else "198219256687493120" #end;
	final announcement_id = #if block "597067735771381771" #else "286485321925918721" #end;
	final voice_text_id = #if block "597067735771381771" #else "220626116627529728" #end;
	final event_role = #if block "<@&1114582456381747232>" #else "<@&1054432874473996408>" #end;

	@:fastFamily var end_event:{data:RoundupEndEvent};
	@:fastFamily var voice_update_events:{forward:CommandForward, old:VoiceState, updated:VoiceState};
	@:fastFamily var scheduled_event_updates:{forward:CommandForward, event:GuildScheduledEvent};

	override function update(_) {
		super.update(_);
		this.handleEventUpdates();
		this.handleVoiceEvents();
		// this.handleEndEvent();

		if (this.state == null) {
			return;
		}

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

		if (announcement == null && !waiting) {
			waiting = true;
			Main.client.channels.fetch(announcement_id).then(function(channel:TextChannel) {
				this.announcement = channel;
				waiting = false;
			}, (err) -> trace(err));
		}

		if (announcement == null) {
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

		if (host_m == null && !waiting) {
			waiting = true;
			this.guild.members.fetch(this.state.host).then(function(member) {
				this.host_m = member;
				this.waiting = false;
				trace('Roundup host obtained');
			}, (err) -> trace(err));
		}

		if (this.host_m == null) {
			return;
		}

		if (this.event == null) {
			this.getEvent();
			return;
		}

		switch (event.status) {
			case Completed:
				this.scheduleNewEvent();
			case Scheduled:
				this.handleScheduledEvent();
			default:
		}
	}

	function scheduleNewEvent() {
		if (host_contacted || waiting) {
			return;
		}
		trace(this.host_m.user.tag);
		waiting = true;
		var message = "Time to schedule a new roundup roundup! How many weeks until the next roundup roundup?\n";
		var reactions = ['2️⃣', '3️⃣', '4️⃣', '5️⃣'];
		host_contacted = true;
		this.host_m.send(message).then(function(message) {
			waiting = false;
			new_event_collector = this.addCollection('1w', reactions, message, newEventCollector);
		}, (err) -> trace(err));
	}

	function newEventCollector(reaction:MessageReaction, user:User) {
		if (user.bot) {
			return;
		}

		var weeks = switch (reaction.emoji.name) {
			case "2️⃣": 2;
			case "3️⃣": 3;
			case "4️⃣": 4;
			case "5️⃣": 5;
			default: 2;
		}
		var date = event.scheduledStartTimestamp + Duration.fromString('${weeks}w');
		this.createEvent(date);
		this.new_event_collector.stop('User selected $weeks weeks');
	}

	function handleEventUpdates() {
		if (this.event == null) {
			return;
		}
		iterate(scheduled_event_updates, (entity) -> {
			switch (forward) {
				case scheduled_event_update:
					event.client.guilds.fetch({guild: Main.guild_id}).then(function(guild) {
						guild.scheduledEvents.fetch(event.id)
							.then(function(event:GuildScheduledEvent) {
								this.event = (event);
								trace('Updated event: ${event.status}');
								trace('New time: ${Date.fromTime(event.scheduledStartTimestamp)}');
							}, (err) -> trace(err));
					}, (err) -> trace(err));

				default:
			}
			universe.deleteEntity(entity);
		});
	}

	inline function handleVoiceEvents() {
		iterate(voice_update_events, (entity) -> {
			switch (forward) {
				case roundup_member_update:
					if (event != null && event.status == Active) {
						var member = updated.member;
						if (member.id == host && updated.channel == null) {
							member.send(
								'Hi <@$host>, it looks like you left the voice channel. Should I end the event?'
							)
								.then(function(message) {
									var reactions = ["✅", "❎"];
									end_event_collector = this.addCollection('1w', reactions,
										message, endEventCollector);
								}, (err) -> trace(err));
						}
					}
					universe.deleteEntity(entity);
				default:
			}
		});
	}

	function endEventCollector(reaction:MessageReaction, user:User) {
		if (user.bot) {
			return;
		}
		switch (reaction.emoji.name) {
			case "✅":
				event.setStatus(Completed, "Host ended the event.").then((event) -> {
					host_m.send('Event ended, thank you for hosting!').then(function(_) {
						host_active = false;
						waiting = false;
						// this.event = event;
					}, (err) -> trace(err));
				}, (err) -> trace(err));
			default:
		}
		end_event_collector.stop();
	}

	inline function handleScheduledEvent() {
		var now = Date.now().getTime();
		var left = event.scheduledStartTimestamp - now;
		if (left > Duration.fromString('5m')) {
			return;
		}

		// check if host is around before considering starting the roundup
		if (!host_active) {
			if (now - last_checked > Duration.fromString('1m')) {
				this.last_checked = now;
				for (member in voice_channel.members) {
					if (member.id == host) {
						host_active = true;
						trace('Host is active');
						break;
					}
				}
			}
			return;
		}

		if (left <= Duration.fromString('0s') && !waiting) {
			waiting = true;
			event.setStatus(Active, 'Time to start the event!').then(function(event) {
				this.voice_text.send(
					'$event_role come and join the haxe roundup where we go over what has been happening in haxe for the last few weeks!\n\n If you received this event and want to opt out please go to <#663246792426782730> and type `/notify events`'
				)
					.then(null, (err) -> trace(err));
				trace('Event Started');
				waiting = false;
				this.event = event;
			}, (err) -> trace(err));
		}
	}

	function createEvent(date:Float) {
		var title = 'Haxe Roundup Roundup';
		var description = "A community hosted discussion event where we go over the latest things that has gone on in the haxe over the last few weeks. We also have a period where people can show off what they're working on - its open floor come and join if you want :D";
		this.guild.scheduledEvents.create({
			name: title,
			channel: this.voice_channel_id,
			entityType: Voice,
			privacyLevel: GuildOnly,
			scheduledStartTime: date,
			description: description
		}).then(function(event) {
			host_contacted = false;
			this.event = event;
			this.state.event_id = event.id;
			var time = 604800;
			event.createInviteURL({maxAge: time, channel: voice_text_id}).then(function(url) {
				this.voice_text.send(
					{content: 'Thanks for hanging out :grin: \nGet ready for the next one! $url'}
				)
					.then(null, (err) -> trace(err));
				this.announcement.send(
					{content: 'Get ready for the next roundup roundup :grin: \n$url'}
				)
					.then(null, (err) -> trace(err));
			}, (err) -> trace(err));
			Main.updateState('state', Main.state);
			trace('Event setup!');
			this.host_m.send(
				'New roundup event scheduled for <t:${Math.round(event.scheduledStartTimestamp / 1000)}:R>'
			)
				.then(null, (err) -> trace(err));
		}, (err) -> trace(err));
	}

	function getEvent() {
		if (waiting) {
			return;
		}

		waiting = true;
		schedule.fetch(this.state.event_id).then(function(event) {
			trace('Roundup event retrieved');
			this.event = event;
			waiting = false;
		}, function(err) {
			trace(err);
			waiting = false;
		});
	}

	inline function handleEndEvent() {
		iterate(end_event, (entity) -> {
			event.setStatus(Completed, "Host ended the event.").then((_) -> {
				data.member.send('Event ended, thank you for hosting!').then(function(_) {
					host_active = false;
					waiting = false;
				}, (err) -> trace(err));
			}, (err) -> trace(err));
			universe.deleteEntity(entity);
		});
	}

	function addCollection(time:String, emojis:Array<String>, message:Message,
			on_collect:MessageReaction->User->Void,
			?on_end:Collection<String, MessageReaction>->String->Void) {
		for (e in emojis) {
			message.react(e).then(null, (err) -> trace(err));
		}

		var collector = message.createReactionCollector({time: Duration.fromString(time)});
		collector.on('collect', on_collect);
		if (on_end != null) {
			collector.on('end', on_end);
		}

		return collector;
	}

	function run(command:Command, interaction:BaseCommandInteraction) {}

	function addCollector(message:Message, member:GuildMember) {
		var time:Float = Duration.fromString('1d');
		var collector = message.createReactionCollector({time: time});

		collector.on('collect', (reaction:MessageReaction, user:User) -> {
			if (user.bot) {
				return;
			}
			switch (reaction.emoji.name) {
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

	function get_name():String {
		return 'rounduproundup';
	}

	function get_guild() {
		return Main.client.guilds.cache.get(Main.guild_id);
	}

	function get_state() {
		return Main.state.roundup_roundup;
	}

	function get_started() {
		return event.status == Active;
	}

	function get_schedule() {
		return guild.scheduledEvents;
	}

	var host(get, never):String;

	function get_host() {
		#if block
		return "151104106973495296";
		#end
		return this.state.host;
	}
}

typedef TRoundupEventData = {
	var scheduled:Bool;
	var date:Float;
	var host:String;
	var host_confirmed:Bool;
	var reminders:Bool;
}
