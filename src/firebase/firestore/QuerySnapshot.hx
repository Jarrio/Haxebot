package firebase.firestore;
/**
 * A QuerySnapshot contains zero or more DocumentSnapshot objects representing the results of a query. The documents can be accessed as an array via the docs property or enumerated using the forEach method. The number of documents can be determined via the empty and size properties.
 */
extern class QuerySnapshot<T> {
	/**
	 * An array of all the documents in the QuerySnapshot.
	 */
	public var docs:Array<QueryDocumentSnapshot<T>>;
	/**
	 * True if there are no documents in the QuerySnapshot.
	 */
	public var empty:Bool;
	/**
	 * Metadata about this snapshot, concerning its source and if it has local modifications.
	 */
	public var metadata:SnapshotMetadata;
	/**
	 * The query on which you called get or onSnapshot in order to get this QuerySnapshot.
	 */
	public var query:Query<T>;
	/**
	 * The number of documents in the QuerySnapshot.
	 */
	public var size:Int;
	/**
	 * Returns an array of the documents changes since the last snapshot. If this is the first snapshot, all documents will be in the list as 'added' changes.
	 * @param options 
	 * @return Array<T>
	 */
	public function docChanges(options:SnapshotListenOptions):Array<T>;
	public function forEach(callback:(result:QueryDocumentSnapshot<T>) -> Void, ?this_arg:Dynamic):Void;
}