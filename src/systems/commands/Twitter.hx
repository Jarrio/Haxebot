package systems.commands;

import js.Browser;
import externs.Fetch;
import discord_builder.BaseCommandInteraction;
import components.Command;

typedef TTweet = {
	var edit_history_tweet_ids:Array<String>;
	var id:String;
	var author_id:String;
	var text:String;
}

typedef TTweetUser = {
	var id:String;
	var name:String;
	var username:String;
}

@:forward
private abstract Response({data:Array<TTweet>, includes:{users:Array<TTweetUser>}}) from Dynamic {
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

	public function createLinks():Array<String> {
		var urls = [];
		for (tweet in tweets) {
			var user = getUser(tweet);
			urls.push('https://twitter.com/${user.username}/status/${tweet.id}');
		}
		return urls;
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
	var ping_rate:;
	override function onEnabled() {
		var query = '%23haxe OR %23haxeflixel OR %23openfl OR %23kha OR %23heaps OR %23ceramic OR %23haxeui -is:retweet';
		var url = 'https://api.twitter.com/2/tweets/search/recent?query=$query&expansions=author_id&user.fields=name&sort_order=recency';
		Fetch.fetch(url, {
			headers: {
				Authorization: 'Bearer ${Main.config.twitter_token}'
			},
			method: GET,
		}).then(function(succ) {
			succ.json().then((json:Response) -> {
				trace(json.createLinks());
			}, err);
		}, err);
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