package firebase.firestore;

/**
	* A FieldPath refers to a field in a document. The path may consist of a single field name (referring to a top-level field in the document), or a list of field names (referring to a nested field in the document).
	* 
	* Create a FieldPath by providing field names. If more than one field name is provided, the path will point to a nested field in a document.
 	*/
extern class FieldPath {
	public function new(...field_names:String);
	/**
	 * Compares FieldValues for equality.
	 * @param other 
	 * @return Bool
	 */
	public function isEqual(other:FieldPath):Bool;
}