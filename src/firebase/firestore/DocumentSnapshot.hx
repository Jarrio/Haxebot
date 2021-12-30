package firebase.firestore;

/**
	* A DocumentSnapshot contains data read from a document in your Firestore database. The data can be extracted with .data() or .get(<field>) to get a specific field.
	* 
 * For a DocumentSnapshot that points to a non-existing document, any data access will return 'undefined'. You can use the exists() method to explicitly verify a document's existence.
 */
extern class DocumentSnapshot<T> {
	private function new();
	/**
	 * Property of the DocumentSnapshot that provides the document's ID.
	 */
	public var id:String;
	/**
	 * 	Metadata about the DocumentSnapshot, including information about its source and local modifications.
	 */
	public var metadata:SnapshotMetadata;
	/**
	 * The DocumentReference for the document included in the DocumentSnapshot.
	 */
	public var ref:DocumentReference<T>;
	/**
	 * Retrieves all fields in the document as an Object. Returns undefined if the document doesn't exist.By default, FieldValue.serverTimestamp() values that have not yet been set to their final value will be returned as null. You can override this by passing an options object.
	 * @param options 
	 * @return Null<T>
	 */
	public function data(?options:SnapshotOptions):Null<T>;
	/**
	 * Property of the DocumentSnapshot that signals whether or not the data exists. True if the document exists.
	 * @return QueryDocumentSnapshot<T>
	 */
	public function exists():QueryDocumentSnapshot<T>;
	/**
	 * Retrieves the field specified by fieldPath. Returns undefined if the document or field doesn't exist.
	 * By default, a FieldValue.serverTimestamp() that has not yet been set to its final value will be returned as null. You can override this by passing an options object.
	 * @param path 
	 * @param options 
	 * @return Any
	 */
	public function get(path:String, ?options:SnapshotOptions):Any;
}