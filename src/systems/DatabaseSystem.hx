package systems;

import sys.io.File;
import sys.FileSystem;
import db.DebugUtils;
import promises.PromiseUtils;
import promises.Promise;
import util.Duration;
import db.ITable;
import db.DatabaseResult;
import db.Record as RRecord;
import database.DBEvents;
import Query.*;
import db.IDatabase;
import ecs.System;
import db.DatabaseFactory;
import db.mysql.Utils;
import database.types.DBQuote;
import database.types.DBSnippet;
import database.types.DBReminder;

class DatabaseSystem extends System {
	public var connected:Bool = false;

	var polls:Map<DBEvents, Int> = [];
	var poll_times:Map<DBEvents, Float> = [];

	var inserting:Bool = false;
	var updating:Bool = false;
	var db:IDatabase;
	var watches:Array<DBEvents> = [];
	@:fastFamily var dbevents:{event:DBEvents};

	var connected_time:Float;

	var event_cache:Array<DBEvents> = [];
	var reverse:Array<DBEvents> = [];

	override function onEnabled() {
		var keys = Main.keys.mysql;
		db = DatabaseFactory.instance.createDatabase(DatabaseFactory.MYSQL, {
			database: keys.database,
			host: keys.host,
			user: keys.user,
			pass: keys.pass
		});

		db.setProperty('autoReconnect', true);
		db.setProperty('autoReconnectInterval', 5000);
		db.setProperty('replayQueriesOnReconnection', true);

		connected_time = Date.now().getTime() - (Duration.fromString('8hrs') : Float);
	}


	inline function insert(table:String, value:RRecord, callback) {
		this.db.table(table).then((result) -> {
			return result.table.add(value);
		}).then(function(result) {
			callback(Success('Inserted'));
		}, function(error) {
			callback(Error('Insert failed', error));
		});
	}

	function connect() {
		db.connect().then(function(state) {
			if (state.data) {
				this.connected = true;
				this.connected_time = Date.now().getTime();

				trace('Database connected');
			} else {
				this.connected = false;
				this.connected_time -= (Duration.fromString('5hrs') : Float);
				trace('Database not connected');
			}
		}, (err) -> trace(err));
	}

