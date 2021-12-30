package firebase.firestore;

extern class FirestoreError {
	public var code:FirestoreErrorCode;
	public var message:String;
	public var name:String;
	public var stack:String;
}

enum abstract FirestoreErrorCode(String) {
	var cancelled;
	var unknown;
	var invalid_argument = 'invalid-argument';
	var deadline_exceeded = 'deadline-exceeded';
	var not_found = 'not-found';
	var already_exists = 'already-exists';
	var permission_denied = 'permission-denied';
	var resource_exhausted = 'resource-exhausted';
	var failed_precondition = 'failed-precondition';
	var aborted = 'aborted';
	var out_of_range = 'out-of-range';
	var unimplemented;
	var internal;
	var unavailable;
	var data_loss = 'data-loss';
	var unauthenticated;
}