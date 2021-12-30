package firebase.firestore;
import firebase.firestore.identifiers.TypeId;
import js.lib.Promise;
import haxe.extern.EitherType;
import haxe.Constraints.Function;
/**
 * A Query refers to a Query which you can read or listen to. You can also construct refined Query objects by adding filters and ordering.
 */
@:jsRequire('firebase/firestore')
extern class Query<T> {
	private function new();
	public var converter:FirestoreDataConverter<T>;
	public var firestore:Firestore;
	public var type:TypeId;
	public static function withConverter<U>(converter:FirestoreDataConverter<U>):Query<U>;
}





