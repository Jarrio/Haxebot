package firebase.app;

@:jsRequire('firebase/app')
extern class FirebaseApp {
	public var name:String;
	public var options:{};
	public var automaticDataCollectionEnabled:Bool;
	public static function getApp(?name:String):FirebaseApp;
	public static function getApps():Array<FirebaseApp>;
	public static function deleteApp(?app:FirebaseApp):FirebaseApp;
	@:overload(function(options:FirebaseOptions, ?config:FirebaseAppSettings):FirebaseApp{})
	public static function initializeApp(options:FirebaseOptions, ?name:String):FirebaseApp;
	public static function onLog(logCallback:Null<Dynamic->Void>, options:{}):Void;
	public static function setLogLevel(loglevel:String):Void;
}

typedef LogOptions = {}

typedef FirebaseOptions = {
	var apiKey:String;
	var appId:String;
	var authDomain:String;
	var databaseURL:String;
	var measurementId:String;
	var messagingSenderId:String;
	var projectId:String;
	var storageBucket:String;
}

typedef FirebaseAppSettings = {
	var name:String;
	var automaticDataCollectionEnabled:Bool;
}
