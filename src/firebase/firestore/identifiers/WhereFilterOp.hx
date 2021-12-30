package firebase.firestore.identifiers;

/**
 * Filter conditions in a Query.where() clause are specified using the strings '<', '<=', '==', '>=', '>', and 'array-contains'.
 */
@:enum abstract WhereFilterOp(String) from String {
	var LESS = "<";
	var LESS_EQUALS = "<=";
	var GREATER = ">";
	var GREATER_EQUALS = ">=";
	var EQUAL_TO = "==";
	var DOES_NOT_EQUAL_TO = "!=";
	var ARRAY_CONTAINS = "array-contains";
	var ARRAY_CONTAINS_ANY = "array-contains-any";
	var IN = "in";
	var NOT_IN = "not-in";
}