	override function update(_) {
		if (Date.now().getTime() - this.connected_time > Duration.fromString('5hrs')) {
			this.connected_time = Date.now().getTime();
			this.connected = false;
			this.connect();
		}

		if (!connected) {
			return;
		}

		for (key => ms in polls) {
			var now = Date.now().getTime();
			var last_sent = poll_times.get(key);

			var diff = now - last_sent;
			if (diff > ms) {
				poll_times.set(key, now);
				EcsTools.set(key);
			}
		}

		iterate(dbevents, (entity) -> {
			switch (event) {
				case Poll(event, ms):
					if (!polls.exists(event)) {
						polls.set(event, ms);
						poll_times.set(event, 0);
						trace('Saved poll ${event.getName()}');
					}
				default:
					reverse.push(event);
			}
			universe.deleteEntity(entity);
		});

		for (i in 0...reverse.length) {
			var event:DBEvents = reverse.pop();

			switch (event) {
				case CreateTable(name, columns):
					this.db.createTable(name, columns);
				case Insert(table, value, callback):
					db.table(table).then((result) -> {
						return result.table.add(value);
					}).then(function(res:DatabaseResult<RRecord>) {
						callback(Success("Inserted", res.data));
					}, function(err) {
						if (err.message != null
							&& (err.message : String).contains('DUPLICATE_DATA')) {
							return;
						} else {
							trace(value);
							trace(err);
						}
					});
				case Update(table, value, query, callback):
					if (updating) {
						EcsTools.set(event);
						continue;
					}
					updating = true;
					db.table(table).then((result) -> {
						return result.table.update(query, value);
					}).then(function(res) {
						updating = false;
						callback(Success("Updated"));
					}, function(err) {
						trace(err);
						trace(queryExprToSql(query));
						trace(value.debugString());
						updating = false;
					});
				case GetRecord(table, query, callback):
					db.table(table).then((result) -> {
						return result.table.findOne(query);
					}).then(function(result) {
						if (result != null) {
							callback(Record(result.data));
						} else {
							callback(Error('No data', result.data));
						}
					}, (err) -> trace(err));
				case GetRecords(table, query, callback):
					db.table(table).then((result) -> {
						return result.table.find(query);
					}).then(function(result) {
						if (result != null) {
							callback(Records(result.data));
						} else {
							callback(Error('No data', result.data));
						}
					}, (err) -> trace(err));
				case GetAllRecords(table, callback):
					db.table(table).then((result) -> {
						return result.table.all();
					}).then(function(result) {
						if (result != null) {
							callback(Records(result.data));
						} else {
							callback(Error('No data', result.data));
						}
					}, (err) -> trace(err));
				case Search(table, field, value, callback):
					var query = "SELECT * FROM `"+table+"` WHERE "+field+" LIKE '%"+ value + "%'";

					db.raw(query).then(function(result) {
						if (result != null) {
							callback(Records(result.data));
						} else {
							callback(Error('No data', result.data));
						}
					}, (err) -> trace(err));
				case SearchBy(table, field, value, by_column, by_value, callback):
					var query = "SELECT * FROM `"+table+"` WHERE "+by_column+" = '"+by_value+"' AND "+field+" LIKE '%"+ value + "%'";

					db.raw(query).then(function(result) {
						if (result != null) {
							callback(Records(result.data));
						} else {
							callback(Error('No data', result.data));
						}
					}, (err) -> trace(err));
				case DeleteByValue(table, column, value, callback):
					this.getTable(table, function(result) {
						var record = new RRecord();
						record.field(column, value);

						result.table.delete(record).then(function(succ) {
							callback(Success("Successfully deleted", succ.data));
						}, function(err) {
							callback(Error("Failed", err));
							trace(err);
						});
					}, function(err) {
						trace(err);
						callback(Error("Failed", err));
					});
				case DeleteRecord(table, value, callback):
					this.getTable(table, function(result) {
						result.table.delete(value).then(function(succ) {
							if (succ.data == null) {
								callback(Error("Failed to delete"));
							} else {
								callback(Success("Successfully deleted", succ.data));
							}
							
						}, function(err) {
							callback(Error("Failed", err));
							trace(err);
						});
					}, function(err) {
						trace(err);
						callback(Error("Failed", err));
					});
				case SearchAndUpdate(table, key, query, value, callback):
					var parse_key = this.parseKey(key);
					var key = parse_key.key;
					var column = parse_key.column;

					db.table(table).then((result) -> {
						return result.table.findOne(query);
					}).then((result) -> {
						// if (this.updating) {
						// 	this.event_cache.push(event);
						// 	var record = new RRecord();
						// 	record.field('____status', 'blocked');
						// 	var result = new DatabaseResult(result.database, result.table, record);
						// 	return PromiseUtils.promisify(result);
						// }
						this.updating = true;
						if (result.data == null) {
							return result.table.add(value);
						} else {
							if (column != null) {
								value.field(column, result.data.field(column));
							}
							if (value.hasField('id')) {
								value.removeField('id');
							}
							return result.table.update(query, value);
						}
					}).then(function(result) {
						if (result.data.hasField('____status')) {
							trace('result null ${result.data.field('____status')}');
							return;
						}

						this.updating = false;
						trace('unblock');
						if (callback != null) {
							callback(Success('Successfully updated record', result.data));
						}
					}, function(err:Dynamic) {
						this.updating = false;
						trace('unblock');
						trace(value);
						trace(err);
						trace(err.message);
						// if (err.message.contains('Duplicate entry')) {
						// 	EcsTools.addComponents(event); //recycle for an update instead
						// }
						if (callback != null) {
							callback(Error("Failed", err));
						}
					});
				default:
					trace('${event.getName()} not implemented');
			}
		}
	}

	function parseKey(value:String) {
		var key = null;
		var column = null;
		if (value.contains(':')) {
			var split = value.split(':');
			key = split[1];
			column = split[0];
		} else {
			key = value;
		}

		return {
			key: key,
			column: column
		}
	}

	function getTable(name:String, succ:DatabaseResult<ITable>->Void, err:Dynamic->Void) {
		db.table(name).then(succ, err);
	}
}
