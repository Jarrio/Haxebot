package firebase.firestore.identifiers;

@:enum abstract OrderByDirection(String) {
	var ASCENDING = "asc";
	var DESCENDING = "desc";
}