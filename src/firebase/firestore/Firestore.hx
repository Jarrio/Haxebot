package firebase.firestore;

import js.lib.Promise;
import haxe.extern.EitherType;
import firebase.app.FirebaseApp;

import firebase.firestore.identifiers.WhereFilterOp;
import firebase.firestore.identifiers.OrderByDirection;

@:jsRequire('firebase/firestore')
extern class Firestore {
	public var app:FirebaseApp;
	public var type:String;
	public function toJSON():{};


	/**
	 * Add a new document to specified CollectionReference with the given data, assigning it a document ID automatically.
	 * @param reference A reference to the collection to add this document to.
	 * @param data An Object containing the data for the new document.
	 * @return Promise<DocumentReference<T>>
	 */
	public static function addDoc<T>(reference:CollectionReference<T>, data:WithFieldValue<T>):Promise<DocumentReference<T>>;
	/**
		* Returns a special value that can be used with setDoc() or that tells the server to remove the given elements from any array value that already exists on the server. All instances of each element specified will be removed from the array. 
		* If the field being modified is not already an array it will be overwritten with an empty array.
	 * @param ...elements 
	 * @return FieldValue
	 */
	public static function arrayRemove(...elements:Dynamic):FieldValue;
	/**
	 * Returns a special value that can be used with setDoc() or updateDoc() that tells the server to union the given elements with any array value that already exists on the server. Each specified element that doesn't already exist in the array will be added to the end. If the field being modified is not already an array it will be overwritten with an array containing exactly the specified elements.
	 * @param ...elements 
	 * @return FieldValue
	 */
	public static function arrayUnion(...elements:Dynamic):FieldValue;
	/**
	 * Clears the persistent storage. This includes pending writes and cached documents.
	 * 
	 * Must be called while the Firestore instance is not started (after the app is terminated or when the app is first initialized). On startup, this function must be called before other functions (other than initializeFirestore() or getFirestore())). If the Firestore instance is still running, the promise will be rejected with the error code of failed-precondition.
	 * @param firestore 
	 * @return Promise<Void>
	 */
	public static function clearIndexedDbPersistence(firestore:Firestore):Promise<Void>;

	/**
	 * Gets a CollectionReference instance that refers to a subcollection of reference at the the specified relative path.
	 */
	@:overload(function<T>(reference:CollectionReference<T>, path:String, ...path_segments:String):CollectionReference<T>{})
	@:overload(function<T>(reference:DocumentReference<T>, path:String, ...path_segments:String):CollectionReference<T>{})
	public static function collection<T>(firestore:Firestore, path:String, ...path_segments:String):CollectionReference<T>;
	/**
	 * Creates and returns a new Query instance that includes all documents in the database that are contained in a collection or subcollection with the given collectionId.
	 * @param firestore 
	 * @param collection_id Identifies the collections to query over. Every collection or subcollection with this ID as the last segment of its path will be included. Cannot contain a slash.
	 * @return Query<T>
	 */
	public static function collectionGroup<T>(firestore:Firestore, collection_id:String):Query<T>;
	/**
	 * A Promise resolved once the document has been successfully deleted from the backend (note that it won't resolve while you're offline).
	 * @param reference 
	 * @return Promise<Void>
	 */
	public static function deleteDoc<T>(reference:DocumentReference<T>):Promise<Void>;
	/**
	 * Returns a sentinel for use with updateDoc() or setDoc() with {merge: true} to mark a field for deletion.
	 * @return FieldValue
	 */
	public static function deleteField():FieldValue;
	/**
	 * Disables network usage for this instance. It can be re-enabled via enableNetwork(). While the network is disabled, any snapshot listeners, getDoc() or getDocs() calls will return results from cache, and any write operations will be queued until the network is restored.
	 * @param firestore 
	 * @return Promise<Void>
	 */
	public static function disableNetwork(firestore:Firestore):Promise<Void>;
	/**
	 * Gets a DocumentReference instance that refers to the document at the specified absolute path.
	 * @param firestore 
	 * @param path 
	 * @param ...path_segments 
	 * @return DocumentReference<T>
	 */
	@:overload(function<T>(reference:CollectionReference<T>, path:String, ...path_segments:String):CollectionReference<T> {})
	@:overload(function<T>(reference:DocumentReference<T>, path:String, ...path_segments:String):CollectionReference<T> {})
	public static function doc<T>(firestore:Firestore, path:String, ...path_segments:String):DocumentReference<T>;
	/**
	 * 
	 * @return FieldPath
	 */
	public static function documentId():FieldPath;
	/**
	 * Attempts to enable persistent storage, if possible.
	 * 
	 * https://firebase.google.com/docs/reference/js/firestore_.md#enableindexeddbpersistence
	 * @param firestore 
	 * @param persistence_settings 
	 * @return Promise<Void>
	 */
	public static function enableIndexedDbPersistence(firestore:Firestore, persistence_settings:PersistenceSettings):Promise<Void>;
	/**
	 * Attempts to enable multi-tab persistent storage, if possible. If enabled across all tabs, all operations share access to local persistence, including shared execution of queries and latency-compensated local document updates across all connected instances.
	 * 
	 * https://firebase.google.com/docs/reference/js/firestore_.md#enablemultitabindexeddbpersistence
	 * @param firestore 
	 * @return Promise<Void>
	 */
	public static function enableMultiTabIndexedDbPersistence(firestore:Firestore):Promise<Void>;
	/**
	 * 
	 * @param firestore 
	 * @return Promise<Void>
	 */
	public static function enableNetwork(firestore:Firestore):Promise<Void>;
	/**
	 * Creates a QueryConstraint that modifies the result set to end at the provided document (inclusive). The end position is relative to the order of the query. The document must contain all of the fields provided in the orderBy of the query.
	 * @param value 
	 * @return QueryConstraint
	 */
	public static function endAt<T>(value:DocumentSnapshot<T>):QueryConstraint;
	/**
	 * Creates a QueryConstraint that modifies the result set to end before the provided document (exclusive). The end position is relative to the order of the query. 
	 * The document must contain all of the fields provided in the orderBy of the query.
	 * @param value 
	 * @return QueryConstraint
	 */
	public static function endBefore<T>(value:DocumentSnapshot<T>):QueryConstraint;
	/**
	 * 
	 * @param reference 
	 * @return Promise<DocumentReference<T>>
	 */
	public static function getDoc<T>(reference:DocumentReference<T>):Promise<DocumentReference<T>>;
	/**
	 * 
	 * @param reference 
	 * @return Promise<DocumentReference<T>>
	 */
	public static function getDocFromCache<T>(reference:DocumentReference<T>):Promise<DocumentReference<T>>;
	/**
	 * 
	 * @param reference 
	 * @return Promise<DocumentReference<T>>
	 */
	public static function getDocFromServer<T>(reference:DocumentReference<T>):Promise<DocumentReference<T>>;
	/**
	 * Executes the query and returns the results as a QuerySnapshot.
	 * 
	 * Note: getDocs() attempts to provide up-to-date data when possible by waiting for data from the server, but it may return cached data or fail if you are offline and the server cannot be reached. To specify this behavior, invoke getDocsFromCache() or getDocsFromServer().
	 * @param query 
	 * @return Promise<QuerySnapshot<T>>
	 */
	public static function getDocs<T>(query:Query<T>):Promise<QuerySnapshot<T>>;
	/**
	 * Executes the query and returns the results as a QuerySnapshot from cache. Returns an error if the document is not currently cached.
	 * @param query 
	 * @return Promise<QuerySnapshot<T>>
	 */
	public static function getDocsFromCache<T>(query:Query<T>):Promise<QuerySnapshot<T>>;
	/**
	 * Executes the query and returns the results as a QuerySnapshot from the server. Returns an error if the network is not available.
	 * @param query 
	 * @return Promise<QuerySnapshot<T>>
	 */
	public static function getDocsFromServer<T>(query:Query<T>):Promise<QuerySnapshot<T>>;
	/**
	 * Returns the existing Firestore instance that is associated with the provided FirebaseApp. If no instance exists, initializes a new instance with default settings.
	 * @param app 
	 * @return Firestore
	 */
	public static function getFirestore(app:FirebaseApp):Firestore;
	/**
	 * Returns a special value that can be used with setDoc() or updateDoc() that tells the server to increment the field's current value by the given value.
	 * 
	 * https://firebase.google.com/docs/reference/js/firestore_.md#increment
	 * @param number 
	 * @return FieldValue
	 */
	public static function increment(number:Int):FieldValue;
	/**
	 * Initializes a new instance of Firestore with the provided settings. Can only be called before any other function, including getFirestore(). If the custom settings are empty, this function is equivalent to calling getFirestore().
	 * @param app 
	 * @param settings 
	 * @return Firestore
	 */
	public static function initializeFirestore(app:FirebaseApp, settings:FirestoreSettings):Firestore;
	/**
	 * Creates a QueryConstraint that only returns the first matching documents.
	 * @param limit 
	 * @return QueryConstraint
	 */
	public static function limit(limit:Int):QueryConstraint;

	/**
	 * Creates a QueryConstraint that only returns the last matching documents.
	 * You must specify at least one orderBy clause for limitToLast queries, otherwise an exception will be thrown during execution.
	 * @param limit 
	 * @return QueryConstraint
	 */
	public static function limitToLast(limit:Int):QueryConstraint;
	/**
	 * 
	 * @param firestore 
	 * @param name 
	 * @return Promise<Query<T>>
	 */
	public static function namedQuery<T>(firestore:Firestore, name:String):Promise<Query<T>>;
	/**
	 * Attaches a listener for QuerySnapshot events. You may either pass individual onNext and onError callbacks or pass a single observer object with next and error callbacks. The listener can be cancelled by calling the function that is returned when onSnapshot is called.
	 * NOTE: Although an onCompletion callback can be provided, it will never be called because the snapshot stream is never-ending.
	 */
	@:overload(function<T>(reference:DocumentReference<T>, options:SnapshotListenOptions, callback:TObserver<DocumentSnapshot<T>>):Unsubscribe {})
	@:overload(function<T>(reference:DocumentReference<T>, on_next:(snapshot:DocumentSnapshot<T>)->Void, ?on_error:(error:FirestoreError)->Void, ?on_complete:()->Void):Unsubscribe {})
	@:overload(function<T>(query:Query<T>, on_next:(snapshot:QuerySnapshot<T>)->Void, ?on_error:(error:FirestoreError)->Void, ?on_complete:()->Void):Unsubscribe {})
	@:overload(function<T>(query:Query<T>, callback:TObserver<QuerySnapshot<T>>):Unsubscribe {})
	public static function onSnapshot<T>(reference:DocumentReference<T>, callback:TObserver<DocumentSnapshot<T>>):Unsubscribe;
	/**
	 * Attaches a listener for a snapshots-in-sync event. The snapshots-in-sync event indicates that all listeners affected by a given change have fired, even if a single server-generated change affects multiple listeners.
	 * NOTE: The snapshots-in-sync event only indicates that listeners are in sync with each other, but does not relate to whether those snapshots are in sync with the server. Use SnapshotMetadata in the individual listeners to determine if a snapshot is from the cache or the server.
	 */
	public static function onSnapshotInSync<T>(reference:DocumentReference<T>, on_sync:(_:Void)->Void):Unsubscribe;
	/**
	 * Creates a QueryConstraint that sorts the query result by the specified field, optionally in descending order instead of ascending.
	 * @param fieldPath 
	 * @param direction 
	 * @return QueryConstraint
	 */
	public static function orderBy(field_path:String, ?direction:OrderByDirection):QueryConstraint;
	/**
	 * Creates a new immutable instance of Query that is extended to also include additional query constraints.
	 * @param query 
	 * @param ...query_constraints 
	 * @return Query<T>
	 */
	public static function query<T>(query:Query<T>, ...query_constraints:QueryConstraint):Query<T>;
	/**
	 * 
	 * @param left 
	 * @param right 
	 * @return Bool
	 */
	public static function queryEqual<T>(left:Query<T>, right:Query<T>):Bool;
	/**
	 * 
	 * @param left 
	 * @param right 
	 * @return Bool
	 */
	public static function refEqual<T>(left:EitherType<CollectionReference<T>, DocumentReference<T>>, right:EitherType<CollectionReference<T>, DocumentReference<T>>):Bool;
	/**
	 * Executes the given updateFunction and then attempts to commit the changes applied within the transaction. If any document read within the transaction has changed, Cloud Firestore retries the updateFunction. If it fails to commit after 5 attempts, the transaction fails.
	 * 
	 * The maximum number of writes allowed in a single transaction is 500.
	 * @param firestore 
	 * @param update_function 
	 * @return ->Promise<T>):Promise<T>
	 */
	public static function runTransaction<T>(firestore:Firestore, update_function:(transaction:Transaction<T>)->Promise<T>):Promise<T>;
	/**
	 * Returns a sentinel used with setDoc() or updateDoc() to include a server-generated timestamp in the written data.
	 * @return FieldValue
	 */
	public static function serverTimestamp():FieldValue;
	/**
	 * Writes to the document referred to by the specified DocumentReference. If the document does not yet exist, it will be created. If you provide merge or mergeFields, the provided data can be merged into an existing document.
	 * @param refenrence 
	 * @param data 
	 * @param options 
	 * @return Promise<Void>
	 */
	public static function setDoc<T>(refenrence:DocumentReference<T>, data:WithFieldValue<T>, ?options:SetOptions):Promise<Void>;
	public static function setLogLevel(log_level:LogLevel):Void;
	/**
	 * Returns true if the provided snapshots are equal.
	 * @param left 
	 * @param right 
	 * @return Bool
	 */
	public static function snapshotEqual<T>(left:DocumentSnapshot<T>, right:DocumentSnapshot<T>):Bool;
	/**
	 * Creates a QueryConstraint that modifies the result set to start at the provided document (inclusive). 
	 * The starting position is relative to the order of the query. The document must contain all of the fields provided in the orderBy of this query.
	 * @param value 
	 * @return QueryConstraint
	 */
	public static function startAt<T>(value:DocumentSnapshot<T>):QueryConstraint;
	/**
	 * Creates a QueryConstraint that modifies the result set to start after the provided document (exclusive). 
	 * The starting position is relative to the order of the query. The document must contain all of the fields provided in the orderBy of the query.
	 * @param value 
	 * @return QueryConstraint
	 */
	public static function startAfter<T>(value:DocumentSnapshot<T>):QueryConstraint;
	/**
	 * Terminates the provided Firestore instance.
	 * After calling terminate() only the clearIndexedDbPersistence() function may be used. Any other function will throw a FirestoreError.
	 * To restart after termination, create a new instance of FirebaseFirestore with getFirestore().
	 * https://firebase.google.com/docs/reference/js/firestore_.md#terminate
	 * @param firestore 
	 * @return Promise<Void>
	 */
	public static function terminate(firestore:Firestore):Promise<Void>;
	/**
	 * Updates fields in the document referred to by the specified DocumentReference The update will fail if applied to a document that does not exist.
	 */
	@:overload(function<T>(reference:DocumentReference<T>, field:String, value:Dynamic, ...more_fields_and_values:Any):Promise<Void> {})
	public static function updateDoc<T>(referennce:DocumentReference<T>, data:WithFieldValue<T>):Promise<Void>;
	/**
	 * Waits until all currently pending writes for the active user have been acknowledged by the backend.
	 * The returned promise resolves immediately if there are no outstanding writes. Otherwise, the promise waits for all previously issued writes (including those written in a previous app session), but it does not wait for writes that were added after the function is called. If you want to wait for additional writes, call waitForPendingWrites() again.
	 * @param firestore 
	 * @return Promise<Void>
	 */
	public static function waitForPendingWrites(firestore:Firestore):Promise<Void>;
	/**
	 * Creates a QueryConstraint that enforces that documents must contain the specified field and that the value should satisfy the relation constraint provided.
	 * @param field_path 
	 * @param filter_operation 
	 * @param value 
	 * @return QueryConstraint
	 */
	public static function where(field_path:String, filter_operation:WhereFilterOp, value:Any):QueryConstraint;
	/**
		* Creates a write batch, used for performing multiple writes as a single atomic operation. The maximum number of writes allowed in a single WriteBatch is 500.
		* Unlike transactions, write batches are persisted offline and therefore are preferable when you don't need to condition your writes on read data.
	 * @param firestore 
	 * @return WriteBatch
	 */
	public static function writeBatch<T>(firestore:Firestore):WriteBatch<T>;
	
}

