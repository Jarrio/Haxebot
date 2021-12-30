package firebase.firestore;

import js.lib.Promise;
import firebase.app.FirebaseApp;

/**
 * The Transaction object passed to a transaction's updateFunction provides the methods to read and write data within the transaction context. See runTransaction().
 */
extern class Transaction<T> {
	/**
	 * 	Deletes the document referred to by the provided DocumentReference.
	 * @param documentRef 
	 * @return Promise<Transaction>
	 */
	public function delete(documentRef:DocumentReference<T>):Promise<Transaction<T>>;
	/**
	 * Reads the document referenced by the provided DocumentReference.
	 * @param documentRef 
	 * @return Promise<DocumentSnapshot<T>>
	 */
	public function get(documentRef:DocumentReference<T>):Promise<DocumentSnapshot<T>>;
	/**
	 * Writes to the document referred to by the provided DocumentReference. If the document does not exist yet, it will be created.
	 * @param documentRef 
	 * @return Transaction
	 */
	public function set(documentRef:DocumentReference<T>, data:WithFieldValue<T>):Transaction<T>;
	/**
	 * Writes to the document referred to by the provided DocumentReference. If the document does not exist yet, it will be created. If you provide merge or mergeFields, the provided data can be merged into an existing document.
	 * @param documentRef 
	 * @param data 
	 * @return Transaction
	 */
	/**
	 * Updates fields in the document referred to by the provided DocumentReference. The update will fail if applied to a document that does not exist.Nested fields can be updated by providing dot-separated field path strings or by providing FieldPath objects.
	 */
	@:overload(function(documentRef:DocumentReference<T>, field:String, value:Dynamic, ...more_fields_and_values:Dynamic):Transaction<T> {})
	/**
	 * Updates fields in the document referred to by the provided DocumentReference. The update will fail if applied to a document that does not exist.
	 * @param documentRef 
	 * @param data 
	 * @return Transaction
	 */
	public function update(documentRef:DocumentReference<T>, data:WithFieldValue<T>):Transaction<T>;

}