package commands;

import discord_builder.BaseCommandInteraction;
import components.Command;
import systems.CommandBase;
import Main.CommandForward;
import discord_js.GuildScheduledEvent;
import discord_js.TextChannel;
import http.HttpClient;
import http.HttpRequest;
import http.HttpResponse;

class ScheduleEventPoster extends CommandBase {
	var channel:TextChannel;
	var once:Bool = false;
	var client:HttpClient = new HttpClient();
	var connected:Bool = false;
	final stream_channel_id = #if block "1202626434968068175" #else "1017520941661687878" #end;
	@:fastFamily var events:{forward:CommandForward, event:GuildScheduledEvent};
	var bearer:TAccessToken;

	function getToken() {
		var url = new HttpRequest('https://id.twitch.tv/oauth2/token');
		url.queryParams.set('client_id', Main.keys.twitch_client_id);
		url.queryParams.set('client_secret', Main.keys.twitch_secret);
		url.queryParams.set('grant_type', 'client_credentials');
		url.method = Post;
		client.makeRequest(url).then(function(resp) {
			this.bearer = resp.response.bodyAsJson;
			trace('got token');
			subscribeChannel();
		}, (err) -> trace(err));
	}

	override function onEnabled() {
		this.getToken();
	}

	function subscribeChannel() {
		var url = 'https://api.twitch.tv/helix/eventsub/subscriptions';
		var request = new HttpRequest(url);
		request.body = {
			type: 'channel.update',
			version: 2,
			condition: {
				broadcaster_user_id: "55270689"
			},
			transport: {
				method: "webhook",
				callback: "https://discord.com/api/webhooks/1235572910291419137/FcVYJauOCwQsiLRnc6PT3ePU-WPXV9QeGoGItYwzkTLR5Br4mXcmWijCCktKDv972O4I",
				secret: Main.keys.twitch_secret
			}
		}
		
		request.method = Post;
		request.headers = [];
		request.headers.set('Authorization', 'Bearer ${bearer.access_token}');
		request.headers.set('Client-Id', Main.keys.twitch_client_id);
		request.headers.set('Content-Type', 'application/json');
		client.makeRequest(request).then(function(inc) {
			trace(inc.response.headers);
			trace(inc.response.bodyAsString);
		}, (err) -> trace(err));
	}

	override function update(_:Float) {
		super.update(_);
		if (!this.once) {
			this.once = true;
			DiscordUtil.getChannel(stream_channel_id, (channel) -> {
				trace('stream channel received');
				this.channel = channel;
			});
		}

		if (this.channel == null) {
			return;
		}

		iterate(events, (entity) -> {
			switch (forward) {
				case CommandForward.create_event:
					if (event.channelId != null) {
						event.createInviteURL({maxAge: 0, channel: stream_channel_id})
							.then(sendUrl, (err) -> trace(err));
					}

					if (event?.entityMetadata?.location.contains('twitch')) {
						event.createInviteURL({maxAge: 0, channel: stream_channel_id})
							.then(sendUrl, (err) -> trace(err));
					}
				default:
			}
			universe.deleteEntity(entity);
		});
	}

	function sendUrl(url:String) {
		this.channel.send({
			content: url
		}).then(null, (err) -> trace(err));
	}

	function run(command:Command, interaction:BaseCommandInteraction) {}

	function get_name():String {
		return 'scheduleeventposter';
	}
}

private typedef TMessage<T> = {
	var metadata:TMetadata;
	var payload:T;
}

private typedef TWelomeMessage = {
	var session:{
		var id:String;
		var status:String;
		var connected_at:String;
		var keepalive_timeout_seconds:Float;
		var reconnect_url:Any;
	};
}

private typedef TKeepalive = {}

private typedef TNotificationMessage = {
	var subscription:{
		var id:String;
		var status:String;
		var type:String;
		var version:String;
		var cost:Float;
		var condition:{
			var broadcaster_user_id:String;
		};
		var transport:{
			var method:String;
			var session_id:String;
		};
		var created_at:String;
	};
	var event:{
		var user_id:String;
		var user_login:String;
		var user_name:String;
		var broadcaster_user_id:String;
		var broadcaster_user_login:String;
		var broadcaster_user_name:String;
		var followed_at:String;
	};
}

private typedef TReconnectMessage = {
	var session:{
		var id:String;
		var status:String;
		var keepalive_timeout_seconds:Any;
		var reconnect_url:String;
		var connected_at:String;
	};
}

private typedef TMetadata = {
	var message_id:String;
	var message_type:String;
	var message_timestamp:String;
	var subscription_type:String;
	var subscription_version:String;
}

// webhook
private typedef TAccessToken = {
	var access_token:String;
	var expires_in:Float;
	var token_type:String;
}

private typedef TResponse = {
	var data:Array<{
		var id:String;
		var status:String;
		var type:String;
		var version:String;
		var condition:{
			var broadcaster_user_id:String;
		};
		var created_at:String;
		var transport:{
			var method:String;
			var callback:String;
		};
		var cost:Float;
	}>;
	var total:Float;
	var max_total_cost:Float;
	var total_cost:Float;
}
