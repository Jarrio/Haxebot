package firebase.firestore;

import js.lib.Promise;

extern class WriteBatch<T> {
	/**
	 * Commits all of the writes in this write batch as a single atomic unit.
	 * The result of these writes will only be reflected in document reads that occur after the returned promise resolves. If the client is offline, the write fails. If you would like to see local modifications or buffer writes until the client is online, use the full Firestore SDK.
	 * @return Promise<Void>
	 */
	public function commit():Promise<Void>;
	/**
		* Deletes the document referred to by the provided DocumentReference.
	 * @return WriteBatch
	 */
	public function delete(doc_ref:DocumentReference<T>):WriteBatch<T>;
	/**
	 * Writes to the document referred to by the provided DocumentReference. If the document does not exist yet, it will be created.
	 * @param doc_ref 
	 * @param data 
	 * @return WriteBatch<T>
	 */
	public function set(doc_ref:DocumentReference<T>, data:WithFieldValue<T>):WriteBatch<T>;
	/**
	 * Updates fields in the document referred to by the provided DocumentReference. The update will fail if applied to a document that does not exist.
	 * @param doc_ref 
	 * @param data 
	 * @return WriteBatch<T>
	 */
	@:overload(function(doc_ref : DocumentReference<T>, field:String, value:Dynamic, ...more:Dynamic) : WriteBatch<T>{})
	public function update(doc_ref:DocumentReference<T>, data:UpdateData<T>):WriteBatch<T>;
}