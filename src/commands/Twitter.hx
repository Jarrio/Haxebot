package commands;

import commands.types.Duration;
import commands.mod.Social.TSocial;
import firebase.web.firestore.DocumentReference;
import sys.io.File;
import haxe.Timer;
import haxe.ds.Vector;
import discord_js.TextChannel;
import commands.Poll.PollTime;
import externs.Fetch;
import discord_builder.BaseCommandInteraction;
import components.Command;
import systems.CommandDbBase;
import js.Browser;
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
private abstract Response({meta:{result_count:Int}, data:Array<TTweet>, includes:{users:Array<TTweetUser>}})
	from Dynamic {
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
		return 'https://fxtwitter.com/$user/status/$id';
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

class Twitter extends CommandDbBase {
	var tweets:Map<String, TTweet> = [];
	var ping_rate:Float = #if block Duration.minute #else Duration.hour #end;
	var channel:TextChannel;
	#if block
	var channel_id:String = '597067735771381771';
	#else
	var channel_id:String = '1030188275341729882';
	#end
	var async_check = new Vector<Bool>(6);
	var twitter_links = [];
	var checking = false;
	var tags:Array<String> = [];
	var users:Array<String> = [];
	var ignore:Array<String> = [];
	var start_timer = false;

	override function onEnabled() {
		this.ignore.push('first_issues');
		var doc:DocumentReference<TSocial> = Firestore.doc(this.db, 'discord/social');
		Firestore.onSnapshot(doc, (update) -> {
			this.tags = update.data().twitter_tags;
			this.users = update.data().twitter_users;
			async_check = new Vector<Bool>(tags.length);
			for (k => _ in tags) {
				this.async_check.set(k, false);
			}
			if (!this.start_timer) {
				this.start_timer = true;
				this.poll();
			}
		});
	}

	inline function poll() {
		trace('Started twitter scanning');
		var checker = new Timer((this.ping_rate : Float).int());
		checker.run = () -> {
			if (Main.connected && !this.checking && this.channel != null) {
				this.checking = true;
				for (k => query in this.tags) {
					var url = 'https://api.twitter.com/2/tweets/search/recent?tweet.fields=created_at&user.fields=name&expansions=author_id&max_results=25';

					if (this.since_id != "") {
						url += '&since_id=${this.since_id}';
					}
					query += ' -is:retweet';
					url += '&query=${query.urlEncode()}';

					Fetch.fetch(url, {
						headers: {
							Authorization: 'Bearer ${Main.keys.twitter_token}'
						},
						method: GET,
					}).then(function(succ) {
						succ.json().then(function(json:Response) {
							try {
								if (json.meta.result_count > 0) {
									for (tweet in json.createLinks()) {
										twitter_links.push(tweet);
									}
								}
								this.removeDupes();
							} catch (e ) {
								trace(this.since_id);
								trace(url);
								trace(e);
								trace(json);
							}
							async_check[k] = true;
							this.checking = false;
						}, function(err) {
							trace(err);
							Browser.console.dir(err);
						});
					}, function(err) {
						trace(err);
						Browser.console.dir(err);
					});
				}
			}
		}
	}

	function removeDupes() {
		var list = [];
		for (link in this.twitter_links) {
			var block = false;
			for (account in this.ignore) {
				if (StringTools.contains(link, '/$account/')) {
					block = true;
					break;
				}
			}
			if (block) {
				continue;
			}
			if (list.indexOf(link) == -1) {
				list.push(link);
			}
		}
		this.twitter_links = list;
	}

	override function update(_:Float) {
		super.update(_);
		if (!Main.connected) {
			return;
		}

		var check = true;
		for (v in async_check) {
			if (!v) {
				check = false;
				break;
			}
		}

		if (check && this.twitter_links.length > 0) {
			this.twitter_links.sort((a, b) -> {
				var split_a = a.split('/');
				var split_b = b.split('/');
				var x = Std.parseInt(split_a[split_a.length - 1]);
				var y = Std.parseInt(split_b[split_b.length - 1]);

				if (x > y) {
					return 1;
				}

				if (x < y) {
					return -1;
				}

				return 0;
			});

			for (link in this.twitter_links) {
				this.channel.send({content: link}).then(null, function(err) {
					trace(err);
					Browser.console.dir(err);
				});
			}

			for (k => _ in tags) {
				async_check[k] = false;
			}

			var split = this.twitter_links[twitter_links.length - 1].split('/');
			this.since_id = split[split.length - 1];
			this.twitter_links = [];
		}

		if (check && this.twitter_links.length == 0) {
			for (k => _ in tags) {
				async_check[k] = false;
			}
		}

		if (!checking && this.channel == null) {
			checking = true;
			Main.client.channels.fetch(channel_id).then(function(succ) {
				this.channel = succ;
				checking = false;
				trace('Found twitter thread');
			}, function(err) {
				trace(err);
				Browser.console.dir(err);
			});
		}
	}

	function run(command:Command, interaction:BaseCommandInteraction) {}

	var since_id(get, set):String;

	inline function get_since_id() {
		return Main.state.twitter_since_id;
	}

	inline function set_since_id(value:String) {
		Main.state.twitter_since_id = value;
		Main.updateState('twitter_since_id', value);

		return value;
	}

	function get_name():String {
		return 'twitter';
	}
}
