import haxe.ds.Option;

#if multithreaded
#if neko
import neko.vm.Mutex;
#elseif cpp
import cpp.vm.Mutex;
#elseif java
// Had some problems with the Mutex for java.
//import java.vm.Mutex;
#end
// Python is next
#end

#if macro
import haxe.macro.Context;
import haxe.macro.Expr;
using haxe.macro.ExprTools;
#end

using Lambda;

class AsyncTools
{
	///// Map /////

	public static function aMapLimit<T, T2, Err>(
		iterable : Iterable<T>, 
		limit : Int,
		cb : T -> (Null<Err> -> Null<T2> -> Void) -> Void, 
		done : Null<Err> -> Array<T2> -> Void) 
	{
		aForEachOfMapLimit(iterable, limit, function(item, _, done) {
			cb(item, done);
		}, done);
	}

	public static function aMap<T, T2, Err>(
		iterable : Iterable<T>, 
		cb : T -> (Null<Err> -> Null<T2> -> Void) -> Void, 
		done : Null<Err> -> Null<Array<T2>> -> Void) 
	{
		aMapLimit(iterable, 0, cb, done);
	}

	public static function aMapSeries<T, T2, Err>(
		iterable : Iterable<T>, 
		cb : T -> (Null<Err> -> Null<T2> -> Void) -> Void, 
		done : Null<Err> -> Null<Array<T2>> -> Void) 
	{
		aMapLimit(iterable, 1, cb, done);
	}
	
	///// Each (for loop) /////

	public static function aEachLimit<T, Err>(
		iterable : Iterable<T>, 
		limit : Int,
		cb : T -> (?Err -> Void) -> Void, 
		done : Null<Err> -> Void)
	{
		aMapLimit(iterable, limit, function(item, done) {
			cb(item, function(?err) done(err, true));
		}, function(err, items) done(err));
	}

	public static function aEach<T, Err>(
		iterable : Iterable<T>, 
		cb : T -> (?Err -> Void) -> Void, 
		done : Null<Err> -> Void)
	{
		aEachLimit(iterable, 0, cb, done);
	}

	public static function aEachSeries<T, Err>(
		iterable : Iterable<T>, 
		cb : T -> (?Err -> Void) -> Void, 
		done : Null<Err> -> Void) 
	{
		aEachLimit(iterable, 1, cb, done);
	}

	///// Map /////

	public static function aFilterLimit<T, T2, Err>(
		iterable : Iterable<T>, 
		limit : Int,
		cb : T -> (Null<Err> -> Bool -> Void) -> Void, 
		done : Null<Err> -> Array<T> -> Void) 
	{
		aMapLimit(iterable, limit, function(item, done) {
			cb(item, function(err : Err, keep : Bool) {
				if (err != null) done(err, null);
				else done(null, keep ? Option.Some(item) : Option.None);
			});
		}, function(err, results : Array<Option<T>>) {
			if (err != null) done(err, null);
			else {
				done(null, results
				.filter(function(o) return !o.equals(Option.None))
				.map(function(o) return o.getParameters()[0]));
			}
		});
	}

	public static function aFilter<T, T2, Err>(
		iterable : Iterable<T>, 
		cb : T -> (Null<Err> -> Bool -> Void) -> Void, 
		done : Null<Err> -> Array<T> -> Void) 
	{
		aFilterLimit(iterable, 0, cb, done);
	}

	public static function aFilterSeries<T, T2, Err>(
		iterable : Iterable<T>,
		cb : T -> (Null<Err> -> Bool -> Void) -> Void, 
		done : Null<Err> -> Array<T> -> Void) 
	{
		aFilterLimit(iterable, 1, cb, done);
	}

	///// Implementation /////
	
	static function aForEachOfMapLimit<T, T2, Err>(
		iterable : Iterable<T>, 
		limit : Int,
		cb : T -> Int -> (Null<Err> -> Null<T2> -> Void) -> Void, 
		done : Null<Err> -> Array<T2> -> Void) 
	{
		var complete = new Map<Int, T2>();
		var it = iterable.iterator();
		var completed = false;
		var running = 0;
		var pos = 0;
		#if multithreaded
		var mutex = new Mutex();
		#end
		
		function completedItems() {
			var currentPos = pos;
			var output = [for (key in 0 ... currentPos) complete.get(key)];
			return output;
		}
		
		function next() {
			#if multithreaded mutex.acquire(); #end
			if (completed) {
				#if multithreaded mutex.release(); #end
				#if asynctoolstest #if asynctoolstest trace("Outer completed"); #end #end
			}
			else if (!it.hasNext()) {
				if (running > 0) {
					#if multithreaded mutex.release(); #end
					#if asynctoolstest #if asynctoolstest trace('No more items, but still $running running.'); #end #end
				} else if (!completed) {
					completed = true;
					#if multithreaded mutex.release(); #end
					#if asynctoolstest trace('No more items and completed.'); #end
					done(null, completedItems());
				} else {
					#if multithreaded mutex.release(); #end
				}
			} else {
				var nextItem = it.next();
				var currentPos = pos++;
				running++;
				
				#if asynctoolstest trace('NEXT "' + nextItem + '" - currentPos: $currentPos, running: $running'); #end
				
				cb(nextItem, currentPos, function(err, mapped) {
					#if asynctoolstest trace('nextItem done. Err: $err, mapped: $mapped'); #end
					#if multithreaded mutex.acquire(); #end
					if (completed) {
						#if asynctoolstest trace("Inner completed"); #end
						#if multithreaded mutex.release(); #end
					}
					else if (err != null) {
						if (!completed) {
							#if asynctoolstest trace("I AM ERROR"); #end
							completed = true;
							#if multithreaded mutex.release(); #end
							done(err, completedItems());
						} else {
							#if asynctoolstest trace("Race condition - completed already"); #end
							#if multithreaded mutex.release(); #end
						}
					} else {
						#if asynctoolstest trace('Item "$nextItem" done, set to $currentPos, going to next.'); #end
						running--;
						complete.set(currentPos, mapped);
						#if multithreaded mutex.release(); #end
						next();
					}
				});
				
				#if asynctoolstest trace("Current running count: " + running + ", limit: " + limit); #end
				
				if (completed) {
					#if multithreaded mutex.release(); #end
					#if asynctoolstest trace("Lower completed."); #end
				} else if (limit == 0 || running < limit) {
					#if multithreaded mutex.release(); #end
					#if asynctoolstest trace('Limit not reached for "$nextItem", next.'); #end
					next();
				} else {
					#if multithreaded mutex.release(); #end
					#if asynctoolstest trace("Limit 2 reached, do nothing."); #end
				}
			}
		}
		next();
	}	
}
