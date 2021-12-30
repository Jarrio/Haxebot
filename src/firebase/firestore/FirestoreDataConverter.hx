package firebase.firestore;

extern class FirestoreDataConverter<T> {
	public function fromFirestore(snapshot:QueryDocumentSnapshot<T>, ?options:{}):T;
}