# AsyncTools

A Haxe implementation of [Async](https://github.com/caolan/async). The most important parts are working:

- aEach, aEachSeries, aEachLimit
- aMap, aMapSeries, aMapLimit
- aFilter, aFilterSeries, aFilterLimit

Also includes a slightly modified version of the `@async` feature in [haxe-js-kit](https://github.com/clemos/haxe-js-kit#asynchronous-programming-experimental)

The change is that you can do this: 

```haxe
class YourClass implements Async {
	function anAsyncMethod(done : Error -> Void) : Void {
		var err = @async(err => done) some.otherAsync();
		// ...
	}
}
```

Which will add an if statement directly after the call:

```haxe
function anAsyncMethod(done : Error -> Void) : Void {
	var err = @async(err => done) some.otherAsync();
	if(err != null) return done(err);
	// ...
}
```

## Installing and using

`haxelib install asynctools`

`using AsyncTools` 

`class YourClass implements Async`
