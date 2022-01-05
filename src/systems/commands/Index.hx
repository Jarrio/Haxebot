package systems.commands;

import firebase.firestore.DocumentReference;
import firebase.firestore.CollectionReference;
import firebase.firestore.Firestore;
import discord_js.MessageEmbed;
import Main.CommandForward;
import discord_js.Message;
import components.Command;
import discord_builder.BaseCommandInteraction;
import firebase.firestore.Firestore.*;

typedef TProjectIndex = {
	var topic:String;
	var source_url:String;
	var title:String;
	var description:String;
	var created_at:Date;
	var validated:Bool;	
	var validated_by:String;
}

class Index extends CommandDbBase {
	@:fastFamily var dm_messages:{type:CommandForward, message:Message};

	public function new(universe) {
		super(universe);
		var query = Firestore.query(collection(db, 'index'));

		Firestore.onSnapshot(query, function(snapshot) {
			snapshot.forEach((result) -> {
				trace(result.data());
			});
			

		}, (error) -> trace(error));
	}

	function run(command:Command, interaction:BaseCommandInteraction) {
		switch (command.content) {
			case Index(topic, source_url, title, description):
				trace('topic: $topic');
				trace('source_url: $source_url');
				trace('title: $title');
				trace('description: $description');
				
				Firestore.addDoc(collection(db, 'index'), {
					topic: topic,
					source_url: source_url,
					title: title,
					description: description,
					created_at: Date.now(),
					added_by: interaction.user.id,
					validated: false,
					validated_by: ""
				}).then((_) -> trace('added'), (err) -> trace(err));
			default:
		}
	}

	function getChannelId(channel:String) {
		return switch (channel) {
			case 'flixel': '165234904815239168';
			case 'heaps': '501408700142059520';
			case 'ceramic': '853414608747364352';
			case 'openfl': '769686284318146561';
			case 'lime': '769686258049351722';
			case 'nme': '162656395110514688';
			case 'haxe': '162395145352904705';
			// case 'other': '596744553030090880';
			case 'other': '597067735771381771';
			default: channel;
		}
	}

	function getChannel(channel:String) {
		return switch (channel) {
			case '1': 'flixel';
			case '2': 'heaps';
			case '3': 'ceramic';
			case '4': 'openfl';
			case '5': 'lime';
			case '6': 'nme';
			case '7': 'haxe';
			case '8': 'other';
			default: channel;
		}
	}

	inline function createEmbed(content:String) {
		var embed = new MessageEmbed();

		embed.setDescription(content);
		return embed;
	}

	function get_name():String {
		return 'index';
	}
}
