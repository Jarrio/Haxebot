package firebase.firestore;

/**
 * An options object that can be passed to onSnapshot() and QuerySnapshot.docChanges() to control which types of changes to include in the result set.
 */
typedef SnapshotListenOptions = {
	/**
	 * Include a change even if only the metadata of the query or of a document changed. Default is false.
	 */
	@:optional var includeMetadataChanges:Bool;
}
