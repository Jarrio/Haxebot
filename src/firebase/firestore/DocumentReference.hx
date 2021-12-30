package firebase.firestore;

import firebase.firestore.identifiers.TypeId;

/**
 * A DocumentReference refers to a document location in a Firestore database and can be used to write, read, or listen to the location. The document at the referenced location may or may not exist.
 */
extern class DocumentReference<T> {
	/**
	 * If provided, the FirestoreDataConverter associated with this instance.
	 */
	public var converter:Null<FirestoreDataConverter<T>>;
	/**
	 * The Firestore instance the document is in. This is useful for performing transactions, for example.
	 */
	public var firestore:Firestore;
	/**
	 * 	The document's identifier within its collection.
	 */
	public var id:String;
	/**
	 * The collection this DocumentReference belongs to.
	 */
	public var parent:CollectionReference<T>;
	/**
	 * A string representing the path of the referenced document (relative to the root of the database).
	 */
	public var path:String;
	/**
	 * The type of this Firestore reference.
	 */
	public var type:TypeId;
	/**
		* Applies a custom data converter to this DocumentReference, allowing you to use your own custom model objects with Firestore. When you call setDoc(), getDoc(), etc. With the returned DocumentReference instance, the provided converter will convert between Firestore data and your custom type U.
		* 
		* Null removes the current converter
	 * @param converter 
	 * @return DocumentReference<U>
	 */
	public static function withConverter<U>(converter:Null<FirestoreDataConverter<U>>):DocumentReference<U>;
}