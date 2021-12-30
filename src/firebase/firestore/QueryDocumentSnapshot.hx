package firebase.firestore;
/**
	* A QueryDocumentSnapshot contains data read from a document in your Firestore database as part of a query. The document is guaranteed to exist and its data can be extracted with .data() or .get(<field>) to get a specific field.
	* 
	* A QueryDocumentSnapshot offers the same API surface as a DocumentSnapshot. Since query results contain only existing documents, the exists property will always be true and data() will never return 'undefined'.
 */
extern class QueryDocumentSnapshot<T> extends DocumentSnapshot<T> {
	/**
	 * Retrieves all fields in the document as an Object.
	 *By default, FieldValue.serverTimestamp() values that have not yet been set to their final value will be returned as null. You can override this by passing an options object.
	 * @param options 
	 * @return T
	 */
	override function data(?options:SnapshotOptions):T;
}