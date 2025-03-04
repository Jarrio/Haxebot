package systems;

import db.ITable;
import db.DatabaseResult;
import db.Record as RRecord;
import database.DBEvents;
import Query.*;
import db.IDatabase;
import ecs.System;
import db.DatabaseFactory;
import util.Duration;

using StringTools;

import db.Record;

// import events.ExchangeDBEvent;
class DatabaseSystem extends System {
	public var connected:Bool = false;

	var polls:Map<DBEvents, Int> = [];
	var poll_times:Map<DBEvents, Float> = [];

	var inserting:Bool = false;
	var updating:Bool = false;
	var db:IDatabase;
	var watches:Array<DBEvents> = [];
	@:fastFamily var dbevents:{event:DBEvents};
	// @:fastFamily var exchange_events:{event:ExchangeDBEvent};
	var connected_time:Float;

	var event_cache:Array<DBEvents> = [];
	var reverse:Array<DBEvents> = [];
	var host:String;
	var user:String;
	var pass:String;
	var database:String;

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
			var event = reverse.pop();
			switch (event) {
				case CreateTable(name, columns):
					this.db.createTable(name, columns);
				case Insert(table, value, callback):
					db.table(table).then((result) -> {
						var record = value.record;
						if (record.hasField('_insertedId')) {
							record.removeField('_insertedId');
						}
						return result.table.add(record);
					}).then(function(res) {
						callback(Success("Inserted", res.data));
					}, function(err) {
						if (err.message != null && (err.message : String).contains('DUPLICATE_DATA')) {
							return;
						} else {
							trace(value);
							trace(err);
						}
					});
				case Page(table, page, results, query, callback):
					db.table(table).then((result) -> {
						return result.table.page(page, results, query);
					}).then(function(result) {
						if (result != null) {
							callback(Records(result.data));
						} else {
							callback(Error('No data', result.data));
						}
					}, function(err) {
						if (err.message != null && (err.message : String).contains('DUPLICATE_DATA')) {
							return;
						} else {
							trace(event);
							trace(err);
						}
					});
				case Update(table, value, query, callback):
					var record = value.record;
					if (record.hasField('_insertedId')) {
						record.removeField('_insertedId');
					}
					if (updating) {
						this.event_cache.push(event);
						continue;
					}
					updating = true;
					db.table(table).then((result) -> {
						return result.table.update(query, record);
					}).then(function(res) {
						updating = false;
						callback(Success("Updated"));
					}, function(err) {
						updating = false;
						callback(Error("Error", err));
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
				case GetLastRecord(table, where, value, column, callback):
					db.table(table).then((result) -> {
						return result.table.raw('SELECT * FROM `$table` WHERE `$where` = \'$value\' ORDER BY `$column` DESC LIMIT 1');
					}).then((result) -> {
						if (result != null) {
							callback(Record(result.data[0]));
						} else {
							callback(Error('No data', result.data));
						}
					}, (err) -> trace(err));
				case GetRecentRecords(table, where, value, column, amount, callback):
					db.table(table).then((result) -> {
						return result.table.raw('SELECT * FROM `$table` WHERE `$where` = \'$value\' ORDER BY `$column` DESC LIMIT $amount');
					}).then((result) -> {
						if (result != null) {
							callback(Records(result.data));
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
					var query = "SELECT * FROM `"+table+"` WHERE `"+field+"` LIKE '%"+ value + "%'";

					db.raw(query).then(function(result) {
						if (result != null) {
							callback(Records(result.data));
						} else {
							callback(Error('No data', result.data));
						}
					}, (err) -> trace(err));
				case SearchBy(table, field, value, by_column, by_value, callback):
					var query = "SELECT * FROM `"+table+"` WHERE `"+by_column+"` = '"+by_value+"' AND "+field+" LIKE '%"+ value + "%'";

					db.raw(query).then(function(result) {
						if (result != null) {
							callback(Records(result.data));
						} else {
							callback(Error('No data', result.data));
						}
					}, function(err) {
						trace(query);
						trace(err);
					});
				case DeleteByValue(table, column, value, callback):
					this.getTable(table, function(result) {
						var record = new RRecord();
						record.field(column, value);

						result.table.delete(record).then(function(succ) {
							callback(Success("Successfully deleted", succ));
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
							if (succ.itemsAffected == null || succ.itemsAffected == 0) {
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

					var record = value.record;
					this.updating = true;

					db.table(table).then(function(result) {
						result.table.findOne(query).then(function(result) {
							if (result.data == null) {
								result.table.add(record).then((result) -> {
									updating = false;
									if (result.itemsAffected != null && result.itemsAffected >= 1) {
										callback(Success("Inserted"));
									} else {
										trace("something went wrong");
										trace(result);
									}
								}, (err) -> {
									updating = false;
									if (callback != null) {
										callback(Error("Failed", err));
									}
									trace(err);
								});
							} else {
								if (column != null) {
									record.field(column, result.data.field(column));
								}
								if (record.hasField('id')) {
									record.removeField('id');
								}

								result.table.update(query, record).then((result) -> {
									updating = false;
									if (result.itemsAffected != null && result.itemsAffected >= 1) {
										callback(Success("Updated"));
									} else {
										trace("something went wrong");
										trace(result);
									}
								}, (err) -> {
									updating = false;
									if (callback != null) {
										callback(Error("Failed", err));
									}
									trace(err);
								});
							}
						}, (err) -> {
							updating = false;
							trace(err);
						});
					}, (err) -> {
						updating = false;
						trace(err);
					});

				// db.table(table).then((result) -> {
				// 	return result.table.findOne(query);
				// }).then((result) -> {
				// 	this.updating = true;
				// 	if (result.data == null) {
				// 		return result.table.add(record);
				// 	} else {
				// 		if (column != null) {
				// 			record.field(column, result.data.field(column));
				// 		}
				// 		if (record.hasField('id')) {
				// 			record.removeField('id');
				// 		}
				// 		return result.table.update(query, record);
				// 	}
				// }).then(function(result) {
				// 	if (result.data.hasField('____status')) {
				// 		trace('result null ${result.data.field('____status')}');
				// 		return;
				// 	}

				// 	this.updating = false;
				// 	trace('unblock');
				// 	if (callback != null) {
				// 		callback(Success('Successfully updated record', result.data));
				// 	}
				// }, function(err:Dynamic) {
				// 	this.updating = false;
				// 	trace('unblock');
				// 	trace(value);
				// 	trace(err);
				// 	trace(err.message);
				// 	// if (err.message.contains('Duplicate entry')) {
				// 	// 	EcsTools.addComponents(event); //recycle for an update instead
				// 	// }
				// 	if (callback != null) {
				// 		callback(Error("Failed", err));
				// 	}
				// });
				default:
					trace('$event not implemented');
			}
		}

		// iterate(exchange_events, (entity) -> {
		// 	switch (event) {
		// 		case GetAllOrders(query, callback):
		// 			db.table('orders').then((result) -> {
		// 				return result.table.find(query);
		// 			}).then((result) -> {
		// 				var orders = new Array<Order>();
		// 				for (data in result.data) {
		// 					var order_id = data.field('order_id');
		// 					var symbol = data.field('symbol');
		// 					var exchange = data.field('exchange');
		// 					var timestamp = data.field('timestamp');
		// 					var price = data.field('price');
		// 					var quantity = data.field('quantity');
		// 					var status = data.field('status');
		// 					var side = data.field('side');
		// 					var type = data.field('type');
		// 					var filled = data.field('filled');
		// 					var updated = data.field('updated');
		// 					var order = new Order(order_id, exchange, symbol, price, quantity, status, side, type, timestamp);
		// 					order.updated = updated;
		// 					order.filled = filled;
		// 					orders.push(order);
		// 				}
		// 				callback(orders);
		// 			}, function(error) {});
		// 			universe.deleteEntity(entity);
		// 		default:
		// 	}
		// });

		for (i in 0...event_cache.length) {
			var e = event_cache.pop();
			EcsTools.set((e : DBEvents));
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
