package systems.commands;

import haxe.Timer;
import haxe.ds.Vector;
import discord_js.TextChannel;
import discord_js.MessageEmbed;
import systems.commands.Poll.PollTime;
import js.Browser;
import externs.Fetch;
import discord_builder.BaseCommandInteraction;
import components.Command;

typedef TTweet = {
	var edit_history_tweet_ids:Array<String>;
	var id:String;
	var author_id:String;
	var text:String;
	var created_at:String;
}

typedef TTweetUser = {
	var id:String;
	var name:String;
	var username:String;
}

@:forward
private abstract Response({meta:{result_count:Int}, data:Array<TTweet>, includes:{users:Array<TTweetUser>}}) from Dynamic {
	public function getUser(tweet:TTweet):TTweetUser {
		if (users != null) {
			for (user in users) {
				if (tweet.author_id == user.id) {
					return user;
				}
			}
		}
		return null;
	}

	public function createLinks():Map<String, String> {
		var urls = new Map<String, String>();
		for (tweet in tweets) {
			var user = getUser(tweet);
			urls.set(tweet.id, createLink(user.username, tweet.id));
		}
		return urls;
	}

	public inline static function createLink(user:String, id:String) {
		return 'https://twitter.com/$user/status/$id';
	}

	public var tweets(get, never):Array<TTweet>;

	function get_tweets() {
		return this.data;
	}

	public var users(get, never):Array<TTweetUser>;

	function get_users() {
		return this.includes.users;
	}
}

class Twitter extends CommandBase {
	var tweets:Map<String, TTweet> = [];
	var ping_rate:PollTime = PollTime.one_hour;
	var channel:TextChannel;
	var channel_id:String = '1028078544867311727';
	var vector = new Vector<Bool>(6);

	override function onEnabled() {
		vector[0] = false;
		vector[1] = false;
		vector[2] = false;
		vector[3] = false;
		vector[4] = false;
		vector[5] = false;
	}

	var arr = [];
	var checking = false;

	override function update(_:Float) {
		super.update(_);
		if (!Main.connected) {
			return;
		}

		if (!this.checking && this.channel != null) {
			checking = true;
			var queries = ['#haxe', '#haxeflixel', '#openfl', '#yeswekha', '#haxe #heaps', '#haxeui'];
			for (k => query in queries) {
				query += ' -is:retweet';
				var url = 'https://api.twitter.com/2/tweets/search/recent?tweet.fields=created_at&user.fields=name&expansions=author_id&query=${query.urlEncode()}';
				
				Fetch.fetch(url, {
					headers: {
						Authorization: 'Bearer ${Main.config.twitter_token}'
					},
					method: GET,
				}).then(function(succ) {
					succ.json().then(function(json:Response) {
						trace('$query - ' + json.meta.result_count);
						if (json.meta.result_count > 0) {
							for (tweet in json.createLinks()) {
								arr.push(tweet);
							}
						}

						vector[k] = true;
					}, err);
				}, err);
			}

			var query = ' OR %23haxeflixel OR %23openfl OR %23kha OR %23heaps OR %23ceramic OR %23haxeui -is:retweet';
		}

		var post = true;
		var i = 0;
		for (v in vector) {
			if (!v) {
				post = false;
				break;
			}
			i++;
		}

		if (post && arr.length != 0) {
			post = false;
			var i = 0;
			var t = new Timer(250);
			t.run = () -> {
				if (i >= arr.length) {
					trace('stop');
					vector[0] = false;
					vector[1] = false;
					vector[2] = false;
					vector[3] = false;
					vector[4] = false;
					vector[5] = false;
					t.stop();
					arr = [];
					return;
				}

				if (this.arr[i] == null) {
					return;
				}
				this.channel.send({content: this.arr[i]});
				i++;
			}
		}

		if (!checking && this.channel == null) {
			checking = true;
			Main.client.channels.fetch(channel_id).then(function(succ) {
				this.channel = succ;
				checking = false;
				trace('found channel');
			}, err);
		}
	}

	function createEmbed(tweet:TTweet, user:TTweetUser) {
		var embed = new MessageEmbed();
		embed.setTitle('@' + user.username);
		embed.setURL(Response.createLink(user.username, tweet.id));
		embed.setDescription(tweet.text);
		embed.setFooter({text: tweet.created_at, iconURL: 'https://cdn.discordapp.com/emojis/567741748172816404.webp?size=96&quality=lossless'});

		return embed;
	}

	function run(command:Command, interaction:BaseCommandInteraction) {
		switch (command.content) {
			case Boop(user):
				interaction.reply('*boop* <@${user.id}>');
			default:
		}
	}

	function get_name():String {
		return 'twitter';
	}
}
