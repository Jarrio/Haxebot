package firebase.firestore;

/**
 * A CollectionReference object can be used for adding documents, getting document references, and querying for documents (using the methods inherited from Query).
 */
extern class CollectionReference<T> extends Query<T> {
	/**
	 * The document's identifier within its collection.
	 */
	public var id:String;
	/**
	 * A string representing the path of the referenced document (relative to the root of the database).
	 */
	public var path:String;
	/**
	 * The Collection this DocumentReference belongs to.
	 */
	// public var parent:DocumentReference<T>;
	public var parent:Null<DocumentReference<T>>;
}