typedef SetOptions = {
	@:optional var merge:Bool;
	@:optional var mergeFields:Array<String>;
}

enum abstract LogLevel(String) {
	var silent;
	/**
	 * to log errors only.
	 */
	var error;
	/**
	 * for the most verbose logging level, primarily for debugging.
	 */
	var debug;
}

typedef PersistenceSettings = {
	/**
	 * Whether to force enable persistence for the client. This cannot be used with multi-tab synchronization and is primarily intended for use with Web Workers. Setting this to true will enable persistence, but cause other tabs using persistence to fail.
	 */
	@:optional var forceOwnership:Bool;
}

typedef FirestoreSettings = {
	/**
	 * Whether to use SSL when connecting.
	 */
	@:optional var ssl:Bool;
	/**
	 * Whether to skip nested properties that are set to undefined during object serialization. If set to true, these properties are skipped and not written to Firestore. If set to false or omitted, the SDK throws an exception when it encounters properties of type undefined
	 */
	@:optional var ignoreUndefinedProperties:Bool;
	/**
	 * The hostname to connect to.
	 */
	@:optional var host:String;
	/**
	 * Forces the SDK’s underlying network transport (WebChannel) to use long-polling.
	 * 
	 * https://firebase.google.com/docs/reference/js/firestore_.firestoresettings.md#firestoresettingsexperimentalforcelongpolling
	 */
	@:optional var experimentalForceLongPolling:Bool;
	/**
	 * Configures the SDK's underlying transport (WebChannel) to automatically detect if long-polling should be used. This is very similar to experimentalForceLongPolling, but only uses long-polling if required.
	 * This setting will likely be enabled by default in future releases and cannot be combined with experimentalForceLongPolling.
	 */
	@:optional var experimentalAutoDetectLongPolling:Bool;
	/**
	 * An approximate cache size threshold for the on-disk data. If the cache grows beyond this size, Firestore will start removing data that hasn't been recently used. The size is not a guarantee that the cache will stay below that size, only that if the cache exceeds the given size, cleanup will be attempted.
	 * 
	 * The default value is 40 MB. The threshold must be set to at least 1 MB, and can be set to CACHE_SIZE_UNLIMITED to disable garbage collection.
	 */
	@:optional var cacheSizeBytes:Int;
}

typedef TObserver<T> = {
	@:optional var next:(snapshot:T)->Void;
	@:optional var error:(error:FirestoreError)->Void;
	@:optional var complete:()->Void;
}