package firebase.firestore.identifiers;

enum abstract QueryConstraintType(String) {
	var where;
	var orderBy;
	var limit;
	var limitToLast;
	var startAt;
	var startAfter;
	var endAt;
	var endBefore;
}