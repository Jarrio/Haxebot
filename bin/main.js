// 1
const { Routes } = require('discord-api-types/v9');
;(function ($global) { "use strict";
var $hxClasses = {},$estr = function() { return js_Boot.__string_rec(this,''); },$hxEnums = $hxEnums || {},$_;
function $extend(from, fields) {
	var proto = Object.create(from);
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var DateTools = function() { };
$hxClasses["DateTools"] = DateTools;
DateTools.__name__ = "DateTools";
DateTools.__format_get = function(d,e) {
	switch(e) {
	case "%":
		return "%";
	case "A":
		return DateTools.DAY_NAMES[d.getDay()];
	case "B":
		return DateTools.MONTH_NAMES[d.getMonth()];
	case "C":
		return StringTools.lpad(Std.string(d.getFullYear() / 100 | 0),"0",2);
	case "D":
		return DateTools.__format(d,"%m/%d/%y");
	case "F":
		return DateTools.__format(d,"%Y-%m-%d");
	case "M":
		return StringTools.lpad(Std.string(d.getMinutes()),"0",2);
	case "R":
		return DateTools.__format(d,"%H:%M");
	case "S":
		return StringTools.lpad(Std.string(d.getSeconds()),"0",2);
	case "T":
		return DateTools.__format(d,"%H:%M:%S");
	case "Y":
		return Std.string(d.getFullYear());
	case "a":
		return DateTools.DAY_SHORT_NAMES[d.getDay()];
	case "d":
		return StringTools.lpad(Std.string(d.getDate()),"0",2);
	case "e":
		return Std.string(d.getDate());
	case "b":case "h":
		return DateTools.MONTH_SHORT_NAMES[d.getMonth()];
	case "H":case "k":
		return StringTools.lpad(Std.string(d.getHours()),e == "H" ? "0" : " ",2);
	case "I":case "l":
		var hour = d.getHours() % 12;
		return StringTools.lpad(Std.string(hour == 0 ? 12 : hour),e == "I" ? "0" : " ",2);
	case "m":
		return StringTools.lpad(Std.string(d.getMonth() + 1),"0",2);
	case "n":
		return "\n";
	case "p":
		if(d.getHours() > 11) {
			return "PM";
		} else {
			return "AM";
		}
		break;
	case "r":
		return DateTools.__format(d,"%I:%M:%S %p");
	case "s":
		return Std.string(d.getTime() / 1000 | 0);
	case "t":
		return "\t";
	case "u":
		var t = d.getDay();
		if(t == 0) {
			return "7";
		} else if(t == null) {
			return "null";
		} else {
			return "" + t;
		}
		break;
	case "w":
		return Std.string(d.getDay());
	case "y":
		return StringTools.lpad(Std.string(d.getFullYear() % 100),"0",2);
	default:
		throw new haxe_exceptions_NotImplementedException("Date.format %" + e + "- not implemented yet.",null,{ fileName : "DateTools.hx", lineNumber : 101, className : "DateTools", methodName : "__format_get"});
	}
};
DateTools.__format = function(d,f) {
	var r_b = "";
	var p = 0;
	while(true) {
		var np = f.indexOf("%",p);
		if(np < 0) {
			break;
		}
		var len = np - p;
		r_b += len == null ? HxOverrides.substr(f,p,null) : HxOverrides.substr(f,p,len);
		r_b += Std.string(DateTools.__format_get(d,HxOverrides.substr(f,np + 1,1)));
		p = np + 2;
	}
	var len = f.length - p;
	r_b += len == null ? HxOverrides.substr(f,p,null) : HxOverrides.substr(f,p,len);
	return r_b;
};
DateTools.format = function(d,f) {
	return DateTools.__format(d,f);
};
DateTools.delta = function(d,t) {
	return new Date(d.getTime() + t);
};
DateTools.getMonthDays = function(d) {
	var month = d.getMonth();
	var year = d.getFullYear();
	if(month != 1) {
		return DateTools.DAYS_OF_MONTH[month];
	}
	var isB = year % 4 == 0 && year % 100 != 0 || year % 400 == 0;
	if(isB) {
		return 29;
	} else {
		return 28;
	}
};
DateTools.seconds = function(n) {
	return n * 1000.0;
};
DateTools.minutes = function(n) {
	return n * 60.0 * 1000.0;
};
DateTools.hours = function(n) {
	return n * 60.0 * 60.0 * 1000.0;
};
DateTools.days = function(n) {
	return n * 24.0 * 60.0 * 60.0 * 1000.0;
};
DateTools.parse = function(t) {
	var s = t / 1000;
	var m = s / 60;
	var h = m / 60;
	return { ms : t % 1000, seconds : s % 60 | 0, minutes : m % 60 | 0, hours : h % 24 | 0, days : h / 24 | 0};
};
DateTools.make = function(o) {
	return o.ms + 1000.0 * (o.seconds + 60.0 * (o.minutes + 60.0 * (o.hours + 24.0 * o.days)));
};
DateTools.makeUtc = function(year,month,day,hour,min,sec) {
	return Date.UTC(year,month,day,hour,min,sec);
};
var EReg = function(r,opt) {
	this.r = new RegExp(r,opt.split("u").join(""));
};
$hxClasses["EReg"] = EReg;
EReg.__name__ = "EReg";
EReg.escape = function(s) {
	return s.replace(EReg.escapeRe,"\\$&");
};
EReg.prototype = {
	r: null
	,match: function(s) {
		if(this.r.global) {
			this.r.lastIndex = 0;
		}
		this.r.m = this.r.exec(s);
		this.r.s = s;
		return this.r.m != null;
	}
	,matched: function(n) {
		if(this.r.m != null && n >= 0 && n < this.r.m.length) {
			return this.r.m[n];
		} else {
			throw haxe_Exception.thrown("EReg::matched");
		}
	}
	,matchedLeft: function() {
		if(this.r.m == null) {
			throw haxe_Exception.thrown("No string matched");
		}
		return HxOverrides.substr(this.r.s,0,this.r.m.index);
	}
	,matchedRight: function() {
		if(this.r.m == null) {
			throw haxe_Exception.thrown("No string matched");
		}
		var sz = this.r.m.index + this.r.m[0].length;
		return HxOverrides.substr(this.r.s,sz,this.r.s.length - sz);
	}
	,matchedPos: function() {
		if(this.r.m == null) {
			throw haxe_Exception.thrown("No string matched");
		}
		return { pos : this.r.m.index, len : this.r.m[0].length};
	}
	,matchSub: function(s,pos,len) {
		if(len == null) {
			len = -1;
		}
		if(this.r.global) {
			this.r.lastIndex = pos;
			this.r.m = this.r.exec(len < 0 ? s : HxOverrides.substr(s,0,pos + len));
			var b = this.r.m != null;
			if(b) {
				this.r.s = s;
			}
			return b;
		} else {
			var b = this.match(len < 0 ? HxOverrides.substr(s,pos,null) : HxOverrides.substr(s,pos,len));
			if(b) {
				this.r.s = s;
				this.r.m.index += pos;
			}
			return b;
		}
	}
	,split: function(s) {
		return s.replace(this.r,"#__delim__#").split("#__delim__#");
	}
	,replace: function(s,by) {
		return s.replace(this.r,by);
	}
	,map: function(s,f) {
		var offset = 0;
		var buf_b = "";
		do {
			if(offset >= s.length) {
				break;
			} else if(!this.matchSub(s,offset)) {
				buf_b += Std.string(HxOverrides.substr(s,offset,null));
				break;
			}
			var p = this.matchedPos();
			buf_b += Std.string(HxOverrides.substr(s,offset,p.pos - offset));
			buf_b += Std.string(f(this));
			if(p.len == 0) {
				buf_b += Std.string(HxOverrides.substr(s,p.pos,1));
				offset = p.pos + 1;
			} else {
				offset = p.pos + p.len;
			}
		} while(this.r.global);
		if(!this.r.global && offset > 0 && offset < s.length) {
			buf_b += Std.string(HxOverrides.substr(s,offset,null));
		}
		return buf_b;
	}
	,__class__: EReg
};
var EnumValue = {};
EnumValue.match = function(this1,pattern) {
	return false;
};
var HxOverrides = function() { };
$hxClasses["HxOverrides"] = HxOverrides;
HxOverrides.__name__ = "HxOverrides";
HxOverrides.dateStr = function(date) {
	var m = date.getMonth() + 1;
	var d = date.getDate();
	var h = date.getHours();
	var mi = date.getMinutes();
	var s = date.getSeconds();
	return date.getFullYear() + "-" + (m < 10 ? "0" + m : "" + m) + "-" + (d < 10 ? "0" + d : "" + d) + " " + (h < 10 ? "0" + h : "" + h) + ":" + (mi < 10 ? "0" + mi : "" + mi) + ":" + (s < 10 ? "0" + s : "" + s);
};
HxOverrides.strDate = function(s) {
	switch(s.length) {
	case 8:
		var k = s.split(":");
		var d = new Date();
		d["setTime"](0);
		d["setUTCHours"](k[0]);
		d["setUTCMinutes"](k[1]);
		d["setUTCSeconds"](k[2]);
		return d;
	case 10:
		var k = s.split("-");
		return new Date(k[0],k[1] - 1,k[2],0,0,0);
	case 19:
		var k = s.split(" ");
		var y = k[0].split("-");
		var t = k[1].split(":");
		return new Date(y[0],y[1] - 1,y[2],t[0],t[1],t[2]);
	default:
		throw haxe_Exception.thrown("Invalid date format : " + s);
	}
};
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) {
		return undefined;
	}
	return x;
};
HxOverrides.substr = function(s,pos,len) {
	if(len == null) {
		len = s.length;
	} else if(len < 0) {
		if(pos == 0) {
			len = s.length + len;
		} else {
			return "";
		}
	}
	return s.substr(pos,len);
};
HxOverrides.indexOf = function(a,obj,i) {
	var len = a.length;
	if(i < 0) {
		i += len;
		if(i < 0) {
			i = 0;
		}
	}
	while(i < len) {
		if(((a[i]) === obj)) {
			return i;
		}
		++i;
	}
	return -1;
};
HxOverrides.lastIndexOf = function(a,obj,i) {
	var len = a.length;
	if(i >= len) {
		i = len - 1;
	} else if(i < 0) {
		i += len;
	}
	while(i >= 0) {
		if(((a[i]) === obj)) {
			return i;
		}
		--i;
	}
	return -1;
};
HxOverrides.remove = function(a,obj) {
	var i = a.indexOf(obj);
	if(i == -1) {
		return false;
	}
	a.splice(i,1);
	return true;
};
HxOverrides.iter = function(a) {
	return { cur : 0, arr : a, hasNext : function() {
		return this.cur < this.arr.length;
	}, next : function() {
		return this.arr[this.cur++];
	}};
};
HxOverrides.keyValueIter = function(a) {
	return new haxe_iterators_ArrayKeyValueIterator(a);
};
HxOverrides.now = function() {
	return Date.now();
};
var IntIterator = function(min,max) {
	this.min = min;
	this.max = max;
};
$hxClasses["IntIterator"] = IntIterator;
IntIterator.__name__ = "IntIterator";
IntIterator.prototype = {
	min: null
	,max: null
	,hasNext: function() {
		return this.min < this.max;
	}
	,next: function() {
		return this.min++;
	}
	,__class__: IntIterator
};
var Lambda = function() { };
$hxClasses["Lambda"] = Lambda;
Lambda.__name__ = "Lambda";
Lambda.array = function(it) {
	var a = [];
	var i = $getIterator(it);
	while(i.hasNext()) {
		var i1 = i.next();
		a.push(i1);
	}
	return a;
};
Lambda.list = function(it) {
	var l = new haxe_ds_List();
	var i = $getIterator(it);
	while(i.hasNext()) {
		var i1 = i.next();
		l.add(i1);
	}
	return l;
};
Lambda.map = function(it,f) {
	var _g = [];
	var x = $getIterator(it);
	while(x.hasNext()) {
		var x1 = x.next();
		_g.push(f(x1));
	}
	return _g;
};
Lambda.mapi = function(it,f) {
	var i = 0;
	var _g = [];
	var x = $getIterator(it);
	while(x.hasNext()) {
		var x1 = x.next();
		_g.push(f(i++,x1));
	}
	return _g;
};
Lambda.flatten = function(it) {
	var _g = [];
	var e = $getIterator(it);
	while(e.hasNext()) {
		var e1 = e.next();
		var x = $getIterator(e1);
		while(x.hasNext()) {
			var x1 = x.next();
			_g.push(x1);
		}
	}
	return _g;
};
Lambda.flatMap = function(it,f) {
	var _g = [];
	var x = $getIterator(it);
	while(x.hasNext()) {
		var x1 = x.next();
		_g.push(f(x1));
	}
	var _g1 = [];
	var e = $getIterator(_g);
	while(e.hasNext()) {
		var e1 = e.next();
		var x = $getIterator(e1);
		while(x.hasNext()) {
			var x1 = x.next();
			_g1.push(x1);
		}
	}
	return _g1;
};
Lambda.has = function(it,elt) {
	var x = $getIterator(it);
	while(x.hasNext()) {
		var x1 = x.next();
		if(x1 == elt) {
			return true;
		}
	}
	return false;
};
Lambda.exists = function(it,f) {
	var x = $getIterator(it);
	while(x.hasNext()) {
		var x1 = x.next();
		if(f(x1)) {
			return true;
		}
	}
	return false;
};
Lambda.foreach = function(it,f) {
	var x = $getIterator(it);
	while(x.hasNext()) {
		var x1 = x.next();
		if(!f(x1)) {
			return false;
		}
	}
	return true;
};
Lambda.iter = function(it,f) {
	var x = $getIterator(it);
	while(x.hasNext()) {
		var x1 = x.next();
		f(x1);
	}
};
Lambda.filter = function(it,f) {
	var _g = [];
	var x = $getIterator(it);
	while(x.hasNext()) {
		var x1 = x.next();
		if(f(x1)) {
			_g.push(x1);
		}
	}
	return _g;
};
Lambda.fold = function(it,f,first) {
	var x = $getIterator(it);
	while(x.hasNext()) {
		var x1 = x.next();
		first = f(x1,first);
	}
	return first;
};
Lambda.foldi = function(it,f,first) {
	var i = 0;
	var x = $getIterator(it);
	while(x.hasNext()) {
		var x1 = x.next();
		first = f(x1,first,i);
		++i;
	}
	return first;
};
Lambda.count = function(it,pred) {
	var n = 0;
	if(pred == null) {
		var _ = $getIterator(it);
		while(_.hasNext()) {
			_.next();
			++n;
		}
	} else {
		var x = $getIterator(it);
		while(x.hasNext()) {
			var x1 = x.next();
			if(pred(x1)) {
				++n;
			}
		}
	}
	return n;
};
Lambda.empty = function(it) {
	return !$getIterator(it).hasNext();
};
Lambda.indexOf = function(it,v) {
	var i = 0;
	var v2 = $getIterator(it);
	while(v2.hasNext()) {
		var v21 = v2.next();
		if(v == v21) {
			return i;
		}
		++i;
	}
	return -1;
};
Lambda.find = function(it,f) {
	var v = $getIterator(it);
	while(v.hasNext()) {
		var v1 = v.next();
		if(f(v1)) {
			return v1;
		}
	}
	return null;
};
Lambda.findIndex = function(it,f) {
	var i = 0;
	var v = $getIterator(it);
	while(v.hasNext()) {
		var v1 = v.next();
		if(f(v1)) {
			return i;
		}
		++i;
	}
	return -1;
};
Lambda.concat = function(a,b) {
	var l = [];
	var x = $getIterator(a);
	while(x.hasNext()) {
		var x1 = x.next();
		l.push(x1);
	}
	var x = $getIterator(b);
	while(x.hasNext()) {
		var x1 = x.next();
		l.push(x1);
	}
	return l;
};
var haxe_ds_Map = {};
haxe_ds_Map.set = function(this1,key,value) {
	this1.set(key,value);
};
haxe_ds_Map.get = function(this1,key) {
	return this1.get(key);
};
haxe_ds_Map.exists = function(this1,key) {
	return this1.exists(key);
};
haxe_ds_Map.remove = function(this1,key) {
	return this1.remove(key);
};
haxe_ds_Map.keys = function(this1) {
	return this1.keys();
};
haxe_ds_Map.iterator = function(this1) {
	return this1.iterator();
};
haxe_ds_Map.keyValueIterator = function(this1) {
	return this1.keyValueIterator();
};
haxe_ds_Map.copy = function(this1) {
	return this1.copy();
};
haxe_ds_Map.toString = function(this1) {
	return this1.toString();
};
haxe_ds_Map.clear = function(this1) {
	this1.clear();
};
haxe_ds_Map.arrayWrite = function(this1,k,v) {
	this1.set(k,v);
	return v;
};
haxe_ds_Map.toStringMap = function(t) {
	return new haxe_ds_StringMap();
};
haxe_ds_Map.toIntMap = function(t) {
	return new haxe_ds_IntMap();
};
haxe_ds_Map.toEnumValueMapMap = function(t) {
	return new haxe_ds_EnumValueMap();
};
haxe_ds_Map.toObjectMap = function(t) {
	return new haxe_ds_ObjectMap();
};
haxe_ds_Map.fromStringMap = function(map) {
	return map;
};
haxe_ds_Map.fromIntMap = function(map) {
	return map;
};
haxe_ds_Map.fromObjectMap = function(map) {
	return map;
};
var Main = function() { };
$hxClasses["Main"] = Main;
Main.__name__ = "Main";
Main.__properties__ = {get_discord:"get_discord"};
Main.app = null;
Main.auth = null;
Main.client = null;
Main.keys = null;
Main.state = null;
Main.command_file = null;
Main.universe = null;
Main.get_discord = function() {
	var config = null;
	config = Main.keys.discord_live;
	return config;
};
Main.token = function(rest) {
	var commands = Main.parseCommands();
	var get = rest.put(Routes.applicationGuildCommands(Main.get_discord().client_id,Main.guild_id),{ body : commands});
	return get;
};
Main.start = function() {
	var vec = new Array(4);
	vec[0] = new ecs_Phase(true,"systems",new Array(2),new Array(2));
	vec[1] = new ecs_Phase(true,"messages",new Array(5),new Array(5));
	vec[2] = new ecs_Phase(false,"testing",new Array(19),new Array(19));
	vec[3] = new ecs_Phase(true,"main",new Array(29),new Array(29));
	var phases = vec;
	var entities = new ecs_core_EntityManager(1000);
	var vec = new Array(13);
	vec[3] = new ecs_Components(13);
	vec[9] = new ecs_Components(13);
	vec[0] = new ecs_Components(13);
	vec[1] = new ecs_Components(13);
	vec[12] = new ecs_Components(13);
	vec[7] = new ecs_Components(13);
	vec[5] = new ecs_Components(13);
	vec[11] = new ecs_Components(13);
	vec[6] = new ecs_Components(13);
	vec[4] = new ecs_Components(13);
	vec[8] = new ecs_Components(13);
	vec[2] = new ecs_Components(13);
	vec[10] = new ecs_Components(13);
	var components = new ecs_core_ComponentManager(entities,vec);
	var capacity = 0;
	if(capacity == null) {
		capacity = 0;
	}
	var this1 = [0];
	if(capacity > 0) {
		var _g = this1.length;
		var _g1 = Math.ceil(capacity / 32);
		while(_g < _g1) {
			var i = _g++;
			this1[i] = 0;
		}
	}
	var resources = new ecs_core_ResourceManager(this1,new Array(0));
	var vec = new Array(12);
	var capacity = 13;
	if(capacity == null) {
		capacity = 0;
	}
	var this1 = [0];
	if(capacity > 0) {
		var _g = this1.length;
		var _g1 = Math.ceil(capacity / 32);
		while(_g < _g1) {
			var i = _g++;
			this1[i] = 0;
		}
	}
	var cmpBits = this1;
	bits_Bits.set(cmpBits,1);
	bits_Bits.set(cmpBits,0);
	var capacity = 0;
	if(capacity == null) {
		capacity = 0;
	}
	var this1 = [0];
	if(capacity > 0) {
		var _g = this1.length;
		var _g1 = Math.ceil(capacity / 32);
		while(_g < _g1) {
			var i = _g++;
			this1[i] = 0;
		}
	}
	var resBits = this1;
	vec[0] = new ecs_Family(0,cmpBits,resBits,1000);
	var capacity = 13;
	if(capacity == null) {
		capacity = 0;
	}
	var this1 = [0];
	if(capacity > 0) {
		var _g = this1.length;
		var _g1 = Math.ceil(capacity / 32);
		while(_g < _g1) {
			var i = _g++;
			this1[i] = 0;
		}
	}
	var cmpBits = this1;
	bits_Bits.set(cmpBits,2);
	var capacity = 0;
	if(capacity == null) {
		capacity = 0;
	}
	var this1 = [0];
	if(capacity > 0) {
		var _g = this1.length;
		var _g1 = Math.ceil(capacity / 32);
		while(_g < _g1) {
			var i = _g++;
			this1[i] = 0;
		}
	}
	var resBits = this1;
	vec[1] = new ecs_Family(1,cmpBits,resBits,1000);
	var capacity = 13;
	if(capacity == null) {
		capacity = 0;
	}
	var this1 = [0];
	if(capacity > 0) {
		var _g = this1.length;
		var _g1 = Math.ceil(capacity / 32);
		while(_g < _g1) {
			var i = _g++;
			this1[i] = 0;
		}
	}
	var cmpBits = this1;
	bits_Bits.set(cmpBits,4);
	bits_Bits.set(cmpBits,3);
	var capacity = 0;
	if(capacity == null) {
		capacity = 0;
	}
	var this1 = [0];
	if(capacity > 0) {
		var _g = this1.length;
		var _g1 = Math.ceil(capacity / 32);
		while(_g < _g1) {
			var i = _g++;
			this1[i] = 0;
		}
	}
	var resBits = this1;
	vec[2] = new ecs_Family(2,cmpBits,resBits,1000);
	var capacity = 13;
	if(capacity == null) {
		capacity = 0;
	}
	var this1 = [0];
	if(capacity > 0) {
		var _g = this1.length;
		var _g1 = Math.ceil(capacity / 32);
		while(_g < _g1) {
			var i = _g++;
			this1[i] = 0;
		}
	}
	var cmpBits = this1;
	bits_Bits.set(cmpBits,5);
	bits_Bits.set(cmpBits,1);
	var capacity = 0;
	if(capacity == null) {
		capacity = 0;
	}
	var this1 = [0];
	if(capacity > 0) {
		var _g = this1.length;
		var _g1 = Math.ceil(capacity / 32);
		while(_g < _g1) {
			var i = _g++;
			this1[i] = 0;
		}
	}
	var resBits = this1;
	vec[3] = new ecs_Family(3,cmpBits,resBits,1000);
	var capacity = 13;
	if(capacity == null) {
		capacity = 0;
	}
	var this1 = [0];
	if(capacity > 0) {
		var _g = this1.length;
		var _g1 = Math.ceil(capacity / 32);
		while(_g < _g1) {
			var i = _g++;
			this1[i] = 0;
		}
	}
	var cmpBits = this1;
	bits_Bits.set(cmpBits,6);
	bits_Bits.set(cmpBits,5);
	var capacity = 0;
	if(capacity == null) {
		capacity = 0;
	}
	var this1 = [0];
	if(capacity > 0) {
		var _g = this1.length;
		var _g1 = Math.ceil(capacity / 32);
		while(_g < _g1) {
			var i = _g++;
			this1[i] = 0;
		}
	}
	var resBits = this1;
	vec[4] = new ecs_Family(4,cmpBits,resBits,1000);
	var capacity = 13;
	if(capacity == null) {
		capacity = 0;
	}
	var this1 = [0];
	if(capacity > 0) {
		var _g = this1.length;
		var _g1 = Math.ceil(capacity / 32);
		while(_g < _g1) {
			var i = _g++;
			this1[i] = 0;
		}
	}
	var cmpBits = this1;
	bits_Bits.set(cmpBits,5);
	bits_Bits.set(cmpBits,7);
	var capacity = 0;
	if(capacity == null) {
		capacity = 0;
	}
	var this1 = [0];
	if(capacity > 0) {
		var _g = this1.length;
		var _g1 = Math.ceil(capacity / 32);
		while(_g < _g1) {
			var i = _g++;
			this1[i] = 0;
		}
	}
	var resBits = this1;
	vec[5] = new ecs_Family(5,cmpBits,resBits,1000);
	var capacity = 13;
	if(capacity == null) {
		capacity = 0;
	}
	var this1 = [0];
	if(capacity > 0) {
		var _g = this1.length;
		var _g1 = Math.ceil(capacity / 32);
		while(_g < _g1) {
			var i = _g++;
			this1[i] = 0;
		}
	}
	var cmpBits = this1;
	bits_Bits.set(cmpBits,8);
	bits_Bits.set(cmpBits,4);
	var capacity = 0;
	if(capacity == null) {
		capacity = 0;
	}
	var this1 = [0];
	if(capacity > 0) {
		var _g = this1.length;
		var _g1 = Math.ceil(capacity / 32);
		while(_g < _g1) {
			var i = _g++;
			this1[i] = 0;
		}
	}
	var resBits = this1;
	vec[6] = new ecs_Family(6,cmpBits,resBits,1000);
	var capacity = 13;
	if(capacity == null) {
		capacity = 0;
	}
	var this1 = [0];
	if(capacity > 0) {
		var _g = this1.length;
		var _g1 = Math.ceil(capacity / 32);
		while(_g < _g1) {
			var i = _g++;
			this1[i] = 0;
		}
	}
	var cmpBits = this1;
	bits_Bits.set(cmpBits,4);
	bits_Bits.set(cmpBits,5);
	var capacity = 0;
	if(capacity == null) {
		capacity = 0;
	}
	var this1 = [0];
	if(capacity > 0) {
		var _g = this1.length;
		var _g1 = Math.ceil(capacity / 32);
		while(_g < _g1) {
			var i = _g++;
			this1[i] = 0;
		}
	}
	var resBits = this1;
	vec[7] = new ecs_Family(7,cmpBits,resBits,1000);
	var capacity = 13;
	if(capacity == null) {
		capacity = 0;
	}
	var this1 = [0];
	if(capacity > 0) {
		var _g = this1.length;
		var _g1 = Math.ceil(capacity / 32);
		while(_g < _g1) {
			var i = _g++;
			this1[i] = 0;
		}
	}
	var cmpBits = this1;
	bits_Bits.set(cmpBits,4);
	bits_Bits.set(cmpBits,9);
	var capacity = 0;
	if(capacity == null) {
		capacity = 0;
	}
	var this1 = [0];
	if(capacity > 0) {
		var _g = this1.length;
		var _g1 = Math.ceil(capacity / 32);
		while(_g < _g1) {
			var i = _g++;
			this1[i] = 0;
		}
	}
	var resBits = this1;
	vec[8] = new ecs_Family(8,cmpBits,resBits,1000);
	var capacity = 13;
	if(capacity == null) {
		capacity = 0;
	}
	var this1 = [0];
	if(capacity > 0) {
		var _g = this1.length;
		var _g1 = Math.ceil(capacity / 32);
		while(_g < _g1) {
			var i = _g++;
			this1[i] = 0;
		}
	}
	var cmpBits = this1;
	bits_Bits.set(cmpBits,10);
	var capacity = 0;
	if(capacity == null) {
		capacity = 0;
	}
	var this1 = [0];
	if(capacity > 0) {
		var _g = this1.length;
		var _g1 = Math.ceil(capacity / 32);
		while(_g < _g1) {
			var i = _g++;
			this1[i] = 0;
		}
	}
	var resBits = this1;
	vec[9] = new ecs_Family(9,cmpBits,resBits,1000);
	var capacity = 13;
	if(capacity == null) {
		capacity = 0;
	}
	var this1 = [0];
	if(capacity > 0) {
		var _g = this1.length;
		var _g1 = Math.ceil(capacity / 32);
		while(_g < _g1) {
			var i = _g++;
			this1[i] = 0;
		}
	}
	var cmpBits = this1;
	bits_Bits.set(cmpBits,11);
	bits_Bits.set(cmpBits,11);
	bits_Bits.set(cmpBits,5);
	var capacity = 0;
	if(capacity == null) {
		capacity = 0;
	}
	var this1 = [0];
	if(capacity > 0) {
		var _g = this1.length;
		var _g1 = Math.ceil(capacity / 32);
		while(_g < _g1) {
			var i = _g++;
			this1[i] = 0;
		}
	}
	var resBits = this1;
	vec[10] = new ecs_Family(10,cmpBits,resBits,1000);
	var capacity = 13;
	if(capacity == null) {
		capacity = 0;
	}
	var this1 = [0];
	if(capacity > 0) {
		var _g = this1.length;
		var _g1 = Math.ceil(capacity / 32);
		while(_g < _g1) {
			var i = _g++;
			this1[i] = 0;
		}
	}
	var cmpBits = this1;
	bits_Bits.set(cmpBits,5);
	bits_Bits.set(cmpBits,12);
	var capacity = 0;
	if(capacity == null) {
		capacity = 0;
	}
	var this1 = [0];
	if(capacity > 0) {
		var _g = this1.length;
		var _g1 = Math.ceil(capacity / 32);
		while(_g < _g1) {
			var i = _g++;
			this1[i] = 0;
		}
	}
	var resBits = this1;
	vec[11] = new ecs_Family(11,cmpBits,resBits,1000);
	var families = new ecs_core_FamilyManager(components,resources,vec);
	var u = new ecs_Universe(entities,components,resources,families,phases);
	var phase = phases[0];
	var s = new systems_MessageRouter(u);
	phase.systems[0] = s;
	phase.enabledSystems[0] = true;
	s.onEnabled();
	var s = new systems_DatabaseSystem(u);
	phase.systems[1] = s;
	phase.enabledSystems[1] = true;
	s.onEnabled();
	var phase = phases[1];
	var s = new commands_ThreadCount(u);
	phase.systems[0] = s;
	phase.enabledSystems[0] = true;
	s.onEnabled();
	var s = new commands_ScamPrevention(u);
	phase.systems[1] = s;
	phase.enabledSystems[1] = true;
	s.onEnabled();
	var s = new commands_JamSuggestionBox(u);
	phase.systems[2] = s;
	phase.enabledSystems[2] = true;
	s.onEnabled();
	var s = new commands_Showcase(u);
	phase.systems[3] = s;
	phase.enabledSystems[3] = true;
	s.onEnabled();
	var s = new commands_mod_RateLimit(u);
	phase.systems[4] = s;
	phase.enabledSystems[4] = true;
	s.onEnabled();
	var phase = phases[2];
	var s = new commands_DeleteProject(u);
	phase.systems[0] = s;
	phase.enabledSystems[0] = true;
	var s = new commands_Emoji(u);
	phase.systems[1] = s;
	phase.enabledSystems[1] = true;
	var s = new commands_Haxelib(u);
	phase.systems[2] = s;
	phase.enabledSystems[2] = true;
	var s = new commands_Hi(u);
	phase.systems[3] = s;
	phase.enabledSystems[3] = true;
	var s = new commands_Boop(u);
	phase.systems[4] = s;
	phase.enabledSystems[4] = true;
	var s = new commands_Everyone(u);
	phase.systems[5] = s;
	phase.enabledSystems[5] = true;
	var s = new commands_Roundup(u);
	phase.systems[6] = s;
	phase.enabledSystems[6] = true;
	var s = new commands_RoundupRoundup(u);
	phase.systems[7] = s;
	phase.enabledSystems[7] = true;
	var s = new commands_events_PinMessageInfo(u);
	phase.systems[8] = s;
	phase.enabledSystems[8] = true;
	var s = new commands_mod_Tracker(u);
	phase.systems[9] = s;
	phase.enabledSystems[9] = true;
	var s = new commands_Quote(u);
	phase.systems[10] = s;
	phase.enabledSystems[10] = true;
	var s = new commands_Snippet(u);
	phase.systems[11] = s;
	phase.enabledSystems[11] = true;
	var s = new commands_Api(u);
	phase.systems[12] = s;
	phase.enabledSystems[12] = true;
	var s = new commands_Notify(u);
	phase.systems[13] = s;
	phase.enabledSystems[13] = true;
	var s = new commands_Code(u);
	phase.systems[14] = s;
	phase.enabledSystems[14] = true;
	var s = new commands_CodeLineNumbers(u);
	phase.systems[15] = s;
	phase.enabledSystems[15] = true;
	var s = new commands_React(u);
	phase.systems[16] = s;
	phase.enabledSystems[16] = true;
	var s = new commands_Say(u);
	phase.systems[17] = s;
	phase.enabledSystems[17] = true;
	var s = new commands_Poll(u);
	phase.systems[18] = s;
	phase.enabledSystems[18] = true;
	var phase = phases[3];
	var s = new commands_DeleteProject(u);
	phase.systems[0] = s;
	phase.enabledSystems[0] = true;
	s.onEnabled();
	var s = new commands_Haxelib(u);
	phase.systems[1] = s;
	phase.enabledSystems[1] = true;
	s.onEnabled();
	var s = new commands_Emoji(u);
	phase.systems[2] = s;
	phase.enabledSystems[2] = true;
	s.onEnabled();
	var s = new commands_Everyone(u);
	phase.systems[3] = s;
	phase.enabledSystems[3] = true;
	s.onEnabled();
	var s = new commands_mod_Tracker(u);
	phase.systems[4] = s;
	phase.enabledSystems[4] = true;
	s.onEnabled();
	var s = new commands_events_PinMessageInfo(u);
	phase.systems[5] = s;
	phase.enabledSystems[5] = true;
	s.onEnabled();
	var s = new commands_RoundupRoundup(u);
	phase.systems[6] = s;
	phase.enabledSystems[6] = true;
	s.onEnabled();
	var s = new commands_AutoThread(u);
	phase.systems[7] = s;
	phase.enabledSystems[7] = true;
	s.onEnabled();
	var s = new commands_Snippet(u);
	phase.systems[8] = s;
	phase.enabledSystems[8] = true;
	s.onEnabled();
	var s = new commands_PinMessage(u);
	phase.systems[9] = s;
	phase.enabledSystems[9] = true;
	s.onEnabled();
	var s = new commands_Reminder(u);
	phase.systems[10] = s;
	phase.enabledSystems[10] = true;
	s.onEnabled();
	var s = new commands_mod_Social(u);
	phase.systems[11] = s;
	phase.enabledSystems[11] = true;
	s.onEnabled();
	var s = new commands_Run2(u);
	phase.systems[12] = s;
	phase.enabledSystems[12] = true;
	s.onEnabled();
	var s = new commands_AutoRole(u);
	phase.systems[13] = s;
	phase.enabledSystems[13] = true;
	s.onEnabled();
	var s = new commands_Quote(u);
	phase.systems[14] = s;
	phase.enabledSystems[14] = true;
	s.onEnabled();
	var s = new commands_Api(u);
	phase.systems[15] = s;
	phase.enabledSystems[15] = true;
	s.onEnabled();
	var s = new commands_React(u);
	phase.systems[16] = s;
	phase.enabledSystems[16] = true;
	s.onEnabled();
	var s = new commands_Notify(u);
	phase.systems[17] = s;
	phase.enabledSystems[17] = true;
	s.onEnabled();
	var s = new commands_Rtfm(u);
	phase.systems[18] = s;
	phase.enabledSystems[18] = true;
	s.onEnabled();
	var s = new commands_Poll(u);
	phase.systems[19] = s;
	phase.enabledSystems[19] = true;
	s.onEnabled();
	var s = new commands_Boop(u);
	phase.systems[20] = s;
	phase.enabledSystems[20] = true;
	s.onEnabled();
	var s = new commands_Archive(u);
	phase.systems[21] = s;
	phase.enabledSystems[21] = true;
	s.onEnabled();
	var s = new commands_Help(u);
	phase.systems[22] = s;
	phase.enabledSystems[22] = true;
	s.onEnabled();
	var s = new commands_Translate(u);
	phase.systems[23] = s;
	phase.enabledSystems[23] = true;
	s.onEnabled();
	var s = new commands_Hi(u);
	phase.systems[24] = s;
	phase.enabledSystems[24] = true;
	s.onEnabled();
	var s = new commands_Roundup(u);
	phase.systems[25] = s;
	phase.enabledSystems[25] = true;
	s.onEnabled();
	var s = new commands_CodeLineNumbers(u);
	phase.systems[26] = s;
	phase.enabledSystems[26] = true;
	s.onEnabled();
	var s = new commands_Say(u);
	phase.systems[27] = s;
	phase.enabledSystems[27] = true;
	s.onEnabled();
	var s = new commands_Color(u);
	phase.systems[28] = s;
	phase.enabledSystems[28] = true;
	s.onEnabled();
	var _g = 0;
	var _g1 = u.families.number;
	while(_g < _g1) {
		var idx = _g++;
		u.families.tryActivate(idx);
	}
	Main.universe = u;
	var e = database_DBEvents.GetAllRecords("state",function(response) {
		if(response._hx_index == 2) {
			var data = response.data;
			Main.state = { next_roundup : 0, roundup_roundup : null, snippet_tags : null};
			var d = data.iterator();
			while(d.hasNext()) {
				var d1 = d.next();
				var value = d1.field("value");
				switch(d1.field("key")) {
				case "next_roundup":
					Main.state.next_roundup = value;
					break;
				case "roundup_roundup":
					Main.state.roundup_roundup = value;
					break;
				case "snippet_tags":
					Main.state.snippet_tags = value;
					break;
				default:
					var e = haxe_Log.trace;
					var tmp = d1.field("key");
					e(tmp == null ? "null" : Std.string(tmp),{ fileName : "src/Main.hx", lineNumber : 190, className : "Main", methodName : "start"});
				}
			}
		} else {
			haxe_Log.trace(response,{ fileName : "src/Main.hx", lineNumber : 194, className : "Main", methodName : "start"});
		}
	});
	var _ecsTmpEntity = Main.universe.createEntity();
	Main.universe.components.set(_ecsTmpEntity,2,e);
	var ecsEntCompFlags = Main.universe.components.flags[ecs_Entity.id(_ecsTmpEntity)];
	var ecsTmpFamily = Main.universe.families.get(1);
	if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
		ecsTmpFamily.add(_ecsTmpEntity);
	}
	Main.client = new discord_$js_Client({ intents : [1,32768,512,65536,4096,2,1024,128,8192]});
	Main.client.once("ready",function() {
		var $l=arguments.length;
		var clients = new Array($l>0?$l-0:0);
		for(var $i=0;$i<$l;++$i){clients[$i-0]=arguments[$i];}
		haxe_Log.trace("Ready!",{ fileName : "src/Main.hx", lineNumber : 214, className : "Main", methodName : "start"});
		Main.client = clients[0];
		Main.connected = true;
		var rest = new discord_$js_rest_REST({ version : "9"}).setToken(Main.get_discord().token);
		var res = Main.token(rest);
		res.then(function(foo) {
			Main.commands_active = true;
			var _g = 0;
			while(_g < foo.length) {
				var item = foo[_g];
				++_g;
				haxe_Log.trace("DEBUG - " + item.name + " is REGISTERED",{ fileName : "src/Main.hx", lineNumber : 223, className : "Main", methodName : "start"});
			}
		},function(err) {
			haxe_Log.trace(err,{ fileName : "src/Main.hx", lineNumber : 229, className : "Main", methodName : "start"});
			$global.console.dir(err);
		});
	});
	Main.client.on("guildMemberAdd",function(member) {
		haxe_Log.trace("member " + member.user.tag,{ fileName : "src/Main.hx", lineNumber : 235, className : "Main", methodName : "start"});
		var _ecsTmpEntity = Main.universe.createEntity();
		Main.universe.components.set(_ecsTmpEntity,5,"add_event_role");
		Main.universe.components.set(_ecsTmpEntity,7,member);
		var ecsEntCompFlags = Main.universe.components.flags[ecs_Entity.id(_ecsTmpEntity)];
		var ecsTmpFamily = Main.universe.families.get(3);
		if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
			ecsTmpFamily.add(_ecsTmpEntity);
		}
		var ecsTmpFamily = Main.universe.families.get(4);
		if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
			ecsTmpFamily.add(_ecsTmpEntity);
		}
		var ecsTmpFamily = Main.universe.families.get(5);
		if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
			ecsTmpFamily.add(_ecsTmpEntity);
		}
		var ecsTmpFamily = Main.universe.families.get(7);
		if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
			ecsTmpFamily.add(_ecsTmpEntity);
		}
		var ecsTmpFamily = Main.universe.families.get(10);
		if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
			ecsTmpFamily.add(_ecsTmpEntity);
		}
		var ecsTmpFamily = Main.universe.families.get(11);
		if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
			ecsTmpFamily.add(_ecsTmpEntity);
		}
	});
	Main.client.on("guildScheduledEventCreate",function(event) {
		var _ecsTmpEntity = Main.universe.createEntity();
		Main.universe.components.set(_ecsTmpEntity,5,"create_event");
		Main.universe.components.set(_ecsTmpEntity,12,event);
		var ecsEntCompFlags = Main.universe.components.flags[ecs_Entity.id(_ecsTmpEntity)];
		var ecsTmpFamily = Main.universe.families.get(3);
		if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
			ecsTmpFamily.add(_ecsTmpEntity);
		}
		var ecsTmpFamily = Main.universe.families.get(4);
		if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
			ecsTmpFamily.add(_ecsTmpEntity);
		}
		var ecsTmpFamily = Main.universe.families.get(5);
		if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
			ecsTmpFamily.add(_ecsTmpEntity);
		}
		var ecsTmpFamily = Main.universe.families.get(7);
		if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
			ecsTmpFamily.add(_ecsTmpEntity);
		}
		var ecsTmpFamily = Main.universe.families.get(10);
		if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
			ecsTmpFamily.add(_ecsTmpEntity);
		}
		var ecsTmpFamily = Main.universe.families.get(11);
		if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
			ecsTmpFamily.add(_ecsTmpEntity);
		}
	});
	Main.client.on("guildScheduledEventUpdate",function(event) {
		var _ecsTmpEntity = Main.universe.createEntity();
		Main.universe.components.set(_ecsTmpEntity,5,"scheduled_event_update");
		Main.universe.components.set(_ecsTmpEntity,12,event);
		var ecsEntCompFlags = Main.universe.components.flags[ecs_Entity.id(_ecsTmpEntity)];
		var ecsTmpFamily = Main.universe.families.get(3);
		if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
			ecsTmpFamily.add(_ecsTmpEntity);
		}
		var ecsTmpFamily = Main.universe.families.get(4);
		if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
			ecsTmpFamily.add(_ecsTmpEntity);
		}
		var ecsTmpFamily = Main.universe.families.get(5);
		if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
			ecsTmpFamily.add(_ecsTmpEntity);
		}
		var ecsTmpFamily = Main.universe.families.get(7);
		if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
			ecsTmpFamily.add(_ecsTmpEntity);
		}
		var ecsTmpFamily = Main.universe.families.get(10);
		if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
			ecsTmpFamily.add(_ecsTmpEntity);
		}
		var ecsTmpFamily = Main.universe.families.get(11);
		if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
			ecsTmpFamily.add(_ecsTmpEntity);
		}
	});
	Main.client.on("voiceStateUpdate",function(old,updated) {
		var _ecsTmpEntity = Main.universe.createEntity();
		Main.universe.components.set(_ecsTmpEntity,5,"roundup_member_update");
		Main.universe.components.set(_ecsTmpEntity,11,old);
		Main.universe.components.set(_ecsTmpEntity,11,updated);
		var ecsEntCompFlags = Main.universe.components.flags[ecs_Entity.id(_ecsTmpEntity)];
		var ecsTmpFamily = Main.universe.families.get(3);
		if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
			ecsTmpFamily.add(_ecsTmpEntity);
		}
		var ecsTmpFamily = Main.universe.families.get(4);
		if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
			ecsTmpFamily.add(_ecsTmpEntity);
		}
		var ecsTmpFamily = Main.universe.families.get(5);
		if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
			ecsTmpFamily.add(_ecsTmpEntity);
		}
		var ecsTmpFamily = Main.universe.families.get(7);
		if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
			ecsTmpFamily.add(_ecsTmpEntity);
		}
		var ecsTmpFamily = Main.universe.families.get(10);
		if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
			ecsTmpFamily.add(_ecsTmpEntity);
		}
		var ecsTmpFamily = Main.universe.families.get(11);
		if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
			ecsTmpFamily.add(_ecsTmpEntity);
		}
	});
	Main.client.on("messageCreate",function(message) {
		if(message.author.bot || message.system) {
			return;
		}
		var _ecsTmpEntity = Main.universe.createEntity();
		Main.universe.components.set(_ecsTmpEntity,5,"new_message");
		Main.universe.components.set(_ecsTmpEntity,1,message);
		var ecsEntCompFlags = Main.universe.components.flags[ecs_Entity.id(_ecsTmpEntity)];
		var ecsTmpFamily = Main.universe.families.get(3);
		if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
			ecsTmpFamily.add(_ecsTmpEntity);
		}
		var ecsTmpFamily = Main.universe.families.get(4);
		if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
			ecsTmpFamily.add(_ecsTmpEntity);
		}
		var ecsTmpFamily = Main.universe.families.get(5);
		if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
			ecsTmpFamily.add(_ecsTmpEntity);
		}
		var ecsTmpFamily = Main.universe.families.get(7);
		if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
			ecsTmpFamily.add(_ecsTmpEntity);
		}
		var ecsTmpFamily = Main.universe.families.get(10);
		if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
			ecsTmpFamily.add(_ecsTmpEntity);
		}
		var ecsTmpFamily = Main.universe.families.get(11);
		if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
			ecsTmpFamily.add(_ecsTmpEntity);
		}
		var ecsTmpFamily = Main.universe.families.get(0);
		if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
			ecsTmpFamily.add(_ecsTmpEntity);
		}
	});
	Main.client.on("ChatInputAutoCompleteEvent",function(incoming) {
		haxe_Log.trace("disconnected",{ fileName : "src/Main.hx", lineNumber : 263, className : "Main", methodName : "start"});
		haxe_Log.trace(incoming,{ fileName : "src/Main.hx", lineNumber : 264, className : "Main", methodName : "start"});
	});
	Main.client.on("threadCreate",function(thread) {
		var _ecsTmpEntity = Main.universe.createEntity();
		Main.universe.components.set(_ecsTmpEntity,5,"thread_pin_message");
		Main.universe.components.set(_ecsTmpEntity,6,thread);
		var ecsEntCompFlags = Main.universe.components.flags[ecs_Entity.id(_ecsTmpEntity)];
		var ecsTmpFamily = Main.universe.families.get(3);
		if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
			ecsTmpFamily.add(_ecsTmpEntity);
		}
		var ecsTmpFamily = Main.universe.families.get(4);
		if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
			ecsTmpFamily.add(_ecsTmpEntity);
		}
		var ecsTmpFamily = Main.universe.families.get(5);
		if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
			ecsTmpFamily.add(_ecsTmpEntity);
		}
		var ecsTmpFamily = Main.universe.families.get(7);
		if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
			ecsTmpFamily.add(_ecsTmpEntity);
		}
		var ecsTmpFamily = Main.universe.families.get(10);
		if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
			ecsTmpFamily.add(_ecsTmpEntity);
		}
		var ecsTmpFamily = Main.universe.families.get(11);
		if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
			ecsTmpFamily.add(_ecsTmpEntity);
		}
	});
	Main.client.on("interactionCreate",function(interaction) {
		if(interaction.isButton()) {
			if(interaction.customId == "showcase_agree") {
				var _ecsTmpEntity = Main.universe.createEntity();
				Main.universe.components.set(_ecsTmpEntity,5,"showcase_agree");
				Main.universe.components.set(_ecsTmpEntity,4,interaction);
				var ecsEntCompFlags = Main.universe.components.flags[ecs_Entity.id(_ecsTmpEntity)];
				var ecsTmpFamily = Main.universe.families.get(3);
				if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
					ecsTmpFamily.add(_ecsTmpEntity);
				}
				var ecsTmpFamily = Main.universe.families.get(4);
				if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
					ecsTmpFamily.add(_ecsTmpEntity);
				}
				var ecsTmpFamily = Main.universe.families.get(5);
				if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
					ecsTmpFamily.add(_ecsTmpEntity);
				}
				var ecsTmpFamily = Main.universe.families.get(7);
				if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
					ecsTmpFamily.add(_ecsTmpEntity);
				}
				var ecsTmpFamily = Main.universe.families.get(10);
				if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
					ecsTmpFamily.add(_ecsTmpEntity);
				}
				var ecsTmpFamily = Main.universe.families.get(11);
				if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
					ecsTmpFamily.add(_ecsTmpEntity);
				}
				var ecsTmpFamily = Main.universe.families.get(2);
				if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
					ecsTmpFamily.add(_ecsTmpEntity);
				}
				var ecsTmpFamily = Main.universe.families.get(6);
				if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
					ecsTmpFamily.add(_ecsTmpEntity);
				}
				var ecsTmpFamily = Main.universe.families.get(8);
				if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
					ecsTmpFamily.add(_ecsTmpEntity);
				}
			}
			if(interaction.customId == "showcase_disagree") {
				var _ecsTmpEntity = Main.universe.createEntity();
				Main.universe.components.set(_ecsTmpEntity,5,"showcase_disagree");
				Main.universe.components.set(_ecsTmpEntity,4,interaction);
				var ecsEntCompFlags = Main.universe.components.flags[ecs_Entity.id(_ecsTmpEntity)];
				var ecsTmpFamily = Main.universe.families.get(3);
				if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
					ecsTmpFamily.add(_ecsTmpEntity);
				}
				var ecsTmpFamily = Main.universe.families.get(4);
				if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
					ecsTmpFamily.add(_ecsTmpEntity);
				}
				var ecsTmpFamily = Main.universe.families.get(5);
				if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
					ecsTmpFamily.add(_ecsTmpEntity);
				}
				var ecsTmpFamily = Main.universe.families.get(7);
				if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
					ecsTmpFamily.add(_ecsTmpEntity);
				}
				var ecsTmpFamily = Main.universe.families.get(10);
				if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
					ecsTmpFamily.add(_ecsTmpEntity);
				}
				var ecsTmpFamily = Main.universe.families.get(11);
				if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
					ecsTmpFamily.add(_ecsTmpEntity);
				}
				var ecsTmpFamily = Main.universe.families.get(2);
				if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
					ecsTmpFamily.add(_ecsTmpEntity);
				}
				var ecsTmpFamily = Main.universe.families.get(6);
				if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
					ecsTmpFamily.add(_ecsTmpEntity);
				}
				var ecsTmpFamily = Main.universe.families.get(8);
				if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
					ecsTmpFamily.add(_ecsTmpEntity);
				}
			}
			if(interaction.customId == "snippet_left") {
				var _ecsTmpEntity = Main.universe.createEntity();
				Main.universe.components.set(_ecsTmpEntity,5,"snippet_left");
				Main.universe.components.set(_ecsTmpEntity,4,interaction);
				var ecsEntCompFlags = Main.universe.components.flags[ecs_Entity.id(_ecsTmpEntity)];
				var ecsTmpFamily = Main.universe.families.get(3);
				if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
					ecsTmpFamily.add(_ecsTmpEntity);
				}
				var ecsTmpFamily = Main.universe.families.get(4);
				if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
					ecsTmpFamily.add(_ecsTmpEntity);
				}
				var ecsTmpFamily = Main.universe.families.get(5);
				if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
					ecsTmpFamily.add(_ecsTmpEntity);
				}
				var ecsTmpFamily = Main.universe.families.get(7);
				if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
					ecsTmpFamily.add(_ecsTmpEntity);
				}
				var ecsTmpFamily = Main.universe.families.get(10);
				if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
					ecsTmpFamily.add(_ecsTmpEntity);
				}
				var ecsTmpFamily = Main.universe.families.get(11);
				if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
					ecsTmpFamily.add(_ecsTmpEntity);
				}
				var ecsTmpFamily = Main.universe.families.get(2);
				if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
					ecsTmpFamily.add(_ecsTmpEntity);
				}
				var ecsTmpFamily = Main.universe.families.get(6);
				if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
					ecsTmpFamily.add(_ecsTmpEntity);
				}
				var ecsTmpFamily = Main.universe.families.get(8);
				if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
					ecsTmpFamily.add(_ecsTmpEntity);
				}
			}
			if(interaction.customId == "snippet_right") {
				var _ecsTmpEntity = Main.universe.createEntity();
				Main.universe.components.set(_ecsTmpEntity,5,"snippet_right");
				Main.universe.components.set(_ecsTmpEntity,4,interaction);
				var ecsEntCompFlags = Main.universe.components.flags[ecs_Entity.id(_ecsTmpEntity)];
				var ecsTmpFamily = Main.universe.families.get(3);
				if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
					ecsTmpFamily.add(_ecsTmpEntity);
				}
				var ecsTmpFamily = Main.universe.families.get(4);
				if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
					ecsTmpFamily.add(_ecsTmpEntity);
				}
				var ecsTmpFamily = Main.universe.families.get(5);
				if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
					ecsTmpFamily.add(_ecsTmpEntity);
				}
				var ecsTmpFamily = Main.universe.families.get(7);
				if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
					ecsTmpFamily.add(_ecsTmpEntity);
				}
				var ecsTmpFamily = Main.universe.families.get(10);
				if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
					ecsTmpFamily.add(_ecsTmpEntity);
				}
				var ecsTmpFamily = Main.universe.families.get(11);
				if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
					ecsTmpFamily.add(_ecsTmpEntity);
				}
				var ecsTmpFamily = Main.universe.families.get(2);
				if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
					ecsTmpFamily.add(_ecsTmpEntity);
				}
				var ecsTmpFamily = Main.universe.families.get(6);
				if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
					ecsTmpFamily.add(_ecsTmpEntity);
				}
				var ecsTmpFamily = Main.universe.families.get(8);
				if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
					ecsTmpFamily.add(_ecsTmpEntity);
				}
			}
			return;
		}
		if(interaction.isModalSubmit()) {
			switch(interaction.customId) {
			case "code_paste":
				var _ecsTmpEntity = Main.universe.createEntity();
				Main.universe.components.set(_ecsTmpEntity,5,"code_paste");
				Main.universe.components.set(_ecsTmpEntity,4,interaction);
				var ecsEntCompFlags = Main.universe.components.flags[ecs_Entity.id(_ecsTmpEntity)];
				var ecsTmpFamily = Main.universe.families.get(3);
				if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
					ecsTmpFamily.add(_ecsTmpEntity);
				}
				var ecsTmpFamily = Main.universe.families.get(4);
				if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
					ecsTmpFamily.add(_ecsTmpEntity);
				}
				var ecsTmpFamily = Main.universe.families.get(5);
				if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
					ecsTmpFamily.add(_ecsTmpEntity);
				}
				var ecsTmpFamily = Main.universe.families.get(7);
				if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
					ecsTmpFamily.add(_ecsTmpEntity);
				}
				var ecsTmpFamily = Main.universe.families.get(10);
				if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
					ecsTmpFamily.add(_ecsTmpEntity);
				}
				var ecsTmpFamily = Main.universe.families.get(11);
				if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
					ecsTmpFamily.add(_ecsTmpEntity);
				}
				var ecsTmpFamily = Main.universe.families.get(2);
				if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
					ecsTmpFamily.add(_ecsTmpEntity);
				}
				var ecsTmpFamily = Main.universe.families.get(6);
				if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
					ecsTmpFamily.add(_ecsTmpEntity);
				}
				var ecsTmpFamily = Main.universe.families.get(8);
				if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
					ecsTmpFamily.add(_ecsTmpEntity);
				}
				break;
			case "emoji_edit":
				var _ecsTmpEntity = Main.universe.createEntity();
				Main.universe.components.set(_ecsTmpEntity,5,"emoji_edit");
				Main.universe.components.set(_ecsTmpEntity,4,interaction);
				var ecsEntCompFlags = Main.universe.components.flags[ecs_Entity.id(_ecsTmpEntity)];
				var ecsTmpFamily = Main.universe.families.get(3);
				if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
					ecsTmpFamily.add(_ecsTmpEntity);
				}
				var ecsTmpFamily = Main.universe.families.get(4);
				if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
					ecsTmpFamily.add(_ecsTmpEntity);
				}
				var ecsTmpFamily = Main.universe.families.get(5);
				if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
					ecsTmpFamily.add(_ecsTmpEntity);
				}
				var ecsTmpFamily = Main.universe.families.get(7);
				if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
					ecsTmpFamily.add(_ecsTmpEntity);
				}
				var ecsTmpFamily = Main.universe.families.get(10);
				if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
					ecsTmpFamily.add(_ecsTmpEntity);
				}
				var ecsTmpFamily = Main.universe.families.get(11);
				if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
					ecsTmpFamily.add(_ecsTmpEntity);
				}
				var ecsTmpFamily = Main.universe.families.get(2);
				if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
					ecsTmpFamily.add(_ecsTmpEntity);
				}
				var ecsTmpFamily = Main.universe.families.get(6);
				if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
					ecsTmpFamily.add(_ecsTmpEntity);
				}
				var ecsTmpFamily = Main.universe.families.get(8);
				if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
					ecsTmpFamily.add(_ecsTmpEntity);
				}
				break;
			case "quote_edit":
				var _ecsTmpEntity = Main.universe.createEntity();
				Main.universe.components.set(_ecsTmpEntity,5,"quote_edit");
				Main.universe.components.set(_ecsTmpEntity,4,interaction);
				var ecsEntCompFlags = Main.universe.components.flags[ecs_Entity.id(_ecsTmpEntity)];
				var ecsTmpFamily = Main.universe.families.get(3);
				if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
					ecsTmpFamily.add(_ecsTmpEntity);
				}
				var ecsTmpFamily = Main.universe.families.get(4);
				if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
					ecsTmpFamily.add(_ecsTmpEntity);
				}
				var ecsTmpFamily = Main.universe.families.get(5);
				if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
					ecsTmpFamily.add(_ecsTmpEntity);
				}
				var ecsTmpFamily = Main.universe.families.get(7);
				if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
					ecsTmpFamily.add(_ecsTmpEntity);
				}
				var ecsTmpFamily = Main.universe.families.get(10);
				if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
					ecsTmpFamily.add(_ecsTmpEntity);
				}
				var ecsTmpFamily = Main.universe.families.get(11);
				if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
					ecsTmpFamily.add(_ecsTmpEntity);
				}
				var ecsTmpFamily = Main.universe.families.get(2);
				if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
					ecsTmpFamily.add(_ecsTmpEntity);
				}
				var ecsTmpFamily = Main.universe.families.get(6);
				if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
					ecsTmpFamily.add(_ecsTmpEntity);
				}
				var ecsTmpFamily = Main.universe.families.get(8);
				if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
					ecsTmpFamily.add(_ecsTmpEntity);
				}
				break;
			case "quote_set":
				var _ecsTmpEntity = Main.universe.createEntity();
				Main.universe.components.set(_ecsTmpEntity,5,"quote_set");
				Main.universe.components.set(_ecsTmpEntity,4,interaction);
				var ecsEntCompFlags = Main.universe.components.flags[ecs_Entity.id(_ecsTmpEntity)];
				var ecsTmpFamily = Main.universe.families.get(3);
				if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
					ecsTmpFamily.add(_ecsTmpEntity);
				}
				var ecsTmpFamily = Main.universe.families.get(4);
				if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
					ecsTmpFamily.add(_ecsTmpEntity);
				}
				var ecsTmpFamily = Main.universe.families.get(5);
				if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
					ecsTmpFamily.add(_ecsTmpEntity);
				}
				var ecsTmpFamily = Main.universe.families.get(7);
				if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
					ecsTmpFamily.add(_ecsTmpEntity);
				}
				var ecsTmpFamily = Main.universe.families.get(10);
				if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
					ecsTmpFamily.add(_ecsTmpEntity);
				}
				var ecsTmpFamily = Main.universe.families.get(11);
				if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
					ecsTmpFamily.add(_ecsTmpEntity);
				}
				var ecsTmpFamily = Main.universe.families.get(2);
				if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
					ecsTmpFamily.add(_ecsTmpEntity);
				}
				var ecsTmpFamily = Main.universe.families.get(6);
				if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
					ecsTmpFamily.add(_ecsTmpEntity);
				}
				var ecsTmpFamily = Main.universe.families.get(8);
				if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
					ecsTmpFamily.add(_ecsTmpEntity);
				}
				break;
			default:
				haxe_Log.trace(interaction.customId,{ fileName : "src/Main.hx", lineNumber : 311, className : "Main", methodName : "start"});
			}
			return;
		}
		if(interaction.isMessageContextMenuCommand()) {
			var type;
			switch(interaction.commandName) {
			case "Delete Project":
				type = "DeleteProject";
				break;
			case "Line Numbers":
				type = "CodeLineNumbers";
				break;
			case "Pin Message":
				type = "PinMessage";
				break;
			default:
				type = "none";
			}
			if(type != "none") {
				var _ecsTmpEntity = Main.universe.createEntity();
				Main.universe.components.set(_ecsTmpEntity,9,type);
				Main.universe.components.set(_ecsTmpEntity,4,interaction);
				var ecsEntCompFlags = Main.universe.components.flags[ecs_Entity.id(_ecsTmpEntity)];
				var ecsTmpFamily = Main.universe.families.get(8);
				if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
					ecsTmpFamily.add(_ecsTmpEntity);
				}
				var ecsTmpFamily = Main.universe.families.get(2);
				if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
					ecsTmpFamily.add(_ecsTmpEntity);
				}
				var ecsTmpFamily = Main.universe.families.get(6);
				if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
					ecsTmpFamily.add(_ecsTmpEntity);
				}
				var ecsTmpFamily = Main.universe.families.get(7);
				if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
					ecsTmpFamily.add(_ecsTmpEntity);
				}
			}
			return;
		}
		if(interaction.isAutocomplete()) {
			haxe_Log.trace(interaction,{ fileName : "src/Main.hx", lineNumber : 335, className : "Main", methodName : "start"});
		}
		if(!interaction.isCommand() && !interaction.isAutocomplete() && !interaction.isChatInputCommand()) {
			return;
		}
		var command = Main.createCommand(interaction);
		var _ecsTmpEntity = Main.universe.createEntity();
		Main.universe.components.set(_ecsTmpEntity,3,command);
		Main.universe.components.set(_ecsTmpEntity,4,interaction);
		var ecsEntCompFlags = Main.universe.components.flags[ecs_Entity.id(_ecsTmpEntity)];
		var ecsTmpFamily = Main.universe.families.get(2);
		if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
			ecsTmpFamily.add(_ecsTmpEntity);
		}
		var ecsTmpFamily = Main.universe.families.get(6);
		if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
			ecsTmpFamily.add(_ecsTmpEntity);
		}
		var ecsTmpFamily = Main.universe.families.get(7);
		if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
			ecsTmpFamily.add(_ecsTmpEntity);
		}
		var ecsTmpFamily = Main.universe.families.get(8);
		if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
			ecsTmpFamily.add(_ecsTmpEntity);
		}
	});
	Main.client.login(Main.get_discord().token);
	new haxe_Timer(500).run = function() {
		if(!Main.connected || !Main.commands_active) {
			return;
		}
		Main.universe.update(1);
	};
};
Main.supressEmbeds = function(message) {
};
Main.createCommand = function(interaction) {
	var command = { name : interaction.commandName, content : null};
	if(command.name == "helppls") {
		var time = new Date().getTime();
		Main.dm_help_tracking.h[interaction.user.id] = time;
	}
	var enum_id = command.name.charAt(0).toUpperCase() + command.name.substring(1);
	var _g = 0;
	var _g1 = Main.command_file;
	while(_g < _g1.length) {
		var value = _g1[_g];
		++_g;
		if(value.name != command.name) {
			continue;
		}
		if(value.params == null) {
			var id = "";
			if(value.type == "menu") {
				id = value.id;
			} else {
				id = enum_id;
			}
			command.content = Type.createEnum(components_CommandOptions,id);
		} else {
			var subcommand = null;
			var params = [];
			var _g2 = 0;
			var _g3 = value.params;
			while(_g2 < _g3.length) {
				var param = _g3[_g2];
				++_g2;
				switch(param.type) {
				case "bool":
					params.push(interaction.options.getBoolean(param.name));
					break;
				case "channel":
					params.push(interaction.options.getChannel(param.name));
					break;
				case "mention":
					params.push(interaction.options.getMentionable(param.name));
					break;
				case "number":
					params.push(interaction.options.getNumber(param.name));
					break;
				case "role":
					params.push(interaction.options.getRole(param.name));
					break;
				case "string":
					params.push(interaction.options.getString(param.name));
					break;
				case "subcommand":
					var type = interaction.options.getSubcommand();
					if(param.name != type) {
						continue;
					}
					subcommand = type;
					var _g4 = 0;
					var _g5 = param.params;
					while(_g4 < _g5.length) {
						var subparam = _g5[_g4];
						++_g4;
						Main.parseIncomingCommand(params,subparam,interaction);
					}
					break;
				case "user":
					params.push(interaction.options.getUser(param.name));
					break;
				default:
					throw haxe_Exception.thrown("Something went wrong.");
				}
			}
			if(subcommand != null) {
				enum_id += subcommand.charAt(0).toUpperCase() + subcommand.substring(1);
			}
			command.content = Type.createEnum(components_CommandOptions,enum_id,params);
		}
	}
	return command;
};
Main.parseIncomingCommand = function(args,param,interaction) {
	switch(param.type) {
	case "bool":
		args.push(interaction.options.getBoolean(param.name));
		break;
	case "channel":
		args.push(interaction.options.getChannel(param.name));
		break;
	case "mention":
		args.push(interaction.options.getMentionable(param.name));
		break;
	case "number":
		args.push(interaction.options.getNumber(param.name));
		break;
	case "role":
		args.push(interaction.options.getRole(param.name));
		break;
	case "string":
		args.push(interaction.options.getString(param.name));
		break;
	case "user":
		args.push(interaction.options.getUser(param.name));
		break;
	default:
		throw haxe_Exception.thrown("Something went wrong.");
	}
};
Main.getCommand = function(name) {
	if(Main.registered_commands == null) {
		return null;
	}
	var h = Main.registered_commands.h;
	var command_keys = Object.keys(h);
	var command_length = command_keys.length;
	var command_current = 0;
	while(command_current < command_length) {
		var command = h[command_keys[command_current++]];
		if(name == command.name) {
			return command;
		}
	}
	return null;
};
Main.saveCommand = function(command) {
	Main.registered_commands.h[command.name] = command;
	haxe_Log.trace("registered " + command.name,{ fileName : "src/Main.hx", lineNumber : 475, className : "Main", methodName : "saveCommand"});
};
Main.main = function() {
	try {
		Main.keys = JSON.parse(js_node_Fs.readFileSync("./config/keys.json",{ encoding : "utf8"}));
		Main.command_file = JSON.parse(js_node_Fs.readFileSync("./config/commands.json",{ encoding : "utf8"}));
	} catch( _g ) {
		var e = haxe_Exception.caught(_g);
		haxe_Log.trace(e.get_message(),{ fileName : "src/Main.hx", lineNumber : 483, className : "Main", methodName : "main"});
	}
	if(Main.keys == null || Main.get_discord().token == null) {
		throw haxe_Exception.thrown("Enter your discord auth token.");
	}
	Main.app = firebase_web_app_FirebaseApp.initializeApp(Main.keys.firebase);
	firebase_web_auth_Auth.signInWithEmailAndPassword(firebase_web_auth_Auth.getAuth(),Main.keys.username,Main.keys.password).then(function(res) {
		haxe_Log.trace("logged in",{ fileName : "src/Main.hx", lineNumber : 493, className : "Main", methodName : "main"});
		var doc = firebase_web_firestore_Firestore.doc(firebase_web_firestore_Firestore.getFirestore(Main.app),"discord/admin");
		firebase_web_firestore_Firestore.onSnapshot(doc,function(resp) {
			CommandPermission.admin = resp.data();
			Main.auth = res.user;
			Main.logged_in = true;
		},function(err) {
			haxe_Log.trace(err,{ fileName : "src/Main.hx", lineNumber : 503, className : "Main", methodName : "main"});
			$global.console.dir(err);
		});
	});
	Main.start();
};
Main.updateState = function(field,value) {
	var record = new db_Record();
	record.field("key",field);
	record.field("value",value);
	var e = database_DBEvents.Update("state",record,QueryExpr.QueryBinop(QBinop.QOpAssign,QueryExpr.QueryConstant(QConstant.QIdent("key")),QueryExpr.QueryValue(field)),function(response) {
		if(response._hx_index == 4) {
			haxe_Log.trace("updated state",{ fileName : "src/Main.hx", lineNumber : 519, className : "Main", methodName : "updateState"});
		} else {
			haxe_Log.trace(response,{ fileName : "src/Main.hx", lineNumber : 521, className : "Main", methodName : "updateState"});
		}
	});
	var _ecsTmpEntity = Main.universe.createEntity();
	Main.universe.components.set(_ecsTmpEntity,2,e);
	var ecsEntCompFlags = Main.universe.components.flags[ecs_Entity.id(_ecsTmpEntity)];
	var ecsTmpFamily = Main.universe.families.get(1);
	if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
		ecsTmpFamily.add(_ecsTmpEntity);
	}
};
Main.parseCommands = function() {
	if(Main.command_file == null || Main.command_file.length == 0) {
		throw haxe_Exception.thrown("No commands configured in the config.json file.");
	}
	var commands = [];
	var _g = 0;
	var _g1 = Main.command_file;
	while(_g < _g1.length) {
		var command = _g1[_g];
		++_g;
		if(command.is_public != null && !command.is_public) {
			continue;
		}
		var permission = CommandPermission.fromString(command.permissions);
		if(permission == null) {
			permission = 1024 | 2048;
		}
		if(command.type == "menu") {
			commands.push(discord_$builder_AnySlashCommand.fromContextMenu(new discord_$builder_ContextMenuCommandBuilder().setName(command.name).setType(command.menu_type).setDefaultMemberPermissions(permission)));
			continue;
		}
		var main_command = new discord_$builder_SlashCommandBuilder().setName(command.name).setDescription(command.description).setDefaultMemberPermissions(permission);
		if(command.params != null) {
			var _g2 = 0;
			var _g3 = command.params;
			while(_g2 < _g3.length) {
				var param = _g3[_g2];
				++_g2;
				var autocomplete = false;
				if(param.type == "subcommand") {
					var subcommand = new discord_$builder_SlashCommandSubcommandBuilder().setName(param.name).setDescription(param.description);
					var _g4 = 0;
					var _g5 = param.params;
					while(_g4 < _g5.length) {
						var subparam = _g5[_g4];
						++_g4;
						var autocomplete1 = false;
						if(subparam.autocomplete != null) {
							autocomplete1 = subparam.autocomplete;
						}
						Main.parseCommandType(subparam,autocomplete1,subcommand);
					}
					main_command.addSubcommand(subcommand);
				} else {
					if(param.autocomplete != null) {
						autocomplete = param.autocomplete;
					}
					Main.parseCommandType(param,autocomplete,main_command);
				}
			}
		}
		commands.push(discord_$builder_AnySlashCommand.fromBase(main_command));
	}
	return commands;
};
Main.parseCommandType = function(param,autocomplete,builder) {
	switch(param.type) {
	case "bool":
		builder.addBooleanOption(new discord_$builder_SlashCommandBooleanOption().setName(param.name).setDescription(param.description).setRequired(param.required));
		break;
	case "channel":
		builder.addChannelOption(new discord_$builder_SlashCommandChannelOption().setName(param.name).setDescription(param.description).setRequired(param.required));
		break;
	case "mention":
		builder.addMentionableOption(new discord_$builder_SlashCommandMentionableOption().setName(param.name).setDescription(param.description).setRequired(param.required));
		break;
	case "number":
		builder.addNumberOption(new discord_$builder_SlashCommandNumberOption().setName(param.name).setDescription(param.description).setRequired(param.required));
		break;
	case "role":
		builder.addRoleOption(new discord_$builder_SlashCommandRoleOption().setName(param.name).setDescription(param.description).setRequired(param.required));
		break;
	case "string":
		var cmd = new discord_$builder_SlashCommandStringOption().setName(param.name).setRequired(param.required).setAutocomplete(autocomplete);
		if(param.description != null) {
			cmd = cmd.setDescription(param.description);
		}
		if(param.choices != null && !autocomplete) {
			var choices = [];
			var _g = 0;
			var _g1 = param.choices;
			while(_g < _g1.length) {
				var option = _g1[_g];
				++_g;
				choices.push({ name : option.name, value : option.value});
			}
			($_=cmd,$_.addChoices.apply($_,choices));
		}
		builder.addStringOption(cmd);
		break;
	case "user":
		builder.addUserOption(new discord_$builder_SlashCommandUserOption().setName(param.name).setDescription(param.description).setRequired(param.required));
		break;
	default:
	}
};
var CommandPermission = {};
CommandPermission.fromString = function(value) {
	switch(value) {
	case "admin":
		return 8;
	case "everyone":
		return 1024 | 2048;
	case "supermod":
		return 4;
	default:
		return 1024 | 2048;
	}
};
Math.__name__ = "Math";
var NodeHtmlParser = require("node-html-parser");
var QBinop = $hxEnums["QBinop"] = { __ename__:"QBinop",__constructs__:null
	,QOpEq: {_hx_name:"QOpEq",_hx_index:0,__enum__:"QBinop",toString:$estr}
	,QOpAssign: {_hx_name:"QOpAssign",_hx_index:1,__enum__:"QBinop",toString:$estr}
	,QOpBoolAnd: {_hx_name:"QOpBoolAnd",_hx_index:2,__enum__:"QBinop",toString:$estr}
	,QOpBoolOr: {_hx_name:"QOpBoolOr",_hx_index:3,__enum__:"QBinop",toString:$estr}
	,QOpNotEq: {_hx_name:"QOpNotEq",_hx_index:4,__enum__:"QBinop",toString:$estr}
	,QOpGt: {_hx_name:"QOpGt",_hx_index:5,__enum__:"QBinop",toString:$estr}
	,QOpLt: {_hx_name:"QOpLt",_hx_index:6,__enum__:"QBinop",toString:$estr}
	,QOpGte: {_hx_name:"QOpGte",_hx_index:7,__enum__:"QBinop",toString:$estr}
	,QOpLte: {_hx_name:"QOpLte",_hx_index:8,__enum__:"QBinop",toString:$estr}
	,QOpIn: {_hx_name:"QOpIn",_hx_index:9,__enum__:"QBinop",toString:$estr}
	,QOpUnsupported: ($_=function(v) { return {_hx_index:10,v:v,__enum__:"QBinop",toString:$estr,__params__:function(){ return [this.v];}}; },$_._hx_name="QOpUnsupported",$_)
};
QBinop.__constructs__ = [QBinop.QOpEq,QBinop.QOpAssign,QBinop.QOpBoolAnd,QBinop.QOpBoolOr,QBinop.QOpNotEq,QBinop.QOpGt,QBinop.QOpLt,QBinop.QOpGte,QBinop.QOpLte,QBinop.QOpIn,QBinop.QOpUnsupported];
QBinop.__empty_constructs__ = [QBinop.QOpEq,QBinop.QOpAssign,QBinop.QOpBoolAnd,QBinop.QOpBoolOr,QBinop.QOpNotEq,QBinop.QOpGt,QBinop.QOpLt,QBinop.QOpGte,QBinop.QOpLte,QBinop.QOpIn];
var QConstant = $hxEnums["QConstant"] = { __ename__:"QConstant",__constructs__:null
	,QInt: ($_=function(v) { return {_hx_index:0,v:v,__enum__:"QConstant",toString:$estr,__params__:function(){ return [this.v];}}; },$_._hx_name="QInt",$_)
	,QFloat: ($_=function(f) { return {_hx_index:1,f:f,__enum__:"QConstant",toString:$estr,__params__:function(){ return [this.f];}}; },$_._hx_name="QFloat",$_)
	,QString: ($_=function(s) { return {_hx_index:2,s:s,__enum__:"QConstant",toString:$estr,__params__:function(){ return [this.s];}}; },$_._hx_name="QString",$_)
	,QIdent: ($_=function(s) { return {_hx_index:3,s:s,__enum__:"QConstant",toString:$estr,__params__:function(){ return [this.s];}}; },$_._hx_name="QIdent",$_)
};
QConstant.__constructs__ = [QConstant.QInt,QConstant.QFloat,QConstant.QString,QConstant.QIdent];
QConstant.__empty_constructs__ = [];
var QueryExpr = $hxEnums["QueryExpr"] = { __ename__:"QueryExpr",__constructs__:null
	,QueryBinop: ($_=function(op,e1,e2) { return {_hx_index:0,op:op,e1:e1,e2:e2,__enum__:"QueryExpr",toString:$estr,__params__:function(){ return [this.op,this.e1,this.e2];}}; },$_._hx_name="QueryBinop",$_)
	,QueryConstant: ($_=function(c) { return {_hx_index:1,c:c,__enum__:"QueryExpr",toString:$estr,__params__:function(){ return [this.c];}}; },$_._hx_name="QueryConstant",$_)
	,QueryParenthesis: ($_=function(e) { return {_hx_index:2,e:e,__enum__:"QueryExpr",toString:$estr,__params__:function(){ return [this.e];}}; },$_._hx_name="QueryParenthesis",$_)
	,QueryValue: ($_=function(v) { return {_hx_index:3,v:v,__enum__:"QueryExpr",toString:$estr,__params__:function(){ return [this.v];}}; },$_._hx_name="QueryValue",$_)
	,QueryCall: ($_=function(name,params) { return {_hx_index:4,name:name,params:params,__enum__:"QueryExpr",toString:$estr,__params__:function(){ return [this.name,this.params];}}; },$_._hx_name="QueryCall",$_)
	,QueryArrayDecl: ($_=function(values) { return {_hx_index:5,values:values,__enum__:"QueryExpr",toString:$estr,__params__:function(){ return [this.values];}}; },$_._hx_name="QueryArrayDecl",$_)
	,QueryUnsupported: ($_=function(v) { return {_hx_index:6,v:v,__enum__:"QueryExpr",toString:$estr,__params__:function(){ return [this.v];}}; },$_._hx_name="QueryUnsupported",$_)
};
QueryExpr.__constructs__ = [QueryExpr.QueryBinop,QueryExpr.QueryConstant,QueryExpr.QueryParenthesis,QueryExpr.QueryValue,QueryExpr.QueryCall,QueryExpr.QueryArrayDecl,QueryExpr.QueryUnsupported];
QueryExpr.__empty_constructs__ = [];
var Query = function() { };
$hxClasses["Query"] = Query;
Query.__name__ = "Query";
Query.joinQueryParts = function(parts,op) {
	var query = null;
	if(parts.length > 1) {
		var last = parts.pop();
		var beforeLast = parts.pop();
		var qp = QueryExpr.QueryBinop(op,beforeLast,last);
		while(parts.length > 0) {
			var q = parts.pop();
			qp = QueryExpr.QueryBinop(op,q,qp);
		}
		query = qp;
	} else {
		query = parts[0];
	}
	return query;
};
Query.queryExprToSql = function(qe,values,fieldPrefix) {
	if(qe == null) {
		return null;
	}
	var sb = new StringBuf();
	Query.queryExprPartToSql(qe,sb,values,fieldPrefix,false);
	return sb.b;
};
Query.queryExprPartToSql = function(qe,sb,values,fieldPrefix,isColumn) {
	while(true) {
		switch(qe._hx_index) {
		case 0:
			var _gop = qe.op;
			var _ge = qe.e2;
			var isColumn2 = _gop == QBinop.QOpEq || _gop == QBinop.QOpAssign || _gop == QBinop.QOpNotEq || _gop == QBinop.QOpGt || _gop == QBinop.QOpLt || _gop == QBinop.QOpGte || _gop == QBinop.QOpLte || _gop == QBinop.QOpIn;
			Query.queryExprPartToSql(qe.e1,sb,values,fieldPrefix,isColumn2);
			switch(_gop._hx_index) {
			case 0:
				sb.b += " = ";
				break;
			case 1:
				sb.b += " = ";
				break;
			case 2:
				sb.b += " AND ";
				break;
			case 3:
				sb.b += " OR ";
				break;
			case 4:
				sb.b += " <> ";
				break;
			case 5:
				sb.b += " > ";
				break;
			case 6:
				sb.b += " < ";
				break;
			case 7:
				sb.b += " >= ";
				break;
			case 8:
				sb.b += " <= ";
				break;
			case 9:
				sb.b += " IN ";
				break;
			case 10:
				haxe_Log.trace("WARNING: unsupported binary operation encountered:",{ fileName : "Query.hx", lineNumber : 192, className : "Query", methodName : "queryExprPartToSql", customParams : [_gop.v]});
				break;
			}
			qe = _ge;
			continue;
		case 1:
			var _gc = qe.c;
			switch(_gc._hx_index) {
			case 0:
				var _gv = _gc.v;
				if(values == null) {
					sb.b += _gv == null ? "null" : "" + _gv;
				} else {
					values.push(_gv);
					sb.b += "?";
				}
				break;
			case 2:
				var _gs = _gc.s;
				if(values == null) {
					sb.b += Std.string("\"" + _gs + "\"");
				} else {
					values.push(_gs);
					sb.b += "?";
				}
				break;
			case 3:
				var x = Query.buildColumn(_gc.s,fieldPrefix);
				sb.b += Std.string(x);
				break;
			default:
			}
			break;
		case 2:
			sb.b += "(";
			Query.queryExprPartToSql(qe.e,sb,values,fieldPrefix,false);
			sb.b += ")";
			break;
		case 3:
			var _gv1 = qe.v;
			if(((_gv1) instanceof Array)) {
				sb.b += "(";
				var array = _gv1;
				var newArray = [];
				var _g = 0;
				while(_g < array.length) {
					var a = array[_g];
					++_g;
					if(typeof(a) == "string") {
						newArray.push("\"" + (a == null ? "null" : Std.string(a)) + "\"");
					} else {
						newArray.push(a == null ? "null" : Std.string(a));
					}
				}
				var x1 = newArray.join(", ");
				sb.b += Std.string(x1);
				sb.b += ")";
			} else if(values == null) {
				if(StringTools.startsWith(_gv1 == null ? "null" : Std.string(_gv1),"%")) {
					var x2 = Query.buildColumn((_gv1 == null ? "null" : Std.string(_gv1)).substring(1),fieldPrefix);
					sb.b += Std.string(x2);
				} else {
					sb.b += _gv1 == null ? "null" : Std.string(_gv1);
				}
			} else if(StringTools.startsWith(_gv1 == null ? "null" : Std.string(_gv1),"%")) {
				var x3 = Query.buildColumn((_gv1 == null ? "null" : Std.string(_gv1)).substring(1),fieldPrefix);
				sb.b += Std.string(x3);
			} else if(isColumn) {
				var x4 = Query.buildColumn(_gv1 == null ? "null" : Std.string(_gv1),fieldPrefix);
				sb.b += Std.string(x4);
			} else {
				if(((_gv1) instanceof Date)) {
					var date = _gv1;
					var dateString = StringTools.replace(HxOverrides.dateStr(date)," ","T") + "Z";
					values.push(dateString);
				} else {
					values.push(_gv1);
				}
				sb.b += "?";
			}
			break;
		case 4:
			var _gname = qe.name;
			var _gparams = qe.params;
			sb.b += _gname == null ? "null" : "" + _gname;
			sb.b += "(";
			var paramStrings = [];
			var _g1 = 0;
			while(_g1 < _gparams.length) {
				var p = _gparams[_g1];
				++_g1;
				var temp = new StringBuf();
				Query.queryExprPartToSql(p,temp,values,fieldPrefix,false);
				paramStrings.push(temp.b);
			}
			var x5 = paramStrings.join(", ");
			sb.b += Std.string(x5);
			sb.b += ")";
			break;
		case 5:
			var _gvalues = qe.values;
			sb.b += "(";
			var paramStrings1 = [];
			var _g2 = 0;
			while(_g2 < _gvalues.length) {
				var av = _gvalues[_g2];
				++_g2;
				var temp1 = new StringBuf();
				Query.queryExprPartToSql(av,temp1,values,fieldPrefix,false);
				paramStrings1.push(temp1.b);
			}
			var x6 = paramStrings1.join(", ");
			sb.b += Std.string(x6);
			sb.b += ")";
			break;
		case 6:
			haxe_Log.trace("WARNING: unsupported query expression encountered:",{ fileName : "Query.hx", lineNumber : 276, className : "Query", methodName : "queryExprPartToSql", customParams : [qe.v]});
			break;
		}
		return;
	}
};
Query.buildColumn = function(s,fieldPrefix) {
	var full = s;
	if(fieldPrefix != null) {
		full = fieldPrefix + "." + s;
	}
	var sb_b = "";
	if(full.indexOf(".") != -1) {
		var parts = full.split(".");
		var field = parts.pop();
		sb_b = "`";
		sb_b = "`" + Std.string(parts.join("."));
		sb_b += "`.`";
		sb_b += field == null ? "null" : "" + field;
		sb_b += "`";
	} else {
		sb_b = "" + (full == null ? "null" : "" + full);
	}
	return sb_b;
};
var Reflect = function() { };
$hxClasses["Reflect"] = Reflect;
Reflect.__name__ = "Reflect";
Reflect.hasField = function(o,field) {
	return Object.prototype.hasOwnProperty.call(o,field);
};
Reflect.field = function(o,field) {
	try {
		return o[field];
	} catch( _g ) {
		haxe_NativeStackTrace.lastError = _g;
		return null;
	}
};
Reflect.setField = function(o,field,value) {
	o[field] = value;
};
Reflect.getProperty = function(o,field) {
	var tmp;
	if(o == null) {
		return null;
	} else {
		var tmp1;
		if(o.__properties__) {
			tmp = o.__properties__["get_" + field];
			tmp1 = tmp;
		} else {
			tmp1 = false;
		}
		if(tmp1) {
			return o[tmp]();
		} else {
			return o[field];
		}
	}
};
Reflect.setProperty = function(o,field,value) {
	var tmp;
	var tmp1;
	if(o.__properties__) {
		tmp = o.__properties__["set_" + field];
		tmp1 = tmp;
	} else {
		tmp1 = false;
	}
	if(tmp1) {
		o[tmp](value);
	} else {
		o[field] = value;
	}
};
Reflect.callMethod = function(o,func,args) {
	return func.apply(o,args);
};
Reflect.fields = function(o) {
	var a = [];
	if(o != null) {
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		for( var f in o ) {
		if(f != "__id__" && f != "hx__closures__" && hasOwnProperty.call(o,f)) {
			a.push(f);
		}
		}
	}
	return a;
};
Reflect.isFunction = function(f) {
	if(typeof(f) == "function") {
		return !(f.__name__ || f.__ename__);
	} else {
		return false;
	}
};
Reflect.compare = function(a,b) {
	if(a == b) {
		return 0;
	} else if(a > b) {
		return 1;
	} else {
		return -1;
	}
};
Reflect.compareMethods = function(f1,f2) {
	return f1 == f2;
};
Reflect.isObject = function(v) {
	if(v == null) {
		return false;
	}
	var t = typeof(v);
	if(!(t == "string" || t == "object" && v.__enum__ == null)) {
		if(t == "function") {
			return (v.__name__ || v.__ename__) != null;
		} else {
			return false;
		}
	} else {
		return true;
	}
};
Reflect.isEnumValue = function(v) {
	if(v != null) {
		return v.__enum__ != null;
	} else {
		return false;
	}
};
Reflect.deleteField = function(o,field) {
	if(!Object.prototype.hasOwnProperty.call(o,field)) {
		return false;
	}
	delete(o[field]);
	return true;
};
Reflect.copy = function(o) {
	if(o == null) {
		return null;
	}
	var o2 = { };
	var _g = 0;
	var _g1 = Reflect.fields(o);
	while(_g < _g1.length) {
		var f = _g1[_g];
		++_g;
		o2[f] = Reflect.field(o,f);
	}
	return o2;
};
Reflect.makeVarArgs = function(f) {
	return function() {
		var a = Array.prototype.slice;
		var a1 = arguments;
		var a2 = a.call(a1);
		return f(a2);
	};
};
var Safety = function() { };
$hxClasses["Safety"] = Safety;
Safety.__name__ = "Safety";
Safety.or = function(value,defaultValue) {
	if(value == null) {
		return defaultValue;
	} else {
		return value;
	}
};
Safety.orGet = function(value,getter) {
	if(value == null) {
		return getter();
	} else {
		return value;
	}
};
Safety.sure = function(value) {
	if(value == null) {
		throw new safety_NullPointerException("Null pointer in .sure() call");
	} else {
		return value;
	}
};
Safety.unsafe = function(value) {
	return value;
};
Safety.check = function(value,callback) {
	if(value != null) {
		return callback(value);
	} else {
		return false;
	}
};
Safety.let = function(value,callback) {
	if(value == null) {
		return null;
	} else {
		return callback(value);
	}
};
Safety.run = function(value,callback) {
	if(value != null) {
		callback(value);
	}
};
Safety.apply = function(value,callback) {
	if(value != null) {
		callback(value);
	}
	return value;
};
var Std = function() { };
$hxClasses["Std"] = Std;
Std.__name__ = "Std";
Std.is = function(v,t) {
	return js_Boot.__instanceof(v,t);
};
Std.isOfType = function(v,t) {
	return js_Boot.__instanceof(v,t);
};
Std.downcast = function(value,c) {
	if(js_Boot.__downcastCheck(value,c)) {
		return value;
	} else {
		return null;
	}
};
Std.instance = function(value,c) {
	if(js_Boot.__downcastCheck(value,c)) {
		return value;
	} else {
		return null;
	}
};
Std.string = function(s) {
	return js_Boot.__string_rec(s,"");
};
Std.int = function(x) {
	return x | 0;
};
Std.parseInt = function(x) {
	var v = parseInt(x);
	if(isNaN(v)) {
		return null;
	}
	return v;
};
Std.parseFloat = function(x) {
	return parseFloat(x);
};
Std.random = function(x) {
	if(x <= 0) {
		return 0;
	} else {
		return Math.floor(Math.random() * x);
	}
};
var StringBuf = function() {
	this.b = "";
};
$hxClasses["StringBuf"] = StringBuf;
StringBuf.__name__ = "StringBuf";
StringBuf.prototype = {
	b: null
	,get_length: function() {
		return this.b.length;
	}
	,add: function(x) {
		this.b += Std.string(x);
	}
	,addChar: function(c) {
		this.b += String.fromCodePoint(c);
	}
	,addSub: function(s,pos,len) {
		this.b += len == null ? HxOverrides.substr(s,pos,null) : HxOverrides.substr(s,pos,len);
	}
	,toString: function() {
		return this.b;
	}
	,__class__: StringBuf
	,__properties__: {get_length:"get_length"}
};
var haxe_SysTools = function() { };
$hxClasses["haxe.SysTools"] = haxe_SysTools;
haxe_SysTools.__name__ = "haxe.SysTools";
haxe_SysTools.quoteUnixArg = function(argument) {
	if(argument == "") {
		return "''";
	}
	if(!new EReg("[^a-zA-Z0-9_@%+=:,./-]","").match(argument)) {
		return argument;
	}
	return "'" + StringTools.replace(argument,"'","'\"'\"'") + "'";
};
haxe_SysTools.quoteWinArg = function(argument,escapeMetaCharacters) {
	if(!new EReg("^(/)?[^ \t/\\\\\"]+$","").match(argument)) {
		var result_b = "";
		var needquote = argument.indexOf(" ") != -1 || argument.indexOf("\t") != -1 || argument == "" || argument.indexOf("/") > 0;
		if(needquote) {
			result_b += "\"";
		}
		var bs_buf = new StringBuf();
		var _g = 0;
		var _g1 = argument.length;
		while(_g < _g1) {
			var i = _g++;
			var _g2 = HxOverrides.cca(argument,i);
			if(_g2 == null) {
				var c = _g2;
				if(bs_buf.b.length > 0) {
					result_b += Std.string(bs_buf.b);
					bs_buf = new StringBuf();
				}
				result_b += String.fromCodePoint(c);
			} else {
				switch(_g2) {
				case 34:
					var bs = bs_buf.b;
					result_b += bs == null ? "null" : "" + bs;
					result_b += bs == null ? "null" : "" + bs;
					bs_buf = new StringBuf();
					result_b += "\\\"";
					break;
				case 92:
					bs_buf.b += "\\";
					break;
				default:
					var c1 = _g2;
					if(bs_buf.b.length > 0) {
						result_b += Std.string(bs_buf.b);
						bs_buf = new StringBuf();
					}
					result_b += String.fromCodePoint(c1);
				}
			}
		}
		result_b += Std.string(bs_buf.b);
		if(needquote) {
			result_b += Std.string(bs_buf.b);
			result_b += "\"";
		}
		argument = result_b;
	}
	if(escapeMetaCharacters) {
		var result_b = "";
		var _g = 0;
		var _g1 = argument.length;
		while(_g < _g1) {
			var i = _g++;
			var c = HxOverrides.cca(argument,i);
			if(haxe_SysTools.winMetaCharacters.indexOf(c) >= 0) {
				result_b += String.fromCodePoint(94);
			}
			result_b += String.fromCodePoint(c);
		}
		return result_b;
	} else {
		return argument;
	}
};
var StringTools = function() { };
$hxClasses["StringTools"] = StringTools;
StringTools.__name__ = "StringTools";
StringTools.urlEncode = function(s) {
	return encodeURIComponent(s);
};
StringTools.urlDecode = function(s) {
	return decodeURIComponent(s.split("+").join(" "));
};
StringTools.htmlEscape = function(s,quotes) {
	var buf_b = "";
	var _g_offset = 0;
	var _g_s = s;
	while(_g_offset < _g_s.length) {
		var s = _g_s;
		var index = _g_offset++;
		var c = s.charCodeAt(index);
		if(c >= 55296 && c <= 56319) {
			c = c - 55232 << 10 | s.charCodeAt(index + 1) & 1023;
		}
		var c1 = c;
		if(c1 >= 65536) {
			++_g_offset;
		}
		var code = c1;
		switch(code) {
		case 34:
			if(quotes) {
				buf_b += "&quot;";
			} else {
				buf_b += String.fromCodePoint(code);
			}
			break;
		case 38:
			buf_b += "&amp;";
			break;
		case 39:
			if(quotes) {
				buf_b += "&#039;";
			} else {
				buf_b += String.fromCodePoint(code);
			}
			break;
		case 60:
			buf_b += "&lt;";
			break;
		case 62:
			buf_b += "&gt;";
			break;
		default:
			buf_b += String.fromCodePoint(code);
		}
	}
	return buf_b;
};
StringTools.htmlUnescape = function(s) {
	return s.split("&gt;").join(">").split("&lt;").join("<").split("&quot;").join("\"").split("&#039;").join("'").split("&amp;").join("&");
};
StringTools.contains = function(s,value) {
	return s.indexOf(value) != -1;
};
StringTools.startsWith = function(s,start) {
	if(s.length >= start.length) {
		return s.lastIndexOf(start,0) == 0;
	} else {
		return false;
	}
};
StringTools.endsWith = function(s,end) {
	var elen = end.length;
	var slen = s.length;
	if(slen >= elen) {
		return s.indexOf(end,slen - elen) == slen - elen;
	} else {
		return false;
	}
};
StringTools.isSpace = function(s,pos) {
	var c = HxOverrides.cca(s,pos);
	if(!(c > 8 && c < 14)) {
		return c == 32;
	} else {
		return true;
	}
};
StringTools.ltrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,r)) ++r;
	if(r > 0) {
		return HxOverrides.substr(s,r,l - r);
	} else {
		return s;
	}
};
StringTools.rtrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,l - r - 1)) ++r;
	if(r > 0) {
		return HxOverrides.substr(s,0,l - r);
	} else {
		return s;
	}
};
StringTools.trim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,l - r - 1)) ++r;
	var s1 = r > 0 ? HxOverrides.substr(s,0,l - r) : s;
	var l = s1.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s1,r)) ++r;
	if(r > 0) {
		return HxOverrides.substr(s1,r,l - r);
	} else {
		return s1;
	}
};
StringTools.lpad = function(s,c,l) {
	if(c.length <= 0) {
		return s;
	}
	var buf_b = "";
	l -= s.length;
	while(buf_b.length < l) buf_b += c == null ? "null" : "" + c;
	buf_b += s == null ? "null" : "" + s;
	return buf_b;
};
StringTools.rpad = function(s,c,l) {
	if(c.length <= 0) {
		return s;
	}
	var buf_b = "";
	buf_b = "" + (s == null ? "null" : "" + s);
	while(buf_b.length < l) buf_b += c == null ? "null" : "" + c;
	return buf_b;
};
StringTools.replace = function(s,sub,by) {
	return s.split(sub).join(by);
};
StringTools.hex = function(n,digits) {
	var s = "";
	do {
		s = "0123456789ABCDEF".charAt(n & 15) + s;
		n >>>= 4;
	} while(n > 0);
	if(digits != null) {
		while(s.length < digits) s = "0" + s;
	}
	return s;
};
StringTools.fastCodeAt = function(s,index) {
	return s.charCodeAt(index);
};
StringTools.unsafeCodeAt = function(s,index) {
	return s.charCodeAt(index);
};
StringTools.iterator = function(s) {
	return new haxe_iterators_StringIterator(s);
};
StringTools.keyValueIterator = function(s) {
	return new haxe_iterators_StringKeyValueIterator(s);
};
StringTools.isEof = function(c) {
	return c != c;
};
StringTools.quoteUnixArg = function(argument) {
	if(argument == "") {
		return "''";
	} else if(!new EReg("[^a-zA-Z0-9_@%+=:,./-]","").match(argument)) {
		return argument;
	} else {
		return "'" + StringTools.replace(argument,"'","'\"'\"'") + "'";
	}
};
StringTools.quoteWinArg = function(argument,escapeMetaCharacters) {
	var argument1 = argument;
	if(!new EReg("^(/)?[^ \t/\\\\\"]+$","").match(argument1)) {
		var result_b = "";
		var needquote = argument1.indexOf(" ") != -1 || argument1.indexOf("\t") != -1 || argument1 == "" || argument1.indexOf("/") > 0;
		if(needquote) {
			result_b += "\"";
		}
		var bs_buf = new StringBuf();
		var _g = 0;
		var _g1 = argument1.length;
		while(_g < _g1) {
			var i = _g++;
			var _g2 = HxOverrides.cca(argument1,i);
			if(_g2 == null) {
				var c = _g2;
				if(bs_buf.b.length > 0) {
					result_b += Std.string(bs_buf.b);
					bs_buf = new StringBuf();
				}
				result_b += String.fromCodePoint(c);
			} else {
				switch(_g2) {
				case 34:
					var bs = bs_buf.b;
					result_b += Std.string(bs);
					result_b += Std.string(bs);
					bs_buf = new StringBuf();
					result_b += "\\\"";
					break;
				case 92:
					bs_buf.b += "\\";
					break;
				default:
					var c1 = _g2;
					if(bs_buf.b.length > 0) {
						result_b += Std.string(bs_buf.b);
						bs_buf = new StringBuf();
					}
					result_b += String.fromCodePoint(c1);
				}
			}
		}
		result_b += Std.string(bs_buf.b);
		if(needquote) {
			result_b += Std.string(bs_buf.b);
			result_b += "\"";
		}
		argument1 = result_b;
	}
	if(escapeMetaCharacters) {
		var result_b = "";
		var _g = 0;
		var _g1 = argument1.length;
		while(_g < _g1) {
			var i = _g++;
			var c = HxOverrides.cca(argument1,i);
			if(haxe_SysTools.winMetaCharacters.indexOf(c) >= 0) {
				result_b += String.fromCodePoint(94);
			}
			result_b += String.fromCodePoint(c);
		}
		return result_b;
	} else {
		return argument1;
	}
};
StringTools.utf16CodePointAt = function(s,index) {
	var c = s.charCodeAt(index);
	if(c >= 55296 && c <= 56319) {
		c = c - 55232 << 10 | s.charCodeAt(index + 1) & 1023;
	}
	return c;
};
var Sys = function() { };
$hxClasses["Sys"] = Sys;
Sys.__name__ = "Sys";
Sys.print = function(v) {
	process.stdout.write(Std.string(v));
};
Sys.println = function(v) {
	process.stdout.write(Std.string(v));
	process.stdout.write("\n");
};
Sys.args = function() {
	return process.argv.slice(2);
};
Sys.getEnv = function(s) {
	return process.env[s];
};
Sys.putEnv = function(s,v) {
	if(v == null) {
		Reflect.deleteField(process.env,s);
	} else {
		process.env[s] = v;
	}
};
Sys.environment = function() {
	var m = new haxe_ds_StringMap();
	var _g = 0;
	var _g1 = Reflect.fields(process.env);
	while(_g < _g1.length) {
		var key = _g1[_g];
		++_g;
		var v = process.env[key];
		m.h[key] = v;
	}
	return m;
};
Sys.setTimeLocale = function(loc) {
	return false;
};
Sys.getCwd = function() {
	return haxe_io_Path.addTrailingSlash(process.cwd());
};
Sys.setCwd = function(s) {
	process.chdir(s);
};
Sys.systemName = function() {
	var _g = process.platform;
	switch(_g) {
	case "darwin":
		return "Mac";
	case "freebsd":
		return "BSD";
	case "linux":
		return "Linux";
	case "win32":
		return "Windows";
	default:
		return _g;
	}
};
Sys.command = function(cmd,args) {
	if(args == null) {
		return js_node_ChildProcess.spawnSync(cmd,{ shell : true, stdio : "inherit"}).status;
	} else {
		return js_node_ChildProcess.spawnSync(cmd,args,{ stdio : "inherit"}).status;
	}
};
Sys.exit = function(code) {
	process.exit(code);
};
Sys.time = function() {
	return Date.now() / 1000;
};
Sys.cpuTime = function() {
	return process.uptime();
};
Sys.executablePath = function() {
	return process.argv[0];
};
Sys.programPath = function() {
	return __filename;
};
Sys.getChar = function(echo) {
	throw haxe_Exception.thrown("Sys.getChar is currently not implemented on node.js");
};
Sys.sleep = function(seconds) {
	var end = Date.now() + seconds * 1000;
	while(Date.now() <= end) {
	}
};
Sys.stdin = function() {
	return new _$Sys_FileInput(0);
};
Sys.stdout = function() {
	return new _$Sys_FileOutput(1);
};
Sys.stderr = function() {
	return new _$Sys_FileOutput(2);
};
var haxe_io_Output = function() { };
$hxClasses["haxe.io.Output"] = haxe_io_Output;
haxe_io_Output.__name__ = "haxe.io.Output";
haxe_io_Output.prototype = {
	bigEndian: null
	,writeByte: function(c) {
		throw new haxe_exceptions_NotImplementedException(null,null,{ fileName : "haxe/io/Output.hx", lineNumber : 47, className : "haxe.io.Output", methodName : "writeByte"});
	}
	,writeBytes: function(s,pos,len) {
		if(pos < 0 || len < 0 || pos + len > s.length) {
			throw haxe_Exception.thrown(haxe_io_Error.OutsideBounds);
		}
		var b = s.b;
		var k = len;
		while(k > 0) {
			this.writeByte(b[pos]);
			++pos;
			--k;
		}
		return len;
	}
	,flush: function() {
	}
	,close: function() {
	}
	,set_bigEndian: function(b) {
		this.bigEndian = b;
		return b;
	}
	,write: function(s) {
		var l = s.length;
		var p = 0;
		while(l > 0) {
			var k = this.writeBytes(s,p,l);
			if(k == 0) {
				throw haxe_Exception.thrown(haxe_io_Error.Blocked);
			}
			p += k;
			l -= k;
		}
	}
	,writeFullBytes: function(s,pos,len) {
		while(len > 0) {
			var k = this.writeBytes(s,pos,len);
			pos += k;
			len -= k;
		}
	}
	,writeFloat: function(x) {
		this.writeInt32(haxe_io_FPHelper.floatToI32(x));
	}
	,writeDouble: function(x) {
		var i64 = haxe_io_FPHelper.doubleToI64(x);
		if(this.bigEndian) {
			this.writeInt32(i64.high);
			this.writeInt32(i64.low);
		} else {
			this.writeInt32(i64.low);
			this.writeInt32(i64.high);
		}
	}
	,writeInt8: function(x) {
		if(x < -128 || x >= 128) {
			throw haxe_Exception.thrown(haxe_io_Error.Overflow);
		}
		this.writeByte(x & 255);
	}
	,writeInt16: function(x) {
		if(x < -32768 || x >= 32768) {
			throw haxe_Exception.thrown(haxe_io_Error.Overflow);
		}
		this.writeUInt16(x & 65535);
	}
	,writeUInt16: function(x) {
		if(x < 0 || x >= 65536) {
			throw haxe_Exception.thrown(haxe_io_Error.Overflow);
		}
		if(this.bigEndian) {
			this.writeByte(x >> 8);
			this.writeByte(x & 255);
		} else {
			this.writeByte(x & 255);
			this.writeByte(x >> 8);
		}
	}
	,writeInt24: function(x) {
		if(x < -8388608 || x >= 8388608) {
			throw haxe_Exception.thrown(haxe_io_Error.Overflow);
		}
		this.writeUInt24(x & 16777215);
	}
	,writeUInt24: function(x) {
		if(x < 0 || x >= 16777216) {
			throw haxe_Exception.thrown(haxe_io_Error.Overflow);
		}
		if(this.bigEndian) {
			this.writeByte(x >> 16);
			this.writeByte(x >> 8 & 255);
			this.writeByte(x & 255);
		} else {
			this.writeByte(x & 255);
			this.writeByte(x >> 8 & 255);
			this.writeByte(x >> 16);
		}
	}
	,writeInt32: function(x) {
		if(this.bigEndian) {
			this.writeByte(x >>> 24);
			this.writeByte(x >> 16 & 255);
			this.writeByte(x >> 8 & 255);
			this.writeByte(x & 255);
		} else {
			this.writeByte(x & 255);
			this.writeByte(x >> 8 & 255);
			this.writeByte(x >> 16 & 255);
			this.writeByte(x >>> 24);
		}
	}
	,prepare: function(nbytes) {
	}
	,writeInput: function(i,bufsize) {
		if(bufsize == null) {
			bufsize = 4096;
		}
		var buf = new haxe_io_Bytes(new ArrayBuffer(bufsize));
		try {
			while(true) {
				var len = i.readBytes(buf,0,bufsize);
				if(len == 0) {
					throw haxe_Exception.thrown(haxe_io_Error.Blocked);
				}
				var p = 0;
				while(len > 0) {
					var k = this.writeBytes(buf,p,len);
					if(k == 0) {
						throw haxe_Exception.thrown(haxe_io_Error.Blocked);
					}
					p += k;
					len -= k;
				}
			}
		} catch( _g ) {
			haxe_NativeStackTrace.lastError = _g;
			if(!((haxe_Exception.caught(_g).unwrap()) instanceof haxe_io_Eof)) {
				throw _g;
			}
		}
	}
	,writeString: function(s,encoding) {
		var b = haxe_io_Bytes.ofString(s,encoding);
		this.writeFullBytes(b,0,b.length);
	}
	,__class__: haxe_io_Output
	,__properties__: {set_bigEndian:"set_bigEndian"}
};
var _$Sys_FileOutput = function(fd) {
	this.fd = fd;
};
$hxClasses["_Sys.FileOutput"] = _$Sys_FileOutput;
_$Sys_FileOutput.__name__ = "_Sys.FileOutput";
_$Sys_FileOutput.__super__ = haxe_io_Output;
_$Sys_FileOutput.prototype = $extend(haxe_io_Output.prototype,{
	fd: null
	,writeByte: function(c) {
		js_node_Fs.writeSync(this.fd,String.fromCodePoint(c));
	}
	,writeBytes: function(s,pos,len) {
		var data = s.b;
		return js_node_Fs.writeSync(this.fd,js_node_buffer_Buffer.from(data.buffer,data.byteOffset,s.length),pos,len);
	}
	,writeString: function(s,encoding) {
		js_node_Fs.writeSync(this.fd,s);
	}
	,flush: function() {
		js_node_Fs.fsyncSync(this.fd);
	}
	,close: function() {
		js_node_Fs.closeSync(this.fd);
	}
	,__class__: _$Sys_FileOutput
});
var haxe_io_Input = function() { };
$hxClasses["haxe.io.Input"] = haxe_io_Input;
haxe_io_Input.__name__ = "haxe.io.Input";
haxe_io_Input.prototype = {
	bigEndian: null
	,readByte: function() {
		throw new haxe_exceptions_NotImplementedException(null,null,{ fileName : "haxe/io/Input.hx", lineNumber : 51, className : "haxe.io.Input", methodName : "readByte"});
	}
	,readBytes: function(s,pos,len) {
		var k = len;
		var b = s.b;
		if(pos < 0 || len < 0 || pos + len > s.length) {
			throw haxe_Exception.thrown(haxe_io_Error.OutsideBounds);
		}
		try {
			while(k > 0) {
				b[pos] = this.readByte();
				++pos;
				--k;
			}
		} catch( _g ) {
			haxe_NativeStackTrace.lastError = _g;
			if(!((haxe_Exception.caught(_g).unwrap()) instanceof haxe_io_Eof)) {
				throw _g;
			}
		}
		return len - k;
	}
	,close: function() {
	}
	,set_bigEndian: function(b) {
		this.bigEndian = b;
		return b;
	}
	,readAll: function(bufsize) {
		if(bufsize == null) {
			bufsize = 16384;
		}
		var buf = new haxe_io_Bytes(new ArrayBuffer(bufsize));
		var total = new haxe_io_BytesBuffer();
		try {
			while(true) {
				var len = this.readBytes(buf,0,bufsize);
				if(len == 0) {
					throw haxe_Exception.thrown(haxe_io_Error.Blocked);
				}
				total.addBytes(buf,0,len);
			}
		} catch( _g ) {
			haxe_NativeStackTrace.lastError = _g;
			if(!((haxe_Exception.caught(_g).unwrap()) instanceof haxe_io_Eof)) {
				throw _g;
			}
		}
		return total.getBytes();
	}
	,readFullBytes: function(s,pos,len) {
		while(len > 0) {
			var k = this.readBytes(s,pos,len);
			if(k == 0) {
				throw haxe_Exception.thrown(haxe_io_Error.Blocked);
			}
			pos += k;
			len -= k;
		}
	}
	,read: function(nbytes) {
		var s = new haxe_io_Bytes(new ArrayBuffer(nbytes));
		var p = 0;
		while(nbytes > 0) {
			var k = this.readBytes(s,p,nbytes);
			if(k == 0) {
				throw haxe_Exception.thrown(haxe_io_Error.Blocked);
			}
			p += k;
			nbytes -= k;
		}
		return s;
	}
	,readUntil: function(end) {
		var buf = new haxe_io_BytesBuffer();
		var last;
		while(true) {
			last = this.readByte();
			if(!(last != end)) {
				break;
			}
			buf.addByte(last);
		}
		return buf.getBytes().toString();
	}
	,readLine: function() {
		var buf = new haxe_io_BytesBuffer();
		var last;
		var s;
		try {
			while(true) {
				last = this.readByte();
				if(!(last != 10)) {
					break;
				}
				buf.addByte(last);
			}
			s = buf.getBytes().toString();
			if(HxOverrides.cca(s,s.length - 1) == 13) {
				s = HxOverrides.substr(s,0,-1);
			}
		} catch( _g ) {
			haxe_NativeStackTrace.lastError = _g;
			var _g1 = haxe_Exception.caught(_g).unwrap();
			if(((_g1) instanceof haxe_io_Eof)) {
				var e = _g1;
				s = buf.getBytes().toString();
				if(s.length == 0) {
					throw haxe_Exception.thrown(e);
				}
			} else {
				throw _g;
			}
		}
		return s;
	}
	,readFloat: function() {
		return haxe_io_FPHelper.i32ToFloat(this.readInt32());
	}
	,readDouble: function() {
		var i1 = this.readInt32();
		var i2 = this.readInt32();
		if(this.bigEndian) {
			return haxe_io_FPHelper.i64ToDouble(i2,i1);
		} else {
			return haxe_io_FPHelper.i64ToDouble(i1,i2);
		}
	}
	,readInt8: function() {
		var n = this.readByte();
		if(n >= 128) {
			return n - 256;
		}
		return n;
	}
	,readInt16: function() {
		var ch1 = this.readByte();
		var ch2 = this.readByte();
		var n = this.bigEndian ? ch2 | ch1 << 8 : ch1 | ch2 << 8;
		if((n & 32768) != 0) {
			return n - 65536;
		}
		return n;
	}
	,readUInt16: function() {
		var ch1 = this.readByte();
		var ch2 = this.readByte();
		if(this.bigEndian) {
			return ch2 | ch1 << 8;
		} else {
			return ch1 | ch2 << 8;
		}
	}
	,readInt24: function() {
		var ch1 = this.readByte();
		var ch2 = this.readByte();
		var ch3 = this.readByte();
		var n = this.bigEndian ? ch3 | ch2 << 8 | ch1 << 16 : ch1 | ch2 << 8 | ch3 << 16;
		if((n & 8388608) != 0) {
			return n - 16777216;
		}
		return n;
	}
	,readUInt24: function() {
		var ch1 = this.readByte();
		var ch2 = this.readByte();
		var ch3 = this.readByte();
		if(this.bigEndian) {
			return ch3 | ch2 << 8 | ch1 << 16;
		} else {
			return ch1 | ch2 << 8 | ch3 << 16;
		}
	}
	,readInt32: function() {
		var ch1 = this.readByte();
		var ch2 = this.readByte();
		var ch3 = this.readByte();
		var ch4 = this.readByte();
		if(this.bigEndian) {
			return ch4 | ch3 << 8 | ch2 << 16 | ch1 << 24;
		} else {
			return ch1 | ch2 << 8 | ch3 << 16 | ch4 << 24;
		}
	}
	,readString: function(len,encoding) {
		var b = new haxe_io_Bytes(new ArrayBuffer(len));
		this.readFullBytes(b,0,len);
		return b.getString(0,len,encoding);
	}
	,getDoubleSig: function(bytes) {
		return ((bytes[1] & 15) << 16 | bytes[2] << 8 | bytes[3]) * 4294967296. + (bytes[4] >> 7) * 2147483648 + ((bytes[4] & 127) << 24 | bytes[5] << 16 | bytes[6] << 8 | bytes[7]);
	}
	,__class__: haxe_io_Input
	,__properties__: {set_bigEndian:"set_bigEndian"}
};
var _$Sys_FileInput = function(fd) {
	this.fd = fd;
};
$hxClasses["_Sys.FileInput"] = _$Sys_FileInput;
_$Sys_FileInput.__name__ = "_Sys.FileInput";
_$Sys_FileInput.__super__ = haxe_io_Input;
_$Sys_FileInput.prototype = $extend(haxe_io_Input.prototype,{
	fd: null
	,readByte: function() {
		var buf = js_node_buffer_Buffer.alloc(1);
		try {
			js_node_Fs.readSync(this.fd,buf,0,1,null);
		} catch( _g ) {
			haxe_NativeStackTrace.lastError = _g;
			var _g1 = haxe_Exception.caught(_g).unwrap();
			if(_g1.code == "EOF") {
				throw haxe_Exception.thrown(new haxe_io_Eof());
			} else {
				throw haxe_Exception.thrown(haxe_io_Error.Custom(_g1));
			}
		}
		return buf[0];
	}
	,readBytes: function(s,pos,len) {
		var data = s.b;
		var buf = js_node_buffer_Buffer.from(data.buffer,data.byteOffset,s.length);
		try {
			return js_node_Fs.readSync(this.fd,buf,pos,len,null);
		} catch( _g ) {
			haxe_NativeStackTrace.lastError = _g;
			var _g1 = haxe_Exception.caught(_g).unwrap();
			if(_g1.code == "EOF") {
				throw haxe_Exception.thrown(new haxe_io_Eof());
			} else {
				throw haxe_Exception.thrown(haxe_io_Error.Custom(_g1));
			}
		}
	}
	,close: function() {
		js_node_Fs.closeSync(this.fd);
	}
	,__class__: _$Sys_FileInput
});
var ValueType = $hxEnums["ValueType"] = { __ename__:"ValueType",__constructs__:null
	,TNull: {_hx_name:"TNull",_hx_index:0,__enum__:"ValueType",toString:$estr}
	,TInt: {_hx_name:"TInt",_hx_index:1,__enum__:"ValueType",toString:$estr}
	,TFloat: {_hx_name:"TFloat",_hx_index:2,__enum__:"ValueType",toString:$estr}
	,TBool: {_hx_name:"TBool",_hx_index:3,__enum__:"ValueType",toString:$estr}
	,TObject: {_hx_name:"TObject",_hx_index:4,__enum__:"ValueType",toString:$estr}
	,TFunction: {_hx_name:"TFunction",_hx_index:5,__enum__:"ValueType",toString:$estr}
	,TClass: ($_=function(c) { return {_hx_index:6,c:c,__enum__:"ValueType",toString:$estr,__params__:function(){ return [this.c];}}; },$_._hx_name="TClass",$_)
	,TEnum: ($_=function(e) { return {_hx_index:7,e:e,__enum__:"ValueType",toString:$estr,__params__:function(){ return [this.e];}}; },$_._hx_name="TEnum",$_)
	,TUnknown: {_hx_name:"TUnknown",_hx_index:8,__enum__:"ValueType",toString:$estr}
};
ValueType.__constructs__ = [ValueType.TNull,ValueType.TInt,ValueType.TFloat,ValueType.TBool,ValueType.TObject,ValueType.TFunction,ValueType.TClass,ValueType.TEnum,ValueType.TUnknown];
ValueType.__empty_constructs__ = [ValueType.TNull,ValueType.TInt,ValueType.TFloat,ValueType.TBool,ValueType.TObject,ValueType.TFunction,ValueType.TUnknown];
var Type = function() { };
$hxClasses["Type"] = Type;
Type.__name__ = "Type";
Type.getClass = function(o) {
	return js_Boot.getClass(o);
};
Type.getEnum = function(o) {
	if(o == null) {
		return null;
	}
	return $hxEnums[o.__enum__];
};
Type.getSuperClass = function(c) {
	return c.__super__;
};
Type.getClassName = function(c) {
	return c.__name__;
};
Type.getEnumName = function(e) {
	return e.__ename__;
};
Type.resolveClass = function(name) {
	return $hxClasses[name];
};
Type.resolveEnum = function(name) {
	return $hxEnums[name];
};
Type.createInstance = function(cl,args) {
	var ctor = Function.prototype.bind.apply(cl,[null].concat(args));
	return new (ctor);
};
Type.createEmptyInstance = function(cl) {
	return Object.create(cl.prototype);
};
Type.createEnum = function(e,constr,params) {
	var f = Reflect.field(e,constr);
	if(f == null) {
		throw haxe_Exception.thrown("No such constructor " + constr);
	}
	if(Reflect.isFunction(f)) {
		if(params == null) {
			throw haxe_Exception.thrown("Constructor " + constr + " need parameters");
		}
		return f.apply(e,params);
	}
	if(params != null && params.length != 0) {
		throw haxe_Exception.thrown("Constructor " + constr + " does not need parameters");
	}
	return f;
};
Type.createEnumIndex = function(e,index,params) {
	var c;
	var _g = e.__constructs__[index];
	if(_g == null) {
		c = null;
	} else {
		var ctor = _g;
		c = ctor._hx_name;
	}
	if(c == null) {
		throw haxe_Exception.thrown(index + " is not a valid enum constructor index");
	}
	return Type.createEnum(e,c,params);
};
Type.getInstanceFields = function(c) {
	var a = [];
	for(var i in c.prototype) a.push(i);
	HxOverrides.remove(a,"__class__");
	HxOverrides.remove(a,"__properties__");
	return a;
};
Type.getClassFields = function(c) {
	var a = Reflect.fields(c);
	HxOverrides.remove(a,"__name__");
	HxOverrides.remove(a,"__interfaces__");
	HxOverrides.remove(a,"__properties__");
	HxOverrides.remove(a,"__super__");
	HxOverrides.remove(a,"__meta__");
	HxOverrides.remove(a,"prototype");
	return a;
};
Type.getEnumConstructs = function(e) {
	var _this = e.__constructs__;
	var result = new Array(_this.length);
	var _g = 0;
	var _g1 = _this.length;
	while(_g < _g1) {
		var i = _g++;
		result[i] = _this[i]._hx_name;
	}
	return result;
};
Type.typeof = function(v) {
	switch(typeof(v)) {
	case "boolean":
		return ValueType.TBool;
	case "function":
		if(v.__name__ || v.__ename__) {
			return ValueType.TObject;
		}
		return ValueType.TFunction;
	case "number":
		if(Math.ceil(v) == v % 2147483648.0) {
			return ValueType.TInt;
		}
		return ValueType.TFloat;
	case "object":
		if(v == null) {
			return ValueType.TNull;
		}
		var e = v.__enum__;
		if(e != null) {
			return ValueType.TEnum($hxEnums[e]);
		}
		var c = js_Boot.getClass(v);
		if(c != null) {
			return ValueType.TClass(c);
		}
		return ValueType.TObject;
	case "string":
		return ValueType.TClass(String);
	case "undefined":
		return ValueType.TNull;
	default:
		return ValueType.TUnknown;
	}
};
Type.enumEq = function(a,b) {
	if(a == b) {
		return true;
	}
	try {
		var e = a.__enum__;
		if(e == null || e != b.__enum__) {
			return false;
		}
		if(a._hx_index != b._hx_index) {
			return false;
		}
		var aparams = a.__params__();
		var bparams = b.__params__();
		var _g = 0;
		var _g1 = aparams.length;
		while(_g < _g1) {
			var i = _g++;
			if(!Type.enumEq(aparams[i],bparams[i])) {
				return false;
			}
		}
	} catch( _g ) {
		haxe_NativeStackTrace.lastError = _g;
		return false;
	}
	return true;
};
Type.enumConstructor = function(e) {
	return $hxEnums[e.__enum__].__constructs__[e._hx_index]._hx_name;
};
Type.enumParameters = function(e) {
	if(e.__params__ != null) {
		return e.__params__();
	} else {
		return [];
	}
};
Type.enumIndex = function(e) {
	return e._hx_index;
};
Type.allEnums = function(e) {
	return e.__empty_constructs__.slice();
};
function Util_loadFile(filename,pos) {
	var data = null;
	try {
		data = JSON.parse(js_node_Fs.readFileSync("./commands/" + filename + ".json",{ encoding : "utf8"}));
	} catch( _g ) {
		var _g1 = haxe_Exception.caught(_g);
		haxe_Log.trace(_g1,{ fileName : "src/Util.hx", lineNumber : 15, className : "_Util.Util_Fields_", methodName : "loadFile"});
		haxe_Log.trace("Failed to load file or parse json",{ fileName : "src/Util.hx", lineNumber : 16, className : "_Util.Util_Fields_", methodName : "loadFile", customParams : [pos]});
	}
	return data;
}
function Util_hasRole(role,interaction) {
	var guild = interaction.member.roles.cache.get(role);
	if(interaction.guild.available && guild != null && guild.members != null) {
		return guild.members.has(interaction.user.id);
	} else {
		return false;
	}
}
function Util_withinTime(time,timeout) {
	var now = new Date().getTime();
	return now - time < timeout;
}
function Util_dateWithinTimeout(a,b,timeout) {
	if(a == null || b == null) {
		return false;
	}
	return a.getTime() - b.getTime() < timeout;
}
function Util_fbDateWithinTimeout(a,b,timeout) {
	if(a == null || b == null) {
		return false;
	}
	return a.toDate().getTime() - b.toDate().getTime() < timeout;
}
var bits_Bits = {};
bits_Bits.fromPositions = function(positions) {
	var bits = [0];
	var _g = 0;
	while(_g < positions.length) {
		var pos = positions[_g];
		++_g;
		if(pos < 32) {
			bits[0] |= 1 << pos;
		} else {
			var cell = pos / 32 | 0;
			if(bits.length <= cell) {
				var _g1 = bits.length;
				var _g2 = cell + 1;
				while(_g1 < _g2) {
					var i = _g1++;
					bits[i] = 0;
				}
			}
			var bit = pos - cell * 32;
			bits[cell] |= 1 << bit;
		}
	}
	return bits;
};
bits_Bits._new = function(capacity) {
	if(capacity == null) {
		capacity = 0;
	}
	var this1 = [0];
	if(capacity > 0) {
		var newLength = Math.ceil(capacity / 32);
		var _g = this1.length;
		while(_g < newLength) {
			var i = _g++;
			this1[i] = 0;
		}
	}
	return this1;
};
bits_Bits.set = function(this1,pos) {
	if(pos < 32) {
		this1[0] |= 1 << pos;
	} else {
		var cell = pos / 32 | 0;
		if(this1.length <= cell) {
			var _g = this1.length;
			var _g1 = cell + 1;
			while(_g < _g1) {
				var i = _g++;
				this1[i] = 0;
			}
		}
		var bit = pos - cell * 32;
		this1[cell] |= 1 << bit;
	}
};
bits_Bits.unset = function(this1,pos) {
	if(pos < 32) {
		this1[0] &= ~(1 << pos);
	} else {
		var cell = pos / 32 | 0;
		if(this1.length <= cell) {
			var _g = this1.length;
			var _g1 = cell + 1;
			while(_g < _g1) {
				var i = _g++;
				this1[i] = 0;
			}
		}
		var bit = pos - cell * 32;
		this1[cell] &= ~(1 << bit);
	}
};
bits_Bits.add = function(this1,bits) {
	var data = bits;
	if(this1.length < data.length) {
		var newLength = data.length;
		var _g = this1.length;
		while(_g < newLength) {
			var i = _g++;
			this1[i] = 0;
		}
	}
	var _g = 0;
	var _g1 = data.length;
	while(_g < _g1) {
		var cell = _g++;
		this1[cell] |= data[cell];
	}
};
bits_Bits.remove = function(this1,bits) {
	var data = bits;
	var _g = 0;
	var _g1 = data.length;
	while(_g < _g1) {
		var cell = _g++;
		if(cell >= this1.length) {
			break;
		}
		this1[cell] &= ~data[cell];
	}
};
bits_Bits.isSet = function(this1,pos) {
	if(pos < 32) {
		return 0 != (this1[0] & 1 << pos);
	} else {
		var cell = pos / 32 | 0;
		var bit = pos - cell * 32;
		if(cell < this1.length) {
			return 0 != (this1[cell] & 1 << bit);
		} else {
			return false;
		}
	}
};
bits_Bits.areSet = function(this1,bits) {
	var data = bits;
	var has = true;
	var _g = 0;
	var _g1 = data.length;
	while(_g < _g1) {
		var cell = _g++;
		if(cell < this1.length) {
			has = data[cell] == (this1[cell] & data[cell]);
		} else {
			has = 0 == data[cell];
		}
		if(!has) {
			break;
		}
	}
	return has;
};
bits_Bits.forEach = function(this1,callback) {
	var _g = 0;
	var _g1 = this1.length;
	while(_g < _g1) {
		var cell = _g++;
		var cellValue = this1[cell];
		if(cellValue != 0) {
			var _g2 = 0;
			while(_g2 < 32) {
				var i = _g2++;
				if(0 != (cellValue & 1 << i)) {
					callback(cell * 32 + i);
				}
			}
		}
	}
};
bits_Bits.copy = function(this1) {
	return this1.slice();
};
bits_Bits.toString = function(this1) {
	var result = "";
	var _g = 0;
	var _g1 = this1.length;
	while(_g < _g1) {
		var cell = _g++;
		var cellValue = this1[cell];
		var _g2 = 0;
		while(_g2 < 32) {
			var i = _g2++;
			result = (0 != (cellValue & 1 << i) ? "1" : "0") + result;
		}
	}
	return HxOverrides.substr(result,result.indexOf("1"),null);
};
bits_Bits.isEmpty = function(this1) {
	var empty = true;
	var _g = 0;
	while(_g < this1.length) {
		var cellValue = this1[_g];
		++_g;
		if(cellValue != 0) {
			empty = false;
			break;
		}
	}
	return empty;
};
bits_Bits.count = function(this1) {
	var result = 0;
	var _g = 0;
	while(_g < this1.length) {
		var v = this1[_g];
		++_g;
		if(v != 0) {
			v -= v >>> 1 & 1431655765;
			v = (v & 858993459) + (v >>> 2 & 858993459);
			result += (v + (v >>> 4) & 252645135) * 16843009 >>> 24;
		}
	}
	return result;
};
bits_Bits.clear = function(this1) {
	var _g = 0;
	var _g1 = this1.length;
	while(_g < _g1) {
		var cell = _g++;
		this1[cell] = 0;
	}
};
bits_Bits.merge = function(this1,bits) {
	if(this1.length < bits.length) {
		var result = bits.slice();
		var _g = 0;
		var _g1 = this1.length;
		while(_g < _g1) {
			var cell = _g++;
			result[cell] |= this1[cell];
		}
		return result;
	} else {
		var result = this1.slice();
		var _g = 0;
		var _g1 = bits.length;
		while(_g < _g1) {
			var cell = _g++;
			result[cell] |= bits[cell];
		}
		return result;
	}
};
bits_Bits.intersect = function(this1,bits) {
	if(this1.length < bits.length) {
		var result = this1.slice();
		var _g = 0;
		var _g1 = this1.length;
		while(_g < _g1) {
			var cell = _g++;
			result[cell] &= bits[cell];
		}
		return result;
	} else {
		var result = bits.slice();
		var _g = 0;
		var _g1 = bits.length;
		while(_g < _g1) {
			var cell = _g++;
			result[cell] &= this1[cell];
		}
		return result;
	}
};
bits_Bits.iterator = function(this1) {
	return new bits_BitsIterator(this1);
};
var bits_BitsIterator = function(data) {
	this.i = 0;
	this.cell = 0;
	this.data = data;
};
$hxClasses["bits.BitsIterator"] = bits_BitsIterator;
bits_BitsIterator.__name__ = "bits.BitsIterator";
bits_BitsIterator.prototype = {
	data: null
	,cell: null
	,i: null
	,hasNext: function() {
		var has = false;
		while(this.cell < this.data.length) {
			var cellValue = this.data[this.cell];
			if(cellValue != 0) {
				while(this.i < 32) {
					if((cellValue & 1 << this.i) != 0) {
						has = true;
						break;
					}
					++this.i;
				}
				if(has) {
					break;
				}
			}
			this.i = 0;
			++this.cell;
		}
		return has;
	}
	,next: function() {
		++this.i;
		return this.cell * 32 + this.i - 1;
	}
	,__class__: bits_BitsIterator
};
var bits_BitsData = {};
bits_BitsData.__properties__ = {get_length:"get_length"};
bits_BitsData._new = function() {
	return [0];
};
bits_BitsData.resize = function(this1,newLength) {
	var _g = this1.length;
	while(_g < newLength) {
		var i = _g++;
		this1[i] = 0;
	}
};
bits_BitsData.copy = function(this1) {
	return this1.slice();
};
bits_BitsData.countOnes = function(this1) {
	var result = 0;
	var _g = 0;
	while(_g < this1.length) {
		var v = this1[_g];
		++_g;
		if(v != 0) {
			v -= v >>> 1 & 1431655765;
			v = (v & 858993459) + (v >>> 2 & 858993459);
			result += (v + (v >>> 4) & 252645135) * 16843009 >>> 24;
		}
	}
	return result;
};
bits_BitsData.get = function(this1,index) {
	return this1[index];
};
bits_BitsData.set = function(this1,index,value) {
	return this1[index] = value;
};
bits_BitsData.get_length = function(this1) {
	return this1.length;
};
var commands_FieldCache = {};
commands_FieldCache._new = function() {
	return { size : 0, fields : new haxe_ds_StringMap()};
};
commands_FieldCache.exists = function(this1,pkg,key) {
	var path = pkg + "." + key;
	return Object.prototype.hasOwnProperty.call(this1.fields.h,path);
};
commands_FieldCache.set = function(this1,pkg,value) {
	var path = pkg + "." + value.id;
	if(!Object.prototype.hasOwnProperty.call(this1.fields.h,path)) {
		this1.size++;
	}
	this1.fields.h[path] = value;
};
commands_FieldCache.get = function(this1,pkg,id) {
	var path = pkg + "." + id;
	if(!Object.prototype.hasOwnProperty.call(this1.fields.h,path)) {
		return null;
	}
	return this1.fields.h[path];
};
var ecs_System = function(_universe) {
	this.universe = _universe;
};
$hxClasses["ecs.System"] = ecs_System;
ecs_System.__name__ = "ecs.System";
ecs_System.prototype = {
	universe: null
	,onEnabled: function() {
	}
	,update: function(_dt) {
	}
	,onDisabled: function() {
	}
	,__class__: ecs_System
};
var systems_CommandBase = function(_universe) {
	this.has_subcommands = false;
	ecs_System.call(this,_universe);
	this.commands = this.universe.families.get(2);
	this.table5d38588a6ddd880f90fc8234bccb893f = this.universe.components.getTable(4);
	this.tablefa61f37a15ee60bbc1601eb42174bd3d = this.universe.components.getTable(3);
};
$hxClasses["systems.CommandBase"] = systems_CommandBase;
systems_CommandBase.__name__ = "systems.CommandBase";
systems_CommandBase.__super__ = ecs_System;
systems_CommandBase.prototype = $extend(ecs_System.prototype,{
	has_subcommands: null
	,update: function(_) {
		if(!Main.connected || !Main.commands_active) {
			return;
		}
		var _this = this.commands;
		var _set = _this.entities;
		var _active = _this.isActive();
		var _g_idx = _set.size() - 1;
		while(_active && _g_idx >= 0) {
			var entity = _set.getDense(_g_idx--);
			var interaction = this.table5d38588a6ddd880f90fc8234bccb893f.get(entity);
			var command = this.tablefa61f37a15ee60bbc1601eb42174bd3d.get(entity);
			if(this.has_subcommands) {
				if(command.name.indexOf(this.get_name(),0) != -1) {
					this.run(command,interaction);
					this.universe.deleteEntity(entity);
				}
			} else if(command.name == this.get_name()) {
				this.run(command,interaction);
				this.universe.deleteEntity(entity);
			}
		}
	}
	,run: null
	,get_name: null
	,commands: null
	,table5d38588a6ddd880f90fc8234bccb893f: null
	,tablefa61f37a15ee60bbc1601eb42174bd3d: null
	,__class__: systems_CommandBase
	,__properties__: {get_name:"get_name"}
});
var commands_Api = function(_universe) {
	this.save_frequency = 3600000;
	this.npackages = [];
	this.packages = new haxe_ds_StringMap();
	this.sapi = new haxe_ds_StringMap();
	this.api = new haxe_ds_StringMap();
	systems_CommandBase.call(this,_universe);
};
$hxClasses["commands.Api"] = commands_Api;
commands_Api.__name__ = "commands.Api";
commands_Api.__super__ = systems_CommandBase;
commands_Api.prototype = $extend(systems_CommandBase.prototype,{
	api: null
	,sapi: null
	,packages: null
	,npackages: null
	,cache: null
	,save_time: null
	,save_frequency: null
	,onEnabled: function() {
		var this1 = this.api;
		var value = Util_loadFile("api/haxe",{ fileName : "src/commands/Api.hx", lineNumber : 78, className : "commands.Api", methodName : "onEnabled"});
		this1.h["haxe"] = value;
		var this1 = this.api;
		var value = Util_loadFile("api/flixel",{ fileName : "src/commands/Api.hx", lineNumber : 79, className : "commands.Api", methodName : "onEnabled"});
		this1.h["flixel"] = value;
		var this1 = this.api;
		var value = Util_loadFile("api/heaps",{ fileName : "src/commands/Api.hx", lineNumber : 80, className : "commands.Api", methodName : "onEnabled"});
		this1.h["heaps"] = value;
		var this1 = this.api;
		var value = Util_loadFile("api/ceramic",{ fileName : "src/commands/Api.hx", lineNumber : 81, className : "commands.Api", methodName : "onEnabled"});
		this1.h["ceramic"] = value;
		var this1 = this.api;
		var value = Util_loadFile("api/openfl",{ fileName : "src/commands/Api.hx", lineNumber : 82, className : "commands.Api", methodName : "onEnabled"});
		this1.h["openfl"] = value;
		var this1 = this.api;
		var value = Util_loadFile("api/hxgodot",{ fileName : "src/commands/Api.hx", lineNumber : 83, className : "commands.Api", methodName : "onEnabled"});
		this1.h["godot"] = value;
		this.cache = Util_loadFile("api/cache/0",{ fileName : "src/commands/Api.hx", lineNumber : 84, className : "commands.Api", methodName : "onEnabled"});
		if(this.cache == null) {
			this.cache = commands_FieldCache._new();
		}
		var h = this.api.h;
		var _g_keys = Object.keys(h);
		var _g_length = _g_keys.length;
		var _g_current = 0;
		while(_g_current < _g_length) {
			var key = _g_keys[_g_current++];
			var _g_value = h[key];
			var arr = [];
			var h1 = _g_value.h;
			var _g_keys1 = Object.keys(h1);
			var _g_length1 = _g_keys1.length;
			var _g_current1 = 0;
			while(_g_current1 < _g_length1) {
				var key1 = _g_keys1[_g_current1++];
				var _g_value1 = h1[key1];
				this.packages.h[key1] = key;
				arr.push(_g_value1);
				this.npackages.push({ name : key1, value : _g_value1.path});
			}
			this.sapi.h[key] = arr;
		}
		haxe_Log.trace("loaded",{ fileName : "src/commands/Api.hx", lineNumber : 103, className : "commands.Api", methodName : "onEnabled"});
	}
	,update: function(_) {
		systems_CommandBase.prototype.update.call(this,_);
		var time = new Date().getTime();
		if(time - this.save_time > this.save_frequency) {
			js_node_Fs.writeFileSync("./commands/api/cache/0.json",JSON.stringify(this.cache));
			this.save_time = new Date().getTime();
		}
	}
	,saveCache: function() {
		js_node_Fs.writeFileSync("./commands/api/cache/0.json",JSON.stringify(this.cache));
		this.save_time = new Date().getTime();
	}
	,run: function(command,interaction) {
		if(command.content == null) {
			return;
		}
		var _g = command.content;
		if(_g._hx_index == 28) {
			var _gcontent = _g.content;
			var _gfield = _g.field;
			var type = this.packages.h[_gcontent];
			var cls = null;
			if(Object.prototype.hasOwnProperty.call(this.packages.h,_gcontent)) {
				cls = this.api.h[type].h[_gcontent];
			}
			if(interaction.isAutocomplete()) {
				var focused = null;
				var _g = 0;
				var _g1 = interaction.options._hoistedOptions;
				while(_g < _g1.length) {
					var item = _g1[_g];
					++_g;
					if(item.focused) {
						focused = item;
						break;
					}
				}
				switch(focused.name) {
				case "field":
					var ac = [];
					var h = this.cache.fields.h;
					var _g_keys = Object.keys(h);
					var _g_length = _g_keys.length;
					var _g_current = 0;
					while(_g_current < _g_length) {
						var key = _g_keys[_g_current++];
						var _g_value = h[key];
						var path = _gcontent + "." + _gfield;
						if(key == path) {
							ac.push({ name : _g_value.id, value : _g_value.id});
							interaction.respond(ac);
							return;
						}
					}
					try {
						this.getFieldPage(cls,_gfield,interaction);
					} catch( _g ) {
						var _g1 = haxe_Exception.caught(_g);
						haxe_Log.trace(_g1,{ fileName : "src/commands/Api.hx", lineNumber : 161, className : "commands.Api", methodName : "run"});
						haxe_Log.trace(cls,{ fileName : "src/commands/Api.hx", lineNumber : 162, className : "commands.Api", methodName : "run"});
						haxe_Log.trace(_gfield,{ fileName : "src/commands/Api.hx", lineNumber : 163, className : "commands.Api", methodName : "run"});
						haxe_Log.trace(_gcontent,{ fileName : "src/commands/Api.hx", lineNumber : 164, className : "commands.Api", methodName : "run"});
					}
					break;
				case "package":
					this.search(_gcontent,interaction);
					break;
				default:
				}
				return;
			}
			var f = commands_FieldCache.get(this.cache,_gcontent,_gfield);
			var embed = new discord_$js_MessageEmbed();
			var title = "";
			var link = "";
			var cls_desc = "";
			var field_desc = "";
			if(Object.prototype.hasOwnProperty.call(this.packages.h,_gcontent)) {
				title = cls.path;
				link = cls.link;
				cls_desc = cls.description;
			}
			if(commands_FieldCache.exists(this.cache,_gcontent,_gfield)) {
				title += "#" + f.id;
				link += "#" + f.id;
				field_desc = f.doc;
			}
			var desc = "" + cls_desc;
			if(f != null) {
				desc += "```hx\n" + f.code + "\n```" + f.doc;
			}
			if(cls_desc == "" && field_desc == "") {
				desc = "*No description found*";
			}
			if(title != "") {
				embed.setTitle(title);
			}
			if(link != "") {
				embed.setURL(link);
			}
			if(link == "" && title == "") {
				interaction.reply({ content : "Couldn't find the package"}).then(null,function(err) {
					haxe_Log.trace(err,{ fileName : "src/commands/Api.hx", lineNumber : 209, className : "commands.Api", methodName : "run"});
				});
				return;
			}
			embed.setDescription(desc);
			interaction.reply({ embeds : [embed]});
			return;
		}
	}
	,getFieldPage: function(cls,find,interaction,ac) {
		var _gthis = this;
		if(cls == null) {
			return;
		}
		var http = new haxe_http_HttpNodeJs(cls.link);
		if(ac == null) {
			ac = [];
		}
		var headers_h = Object.create(null);
		headers_h["static_vars"] = "<h3 class=\"section\">Static variables</h3>";
		headers_h["static_methods"] = "<h3 class=\"section\">Static methods</h3>";
		headers_h["constructor"] = "<h3 class=\"section\">Constructor</h3>";
		headers_h["variables"] = "<h3 class=\"section\">Variables</h3>";
		headers_h["methods"] = "<h3 class=\"section\">Methods</h3>";
		headers_h["last"] = "<footer";
		var header_arr = ["static_vars","static_methods","constructor","variables","methods","last"];
		http.onData = function(res) {
			header_arr.sort(function(a,b) {
				var index_a = res.indexOf(headers_h[a]);
				var index_b = res.indexOf(headers_h[b]);
				if(index_a > index_b) {
					return 1;
				}
				if(index_a < index_b) {
					return -1;
				}
				return 0;
			});
			var a = null;
			var b = null;
			var last = 0;
			var response = [];
			var results = [];
			do {
				var _g_current = 0;
				var _g_array = header_arr;
				while(_g_current < _g_array.length) {
					var _g_value = _g_array[_g_current];
					var _g_key = _g_current++;
					if(a != null && b != null) {
						break;
					}
					if(res.indexOf(headers_h[_g_value]) != -1) {
						if(a != null && b == null && _g_key > last) {
							b = _g_value;
							last = _g_key;
						}
						if(a == null) {
							a = _g_value;
						}
					}
				}
				var pos_a = res.indexOf(headers_h[a]) + headers_h[a].length;
				var pos_b = res.indexOf(headers_h[b]);
				var fields = res.substring(pos_a,pos_b);
				var arr;
				if(a == null) {
					arr = [];
				} else {
					switch(a) {
					case "constructor":
						arr = _gthis.searchMethods(find,fields);
						break;
					case "last":
						arr = [];
						break;
					case "methods":
						arr = _gthis.searchMethods(find,fields);
						break;
					case "static_methods":
						arr = _gthis.searchMethods(find,fields);
						break;
					case "static_vars":
						arr = _gthis.searchVars(find,fields);
						break;
					case "variables":
						arr = _gthis.searchVars(find,fields);
						break;
					default:
						arr = [];
					}
				}
				response = response.concat(arr);
				var algo = externs_FuzzySort.go(find,response,{ key : "id", limit : 10, threshold : -10000});
				var _g = 0;
				while(_g < algo.length) {
					var a1 = algo[_g];
					++_g;
					results.push(a1.obj);
				}
				a = b;
				b = null;
			} while(a != "last");
			var _g = 0;
			while(_g < results.length) {
				var r = results[_g];
				++_g;
				commands_FieldCache.set(_gthis.cache,cls.path,r);
				var name = "var " + r.id;
				if(r.code.indexOf("(") != -1) {
					name = "fun " + r.id;
				}
				ac.push({ name : name, value : r.id});
			}
			ac.sort(function(a,b) {
				return a.name.length - b.name.length;
			});
			js_node_Fs.writeFileSync("./commands/api/cache/0.json",JSON.stringify(_gthis.cache));
			_gthis.save_time = new Date().getTime();
			if(ac.length > 24) {
				ac = ac.slice(0,24);
			}
			interaction.respond(ac);
		};
		http.request();
	}
	,searchVars: function(find,fields) {
		var parse = NodeHtmlParser.parse(fields);
		var arr = [];
		var _g = 0;
		var _g1 = parse.querySelectorAll(".field");
		while(_g < _g1.length) {
			var f = _g1[_g];
			++_g;
			var labels = [];
			var identifier = "";
			var type = "";
			var doc = "";
			var value = "";
			var _g2 = 0;
			var _g3 = f.querySelectorAll("span");
			while(_g2 < _g3.length) {
				var m = _g3[_g2];
				++_g2;
				if(m.classNames.indexOf("label") != -1 && m.text.indexOf("@:") == -1) {
					labels.push(m.text);
				}
				if(m.classNames.indexOf("identifier") != -1) {
					identifier = m.text;
				}
			}
			value = f.querySelector("code").text.split("=")[2];
			var split = f.querySelector("code").text.split(":");
			if(split.length == 2) {
				type = split[1];
			}
			if(split.length == 3) {
				type = split[2];
			}
			var _g4 = 0;
			var _g5 = f.querySelectorAll("p");
			while(_g4 < _g5.length) {
				var p = _g5[_g4];
				++_g4;
				if(p.classNames.indexOf("javadoc") != -1) {
					break;
				}
				var line = StringTools.replace(StringTools.replace(p.text,"\n",""),"\t","");
				if(line.length == 0) {
					continue;
				}
				doc += "" + line + " ";
			}
			var result = "";
			var _g6 = 0;
			while(_g6 < labels.length) {
				var l = labels[_g6];
				++_g6;
				result += "" + l + " ";
			}
			result += "" + identifier + ":" + type;
			if(value != null) {
				result += " = " + value;
			}
			arr.push({ id : identifier, code : result, doc : doc});
		}
		return arr;
	}
	,searchMethods: function(find,fields) {
		var parse = NodeHtmlParser.parse(fields);
		var arr = [];
		var _g = 0;
		var _g1 = parse.querySelectorAll(".field");
		while(_g < _g1.length) {
			var f = _g1[_g];
			++_g;
			var labels = [];
			var identifier = "";
			var parameters = "";
			var doc = "";
			var _g2 = 0;
			var _g3 = f.querySelectorAll("span");
			while(_g2 < _g3.length) {
				var m = _g3[_g2];
				++_g2;
				if(m.classNames.indexOf("label") != -1 && m.text.indexOf("@:") == -1) {
					labels.push(StringTools.trim(m.text));
				}
				if(m.classNames.indexOf("identifier") != -1) {
					identifier = StringTools.trim(m.text);
				}
			}
			parameters = StringTools.trim(f.querySelector("code").text.split(identifier)[1]);
			f.querySelector("code");
			var _g4 = 0;
			var _g5 = f.querySelectorAll("p");
			while(_g4 < _g5.length) {
				var p = _g5[_g4];
				++_g4;
				if(p.classNames.indexOf("javadoc") != -1) {
					break;
				}
				var line = StringTools.trim(StringTools.replace(StringTools.replace(p.text,"\n",""),"\t",""));
				if(line.length == 0) {
					continue;
				}
				doc += "" + line + " ";
			}
			var result = "";
			var _g6 = 0;
			while(_g6 < labels.length) {
				var l = labels[_g6];
				++_g6;
				result += "" + l + " ";
			}
			result += "" + identifier + parameters;
			arr.push({ id : identifier, code : result, doc : doc});
		}
		return arr;
	}
	,search: function(string,interaction) {
		var results = [];
		var narrow = [];
		var keywords_h = Object.create(null);
		keywords_h["flixel"] = ["flx","flixel"];
		keywords_h["heaps"] = ["h2d","hxd","hxsl","h3d"];
		keywords_h["ceramic"] = ["ceramic","clay","spine"];
		keywords_h["openfl"] = ["openfl"];
		keywords_h["haxe"] = ["haxe"];
		keywords_h["godot"] = ["godot"];
		var h = keywords_h;
		var _g_h = h;
		var _g_keys = Object.keys(h);
		var _g_length = _g_keys.length;
		var _g_current = 0;
		while(_g_current < _g_length) {
			var key = _g_keys[_g_current++];
			var _g_key = key;
			var _g_value = _g_h[key];
			var k = _g_key;
			var v = _g_value;
			var _g = 0;
			while(_g < v.length) {
				var i = v[_g];
				++_g;
				if(string.indexOf(i) != -1) {
					narrow = this.sapi.h[k];
					break;
				}
			}
		}
		if(narrow.length == 0) {
			var algo = externs_FuzzySort.go(string,this.npackages,{ key : "name", limit : 10, threshold : -10000});
			var _g = 0;
			while(_g < algo.length) {
				var a = algo[_g];
				++_g;
				results.push(a.obj);
			}
		} else {
			var algo = externs_FuzzySort.go(string,narrow,{ key : "path", limit : 10, threshold : -10000});
			var _g = 0;
			while(_g < algo.length) {
				var a = algo[_g];
				++_g;
				results.push({ name : a.obj.path, value : a.obj.path});
			}
		}
		interaction.respond(results).then(null,function(err) {
			haxe_Log.trace(err,{ fileName : "src/commands/Api.hx", lineNumber : 501, className : "commands.Api", methodName : "search"});
			$global.console.dir(err);
		});
	}
	,get_name: function() {
		return "api";
	}
	,__class__: commands_Api
});
var commands_Archive = function(_universe) {
	systems_CommandBase.call(this,_universe);
};
$hxClasses["commands.Archive"] = commands_Archive;
commands_Archive.__name__ = "commands.Archive";
commands_Archive.__super__ = systems_CommandBase;
commands_Archive.prototype = $extend(systems_CommandBase.prototype,{
	run: function(command,interaction) {
		if(command.content._hx_index == 2) {
			var role = "1019915584546291712";
			interaction.member.fetch(true).then(function(member) {
				var found = false;
				var jsIterator = member.roles.cache.entries();
				var _g_jsIterator = jsIterator;
				var _g_lastStep = jsIterator.next();
				while(!_g_lastStep.done) {
					var v = _g_lastStep.value;
					_g_lastStep = _g_jsIterator.next();
					var _g_key = v[0];
					var key = _g_key;
					if(key == role) {
						found = true;
						break;
					}
				}
				if(found) {
					interaction.member.roles.remove(role).then(function(success) {
						interaction.reply("Archives are hidden");
					},function(err) {
						haxe_Log.trace(err,{ fileName : "src/commands/Archive.hx", lineNumber : 28, className : "commands.Archive", methodName : "run"});
						$global.console.dir(err);
					});
				} else {
					interaction.member.roles.add(role).then(function(success) {
						interaction.reply("Archives are shown");
					},function(err) {
						haxe_Log.trace(err,{ fileName : "src/commands/Archive.hx", lineNumber : 35, className : "commands.Archive", methodName : "run"});
						$global.console.dir(err);
					});
				}
			},function(err) {
				haxe_Log.trace(err,{ fileName : "src/commands/Archive.hx", lineNumber : 40, className : "commands.Archive", methodName : "run"});
				$global.console.dir(err);
			});
		}
	}
	,get_name: function() {
		return "archive";
	}
	,__class__: commands_Archive
});
var commands_AutoRole = function(_universe) {
	this.event_role_id = "1054432874473996408";
	this.news_role_id = "761714325227700225";
	systems_CommandBase.call(this,_universe);
	this.users = this.universe.families.get(5);
	this.table87a8f92f715c03d0822a55d9b93a210d = this.universe.components.getTable(5);
	this.tablec254489e95ef23a8f91062a1947780b9 = this.universe.components.getTable(7);
};
$hxClasses["commands.AutoRole"] = commands_AutoRole;
commands_AutoRole.__name__ = "commands.AutoRole";
commands_AutoRole.__super__ = systems_CommandBase;
commands_AutoRole.prototype = $extend(systems_CommandBase.prototype,{
	news_role_id: null
	,event_role_id: null
	,update: function(_) {
		systems_CommandBase.prototype.update.call(this,_);
		var _this = this.users;
		var _set = _this.entities;
		var _g_set = _set;
		var _g_active = _this.isActive();
		var _g_idx = _set.size() - 1;
		while(_g_active && _g_idx >= 0) {
			var entity = _g_set.getDense(_g_idx--);
			var command = this.table87a8f92f715c03d0822a55d9b93a210d.get(entity);
			var member = this.tablec254489e95ef23a8f91062a1947780b9.get(entity);
			if(command == "add_event_role") {
				member.roles.add(this.event_role_id).then(null,function(err) {
					haxe_Log.trace(err,{ fileName : "src/commands/AutoRole.hx", lineNumber : 21, className : "commands.AutoRole", methodName : "update"});
					$global.console.dir(err);
				});
				member.roles.add(this.news_role_id).then(null,function(err) {
					haxe_Log.trace(err,{ fileName : "src/commands/AutoRole.hx", lineNumber : 25, className : "commands.AutoRole", methodName : "update"});
					$global.console.dir(err);
				});
				this.universe.deleteEntity(entity);
			}
		}
	}
	,run: function(command,interaction) {
	}
	,get_name: function() {
		return "autorole";
	}
	,users: null
	,table87a8f92f715c03d0822a55d9b93a210d: null
	,tablec254489e95ef23a8f91062a1947780b9: null
	,__class__: commands_AutoRole
});
var commands_AutoThread = function(_universe) {
	this.news_feed = "1030188275341729882";
	this.checking = false;
	this.announcement_channel = "286485321925918721";
	this.event_role_id = "1054432874473996408";
	this.news_role_id = "761714325227700225";
	systems_CommandBase.call(this,_universe);
	this.users = this.universe.families.get(5);
	this.table87a8f92f715c03d0822a55d9b93a210d = this.universe.components.getTable(5);
	this.tablec254489e95ef23a8f91062a1947780b9 = this.universe.components.getTable(7);
};
$hxClasses["commands.AutoThread"] = commands_AutoThread;
commands_AutoThread.__name__ = "commands.AutoThread";
commands_AutoThread.__super__ = systems_CommandBase;
commands_AutoThread.prototype = $extend(systems_CommandBase.prototype,{
	news_role_id: null
	,event_role_id: null
	,announcement_channel: null
	,announcement: null
	,checking: null
	,news_feed: null
	,news_feed_channel: null
	,update: function(_) {
		var _gthis = this;
		systems_CommandBase.prototype.update.call(this,_);
		if(this.announcement == null && !this.checking) {
			this.checking = true;
			Main.client.channels.fetch(this.announcement_channel).then(function(channel) {
				_gthis.announcement = channel;
				_gthis.checking = false;
			},function(err) {
				haxe_Log.trace(err,{ fileName : "src/commands/AutoThread.hx", lineNumber : 29, className : "commands.AutoThread", methodName : "update"});
				$global.console.dir(err);
			});
		}
		if(this.announcement != null && !this.checking) {
			this.checking = true;
			this.announcement.threads.fetch(this.news_feed).then(function(succ) {
				_gthis.news_feed_channel = succ;
				_gthis.checking = false;
			},function(err) {
				haxe_Log.trace(err,{ fileName : "src/commands/AutoThread.hx", lineNumber : 39, className : "commands.AutoThread", methodName : "update"});
			});
		}
		if(this.announcement == null && this.news_feed == null) {
			return;
		}
		var _this = this.users;
		var _set = _this.entities;
		var _g_set = _set;
		var _g_active = _this.isActive();
		var _g_idx = _set.size() - 1;
		while(_g_active && _g_idx >= 0) {
			var entity = _g_set.getDense(_g_idx--);
			var command = this.table87a8f92f715c03d0822a55d9b93a210d.get(entity);
			var member = this.tablec254489e95ef23a8f91062a1947780b9.get(entity);
			if(command == "auto_thread") {
				this.news_feed_channel.members.add(member.id).then(null,function(err) {
					haxe_Log.trace(err,{ fileName : "src/commands/AutoThread.hx", lineNumber : 49, className : "commands.AutoThread", methodName : "update"});
				});
				this.universe.deleteEntity(entity);
			}
		}
	}
	,run: function(command,interaction) {
	}
	,get_name: function() {
		return "autothread";
	}
	,users: null
	,table87a8f92f715c03d0822a55d9b93a210d: null
	,tablec254489e95ef23a8f91062a1947780b9: null
	,__class__: commands_AutoThread
});
var commands_Boop = function(_universe) {
	systems_CommandBase.call(this,_universe);
};
$hxClasses["commands.Boop"] = commands_Boop;
commands_Boop.__name__ = "commands.Boop";
commands_Boop.__super__ = systems_CommandBase;
commands_Boop.prototype = $extend(systems_CommandBase.prototype,{
	run: function(command,interaction) {
		var _g = command.content;
		if(_g._hx_index == 22) {
			interaction.reply("*boop* <@" + _g.user.id + ">");
		}
	}
	,get_name: function() {
		return "boop";
	}
	,__class__: commands_Boop
});
var commands_Code = function(_universe) {
	systems_CommandBase.call(this,_universe);
	this.something_else = this.universe.families.get(7);
	this.table87a8f92f715c03d0822a55d9b93a210d = this.universe.components.getTable(5);
};
$hxClasses["commands.Code"] = commands_Code;
commands_Code.__name__ = "commands.Code";
commands_Code.__super__ = systems_CommandBase;
commands_Code.prototype = $extend(systems_CommandBase.prototype,{
	update: function(_) {
		systems_CommandBase.prototype.update.call(this,_);
		var _this = this.something_else;
		var _set = _this.entities;
		var _active = _this.isActive();
		var _g_idx = _set.size() - 1;
		while(_active && _g_idx >= 0) {
			var entity = _set.getDense(_g_idx--);
			var interaction = this.table5d38588a6ddd880f90fc8234bccb893f.get(entity);
			var forward = this.table87a8f92f715c03d0822a55d9b93a210d.get(entity);
			haxe_Log.trace("here",{ fileName : "src/commands/Code.hx", lineNumber : 18, className : "commands.Code", methodName : "update"});
			haxe_Log.trace(forward,{ fileName : "src/commands/Code.hx", lineNumber : 19, className : "commands.Code", methodName : "update"});
			if(forward == "code_paste") {
				var start = Std.parseInt(interaction.fields.getTextInputValue("start"));
				var problem = interaction.fields.getTextInputValue("problem");
				var code = this.cleanSpace(interaction.fields.getTextInputValue("code"));
				if(start == null) {
					start = 1;
				}
				var embed = new discord_$js_MessageEmbed();
				var new_code = "";
				var _this = code.split("\n");
				var _g_current = 0;
				while(_g_current < _this.length) {
					var _g_value = _this[_g_current];
					var _g_key = _g_current++;
					new_code += "" + (start + _g_key) + ": " + _g_value + "\n";
				}
				var content = "**__Code__**\n```hx\n" + new_code + "\n```\n**__Problem__**\n" + problem;
				embed.setDescription(content);
				interaction.reply({ embeds : [embed]}).then(null,function(err) {
					haxe_Log.trace(err,{ fileName : "src/commands/Code.hx", lineNumber : 39, className : "commands.Code", methodName : "update"});
				});
				this.universe.deleteEntity(entity);
			}
		}
	}
	,cleanSpace: function(code) {
		var shallowest = 500;
		var largest = 0;
		code = StringTools.replace(code,"`","\\`");
		var _g = 0;
		var _g1 = code.split("\n");
		while(_g < _g1.length) {
			var line = _g1[_g];
			++_g;
			var depth = 0;
			var _g2 = 0;
			var _g3 = line.length;
			while(_g2 < _g3) {
				var i = _g2++;
				var char = line.charAt(i);
				if(char == " " || char == "\t") {
					continue;
				}
				depth = i;
				break;
			}
			if(depth < shallowest && depth != 0) {
				shallowest = depth;
			}
			if(depth > largest) {
				largest = depth;
			}
		}
		var new_code = "";
		var _g = 0;
		var _g1 = code.split("\n");
		while(_g < _g1.length) {
			var line = _g1[_g];
			++_g;
			new_code += line.substring(shallowest) + "\n";
		}
		return new_code;
	}
	,run: function(command,interaction) {
		var modal = new discord_$builder_ModalBuilder().setCustomId("code_paste").setTitle("Code paste");
		var problem = new discord_$builder_APITextInputComponent().setCustomId("problem").setLabel("Problem description").setStyle(2).setRequired(true).setPlaceholder("Describe your issue and post any error messages here");
		var from = new discord_$builder_APITextInputComponent().setCustomId("start").setLabel("First line number").setStyle(1).setMinLength(1).setMaxLength(5).setPlaceholder("The starting line number of the code you are pasting");
		var code = new discord_$builder_APITextInputComponent().setCustomId("code").setLabel("Code").setStyle(2).setMinLength(10).setMaxLength(2000);
		var action_a = new discord_$builder_APIActionRowComponent().addComponents(from);
		var action_c = new discord_$builder_APIActionRowComponent().addComponents(code);
		var action_d = new discord_$builder_APIActionRowComponent().addComponents(problem);
		modal.addComponents(action_a,action_c,action_d);
		interaction.showModal(modal);
	}
	,get_name: function() {
		return "code";
	}
	,something_else: null
	,table87a8f92f715c03d0822a55d9b93a210d: null
	,__class__: commands_Code
});
var commands_CodeLineNumbers = function(_universe) {
	systems_CommandBase.call(this,_universe);
	this.options = this.universe.families.get(8);
	this.tablef1c30c373f6abc39648a24020b4b82b2 = this.universe.components.getTable(9);
};
$hxClasses["commands.CodeLineNumbers"] = commands_CodeLineNumbers;
commands_CodeLineNumbers.__name__ = "commands.CodeLineNumbers";
commands_CodeLineNumbers.__super__ = systems_CommandBase;
commands_CodeLineNumbers.prototype = $extend(systems_CommandBase.prototype,{
	update: function(_) {
		var _this = this.options;
		var _set = _this.entities;
		var _active = _this.isActive();
		var _g_idx = _set.size() - 1;
		while(_active && _g_idx >= 0) {
			var entity = _set.getDense(_g_idx--);
			var interaction = this.table5d38588a6ddd880f90fc8234bccb893f.get(entity);
			var route = this.tablef1c30c373f6abc39648a24020b4b82b2.get(entity);
			if(route == "CodeLineNumbers") {
				var message = [interaction.targetMessage];
				if(message[0].author.id != interaction.member.id) {
					interaction.reply({ content : "Hey, that isn't your message! :angry:", ephemeral : true}).then(null,(function() {
						return function(err) {
							haxe_Log.trace(err,{ fileName : "src/commands/CodeLineNumbers.hx", lineNumber : 20, className : "commands.CodeLineNumbers", methodName : "update"});
						};
					})());
				}
				if(message[0] != null && message[0].content.length > 0) {
					var replace = this.parseString(message[0].content);
					if(replace != null) {
						interaction.reply({ content : replace}).then((function(message) {
							return function(_) {
								message[0].delete().then(null,(function() {
									return function(err) {
										haxe_Log.trace(err,{ fileName : "src/commands/CodeLineNumbers.hx", lineNumber : 26, className : "commands.CodeLineNumbers", methodName : "update"});
									};
								})());
							};
						})(message),(function() {
							return function(err) {
								haxe_Log.trace(err,{ fileName : "src/commands/CodeLineNumbers.hx", lineNumber : 27, className : "commands.CodeLineNumbers", methodName : "update"});
							};
						})());
					} else {
						interaction.reply({ content : "No compatible code blocks were found. Only standard block or hx/haxe are supported.", ephemeral : true}).then(null,(function() {
							return function(err) {
								haxe_Log.trace(err,{ fileName : "src/commands/CodeLineNumbers.hx", lineNumber : 33, className : "commands.CodeLineNumbers", methodName : "update"});
							};
						})());
					}
				}
				this.universe.deleteEntity(entity);
			}
		}
	}
	,parseString: function(content) {
		var matched = [];
		var index = 0;
		var start = -1;
		var blocks = ["```hx\n","```haxe\n","```\n"];
		var selected = null;
		var _g = 0;
		while(_g < blocks.length) {
			var opt = blocks[_g];
			++_g;
			if(content.indexOf(opt) != -1) {
				selected = opt;
				break;
			}
		}
		if(selected == null) {
			haxe_Log.trace("no compatible code block",{ fileName : "src/commands/CodeLineNumbers.hx", lineNumber : 57, className : "commands.CodeLineNumbers", methodName : "parseString"});
			return null;
		}
		while(index != -1) {
			var pos = start;
			if(pos > -1) {
				pos += selected.length;
			} else {
				pos = 0;
			}
			index = content.indexOf(selected,pos);
			start = index;
			if(index == -1) {
				break;
			}
			var cursor = start - 1;
			while(true) {
				var char = content.charAt(cursor);
				if(char == "\n") {
					break;
				}
				++cursor;
			}
			matched.push({ start : start, end : start + selected.length});
			if(selected != "```\n") {
				var end_tag = content.indexOf("```",index + selected.length);
				matched.push({ start : end_tag, end : end_tag + selected.length});
			}
		}
		var replace = content;
		var _g_current = 0;
		while(_g_current < matched.length) {
			var _g_value = matched[_g_current];
			var _g_key = _g_current++;
			if(_g_key % 2 == 0) {
				continue;
			}
			var last = matched[_g_key - 1];
			var ogcode = content.substring(last.end,_g_value.start);
			var lines = this.addLineNumbers(ogcode);
			replace = StringTools.replace(replace,ogcode,lines);
		}
		return replace;
	}
	,addLineNumbers: function(code) {
		var new_code = "\n";
		var l = code.length;
		var r = 0;
		while(r < l && StringTools.isSpace(code,l - r - 1)) ++r;
		if(r > 0) {
			code = HxOverrides.substr(code,0,l - r);
		}
		var split = code.split("\n");
		var _g_current = 0;
		while(_g_current < split.length) {
			var _g_value = split[_g_current];
			var _g_key = _g_current++;
			var new_line = false;
			if(_g_key + 1 < split.length) {
				new_line = true;
			}
			new_code += "" + (_g_key + 1) + ": " + _g_value;
			if(new_line) {
				new_code += "\n";
			}
		}
		return new_code;
	}
	,cleanSpace: function(code) {
		var shallowest = 500;
		var largest = 0;
		code = StringTools.replace(code,"`","\\`");
		var _g = 0;
		var _g1 = code.split("\n");
		while(_g < _g1.length) {
			var line = _g1[_g];
			++_g;
			var depth = 0;
			var _g2 = 0;
			var _g3 = line.length;
			while(_g2 < _g3) {
				var i = _g2++;
				var char = line.charAt(i);
				if(char == " " || char == "\t") {
					continue;
				}
				depth = i;
				break;
			}
			if(depth < shallowest && depth != 0) {
				shallowest = depth;
			}
			if(depth > largest) {
				largest = depth;
			}
		}
		var new_code = "";
		var _g = 0;
		var _g1 = code.split("\n");
		while(_g < _g1.length) {
			var line = _g1[_g];
			++_g;
			new_code += line.substring(shallowest) + "\n";
		}
		return new_code;
	}
	,run: function(command,interaction) {
	}
	,get_name: function() {
		return "codelinenumbers";
	}
	,options: null
	,tablef1c30c373f6abc39648a24020b4b82b2: null
	,__class__: commands_CodeLineNumbers
});
var commands_Color = function(_universe) {
	systems_CommandBase.call(this,_universe);
};
$hxClasses["commands.Color"] = commands_Color;
commands_Color.__name__ = "commands.Color";
commands_Color.__super__ = systems_CommandBase;
commands_Color.prototype = $extend(systems_CommandBase.prototype,{
	roles: null
	,onEnabled: function() {
		var _g = new haxe_ds_StringMap();
		_g.h["Orange"] = "1164160370232012830";
		_g.h["Yellow"] = "1164236800747900948";
		_g.h["Purple"] = "1164237188561653770";
		_g.h["Red"] = "1164237399719673916";
		_g.h["Sky Blue"] = "1134786690754555916";
		_g.h["Pink"] = "1164238547293847622";
		_g.h["Green"] = "1164239067353985084";
		_g.h["Grey"] = "1164239176686915672";
		_g.h["Blue"] = "1164328144241696882";
		_g.h["Default"] = "Default";
		this.roles = _g;
	}
	,run: function(command,interaction) {
		var _gthis = this;
		var _g = command.content;
		if(_g._hx_index == 5) {
			var role_name = _g.role;
			var role_id = this.roles.h[role_name];
			interaction.member.fetch(true).then(function(member) {
				var set_role = null;
				var found = false;
				if(role_id == "Default") {
					var h = _gthis.roles.h;
					var value_h = h;
					var value_keys = Object.keys(h);
					var value_length = value_keys.length;
					var value_current = 0;
					while(value_current < value_length) {
						var value = value_h[value_keys[value_current++]];
						var jsIterator = member.roles.cache.values();
						var _g_jsIterator = jsIterator;
						var _g_lastStep = jsIterator.next();
						while(!_g_lastStep.done) {
							var v = _g_lastStep.value;
							_g_lastStep = _g_jsIterator.next();
							var role = v;
							if(value == role.id) {
								member.roles.remove(role.id).then(function(_) {
									interaction.reply("Color set to default");
								});
								return;
							}
						}
					}
					interaction.reply("You're already on the default color!");
					return;
				}
				var jsIterator = member.roles.cache.values();
				var _g_jsIterator = jsIterator;
				var _g_lastStep = jsIterator.next();
				while(!_g_lastStep.done) {
					var v = _g_lastStep.value;
					_g_lastStep = _g_jsIterator.next();
					var value = v;
					var h = _gthis.roles.h;
					var _g_h = h;
					var _g_keys = Object.keys(h);
					var _g_length = _g_keys.length;
					var _g_current = 0;
					while(_g_current < _g_length) {
						var key = _g_keys[_g_current++];
						var _g_value = _g_h[key];
						var v1 = _g_value;
						if(value.id == v1) {
							member.roles.remove(value.id).then(null,function(err) {
								haxe_Log.trace(err,{ fileName : "src/commands/Color.hx", lineNumber : 51, className : "commands.Color", methodName : "run"});
							});
							break;
						}
					}
				}
				interaction.member.roles.add(role_id).then(function(success) {
					interaction.reply({ content : "Color changed!"}).then(null,function(err) {
						haxe_Log.trace(err,{ fileName : "src/commands/Color.hx", lineNumber : 58, className : "commands.Color", methodName : "run"});
					});
					if(found) {
						haxe_Log.trace("found " + Std.string(set_role),{ fileName : "src/commands/Color.hx", lineNumber : 60, className : "commands.Color", methodName : "run"});
					}
				},function(err) {
					haxe_Log.trace(err,{ fileName : "src/commands/Color.hx", lineNumber : 63, className : "commands.Color", methodName : "run"});
					$global.console.dir(err);
				});
			},function(err) {
				haxe_Log.trace(err,{ fileName : "src/commands/Color.hx", lineNumber : 68, className : "commands.Color", methodName : "run"});
				$global.console.dir(err);
			});
		}
	}
	,rollRemoved: function(interaction,response) {
		interaction.reply("Removed");
	}
	,get_name: function() {
		return "color";
	}
	,__class__: commands_Color
});
var systems_CommandDbBase = function(_universe) {
	this.has_subcommands = false;
	ecs_System.call(this,_universe);
	this.commands = this.universe.families.get(2);
	this.table5d38588a6ddd880f90fc8234bccb893f = this.universe.components.getTable(4);
	this.tablefa61f37a15ee60bbc1601eb42174bd3d = this.universe.components.getTable(3);
};
$hxClasses["systems.CommandDbBase"] = systems_CommandDbBase;
systems_CommandDbBase.__name__ = "systems.CommandDbBase";
systems_CommandDbBase.__super__ = ecs_System;
systems_CommandDbBase.prototype = $extend(ecs_System.prototype,{
	has_subcommands: null
	,update: function(_) {
		if(!Main.connected || !Main.commands_active) {
			return;
		}
		var _this = this.commands;
		var _set = _this.entities;
		var _active = _this.isActive();
		var _g_idx = _set.size() - 1;
		while(_active && _g_idx >= 0) {
			var entity = _set.getDense(_g_idx--);
			var interaction = this.table5d38588a6ddd880f90fc8234bccb893f.get(entity);
			var command = this.tablefa61f37a15ee60bbc1601eb42174bd3d.get(entity);
			if(this.has_subcommands) {
				if(command.name.indexOf(this.get_name(),0) != -1) {
					this.run(command,interaction);
					this.universe.deleteEntity(entity);
				}
			} else if(command.name == this.get_name()) {
				this.run(command,interaction);
				this.universe.deleteEntity(entity);
			}
		}
	}
	,addDoc: function(path,data,success,failure) {
		firebase_web_firestore_Firestore.addDoc(firebase_web_firestore_Firestore.collection(firebase_web_firestore_Firestore.getFirestore(firebase_web_app_FirebaseApp.getApp()),path),data).then(success,failure);
	}
	,get_db: function() {
		return firebase_web_firestore_Firestore.getFirestore(firebase_web_app_FirebaseApp.getApp());
	}
	,run: null
	,get_name: null
	,commands: null
	,table5d38588a6ddd880f90fc8234bccb893f: null
	,tablefa61f37a15ee60bbc1601eb42174bd3d: null
	,__class__: systems_CommandDbBase
	,__properties__: {get_name:"get_name",get_db:"get_db"}
});
var commands_DeleteProject = function(_universe) {
	systems_CommandDbBase.call(this,_universe);
	this.options = this.universe.families.get(8);
	this.tablef1c30c373f6abc39648a24020b4b82b2 = this.universe.components.getTable(9);
};
$hxClasses["commands.DeleteProject"] = commands_DeleteProject;
commands_DeleteProject.__name__ = "commands.DeleteProject";
commands_DeleteProject.__super__ = systems_CommandDbBase;
commands_DeleteProject.prototype = $extend(systems_CommandDbBase.prototype,{
	update: function(_) {
		var _this = this.options;
		var _set = _this.entities;
		var _active = _this.isActive();
		var _g_idx = _set.size() - 1;
		while(_active && _g_idx >= 0) {
			var entity = _set.getDense(_g_idx--);
			var interaction = this.table5d38588a6ddd880f90fc8234bccb893f.get(entity);
			var route = this.tablef1c30c373f6abc39648a24020b4b82b2.get(entity);
			if(route == "DeleteProject") {
				var author = interaction.user.id;
				if(interaction.channel.isThread()) {
					var confirm = new discord_$builder_ButtonBuilder().setCustomId("deleteProjectConfirm").setLabel("Confirm Delete").setStyle(4);
					var cancel = new discord_$builder_ButtonBuilder().setCustomId("deleteProjectCancel").setLabel("Cancel").setStyle(2);
					var row = new discord_$builder_APIActionRowComponent();
					row.addComponents(cancel,confirm);
					try {
						var thread = [js_Boot.__cast(interaction.channel , discord_$js_ThreadChannel)];
						if(thread[0].ownerId == author) {
							interaction.reply({ ephemeral : true, content : "Are you sure you want to delete this project? All messages within this thread will be erased - It is **permanent** and **cannot** be undone.", components : [row]}).then((function(thread) {
								return function(response) {
									response.awaitMessageComponent({ filter : (function(thread) {
										return function(a,b) {
											if(a.customId == "deleteProjectConfirm") {
												thread[0].delete("User requested delete").then(null,(function() {
													return function(err) {
														haxe_Log.trace(err,{ fileName : "src/commands/DeleteProject.hx", lineNumber : 39, className : "commands.DeleteProject", methodName : "update"});
													};
												})());
											} else {
												a.update({ content : "Request cancelled.", components : []}).then(null,(function() {
													return function(err) {
														haxe_Log.trace(err,{ fileName : "src/commands/DeleteProject.hx", lineNumber : 41, className : "commands.DeleteProject", methodName : "update"});
													};
												})());
											}
										};
									})(thread)}).then(null,(function() {
										return function(err) {
											if((err != null ? err.message : null).indexOf("threadDelete") != -1) {
												return;
											}
											haxe_Log.trace(err,{ fileName : "src/commands/DeleteProject.hx", lineNumber : 48, className : "commands.DeleteProject", methodName : "update"});
										};
									})());
								};
							})(thread),(function() {
								return function(err) {
									haxe_Log.trace(err,{ fileName : "src/commands/DeleteProject.hx", lineNumber : 50, className : "commands.DeleteProject", methodName : "update"});
								};
							})());
						} else {
							interaction.reply({ content : "This isn't your thread! :angry:", ephemeral : true});
						}
					} catch( _g ) {
						haxe_Log.trace("thread cast failed",{ fileName : "src/commands/DeleteProject.hx", lineNumber : 55, className : "commands.DeleteProject", methodName : "update"});
					}
				} else {
					interaction.reply({ content : "*This only works for threads :)*", ephemeral : true}).then(null,(function() {
						return function(err) {
							haxe_Log.trace(err,{ fileName : "src/commands/DeleteProject.hx", lineNumber : 61, className : "commands.DeleteProject", methodName : "update"});
						};
					})());
				}
				this.universe.deleteEntity(entity);
			}
		}
	}
	,run: function(command,interaction) {
		haxe_Log.trace("here",{ fileName : "src/commands/DeleteProject.hx", lineNumber : 70, className : "commands.DeleteProject", methodName : "run"});
	}
	,get_name: function() {
		return "deleteproject";
	}
	,options: null
	,tablef1c30c373f6abc39648a24020b4b82b2: null
	,__class__: commands_DeleteProject
});
var commands_Emoji = function(_universe) {
	this.super_mod_id = "198916468312637440";
	this.max_name_length = 35;
	this.cache = new haxe_ds_StringMap();
	systems_CommandBase.call(this,_universe);
	this.modal = this.universe.families.get(7);
	this.table87a8f92f715c03d0822a55d9b93a210d = this.universe.components.getTable(5);
};
$hxClasses["commands.Emoji"] = commands_Emoji;
commands_Emoji.__name__ = "commands.Emoji";
commands_Emoji.__super__ = systems_CommandBase;
commands_Emoji.prototype = $extend(systems_CommandBase.prototype,{
	cache: null
	,max_name_length: null
	,super_mod_id: null
	,update: function(_) {
		var _gthis = this;
		systems_CommandBase.prototype.update.call(this,_);
		var _this = this.modal;
		var _set = _this.entities;
		var _g_set = _set;
		var _g_active = _this.isActive();
		var _g_idx = _set.size() - 1;
		while(_g_active && _g_idx >= 0) {
			var entity = _g_set.getDense(_g_idx--);
			var interaction = [this.table5d38588a6ddd880f90fc8234bccb893f.get(entity)];
			var forward = this.table87a8f92f715c03d0822a55d9b93a210d.get(entity);
			if(forward == "emoji_edit") {
				var emoji = [this.cache.h[interaction[0].user.id]];
				var url = interaction[0].fields.getTextInputValue("url");
				emoji[0].description = interaction[0].fields.getTextInputValue("description");
				var e = database_DBEvents.GetRecord("emojis",QueryExpr.QueryBinop(QBinop.QOpEq,QueryExpr.QueryConstant(QConstant.QIdent("url")),QueryExpr.QueryValue(url)),(function(emoji,interaction) {
					return function(resp) {
						if(resp._hx_index == 1) {
							var data = resp.data;
							if(data != null && data.field("name") != emoji[0].name) {
								var interaction1 = interaction[0];
								var tmp = data.field("name");
								interaction1.reply("An emoji already exists with that image **__" + (tmp == null ? "null" : Std.string(tmp)) + "__**").then(null,(function() {
									return function(err) {
										haxe_Log.trace(err,{ fileName : "src/commands/Emoji.hx", lineNumber : 36, className : "commands.Emoji", methodName : "update"});
										$global.console.dir(err);
									};
								})());
								return;
							}
							emoji[0].name = _gthis.get_name().toLowerCase();
							var e = database_DBEvents.Update("emojis",emoji[0].get_record(),QueryExpr.QueryBinop(QBinop.QOpBoolAnd,QueryExpr.QueryBinop(QBinop.QOpEq,QueryExpr.QueryConstant(QConstant.QIdent("id")),QueryExpr.QueryValue(emoji[0].id)),QueryExpr.QueryBinop(QBinop.QOpEq,QueryExpr.QueryConstant(QConstant.QIdent("author_id")),QueryExpr.QueryValue(emoji[0].author_id))),(function(interaction) {
								return function(resp) {
									if(resp._hx_index == 4) {
										var message = resp.message;
										haxe_Log.trace("" + message,{ fileName : "src/commands/Emoji.hx", lineNumber : 46, className : "commands.Emoji", methodName : "update"});
										interaction[0].reply("Emoji updated!").then(null,(function() {
											return function(err) {
												haxe_Log.trace(err,{ fileName : "src/commands/Emoji.hx", lineNumber : 47, className : "commands.Emoji", methodName : "update"});
											};
										})());
									} else {
										haxe_Log.trace(_gthis.cache.h[interaction[0].user.id],{ fileName : "src/commands/Emoji.hx", lineNumber : 49, className : "commands.Emoji", methodName : "update"});
										interaction[0].reply("Something went wrong").then(null,(function() {
											return function(err) {
												haxe_Log.trace(err,{ fileName : "src/commands/Emoji.hx", lineNumber : 50, className : "commands.Emoji", methodName : "update"});
											};
										})());
										haxe_Log.trace(resp,{ fileName : "src/commands/Emoji.hx", lineNumber : 51, className : "commands.Emoji", methodName : "update"});
									}
									var key = interaction[0].user.id;
									var _this = _gthis.cache;
									if(Object.prototype.hasOwnProperty.call(_this.h,key)) {
										delete(_this.h[key]);
									}
								};
							})(interaction));
							var entity = util_EcsTools.get_universe().createEntity();
							var _ecsTmpEntity = entity;
							util_EcsTools.get_universe().components.set(_ecsTmpEntity,2,e);
							var ecsEntCompFlags = util_EcsTools.get_universe().components.flags[ecs_Entity.id(_ecsTmpEntity)];
							var ecsTmpFamily = util_EcsTools.get_universe().families.get(1);
							if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
								ecsTmpFamily.add(_ecsTmpEntity);
							}
						} else {
							haxe_Log.trace(resp,{ fileName : "src/commands/Emoji.hx", lineNumber : 57, className : "commands.Emoji", methodName : "update"});
						}
					};
				})(emoji,interaction));
				var entity1 = util_EcsTools.get_universe().createEntity();
				var _ecsTmpEntity = entity1;
				util_EcsTools.get_universe().components.set(_ecsTmpEntity,2,e);
				var ecsEntCompFlags = util_EcsTools.get_universe().components.flags[ecs_Entity.id(_ecsTmpEntity)];
				var ecsTmpFamily = util_EcsTools.get_universe().families.get(1);
				if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
					ecsTmpFamily.add(_ecsTmpEntity);
				}
			}
			if(forward == "emoji_edit") {
				this.universe.deleteEntity(entity);
			}
		}
	}
	,run: function(command,interaction) {
		var _gthis = this;
		var _g = command.content;
		switch(_g._hx_index) {
		case 37:
			var name = _g.name;
			var size = _g.size;
			if(interaction.isAutocomplete()) {
				this.search(name,function(arr) {
					interaction.respond(arr).then(null,function(err) {
						haxe_Log.trace(err,{ fileName : "src/commands/Emoji.hx", lineNumber : 163, className : "commands.Emoji", methodName : "run"});
					});
				});
				return;
			}
			var e = database_DBEvents.GetRecord("emojis",QueryExpr.QueryBinop(QBinop.QOpBoolOr,QueryExpr.QueryBinop(QBinop.QOpEq,QueryExpr.QueryConstant(QConstant.QIdent("name")),QueryExpr.QueryValue(name)),QueryExpr.QueryBinop(QBinop.QOpEq,QueryExpr.QueryConstant(QConstant.QIdent("id")),QueryExpr.QueryValue(name))),function(resp) {
				if(resp._hx_index == 1) {
					var data = resp.data;
					if(data != null) {
						var emoji = database_types_DBEmoji.fromRecord(data);
						var url = _gthis.formatLink(emoji.url,size);
						interaction.reply({ content : url}).then(null,function(err) {
							haxe_Log.trace(err,{ fileName : "src/commands/Emoji.hx", lineNumber : 175, className : "commands.Emoji", methodName : "run"});
						});
						return;
					}
					haxe_Log.trace(resp,{ fileName : "src/commands/Emoji.hx", lineNumber : 178, className : "commands.Emoji", methodName : "run"});
					haxe_Log.trace(data,{ fileName : "src/commands/Emoji.hx", lineNumber : 179, className : "commands.Emoji", methodName : "run"});
					interaction.reply({ content : "Something went wrong", ephemeral : true}).then(null,function(err) {
						haxe_Log.trace(err,{ fileName : "src/commands/Emoji.hx", lineNumber : 180, className : "commands.Emoji", methodName : "run"});
					});
				} else {
					interaction.reply({ content : "Something went wrong", ephemeral : true}).then(null,function(err) {
						haxe_Log.trace(err,{ fileName : "src/commands/Emoji.hx", lineNumber : 182, className : "commands.Emoji", methodName : "run"});
					});
					haxe_Log.trace(resp,{ fileName : "src/commands/Emoji.hx", lineNumber : 183, className : "commands.Emoji", methodName : "run"});
				}
			});
			var entity = util_EcsTools.get_universe().createEntity();
			var _ecsTmpEntity = entity;
			util_EcsTools.get_universe().components.set(_ecsTmpEntity,2,e);
			var ecsEntCompFlags = util_EcsTools.get_universe().components.flags[ecs_Entity.id(_ecsTmpEntity)];
			var ecsTmpFamily = util_EcsTools.get_universe().families.get(1);
			if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
				ecsTmpFamily.add(_ecsTmpEntity);
			}
			break;
		case 38:
			var name = _g.name;
			if(interaction.isAutocomplete()) {
				this.search(name,function(arr) {
					interaction.respond(arr).then(null,function(err) {
						haxe_Log.trace(err,{ fileName : "src/commands/Emoji.hx", lineNumber : 134, className : "commands.Emoji", methodName : "run"});
					});
				});
				return;
			}
			var role_status = Util_hasRole(this.super_mod_id,interaction);
			var record = new db_Record();
			if(!role_status) {
				record.field("author_id",interaction.user.id);
			}
			record.field("id",name);
			var e = database_DBEvents.DeleteRecord("emojis",record,function(resp) {
				switch(resp._hx_index) {
				case 4:
					interaction.reply("Emoji " + name + " deleted!").then(null,function(err) {
						haxe_Log.trace(err,{ fileName : "src/commands/Emoji.hx", lineNumber : 148, className : "commands.Emoji", methodName : "run"});
					});
					break;
				case 5:
					var message = resp.message;
					haxe_Log.trace(message,{ fileName : "src/commands/Emoji.hx", lineNumber : 150, className : "commands.Emoji", methodName : "run"});
					interaction.reply({ ephemeral : true, content : "Cannot delete this emoji"}).then(null,function(err) {
						haxe_Log.trace(err,{ fileName : "src/commands/Emoji.hx", lineNumber : 152, className : "commands.Emoji", methodName : "run"});
						$global.console.dir(err);
					});
					break;
				default:
					haxe_Log.trace(resp,{ fileName : "src/commands/Emoji.hx", lineNumber : 156, className : "commands.Emoji", methodName : "run"});
				}
			});
			var entity = util_EcsTools.get_universe().createEntity();
			var _ecsTmpEntity = entity;
			util_EcsTools.get_universe().components.set(_ecsTmpEntity,2,e);
			var ecsEntCompFlags = util_EcsTools.get_universe().components.flags[ecs_Entity.id(_ecsTmpEntity)];
			var ecsTmpFamily = util_EcsTools.get_universe().families.get(1);
			if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
				ecsTmpFamily.add(_ecsTmpEntity);
			}
			break;
		case 39:
			var name1 = _g.name;
			if(interaction.isAutocomplete()) {
				var e = database_DBEvents.SearchBy("emojis","name",name1,"author_id",interaction.user.id,function(resp) {
					if(resp._hx_index == 2) {
						var data = resp.data;
						var arr = [];
						var r = data.iterator();
						while(r.hasNext()) {
							var r1 = r.next();
							var e = database_types_DBEmoji.fromRecord(r1);
							arr.push({ name : e.name, value : e.id == null ? "null" : "" + e.id});
						}
						interaction.respond(arr);
					} else {
						haxe_Log.trace(resp,{ fileName : "src/commands/Emoji.hx", lineNumber : 88, className : "commands.Emoji", methodName : "run"});
						interaction.respond([]);
					}
				});
				var entity = util_EcsTools.get_universe().createEntity();
				var _ecsTmpEntity = entity;
				util_EcsTools.get_universe().components.set(_ecsTmpEntity,2,e);
				var ecsEntCompFlags = util_EcsTools.get_universe().components.flags[ecs_Entity.id(_ecsTmpEntity)];
				var ecsTmpFamily = util_EcsTools.get_universe().families.get(1);
				if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
					ecsTmpFamily.add(_ecsTmpEntity);
				}
				return;
			}
			var e = database_DBEvents.GetRecord("emojis",QueryExpr.QueryBinop(QBinop.QOpBoolAnd,QueryExpr.QueryBinop(QBinop.QOpEq,QueryExpr.QueryConstant(QConstant.QIdent("id")),QueryExpr.QueryValue(name1)),QueryExpr.QueryBinop(QBinop.QOpEq,QueryExpr.QueryConstant(QConstant.QIdent("author_id")),QueryExpr.QueryValue(interaction.user.id))),function(resp) {
				if(resp._hx_index == 1) {
					var data = resp.data;
					if(data == null) {
						interaction.reply("Could not find emoji or you were not the author of the emoji specified");
						return;
					}
					var emoji = database_types_DBEmoji.fromRecord(data);
					var modal = new discord_$builder_ModalBuilder().setCustomId("emoji_edit").setTitle("Editting emoji #" + emoji.id);
					var url_input = new discord_$builder_APITextInputComponent().setCustomId("url").setLabel("url").setStyle(1).setValue(emoji.url).setMinLength(8);
					var desc_input = new discord_$builder_APITextInputComponent().setCustomId("description").setLabel("Description:").setStyle(2).setValue(emoji.description).setMinLength(5).setMaxLength(50);
					var action_b = new discord_$builder_APIActionRowComponent().addComponents(url_input);
					var action_c = new discord_$builder_APIActionRowComponent().addComponents(desc_input);
					modal.addComponents(action_b,action_c);
					_gthis.cache.h[interaction.user.id] = emoji;
					interaction.showModal(modal);
				} else {
					haxe_Log.trace(resp,{ fileName : "src/commands/Emoji.hx", lineNumber : 127, className : "commands.Emoji", methodName : "run"});
				}
			});
			var entity = util_EcsTools.get_universe().createEntity();
			var _ecsTmpEntity = entity;
			util_EcsTools.get_universe().components.set(_ecsTmpEntity,2,e);
			var ecsEntCompFlags = util_EcsTools.get_universe().components.flags[ecs_Entity.id(_ecsTmpEntity)];
			var ecsTmpFamily = util_EcsTools.get_universe().families.get(1);
			if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
				ecsTmpFamily.add(_ecsTmpEntity);
			}
			break;
		case 40:
			var name1 = _g.name;
			var url = _g.url;
			var description = _g.description;
			if(interaction.isAutocomplete()) {
				this.search(name1,function(arr) {
					interaction.respond(arr).then(null,function(err) {
						haxe_Log.trace(err,{ fileName : "src/commands/Emoji.hx", lineNumber : 190, className : "commands.Emoji", methodName : "run"});
					});
				});
				return;
			}
			var e = database_DBEvents.GetRecord("emojis",QueryExpr.QueryBinop(QBinop.QOpEq,QueryExpr.QueryConstant(QConstant.QIdent("url")),QueryExpr.QueryValue(url)),function(resp) {
				if(resp._hx_index == 1) {
					var data = resp.data;
					if(data != null) {
						var emoji = database_types_DBEmoji.fromRecord(data);
						interaction.reply({ ephemeral : true, content : "Emoji already exists with name __" + emoji.name + "__"}).then(null,function(err) {
							haxe_Log.trace(err,{ fileName : "src/commands/Emoji.hx", lineNumber : 200, className : "commands.Emoji", methodName : "run"});
						});
						return;
					}
					var regex = new EReg("((((https?:)(?://)?)(?:[-;:&=\\+\\$,\\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\\+\\$,\\w]+@)[A-Za-z0-9.-]+)((?:/[\\+~%/.\\w_]*)?\\??(?:[-\\+=&;%@.\\w_]*)#?(?:[\\w]*))?)","gm");
					if(!regex.match(url)) {
						interaction.reply({ ephemeral : true, content : "URL does not appear to be valid"}).then(null,function(err) {
							haxe_Log.trace(err,{ fileName : "src/commands/Emoji.hx", lineNumber : 205, className : "commands.Emoji", methodName : "run"});
						});
						return;
					}
					var e = database_DBEvents.GetRecords("emojis",QueryExpr.QueryBinop(QBinop.QOpBoolOr,QueryExpr.QueryBinop(QBinop.QOpEq,QueryExpr.QueryConstant(QConstant.QIdent("name")),QueryExpr.QueryValue(name1)),QueryExpr.QueryBinop(QBinop.QOpEq,QueryExpr.QueryConstant(QConstant.QIdent("id")),QueryExpr.QueryValue(name1))),function(resp) {
						if(resp._hx_index == 2) {
							var data = resp.data;
							if(data.get_length() > 0) {
								interaction.reply({ ephemeral : true, content : "An emoji exists with this name already"}).then(null,function(err) {
									haxe_Log.trace(err,{ fileName : "src/commands/Emoji.hx", lineNumber : 213, className : "commands.Emoji", methodName : "run"});
								});
								return;
							}
							var aname = interaction.user.username;
							var aid = interaction.user.id;
							var emoji = new database_types_DBEmoji(aid,aname,name1,url,description);
							var e = database_DBEvents.Insert("emojis",emoji.get_record(),function(resp) {
								if(resp._hx_index == 4) {
									interaction.reply({ content : "Emoji " + name1 + " has been created"}).then(null,function(err) {
										haxe_Log.trace(err,{ fileName : "src/commands/Emoji.hx", lineNumber : 223, className : "commands.Emoji", methodName : "run"});
									});
								} else {
									interaction.reply({ content : "Something went wrong", ephemeral : true}).then(null,function(err) {
										haxe_Log.trace(err,{ fileName : "src/commands/Emoji.hx", lineNumber : 226, className : "commands.Emoji", methodName : "run"});
									});
									haxe_Log.trace(resp,{ fileName : "src/commands/Emoji.hx", lineNumber : 227, className : "commands.Emoji", methodName : "run"});
								}
							});
							var entity = util_EcsTools.get_universe().createEntity();
							var _ecsTmpEntity = entity;
							util_EcsTools.get_universe().components.set(_ecsTmpEntity,2,e);
							var ecsEntCompFlags = util_EcsTools.get_universe().components.flags[ecs_Entity.id(_ecsTmpEntity)];
							var ecsTmpFamily = util_EcsTools.get_universe().families.get(1);
							if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
								ecsTmpFamily.add(_ecsTmpEntity);
							}
						} else {
							interaction.reply({ content : "Something went wrong", ephemeral : true}).then(null,function(err) {
								haxe_Log.trace(err,{ fileName : "src/commands/Emoji.hx", lineNumber : 232, className : "commands.Emoji", methodName : "run"});
							});
							haxe_Log.trace(resp,{ fileName : "src/commands/Emoji.hx", lineNumber : 233, className : "commands.Emoji", methodName : "run"});
						}
					});
					var entity = util_EcsTools.get_universe().createEntity();
					var _ecsTmpEntity = entity;
					util_EcsTools.get_universe().components.set(_ecsTmpEntity,2,e);
					var ecsEntCompFlags = util_EcsTools.get_universe().components.flags[ecs_Entity.id(_ecsTmpEntity)];
					var ecsTmpFamily = util_EcsTools.get_universe().families.get(1);
					if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
						ecsTmpFamily.add(_ecsTmpEntity);
					}
				} else {
					interaction.reply({ content : "Something went wrong", ephemeral : true}).then(null,function(err) {
						haxe_Log.trace(err,{ fileName : "src/commands/Emoji.hx", lineNumber : 238, className : "commands.Emoji", methodName : "run"});
					});
					haxe_Log.trace(resp,{ fileName : "src/commands/Emoji.hx", lineNumber : 239, className : "commands.Emoji", methodName : "run"});
				}
			});
			var entity = util_EcsTools.get_universe().createEntity();
			var _ecsTmpEntity = entity;
			util_EcsTools.get_universe().components.set(_ecsTmpEntity,2,e);
			var ecsEntCompFlags = util_EcsTools.get_universe().components.flags[ecs_Entity.id(_ecsTmpEntity)];
			var ecsTmpFamily = util_EcsTools.get_universe().families.get(1);
			if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
				ecsTmpFamily.add(_ecsTmpEntity);
			}
			break;
		default:
		}
	}
	,formatLink: function(url,size) {
		if(url.indexOf("cdn.discordapp.com") != -1) {
			var split = url.split("?");
			if(split.length > 1) {
				if(size == null) {
					size = "small";
				}
				var dimensions;
				switch(size) {
				case "large":
					dimensions = 128;
					break;
				case "medium":
					dimensions = 64;
					break;
				default:
					dimensions = 48;
				}
				split[0] += "?quality=lossless&size=" + dimensions;
				url = split[0];
				return url;
			}
		}
		return url;
	}
	,search: function(name,callback) {
		var e = database_DBEvents.Search("emojis","name",name,function(resp) {
			if(resp._hx_index == 2) {
				var arr = [];
				var r = resp.data.iterator();
				while(r.hasNext()) {
					var r1 = r.next();
					var e = database_types_DBEmoji.fromRecord(r1);
					arr.push({ name : e.name, value : e.id == null ? "null" : "" + e.id});
				}
				callback(arr);
			} else {
				haxe_Log.trace(resp,{ fileName : "src/commands/Emoji.hx", lineNumber : 282, className : "commands.Emoji", methodName : "search"});
				callback([]);
			}
		});
		var entity = util_EcsTools.get_universe().createEntity();
		util_EcsTools.get_universe().components.set(entity,2,e);
		var ecsEntCompFlags = util_EcsTools.get_universe().components.flags[ecs_Entity.id(entity)];
		var ecsTmpFamily = util_EcsTools.get_universe().families.get(1);
		if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
			ecsTmpFamily.add(entity);
		}
	}
	,isId: function(input) {
		var check_letters = new EReg("^[0-9]*$","");
		return check_letters.match(input);
	}
	,get_name: function() {
		return "emoji";
	}
	,modal: null
	,table87a8f92f715c03d0822a55d9b93a210d: null
	,__class__: commands_Emoji
});
var commands_Everyone = function(_universe) {
	systems_CommandBase.call(this,_universe);
};
$hxClasses["commands.Everyone"] = commands_Everyone;
commands_Everyone.__name__ = "commands.Everyone";
commands_Everyone.__super__ = systems_CommandBase;
commands_Everyone.prototype = $extend(systems_CommandBase.prototype,{
	onEnabled: function() {
	}
	,run: function(command,interaction) {
		var _g = command.content;
		if(_g._hx_index == 41) {
			if(interaction.channel.isThread()) {
				var channel = interaction.channel;
				if(channel.ownerId != interaction.user.id) {
					interaction.reply({ ephemeral : true, content : "You're not the owner of this thread"}).then(null,function(err) {
						haxe_Log.trace(err,{ fileName : "src/commands/Everyone.hx", lineNumber : 25, className : "commands.Everyone", methodName : "run"});
					});
					return;
				}
				interaction.reply({ content : "@everyone - " + _g.content, allowedMentions : { parse : ["everyone"]}}).then(null,function(err) {
					haxe_Log.trace(err,{ fileName : "src/commands/Everyone.hx", lineNumber : 34, className : "commands.Everyone", methodName : "run"});
				});
			} else {
				interaction.reply({ ephemeral : true, content : "This command can only be activated from within a thread and one you must be the person who created it"}).then(null,function(err) {
					haxe_Log.trace(err,{ fileName : "src/commands/Everyone.hx", lineNumber : 39, className : "commands.Everyone", methodName : "run"});
				});
			}
		}
	}
	,get_name: function() {
		return "everyone";
	}
	,__class__: commands_Everyone
});
var commands_Haxelib = function(_universe) {
	this.site = "localhost";
	this.message_history = new haxe_ds_StringMap();
	this.super_mod_id = "198916468312637440";
	systems_CommandBase.call(this,_universe);
};
$hxClasses["commands.Haxelib"] = commands_Haxelib;
commands_Haxelib.__name__ = "commands.Haxelib";
commands_Haxelib.__super__ = systems_CommandBase;
commands_Haxelib.prototype = $extend(systems_CommandBase.prototype,{
	last_interaction: null
	,super_mod_id: null
	,message_history: null
	,http: null
	,site: null
	,onEnabled: function() {
	}
	,run: function(command,interaction) {
		var h = this.message_history.h;
		var _g_h = h;
		var _g_keys = Object.keys(h);
		var _g_length = _g_keys.length;
		var _g_current = 0;
		while(_g_current < _g_length) {
			var key = _g_keys[_g_current++];
			var _g_key = key;
			var _g_value = _g_h[key];
			var key1 = _g_key;
			var data = _g_value;
			var time = new Date().getTime();
			if(time - data.timestamp > 5000) {
				var _this = this.message_history;
				if(Object.prototype.hasOwnProperty.call(_this.h,key1)) {
					delete(_this.h[key1]);
				}
			}
		}
		var role_status = Util_hasRole(this.super_mod_id,interaction);
		var _g = command.content;
		if(_g._hx_index == 31) {
			var command = _g.command;
			var route = command;
			var http = new haxe_http_HttpNodeJs("http://" + this.site + ":1337");
			http.onError = function(error) {
				haxe_Log.trace(error,{ fileName : "src/commands/Haxelib.hx", lineNumber : 67, className : "commands.Haxelib", methodName : "run"});
			};
			if(route.indexOf(" ") != -1) {
				route = route.split(" ")[0];
			}
			if(route != "list" && route != "info" && route != "search") {
				if(!role_status) {
					interaction.reply("Invalid Permissions.").then(null,function(err) {
						haxe_Log.trace(err,{ fileName : "src/commands/Haxelib.hx", lineNumber : 77, className : "commands.Haxelib", methodName : "run"});
						$global.console.dir(err);
					});
					return;
				}
			}
			interaction.deferReply({ }).then(function(_) {
				http.setHeader("Authorization","Basic " + Main.keys.haxelib);
				haxe_Log.trace(Main.keys.haxelib,{ fileName : "src/commands/Haxelib.hx", lineNumber : 86, className : "commands.Haxelib", methodName : "run"});
				http.onData = function(response) {
					var parse = JSON.parse(response);
					if(parse.status == "Ok") {
						haxe_Log.trace("parse",{ fileName : "src/commands/Haxelib.hx", lineNumber : 91, className : "commands.Haxelib", methodName : "run"});
						var output = "";
						var _g = 0;
						var _g1 = parse.output.split("\n");
						while(_g < _g1.length) {
							var line = _g1[_g];
							++_g;
							if(line.indexOf("KB") != -1 || line.indexOf("%") != -1) {
								continue;
							}
							output += line + "\n";
						}
						haxe_Log.trace(output,{ fileName : "src/commands/Haxelib.hx", lineNumber : 99, className : "commands.Haxelib", methodName : "run"});
						var embed = new discord_$js_MessageEmbed().setTitle("Haxelib");
						if(output.length > 4000) {
							output = HxOverrides.substr(output,0,4000) + "...";
						}
						if(output.length == 0 || output == "") {
							output = "No libraries installed.";
						}
						embed.setDescription(output);
						interaction.editReply({ embeds : [embed]}).then(null,function(err) {
							haxe_Log.trace(err,{ fileName : "src/commands/Haxelib.hx", lineNumber : 111, className : "commands.Haxelib", methodName : "run"});
							$global.console.dir(err);
						});
					} else {
						var embed = new discord_$js_MessageEmbed();
						embed.type = "article";
						var error = parse.error;
						embed.setDescription("Error \n + " + error);
						interaction.editReply({ embeds : [embed]}).then(null,function(err) {
							haxe_Log.trace(err,{ fileName : "src/commands/Haxelib.hx", lineNumber : 121, className : "commands.Haxelib", methodName : "run"});
						});
						haxe_Log.trace(parse,{ fileName : "src/commands/Haxelib.hx", lineNumber : 122, className : "commands.Haxelib", methodName : "run"});
					}
				};
				var request = { action : "haxelib_run", input : command};
				haxe_Log.trace(request,{ fileName : "src/commands/Haxelib.hx", lineNumber : 131, className : "commands.Haxelib", methodName : "run"});
				var str = JSON.stringify(request);
				http.setPostData(str);
				http.request(true);
			},function(err) {
				haxe_Log.trace(err,{ fileName : "src/commands/Haxelib.hx", lineNumber : 136, className : "commands.Haxelib", methodName : "run"});
			});
		}
	}
	,addHistory: function(command,embed) {
		if(Object.prototype.hasOwnProperty.call(this.message_history.h,command)) {
			return false;
		}
		this.message_history.h[command] = embed;
		return true;
	}
	,get_name: function() {
		return "haxelib";
	}
	,__class__: commands_Haxelib
});
var commands_Help = function(_universe) {
	systems_CommandBase.call(this,_universe);
};
$hxClasses["commands.Help"] = commands_Help;
commands_Help.__name__ = "commands.Help";
commands_Help.__super__ = systems_CommandBase;
commands_Help.prototype = $extend(systems_CommandBase.prototype,{
	data: null
	,onEnabled: function() {
		this.data = Util_loadFile("help",{ fileName : "src/commands/Help.hx", lineNumber : 12, className : "commands.Help", methodName : "onEnabled"});
	}
	,run: function(command,interaction) {
		if(this.data == null || this.data.length == 0) {
			haxe_Log.trace("no help content configured",{ fileName : "src/commands/Help.hx", lineNumber : 17, className : "commands.Help", methodName : "run"});
			return;
		}
		if(Object.prototype.hasOwnProperty.call(Main.dm_help_tracking.h,interaction.user.id)) {
			var _g = 0;
			var _g1 = this.data;
			while(_g < _g1.length) {
				var content = _g1[_g];
				++_g;
				if(content.type != "helppls_dm") {
					continue;
				}
				interaction.reply({ content : content.content.toString()}).then(null,function(err) {
					haxe_Log.trace(err,{ fileName : "src/commands/Help.hx", lineNumber : 27, className : "commands.Help", methodName : "run"});
					$global.console.dir(err);
				});
				break;
			}
			return;
		}
		var _g = command.content;
		if(_g._hx_index == 30) {
			var category = _g.category;
			var msg = "";
			var _g_current = 0;
			var _g_array = this.data;
			while(_g_current < _g_array.length) {
				var _g_value = _g_array[_g_current];
				var _g_key = _g_current++;
				var key = _g_key;
				var item = _g_value;
				if(category == null) {
					if(!item.show_help) {
						continue;
					}
					if(item.type == "run") {
						msg += "- `!" + item.type + "`: " + item.content.toString();
					} else {
						msg += "- `/" + item.type + "`: " + item.content.toString();
					}
					if(key != this.data.length - 1) {
						msg += "\n";
					}
				} else if(item.type == category) {
					msg = "/`" + item.type + "`: " + item.content.toString();
					break;
				}
			}
			if(msg.length == 0 || msg == "" || msg == null) {
				msg = "Nothing found, sorry :(";
			}
			interaction.reply(msg).then(null,function(err) {
				haxe_Log.trace(err,{ fileName : "src/commands/Help.hx", lineNumber : 64, className : "commands.Help", methodName : "run"});
				$global.console.dir(err);
			});
		}
	}
	,get_name: function() {
		return "help";
	}
	,__class__: commands_Help
});
var commands_HelpType = {};
commands_HelpType.fromString = function(value) {
	switch(value.toLowerCase()) {
	case "helppls_dm":
		return "helppls_dm";
	case "notify":
		return "notify";
	case "rtfm":
		return "rtfm";
	case "run":
		return "run";
	default:
		return "Invalid help option.";
	}
};
var commands_Hi = function(_universe) {
	systems_CommandBase.call(this,_universe);
};
$hxClasses["commands.Hi"] = commands_Hi;
commands_Hi.__name__ = "commands.Hi";
commands_Hi.__super__ = systems_CommandBase;
commands_Hi.prototype = $extend(systems_CommandBase.prototype,{
	run: function(command,interaction) {
		var message = "Hey there";
		if(Math.random() < 0.35) {
			switch(interaction.user.id) {
			case "215582414544699393":
				message = "Hello Bulby! ReAD ArCH NeWS! :face_with_hand_over_mouth:";
				break;
			case "231872730478280705":
				message = "Hey logo, how jammy are you feeling today? :jam:";
				break;
			case "415825875146375168":
				message = "Hey semmi, got any cool music tonight? \\o/";
				break;
			case "613797359822045194":
				message = "Hey Furret, gained any patience yet?";
				break;
			case "726161533540761662":
				message = Math.random() < 0.4 ? "Hi cheems, having a good day? :)" : "Hi cheems, I know you're secretly a muffin.";
				break;
			case "781745960829059072":
				message = Math.random() < 0.4 ? "Hi Ratul, don't make me go sleep :(" : "Hi... Hmm, weren't you a sasquatch?";
				break;
			case "817154767733653524":
				message = "Hello " + interaction.user.tag + ", always a pleasure :)";
				break;
			default:
				message = "Hey you, what's up?";
			}
		}
		interaction.reply({ content : message}).then(null,function(err) {
			haxe_Log.trace(err,{ fileName : "src/commands/Hi.hx", lineNumber : 34, className : "commands.Hi", methodName : "run"});
			$global.console.dir(err);
		});
	}
	,get_name: function() {
		return "hi";
	}
	,__class__: commands_Hi
});
var commands_JamSuggestionBox = function(_) {
	this.channel_id = "1234817988377706557";
	systems_CommandBase.call(this,_);
	this.messages = this.universe.families.get(3);
	this.table87a8f92f715c03d0822a55d9b93a210d = this.universe.components.getTable(5);
	this.tabled1cd3067ebd0108e92f1425a40ea7b45 = this.universe.components.getTable(1);
	this.webhook = new discord_$js_WebhookClient({ url : Main.keys.suggestionbox_hook});
};
$hxClasses["commands.JamSuggestionBox"] = commands_JamSuggestionBox;
commands_JamSuggestionBox.__name__ = "commands.JamSuggestionBox";
commands_JamSuggestionBox.__super__ = systems_CommandBase;
commands_JamSuggestionBox.prototype = $extend(systems_CommandBase.prototype,{
	channel: null
	,channel_id: null
	,webhook: null
	,update: function(_) {
		systems_CommandBase.prototype.update.call(this,_);
		var _this = this.messages;
		var _set = _this.entities;
		var _active = _this.isActive();
		var _g_idx = _set.size() - 1;
		while(_active && _g_idx >= 0) {
			var entity = _set.getDense(_g_idx--);
			var command = this.table87a8f92f715c03d0822a55d9b93a210d.get(entity);
			var message = this.tabled1cd3067ebd0108e92f1425a40ea7b45.get(entity);
			if(command == "suggestion_box") {
				var name = message.author.username;
				if(message.member.nickname != null && message.member.nickname.length > 0) {
					name = message.member.nickname;
				}
				this.webhook.send({ username : name, content : "#theme " + message.content, avatarURL : message.author.avatarURL()}).then(null,function(err) {
					haxe_Log.trace(err,{ fileName : "src/commands/JamSuggestionBox.hx", lineNumber : 48, className : "commands.JamSuggestionBox", methodName : "update"});
				});
				message.delete().then(null,function(err) {
					haxe_Log.trace(err,{ fileName : "src/commands/JamSuggestionBox.hx", lineNumber : 50, className : "commands.JamSuggestionBox", methodName : "update"});
				});
				this.universe.deleteEntity(entity);
			}
		}
	}
	,run: function(command,interaction) {
	}
	,get_name: function() {
		return "jamsuggestionbox";
	}
	,messages: null
	,table87a8f92f715c03d0822a55d9b93a210d: null
	,tabled1cd3067ebd0108e92f1425a40ea7b45: null
	,__class__: commands_JamSuggestionBox
});
var commands_Notify = function(_universe) {
	systems_CommandBase.call(this,_universe);
};
$hxClasses["commands.Notify"] = commands_Notify;
commands_Notify.__name__ = "commands.Notify";
commands_Notify.__super__ = systems_CommandBase;
commands_Notify.prototype = $extend(systems_CommandBase.prototype,{
	getRole: function(channel) {
		switch(channel) {
		case "announcements":
			return "761714325227700225";
		case "ceramic":
			return "914171888748609546";
		case "cortex":
			return "1256579748575051867";
		case "dvorak":
			return "903006951896666153";
		case "events":
			return "1054432874473996408";
		case "flixel":
			return "761714697468248125";
		case "godot":
			return "1059447670344794142";
		case "haxeui":
			return "761714853403820052";
		case "heaps":
			return "761714775902126080";
		case "jam":
			return "1058843687687295066";
		case "kha":
			return "761714809179209818";
		case "reflaxe":
			return "1200065966445449286";
		default:
			return "err";
		}
	}
	,run: function(command,interaction) {
		var _gthis = this;
		var _g = command.content;
		if(_g._hx_index == 29) {
			var channel = _g.channel;
			var role = this.getRole(channel);
			if(role == "err") {
				haxe_Log.trace(channel,{ fileName : "src/commands/Notify.hx", lineNumber : 41, className : "commands.Notify", methodName : "run"});
				haxe_Log.trace(interaction.command,{ fileName : "src/commands/Notify.hx", lineNumber : 42, className : "commands.Notify", methodName : "run"});
				interaction.reply("Invalid channel");
				return;
			}
			interaction.member.fetch(true).then(function(member) {
				var found = false;
				var jsIterator = member.roles.cache.entries();
				var _g_jsIterator = jsIterator;
				var _g_lastStep = jsIterator.next();
				while(!_g_lastStep.done) {
					var v = _g_lastStep.value;
					_g_lastStep = _g_jsIterator.next();
					var _g_key = v[0];
					var key = _g_key;
					if(key == role) {
						found = true;
						break;
					}
				}
				if(found) {
					interaction.member.roles.remove(role).then(function(success) {
						interaction.reply("Unsubscribed to " + channel + " updates");
					},function(err) {
						haxe_Log.trace(err,{ fileName : "src/commands/Notify.hx", lineNumber : 60, className : "commands.Notify", methodName : "run"});
						$global.console.dir(err);
					});
				} else {
					interaction.member.roles.add(role).then(function(success) {
						if(channel == "announcements") {
							var _ecsTmpEntity = _gthis.universe.createEntity();
							_gthis.universe.components.set(_ecsTmpEntity,5,"auto_thread");
							_gthis.universe.components.set(_ecsTmpEntity,7,member);
							var ecsEntCompFlags = _gthis.universe.components.flags[ecs_Entity.id(_ecsTmpEntity)];
							var ecsTmpFamily = _gthis.universe.families.get(3);
							if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
								ecsTmpFamily.add(_ecsTmpEntity);
							}
							var ecsTmpFamily = _gthis.universe.families.get(4);
							if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
								ecsTmpFamily.add(_ecsTmpEntity);
							}
							var ecsTmpFamily = _gthis.universe.families.get(5);
							if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
								ecsTmpFamily.add(_ecsTmpEntity);
							}
							var ecsTmpFamily = _gthis.universe.families.get(7);
							if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
								ecsTmpFamily.add(_ecsTmpEntity);
							}
							var ecsTmpFamily = _gthis.universe.families.get(10);
							if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
								ecsTmpFamily.add(_ecsTmpEntity);
							}
							var ecsTmpFamily = _gthis.universe.families.get(11);
							if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
								ecsTmpFamily.add(_ecsTmpEntity);
							}
						}
						interaction.reply("Subscribed to " + channel + " updates");
					},function(err) {
						haxe_Log.trace(err,{ fileName : "src/commands/Notify.hx", lineNumber : 73, className : "commands.Notify", methodName : "run"});
						$global.console.dir(err);
					});
				}
			},function(err) {
				haxe_Log.trace(err,{ fileName : "src/commands/Notify.hx", lineNumber : 78, className : "commands.Notify", methodName : "run"});
				$global.console.dir(err);
			});
		}
	}
	,get_name: function() {
		return "notify";
	}
	,__class__: commands_Notify
});
var commands_PinMessage = function(_universe) {
	systems_CommandDbBase.call(this,_universe);
	this.options = this.universe.families.get(8);
	this.tablef1c30c373f6abc39648a24020b4b82b2 = this.universe.components.getTable(9);
};
$hxClasses["commands.PinMessage"] = commands_PinMessage;
commands_PinMessage.__name__ = "commands.PinMessage";
commands_PinMessage.__super__ = systems_CommandDbBase;
commands_PinMessage.prototype = $extend(systems_CommandDbBase.prototype,{
	update: function(_) {
		var _this = this.options;
		var _set = _this.entities;
		var _active = _this.isActive();
		var _g_idx = _set.size() - 1;
		while(_active && _g_idx >= 0) {
			var entity = _set.getDense(_g_idx--);
			var interaction = [this.table5d38588a6ddd880f90fc8234bccb893f.get(entity)];
			var route = this.tablef1c30c373f6abc39648a24020b4b82b2.get(entity);
			if(route == "PinMessage") {
				var author = interaction[0].user.id;
				if(interaction[0].channel.isThread()) {
					try {
						var thread = js_Boot.__cast(interaction[0].channel , discord_$js_ThreadChannel);
						if(thread.ownerId == author) {
							if(interaction[0].targetMessage.pinned) {
								interaction[0].targetMessage.unpin().then((function(interaction) {
									return function(_) {
										interaction[0].reply({ content : "Unpinned", ephemeral : true});
									};
								})(interaction),(function() {
									return function(err) {
										haxe_Log.trace(err,{ fileName : "src/commands/PinMessage.hx", lineNumber : 25, className : "commands.PinMessage", methodName : "update"});
									};
								})());
							} else {
								interaction[0].targetMessage.pin().then((function(interaction) {
									return function(_) {
										interaction[0].reply({ content : "Pinned", ephemeral : true});
									};
								})(interaction),(function(interaction) {
									return function(err) {
										var message = null;
										if(err.code == 50021) {
											message = "Can't pin a system message";
										} else {
											message = Std.string(err.message) + "\n\n Contact NotBilly about this";
										}
										haxe_Log.trace(err,{ fileName : "src/commands/PinMessage.hx", lineNumber : 37, className : "commands.PinMessage", methodName : "update"});
										interaction[0].reply(message).then(null,(function() {
											return function(err) {
												haxe_Log.trace(err,{ fileName : "src/commands/PinMessage.hx", lineNumber : 38, className : "commands.PinMessage", methodName : "update"});
											};
										})());
									};
								})(interaction));
							}
						} else {
							interaction[0].reply({ content : "This isn't your thread!", ephemeral : true});
						}
					} catch( _g ) {
						haxe_Log.trace("thread cast failed",{ fileName : "src/commands/PinMessage.hx", lineNumber : 45, className : "commands.PinMessage", methodName : "update"});
					}
				} else {
					interaction[0].reply({ content : "*Currently this only works for user threads :)*", ephemeral : true}).then(null,(function() {
						return function(err) {
							haxe_Log.trace(err,{ fileName : "src/commands/PinMessage.hx", lineNumber : 51, className : "commands.PinMessage", methodName : "update"});
						};
					})());
				}
				this.universe.deleteEntity(entity);
			}
		}
	}
	,run: function(command,interaction) {
		haxe_Log.trace("here",{ fileName : "src/commands/PinMessage.hx", lineNumber : 60, className : "commands.PinMessage", methodName : "run"});
	}
	,get_name: function() {
		return "pinmessage";
	}
	,options: null
	,tablef1c30c373f6abc39648a24020b4b82b2: null
	,__class__: commands_PinMessage
});
var commands_Poll = function(_universe) {
	this.checked = false;
	systems_CommandDbBase.call(this,_universe);
	this.dm_messages = this.universe.families.get(3);
	this.table87a8f92f715c03d0822a55d9b93a210d = this.universe.components.getTable(5);
	this.tabled1cd3067ebd0108e92f1425a40ea7b45 = this.universe.components.getTable(1);
};
$hxClasses["commands.Poll"] = commands_Poll;
commands_Poll.__name__ = "commands.Poll";
commands_Poll.__super__ = systems_CommandDbBase;
commands_Poll.prototype = $extend(systems_CommandDbBase.prototype,{
	checked: null
	,update: function(_) {
		var _gthis = this;
		systems_CommandDbBase.prototype.update.call(this,_);
		if(!this.checked && Main.connected) {
			this.checked = true;
			var query = firebase_web_firestore_Firestore.query(firebase_web_firestore_Firestore.collection(firebase_web_firestore_Firestore.getFirestore(firebase_web_app_FirebaseApp.getApp()),"discord/polls/entries"));
			firebase_web_firestore_Firestore.getDocs(query).then(function(res) {
				var now = new Date().getTime();
				var _g = 0;
				var _g1 = res.docs;
				while(_g < _g1.length) {
					var doc = _g1[_g];
					++_g;
					var data = [doc.data()];
					if(!data[0].active) {
						var four_weeks = data[0].timestamp.toMillis() + 1210000000 * 2;
						if(now - four_weeks < 0) {
							continue;
						}
						firebase_web_firestore_Firestore.deleteDoc(doc.ref).then(null,(function() {
							return function(err) {
								haxe_Log.trace(err,{ fileName : "src/commands/Poll.hx", lineNumber : 41, className : "commands.Poll", methodName : "update"});
								$global.console.dir(err);
							};
						})());
						continue;
					}
					var start = data[0].timestamp.toMillis();
					var finish = start + data[0].duration;
					var time_left = [0.];
					if(finish < now) {
						time_left[0] = 30000;
					} else {
						time_left[0] = finish - now;
					}
					Main.client.channels.fetch(data[0].channel).then((function(time_left,data) {
						return function(succ) {
							succ.messages.fetch(data[0].message_id).then((function(time_left,data) {
								return function(message) {
									haxe_Log.trace("Resyncing " + data[0].id,{ fileName : "src/commands/Poll.hx", lineNumber : 58, className : "commands.Poll", methodName : "update"});
									_gthis.addCollector(message,data[0],time_left[0]);
								};
							})(time_left,data),(function() {
								return function(err) {
									haxe_Log.trace(err,{ fileName : "src/commands/Poll.hx", lineNumber : 61, className : "commands.Poll", methodName : "update"});
									$global.console.dir(err);
								};
							})());
						};
					})(time_left,data),(function() {
						return function(err) {
							haxe_Log.trace(err,{ fileName : "src/commands/Poll.hx", lineNumber : 65, className : "commands.Poll", methodName : "update"});
							$global.console.dir(err);
						};
					})());
				}
			},function(err) {
				haxe_Log.trace(err,{ fileName : "src/commands/Poll.hx", lineNumber : 70, className : "commands.Poll", methodName : "update"});
				$global.console.dir(err);
			});
		}
	}
	,run: function(command,interaction) {
		var _gthis = this;
		var _g = command.content;
		if(_g._hx_index == 23) {
			var question = _g.question;
			var length = _g.length;
			var a = _g.a;
			var b = _g.b;
			var c = _g.c;
			var d = _g.d;
			var e = _g.e;
			var f = _g.f;
			var g = _g.g;
			var v = _g.votes;
			var time = commands_PollTime.fromString(length);
			if(a == null && b == null) {
				interaction.reply("You must have at least 2 answers");
				return;
			}
			var body = "";
			var collection = [a,b,c,d,e,f,g];
			var answers = new haxe_ds_StringMap();
			var results = new haxe_ds_StringMap();
			var votes = 1;
			var vtxt = "vote";
			if(v == 0 || v > 1) {
				vtxt += "s";
			}
			if(v != null) {
				votes = v;
				if(votes > 7) {
					votes = 7;
				}
			}
			var _g_current = 0;
			var _g_array = collection;
			while(_g_current < _g_array.length) {
				var _g_value = _g_array[_g_current];
				var _g_key = _g_current++;
				var i = _g_key;
				var ans = _g_value;
				if(ans == null) {
					continue;
				}
				var char = this.chars(i);
				results.h[char] = 0;
				answers.h[char] = ans;
				body += "" + char + " - " + ans + "\n";
			}
			var embed = new discord_$js_MessageEmbed();
			embed.setDescription("**Question**\n" + question + "\n\n**Options**\n" + body + "\n**Settings**\n**" + votes + "** " + vtxt + " per user.");
			embed.setFooter({ text : "Poll will run for " + length + "."});
			var settings = new haxe_ds_IntMap();
			settings.h[0] = votes;
			interaction.reply({ embeds : [embed]}).then(function(_) {
				return interaction.fetchReply().then(function(message) {
					var h = answers.h;
					var _g_keys = Object.keys(h);
					var _g_length = _g_keys.length;
					var _g_current = 0;
					while(_g_current < _g_length) {
						var key = _g_keys[_g_current++];
						var _g_key = key;
						var k = _g_key;
						message.react(k);
					}
					var data = { id : -1, active : true, results : JSON.stringify(results), answers : JSON.stringify(answers), question : question, duration : time, settings : JSON.stringify(settings), timestamp : firebase_web_firestore_Timestamp.now(), author : interaction.user.id, message_id : message.id, channel : message.channel.id};
					firebase_web_firestore_Firestore.runTransaction(firebase_web_firestore_Firestore.getFirestore(firebase_web_app_FirebaseApp.getApp()),function(transaction) {
						return transaction.get(firebase_web_firestore_Firestore.doc(firebase_web_firestore_Firestore.getFirestore(firebase_web_app_FirebaseApp.getApp()),"discord/polls")).then(function(doc) {
							if(!doc.exists()) {
								return { id : -1};
							}
							var data = doc.data();
							data.id += 1;
							transaction.update(doc.ref,data);
							return data;
						});
					}).then(function(value) {
						data.id = value.id;
						firebase_web_firestore_Firestore.addDoc(firebase_web_firestore_Firestore.collection(firebase_web_firestore_Firestore.getFirestore(firebase_web_app_FirebaseApp.getApp()),"discord/polls/entries"),data).then(function(_) {
							_gthis.addCollector(message,data);
						},function(err) {
							haxe_Log.trace(err,{ fileName : "src/commands/Poll.hx", lineNumber : 164, className : "commands.Poll", methodName : "run"});
							$global.console.dir(err);
						});
					},function(err) {
						haxe_Log.trace(err,{ fileName : "src/commands/Poll.hx", lineNumber : 168, className : "commands.Poll", methodName : "run"});
						$global.console.dir(err);
					});
				}).then(null,function(err) {
					haxe_Log.trace(err,{ fileName : "src/commands/Poll.hx", lineNumber : 172, className : "commands.Poll", methodName : "run"});
					$global.console.dir(err);
				});
			},function(err) {
				haxe_Log.trace(err,{ fileName : "src/commands/Poll.hx", lineNumber : 176, className : "commands.Poll", methodName : "run"});
				$global.console.dir(err);
			});
		}
	}
	,addCollector: function(message,data,time_left) {
		var filter = this.filter(message,data);
		var time = data.duration;
		if(time_left != null) {
			time = time_left;
		}
		var collector = message.createReactionCollector({ filter : filter, time : time});
		collector.on("collect",function(reaction,user) {
		});
		collector.on("end",function(collected,reason) {
			var embed = new discord_$js_MessageEmbed();
			var body = "**Question**\n" + data.question + "\n**Results**\n";
			var options = commands_PollData.get_answers(data);
			var sort = message.reactions.cache.sort(function(a,b,_,_1) {
				return b.count - a.count;
			});
			var jsIterator = sort.entries();
			var _g_lastStep = jsIterator.next();
			while(!_g_lastStep.done) {
				var v = _g_lastStep.value;
				_g_lastStep = jsIterator.next();
				var _g_key = v[0];
				var _g_value = v[1];
				var col = sort.get(_g_key);
				var ans = options.h[_g_key];
				var count = 0;
				if(col != null) {
					count = _g_value.count;
				}
				body += "" + _g_key + " / " + ans + " /  **" + (count - 1) + "** \n";
			}
			var tmp = data.duration;
			body += "\n*Poll ran for " + (tmp == null ? "null" : commands_PollTime.toString(tmp)) + "*";
			body += "\n*Posted: <t:" + Math.round(message.createdTimestamp / 1000) + ":R>*";
			embed.setDescription(body);
			message.reply({ content : "<@" + data.author + ">", embeds : [embed]}).then(function(_) {
				var query = firebase_web_firestore_Firestore.query(firebase_web_firestore_Firestore.collection(firebase_web_firestore_Firestore.getFirestore(firebase_web_app_FirebaseApp.getApp()),"discord/polls/entries"),firebase_web_firestore_Firestore.where("id","==",data.id));
				firebase_web_firestore_Firestore.getDocs(query).then(function(res) {
					if(res.docs.length == 0) {
						return;
					}
					firebase_web_firestore_Firestore.updateDoc(res.docs[0].ref,"active",false);
				});
			});
		});
	}
	,get_name: function() {
		return "poll";
	}
	,filter: function(message,data) {
		var reactions = commands_PollData.get_answers(data);
		var rcount = 0;
		var h = reactions.h;
		var __keys = Object.keys(h);
		var __length = __keys.length;
		var __current = 0;
		while(__current < __length) {
			++__current;
			rcount += 1;
		}
		var vvotes = commands_PollData.get_settings(data).h[0];
		var filter = function(reaction,user) {
			var votes = 0;
			var jsIterator = message.reactions.cache.values();
			var _g_lastStep = jsIterator.next();
			while(!_g_lastStep.done) {
				var v = _g_lastStep.value;
				_g_lastStep = jsIterator.next();
				var jsIterator1 = v.users.cache.values();
				var _g_lastStep1 = jsIterator1.next();
				while(!_g_lastStep1.done) {
					var v1 = _g_lastStep1.value;
					_g_lastStep1 = jsIterator1.next();
					if(v1.id == user.id && !v1.bot) {
						++votes;
					}
				}
			}
			if(votes > vvotes) {
				if(!user.bot) {
					reaction.users.remove(user);
				}
			}
			if(reaction.emoji.name == "🇦" && rcount >= 1) {
				return true;
			}
			if(reaction.emoji.name == "🇧" && rcount >= 2) {
				return true;
			}
			if(reaction.emoji.name == "🇨" && rcount >= 3) {
				return true;
			}
			if(reaction.emoji.name == "🇩" && rcount >= 4) {
				return true;
			}
			if(reaction.emoji.name == "🇪" && rcount >= 5) {
				return true;
			}
			if(reaction.emoji.name == "🇫" && rcount >= 6) {
				return true;
			}
			if(reaction.emoji.name == "🇬" && rcount >= 7) {
				return true;
			}
			haxe_Log.trace("removed " + reaction.message.author.tag + " reaction on message " + Std.string(reaction.message),{ fileName : "src/commands/Poll.hx", lineNumber : 296, className : "commands.Poll", methodName : "filter"});
			reaction.remove();
			return false;
		};
		return filter;
	}
	,chars: function(char) {
		switch(char) {
		case 0:
			return "🇦";
		case 1:
			return "🇧";
		case 2:
			return "🇨";
		case 3:
			return "🇩";
		case 4:
			return "🇪";
		case 5:
			return "🇫";
		case 6:
			return "🇬";
		default:
			return "";
		}
	}
	,dm_messages: null
	,table87a8f92f715c03d0822a55d9b93a210d: null
	,tabled1cd3067ebd0108e92f1425a40ea7b45: null
	,__class__: commands_Poll
});
var commands_PollData = {};
commands_PollData.__properties__ = {get_settings:"get_settings",get_results:"get_results",get_answers:"get_answers"};
commands_PollData.get_answers = function(this1) {
	return JSON.parse(this1.answers);
};
commands_PollData.get_results = function(this1) {
	return JSON.parse(this1.results);
};
commands_PollData.get_settings = function(this1) {
	return JSON.parse(this1.settings);
};
var commands_PollTime = {};
commands_PollTime._new = function(value) {
	return value;
};
commands_PollTime.fromString = function(input) {
	switch(input) {
	case "12hr":
		return 43200000;
	case "15m":
		return 900000;
	case "1d":
		return 86400000;
	case "1hr":
		return 3600000;
	case "1w":
		return 604800000;
	case "2w":
		return 1210000000;
	case "30m":
		return 1800000;
	case "3d":
		return 259200000;
	case "4hr":
		return 14400000;
	case "5d":
		return 432000000;
	case "8hr":
		return 28800000;
	default:
		return 3600000;
	}
};
commands_PollTime.toString = function(this1) {
	switch(this1) {
	case 900000:
		return "15mins";
	case 1800000:
		return "30mins";
	case 3600000:
		return "1 hour";
	case 14400000:
		return "4 hours";
	case 28800000:
		return "8 hours";
	case 43200000:
		return "12 hours";
	case 86400000:
		return "1 day";
	case 259200000:
		return "3 days";
	case 432000000:
		return "5 days";
	case 604800000:
		return "1 week";
	case 1210000000:
		return "2 weeks";
	default:
		return "1 hour";
	}
};
var commands_Quote = function(_universe) {
	this.max_name_length = 35;
	this.cache = new haxe_ds_StringMap();
	systems_CommandDbBase.call(this,_universe);
	this.modal = this.universe.families.get(7);
	this.table87a8f92f715c03d0822a55d9b93a210d = this.universe.components.getTable(5);
};
$hxClasses["commands.Quote"] = commands_Quote;
commands_Quote.__name__ = "commands.Quote";
commands_Quote.__super__ = systems_CommandDbBase;
commands_Quote.prototype = $extend(systems_CommandDbBase.prototype,{
	cache: null
	,max_name_length: null
	,onEnabled: function() {
		this.has_subcommands = true;
	}
	,update: function(_) {
		var _gthis = this;
		systems_CommandDbBase.prototype.update.call(this,_);
		var _this = this.modal;
		var _set = _this.entities;
		var _g_set = _set;
		var _g_active = _this.isActive();
		var _g_idx = _set.size() - 1;
		while(_g_active && _g_idx >= 0) {
			var entity = _g_set.getDense(_g_idx--);
			var interaction = [this.table5d38588a6ddd880f90fc8234bccb893f.get(entity)];
			var forward = this.table87a8f92f715c03d0822a55d9b93a210d.get(entity);
			switch(forward) {
			case "quote_edit":
				var quote = [this.cache.h[interaction[0].user.id]];
				var title = [interaction[0].fields.getTextInputValue("title")];
				quote[0].description = interaction[0].fields.getTextInputValue("description");
				var e = database_DBEvents.GetRecord("quotes",QueryExpr.QueryBinop(QBinop.QOpBoolAnd,QueryExpr.QueryBinop(QBinop.QOpEq,QueryExpr.QueryConstant(QConstant.QIdent("title")),QueryExpr.QueryValue(title[0])),QueryExpr.QueryBinop(QBinop.QOpEq,QueryExpr.QueryConstant(QConstant.QIdent("author_id")),QueryExpr.QueryValue(interaction[0].user.id))),(function(title,quote,interaction) {
					return function(resp) {
						if(resp._hx_index == 1) {
							var data = resp.data;
							haxe_Log.trace(title[0],{ fileName : "src/commands/Quote.hx", lineNumber : 73, className : "commands.Quote", methodName : "update"});
							haxe_Log.trace(quote[0].title,{ fileName : "src/commands/Quote.hx", lineNumber : 74, className : "commands.Quote", methodName : "update"});
							if(data != null && title[0] != quote[0].title) {
								interaction[0].reply("You already have a quote with the title **__" + title[0] + "__**").then(null,(function() {
									return function(err) {
										haxe_Log.trace(err,{ fileName : "src/commands/Quote.hx", lineNumber : 80, className : "commands.Quote", methodName : "update"});
										$global.console.dir(err);
									};
								})());
								return;
							}
							quote[0].title = title[0].toLowerCase();
							var e = database_DBEvents.Update("quotes",quote[0].get_record(),QueryExpr.QueryBinop(QBinop.QOpBoolAnd,QueryExpr.QueryBinop(QBinop.QOpEq,QueryExpr.QueryConstant(QConstant.QIdent("id")),QueryExpr.QueryValue(quote[0].id)),QueryExpr.QueryBinop(QBinop.QOpEq,QueryExpr.QueryConstant(QConstant.QIdent("author_id")),QueryExpr.QueryValue(quote[0].author_id))),(function(interaction) {
								return function(resp) {
									if(resp._hx_index == 4) {
										var message = resp.message;
										haxe_Log.trace("" + message,{ fileName : "src/commands/Quote.hx", lineNumber : 93, className : "commands.Quote", methodName : "update"});
										interaction[0].reply("Quote updated!");
									} else {
										haxe_Log.trace(_gthis.cache.h[interaction[0].user.id],{ fileName : "src/commands/Quote.hx", lineNumber : 96, className : "commands.Quote", methodName : "update"});
										interaction[0].reply("Something went wrong");
										haxe_Log.trace(resp,{ fileName : "src/commands/Quote.hx", lineNumber : 98, className : "commands.Quote", methodName : "update"});
									}
									var key = interaction[0].user.id;
									var _this = _gthis.cache;
									if(Object.prototype.hasOwnProperty.call(_this.h,key)) {
										delete(_this.h[key]);
									}
								};
							})(interaction));
							var entity = util_EcsTools.get_universe().createEntity();
							var _ecsTmpEntity = entity;
							util_EcsTools.get_universe().components.set(_ecsTmpEntity,2,e);
							var ecsEntCompFlags = util_EcsTools.get_universe().components.flags[ecs_Entity.id(_ecsTmpEntity)];
							var ecsTmpFamily = util_EcsTools.get_universe().families.get(1);
							if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
								ecsTmpFamily.add(_ecsTmpEntity);
							}
						} else {
							haxe_Log.trace(resp,{ fileName : "src/commands/Quote.hx", lineNumber : 105, className : "commands.Quote", methodName : "update"});
						}
					};
				})(title,quote,interaction));
				var entity1 = util_EcsTools.get_universe().createEntity();
				var _ecsTmpEntity = entity1;
				util_EcsTools.get_universe().components.set(_ecsTmpEntity,2,e);
				var ecsEntCompFlags = util_EcsTools.get_universe().components.flags[ecs_Entity.id(_ecsTmpEntity)];
				var ecsTmpFamily = util_EcsTools.get_universe().families.get(1);
				if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
					ecsTmpFamily.add(_ecsTmpEntity);
				}
				break;
			case "quote_set":
				var id = interaction[0].user.id;
				var name = interaction[0].user.username;
				var title1 = interaction[0].fields.getTextInputValue("name");
				var description = [interaction[0].fields.getTextInputValue("description")];
				var quote1 = [new database_types_DBQuote(id,name,title1,description[0])];
				if(!this.isValidName(name)) {
					interaction[0].reply({ content : "*Names can only contain `_-.?:` and/or spaces.*\nname: " + name + "\n" + description[0], ephemeral : true});
					return;
				}
				var e1 = database_DBEvents.Insert("quotes",quote1[0].get_record(),(function(quote,description,interaction) {
					return function(resp) {
						if(resp._hx_index == 4) {
							var message = resp.message;
							var data = resp.data;
							haxe_Log.trace(message,{ fileName : "src/commands/Quote.hx", lineNumber : 51, className : "commands.Quote", methodName : "update"});
							quote[0] = database_types_DBQuote.fromRecord(data);
							var embed = new discord_$js_MessageEmbed();
							embed.setTitle("Quote #" + quote[0].id + " added!");
							embed.setDescription("**" + quote[0].title + "**\n" + description[0]);
							interaction[0].reply({ embeds : [embed]});
						} else {
							interaction[0].reply("Something went wrong, try again later").then(null,(function() {
								return function(err) {
									haxe_Log.trace(err,{ fileName : "src/commands/Quote.hx", lineNumber : 59, className : "commands.Quote", methodName : "update"});
								};
							})());
							haxe_Log.trace(resp,{ fileName : "src/commands/Quote.hx", lineNumber : 60, className : "commands.Quote", methodName : "update"});
							haxe_Log.trace(quote[0],{ fileName : "src/commands/Quote.hx", lineNumber : 61, className : "commands.Quote", methodName : "update"});
						}
					};
				})(quote1,description,interaction));
				var entity2 = util_EcsTools.get_universe().createEntity();
				var _ecsTmpEntity1 = entity2;
				util_EcsTools.get_universe().components.set(_ecsTmpEntity1,2,e1);
				var ecsEntCompFlags1 = util_EcsTools.get_universe().components.flags[ecs_Entity.id(_ecsTmpEntity1)];
				var ecsTmpFamily1 = util_EcsTools.get_universe().families.get(1);
				if(bits_Bits.areSet(ecsEntCompFlags1,ecsTmpFamily1.componentsMask)) {
					ecsTmpFamily1.add(_ecsTmpEntity1);
				}
				break;
			default:
			}
			if(forward == "quote_set" || forward == "quote_edit") {
				this.universe.deleteEntity(entity);
			}
		}
	}
	,parseGroupQuotes: function(interaction,value) {
		if(value._hx_index == 2) {
			var _gdata = value.data;
			if(_gdata.get_length() == 0) {
				interaction.reply("No quotes by that user!");
				return;
			}
			var embed = new discord_$js_MessageEmbed();
			embed.setTitle("List of Quotes");
			var body = "";
			var item = _gdata.iterator();
			while(item.hasNext()) {
				var item1 = item.next();
				var quote = database_types_DBQuote.fromRecord(item1);
				body += "**#" + quote.id + "** " + quote.title + " by <@" + quote.author_id + "> \n";
			}
			embed.setDescription(body);
			embed.setColor(15368736);
			interaction.reply({ embeds : [embed]}).then(null,function(err) {
				haxe_Log.trace(err,{ fileName : "src/commands/Quote.hx", lineNumber : 135, className : "commands.Quote", methodName : "parseGroupQuotes"});
			});
		} else {
			haxe_Log.trace(value,{ fileName : "src/commands/Quote.hx", lineNumber : 137, className : "commands.Quote", methodName : "parseGroupQuotes"});
		}
	}
	,run: function(command,interaction) {
		var _gthis = this;
		var _g = command.content;
		switch(_g._hx_index) {
		case 32:
			var user = _g.user;
			firebase_web_firestore_Firestore.orderBy("id","asc");
			var _g1 = this;
			var interaction1 = interaction;
			var e = database_DBEvents.GetAllRecords("quotes",function(value) {
				_g1.parseGroupQuotes(interaction1,value);
			});
			if(user != null) {
				var _g2 = this;
				var interaction2 = interaction;
				var e1 = function(value) {
					_g2.parseGroupQuotes(interaction2,value);
				};
				e = database_DBEvents.GetRecords("quotes",QueryExpr.QueryBinop(QBinop.QOpEq,QueryExpr.QueryConstant(QConstant.QIdent("author_id")),QueryExpr.QueryValue(user.id)),e1);
			}
			var entity = util_EcsTools.get_universe().createEntity();
			var _ecsTmpEntity = entity;
			util_EcsTools.get_universe().components.set(_ecsTmpEntity,2,e);
			var ecsEntCompFlags = util_EcsTools.get_universe().components.flags[ecs_Entity.id(_ecsTmpEntity)];
			var ecsTmpFamily = util_EcsTools.get_universe().families.get(1);
			if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
				ecsTmpFamily.add(_ecsTmpEntity);
			}
			break;
		case 33:
			var name = _g.name;
			var type = "get";
			var e = command.content;
			var enum_name = $hxEnums[e.__enum__].__constructs__[e._hx_index]._hx_name.toLowerCase();
			if(enum_name.indexOf("get") != -1) {
				type = "get";
			}
			if(enum_name.indexOf("create") != -1) {
				type = "set";
			}
			if(enum_name.indexOf("delete") != -1) {
				type = "delete";
			}
			if(enum_name.indexOf("edit") != -1) {
				type = "edit";
			}
			var column = "id";
			if(name == null) {
				name = "";
			}
			if(this.isName(name) && type != "get") {
				if(name.length < 2) {
					if(interaction.isAutocomplete()) {
						interaction.respond([]);
					}
					return;
				}
				if(this.isValidName(name)) {
					column = "name";
					name = name.toLowerCase();
				}
			}
			var col = firebase_web_firestore_Firestore.collection(firebase_web_firestore_Firestore.getFirestore(firebase_web_app_FirebaseApp.getApp()),"discord/quotes/entries");
			firebase_web_firestore_Firestore.query(col,firebase_web_firestore_Firestore.where(column,"==",this.isName(name) ? name : Std.parseInt(name)),firebase_web_firestore_Firestore.where("author","==",interaction.user.id));
			var column = "title";
			if(this.isId(name)) {
				column = "id";
			}
			if(interaction.isAutocomplete() && type != "get") {
				var e = database_DBEvents.SearchBy("quotes",column,name,"author_id",interaction.user.id,function(resp) {
					if(resp._hx_index == 2) {
						var data = resp.data;
						var res = [];
						var r = data.iterator();
						while(r.hasNext()) {
							var r1 = r.next();
							var quote = database_types_DBQuote.fromRecord(r1);
							var name1 = quote.title;
							if(name1.length > 25) {
								name1 = HxOverrides.substr(name1,0,25) + "...";
							}
							res.push({ name : "" + name1 + " - " + HxOverrides.substr(quote.description,0,25) + ("... by " + quote.author_tag), value : "" + quote.id});
						}
						haxe_Log.trace(name,{ fileName : "src/commands/Quote.hx", lineNumber : 215, className : "commands.Quote", methodName : "run"});
						if(!interaction.responded) {
							interaction.respond(res).then(null,function(err) {
								haxe_Log.trace(err,{ fileName : "src/commands/Quote.hx", lineNumber : 218, className : "commands.Quote", methodName : "run"});
								$global.console.dir(err);
							});
						}
					} else {
						haxe_Log.trace(resp,{ fileName : "src/commands/Quote.hx", lineNumber : 223, className : "commands.Quote", methodName : "run"});
					}
				});
				var entity = util_EcsTools.get_universe().createEntity();
				var _ecsTmpEntity = entity;
				util_EcsTools.get_universe().components.set(_ecsTmpEntity,2,e);
				var ecsEntCompFlags = util_EcsTools.get_universe().components.flags[ecs_Entity.id(_ecsTmpEntity)];
				var ecsTmpFamily = util_EcsTools.get_universe().families.get(1);
				if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
					ecsTmpFamily.add(_ecsTmpEntity);
				}
				return;
			}
			switch(type) {
			case "delete":
				var record = new db_Record();
				record.field("author_id",interaction.user.id);
				record.field("id",name);
				var e = database_DBEvents.DeleteRecord("quotes",record,function(resp) {
					switch(resp._hx_index) {
					case 4:
						interaction.reply("Quote deleted!").then(null,function(err) {
							haxe_Log.trace(err,{ fileName : "src/commands/Quote.hx", lineNumber : 344, className : "commands.Quote", methodName : "run"});
						});
						break;
					case 5:
						var message = resp.message;
						var data = resp.data;
						haxe_Log.trace(message,{ fileName : "src/commands/Quote.hx", lineNumber : 346, className : "commands.Quote", methodName : "run"});
						haxe_Log.trace(data == null ? "null" : Std.string(data),{ fileName : "src/commands/Quote.hx", lineNumber : 347, className : "commands.Quote", methodName : "run"});
						interaction.reply("Cannot delete this quote").then(null,function(err) {
							haxe_Log.trace(err,{ fileName : "src/commands/Quote.hx", lineNumber : 350, className : "commands.Quote", methodName : "run"});
							$global.console.dir(err);
						});
						break;
					default:
						haxe_Log.trace(resp,{ fileName : "src/commands/Quote.hx", lineNumber : 354, className : "commands.Quote", methodName : "run"});
					}
				});
				var entity = util_EcsTools.get_universe().createEntity();
				var _ecsTmpEntity = entity;
				util_EcsTools.get_universe().components.set(_ecsTmpEntity,2,e);
				var ecsEntCompFlags = util_EcsTools.get_universe().components.flags[ecs_Entity.id(_ecsTmpEntity)];
				var ecsTmpFamily = util_EcsTools.get_universe().families.get(1);
				if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
					ecsTmpFamily.add(_ecsTmpEntity);
				}
				break;
			case "edit":
				var e = database_DBEvents.GetRecord("quotes",QueryExpr.QueryBinop(QBinop.QOpBoolAnd,QueryExpr.QueryBinop(QBinop.QOpEq,QueryExpr.QueryConstant(QConstant.QIdent("id")),QueryExpr.QueryValue(name)),QueryExpr.QueryBinop(QBinop.QOpEq,QueryExpr.QueryConstant(QConstant.QIdent("author_id")),QueryExpr.QueryValue(interaction.user.id))),function(resp) {
					if(resp._hx_index == 1) {
						var data = resp.data;
						if(data == null) {
							interaction.reply("Could not find quote or you were not the author of the quote specified");
							return;
						}
						var quote = database_types_DBQuote.fromRecord(data);
						var modal = new discord_$builder_ModalBuilder().setCustomId("quote_edit").setTitle("Editting quote #" + quote.id);
						var title_input = new discord_$builder_APITextInputComponent().setCustomId("title").setLabel("title").setStyle(1).setValue(quote.title.toLowerCase()).setMinLength(3).setMaxLength(_gthis.max_name_length);
						var desc_input = new discord_$builder_APITextInputComponent().setCustomId("description").setLabel("" + quote.title + ":").setStyle(2).setValue(quote.description).setMinLength(10).setMaxLength(2000);
						var action_a = new discord_$builder_APIActionRowComponent().addComponents(title_input);
						var action_b = new discord_$builder_APIActionRowComponent().addComponents(desc_input);
						modal.addComponents(action_a,action_b);
						_gthis.cache.h[interaction.user.id] = quote;
						interaction.showModal(modal);
					} else {
						haxe_Log.trace(resp,{ fileName : "src/commands/Quote.hx", lineNumber : 330, className : "commands.Quote", methodName : "run"});
					}
				});
				var entity = util_EcsTools.get_universe().createEntity();
				var _ecsTmpEntity = entity;
				util_EcsTools.get_universe().components.set(_ecsTmpEntity,2,e);
				var ecsEntCompFlags = util_EcsTools.get_universe().components.flags[ecs_Entity.id(_ecsTmpEntity)];
				var ecsTmpFamily = util_EcsTools.get_universe().families.get(1);
				if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
					ecsTmpFamily.add(_ecsTmpEntity);
				}
				break;
			case "get":
				if(name != null) {
					var qid = Std.parseInt(name);
					if(interaction.isAutocomplete()) {
						var results = [];
						var e = null;
						if(name != null && name.length > 0) {
							if(qid != null && qid > 0) {
								e = database_DBEvents.GetRecord("quotes",QueryExpr.QueryBinop(QBinop.QOpEq,QueryExpr.QueryConstant(QConstant.QIdent("id")),QueryExpr.QueryValue(qid)),function(response) {
									haxe_Log.trace(name,{ fileName : "src/commands/Quote.hx", lineNumber : 369, className : "commands.Quote", methodName : "run"});
									if(response._hx_index == 1) {
										var data = response.data;
										if(data == null) {
											interaction.respond([]);
											return;
										}
										var quote = database_types_DBQuote.fromRecord(data);
										var name1 = quote.title;
										if(name1.length > 25) {
											name1 = HxOverrides.substr(name1,0,25) + "...";
										}
										results.push({ name : "" + name1 + " - " + HxOverrides.substr(quote.description,0,25) + ("... by " + quote.author_tag), value : "" + quote.id});
										interaction.respond(results).then(null,function(err) {
											haxe_Log.trace(err,{ fileName : "src/commands/Quote.hx", lineNumber : 383, className : "commands.Quote", methodName : "run"});
											$global.console.dir(err);
										});
									} else {
										haxe_Log.trace(response,{ fileName : "src/commands/Quote.hx", lineNumber : 387, className : "commands.Quote", methodName : "run"});
									}
								});
							} else {
								e = database_DBEvents.Search("quotes","title",name,function(response) {
									if(response._hx_index == 2) {
										var data = response.data;
										var item = data.iterator();
										while(item.hasNext()) {
											var item1 = item.next();
											var quote = database_types_DBQuote.fromRecord(item1);
											var name = quote.title;
											if(name.length > 25) {
												name = HxOverrides.substr(name,0,25) + "...";
											}
											results.push({ name : "" + name + " - " + HxOverrides.substr(quote.description,0,25) + ("... by " + quote.author_tag), value : "" + quote.id});
										}
										interaction.respond(results).then(null,function(err) {
											haxe_Log.trace(err,{ fileName : "src/commands/Quote.hx", lineNumber : 405, className : "commands.Quote", methodName : "run"});
											$global.console.dir(err);
										});
									} else {
										haxe_Log.trace(response,{ fileName : "src/commands/Quote.hx", lineNumber : 409, className : "commands.Quote", methodName : "run"});
									}
								});
							}
							var _ecsTmpEntity = this.universe.createEntity();
							this.universe.components.set(_ecsTmpEntity,2,e);
							var ecsEntCompFlags = this.universe.components.flags[ecs_Entity.id(_ecsTmpEntity)];
							var ecsTmpFamily = this.universe.families.get(1);
							if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
								ecsTmpFamily.add(_ecsTmpEntity);
							}
							return;
						} else {
							interaction.respond([]).then(null,function(err) {
								haxe_Log.trace(err,{ fileName : "src/commands/Quote.hx", lineNumber : 417, className : "commands.Quote", methodName : "run"});
								$global.console.dir(err);
							});
							return;
						}
					}
					var e = database_DBEvents.GetRecord("quotes",QueryExpr.QueryBinop(QBinop.QOpEq,QueryExpr.QueryConstant(QConstant.QIdent("id")),QueryExpr.QueryValue(name)),function(resp) {
						if(resp._hx_index == 1) {
							var data = resp.data;
							if(data == null) {
								interaction.reply("Could not find any quotes with that identifier").then(null,function(err) {
									haxe_Log.trace(err,{ fileName : "src/commands/Quote.hx", lineNumber : 431, className : "commands.Quote", methodName : "run"});
								});
								return;
							}
							var q = database_types_DBQuote.fromRecord(data);
							var embed = new discord_$js_MessageEmbed();
							var user = interaction.client.users.cache.get(q.author_id);
							var from = new Date(q.timestamp);
							var date = DateTools.format(from,"%H:%M %d-%m-%Y");
							var icon = "https://cdn.discordapp.com/emojis/567741748172816404.webp?size=96&quality=lossless";
							var content = q.author_tag;
							if(user != null) {
								icon = user.avatarURL();
								content = q.author_tag;
							}
							embed.setDescription("***" + q.title + "***\n" + q.description);
							embed.setFooter({ text : "" + content + " | " + date + " |\t#" + q.id, iconURL : icon});
							interaction.reply({ embeds : [embed]}).then(null,function(err) {
								haxe_Log.trace(err,{ fileName : "src/commands/Quote.hx", lineNumber : 456, className : "commands.Quote", methodName : "run"});
								$global.console.dir(err);
							});
						} else {
							haxe_Log.trace(resp,{ fileName : "src/commands/Quote.hx", lineNumber : 460, className : "commands.Quote", methodName : "run"});
						}
					});
					var entity = util_EcsTools.get_universe().createEntity();
					var _ecsTmpEntity = entity;
					util_EcsTools.get_universe().components.set(_ecsTmpEntity,2,e);
					var ecsEntCompFlags = util_EcsTools.get_universe().components.flags[ecs_Entity.id(_ecsTmpEntity)];
					var ecsTmpFamily = util_EcsTools.get_universe().families.get(1);
					if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
						ecsTmpFamily.add(_ecsTmpEntity);
					}
				}
				break;
			case "set":
				var is_id = this.isId(name);
				if(!is_id && !this.isValidName(name)) {
					var error_msg = "name can only be 3-" + this.max_name_length + " characters long";
					if(name.length < this.max_name_length) {
						error_msg = "*Names can only contain `_.-?` and/or spaces.*";
					}
					interaction.reply({ content : error_msg, ephemeral : true});
					return;
				}
				var column = is_id ? "id" : "title";
				var e = database_DBEvents.Search("quotes",column,name,function(resp) {
					if(resp._hx_index == 2) {
						var data = resp.data;
						if(data.get_length() >= 1) {
							var interaction1 = interaction;
							var tmp = data.records[0].field("title");
							interaction1.reply("You already have a quote with the title __" + (tmp == null ? "null" : Std.string(tmp)) + "__").then(null,function(err) {
								haxe_Log.trace(err,{ fileName : "src/commands/Quote.hx", lineNumber : 252, className : "commands.Quote", methodName : "run"});
								$global.console.dir(err);
							});
							return;
						}
						var modal = new discord_$builder_ModalBuilder().setCustomId("quote_set").setTitle("Creating a quote");
						var title_input = new discord_$builder_APITextInputComponent().setCustomId("name").setLabel("title").setStyle(1).setValue(name.toLowerCase()).setMinLength(3).setMaxLength(_gthis.max_name_length);
						var desc_input = new discord_$builder_APITextInputComponent().setCustomId("description").setLabel("description").setStyle(2).setMinLength(10).setMaxLength(2000);
						var action_a = new discord_$builder_APIActionRowComponent().addComponents(title_input);
						var action_b = new discord_$builder_APIActionRowComponent().addComponents(desc_input);
						modal.addComponents(action_a,action_b);
						interaction.showModal(modal);
					} else {
						haxe_Log.trace(resp,{ fileName : "src/commands/Quote.hx", lineNumber : 283, className : "commands.Quote", methodName : "run"});
					}
				});
				var entity = util_EcsTools.get_universe().createEntity();
				var _ecsTmpEntity = entity;
				util_EcsTools.get_universe().components.set(_ecsTmpEntity,2,e);
				var ecsEntCompFlags = util_EcsTools.get_universe().components.flags[ecs_Entity.id(_ecsTmpEntity)];
				var ecsTmpFamily = util_EcsTools.get_universe().families.get(1);
				if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
					ecsTmpFamily.add(_ecsTmpEntity);
				}
				break;
			default:
				if(name != null) {
					var qid = Std.parseInt(name);
					if(interaction.isAutocomplete()) {
						var results1 = [];
						var e = null;
						if(name != null && name.length > 0) {
							if(qid != null && qid > 0) {
								e = database_DBEvents.GetRecord("quotes",QueryExpr.QueryBinop(QBinop.QOpEq,QueryExpr.QueryConstant(QConstant.QIdent("id")),QueryExpr.QueryValue(qid)),function(response) {
									haxe_Log.trace(name,{ fileName : "src/commands/Quote.hx", lineNumber : 369, className : "commands.Quote", methodName : "run"});
									if(response._hx_index == 1) {
										var data = response.data;
										if(data == null) {
											interaction.respond([]);
											return;
										}
										var quote = database_types_DBQuote.fromRecord(data);
										var name1 = quote.title;
										if(name1.length > 25) {
											name1 = HxOverrides.substr(name1,0,25) + "...";
										}
										results1.push({ name : "" + name1 + " - " + HxOverrides.substr(quote.description,0,25) + ("... by " + quote.author_tag), value : "" + quote.id});
										interaction.respond(results1).then(null,function(err) {
											haxe_Log.trace(err,{ fileName : "src/commands/Quote.hx", lineNumber : 383, className : "commands.Quote", methodName : "run"});
											$global.console.dir(err);
										});
									} else {
										haxe_Log.trace(response,{ fileName : "src/commands/Quote.hx", lineNumber : 387, className : "commands.Quote", methodName : "run"});
									}
								});
							} else {
								e = database_DBEvents.Search("quotes","title",name,function(response) {
									if(response._hx_index == 2) {
										var data = response.data;
										var item = data.iterator();
										while(item.hasNext()) {
											var item1 = item.next();
											var quote = database_types_DBQuote.fromRecord(item1);
											var name = quote.title;
											if(name.length > 25) {
												name = HxOverrides.substr(name,0,25) + "...";
											}
											results1.push({ name : "" + name + " - " + HxOverrides.substr(quote.description,0,25) + ("... by " + quote.author_tag), value : "" + quote.id});
										}
										interaction.respond(results1).then(null,function(err) {
											haxe_Log.trace(err,{ fileName : "src/commands/Quote.hx", lineNumber : 405, className : "commands.Quote", methodName : "run"});
											$global.console.dir(err);
										});
									} else {
										haxe_Log.trace(response,{ fileName : "src/commands/Quote.hx", lineNumber : 409, className : "commands.Quote", methodName : "run"});
									}
								});
							}
							var _ecsTmpEntity = this.universe.createEntity();
							this.universe.components.set(_ecsTmpEntity,2,e);
							var ecsEntCompFlags = this.universe.components.flags[ecs_Entity.id(_ecsTmpEntity)];
							var ecsTmpFamily = this.universe.families.get(1);
							if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
								ecsTmpFamily.add(_ecsTmpEntity);
							}
							return;
						} else {
							interaction.respond([]).then(null,function(err) {
								haxe_Log.trace(err,{ fileName : "src/commands/Quote.hx", lineNumber : 417, className : "commands.Quote", methodName : "run"});
								$global.console.dir(err);
							});
							return;
						}
					}
					var e = database_DBEvents.GetRecord("quotes",QueryExpr.QueryBinop(QBinop.QOpEq,QueryExpr.QueryConstant(QConstant.QIdent("id")),QueryExpr.QueryValue(name)),function(resp) {
						if(resp._hx_index == 1) {
							var data = resp.data;
							if(data == null) {
								interaction.reply("Could not find any quotes with that identifier").then(null,function(err) {
									haxe_Log.trace(err,{ fileName : "src/commands/Quote.hx", lineNumber : 431, className : "commands.Quote", methodName : "run"});
								});
								return;
							}
							var q = database_types_DBQuote.fromRecord(data);
							var embed = new discord_$js_MessageEmbed();
							var user = interaction.client.users.cache.get(q.author_id);
							var from = new Date(q.timestamp);
							var date = DateTools.format(from,"%H:%M %d-%m-%Y");
							var icon = "https://cdn.discordapp.com/emojis/567741748172816404.webp?size=96&quality=lossless";
							var content = q.author_tag;
							if(user != null) {
								icon = user.avatarURL();
								content = q.author_tag;
							}
							embed.setDescription("***" + q.title + "***\n" + q.description);
							embed.setFooter({ text : "" + content + " | " + date + " |\t#" + q.id, iconURL : icon});
							interaction.reply({ embeds : [embed]}).then(null,function(err) {
								haxe_Log.trace(err,{ fileName : "src/commands/Quote.hx", lineNumber : 456, className : "commands.Quote", methodName : "run"});
								$global.console.dir(err);
							});
						} else {
							haxe_Log.trace(resp,{ fileName : "src/commands/Quote.hx", lineNumber : 460, className : "commands.Quote", methodName : "run"});
						}
					});
					var entity = util_EcsTools.get_universe().createEntity();
					var _ecsTmpEntity = entity;
					util_EcsTools.get_universe().components.set(_ecsTmpEntity,2,e);
					var ecsEntCompFlags = util_EcsTools.get_universe().components.flags[ecs_Entity.id(_ecsTmpEntity)];
					var ecsTmpFamily = util_EcsTools.get_universe().families.get(1);
					if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
						ecsTmpFamily.add(_ecsTmpEntity);
					}
				}
			}
			break;
		case 34:
			var name1 = _g.name;
			var type = "get";
			var e = command.content;
			var enum_name = $hxEnums[e.__enum__].__constructs__[e._hx_index]._hx_name.toLowerCase();
			if(enum_name.indexOf("get") != -1) {
				type = "get";
			}
			if(enum_name.indexOf("create") != -1) {
				type = "set";
			}
			if(enum_name.indexOf("delete") != -1) {
				type = "delete";
			}
			if(enum_name.indexOf("edit") != -1) {
				type = "edit";
			}
			var column = "id";
			if(name1 == null) {
				name1 = "";
			}
			if(this.isName(name1) && type != "get") {
				if(name1.length < 2) {
					if(interaction.isAutocomplete()) {
						interaction.respond([]);
					}
					return;
				}
				if(this.isValidName(name1)) {
					column = "name";
					name1 = name1.toLowerCase();
				}
			}
			var col = firebase_web_firestore_Firestore.collection(firebase_web_firestore_Firestore.getFirestore(firebase_web_app_FirebaseApp.getApp()),"discord/quotes/entries");
			firebase_web_firestore_Firestore.query(col,firebase_web_firestore_Firestore.where(column,"==",this.isName(name1) ? name1 : Std.parseInt(name1)),firebase_web_firestore_Firestore.where("author","==",interaction.user.id));
			var column = "title";
			if(this.isId(name1)) {
				column = "id";
			}
			if(interaction.isAutocomplete() && type != "get") {
				var e = database_DBEvents.SearchBy("quotes",column,name1,"author_id",interaction.user.id,function(resp) {
					if(resp._hx_index == 2) {
						var data = resp.data;
						var res = [];
						var r = data.iterator();
						while(r.hasNext()) {
							var r1 = r.next();
							var quote = database_types_DBQuote.fromRecord(r1);
							var name = quote.title;
							if(name.length > 25) {
								name = HxOverrides.substr(name,0,25) + "...";
							}
							res.push({ name : "" + name + " - " + HxOverrides.substr(quote.description,0,25) + ("... by " + quote.author_tag), value : "" + quote.id});
						}
						haxe_Log.trace(name1,{ fileName : "src/commands/Quote.hx", lineNumber : 215, className : "commands.Quote", methodName : "run"});
						if(!interaction.responded) {
							interaction.respond(res).then(null,function(err) {
								haxe_Log.trace(err,{ fileName : "src/commands/Quote.hx", lineNumber : 218, className : "commands.Quote", methodName : "run"});
								$global.console.dir(err);
							});
						}
					} else {
						haxe_Log.trace(resp,{ fileName : "src/commands/Quote.hx", lineNumber : 223, className : "commands.Quote", methodName : "run"});
					}
				});
				var entity = util_EcsTools.get_universe().createEntity();
				var _ecsTmpEntity = entity;
				util_EcsTools.get_universe().components.set(_ecsTmpEntity,2,e);
				var ecsEntCompFlags = util_EcsTools.get_universe().components.flags[ecs_Entity.id(_ecsTmpEntity)];
				var ecsTmpFamily = util_EcsTools.get_universe().families.get(1);
				if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
					ecsTmpFamily.add(_ecsTmpEntity);
				}
				return;
			}
			switch(type) {
			case "delete":
				var record = new db_Record();
				record.field("author_id",interaction.user.id);
				record.field("id",name1);
				var e = database_DBEvents.DeleteRecord("quotes",record,function(resp) {
					switch(resp._hx_index) {
					case 4:
						interaction.reply("Quote deleted!").then(null,function(err) {
							haxe_Log.trace(err,{ fileName : "src/commands/Quote.hx", lineNumber : 344, className : "commands.Quote", methodName : "run"});
						});
						break;
					case 5:
						var message = resp.message;
						var data = resp.data;
						haxe_Log.trace(message,{ fileName : "src/commands/Quote.hx", lineNumber : 346, className : "commands.Quote", methodName : "run"});
						haxe_Log.trace(data == null ? "null" : Std.string(data),{ fileName : "src/commands/Quote.hx", lineNumber : 347, className : "commands.Quote", methodName : "run"});
						interaction.reply("Cannot delete this quote").then(null,function(err) {
							haxe_Log.trace(err,{ fileName : "src/commands/Quote.hx", lineNumber : 350, className : "commands.Quote", methodName : "run"});
							$global.console.dir(err);
						});
						break;
					default:
						haxe_Log.trace(resp,{ fileName : "src/commands/Quote.hx", lineNumber : 354, className : "commands.Quote", methodName : "run"});
					}
				});
				var entity = util_EcsTools.get_universe().createEntity();
				var _ecsTmpEntity = entity;
				util_EcsTools.get_universe().components.set(_ecsTmpEntity,2,e);
				var ecsEntCompFlags = util_EcsTools.get_universe().components.flags[ecs_Entity.id(_ecsTmpEntity)];
				var ecsTmpFamily = util_EcsTools.get_universe().families.get(1);
				if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
					ecsTmpFamily.add(_ecsTmpEntity);
				}
				break;
			case "edit":
				var e = database_DBEvents.GetRecord("quotes",QueryExpr.QueryBinop(QBinop.QOpBoolAnd,QueryExpr.QueryBinop(QBinop.QOpEq,QueryExpr.QueryConstant(QConstant.QIdent("id")),QueryExpr.QueryValue(name1)),QueryExpr.QueryBinop(QBinop.QOpEq,QueryExpr.QueryConstant(QConstant.QIdent("author_id")),QueryExpr.QueryValue(interaction.user.id))),function(resp) {
					if(resp._hx_index == 1) {
						var data = resp.data;
						if(data == null) {
							interaction.reply("Could not find quote or you were not the author of the quote specified");
							return;
						}
						var quote = database_types_DBQuote.fromRecord(data);
						var modal = new discord_$builder_ModalBuilder().setCustomId("quote_edit").setTitle("Editting quote #" + quote.id);
						var title_input = new discord_$builder_APITextInputComponent().setCustomId("title").setLabel("title").setStyle(1).setValue(quote.title.toLowerCase()).setMinLength(3).setMaxLength(_gthis.max_name_length);
						var desc_input = new discord_$builder_APITextInputComponent().setCustomId("description").setLabel("" + quote.title + ":").setStyle(2).setValue(quote.description).setMinLength(10).setMaxLength(2000);
						var action_a = new discord_$builder_APIActionRowComponent().addComponents(title_input);
						var action_b = new discord_$builder_APIActionRowComponent().addComponents(desc_input);
						modal.addComponents(action_a,action_b);
						_gthis.cache.h[interaction.user.id] = quote;
						interaction.showModal(modal);
					} else {
						haxe_Log.trace(resp,{ fileName : "src/commands/Quote.hx", lineNumber : 330, className : "commands.Quote", methodName : "run"});
					}
				});
				var entity = util_EcsTools.get_universe().createEntity();
				var _ecsTmpEntity = entity;
				util_EcsTools.get_universe().components.set(_ecsTmpEntity,2,e);
				var ecsEntCompFlags = util_EcsTools.get_universe().components.flags[ecs_Entity.id(_ecsTmpEntity)];
				var ecsTmpFamily = util_EcsTools.get_universe().families.get(1);
				if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
					ecsTmpFamily.add(_ecsTmpEntity);
				}
				break;
			case "get":
				if(name1 != null) {
					var qid = Std.parseInt(name1);
					if(interaction.isAutocomplete()) {
						var results2 = [];
						var e = null;
						if(name1 != null && name1.length > 0) {
							if(qid != null && qid > 0) {
								e = database_DBEvents.GetRecord("quotes",QueryExpr.QueryBinop(QBinop.QOpEq,QueryExpr.QueryConstant(QConstant.QIdent("id")),QueryExpr.QueryValue(qid)),function(response) {
									haxe_Log.trace(name1,{ fileName : "src/commands/Quote.hx", lineNumber : 369, className : "commands.Quote", methodName : "run"});
									if(response._hx_index == 1) {
										var data = response.data;
										if(data == null) {
											interaction.respond([]);
											return;
										}
										var quote = database_types_DBQuote.fromRecord(data);
										var name = quote.title;
										if(name.length > 25) {
											name = HxOverrides.substr(name,0,25) + "...";
										}
										results2.push({ name : "" + name + " - " + HxOverrides.substr(quote.description,0,25) + ("... by " + quote.author_tag), value : "" + quote.id});
										interaction.respond(results2).then(null,function(err) {
											haxe_Log.trace(err,{ fileName : "src/commands/Quote.hx", lineNumber : 383, className : "commands.Quote", methodName : "run"});
											$global.console.dir(err);
										});
									} else {
										haxe_Log.trace(response,{ fileName : "src/commands/Quote.hx", lineNumber : 387, className : "commands.Quote", methodName : "run"});
									}
								});
							} else {
								e = database_DBEvents.Search("quotes","title",name1,function(response) {
									if(response._hx_index == 2) {
										var data = response.data;
										var item = data.iterator();
										while(item.hasNext()) {
											var item1 = item.next();
											var quote = database_types_DBQuote.fromRecord(item1);
											var name = quote.title;
											if(name.length > 25) {
												name = HxOverrides.substr(name,0,25) + "...";
											}
											results2.push({ name : "" + name + " - " + HxOverrides.substr(quote.description,0,25) + ("... by " + quote.author_tag), value : "" + quote.id});
										}
										interaction.respond(results2).then(null,function(err) {
											haxe_Log.trace(err,{ fileName : "src/commands/Quote.hx", lineNumber : 405, className : "commands.Quote", methodName : "run"});
											$global.console.dir(err);
										});
									} else {
										haxe_Log.trace(response,{ fileName : "src/commands/Quote.hx", lineNumber : 409, className : "commands.Quote", methodName : "run"});
									}
								});
							}
							var _ecsTmpEntity = this.universe.createEntity();
							this.universe.components.set(_ecsTmpEntity,2,e);
							var ecsEntCompFlags = this.universe.components.flags[ecs_Entity.id(_ecsTmpEntity)];
							var ecsTmpFamily = this.universe.families.get(1);
							if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
								ecsTmpFamily.add(_ecsTmpEntity);
							}
							return;
						} else {
							interaction.respond([]).then(null,function(err) {
								haxe_Log.trace(err,{ fileName : "src/commands/Quote.hx", lineNumber : 417, className : "commands.Quote", methodName : "run"});
								$global.console.dir(err);
							});
							return;
						}
					}
					var e = database_DBEvents.GetRecord("quotes",QueryExpr.QueryBinop(QBinop.QOpEq,QueryExpr.QueryConstant(QConstant.QIdent("id")),QueryExpr.QueryValue(name1)),function(resp) {
						if(resp._hx_index == 1) {
							var data = resp.data;
							if(data == null) {
								interaction.reply("Could not find any quotes with that identifier").then(null,function(err) {
									haxe_Log.trace(err,{ fileName : "src/commands/Quote.hx", lineNumber : 431, className : "commands.Quote", methodName : "run"});
								});
								return;
							}
							var q = database_types_DBQuote.fromRecord(data);
							var embed = new discord_$js_MessageEmbed();
							var user = interaction.client.users.cache.get(q.author_id);
							var from = new Date(q.timestamp);
							var date = DateTools.format(from,"%H:%M %d-%m-%Y");
							var icon = "https://cdn.discordapp.com/emojis/567741748172816404.webp?size=96&quality=lossless";
							var content = q.author_tag;
							if(user != null) {
								icon = user.avatarURL();
								content = q.author_tag;
							}
							embed.setDescription("***" + q.title + "***\n" + q.description);
							embed.setFooter({ text : "" + content + " | " + date + " |\t#" + q.id, iconURL : icon});
							interaction.reply({ embeds : [embed]}).then(null,function(err) {
								haxe_Log.trace(err,{ fileName : "src/commands/Quote.hx", lineNumber : 456, className : "commands.Quote", methodName : "run"});
								$global.console.dir(err);
							});
						} else {
							haxe_Log.trace(resp,{ fileName : "src/commands/Quote.hx", lineNumber : 460, className : "commands.Quote", methodName : "run"});
						}
					});
					var entity = util_EcsTools.get_universe().createEntity();
					var _ecsTmpEntity = entity;
					util_EcsTools.get_universe().components.set(_ecsTmpEntity,2,e);
					var ecsEntCompFlags = util_EcsTools.get_universe().components.flags[ecs_Entity.id(_ecsTmpEntity)];
					var ecsTmpFamily = util_EcsTools.get_universe().families.get(1);
					if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
						ecsTmpFamily.add(_ecsTmpEntity);
					}
				}
				break;
			case "set":
				var is_id = this.isId(name1);
				if(!is_id && !this.isValidName(name1)) {
					var error_msg = "name can only be 3-" + this.max_name_length + " characters long";
					if(name1.length < this.max_name_length) {
						error_msg = "*Names can only contain `_.-?` and/or spaces.*";
					}
					interaction.reply({ content : error_msg, ephemeral : true});
					return;
				}
				var column = is_id ? "id" : "title";
				var e = database_DBEvents.Search("quotes",column,name1,function(resp) {
					if(resp._hx_index == 2) {
						var data = resp.data;
						if(data.get_length() >= 1) {
							var interaction1 = interaction;
							var tmp = data.records[0].field("title");
							interaction1.reply("You already have a quote with the title __" + (tmp == null ? "null" : Std.string(tmp)) + "__").then(null,function(err) {
								haxe_Log.trace(err,{ fileName : "src/commands/Quote.hx", lineNumber : 252, className : "commands.Quote", methodName : "run"});
								$global.console.dir(err);
							});
							return;
						}
						var modal = new discord_$builder_ModalBuilder().setCustomId("quote_set").setTitle("Creating a quote");
						var title_input = new discord_$builder_APITextInputComponent().setCustomId("name").setLabel("title").setStyle(1).setValue(name1.toLowerCase()).setMinLength(3).setMaxLength(_gthis.max_name_length);
						var desc_input = new discord_$builder_APITextInputComponent().setCustomId("description").setLabel("description").setStyle(2).setMinLength(10).setMaxLength(2000);
						var action_a = new discord_$builder_APIActionRowComponent().addComponents(title_input);
						var action_b = new discord_$builder_APIActionRowComponent().addComponents(desc_input);
						modal.addComponents(action_a,action_b);
						interaction.showModal(modal);
					} else {
						haxe_Log.trace(resp,{ fileName : "src/commands/Quote.hx", lineNumber : 283, className : "commands.Quote", methodName : "run"});
					}
				});
				var entity = util_EcsTools.get_universe().createEntity();
				var _ecsTmpEntity = entity;
				util_EcsTools.get_universe().components.set(_ecsTmpEntity,2,e);
				var ecsEntCompFlags = util_EcsTools.get_universe().components.flags[ecs_Entity.id(_ecsTmpEntity)];
				var ecsTmpFamily = util_EcsTools.get_universe().families.get(1);
				if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
					ecsTmpFamily.add(_ecsTmpEntity);
				}
				break;
			default:
				if(name1 != null) {
					var qid = Std.parseInt(name1);
					if(interaction.isAutocomplete()) {
						var results3 = [];
						var e = null;
						if(name1 != null && name1.length > 0) {
							if(qid != null && qid > 0) {
								e = database_DBEvents.GetRecord("quotes",QueryExpr.QueryBinop(QBinop.QOpEq,QueryExpr.QueryConstant(QConstant.QIdent("id")),QueryExpr.QueryValue(qid)),function(response) {
									haxe_Log.trace(name1,{ fileName : "src/commands/Quote.hx", lineNumber : 369, className : "commands.Quote", methodName : "run"});
									if(response._hx_index == 1) {
										var data = response.data;
										if(data == null) {
											interaction.respond([]);
											return;
										}
										var quote = database_types_DBQuote.fromRecord(data);
										var name = quote.title;
										if(name.length > 25) {
											name = HxOverrides.substr(name,0,25) + "...";
										}
										results3.push({ name : "" + name + " - " + HxOverrides.substr(quote.description,0,25) + ("... by " + quote.author_tag), value : "" + quote.id});
										interaction.respond(results3).then(null,function(err) {
											haxe_Log.trace(err,{ fileName : "src/commands/Quote.hx", lineNumber : 383, className : "commands.Quote", methodName : "run"});
											$global.console.dir(err);
										});
									} else {
										haxe_Log.trace(response,{ fileName : "src/commands/Quote.hx", lineNumber : 387, className : "commands.Quote", methodName : "run"});
									}
								});
							} else {
								e = database_DBEvents.Search("quotes","title",name1,function(response) {
									if(response._hx_index == 2) {
										var data = response.data;
										var item = data.iterator();
										while(item.hasNext()) {
											var item1 = item.next();
											var quote = database_types_DBQuote.fromRecord(item1);
											var name = quote.title;
											if(name.length > 25) {
												name = HxOverrides.substr(name,0,25) + "...";
											}
											results3.push({ name : "" + name + " - " + HxOverrides.substr(quote.description,0,25) + ("... by " + quote.author_tag), value : "" + quote.id});
										}
										interaction.respond(results3).then(null,function(err) {
											haxe_Log.trace(err,{ fileName : "src/commands/Quote.hx", lineNumber : 405, className : "commands.Quote", methodName : "run"});
											$global.console.dir(err);
										});
									} else {
										haxe_Log.trace(response,{ fileName : "src/commands/Quote.hx", lineNumber : 409, className : "commands.Quote", methodName : "run"});
									}
								});
							}
							var _ecsTmpEntity = this.universe.createEntity();
							this.universe.components.set(_ecsTmpEntity,2,e);
							var ecsEntCompFlags = this.universe.components.flags[ecs_Entity.id(_ecsTmpEntity)];
							var ecsTmpFamily = this.universe.families.get(1);
							if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
								ecsTmpFamily.add(_ecsTmpEntity);
							}
							return;
						} else {
							interaction.respond([]).then(null,function(err) {
								haxe_Log.trace(err,{ fileName : "src/commands/Quote.hx", lineNumber : 417, className : "commands.Quote", methodName : "run"});
								$global.console.dir(err);
							});
							return;
						}
					}
					var e = database_DBEvents.GetRecord("quotes",QueryExpr.QueryBinop(QBinop.QOpEq,QueryExpr.QueryConstant(QConstant.QIdent("id")),QueryExpr.QueryValue(name1)),function(resp) {
						if(resp._hx_index == 1) {
							var data = resp.data;
							if(data == null) {
								interaction.reply("Could not find any quotes with that identifier").then(null,function(err) {
									haxe_Log.trace(err,{ fileName : "src/commands/Quote.hx", lineNumber : 431, className : "commands.Quote", methodName : "run"});
								});
								return;
							}
							var q = database_types_DBQuote.fromRecord(data);
							var embed = new discord_$js_MessageEmbed();
							var user = interaction.client.users.cache.get(q.author_id);
							var from = new Date(q.timestamp);
							var date = DateTools.format(from,"%H:%M %d-%m-%Y");
							var icon = "https://cdn.discordapp.com/emojis/567741748172816404.webp?size=96&quality=lossless";
							var content = q.author_tag;
							if(user != null) {
								icon = user.avatarURL();
								content = q.author_tag;
							}
							embed.setDescription("***" + q.title + "***\n" + q.description);
							embed.setFooter({ text : "" + content + " | " + date + " |\t#" + q.id, iconURL : icon});
							interaction.reply({ embeds : [embed]}).then(null,function(err) {
								haxe_Log.trace(err,{ fileName : "src/commands/Quote.hx", lineNumber : 456, className : "commands.Quote", methodName : "run"});
								$global.console.dir(err);
							});
						} else {
							haxe_Log.trace(resp,{ fileName : "src/commands/Quote.hx", lineNumber : 460, className : "commands.Quote", methodName : "run"});
						}
					});
					var entity = util_EcsTools.get_universe().createEntity();
					var _ecsTmpEntity = entity;
					util_EcsTools.get_universe().components.set(_ecsTmpEntity,2,e);
					var ecsEntCompFlags = util_EcsTools.get_universe().components.flags[ecs_Entity.id(_ecsTmpEntity)];
					var ecsTmpFamily = util_EcsTools.get_universe().families.get(1);
					if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
						ecsTmpFamily.add(_ecsTmpEntity);
					}
				}
			}
			break;
		case 35:
			var name2 = _g.name;
			var type = "get";
			var e = command.content;
			var enum_name = $hxEnums[e.__enum__].__constructs__[e._hx_index]._hx_name.toLowerCase();
			if(enum_name.indexOf("get") != -1) {
				type = "get";
			}
			if(enum_name.indexOf("create") != -1) {
				type = "set";
			}
			if(enum_name.indexOf("delete") != -1) {
				type = "delete";
			}
			if(enum_name.indexOf("edit") != -1) {
				type = "edit";
			}
			var column = "id";
			if(name2 == null) {
				name2 = "";
			}
			if(this.isName(name2) && type != "get") {
				if(name2.length < 2) {
					if(interaction.isAutocomplete()) {
						interaction.respond([]);
					}
					return;
				}
				if(this.isValidName(name2)) {
					column = "name";
					name2 = name2.toLowerCase();
				}
			}
			var col = firebase_web_firestore_Firestore.collection(firebase_web_firestore_Firestore.getFirestore(firebase_web_app_FirebaseApp.getApp()),"discord/quotes/entries");
			firebase_web_firestore_Firestore.query(col,firebase_web_firestore_Firestore.where(column,"==",this.isName(name2) ? name2 : Std.parseInt(name2)),firebase_web_firestore_Firestore.where("author","==",interaction.user.id));
			var column = "title";
			if(this.isId(name2)) {
				column = "id";
			}
			if(interaction.isAutocomplete() && type != "get") {
				var e = database_DBEvents.SearchBy("quotes",column,name2,"author_id",interaction.user.id,function(resp) {
					if(resp._hx_index == 2) {
						var data = resp.data;
						var res = [];
						var r = data.iterator();
						while(r.hasNext()) {
							var r1 = r.next();
							var quote = database_types_DBQuote.fromRecord(r1);
							var name = quote.title;
							if(name.length > 25) {
								name = HxOverrides.substr(name,0,25) + "...";
							}
							res.push({ name : "" + name + " - " + HxOverrides.substr(quote.description,0,25) + ("... by " + quote.author_tag), value : "" + quote.id});
						}
						haxe_Log.trace(name2,{ fileName : "src/commands/Quote.hx", lineNumber : 215, className : "commands.Quote", methodName : "run"});
						if(!interaction.responded) {
							interaction.respond(res).then(null,function(err) {
								haxe_Log.trace(err,{ fileName : "src/commands/Quote.hx", lineNumber : 218, className : "commands.Quote", methodName : "run"});
								$global.console.dir(err);
							});
						}
					} else {
						haxe_Log.trace(resp,{ fileName : "src/commands/Quote.hx", lineNumber : 223, className : "commands.Quote", methodName : "run"});
					}
				});
				var entity = util_EcsTools.get_universe().createEntity();
				var _ecsTmpEntity = entity;
				util_EcsTools.get_universe().components.set(_ecsTmpEntity,2,e);
				var ecsEntCompFlags = util_EcsTools.get_universe().components.flags[ecs_Entity.id(_ecsTmpEntity)];
				var ecsTmpFamily = util_EcsTools.get_universe().families.get(1);
				if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
					ecsTmpFamily.add(_ecsTmpEntity);
				}
				return;
			}
			switch(type) {
			case "delete":
				var record = new db_Record();
				record.field("author_id",interaction.user.id);
				record.field("id",name2);
				var e = database_DBEvents.DeleteRecord("quotes",record,function(resp) {
					switch(resp._hx_index) {
					case 4:
						interaction.reply("Quote deleted!").then(null,function(err) {
							haxe_Log.trace(err,{ fileName : "src/commands/Quote.hx", lineNumber : 344, className : "commands.Quote", methodName : "run"});
						});
						break;
					case 5:
						var message = resp.message;
						var data = resp.data;
						haxe_Log.trace(message,{ fileName : "src/commands/Quote.hx", lineNumber : 346, className : "commands.Quote", methodName : "run"});
						haxe_Log.trace(data == null ? "null" : Std.string(data),{ fileName : "src/commands/Quote.hx", lineNumber : 347, className : "commands.Quote", methodName : "run"});
						interaction.reply("Cannot delete this quote").then(null,function(err) {
							haxe_Log.trace(err,{ fileName : "src/commands/Quote.hx", lineNumber : 350, className : "commands.Quote", methodName : "run"});
							$global.console.dir(err);
						});
						break;
					default:
						haxe_Log.trace(resp,{ fileName : "src/commands/Quote.hx", lineNumber : 354, className : "commands.Quote", methodName : "run"});
					}
				});
				var entity = util_EcsTools.get_universe().createEntity();
				var _ecsTmpEntity = entity;
				util_EcsTools.get_universe().components.set(_ecsTmpEntity,2,e);
				var ecsEntCompFlags = util_EcsTools.get_universe().components.flags[ecs_Entity.id(_ecsTmpEntity)];
				var ecsTmpFamily = util_EcsTools.get_universe().families.get(1);
				if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
					ecsTmpFamily.add(_ecsTmpEntity);
				}
				break;
			case "edit":
				var e = database_DBEvents.GetRecord("quotes",QueryExpr.QueryBinop(QBinop.QOpBoolAnd,QueryExpr.QueryBinop(QBinop.QOpEq,QueryExpr.QueryConstant(QConstant.QIdent("id")),QueryExpr.QueryValue(name2)),QueryExpr.QueryBinop(QBinop.QOpEq,QueryExpr.QueryConstant(QConstant.QIdent("author_id")),QueryExpr.QueryValue(interaction.user.id))),function(resp) {
					if(resp._hx_index == 1) {
						var data = resp.data;
						if(data == null) {
							interaction.reply("Could not find quote or you were not the author of the quote specified");
							return;
						}
						var quote = database_types_DBQuote.fromRecord(data);
						var modal = new discord_$builder_ModalBuilder().setCustomId("quote_edit").setTitle("Editting quote #" + quote.id);
						var title_input = new discord_$builder_APITextInputComponent().setCustomId("title").setLabel("title").setStyle(1).setValue(quote.title.toLowerCase()).setMinLength(3).setMaxLength(_gthis.max_name_length);
						var desc_input = new discord_$builder_APITextInputComponent().setCustomId("description").setLabel("" + quote.title + ":").setStyle(2).setValue(quote.description).setMinLength(10).setMaxLength(2000);
						var action_a = new discord_$builder_APIActionRowComponent().addComponents(title_input);
						var action_b = new discord_$builder_APIActionRowComponent().addComponents(desc_input);
						modal.addComponents(action_a,action_b);
						_gthis.cache.h[interaction.user.id] = quote;
						interaction.showModal(modal);
					} else {
						haxe_Log.trace(resp,{ fileName : "src/commands/Quote.hx", lineNumber : 330, className : "commands.Quote", methodName : "run"});
					}
				});
				var entity = util_EcsTools.get_universe().createEntity();
				var _ecsTmpEntity = entity;
				util_EcsTools.get_universe().components.set(_ecsTmpEntity,2,e);
				var ecsEntCompFlags = util_EcsTools.get_universe().components.flags[ecs_Entity.id(_ecsTmpEntity)];
				var ecsTmpFamily = util_EcsTools.get_universe().families.get(1);
				if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
					ecsTmpFamily.add(_ecsTmpEntity);
				}
				break;
			case "get":
				if(name2 != null) {
					var qid = Std.parseInt(name2);
					if(interaction.isAutocomplete()) {
						var results4 = [];
						var e = null;
						if(name2 != null && name2.length > 0) {
							if(qid != null && qid > 0) {
								e = database_DBEvents.GetRecord("quotes",QueryExpr.QueryBinop(QBinop.QOpEq,QueryExpr.QueryConstant(QConstant.QIdent("id")),QueryExpr.QueryValue(qid)),function(response) {
									haxe_Log.trace(name2,{ fileName : "src/commands/Quote.hx", lineNumber : 369, className : "commands.Quote", methodName : "run"});
									if(response._hx_index == 1) {
										var data = response.data;
										if(data == null) {
											interaction.respond([]);
											return;
										}
										var quote = database_types_DBQuote.fromRecord(data);
										var name = quote.title;
										if(name.length > 25) {
											name = HxOverrides.substr(name,0,25) + "...";
										}
										results4.push({ name : "" + name + " - " + HxOverrides.substr(quote.description,0,25) + ("... by " + quote.author_tag), value : "" + quote.id});
										interaction.respond(results4).then(null,function(err) {
											haxe_Log.trace(err,{ fileName : "src/commands/Quote.hx", lineNumber : 383, className : "commands.Quote", methodName : "run"});
											$global.console.dir(err);
										});
									} else {
										haxe_Log.trace(response,{ fileName : "src/commands/Quote.hx", lineNumber : 387, className : "commands.Quote", methodName : "run"});
									}
								});
							} else {
								e = database_DBEvents.Search("quotes","title",name2,function(response) {
									if(response._hx_index == 2) {
										var data = response.data;
										var item = data.iterator();
										while(item.hasNext()) {
											var item1 = item.next();
											var quote = database_types_DBQuote.fromRecord(item1);
											var name = quote.title;
											if(name.length > 25) {
												name = HxOverrides.substr(name,0,25) + "...";
											}
											results4.push({ name : "" + name + " - " + HxOverrides.substr(quote.description,0,25) + ("... by " + quote.author_tag), value : "" + quote.id});
										}
										interaction.respond(results4).then(null,function(err) {
											haxe_Log.trace(err,{ fileName : "src/commands/Quote.hx", lineNumber : 405, className : "commands.Quote", methodName : "run"});
											$global.console.dir(err);
										});
									} else {
										haxe_Log.trace(response,{ fileName : "src/commands/Quote.hx", lineNumber : 409, className : "commands.Quote", methodName : "run"});
									}
								});
							}
							var _ecsTmpEntity = this.universe.createEntity();
							this.universe.components.set(_ecsTmpEntity,2,e);
							var ecsEntCompFlags = this.universe.components.flags[ecs_Entity.id(_ecsTmpEntity)];
							var ecsTmpFamily = this.universe.families.get(1);
							if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
								ecsTmpFamily.add(_ecsTmpEntity);
							}
							return;
						} else {
							interaction.respond([]).then(null,function(err) {
								haxe_Log.trace(err,{ fileName : "src/commands/Quote.hx", lineNumber : 417, className : "commands.Quote", methodName : "run"});
								$global.console.dir(err);
							});
							return;
						}
					}
					var e = database_DBEvents.GetRecord("quotes",QueryExpr.QueryBinop(QBinop.QOpEq,QueryExpr.QueryConstant(QConstant.QIdent("id")),QueryExpr.QueryValue(name2)),function(resp) {
						if(resp._hx_index == 1) {
							var data = resp.data;
							if(data == null) {
								interaction.reply("Could not find any quotes with that identifier").then(null,function(err) {
									haxe_Log.trace(err,{ fileName : "src/commands/Quote.hx", lineNumber : 431, className : "commands.Quote", methodName : "run"});
								});
								return;
							}
							var q = database_types_DBQuote.fromRecord(data);
							var embed = new discord_$js_MessageEmbed();
							var user = interaction.client.users.cache.get(q.author_id);
							var from = new Date(q.timestamp);
							var date = DateTools.format(from,"%H:%M %d-%m-%Y");
							var icon = "https://cdn.discordapp.com/emojis/567741748172816404.webp?size=96&quality=lossless";
							var content = q.author_tag;
							if(user != null) {
								icon = user.avatarURL();
								content = q.author_tag;
							}
							embed.setDescription("***" + q.title + "***\n" + q.description);
							embed.setFooter({ text : "" + content + " | " + date + " |\t#" + q.id, iconURL : icon});
							interaction.reply({ embeds : [embed]}).then(null,function(err) {
								haxe_Log.trace(err,{ fileName : "src/commands/Quote.hx", lineNumber : 456, className : "commands.Quote", methodName : "run"});
								$global.console.dir(err);
							});
						} else {
							haxe_Log.trace(resp,{ fileName : "src/commands/Quote.hx", lineNumber : 460, className : "commands.Quote", methodName : "run"});
						}
					});
					var entity = util_EcsTools.get_universe().createEntity();
					var _ecsTmpEntity = entity;
					util_EcsTools.get_universe().components.set(_ecsTmpEntity,2,e);
					var ecsEntCompFlags = util_EcsTools.get_universe().components.flags[ecs_Entity.id(_ecsTmpEntity)];
					var ecsTmpFamily = util_EcsTools.get_universe().families.get(1);
					if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
						ecsTmpFamily.add(_ecsTmpEntity);
					}
				}
				break;
			case "set":
				var is_id = this.isId(name2);
				if(!is_id && !this.isValidName(name2)) {
					var error_msg = "name can only be 3-" + this.max_name_length + " characters long";
					if(name2.length < this.max_name_length) {
						error_msg = "*Names can only contain `_.-?` and/or spaces.*";
					}
					interaction.reply({ content : error_msg, ephemeral : true});
					return;
				}
				var column = is_id ? "id" : "title";
				var e = database_DBEvents.Search("quotes",column,name2,function(resp) {
					if(resp._hx_index == 2) {
						var data = resp.data;
						if(data.get_length() >= 1) {
							var interaction1 = interaction;
							var tmp = data.records[0].field("title");
							interaction1.reply("You already have a quote with the title __" + (tmp == null ? "null" : Std.string(tmp)) + "__").then(null,function(err) {
								haxe_Log.trace(err,{ fileName : "src/commands/Quote.hx", lineNumber : 252, className : "commands.Quote", methodName : "run"});
								$global.console.dir(err);
							});
							return;
						}
						var modal = new discord_$builder_ModalBuilder().setCustomId("quote_set").setTitle("Creating a quote");
						var title_input = new discord_$builder_APITextInputComponent().setCustomId("name").setLabel("title").setStyle(1).setValue(name2.toLowerCase()).setMinLength(3).setMaxLength(_gthis.max_name_length);
						var desc_input = new discord_$builder_APITextInputComponent().setCustomId("description").setLabel("description").setStyle(2).setMinLength(10).setMaxLength(2000);
						var action_a = new discord_$builder_APIActionRowComponent().addComponents(title_input);
						var action_b = new discord_$builder_APIActionRowComponent().addComponents(desc_input);
						modal.addComponents(action_a,action_b);
						interaction.showModal(modal);
					} else {
						haxe_Log.trace(resp,{ fileName : "src/commands/Quote.hx", lineNumber : 283, className : "commands.Quote", methodName : "run"});
					}
				});
				var entity = util_EcsTools.get_universe().createEntity();
				var _ecsTmpEntity = entity;
				util_EcsTools.get_universe().components.set(_ecsTmpEntity,2,e);
				var ecsEntCompFlags = util_EcsTools.get_universe().components.flags[ecs_Entity.id(_ecsTmpEntity)];
				var ecsTmpFamily = util_EcsTools.get_universe().families.get(1);
				if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
					ecsTmpFamily.add(_ecsTmpEntity);
				}
				break;
			default:
				if(name2 != null) {
					var qid = Std.parseInt(name2);
					if(interaction.isAutocomplete()) {
						var results5 = [];
						var e = null;
						if(name2 != null && name2.length > 0) {
							if(qid != null && qid > 0) {
								e = database_DBEvents.GetRecord("quotes",QueryExpr.QueryBinop(QBinop.QOpEq,QueryExpr.QueryConstant(QConstant.QIdent("id")),QueryExpr.QueryValue(qid)),function(response) {
									haxe_Log.trace(name2,{ fileName : "src/commands/Quote.hx", lineNumber : 369, className : "commands.Quote", methodName : "run"});
									if(response._hx_index == 1) {
										var data = response.data;
										if(data == null) {
											interaction.respond([]);
											return;
										}
										var quote = database_types_DBQuote.fromRecord(data);
										var name = quote.title;
										if(name.length > 25) {
											name = HxOverrides.substr(name,0,25) + "...";
										}
										results5.push({ name : "" + name + " - " + HxOverrides.substr(quote.description,0,25) + ("... by " + quote.author_tag), value : "" + quote.id});
										interaction.respond(results5).then(null,function(err) {
											haxe_Log.trace(err,{ fileName : "src/commands/Quote.hx", lineNumber : 383, className : "commands.Quote", methodName : "run"});
											$global.console.dir(err);
										});
									} else {
										haxe_Log.trace(response,{ fileName : "src/commands/Quote.hx", lineNumber : 387, className : "commands.Quote", methodName : "run"});
									}
								});
							} else {
								e = database_DBEvents.Search("quotes","title",name2,function(response) {
									if(response._hx_index == 2) {
										var data = response.data;
										var item = data.iterator();
										while(item.hasNext()) {
											var item1 = item.next();
											var quote = database_types_DBQuote.fromRecord(item1);
											var name = quote.title;
											if(name.length > 25) {
												name = HxOverrides.substr(name,0,25) + "...";
											}
											results5.push({ name : "" + name + " - " + HxOverrides.substr(quote.description,0,25) + ("... by " + quote.author_tag), value : "" + quote.id});
										}
										interaction.respond(results5).then(null,function(err) {
											haxe_Log.trace(err,{ fileName : "src/commands/Quote.hx", lineNumber : 405, className : "commands.Quote", methodName : "run"});
											$global.console.dir(err);
										});
									} else {
										haxe_Log.trace(response,{ fileName : "src/commands/Quote.hx", lineNumber : 409, className : "commands.Quote", methodName : "run"});
									}
								});
							}
							var _ecsTmpEntity = this.universe.createEntity();
							this.universe.components.set(_ecsTmpEntity,2,e);
							var ecsEntCompFlags = this.universe.components.flags[ecs_Entity.id(_ecsTmpEntity)];
							var ecsTmpFamily = this.universe.families.get(1);
							if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
								ecsTmpFamily.add(_ecsTmpEntity);
							}
							return;
						} else {
							interaction.respond([]).then(null,function(err) {
								haxe_Log.trace(err,{ fileName : "src/commands/Quote.hx", lineNumber : 417, className : "commands.Quote", methodName : "run"});
								$global.console.dir(err);
							});
							return;
						}
					}
					var e = database_DBEvents.GetRecord("quotes",QueryExpr.QueryBinop(QBinop.QOpEq,QueryExpr.QueryConstant(QConstant.QIdent("id")),QueryExpr.QueryValue(name2)),function(resp) {
						if(resp._hx_index == 1) {
							var data = resp.data;
							if(data == null) {
								interaction.reply("Could not find any quotes with that identifier").then(null,function(err) {
									haxe_Log.trace(err,{ fileName : "src/commands/Quote.hx", lineNumber : 431, className : "commands.Quote", methodName : "run"});
								});
								return;
							}
							var q = database_types_DBQuote.fromRecord(data);
							var embed = new discord_$js_MessageEmbed();
							var user = interaction.client.users.cache.get(q.author_id);
							var from = new Date(q.timestamp);
							var date = DateTools.format(from,"%H:%M %d-%m-%Y");
							var icon = "https://cdn.discordapp.com/emojis/567741748172816404.webp?size=96&quality=lossless";
							var content = q.author_tag;
							if(user != null) {
								icon = user.avatarURL();
								content = q.author_tag;
							}
							embed.setDescription("***" + q.title + "***\n" + q.description);
							embed.setFooter({ text : "" + content + " | " + date + " |\t#" + q.id, iconURL : icon});
							interaction.reply({ embeds : [embed]}).then(null,function(err) {
								haxe_Log.trace(err,{ fileName : "src/commands/Quote.hx", lineNumber : 456, className : "commands.Quote", methodName : "run"});
								$global.console.dir(err);
							});
						} else {
							haxe_Log.trace(resp,{ fileName : "src/commands/Quote.hx", lineNumber : 460, className : "commands.Quote", methodName : "run"});
						}
					});
					var entity = util_EcsTools.get_universe().createEntity();
					var _ecsTmpEntity = entity;
					util_EcsTools.get_universe().components.set(_ecsTmpEntity,2,e);
					var ecsEntCompFlags = util_EcsTools.get_universe().components.flags[ecs_Entity.id(_ecsTmpEntity)];
					var ecsTmpFamily = util_EcsTools.get_universe().families.get(1);
					if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
						ecsTmpFamily.add(_ecsTmpEntity);
					}
				}
			}
			break;
		case 36:
			var name3 = _g.name;
			var type = "get";
			var e = command.content;
			var enum_name = $hxEnums[e.__enum__].__constructs__[e._hx_index]._hx_name.toLowerCase();
			if(enum_name.indexOf("get") != -1) {
				type = "get";
			}
			if(enum_name.indexOf("create") != -1) {
				type = "set";
			}
			if(enum_name.indexOf("delete") != -1) {
				type = "delete";
			}
			if(enum_name.indexOf("edit") != -1) {
				type = "edit";
			}
			var column = "id";
			if(name3 == null) {
				name3 = "";
			}
			if(this.isName(name3) && type != "get") {
				if(name3.length < 2) {
					if(interaction.isAutocomplete()) {
						interaction.respond([]);
					}
					return;
				}
				if(this.isValidName(name3)) {
					column = "name";
					name3 = name3.toLowerCase();
				}
			}
			var col = firebase_web_firestore_Firestore.collection(firebase_web_firestore_Firestore.getFirestore(firebase_web_app_FirebaseApp.getApp()),"discord/quotes/entries");
			firebase_web_firestore_Firestore.query(col,firebase_web_firestore_Firestore.where(column,"==",this.isName(name3) ? name3 : Std.parseInt(name3)),firebase_web_firestore_Firestore.where("author","==",interaction.user.id));
			var column = "title";
			if(this.isId(name3)) {
				column = "id";
			}
			if(interaction.isAutocomplete() && type != "get") {
				var e = database_DBEvents.SearchBy("quotes",column,name3,"author_id",interaction.user.id,function(resp) {
					if(resp._hx_index == 2) {
						var data = resp.data;
						var res = [];
						var r = data.iterator();
						while(r.hasNext()) {
							var r1 = r.next();
							var quote = database_types_DBQuote.fromRecord(r1);
							var name = quote.title;
							if(name.length > 25) {
								name = HxOverrides.substr(name,0,25) + "...";
							}
							res.push({ name : "" + name + " - " + HxOverrides.substr(quote.description,0,25) + ("... by " + quote.author_tag), value : "" + quote.id});
						}
						haxe_Log.trace(name3,{ fileName : "src/commands/Quote.hx", lineNumber : 215, className : "commands.Quote", methodName : "run"});
						if(!interaction.responded) {
							interaction.respond(res).then(null,function(err) {
								haxe_Log.trace(err,{ fileName : "src/commands/Quote.hx", lineNumber : 218, className : "commands.Quote", methodName : "run"});
								$global.console.dir(err);
							});
						}
					} else {
						haxe_Log.trace(resp,{ fileName : "src/commands/Quote.hx", lineNumber : 223, className : "commands.Quote", methodName : "run"});
					}
				});
				var entity = util_EcsTools.get_universe().createEntity();
				var _ecsTmpEntity = entity;
				util_EcsTools.get_universe().components.set(_ecsTmpEntity,2,e);
				var ecsEntCompFlags = util_EcsTools.get_universe().components.flags[ecs_Entity.id(_ecsTmpEntity)];
				var ecsTmpFamily = util_EcsTools.get_universe().families.get(1);
				if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
					ecsTmpFamily.add(_ecsTmpEntity);
				}
				return;
			}
			switch(type) {
			case "delete":
				var record = new db_Record();
				record.field("author_id",interaction.user.id);
				record.field("id",name3);
				var e = database_DBEvents.DeleteRecord("quotes",record,function(resp) {
					switch(resp._hx_index) {
					case 4:
						interaction.reply("Quote deleted!").then(null,function(err) {
							haxe_Log.trace(err,{ fileName : "src/commands/Quote.hx", lineNumber : 344, className : "commands.Quote", methodName : "run"});
						});
						break;
					case 5:
						var message = resp.message;
						var data = resp.data;
						haxe_Log.trace(message,{ fileName : "src/commands/Quote.hx", lineNumber : 346, className : "commands.Quote", methodName : "run"});
						haxe_Log.trace(data == null ? "null" : Std.string(data),{ fileName : "src/commands/Quote.hx", lineNumber : 347, className : "commands.Quote", methodName : "run"});
						interaction.reply("Cannot delete this quote").then(null,function(err) {
							haxe_Log.trace(err,{ fileName : "src/commands/Quote.hx", lineNumber : 350, className : "commands.Quote", methodName : "run"});
							$global.console.dir(err);
						});
						break;
					default:
						haxe_Log.trace(resp,{ fileName : "src/commands/Quote.hx", lineNumber : 354, className : "commands.Quote", methodName : "run"});
					}
				});
				var entity = util_EcsTools.get_universe().createEntity();
				var _ecsTmpEntity = entity;
				util_EcsTools.get_universe().components.set(_ecsTmpEntity,2,e);
				var ecsEntCompFlags = util_EcsTools.get_universe().components.flags[ecs_Entity.id(_ecsTmpEntity)];
				var ecsTmpFamily = util_EcsTools.get_universe().families.get(1);
				if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
					ecsTmpFamily.add(_ecsTmpEntity);
				}
				break;
			case "edit":
				var e = database_DBEvents.GetRecord("quotes",QueryExpr.QueryBinop(QBinop.QOpBoolAnd,QueryExpr.QueryBinop(QBinop.QOpEq,QueryExpr.QueryConstant(QConstant.QIdent("id")),QueryExpr.QueryValue(name3)),QueryExpr.QueryBinop(QBinop.QOpEq,QueryExpr.QueryConstant(QConstant.QIdent("author_id")),QueryExpr.QueryValue(interaction.user.id))),function(resp) {
					if(resp._hx_index == 1) {
						var data = resp.data;
						if(data == null) {
							interaction.reply("Could not find quote or you were not the author of the quote specified");
							return;
						}
						var quote = database_types_DBQuote.fromRecord(data);
						var modal = new discord_$builder_ModalBuilder().setCustomId("quote_edit").setTitle("Editting quote #" + quote.id);
						var title_input = new discord_$builder_APITextInputComponent().setCustomId("title").setLabel("title").setStyle(1).setValue(quote.title.toLowerCase()).setMinLength(3).setMaxLength(_gthis.max_name_length);
						var desc_input = new discord_$builder_APITextInputComponent().setCustomId("description").setLabel("" + quote.title + ":").setStyle(2).setValue(quote.description).setMinLength(10).setMaxLength(2000);
						var action_a = new discord_$builder_APIActionRowComponent().addComponents(title_input);
						var action_b = new discord_$builder_APIActionRowComponent().addComponents(desc_input);
						modal.addComponents(action_a,action_b);
						_gthis.cache.h[interaction.user.id] = quote;
						interaction.showModal(modal);
					} else {
						haxe_Log.trace(resp,{ fileName : "src/commands/Quote.hx", lineNumber : 330, className : "commands.Quote", methodName : "run"});
					}
				});
				var entity = util_EcsTools.get_universe().createEntity();
				var _ecsTmpEntity = entity;
				util_EcsTools.get_universe().components.set(_ecsTmpEntity,2,e);
				var ecsEntCompFlags = util_EcsTools.get_universe().components.flags[ecs_Entity.id(_ecsTmpEntity)];
				var ecsTmpFamily = util_EcsTools.get_universe().families.get(1);
				if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
					ecsTmpFamily.add(_ecsTmpEntity);
				}
				break;
			case "get":
				if(name3 != null) {
					var qid = Std.parseInt(name3);
					if(interaction.isAutocomplete()) {
						var results6 = [];
						var e = null;
						if(name3 != null && name3.length > 0) {
							if(qid != null && qid > 0) {
								e = database_DBEvents.GetRecord("quotes",QueryExpr.QueryBinop(QBinop.QOpEq,QueryExpr.QueryConstant(QConstant.QIdent("id")),QueryExpr.QueryValue(qid)),function(response) {
									haxe_Log.trace(name3,{ fileName : "src/commands/Quote.hx", lineNumber : 369, className : "commands.Quote", methodName : "run"});
									if(response._hx_index == 1) {
										var data = response.data;
										if(data == null) {
											interaction.respond([]);
											return;
										}
										var quote = database_types_DBQuote.fromRecord(data);
										var name = quote.title;
										if(name.length > 25) {
											name = HxOverrides.substr(name,0,25) + "...";
										}
										results6.push({ name : "" + name + " - " + HxOverrides.substr(quote.description,0,25) + ("... by " + quote.author_tag), value : "" + quote.id});
										interaction.respond(results6).then(null,function(err) {
											haxe_Log.trace(err,{ fileName : "src/commands/Quote.hx", lineNumber : 383, className : "commands.Quote", methodName : "run"});
											$global.console.dir(err);
										});
									} else {
										haxe_Log.trace(response,{ fileName : "src/commands/Quote.hx", lineNumber : 387, className : "commands.Quote", methodName : "run"});
									}
								});
							} else {
								e = database_DBEvents.Search("quotes","title",name3,function(response) {
									if(response._hx_index == 2) {
										var data = response.data;
										var item = data.iterator();
										while(item.hasNext()) {
											var item1 = item.next();
											var quote = database_types_DBQuote.fromRecord(item1);
											var name = quote.title;
											if(name.length > 25) {
												name = HxOverrides.substr(name,0,25) + "...";
											}
											results6.push({ name : "" + name + " - " + HxOverrides.substr(quote.description,0,25) + ("... by " + quote.author_tag), value : "" + quote.id});
										}
										interaction.respond(results6).then(null,function(err) {
											haxe_Log.trace(err,{ fileName : "src/commands/Quote.hx", lineNumber : 405, className : "commands.Quote", methodName : "run"});
											$global.console.dir(err);
										});
									} else {
										haxe_Log.trace(response,{ fileName : "src/commands/Quote.hx", lineNumber : 409, className : "commands.Quote", methodName : "run"});
									}
								});
							}
							var _ecsTmpEntity = this.universe.createEntity();
							this.universe.components.set(_ecsTmpEntity,2,e);
							var ecsEntCompFlags = this.universe.components.flags[ecs_Entity.id(_ecsTmpEntity)];
							var ecsTmpFamily = this.universe.families.get(1);
							if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
								ecsTmpFamily.add(_ecsTmpEntity);
							}
							return;
						} else {
							interaction.respond([]).then(null,function(err) {
								haxe_Log.trace(err,{ fileName : "src/commands/Quote.hx", lineNumber : 417, className : "commands.Quote", methodName : "run"});
								$global.console.dir(err);
							});
							return;
						}
					}
					var e = database_DBEvents.GetRecord("quotes",QueryExpr.QueryBinop(QBinop.QOpEq,QueryExpr.QueryConstant(QConstant.QIdent("id")),QueryExpr.QueryValue(name3)),function(resp) {
						if(resp._hx_index == 1) {
							var data = resp.data;
							if(data == null) {
								interaction.reply("Could not find any quotes with that identifier").then(null,function(err) {
									haxe_Log.trace(err,{ fileName : "src/commands/Quote.hx", lineNumber : 431, className : "commands.Quote", methodName : "run"});
								});
								return;
							}
							var q = database_types_DBQuote.fromRecord(data);
							var embed = new discord_$js_MessageEmbed();
							var user = interaction.client.users.cache.get(q.author_id);
							var from = new Date(q.timestamp);
							var date = DateTools.format(from,"%H:%M %d-%m-%Y");
							var icon = "https://cdn.discordapp.com/emojis/567741748172816404.webp?size=96&quality=lossless";
							var content = q.author_tag;
							if(user != null) {
								icon = user.avatarURL();
								content = q.author_tag;
							}
							embed.setDescription("***" + q.title + "***\n" + q.description);
							embed.setFooter({ text : "" + content + " | " + date + " |\t#" + q.id, iconURL : icon});
							interaction.reply({ embeds : [embed]}).then(null,function(err) {
								haxe_Log.trace(err,{ fileName : "src/commands/Quote.hx", lineNumber : 456, className : "commands.Quote", methodName : "run"});
								$global.console.dir(err);
							});
						} else {
							haxe_Log.trace(resp,{ fileName : "src/commands/Quote.hx", lineNumber : 460, className : "commands.Quote", methodName : "run"});
						}
					});
					var entity = util_EcsTools.get_universe().createEntity();
					var _ecsTmpEntity = entity;
					util_EcsTools.get_universe().components.set(_ecsTmpEntity,2,e);
					var ecsEntCompFlags = util_EcsTools.get_universe().components.flags[ecs_Entity.id(_ecsTmpEntity)];
					var ecsTmpFamily = util_EcsTools.get_universe().families.get(1);
					if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
						ecsTmpFamily.add(_ecsTmpEntity);
					}
				}
				break;
			case "set":
				var is_id = this.isId(name3);
				if(!is_id && !this.isValidName(name3)) {
					var error_msg = "name can only be 3-" + this.max_name_length + " characters long";
					if(name3.length < this.max_name_length) {
						error_msg = "*Names can only contain `_.-?` and/or spaces.*";
					}
					interaction.reply({ content : error_msg, ephemeral : true});
					return;
				}
				var column = is_id ? "id" : "title";
				var e = database_DBEvents.Search("quotes",column,name3,function(resp) {
					if(resp._hx_index == 2) {
						var data = resp.data;
						if(data.get_length() >= 1) {
							var interaction1 = interaction;
							var tmp = data.records[0].field("title");
							interaction1.reply("You already have a quote with the title __" + (tmp == null ? "null" : Std.string(tmp)) + "__").then(null,function(err) {
								haxe_Log.trace(err,{ fileName : "src/commands/Quote.hx", lineNumber : 252, className : "commands.Quote", methodName : "run"});
								$global.console.dir(err);
							});
							return;
						}
						var modal = new discord_$builder_ModalBuilder().setCustomId("quote_set").setTitle("Creating a quote");
						var title_input = new discord_$builder_APITextInputComponent().setCustomId("name").setLabel("title").setStyle(1).setValue(name3.toLowerCase()).setMinLength(3).setMaxLength(_gthis.max_name_length);
						var desc_input = new discord_$builder_APITextInputComponent().setCustomId("description").setLabel("description").setStyle(2).setMinLength(10).setMaxLength(2000);
						var action_a = new discord_$builder_APIActionRowComponent().addComponents(title_input);
						var action_b = new discord_$builder_APIActionRowComponent().addComponents(desc_input);
						modal.addComponents(action_a,action_b);
						interaction.showModal(modal);
					} else {
						haxe_Log.trace(resp,{ fileName : "src/commands/Quote.hx", lineNumber : 283, className : "commands.Quote", methodName : "run"});
					}
				});
				var entity = util_EcsTools.get_universe().createEntity();
				var _ecsTmpEntity = entity;
				util_EcsTools.get_universe().components.set(_ecsTmpEntity,2,e);
				var ecsEntCompFlags = util_EcsTools.get_universe().components.flags[ecs_Entity.id(_ecsTmpEntity)];
				var ecsTmpFamily = util_EcsTools.get_universe().families.get(1);
				if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
					ecsTmpFamily.add(_ecsTmpEntity);
				}
				break;
			default:
				if(name3 != null) {
					var qid = Std.parseInt(name3);
					if(interaction.isAutocomplete()) {
						var results7 = [];
						var e = null;
						if(name3 != null && name3.length > 0) {
							if(qid != null && qid > 0) {
								e = database_DBEvents.GetRecord("quotes",QueryExpr.QueryBinop(QBinop.QOpEq,QueryExpr.QueryConstant(QConstant.QIdent("id")),QueryExpr.QueryValue(qid)),function(response) {
									haxe_Log.trace(name3,{ fileName : "src/commands/Quote.hx", lineNumber : 369, className : "commands.Quote", methodName : "run"});
									if(response._hx_index == 1) {
										var data = response.data;
										if(data == null) {
											interaction.respond([]);
											return;
										}
										var quote = database_types_DBQuote.fromRecord(data);
										var name = quote.title;
										if(name.length > 25) {
											name = HxOverrides.substr(name,0,25) + "...";
										}
										results7.push({ name : "" + name + " - " + HxOverrides.substr(quote.description,0,25) + ("... by " + quote.author_tag), value : "" + quote.id});
										interaction.respond(results7).then(null,function(err) {
											haxe_Log.trace(err,{ fileName : "src/commands/Quote.hx", lineNumber : 383, className : "commands.Quote", methodName : "run"});
											$global.console.dir(err);
										});
									} else {
										haxe_Log.trace(response,{ fileName : "src/commands/Quote.hx", lineNumber : 387, className : "commands.Quote", methodName : "run"});
									}
								});
							} else {
								e = database_DBEvents.Search("quotes","title",name3,function(response) {
									if(response._hx_index == 2) {
										var data = response.data;
										var item = data.iterator();
										while(item.hasNext()) {
											var item1 = item.next();
											var quote = database_types_DBQuote.fromRecord(item1);
											var name = quote.title;
											if(name.length > 25) {
												name = HxOverrides.substr(name,0,25) + "...";
											}
											results7.push({ name : "" + name + " - " + HxOverrides.substr(quote.description,0,25) + ("... by " + quote.author_tag), value : "" + quote.id});
										}
										interaction.respond(results7).then(null,function(err) {
											haxe_Log.trace(err,{ fileName : "src/commands/Quote.hx", lineNumber : 405, className : "commands.Quote", methodName : "run"});
											$global.console.dir(err);
										});
									} else {
										haxe_Log.trace(response,{ fileName : "src/commands/Quote.hx", lineNumber : 409, className : "commands.Quote", methodName : "run"});
									}
								});
							}
							var _ecsTmpEntity = this.universe.createEntity();
							this.universe.components.set(_ecsTmpEntity,2,e);
							var ecsEntCompFlags = this.universe.components.flags[ecs_Entity.id(_ecsTmpEntity)];
							var ecsTmpFamily = this.universe.families.get(1);
							if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
								ecsTmpFamily.add(_ecsTmpEntity);
							}
							return;
						} else {
							interaction.respond([]).then(null,function(err) {
								haxe_Log.trace(err,{ fileName : "src/commands/Quote.hx", lineNumber : 417, className : "commands.Quote", methodName : "run"});
								$global.console.dir(err);
							});
							return;
						}
					}
					var e = database_DBEvents.GetRecord("quotes",QueryExpr.QueryBinop(QBinop.QOpEq,QueryExpr.QueryConstant(QConstant.QIdent("id")),QueryExpr.QueryValue(name3)),function(resp) {
						if(resp._hx_index == 1) {
							var data = resp.data;
							if(data == null) {
								interaction.reply("Could not find any quotes with that identifier").then(null,function(err) {
									haxe_Log.trace(err,{ fileName : "src/commands/Quote.hx", lineNumber : 431, className : "commands.Quote", methodName : "run"});
								});
								return;
							}
							var q = database_types_DBQuote.fromRecord(data);
							var embed = new discord_$js_MessageEmbed();
							var user = interaction.client.users.cache.get(q.author_id);
							var from = new Date(q.timestamp);
							var date = DateTools.format(from,"%H:%M %d-%m-%Y");
							var icon = "https://cdn.discordapp.com/emojis/567741748172816404.webp?size=96&quality=lossless";
							var content = q.author_tag;
							if(user != null) {
								icon = user.avatarURL();
								content = q.author_tag;
							}
							embed.setDescription("***" + q.title + "***\n" + q.description);
							embed.setFooter({ text : "" + content + " | " + date + " |\t#" + q.id, iconURL : icon});
							interaction.reply({ embeds : [embed]}).then(null,function(err) {
								haxe_Log.trace(err,{ fileName : "src/commands/Quote.hx", lineNumber : 456, className : "commands.Quote", methodName : "run"});
								$global.console.dir(err);
							});
						} else {
							haxe_Log.trace(resp,{ fileName : "src/commands/Quote.hx", lineNumber : 460, className : "commands.Quote", methodName : "run"});
						}
					});
					var entity = util_EcsTools.get_universe().createEntity();
					var _ecsTmpEntity = entity;
					util_EcsTools.get_universe().components.set(_ecsTmpEntity,2,e);
					var ecsEntCompFlags = util_EcsTools.get_universe().components.flags[ecs_Entity.id(_ecsTmpEntity)];
					var ecsTmpFamily = util_EcsTools.get_universe().families.get(1);
					if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
						ecsTmpFamily.add(_ecsTmpEntity);
					}
				}
			}
			break;
		default:
		}
	}
	,dbacResponse: function(data) {
		var name = data.title;
		if(name.length > 25) {
			name = HxOverrides.substr(name,0,25) + "...";
		}
		return "" + name + " - " + HxOverrides.substr(data.description,0,25) + ("... by " + data.author_tag);
	}
	,nameArray: function(original) {
		var arr = original.toLowerCase().split(" ");
		var _g_current = 0;
		while(_g_current < arr.length) {
			var _g_value = arr[_g_current];
			var _g_key = _g_current++;
			arr[_g_key] = StringTools.trim(_g_value);
		}
		return arr;
	}
	,nameString: function(arr) {
		var text = arr[1];
		var _g = 2;
		var _g1 = arr.length;
		while(_g < _g1) {
			var i = _g++;
			text += " " + arr[i];
		}
		return StringTools.trim(text);
	}
	,isName: function(input) {
		var check_letters = new EReg("([a-z])","i");
		return check_letters.match(input);
	}
	,isId: function(input) {
		var check_letters = new EReg("^[0-9]*$","");
		return check_letters.match(input);
	}
	,isValidName: function(input) {
		var check_letters = new EReg("^[A-Za-z0-9 :.?_-]{3,35}$","i");
		return check_letters.match(input);
	}
	,get_name: function() {
		return "quote";
	}
	,modal: null
	,table87a8f92f715c03d0822a55d9b93a210d: null
	,__class__: commands_Quote
});
var commands_React = function(_universe) {
	systems_CommandBase.call(this,_universe);
};
$hxClasses["commands.React"] = commands_React;
commands_React.__name__ = "commands.React";
commands_React.__super__ = systems_CommandBase;
commands_React.prototype = $extend(systems_CommandBase.prototype,{
	run: function(command,interaction) {
		var _g = command.content;
		if(_g._hx_index == 18) {
			var emoji = _g.emoji;
			interaction.channel.messages.fetch(_g.message_id).then(function(react_message) {
				react_message.react(emoji).then(function(_) {
					interaction.reply({ content : "*reacted*", ephemeral : true}).then(null,function(err) {
						haxe_Log.trace(err,{ fileName : "src/commands/React.hx", lineNumber : 14, className : "commands.React", methodName : "run"});
					});
				},function(err) {
					interaction.reply({ ephemeral : true, content : "*failed to react, not sure why. invalid emoji perhaps? ask notbilly if no obvious reason*"});
					haxe_Log.trace(err,{ fileName : "src/commands/React.hx", lineNumber : 20, className : "commands.React", methodName : "run"});
				});
			},function(err) {
				haxe_Log.trace(err,{ fileName : "src/commands/React.hx", lineNumber : 23, className : "commands.React", methodName : "run"});
				return interaction.reply({ ephemeral : true, content : "*failed to react, not sure why. invalid emoji perhaps? ask notbilly if no obvious reason*"});
			});
		}
	}
	,get_name: function() {
		return "react";
	}
	,__class__: commands_React
});
var commands_Reminder = function(_universe) {
	this.casual_chat = "";
	this.bot_channel = "663246792426782730";
	this.sent = [];
	this.reminders = [];
	this.checking = false;
	this.channels = new haxe_ds_StringMap();
	systems_CommandDbBase.call(this,_universe);
};
$hxClasses["commands.Reminder"] = commands_Reminder;
commands_Reminder.__name__ = "commands.Reminder";
commands_Reminder.__super__ = systems_CommandDbBase;
commands_Reminder.prototype = $extend(systems_CommandDbBase.prototype,{
	channels: null
	,checking: null
	,reminders: null
	,sent: null
	,bot_channel: null
	,casual_chat: null
	,onEnabled: function() {
		var _gthis = this;
		firebase_web_firestore_Firestore.onSnapshot(firebase_web_firestore_Firestore.collection(firebase_web_firestore_Firestore.getFirestore(firebase_web_app_FirebaseApp.getApp()),"discord/reminders/entries"),function(resp) {
			var arr = [];
			var _g = 0;
			var _g1 = resp.docs;
			while(_g < _g1.length) {
				var item = _g1[_g];
				++_g;
				arr.push(item.data());
			}
			_gthis.reminders = arr;
		});
	}
	,run: function(command,interaction) {
		var _g = command.content;
		if(_g._hx_index == 14) {
			var content = _g.content;
			var when = _g.when;
			var personal = _g.personal;
			var thread_reply = _g.thread_reply;
			if(personal == null) {
				personal = false;
			}
			var thread_id = "";
			if(thread_reply) {
				if(interaction.channel.isThread()) {
					thread_id = interaction.channel.id;
				} else {
					interaction.reply("You marked `thread_reply` to true. Please trigger this command from a thread.");
					return;
				}
			}
			var channel_id = null;
			var category = interaction.channel.parent.name;
			if(category.toLowerCase() == "offtopic") {
				channel_id = interaction.channelId;
			}
			var obj = { channel_id : channel_id, sent : false, thread_reply : thread_reply, thread_id : thread_id, id : "", duration : commands_types_Duration.fromString(when), timestamp : new Date().getTime(), author : interaction.user.id, content : content, personal : personal};
			var min = "4mins";
			var duration = commands_types_Duration.fromString(min);
			if(obj.duration == 0.) {
				interaction.reply("Your time formatting was likely incorrect. Use units like __m__in(s), __h__ou__r__(s), __d__ay(s), __w__ee__k__(s) and __mo__nth(s)");
				return;
			}
			if(obj.duration <= duration) {
				interaction.reply("Please set a reminder that is at least 5mins");
				return;
			}
			if(obj.duration >= commands_types_Duration.fromString("366days")) {
				interaction.reply("A reminder can't be set for longer than 366 days");
				return;
			}
			var col = firebase_web_firestore_Firestore.collection(firebase_web_firestore_Firestore.getFirestore(firebase_web_app_FirebaseApp.getApp()),"discord/reminders/entries");
			firebase_web_firestore_Firestore.addDoc(col,obj).then(function(doc) {
				var post_time = Math.round((obj.timestamp + obj.duration) / 1000);
				interaction.reply({ ephemeral : personal, content : "Your reminder has been set for <t:" + post_time + ">"}).then(function(msg) {
					obj.id = doc.id;
					firebase_web_firestore_Firestore.updateDoc(doc,obj).then(null,function(err) {
						haxe_Log.trace(err,{ fileName : "src/commands/Reminder.hx", lineNumber : 95, className : "commands.Reminder", methodName : "run"});
					});
				},function(err) {
					haxe_Log.trace(err,{ fileName : "src/commands/Reminder.hx", lineNumber : 98, className : "commands.Reminder", methodName : "run"});
					$global.console.dir(err);
				});
			},function(err) {
				haxe_Log.trace(err,{ fileName : "src/commands/Reminder.hx", lineNumber : 102, className : "commands.Reminder", methodName : "run"});
				$global.console.dir(err);
			});
		}
	}
	,update: function(_) {
		var _gthis = this;
		systems_CommandDbBase.prototype.update.call(this,_);
		this.getChannel(this.bot_channel);
		if(this.channels.h[this.bot_channel] == null) {
			return;
		}
		var _g = 0;
		var _g1 = this.reminders;
		while(_g < _g1.length) {
			var reminder = [_g1[_g]];
			++_g;
			if(reminder[0].sent) {
				continue;
			}
			if(reminder[0].channel_id != null && !Object.prototype.hasOwnProperty.call(this.channels.h,reminder[0].channel_id)) {
				this.getChannel(reminder[0].channel_id);
			}
			var post_time = reminder[0].timestamp + reminder[0].duration;
			if(new Date().getTime() < post_time) {
				continue;
			}
			reminder[0].sent = true;
			var parse = [{ parse : ["users"]}];
			var embed = new discord_$js_MessageEmbed();
			embed.setTitle("Reminder");
			embed.setDescription(reminder[0].content);
			embed.setFooter({ text : "<t:" + Math.round(reminder[0].timestamp / 1000) + ">"});
			var message = "> <@" + reminder[0].author + "> Your reminder was sent <t:" + Math.round(reminder[0].timestamp / 1000) + ":R>";
			var content = ["" + message + "\n" + reminder[0].content];
			if(reminder[0].thread_reply) {
				Main.client.channels.fetch(reminder[0].thread_id).then((function(content,parse,reminder) {
					return function(channel) {
						channel.send({ content : content[0], allowedMentions : parse[0]}).then(null,(function(parse,reminder) {
							return function(err) {
								haxe_Log.trace(err,{ fileName : "src/commands/Reminder.hx", lineNumber : 145, className : "commands.Reminder", methodName : "update"});
								reminder[0].sent = false;
								reminder[0].duration += commands_types_Duration.fromString("3hrs");
								var tmp = "<@" + reminder[0].author + "> I failed to post a reminder to your thread. Might be an issue.";
								var parse1 = parse[0];
								_gthis.get_channel().send({ content : tmp, allowedMentions : parse1});
							};
						})(parse,reminder));
					};
				})(content,parse,reminder));
			} else if(reminder[0].personal) {
				Main.client.users.fetch(reminder[0].author).then((function(content,parse,reminder) {
					return function(user) {
						user.send(content[0]).then(null,(function(parse,reminder) {
							return function(err) {
								haxe_Log.trace(err,{ fileName : "src/commands/Reminder.hx", lineNumber : 157, className : "commands.Reminder", methodName : "update"});
								reminder[0].sent = false;
								reminder[0].duration += 86400000;
								var tmp = "<@" + reminder[0].author + "> I tried to DM you a reminder, but it failed. Do you accept messages from this server?";
								var parse1 = parse[0];
								_gthis.get_channel().send({ content : tmp, allowedMentions : parse1});
							};
						})(parse,reminder));
					};
				})(content,parse,reminder));
			} else {
				var channel = this.get_channel();
				if(reminder[0].channel_id != null && Object.prototype.hasOwnProperty.call(this.channels.h,reminder[0].channel_id)) {
					channel = this.channels.h[reminder[0].channel_id];
				}
				channel.send({ content : content[0], allowedMentions : parse[0]}).then(null,(function(reminder) {
					return function(err) {
						haxe_Log.trace(err,{ fileName : "src/commands/Reminder.hx", lineNumber : 173, className : "commands.Reminder", methodName : "update"});
						reminder[0].sent = false;
						reminder[0].duration += 3600000;
					};
				})(reminder));
			}
		}
		var _g = 0;
		var _g1 = this.reminders;
		while(_g < _g1.length) {
			var msg = _g1[_g];
			++_g;
			if(!msg.sent) {
				continue;
			}
			var doc = firebase_web_firestore_Firestore.doc(firebase_web_firestore_Firestore.getFirestore(firebase_web_app_FirebaseApp.getApp()),"discord/reminders/entries/" + msg.id);
			firebase_web_firestore_Firestore.deleteDoc(doc).then(null,function(err) {
				haxe_Log.trace(err,{ fileName : "src/commands/Reminder.hx", lineNumber : 186, className : "commands.Reminder", methodName : "update"});
				$global.console.dir(err);
			});
			HxOverrides.remove(this.sent,msg);
		}
	}
	,getChannel: function(channel_id) {
		var _gthis = this;
		if(!this.checking && this.channels.h[channel_id] == null) {
			this.checking = true;
			Main.client.channels.fetch(channel_id).then(function(channel) {
				_gthis.channels.h[channel.id] = channel;
				_gthis.checking = false;
				haxe_Log.trace("Found " + channel.name + " channel",{ fileName : "src/commands/Reminder.hx", lineNumber : 199, className : "commands.Reminder", methodName : "getChannel"});
			},function(err) {
				haxe_Log.trace(err,{ fileName : "src/commands/Reminder.hx", lineNumber : 201, className : "commands.Reminder", methodName : "getChannel"});
				$global.console.dir(err);
			});
		}
	}
	,get_channel: function() {
		return this.channels.h[this.bot_channel];
	}
	,get_name: function() {
		return "reminder";
	}
	,__class__: commands_Reminder
	,__properties__: $extend(systems_CommandDbBase.prototype.__properties__,{get_channel:"get_channel"})
});
var commands_Roundup = function(_universe) {
	this.set_permissions = false;
	this.sent = false;
	this.announcement_channel = "286485321925918721";
	this.news_role = "761714325227700225";
	this.super_mod_id = "198916468312637440";
	var _g = new haxe_ds_StringMap();
	_g.h["367806496907591682"] = null;
	_g.h["151104106973495296"] = null;
	this.dmlist = _g;
	this._check_now = false;
	this.checking = false;
	this.channel = null;
	this.active = true;
	this.thursday_check = -1;
	this.last_checked = -1;
	this.posted = -1;
	systems_CommandBase.call(this,_universe);
};
$hxClasses["commands.Roundup"] = commands_Roundup;
commands_Roundup.__name__ = "commands.Roundup";
commands_Roundup.__super__ = systems_CommandBase;
commands_Roundup.prototype = $extend(systems_CommandBase.prototype,{
	posted: null
	,last_checked: null
	,thursday_check: null
	,active: null
	,channel: null
	,checking: null
	,_check_now: null
	,dmlist: null
	,super_mod_id: null
	,news_role: null
	,announcement_channel: null
	,sent: null
	,dmUser: function(title,content) {
		var regex_r = new RegExp("\\((.*?)\\)","gmis".split("u").join(""));
		content = content.replace(regex_r,"(<$1>)");
		var h = this.dmlist.h;
		var _g_keys = Object.keys(h);
		var _g_length = _g_keys.length;
		var _g_current = 0;
		while(_g_current < _g_length) {
			var key = _g_keys[_g_current++];
			var _g_value = h[key];
			var user = [_g_value];
			if(user[0] == null) {
				haxe_Log.trace("skipping " + key,{ fileName : "src/commands/Roundup.hx", lineNumber : 49, className : "commands.Roundup", methodName : "dmUser"});
				continue;
			}
			user[0].send("## " + title);
			var arr = content.split("\n");
			var half = Math.floor(arr.length / 2);
			var a = "";
			var b = [""];
			var _g_current1 = 0;
			while(_g_current1 < arr.length) {
				var _g_value1 = arr[_g_current1];
				var _g_key = _g_current1++;
				if(_g_key <= half) {
					a += _g_value1 + "\n";
				} else {
					b[0] += _g_value1 + "\n";
				}
			}
			user[0].send(a).then((function(b,user) {
				return function(_) {
					return user[0].send(b[0]).then(null,(function() {
						return function(err) {
							haxe_Log.trace(err,{ fileName : "src/commands/Roundup.hx", lineNumber : 65, className : "commands.Roundup", methodName : "dmUser"});
						};
					})());
				};
			})(b,user),(function() {
				return function(err) {
					haxe_Log.trace(err,{ fileName : "src/commands/Roundup.hx", lineNumber : 66, className : "commands.Roundup", methodName : "dmUser"});
				};
			})());
		}
	}
	,getHaxeIoPage: function() {
		var _gthis = this;
		var data = new haxe_http_HttpNodeJs("https://raw.githubusercontent.com/skial/haxe.io/master/src/roundups/" + Main.state.next_roundup + ".md");
		var embed = new discord_$js_MessageEmbed();
		data.onError = function(error) {
			haxe_Log.trace(error,{ fileName : "src/commands/Roundup.hx", lineNumber : 76, className : "commands.Roundup", methodName : "getHaxeIoPage"});
		};
		data.onData = function(body) {
			var regex = new EReg("### News and Articles(.*?)##### _In case you missed it_","gmis");
			if(regex.match(body)) {
				embed.setTitle("Haxe Roundup #" + Main.state.next_roundup);
				embed.setURL("https://haxe.io/roundups/" + Main.state.next_roundup + "/");
				var desc_split = StringTools.trim(regex.matched(1)).split("\n");
				var desc = "\n**News And Articles**";
				var _g = 0;
				while(_g < desc_split.length) {
					var item = desc_split[_g];
					++_g;
					if(desc.length + StringTools.trim(item).length + 3 + 22 >= 2048) {
						continue;
					}
					if(item.indexOf("#### ") != -1) {
						item = StringTools.replace(item,"#### ","### ");
					}
					desc += "\n" + StringTools.trim(item);
				}
				desc += "\n...";
				embed.setDescription(desc);
				_gthis.dmUser("Haxe Roundup #" + Main.state.next_roundup,desc);
				_gthis.channel.send({ content : "<@&" + _gthis.news_role + ">", allowedMentions : { roles : [_gthis.news_role]}, embeds : [embed]}).then(function(_) {
					var fh = Main.state;
					var postfix = fh.next_roundup;
					var value = fh.next_roundup + 1;
					Main.state.next_roundup = value;
					Main.updateState("next_roundup",JSON.stringify(value));
					return postfix;
				});
			}
		};
		data.request();
	}
	,set_permissions: null
	,update: function(_) {
		var _gthis = this;
		systems_CommandBase.prototype.update.call(this,_);
		if(Main.state == null) {
			return;
		}
		if(this.channel == null && this.checking == false) {
			this.checking = true;
			Main.client.channels.fetch(this.announcement_channel).then(function(channel) {
				_gthis.channel = channel;
				_gthis.checking = false;
			},function(err) {
				haxe_Log.trace(err,{ fileName : "src/commands/Roundup.hx", lineNumber : 125, className : "commands.Roundup", methodName : "update"});
				$global.console.dir(err);
			});
			var h = this.dmlist.h;
			var _g_h = h;
			var _g_keys = Object.keys(h);
			var _g_length = _g_keys.length;
			var _g_current = 0;
			while(_g_current < _g_length) {
				var key = _g_keys[_g_current++];
				var _g_key = key;
				var _g_value = _g_h[key];
				var key1 = [_g_key];
				var user = _g_value;
				if(user == null) {
					Main.client.users.fetch(key1[0]).then((function(key) {
						return function(user) {
							_gthis.dmlist.h[key[0]] = user;
							haxe_Log.trace("Got " + user.tag,{ fileName : "src/commands/Roundup.hx", lineNumber : 133, className : "commands.Roundup", methodName : "update"});
						};
					})(key1),(function() {
						return function(err) {
							haxe_Log.trace(err,{ fileName : "src/commands/Roundup.hx", lineNumber : 134, className : "commands.Roundup", methodName : "update"});
						};
					})());
				}
			}
		}
		if(Main.state.next_roundup == -1 || this.channel == null) {
			return;
		}
		var today = new Date();
		var diff = today.getTime() - this.last_checked;
		var day = today.getUTCDay() == 4 || today.getUTCDay() == 6;
		if(day || this._check_now) {
			if(!this.shouldCheck()) {
				return;
			}
		} else {
			if(diff >= commands_types_Duration.fromString("1d")) {
				return;
			}
			this.last_checked = new Date().getTime();
		}
		this.getHaxeIoPage();
	}
	,shouldCheck: function() {
		var today = new Date();
		var hour = today.getUTCHours();
		if(this._check_now) {
			this._check_now = false;
			return true;
		}
		if(hour < 11 || hour > 14) {
			return false;
		}
		var min = today.getUTCMinutes();
		if(min % 30 != 0) {
			return false;
		}
		var diff = today.getTime() - this.thursday_check;
		if(diff <= commands_types_Duration.fromString("25m")) {
			return false;
		}
		this.thursday_check = today.getTime();
		return true;
	}
	,run: function(command,interaction) {
		var _gthis = this;
		if(!Util_hasRole(this.super_mod_id,interaction)) {
			interaction.reply("Invalid permissions").then(null,null);
			return;
		}
		var _g = command.content;
		if(_g._hx_index == 24) {
			var number = _g.number;
			if(this.active) {
				this.active = false;
				this.last_checked = -1;
				interaction.reply("Disabled haxe roundup monitoring");
				return;
			}
			if(number <= 600) {
				interaction.reply("Please enter a more recent roundup issue.");
				return;
			}
			this.active = true;
			var value = number | 0;
			Main.state.next_roundup = value;
			Main.updateState("next_roundup",JSON.stringify(value));
			interaction.reply("Will start watching haxe roundups from **#" + number + "**.");
			interaction.client.channels.fetch(this.announcement_channel).then(function(channel) {
				_gthis.channel = channel;
			},function(err) {
				haxe_Log.trace(err,{ fileName : "src/commands/Roundup.hx", lineNumber : 215, className : "commands.Roundup", methodName : "run"});
				$global.console.dir(err);
			});
		}
	}
	,get_roundup: function() {
		return Main.state.next_roundup;
	}
	,set_roundup: function(value) {
		Main.state.next_roundup = value;
		Main.updateState("next_roundup",JSON.stringify(value));
		return value;
	}
	,get_name: function() {
		return "roundup";
	}
	,__class__: commands_Roundup
	,__properties__: $extend(systems_CommandBase.prototype.__properties__,{set_roundup:"set_roundup",get_roundup:"get_roundup"})
});
var commands_RoundupRoundup = function(_universe) {
	this.event_role = "<@&1054432874473996408>";
	this.voice_text_id = "220626116627529728";
	this.announcement_id = "286485321925918721";
	this.voice_channel_id = "198219256687493120";
	this.host_contacted = false;
	this.host_active = false;
	this.waiting = false;
	systems_CommandDbBase.call(this,_universe);
	this.end_event = this.universe.families.get(9);
	this.voice_update_events = this.universe.families.get(10);
	this.scheduled_event_updates = this.universe.families.get(11);
	this.table0f9294ec4df5372e078c34fabf7427cd = this.universe.components.getTable(10);
	this.table83434594cd483e85f1d6ab14e011303c = this.universe.components.getTable(11);
	this.table87a8f92f715c03d0822a55d9b93a210d = this.universe.components.getTable(5);
	this.tablec9adfcb69cacf935dab274fb9ef32870 = this.universe.components.getTable(12);
};
$hxClasses["commands.RoundupRoundup"] = commands_RoundupRoundup;
commands_RoundupRoundup.__name__ = "commands.RoundupRoundup";
commands_RoundupRoundup.__super__ = systems_CommandDbBase;
commands_RoundupRoundup.prototype = $extend(systems_CommandDbBase.prototype,{
	voice_text: null
	,announcement: null
	,voice_channel: null
	,host_m: null
	,last_checked: null
	,event: null
	,waiting: null
	,host_active: null
	,host_contacted: null
	,new_event_collector: null
	,end_event_collector: null
	,voice_channel_id: null
	,announcement_id: null
	,voice_text_id: null
	,event_role: null
	,update: function(_) {
		var _gthis = this;
		systems_CommandDbBase.prototype.update.call(this,_);
		if(this.get_state() == null) {
			return;
		}
		if(this.voice_channel == null && !this.waiting) {
			this.waiting = true;
			Main.client.channels.fetch(this.voice_channel_id).then(function(channel) {
				_gthis.voice_channel = channel;
				_gthis.waiting = false;
			},function(err) {
				haxe_Log.trace(err,{ fileName : "src/commands/RoundupRoundup.hx", lineNumber : 67, className : "commands.RoundupRoundup", methodName : "update"});
			});
		}
		if(this.voice_channel == null) {
			return;
		}
		if(this.announcement == null && !this.waiting) {
			this.waiting = true;
			Main.client.channels.fetch(this.announcement_id).then(function(channel) {
				_gthis.announcement = channel;
				_gthis.waiting = false;
			},function(err) {
				haxe_Log.trace(err,{ fileName : "src/commands/RoundupRoundup.hx", lineNumber : 79, className : "commands.RoundupRoundup", methodName : "update"});
			});
		}
		if(this.announcement == null) {
			return;
		}
		if(this.voice_text == null && !this.waiting) {
			this.waiting = true;
			Main.client.channels.fetch(this.voice_text_id).then(function(channel) {
				_gthis.waiting = false;
				_gthis.voice_text = channel;
			},function(err) {
				haxe_Log.trace(err,{ fileName : "src/commands/RoundupRoundup.hx", lineNumber : 91, className : "commands.RoundupRoundup", methodName : "update"});
			});
		}
		if(this.voice_text == null) {
			return;
		}
		if(this.host_m == null && !this.waiting) {
			this.waiting = true;
			haxe_Log.trace(this.get_state().host,{ fileName : "src/commands/RoundupRoundup.hx", lineNumber : 100, className : "commands.RoundupRoundup", methodName : "update"});
			this.get_guild().members.fetch({ user : this.get_state().host, force : true}).then(function(member) {
				_gthis.host_m = member;
				_gthis.waiting = false;
				haxe_Log.trace("Roundup host obtained",{ fileName : "src/commands/RoundupRoundup.hx", lineNumber : 104, className : "commands.RoundupRoundup", methodName : "update"});
			},function(err) {
				haxe_Log.trace(err,{ fileName : "src/commands/RoundupRoundup.hx", lineNumber : 105, className : "commands.RoundupRoundup", methodName : "update"});
			});
		}
		if(this.host_m == null) {
			return;
		}
		if(this.event == null) {
			this.getEvent();
			return;
		}
		this.handleEventUpdates();
		var _gthis1 = this;
		var _this = this.voice_update_events;
		var _set = _this.entities;
		var _active = _this.isActive();
		var _g_idx = _set.size() - 1;
		while(_active && _g_idx >= 0) {
			var entity = _set.getDense(_g_idx--);
			var updated = this.table83434594cd483e85f1d6ab14e011303c.get(entity);
			this.table83434594cd483e85f1d6ab14e011303c.get(entity);
			var forward = this.table87a8f92f715c03d0822a55d9b93a210d.get(entity);
			if(forward == "roundup_member_update") {
				if(this.event != null && this.event.status == 2) {
					var member = updated.member;
					if(member != null && member.id == this.get_host() && updated.channel == null) {
						member.send("Hi <@" + this.get_host() + ">, it looks like you left the voice channel. Should I end the event?").then(function(message) {
							var reactions = ["✅","❎"];
							_gthis1.end_event_collector = _gthis1.addCollection("1w",reactions,message,$bind(_gthis1,_gthis1.endEventCollector));
						},function(err) {
							haxe_Log.trace(err,{ fileName : "src/commands/RoundupRoundup.hx", lineNumber : 229, className : "commands.RoundupRoundup", methodName : "handleVoiceEvents"});
						});
					}
				}
				this.universe.deleteEntity(entity);
			}
		}
		this.handleScheduledEvent();
	}
	,scheduleNewEvent: function() {
		var _gthis = this;
		if(this.host_contacted || this.waiting) {
			haxe_Log.trace(this.host_contacted,{ fileName : "src/commands/RoundupRoundup.hx", lineNumber : 124, className : "commands.RoundupRoundup", methodName : "scheduleNewEvent"});
			haxe_Log.trace(this.waiting,{ fileName : "src/commands/RoundupRoundup.hx", lineNumber : 125, className : "commands.RoundupRoundup", methodName : "scheduleNewEvent"});
			return;
		}
		haxe_Log.trace(this.host_m.user.tag,{ fileName : "src/commands/RoundupRoundup.hx", lineNumber : 128, className : "commands.RoundupRoundup", methodName : "scheduleNewEvent"});
		this.waiting = true;
		var reactions = ["2️⃣","3️⃣","4️⃣","5️⃣"];
		this.host_contacted = true;
		this.host_m.send("Time to schedule a new roundup roundup! How many weeks until the next roundup roundup?\n").then(function(message) {
			_gthis.waiting = false;
			_gthis.new_event_collector = _gthis.addCollection("1w",reactions,message,$bind(_gthis,_gthis.newEventCollector));
		},function(err) {
			haxe_Log.trace(err,{ fileName : "src/commands/RoundupRoundup.hx", lineNumber : 136, className : "commands.RoundupRoundup", methodName : "scheduleNewEvent"});
		});
	}
	,newEventCollector: function(reaction,user) {
		if(user.bot) {
			return;
		}
		var weeks;
		switch(reaction.emoji.name) {
		case "2️⃣":
			weeks = 2;
			break;
		case "3️⃣":
			weeks = 3;
			break;
		case "4️⃣":
			weeks = 4;
			break;
		case "5️⃣":
			weeks = 5;
			break;
		default:
			weeks = 2;
		}
		var date = this.event.scheduledStartTimestamp + commands_types_Duration.fromString("" + weeks + "w");
		this.createEvent(date);
		this.new_event_collector.stop("User selected " + weeks + " weeks");
	}
	,handleEventUpdates: function() {
		var _gthis = this;
		if(this.event == null) {
			return;
		}
		var _this = this.scheduled_event_updates;
		var _set = _this.entities;
		var _active = _this.isActive();
		var _g_idx = _set.size() - 1;
		while(_active && _g_idx >= 0) {
			var entity = _set.getDense(_g_idx--);
			var forward = this.table87a8f92f715c03d0822a55d9b93a210d.get(entity);
			var event = [this.tablec9adfcb69cacf935dab274fb9ef32870.get(entity)];
			if(forward == "scheduled_event_update") {
				if(event[0].id != this.event.id) {
					continue;
				}
				event[0].client.guilds.fetch({ guild : Main.guild_id}).then((function(event) {
					return function(guild) {
						guild.scheduledEvents.fetch(event[0].id).then((function() {
							return function(event) {
								_gthis.event = event;
								_gthis.handleEventStatus(event);
								haxe_Log.trace("Updated event: " + event.status,{ fileName : "src/commands/RoundupRoundup.hx", lineNumber : 171, className : "commands.RoundupRoundup", methodName : "handleEventUpdates"});
								haxe_Log.trace("New time: " + Std.string(new Date(event.scheduledStartTimestamp)),{ fileName : "src/commands/RoundupRoundup.hx", lineNumber : 172, className : "commands.RoundupRoundup", methodName : "handleEventUpdates"});
							};
						})(),(function() {
							return function(err) {
								haxe_Log.trace(err,{ fileName : "src/commands/RoundupRoundup.hx", lineNumber : 173, className : "commands.RoundupRoundup", methodName : "handleEventUpdates"});
							};
						})());
					};
				})(event),(function() {
					return function(err) {
						haxe_Log.trace(err,{ fileName : "src/commands/RoundupRoundup.hx", lineNumber : 174, className : "commands.RoundupRoundup", methodName : "handleEventUpdates"});
					};
				})());
			}
			this.universe.deleteEntity(entity);
		}
	}
	,handleEventStatus: function(event) {
		switch(event.status) {
		case 2:
			if(this.get_state().announced || this.waiting) {
				haxe_Log.trace("here",{ fileName : "src/commands/RoundupRoundup.hx", lineNumber : 188, className : "commands.RoundupRoundup", methodName : "handleEventStatus", customParams : [this.get_state().announced,this.waiting]});
				return;
			}
			var mention = this.get_state().event_ping >= 3 ? this.event_role : "@everyone";
			var message = "" + mention + " come and join the haxe roundup where we go over what has been happening in haxe for the last few weeks!";
			if(this.get_state().event_ping >= 3) {
				this.get_state().event_ping = 0;
				message += "\n\nIf you received this event and want to opt out please go to <#663246792426782730> and type `/notify events`";
			} else {
				this.get_state().event_ping = this.get_state().event_ping + 1;
			}
			this.voice_text.send({ content : message, allowedMentions : { parse : ["everyone","roles"]}}).then(null,function(err) {
				haxe_Log.trace(err,{ fileName : "src/commands/RoundupRoundup.hx", lineNumber : 204, className : "commands.RoundupRoundup", methodName : "handleEventStatus"});
			});
			this.get_state().announced = true;
			this.setState(this.get_state());
			haxe_Log.trace("Event Started",{ fileName : "src/commands/RoundupRoundup.hx", lineNumber : 207, className : "commands.RoundupRoundup", methodName : "handleEventStatus"});
			this.waiting = false;
			this.event = event;
			break;
		case 3:
			this.scheduleNewEvent();
			break;
		default:
			haxe_Log.trace(event.status,{ fileName : "src/commands/RoundupRoundup.hx", lineNumber : 211, className : "commands.RoundupRoundup", methodName : "handleEventStatus"});
		}
	}
	,handleVoiceEvents: function() {
		var _gthis = this;
		var _this = this.voice_update_events;
		var _set = _this.entities;
		var _active = _this.isActive();
		var _g_idx = _set.size() - 1;
		while(_active && _g_idx >= 0) {
			var entity = _set.getDense(_g_idx--);
			var updated = this.table83434594cd483e85f1d6ab14e011303c.get(entity);
			this.table83434594cd483e85f1d6ab14e011303c.get(entity);
			var forward = this.table87a8f92f715c03d0822a55d9b93a210d.get(entity);
			if(forward == "roundup_member_update") {
				if(this.event != null && this.event.status == 2) {
					var member = updated.member;
					if(member != null && member.id == this.get_host() && updated.channel == null) {
						member.send("Hi <@" + this.get_host() + ">, it looks like you left the voice channel. Should I end the event?").then(function(message) {
							var reactions = ["✅","❎"];
							_gthis.end_event_collector = _gthis.addCollection("1w",reactions,message,$bind(_gthis,_gthis.endEventCollector));
						},function(err) {
							haxe_Log.trace(err,{ fileName : "src/commands/RoundupRoundup.hx", lineNumber : 229, className : "commands.RoundupRoundup", methodName : "handleVoiceEvents"});
						});
					}
				}
				this.universe.deleteEntity(entity);
			}
		}
	}
	,endEventCollector: function(reaction,user) {
		var _gthis = this;
		if(user.bot) {
			return;
		}
		if(reaction.emoji.name == "✅") {
			this.event.setStatus(3,"Host ended the event.").then(function(event) {
				return _gthis.host_m.send("Event ended, thank you for hosting!").then(function(_) {
					_gthis.host_active = false;
					_gthis.waiting = false;
				},function(err) {
					haxe_Log.trace(err,{ fileName : "src/commands/RoundupRoundup.hx", lineNumber : 249, className : "commands.RoundupRoundup", methodName : "endEventCollector"});
				});
			},function(err) {
				haxe_Log.trace(err,{ fileName : "src/commands/RoundupRoundup.hx", lineNumber : 250, className : "commands.RoundupRoundup", methodName : "endEventCollector"});
			});
		}
		this.end_event_collector.stop();
	}
	,handleScheduledEvent: function() {
		var _gthis = this;
		if(this.event.status != 1) {
			return;
		}
		var now = new Date().getTime();
		var left = this.event.scheduledStartTimestamp - now;
		if(left > commands_types_Duration.fromString("5m")) {
			return;
		}
		if(!this.host_active) {
			if(now - this.last_checked > commands_types_Duration.fromString("1m")) {
				this.last_checked = now;
				var jsIterator = this.voice_channel.members.values();
				var _g_lastStep = jsIterator.next();
				while(!_g_lastStep.done) {
					var v = _g_lastStep.value;
					_g_lastStep = jsIterator.next();
					if(v.id == this.get_host()) {
						this.host_active = true;
						haxe_Log.trace("Host is active",{ fileName : "src/commands/RoundupRoundup.hx", lineNumber : 273, className : "commands.RoundupRoundup", methodName : "handleScheduledEvent"});
						break;
					}
				}
			} else {
				return;
			}
		}
		if(left <= commands_types_Duration.fromString("0s") && !this.waiting && this.host_active) {
			this.waiting = true;
			this.event.setStatus(2,"Time to start the event!").then(function(_) {
				_gthis.waiting = false;
			},function(err) {
				haxe_Log.trace(err,{ fileName : "src/commands/RoundupRoundup.hx", lineNumber : 287, className : "commands.RoundupRoundup", methodName : "handleScheduledEvent"});
				_gthis.waiting = true;
			});
		}
	}
	,createEvent: function(date) {
		var _gthis = this;
		this.get_guild().scheduledEvents.create({ name : "Haxe Roundup Roundup", channel : this.voice_channel_id, entityType : 2, privacyLevel : 2, scheduledStartTime : date, description : "A community hosted discussion event where we go over the latest things that has gone on in the haxe over the last few weeks. We also have a period where people can show off what they're working on - its open floor come and join if you want :D"}).then(function(event) {
			_gthis.host_contacted = false;
			_gthis.event = event;
			_gthis.get_state().announced = false;
			_gthis.get_state().event_id = event.id;
			event.createInviteURL({ maxAge : 604800, channel : _gthis.voice_text_id}).then(function(url) {
				_gthis.voice_text.send({ content : "Thanks for hanging out :grin: \nGet ready for the next one! " + url}).then(null,function(err) {
					haxe_Log.trace(err,{ fileName : "src/commands/RoundupRoundup.hx", lineNumber : 313, className : "commands.RoundupRoundup", methodName : "createEvent"});
				});
				_gthis.announcement.send({ content : "Get ready for the next roundup roundup :grin: \n" + url}).then(null,function(err) {
					haxe_Log.trace(err,{ fileName : "src/commands/RoundupRoundup.hx", lineNumber : 317, className : "commands.RoundupRoundup", methodName : "createEvent"});
				});
			},function(err) {
				haxe_Log.trace(err,{ fileName : "src/commands/RoundupRoundup.hx", lineNumber : 318, className : "commands.RoundupRoundup", methodName : "createEvent"});
			});
			_gthis.setState(_gthis.get_state());
			haxe_Log.trace("Event setup!",{ fileName : "src/commands/RoundupRoundup.hx", lineNumber : 320, className : "commands.RoundupRoundup", methodName : "createEvent"});
			_gthis.host_m.send("New roundup event scheduled for <t:" + Math.round(event.scheduledStartTimestamp / 1000) + ":R>").then(null,function(err) {
				haxe_Log.trace(err,{ fileName : "src/commands/RoundupRoundup.hx", lineNumber : 324, className : "commands.RoundupRoundup", methodName : "createEvent"});
			});
		},function(err) {
			haxe_Log.trace(err,{ fileName : "src/commands/RoundupRoundup.hx", lineNumber : 325, className : "commands.RoundupRoundup", methodName : "createEvent"});
		});
	}
	,getEvent: function() {
		var _gthis = this;
		if(this.waiting) {
			return;
		}
		this.waiting = true;
		this.get_schedule().fetch(this.get_state().event_id).then(function(event) {
			_gthis.waiting = false;
			haxe_Log.trace("Roundup event retrieved",{ fileName : "src/commands/RoundupRoundup.hx", lineNumber : 336, className : "commands.RoundupRoundup", methodName : "getEvent"});
			_gthis.event = event;
			_gthis.handleEventStatus(event);
		},function(err) {
			haxe_Log.trace(err,{ fileName : "src/commands/RoundupRoundup.hx", lineNumber : 340, className : "commands.RoundupRoundup", methodName : "getEvent"});
			_gthis.waiting = false;
		});
	}
	,handleEndEvent: function() {
		var _gthis = this;
		var _this = this.end_event;
		var _set = _this.entities;
		var _active = _this.isActive();
		var _g_idx = _set.size() - 1;
		while(_active && _g_idx >= 0) {
			var entity = _set.getDense(_g_idx--);
			var data = [this.table0f9294ec4df5372e078c34fabf7427cd.get(entity)];
			this.event.setStatus(3,"Host ended the event.").then((function(data) {
				return function(_) {
					return data[0].member.send("Event ended, thank you for hosting!").then((function() {
						return function(_) {
							_gthis.host_active = false;
							_gthis.waiting = false;
						};
					})(),(function() {
						return function(err) {
							haxe_Log.trace(err,{ fileName : "src/commands/RoundupRoundup.hx", lineNumber : 351, className : "commands.RoundupRoundup", methodName : "handleEndEvent"});
						};
					})());
				};
			})(data),(function() {
				return function(err) {
					haxe_Log.trace(err,{ fileName : "src/commands/RoundupRoundup.hx", lineNumber : 352, className : "commands.RoundupRoundup", methodName : "handleEndEvent"});
				};
			})());
			this.universe.deleteEntity(entity);
		}
	}
	,addCollection: function(time,emojis,message,on_collect,on_end) {
		var _g = 0;
		while(_g < emojis.length) {
			var e = emojis[_g];
			++_g;
			message.react(e).then(null,function(err) {
				haxe_Log.trace(err,{ fileName : "src/commands/RoundupRoundup.hx", lineNumber : 361, className : "commands.RoundupRoundup", methodName : "addCollection"});
			});
		}
		var collector = message.createReactionCollector({ time : commands_types_Duration.fromString(time)});
		collector.on("collect",on_collect);
		if(on_end != null) {
			collector.on("end",on_end);
		}
		return collector;
	}
	,run: function(command,interaction) {
	}
	,addCollector: function(message,member) {
		var _gthis = this;
		var time = commands_types_Duration.fromString("1d");
		var collector = message.createReactionCollector({ time : time});
		collector.on("collect",function(reaction,user) {
			if(user.bot) {
				return;
			}
			if(reaction.emoji.name == "✅") {
				var obj = { member : member};
				var _ecsTmpEntity = _gthis.universe.createEntity();
				_gthis.universe.components.set(_ecsTmpEntity,10,obj);
				var ecsEntCompFlags = _gthis.universe.components.flags[ecs_Entity.id(_ecsTmpEntity)];
				var ecsTmpFamily = _gthis.universe.families.get(9);
				if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
					ecsTmpFamily.add(_ecsTmpEntity);
				}
			}
			collector.stop("User responded");
		});
		collector.on("end",function(collected,reason) {
		});
	}
	,get_name: function() {
		return "rounduproundup";
	}
	,get_guild: function() {
		return Main.client.guilds.cache.get(Main.guild_id);
	}
	,get_state: function() {
		if(Main.state == null) {
			return null;
		}
		return Main.state.roundup_roundup;
	}
	,setState: function(value) {
		Main.state.roundup_roundup = value;
		Main.updateState("roundup_roundup",JSON.stringify(Main.state.roundup_roundup));
	}
	,get_started: function() {
		return this.event.status == 2;
	}
	,get_schedule: function() {
		return this.get_guild().scheduledEvents;
	}
	,get_host: function() {
		return this.get_state().host;
	}
	,end_event: null
	,voice_update_events: null
	,scheduled_event_updates: null
	,table0f9294ec4df5372e078c34fabf7427cd: null
	,table83434594cd483e85f1d6ab14e011303c: null
	,table87a8f92f715c03d0822a55d9b93a210d: null
	,tablec9adfcb69cacf935dab274fb9ef32870: null
	,__class__: commands_RoundupRoundup
	,__properties__: $extend(systems_CommandDbBase.prototype.__properties__,{get_host:"get_host",get_schedule:"get_schedule",get_state:"get_state",get_guild:"get_guild"})
});
var commands_Rtfm = function(_universe) {
	systems_CommandBase.call(this,_universe);
};
$hxClasses["commands.Rtfm"] = commands_Rtfm;
commands_Rtfm.__name__ = "commands.Rtfm";
commands_Rtfm.__super__ = systems_CommandBase;
commands_Rtfm.prototype = $extend(systems_CommandBase.prototype,{
	data: null
	,onEnabled: function() {
		this.data = Util_loadFile("rtfm",{ fileName : "src/commands/Rtfm.hx", lineNumber : 11, className : "commands.Rtfm", methodName : "onEnabled"});
	}
	,run: function(command,interaction) {
		if(this.data == null) {
			haxe_Log.trace("failed to read rtfm data",{ fileName : "src/commands/Rtfm.hx", lineNumber : 16, className : "commands.Rtfm", methodName : "run"});
			return;
		}
		var _g = command.content;
		if(_g._hx_index == 25) {
			var _gchannel = _g.channel;
			var compare = _gchannel;
			if(_gchannel == null) {
				compare = interaction.channel.name;
			}
			var _g = 0;
			var _g1 = this.data;
			while(_g < _g1.length) {
				var item = _g1[_g];
				++_g;
				var _g2 = 0;
				var _g3 = item.keys;
				while(_g2 < _g3.length) {
					var val = _g3[_g2];
					++_g2;
					if(val == compare) {
						interaction.reply(item.content);
						return;
					}
				}
			}
			interaction.reply("No information available.");
		}
	}
	,get_name: function() {
		return "rtfm";
	}
	,__class__: commands_Rtfm
});
var systems_TextCommandBase = function(_universe) {
	ecs_System.call(this,_universe);
	this.commands = this.universe.families.get(0);
	this.tabled1cd3067ebd0108e92f1425a40ea7b45 = this.universe.components.getTable(1);
	this.tablee699e73f96d5fb19e01669534fb74875 = this.universe.components.getTable(0);
};
$hxClasses["systems.TextCommandBase"] = systems_TextCommandBase;
systems_TextCommandBase.__name__ = "systems.TextCommandBase";
systems_TextCommandBase.__super__ = ecs_System;
systems_TextCommandBase.prototype = $extend(ecs_System.prototype,{
	update: function(_) {
		if(!Main.connected || !Main.commands_active) {
			return;
		}
		var _this = this.commands;
		var _set = _this.entities;
		var _active = _this.isActive();
		var _g_idx = _set.size() - 1;
		while(_active && _g_idx >= 0) {
			var entity = _set.getDense(_g_idx--);
			var message = this.tabled1cd3067ebd0108e92f1425a40ea7b45.get(entity);
			var command = this.tablee699e73f96d5fb19e01669534fb74875.get(entity);
			if(command == this.get_name()) {
				this.run(message,StringTools.replace(message.content,this.get_name(),""));
				this.universe.deleteEntity(entity);
			}
		}
	}
	,run: null
	,get_name: null
	,commands: null
	,tabled1cd3067ebd0108e92f1425a40ea7b45: null
	,tablee699e73f96d5fb19e01669534fb74875: null
	,__class__: systems_TextCommandBase
	,__properties__: {get_name:"get_name"}
});
var commands_Run2 = function(_universe) {
	this.site = "localhost";
	this.timeout = 5000;
	this.checked = false;
	this.code_requests = new haxe_ds_StringMap();
	this.haxe_version = null;
	systems_TextCommandBase.call(this,_universe);
};
$hxClasses["commands.Run2"] = commands_Run2;
commands_Run2.__name__ = "commands.Run2";
commands_Run2.__super__ = systems_TextCommandBase;
commands_Run2.prototype = $extend(systems_TextCommandBase.prototype,{
	message_id: null
	,haxe_version: null
	,code_requests: null
	,channel: null
	,checked: null
	,timeout: null
	,last_cleared: null
	,site: null
	,onEnabled: function() {
		var _gthis = this;
		var http = new haxe_http_HttpNodeJs("http://" + this.site + ":1337");
		http.setHeader("Authorization","Basic " + Main.keys.haxelib);
		http.onError = function(error) {
			haxe_Log.trace(error,{ fileName : "src/commands/Run2.hx", lineNumber : 58, className : "commands.Run2", methodName : "onEnabled"});
		};
		http.setPostData("{\r\n\t\t\t\t\"action\": \"haxe_version\"\r\n\t\t\t}");
		http.onData = function(response) {
			var parse = JSON.parse(response);
			if(parse.status == "Ok") {
				_gthis.haxe_version = parse.output;
			} else {
				haxe_Log.trace(parse.output,{ fileName : "src/commands/Run2.hx", lineNumber : 71, className : "commands.Run2", methodName : "onEnabled"});
				haxe_Log.trace(parse.error,{ fileName : "src/commands/Run2.hx", lineNumber : 72, className : "commands.Run2", methodName : "onEnabled"});
			}
		};
		http.request(true);
	}
	,run: function(message,content) {
		if(this.haxe_version == null) {
			return;
		}
		this.extractCode(message.content,message);
	}
	,codeSource: function(message) {
		var remote = new EReg("^(!run #([a-zA-Z0-9]{5,8}))","gi");
		var source = "";
		if(remote.match(message)) {
			source = "https://try.haxe.org/#" + remote.matched(2);
		}
		return source;
	}
	,extractCode: function(message,response) {
		var _gthis = this;
		var check_code = new EReg("^(!run #([a-zA-Z0-9]{5,8}))","gi");
		if(check_code.match(message)) {
			var regex = new EReg("(<code class=\"prettyprint haxe\">)(.*?)(</code>)","gmius");
			var get_code = new haxe_http_HttpNodeJs("https://try.haxe.org/embed/" + check_code.matched(2));
			get_code.onData = function(data) {
				if(regex.match(data)) {
					_gthis.parse(StringTools.htmlUnescape(regex.matched(2)),response);
				}
			};
			get_code.request();
			return;
		}
		check_code = new EReg("^(!run(\\s|\n| \n|).```(haxe|hx|)(.*)```)","gmisu");
		if(check_code.match(message)) {
			this.parse(check_code.matched(4),response);
			return;
		}
		check_code = new EReg("!run[\\s|\n| \n](.*)","gmis");
		if(check_code.match(message)) {
			this.parse(check_code.matched(1),response);
			return;
		}
		this.parse(null,response);
	}
	,extractLibs: function(code) {
		var check_code = new EReg("(/?/?-l\\W.*)","gmiu");
		if(!check_code.match(code)) {
			return [];
		}
		var libs = [];
		var i = 0;
		while(check_code.match(code)) {
			var split = check_code.matched(1).split(" ");
			if(i > 0) {
				libs.push(" -L ");
			} else {
				libs.push("-L ");
			}
			libs.push(split[1]);
			code = check_code.matchedRight();
			++i;
		}
		return libs;
	}
	,canRequest: function(data) {
		var timings = 0.0;
		var last = 0.0;
		var count = 1;
		var _g = 0;
		var _g1 = data.length;
		while(_g < _g1) {
			var i = _g++;
			if(data.length % 2 == 1 && data.length - i == 1) {
				break;
			}
			if(i % 2 == 0) {
				last = data[i];
				continue;
			}
			timings += data[i] - last;
			++count;
		}
		if(data.length >= 6) {
			return timings / count > 2000;
		} else {
			return true;
		}
	}
	,cleanOutput: function(data,filename,class_entry) {
		data = data.toString();
		new RegExp("(\\[(.*|vm)\\].*)$","igmu".split("u").join(""));
		data = StringTools.replace(data,this.get_base_path(),"");
		data = StringTools.replace(data,"/hx/","");
		data = StringTools.replace(data,"/bin/","");
		var reg_r = new RegExp("Main.hx:[0-9].*?: ","gm".split("u").join(""));
		data = data.replace(reg_r,"");
		return data;
	}
	,getImportAndUsings: function(input,index) {
		if(index == null) {
			index = 0;
		}
		var regex = new EReg("^(import|using)(.*);$","igmu");
		var matches = [];
		while(regex.match(input)) {
			matches.push(regex.matched(index));
			input = regex.matchedRight();
		}
		return { code : input, paths : matches};
	}
	,parse: function(code,response) {
		if(code == null || code.length == 0) {
			response.reply({ content : "Your `!run` command formatting is incorrect. Check the pin in <#663246792426782730>."});
			return;
		}
		var class_exists = new EReg("(class.*({|\n{))","mgu");
		if(class_exists.match(code)) {
			var check_class = new EReg("(^class\\s(Test|Main)(\n|\\s|\\S))","mgu");
			if(!check_class.match(code)) {
				response.reply({ content : "You must have a class called `Test` or `Main`"});
				return;
			}
		}
		this.runCodeOnThread(code,response);
	}
	,parseError: function(error,code) {
		var embed = new discord_$js_MessageEmbed();
		embed.setTitle("Compilation Error");
		var regex = new EReg("(Main|Test).hx:([0-9]+): (character|characters) ([0-9]+)(-([0-9]+))? : (.*)","gm");
		if(regex.match(error)) {
			var line = Std.parseInt(regex.matched(2));
			var start_char = Std.parseInt(regex.matched(4));
			var end_char = Std.parseInt(regex.matched(6));
			var str = "";
			var new_code = "";
			var _this = code.split("\n");
			var _g_current = 0;
			while(_g_current < _this.length) {
				var _g_value = _this[_g_current];
				var _g_key = _g_current++;
				if(_g_key != line - 1) {
					new_code += _g_value + "\n";
					continue;
				}
				var _g = 0;
				var _g1 = _g_value.length;
				while(_g < _g1) {
					var i = _g++;
					var pos = i + 1;
					var char = _g_value.charAt(i);
					if(pos < start_char) {
						str += char;
					} else if(pos == start_char) {
						str += "->" + char;
					} else if(pos == end_char) {
						str += "" + char + "<-";
					}
				}
				new_code += str + "\n";
			}
			if(new_code.length > 3900) {
				new_code = HxOverrides.substr(new_code,0,3900);
			}
			if(error.length > 3900) {
				error = HxOverrides.substr(error,0,3900);
			}
			embed.setDescription("```hx\n" + new_code + ("``` **Error** \n " + error));
			return embed;
		}
		return null;
	}
	,runCodeOnThread: function(code,message) {
		var _gthis = this;
		var mention = "<@" + message.author.id + ">";
		var libs = this.extractLibs(code);
		var lib_regex = new EReg("(/?/?-l\\W.*)","gmiu");
		if(lib_regex.match(code)) {
			code = code.replace(lib_regex.r,"");
		}
		var get_paths = this.getImportAndUsings(code);
		var format = "";
		var _g = 0;
		var _g1 = get_paths.paths;
		while(_g < _g1.length) {
			var data = _g1[_g];
			++_g;
			format += data;
		}
		try {
			var check_class = new EReg("(^class\\s(Test|Main)(\n|\\s|\\S))","mg");
			var code_content = get_paths.code;
			var class_entry = "Main";
			if(check_class.match(get_paths.code)) {
				var parsed = check_class.matched(0);
				if(parsed.indexOf("Test") != -1) {
					code_content = StringTools.replace(code_content,"class Test","class Main");
				}
			} else {
				code_content = "class " + class_entry + " {\n\tstatic function main() {\n\t\t" + get_paths.code + "\n\t}\n}";
			}
			code_content = format + "\n" + code_content;
			var http = new haxe_http_HttpNodeJs("http://" + this.site + ":1337");
			http.setHeader("Authorization","Basic " + Main.keys.haxelib);
			http.onError = function(error) {
				haxe_Log.trace(error,{ fileName : "src/commands/Run2.hx", lineNumber : 296, className : "commands.Run2", methodName : "runCodeOnThread"});
			};
			http.onData = function(response) {
				var parse = JSON.parse(response);
				switch(parse.status) {
				case "OhNo":
					var compile_output = _gthis.cleanOutput(parse.error,null,class_entry);
					var errs = "";
					var _g = 0;
					var _g1 = parse.error.split("\n");
					while(_g < _g1.length) {
						var line = _g1[_g];
						++_g;
						var split = line.split("/");
						errs += split[split.length - 1] + "\n";
					}
					var embed = _gthis.parseError(errs,code_content);
					if(embed == null) {
						message.reply({ allowedMentions : { parse : []}, content : mention + ("```\n" + compile_output + "```")});
					} else {
						message.reply({ allowedMentions : { parse : []}, embeds : [embed]});
					}
					break;
				case "Ok":
					var resp = "";
					var x = parse.output.split("\n");
					var truncate = false;
					var max_lines = 40;
					if(parse.output.length > 3500) {
						truncate = true;
						if(message.channel.id == "663246792426782730") {
							max_lines = 105;
						}
					}
					var _g = 0;
					while(_g < x.length) {
						var line = x[_g];
						++_g;
						var data = line + "\n";
						if(resp.length + data.length > 3000) {
							break;
						}
						resp += data;
					}
					resp = resp.substring(0,resp.lastIndexOf("\n"));
					var cembed = new discord_$js_MessageEmbed();
					var oembed = new discord_$js_MessageEmbed();
					cembed.type = "article";
					oembed.type = "article";
					var code_output = "";
					var split = resp.split("\n");
					var _g_current = 0;
					var _g_array = split;
					while(_g_current < _g_array.length) {
						var _g_value = _g_array[_g_current];
						var _g_key = _g_current++;
						var key = _g_key;
						var item = _g_value;
						if(key >= split.length - 1) {
							break;
						}
						code_output += "" + key + ". " + item + " \n";
					}
					code_output = _gthis.cleanOutput(code_output,"Main.hx","Main");
					if(truncate) {
						code_output += "\n//Output has been trimmed.";
					}
					var cdesc = "**Code:**\n```hx\n" + get_paths.code + "\n```";
					var odesc = "**Output:**\n ```markdown\n" + code_output + "```";
					var embeds = [];
					if(truncate) {
						oembed.setDescription(odesc);
					} else {
						cdesc += "\n" + odesc;
					}
					cembed.setDescription(cdesc);
					embeds.push(cembed);
					if(truncate) {
						embeds.push(oembed);
					}
					var url = _gthis.codeSource(message.content);
					var author = { name : "@" + message.author.username, iconURL : message.author.displayAvatarURL()};
					if(url == "") {
						cembed.setAuthor(author);
					} else {
						var tag = url.split("#")[1];
						cembed.setTitle("TryHaxe #" + tag);
						cembed.setURL(url);
						cembed.setAuthor(author);
					}
					var date = new Date(message.createdTimestamp);
					var format_date = DateTools.format(date,"%d-%m-%Y %H:%M:%S");
					var which = truncate ? oembed : cembed;
					which.setFooter({ text : "Haxe " + _gthis.haxe_version, iconURL : "https://cdn.discordapp.com/emojis/567741748172816404.png?v=1"});
					if(resp.length > 0) {
						message.reply({ allowedMentions : { parse : []}, embeds : embeds}).then(function(succ) {
							haxe_Log.trace("" + message.author.tag + " at " + format_date + " with file id:",{ fileName : "src/commands/Run2.hx", lineNumber : 395, className : "commands.Run2", methodName : "runCodeOnThread"});
							if(message.deletable) {
								message.delete().then(null,function(err) {
									haxe_Log.trace(err,{ fileName : "src/commands/Run2.hx", lineNumber : 398, className : "commands.Run2", methodName : "runCodeOnThread"});
									$global.console.dir(err);
								});
							}
						},function(err) {
							haxe_Log.trace(err,{ fileName : "src/commands/Run2.hx", lineNumber : 403, className : "commands.Run2", methodName : "runCodeOnThread"});
							$global.console.dir(err);
						});
						return;
					}
					break;
				}
			};
			var libstr = "";
			var _g = 0;
			while(_g < libs.length) {
				var lib = libs[_g];
				++_g;
				libstr += "" + lib;
			}
			var request = { action : "run", input : code_content, hxml : libstr};
			haxe_Log.trace(request,{ fileName : "src/commands/Run2.hx", lineNumber : 439, className : "commands.Run2", methodName : "runCodeOnThread"});
			var str = JSON.stringify(request);
			http.setPostData(str);
			http.request(true);
			return;
		} catch( _g ) {
			haxe_NativeStackTrace.lastError = _g;
			var e = haxe_Exception.caught(_g).unwrap();
			haxe_Log.trace(e,{ fileName : "src/commands/Run2.hx", lineNumber : 613, className : "commands.Run2", methodName : "runCodeOnThread"});
			this.channel.send({ content : mention + "Code failed to execute."});
		}
	}
	,get_base_path: function() {
		var path = haxe_io_Path.isAbsolute(".") ? "." : js_node_Path.resolve(".");
		if(!sys_FileSystem.exists(path + "/haxebot")) {
			sys_FileSystem.createDirectory(path + "/haxebot");
		}
		path += "/haxebot";
		var date = DateTools.format(new Date(),"%F");
		path += "/" + date;
		if(!sys_FileSystem.exists(path)) {
			sys_FileSystem.createDirectory(path);
		}
		if(!sys_FileSystem.exists(path + "/hx")) {
			sys_FileSystem.createDirectory(path + "/hx");
		}
		if(!sys_FileSystem.exists(path + "/bin")) {
			sys_FileSystem.createDirectory(path + "/bin");
		}
		return path;
	}
	,get_name: function() {
		return "!run";
	}
	,__class__: commands_Run2
	,__properties__: $extend(systems_TextCommandBase.prototype.__properties__,{get_base_path:"get_base_path"})
});
var commands_Say = function(_universe) {
	systems_CommandBase.call(this,_universe);
};
$hxClasses["commands.Say"] = commands_Say;
commands_Say.__name__ = "commands.Say";
commands_Say.__super__ = systems_CommandBase;
commands_Say.prototype = $extend(systems_CommandBase.prototype,{
	run: function(command,interaction) {
		var _g = command.content;
		if(_g._hx_index == 17) {
			var _gmessage_id = _g.message_id;
			var message = _g.message;
			if(_gmessage_id == null) {
				interaction.channel.sendTyping().then(function(_) {
					interaction.channel.send({ content : message}).then(null,function(err) {
						haxe_Log.trace(err,{ fileName : "src/commands/Say.hx", lineNumber : 13, className : "commands.Say", methodName : "run"});
					});
					return interaction.reply({ content : "sent", ephemeral : true}).then(null,function(err) {
						haxe_Log.trace(err,{ fileName : "src/commands/Say.hx", lineNumber : 14, className : "commands.Say", methodName : "run"});
					});
				});
			} else {
				interaction.channel.messages.fetch(_gmessage_id).then(function(reply) {
					reply.reply({ content : message}).then(null,function(err) {
						haxe_Log.trace(err,{ fileName : "src/commands/Say.hx", lineNumber : 19, className : "commands.Say", methodName : "run"});
					});
					interaction.reply({ content : "sent", ephemeral : true}).then(null,function(err) {
						haxe_Log.trace(err,{ fileName : "src/commands/Say.hx", lineNumber : 20, className : "commands.Say", methodName : "run"});
					});
				},function(err) {
					haxe_Log.trace(err,{ fileName : "src/commands/Say.hx", lineNumber : 21, className : "commands.Say", methodName : "run"});
				});
			}
		}
	}
	,get_name: function() {
		return "say";
	}
	,__class__: commands_Say
});
var commands_ScamPrevention = function(_universe) {
	this.hold_list = new haxe_ds_StringMap();
	this.queue_time = 10000;
	this.last_message_interval = 5000;
	this.phishing_urls = [];
	this.trigger_messages = new haxe_ds_StringMap();
	this.user_list = new haxe_ds_StringMap();
	this.sequential_tags = new haxe_ds_StringMap();
	this.time_since = new haxe_ds_StringMap();
	systems_CommandBase.call(this,_universe);
	this.messages = this.universe.families.get(3);
	this.table87a8f92f715c03d0822a55d9b93a210d = this.universe.components.getTable(5);
	this.tabled1cd3067ebd0108e92f1425a40ea7b45 = this.universe.components.getTable(1);
};
$hxClasses["commands.ScamPrevention"] = commands_ScamPrevention;
commands_ScamPrevention.__name__ = "commands.ScamPrevention";
commands_ScamPrevention.__super__ = systems_CommandBase;
commands_ScamPrevention.prototype = $extend(systems_CommandBase.prototype,{
	time_since: null
	,sequential_tags: null
	,user_list: null
	,trigger_messages: null
	,phishing_urls: null
	,phishing_update_time: null
	,last_message_interval: null
	,queue_time: null
	,hold_list: null
	,singleMessageCheck: function(message) {
		if(message.content.indexOf("@everyone") == -1 && message.content.indexOf("@here") == -1) {
			return false;
		}
		if(this.hasLink(message.content)) {
			return true;
		}
		if(this.checkContent([message])) {
			return true;
		}
		return false;
	}
	,hasLink: function(message) {
		var markdown = new EReg("\\[.*?\\]\\(.*?\\)","gmi");
		if(markdown.match(message)) {
			return true;
		}
		var https = new EReg("https://.*?\\..*?[/|\\s]","gmi");
		if(https.match(message)) {
			return true;
		}
		return false;
	}
	,update: function(_) {
		systems_CommandBase.prototype.update.call(this,_);
		var _this = this.messages;
		var _set = _this.entities;
		var _active = _this.isActive();
		var _g_idx = _set.size() - 1;
		while(_active && _g_idx >= 0) {
			var entity = _set.getDense(_g_idx--);
			var forward = this.table87a8f92f715c03d0822a55d9b93a210d.get(entity);
			var message = this.tabled1cd3067ebd0108e92f1425a40ea7b45.get(entity);
			if(forward != "scam_prevention") {
				continue;
			}
			if(this.singleMessageCheck(message)) {
				this.hold_list.h[message.id] = message;
			}
			if(Util_withinTime(message.createdTimestamp,this.last_message_interval)) {
				var user = message.author.id;
				var this1 = this.time_since;
				var value = new Date().getTime();
				this1.h[user] = value;
				this.addMessage(message.author.id,message);
			}
			this.universe.deleteEntity(entity);
		}
		var _gthis = this;
		if(!(new Date().getTime() - this.phishing_update_time < 21600000)) {
			this.phishing_update_time = new Date().getTime();
			var links = new haxe_http_HttpNodeJs("https://raw.githubusercontent.com/Discord-AntiScam/scam-links/main/urls.json");
			links.onData = function(data) {
				try {
					_gthis.phishing_urls = JSON.parse(data);
				} catch( _g ) {
					var _g1 = haxe_Exception.caught(_g);
					haxe_Log.trace(_g1,{ fileName : "src/commands/ScamPrevention.hx", lineNumber : 184, className : "commands.ScamPrevention", methodName : "getPhishingLinks"});
					haxe_Log.trace("error parsing phishing links",{ fileName : "src/commands/ScamPrevention.hx", lineNumber : 185, className : "commands.ScamPrevention", methodName : "getPhishingLinks"});
					var tmp = new Date().getTime();
					_gthis.phishing_update_time = tmp - 18000000;
				}
			};
			links.request();
		}
		var h = this.trigger_messages.h;
		var messages_keys = Object.keys(h);
		var messages_length = messages_keys.length;
		var messages_current = 0;
		while(messages_current < messages_length) {
			var messages = h[messages_keys[messages_current++]];
			if(this.checkPhishingLinks(messages)) {
				this.banUser(messages);
				continue;
			}
			if(messages.length < 3) {
				continue;
			}
			var _g = 0;
			while(_g < messages.length) {
				var m = messages[_g];
				++_g;
				if(Object.prototype.hasOwnProperty.call(this.hold_list.h,m.id)) {
					var key = m.id;
					var _this = this.hold_list;
					if(Object.prototype.hasOwnProperty.call(_this.h,key)) {
						delete(_this.h[key]);
					}
				}
			}
			var review = false;
			if(this.checkTags(messages)) {
				review = true;
			}
			if(this.checkContent(messages)) {
				review = true;
			}
			if(this.checkEquality(messages)) {
				review = true;
			}
			var channel_count = 0;
			var _g_current = 0;
			while(_g_current < messages.length) {
				var _g_value = messages[_g_current];
				var _g_key = _g_current++;
				if(_g_key == 0) {
					continue;
				}
				var last = messages[_g_key - 1];
				if(last.channel.id != _g_value.channel.id) {
					++channel_count;
				}
			}
			if(channel_count <= 2) {
				review = false;
			}
			if(!review) {
				continue;
			}
			this.reviewMessage(messages);
			var id = messages[0].author.id;
			var _this1 = this.time_since;
			if(Object.prototype.hasOwnProperty.call(_this1.h,id)) {
				delete(_this1.h[id]);
			}
			var _this2 = this.user_list;
			if(Object.prototype.hasOwnProperty.call(_this2.h,id)) {
				delete(_this2.h[id]);
			}
			var _this3 = this.trigger_messages;
			if(Object.prototype.hasOwnProperty.call(_this3.h,id)) {
				delete(_this3.h[id]);
			}
		}
		var h = this.hold_list.h;
		var _g_keys = Object.keys(h);
		var _g_length = _g_keys.length;
		var _g_current = 0;
		while(_g_current < _g_length) {
			var key = _g_keys[_g_current++];
			var _g_value = h[key];
			haxe_Log.trace(_g_value.createdTimestamp,{ fileName : "src/commands/ScamPrevention.hx", lineNumber : 126, className : "commands.ScamPrevention", methodName : "update"});
			if(Util_withinTime(_g_value.createdTimestamp,this.queue_time)) {
				continue;
			}
			this.reviewMessage([_g_value]);
			var id = _g_value.author.id;
			var _this = this.time_since;
			if(Object.prototype.hasOwnProperty.call(_this.h,id)) {
				delete(_this.h[id]);
			}
			var _this1 = this.user_list;
			if(Object.prototype.hasOwnProperty.call(_this1.h,id)) {
				delete(_this1.h[id]);
			}
			var _this2 = this.trigger_messages;
			if(Object.prototype.hasOwnProperty.call(_this2.h,id)) {
				delete(_this2.h[id]);
			}
			var _this3 = this.hold_list;
			if(Object.prototype.hasOwnProperty.call(_this3.h,key)) {
				delete(_this3.h[key]);
			}
		}
		var h = this.time_since.h;
		var _g_keys = Object.keys(h);
		var _g_length = _g_keys.length;
		var _g_current = 0;
		while(_g_current < _g_length) {
			var key = _g_keys[_g_current++];
			var _g_value = h[key];
			if(new Date().getTime() - _g_value > this.last_message_interval) {
				var _this = this.time_since;
				if(Object.prototype.hasOwnProperty.call(_this.h,key)) {
					delete(_this.h[key]);
				}
				var _this1 = this.user_list;
				if(Object.prototype.hasOwnProperty.call(_this1.h,key)) {
					delete(_this1.h[key]);
				}
				var _this2 = this.trigger_messages;
				if(Object.prototype.hasOwnProperty.call(_this2.h,key)) {
					delete(_this2.h[key]);
				}
			}
		}
	}
	,reviewMessage: function(messages) {
		var message = messages[0];
		var embed = this.reformatMessage("SPAM ALERT - Timed out",message);
		this.timeoutUser(message,function(_) {
			message.reply({ content : "<@&198916468312637440> Please review this message by: <@" + message.author.id + ">", embeds : [embed]}).then(function(_) {
				var _g = 0;
				while(_g < messages.length) {
					var message = messages[_g];
					++_g;
					message.delete().then(null,function(err) {
						haxe_Log.trace(err,{ fileName : "src/commands/ScamPrevention.hx", lineNumber : 155, className : "commands.ScamPrevention", methodName : "reviewMessage"});
						$global.console.dir(err);
					});
				}
			},function(err) {
				haxe_Log.trace(err,{ fileName : "src/commands/ScamPrevention.hx", lineNumber : 160, className : "commands.ScamPrevention", methodName : "reviewMessage"});
				$global.console.dir(err);
			});
		});
	}
	,resetChecks: function(id) {
		var _this = this.time_since;
		if(Object.prototype.hasOwnProperty.call(_this.h,id)) {
			delete(_this.h[id]);
		}
		var _this = this.user_list;
		if(Object.prototype.hasOwnProperty.call(_this.h,id)) {
			delete(_this.h[id]);
		}
		var _this = this.trigger_messages;
		if(Object.prototype.hasOwnProperty.call(_this.h,id)) {
			delete(_this.h[id]);
		}
	}
	,getPhishingLinks: function() {
		var _gthis = this;
		if(new Date().getTime() - this.phishing_update_time < 21600000) {
			return;
		}
		this.phishing_update_time = new Date().getTime();
		var links = new haxe_http_HttpNodeJs("https://raw.githubusercontent.com/Discord-AntiScam/scam-links/main/urls.json");
		links.onData = function(data) {
			try {
				_gthis.phishing_urls = JSON.parse(data);
			} catch( _g ) {
				var _g1 = haxe_Exception.caught(_g);
				haxe_Log.trace(_g1,{ fileName : "src/commands/ScamPrevention.hx", lineNumber : 184, className : "commands.ScamPrevention", methodName : "getPhishingLinks"});
				haxe_Log.trace("error parsing phishing links",{ fileName : "src/commands/ScamPrevention.hx", lineNumber : 185, className : "commands.ScamPrevention", methodName : "getPhishingLinks"});
				var tmp = new Date().getTime();
				_gthis.phishing_update_time = tmp - 18000000;
			}
		};
		links.request();
	}
	,timeoutUser: function(message,callback) {
		var _gthis = this;
		message.guild.members.fetch(message.author.id).then(function(guild_member) {
			_gthis.logMessage(message.author.id,_gthis.reformatMessage("Original Message",message,false),"TIMEOUT");
			guild_member.timeout(43200000,"Stop spamming, a mod will review this at their convenience.").then(callback,function(err) {
				haxe_Log.trace(err,{ fileName : "src/commands/ScamPrevention.hx", lineNumber : 201, className : "commands.ScamPrevention", methodName : "timeoutUser"});
				$global.console.dir(err);
			});
			var id = message.author.id;
			var _this = _gthis.time_since;
			if(Object.prototype.hasOwnProperty.call(_this.h,id)) {
				delete(_this.h[id]);
			}
			var _this = _gthis.user_list;
			if(Object.prototype.hasOwnProperty.call(_this.h,id)) {
				delete(_this.h[id]);
			}
			var _this = _gthis.trigger_messages;
			if(Object.prototype.hasOwnProperty.call(_this.h,id)) {
				delete(_this.h[id]);
			}
		},function(err) {
			haxe_Log.trace(err,{ fileName : "src/commands/ScamPrevention.hx", lineNumber : 206, className : "commands.ScamPrevention", methodName : "timeoutUser"});
			$global.console.dir(err);
		});
	}
	,checkChannels: function(messages) {
		var channel_count = 0;
		var _g_current = 0;
		while(_g_current < messages.length) {
			var _g_value = messages[_g_current];
			var _g_key = _g_current++;
			if(_g_key == 0) {
				continue;
			}
			var last = messages[_g_key - 1];
			if(last.channel.id != _g_value.channel.id) {
				++channel_count;
			}
		}
		return channel_count > 2;
	}
	,banUser: function(messages,callback) {
		var _gthis = this;
		var message = messages[0];
		message.guild.members.fetch(message.author.id).then(function(guild_member) {
			var _g = 0;
			while(_g < messages.length) {
				var message1 = messages[_g];
				++_g;
				_gthis.logMessage(message1.author.id,_gthis.reformatMessage("Original Message",message1,false),"BAN");
			}
			guild_member.ban({ days : 1, reason : "found phishing links, auto banned."}).then(null,function(err) {
				haxe_Log.trace(err,{ fileName : "src/commands/ScamPrevention.hx", lineNumber : 236, className : "commands.ScamPrevention", methodName : "banUser"});
				$global.console.dir(err);
			});
			var id = message.author.id;
			var _this = _gthis.time_since;
			if(Object.prototype.hasOwnProperty.call(_this.h,id)) {
				delete(_this.h[id]);
			}
			var _this = _gthis.user_list;
			if(Object.prototype.hasOwnProperty.call(_this.h,id)) {
				delete(_this.h[id]);
			}
			var _this = _gthis.trigger_messages;
			if(Object.prototype.hasOwnProperty.call(_this.h,id)) {
				delete(_this.h[id]);
			}
			message.channel.send("User <@" + message.author.id + "> has been auto banned for sending scam links.").then(callback,function(err) {
				haxe_Log.trace(err,{ fileName : "src/commands/ScamPrevention.hx", lineNumber : 244, className : "commands.ScamPrevention", methodName : "banUser"});
				$global.console.dir(err);
			});
		},function(err) {
			haxe_Log.trace(err,{ fileName : "src/commands/ScamPrevention.hx", lineNumber : 248, className : "commands.ScamPrevention", methodName : "banUser"});
			$global.console.dir(err);
		});
	}
	,logMessage: function(id,embed,action) {
		var desc = embed.data.description;
		embed.setDescription(Std.string(desc) + (embed.data.description + ("\n\n Action: **__" + action + "__**")));
		Main.client.channels.fetch("952952631079362650").then(function(channel) {
			channel.send({ content : "<@" + id + ">", embeds : [embed]});
		},function(err) {
			haxe_Log.trace(err,{ fileName : "src/commands/ScamPrevention.hx", lineNumber : 259, className : "commands.ScamPrevention", methodName : "logMessage"});
			$global.console.dir(err);
		});
	}
	,checkContent: function(messages) {
		var keywords = ["$","crypto","market","profit","£","nudes","free","gift","steam","telegram","giftcard","whatsapp","girls","sexy","teen","port","nsfw","%","nitro","airdrop","forex","pay"];
		var _g = 0;
		while(_g < messages.length) {
			var m = messages[_g];
			++_g;
			var _g1 = 0;
			while(_g1 < keywords.length) {
				var key = keywords[_g1];
				++_g1;
				if(m.content.toLowerCase().indexOf(key) != -1) {
					return true;
				}
			}
		}
		return false;
	}
	,checkPhishingLinks: function(messages) {
		var _g = 0;
		while(_g < messages.length) {
			var message = messages[_g];
			++_g;
			var _g1 = 0;
			var _g2 = this.phishing_urls;
			while(_g1 < _g2.length) {
				var link = _g2[_g1];
				++_g1;
				if(message.content.indexOf(link) != -1) {
					var regex = new EReg("((((https?:)(?://)?)(?:[-;:&=\\+\\$,\\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\\+\\$,\\w]+@)[A-Za-z0-9.-]+)((?:/[\\+~%/.\\w_]*)?\\??(?:[-\\+=&;%@.\\w_]*)#?(?:[\\w]*))?)","gm");
					if(regex.match(message.content)) {
						var url = new URL(regex.matched(1));
						var arr = [new EReg("(.*)?.?(discordapp.com)","gu"),new EReg("(.*)?.?(twitch.tv)","gu")];
						var whitelisted = false;
						var _g3 = 0;
						while(_g3 < arr.length) {
							var url_host_regex = arr[_g3];
							++_g3;
							if(url_host_regex.match(url.hostname)) {
								whitelisted = true;
							}
						}
						if(whitelisted) {
							return false;
						}
						if(url.hostname.length == 0 || url.hostname == null) {
							haxe_Log.trace(regex.matched(1),{ fileName : "src/commands/ScamPrevention.hx", lineNumber : 296, className : "commands.ScamPrevention", methodName : "checkPhishingLinks"});
							return false;
						}
						if(link != url.hostname) {
							return false;
						}
						return true;
					}
				}
			}
		}
		return false;
	}
	,checkTags: function(messages) {
		var tag_count = 0;
		var _g = 0;
		while(_g < messages.length) {
			var message = messages[_g];
			++_g;
			if(message.content.indexOf("@everyone") != -1 || message.content.indexOf("@here") != -1) {
				if(tag_count >= 3) {
					break;
				}
				++tag_count;
			}
		}
		if(tag_count >= 3) {
			return true;
		}
		return false;
	}
	,checkEquality: function(messages) {
		var equality_count = 0;
		var channel_count = 0;
		var compare = messages[0];
		var _g = 0;
		while(_g < messages.length) {
			var message = messages[_g];
			++_g;
			try {
				var content = message.content;
				if(compare.content == content) {
					++equality_count;
				}
				if(compare.channel.id != message.channel.id) {
					++channel_count;
				}
			} catch( _g1 ) {
				var _g2 = haxe_Exception.caught(_g1);
				haxe_Log.trace(_g2,{ fileName : "src/commands/ScamPrevention.hx", lineNumber : 346, className : "commands.ScamPrevention", methodName : "checkEquality"});
				haxe_Log.trace(JSON.stringify(messages),{ fileName : "src/commands/ScamPrevention.hx", lineNumber : 347, className : "commands.ScamPrevention", methodName : "checkEquality"});
			}
		}
		if(equality_count == messages.length && equality_count >= 3 && channel_count >= 4) {
			return true;
		}
		return false;
	}
	,reformatMessage: function(title,message,format) {
		if(format == null) {
			format = true;
		}
		var embed = new discord_$js_MessageEmbed();
		var content = message.content;
		if(title != null) {
			embed.setTitle(title);
		}
		if(format) {
			var link_regex = new EReg("(https?://(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9])(:?\\d*)/?([a-z_/0-9\\-#.]*)\\??([a-z_/0-9\\-#=&]*)","ig");
			if(link_regex.match(content)) {
				content = content.replace(link_regex.r,"[Link Removed]");
			}
			var markdown_regex = new EReg("\\[.*\\)","ig");
			if(markdown_regex.match(content)) {
				content = content.replace(markdown_regex.r,"[Content Removed]");
			}
			content = StringTools.replace(content,"#","");
		}
		var rand = Math.random();
		var avatar = rand >= 0 && rand < 0.33 ? "https://github.com/Jarrio/Haxebot/blob/master/bin/resources/images/muffin_haxe_cop.png?raw=true&rf=1" : rand >= 0.33 && rand < 0.66 ? "https://github.com/Jarrio/Haxebot/blob/master/bin/resources/images/bulby_haxe_cop.png?raw=true" : "https://github.com/Jarrio/Haxebot/blob/master/bin/resources/images/bsod_haxe_cop.png?raw=true";
		embed.setAuthor({ name : "" + message.author.tag, iconURL : avatar});
		embed.setDescription(content);
		return embed;
	}
	,updateTime: function(user) {
		var this1 = this.time_since;
		var value = new Date().getTime();
		this1.h[user] = value;
	}
	,run: function(command,interaction) {
	}
	,get_timestamp: function() {
		return new Date().getTime();
	}
	,get_name: function() {
		return "scamprevention";
	}
	,addMessage: function(id,message) {
		var messages = this.trigger_messages.h[id];
		if(messages == null) {
			messages = [];
		}
		messages.push(message);
		this.trigger_messages.h[id] = messages;
	}
	,messages: null
	,table87a8f92f715c03d0822a55d9b93a210d: null
	,tabled1cd3067ebd0108e92f1425a40ea7b45: null
	,__class__: commands_ScamPrevention
	,__properties__: $extend(systems_CommandBase.prototype.__properties__,{get_timestamp:"get_timestamp"})
});
var commands_Showcase = function(_) {
	this.checking = false;
	this.channel_id = "162664383082790912";
	systems_CommandBase.call(this,_);
	this.modal = this.universe.families.get(6);
	this.messages = this.universe.families.get(3);
	this.interactions = this.universe.families.get(7);
	this.table57fe33dae47d23e66b521963cf6643b9 = this.universe.components.getTable(8);
	this.table87a8f92f715c03d0822a55d9b93a210d = this.universe.components.getTable(5);
	this.tabled1cd3067ebd0108e92f1425a40ea7b45 = this.universe.components.getTable(1);
	var hook = Main.keys.showcase_hook;
	this.webhook = new discord_$js_WebhookClient({ url : hook});
};
$hxClasses["commands.Showcase"] = commands_Showcase;
commands_Showcase.__name__ = "commands.Showcase";
commands_Showcase.__super__ = systems_CommandBase;
commands_Showcase.prototype = $extend(systems_CommandBase.prototype,{
	channel: null
	,channel_id: null
	,webhook: null
	,checking: null
	,update: function(_) {
		var _gthis = this;
		systems_CommandBase.prototype.update.call(this,_);
		if(this.channel == null && !this.checking) {
			this.checking = true;
			Main.client.channels.fetch(this.channel_id).then(function(channel) {
				_gthis.channel = channel;
				_gthis.checking = false;
				haxe_Log.trace("loaded showcase channel",{ fileName : "src/commands/Showcase.hx", lineNumber : 47, className : "commands.Showcase", methodName : "update"});
			},function(err) {
				haxe_Log.trace(err,{ fileName : "src/commands/Showcase.hx", lineNumber : 49, className : "commands.Showcase", methodName : "update"});
				$global.console.dir(err);
			});
		}
		if(this.channel == null) {
			return;
		}
		var _this = this.modal;
		var _set = _this.entities;
		var _g_set = _set;
		var _g_active = _this.isActive();
		var _g_idx = _set.size() - 1;
		while(_g_active && _g_idx >= 0) {
			var entity = _g_set.getDense(_g_idx--);
			var modal = this.table57fe33dae47d23e66b521963cf6643b9.get(entity);
			var command = [this.table5d38588a6ddd880f90fc8234bccb893f.get(entity)];
			this.channel.send("" + modal.title_or_link + " \n " + modal.description).then((function(command) {
				return function(_) {
					command[0].reply("Your post was submitted to the showcase channel!");
				};
			})(command));
			this.universe.deleteEntity(entity);
		}
		var _this = this.messages;
		var _set = _this.entities;
		var _g_set = _set;
		var _g_active = _this.isActive();
		var _g_idx = _set.size() - 1;
		while(_g_active && _g_idx >= 0) {
			var entity = _g_set.getDense(_g_idx--);
			var command1 = this.table87a8f92f715c03d0822a55d9b93a210d.get(entity);
			var message = [this.tabled1cd3067ebd0108e92f1425a40ea7b45.get(entity)];
			switch(command1) {
			case "showcase":
				var thread = [js_Boot.__cast(message[0].channel , discord_$js_ThreadChannel)];
				if(!message[0].channel.isThread()) {
					continue;
				}
				if(thread[0].id != "1024905470621798410") {
					if(thread[0].ownerId != message[0].author.id) {
						return;
					}
				}
				var arr = [[]];
				var content = [StringTools.trim(message[0].content.substring(10))];
				var jsIterator = message[0].attachments.values();
				var _g_jsIterator = jsIterator;
				var _g_lastStep = jsIterator.next();
				while(!_g_lastStep.done) {
					var v = _g_lastStep.value;
					_g_lastStep = _g_jsIterator.next();
					var a = v;
					arr[0].push(a);
					haxe_Log.trace(a,{ fileName : "src/commands/Showcase.hx", lineNumber : 103, className : "commands.Showcase", methodName : "update"});
				}
				var name = [message[0].author.username];
				if(message[0].member.nickname != null && message[0].member.nickname.length > 0) {
					name[0] = message[0].member.nickname;
				}
				var cont = [(function(name,thread,message) {
					return function() {
						return _gthis.webhook.send({ content : "***Continue the conversation at - <#" + thread[0].id + ">***", username : name[0], avatarURL : message[0].author.avatarURL()});
					};
				})(name,thread,message)];
				this.webhook.send({ content : content[0], username : name[0], avatarURL : message[0].author.avatarURL(), files : arr[0]}).then((function(cont) {
					return function(_) {
						cont[0]();
					};
				})(cont),(function(cont,name,content,arr,message) {
					return function(err) {
						if(err != null && err.message.indexOf("Request entity too large") != -1) {
							_gthis.webhook.send({ content : content[0] + "\n" + arr[0][0].url, username : name[0], avatarURL : message[0].author.avatarURL()}).then((function(cont) {
								return function(_) {
									cont[0]();
								};
							})(cont));
						}
					};
				})(cont,name,content,arr,message));
				this.universe.deleteEntity(entity);
				break;
			case "showcase_message":
				var regex = new EReg("https?://(?:www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b(?:[-a-zA-Z0-9()@:%_\\+.~#?&/=]*)","ig");
				if(!regex.match(message[0].content) && message[0].attachments.size == 0) {
					var content1 = "```\n" + message[0].content + "\n```";
					content1 += "\nYour message was removed due to not having any attachments or links. Please chat within threads only.\n";
					content1 += "**Showcase Channel guidelines:**\n\n";
					content1 += "1. Programming projects must be haxe related\n2. Comments on posts should be made within threads\n3. Art and Music showcases are allowed here";
					message[0].author.send({ content : content1}).then((function(message) {
						return function(succ) {
							message[0].delete().then(null,(function() {
								return function(err) {
									haxe_Log.trace(err,{ fileName : "src/commands/Showcase.hx", lineNumber : 78, className : "commands.Showcase", methodName : "update"});
								};
							})());
						};
					})(message),(function() {
						return function(err) {
							haxe_Log.trace(err,{ fileName : "src/commands/Showcase.hx", lineNumber : 80, className : "commands.Showcase", methodName : "update"});
							$global.console.dir(err);
						};
					})());
				}
				this.universe.deleteEntity(entity);
				break;
			default:
			}
		}
		var _this = this.interactions;
		var _set = _this.entities;
		var _g_set = _set;
		var _g_active = _this.isActive();
		var _g_idx = _set.size() - 1;
		while(_g_active && _g_idx >= 0) {
			var entity = _g_set.getDense(_g_idx--);
			var interaction = [this.table5d38588a6ddd880f90fc8234bccb893f.get(entity)];
			var command1 = this.table87a8f92f715c03d0822a55d9b93a210d.get(entity);
			if(command1 == "showcase_agree") {
				interaction[0].member.roles.add("1021517470080700468").then((function(interaction) {
					return function(success) {
						interaction[0].reply({ content : "Thanks! You can now post in <#162664383082790912>", ephemeral : true});
					};
				})(interaction),(function() {
					return function(err) {
						haxe_Log.trace(err,{ fileName : "src/commands/Showcase.hx", lineNumber : 149, className : "commands.Showcase", methodName : "update"});
						$global.console.dir(err);
					};
				})());
			}
			if(command1 == "showcase_disagree") {
				interaction[0].reply({ content : "Keep on lurking :)", ephemeral : true});
			}
			switch(command1) {
			case "showcase_agree":case "showcase_disagree":
				this.universe.deleteEntity(entity);
				break;
			default:
			}
		}
	}
	,run: function(command,interaction) {
		var agree_btn = new discord_$builder_ButtonBuilder().setCustomId("showcase_agree").setLabel("Agree").setStyle(1);
		var disagree_btn = new discord_$builder_ButtonBuilder().setCustomId("showcase_disagree").setLabel("Disagree").setStyle(2);
		var row = new discord_$builder_APIActionRowComponent().addComponents(agree_btn,disagree_btn);
		interaction.reply({ content : "If your post does not contain either an __**attachment**__ or a __**link**__, the post will be removed. Any comments on any of the works posted in the <#162664383082790912> channel should be made within threads. \n\n**Guidelines**\n1. Programming projects must be haxe related\n2. Comments on posts should be made within threads\n3. Art and Music showcases are allowed here", components : [row], ephemeral : true});
	}
	,get_name: function() {
		return "showcase";
	}
	,modal: null
	,messages: null
	,interactions: null
	,table57fe33dae47d23e66b521963cf6643b9: null
	,table87a8f92f715c03d0822a55d9b93a210d: null
	,tabled1cd3067ebd0108e92f1425a40ea7b45: null
	,__class__: commands_Showcase
});
var commands_Snippet = function(_universe) {
	this.cache = new haxe_ds_StringMap();
	this.results_per_page_no_desc = 20;
	this.results_per_page = 5;
	this.tags = [];
	this.sent = [];
	systems_CommandDbBase.call(this,_universe);
	this.button_events = this.universe.families.get(7);
	this.table87a8f92f715c03d0822a55d9b93a210d = this.universe.components.getTable(5);
};
$hxClasses["commands.Snippet"] = commands_Snippet;
commands_Snippet.__name__ = "commands.Snippet";
commands_Snippet.__super__ = systems_CommandDbBase;
commands_Snippet.prototype = $extend(systems_CommandDbBase.prototype,{
	sent: null
	,tags: null
	,results_per_page: null
	,results_per_page_no_desc: null
	,cache: null
	,onEnabled: function() {
		var _gthis = this;
		this.has_subcommands = true;
		firebase_web_firestore_Firestore.onSnapshot(firebase_web_firestore_Firestore.doc(firebase_web_firestore_Firestore.getFirestore(firebase_web_app_FirebaseApp.getApp()),"discord/snippets"),function(resp) {
			var arr = [];
			var _g = 0;
			var _g1 = resp.data().tags;
			while(_g < _g1.length) {
				var tag = _g1[_g];
				++_g;
				arr.push({ name : tag, value : tag});
			}
			_gthis.tags = arr;
			_gthis.tags.sort(function(a,b) {
				if(HxOverrides.cca(a.name,0) > HxOverrides.cca(b.name,0)) {
					return 1;
				}
				if(HxOverrides.cca(a.name,0) < HxOverrides.cca(b.name,0)) {
					return -1;
				}
				return 0;
			});
		});
	}
	,update: function(_) {
		var _gthis = this;
		systems_CommandDbBase.prototype.update.call(this,_);
		var _this = this.button_events;
		var _set = _this.entities;
		var _g_set = _set;
		var _g_active = _this.isActive();
		var _g_idx = _set.size() - 1;
		while(_g_active && _g_idx >= 0) {
			var entity = _g_set.getDense(_g_idx--);
			var interaction = this.table5d38588a6ddd880f90fc8234bccb893f.get(entity);
			var command = this.table87a8f92f715c03d0822a55d9b93a210d.get(entity);
			var cache = this.cache.h[interaction.user.id];
			if(cache != null) {
				switch(command) {
				case "snippet_left":
					if(cache.page - 1 >= 0) {
						var embed = this.formatResultOutput(cache,-1);
						cache.message.edit({ embeds : [embed]});
					}
					cache.interacted_at = new Date().getTime();
					interaction.deferUpdate().then(null,function(err) {
						haxe_Log.trace(err,{ fileName : "src/commands/Snippet.hx", lineNumber : 60, className : "commands.Snippet", methodName : "update"});
						$global.console.dir(err);
					});
					this.universe.deleteEntity(entity);
					break;
				case "snippet_right":
					var page = cache.page;
					var results_pp = cache.desc ? this.results_per_page : this.results_per_page_no_desc;
					var max = Math.ceil(cache.results.length / results_pp);
					if(page + 1 < max) {
						var embed1 = this.formatResultOutput(cache,1);
						cache.message.edit({ embeds : [embed1]});
					}
					cache.interacted_at = new Date().getTime();
					interaction.deferUpdate().then(null,function(err) {
						haxe_Log.trace(err,{ fileName : "src/commands/Snippet.hx", lineNumber : 74, className : "commands.Snippet", methodName : "update"});
						$global.console.dir(err);
					});
					this.universe.deleteEntity(entity);
					break;
				default:
				}
			}
			if(command == "snippet_left" || command == "snippet_right") {
				this.universe.deleteEntity(entity);
			}
		}
		var h = this.cache.h;
		var _g_h = h;
		var _g_keys = Object.keys(h);
		var _g_length = _g_keys.length;
		var _g_current = 0;
		while(_g_current < _g_length) {
			var key = _g_keys[_g_current++];
			var _g_key = key;
			var _g_value = _g_h[key];
			var key1 = [_g_key];
			var item = [_g_value];
			var now = new Date().getTime();
			var diff = now - item[0].interacted_at;
			if(diff < 30000) {
				continue;
			}
			item[0].interacted_at = now;
			var embed = this.formatResultOutput(item[0],0);
			item[0].message.edit({ embeds : [embed], components : []}).then((function(key) {
				return function(_) {
					var _this = _gthis.cache;
					if(Object.prototype.hasOwnProperty.call(_this.h,key[0])) {
						delete(_this.h[key[0]]);
					}
				};
			})(key1),(function(item,key) {
				return function(err) {
					if(item[0].message.deleted) {
						var _this = _gthis.cache;
						if(Object.prototype.hasOwnProperty.call(_this.h,key[0])) {
							delete(_this.h[key[0]]);
						}
					}
					haxe_Log.trace(err,{ fileName : "src/commands/Snippet.hx", lineNumber : 100, className : "commands.Snippet", methodName : "update"});
					$global.console.dir(err);
				};
			})(item,key1));
		}
	}
	,run: function(command,interaction) {
		var _gthis = this;
		var _g = command.content;
		switch(_g._hx_index) {
		case 3:
			var embed = new discord_$js_MessageEmbed();
			embed.setTitle("Tags");
			var _g_current = 0;
			var _g_array = this.tags;
			while(_g_current < _g_array.length) {
				var _g_value = _g_array[_g_current];
				var _g_key = _g_current++;
				var i = _g_key;
				var tag = _g_value;
				if(i % 2 == 0 && i != this.tags.length - 1) {
					embed.addFields(new discord_$js_Field(tag.name,this.tags[i + 1].name,true));
				}
				if(i == this.tags.length - 1) {
					embed.addFields(new discord_$js_Field(tag.name,"...",true));
				}
			}
			interaction.reply({ embeds : [embed]}).then(null,function(err) {
				haxe_Log.trace(err,{ fileName : "src/commands/Snippet.hx", lineNumber : 380, className : "commands.Snippet", methodName : "run"});
				$global.console.dir(err);
			});
			break;
		case 4:
			var user = _g.user;
			var show_desc = _g.show_desc;
			if(show_desc == null) {
				show_desc = true;
			}
			var q = firebase_web_firestore_Firestore.query(firebase_web_firestore_Firestore.collection(firebase_web_firestore_Firestore.getFirestore(firebase_web_app_FirebaseApp.getApp()),"discord/snippets/entries"),firebase_web_firestore_Firestore.orderBy("id","asc"));
			if(user != null) {
				q = firebase_web_firestore_Firestore.query(firebase_web_firestore_Firestore.collection(firebase_web_firestore_Firestore.getFirestore(firebase_web_app_FirebaseApp.getApp()),"discord/snippets/entries"),firebase_web_firestore_Firestore.where("submitted_by","==",user.id),firebase_web_firestore_Firestore.orderBy("id","asc"));
			}
			firebase_web_firestore_Firestore.getDocs(q).then(function(resp) {
				var res = [];
				var _g = 0;
				var _g1 = resp.docs;
				while(_g < _g1.length) {
					var doc = _g1[_g];
					++_g;
					res.push(doc.data());
				}
				var obj = { page : 0, desc : show_desc, message : null, results : res, interacted_at : new Date().getTime()};
				_gthis.handleSearchResponse(interaction,obj);
			},function(err) {
				haxe_Log.trace(err,{ fileName : "src/commands/Snippet.hx", lineNumber : 302, className : "commands.Snippet", methodName : "run"});
				$global.console.dir(err);
			});
			break;
		case 10:
			var id = _g.id;
			var q = firebase_web_firestore_Firestore.query(firebase_web_firestore_Firestore.collection(firebase_web_firestore_Firestore.getFirestore(firebase_web_app_FirebaseApp.getApp()),"discord/snippets/entries"),firebase_web_firestore_Firestore.where("id","==",id),firebase_web_firestore_Firestore.where("submitted_by","==",interaction.user.id));
			firebase_web_firestore_Firestore.getDocs(q).then(function(resp) {
				if(resp.empty && !interaction.isAutocomplete()) {
					interaction.reply("No snippets with that id were found that could belong to you");
					return;
				}
				if(interaction.isAutocomplete()) {
					var res = [];
					if(resp.docs.length > 0) {
						var data = resp.docs[0].data();
						res.push({ name : "" + data.id + " - " + data.title, value : "" + data.id});
					}
					interaction.respond(res);
					return;
				}
				interaction.reply("Editting currently not implemented");
			},function(err) {
				haxe_Log.trace(err,{ fileName : "src/commands/Snippet.hx", lineNumber : 330, className : "commands.Snippet", methodName : "run"});
				$global.console.dir(err);
			});
			break;
		case 11:
			var id = _g.id;
			var q = firebase_web_firestore_Firestore.query(firebase_web_firestore_Firestore.collection(firebase_web_firestore_Firestore.getFirestore(firebase_web_app_FirebaseApp.getApp()),"discord/snippets/entries"),firebase_web_firestore_Firestore.where("id","==",Std.parseInt(id)),firebase_web_firestore_Firestore.where("submitted_by","==",interaction.user.id));
			firebase_web_firestore_Firestore.getDocs(q).then(function(resp) {
				if(resp.empty && !interaction.isAutocomplete()) {
					interaction.reply("No snippets with that id were found that could belong to you");
					return;
				}
				if(interaction.isAutocomplete()) {
					var res = [];
					if(resp.docs.length > 0) {
						var data = resp.docs[0].data();
						res.push({ name : "" + data.id + " - " + data.title, value : "" + data.id});
					}
					interaction.respond(res);
					return;
				}
				firebase_web_firestore_Firestore.deleteDoc(resp.docs[0].ref).then(function(_) {
					interaction.reply("Your snippet(#" + id + ") has been deleted.");
				},function(err) {
					haxe_Log.trace(err,{ fileName : "src/commands/Snippet.hx", lineNumber : 359, className : "commands.Snippet", methodName : "run"});
					$global.console.dir(err);
				});
			},function(err) {
				haxe_Log.trace(err,{ fileName : "src/commands/Snippet.hx", lineNumber : 363, className : "commands.Snippet", methodName : "run"});
				$global.console.dir(err);
			});
			break;
		case 12:
			var taga = _g.taga;
			var tagb = _g.tagb;
			var tagc = _g.tagc;
			var restraints = [];
			var search = "";
			if(taga != null) {
				search = taga;
			}
			if(tagb != null) {
				search = tagb;
			}
			if(tagc != null) {
				search = tagc;
			}
			if(interaction.isAutocomplete()) {
				var results = this.autoComplete(search);
				interaction.respond(results);
				return;
			}
			if(this.isValidTag(taga)) {
				search = taga;
				restraints.push(taga);
			}
			if(this.isValidTag(tagb)) {
				search = tagb;
				restraints.push(tagb);
			}
			if(this.isValidTag(tagc)) {
				search = tagc;
				restraints.push(tagc);
			}
			if(restraints != null && restraints.length > 0) {
				var q = firebase_web_firestore_Firestore.query(firebase_web_firestore_Firestore.collection(firebase_web_firestore_Firestore.getFirestore(firebase_web_app_FirebaseApp.getApp()),"discord/snippets/entries"),firebase_web_firestore_Firestore.where("tags","array-contains-any",restraints));
				firebase_web_firestore_Firestore.getDocs(q).then(function(resp) {
					var res = [];
					var _g = 0;
					var _g1 = resp.docs;
					while(_g < _g1.length) {
						var doc = _g1[_g];
						++_g;
						res.push(doc.data());
					}
					res = _gthis.matchTags(restraints,res);
					var obj = { page : 0, desc : true, message : null, results : res, interacted_at : new Date().getTime()};
					_gthis.handleSearchResponse(interaction,obj);
				},function(err) {
					haxe_Log.trace(err,{ fileName : "src/commands/Snippet.hx", lineNumber : 269, className : "commands.Snippet", methodName : "run"});
					$global.console.dir(err);
				});
			}
			break;
		case 13:
			var url = _g.url;
			var title = _g.title;
			var description = _g.description;
			var taga = _g.taga;
			var tagb = _g.tagb;
			var tagc = _g.tagc;
			var tagd = _g.tagd;
			var tage = _g.tage;
			var ac = taga;
			var obj = { id : -1, submitted_by : interaction.user.id, timestamp : new Date().getTime(), title : title, description : description, url : url, tags : [taga]};
			if(tagb != null) {
				ac = tagb;
				obj.tags.push(tagb);
			}
			if(tagc != null) {
				ac = tagc;
				obj.tags.push(tagc);
			}
			if(tagd != null) {
				ac = tagd;
				obj.tags.push(tagd);
			}
			if(tage != null) {
				ac = tage;
				obj.tags.push(tage);
			}
			if(interaction.isAutocomplete()) {
				var results = this.autoComplete(ac);
				interaction.respond(results);
				return;
			}
			if(!this.validateURL(url)) {
				interaction.reply("Invalid URL format");
				return;
			}
			if(url.charAt(url.length - 1) == "/") {
				url = url.substring(0,url.length - 1);
			}
			var _g = 0;
			var _g1 = obj.tags;
			while(_g < _g1.length) {
				var tag = _g1[_g];
				++_g;
				var found = false;
				var _g2 = 0;
				var _g3 = this.tags;
				while(_g2 < _g3.length) {
					var v = _g3[_g2];
					++_g2;
					if(tag == v.name) {
						found = true;
						break;
					}
				}
				if(!found) {
					interaction.reply("The tag __" + tag + "__ is not available as an option currently.");
					return;
				}
			}
			var q = firebase_web_firestore_Firestore.query(firebase_web_firestore_Firestore.collection(firebase_web_firestore_Firestore.getFirestore(firebase_web_app_FirebaseApp.getApp()),"discord/snippets/entries"),firebase_web_firestore_Firestore.where("url","==",url));
			firebase_web_firestore_Firestore.getDocs(q).then(function(resp) {
				if(!resp.empty) {
					interaction.reply("Snippet already exists");
					return;
				}
				var doc = firebase_web_firestore_Firestore.doc(firebase_web_firestore_Firestore.getFirestore(firebase_web_app_FirebaseApp.getApp()),"discord/snippets");
				firebase_web_firestore_Firestore.runTransaction(firebase_web_firestore_Firestore.getFirestore(firebase_web_app_FirebaseApp.getApp()),function(transaction) {
					return transaction.get(doc).then(function(doc) {
						if(!doc.exists()) {
							return { id : -1};
						}
						var data = doc.data();
						data.id += 1;
						transaction.update(doc.ref,data);
						return data;
					});
				}).then(function(value) {
					obj.id = value.id;
					obj.tags.splice(0,0,"" + value.id);
					firebase_web_firestore_Firestore.addDoc(firebase_web_firestore_Firestore.collection(firebase_web_firestore_Firestore.getFirestore(firebase_web_app_FirebaseApp.getApp()),"discord/snippets/entries"),obj).then(function(_) {
						interaction.reply("*Snippet #" + value.id + " added!*\ntitle: " + title + "\n" + description + "\n");
					},function(err) {
						haxe_Log.trace(err,{ fileName : "src/commands/Snippet.hx", lineNumber : 200, className : "commands.Snippet", methodName : "run"});
						$global.console.dir(err);
					});
				},function(err) {
					haxe_Log.trace(err,{ fileName : "src/commands/Snippet.hx", lineNumber : 204, className : "commands.Snippet", methodName : "run"});
					$global.console.dir(err);
				});
			},function(err) {
				haxe_Log.trace(err,{ fileName : "src/commands/Snippet.hx", lineNumber : 208, className : "commands.Snippet", methodName : "run"});
				$global.console.dir(err);
			});
			break;
		default:
		}
	}
	,matchTags: function(tags,results) {
		var arr = [];
		var _g = 0;
		while(_g < results.length) {
			var r = results[_g];
			++_g;
			var matches = 0;
			var _g1 = 0;
			var _g2 = r.tags;
			while(_g1 < _g2.length) {
				var rtag = _g2[_g1];
				++_g1;
				if(tags.indexOf(rtag) != -1) {
					++matches;
				}
			}
			if(matches == tags.length) {
				arr.push(r);
			}
		}
		return arr;
	}
	,handleSearchResponse: function(interaction,state) {
		var _gthis = this;
		var builder = new discord_$builder_APIActionRowComponent();
		builder.addComponents(new discord_$builder_ButtonBuilder().setCustomId("snippet_left").setLabel("Prev").setStyle(1),new discord_$builder_ButtonBuilder().setCustomId("snippet_right").setLabel("Next").setStyle(1));
		var arr = [];
		var results_pp = state.desc ? this.results_per_page : this.results_per_page_no_desc;
		var max = Math.ceil(state.results.length / results_pp);
		if(max > 1) {
			arr = [builder];
		}
		var embed = this.formatResultOutput(state,0);
		var eph = false;
		if(embed.data.description == "No results found") {
			eph = true;
		}
		interaction.reply({ embeds : [embed], components : arr, ephemeral : eph, fetchReply : true}).then(function(message) {
			if(!eph || max == 1) {
				state.message = message;
				_gthis.cache.h[interaction.user.id] = state;
			}
		},function(err) {
			haxe_Log.trace(err,{ fileName : "src/commands/Snippet.hx", lineNumber : 434, className : "commands.Snippet", methodName : "handleSearchResponse"});
			$global.console.dir(err);
		});
	}
	,formatResultOutput: function(state,forward) {
		var embed = new discord_$js_MessageEmbed();
		var desc = "No results found";
		var results = state.results;
		var results_pp = state.desc ? this.results_per_page : this.results_per_page_no_desc;
		var max = Math.ceil(results.length / results_pp);
		embed.setTitle("Snippets");
		if(results.length > 0) {
			desc = "";
			if(forward == -1) {
				state.page -= 1;
			}
			if(forward == 1) {
				state.page += 1;
			}
			var start = 0;
			if(state.page > 0) {
				start = state.page * results_pp;
			}
			var end = start + results_pp;
			if(start < 0) {
				start = 0;
			}
			if(end > results.length) {
				end = results.length;
			}
			var _this = results.slice(start,end);
			var _g_current = 0;
			while(_g_current < _this.length) {
				var _g_value = _this[_g_current];
				var _g_key = _g_current++;
				var count = start + _g_key + 1;
				desc += "**" + count + ") [" + _g_value.title + "](" + _g_value.url + ")**\n";
				if(state.desc) {
					desc += "***tags: " + StringTools.replace(_g_value.tags.slice(1).toString(),",",", ") + "***\n";
					desc += _g_value.description + "\n";
				}
			}
		}
		embed.setColor(15368736);
		embed.setDescription(desc);
		if(results.length > 0) {
			embed.setFooter({ iconURL : "https://cdn.discordapp.com/emojis/567741748172816404.png?v=1", text : "Page " + (state.page + 1) + " / " + max});
		}
		return embed;
	}
	,validateURL: function(content) {
		var regex = new EReg("((((https?:)(?://)?)(?:[-;:&=\\+\\$,\\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\\+\\$,\\w]+@)[A-Za-z0-9.-]+)((?:/[\\+~%/.\\w_]*)?\\??(?:[-\\+=&;%@.\\w_]*)#?(?:[\\w]*))?)","gm");
		if(regex.match(content)) {
			return true;
		}
		return false;
	}
	,autoComplete: function(term) {
		var results = [];
		var algo = externs_FuzzySort.go(term,this.tags,{ key : "name", limit : 15, threshold : -1000});
		var _g = 0;
		while(_g < algo.length) {
			var a = algo[_g];
			++_g;
			results.push(a.obj);
		}
		if(results.length == 0) {
			results = this.tags.slice(0,20);
		}
		return results;
	}
	,isValidTag: function(tag) {
		var found = false;
		var _g = 0;
		var _g1 = this.tags;
		while(_g < _g1.length) {
			var v = _g1[_g];
			++_g;
			if(tag == v.name) {
				found = true;
				break;
			}
		}
		return found;
	}
	,createEmbed: function(obj) {
		var embed = new discord_$js_MessageEmbed();
		embed.setTitle(obj.title);
		embed.setURL(obj.url);
		embed.setDescription(obj.description);
	}
	,get_name: function() {
		return "snippet";
	}
	,button_events: null
	,table87a8f92f715c03d0822a55d9b93a210d: null
	,__class__: commands_Snippet
});
var commands_ThreadCount = function(_universe) {
	this.path = "./config/threadcount.json";
	this.count = new haxe_ds_StringMap();
	systems_CommandBase.call(this,_universe);
	this.messages = this.universe.families.get(3);
	this.table87a8f92f715c03d0822a55d9b93a210d = this.universe.components.getTable(5);
	this.tabled1cd3067ebd0108e92f1425a40ea7b45 = this.universe.components.getTable(1);
};
$hxClasses["commands.ThreadCount"] = commands_ThreadCount;
commands_ThreadCount.__name__ = "commands.ThreadCount";
commands_ThreadCount.__super__ = systems_CommandBase;
commands_ThreadCount.prototype = $extend(systems_CommandBase.prototype,{
	count: null
	,path: null
	,onEnabled: function() {
		if(sys_FileSystem.exists(this.path)) {
			this.count = JSON.parse(js_node_Fs.readFileSync(this.path,{ encoding : "utf8"}));
		}
	}
	,update: function(_) {
		systems_CommandBase.prototype.update.call(this,_);
		var _this = this.messages;
		var _set = _this.entities;
		var _active = _this.isActive();
		var _g_idx = _set.size() - 1;
		while(_active && _g_idx >= 0) {
			var entity = _set.getDense(_g_idx--);
			var command = this.table87a8f92f715c03d0822a55d9b93a210d.get(entity);
			var message = this.tabled1cd3067ebd0108e92f1425a40ea7b45.get(entity);
			if(command == "thread_count") {
				var count = -1;
				var channel = message.channel;
				if(Object.prototype.hasOwnProperty.call(this.count.h,channel.id)) {
					count = this.count.h[channel.id] + 1;
				} else {
					count = 1;
				}
				this.count.h[channel.id] = count;
				js_node_Fs.writeFileSync(this.path,JSON.stringify(this.count));
				this.universe.deleteEntity(entity);
			}
		}
	}
	,run: function(command,interaction) {
		if(Object.prototype.hasOwnProperty.call(this.count.h,interaction.channelId)) {
			var count = this.count.h[interaction.channelId];
			interaction.reply({ content : "This thread has " + count + " messages"}).then(null,function(err) {
				haxe_Log.trace(err,{ fileName : "src/commands/ThreadCount.hx", lineNumber : 51, className : "commands.ThreadCount", methodName : "run"});
				$global.console.dir(err);
			});
		} else {
			var content = "";
			switch(interaction.channel.type) {
			case 10:case 11:case 12:
				content = "Either a new thread or was created before 23/04/2024. Check back later.";
				break;
			default:
				content = "This is not a thread :angry:";
			}
			interaction.reply({ content : content}).then(null,function(err) {
				haxe_Log.trace(err,{ fileName : "src/commands/ThreadCount.hx", lineNumber : 63, className : "commands.ThreadCount", methodName : "run"});
				$global.console.dir(err);
			});
		}
	}
	,get_name: function() {
		return "threadcount";
	}
	,messages: null
	,table87a8f92f715c03d0822a55d9b93a210d: null
	,tabled1cd3067ebd0108e92f1425a40ea7b45: null
	,__class__: commands_ThreadCount
});
var commands_Translate = function(_universe) {
	systems_CommandBase.call(this,_universe);
};
$hxClasses["commands.Translate"] = commands_Translate;
commands_Translate.__name__ = "commands.Translate";
commands_Translate.__super__ = systems_CommandBase;
commands_Translate.prototype = $extend(systems_CommandBase.prototype,{
	usage: null
	,onEnabled: function() {
		this.getCount();
	}
	,run: function(command,interaction) {
		var _g = command.content;
		if(_g._hx_index == 26) {
			var _gmessage = _g.message;
			if(this.usage == null) {
				interaction.reply("An error occured");
				return;
			}
			if(this.usage.character_count + _gmessage.length > this.usage.character_limit) {
				interaction.reply("API has reached its limit unfortunately. Please wait till next month.");
				return;
			}
			this.getTranslation(interaction,_g.from,_g.to,_gmessage);
		}
	}
	,getCount: function() {
		var _gthis = this;
		externs_Fetch("https://api-free.deepl.com" + "/v2/usage",{ method : "GET", headers : { "Authorization" : "DeepL-Auth-Key " + Main.keys.deepl_key}}).then(function(resp) {
			return resp.json().then(function(body) {
				_gthis.usage = body;
				haxe_Log.trace("Character count: " + _gthis.usage.character_count + "/" + _gthis.usage.character_limit,{ fileName : "src/commands/Translate.hx", lineNumber : 39, className : "commands.Translate", methodName : "getCount"});
			},function(err) {
				haxe_Log.trace(err,{ fileName : "src/commands/Translate.hx", lineNumber : 43, className : "commands.Translate", methodName : "getCount"});
				$global.console.dir(err);
			});
		});
	}
	,getTranslation: function(interaction,from,to,message) {
		var _gthis = this;
		if(from == null) {
			from = "";
		}
		try {
			externs_Fetch("https://api-free.deepl.com" + ("/v2/translate?source_lang=" + from + "&target_lang=" + to + "&text=" + message),{ method : "GET", headers : { "Authorization" : "DeepL-Auth-Key " + Main.keys.deepl_key}}).then(function(resp) {
				return resp.json().then(function(body) {
					var content = "";
					var _g = 0;
					var _g1 = body.translations;
					while(_g < _g1.length) {
						var item = _g1[_g];
						++_g;
						content += item.text + "\n";
					}
					interaction.reply(content).then(function(_) {
						_gthis.getCount();
					},function(err) {
						haxe_Log.trace(err,{ fileName : "src/commands/Translate.hx", lineNumber : 66, className : "commands.Translate", methodName : "getTranslation"});
						$global.console.dir(err);
					});
				},function(err) {
					haxe_Log.trace(err,{ fileName : "src/commands/Translate.hx", lineNumber : 70, className : "commands.Translate", methodName : "getTranslation"});
					$global.console.dir(err);
				});
			});
		} catch( _g ) {
			var e = haxe_Exception.caught(_g);
			haxe_Log.trace("Deepl error",{ fileName : "src/commands/Translate.hx", lineNumber : 75, className : "commands.Translate", methodName : "getTranslation"});
			haxe_Log.trace($bind(e,e.details),{ fileName : "src/commands/Translate.hx", lineNumber : 76, className : "commands.Translate", methodName : "getTranslation"});
			haxe_Log.trace(e.get_message(),{ fileName : "src/commands/Translate.hx", lineNumber : 77, className : "commands.Translate", methodName : "getTranslation"});
			haxe_Log.trace(e,{ fileName : "src/commands/Translate.hx", lineNumber : 78, className : "commands.Translate", methodName : "getTranslation"});
			interaction.reply("Deepl error?").then(null,function(err) {
				haxe_Log.trace(err,{ fileName : "src/commands/Translate.hx", lineNumber : 80, className : "commands.Translate", methodName : "getTranslation"});
				$global.console.dir(err);
			});
		}
	}
	,getLanguages: function() {
		externs_Fetch("https://api-free.deepl.com" + "/v2/languages",{ method : "GET", headers : { "Authorization" : "DeepL-Auth-Key " + Main.keys.deepl_key}}).then(function(resp) {
			return resp.json().then(function(body) {
				var str = "[";
				var _g = 0;
				while(_g < body.length) {
					var item = body[_g];
					++_g;
					str += "{\r\n\t\t\t\t\t\t\"name\": \"" + item.name + "\",\r\n\t\t\t\t\t\t\"value\": \"" + item.language + "\"\r\n\t\t\t\t\t},";
				}
				str += "]";
				haxe_Log.trace(str,{ fileName : "src/commands/Translate.hx", lineNumber : 97, className : "commands.Translate", methodName : "getLanguages"});
			},function(err) {
				haxe_Log.trace(err,{ fileName : "src/commands/Translate.hx", lineNumber : 99, className : "commands.Translate", methodName : "getLanguages"});
				$global.console.dir(err);
			});
		});
	}
	,request: function(endpoint) {
		return externs_Fetch("https://api-free.deepl.com" + endpoint,{ method : "GET", headers : { "Authorization" : "DeepL-Auth-Key " + Main.keys.deepl_key}});
	}
	,get_name: function() {
		return "translate";
	}
	,__class__: commands_Translate
});
var commands_events_PinMessageInfo = function(_universe) {
	this.path = "./config/pinmessage.json";
	this.notified = new haxe_ds_StringMap();
	this.messages = [];
	ecs_System.call(this,_universe);
	this.threads = this.universe.families.get(4);
	this.table77d573418a21d66427b12280fbf7836b = this.universe.components.getTable(6);
	this.table87a8f92f715c03d0822a55d9b93a210d = this.universe.components.getTable(5);
};
$hxClasses["commands.events.PinMessageInfo"] = commands_events_PinMessageInfo;
commands_events_PinMessageInfo.__name__ = "commands.events.PinMessageInfo";
commands_events_PinMessageInfo.__super__ = ecs_System;
commands_events_PinMessageInfo.prototype = $extend(ecs_System.prototype,{
	messages: null
	,notified: null
	,path: null
	,onEnabled: function() {
		if(sys_FileSystem.exists(this.path)) {
			this.notified = JSON.parse(js_node_Fs.readFileSync(this.path,{ encoding : "utf8"}));
		}
	}
	,saveHistory: function(uid) {
		this.notified.h[uid] = true;
		js_node_Fs.writeFileSync(this.path,JSON.stringify(this.notified));
	}
	,update: function(_dt) {
		var _gthis = this;
		var _this = this.threads;
		var _set = _this.entities;
		var _g_set = _set;
		var _g_active = _this.isActive();
		var _g_idx = _set.size() - 1;
		while(_g_active && _g_idx >= 0) {
			var entity = _g_set.getDense(_g_idx--);
			var thread = [this.table77d573418a21d66427b12280fbf7836b.get(entity)];
			var command = this.table87a8f92f715c03d0822a55d9b93a210d.get(entity);
			if(command == "thread_pin_message") {
				if(Object.prototype.hasOwnProperty.call(this.notified.h,thread[0].ownerId) || thread[0].parentId == "162664383082790912") {
					this.universe.deleteEntity(entity);
					continue;
				}
				var now = new Date().getTime();
				if(now - thread[0].createdTimestamp < 10000) {
					continue;
				}
				thread[0].send({ content : "<@" + thread[0].ownerId + "> You can pin messages in your own threads by Right clicking a message -> Apps -> Pin Message\n\n*This message will selfdestruct in 30 seconds.*"}).then((function(thread) {
					return function(message) {
						_gthis.saveHistory(thread[0].ownerId);
						_gthis.messages.push(message);
					};
				})(thread),(function() {
					return function(err) {
						if((err != null ? err.message : null).indexOf("Unknown Channel") != -1) {
							return;
						}
						haxe_Log.trace(err,{ fileName : "src/commands/events/PinMessageInfo.hx", lineNumber : 49, className : "commands.events.PinMessageInfo", methodName : "update"});
						$global.console.dir(err);
					};
				})());
				this.universe.deleteEntity(entity);
			}
		}
		var now = new Date().getTime();
		var _g = 0;
		var _g1 = this.messages;
		while(_g < _g1.length) {
			var message = [_g1[_g]];
			++_g;
			if(now - message[0].createdTimestamp < 30000) {
				continue;
			}
			message[0].delete().then((function(message) {
				return function(_) {
					HxOverrides.remove(_gthis.messages,message[0]);
				};
			})(message),(function() {
				return function(err) {
					haxe_Log.trace(err,{ fileName : "src/commands/events/PinMessageInfo.hx", lineNumber : 64, className : "commands.events.PinMessageInfo", methodName : "update"});
				};
			})());
		}
	}
	,threads: null
	,table77d573418a21d66427b12280fbf7836b: null
	,table87a8f92f715c03d0822a55d9b93a210d: null
	,__class__: commands_events_PinMessageInfo
});
var commands_mod_RateLimit = function(_universe) {
	this.silence_role = "503359600712482827";
	this.records = false;
	this.limits = new haxe_ds_StringMap();
	this.tracking = new haxe_ds_StringMap();
	systems_CommandBase.call(this,_universe);
	this.messages = this.universe.families.get(3);
	this.table87a8f92f715c03d0822a55d9b93a210d = this.universe.components.getTable(5);
	this.tabled1cd3067ebd0108e92f1425a40ea7b45 = this.universe.components.getTable(1);
};
$hxClasses["commands.mod.RateLimit"] = commands_mod_RateLimit;
commands_mod_RateLimit.__name__ = "commands.mod.RateLimit";
commands_mod_RateLimit.__super__ = systems_CommandBase;
commands_mod_RateLimit.prototype = $extend(systems_CommandBase.prototype,{
	tracking: null
	,limits: null
	,records: null
	,silence_role: null
	,onEnabled: function() {
		var _gthis = this;
		var e = database_DBEvents.GetAllRecords("rate_limit",function(response) {
			if(response._hx_index == 2) {
				var r = response.data.iterator();
				while(r.hasNext()) {
					var r1 = r.next();
					var obj = database_types_DBRateLimit.fromRecord(r1);
					_gthis.limits.h[obj.user_id] = obj;
					if(!Object.prototype.hasOwnProperty.call(_gthis.tracking.h,obj.user_id)) {
						_gthis.setTracker(obj);
					}
				}
				_gthis.records = true;
			} else {
				haxe_Log.trace(response,{ fileName : "src/commands/mod/RateLimit.hx", lineNumber : 48, className : "commands.mod.RateLimit", methodName : "onEnabled"});
			}
		});
		var _ecsTmpEntity = this.universe.createEntity();
		this.universe.components.set(_ecsTmpEntity,2,e);
		var ecsEntCompFlags = this.universe.components.flags[ecs_Entity.id(_ecsTmpEntity)];
		var ecsTmpFamily = this.universe.families.get(1);
		if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
			ecsTmpFamily.add(_ecsTmpEntity);
		}
	}
	,update: function(_) {
		var _gthis = this;
		systems_CommandBase.prototype.update.call(this,_);
		if(!this.records) {
			return;
		}
		var _this = this.messages;
		var _set = _this.entities;
		var _active = _this.isActive();
		var _g_idx = _set.size() - 1;
		while(_active && _g_idx >= 0) {
			var entity = _set.getDense(_g_idx--);
			var command = this.table87a8f92f715c03d0822a55d9b93a210d.get(entity);
			var message = this.tabled1cd3067ebd0108e92f1425a40ea7b45.get(entity);
			if(command == "rate_limit") {
				var h = this.limits.h;
				var limit_keys = Object.keys(h);
				var limit_length = limit_keys.length;
				var limit_current = 0;
				while(limit_current < limit_length) {
					var limit = [h[limit_keys[limit_current++]]];
					var tmp;
					if(!(message.author.id != limit[0].user_id || limit[0].silenced > -1 || message.channel.id == "663246792426782730")) {
						var tmp1 = message.channel;
						var tmp2 = tmp1 != null ? tmp1 : null;
						tmp = (tmp2 != null ? tmp2.id : null) == "1311129828069740604";
					} else {
						tmp = true;
					}
					if(tmp) {
						continue;
					}
					var tracker = [this.tracking.h[limit[0].user_id]];
					if(tracker[0].counter >= limit[0].count) {
						tracker[0].last_message = message.createdTimestamp;
						tracker[0].member.roles.add(this.silence_role).then((function(tracker,limit) {
							return function(resp) {
								limit[0].silenced = tracker[0].last_message;
								_gthis.updateLimit(limit[0]);
							};
						})(tracker,limit),(function() {
							return function(err) {
								haxe_Log.trace(err,{ fileName : "src/commands/mod/RateLimit.hx", lineNumber : 78, className : "commands.mod.RateLimit", methodName : "update"});
							};
						})());
					} else {
						tracker[0].counter++;
					}
				}
				this.universe.deleteEntity(entity);
			}
		}
		var h = this.limits.h;
		var limit_keys = Object.keys(h);
		var limit_length = limit_keys.length;
		var limit_current = 0;
		while(limit_current < limit_length) {
			var limit1 = [h[limit_keys[limit_current++]]];
			if(limit1[0].silenced == -1 || !Object.prototype.hasOwnProperty.call(this.tracking.h,limit1[0].user_id)) {
				continue;
			}
			var now = new Date().getTime();
			var dur = util_Duration.fromString(limit1[0].time);
			var diff = limit1[0].silenced + dur;
			if(now > diff) {
				var tracker1 = [this.tracking.h[limit1[0].user_id]];
				tracker1[0].member.roles.remove(this.silence_role).then((function(tracker,limit) {
					return function(response) {
						limit[0].silenced = -1;
						tracker[0].counter = 1;
						_gthis.updateLimit(limit[0]);
					};
				})(tracker1,limit1),(function() {
					return function(err) {
						haxe_Log.trace(err,{ fileName : "src/commands/mod/RateLimit.hx", lineNumber : 104, className : "commands.mod.RateLimit", methodName : "update"});
					};
				})());
			}
		}
	}
	,updateLimit: function(limit) {
		var e = database_DBEvents.Update("rate_limit",limit.get_record(),QueryExpr.QueryBinop(QBinop.QOpEq,QueryExpr.QueryConstant(QConstant.QIdent("user_id")),QueryExpr.QueryValue(limit.user_id)),function(response) {
			if(response._hx_index != 4) {
				haxe_Log.trace(response,{ fileName : "src/commands/mod/RateLimit.hx", lineNumber : 115, className : "commands.mod.RateLimit", methodName : "updateLimit"});
			}
		});
		var entity = util_EcsTools.get_universe().createEntity();
		util_EcsTools.get_universe().components.set(entity,2,e);
		var ecsEntCompFlags = util_EcsTools.get_universe().components.flags[ecs_Entity.id(entity)];
		var ecsTmpFamily = util_EcsTools.get_universe().families.get(1);
		if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
			ecsTmpFamily.add(entity);
		}
	}
	,setTracker: function(obj) {
		var _gthis = this;
		var tracker = this.tracking.h[obj.user_id];
		if(!Object.prototype.hasOwnProperty.call(this.tracking.h,obj.user_id)) {
			Main.client.guilds.cache.get(Main.guild_id).members.fetch(obj.user_id).then(function(member) {
				tracker = { member : member, counter : 1, last_message : -1};
				haxe_Log.trace("Added " + obj.user_tag + " to list",{ fileName : "src/commands/mod/RateLimit.hx", lineNumber : 132, className : "commands.mod.RateLimit", methodName : "setTracker"});
				_gthis.tracking.h[obj.user_id] = tracker;
			},function(err) {
				haxe_Log.trace(err,{ fileName : "src/commands/mod/RateLimit.hx", lineNumber : 134, className : "commands.mod.RateLimit", methodName : "setTracker"});
			});
		}
	}
	,run: function(command,interaction) {
		var _gthis = this;
		var _g = command.content;
		switch(_g._hx_index) {
		case 8:
			var user = _g.user;
			var modid = interaction.user.id;
			var modtag = interaction.user.tag;
			var obj = new database_types_DBRateLimit(user.id,user.tag,modid,modtag,_g.counter,_g.time);
			obj.reason = _g.reason;
			this.setTracker(obj);
			var e = database_DBEvents.SearchAndUpdate("rate_limit","user_id",QueryExpr.QueryBinop(QBinop.QOpEq,QueryExpr.QueryConstant(QConstant.QIdent("user_id")),QueryExpr.QueryValue(obj.user_id)),obj.get_record(),function(response) {
				if(response._hx_index == 4) {
					var this1 = _gthis.limits;
					var key = user.id;
					var value = database_types_DBRateLimit.fromRecord(response.data);
					this1.h[key] = value;
					haxe_Log.trace("Inserted " + user.tag + " rate limit",{ fileName : "src/commands/mod/RateLimit.hx", lineNumber : 151, className : "commands.mod.RateLimit", methodName : "run"});
					interaction.reply({ content : "<@" + user.id + "> has been rate limited"}).then(null,function(err) {
						haxe_Log.trace(err,{ fileName : "src/commands/mod/RateLimit.hx", lineNumber : 154, className : "commands.mod.RateLimit", methodName : "run"});
					});
				} else {
					interaction.reply({ ephemeral : true, content : "An error occured, check logs"}).then(null,function(err) {
						haxe_Log.trace(err,{ fileName : "src/commands/mod/RateLimit.hx", lineNumber : 159, className : "commands.mod.RateLimit", methodName : "run"});
					});
					haxe_Log.trace(response,{ fileName : "src/commands/mod/RateLimit.hx", lineNumber : 160, className : "commands.mod.RateLimit", methodName : "run"});
				}
			});
			var entity = util_EcsTools.get_universe().createEntity();
			util_EcsTools.get_universe().components.set(entity,2,e);
			var ecsEntCompFlags = util_EcsTools.get_universe().components.flags[ecs_Entity.id(entity)];
			var ecsTmpFamily = util_EcsTools.get_universe().families.get(1);
			if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
				ecsTmpFamily.add(entity);
			}
			break;
		case 9:
			var user1 = _g.user;
			var obj = this.limits.h[user1.id];
			if(Object.prototype.hasOwnProperty.call(this.limits.h,user1.id)) {
				var e = database_DBEvents.DeleteByValue("rate_limit","user_id",obj.user_id,function(resp) {
					if(resp._hx_index == 4) {
						var key = user1.id;
						var _this = _gthis.tracking;
						if(Object.prototype.hasOwnProperty.call(_this.h,key)) {
							delete(_this.h[key]);
						}
						var key = user1.id;
						var _this = _gthis.limits;
						if(Object.prototype.hasOwnProperty.call(_this.h,key)) {
							delete(_this.h[key]);
						}
						haxe_Log.trace("removed slow mode from " + user1.tag,{ fileName : "src/commands/mod/RateLimit.hx", lineNumber : 172, className : "commands.mod.RateLimit", methodName : "run"});
						interaction.reply({ content : "Slow mode has been removed for <@" + user1.id + ">"}).then(null,function(err) {
							haxe_Log.trace(err,{ fileName : "src/commands/mod/RateLimit.hx", lineNumber : 175, className : "commands.mod.RateLimit", methodName : "run"});
						});
					} else {
						interaction.reply({ ephemeral : true, content : "An error occured, check logs"}).then(null,function(err) {
							haxe_Log.trace(err,{ fileName : "src/commands/mod/RateLimit.hx", lineNumber : 180, className : "commands.mod.RateLimit", methodName : "run"});
						});
						haxe_Log.trace(resp,{ fileName : "src/commands/mod/RateLimit.hx", lineNumber : 181, className : "commands.mod.RateLimit", methodName : "run"});
					}
				});
				var entity = util_EcsTools.get_universe().createEntity();
				util_EcsTools.get_universe().components.set(entity,2,e);
				var ecsEntCompFlags = util_EcsTools.get_universe().components.flags[ecs_Entity.id(entity)];
				var ecsTmpFamily = util_EcsTools.get_universe().families.get(1);
				if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
					ecsTmpFamily.add(entity);
				}
			}
			break;
		default:
		}
	}
	,get_name: function() {
		return "ratelimit";
	}
	,messages: null
	,table87a8f92f715c03d0822a55d9b93a210d: null
	,tabled1cd3067ebd0108e92f1425a40ea7b45: null
	,__class__: commands_mod_RateLimit
});
var commands_mod_Social = function(_universe) {
	systems_CommandDbBase.call(this,_universe);
};
$hxClasses["commands.mod.Social"] = commands_mod_Social;
commands_mod_Social.__name__ = "commands.mod.Social";
commands_mod_Social.__super__ = systems_CommandDbBase;
commands_mod_Social.prototype = $extend(systems_CommandDbBase.prototype,{
	run: function(command,interaction) {
		var _g = command.content;
		if(_g._hx_index == 15) {
			this.parseTwitter(interaction,_g.tag,_g.user);
		}
	}
	,parseTwitter: function(interaction,tag,user) {
		if(tag == null && user == null) {
			interaction.reply("Invalid input").then(null,function(err) {
				haxe_Log.trace(err,{ fileName : "src/commands/mod/Social.hx", lineNumber : 20, className : "commands.mod.Social", methodName : "parseTwitter"});
				$global.console.dir(err);
			});
			return;
		}
		if(tag != null) {
			var doc = firebase_web_firestore_Firestore.doc(firebase_web_firestore_Firestore.getFirestore(firebase_web_app_FirebaseApp.getApp()),"discord/social");
			firebase_web_firestore_Firestore.updateDoc(doc,{ twitter_tags : firebase_web_firestore_Firestore.arrayUnion(tag)}).then(function(_) {
				if(!interaction.replied) {
					interaction.reply("Updated collection!");
				}
			});
		}
		if(user != null) {
			var doc = firebase_web_firestore_Firestore.doc(firebase_web_firestore_Firestore.getFirestore(firebase_web_app_FirebaseApp.getApp()),"discord/social");
			firebase_web_firestore_Firestore.updateDoc(doc,{ twitter_users : firebase_web_firestore_Firestore.arrayUnion(user)}).then(function(_) {
				if(!interaction.replied) {
					interaction.reply("Updated collection!");
				}
			});
		}
	}
	,get_name: function() {
		return "social";
	}
	,__class__: commands_mod_Social
});
var commands_mod_Tracker = function(_universe) {
	this.init_trackers = false;
	this.dm = new haxe_ds_StringMap();
	this.trackers = new haxe_ds_StringMap();
	systems_CommandDbBase.call(this,_universe);
	this.messages = this.universe.families.get(3);
	this.table87a8f92f715c03d0822a55d9b93a210d = this.universe.components.getTable(5);
	this.tabled1cd3067ebd0108e92f1425a40ea7b45 = this.universe.components.getTable(1);
};
$hxClasses["commands.mod.Tracker"] = commands_mod_Tracker;
commands_mod_Tracker.__name__ = "commands.mod.Tracker";
commands_mod_Tracker.__super__ = systems_CommandDbBase;
commands_mod_Tracker.prototype = $extend(systems_CommandDbBase.prototype,{
	trackers: null
	,dm: null
	,init_trackers: null
	,onEnabled: function() {
		var _gthis = this;
		firebase_web_firestore_Firestore.onSnapshot(firebase_web_firestore_Firestore.collection(firebase_web_firestore_Firestore.getFirestore(firebase_web_app_FirebaseApp.getApp()),"discord/admin/trackers"),function(resp) {
			if(_gthis.init_trackers) {
				var _g = 0;
				var _g1 = resp.docChanges();
				while(_g < _g1.length) {
					var item = _g1[_g];
					++_g;
					switch(item.type) {
					case "added":case "modified":
						var data = [item.doc.data()];
						_gthis.trackers.h[item.doc.id] = data[0];
						if(!Object.prototype.hasOwnProperty.call(_gthis.dm.h,data[0].by)) {
							Main.client.users.fetch(data[0].by).then((function(data) {
								return function(user) {
									_gthis.dm.h[data[0].by] = user;
								};
							})(data),(function() {
								return function(err) {
									haxe_Log.trace(err,{ fileName : "src/commands/mod/Tracker.hx", lineNumber : 32, className : "commands.mod.Tracker", methodName : "onEnabled"});
								};
							})());
						}
						break;
					case "removed":
						var key = item.doc.id;
						var _this = _gthis.trackers;
						if(Object.prototype.hasOwnProperty.call(_this.h,key)) {
							delete(_this.h[key]);
						}
						break;
					default:
						haxe_Log.trace("item type not mapped? " + item.type,{ fileName : "src/commands/mod/Tracker.hx", lineNumber : 37, className : "commands.mod.Tracker", methodName : "onEnabled"});
					}
				}
				return;
			}
			_gthis.init_trackers = true;
			var _g = 0;
			var _g1 = resp.docs;
			while(_g < _g1.length) {
				var item = _g1[_g];
				++_g;
				var data1 = [item.data()];
				_gthis.trackers.h[item.id] = data1[0];
				if(!Object.prototype.hasOwnProperty.call(_gthis.dm.h,data1[0].by)) {
					Main.client.users.fetch(data1[0].by).then((function(data) {
						return function(user) {
							haxe_Log.trace("added user " + user.tag,{ fileName : "src/commands/mod/Tracker.hx", lineNumber : 50, className : "commands.mod.Tracker", methodName : "onEnabled"});
							_gthis.dm.h[data[0].by] = user;
						};
					})(data1),(function() {
						return function(err) {
							haxe_Log.trace(err,{ fileName : "src/commands/mod/Tracker.hx", lineNumber : 52, className : "commands.mod.Tracker", methodName : "onEnabled"});
						};
					})());
				}
			}
		});
	}
	,string_compare: function(value,array) {
		var _g = 0;
		while(_g < array.length) {
			var a = array[_g];
			++_g;
			if(a == value) {
				return true;
			}
		}
		return false;
	}
	,excludeKeywords: function(message,tracker) {
		var content = message.content;
		if(tracker.string_exclude == null) {
			return false;
		}
		var _g = 0;
		var _g1 = tracker.string_exclude;
		while(_g < _g1.length) {
			var word = _g1[_g];
			++_g;
			if(content.toLowerCase().indexOf(word) != -1) {
				return true;
			}
		}
		return false;
	}
	,findKeywords: function(message,tracker) {
		var content = message.content;
		var _g = 0;
		var _g1 = tracker.keywords;
		while(_g < _g1.length) {
			var word = _g1[_g];
			++_g;
			if(content.toLowerCase().indexOf(word) != -1) {
				return true;
			}
		}
		return false;
	}
	,keywordParser: function(content,matcher) {
	}
	,update: function(_) {
		systems_CommandDbBase.prototype.update.call(this,_);
		var _this = this.messages;
		var _set = _this.entities;
		var _active = _this.isActive();
		var _g_idx = _set.size() - 1;
		while(_active && _g_idx >= 0) {
			var entity = _set.getDense(_g_idx--);
			var command = this.table87a8f92f715c03d0822a55d9b93a210d.get(entity);
			var message = this.tabled1cd3067ebd0108e92f1425a40ea7b45.get(entity);
			if(command == "keyword_tracker") {
				var h = this.trackers.h;
				var tracker_keys = Object.keys(h);
				var tracker_length = tracker_keys.length;
				var tracker_current = 0;
				while(tracker_current < tracker_length) {
					var tracker = h[tracker_keys[tracker_current++]];
					if(message.author.id == tracker.by) {
						continue;
					}
					if(tracker.user_exclude != null && this.string_compare(message.author.id,tracker.user_exclude)) {
						continue;
					}
					if(tracker.channel_exclude != null && this.string_compare(message.channel.id,tracker.channel_exclude)) {
						continue;
					}
					if(this.excludeKeywords(message,tracker)) {
						continue;
					}
					if(this.findKeywords(message,tracker)) {
						if(Object.prototype.hasOwnProperty.call(this.dm.h,tracker.by)) {
							var embed = new discord_$js_MessageEmbed();
							embed.setTitle("" + tracker.name);
							var description = message.content;
							var channel = message.channel.name;
							description += "\n ----- \n [Location: " + channel + "](" + message.url + ")";
							embed.setDescription(description);
							embed.setFooter({ text : "Keyword Tracker", iconURL : "https://cdn.discordapp.com/emojis/567741748172816404.png?v=1"});
							var author = { name : "@" + message.author.tag, iconURL : message.author.displayAvatarURL()};
							embed.setAuthor(author);
							this.dm.h[tracker.by].send({ embeds : [embed]}).then(null,function(err) {
								haxe_Log.trace(err,{ fileName : "src/commands/mod/Tracker.hx", lineNumber : 145, className : "commands.mod.Tracker", methodName : "update"});
							});
							continue;
						}
					}
				}
				this.universe.deleteEntity(entity);
			}
		}
	}
	,run: function(command,interaction) {
		var _gthis = this;
		var _g = command.content;
		switch(_g._hx_index) {
		case 6:
			var name = _g.name;
			var keywords = _g.keywords;
			var description = _g.description;
			var string_exclude = _g.string_exclude;
			var channel_exclude = _g.channel_exclude;
			var user_exclude = _g.user_exclude;
			var keywords1 = keywords.split(",");
			var _g_current = 0;
			var _g_array = keywords1;
			while(_g_current < _g_array.length) {
				var _g_value = _g_array[_g_current];
				var _g_key = _g_current++;
				var key = _g_key;
				var value = _g_value;
				keywords1[key] = StringTools.trim(value.toLowerCase());
			}
			var str_exclude = [];
			if(string_exclude != null) {
				str_exclude = string_exclude.split(",");
				var _g_current = 0;
				var _g_array = str_exclude;
				while(_g_current < _g_array.length) {
					var _g_value = _g_array[_g_current];
					var _g_key = _g_current++;
					var key = _g_key;
					var value = _g_value;
					str_exclude[key] = value.toLowerCase();
				}
			}
			var chl_exclude = [];
			if(channel_exclude != null) {
				chl_exclude = channel_exclude.split(",");
			}
			var usr_exclude = [];
			if(user_exclude != null) {
				usr_exclude = user_exclude.split(",");
			}
			var _g_current = 0;
			var _g_array = str_exclude;
			while(_g_current < _g_array.length) {
				var _g_value = _g_array[_g_current];
				var _g_key = _g_current++;
				var key = _g_key;
				var str = _g_value;
				str_exclude[key] = StringTools.trim(str);
			}
			var _g_current = 0;
			var _g_array = usr_exclude;
			while(_g_current < _g_array.length) {
				var _g_value = _g_array[_g_current];
				var _g_key = _g_current++;
				var key = _g_key;
				var user = _g_value;
				var string = user;
				string = StringTools.replace(string,"<","");
				string = StringTools.replace(string,">","");
				string = StringTools.replace(string,"#","");
				string = StringTools.replace(string,"@","");
				string = StringTools.replace(string,"&","");
				haxe_Log.trace(string,{ fileName : "src/commands/mod/Tracker.hx", lineNumber : 281, className : "commands.mod.Tracker", methodName : "cleanDiscordThings"});
				usr_exclude[key] = StringTools.trim(string);
			}
			var _g_current = 0;
			var _g_array = chl_exclude;
			while(_g_current < _g_array.length) {
				var _g_value = _g_array[_g_current];
				var _g_key = _g_current++;
				var key = _g_key;
				var channel = _g_value;
				var string = channel;
				string = StringTools.replace(string,"<","");
				string = StringTools.replace(string,">","");
				string = StringTools.replace(string,"#","");
				string = StringTools.replace(string,"@","");
				string = StringTools.replace(string,"&","");
				haxe_Log.trace(string,{ fileName : "src/commands/mod/Tracker.hx", lineNumber : 281, className : "commands.mod.Tracker", methodName : "cleanDiscordThings"});
				chl_exclude[key] = StringTools.trim(string);
			}
			this.parseTracker(interaction,name,description,keywords1,str_exclude,chl_exclude,usr_exclude);
			break;
		case 7:
			var name = _g.name;
			var col = firebase_web_firestore_Firestore.collection(firebase_web_firestore_Firestore.getFirestore(firebase_web_app_FirebaseApp.getApp()),"discord/admin/trackers");
			if(name != null) {
				var query = firebase_web_firestore_Firestore.query(col,firebase_web_firestore_Firestore.where("name",">=",name),firebase_web_firestore_Firestore.where("name","<=",name + "~"),firebase_web_firestore_Firestore.where("by","==",interaction.user.id));
				if(interaction.isAutocomplete()) {
					firebase_web_firestore_Firestore.getDocs(query).then(function(res) {
						var results = [];
						var _g = 0;
						var _g1 = res.docs;
						while(_g < _g1.length) {
							var d = _g1[_g];
							++_g;
							var data = d.data();
							var name = data.name;
							if(data.description != null) {
								name = (name == null ? "null" : "" + name) + (" - " + Std.string(data.description));
							}
							results.push({ name : name, value : d.id});
						}
						interaction.respond(results).then(null,function(err) {
							haxe_Log.trace(err,{ fileName : "src/commands/mod/Tracker.hx", lineNumber : 220, className : "commands.mod.Tracker", methodName : "run"});
							$global.console.dir(err);
						});
					}).then(null,function(err) {
						haxe_Log.trace(err,{ fileName : "src/commands/mod/Tracker.hx", lineNumber : 224, className : "commands.mod.Tracker", methodName : "run"});
						$global.console.dir(err);
					});
					return;
				}
				firebase_web_firestore_Firestore.deleteDoc(firebase_web_firestore_Firestore.doc(firebase_web_firestore_Firestore.getFirestore(firebase_web_app_FirebaseApp.getApp()),"discord/admin/trackers/" + name)).then(function(_) {
					var _this = _gthis.trackers;
					if(Object.prototype.hasOwnProperty.call(_this.h,name)) {
						delete(_this.h[name]);
					}
					interaction.reply({ content : "Tracker deleted!", ephemeral : true}).then(null,function(err) {
						haxe_Log.trace(err,{ fileName : "src/commands/mod/Tracker.hx", lineNumber : 232, className : "commands.mod.Tracker", methodName : "run"});
					});
				},function(err) {
					haxe_Log.trace(err,{ fileName : "src/commands/mod/Tracker.hx", lineNumber : 234, className : "commands.mod.Tracker", methodName : "run"});
					$global.console.dir(err);
				});
			}
			break;
		default:
		}
	}
	,parseTracker: function(interaction,name,description,keywords,string_exclude,channel_exclude,user_exclude) {
		var obj = { name : name, by : interaction.user.id, discord_name : interaction.user.username, keywords : keywords, timestamp : new Date().getTime()};
		if(description != null) {
			obj.description = description;
		}
		if(string_exclude.length > 0) {
			obj.string_exclude = string_exclude;
		}
		if(channel_exclude.length > 0) {
			obj.channel_exclude = channel_exclude;
		}
		if(channel_exclude.length > 0) {
			obj.channel_exclude = channel_exclude;
		}
		firebase_web_firestore_Firestore.addDoc(firebase_web_firestore_Firestore.collection(firebase_web_firestore_Firestore.getFirestore(firebase_web_app_FirebaseApp.getApp()),"discord/admin/trackers"),obj).then(function(_) {
			interaction.reply({ content : "Your tracker is now active!", ephemeral : true}).then(null,function(err) {
				haxe_Log.trace(err,{ fileName : "src/commands/mod/Tracker.hx", lineNumber : 271, className : "commands.mod.Tracker", methodName : "parseTracker"});
			});
		},function(err) {
			haxe_Log.trace(err,{ fileName : "src/commands/mod/Tracker.hx", lineNumber : 272, className : "commands.mod.Tracker", methodName : "parseTracker"});
		});
	}
	,cleanDiscordThings: function(string) {
		string = StringTools.replace(string,"<","");
		string = StringTools.replace(string,">","");
		string = StringTools.replace(string,"#","");
		string = StringTools.replace(string,"@","");
		string = StringTools.replace(string,"&","");
		haxe_Log.trace(string,{ fileName : "src/commands/mod/Tracker.hx", lineNumber : 281, className : "commands.mod.Tracker", methodName : "cleanDiscordThings"});
		return string;
	}
	,get_name: function() {
		return "tracker";
	}
	,messages: null
	,table87a8f92f715c03d0822a55d9b93a210d: null
	,tabled1cd3067ebd0108e92f1425a40ea7b45: null
	,__class__: commands_mod_Tracker
});
var commands_types_Duration = {};
commands_types_Duration._new = function(value) {
	return value;
};
commands_types_Duration.gt = null;
commands_types_Duration.gtequalto = null;
commands_types_Duration.lt = null;
commands_types_Duration.ltequalto = null;
commands_types_Duration.equality = null;
commands_types_Duration.gtfloat = null;
commands_types_Duration.gtequaltofloat = null;
commands_types_Duration.ltfloat = null;
commands_types_Duration.ltequaltofloat = null;
commands_types_Duration.equalityFloat = null;
commands_types_Duration.addition = null;
commands_types_Duration.division = null;
commands_types_Duration.divisionb = null;
commands_types_Duration.fromString = function(input) {
	var time = 0.;
	var min_regex = new EReg("([0-9]+)[ ]?(m|min|mins)\\b","gi");
	if(min_regex.match(input)) {
		var num = parseFloat(min_regex.matched(1));
		time = num * 60000;
	}
	var hour_regex = new EReg("([0-9]+)[ ]?(h|hr|hrs|hours)\\b","gi");
	if(hour_regex.match(input)) {
		var num = parseFloat(hour_regex.matched(1));
		time = num * 3600000;
	}
	var day_regex = new EReg("([0-9]+)[ ]?(d|day|days)\\b","gi");
	if(day_regex.match(input)) {
		var num = parseFloat(day_regex.matched(1));
		time = num * 86400000;
	}
	var week_regex = new EReg("([0-9]+)[ ]?(w|wk|wks|week|weeks)\\b","gi");
	if(week_regex.match(input)) {
		var num = parseFloat(week_regex.matched(1));
		time = num * 604800000;
	}
	var month_regex = new EReg("([0-9]+)[ ]?(mo|mos|mths|month|months)\\b","gi");
	if(month_regex.match(input)) {
		var num = parseFloat(month_regex.matched(1));
		time = num * 2419200000;
	}
	return commands_types_Duration._new(time);
};
var components_CommandOptions = $hxEnums["components.CommandOptions"] = { __ename__:"components.CommandOptions",__constructs__:null
	,Hi: {_hx_name:"Hi",_hx_index:0,__enum__:"components.CommandOptions",toString:$estr}
	,Threadcount: {_hx_name:"Threadcount",_hx_index:1,__enum__:"components.CommandOptions",toString:$estr}
	,Archive: {_hx_name:"Archive",_hx_index:2,__enum__:"components.CommandOptions",toString:$estr}
	,SnippetTags: {_hx_name:"SnippetTags",_hx_index:3,__enum__:"components.CommandOptions",toString:$estr}
	,SnippetList: ($_=function(user,show_desc) { return {_hx_index:4,user:user,show_desc:show_desc,__enum__:"components.CommandOptions",toString:$estr,__params__:function(){ return [this.user,this.show_desc];}}; },$_._hx_name="SnippetList",$_)
	,Color: ($_=function(role) { return {_hx_index:5,role:role,__enum__:"components.CommandOptions",toString:$estr,__params__:function(){ return [this.role];}}; },$_._hx_name="Color",$_)
	,TrackerCreate: ($_=function(name,keywords,description,string_exclude,channel_exclude,user_exclude) { return {_hx_index:6,name:name,keywords:keywords,description:description,string_exclude:string_exclude,channel_exclude:channel_exclude,user_exclude:user_exclude,__enum__:"components.CommandOptions",toString:$estr,__params__:function(){ return [this.name,this.keywords,this.description,this.string_exclude,this.channel_exclude,this.user_exclude];}}; },$_._hx_name="TrackerCreate",$_)
	,TrackerDelete: ($_=function(name) { return {_hx_index:7,name:name,__enum__:"components.CommandOptions",toString:$estr,__params__:function(){ return [this.name];}}; },$_._hx_name="TrackerDelete",$_)
	,RatelimitCreate: ($_=function(user,counter,time,reason) { return {_hx_index:8,user:user,counter:counter,time:time,reason:reason,__enum__:"components.CommandOptions",toString:$estr,__params__:function(){ return [this.user,this.counter,this.time,this.reason];}}; },$_._hx_name="RatelimitCreate",$_)
	,RatelimitDelete: ($_=function(user) { return {_hx_index:9,user:user,__enum__:"components.CommandOptions",toString:$estr,__params__:function(){ return [this.user];}}; },$_._hx_name="RatelimitDelete",$_)
	,SnippetEdit: ($_=function(id) { return {_hx_index:10,id:id,__enum__:"components.CommandOptions",toString:$estr,__params__:function(){ return [this.id];}}; },$_._hx_name="SnippetEdit",$_)
	,SnippetDelete: ($_=function(id) { return {_hx_index:11,id:id,__enum__:"components.CommandOptions",toString:$estr,__params__:function(){ return [this.id];}}; },$_._hx_name="SnippetDelete",$_)
	,SnippetSearch: ($_=function(taga,tagb,tagc) { return {_hx_index:12,taga:taga,tagb:tagb,tagc:tagc,__enum__:"components.CommandOptions",toString:$estr,__params__:function(){ return [this.taga,this.tagb,this.tagc];}}; },$_._hx_name="SnippetSearch",$_)
	,SnippetAdd: ($_=function(url,title,description,taga,tagb,tagc,tagd,tage) { return {_hx_index:13,url:url,title:title,description:description,taga:taga,tagb:tagb,tagc:tagc,tagd:tagd,tage:tage,__enum__:"components.CommandOptions",toString:$estr,__params__:function(){ return [this.url,this.title,this.description,this.taga,this.tagb,this.tagc,this.tagd,this.tage];}}; },$_._hx_name="SnippetAdd",$_)
	,Reminder: ($_=function(content,when,personal,thread_reply) { return {_hx_index:14,content:content,when:when,personal:personal,thread_reply:thread_reply,__enum__:"components.CommandOptions",toString:$estr,__params__:function(){ return [this.content,this.when,this.personal,this.thread_reply];}}; },$_._hx_name="Reminder",$_)
	,Social: ($_=function(tag,user) { return {_hx_index:15,tag:tag,user:user,__enum__:"components.CommandOptions",toString:$estr,__params__:function(){ return [this.tag,this.user];}}; },$_._hx_name="Social",$_)
	,Ban: ($_=function(user,reason,delete_messages) { return {_hx_index:16,user:user,reason:reason,delete_messages:delete_messages,__enum__:"components.CommandOptions",toString:$estr,__params__:function(){ return [this.user,this.reason,this.delete_messages];}}; },$_._hx_name="Ban",$_)
	,Say: ($_=function(message,message_id) { return {_hx_index:17,message:message,message_id:message_id,__enum__:"components.CommandOptions",toString:$estr,__params__:function(){ return [this.message,this.message_id];}}; },$_._hx_name="Say",$_)
	,React: ($_=function(message_id,emoji) { return {_hx_index:18,message_id:message_id,emoji:emoji,__enum__:"components.CommandOptions",toString:$estr,__params__:function(){ return [this.message_id,this.emoji];}}; },$_._hx_name="React",$_)
	,Helppls: ($_=function(topic) { return {_hx_index:19,topic:topic,__enum__:"components.CommandOptions",toString:$estr,__params__:function(){ return [this.topic];}}; },$_._hx_name="Helppls",$_)
	,Run: ($_=function(code) { return {_hx_index:20,code:code,__enum__:"components.CommandOptions",toString:$estr,__params__:function(){ return [this.code];}}; },$_._hx_name="Run",$_)
	,Trace: ($_=function(code) { return {_hx_index:21,code:code,__enum__:"components.CommandOptions",toString:$estr,__params__:function(){ return [this.code];}}; },$_._hx_name="Trace",$_)
	,Boop: ($_=function(user) { return {_hx_index:22,user:user,__enum__:"components.CommandOptions",toString:$estr,__params__:function(){ return [this.user];}}; },$_._hx_name="Boop",$_)
	,Poll: ($_=function(question,length,a,b,c,d,e,f,g,votes) { return {_hx_index:23,question:question,length:length,a:a,b:b,c:c,d:d,e:e,f:f,g:g,votes:votes,__enum__:"components.CommandOptions",toString:$estr,__params__:function(){ return [this.question,this.length,this.a,this.b,this.c,this.d,this.e,this.f,this.g,this.votes];}}; },$_._hx_name="Poll",$_)
	,Roundup: ($_=function(number) { return {_hx_index:24,number:number,__enum__:"components.CommandOptions",toString:$estr,__params__:function(){ return [this.number];}}; },$_._hx_name="Roundup",$_)
	,Rtfm: ($_=function(channel) { return {_hx_index:25,channel:channel,__enum__:"components.CommandOptions",toString:$estr,__params__:function(){ return [this.channel];}}; },$_._hx_name="Rtfm",$_)
	,Translate: ($_=function(to,message,from) { return {_hx_index:26,to:to,message:message,from:from,__enum__:"components.CommandOptions",toString:$estr,__params__:function(){ return [this.to,this.message,this.from];}}; },$_._hx_name="Translate",$_)
	,Helpdescription: ($_=function(description) { return {_hx_index:27,description:description,__enum__:"components.CommandOptions",toString:$estr,__params__:function(){ return [this.description];}}; },$_._hx_name="Helpdescription",$_)
	,Api: ($_=function(content,field) { return {_hx_index:28,content:content,field:field,__enum__:"components.CommandOptions",toString:$estr,__params__:function(){ return [this.content,this.field];}}; },$_._hx_name="Api",$_)
	,Notify: ($_=function(channel) { return {_hx_index:29,channel:channel,__enum__:"components.CommandOptions",toString:$estr,__params__:function(){ return [this.channel];}}; },$_._hx_name="Notify",$_)
	,Help: ($_=function(category) { return {_hx_index:30,category:category,__enum__:"components.CommandOptions",toString:$estr,__params__:function(){ return [this.category];}}; },$_._hx_name="Help",$_)
	,Haxelib: ($_=function(command) { return {_hx_index:31,command:command,__enum__:"components.CommandOptions",toString:$estr,__params__:function(){ return [this.command];}}; },$_._hx_name="Haxelib",$_)
	,QuoteList: ($_=function(user) { return {_hx_index:32,user:user,__enum__:"components.CommandOptions",toString:$estr,__params__:function(){ return [this.user];}}; },$_._hx_name="QuoteList",$_)
	,QuoteGet: ($_=function(name) { return {_hx_index:33,name:name,__enum__:"components.CommandOptions",toString:$estr,__params__:function(){ return [this.name];}}; },$_._hx_name="QuoteGet",$_)
	,QuoteDelete: ($_=function(name) { return {_hx_index:34,name:name,__enum__:"components.CommandOptions",toString:$estr,__params__:function(){ return [this.name];}}; },$_._hx_name="QuoteDelete",$_)
	,QuoteEdit: ($_=function(name) { return {_hx_index:35,name:name,__enum__:"components.CommandOptions",toString:$estr,__params__:function(){ return [this.name];}}; },$_._hx_name="QuoteEdit",$_)
	,QuoteCreate: ($_=function(name) { return {_hx_index:36,name:name,__enum__:"components.CommandOptions",toString:$estr,__params__:function(){ return [this.name];}}; },$_._hx_name="QuoteCreate",$_)
	,EmojiGet: ($_=function(name,size) { return {_hx_index:37,name:name,size:size,__enum__:"components.CommandOptions",toString:$estr,__params__:function(){ return [this.name,this.size];}}; },$_._hx_name="EmojiGet",$_)
	,EmojiRemove: ($_=function(name) { return {_hx_index:38,name:name,__enum__:"components.CommandOptions",toString:$estr,__params__:function(){ return [this.name];}}; },$_._hx_name="EmojiRemove",$_)
	,EmojiEdit: ($_=function(name) { return {_hx_index:39,name:name,__enum__:"components.CommandOptions",toString:$estr,__params__:function(){ return [this.name];}}; },$_._hx_name="EmojiEdit",$_)
	,EmojiCreate: ($_=function(name,url,description) { return {_hx_index:40,name:name,url:url,description:description,__enum__:"components.CommandOptions",toString:$estr,__params__:function(){ return [this.name,this.url,this.description];}}; },$_._hx_name="EmojiCreate",$_)
	,Everyone: ($_=function(content) { return {_hx_index:41,content:content,__enum__:"components.CommandOptions",toString:$estr,__params__:function(){ return [this.content];}}; },$_._hx_name="Everyone",$_)
	,Showcase: {_hx_name:"Showcase",_hx_index:42,__enum__:"components.CommandOptions",toString:$estr}
	,PinMessage: {_hx_name:"PinMessage",_hx_index:43,__enum__:"components.CommandOptions",toString:$estr}
	,Code: {_hx_name:"Code",_hx_index:44,__enum__:"components.CommandOptions",toString:$estr}
	,CodeLineNumbers: {_hx_name:"CodeLineNumbers",_hx_index:45,__enum__:"components.CommandOptions",toString:$estr}
};
components_CommandOptions.__constructs__ = [components_CommandOptions.Hi,components_CommandOptions.Threadcount,components_CommandOptions.Archive,components_CommandOptions.SnippetTags,components_CommandOptions.SnippetList,components_CommandOptions.Color,components_CommandOptions.TrackerCreate,components_CommandOptions.TrackerDelete,components_CommandOptions.RatelimitCreate,components_CommandOptions.RatelimitDelete,components_CommandOptions.SnippetEdit,components_CommandOptions.SnippetDelete,components_CommandOptions.SnippetSearch,components_CommandOptions.SnippetAdd,components_CommandOptions.Reminder,components_CommandOptions.Social,components_CommandOptions.Ban,components_CommandOptions.Say,components_CommandOptions.React,components_CommandOptions.Helppls,components_CommandOptions.Run,components_CommandOptions.Trace,components_CommandOptions.Boop,components_CommandOptions.Poll,components_CommandOptions.Roundup,components_CommandOptions.Rtfm,components_CommandOptions.Translate,components_CommandOptions.Helpdescription,components_CommandOptions.Api,components_CommandOptions.Notify,components_CommandOptions.Help,components_CommandOptions.Haxelib,components_CommandOptions.QuoteList,components_CommandOptions.QuoteGet,components_CommandOptions.QuoteDelete,components_CommandOptions.QuoteEdit,components_CommandOptions.QuoteCreate,components_CommandOptions.EmojiGet,components_CommandOptions.EmojiRemove,components_CommandOptions.EmojiEdit,components_CommandOptions.EmojiCreate,components_CommandOptions.Everyone,components_CommandOptions.Showcase,components_CommandOptions.PinMessage,components_CommandOptions.Code,components_CommandOptions.CodeLineNumbers];
components_CommandOptions.__empty_constructs__ = [components_CommandOptions.Hi,components_CommandOptions.Threadcount,components_CommandOptions.Archive,components_CommandOptions.SnippetTags,components_CommandOptions.Showcase,components_CommandOptions.PinMessage,components_CommandOptions.Code,components_CommandOptions.CodeLineNumbers];
var components_ShowcaseModalSubmit = function(title,description) {
	this.title_or_link = title;
	this.description = description;
};
$hxClasses["components.ShowcaseModalSubmit"] = components_ShowcaseModalSubmit;
components_ShowcaseModalSubmit.__name__ = "components.ShowcaseModalSubmit";
components_ShowcaseModalSubmit.prototype = {
	title_or_link: null
	,description: null
	,__class__: components_ShowcaseModalSubmit
};
var components_TextCommand = {};
components_TextCommand.list = function() {
	return ["!mention","!run"];
};
var database_DBEvents = $hxEnums["database.DBEvents"] = { __ename__:"database.DBEvents",__constructs__:null
	,Search: ($_=function(table,field,value,callback) { return {_hx_index:0,table:table,field:field,value:value,callback:callback,__enum__:"database.DBEvents",toString:$estr,__params__:function(){ return [this.table,this.field,this.value,this.callback];}}; },$_._hx_name="Search",$_)
	,SearchBy: ($_=function(table,field,value,by_column,by_value,callback) { return {_hx_index:1,table:table,field:field,value:value,by_column:by_column,by_value:by_value,callback:callback,__enum__:"database.DBEvents",toString:$estr,__params__:function(){ return [this.table,this.field,this.value,this.by_column,this.by_value,this.callback];}}; },$_._hx_name="SearchBy",$_)
	,Insert: ($_=function(table,value,callback) { return {_hx_index:2,table:table,value:value,callback:callback,__enum__:"database.DBEvents",toString:$estr,__params__:function(){ return [this.table,this.value,this.callback];}}; },$_._hx_name="Insert",$_)
	,Update: ($_=function(table,value,query,callback) { return {_hx_index:3,table:table,value:value,query:query,callback:callback,__enum__:"database.DBEvents",toString:$estr,__params__:function(){ return [this.table,this.value,this.query,this.callback];}}; },$_._hx_name="Update",$_)
	,InsertDontDuplicateLastRow: ($_=function(table,field,query,data,callback) { return {_hx_index:4,table:table,field:field,query:query,data:data,callback:callback,__enum__:"database.DBEvents",toString:$estr,__params__:function(){ return [this.table,this.field,this.query,this.data,this.callback];}}; },$_._hx_name="InsertDontDuplicateLastRow",$_)
	,SearchAndUpdate: ($_=function(table,key,query,value,callback) { return {_hx_index:5,table:table,key:key,query:query,value:value,callback:callback,__enum__:"database.DBEvents",toString:$estr,__params__:function(){ return [this.table,this.key,this.query,this.value,this.callback];}}; },$_._hx_name="SearchAndUpdate",$_)
	,CreateTable: ($_=function(name,columns) { return {_hx_index:6,name:name,columns:columns,__enum__:"database.DBEvents",toString:$estr,__params__:function(){ return [this.name,this.columns];}}; },$_._hx_name="CreateTable",$_)
	,GetRecord: ($_=function(table,query,callback) { return {_hx_index:7,table:table,query:query,callback:callback,__enum__:"database.DBEvents",toString:$estr,__params__:function(){ return [this.table,this.query,this.callback];}}; },$_._hx_name="GetRecord",$_)
	,GetRecords: ($_=function(table,query,callback) { return {_hx_index:8,table:table,query:query,callback:callback,__enum__:"database.DBEvents",toString:$estr,__params__:function(){ return [this.table,this.query,this.callback];}}; },$_._hx_name="GetRecords",$_)
	,GetAllRecords: ($_=function(table,callback) { return {_hx_index:9,table:table,callback:callback,__enum__:"database.DBEvents",toString:$estr,__params__:function(){ return [this.table,this.callback];}}; },$_._hx_name="GetAllRecords",$_)
	,DeleteByValue: ($_=function(table,column,value,callback) { return {_hx_index:10,table:table,column:column,value:value,callback:callback,__enum__:"database.DBEvents",toString:$estr,__params__:function(){ return [this.table,this.column,this.value,this.callback];}}; },$_._hx_name="DeleteByValue",$_)
	,DeleteRecord: ($_=function(table,value,callback) { return {_hx_index:11,table:table,value:value,callback:callback,__enum__:"database.DBEvents",toString:$estr,__params__:function(){ return [this.table,this.value,this.callback];}}; },$_._hx_name="DeleteRecord",$_)
	,Watch: ($_=function(table,condition,callback,rate) { return {_hx_index:12,table:table,condition:condition,callback:callback,rate:rate,__enum__:"database.DBEvents",toString:$estr,__params__:function(){ return [this.table,this.condition,this.callback,this.rate];}}; },$_._hx_name="Watch",$_)
	,Poll: ($_=function(event,ms) { return {_hx_index:13,event:event,ms:ms,__enum__:"database.DBEvents",toString:$estr,__params__:function(){ return [this.event,this.ms];}}; },$_._hx_name="Poll",$_)
};
database_DBEvents.__constructs__ = [database_DBEvents.Search,database_DBEvents.SearchBy,database_DBEvents.Insert,database_DBEvents.Update,database_DBEvents.InsertDontDuplicateLastRow,database_DBEvents.SearchAndUpdate,database_DBEvents.CreateTable,database_DBEvents.GetRecord,database_DBEvents.GetRecords,database_DBEvents.GetAllRecords,database_DBEvents.DeleteByValue,database_DBEvents.DeleteRecord,database_DBEvents.Watch,database_DBEvents.Poll];
database_DBEvents.__empty_constructs__ = [];
var database_Callback = $hxEnums["database.Callback"] = { __ename__:"database.Callback",__constructs__:null
	,Data: ($_=function(data) { return {_hx_index:0,data:data,__enum__:"database.Callback",toString:$estr,__params__:function(){ return [this.data];}}; },$_._hx_name="Data",$_)
	,Record: ($_=function(data) { return {_hx_index:1,data:data,__enum__:"database.Callback",toString:$estr,__params__:function(){ return [this.data];}}; },$_._hx_name="Record",$_)
	,Records: ($_=function(data) { return {_hx_index:2,data:data,__enum__:"database.Callback",toString:$estr,__params__:function(){ return [this.data];}}; },$_._hx_name="Records",$_)
	,WatchResult: ($_=function(result) { return {_hx_index:3,result:result,__enum__:"database.Callback",toString:$estr,__params__:function(){ return [this.result];}}; },$_._hx_name="WatchResult",$_)
	,Success: ($_=function(message,data) { return {_hx_index:4,message:message,data:data,__enum__:"database.Callback",toString:$estr,__params__:function(){ return [this.message,this.data];}}; },$_._hx_name="Success",$_)
	,Error: ($_=function(message,data) { return {_hx_index:5,message:message,data:data,__enum__:"database.Callback",toString:$estr,__params__:function(){ return [this.message,this.data];}}; },$_._hx_name="Error",$_)
};
database_Callback.__constructs__ = [database_Callback.Data,database_Callback.Record,database_Callback.Records,database_Callback.WatchResult,database_Callback.Success,database_Callback.Error];
database_Callback.__empty_constructs__ = [];
var database_MyRecord = function() {
	this._record = new db_Record();
};
$hxClasses["database.MyRecord"] = database_MyRecord;
database_MyRecord.__name__ = "database.MyRecord";
database_MyRecord.prototype = {
	_record: null
	,get_record: null
	,__class__: database_MyRecord
	,__properties__: {get_record:"get_record"}
};
var database_types_DBEmoji = function(author_id,author_tag,name,url,description) {
	this.description = null;
	database_MyRecord.call(this);
	this.author_id = author_id;
	this.author_tag = author_tag;
	this.url = url;
	this.name = name.toLowerCase();
	this.description = description;
	this.timestamp = new Date().getTime();
};
$hxClasses["database.types.DBEmoji"] = database_types_DBEmoji;
database_types_DBEmoji.__name__ = "database.types.DBEmoji";
database_types_DBEmoji.fromRecord = function(record) {
	var author_id = record.field("author_id");
	var author_tag = record.field("author_tag");
	var name = record.field("name");
	var url = record.field("url");
	var description = record.field("description");
	var timestamp = record.field("timestamp");
	var id = record.field("id");
	var p = new database_types_DBEmoji(author_id,author_tag,name,url,description);
	p.timestamp = timestamp;
	p.id = id;
	return p;
};
database_types_DBEmoji.__super__ = database_MyRecord;
database_types_DBEmoji.prototype = $extend(database_MyRecord.prototype,{
	author_id: null
	,author_tag: null
	,name: null
	,url: null
	,description: null
	,timestamp: null
	,id: null
	,get_record: function() {
		this._record.field("author_id",this.author_id);
		this._record.field("author_tag",this.author_tag);
		this._record.field("name",this.name);
		this._record.field("url",this.url);
		this._record.field("description",this.description);
		this._record.field("timestamp",this.timestamp);
		this._record.field("id",this.id);
		return this._record;
	}
	,__class__: database_types_DBEmoji
});
var database_types_DBQuote = function(author_id,author_tag,title,description) {
	database_MyRecord.call(this);
	this.author_id = author_id;
	this.author_tag = author_tag;
	this.title = title;
	this.description = description;
	this.timestamp = new Date().getTime();
};
$hxClasses["database.types.DBQuote"] = database_types_DBQuote;
database_types_DBQuote.__name__ = "database.types.DBQuote";
database_types_DBQuote.fromRecord = function(record) {
	var author_id = record.field("author_id");
	var author_tag = record.field("author_tag");
	var title = record.field("title");
	var description = record.field("description");
	var timestamp = record.field("timestamp");
	var id = record.field("id");
	var p = new database_types_DBQuote(author_id,author_tag,title,description);
	p.timestamp = timestamp;
	p.id = id;
	return p;
};
database_types_DBQuote.__super__ = database_MyRecord;
database_types_DBQuote.prototype = $extend(database_MyRecord.prototype,{
	author_id: null
	,author_tag: null
	,title: null
	,description: null
	,timestamp: null
	,id: null
	,get_record: function() {
		this._record.field("author_id",this.author_id);
		this._record.field("author_tag",this.author_tag);
		this._record.field("title",this.title);
		this._record.field("description",this.description);
		this._record.field("timestamp",this.timestamp);
		this._record.field("id",this.id);
		return this._record;
	}
	,__class__: database_types_DBQuote
});
var database_types_DBRateLimit = function(user_id,user_tag,mod_id,mod_tag,count,time) {
	this.silenced = -1;
	database_MyRecord.call(this);
	this.user_id = user_id;
	this.user_tag = user_tag;
	this.mod_id = mod_id;
	this.mod_tag = mod_tag;
	this.count = count;
	this.time = time;
	this.created = new Date().getTime();
};
$hxClasses["database.types.DBRateLimit"] = database_types_DBRateLimit;
database_types_DBRateLimit.__name__ = "database.types.DBRateLimit";
database_types_DBRateLimit.fromRecord = function(record) {
	var user_id = record.field("user_id");
	var user_tag = record.field("user_tag");
	var mod_id = record.field("mod_id");
	var mod_tag = record.field("mod_tag");
	var count = record.field("count");
	var time = record.field("time");
	var reason = record.field("reason");
	var silenced = record.field("silenced");
	var created = record.field("created");
	var id = record.field("id");
	var p = new database_types_DBRateLimit(user_id,user_tag,mod_id,mod_tag,count,time);
	p.reason = reason;
	p.silenced = silenced;
	p.created = created;
	p.id = id;
	return p;
};
database_types_DBRateLimit.__super__ = database_MyRecord;
database_types_DBRateLimit.prototype = $extend(database_MyRecord.prototype,{
	user_id: null
	,user_tag: null
	,mod_id: null
	,mod_tag: null
	,count: null
	,time: null
	,reason: null
	,silenced: null
	,created: null
	,id: null
	,get_record: function() {
		this._record.field("user_id",this.user_id);
		this._record.field("user_tag",this.user_tag);
		this._record.field("mod_id",this.mod_id);
		this._record.field("mod_tag",this.mod_tag);
		this._record.field("count",this.count);
		this._record.field("time",this.time);
		this._record.field("reason",this.reason);
		this._record.field("silenced",this.silenced);
		this._record.field("created",this.created);
		this._record.field("id",this.id);
		return this._record;
	}
	,__class__: database_types_DBRateLimit
});
var database_types_DBReminder = function(author_id,content,duration,channel_id,is_thread) {
	this.thread_reply = 0;
	this.personal = 0;
	this.sent = 0;
	this.is_thread = 0;
	database_MyRecord.call(this);
	this.author_id = author_id;
	this.content = content;
	this.duration = duration;
	this.channel_id = channel_id;
	this.is_thread = is_thread;
	this.timestamp = new Date().getTime();
};
$hxClasses["database.types.DBReminder"] = database_types_DBReminder;
database_types_DBReminder.__name__ = "database.types.DBReminder";
database_types_DBReminder.fromRecord = function(record) {
	var id = record.field("id");
	var author_id = record.field("author_id");
	var content = record.field("content");
	var duration = record.field("duration");
	var channel_id = record.field("channel_id");
	var is_thread = record.field("is_thread");
	var sent = record.field("sent");
	var personal = record.field("personal");
	var thread_reply = record.field("thread_reply");
	var timestamp = record.field("timestamp");
	var p = new database_types_DBReminder(author_id,content,duration,channel_id,is_thread);
	p.id = id;
	p.sent = sent;
	p.personal = personal;
	p.thread_reply = thread_reply;
	p.timestamp = timestamp;
	return p;
};
database_types_DBReminder.__super__ = database_MyRecord;
database_types_DBReminder.prototype = $extend(database_MyRecord.prototype,{
	id: null
	,author_id: null
	,content: null
	,duration: null
	,channel_id: null
	,is_thread: null
	,sent: null
	,personal: null
	,thread_reply: null
	,timestamp: null
	,get_record: function() {
		this._record.field("id",this.id);
		this._record.field("author_id",this.author_id);
		this._record.field("content",this.content);
		this._record.field("duration",this.duration);
		this._record.field("channel_id",this.channel_id);
		this._record.field("is_thread",this.is_thread);
		this._record.field("sent",this.sent);
		this._record.field("personal",this.personal);
		this._record.field("thread_reply",this.thread_reply);
		this._record.field("timestamp",this.timestamp);
		return this._record;
	}
	,__class__: database_types_DBReminder
});
var database_types_DBSnippet = function(author_id,title,description,url) {
	database_MyRecord.call(this);
	this.url = url;
	this.title = title;
	this.author_id = author_id;
	this.description = description;
	this.timestamp = new Date().getTime();
};
$hxClasses["database.types.DBSnippet"] = database_types_DBSnippet;
database_types_DBSnippet.__name__ = "database.types.DBSnippet";
database_types_DBSnippet.fromRecord = function(record) {
	var author_id = record.field("author_id");
	var title = record.field("title");
	var url = record.field("url");
	var description = record.field("description");
	var timestamp = record.field("timestamp");
	var snippet_id = record.field("snippet_id");
	var p = new database_types_DBSnippet(author_id,title,url,description);
	p.timestamp = timestamp;
	p.snippet_id = snippet_id;
	return p;
};
database_types_DBSnippet.__super__ = database_MyRecord;
database_types_DBSnippet.prototype = $extend(database_MyRecord.prototype,{
	author_id: null
	,title: null
	,url: null
	,description: null
	,timestamp: null
	,snippet_id: null
	,get_record: function() {
		this._record.field("author_id",this.author_id);
		this._record.field("title",this.title);
		this._record.field("url",this.url);
		this._record.field("description",this.description);
		this._record.field("timestamp",this.timestamp);
		this._record.field("snippet_id",this.snippet_id);
		return this._record;
	}
	,__class__: database_types_DBSnippet
});
var db_ColumnDefinition = function(name,type,options) {
	this.name = name;
	this.type = type;
	this.options = options;
};
$hxClasses["db.ColumnDefinition"] = db_ColumnDefinition;
db_ColumnDefinition.__name__ = "db.ColumnDefinition";
db_ColumnDefinition.prototype = {
	name: null
	,type: null
	,options: null
	,clone: function() {
		var c = new db_ColumnDefinition(this.name,this.type,null);
		if(this.options != null) {
			c.options = this.options.slice();
		}
		return c;
	}
	,debugString: function() {
		var sb_b = "";
		sb_b = "" + Std.string(this.name);
		sb_b += ": ";
		sb_b += Std.string(this.type);
		sb_b += ", ";
		sb_b += Std.string(this.options);
		return sb_b;
	}
	,__class__: db_ColumnDefinition
};
var db_ColumnOptions = $hxEnums["db.ColumnOptions"] = { __ename__:"db.ColumnOptions",__constructs__:null
	,PrimaryKey: {_hx_name:"PrimaryKey",_hx_index:0,__enum__:"db.ColumnOptions",toString:$estr}
	,NotNull: {_hx_name:"NotNull",_hx_index:1,__enum__:"db.ColumnOptions",toString:$estr}
	,AutoIncrement: {_hx_name:"AutoIncrement",_hx_index:2,__enum__:"db.ColumnOptions",toString:$estr}
};
db_ColumnOptions.__constructs__ = [db_ColumnOptions.PrimaryKey,db_ColumnOptions.NotNull,db_ColumnOptions.AutoIncrement];
db_ColumnOptions.__empty_constructs__ = [db_ColumnOptions.PrimaryKey,db_ColumnOptions.NotNull,db_ColumnOptions.AutoIncrement];
var db_ColumnType = $hxEnums["db.ColumnType"] = { __ename__:"db.ColumnType",__constructs__:null
	,Number: {_hx_name:"Number",_hx_index:0,__enum__:"db.ColumnType",toString:$estr}
	,Decimal: {_hx_name:"Decimal",_hx_index:1,__enum__:"db.ColumnType",toString:$estr}
	,Boolean: {_hx_name:"Boolean",_hx_index:2,__enum__:"db.ColumnType",toString:$estr}
	,Text: ($_=function(n) { return {_hx_index:3,n:n,__enum__:"db.ColumnType",toString:$estr,__params__:function(){ return [this.n];}}; },$_._hx_name="Text",$_)
	,Memo: {_hx_name:"Memo",_hx_index:4,__enum__:"db.ColumnType",toString:$estr}
	,Binary: {_hx_name:"Binary",_hx_index:5,__enum__:"db.ColumnType",toString:$estr}
	,Unknown: {_hx_name:"Unknown",_hx_index:6,__enum__:"db.ColumnType",toString:$estr}
};
db_ColumnType.__constructs__ = [db_ColumnType.Number,db_ColumnType.Decimal,db_ColumnType.Boolean,db_ColumnType.Text,db_ColumnType.Memo,db_ColumnType.Binary,db_ColumnType.Unknown];
db_ColumnType.__empty_constructs__ = [db_ColumnType.Number,db_ColumnType.Decimal,db_ColumnType.Boolean,db_ColumnType.Memo,db_ColumnType.Binary,db_ColumnType.Unknown];
var db_DatabaseError = function(message,call) {
	this.message = message;
	this.call = call;
};
$hxClasses["db.DatabaseError"] = db_DatabaseError;
db_DatabaseError.__name__ = "db.DatabaseError";
db_DatabaseError.prototype = {
	message: null
	,call: null
	,__class__: db_DatabaseError
};
var db_DatabaseFactory = function() {
	this._databaseTypes = new haxe_ds_StringMap();
	this.init();
};
$hxClasses["db.DatabaseFactory"] = db_DatabaseFactory;
db_DatabaseFactory.__name__ = "db.DatabaseFactory";
db_DatabaseFactory.__properties__ = {get_instance:"get_instance"};
db_DatabaseFactory.instance = null;
db_DatabaseFactory.get_instance = function() {
	if(db_DatabaseFactory._instance == null) {
		db_DatabaseFactory._instance = new db_DatabaseFactory();
	}
	return db_DatabaseFactory._instance;
};
db_DatabaseFactory.prototype = {
	_databaseTypes: null
	,init: function() {
		this.loadTypes();
	}
	,loadTypes: function() {
		var p = new db_mysql_MySqlDatabaseType();
		var typeInfo = p.typeInfo();
		this._databaseTypes.h["mysql"] = typeInfo.ctor;
	}
	,createDatabase: function(typeId,config) {
		if(!Object.prototype.hasOwnProperty.call(this._databaseTypes.h,typeId)) {
			throw new haxe_Exception("database type \"" + typeId + "\" not registered");
		}
		var ctor = this._databaseTypes.h[typeId];
		var instance = ctor();
		if(config != null) {
			instance.config(config);
		}
		return instance;
	}
	,__class__: db_DatabaseFactory
};
var db_DatabaseResult = function(database,table,data,itemsAffected) {
	this.itemsAffected = null;
	this.database = database;
	this.table = table;
	this.data = data;
	this.itemsAffected = itemsAffected;
};
$hxClasses["db.DatabaseResult"] = db_DatabaseResult;
db_DatabaseResult.__name__ = "db.DatabaseResult";
db_DatabaseResult.prototype = {
	database: null
	,table: null
	,data: null
	,itemsAffected: null
	,__class__: db_DatabaseResult
};
var db_DatabaseSchema = function(tables) {
	this.tables = [];
	if(tables != null) {
		this.tables = tables;
	}
};
$hxClasses["db.DatabaseSchema"] = db_DatabaseSchema;
db_DatabaseSchema.__name__ = "db.DatabaseSchema";
db_DatabaseSchema.prototype = {
	tables: null
	,findTable: function(name) {
		var _g = 0;
		var _g1 = this.tables;
		while(_g < _g1.length) {
			var t = _g1[_g];
			++_g;
			if(t.name.toLowerCase() == name.toLowerCase()) {
				return t;
			}
		}
		return null;
	}
	,setTableSchema: function(name,schema) {
		var _g = 0;
		var _g1 = this.tables.length;
		while(_g < _g1) {
			var i = _g++;
			if(this.tables[i].name.toLowerCase() == name.toLowerCase()) {
				this.tables[i] = schema;
				break;
			}
		}
	}
	,clone: function() {
		var c = new db_DatabaseSchema([]);
		var _g = 0;
		var _g1 = this.tables;
		while(_g < _g1.length) {
			var t = _g1[_g];
			++_g;
			c.tables.push(t.clone());
		}
		return c;
	}
	,debugString: function() {
		var sb_b = "";
		var _g = 0;
		var _g1 = this.tables;
		while(_g < _g1.length) {
			var table = _g1[_g];
			++_g;
			sb_b += Std.string(table.debugString());
		}
		return sb_b;
	}
	,__class__: db_DatabaseSchema
};
var db_DebugUtils = function() { };
$hxClasses["db.DebugUtils"] = db_DebugUtils;
db_DebugUtils.__name__ = "db.DebugUtils";
db_DebugUtils.printRecords = function(records,name) {
	var colSizes_h = Object.create(null);
	if(records == null || records.length == 0) {
		if(name != null) {
			process.stdout.write(Std.string(name + ": no records!"));
			process.stdout.write("\n");
		} else {
			process.stdout.write("no records!");
			process.stdout.write("\n");
		}
		return;
	}
	var r = records[0];
	var _g = 0;
	var _g1 = r.get_fieldNames();
	while(_g < _g1.length) {
		var fieldName = _g1[_g];
		++_g;
		colSizes_h[fieldName] = fieldName.length;
	}
	var _g = 0;
	while(_g < records.length) {
		var r = records[_g];
		++_g;
		var _g1 = 0;
		var _g2 = r.get_fieldNames();
		while(_g1 < _g2.length) {
			var fieldName = _g2[_g1];
			++_g1;
			var value = r.field(fieldName) == null ? "null" : Std.string(r.field(fieldName));
			var existingSize = colSizes_h[fieldName];
			var newSize = value.length;
			if(newSize > existingSize) {
				colSizes_h[fieldName] = newSize;
			}
		}
	}
	process.stdout.write("");
	process.stdout.write("\n");
	if(name != null) {
		var v = name + " (" + records.length + "):";
		process.stdout.write(Std.string(v));
		process.stdout.write("\n");
	}
	var r = records[0];
	var _g = 0;
	var _g1 = r.get_fieldNames();
	while(_g < _g1.length) {
		var fieldName = _g1[_g];
		++_g;
		var size = colSizes_h[fieldName];
		process.stdout.write("| ");
		var v = StringTools.rpad(fieldName," ",size);
		process.stdout.write(Std.string(v));
		process.stdout.write(" ");
	}
	process.stdout.write("|");
	process.stdout.write("\n");
	var _g = 0;
	var _g1 = r.get_fieldNames();
	while(_g < _g1.length) {
		var fieldName = _g1[_g];
		++_g;
		var size = colSizes_h[fieldName];
		process.stdout.write("|-");
		var v = StringTools.rpad("","-",size);
		process.stdout.write(Std.string(v));
		process.stdout.write("-");
	}
	process.stdout.write("|");
	process.stdout.write("\n");
	var _g = 0;
	while(_g < records.length) {
		var r = records[_g];
		++_g;
		var _g1 = 0;
		var _g2 = r.get_fieldNames();
		while(_g1 < _g2.length) {
			var fieldName = _g2[_g1];
			++_g1;
			var size = colSizes_h[fieldName];
			var value = StringTools.trim(r.field(fieldName) == null ? "null" : Std.string(r.field(fieldName)));
			process.stdout.write("| ");
			var v = StringTools.rpad(value," ",size);
			process.stdout.write(Std.string(v));
			process.stdout.write(" ");
		}
		process.stdout.write("|");
		process.stdout.write("\n");
	}
	process.stdout.write("");
	process.stdout.write("\n");
};
var db_IDataTypeMapper = function() { };
$hxClasses["db.IDataTypeMapper"] = db_IDataTypeMapper;
db_IDataTypeMapper.__name__ = "db.IDataTypeMapper";
db_IDataTypeMapper.__isInterface__ = true;
db_IDataTypeMapper.prototype = {
	haxeTypeToDatabaseType: null
	,shouldConvertValueToDatabase: null
	,convertValueToDatabase: null
	,databaseTypeToHaxeType: null
	,__class__: db_IDataTypeMapper
};
var db_IDatabase = function() { };
$hxClasses["db.IDatabase"] = db_IDatabase;
db_IDatabase.__name__ = "db.IDatabase";
db_IDatabase.__isInterface__ = true;
db_IDatabase.prototype = {
	config: null
	,setProperty: null
	,getProperty: null
	,schema: null
	,defineTableRelationship: null
	,definedTableRelationships: null
	,clearTableRelationships: null
	,connect: null
	,disconnect: null
	,create: null
	,'delete': null
	,table: null
	,createTable: null
	,deleteTable: null
	,raw: null
	,__class__: db_IDatabase
};
var db_ITable = function() { };
$hxClasses["db.ITable"] = db_ITable;
db_ITable.__name__ = "db.ITable";
db_ITable.__isInterface__ = true;
db_ITable.prototype = {
	db: null
	,name: null
	,exists: null
	,schema: null
	,applySchema: null
	,all: null
	,page: null
	,add: null
	,addAll: null
	,'delete': null
	,deleteAll: null
	,update: null
	,find: null
	,findOne: null
	,findUnique: null
	,count: null
	,addColumn: null
	,removeColumn: null
	,raw: null
	,__class__: db_ITable
};
var db_Record = function() {
	this.data = new haxe_ds_StringMap();
};
$hxClasses["db.Record"] = db_Record;
db_Record.__name__ = "db.Record";
db_Record.fromDynamic = function(data) {
	var r = new db_Record();
	var _g = 0;
	var _g1 = Reflect.fields(data);
	while(_g < _g1.length) {
		var f = _g1[_g];
		++_g;
		var v = Reflect.field(data,f);
		r.data.h[f] = v;
	}
	return r;
};
db_Record.prototype = {
	data: null
	,fieldNames: null
	,get_fieldNames: function() {
		var list = [];
		var h = this.data.h;
		var f_keys = Object.keys(h);
		var f_length = f_keys.length;
		var f_current = 0;
		while(f_current < f_length) {
			var f = f_keys[f_current++];
			list.push(f);
		}
		return list;
	}
	,fieldCount: null
	,get_fieldCount: function() {
		var n = 0;
		var h = this.data.h;
		var __keys = Object.keys(h);
		var __length = __keys.length;
		var __current = 0;
		while(__current < __length) {
			++__current;
			++n;
		}
		return n;
	}
	,hasField: function(name) {
		if(this.data == null) {
			return false;
		}
		return Object.prototype.hasOwnProperty.call(this.data.h,name);
	}
	,renameField: function(fieldName,newFieldName) {
		if(Object.prototype.hasOwnProperty.call(this.data.h,fieldName)) {
			var v = this.data.h[fieldName];
			this.data.h[newFieldName] = v;
			var _this = this.data;
			if(Object.prototype.hasOwnProperty.call(_this.h,fieldName)) {
				delete(_this.h[fieldName]);
			}
		}
	}
	,copyField: function(fieldName,newFieldName) {
		if(Object.prototype.hasOwnProperty.call(this.data.h,fieldName)) {
			var v = this.data.h[fieldName];
			this.data.h[newFieldName] = v;
		}
	}
	,filterFields: function(callback) {
		var newData = new haxe_ds_StringMap();
		var h = this.data.h;
		var fieldName_keys = Object.keys(h);
		var fieldName_length = fieldName_keys.length;
		var fieldName_current = 0;
		while(fieldName_current < fieldName_length) {
			var fieldName = fieldName_keys[fieldName_current++];
			var fieldValue = this.data.h[fieldName];
			if(callback(fieldName,fieldValue)) {
				newData.h[fieldName] = fieldValue;
			}
		}
		this.data = newData;
	}
	,findFields: function(callback) {
		var list = [];
		var h = this.data.h;
		var fieldName_keys = Object.keys(h);
		var fieldName_length = fieldName_keys.length;
		var fieldName_current = 0;
		while(fieldName_current < fieldName_length) {
			var fieldName = fieldName_keys[fieldName_current++];
			if(callback(fieldName)) {
				list.push(fieldName);
			}
		}
		return list;
	}
	,findFieldValues: function(callback) {
		var list = [];
		var h = this.data.h;
		var fieldName_keys = Object.keys(h);
		var fieldName_length = fieldName_keys.length;
		var fieldName_current = 0;
		while(fieldName_current < fieldName_length) {
			var fieldName = fieldName_keys[fieldName_current++];
			var fieldValue = this.data.h[fieldName];
			if(fieldValue == null) {
				continue;
			}
			if(callback(fieldName,fieldValue)) {
				list.push(fieldValue);
			}
		}
		return list;
	}
	,field: function(name,value) {
		if(value != null) {
			this.data.h[name] = value;
			return value;
		}
		return this.data.h[name];
	}
	,empty: function(name) {
		this.data.h[name] = null;
	}
	,values: function() {
		var v = [];
		var h = this.data.h;
		var k_keys = Object.keys(h);
		var k_length = k_keys.length;
		var k_current = 0;
		while(k_current < k_length) {
			var k = k_keys[k_current++];
			v.push(this.data.h[k]);
		}
		return v;
	}
	,stringValues: function() {
		var v = [];
		var h = this.data.h;
		var k_keys = Object.keys(h);
		var k_length = k_keys.length;
		var k_current = 0;
		while(k_current < k_length) {
			var k = k_keys[k_current++];
			var tmp;
			var this11 = this.data;
			if(this11.get(k) == null) {
				tmp = "null";
			} else {
				var this11 = this.data;
				tmp = Std.string(this11.get(k));
			}
			v.push(tmp);
		}
		return v;
	}
	,removeField: function(name) {
		var _this = this.data;
		if(Object.prototype.hasOwnProperty.call(_this.h,name)) {
			delete(_this.h[name]);
		}
	}
	,copy: function() {
		var c = new db_Record();
		c.data = haxe_ds_StringMap.createCopy(this.data.h);
		return c;
	}
	,debugString: function() {
		var sb_b = "";
		var h = this.data.h;
		var f_keys = Object.keys(h);
		var f_length = f_keys.length;
		var f_current = 0;
		while(f_current < f_length) {
			var f = f_keys[f_current++];
			sb_b += f == null ? "null" : "" + f;
			sb_b += "=";
			var x = this.data.h[f];
			sb_b += x == null ? "null" : Std.string(x);
			sb_b += "; ";
		}
		return sb_b;
	}
	,merge: function(other) {
		var h = other.data.h;
		var key_keys = Object.keys(h);
		var key_length = key_keys.length;
		var key_current = 0;
		while(key_current < key_length) {
			var key = key_keys[key_current++];
			var value = other.data.h[key];
			this.data.h[key] = value;
		}
	}
	,equals: function(other) {
		var thisFieldNames = this.get_fieldNames();
		var otherFieldNames = other.get_fieldNames();
		if(thisFieldNames.length != otherFieldNames.length) {
			return false;
		}
		var thisData = this.data;
		var otherData = other.data;
		var _g = 0;
		while(_g < thisFieldNames.length) {
			var thisFieldName = thisFieldNames[_g];
			++_g;
			if(!Object.prototype.hasOwnProperty.call(otherData.h,thisFieldName)) {
				return false;
			}
		}
		var _g = 0;
		while(_g < otherFieldNames.length) {
			var otherFieldName = otherFieldNames[_g];
			++_g;
			if(!Object.prototype.hasOwnProperty.call(thisData.h,otherFieldName)) {
				return false;
			}
		}
		var _g = 0;
		while(_g < thisFieldNames.length) {
			var thisFieldName = thisFieldNames[_g];
			++_g;
			if(thisData.h[thisFieldName] != otherData.h[thisFieldName]) {
				return false;
			}
		}
		return true;
	}
	,__class__: db_Record
	,__properties__: {get_fieldCount:"get_fieldCount",get_fieldNames:"get_fieldNames"}
};
var db_RecordSet = {};
db_RecordSet.get = function(this1,index) {
	return this1.records[index];
};
db_RecordSet.set = function(this1,index,value) {
	this1.records[index] = value;
	return value;
};
db_RecordSet.fromArray = function(records) {
	return new db__$RecordSet_RecordSetImpl(records);
};
db_RecordSet.toArray = function(this1) {
	return this1.records;
};
var db__$RecordSet_RecordSetImpl = function(records) {
	this.records = null;
	this.records = records;
};
$hxClasses["db._RecordSet.RecordSetImpl"] = db__$RecordSet_RecordSetImpl;
db__$RecordSet_RecordSetImpl.__name__ = "db._RecordSet.RecordSetImpl";
db__$RecordSet_RecordSetImpl.prototype = {
	records: null
	,iterator: function() {
		return new db__$RecordSet_RecordSetIterator(this.records);
	}
	,length: null
	,get_length: function() {
		if(this.records == null) {
			return 0;
		}
		return this.records.length;
	}
	,push: function(record) {
		if(this.records == null) {
			this.records = [];
		}
		this.records.push(record);
	}
	,filter: function(f) {
		if(this.records == null) {
			return new db__$RecordSet_RecordSetImpl([]);
		}
		var _this = this.records;
		var _g = [];
		var _g1 = 0;
		while(_g1 < _this.length) {
			var v = _this[_g1];
			++_g1;
			if(f(v)) {
				_g.push(v);
			}
		}
		return new db__$RecordSet_RecordSetImpl(_g);
	}
	,findRecord: function(fieldName,fieldValue) {
		if(this.records == null) {
			return null;
		}
		var _g = 0;
		var _g1 = this.records;
		while(_g < _g1.length) {
			var r = _g1[_g];
			++_g;
			if(r.field(fieldName) == fieldValue) {
				return r;
			}
		}
		return null;
	}
	,extractFieldValues: function(fieldName) {
		if(this.records == null) {
			return [];
		}
		var values = [];
		var _g = 0;
		var _g1 = this.records;
		while(_g < _g1.length) {
			var r = _g1[_g];
			++_g;
			var v = r.field(fieldName);
			if(v != null) {
				values.push(v);
			}
		}
		return values;
	}
	,renameField: function(fieldName,newFieldName) {
		if(this.records == null) {
			return;
		}
		var _g = 0;
		var _g1 = this.records;
		while(_g < _g1.length) {
			var r = _g1[_g];
			++_g;
			r.renameField(fieldName,newFieldName);
		}
	}
	,copyField: function(fieldName,newFieldName) {
		if(this.records == null) {
			return;
		}
		var _g = 0;
		var _g1 = this.records;
		while(_g < _g1.length) {
			var r = _g1[_g];
			++_g;
			r.copyField(fieldName,newFieldName);
		}
	}
	,copy: function() {
		return new db__$RecordSet_RecordSetImpl(this.records.slice());
	}
	,normalizeFieldNames: function() {
		var _g = 0;
		var _g1 = this.records;
		while(_g < _g1.length) {
			var r = _g1[_g];
			++_g;
			var h = r.data.h;
			var fieldName_keys = Object.keys(h);
			var fieldName_length = fieldName_keys.length;
			var fieldName_current = 0;
			while(fieldName_current < fieldName_length) {
				var fieldName = fieldName_keys[fieldName_current++];
				if(fieldName.indexOf(".") != -1) {
					var fieldNameParts = fieldName.split(".");
					var newFieldName = null;
					if(fieldNameParts.length > 2) {
						while(fieldNameParts.length > 2) fieldNameParts.shift();
						newFieldName = fieldNameParts.join(".");
					}
					if(newFieldName != null) {
						r.field(newFieldName,r.field(fieldName));
						r.removeField(fieldName);
					}
				}
			}
		}
	}
	,__class__: db__$RecordSet_RecordSetImpl
	,__properties__: {get_length:"get_length"}
};
var db__$RecordSet_RecordSetIterator = function(records) {
	this.pos = 0;
	this.records = null;
	this.records = records;
	this.pos = 0;
};
$hxClasses["db._RecordSet.RecordSetIterator"] = db__$RecordSet_RecordSetIterator;
db__$RecordSet_RecordSetIterator.__name__ = "db._RecordSet.RecordSetIterator";
db__$RecordSet_RecordSetIterator.prototype = {
	records: null
	,pos: null
	,hasNext: function() {
		if(this.records == null) {
			return false;
		}
		return this.pos < this.records.length;
	}
	,next: function() {
		var r = this.records[this.pos];
		this.pos++;
		return r;
	}
	,__class__: db__$RecordSet_RecordSetIterator
};
var db_RelationshipDefinitions = function() {
	this._defs = new haxe_ds_StringMap();
	this.complexRelationships = false;
};
$hxClasses["db.RelationshipDefinitions"] = db_RelationshipDefinitions;
db_RelationshipDefinitions.__name__ = "db.RelationshipDefinitions";
db_RelationshipDefinitions.prototype = {
	complexRelationships: null
	,_defs: null
	,relationships: null
	,add: function(field1,field2) {
		if(this.has(field1,field2)) {
			return;
		}
		var parts1 = field1.split(".");
		var parts2 = field2.split(".");
		var table1 = parts1.shift();
		var table2 = parts2.shift();
		var field1 = parts1.join(".");
		var field2 = parts2.join(".");
		var array = this._defs.h[table1];
		if(array == null) {
			array = [];
			this._defs.h[table1] = array;
		}
		array.push({ table1 : table1, table2 : table2, field1 : field1, field2 : field2});
	}
	,has: function(field1,field2) {
		var parts1 = field1.split(".");
		var parts2 = field2.split(".");
		var table1 = parts1.shift();
		var table2 = parts2.shift();
		var field1 = parts1.join(".");
		var field2 = parts2.join(".");
		var array = this._defs.h[table1];
		if(array == null) {
			return false;
		}
		var _g = 0;
		while(_g < array.length) {
			var item = array[_g];
			++_g;
			if(item.table1 == table1 && item.table2 == table2 && item.field1 == field1 && item.field2 == field2) {
				return true;
			}
		}
		return false;
	}
	,get: function(table) {
		return this._defs.h[table];
	}
	,all: function() {
		var list = [];
		var h = this._defs.h;
		var key_keys = Object.keys(h);
		var key_length = key_keys.length;
		var key_current = 0;
		while(key_current < key_length) {
			var key = key_keys[key_current++];
			list = list.concat(this._defs.h[key]);
		}
		return list;
	}
	,keys: function() {
		return new haxe_ds__$StringMap_StringMapKeyIterator(this._defs.h);
	}
	,debugString: function() {
		var sb_b = "";
		var h = this._defs.h;
		var key_keys = Object.keys(h);
		var key_length = key_keys.length;
		var key_current = 0;
		while(key_current < key_length) {
			var key = key_keys[key_current++];
			sb_b += key == null ? "null" : "" + key;
			sb_b += "\n";
			var _g = 0;
			var _g1 = this._defs.h[key];
			while(_g < _g1.length) {
				var item = _g1[_g];
				++_g;
				sb_b += "    ";
				sb_b += Std.string(item.table1 + "." + item.field1 + " <==> " + item.table2 + "." + item.field2);
				sb_b += "\n";
			}
		}
		return sb_b;
	}
	,__class__: db_RelationshipDefinitions
};
var db_TableSchema = function(name,columns,data) {
	this.columns = [];
	this.name = name;
	if(columns != null) {
		this.columns = columns;
	}
	this.data = data;
};
$hxClasses["db.TableSchema"] = db_TableSchema;
db_TableSchema.__name__ = "db.TableSchema";
db_TableSchema.prototype = {
	name: null
	,columns: null
	,data: null
	,equals: function(other) {
		if(this.name != other.name) {
			return false;
		}
		if(this.columns.length != other.columns.length) {
			return false;
		}
		var _g = 0;
		var _g1 = this.columns;
		while(_g < _g1.length) {
			var column = _g1[_g];
			++_g;
			if(other.findColumn(column.name) == null) {
				return false;
			}
		}
		var _g = 0;
		var _g1 = other.columns;
		while(_g < _g1.length) {
			var column = _g1[_g];
			++_g;
			if(this.findColumn(column.name) == null) {
				return false;
			}
		}
		return true;
	}
	,findPrimaryKeyColumns: function() {
		var primaryKeyColumns = [];
		var _g = 0;
		var _g1 = this.columns;
		while(_g < _g1.length) {
			var column = _g1[_g];
			++_g;
			if(column.options != null && column.options.indexOf(db_ColumnOptions.PrimaryKey) != -1) {
				primaryKeyColumns.push(column);
			}
		}
		return primaryKeyColumns;
	}
	,findColumn: function(name) {
		var _g = 0;
		var _g1 = this.columns;
		while(_g < _g1.length) {
			var column = _g1[_g];
			++_g;
			if(column.name == name) {
				return column;
			}
		}
		return null;
	}
	,diff: function(other) {
		var d = new db_TableSchemaDiff();
		var _g = 0;
		var _g1 = this.columns;
		while(_g < _g1.length) {
			var column = _g1[_g];
			++_g;
			if(other.findColumn(column.name) == null) {
				d.removedColumns.push(column);
			}
		}
		var _g = 0;
		var _g1 = other.columns;
		while(_g < _g1.length) {
			var column = _g1[_g];
			++_g;
			if(this.findColumn(column.name) == null) {
				d.addedColumns.push(column);
			}
		}
		return d;
	}
	,clone: function() {
		var c = new db_TableSchema(this.name,[],null);
		c.name = this.name;
		var _g = 0;
		var _g1 = this.columns;
		while(_g < _g1.length) {
			var col = _g1[_g];
			++_g;
			c.columns.push(col.clone());
		}
		if(this.data != null) {
			c.data = this.data.copy();
		}
		return c;
	}
	,debugString: function() {
		var sb_b = "";
		sb_b = "" + Std.string(this.name);
		sb_b += ":";
		sb_b += "\n";
		var _g = 0;
		var _g1 = this.columns;
		while(_g < _g1.length) {
			var column = _g1[_g];
			++_g;
			sb_b += "    ";
			sb_b += Std.string(column.debugString());
			sb_b += "\n";
		}
		return sb_b;
	}
	,__class__: db_TableSchema
};
var db_TableSchemaDiff = function() {
	this.updatedColumns = [];
	this.removedColumns = [];
	this.addedColumns = [];
};
$hxClasses["db.TableSchemaDiff"] = db_TableSchemaDiff;
db_TableSchemaDiff.__name__ = "db.TableSchemaDiff";
db_TableSchemaDiff.prototype = {
	addedColumns: null
	,removedColumns: null
	,updatedColumns: null
	,__class__: db_TableSchemaDiff
};
var db_macros_IDatabaseType = function() { };
$hxClasses["db.macros.IDatabaseType"] = db_macros_IDatabaseType;
db_macros_IDatabaseType.__name__ = "db.macros.IDatabaseType";
db_macros_IDatabaseType.__isInterface__ = true;
db_macros_IDatabaseType.prototype = {
	typeInfo: null
	,__class__: db_macros_IDatabaseType
};
var db_mysql_MySqlDataTypeMapper = function() {
};
$hxClasses["db.mysql.MySqlDataTypeMapper"] = db_mysql_MySqlDataTypeMapper;
db_mysql_MySqlDataTypeMapper.__name__ = "db.mysql.MySqlDataTypeMapper";
db_mysql_MySqlDataTypeMapper.__interfaces__ = [db_IDataTypeMapper];
db_mysql_MySqlDataTypeMapper.get = function() {
	if(db_mysql_MySqlDataTypeMapper._instance == null) {
		db_mysql_MySqlDataTypeMapper._instance = new db_mysql_MySqlDataTypeMapper();
	}
	return db_mysql_MySqlDataTypeMapper._instance;
};
db_mysql_MySqlDataTypeMapper.prototype = {
	shouldConvertValueToDatabase: function(value) {
		if(((value) instanceof haxe_io_Bytes)) {
			return true;
		}
		return false;
	}
	,convertValueToDatabase: function(value) {
		if(((value) instanceof haxe_io_Bytes)) {
			var bytes = value;
			return bytes.toString();
		}
		return value;
	}
	,haxeTypeToDatabaseType: function(haxeType) {
		switch(haxeType._hx_index) {
		case 0:
			return "INT";
		case 1:
			return "DOUBLE";
		case 2:
			return "INT";
		case 3:
			return "VARCHAR(" + haxeType.n + ")";
		case 4:
			return "TEXT";
		case 5:
			return "BLOB";
		case 6:
			return "TEXT";
		}
	}
	,databaseTypeToHaxeType: function(databaseType) {
		var parts = databaseType.split(":");
		var type = parts[0].toUpperCase();
		var len = parts[1];
		if(type == "INT") {
			return db_ColumnType.Number;
		} else if(type == "DOUBLE") {
			return db_ColumnType.Decimal;
		} else if(type == "VARCHAR") {
			return db_ColumnType.Text(Std.parseInt(len));
		} else if(type == "TEXT") {
			return db_ColumnType.Memo;
		} else if(type == "BLOB") {
			return db_ColumnType.Binary;
		}
		return db_ColumnType.Unknown;
	}
	,__class__: db_mysql_MySqlDataTypeMapper
};
var logging_ILogger = function() { };
$hxClasses["logging.ILogger"] = logging_ILogger;
logging_ILogger.__name__ = "logging.ILogger";
logging_ILogger.__isInterface__ = true;
logging_ILogger.prototype = {
	info: null
	,debug: null
	,error: null
	,warn: null
	,data: null
	,performance: null
	,__class__: logging_ILogger
};
var logging_Logger = function(ref,instanceId,generateInstanceId) {
	if(generateInstanceId == null) {
		generateInstanceId = false;
	}
	this._measurements = null;
	this._instanceId = null;
	this._ref = null;
	if(ref != null) {
		this._ref = ref.__name__;
	}
	this._instanceId = instanceId;
	if(this._instanceId == null && generateInstanceId) {
		this._instanceId = this.generateUuid();
	}
};
$hxClasses["logging.Logger"] = logging_Logger;
logging_Logger.__name__ = "logging.Logger";
logging_Logger.__interfaces__ = [logging_ILogger];
logging_Logger.prototype = {
	_ref: null
	,_instanceId: null
	,info: function(message,data) {
		logging_LogManager.get_instance().log({ timestamp : HxOverrides.dateStr(new Date()), level : "Info", message : message, data : data, ref : this._ref, instanceId : this._instanceId});
	}
	,debug: function(message,data) {
		logging_LogManager.get_instance().log({ timestamp : HxOverrides.dateStr(new Date()), level : "Debug", message : message, data : data, ref : this._ref, instanceId : this._instanceId});
	}
	,error: function(message,data) {
		logging_LogManager.get_instance().log({ timestamp : HxOverrides.dateStr(new Date()), level : "Error", message : message, data : data, ref : this._ref, instanceId : this._instanceId});
	}
	,warn: function(message,data) {
		logging_LogManager.get_instance().log({ timestamp : HxOverrides.dateStr(new Date()), level : "Warning", message : message, data : data, ref : this._ref, instanceId : this._instanceId});
	}
	,data: function(message,data) {
		logging_LogManager.get_instance().log({ timestamp : HxOverrides.dateStr(new Date()), level : "Data", message : message, data : data, ref : this._ref, instanceId : this._instanceId});
	}
	,performance: function(message,data) {
		logging_LogManager.get_instance().log({ timestamp : HxOverrides.dateStr(new Date()), level : "Performance", message : message, data : data, ref : this._ref, instanceId : this._instanceId});
	}
	,_measurements: null
	,beginMeasure: function(name) {
		if(this._measurements == null) {
			this._measurements = new haxe_ds_StringMap();
		}
		var this1 = this._measurements;
		var value = new Date().getTime();
		this1.h[name] = value;
	}
	,endMeasure: function(name) {
		if(this._measurements == null) {
			this._measurements = new haxe_ds_StringMap();
		}
		if(Object.prototype.hasOwnProperty.call(this._measurements.h,name)) {
			var start = this._measurements.h[name];
			var time = Math.round(new Date().getTime() - start);
			logging_LogManager.get_instance().log({ timestamp : HxOverrides.dateStr(new Date()), level : "Performance", message : name + " " + time + "ms", data : null, ref : this._ref, instanceId : this._instanceId});
			var _this = this._measurements;
			if(Object.prototype.hasOwnProperty.call(_this.h,name)) {
				delete(_this.h[name]);
			}
		}
	}
	,log: function(level,message,data) {
		logging_LogManager.get_instance().log({ timestamp : HxOverrides.dateStr(new Date()), level : level, message : message, data : data, ref : this._ref, instanceId : this._instanceId});
	}
	,createUniqueInstanceId: function(prefix) {
		if(logging_Logger._uniqueIds == null) {
			logging_Logger._uniqueIds = new haxe_ds_StringMap();
		}
		var key = this._ref;
		if(prefix != null) {
			key += "_" + prefix;
		}
		var n = 0;
		if(Object.prototype.hasOwnProperty.call(logging_Logger._uniqueIds.h,key)) {
			n = logging_Logger._uniqueIds.h[key];
			++n;
		}
		logging_Logger._uniqueIds.h[key] = n;
		if(prefix != null) {
			this._instanceId = prefix + n;
		} else {
			this._instanceId = "instance" + n;
		}
	}
	,generateUuid: function() {
		var uuid = "";
		var _g = 0;
		while(_g < 8) {
			var i = _g++;
			var n = new Date().getTime() + Std.random(16777215) * Std.random(16777215);
			var hash = haxe_crypto_Sha1.encode(n == null ? "null" : "" + n);
			var c1 = hash.charAt(Std.random(hash.length));
			var c2 = hash.charAt(Std.random(hash.length));
			var c3 = hash.charAt(Std.random(hash.length));
			var c4 = hash.charAt(Std.random(hash.length));
			uuid += c1 + c2 + c3 + c4;
			if(i == 1 || i == 2 || i == 3 || i == 4) {
				uuid += "-";
			}
		}
		return uuid;
	}
	,__class__: logging_Logger
};
var db_mysql_MySqlDatabase = function() {
	this._schema = null;
	this._properties = new haxe_ds_StringMap();
	this._relationshipDefs = null;
	this._connection = null;
};
$hxClasses["db.mysql.MySqlDatabase"] = db_mysql_MySqlDatabase;
db_mysql_MySqlDatabase.__name__ = "db.mysql.MySqlDatabase";
db_mysql_MySqlDatabase.__interfaces__ = [db_IDatabase];
db_mysql_MySqlDatabase.prototype = {
	_connection: null
	,_relationshipDefs: null
	,_config: null
	,_properties: null
	,setProperty: function(name,value) {
		if(name == "complexRelationships") {
			if(this._relationshipDefs == null) {
				this._relationshipDefs = new db_RelationshipDefinitions();
			}
			this._relationshipDefs.complexRelationships = value;
		}
		var _this = db_mysql_MySqlDatabase.log;
		logging_LogManager.get_instance().log({ timestamp : HxOverrides.dateStr(new Date()), level : "Debug", message : "setting property", data : [name,value], ref : _this._ref, instanceId : _this._instanceId});
		this._properties.h[name] = value;
	}
	,getProperty: function(name,defaultValue) {
		if(this._properties == null || !Object.prototype.hasOwnProperty.call(this._properties.h,name)) {
			return defaultValue;
		}
		return this._properties.h[name];
	}
	,config: function(details) {
		this._config = details;
		var _this = db_mysql_MySqlDatabase.log;
		var data = this._config;
		logging_LogManager.get_instance().log({ timestamp : HxOverrides.dateStr(new Date()), level : "Debug", message : "config", data : data, ref : _this._ref, instanceId : _this._instanceId});
	}
	,createConnection: function() {
		if(this._connection != null) {
			return;
		}
		var _this = db_mysql_MySqlDatabase.log;
		logging_LogManager.get_instance().log({ timestamp : HxOverrides.dateStr(new Date()), level : "Debug", message : "creating connection", data : null, ref : _this._ref, instanceId : _this._instanceId});
		this._connection = new mysql_impl_nodejs_DatabaseConnection({ host : this._config.host, user : this._config.user, pass : this._config.pass});
		var autoReconnect = this.getProperty("autoReconnect",null);
		var autoReconnectIntervalMS = this.getProperty("autoReconnectIntervalMS",null);
		var replayQueriesOnReconnection = this.getProperty("replayQueriesOnReconnection",null);
		if(autoReconnect != null) {
			this._connection.autoReconnect = autoReconnect;
		}
		if(autoReconnectIntervalMS != null) {
			this._connection.autoReconnectIntervalMS = autoReconnectIntervalMS;
		}
		if(replayQueriesOnReconnection != null) {
			this._connection.replayQueriesOnReconnection = replayQueriesOnReconnection;
		}
	}
	,create: function() {
		var _gthis = this;
		return thenshim_Promise._new(function(resolve,reject) {
			if(_gthis._config.database == null) {
				resolve(new db_DatabaseResult(_gthis));
				return;
			} else {
				var _this = db_mysql_MySqlDatabase.log;
				var name = "create " + Std.string(_gthis._config.database);
				if(_this._measurements == null) {
					_this._measurements = new haxe_ds_StringMap();
				}
				var this1 = _this._measurements;
				var value = new Date().getTime();
				this1.h[name] = value;
				var _this = db_mysql_MySqlDatabase.log;
				var data = _gthis._config.database;
				logging_LogManager.get_instance().log({ timestamp : HxOverrides.dateStr(new Date()), level : "Debug", message : "creating database:", data : data, ref : _this._ref, instanceId : _this._instanceId});
				_gthis._connection.connectionDetails.database = _gthis._config.database;
				thenshim_Promise.then(thenshim_Promise.then(_gthis._connection.exec(db_mysql_Utils.buildCreateDatabase(_gthis._config.database)),function(response) {
					_gthis.clearCachedSchema();
					return _gthis._connection.query(db_mysql_Utils.buildSelectDatabase(_gthis._config.database));
				}),function(_) {
					var _this = db_mysql_MySqlDatabase.log;
					var name = "create " + Std.string(_gthis._config.database);
					if(_this._measurements == null) {
						_this._measurements = new haxe_ds_StringMap();
					}
					if(Object.prototype.hasOwnProperty.call(_this._measurements.h,name)) {
						var start = _this._measurements.h[name];
						var time = Math.round(new Date().getTime() - start);
						logging_LogManager.get_instance().log({ timestamp : HxOverrides.dateStr(new Date()), level : "Performance", message : name + " " + time + "ms", data : null, ref : _this._ref, instanceId : _this._instanceId});
						var _this1 = _this._measurements;
						if(Object.prototype.hasOwnProperty.call(_this1.h,name)) {
							delete(_this1.h[name]);
						}
					}
					resolve(new db_DatabaseResult(_gthis));
				},function(error) {
					var _this = db_mysql_MySqlDatabase.log;
					var name = "create " + Std.string(_gthis._config.database);
					if(_this._measurements == null) {
						_this._measurements = new haxe_ds_StringMap();
					}
					if(Object.prototype.hasOwnProperty.call(_this._measurements.h,name)) {
						var start = _this._measurements.h[name];
						var time = Math.round(new Date().getTime() - start);
						logging_LogManager.get_instance().log({ timestamp : HxOverrides.dateStr(new Date()), level : "Performance", message : name + " " + time + "ms", data : null, ref : _this._ref, instanceId : _this._instanceId});
						var _this1 = _this._measurements;
						if(Object.prototype.hasOwnProperty.call(_this1.h,name)) {
							delete(_this1.h[name]);
						}
					}
					var _this = db_mysql_MySqlDatabase.log;
					logging_LogManager.get_instance().log({ timestamp : HxOverrides.dateStr(new Date()), level : "Error", message : "error creating database:", data : error, ref : _this._ref, instanceId : _this._instanceId});
					reject(db_mysql_Utils.MySqlError2DatabaseError(error,"delete"));
				});
			}
		});
	}
	,'delete': function() {
		var _gthis = this;
		return thenshim_Promise._new(function(resolve,reject) {
			if(_gthis._config.database == null) {
				resolve(new db_DatabaseResult(_gthis,null,true));
				return;
			} else {
				var _this = db_mysql_MySqlDatabase.log;
				var name = "delete " + Std.string(_gthis._config.database);
				if(_this._measurements == null) {
					_this._measurements = new haxe_ds_StringMap();
				}
				var this1 = _this._measurements;
				var value = new Date().getTime();
				this1.h[name] = value;
				var _this = db_mysql_MySqlDatabase.log;
				var data = _gthis._config.database;
				logging_LogManager.get_instance().log({ timestamp : HxOverrides.dateStr(new Date()), level : "Debug", message : "deleting database:", data : data, ref : _this._ref, instanceId : _this._instanceId});
				thenshim_Promise.then(_gthis._connection.exec(db_mysql_Utils.buildDropDatabase(_gthis._config.database)),function(response) {
					_gthis.clearCachedSchema();
					var _this = db_mysql_MySqlDatabase.log;
					var name = "delete " + Std.string(_gthis._config.database);
					if(_this._measurements == null) {
						_this._measurements = new haxe_ds_StringMap();
					}
					if(Object.prototype.hasOwnProperty.call(_this._measurements.h,name)) {
						var start = _this._measurements.h[name];
						var time = Math.round(new Date().getTime() - start);
						logging_LogManager.get_instance().log({ timestamp : HxOverrides.dateStr(new Date()), level : "Performance", message : name + " " + time + "ms", data : null, ref : _this._ref, instanceId : _this._instanceId});
						var _this1 = _this._measurements;
						if(Object.prototype.hasOwnProperty.call(_this1.h,name)) {
							delete(_this1.h[name]);
						}
					}
					resolve(new db_DatabaseResult(_gthis,null,true));
				},function(error) {
					var _this = db_mysql_MySqlDatabase.log;
					var name = "delete " + Std.string(_gthis._config.database);
					if(_this._measurements == null) {
						_this._measurements = new haxe_ds_StringMap();
					}
					if(Object.prototype.hasOwnProperty.call(_this._measurements.h,name)) {
						var start = _this._measurements.h[name];
						var time = Math.round(new Date().getTime() - start);
						logging_LogManager.get_instance().log({ timestamp : HxOverrides.dateStr(new Date()), level : "Performance", message : name + " " + time + "ms", data : null, ref : _this._ref, instanceId : _this._instanceId});
						var _this1 = _this._measurements;
						if(Object.prototype.hasOwnProperty.call(_this1.h,name)) {
							delete(_this1.h[name]);
						}
					}
					var _this = db_mysql_MySqlDatabase.log;
					logging_LogManager.get_instance().log({ timestamp : HxOverrides.dateStr(new Date()), level : "Error", message : "error deleting database:", data : error, ref : _this._ref, instanceId : _this._instanceId});
					reject(db_mysql_Utils.MySqlError2DatabaseError(error,"delete"));
				});
			}
		});
	}
	,_schema: null
	,schema: function(force) {
		if(force == null) {
			force = false;
		}
		var _gthis = this;
		return thenshim_Promise._new(function(resolve,reject) {
			if(force) {
				_gthis.clearCachedSchema();
			}
			if(_gthis._schema == null) {
				var _this = db_mysql_MySqlDatabase.log;
				if(_this._measurements == null) {
					_this._measurements = new haxe_ds_StringMap();
				}
				var this1 = _this._measurements;
				var value = new Date().getTime();
				this1.h["schema"] = value;
				var _this = db_mysql_MySqlDatabase.log;
				var data = _gthis._config.database;
				logging_LogManager.get_instance().log({ timestamp : HxOverrides.dateStr(new Date()), level : "Debug", message : "loading database schema for:", data : data, ref : _this._ref, instanceId : _this._instanceId});
				thenshim_Promise.then(db_mysql_Utils.loadFullDatabaseSchema(_gthis._connection,_gthis._config,db_mysql_MySqlDataTypeMapper.get()),function(schema) {
					_gthis._schema = schema;
					var _this = db_mysql_MySqlDatabase.log;
					if(_this._measurements == null) {
						_this._measurements = new haxe_ds_StringMap();
					}
					if(Object.prototype.hasOwnProperty.call(_this._measurements.h,"schema")) {
						var start = _this._measurements.h["schema"];
						var time = Math.round(new Date().getTime() - start);
						logging_LogManager.get_instance().log({ timestamp : HxOverrides.dateStr(new Date()), level : "Performance", message : "schema" + " " + time + "ms", data : null, ref : _this._ref, instanceId : _this._instanceId});
						var _this1 = _this._measurements;
						if(Object.prototype.hasOwnProperty.call(_this1.h,"schema")) {
							delete(_this1.h["schema"]);
						}
					}
					resolve(new db_DatabaseResult(_gthis,null,_gthis._schema));
				},function(error) {
					var _this = db_mysql_MySqlDatabase.log;
					if(_this._measurements == null) {
						_this._measurements = new haxe_ds_StringMap();
					}
					if(Object.prototype.hasOwnProperty.call(_this._measurements.h,"schema")) {
						var start = _this._measurements.h["schema"];
						var time = Math.round(new Date().getTime() - start);
						logging_LogManager.get_instance().log({ timestamp : HxOverrides.dateStr(new Date()), level : "Performance", message : "schema" + " " + time + "ms", data : null, ref : _this._ref, instanceId : _this._instanceId});
						var _this1 = _this._measurements;
						if(Object.prototype.hasOwnProperty.call(_this1.h,"schema")) {
							delete(_this1.h["schema"]);
						}
					}
					var _this = db_mysql_MySqlDatabase.log;
					logging_LogManager.get_instance().log({ timestamp : HxOverrides.dateStr(new Date()), level : "Error", message : "error loading database schema:", data : error, ref : _this._ref, instanceId : _this._instanceId});
					reject(db_mysql_Utils.MySqlError2DatabaseError(error,"schema"));
				});
			} else {
				resolve(new db_DatabaseResult(_gthis,null,_gthis._schema));
			}
		});
	}
	,clearCachedSchema: function() {
		this._schema = null;
	}
	,defineTableRelationship: function(field1,field2) {
		if(this._relationshipDefs == null) {
			this._relationshipDefs = new db_RelationshipDefinitions();
		}
		var _this = db_mysql_MySqlDatabase.log;
		logging_LogManager.get_instance().log({ timestamp : HxOverrides.dateStr(new Date()), level : "Debug", message : "defining relationship", data : [field1,field2], ref : _this._ref, instanceId : _this._instanceId});
		this._relationshipDefs.add(field1,field2);
	}
	,definedTableRelationships: function() {
		return this._relationshipDefs;
	}
	,clearTableRelationships: function() {
		this._relationshipDefs = null;
	}
	,connect: function() {
		var _gthis = this;
		return thenshim_Promise._new(function(resolve,reject) {
			var _this = db_mysql_MySqlDatabase.log;
			if(_this._measurements == null) {
				_this._measurements = new haxe_ds_StringMap();
			}
			var this1 = _this._measurements;
			var value = new Date().getTime();
			this1.h["connect"] = value;
			var _this = db_mysql_MySqlDatabase.log;
			logging_LogManager.get_instance().log({ timestamp : HxOverrides.dateStr(new Date()), level : "Debug", message : "connecting", data : null, ref : _this._ref, instanceId : _this._instanceId});
			_gthis.createConnection();
			thenshim_Promise.then(thenshim_Promise.then(thenshim_Promise.then(_gthis._connection.open(),function(response) {
				if(_gthis._config.database == null) {
					return null;
				}
				var _this = db_mysql_MySqlDatabase.log;
				var data = _gthis._config.database;
				logging_LogManager.get_instance().log({ timestamp : HxOverrides.dateStr(new Date()), level : "Debug", message : "checking for database:", data : data, ref : _this._ref, instanceId : _this._instanceId});
				return _gthis._connection.query(db_mysql_Utils.buildHasDatabase(_gthis._config.database));
			}),function(result) {
				if(result == null || result.data == null || result.data.length == 0) {
					return null;
				}
				var _this = db_mysql_MySqlDatabase.log;
				var data = _gthis._config.database;
				logging_LogManager.get_instance().log({ timestamp : HxOverrides.dateStr(new Date()), level : "Debug", message : "database exists:", data : data, ref : _this._ref, instanceId : _this._instanceId});
				return _gthis._connection.query(db_mysql_Utils.buildSelectDatabase(_gthis._config.database));
			}),function(_) {
				var _this = db_mysql_MySqlDatabase.log;
				if(_this._measurements == null) {
					_this._measurements = new haxe_ds_StringMap();
				}
				if(Object.prototype.hasOwnProperty.call(_this._measurements.h,"connect")) {
					var start = _this._measurements.h["connect"];
					var time = Math.round(new Date().getTime() - start);
					logging_LogManager.get_instance().log({ timestamp : HxOverrides.dateStr(new Date()), level : "Performance", message : "connect" + " " + time + "ms", data : null, ref : _this._ref, instanceId : _this._instanceId});
					var _this1 = _this._measurements;
					if(Object.prototype.hasOwnProperty.call(_this1.h,"connect")) {
						delete(_this1.h["connect"]);
					}
				}
				_gthis._connection.connectionDetails.database = _gthis._config.database;
				resolve(new db_DatabaseResult(_gthis,null,true));
			},function(error) {
				var _this = db_mysql_MySqlDatabase.log;
				if(_this._measurements == null) {
					_this._measurements = new haxe_ds_StringMap();
				}
				if(Object.prototype.hasOwnProperty.call(_this._measurements.h,"connect")) {
					var start = _this._measurements.h["connect"];
					var time = Math.round(new Date().getTime() - start);
					logging_LogManager.get_instance().log({ timestamp : HxOverrides.dateStr(new Date()), level : "Performance", message : "connect" + " " + time + "ms", data : null, ref : _this._ref, instanceId : _this._instanceId});
					var _this1 = _this._measurements;
					if(Object.prototype.hasOwnProperty.call(_this1.h,"connect")) {
						delete(_this1.h["connect"]);
					}
				}
				var _this = db_mysql_MySqlDatabase.log;
				logging_LogManager.get_instance().log({ timestamp : HxOverrides.dateStr(new Date()), level : "Error", message : "error connecting:", data : error, ref : _this._ref, instanceId : _this._instanceId});
				reject(db_mysql_Utils.MySqlError2DatabaseError(error,"connect"));
			});
		});
	}
	,disconnect: function() {
		var _gthis = this;
		return thenshim_Promise._new(function(resolve,reject) {
			var _this = db_mysql_MySqlDatabase.log;
			logging_LogManager.get_instance().log({ timestamp : HxOverrides.dateStr(new Date()), level : "Debug", message : "disconnecting", data : null, ref : _this._ref, instanceId : _this._instanceId});
			_gthis._connection.close();
			_gthis._connection = null;
			_gthis.clearCachedSchema();
			resolve(new db_DatabaseResult(_gthis,null,true));
		});
	}
	,table: function(name) {
		var _gthis = this;
		return thenshim_Promise._new(function(resolve,reject) {
			var _this = db_mysql_MySqlDatabase.log;
			if(_this._measurements == null) {
				_this._measurements = new haxe_ds_StringMap();
			}
			var this1 = _this._measurements;
			var value = new Date().getTime();
			this1.h["table " + name] = value;
			var _this = db_mysql_MySqlDatabase.log;
			var data = [_gthis._config.database,name];
			logging_LogManager.get_instance().log({ timestamp : HxOverrides.dateStr(new Date()), level : "Debug", message : "looking for table:", data : data, ref : _this._ref, instanceId : _this._instanceId});
			thenshim_Promise.then(_gthis._connection.get("SELECT * FROM information_schema.TABLES WHERE TABLE_SCHEMA=? AND TABLE_NAME=?;",[_gthis._config.database,name]),function(response) {
				var table = new db_mysql_MySqlTable(_gthis);
				table.name = name;
				table.exists = response.data != null;
				var _this = db_mysql_MySqlDatabase.log;
				var name1 = "table " + name;
				if(_this._measurements == null) {
					_this._measurements = new haxe_ds_StringMap();
				}
				if(Object.prototype.hasOwnProperty.call(_this._measurements.h,name1)) {
					var start = _this._measurements.h[name1];
					var time = Math.round(new Date().getTime() - start);
					logging_LogManager.get_instance().log({ timestamp : HxOverrides.dateStr(new Date()), level : "Performance", message : name1 + " " + time + "ms", data : null, ref : _this._ref, instanceId : _this._instanceId});
					var _this1 = _this._measurements;
					if(Object.prototype.hasOwnProperty.call(_this1.h,name1)) {
						delete(_this1.h[name1]);
					}
				}
				if(table.exists) {
					var _this = db_mysql_MySqlDatabase.log;
					var data = [_gthis._config.database,name];
					logging_LogManager.get_instance().log({ timestamp : HxOverrides.dateStr(new Date()), level : "Debug", message : "table found:", data : data, ref : _this._ref, instanceId : _this._instanceId});
				} else {
					var _this = db_mysql_MySqlDatabase.log;
					var data = [_gthis._config.database,name];
					logging_LogManager.get_instance().log({ timestamp : HxOverrides.dateStr(new Date()), level : "Debug", message : "table not found:", data : data, ref : _this._ref, instanceId : _this._instanceId});
				}
				resolve(new db_DatabaseResult(_gthis,table));
			},function(error) {
				var _this = db_mysql_MySqlDatabase.log;
				var name1 = "table " + name;
				if(_this._measurements == null) {
					_this._measurements = new haxe_ds_StringMap();
				}
				if(Object.prototype.hasOwnProperty.call(_this._measurements.h,name1)) {
					var start = _this._measurements.h[name1];
					var time = Math.round(new Date().getTime() - start);
					logging_LogManager.get_instance().log({ timestamp : HxOverrides.dateStr(new Date()), level : "Performance", message : name1 + " " + time + "ms", data : null, ref : _this._ref, instanceId : _this._instanceId});
					var _this1 = _this._measurements;
					if(Object.prototype.hasOwnProperty.call(_this1.h,name1)) {
						delete(_this1.h[name1]);
					}
				}
				var _this = db_mysql_MySqlDatabase.log;
				logging_LogManager.get_instance().log({ timestamp : HxOverrides.dateStr(new Date()), level : "Error", message : "error looking for table:", data : error, ref : _this._ref, instanceId : _this._instanceId});
				reject(db_mysql_Utils.MySqlError2DatabaseError(error,"table"));
			});
		});
	}
	,createTable: function(name,columns) {
		var _gthis = this;
		return thenshim_Promise._new(function(resolve,reject) {
			var _this = db_mysql_MySqlDatabase.log;
			if(_this._measurements == null) {
				_this._measurements = new haxe_ds_StringMap();
			}
			var this1 = _this._measurements;
			var value = new Date().getTime();
			this1.h["createTable " + name] = value;
			var _this = db_mysql_MySqlDatabase.log;
			logging_LogManager.get_instance().log({ timestamp : HxOverrides.dateStr(new Date()), level : "Debug", message : "creating table", data : [name,columns], ref : _this._ref, instanceId : _this._instanceId});
			var sql = db_mysql_Utils.buildCreateTable(name,columns,db_mysql_MySqlDataTypeMapper.get());
			thenshim_Promise.then(_gthis._connection.exec(sql),function(response) {
				var table = new db_mysql_MySqlTable(_gthis);
				table.name = name;
				table.exists = true;
				var _this = db_mysql_MySqlDatabase.log;
				var name1 = "createTable " + name;
				if(_this._measurements == null) {
					_this._measurements = new haxe_ds_StringMap();
				}
				if(Object.prototype.hasOwnProperty.call(_this._measurements.h,name1)) {
					var start = _this._measurements.h[name1];
					var time = Math.round(new Date().getTime() - start);
					logging_LogManager.get_instance().log({ timestamp : HxOverrides.dateStr(new Date()), level : "Performance", message : name1 + " " + time + "ms", data : null, ref : _this._ref, instanceId : _this._instanceId});
					var _this1 = _this._measurements;
					if(Object.prototype.hasOwnProperty.call(_this1.h,name1)) {
						delete(_this1.h[name1]);
					}
				}
				_gthis._schema = null;
				resolve(new db_DatabaseResult(_gthis,table));
			},function(error) {
				var _this = db_mysql_MySqlDatabase.log;
				var name1 = "createTable " + name;
				if(_this._measurements == null) {
					_this._measurements = new haxe_ds_StringMap();
				}
				if(Object.prototype.hasOwnProperty.call(_this._measurements.h,name1)) {
					var start = _this._measurements.h[name1];
					var time = Math.round(new Date().getTime() - start);
					logging_LogManager.get_instance().log({ timestamp : HxOverrides.dateStr(new Date()), level : "Performance", message : name1 + " " + time + "ms", data : null, ref : _this._ref, instanceId : _this._instanceId});
					var _this1 = _this._measurements;
					if(Object.prototype.hasOwnProperty.call(_this1.h,name1)) {
						delete(_this1.h[name1]);
					}
				}
				var _this = db_mysql_MySqlDatabase.log;
				logging_LogManager.get_instance().log({ timestamp : HxOverrides.dateStr(new Date()), level : "Error", message : "error creating table", data : error, ref : _this._ref, instanceId : _this._instanceId});
				reject(db_mysql_Utils.MySqlError2DatabaseError(error,"createTable"));
			});
		});
	}
	,deleteTable: function(name) {
		var _gthis = this;
		return thenshim_Promise._new(function(resolve,reject) {
			_gthis._schema = null;
			reject(new db_DatabaseError("not implemented","deleteTable"));
		});
	}
	,raw: function(data,values) {
		var _gthis = this;
		return thenshim_Promise._new(function(resolve,reject) {
			if(values == null) {
				values = [];
			}
			var sql = data;
			thenshim_Promise.then(_gthis._connection.all(sql,values),function(response) {
				var records = new db__$RecordSet_RecordSetImpl([]);
				var _g = 0;
				var _g1 = response.data;
				while(_g < _g1.length) {
					var item = _g1[_g];
					++_g;
					records.push(db_Record.fromDynamic(item));
				}
				resolve(new db_DatabaseResult(_gthis,null,records));
			},function(error) {
				reject(db_mysql_Utils.MySqlError2DatabaseError(error,"raw"));
			});
		});
	}
	,__class__: db_mysql_MySqlDatabase
};
var db_mysql_MySqlDatabaseType = function() {
};
$hxClasses["db.mysql.MySqlDatabaseType"] = db_mysql_MySqlDatabaseType;
db_mysql_MySqlDatabaseType.__name__ = "db.mysql.MySqlDatabaseType";
db_mysql_MySqlDatabaseType.__interfaces__ = [db_macros_IDatabaseType];
db_mysql_MySqlDatabaseType.prototype = {
	typeInfo: function() {
		return { ctor : function() {
			return new db_mysql_MySqlDatabase();
		}};
	}
	,__class__: db_mysql_MySqlDatabaseType
};
var db_mysql_MySqlTable = function(db) {
	this._tableSchema = null;
	this.db = db;
};
$hxClasses["db.mysql.MySqlTable"] = db_mysql_MySqlTable;
db_mysql_MySqlTable.__name__ = "db.mysql.MySqlTable";
db_mysql_MySqlTable.__interfaces__ = [db_ITable];
db_mysql_MySqlTable.prototype = {
	db: null
	,name: null
	,exists: null
	,_tableSchema: null
	,schema: function(force) {
		if(force == null) {
			force = false;
		}
		var _gthis = this;
		return thenshim_Promise._new(function(resolve,reject) {
			if(force) {
				_gthis.clearCachedSchema();
			}
			if(_gthis._tableSchema != null) {
				resolve(new db_DatabaseResult(_gthis.db,_gthis,_gthis._tableSchema));
				return;
			}
			thenshim_Promise.then(_gthis.db.schema(force),function(result) {
				_gthis._tableSchema = result.data.findTable(_gthis.name);
				resolve(new db_DatabaseResult(_gthis.db,_gthis,_gthis._tableSchema));
			},function(error) {
				reject(error);
			});
		});
	}
	,clearCachedSchema: function() {
		this._tableSchema = null;
	}
	,applySchema: function(newSchema) {
		var _gthis = this;
		return thenshim_Promise._new(function(resolve,reject) {
			var schemaChanged = false;
			var _this = db_mysql_MySqlTable.log;
			if(_this._measurements == null) {
				_this._measurements = new haxe_ds_StringMap();
			}
			var this1 = _this._measurements;
			var value = new Date().getTime();
			this1.h["applying schema"] = value;
			var _this = db_mysql_MySqlTable.log;
			logging_LogManager.get_instance().log({ timestamp : HxOverrides.dateStr(new Date()), level : "Debug", message : "applying schema", data : null, ref : _this._ref, instanceId : _this._instanceId});
			thenshim_Promise.then(thenshim_Promise.then(_gthis.schema(),function(result) {
				var promises = [];
				var currentSchema = result.data;
				if(currentSchema != null && !currentSchema.equals(newSchema)) {
					var diff = currentSchema.diff(newSchema);
					var _g = 0;
					var _g1 = diff.addedColumns;
					while(_g < _g1.length) {
						var added = _g1[_g];
						++_g;
						promises.push((function(_g,column) {
							return function() {
								return _g[0].addColumn(column[0]);
							};
						})([_gthis],[added]));
						schemaChanged = true;
					}
					var _g = 0;
					var _g1 = diff.removedColumns;
					while(_g < _g1.length) {
						var removed = _g1[_g];
						++_g;
						promises.push((function(_g,column) {
							return function() {
								return _g[0].removeColumn(column[0]);
							};
						})([_gthis],[removed]));
						schemaChanged = true;
					}
				}
				return promises_PromiseUtils.runSequentially(promises);
			}),function(result) {
				if(schemaChanged) {
					_gthis.clearCachedSchema();
					(js_Boot.__cast(_gthis.db , db_mysql_MySqlDatabase)).clearCachedSchema();
				}
				var _this = db_mysql_MySqlTable.log;
				if(_this._measurements == null) {
					_this._measurements = new haxe_ds_StringMap();
				}
				if(Object.prototype.hasOwnProperty.call(_this._measurements.h,"applying schema")) {
					var start = _this._measurements.h["applying schema"];
					var time = Math.round(new Date().getTime() - start);
					logging_LogManager.get_instance().log({ timestamp : HxOverrides.dateStr(new Date()), level : "Performance", message : "applying schema" + " " + time + "ms", data : null, ref : _this._ref, instanceId : _this._instanceId});
					var _this1 = _this._measurements;
					if(Object.prototype.hasOwnProperty.call(_this1.h,"applying schema")) {
						delete(_this1.h["applying schema"]);
					}
				}
				resolve(new db_DatabaseResult(_gthis.db,_gthis,newSchema));
			},function(error) {
				var _this = db_mysql_MySqlTable.log;
				logging_LogManager.get_instance().log({ timestamp : HxOverrides.dateStr(new Date()), level : "Error", message : "error applying schema", data : null, ref : _this._ref, instanceId : _this._instanceId});
				reject(error);
			});
		});
	}
	,all: function() {
		var _gthis = this;
		return thenshim_Promise._new(function(resolve,reject) {
			if(!_gthis.exists) {
				reject(new db_DatabaseError("table \"" + _gthis.name + "\" does not exist","all"));
				return;
			}
			var _this = db_mysql_MySqlTable.log;
			if(_this._measurements == null) {
				_this._measurements = new haxe_ds_StringMap();
			}
			var this1 = _this._measurements;
			var value = new Date().getTime();
			this1.h["all"] = value;
			var _this = db_mysql_MySqlTable.log;
			logging_LogManager.get_instance().log({ timestamp : HxOverrides.dateStr(new Date()), level : "Debug", message : "all", data : null, ref : _this._ref, instanceId : _this._instanceId});
			thenshim_Promise.then(thenshim_Promise.then(_gthis.refreshSchema(),function(schemaResult) {
				var values = [];
				var sql = db_utils_SqlUtils.buildSelect(_gthis,null,null,null,values,_gthis.db.definedTableRelationships(),schemaResult.data);
				return _gthis.get_connection().all(sql);
			}),function(response) {
				var records = new db__$RecordSet_RecordSetImpl([]);
				var _g = 0;
				var _g1 = response.data;
				while(_g < _g1.length) {
					var item = _g1[_g];
					++_g;
					records.push(db_Record.fromDynamic(item));
				}
				var _this = db_mysql_MySqlTable.log;
				if(_this._measurements == null) {
					_this._measurements = new haxe_ds_StringMap();
				}
				if(Object.prototype.hasOwnProperty.call(_this._measurements.h,"all")) {
					var start = _this._measurements.h["all"];
					var time = Math.round(new Date().getTime() - start);
					logging_LogManager.get_instance().log({ timestamp : HxOverrides.dateStr(new Date()), level : "Performance", message : "all" + " " + time + "ms", data : null, ref : _this._ref, instanceId : _this._instanceId});
					var _this1 = _this._measurements;
					if(Object.prototype.hasOwnProperty.call(_this1.h,"all")) {
						delete(_this1.h["all"]);
					}
				}
				resolve(new db_DatabaseResult(_gthis.db,_gthis,records));
			},function(error) {
				var _this = db_mysql_MySqlTable.log;
				logging_LogManager.get_instance().log({ timestamp : HxOverrides.dateStr(new Date()), level : "Error", message : "all", data : error, ref : _this._ref, instanceId : _this._instanceId});
				reject(db_mysql_Utils.MySqlError2DatabaseError(error,"all"));
			});
		});
	}
	,page: function(pageIndex,pageSize,query,allowRelationships) {
		if(allowRelationships == null) {
			allowRelationships = true;
		}
		if(pageSize == null) {
			pageSize = 100;
		}
		var _gthis = this;
		return thenshim_Promise._new(function(resolve,reject) {
			if(!_gthis.exists) {
				reject(new db_DatabaseError("table \"" + _gthis.name + "\" does not exist","find"));
				return;
			}
			var _this = db_mysql_MySqlTable.log;
			if(_this._measurements == null) {
				_this._measurements = new haxe_ds_StringMap();
			}
			var this1 = _this._measurements;
			var value = new Date().getTime();
			this1.h["page"] = value;
			var _this = db_mysql_MySqlTable.log;
			logging_LogManager.get_instance().log({ timestamp : HxOverrides.dateStr(new Date()), level : "Debug", message : "page", data : [pageIndex,pageSize], ref : _this._ref, instanceId : _this._instanceId});
			thenshim_Promise.then(thenshim_Promise.then(_gthis.refreshSchema(),function(schemaResult) {
				var relationshipDefinintions = _gthis.db.definedTableRelationships();
				if(!allowRelationships) {
					relationshipDefinintions = null;
				}
				var values = [];
				var sql = db_utils_SqlUtils.buildSelect(_gthis,null,pageSize,pageIndex * pageSize,values,relationshipDefinintions,schemaResult.data);
				return _gthis.get_connection().all(sql,values);
			}),function(response) {
				var records = new db__$RecordSet_RecordSetImpl([]);
				var _g = 0;
				var _g1 = response.data;
				while(_g < _g1.length) {
					var item = _g1[_g];
					++_g;
					records.push(db_Record.fromDynamic(item));
				}
				var _this = db_mysql_MySqlTable.log;
				if(_this._measurements == null) {
					_this._measurements = new haxe_ds_StringMap();
				}
				if(Object.prototype.hasOwnProperty.call(_this._measurements.h,"page")) {
					var start = _this._measurements.h["page"];
					var time = Math.round(new Date().getTime() - start);
					logging_LogManager.get_instance().log({ timestamp : HxOverrides.dateStr(new Date()), level : "Performance", message : "page" + " " + time + "ms", data : null, ref : _this._ref, instanceId : _this._instanceId});
					var _this1 = _this._measurements;
					if(Object.prototype.hasOwnProperty.call(_this1.h,"page")) {
						delete(_this1.h["page"]);
					}
				}
				resolve(new db_DatabaseResult(_gthis.db,_gthis,records));
			},function(error) {
				var _this = db_mysql_MySqlTable.log;
				logging_LogManager.get_instance().log({ timestamp : HxOverrides.dateStr(new Date()), level : "Error", message : "page", data : error, ref : _this._ref, instanceId : _this._instanceId});
				reject(db_mysql_Utils.MySqlError2DatabaseError(error,"page"));
			});
		});
	}
	,add: function(record) {
		var _gthis = this;
		return thenshim_Promise._new(function(resolve,reject) {
			if(!_gthis.exists) {
				reject(new db_DatabaseError("table \"" + _gthis.name + "\" does not exist","add"));
				return;
			}
			var _this = db_mysql_MySqlTable.log;
			if(_this._measurements == null) {
				_this._measurements = new haxe_ds_StringMap();
			}
			var this1 = _this._measurements;
			var value = new Date().getTime();
			this1.h["add"] = value;
			if(logging_LogManager.get_instance().get_shouldLogDebug()) {
				var _this = db_mysql_MySqlTable.log;
				var data = record.debugString();
				logging_LogManager.get_instance().log({ timestamp : HxOverrides.dateStr(new Date()), level : "Debug", message : "add", data : data, ref : _this._ref, instanceId : _this._instanceId});
			}
			var insertedId = -1;
			var schema = null;
			thenshim_Promise.then(thenshim_Promise.then(_gthis.refreshSchema(true),function(schemaResult) {
				schema = schemaResult.data;
				var values = [];
				var sql = db_utils_SqlUtils.buildInsert(_gthis,record,values,db_mysql_MySqlDataTypeMapper.get());
				return _gthis.get_connection().get(sql,values);
			}),function(response) {
				insertedId = response.data.insertId;
				var tableSchema = schema.findTable(_gthis.name);
				if(tableSchema != null) {
					var primaryKeyColumns = tableSchema.findPrimaryKeyColumns();
					if(primaryKeyColumns.length == 1) {
						record.field(primaryKeyColumns[0].name,insertedId);
					}
				}
				record.field("_insertedId",insertedId);
				var _this = db_mysql_MySqlTable.log;
				if(_this._measurements == null) {
					_this._measurements = new haxe_ds_StringMap();
				}
				if(Object.prototype.hasOwnProperty.call(_this._measurements.h,"add")) {
					var start = _this._measurements.h["add"];
					var time = Math.round(new Date().getTime() - start);
					logging_LogManager.get_instance().log({ timestamp : HxOverrides.dateStr(new Date()), level : "Performance", message : "add" + " " + time + "ms", data : null, ref : _this._ref, instanceId : _this._instanceId});
					var _this1 = _this._measurements;
					if(Object.prototype.hasOwnProperty.call(_this1.h,"add")) {
						delete(_this1.h["add"]);
					}
				}
				var result = new db_DatabaseResult(_gthis.db,_gthis,record);
				result.itemsAffected = response.affectedRows;
				resolve(result);
			},function(error) {
				var _this = db_mysql_MySqlTable.log;
				logging_LogManager.get_instance().log({ timestamp : HxOverrides.dateStr(new Date()), level : "Error", message : "add", data : error, ref : _this._ref, instanceId : _this._instanceId});
				reject(db_mysql_Utils.MySqlError2DatabaseError(error,"add"));
			});
		});
	}
	,addAll: function(records) {
		var _gthis = this;
		return thenshim_Promise._new(function(resolve,reject) {
			if(!_gthis.exists) {
				reject(new db_DatabaseError("table \"" + _gthis.name + "\" does not exist","addAll"));
				return;
			}
			var _this = db_mysql_MySqlTable.log;
			if(_this._measurements == null) {
				_this._measurements = new haxe_ds_StringMap();
			}
			var this1 = _this._measurements;
			var value = new Date().getTime();
			this1.h["addAll"] = value;
			var _this = db_mysql_MySqlTable.log;
			logging_LogManager.get_instance().log({ timestamp : HxOverrides.dateStr(new Date()), level : "Debug", message : "addAll", data : null, ref : _this._ref, instanceId : _this._instanceId});
			var promises = [];
			var record = records.iterator();
			while(record.hasNext()) {
				var record1 = record.next();
				promises.push((function(_g,record) {
					return function() {
						return _g[0].add(record[0]);
					};
				})([_gthis],[record1]));
			}
			thenshim_Promise.then(promises_PromiseUtils.runSequentially(promises),function(results) {
				var _this = db_mysql_MySqlTable.log;
				if(_this._measurements == null) {
					_this._measurements = new haxe_ds_StringMap();
				}
				if(Object.prototype.hasOwnProperty.call(_this._measurements.h,"addAll")) {
					var start = _this._measurements.h["addAll"];
					var time = Math.round(new Date().getTime() - start);
					logging_LogManager.get_instance().log({ timestamp : HxOverrides.dateStr(new Date()), level : "Performance", message : "addAll" + " " + time + "ms", data : null, ref : _this._ref, instanceId : _this._instanceId});
					var _this1 = _this._measurements;
					if(Object.prototype.hasOwnProperty.call(_this1.h,"addAll")) {
						delete(_this1.h["addAll"]);
					}
				}
				var itemsAffected = 0;
				var _g = 0;
				while(_g < results.length) {
					var result = results[_g];
					++_g;
					itemsAffected += result.itemsAffected;
				}
				var result = new db_DatabaseResult(_gthis.db,_gthis,records);
				result.itemsAffected = itemsAffected;
				resolve(result);
			},function(error) {
				var _this = db_mysql_MySqlTable.log;
				logging_LogManager.get_instance().log({ timestamp : HxOverrides.dateStr(new Date()), level : "Error", message : "addAll", data : error, ref : _this._ref, instanceId : _this._instanceId});
				reject(db_mysql_Utils.MySqlError2DatabaseError(error,"addAll"));
			});
		});
	}
	,'delete': function(record) {
		var _gthis = this;
		return thenshim_Promise._new(function(resolve,reject) {
			if(!_gthis.exists) {
				reject(new db_DatabaseError("table \"" + _gthis.name + "\" does not exist","delete"));
				return;
			}
			var _this = db_mysql_MySqlTable.log;
			if(_this._measurements == null) {
				_this._measurements = new haxe_ds_StringMap();
			}
			var this1 = _this._measurements;
			var value = new Date().getTime();
			this1.h["delete"] = value;
			if(logging_LogManager.get_instance().get_shouldLogDebug()) {
				var _this = db_mysql_MySqlTable.log;
				var data = record.debugString();
				logging_LogManager.get_instance().log({ timestamp : HxOverrides.dateStr(new Date()), level : "Debug", message : "delete", data : data, ref : _this._ref, instanceId : _this._instanceId});
			}
			thenshim_Promise.then(thenshim_Promise.then(_gthis.refreshSchema(),function(schemaResult) {
				var values = [];
				var sql = db_utils_SqlUtils.buildDeleteRecord(_gthis,record,values);
				return _gthis.get_connection().get(sql,values);
			}),function(response) {
				var _this = db_mysql_MySqlTable.log;
				if(_this._measurements == null) {
					_this._measurements = new haxe_ds_StringMap();
				}
				if(Object.prototype.hasOwnProperty.call(_this._measurements.h,"delete")) {
					var start = _this._measurements.h["delete"];
					var time = Math.round(new Date().getTime() - start);
					logging_LogManager.get_instance().log({ timestamp : HxOverrides.dateStr(new Date()), level : "Performance", message : "delete" + " " + time + "ms", data : null, ref : _this._ref, instanceId : _this._instanceId});
					var _this1 = _this._measurements;
					if(Object.prototype.hasOwnProperty.call(_this1.h,"delete")) {
						delete(_this1.h["delete"]);
					}
				}
				var result = new db_DatabaseResult(_gthis.db,_gthis,record);
				result.itemsAffected = response.affectedRows;
				resolve(result);
			},function(error) {
				var _this = db_mysql_MySqlTable.log;
				logging_LogManager.get_instance().log({ timestamp : HxOverrides.dateStr(new Date()), level : "Error", message : "delete", data : error, ref : _this._ref, instanceId : _this._instanceId});
				reject(db_mysql_Utils.MySqlError2DatabaseError(error,"delete"));
			});
		});
	}
	,deleteAll: function(query) {
		var _gthis = this;
		return thenshim_Promise._new(function(resolve,reject) {
			if(!_gthis.exists) {
				reject(new db_DatabaseError("table \"" + _gthis.name + "\" does not exist","deleteAll"));
				return;
			}
			var _this = db_mysql_MySqlTable.log;
			if(_this._measurements == null) {
				_this._measurements = new haxe_ds_StringMap();
			}
			var this1 = _this._measurements;
			var value = new Date().getTime();
			this1.h["deleteAll"] = value;
			thenshim_Promise.then(thenshim_Promise.then(_gthis.refreshSchema(),function(schemaResult) {
				return _gthis.get_connection().exec(db_utils_SqlUtils.buildDeleteWhere(_gthis,query));
			}),function(response) {
				var _this = db_mysql_MySqlTable.log;
				if(_this._measurements == null) {
					_this._measurements = new haxe_ds_StringMap();
				}
				if(Object.prototype.hasOwnProperty.call(_this._measurements.h,"deleteAll")) {
					var start = _this._measurements.h["deleteAll"];
					var time = Math.round(new Date().getTime() - start);
					logging_LogManager.get_instance().log({ timestamp : HxOverrides.dateStr(new Date()), level : "Performance", message : "deleteAll" + " " + time + "ms", data : null, ref : _this._ref, instanceId : _this._instanceId});
					var _this1 = _this._measurements;
					if(Object.prototype.hasOwnProperty.call(_this1.h,"deleteAll")) {
						delete(_this1.h["deleteAll"]);
					}
				}
				var result = new db_DatabaseResult(_gthis.db,_gthis,true);
				result.itemsAffected = response.affectedRows;
				resolve(result);
			},function(error) {
				var _this = db_mysql_MySqlTable.log;
				logging_LogManager.get_instance().log({ timestamp : HxOverrides.dateStr(new Date()), level : "Error", message : "deleteAll", data : error, ref : _this._ref, instanceId : _this._instanceId});
				reject(db_mysql_Utils.MySqlError2DatabaseError(error,"deleteAll"));
			});
		});
	}
	,update: function(query,record) {
		var _gthis = this;
		return thenshim_Promise._new(function(resolve,reject) {
			if(!_gthis.exists) {
				reject(new db_DatabaseError("table \"" + _gthis.name + "\" does not exist","update"));
				return;
			}
			var _this = db_mysql_MySqlTable.log;
			if(_this._measurements == null) {
				_this._measurements = new haxe_ds_StringMap();
			}
			var this1 = _this._measurements;
			var value = new Date().getTime();
			this1.h["update"] = value;
			if(logging_LogManager.get_instance().get_shouldLogDebug()) {
				var _this = db_mysql_MySqlTable.log;
				var data = record.debugString();
				logging_LogManager.get_instance().log({ timestamp : HxOverrides.dateStr(new Date()), level : "Debug", message : "update", data : data, ref : _this._ref, instanceId : _this._instanceId});
			}
			thenshim_Promise.then(thenshim_Promise.then(_gthis.refreshSchema(),function(schemaResult) {
				var values = [];
				var sql = db_utils_SqlUtils.buildUpdate(_gthis,query,record,values,db_mysql_MySqlDataTypeMapper.get());
				return _gthis.get_connection().get(sql,values);
			}),function(response) {
				var _this = db_mysql_MySqlTable.log;
				if(_this._measurements == null) {
					_this._measurements = new haxe_ds_StringMap();
				}
				if(Object.prototype.hasOwnProperty.call(_this._measurements.h,"update")) {
					var start = _this._measurements.h["update"];
					var time = Math.round(new Date().getTime() - start);
					logging_LogManager.get_instance().log({ timestamp : HxOverrides.dateStr(new Date()), level : "Performance", message : "update" + " " + time + "ms", data : null, ref : _this._ref, instanceId : _this._instanceId});
					var _this1 = _this._measurements;
					if(Object.prototype.hasOwnProperty.call(_this1.h,"update")) {
						delete(_this1.h["update"]);
					}
				}
				var result = new db_DatabaseResult(_gthis.db,_gthis,record);
				result.itemsAffected = response.affectedRows;
				resolve(result);
			},function(error) {
				var _this = db_mysql_MySqlTable.log;
				logging_LogManager.get_instance().log({ timestamp : HxOverrides.dateStr(new Date()), level : "Error", message : "update", data : error, ref : _this._ref, instanceId : _this._instanceId});
				reject(db_mysql_Utils.MySqlError2DatabaseError(error,"update"));
			});
		});
	}
	,find: function(query,allowRelationships) {
		if(allowRelationships == null) {
			allowRelationships = true;
		}
		var _gthis = this;
		return thenshim_Promise._new(function(resolve,reject) {
			if(!_gthis.exists) {
				reject(new db_DatabaseError("table \"" + _gthis.name + "\" does not exist","find"));
				return;
			}
			var _this = db_mysql_MySqlTable.log;
			if(_this._measurements == null) {
				_this._measurements = new haxe_ds_StringMap();
			}
			var this1 = _this._measurements;
			var value = new Date().getTime();
			this1.h["find"] = value;
			var _this = db_mysql_MySqlTable.log;
			logging_LogManager.get_instance().log({ timestamp : HxOverrides.dateStr(new Date()), level : "Debug", message : "find", data : null, ref : _this._ref, instanceId : _this._instanceId});
			thenshim_Promise.then(thenshim_Promise.then(_gthis.refreshSchema(),function(schemaResult) {
				var relationshipDefinintions = _gthis.db.definedTableRelationships();
				if(!allowRelationships) {
					relationshipDefinintions = null;
				}
				var values = [];
				var sql = db_utils_SqlUtils.buildSelect(_gthis,query,null,null,values,relationshipDefinintions,schemaResult.data);
				return _gthis.get_connection().all(sql,values);
			}),function(response) {
				var records = new db__$RecordSet_RecordSetImpl([]);
				var _g = 0;
				var _g1 = response.data;
				while(_g < _g1.length) {
					var item = _g1[_g];
					++_g;
					records.push(db_Record.fromDynamic(item));
				}
				var _this = db_mysql_MySqlTable.log;
				if(_this._measurements == null) {
					_this._measurements = new haxe_ds_StringMap();
				}
				if(Object.prototype.hasOwnProperty.call(_this._measurements.h,"find")) {
					var start = _this._measurements.h["find"];
					var time = Math.round(new Date().getTime() - start);
					logging_LogManager.get_instance().log({ timestamp : HxOverrides.dateStr(new Date()), level : "Performance", message : "find" + " " + time + "ms", data : null, ref : _this._ref, instanceId : _this._instanceId});
					var _this1 = _this._measurements;
					if(Object.prototype.hasOwnProperty.call(_this1.h,"find")) {
						delete(_this1.h["find"]);
					}
				}
				resolve(new db_DatabaseResult(_gthis.db,_gthis,records));
			},function(error) {
				var _this = db_mysql_MySqlTable.log;
				logging_LogManager.get_instance().log({ timestamp : HxOverrides.dateStr(new Date()), level : "Error", message : "find", data : null, ref : _this._ref, instanceId : _this._instanceId});
				reject(db_mysql_Utils.MySqlError2DatabaseError(error,"find"));
			});
		});
	}
	,findOne: function(query,allowRelationships) {
		if(allowRelationships == null) {
			allowRelationships = true;
		}
		var _gthis = this;
		return thenshim_Promise._new(function(resolve,reject) {
			if(!_gthis.exists) {
				reject(new db_DatabaseError("table \"" + _gthis.name + "\" does not exist","findOne"));
				return;
			}
			var _this = db_mysql_MySqlTable.log;
			if(_this._measurements == null) {
				_this._measurements = new haxe_ds_StringMap();
			}
			var this1 = _this._measurements;
			var value = new Date().getTime();
			this1.h["findOne"] = value;
			var _this = db_mysql_MySqlTable.log;
			logging_LogManager.get_instance().log({ timestamp : HxOverrides.dateStr(new Date()), level : "Debug", message : "findOne", data : null, ref : _this._ref, instanceId : _this._instanceId});
			thenshim_Promise.then(thenshim_Promise.then(_gthis.refreshSchema(),function(schemaResult) {
				var relationshipDefinintions = _gthis.db.definedTableRelationships();
				if(!allowRelationships) {
					relationshipDefinintions = null;
				}
				var values = [];
				var sql = db_utils_SqlUtils.buildSelect(_gthis,query,1,null,values,relationshipDefinintions,schemaResult.data);
				return _gthis.get_connection().get(sql,values);
			}),function(response) {
				var record = null;
				if(response.data != null && ((response.data) instanceof Array)) {
					record = db_Record.fromDynamic(response.data[0]);
				} else if(response.data != null) {
					record = db_Record.fromDynamic(response.data);
				}
				var _this = db_mysql_MySqlTable.log;
				if(_this._measurements == null) {
					_this._measurements = new haxe_ds_StringMap();
				}
				if(Object.prototype.hasOwnProperty.call(_this._measurements.h,"findOne")) {
					var start = _this._measurements.h["findOne"];
					var time = Math.round(new Date().getTime() - start);
					logging_LogManager.get_instance().log({ timestamp : HxOverrides.dateStr(new Date()), level : "Performance", message : "findOne" + " " + time + "ms", data : null, ref : _this._ref, instanceId : _this._instanceId});
					var _this1 = _this._measurements;
					if(Object.prototype.hasOwnProperty.call(_this1.h,"findOne")) {
						delete(_this1.h["findOne"]);
					}
				}
				resolve(new db_DatabaseResult(_gthis.db,_gthis,record));
			},function(error) {
				var _this = db_mysql_MySqlTable.log;
				logging_LogManager.get_instance().log({ timestamp : HxOverrides.dateStr(new Date()), level : "Error", message : "findOne", data : error, ref : _this._ref, instanceId : _this._instanceId});
				reject(db_mysql_Utils.MySqlError2DatabaseError(error,"findOne"));
			});
		});
	}
	,findUnique: function(columnName,query,allowRelationships) {
		if(allowRelationships == null) {
			allowRelationships = true;
		}
		var _gthis = this;
		return thenshim_Promise._new(function(resolve,reject) {
			if(!_gthis.exists) {
				reject(new db_DatabaseError("table \"" + _gthis.name + "\" does not exist","findOne"));
				return;
			}
			var _this = db_mysql_MySqlTable.log;
			if(_this._measurements == null) {
				_this._measurements = new haxe_ds_StringMap();
			}
			var this1 = _this._measurements;
			var value = new Date().getTime();
			this1.h["findUnique"] = value;
			var _this = db_mysql_MySqlTable.log;
			logging_LogManager.get_instance().log({ timestamp : HxOverrides.dateStr(new Date()), level : "Debug", message : "findUnique", data : null, ref : _this._ref, instanceId : _this._instanceId});
			thenshim_Promise.then(thenshim_Promise.then(_gthis.refreshSchema(),function(schemaResult) {
				var relationshipDefinintions = _gthis.db.definedTableRelationships();
				if(!allowRelationships) {
					relationshipDefinintions = null;
				}
				var values = [];
				var sql = db_utils_SqlUtils.buildDistinctSelect(_gthis,query,columnName,null,null,values,relationshipDefinintions,schemaResult.data);
				return _gthis.get_connection().all(sql,values);
			}),function(response) {
				var records = new db__$RecordSet_RecordSetImpl([]);
				var _g = 0;
				var _g1 = response.data;
				while(_g < _g1.length) {
					var item = _g1[_g];
					++_g;
					records.push(db_Record.fromDynamic(item));
				}
				var _this = db_mysql_MySqlTable.log;
				if(_this._measurements == null) {
					_this._measurements = new haxe_ds_StringMap();
				}
				if(Object.prototype.hasOwnProperty.call(_this._measurements.h,"findUnique")) {
					var start = _this._measurements.h["findUnique"];
					var time = Math.round(new Date().getTime() - start);
					logging_LogManager.get_instance().log({ timestamp : HxOverrides.dateStr(new Date()), level : "Performance", message : "findUnique" + " " + time + "ms", data : null, ref : _this._ref, instanceId : _this._instanceId});
					var _this1 = _this._measurements;
					if(Object.prototype.hasOwnProperty.call(_this1.h,"findUnique")) {
						delete(_this1.h["findUnique"]);
					}
				}
				resolve(new db_DatabaseResult(_gthis.db,_gthis,records));
			},function(error) {
				var _this = db_mysql_MySqlTable.log;
				logging_LogManager.get_instance().log({ timestamp : HxOverrides.dateStr(new Date()), level : "Error", message : "findUnique", data : error, ref : _this._ref, instanceId : _this._instanceId});
				reject(db_mysql_Utils.MySqlError2DatabaseError(error,"findUnique"));
			});
		});
	}
	,count: function(query) {
		var _gthis = this;
		return thenshim_Promise._new(function(resolve,reject) {
			if(!_gthis.exists) {
				reject(new db_DatabaseError("table \"" + _gthis.name + "\" does not exist","findOne"));
				return;
			}
			var _this = db_mysql_MySqlTable.log;
			if(_this._measurements == null) {
				_this._measurements = new haxe_ds_StringMap();
			}
			var this1 = _this._measurements;
			var value = new Date().getTime();
			this1.h["count"] = value;
			var _this = db_mysql_MySqlTable.log;
			logging_LogManager.get_instance().log({ timestamp : HxOverrides.dateStr(new Date()), level : "Debug", message : "count", data : null, ref : _this._ref, instanceId : _this._instanceId});
			thenshim_Promise.then(thenshim_Promise.then(_gthis.refreshSchema(),function(schemaResult) {
				var sql = db_utils_SqlUtils.buildCount(_gthis,query);
				return _gthis.get_connection().get(sql);
			}),function(response) {
				var record = db_Record.fromDynamic(response.data);
				var _this = db_mysql_MySqlTable.log;
				if(_this._measurements == null) {
					_this._measurements = new haxe_ds_StringMap();
				}
				if(Object.prototype.hasOwnProperty.call(_this._measurements.h,"count")) {
					var start = _this._measurements.h["count"];
					var time = Math.round(new Date().getTime() - start);
					logging_LogManager.get_instance().log({ timestamp : HxOverrides.dateStr(new Date()), level : "Performance", message : "count" + " " + time + "ms", data : null, ref : _this._ref, instanceId : _this._instanceId});
					var _this1 = _this._measurements;
					if(Object.prototype.hasOwnProperty.call(_this1.h,"count")) {
						delete(_this1.h["count"]);
					}
				}
				resolve(new db_DatabaseResult(_gthis.db,_gthis,record.values()[0]));
			},function(error) {
				var _this = db_mysql_MySqlTable.log;
				logging_LogManager.get_instance().log({ timestamp : HxOverrides.dateStr(new Date()), level : "Error", message : "count", data : error, ref : _this._ref, instanceId : _this._instanceId});
				reject(db_mysql_Utils.MySqlError2DatabaseError(error,"count"));
			});
		});
	}
	,addColumn: function(column) {
		var _gthis = this;
		return thenshim_Promise._new(function(resolve,reject) {
			if(!_gthis.exists) {
				reject(new db_DatabaseError("table \"" + _gthis.name + "\" does not exist","addColumn"));
				return;
			}
			var _this = db_mysql_MySqlTable.log;
			if(_this._measurements == null) {
				_this._measurements = new haxe_ds_StringMap();
			}
			var this1 = _this._measurements;
			var value = new Date().getTime();
			this1.h["addColumn"] = value;
			var _this = db_mysql_MySqlTable.log;
			logging_LogManager.get_instance().log({ timestamp : HxOverrides.dateStr(new Date()), level : "Debug", message : "addColumn", data : null, ref : _this._ref, instanceId : _this._instanceId});
			var sql = db_mysql_Utils.buildAddColumns(_gthis.name,[column],db_mysql_MySqlDataTypeMapper.get());
			thenshim_Promise.then(_gthis.get_connection().exec(sql),function(result) {
				_gthis.clearCachedSchema();
				(js_Boot.__cast(_gthis.db , db_mysql_MySqlDatabase)).clearCachedSchema();
				var _this = db_mysql_MySqlTable.log;
				if(_this._measurements == null) {
					_this._measurements = new haxe_ds_StringMap();
				}
				if(Object.prototype.hasOwnProperty.call(_this._measurements.h,"addColumn")) {
					var start = _this._measurements.h["addColumn"];
					var time = Math.round(new Date().getTime() - start);
					logging_LogManager.get_instance().log({ timestamp : HxOverrides.dateStr(new Date()), level : "Performance", message : "addColumn" + " " + time + "ms", data : null, ref : _this._ref, instanceId : _this._instanceId});
					var _this1 = _this._measurements;
					if(Object.prototype.hasOwnProperty.call(_this1.h,"addColumn")) {
						delete(_this1.h["addColumn"]);
					}
				}
				resolve(new db_DatabaseResult(_gthis.db,_gthis,true));
			},function(error) {
				var _this = db_mysql_MySqlTable.log;
				logging_LogManager.get_instance().log({ timestamp : HxOverrides.dateStr(new Date()), level : "Error", message : "addColumn", data : error, ref : _this._ref, instanceId : _this._instanceId});
				reject(db_mysql_Utils.MySqlError2DatabaseError(error,"addColumn"));
			});
		});
	}
	,removeColumn: function(column) {
		var _gthis = this;
		return thenshim_Promise._new(function(resolve,reject) {
			if(!_gthis.exists) {
				reject(new db_DatabaseError("table \"" + _gthis.name + "\" does not exist","addColumn"));
				return;
			}
			var _this = db_mysql_MySqlTable.log;
			if(_this._measurements == null) {
				_this._measurements = new haxe_ds_StringMap();
			}
			var this1 = _this._measurements;
			var value = new Date().getTime();
			this1.h["removeColumn"] = value;
			var _this = db_mysql_MySqlTable.log;
			logging_LogManager.get_instance().log({ timestamp : HxOverrides.dateStr(new Date()), level : "Debug", message : "removeColumn", data : null, ref : _this._ref, instanceId : _this._instanceId});
			var sql = db_mysql_Utils.buildRemoveColumns(_gthis.name,[column],db_mysql_MySqlDataTypeMapper.get());
			thenshim_Promise.then(_gthis.get_connection().exec(sql),function(result) {
				_gthis.clearCachedSchema();
				(js_Boot.__cast(_gthis.db , db_mysql_MySqlDatabase)).clearCachedSchema();
				var _this = db_mysql_MySqlTable.log;
				if(_this._measurements == null) {
					_this._measurements = new haxe_ds_StringMap();
				}
				if(Object.prototype.hasOwnProperty.call(_this._measurements.h,"removeColumn")) {
					var start = _this._measurements.h["removeColumn"];
					var time = Math.round(new Date().getTime() - start);
					logging_LogManager.get_instance().log({ timestamp : HxOverrides.dateStr(new Date()), level : "Performance", message : "removeColumn" + " " + time + "ms", data : null, ref : _this._ref, instanceId : _this._instanceId});
					var _this1 = _this._measurements;
					if(Object.prototype.hasOwnProperty.call(_this1.h,"removeColumn")) {
						delete(_this1.h["removeColumn"]);
					}
				}
				resolve(new db_DatabaseResult(_gthis.db,_gthis,true));
			},function(error) {
				var _this = db_mysql_MySqlTable.log;
				logging_LogManager.get_instance().log({ timestamp : HxOverrides.dateStr(new Date()), level : "Error", message : "removeColumn", data : error, ref : _this._ref, instanceId : _this._instanceId});
				reject(db_mysql_Utils.MySqlError2DatabaseError(error,"addColumn"));
			});
		});
	}
	,raw: function(data,values) {
		var _gthis = this;
		return thenshim_Promise._new(function(resolve,reject) {
			if(values == null) {
				values = [];
			}
			var sql = data;
			thenshim_Promise.then(_gthis.get_connection().all(sql,values),function(response) {
				var records = new db__$RecordSet_RecordSetImpl([]);
				var _g = 0;
				var _g1 = response.data;
				while(_g < _g1.length) {
					var item = _g1[_g];
					++_g;
					records.push(db_Record.fromDynamic(item));
				}
				resolve(new db_DatabaseResult(_gthis.db,_gthis,records));
			},function(error) {
				reject(db_mysql_Utils.MySqlError2DatabaseError(error,"raw"));
			});
		});
	}
	,connection: null
	,get_connection: function() {
		return (js_Boot.__cast(this.db , db_mysql_MySqlDatabase))._connection;
	}
	,refreshSchema: function(force) {
		if(force == null) {
			force = false;
		}
		var _gthis = this;
		return thenshim_Promise._new(function(resolve,reject) {
			var alwaysAliasResultFields = _gthis.db.getProperty("alwaysAliasResultFields",false);
			if(force == false && alwaysAliasResultFields == false && _gthis.db.definedTableRelationships() == null) {
				resolve(new db_DatabaseResult(_gthis.db,_gthis,null));
				return;
			}
			thenshim_Promise.then(_gthis.db.schema(),function(result) {
				resolve(result);
			},function(error) {
				reject(error);
			});
		});
	}
	,__class__: db_mysql_MySqlTable
	,__properties__: {get_connection:"get_connection"}
};
var db_mysql_Utils = function() { };
$hxClasses["db.mysql.Utils"] = db_mysql_Utils;
db_mysql_Utils.__name__ = "db.mysql.Utils";
db_mysql_Utils.MySqlError2DatabaseError = function(error,call) {
	var dbError = new db_DatabaseError(error.message,call);
	return dbError;
};
db_mysql_Utils.buildCreateDatabase = function(databaseName) {
	return "CREATE DATABASE IF NOT EXISTS " + databaseName + ";";
};
db_mysql_Utils.buildDropDatabase = function(databaseName) {
	return "DROP DATABASE IF EXISTS " + databaseName + ";";
};
db_mysql_Utils.buildSelectDatabase = function(databaseName) {
	return "USE " + databaseName + ";";
};
db_mysql_Utils.buildHasDatabase = function(databaseName) {
	return "SHOW DATABASES LIKE '" + databaseName + "';";
};
db_mysql_Utils.buildCreateTable = function(tableName,columns,typeMapper) {
	var sql = "CREATE TABLE " + tableName + " (\n";
	var columnParts = [];
	var primaryKey = null;
	var _g = 0;
	while(_g < columns.length) {
		var column = columns[_g];
		++_g;
		var type = typeMapper.haxeTypeToDatabaseType(column.type);
		var columnSql = "    " + column.name;
		columnSql += " " + type;
		var suffix = "";
		if(column.options != null) {
			var _g1 = 0;
			var _g2 = column.options;
			while(_g1 < _g2.length) {
				var option = _g2[_g1];
				++_g1;
				switch(option._hx_index) {
				case 0:
					primaryKey = column.name;
					break;
				case 1:
					suffix += " NOT NULL";
					break;
				case 2:
					suffix += " AUTO_INCREMENT";
					break;
				}
			}
		}
		if(suffix.length > 0) {
			columnSql += suffix;
		}
		columnParts.push(columnSql);
	}
	if(primaryKey != null) {
		columnParts.push("    PRIMARY KEY (" + primaryKey + ")");
	}
	sql += columnParts.join(",\n");
	sql += ");";
	return sql;
};
db_mysql_Utils.loadFullDatabaseSchema = function(connection,config,typeMapper) {
	return thenshim_Promise._new(function(resolve,reject) {
		var database = null;
		if(config != null && config.database != null) {
			database = config.database;
		}
		if(database == null) {
			reject("no database name");
		} else {
			var schema = new db_DatabaseSchema(null);
			thenshim_Promise.then(connection.all("SELECT * FROM information_schema.columns\r\n                                                           WHERE table_schema = ?\r\n                                                           ORDER BY table_name,ordinal_position;",[database]),function(result) {
				var _g = 0;
				var _g1 = result.data;
				while(_g < _g1.length) {
					var r = _g1[_g];
					++_g;
					var table = schema.findTable(r.TABLE_NAME);
					if(table == null) {
						table = new db_TableSchema(r.TABLE_NAME,null,null);
						schema.tables.push(table);
					}
					var dbType = r.DATA_TYPE;
					if(r.CHARACTER_MAXIMUM_LENGTH != null) {
						dbType = (dbType == null ? "null" : "" + dbType) + (":" + Std.string(r.CHARACTER_MAXIMUM_LENGTH));
					}
					var options = [];
					var columnKey = r.COLUMN_KEY;
					if(columnKey != null && columnKey.indexOf("PRI") != -1) {
						options.push(db_ColumnOptions.PrimaryKey);
					}
					var extra = r.EXTRA;
					if(extra != null && extra.indexOf("auto_increment") != -1) {
						options.push(db_ColumnOptions.AutoIncrement);
					}
					table.columns.push(new db_ColumnDefinition(r.COLUMN_NAME,typeMapper.databaseTypeToHaxeType(dbType),options));
				}
				resolve(schema);
			},function(error) {
				reject(error);
			});
		}
	});
};
db_mysql_Utils.buildAddColumns = function(tableName,columns,typeMapper) {
	var sql = "ALTER TABLE " + tableName + "\n";
	var _g = 0;
	while(_g < columns.length) {
		var column = columns[_g];
		++_g;
		var type = typeMapper.haxeTypeToDatabaseType(column.type);
		sql += "ADD " + column.name + " " + type;
	}
	sql += ";";
	return sql;
};
db_mysql_Utils.buildRemoveColumns = function(tableName,columns,typeMapper) {
	var sql = "ALTER TABLE " + tableName + "\n";
	var _g = 0;
	while(_g < columns.length) {
		var column = columns[_g];
		++_g;
		sql += "DROP COLUMN " + column.name;
	}
	sql += ";";
	return sql;
};
var db_utils_SqlUtils = function() { };
$hxClasses["db.utils.SqlUtils"] = db_utils_SqlUtils;
db_utils_SqlUtils.__name__ = "db.utils.SqlUtils";
db_utils_SqlUtils.buildInsert = function(table,record,values,typeMapper) {
	var fieldNames = db_utils_SqlUtils.fieldNamesFromRecord(record);
	var sql = "INSERT INTO " + table.name + " (" + fieldNames.join(", ") + ") VALUES ";
	var placeholders = [];
	var _g = 0;
	var _g1 = record.get_fieldNames();
	while(_g < _g1.length) {
		var f = _g1[_g];
		++_g;
		placeholders.push("?");
		if(values != null) {
			values.push(record.field(f));
		}
	}
	if(typeMapper != null) {
		var _g = 0;
		var _g1 = values.length;
		while(_g < _g1) {
			var i = _g++;
			var v = values[i];
			if(typeMapper.shouldConvertValueToDatabase(v)) {
				v = typeMapper.convertValueToDatabase(v);
				values[i] = v;
			}
		}
	}
	sql += "(" + placeholders.join(", ") + ")";
	sql += ";";
	return sql;
};
db_utils_SqlUtils.buildSelect = function(table,query,limit,offset,values,relationships,databaseSchema) {
	var alwaysAliasResultFields = table.db.getProperty("alwaysAliasResultFields",false);
	var fieldAliases = [];
	var sqlJoin = db_utils_SqlUtils.buildJoins(table.name,null,relationships,databaseSchema,fieldAliases);
	if(alwaysAliasResultFields == true || fieldAliases != null && fieldAliases.length > 0) {
		if(databaseSchema != null) {
			var tableSchema = databaseSchema.findTable(table.name);
			if(tableSchema != null) {
				var _g = 0;
				var _g1 = tableSchema.columns;
				while(_g < _g1.length) {
					var tableColumn = _g1[_g];
					++_g;
					fieldAliases.splice(0,0,"" + table.name + "." + tableColumn.name + " AS `" + table.name + "." + tableColumn.name + "`");
				}
			}
		}
	}
	var fieldList = "*";
	if(fieldAliases.length > 0) {
		fieldList = fieldAliases.join(", ");
	}
	var sql = "SELECT " + fieldList + " FROM " + table.name;
	sql += sqlJoin;
	if(query != null) {
		sql += "\nWHERE (" + Query.queryExprToSql(query,values,table.name) + ")";
	}
	if(limit != null) {
		sql += " LIMIT " + limit;
	}
	if(offset != null) {
		sql += " OFFSET " + offset;
	}
	sql += ";";
	return sql;
};
db_utils_SqlUtils.buildCount = function(table,query,values) {
	var sql = "SELECT " + "COUNT(*)" + " FROM " + table.name;
	if(query != null) {
		sql += "\nWHERE (" + Query.queryExprToSql(query,values,table.name) + ")";
	}
	sql += ";";
	return sql;
};
db_utils_SqlUtils.buildDistinctSelect = function(table,query,distinctColumn,limit,offset,values,relationships,databaseSchema) {
	table.db.getProperty("alwaysAliasResultFields",false);
	var fieldAliases = [];
	var fieldList = "*";
	if(distinctColumn != null) {
		fieldAliases.push("distinct(" + distinctColumn + ")");
	}
	if(fieldAliases.length > 0) {
		fieldList = fieldAliases.join(", ");
	}
	var sql = "SELECT " + fieldList + " FROM " + table.name;
	if(query != null) {
		sql += "\nWHERE (" + Query.queryExprToSql(query,values,table.name) + ")";
	}
	if(limit != null) {
		sql += " LIMIT " + limit;
	}
	if(offset != null) {
		sql += " OFFSET " + offset;
	}
	sql += ";";
	return sql;
};
db_utils_SqlUtils.buildJoins = function(tableName,prefix,relationships,databaseSchema,fieldAliases) {
	if(relationships == null) {
		return "";
	}
	var sql = "";
	var tableRelationships = relationships.get(tableName);
	if(tableRelationships == null) {
		return "";
	}
	var _g = 0;
	while(_g < tableRelationships.length) {
		var tableRelationship = tableRelationships[_g];
		++_g;
		var table1 = tableRelationship.table1;
		var field1 = tableRelationship.field1;
		var table2 = tableRelationship.table2;
		var field2 = tableRelationship.field2;
		if(prefix == null) {
			prefix = table1;
		}
		var joinName = table1 + "." + table2;
		if(relationships.complexRelationships) {
			joinName = prefix + "." + field1 + "." + table2 + "." + field2;
		}
		var tableSchema = databaseSchema.findTable(table2);
		if(tableSchema == null) {
			continue;
		}
		var _g1 = 0;
		var _g2 = tableSchema.columns;
		while(_g1 < _g2.length) {
			var tableColumn = _g2[_g1];
			++_g1;
			fieldAliases.push("`" + joinName + "`.`" + tableColumn.name + "` AS `" + joinName + "." + tableColumn.name + "`");
		}
		sql += "\n    LEFT JOIN `" + table2 + "` AS `" + joinName + "` ON `" + joinName + "`.`" + field2 + "` = `" + prefix + "`.`" + field1 + "`";
		sql += db_utils_SqlUtils.buildJoins(table2,joinName,relationships,databaseSchema,fieldAliases);
	}
	return sql;
};
db_utils_SqlUtils.buildDeleteRecord = function(table,record,values) {
	db_utils_SqlUtils.fieldNamesFromRecord(record);
	var sql = "DELETE FROM " + table.name + " WHERE ";
	var placeholders = [];
	var _g = 0;
	var _g1 = record.get_fieldNames();
	while(_g < _g1.length) {
		var f = _g1[_g];
		++_g;
		var v = record.field(f);
		f = "`" + f + "`";
		if(((v) instanceof haxe_io_Bytes)) {
			continue;
		}
		placeholders.push("" + f + " = ?");
		if(values != null) {
			values.push(v);
		}
	}
	sql += "(" + placeholders.join(" AND ") + ")";
	sql += ";";
	return sql;
};
db_utils_SqlUtils.buildDeleteWhere = function(table,query) {
	var sql = "DELETE FROM " + table.name;
	if(query != null) {
		sql += " WHERE (" + Query.queryExprToSql(query,null,table.name) + ")";
	}
	sql += ";";
	return sql;
};
db_utils_SqlUtils.buildUpdate = function(table,query,record,values,typeMapper) {
	db_utils_SqlUtils.fieldNamesFromRecord(record);
	var sql = "UPDATE " + table.name + " SET ";
	var placeholders = [];
	var _g = 0;
	var _g1 = record.get_fieldNames();
	while(_g < _g1.length) {
		var f = _g1[_g];
		++_g;
		var v = record.field(f);
		f = "`" + f + "`";
		if(v == null) {
			placeholders.push("" + f + " = NULL");
		} else {
			if(typeMapper != null && typeMapper.shouldConvertValueToDatabase(v)) {
				v = typeMapper.convertValueToDatabase(v);
			}
			placeholders.push("" + f + " = ?");
			if(values != null) {
				values.push(v);
			}
		}
	}
	sql += "" + placeholders.join(", ");
	sql += " WHERE (" + Query.queryExprToSql(query,values,table.name) + ")";
	sql += ";";
	return sql;
};
db_utils_SqlUtils.fieldNamesFromRecord = function(record) {
	var names = [];
	var _g = 0;
	var _g1 = record.get_fieldNames();
	while(_g < _g1.length) {
		var f = _g1[_g];
		++_g;
		names.push("`" + f + "`");
	}
	return names;
};
db_utils_SqlUtils.quoteFieldName = function(f) {
	return "`" + f + "`";
};
var discord_$builder_APIBaseComponent = function() { };
$hxClasses["discord_builder.APIBaseComponent"] = discord_$builder_APIBaseComponent;
discord_$builder_APIBaseComponent.__name__ = "discord_builder.APIBaseComponent";
discord_$builder_APIBaseComponent.prototype = {
	type: null
	,__class__: discord_$builder_APIBaseComponent
};
var discord_$builder_APIActionRowComponent = function() {
	this.components = [];
	this.type = 1;
};
$hxClasses["discord_builder.APIActionRowComponent"] = discord_$builder_APIActionRowComponent;
discord_$builder_APIActionRowComponent.__name__ = "discord_builder.APIActionRowComponent";
discord_$builder_APIActionRowComponent.__super__ = discord_$builder_APIBaseComponent;
discord_$builder_APIActionRowComponent.prototype = $extend(discord_$builder_APIBaseComponent.prototype,{
	components: null
	,addComponents: function() {
		var $l=arguments.length;
		var components = new Array($l>0?$l-0:0);
		for(var $i=0;$i<$l;++$i){components[$i-0]=arguments[$i];}
		var _g_current = 0;
		while(_g_current < components.length) {
			var c = components[_g_current++];
			this.components.push(c);
		}
		return this;
	}
	,__class__: discord_$builder_APIActionRowComponent
});
var discord_$builder_APIButtonComponentBase = function() {
	this.type = 2;
};
$hxClasses["discord_builder.APIButtonComponentBase"] = discord_$builder_APIButtonComponentBase;
discord_$builder_APIButtonComponentBase.__name__ = "discord_builder.APIButtonComponentBase";
discord_$builder_APIButtonComponentBase.__super__ = discord_$builder_APIBaseComponent;
discord_$builder_APIButtonComponentBase.prototype = $extend(discord_$builder_APIBaseComponent.prototype,{
	__class__: discord_$builder_APIButtonComponentBase
});
var discord_$builder_APITextInputComponent = function() {
	this.type = 4;
};
$hxClasses["discord_builder.APITextInputComponent"] = discord_$builder_APITextInputComponent;
discord_$builder_APITextInputComponent.__name__ = "discord_builder.APITextInputComponent";
discord_$builder_APITextInputComponent.__super__ = discord_$builder_APIBaseComponent;
discord_$builder_APITextInputComponent.prototype = $extend(discord_$builder_APIBaseComponent.prototype,{
	style: null
	,custom_id: null
	,label: null
	,placeholder: null
	,value: null
	,min_length: null
	,max_length: null
	,required: null
	,setStyle: function(style) {
		this.style = style;
		return this;
	}
	,setCustomId: function(custom_id) {
		this.custom_id = custom_id;
		return this;
	}
	,setLabel: function(label) {
		this.label = label;
		return this;
	}
	,setPlaceholder: function(placeholder) {
		this.placeholder = placeholder;
		return this;
	}
	,setValue: function(value) {
		this.value = value;
		return this;
	}
	,setMinLength: function(min_length) {
		this.min_length = min_length;
		return this;
	}
	,setMaxLength: function(max_length) {
		this.max_length = max_length;
		return this;
	}
	,setRequired: function(required) {
		if(required == null) {
			required = true;
		}
		this.required = required;
		return this;
	}
	,__class__: discord_$builder_APITextInputComponent
});
var discord_$builder_JSONEncodable = require("@discordjs/builders").JSONEncodable;
var discord_$builder_ActionRowBuilder = require("@discordjs/builders").ActionRowBuilder;
var discord_$builder_ButtonBuilder = function() {
	discord_$builder_APIButtonComponentBase.call(this);
};
$hxClasses["discord_builder.ButtonBuilder"] = discord_$builder_ButtonBuilder;
discord_$builder_ButtonBuilder.__name__ = "discord_builder.ButtonBuilder";
discord_$builder_ButtonBuilder.__super__ = discord_$builder_APIButtonComponentBase;
discord_$builder_ButtonBuilder.prototype = $extend(discord_$builder_APIButtonComponentBase.prototype,{
	label: null
	,custom_id: null
	,style: null
	,emoji: null
	,url: null
	,disabled: null
	,setDisabled: function(disabled) {
		if(disabled == null) {
			disabled = true;
		}
		this.disabled = disabled;
		return this;
	}
	,setCustomId: function(custom_id) {
		this.custom_id = custom_id;
		return this;
	}
	,setEmoji: function(emoji) {
		this.emoji = emoji;
		return this;
	}
	,setLabel: function(label) {
		this.label = label;
		return this;
	}
	,setStyle: function(style) {
		this.style = style;
		return this;
	}
	,setUrl: function(url) {
		this.url = url;
		return this;
	}
	,__class__: discord_$builder_ButtonBuilder
});
var discord_$builder_ContextMenuCommandBuilder = require("@discordjs/builders").ContextMenuCommandBuilder;
var discord_$builder_ModalBuildera = require("@discordjs/builders").ModalBuilder;
var discord_$builder_ModalBuilder = function() {
	this.components = [];
};
$hxClasses["discord_builder.ModalBuilder"] = discord_$builder_ModalBuilder;
discord_$builder_ModalBuilder.__name__ = "discord_builder.ModalBuilder";
discord_$builder_ModalBuilder.prototype = {
	title: null
	,custom_id: null
	,components: null
	,setCustomId: function(custom_id) {
		this.custom_id = custom_id;
		return this;
	}
	,setTitle: function(title) {
		this.title = title;
		return this;
	}
	,addComponents: function() {
		var $l=arguments.length;
		var components = new Array($l>0?$l-0:0);
		for(var $i=0;$i<$l;++$i){components[$i-0]=arguments[$i];}
		var _g_current = 0;
		while(_g_current < components.length) {
			var c = components[_g_current++];
			this.components.push(c);
		}
		return this;
	}
	,__class__: discord_$builder_ModalBuilder
};
var discord_$builder_SharedNameAndDescription = require("@discordjs/builders").SharedNameAndDescription;
var discord_$builder_SharedSlashCommandOptions = require("@discordjs/builders").SharedSlashCommandOptions;
var discord_$builder_AnySlashCommand = {};
discord_$builder_AnySlashCommand._new = function(builder) {
	return builder;
};
discord_$builder_AnySlashCommand.fromBase = function(base) {
	return discord_$builder_AnySlashCommand._new(base);
};
discord_$builder_AnySlashCommand.fromUser = function(user) {
	return discord_$builder_AnySlashCommand._new(user);
};
discord_$builder_AnySlashCommand.fromBool = function(bool) {
	return discord_$builder_AnySlashCommand._new(bool);
};
discord_$builder_AnySlashCommand.fromString = function(string) {
	return discord_$builder_AnySlashCommand._new(string);
};
discord_$builder_AnySlashCommand.fromChannel = function(channel) {
	return discord_$builder_AnySlashCommand._new(channel);
};
discord_$builder_AnySlashCommand.fromRole = function(role) {
	return discord_$builder_AnySlashCommand._new(role);
};
discord_$builder_AnySlashCommand.fromNumber = function(number) {
	return discord_$builder_AnySlashCommand._new(number);
};
discord_$builder_AnySlashCommand.fromMentionable = function(mentionable) {
	return discord_$builder_AnySlashCommand._new(mentionable);
};
discord_$builder_AnySlashCommand.fromSubcommand = function(subcommand) {
	return discord_$builder_AnySlashCommand._new(subcommand);
};
discord_$builder_AnySlashCommand.fromContextMenu = function(menu) {
	return discord_$builder_AnySlashCommand._new(menu);
};
var discord_$builder_SlashCommandOptionBase = require("@discordjs/builders").SlashCommandOptionBase;
var discord_$builder_SlashCommandBooleanOption = require("@discordjs/builders").SlashCommandBooleanOption;
var discord_$builder_SlashCommandBuilder = require("@discordjs/builders").SlashCommandBuilder;
var discord_$builder_SlashCommandChannelOption = require("@discordjs/builders").SlashCommandChannelOption;
var discord_$builder_SlashCommandMentionableOption = require("@discordjs/builders").SlashCommandMentionableOption;
var discord_$builder_SlashCommandNumberOption = require("@discordjs/builders").SlashCommandNumberOption;
var discord_$builder_SlashCommandRoleOption = require("@discordjs/builders").SlashCommandRoleOption;
var discord_$builder_SlashCommandStringOption = require("@discordjs/builders").SlashCommandStringOption;
var discord_$builder_SlashCommandSubcommandBuilder = require("@discordjs/builders").SlashCommandSubcommandBuilder;
var discord_$builder_SlashCommandUserOption = require("@discordjs/builders").SlashCommandUserOption;
var discord_$builder_TextInputBuilder = require("@discordjs/builders").TextInputBuilder;
var discord_$js_APIMessage = require("discord.js").APIMessage;
var discord_$js_Activity = require("discord.js").Activity;
var discord_$js_Application = require("discord.js").Application;
var discord_$js_Base = require("discord.js").Base;
var discord_$js_ApplicationCommandManager = require("discord.js").ApplicationCommandManager;
var discord_$js_BaseClient = require("discord.js").BaseClient;
var discord_$js_Emoji = require("discord.js").Emoji;
var discord_$js_BaseGuildEmoji = require("discord.js").BaseGuildEmoji;
var discord_$js_BaseManager = require("discord.js").BaseManager;
var discord_$js_BitField = require("discord.js").BitField;
var discord_$js_BroadcastDispatcher = require("discord.js").BroadcastDispatcher;
var discord_$js_Channel = require("discord.js").Channel;
var discord_$js_GuildChannel = require("discord.js").GuildChannel;
var discord_$js_CategoryChannel = require("discord.js").CategoryChannel;
var discord_$js_ChannelManager = require("discord.js").ChannelManager;
var discord_$js_Client = require("discord.js").Client;
var discord_$js_ClientApplication = require("discord.js").ClientApplication;
var discord_$js_User = require("discord.js").User;
var discord_$js_ClientUser = require("discord.js").ClientUser;
var discord_$js_ClientVoiceManager = require("discord.js").ClientVoiceManager;
var discord_$js_collection_Collection = require("@discordjs/collection").Collection;
var discord_$js_Collection = require("discord.js").Collection;
var discord_$js_Collector = require("discord.js").Collector;
var discord_$js_DMChannel = require("discord.js").DMChannel;
var discord_$js_Guild = require("discord.js").Guild;
var discord_$js_GuildApplicationCommandManager = require("discord.js").GuildApplicationCommandManager;
var discord_$js_GuildAuditLogs = require("discord.js").GuildAuditLogs;
var discord_$js_GuildAuditLogsEntry = require("discord.js").GuildAuditLogsEntry;
var discord_$js_GuildChannelManager = require("discord.js").GuildChannelManager;
var discord_$js_GuildEmoji = require("discord.js").GuildEmoji;
var discord_$js_GuildEmojiManager = require("discord.js").GuildEmojiManager;
var discord_$js_GuildEmojiRoleManager = require("discord.js").GuildEmojiRoleManager;
var discord_$js_GuildManager = require("discord.js").GuildManager;
var discord_$js_GuildMember = require("discord.js").GuildMember;
var discord_$js_GuildMemberManager = require("discord.js").GuildMemberManager;
var discord_$js_OverridableManager = require("discord.js").OverridableManager;
var discord_$js_GuildMemberRoleManager = require("discord.js").GuildMemberRoleManager;
var discord_$js_GuildPreview = require("discord.js").GuildPreview;
var discord_$js_GuildPreviewEmoji = require("discord.js").GuildPreviewEmoji;
var discord_$js_GuildScheduleEventManager = require("discord.js").GuildScheduleEventManager;
var discord_$js_GuildScheduledEvent = require("discord.js").GuildScheduledEvent;
var discord_$js_GuildTemplate = require("discord.js").GuildTemplate;
var discord_$js_Integration = require("discord.js").Integration;
var discord_$js_IntegrationApplication = require("discord.js").IntegrationApplication;
var discord_$js_Invite = require("discord.js").Invite;
var discord_$js_Message = require("discord.js").Message;
var discord_$js_MessageAttachment = require("discord.js").MessageAttachment;
var discord_$js_MessageCollector = require("discord.js").MessageCollector;
var discord_$js_MessageEmbed = require("@discordjs/builders").EmbedBuilder;
var discord_$js_Field = function(name,value,in_line) {
	this.name = name;
	this.value = value;
	this.inline = in_line;
};
$hxClasses["discord_js.Field"] = discord_$js_Field;
discord_$js_Field.__name__ = "discord_js.Field";
discord_$js_Field.prototype = {
	name: null
	,value: null
	,inline: null
	,__class__: discord_$js_Field
};
var discord_$js_MessageManager = require("discord.js").MessageManager;
var discord_$js_MessageMentions = require("discord.js").MessageMentions;
var discord_$js_MessageReaction = require("discord.js").MessageReaction;
var discord_$js_NewsChannel = require("discord.js").NewsChannel;
var discord_$js_PartialGroupDMChannel = require("discord.js").PartialGroupDMChannel;
var discord_$js_PermissionOverwrites = require("discord.js").PermissionOverwrites;
var discord_$js_Permissions = require("discord.js").Permissions;
var discord_$js_Presence = require("discord.js").Presence;
var discord_$js_PresenceManager = require("discord.js").PresenceManager;
var discord_$js_ReactionCollector = require("discord.js").ReactionCollector;
var discord_$js_ReactionEmoji = require("discord.js").ReactionEmoji;
var discord_$js_ReactionManager = require("discord.js").ReactionManager;
var discord_$js_ReactionUserManager = require("discord.js").ReactionUserManager;
var discord_$js_RichPresenceAssets = require("discord.js").RichPresenceAssets;
var discord_$js_Role = require("discord.js").Role;
var discord_$js_RoleManager = require("discord.js").RoleManager;
var discord_$js_Shard = require("discord.js").Shard;
var discord_$js_ShardClientUtil = require("discord.js").ShardClientUtil;
var discord_$js_ShardingManager = require("discord.js").ShardingManager;
var discord_$js_StreamDispatcher = require("discord.js").StreamDispatcher;
var discord_$js_Team = require("discord.js").Team;
var discord_$js_TeamMember = require("discord.js").TeamMember;
var discord_$js_TextChannel = require("discord.js").TextChannel;
var discord_$js_ThreadChannel = require("discord.js").ThreadChannel;
var discord_$js_ThreadManager = require("discord.js").ThreadManager;
var discord_$js_ThreadMemberManager = require("discord.js").ThreadMemberManager;
var discord_$js_UserFlags = require("discord.js").UserFlags;
var discord_$js_UserManager = require("discord.js").UserManager;
var discord_$js_VoiceBroadcast = require("discord.js").VoiceBroadcast;
var discord_$js_VoiceChannel = require("discord.js").VoiceChannel;
var discord_$js_VoiceConnection = require("discord.js").VoiceConnection;
var discord_$js_VoiceReceiver = require("discord.js").VoiceReceiver;
var discord_$js_VoiceRegion = require("discord.js").VoiceRegion;
var discord_$js_VoiceState = require("discord.js").VoiceState;
var discord_$js_VoiceStateManager = require("discord.js").VoiceStateManager;
var discord_$js_WebSocketManager = require("discord.js").WebSocketManager;
var discord_$js_WebSocketShard = require("discord.js").WebSocketShard;
var discord_$js_Webhook = require("discord.js").Webhook;
var discord_$js_WebhookClient = require("discord.js").WebhookClient;
var discord_$js_rest_CDN = require("@discordjs/rest").CDN;
var node_Events = require("events");
var discord_$js_rest_REST = require("@discordjs/rest").REST;
var discord_$js_rest_RequestManager = require("@discordjs/rest").RequestManager;
var ecs_Components = function(_size) {
	this.components = new Array(_size);
};
$hxClasses["ecs.Components"] = ecs_Components;
ecs_Components.__name__ = "ecs.Components";
ecs_Components.prototype = {
	components: null
	,set: function(_entity,_component) {
		this.components[ecs_Entity.id(_entity)] = _component;
	}
	,get: function(_entity) {
		return this.components[ecs_Entity.id(_entity)];
	}
	,__class__: ecs_Components
};
var ecs_Entity = {};
ecs_Entity._new = function(_id) {
	return _id;
};
ecs_Entity.id = function(this1) {
	return this1;
};
var ecs_Family = function(_id,_cmpMask,_resMask,_size) {
	this.id = _id;
	this.componentsMask = _cmpMask;
	this.resourcesMask = _resMask;
	this.onEntityAdded = new ecs_ds_Signal_$ecs_$Entity();
	this.onEntityRemoved = new ecs_ds_Signal_$ecs_$Entity();
	this.onActivated = new ecs_ds_Signal_$ecs_$ds_$Unit();
	this.onDeactivated = new ecs_ds_Signal_$ecs_$ds_$Unit();
	this.entities = new ecs_ds_SparseSet(_size);
	this.active = false;
};
$hxClasses["ecs.Family"] = ecs_Family;
ecs_Family.__name__ = "ecs.Family";
ecs_Family.prototype = {
	id: null
	,componentsMask: null
	,resourcesMask: null
	,onActivated: null
	,onDeactivated: null
	,onEntityAdded: null
	,onEntityRemoved: null
	,entities: null
	,active: null
	,add: function(_entity) {
		if(!this.entities.has(_entity)) {
			this.entities.insert(_entity);
			if(this.isActive()) {
				this.onEntityAdded.notify(_entity);
			}
		}
	}
	,remove: function(_entity) {
		if(this.entities.has(_entity)) {
			if(this.isActive()) {
				this.onEntityRemoved.notify(_entity);
			}
			this.entities.remove(_entity);
		}
	}
	,has: function(_entity) {
		return this.entities.has(_entity);
	}
	,activate: function() {
		if(!this.active) {
			this.active = true;
			this.onActivated.notify(ecs_ds_Unit.unit);
			var _g = 0;
			var _g1 = this.entities.size();
			while(_g < _g1) {
				var i = _g++;
				this.onEntityAdded.notify(this.entities.getDense(i));
			}
		}
	}
	,deactivate: function() {
		if(this.active) {
			var _g = 0;
			var _g1 = this.entities.size();
			while(_g < _g1) {
				var i = _g++;
				this.onEntityRemoved.notify(this.entities.getDense(i));
			}
			this.onDeactivated.notify(ecs_ds_Unit.unit);
			this.active = false;
		}
	}
	,size: function() {
		return this.entities.size();
	}
	,isActive: function() {
		return this.active;
	}
	,iterator: function() {
		return new ecs__$Family_FamilyIterator(this.entities,this.isActive());
	}
	,__class__: ecs_Family
};
var ecs__$Family_FamilyIterator = function(_set,_active) {
	this.set = _set;
	this.active = _active;
	this.idx = _set.size() - 1;
};
$hxClasses["ecs._Family.FamilyIterator"] = ecs__$Family_FamilyIterator;
ecs__$Family_FamilyIterator.__name__ = "ecs._Family.FamilyIterator";
ecs__$Family_FamilyIterator.prototype = {
	set: null
	,active: null
	,idx: null
	,hasNext: function() {
		if(this.active) {
			return this.idx >= 0;
		} else {
			return false;
		}
	}
	,next: function() {
		return this.set.getDense(this.idx--);
	}
	,__class__: ecs__$Family_FamilyIterator
};
var ecs_Phase = function(_enabled,_name,_systems,_enabledSystems) {
	this.enabled = _enabled;
	this.name = _name;
	this.systems = _systems;
	this.enabledSystems = _enabledSystems;
};
$hxClasses["ecs.Phase"] = ecs_Phase;
ecs_Phase.__name__ = "ecs.Phase";
ecs_Phase.prototype = {
	enabled: null
	,systems: null
	,enabledSystems: null
	,name: null
	,update: function(_dt) {
		if(!this.enabled) {
			return;
		}
		var _g = 0;
		var _g1 = this.systems.length;
		while(_g < _g1) {
			var idx = _g++;
			if(this.enabledSystems[idx]) {
				this.systems[idx].update(_dt);
			}
		}
	}
	,enable: function() {
		if(this.enabled) {
			return;
		}
		this.enabled = true;
		var _g = 0;
		var _g1 = this.systems.length;
		while(_g < _g1) {
			var idx = _g++;
			if(this.enabledSystems[idx]) {
				this.systems[idx].onEnabled();
			}
		}
	}
	,disable: function() {
		if(!this.enabled) {
			return;
		}
		this.enabled = false;
		var _g = 0;
		var _g1 = this.systems.length;
		while(_g < _g1) {
			var idx = _g++;
			if(this.enabledSystems[idx]) {
				this.systems[idx].onDisabled();
			}
		}
	}
	,__class__: ecs_Phase
};
var ecs_TableType = {};
ecs_TableType._new = function(value) {
	return value;
};
ecs_TableType.fromClass = function(input) {
	return ecs_TableType._new(input.__name__);
};
var ecs_Universe = function(_entities,_components,_resources,_families,_phases) {
	this.entities = _entities;
	this.components = _components;
	this.resources = _resources;
	this.families = _families;
	this.phases = _phases;
};
$hxClasses["ecs.Universe"] = ecs_Universe;
ecs_Universe.__name__ = "ecs.Universe";
ecs_Universe.prototype = {
	entities: null
	,components: null
	,resources: null
	,families: null
	,phases: null
	,update: function(_dt) {
		var _g = 0;
		var _g1 = this.phases;
		while(_g < _g1.length) {
			var phase = _g1[_g];
			++_g;
			phase.update(_dt);
		}
	}
	,createEntity: function() {
		return this.entities.create();
	}
	,deleteEntity: function(_entity) {
		this.families.whenEntityDestroyed(_entity);
		this.components.clear(_entity);
		this.entities.destroy(ecs_Entity.id(_entity));
	}
	,getPhase: function(_name) {
		var _g = 0;
		var _g1 = this.phases;
		while(_g < _g1.length) {
			var phase = _g1[_g];
			++_g;
			if(phase.name == _name) {
				return phase;
			}
		}
		throw new haxe_Exception("Unable to find a phase with the name " + _name);
	}
	,__class__: ecs_Universe
};
var ecs_core_ComponentManager = function(_entities,_components) {
	this.entities = _entities;
	this.components = _components;
	var v = new Array(_entities.capacity());
	var _g = 0;
	var _g1 = v.length;
	while(_g < _g1) {
		var i = _g++;
		v[i] = [0];
	}
	this.flags = v;
};
$hxClasses["ecs.core.ComponentManager"] = ecs_core_ComponentManager;
ecs_core_ComponentManager.__name__ = "ecs.core.ComponentManager";
ecs_core_ComponentManager.prototype = {
	entities: null
	,components: null
	,flags: null
	,getTable: function(_compID) {
		return this.components[_compID];
	}
	,set: function(_entity,_id,_component) {
		this.components[_id].set(_entity,_component);
		bits_Bits.set(this.flags[ecs_Entity.id(_entity)],_id);
	}
	,remove: function(_entity,_id) {
		bits_Bits.unset(this.flags[ecs_Entity.id(_entity)],_id);
	}
	,clear: function(_entity) {
		var _g = 0;
		var _g1 = this.components;
		while(_g < _g1.length) {
			var set = _g1[_g];
			++_g;
			set.set(_entity,null);
		}
		bits_Bits.clear(this.flags[ecs_Entity.id(_entity)]);
	}
	,__class__: ecs_core_ComponentManager
};
var ecs_core_EntityManager = function(_max) {
	this.storage = new Array(_max);
	this.recycleBin = new Array(_max);
	this.nextID = 0;
	this.binSize = 0;
};
$hxClasses["ecs.core.EntityManager"] = ecs_core_EntityManager;
ecs_core_EntityManager.__name__ = "ecs.core.EntityManager";
ecs_core_EntityManager.prototype = {
	storage: null
	,recycleBin: null
	,nextID: null
	,binSize: null
	,create: function() {
		if(this.binSize > 0) {
			return this.storage[this.recycleBin[--this.binSize]];
		}
		var idx = this.nextID++;
		if(idx >= this.storage.length) {
			throw haxe_Exception.thrown("ECS entity limit exceeded");
		}
		var e = ecs_Entity._new(idx);
		this.storage[idx] = e;
		return e;
	}
	,destroy: function(_id) {
		this.recycleBin[this.binSize++] = _id;
	}
	,get: function(_id) {
		return this.storage[_id];
	}
	,capacity: function() {
		return this.storage.length;
	}
	,__class__: ecs_core_EntityManager
};
var ecs_core_FamilyManager = function(_components,_resources,_families) {
	this.components = _components;
	this.resources = _resources;
	this.families = _families;
	this.number = this.families.length;
};
$hxClasses["ecs.core.FamilyManager"] = ecs_core_FamilyManager;
ecs_core_FamilyManager.__name__ = "ecs.core.FamilyManager";
ecs_core_FamilyManager.prototype = {
	components: null
	,resources: null
	,families: null
	,number: null
	,get: function(_index) {
		return this.families[_index];
	}
	,tryActivate: function(_id) {
		if(!this.families[_id].isActive() && bits_Bits.areSet(this.resources.flags,this.families[_id].resourcesMask)) {
			this.families[_id].activate();
		}
	}
	,tryDeactivate: function(_id,resourceID) {
		if(!bits_Bits.isSet(this.resources.flags,resourceID)) {
			return;
		}
		if(!this.families[_id].isActive()) {
			return;
		}
		if(bits_Bits.isSet(this.families[_id].resourcesMask,resourceID)) {
			this.families[_id].deactivate();
		}
	}
	,whenEntityDestroyed: function(_entity) {
		var _g = 0;
		var _g1 = this.families;
		while(_g < _g1.length) {
			var family = _g1[_g];
			++_g;
			family.remove(_entity);
		}
	}
	,__class__: ecs_core_FamilyManager
};
var ecs_core_ResourceManager = function(_flags,_resources) {
	this.flags = _flags;
	this.resources = _resources;
};
$hxClasses["ecs.core.ResourceManager"] = ecs_core_ResourceManager;
ecs_core_ResourceManager.__name__ = "ecs.core.ResourceManager";
ecs_core_ResourceManager.prototype = {
	flags: null
	,resources: null
	,get: function(_id) {
		return this.resources[_id];
	}
	,insert: function(_id,_resource) {
		this.resources[_id] = _resource;
		bits_Bits.set(this.flags,_id);
	}
	,remove: function(_id) {
		bits_Bits.unset(this.flags,_id);
		this.resources[_id] = null;
	}
	,__class__: ecs_core_ResourceManager
};
var ecs_ds_Signal = function() {
	this.subscribers = [];
};
$hxClasses["ecs.ds.Signal"] = ecs_ds_Signal;
ecs_ds_Signal.__name__ = "ecs.ds.Signal";
ecs_ds_Signal.prototype = {
	subscribers: null
	,subscribe: function(_func) {
		if(this.subscribers.indexOf(_func) == -1) {
			this.subscribers.push(_func);
		}
	}
	,unsubscribe: function(_func) {
		HxOverrides.remove(this.subscribers,_func);
	}
	,notify: function(_data) {
		var _g = 0;
		var _g1 = this.subscribers;
		while(_g < _g1.length) {
			var func = _g1[_g];
			++_g;
			func(_data);
		}
	}
	,__class__: ecs_ds_Signal
};
var ecs_ds_Signal_$ecs_$Entity = function() {
	this.subscribers = [];
};
$hxClasses["ecs.ds.Signal_ecs_Entity"] = ecs_ds_Signal_$ecs_$Entity;
ecs_ds_Signal_$ecs_$Entity.__name__ = "ecs.ds.Signal_ecs_Entity";
ecs_ds_Signal_$ecs_$Entity.prototype = {
	subscribers: null
	,subscribe: function(_func) {
		if(this.subscribers.indexOf(_func) == -1) {
			this.subscribers.push(_func);
		}
	}
	,unsubscribe: function(_func) {
		HxOverrides.remove(this.subscribers,_func);
	}
	,notify: function(_data) {
		var _g = 0;
		var _g1 = this.subscribers;
		while(_g < _g1.length) {
			var func = _g1[_g];
			++_g;
			func(_data);
		}
	}
	,__class__: ecs_ds_Signal_$ecs_$Entity
};
var ecs_ds_Signal_$ecs_$ds_$Unit = function() {
	this.subscribers = [];
};
$hxClasses["ecs.ds.Signal_ecs_ds_Unit"] = ecs_ds_Signal_$ecs_$ds_$Unit;
ecs_ds_Signal_$ecs_$ds_$Unit.__name__ = "ecs.ds.Signal_ecs_ds_Unit";
ecs_ds_Signal_$ecs_$ds_$Unit.prototype = {
	subscribers: null
	,subscribe: function(_func) {
		if(this.subscribers.indexOf(_func) == -1) {
			this.subscribers.push(_func);
		}
	}
	,unsubscribe: function(_func) {
		HxOverrides.remove(this.subscribers,_func);
	}
	,notify: function(_data) {
		var _g = 0;
		var _g1 = this.subscribers;
		while(_g < _g1.length) {
			var func = _g1[_g];
			++_g;
			func(_data);
		}
	}
	,__class__: ecs_ds_Signal_$ecs_$ds_$Unit
};
var ecs_ds_SparseSet = function(_size) {
	this.sparse = new Array(_size);
	this.dense = new Array(_size);
	this.number = 0;
	var _g = 0;
	var _g1 = this.sparse.length;
	while(_g < _g1) {
		var i = _g++;
		this.sparse[i] = 0;
	}
	var _g = 0;
	var _g1 = this.dense.length;
	while(_g < _g1) {
		var i = _g++;
		this.dense[i] = ecs_Entity.none;
	}
};
$hxClasses["ecs.ds.SparseSet"] = ecs_ds_SparseSet;
ecs_ds_SparseSet.__name__ = "ecs.ds.SparseSet";
ecs_ds_SparseSet.prototype = {
	sparse: null
	,dense: null
	,number: null
	,has: function(_entity) {
		if(this.sparse[ecs_Entity.id(_entity)] < this.number) {
			return this.dense[this.sparse[ecs_Entity.id(_entity)]] == _entity;
		} else {
			return false;
		}
	}
	,insert: function(_entity) {
		this.dense[this.number] = _entity;
		this.sparse[ecs_Entity.id(_entity)] = this.number;
		this.number++;
	}
	,remove: function(_entity) {
		var temp = this.dense[this.number - 1];
		this.dense[this.sparse[ecs_Entity.id(_entity)]] = temp;
		this.sparse[ecs_Entity.id(temp)] = this.sparse[ecs_Entity.id(_entity)];
		this.number--;
	}
	,getDense: function(_idx) {
		return this.dense[_idx];
	}
	,getSparse: function(_entity) {
		return this.sparse[ecs_Entity.id(_entity)];
	}
	,size: function() {
		return this.number;
	}
	,__class__: ecs_ds_SparseSet
};
var ecs_ds_Unit = {};
ecs_ds_Unit._new = function() {
	return null;
};
var externs_Fetch = require("node-fetch");
var externs_FuzzySort = require("fuzzysort");
var firebase_web_app_FirebaseApp = require("firebase/app");
var firebase_web_auth_Auth = require("firebase/auth");
var firebase_web_firestore_Query = require("firebase/firestore");
var firebase_web_firestore_Firestore = require("firebase/firestore");
var firebase_web_firestore_QueryConstraint = require("firebase/firestore");
var firebase_web_firestore_Timestamp = require("firebase/firestore").Timestamp;
var firebase_web_firestore_Unsubscribe = require("firebase/firestore");
var haxe_StackItem = $hxEnums["haxe.StackItem"] = { __ename__:"haxe.StackItem",__constructs__:null
	,CFunction: {_hx_name:"CFunction",_hx_index:0,__enum__:"haxe.StackItem",toString:$estr}
	,Module: ($_=function(m) { return {_hx_index:1,m:m,__enum__:"haxe.StackItem",toString:$estr,__params__:function(){ return [this.m];}}; },$_._hx_name="Module",$_)
	,FilePos: ($_=function(s,file,line,column) { return {_hx_index:2,s:s,file:file,line:line,column:column,__enum__:"haxe.StackItem",toString:$estr,__params__:function(){ return [this.s,this.file,this.line,this.column];}}; },$_._hx_name="FilePos",$_)
	,Method: ($_=function(classname,method) { return {_hx_index:3,classname:classname,method:method,__enum__:"haxe.StackItem",toString:$estr,__params__:function(){ return [this.classname,this.method];}}; },$_._hx_name="Method",$_)
	,LocalFunction: ($_=function(v) { return {_hx_index:4,v:v,__enum__:"haxe.StackItem",toString:$estr,__params__:function(){ return [this.v];}}; },$_._hx_name="LocalFunction",$_)
};
haxe_StackItem.__constructs__ = [haxe_StackItem.CFunction,haxe_StackItem.Module,haxe_StackItem.FilePos,haxe_StackItem.Method,haxe_StackItem.LocalFunction];
haxe_StackItem.__empty_constructs__ = [haxe_StackItem.CFunction];
var haxe_CallStack = {};
haxe_CallStack.__properties__ = {get_length:"get_length"};
haxe_CallStack.get_length = function(this1) {
	return this1.length;
};
haxe_CallStack.callStack = function() {
	return haxe_NativeStackTrace.toHaxe(haxe_NativeStackTrace.callStack());
};
haxe_CallStack.exceptionStack = function(fullStack) {
	if(fullStack == null) {
		fullStack = false;
	}
	var eStack = haxe_NativeStackTrace.toHaxe(haxe_NativeStackTrace.exceptionStack());
	return fullStack ? eStack : haxe_CallStack.subtract(eStack,haxe_CallStack.callStack());
};
haxe_CallStack.toString = function(stack) {
	var b = new StringBuf();
	var _g = 0;
	var _g1 = stack;
	while(_g < _g1.length) {
		var s = _g1[_g];
		++_g;
		b.b += "\nCalled from ";
		haxe_CallStack.itemToString(b,s);
	}
	return b.b;
};
haxe_CallStack.subtract = function(this1,stack) {
	var startIndex = -1;
	var i = -1;
	while(++i < this1.length) {
		var _g = 0;
		var _g1 = stack.length;
		while(_g < _g1) {
			var j = _g++;
			if(haxe_CallStack.equalItems(this1[i],stack[j])) {
				if(startIndex < 0) {
					startIndex = i;
				}
				++i;
				if(i >= this1.length) {
					break;
				}
			} else {
				startIndex = -1;
			}
		}
		if(startIndex >= 0) {
			break;
		}
	}
	if(startIndex >= 0) {
		return this1.slice(0,startIndex);
	} else {
		return this1;
	}
};
haxe_CallStack.copy = function(this1) {
	return this1.slice();
};
haxe_CallStack.get = function(this1,index) {
	return this1[index];
};
haxe_CallStack.asArray = function(this1) {
	return this1;
};
haxe_CallStack.equalItems = function(item1,item2) {
	if(item1 == null) {
		if(item2 == null) {
			return true;
		} else {
			return false;
		}
	} else {
		switch(item1._hx_index) {
		case 0:
			if(item2 == null) {
				return false;
			} else if(item2._hx_index == 0) {
				return true;
			} else {
				return false;
			}
			break;
		case 1:
			if(item2 == null) {
				return false;
			} else if(item2._hx_index == 1) {
				return item1.m == item2.m;
			} else {
				return false;
			}
			break;
		case 2:
			if(item2 == null) {
				return false;
			} else if(item2._hx_index == 2) {
				if(item1.file == item2.file && item1.line == item2.line && item1.column == item2.column) {
					return haxe_CallStack.equalItems(item1.s,item2.s);
				} else {
					return false;
				}
			} else {
				return false;
			}
			break;
		case 3:
			if(item2 == null) {
				return false;
			} else if(item2._hx_index == 3) {
				if(item1.classname == item2.classname) {
					return item1.method == item2.method;
				} else {
					return false;
				}
			} else {
				return false;
			}
			break;
		case 4:
			if(item2 == null) {
				return false;
			} else if(item2._hx_index == 4) {
				return item1.v == item2.v;
			} else {
				return false;
			}
			break;
		}
	}
};
haxe_CallStack.exceptionToString = function(e) {
	if(e.get_previous() == null) {
		var tmp = "Exception: " + e.toString();
		var tmp1 = e.get_stack();
		return tmp + (tmp1 == null ? "null" : haxe_CallStack.toString(tmp1));
	}
	var result = "";
	var e1 = e;
	var prev = null;
	while(e1 != null) {
		if(prev == null) {
			var result1 = "Exception: " + e1.get_message();
			var tmp = e1.get_stack();
			result = result1 + (tmp == null ? "null" : haxe_CallStack.toString(tmp)) + result;
		} else {
			var prevStack = haxe_CallStack.subtract(e1.get_stack(),prev.get_stack());
			result = "Exception: " + e1.get_message() + (prevStack == null ? "null" : haxe_CallStack.toString(prevStack)) + "\n\nNext " + result;
		}
		prev = e1;
		e1 = e1.get_previous();
	}
	return result;
};
haxe_CallStack.itemToString = function(b,s) {
	switch(s._hx_index) {
	case 0:
		b.b += "a C function";
		break;
	case 1:
		var _gm = s.m;
		b.b = (b.b += "module ") + (_gm == null ? "null" : "" + _gm);
		break;
	case 2:
		var _gs = s.s;
		var _gfile = s.file;
		var _gline = s.line;
		var _gcolumn = s.column;
		if(_gs != null) {
			haxe_CallStack.itemToString(b,_gs);
			b.b += " (";
		}
		b.b = (b.b += _gfile == null ? "null" : "" + _gfile) + " line ";
		b.b += _gline == null ? "null" : "" + _gline;
		if(_gcolumn != null) {
			b.b = (b.b += " column ") + (_gcolumn == null ? "null" : "" + _gcolumn);
		}
		if(_gs != null) {
			b.b += ")";
		}
		break;
	case 3:
		var _gclassname = s.classname;
		var _gmethod = s.method;
		b.b = (b.b += Std.string(_gclassname == null ? "<unknown>" : _gclassname)) + ".";
		b.b += _gmethod == null ? "null" : "" + _gmethod;
		break;
	case 4:
		var _gv = s.v;
		b.b = (b.b += "local function #") + (_gv == null ? "null" : "" + _gv);
		break;
	}
};
var haxe_IMap = function() { };
$hxClasses["haxe.IMap"] = haxe_IMap;
haxe_IMap.__name__ = "haxe.IMap";
haxe_IMap.__isInterface__ = true;
haxe_IMap.prototype = {
	get: null
	,set: null
	,exists: null
	,remove: null
	,keys: null
	,iterator: null
	,keyValueIterator: null
	,copy: null
	,toString: null
	,clear: null
	,__class__: haxe_IMap
};
var haxe_DynamicAccess = {};
haxe_DynamicAccess._new = function() {
	return { };
};
haxe_DynamicAccess.get = function(this1,key) {
	return this1[key];
};
haxe_DynamicAccess.set = function(this1,key,value) {
	return this1[key] = value;
};
haxe_DynamicAccess.exists = function(this1,key) {
	return Object.prototype.hasOwnProperty.call(this1,key);
};
haxe_DynamicAccess.remove = function(this1,key) {
	return Reflect.deleteField(this1,key);
};
haxe_DynamicAccess.keys = function(this1) {
	return Reflect.fields(this1);
};
haxe_DynamicAccess.copy = function(this1) {
	return Reflect.copy(this1);
};
haxe_DynamicAccess.iterator = function(this1) {
	return new haxe_iterators_DynamicAccessIterator(this1);
};
haxe_DynamicAccess.keyValueIterator = function(this1) {
	return new haxe_iterators_DynamicAccessKeyValueIterator(this1);
};
var haxe_Exception = function(message,previous,native) {
	Error.call(this,message);
	this.message = message;
	this.__previousException = previous;
	this.__nativeException = native != null ? native : this;
	this.__skipStack = 0;
	var old = Error.prepareStackTrace;
	Error.prepareStackTrace = function(e) { return e.stack; }
	if(((native) instanceof Error)) {
		this.stack = native.stack;
	} else {
		var e = null;
		if(Error.captureStackTrace) {
			Error.captureStackTrace(this,haxe_Exception);
			e = this;
		} else {
			e = new Error();
			if(typeof(e.stack) == "undefined") {
				try { throw e; } catch(_) {}
				this.__skipStack++;
			}
		}
		this.stack = e.stack;
	}
	Error.prepareStackTrace = old;
};
$hxClasses["haxe.Exception"] = haxe_Exception;
haxe_Exception.__name__ = "haxe.Exception";
haxe_Exception.caught = function(value) {
	if(((value) instanceof haxe_Exception)) {
		return value;
	} else if(((value) instanceof Error)) {
		return new haxe_Exception(value.message,null,value);
	} else {
		return new haxe_ValueException(value,null,value);
	}
};
haxe_Exception.thrown = function(value) {
	if(((value) instanceof haxe_Exception)) {
		return value.get_native();
	} else if(((value) instanceof Error)) {
		return value;
	} else {
		var e = new haxe_ValueException(value);
		e.__skipStack++;
		return e;
	}
};
haxe_Exception.__super__ = Error;
haxe_Exception.prototype = $extend(Error.prototype,{
	__skipStack: null
	,__nativeException: null
	,__previousException: null
	,unwrap: function() {
		return this.__nativeException;
	}
	,toString: function() {
		return this.get_message();
	}
	,details: function() {
		if(this.get_previous() == null) {
			var tmp = "Exception: " + this.toString();
			var tmp1 = this.get_stack();
			return tmp + (tmp1 == null ? "null" : haxe_CallStack.toString(tmp1));
		} else {
			var result = "";
			var e = this;
			var prev = null;
			while(e != null) {
				if(prev == null) {
					var result1 = "Exception: " + e.get_message();
					var tmp = e.get_stack();
					result = result1 + (tmp == null ? "null" : haxe_CallStack.toString(tmp)) + result;
				} else {
					var prevStack = haxe_CallStack.subtract(e.get_stack(),prev.get_stack());
					result = "Exception: " + e.get_message() + (prevStack == null ? "null" : haxe_CallStack.toString(prevStack)) + "\n\nNext " + result;
				}
				prev = e;
				e = e.get_previous();
			}
			return result;
		}
	}
	,__shiftStack: function() {
		this.__skipStack++;
	}
	,get_message: function() {
		return this.message;
	}
	,get_previous: function() {
		return this.__previousException;
	}
	,get_native: function() {
		return this.__nativeException;
	}
	,get_stack: function() {
		var _g = this.__exceptionStack;
		if(_g == null) {
			var value = haxe_NativeStackTrace.toHaxe(haxe_NativeStackTrace.normalize(this.stack),this.__skipStack);
			this.setProperty("__exceptionStack",value);
			return value;
		} else {
			return _g;
		}
	}
	,setProperty: function(name,value) {
		try {
			Object.defineProperty(this,name,{ value : value});
		} catch( _g ) {
			this[name] = value;
		}
	}
	,get___exceptionStack: function() {
		return this.__exceptionStack;
	}
	,set___exceptionStack: function(value) {
		this.setProperty("__exceptionStack",value);
		return value;
	}
	,get___skipStack: function() {
		return this.__skipStack;
	}
	,set___skipStack: function(value) {
		this.setProperty("__skipStack",value);
		return value;
	}
	,get___nativeException: function() {
		return this.__nativeException;
	}
	,set___nativeException: function(value) {
		this.setProperty("__nativeException",value);
		return value;
	}
	,get___previousException: function() {
		return this.__previousException;
	}
	,set___previousException: function(value) {
		this.setProperty("__previousException",value);
		return value;
	}
	,__class__: haxe_Exception
	,__properties__: {set___exceptionStack:"set___exceptionStack",get___exceptionStack:"get___exceptionStack",get_native:"get_native",get_previous:"get_previous",get_stack:"get_stack",get_message:"get_message"}
});
var haxe_Int32 = {};
haxe_Int32.negate = function(this1) {
	return ~this1 + 1 | 0;
};
haxe_Int32.preIncrement = function(this1) {
	this1 = ++this1 | 0;
	return this1;
};
haxe_Int32.postIncrement = function(this1) {
	var ret = this1++;
	this1 |= 0;
	return ret;
};
haxe_Int32.preDecrement = function(this1) {
	this1 = --this1 | 0;
	return this1;
};
haxe_Int32.postDecrement = function(this1) {
	var ret = this1--;
	this1 |= 0;
	return ret;
};
haxe_Int32.add = function(a,b) {
	return a + b | 0;
};
haxe_Int32.addInt = function(a,b) {
	return a + b | 0;
};
haxe_Int32.addFloat = null;
haxe_Int32.sub = function(a,b) {
	return a - b | 0;
};
haxe_Int32.subInt = function(a,b) {
	return a - b | 0;
};
haxe_Int32.intSub = function(a,b) {
	return a - b | 0;
};
haxe_Int32.subFloat = null;
haxe_Int32.floatSub = null;
haxe_Int32.mul = function(a,b) {
	return haxe_Int32._mul(a,b);
};
haxe_Int32.mulInt = function(a,b) {
	return haxe_Int32._mul(a,b);
};
haxe_Int32.mulFloat = null;
haxe_Int32.div = null;
haxe_Int32.divInt = null;
haxe_Int32.intDiv = null;
haxe_Int32.divFloat = null;
haxe_Int32.floatDiv = null;
haxe_Int32.mod = null;
haxe_Int32.modInt = null;
haxe_Int32.intMod = null;
haxe_Int32.modFloat = null;
haxe_Int32.floatMod = null;
haxe_Int32.eq = null;
haxe_Int32.eqInt = null;
haxe_Int32.eqFloat = null;
haxe_Int32.neq = null;
haxe_Int32.neqInt = null;
haxe_Int32.neqFloat = null;
haxe_Int32.lt = null;
haxe_Int32.ltInt = null;
haxe_Int32.intLt = null;
haxe_Int32.ltFloat = null;
haxe_Int32.floatLt = null;
haxe_Int32.lte = null;
haxe_Int32.lteInt = null;
haxe_Int32.intLte = null;
haxe_Int32.lteFloat = null;
haxe_Int32.floatLte = null;
haxe_Int32.gt = null;
haxe_Int32.gtInt = null;
haxe_Int32.intGt = null;
haxe_Int32.gtFloat = null;
haxe_Int32.floatGt = null;
haxe_Int32.gte = null;
haxe_Int32.gteInt = null;
haxe_Int32.intGte = null;
haxe_Int32.gteFloat = null;
haxe_Int32.floatGte = null;
haxe_Int32.complement = null;
haxe_Int32.and = null;
haxe_Int32.andInt = null;
haxe_Int32.or = null;
haxe_Int32.orInt = null;
haxe_Int32.xor = null;
haxe_Int32.xorInt = null;
haxe_Int32.shr = null;
haxe_Int32.shrInt = null;
haxe_Int32.intShr = null;
haxe_Int32.ushr = null;
haxe_Int32.ushrInt = null;
haxe_Int32.intUshr = null;
haxe_Int32.shl = null;
haxe_Int32.shlInt = null;
haxe_Int32.intShl = null;
haxe_Int32.toFloat = function(this1) {
	return this1;
};
haxe_Int32.ucompare = function(a,b) {
	if(a < 0) {
		if(b < 0) {
			return ~b - ~a | 0;
		} else {
			return 1;
		}
	}
	if(b < 0) {
		return -1;
	} else {
		return a - b | 0;
	}
};
haxe_Int32.clamp = function(x) {
	return x | 0;
};
var haxe_Int64 = {};
haxe_Int64.__properties__ = {get_low:"get_low",get_high:"get_high"};
haxe_Int64._new = function(x) {
	return x;
};
haxe_Int64.copy = function(this1) {
	return new haxe__$Int64__$_$_$Int64(this1.high,this1.low);
};
haxe_Int64.make = function(high,low) {
	return new haxe__$Int64__$_$_$Int64(high,low);
};
haxe_Int64.ofInt = function(x) {
	return new haxe__$Int64__$_$_$Int64(x >> 31,x);
};
haxe_Int64.toInt = function(x) {
	if(x.high != x.low >> 31) {
		throw haxe_Exception.thrown("Overflow");
	}
	return x.low;
};
haxe_Int64.is = function(val) {
	return ((val) instanceof haxe__$Int64__$_$_$Int64);
};
haxe_Int64.isInt64 = function(val) {
	return ((val) instanceof haxe__$Int64__$_$_$Int64);
};
haxe_Int64.getHigh = function(x) {
	return x.high;
};
haxe_Int64.getLow = function(x) {
	return x.low;
};
haxe_Int64.isNeg = function(x) {
	return x.high < 0;
};
haxe_Int64.isZero = function(x) {
	var b_high = 0;
	var b_low = 0;
	if(x.high == b_high) {
		return x.low == b_low;
	} else {
		return false;
	}
};
haxe_Int64.compare = function(a,b) {
	var v = a.high - b.high | 0;
	if(v == 0) {
		v = haxe_Int32.ucompare(a.low,b.low);
	}
	if(a.high < 0) {
		if(b.high < 0) {
			return v;
		} else {
			return -1;
		}
	} else if(b.high >= 0) {
		return v;
	} else {
		return 1;
	}
};
haxe_Int64.ucompare = function(a,b) {
	var v = haxe_Int32.ucompare(a.high,b.high);
	if(v != 0) {
		return v;
	} else {
		return haxe_Int32.ucompare(a.low,b.low);
	}
};
haxe_Int64.toStr = function(x) {
	return haxe_Int64.toString(x);
};
haxe_Int64.toString = function(this1) {
	var i = this1;
	var b_high = 0;
	var b_low = 0;
	if(i.high == b_high && i.low == b_low) {
		return "0";
	}
	var str = "";
	var neg = false;
	if(i.high < 0) {
		neg = true;
	}
	var ten = new haxe__$Int64__$_$_$Int64(0,10);
	while(true) {
		var b_high = 0;
		var b_low = 0;
		if(!(i.high != b_high || i.low != b_low)) {
			break;
		}
		var r = haxe_Int64.divMod(i,ten);
		if(r.modulus.high < 0) {
			var x = r.modulus;
			var low = ~x.low + 1 | 0;
			str = low + str;
			var x1 = r.quotient;
			var high = ~x1.high;
			var low1 = ~x1.low + 1 | 0;
			if(low1 == 0) {
				++high;
				high = high | 0;
			}
			i = new haxe__$Int64__$_$_$Int64(high,low1);
		} else {
			str = r.modulus.low + str;
			i = r.quotient;
		}
	}
	if(neg) {
		str = "-" + str;
	}
	return str;
};
haxe_Int64.parseString = function(sParam) {
	return haxe_Int64Helper.parseString(sParam);
};
haxe_Int64.fromFloat = function(f) {
	return haxe_Int64Helper.fromFloat(f);
};
haxe_Int64.divMod = function(dividend,divisor) {
	if(divisor.high == 0) {
		switch(divisor.low) {
		case 0:
			throw haxe_Exception.thrown("divide by zero");
		case 1:
			return { quotient : new haxe__$Int64__$_$_$Int64(dividend.high,dividend.low), modulus : new haxe__$Int64__$_$_$Int64(0,0)};
		}
	}
	var divSign = dividend.high < 0 != divisor.high < 0;
	var modulus;
	if(dividend.high < 0) {
		var high = ~dividend.high;
		var low = ~dividend.low + 1 | 0;
		if(low == 0) {
			++high;
			high = high | 0;
		}
		modulus = new haxe__$Int64__$_$_$Int64(high,low);
	} else {
		modulus = new haxe__$Int64__$_$_$Int64(dividend.high,dividend.low);
	}
	if(divisor.high < 0) {
		var high = ~divisor.high;
		var low = ~divisor.low + 1 | 0;
		if(low == 0) {
			++high;
			high = high | 0;
		}
		divisor = new haxe__$Int64__$_$_$Int64(high,low);
	}
	var quotient = new haxe__$Int64__$_$_$Int64(0,0);
	var mask = new haxe__$Int64__$_$_$Int64(0,1);
	while(!(divisor.high < 0)) {
		var v = haxe_Int32.ucompare(divisor.high,modulus.high);
		var cmp = v != 0 ? v : haxe_Int32.ucompare(divisor.low,modulus.low);
		divisor = new haxe__$Int64__$_$_$Int64(divisor.high << 1 | divisor.low >>> 31,divisor.low << 1);
		mask = new haxe__$Int64__$_$_$Int64(mask.high << 1 | mask.low >>> 31,mask.low << 1);
		if(cmp >= 0) {
			break;
		}
	}
	while(true) {
		var b_high = 0;
		var b_low = 0;
		if(!(mask.high != b_high || mask.low != b_low)) {
			break;
		}
		var v = haxe_Int32.ucompare(modulus.high,divisor.high);
		if((v != 0 ? v : haxe_Int32.ucompare(modulus.low,divisor.low)) >= 0) {
			quotient = new haxe__$Int64__$_$_$Int64(quotient.high | mask.high,quotient.low | mask.low);
			var high = modulus.high - divisor.high | 0;
			var low = modulus.low - divisor.low | 0;
			if(haxe_Int32.ucompare(modulus.low,divisor.low) < 0) {
				--high;
				high = high | 0;
			}
			modulus = new haxe__$Int64__$_$_$Int64(high,low);
		}
		mask = new haxe__$Int64__$_$_$Int64(mask.high >>> 1,mask.high << 31 | mask.low >>> 1);
		divisor = new haxe__$Int64__$_$_$Int64(divisor.high >>> 1,divisor.high << 31 | divisor.low >>> 1);
	}
	if(divSign) {
		var high = ~quotient.high;
		var low = ~quotient.low + 1 | 0;
		if(low == 0) {
			++high;
			high = high | 0;
		}
		quotient = new haxe__$Int64__$_$_$Int64(high,low);
	}
	if(dividend.high < 0) {
		var high = ~modulus.high;
		var low = ~modulus.low + 1 | 0;
		if(low == 0) {
			++high;
			high = high | 0;
		}
		modulus = new haxe__$Int64__$_$_$Int64(high,low);
	}
	return { quotient : quotient, modulus : modulus};
};
haxe_Int64.neg = function(x) {
	var high = ~x.high;
	var low = ~x.low + 1 | 0;
	if(low == 0) {
		++high;
		high = high | 0;
	}
	return new haxe__$Int64__$_$_$Int64(high,low);
};
haxe_Int64.preIncrement = function(this1) {
	var x = new haxe__$Int64__$_$_$Int64(this1.high,this1.low);
	this1 = x;
	x.low++;
	x.low = x.low | 0;
	if(x.low == 0) {
		x.high++;
		x.high = x.high | 0;
	}
	return x;
};
haxe_Int64.postIncrement = function(this1) {
	var ret = this1;
	var x = new haxe__$Int64__$_$_$Int64(this1.high,this1.low);
	this1 = x;
	x.low++;
	x.low = x.low | 0;
	if(x.low == 0) {
		x.high++;
		x.high = x.high | 0;
	}
	return ret;
};
haxe_Int64.preDecrement = function(this1) {
	var x = new haxe__$Int64__$_$_$Int64(this1.high,this1.low);
	this1 = x;
	if(x.low == 0) {
		x.high--;
		x.high = x.high | 0;
	}
	x.low--;
	x.low = x.low | 0;
	return x;
};
haxe_Int64.postDecrement = function(this1) {
	var ret = this1;
	var x = new haxe__$Int64__$_$_$Int64(this1.high,this1.low);
	this1 = x;
	if(x.low == 0) {
		x.high--;
		x.high = x.high | 0;
	}
	x.low--;
	x.low = x.low | 0;
	return ret;
};
haxe_Int64.add = function(a,b) {
	var high = a.high + b.high | 0;
	var low = a.low + b.low | 0;
	if(haxe_Int32.ucompare(low,a.low) < 0) {
		++high;
		high = high | 0;
	}
	return new haxe__$Int64__$_$_$Int64(high,low);
};
haxe_Int64.addInt = function(a,b) {
	var b_high = b >> 31;
	var b_low = b;
	var high = a.high + b_high | 0;
	var low = a.low + b_low | 0;
	if(haxe_Int32.ucompare(low,a.low) < 0) {
		++high;
		high = high | 0;
	}
	return new haxe__$Int64__$_$_$Int64(high,low);
};
haxe_Int64.sub = function(a,b) {
	var high = a.high - b.high | 0;
	var low = a.low - b.low | 0;
	if(haxe_Int32.ucompare(a.low,b.low) < 0) {
		--high;
		high = high | 0;
	}
	return new haxe__$Int64__$_$_$Int64(high,low);
};
haxe_Int64.subInt = function(a,b) {
	var b_high = b >> 31;
	var b_low = b;
	var high = a.high - b_high | 0;
	var low = a.low - b_low | 0;
	if(haxe_Int32.ucompare(a.low,b_low) < 0) {
		--high;
		high = high | 0;
	}
	return new haxe__$Int64__$_$_$Int64(high,low);
};
haxe_Int64.intSub = function(a,b) {
	var a_high = a >> 31;
	var a_low = a;
	var high = a_high - b.high | 0;
	var low = a_low - b.low | 0;
	if(haxe_Int32.ucompare(a_low,b.low) < 0) {
		--high;
		high = high | 0;
	}
	return new haxe__$Int64__$_$_$Int64(high,low);
};
haxe_Int64.mul = function(a,b) {
	var al = a.low & 65535;
	var ah = a.low >>> 16;
	var bl = b.low & 65535;
	var bh = b.low >>> 16;
	var p00 = haxe_Int32._mul(al,bl);
	var p10 = haxe_Int32._mul(ah,bl);
	var p01 = haxe_Int32._mul(al,bh);
	var p11 = haxe_Int32._mul(ah,bh);
	var low = p00;
	var high = (p11 + (p01 >>> 16) | 0) + (p10 >>> 16) | 0;
	p01 <<= 16;
	low = p00 + p01 | 0;
	if(haxe_Int32.ucompare(low,p01) < 0) {
		++high;
		high = high | 0;
	}
	p10 <<= 16;
	low = low + p10 | 0;
	if(haxe_Int32.ucompare(low,p10) < 0) {
		++high;
		high = high | 0;
	}
	high = high + (haxe_Int32._mul(a.low,b.high) + haxe_Int32._mul(a.high,b.low) | 0) | 0;
	return new haxe__$Int64__$_$_$Int64(high,low);
};
haxe_Int64.mulInt = function(a,b) {
	var b_high = b >> 31;
	var b_low = b;
	var al = a.low & 65535;
	var ah = a.low >>> 16;
	var bl = b_low & 65535;
	var bh = b_low >>> 16;
	var p00 = haxe_Int32._mul(al,bl);
	var p10 = haxe_Int32._mul(ah,bl);
	var p01 = haxe_Int32._mul(al,bh);
	var p11 = haxe_Int32._mul(ah,bh);
	var low = p00;
	var high = (p11 + (p01 >>> 16) | 0) + (p10 >>> 16) | 0;
	p01 <<= 16;
	low = p00 + p01 | 0;
	if(haxe_Int32.ucompare(low,p01) < 0) {
		++high;
		high = high | 0;
	}
	p10 <<= 16;
	low = low + p10 | 0;
	if(haxe_Int32.ucompare(low,p10) < 0) {
		++high;
		high = high | 0;
	}
	high = high + (haxe_Int32._mul(a.low,b_high) + haxe_Int32._mul(a.high,b_low) | 0) | 0;
	return new haxe__$Int64__$_$_$Int64(high,low);
};
haxe_Int64.div = function(a,b) {
	return haxe_Int64.divMod(a,b).quotient;
};
haxe_Int64.divInt = function(a,b) {
	return haxe_Int64.divMod(a,new haxe__$Int64__$_$_$Int64(b >> 31,b)).quotient;
};
haxe_Int64.intDiv = function(a,b) {
	var x = haxe_Int64.divMod(new haxe__$Int64__$_$_$Int64(a >> 31,a),b).quotient;
	if(x.high != x.low >> 31) {
		throw haxe_Exception.thrown("Overflow");
	}
	var x1 = x.low;
	return new haxe__$Int64__$_$_$Int64(x1 >> 31,x1);
};
haxe_Int64.mod = function(a,b) {
	return haxe_Int64.divMod(a,b).modulus;
};
haxe_Int64.modInt = function(a,b) {
	var x = haxe_Int64.divMod(a,new haxe__$Int64__$_$_$Int64(b >> 31,b)).modulus;
	if(x.high != x.low >> 31) {
		throw haxe_Exception.thrown("Overflow");
	}
	var x1 = x.low;
	return new haxe__$Int64__$_$_$Int64(x1 >> 31,x1);
};
haxe_Int64.intMod = function(a,b) {
	var x = haxe_Int64.divMod(new haxe__$Int64__$_$_$Int64(a >> 31,a),b).modulus;
	if(x.high != x.low >> 31) {
		throw haxe_Exception.thrown("Overflow");
	}
	var x1 = x.low;
	return new haxe__$Int64__$_$_$Int64(x1 >> 31,x1);
};
haxe_Int64.eq = function(a,b) {
	if(a.high == b.high) {
		return a.low == b.low;
	} else {
		return false;
	}
};
haxe_Int64.eqInt = function(a,b) {
	var b_high = b >> 31;
	var b_low = b;
	if(a.high == b_high) {
		return a.low == b_low;
	} else {
		return false;
	}
};
haxe_Int64.neq = function(a,b) {
	if(a.high == b.high) {
		return a.low != b.low;
	} else {
		return true;
	}
};
haxe_Int64.neqInt = function(a,b) {
	var b_high = b >> 31;
	var b_low = b;
	if(a.high == b_high) {
		return a.low != b_low;
	} else {
		return true;
	}
};
haxe_Int64.lt = function(a,b) {
	var v = a.high - b.high | 0;
	if(v == 0) {
		v = haxe_Int32.ucompare(a.low,b.low);
	}
	return (a.high < 0 ? b.high < 0 ? v : -1 : b.high >= 0 ? v : 1) < 0;
};
haxe_Int64.ltInt = function(a,b) {
	var b_high = b >> 31;
	var b_low = b;
	var v = a.high - b_high | 0;
	if(v == 0) {
		v = haxe_Int32.ucompare(a.low,b_low);
	}
	return (a.high < 0 ? b_high < 0 ? v : -1 : b_high >= 0 ? v : 1) < 0;
};
haxe_Int64.intLt = function(a,b) {
	var a_high = a >> 31;
	var a_low = a;
	var v = a_high - b.high | 0;
	if(v == 0) {
		v = haxe_Int32.ucompare(a_low,b.low);
	}
	return (a_high < 0 ? b.high < 0 ? v : -1 : b.high >= 0 ? v : 1) < 0;
};
haxe_Int64.lte = function(a,b) {
	var v = a.high - b.high | 0;
	if(v == 0) {
		v = haxe_Int32.ucompare(a.low,b.low);
	}
	return (a.high < 0 ? b.high < 0 ? v : -1 : b.high >= 0 ? v : 1) <= 0;
};
haxe_Int64.lteInt = function(a,b) {
	var b_high = b >> 31;
	var b_low = b;
	var v = a.high - b_high | 0;
	if(v == 0) {
		v = haxe_Int32.ucompare(a.low,b_low);
	}
	return (a.high < 0 ? b_high < 0 ? v : -1 : b_high >= 0 ? v : 1) <= 0;
};
haxe_Int64.intLte = function(a,b) {
	var a_high = a >> 31;
	var a_low = a;
	var v = a_high - b.high | 0;
	if(v == 0) {
		v = haxe_Int32.ucompare(a_low,b.low);
	}
	return (a_high < 0 ? b.high < 0 ? v : -1 : b.high >= 0 ? v : 1) <= 0;
};
haxe_Int64.gt = function(a,b) {
	var v = a.high - b.high | 0;
	if(v == 0) {
		v = haxe_Int32.ucompare(a.low,b.low);
	}
	return (a.high < 0 ? b.high < 0 ? v : -1 : b.high >= 0 ? v : 1) > 0;
};
haxe_Int64.gtInt = function(a,b) {
	var b_high = b >> 31;
	var b_low = b;
	var v = a.high - b_high | 0;
	if(v == 0) {
		v = haxe_Int32.ucompare(a.low,b_low);
	}
	return (a.high < 0 ? b_high < 0 ? v : -1 : b_high >= 0 ? v : 1) > 0;
};
haxe_Int64.intGt = function(a,b) {
	var a_high = a >> 31;
	var a_low = a;
	var v = a_high - b.high | 0;
	if(v == 0) {
		v = haxe_Int32.ucompare(a_low,b.low);
	}
	return (a_high < 0 ? b.high < 0 ? v : -1 : b.high >= 0 ? v : 1) > 0;
};
haxe_Int64.gte = function(a,b) {
	var v = a.high - b.high | 0;
	if(v == 0) {
		v = haxe_Int32.ucompare(a.low,b.low);
	}
	return (a.high < 0 ? b.high < 0 ? v : -1 : b.high >= 0 ? v : 1) >= 0;
};
haxe_Int64.gteInt = function(a,b) {
	var b_high = b >> 31;
	var b_low = b;
	var v = a.high - b_high | 0;
	if(v == 0) {
		v = haxe_Int32.ucompare(a.low,b_low);
	}
	return (a.high < 0 ? b_high < 0 ? v : -1 : b_high >= 0 ? v : 1) >= 0;
};
haxe_Int64.intGte = function(a,b) {
	var a_high = a >> 31;
	var a_low = a;
	var v = a_high - b.high | 0;
	if(v == 0) {
		v = haxe_Int32.ucompare(a_low,b.low);
	}
	return (a_high < 0 ? b.high < 0 ? v : -1 : b.high >= 0 ? v : 1) >= 0;
};
haxe_Int64.complement = function(a) {
	return new haxe__$Int64__$_$_$Int64(~a.high,~a.low);
};
haxe_Int64.and = function(a,b) {
	return new haxe__$Int64__$_$_$Int64(a.high & b.high,a.low & b.low);
};
haxe_Int64.or = function(a,b) {
	return new haxe__$Int64__$_$_$Int64(a.high | b.high,a.low | b.low);
};
haxe_Int64.xor = function(a,b) {
	return new haxe__$Int64__$_$_$Int64(a.high ^ b.high,a.low ^ b.low);
};
haxe_Int64.shl = function(a,b) {
	b &= 63;
	if(b == 0) {
		return new haxe__$Int64__$_$_$Int64(a.high,a.low);
	} else if(b < 32) {
		return new haxe__$Int64__$_$_$Int64(a.high << b | a.low >>> 32 - b,a.low << b);
	} else {
		return new haxe__$Int64__$_$_$Int64(a.low << b - 32,0);
	}
};
haxe_Int64.shr = function(a,b) {
	b &= 63;
	if(b == 0) {
		return new haxe__$Int64__$_$_$Int64(a.high,a.low);
	} else if(b < 32) {
		return new haxe__$Int64__$_$_$Int64(a.high >> b,a.high << 32 - b | a.low >>> b);
	} else {
		return new haxe__$Int64__$_$_$Int64(a.high >> 31,a.high >> b - 32);
	}
};
haxe_Int64.ushr = function(a,b) {
	b &= 63;
	if(b == 0) {
		return new haxe__$Int64__$_$_$Int64(a.high,a.low);
	} else if(b < 32) {
		return new haxe__$Int64__$_$_$Int64(a.high >>> b,a.high << 32 - b | a.low >>> b);
	} else {
		return new haxe__$Int64__$_$_$Int64(0,a.high >>> b - 32);
	}
};
haxe_Int64.get_high = function(this1) {
	return this1.high;
};
haxe_Int64.set_high = function(this1,x) {
	return this1.high = x;
};
haxe_Int64.get_low = function(this1) {
	return this1.low;
};
haxe_Int64.set_low = function(this1,x) {
	return this1.low = x;
};
var haxe__$Int64__$_$_$Int64 = function(high,low) {
	this.high = high;
	this.low = low;
};
$hxClasses["haxe._Int64.___Int64"] = haxe__$Int64__$_$_$Int64;
haxe__$Int64__$_$_$Int64.__name__ = "haxe._Int64.___Int64";
haxe__$Int64__$_$_$Int64.prototype = {
	high: null
	,low: null
	,toString: function() {
		return haxe_Int64.toString(this);
	}
	,__class__: haxe__$Int64__$_$_$Int64
};
var haxe_Int64Helper = function() { };
$hxClasses["haxe.Int64Helper"] = haxe_Int64Helper;
haxe_Int64Helper.__name__ = "haxe.Int64Helper";
haxe_Int64Helper.parseString = function(sParam) {
	var base_high = 0;
	var base_low = 10;
	var current = new haxe__$Int64__$_$_$Int64(0,0);
	var multiplier = new haxe__$Int64__$_$_$Int64(0,1);
	var sIsNegative = false;
	var s = StringTools.trim(sParam);
	if(s.charAt(0) == "-") {
		sIsNegative = true;
		s = s.substring(1,s.length);
	}
	var len = s.length;
	var _g = 0;
	while(_g < len) {
		var i = _g++;
		var digitInt = HxOverrides.cca(s,len - 1 - i) - 48;
		if(digitInt < 0 || digitInt > 9) {
			throw haxe_Exception.thrown("NumberFormatError");
		}
		if(digitInt != 0) {
			var digit_high = digitInt >> 31;
			var digit_low = digitInt;
			if(sIsNegative) {
				var al = multiplier.low & 65535;
				var ah = multiplier.low >>> 16;
				var bl = digit_low & 65535;
				var bh = digit_low >>> 16;
				var p00 = haxe_Int32._mul(al,bl);
				var p10 = haxe_Int32._mul(ah,bl);
				var p01 = haxe_Int32._mul(al,bh);
				var p11 = haxe_Int32._mul(ah,bh);
				var low = p00;
				var high = (p11 + (p01 >>> 16) | 0) + (p10 >>> 16) | 0;
				p01 <<= 16;
				low = p00 + p01 | 0;
				if(haxe_Int32.ucompare(low,p01) < 0) {
					++high;
					high = high | 0;
				}
				p10 <<= 16;
				low = low + p10 | 0;
				if(haxe_Int32.ucompare(low,p10) < 0) {
					++high;
					high = high | 0;
				}
				high = high + (haxe_Int32._mul(multiplier.low,digit_high) + haxe_Int32._mul(multiplier.high,digit_low) | 0) | 0;
				var b_high = high;
				var b_low = low;
				var high1 = current.high - b_high | 0;
				var low1 = current.low - b_low | 0;
				if(haxe_Int32.ucompare(current.low,b_low) < 0) {
					--high1;
					high1 = high1 | 0;
				}
				current = new haxe__$Int64__$_$_$Int64(high1,low1);
				if(!(current.high < 0)) {
					throw haxe_Exception.thrown("NumberFormatError: Underflow");
				}
			} else {
				var al1 = multiplier.low & 65535;
				var ah1 = multiplier.low >>> 16;
				var bl1 = digit_low & 65535;
				var bh1 = digit_low >>> 16;
				var p001 = haxe_Int32._mul(al1,bl1);
				var p101 = haxe_Int32._mul(ah1,bl1);
				var p011 = haxe_Int32._mul(al1,bh1);
				var p111 = haxe_Int32._mul(ah1,bh1);
				var low2 = p001;
				var high2 = (p111 + (p011 >>> 16) | 0) + (p101 >>> 16) | 0;
				p011 <<= 16;
				low2 = p001 + p011 | 0;
				if(haxe_Int32.ucompare(low2,p011) < 0) {
					++high2;
					high2 = high2 | 0;
				}
				p101 <<= 16;
				low2 = low2 + p101 | 0;
				if(haxe_Int32.ucompare(low2,p101) < 0) {
					++high2;
					high2 = high2 | 0;
				}
				high2 = high2 + (haxe_Int32._mul(multiplier.low,digit_high) + haxe_Int32._mul(multiplier.high,digit_low) | 0) | 0;
				var b_high1 = high2;
				var b_low1 = low2;
				var high3 = current.high + b_high1 | 0;
				var low3 = current.low + b_low1 | 0;
				if(haxe_Int32.ucompare(low3,current.low) < 0) {
					++high3;
					high3 = high3 | 0;
				}
				current = new haxe__$Int64__$_$_$Int64(high3,low3);
				if(current.high < 0) {
					throw haxe_Exception.thrown("NumberFormatError: Overflow");
				}
			}
		}
		var al2 = multiplier.low & 65535;
		var ah2 = multiplier.low >>> 16;
		var bl2 = base_low & 65535;
		var bh2 = base_low >>> 16;
		var p002 = haxe_Int32._mul(al2,bl2);
		var p102 = haxe_Int32._mul(ah2,bl2);
		var p012 = haxe_Int32._mul(al2,bh2);
		var p112 = haxe_Int32._mul(ah2,bh2);
		var low4 = p002;
		var high4 = (p112 + (p012 >>> 16) | 0) + (p102 >>> 16) | 0;
		p012 <<= 16;
		low4 = p002 + p012 | 0;
		if(haxe_Int32.ucompare(low4,p012) < 0) {
			++high4;
			high4 = high4 | 0;
		}
		p102 <<= 16;
		low4 = low4 + p102 | 0;
		if(haxe_Int32.ucompare(low4,p102) < 0) {
			++high4;
			high4 = high4 | 0;
		}
		high4 = high4 + (haxe_Int32._mul(multiplier.low,base_high) + haxe_Int32._mul(multiplier.high,base_low) | 0) | 0;
		multiplier = new haxe__$Int64__$_$_$Int64(high4,low4);
	}
	return current;
};
haxe_Int64Helper.fromFloat = function(f) {
	if(isNaN(f) || !isFinite(f)) {
		throw haxe_Exception.thrown("Number is NaN or Infinite");
	}
	var noFractions = f - f % 1;
	if(noFractions > 9007199254740991) {
		throw haxe_Exception.thrown("Conversion overflow");
	}
	if(noFractions < -9007199254740991) {
		throw haxe_Exception.thrown("Conversion underflow");
	}
	var result = new haxe__$Int64__$_$_$Int64(0,0);
	var neg = noFractions < 0;
	var rest = neg ? -noFractions : noFractions;
	var i = 0;
	while(rest >= 1) {
		var curr = rest % 2;
		rest /= 2;
		if(curr >= 1) {
			var a_high = 0;
			var a_low = 1;
			var b = i;
			b &= 63;
			var b1 = b == 0 ? new haxe__$Int64__$_$_$Int64(a_high,a_low) : b < 32 ? new haxe__$Int64__$_$_$Int64(a_high << b | a_low >>> 32 - b,a_low << b) : new haxe__$Int64__$_$_$Int64(a_low << b - 32,0);
			var high = result.high + b1.high | 0;
			var low = result.low + b1.low | 0;
			if(haxe_Int32.ucompare(low,result.low) < 0) {
				++high;
				high = high | 0;
			}
			result = new haxe__$Int64__$_$_$Int64(high,low);
		}
		++i;
	}
	if(neg) {
		var high = ~result.high;
		var low = ~result.low + 1 | 0;
		if(low == 0) {
			++high;
			high = high | 0;
		}
		result = new haxe__$Int64__$_$_$Int64(high,low);
	}
	return result;
};
var haxe_Log = function() { };
$hxClasses["haxe.Log"] = haxe_Log;
haxe_Log.__name__ = "haxe.Log";
haxe_Log.formatOutput = function(v,infos) {
	var str = Std.string(v);
	if(infos == null) {
		return str;
	}
	var pstr = infos.fileName + ":" + infos.lineNumber;
	if(infos.customParams != null) {
		var _g = 0;
		var _g1 = infos.customParams;
		while(_g < _g1.length) {
			var v = _g1[_g];
			++_g;
			str += ", " + Std.string(v);
		}
	}
	return pstr + ": " + str;
};
haxe_Log.trace = function(v,infos) {
	var str = haxe_Log.formatOutput(v,infos);
	if(typeof(console) != "undefined" && console.log != null) {
		console.log(str);
	}
};
var haxe_NativeStackTrace = function() { };
$hxClasses["haxe.NativeStackTrace"] = haxe_NativeStackTrace;
haxe_NativeStackTrace.__name__ = "haxe.NativeStackTrace";
haxe_NativeStackTrace.lastError = null;
haxe_NativeStackTrace.wrapCallSite = null;
haxe_NativeStackTrace.saveStack = function(e) {
	haxe_NativeStackTrace.lastError = e;
};
haxe_NativeStackTrace.callStack = function() {
	var e = new Error("");
	var stack = haxe_NativeStackTrace.tryHaxeStack(e);
	if(typeof(stack) == "undefined") {
		try {
			throw e;
		} catch( _g ) {
		}
		stack = e.stack;
	}
	return haxe_NativeStackTrace.normalize(stack,2);
};
haxe_NativeStackTrace.exceptionStack = function() {
	return haxe_NativeStackTrace.normalize(haxe_NativeStackTrace.tryHaxeStack(haxe_NativeStackTrace.lastError));
};
haxe_NativeStackTrace.toHaxe = function(s,skip) {
	if(skip == null) {
		skip = 0;
	}
	if(s == null) {
		return [];
	} else if(typeof(s) == "string") {
		var stack = s.split("\n");
		if(stack[0] == "Error") {
			stack.shift();
		}
		var m = [];
		var _g = 0;
		var _g1 = stack.length;
		while(_g < _g1) {
			var i = _g++;
			if(skip > i) {
				continue;
			}
			var line = stack[i];
			var matched = line.match(/^    at ([$A-Za-z0-9_. ]+) \(([^)]+):([0-9]+):([0-9]+)\)$/);
			if(matched != null) {
				var path = matched[1].split(".");
				if(path[0] == "$hxClasses") {
					path.shift();
				}
				var meth = path.pop();
				var file = matched[2];
				var line1 = Std.parseInt(matched[3]);
				var column = Std.parseInt(matched[4]);
				m.push(haxe_StackItem.FilePos(meth == "Anonymous function" ? haxe_StackItem.LocalFunction() : meth == "Global code" ? null : haxe_StackItem.Method(path.join("."),meth),file,line1,column));
			} else {
				m.push(haxe_StackItem.Module(StringTools.trim(line)));
			}
		}
		return m;
	} else if(skip > 0 && Array.isArray(s)) {
		return s.slice(skip);
	} else {
		return s;
	}
};
haxe_NativeStackTrace.tryHaxeStack = function(e) {
	if(e == null) {
		return [];
	}
	var oldValue = Error.prepareStackTrace;
	Error.prepareStackTrace = haxe_NativeStackTrace.prepareHxStackTrace;
	var stack = e.stack;
	Error.prepareStackTrace = oldValue;
	return stack;
};
haxe_NativeStackTrace.prepareHxStackTrace = function(e,callsites) {
	var stack = [];
	var _g = 0;
	while(_g < callsites.length) {
		var site = callsites[_g];
		++_g;
		if(haxe_NativeStackTrace.wrapCallSite != null) {
			site = haxe_NativeStackTrace.wrapCallSite(site);
		}
		var method = null;
		var fullName = site.getFunctionName();
		if(fullName != null) {
			var idx = fullName.lastIndexOf(".");
			if(idx >= 0) {
				var className = fullName.substring(0,idx);
				var methodName = fullName.substring(idx + 1);
				method = haxe_StackItem.Method(className,methodName);
			} else {
				method = haxe_StackItem.Method(null,fullName);
			}
		}
		var fileName = site.getFileName();
		var fileAddr = fileName == null ? -1 : fileName.indexOf("file:");
		if(haxe_NativeStackTrace.wrapCallSite != null && fileAddr > 0) {
			fileName = fileName.substring(fileAddr + 6);
		}
		stack.push(haxe_StackItem.FilePos(method,fileName,site.getLineNumber(),site.getColumnNumber()));
	}
	return stack;
};
haxe_NativeStackTrace.normalize = function(stack,skipItems) {
	if(skipItems == null) {
		skipItems = 0;
	}
	if(Array.isArray(stack) && skipItems > 0) {
		return stack.slice(skipItems);
	} else if(typeof(stack) == "string") {
		switch(stack.substring(0,6)) {
		case "Error\n":case "Error:":
			++skipItems;
			break;
		default:
		}
		return haxe_NativeStackTrace.skipLines(stack,skipItems);
	} else {
		return stack;
	}
};
haxe_NativeStackTrace.skipLines = function(stack,skip,pos) {
	if(pos == null) {
		pos = 0;
	}
	while(true) if(skip > 0) {
		pos = stack.indexOf("\n",pos);
		if(pos < 0) {
			return "";
		} else {
			skip = --skip;
			pos += 1;
			continue;
		}
	} else {
		return stack.substring(pos);
	}
};
var haxe_Rest = {};
haxe_Rest.__properties__ = {get_length:"get_length"};
haxe_Rest.get_length = function(this1) {
	return this1.length;
};
haxe_Rest.of = function(array) {
	return array;
};
haxe_Rest._new = function(array) {
	return array;
};
haxe_Rest.get = function(this1,index) {
	return this1[index];
};
haxe_Rest.toArray = function(this1) {
	return this1.slice();
};
haxe_Rest.iterator = function(this1) {
	return new haxe_iterators_RestIterator(this1);
};
haxe_Rest.keyValueIterator = function(this1) {
	return new haxe_iterators_RestKeyValueIterator(this1);
};
haxe_Rest.append = function(this1,item) {
	var result = this1.slice();
	result.push(item);
	return result;
};
haxe_Rest.prepend = function(this1,item) {
	var result = this1.slice();
	result.unshift(item);
	return result;
};
haxe_Rest.toString = function(this1) {
	return "[" + this1.toString() + "]";
};
var haxe_Timer = function(time_ms) {
	var me = this;
	this.id = setInterval(function() {
		me.run();
	},time_ms);
};
$hxClasses["haxe.Timer"] = haxe_Timer;
haxe_Timer.__name__ = "haxe.Timer";
haxe_Timer.delay = function(f,time_ms) {
	var t = new haxe_Timer(time_ms);
	t.run = function() {
		t.stop();
		f();
	};
	return t;
};
haxe_Timer.measure = function(f,pos) {
	var hrtime = process.hrtime();
	var t0 = hrtime[0] + hrtime[1] / 1e9;
	var r = f();
	var tmp = haxe_Log.trace;
	var hrtime = process.hrtime();
	tmp(hrtime[0] + hrtime[1] / 1e9 - t0 + "s",pos);
	return r;
};
haxe_Timer.stamp = function() {
	var hrtime = process.hrtime();
	return hrtime[0] + hrtime[1] / 1e9;
};
haxe_Timer.prototype = {
	id: null
	,stop: function() {
		if(this.id == null) {
			return;
		}
		clearInterval(this.id);
		this.id = null;
	}
	,run: function() {
	}
	,__class__: haxe_Timer
};
var haxe_ValueException = function(value,previous,native) {
	haxe_Exception.call(this,String(value),previous,native);
	this.value = value;
	this.__skipStack++;
};
$hxClasses["haxe.ValueException"] = haxe_ValueException;
haxe_ValueException.__name__ = "haxe.ValueException";
haxe_ValueException.__super__ = haxe_Exception;
haxe_ValueException.prototype = $extend(haxe_Exception.prototype,{
	value: null
	,unwrap: function() {
		return this.value;
	}
	,__class__: haxe_ValueException
});
var haxe_crypto_Sha1 = function() {
};
$hxClasses["haxe.crypto.Sha1"] = haxe_crypto_Sha1;
haxe_crypto_Sha1.__name__ = "haxe.crypto.Sha1";
haxe_crypto_Sha1.encode = function(s) {
	var sh = new haxe_crypto_Sha1();
	var h = sh.doEncode(haxe_crypto_Sha1.str2blks(s));
	return sh.hex(h);
};
haxe_crypto_Sha1.make = function(b) {
	var h = new haxe_crypto_Sha1().doEncode(haxe_crypto_Sha1.bytes2blks(b));
	var out = new haxe_io_Bytes(new ArrayBuffer(20));
	out.b[0] = h[0] >>> 24;
	out.b[1] = h[0] >> 16 & 255;
	out.b[2] = h[0] >> 8 & 255;
	out.b[3] = h[0] & 255;
	out.b[4] = h[1] >>> 24;
	out.b[5] = h[1] >> 16 & 255;
	out.b[6] = h[1] >> 8 & 255;
	out.b[7] = h[1] & 255;
	out.b[8] = h[2] >>> 24;
	out.b[9] = h[2] >> 16 & 255;
	out.b[10] = h[2] >> 8 & 255;
	out.b[11] = h[2] & 255;
	out.b[12] = h[3] >>> 24;
	out.b[13] = h[3] >> 16 & 255;
	out.b[14] = h[3] >> 8 & 255;
	out.b[15] = h[3] & 255;
	out.b[16] = h[4] >>> 24;
	out.b[17] = h[4] >> 16 & 255;
	out.b[18] = h[4] >> 8 & 255;
	out.b[19] = h[4] & 255;
	return out;
};
haxe_crypto_Sha1.str2blks = function(s) {
	var s1 = haxe_io_Bytes.ofString(s);
	var nblk = (s1.length + 8 >> 6) + 1;
	var blks = [];
	var _g = 0;
	var _g1 = nblk * 16;
	while(_g < _g1) {
		var i = _g++;
		blks[i] = 0;
	}
	var _g = 0;
	var _g1 = s1.length;
	while(_g < _g1) {
		var i = _g++;
		var p = i >> 2;
		blks[p] |= s1.b[i] << 24 - ((i & 3) << 3);
	}
	var i = s1.length;
	var p = i >> 2;
	blks[p] |= 128 << 24 - ((i & 3) << 3);
	blks[nblk * 16 - 1] = s1.length * 8;
	return blks;
};
haxe_crypto_Sha1.bytes2blks = function(b) {
	var nblk = (b.length + 8 >> 6) + 1;
	var blks = [];
	var _g = 0;
	var _g1 = nblk * 16;
	while(_g < _g1) {
		var i = _g++;
		blks[i] = 0;
	}
	var _g = 0;
	var _g1 = b.length;
	while(_g < _g1) {
		var i = _g++;
		var p = i >> 2;
		blks[p] |= b.b[i] << 24 - ((i & 3) << 3);
	}
	var i = b.length;
	var p = i >> 2;
	blks[p] |= 128 << 24 - ((i & 3) << 3);
	blks[nblk * 16 - 1] = b.length * 8;
	return blks;
};
haxe_crypto_Sha1.prototype = {
	doEncode: function(x) {
		var w = [];
		var a = 1732584193;
		var b = -271733879;
		var c = -1732584194;
		var d = 271733878;
		var e = -1009589776;
		var i = 0;
		while(i < x.length) {
			var olda = a;
			var oldb = b;
			var oldc = c;
			var oldd = d;
			var olde = e;
			var j = 0;
			while(j < 80) {
				if(j < 16) {
					w[j] = x[i + j];
				} else {
					var num = w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16];
					w[j] = num << 1 | num >>> 31;
				}
				var t = (a << 5 | a >>> 27) + this.ft(j,b,c,d) + e + w[j] + this.kt(j);
				e = d;
				d = c;
				c = b << 30 | b >>> 2;
				b = a;
				a = t;
				++j;
			}
			a += olda;
			b += oldb;
			c += oldc;
			d += oldd;
			e += olde;
			i += 16;
		}
		return [a,b,c,d,e];
	}
	,rol: function(num,cnt) {
		return num << cnt | num >>> 32 - cnt;
	}
	,ft: function(t,b,c,d) {
		if(t < 20) {
			return b & c | ~b & d;
		}
		if(t < 40) {
			return b ^ c ^ d;
		}
		if(t < 60) {
			return b & c | b & d | c & d;
		}
		return b ^ c ^ d;
	}
	,kt: function(t) {
		if(t < 20) {
			return 1518500249;
		}
		if(t < 40) {
			return 1859775393;
		}
		if(t < 60) {
			return -1894007588;
		}
		return -899497514;
	}
	,hex: function(a) {
		var str = "";
		var _g = 0;
		while(_g < a.length) {
			var num = a[_g];
			++_g;
			str += StringTools.hex(num,8);
		}
		return str.toLowerCase();
	}
	,__class__: haxe_crypto_Sha1
};
var haxe_ds_BalancedTree = function() {
};
$hxClasses["haxe.ds.BalancedTree"] = haxe_ds_BalancedTree;
haxe_ds_BalancedTree.__name__ = "haxe.ds.BalancedTree";
haxe_ds_BalancedTree.__interfaces__ = [haxe_IMap];
haxe_ds_BalancedTree.iteratorLoop = function(node,acc) {
	while(true) {
		if(node != null) {
			haxe_ds_BalancedTree.iteratorLoop(node.left,acc);
			acc.push(node.value);
			node = node.right;
			continue;
		}
		return;
	}
};
haxe_ds_BalancedTree.prototype = {
	root: null
	,set: function(key,value) {
		this.root = this.setLoop(key,value,this.root);
	}
	,get: function(key) {
		var node = this.root;
		while(node != null) {
			var c = this.compare(key,node.key);
			if(c == 0) {
				return node.value;
			}
			if(c < 0) {
				node = node.left;
			} else {
				node = node.right;
			}
		}
		return null;
	}
	,remove: function(key) {
		try {
			this.root = this.removeLoop(key,this.root);
			return true;
		} catch( _g ) {
			haxe_NativeStackTrace.lastError = _g;
			if(typeof(haxe_Exception.caught(_g).unwrap()) == "string") {
				return false;
			} else {
				throw _g;
			}
		}
	}
	,exists: function(key) {
		var node = this.root;
		while(node != null) {
			var c = this.compare(key,node.key);
			if(c == 0) {
				return true;
			} else if(c < 0) {
				node = node.left;
			} else {
				node = node.right;
			}
		}
		return false;
	}
	,iterator: function() {
		var ret = [];
		haxe_ds_BalancedTree.iteratorLoop(this.root,ret);
		return new haxe_iterators_ArrayIterator(ret);
	}
	,keyValueIterator: function() {
		return new haxe_iterators_MapKeyValueIterator(this);
	}
	,keys: function() {
		var ret = [];
		this.keysLoop(this.root,ret);
		return new haxe_iterators_ArrayIterator(ret);
	}
	,copy: function() {
		var copied = new haxe_ds_BalancedTree();
		copied.root = this.root;
		return copied;
	}
	,setLoop: function(k,v,node) {
		if(node == null) {
			return new haxe_ds_TreeNode(null,k,v,null);
		}
		var c = this.compare(k,node.key);
		if(c == 0) {
			return new haxe_ds_TreeNode(node.left,k,v,node.right,node == null ? 0 : node._height);
		} else if(c < 0) {
			var nl = this.setLoop(k,v,node.left);
			return this.balance(nl,node.key,node.value,node.right);
		} else {
			var nr = this.setLoop(k,v,node.right);
			return this.balance(node.left,node.key,node.value,nr);
		}
	}
	,removeLoop: function(k,node) {
		if(node == null) {
			throw haxe_Exception.thrown("Not_found");
		}
		var c = this.compare(k,node.key);
		if(c == 0) {
			return this.merge(node.left,node.right);
		} else if(c < 0) {
			return this.balance(this.removeLoop(k,node.left),node.key,node.value,node.right);
		} else {
			return this.balance(node.left,node.key,node.value,this.removeLoop(k,node.right));
		}
	}
	,keysLoop: function(node,acc) {
		if(node != null) {
			this.keysLoop(node.left,acc);
			acc.push(node.key);
			this.keysLoop(node.right,acc);
		}
	}
	,merge: function(t1,t2) {
		if(t1 == null) {
			return t2;
		}
		if(t2 == null) {
			return t1;
		}
		var t = this.minBinding(t2);
		return this.balance(t1,t.key,t.value,this.removeMinBinding(t2));
	}
	,minBinding: function(t) {
		if(t == null) {
			throw haxe_Exception.thrown("Not_found");
		} else if(t.left == null) {
			return t;
		} else {
			return this.minBinding(t.left);
		}
	}
	,removeMinBinding: function(t) {
		if(t.left == null) {
			return t.right;
		} else {
			return this.balance(this.removeMinBinding(t.left),t.key,t.value,t.right);
		}
	}
	,balance: function(l,k,v,r) {
		var hl = l == null ? 0 : l._height;
		var hr = r == null ? 0 : r._height;
		if(hl > hr + 2) {
			var _this = l.left;
			var _this1 = l.right;
			if((_this == null ? 0 : _this._height) >= (_this1 == null ? 0 : _this1._height)) {
				return new haxe_ds_TreeNode(l.left,l.key,l.value,new haxe_ds_TreeNode(l.right,k,v,r));
			} else {
				return new haxe_ds_TreeNode(new haxe_ds_TreeNode(l.left,l.key,l.value,l.right.left),l.right.key,l.right.value,new haxe_ds_TreeNode(l.right.right,k,v,r));
			}
		} else if(hr > hl + 2) {
			var _this = r.right;
			var _this1 = r.left;
			if((_this == null ? 0 : _this._height) > (_this1 == null ? 0 : _this1._height)) {
				return new haxe_ds_TreeNode(new haxe_ds_TreeNode(l,k,v,r.left),r.key,r.value,r.right);
			} else {
				return new haxe_ds_TreeNode(new haxe_ds_TreeNode(l,k,v,r.left.left),r.left.key,r.left.value,new haxe_ds_TreeNode(r.left.right,r.key,r.value,r.right));
			}
		} else {
			return new haxe_ds_TreeNode(l,k,v,r,(hl > hr ? hl : hr) + 1);
		}
	}
	,compare: function(k1,k2) {
		return Reflect.compare(k1,k2);
	}
	,toString: function() {
		if(this.root == null) {
			return "[]";
		} else {
			return "[" + this.root.toString() + "]";
		}
	}
	,clear: function() {
		this.root = null;
	}
	,__class__: haxe_ds_BalancedTree
};
var haxe_ds_TreeNode = function(l,k,v,r,h) {
	if(h == null) {
		h = -1;
	}
	this.left = l;
	this.key = k;
	this.value = v;
	this.right = r;
	if(h == -1) {
		var tmp;
		var _this = this.left;
		var _this1 = this.right;
		if((_this == null ? 0 : _this._height) > (_this1 == null ? 0 : _this1._height)) {
			var _this = this.left;
			tmp = _this == null ? 0 : _this._height;
		} else {
			var _this = this.right;
			tmp = _this == null ? 0 : _this._height;
		}
		this._height = tmp + 1;
	} else {
		this._height = h;
	}
};
$hxClasses["haxe.ds.TreeNode"] = haxe_ds_TreeNode;
haxe_ds_TreeNode.__name__ = "haxe.ds.TreeNode";
haxe_ds_TreeNode.prototype = {
	left: null
	,right: null
	,key: null
	,value: null
	,_height: null
	,toString: function() {
		return (this.left == null ? "" : Std.string(this.left.toString()) + ", ") + ("" + Std.string(this.key) + " => " + Std.string(this.value)) + (this.right == null ? "" : ", " + Std.string(this.right.toString()));
	}
	,__class__: haxe_ds_TreeNode
};
var haxe_ds_EnumValueMap = function() {
	haxe_ds_BalancedTree.call(this);
};
$hxClasses["haxe.ds.EnumValueMap"] = haxe_ds_EnumValueMap;
haxe_ds_EnumValueMap.__name__ = "haxe.ds.EnumValueMap";
haxe_ds_EnumValueMap.__interfaces__ = [haxe_IMap];
haxe_ds_EnumValueMap.__super__ = haxe_ds_BalancedTree;
haxe_ds_EnumValueMap.prototype = $extend(haxe_ds_BalancedTree.prototype,{
	compare: function(k1,k2) {
		var d = k1._hx_index - k2._hx_index;
		if(d != 0) {
			return d;
		}
		var p1 = Type.enumParameters(k1);
		var p2 = Type.enumParameters(k2);
		if(p1.length == 0 && p2.length == 0) {
			return 0;
		}
		return this.compareArgs(p1,p2);
	}
	,compareArgs: function(a1,a2) {
		var ld = a1.length - a2.length;
		if(ld != 0) {
			return ld;
		}
		var _g = 0;
		var _g1 = a1.length;
		while(_g < _g1) {
			var i = _g++;
			var d = this.compareArg(a1[i],a2[i]);
			if(d != 0) {
				return d;
			}
		}
		return 0;
	}
	,compareArg: function(v1,v2) {
		if(Reflect.isEnumValue(v1) && Reflect.isEnumValue(v2)) {
			return this.compare(v1,v2);
		} else if(((v1) instanceof Array) && ((v2) instanceof Array)) {
			return this.compareArgs(v1,v2);
		} else {
			return Reflect.compare(v1,v2);
		}
	}
	,copy: function() {
		var copied = new haxe_ds_EnumValueMap();
		copied.root = this.root;
		return copied;
	}
	,__class__: haxe_ds_EnumValueMap
});
var haxe_ds_IntMap = function() {
	this.h = { };
};
$hxClasses["haxe.ds.IntMap"] = haxe_ds_IntMap;
haxe_ds_IntMap.__name__ = "haxe.ds.IntMap";
haxe_ds_IntMap.__interfaces__ = [haxe_IMap];
haxe_ds_IntMap.prototype = {
	h: null
	,set: function(key,value) {
		this.h[key] = value;
	}
	,get: function(key) {
		return this.h[key];
	}
	,exists: function(key) {
		return this.h.hasOwnProperty(key);
	}
	,remove: function(key) {
		if(!this.h.hasOwnProperty(key)) {
			return false;
		}
		delete(this.h[key]);
		return true;
	}
	,keys: function() {
		var a = [];
		for( var key in this.h ) if(this.h.hasOwnProperty(key)) a.push(+key);
		return new haxe_iterators_ArrayIterator(a);
	}
	,iterator: function() {
		return { ref : this.h, it : this.keys(), hasNext : function() {
			return this.it.hasNext();
		}, next : function() {
			var i = this.it.next();
			return this.ref[i];
		}};
	}
	,keyValueIterator: function() {
		return new haxe_iterators_MapKeyValueIterator(this);
	}
	,copy: function() {
		var copied = new haxe_ds_IntMap();
		var key = this.keys();
		while(key.hasNext()) {
			var key1 = key.next();
			copied.h[key1] = this.h[key1];
		}
		return copied;
	}
	,toString: function() {
		var s_b = "";
		s_b = "[";
		var it = this.keys();
		while(it.hasNext()) {
			var i = it.next();
			s_b += i == null ? "null" : "" + i;
			s_b += " => ";
			s_b += Std.string(Std.string(this.h[i]));
			if(it.hasNext()) {
				s_b += ", ";
			}
		}
		s_b += "]";
		return s_b;
	}
	,clear: function() {
		this.h = { };
	}
	,__class__: haxe_ds_IntMap
};
var haxe_ds_List = function() {
	this.length = 0;
};
$hxClasses["haxe.ds.List"] = haxe_ds_List;
haxe_ds_List.__name__ = "haxe.ds.List";
haxe_ds_List.prototype = {
	h: null
	,q: null
	,length: null
	,add: function(item) {
		var x = new haxe_ds__$List_ListNode(item,null);
		if(this.h == null) {
			this.h = x;
		} else {
			this.q.next = x;
		}
		this.q = x;
		this.length++;
	}
	,push: function(item) {
		var x = new haxe_ds__$List_ListNode(item,this.h);
		this.h = x;
		if(this.q == null) {
			this.q = x;
		}
		this.length++;
	}
	,first: function() {
		if(this.h == null) {
			return null;
		} else {
			return this.h.item;
		}
	}
	,last: function() {
		if(this.q == null) {
			return null;
		} else {
			return this.q.item;
		}
	}
	,pop: function() {
		if(this.h == null) {
			return null;
		}
		var x = this.h.item;
		this.h = this.h.next;
		if(this.h == null) {
			this.q = null;
		}
		this.length--;
		return x;
	}
	,isEmpty: function() {
		return this.h == null;
	}
	,clear: function() {
		this.h = null;
		this.q = null;
		this.length = 0;
	}
	,remove: function(v) {
		var prev = null;
		var l = this.h;
		while(l != null) {
			if(l.item == v) {
				if(prev == null) {
					this.h = l.next;
				} else {
					prev.next = l.next;
				}
				if(this.q == l) {
					this.q = prev;
				}
				this.length--;
				return true;
			}
			prev = l;
			l = l.next;
		}
		return false;
	}
	,iterator: function() {
		return new haxe_ds__$List_ListIterator(this.h);
	}
	,keyValueIterator: function() {
		return new haxe_ds__$List_ListKeyValueIterator(this.h);
	}
	,toString: function() {
		var s_b = "";
		var first = true;
		var l = this.h;
		s_b = "{";
		while(l != null) {
			if(first) {
				first = false;
			} else {
				s_b += ", ";
			}
			s_b += Std.string(Std.string(l.item));
			l = l.next;
		}
		s_b += "}";
		return s_b;
	}
	,join: function(sep) {
		var s_b = "";
		var first = true;
		var l = this.h;
		while(l != null) {
			if(first) {
				first = false;
			} else {
				s_b += sep == null ? "null" : "" + sep;
			}
			s_b += Std.string(l.item);
			l = l.next;
		}
		return s_b;
	}
	,filter: function(f) {
		var l2 = new haxe_ds_List();
		var l = this.h;
		while(l != null) {
			var v = l.item;
			l = l.next;
			if(f(v)) {
				l2.add(v);
			}
		}
		return l2;
	}
	,map: function(f) {
		var b = new haxe_ds_List();
		var l = this.h;
		while(l != null) {
			var v = l.item;
			l = l.next;
			b.add(f(v));
		}
		return b;
	}
	,__class__: haxe_ds_List
};
var haxe_ds__$List_ListNode = function(item,next) {
	this.item = item;
	this.next = next;
};
$hxClasses["haxe.ds._List.ListNode"] = haxe_ds__$List_ListNode;
haxe_ds__$List_ListNode.__name__ = "haxe.ds._List.ListNode";
haxe_ds__$List_ListNode.prototype = {
	item: null
	,next: null
	,__class__: haxe_ds__$List_ListNode
};
var haxe_ds__$List_ListIterator = function(head) {
	this.head = head;
};
$hxClasses["haxe.ds._List.ListIterator"] = haxe_ds__$List_ListIterator;
haxe_ds__$List_ListIterator.__name__ = "haxe.ds._List.ListIterator";
haxe_ds__$List_ListIterator.prototype = {
	head: null
	,hasNext: function() {
		return this.head != null;
	}
	,next: function() {
		var val = this.head.item;
		this.head = this.head.next;
		return val;
	}
	,__class__: haxe_ds__$List_ListIterator
};
var haxe_ds__$List_ListKeyValueIterator = function(head) {
	this.head = head;
	this.idx = 0;
};
$hxClasses["haxe.ds._List.ListKeyValueIterator"] = haxe_ds__$List_ListKeyValueIterator;
haxe_ds__$List_ListKeyValueIterator.__name__ = "haxe.ds._List.ListKeyValueIterator";
haxe_ds__$List_ListKeyValueIterator.prototype = {
	idx: null
	,head: null
	,hasNext: function() {
		return this.head != null;
	}
	,next: function() {
		var val = this.head.item;
		this.head = this.head.next;
		return { value : val, key : this.idx++};
	}
	,__class__: haxe_ds__$List_ListKeyValueIterator
};
var haxe_ds_ObjectMap = function() {
	this.h = { __keys__ : { }};
};
$hxClasses["haxe.ds.ObjectMap"] = haxe_ds_ObjectMap;
haxe_ds_ObjectMap.__name__ = "haxe.ds.ObjectMap";
haxe_ds_ObjectMap.__interfaces__ = [haxe_IMap];
haxe_ds_ObjectMap.assignId = function(obj) {
	return (obj.__id__ = $global.$haxeUID++);
};
haxe_ds_ObjectMap.getId = function(obj) {
	return obj.__id__;
};
haxe_ds_ObjectMap.prototype = {
	h: null
	,set: function(key,value) {
		var id = key.__id__;
		if(id == null) {
			id = (key.__id__ = $global.$haxeUID++);
		}
		this.h[id] = value;
		this.h.__keys__[id] = key;
	}
	,get: function(key) {
		return this.h[key.__id__];
	}
	,exists: function(key) {
		return this.h.__keys__[key.__id__] != null;
	}
	,remove: function(key) {
		var id = key.__id__;
		if(this.h.__keys__[id] == null) {
			return false;
		}
		delete(this.h[id]);
		delete(this.h.__keys__[id]);
		return true;
	}
	,keys: function() {
		var a = [];
		for( var key in this.h.__keys__ ) {
		if(this.h.hasOwnProperty(key)) {
			a.push(this.h.__keys__[key]);
		}
		}
		return new haxe_iterators_ArrayIterator(a);
	}
	,iterator: function() {
		return { ref : this.h, it : this.keys(), hasNext : function() {
			return this.it.hasNext();
		}, next : function() {
			var i = this.it.next();
			return this.ref[i.__id__];
		}};
	}
	,keyValueIterator: function() {
		return new haxe_iterators_MapKeyValueIterator(this);
	}
	,copy: function() {
		var copied = new haxe_ds_ObjectMap();
		var key = this.keys();
		while(key.hasNext()) {
			var key1 = key.next();
			copied.set(key1,this.h[key1.__id__]);
		}
		return copied;
	}
	,toString: function() {
		var s_b = "";
		s_b = "[";
		var it = this.keys();
		while(it.hasNext()) {
			var i = it.next();
			s_b += Std.string(Std.string(i));
			s_b += " => ";
			s_b += Std.string(Std.string(this.h[i.__id__]));
			if(it.hasNext()) {
				s_b += ", ";
			}
		}
		s_b += "]";
		return s_b;
	}
	,clear: function() {
		this.h = { __keys__ : { }};
	}
	,__class__: haxe_ds_ObjectMap
};
var haxe_ds_ReadOnlyArray = {};
haxe_ds_ReadOnlyArray.__properties__ = {get_length:"get_length"};
haxe_ds_ReadOnlyArray.get_length = function(this1) {
	return this1.length;
};
haxe_ds_ReadOnlyArray.get = function(this1,i) {
	return this1[i];
};
haxe_ds_ReadOnlyArray.concat = function(this1,a) {
	return this1.concat(a);
};
var haxe_ds_StringMap = function() {
	this.h = Object.create(null);
};
$hxClasses["haxe.ds.StringMap"] = haxe_ds_StringMap;
haxe_ds_StringMap.__name__ = "haxe.ds.StringMap";
haxe_ds_StringMap.__interfaces__ = [haxe_IMap];
haxe_ds_StringMap.createCopy = function(h) {
	var copy = new haxe_ds_StringMap();
	for (var key in h) copy.h[key] = h[key];
	return copy;
};
haxe_ds_StringMap.stringify = function(h) {
	var s = "[";
	var first = true;
	for (var key in h) {
		if (first) first = false; else s += ',';
		s += key + ' => ' + Std.string(h[key]);
	}
	return s + "]";
};
haxe_ds_StringMap.prototype = {
	h: null
	,exists: function(key) {
		return Object.prototype.hasOwnProperty.call(this.h,key);
	}
	,get: function(key) {
		return this.h[key];
	}
	,set: function(key,value) {
		this.h[key] = value;
	}
	,remove: function(key) {
		if(Object.prototype.hasOwnProperty.call(this.h,key)) {
			delete(this.h[key]);
			return true;
		} else {
			return false;
		}
	}
	,keys: function() {
		return new haxe_ds__$StringMap_StringMapKeyIterator(this.h);
	}
	,iterator: function() {
		return new haxe_ds__$StringMap_StringMapValueIterator(this.h);
	}
	,keyValueIterator: function() {
		return new haxe_ds__$StringMap_StringMapKeyValueIterator(this.h);
	}
	,copy: function() {
		return haxe_ds_StringMap.createCopy(this.h);
	}
	,clear: function() {
		this.h = Object.create(null);
	}
	,toString: function() {
		return haxe_ds_StringMap.stringify(this.h);
	}
	,__class__: haxe_ds_StringMap
};
var haxe_ds__$StringMap_StringMapKeyIterator = function(h) {
	this.h = h;
	this.keys = Object.keys(h);
	this.length = this.keys.length;
	this.current = 0;
};
$hxClasses["haxe.ds._StringMap.StringMapKeyIterator"] = haxe_ds__$StringMap_StringMapKeyIterator;
haxe_ds__$StringMap_StringMapKeyIterator.__name__ = "haxe.ds._StringMap.StringMapKeyIterator";
haxe_ds__$StringMap_StringMapKeyIterator.prototype = {
	h: null
	,keys: null
	,length: null
	,current: null
	,hasNext: function() {
		return this.current < this.length;
	}
	,next: function() {
		return this.keys[this.current++];
	}
	,__class__: haxe_ds__$StringMap_StringMapKeyIterator
};
var haxe_ds__$StringMap_StringMapValueIterator = function(h) {
	this.h = h;
	this.keys = Object.keys(h);
	this.length = this.keys.length;
	this.current = 0;
};
$hxClasses["haxe.ds._StringMap.StringMapValueIterator"] = haxe_ds__$StringMap_StringMapValueIterator;
haxe_ds__$StringMap_StringMapValueIterator.__name__ = "haxe.ds._StringMap.StringMapValueIterator";
haxe_ds__$StringMap_StringMapValueIterator.prototype = {
	h: null
	,keys: null
	,length: null
	,current: null
	,hasNext: function() {
		return this.current < this.length;
	}
	,next: function() {
		return this.h[this.keys[this.current++]];
	}
	,__class__: haxe_ds__$StringMap_StringMapValueIterator
};
var haxe_ds__$StringMap_StringMapKeyValueIterator = function(h) {
	this.h = h;
	this.keys = Object.keys(h);
	this.length = this.keys.length;
	this.current = 0;
};
$hxClasses["haxe.ds._StringMap.StringMapKeyValueIterator"] = haxe_ds__$StringMap_StringMapKeyValueIterator;
haxe_ds__$StringMap_StringMapKeyValueIterator.__name__ = "haxe.ds._StringMap.StringMapKeyValueIterator";
haxe_ds__$StringMap_StringMapKeyValueIterator.prototype = {
	h: null
	,keys: null
	,length: null
	,current: null
	,hasNext: function() {
		return this.current < this.length;
	}
	,next: function() {
		var key = this.keys[this.current++];
		return { key : key, value : this.h[key]};
	}
	,__class__: haxe_ds__$StringMap_StringMapKeyValueIterator
};
var haxe_ds_Vector = {};
haxe_ds_Vector.__properties__ = {get_length:"get_length"};
haxe_ds_Vector.get = function(this1,index) {
	return this1[index];
};
haxe_ds_Vector.set = function(this1,index,val) {
	return this1[index] = val;
};
haxe_ds_Vector.get_length = function(this1) {
	return this1.length;
};
haxe_ds_Vector.fill = function(this1,value) {
	var _g = 0;
	var _g1 = this1.length;
	while(_g < _g1) {
		var i = _g++;
		this1[i] = value;
	}
};
haxe_ds_Vector.blit = function(src,srcPos,dest,destPos,len) {
	if(src == dest) {
		if(srcPos < destPos) {
			var i = srcPos + len;
			var j = destPos + len;
			var _g = 0;
			while(_g < len) {
				++_g;
				--i;
				--j;
				src[j] = src[i];
			}
		} else if(srcPos > destPos) {
			var i = srcPos;
			var j = destPos;
			var _g = 0;
			while(_g < len) {
				++_g;
				src[j] = src[i];
				++i;
				++j;
			}
		}
	} else {
		var _g = 0;
		while(_g < len) {
			var i = _g++;
			dest[destPos + i] = src[srcPos + i];
		}
	}
};
haxe_ds_Vector.toArray = function(this1) {
	return this1.slice(0);
};
haxe_ds_Vector.toData = function(this1) {
	return this1;
};
haxe_ds_Vector.fromData = function(data) {
	return data;
};
haxe_ds_Vector.fromArrayCopy = function(array) {
	return array.slice(0);
};
haxe_ds_Vector.sort = function(this1,f) {
	this1.sort(f);
};
var haxe_exceptions_PosException = function(message,previous,pos) {
	haxe_Exception.call(this,message,previous);
	if(pos == null) {
		this.posInfos = { fileName : "(unknown)", lineNumber : 0, className : "(unknown)", methodName : "(unknown)"};
	} else {
		this.posInfos = pos;
	}
	this.__skipStack++;
};
$hxClasses["haxe.exceptions.PosException"] = haxe_exceptions_PosException;
haxe_exceptions_PosException.__name__ = "haxe.exceptions.PosException";
haxe_exceptions_PosException.__super__ = haxe_Exception;
haxe_exceptions_PosException.prototype = $extend(haxe_Exception.prototype,{
	posInfos: null
	,toString: function() {
		return "" + haxe_Exception.prototype.toString.call(this) + " in " + this.posInfos.className + "." + this.posInfos.methodName + " at " + this.posInfos.fileName + ":" + this.posInfos.lineNumber;
	}
	,__class__: haxe_exceptions_PosException
});
var haxe_exceptions_NotImplementedException = function(message,previous,pos) {
	if(message == null) {
		message = "Not implemented";
	}
	haxe_exceptions_PosException.call(this,message,previous,pos);
	this.__skipStack++;
};
$hxClasses["haxe.exceptions.NotImplementedException"] = haxe_exceptions_NotImplementedException;
haxe_exceptions_NotImplementedException.__name__ = "haxe.exceptions.NotImplementedException";
haxe_exceptions_NotImplementedException.__super__ = haxe_exceptions_PosException;
haxe_exceptions_NotImplementedException.prototype = $extend(haxe_exceptions_PosException.prototype,{
	__class__: haxe_exceptions_NotImplementedException
});
var haxe_http_HttpBase = function(url) {
	this.url = url;
	this.headers = [];
	this.params = [];
	this.emptyOnData = $bind(this,this.onData);
};
$hxClasses["haxe.http.HttpBase"] = haxe_http_HttpBase;
haxe_http_HttpBase.__name__ = "haxe.http.HttpBase";
haxe_http_HttpBase.prototype = {
	url: null
	,responseBytes: null
	,responseAsString: null
	,postData: null
	,postBytes: null
	,headers: null
	,params: null
	,emptyOnData: null
	,setHeader: function(name,value) {
		var _g = 0;
		var _g1 = this.headers.length;
		while(_g < _g1) {
			var i = _g++;
			if(this.headers[i].name == name) {
				this.headers[i] = { name : name, value : value};
				return;
			}
		}
		this.headers.push({ name : name, value : value});
	}
	,addHeader: function(header,value) {
		this.headers.push({ name : header, value : value});
	}
	,setParameter: function(name,value) {
		var _g = 0;
		var _g1 = this.params.length;
		while(_g < _g1) {
			var i = _g++;
			if(this.params[i].name == name) {
				this.params[i] = { name : name, value : value};
				return;
			}
		}
		this.params.push({ name : name, value : value});
	}
	,addParameter: function(name,value) {
		this.params.push({ name : name, value : value});
	}
	,setPostData: function(data) {
		this.postData = data;
		this.postBytes = null;
	}
	,setPostBytes: function(data) {
		this.postBytes = data;
		this.postData = null;
	}
	,request: function(post) {
		throw new haxe_exceptions_NotImplementedException(null,null,{ fileName : "haxe/http/HttpBase.hx", lineNumber : 186, className : "haxe.http.HttpBase", methodName : "request"});
	}
	,onData: function(data) {
	}
	,onBytes: function(data) {
	}
	,onError: function(msg) {
	}
	,onStatus: function(status) {
	}
	,hasOnData: function() {
		return $bind(this,this.onData) != this.emptyOnData;
	}
	,success: function(data) {
		this.responseBytes = data;
		this.responseAsString = null;
		if(this.hasOnData()) {
			this.onData(this.get_responseData());
		}
		this.onBytes(this.responseBytes);
	}
	,get_responseData: function() {
		if(this.responseAsString == null && this.responseBytes != null) {
			this.responseAsString = this.responseBytes.getString(0,this.responseBytes.length,haxe_io_Encoding.UTF8);
		}
		return this.responseAsString;
	}
	,__class__: haxe_http_HttpBase
	,__properties__: {get_responseData:"get_responseData"}
};
var haxe_http_HttpNodeJs = function(url) {
	this._customRequestPost = null;
	this._customRequestMethod = null;
	haxe_http_HttpBase.call(this,url);
};
$hxClasses["haxe.http.HttpNodeJs"] = haxe_http_HttpNodeJs;
haxe_http_HttpNodeJs.__name__ = "haxe.http.HttpNodeJs";
haxe_http_HttpNodeJs.__super__ = haxe_http_HttpBase;
haxe_http_HttpNodeJs.prototype = $extend(haxe_http_HttpBase.prototype,{
	req: null
	,responseHeaders: null
	,cancel: function() {
		if(this.req == null) {
			return;
		}
		this.req.abort();
		this.req = null;
	}
	,request: function(post) {
		var _gthis = this;
		this.responseAsString = null;
		this.responseBytes = null;
		this.responseHeaders = null;
		var parsedUrl = new js_node_url_URL(this.url);
		var secure = parsedUrl.protocol == "https:";
		var host = parsedUrl.hostname;
		var path = parsedUrl.pathname;
		var queryParams = parsedUrl.search;
		if(queryParams != null && queryParams.length > 0) {
			if(!StringTools.startsWith(queryParams,"?")) {
				queryParams = "?" + queryParams;
			}
		}
		if(queryParams != null) {
			path += queryParams;
		}
		var port = parsedUrl.port != null ? Std.parseInt(parsedUrl.port) : secure ? 443 : 80;
		var h = { };
		var _g = 0;
		var _g1 = this.headers;
		while(_g < _g1.length) {
			var i = _g1[_g];
			++_g;
			h[i.name] = i.value;
		}
		if(this.postData != null || this.postBytes != null) {
			post = true;
		}
		var uri = null;
		var _g = 0;
		var _g1 = this.params;
		while(_g < _g1.length) {
			var p = _g1[_g];
			++_g;
			if(uri == null) {
				uri = "";
			} else {
				uri += "&";
			}
			var s = p.name;
			var uri1 = encodeURIComponent(s) + "=";
			var s1 = p.value;
			uri += uri1 + encodeURIComponent(s1);
		}
		var question = path.split("?").length <= 1;
		if(uri != null) {
			path += (question ? "?" : "&") + uri;
		}
		var method = post ? "POST" : "GET";
		if(this._customRequestMethod != null) {
			method = this._customRequestMethod;
		}
		if(this._customRequestPost != null) {
			post = this._customRequestPost;
		}
		var opts = { protocol : parsedUrl.protocol, hostname : host, port : port, method : method, path : path, headers : h};
		var httpResponse = function(res) {
			res.setEncoding("binary");
			var s = res.statusCode;
			if(s != null) {
				_gthis.onStatus(s);
			}
			var data = [];
			res.on("data",function(chunk) {
				data.push(js_node_buffer_Buffer.from(chunk,"binary"));
			});
			res.on("end",function(_) {
				if(res.headers != null) {
					_gthis.responseHeaders = new haxe_ds_StringMap();
					var _g = 0;
					var _g1 = Reflect.fields(res.headers);
					while(_g < _g1.length) {
						var f = _g1[_g];
						++_g;
						var v = Reflect.field(res.headers,f);
						_gthis.responseHeaders.h[f] = v;
					}
				}
				var buf = data.length == 1 ? data[0] : js_node_buffer_Buffer.concat(data);
				var httpResponse = buf.buffer.slice(buf.byteOffset,buf.byteOffset + buf.byteLength);
				_gthis.responseBytes = haxe_io_Bytes.ofData(httpResponse);
				_gthis.req = null;
				if(s != null && s >= 200 && s < 400) {
					_gthis.success(_gthis.responseBytes);
				} else {
					_gthis.onError("Http Error #" + s);
				}
			});
		};
		this.req = secure ? js_node_Https.request(opts,httpResponse) : js_node_Http.request(opts,httpResponse);
		if(post) {
			if(this.postData != null) {
				this.req.write(this.postData);
			} else if(this.postBytes != null) {
				this.req.setHeader("Content-Length","" + this.postBytes.length);
				this.req.write(js_node_buffer_Buffer.from(this.postBytes.b.bufferValue));
			}
		}
		this.req.end();
	}
	,_customRequestMethod: null
	,_customRequestPost: null
	,customRequest: function(post,method) {
		this._customRequestPost = post;
		this._customRequestMethod = method;
	}
	,__class__: haxe_http_HttpNodeJs
});
var haxe_io_ArrayBufferView = {};
haxe_io_ArrayBufferView.__properties__ = {get_byteLength:"get_byteLength",get_byteOffset:"get_byteOffset",get_buffer:"get_buffer"};
haxe_io_ArrayBufferView._new = function(size) {
	return new Uint8Array(size);
};
haxe_io_ArrayBufferView.get_byteOffset = function(this1) {
	return this1.byteOffset;
};
haxe_io_ArrayBufferView.get_byteLength = function(this1) {
	return this1.byteLength;
};
haxe_io_ArrayBufferView.get_buffer = function(this1) {
	return haxe_io_Bytes.ofData(this1.buffer);
};
haxe_io_ArrayBufferView.sub = function(this1,begin,length) {
	return new Uint8Array(this1.buffer,begin,length == null ? this1.buffer.byteLength - begin : length);
};
haxe_io_ArrayBufferView.getData = function(this1) {
	return this1;
};
haxe_io_ArrayBufferView.fromData = function(a) {
	return a;
};
var haxe_io_Bytes = function(data) {
	this.length = data.byteLength;
	this.b = new Uint8Array(data);
	this.b.bufferValue = data;
	data.hxBytes = this;
	data.bytes = this.b;
};
$hxClasses["haxe.io.Bytes"] = haxe_io_Bytes;
haxe_io_Bytes.__name__ = "haxe.io.Bytes";
haxe_io_Bytes.alloc = function(length) {
	return new haxe_io_Bytes(new ArrayBuffer(length));
};
haxe_io_Bytes.ofString = function(s,encoding) {
	if(encoding == haxe_io_Encoding.RawNative) {
		var buf = new Uint8Array(s.length << 1);
		var _g = 0;
		var _g1 = s.length;
		while(_g < _g1) {
			var i = _g++;
			var c = s.charCodeAt(i);
			buf[i << 1] = c & 255;
			buf[i << 1 | 1] = c >> 8;
		}
		return new haxe_io_Bytes(buf.buffer);
	}
	var a = [];
	var i = 0;
	while(i < s.length) {
		var c = s.charCodeAt(i++);
		if(55296 <= c && c <= 56319) {
			c = c - 55232 << 10 | s.charCodeAt(i++) & 1023;
		}
		if(c <= 127) {
			a.push(c);
		} else if(c <= 2047) {
			a.push(192 | c >> 6);
			a.push(128 | c & 63);
		} else if(c <= 65535) {
			a.push(224 | c >> 12);
			a.push(128 | c >> 6 & 63);
			a.push(128 | c & 63);
		} else {
			a.push(240 | c >> 18);
			a.push(128 | c >> 12 & 63);
			a.push(128 | c >> 6 & 63);
			a.push(128 | c & 63);
		}
	}
	return new haxe_io_Bytes(new Uint8Array(a).buffer);
};
haxe_io_Bytes.ofData = function(b) {
	var hb = b.hxBytes;
	if(hb != null) {
		return hb;
	}
	return new haxe_io_Bytes(b);
};
haxe_io_Bytes.ofHex = function(s) {
	if((s.length & 1) != 0) {
		throw haxe_Exception.thrown("Not a hex string (odd number of digits)");
	}
	var a = [];
	var i = 0;
	var len = s.length >> 1;
	while(i < len) {
		var high = s.charCodeAt(i * 2);
		var low = s.charCodeAt(i * 2 + 1);
		high = (high & 15) + ((high & 64) >> 6) * 9;
		low = (low & 15) + ((low & 64) >> 6) * 9;
		a.push((high << 4 | low) & 255);
		++i;
	}
	return new haxe_io_Bytes(new Uint8Array(a).buffer);
};
haxe_io_Bytes.fastGet = function(b,pos) {
	return b.bytes[pos];
};
haxe_io_Bytes.prototype = {
	length: null
	,b: null
	,data: null
	,get: function(pos) {
		return this.b[pos];
	}
	,set: function(pos,v) {
		this.b[pos] = v;
	}
	,blit: function(pos,src,srcpos,len) {
		if(pos < 0 || srcpos < 0 || len < 0 || pos + len > this.length || srcpos + len > src.length) {
			throw haxe_Exception.thrown(haxe_io_Error.OutsideBounds);
		}
		if(srcpos == 0 && len == src.b.byteLength) {
			this.b.set(src.b,pos);
		} else {
			this.b.set(src.b.subarray(srcpos,srcpos + len),pos);
		}
	}
	,fill: function(pos,len,value) {
		var _g = 0;
		while(_g < len) {
			++_g;
			this.b[pos++] = value;
		}
	}
	,sub: function(pos,len) {
		if(pos < 0 || len < 0 || pos + len > this.length) {
			throw haxe_Exception.thrown(haxe_io_Error.OutsideBounds);
		}
		return new haxe_io_Bytes(this.b.buffer.slice(pos + this.b.byteOffset,pos + this.b.byteOffset + len));
	}
	,compare: function(other) {
		var b1 = this.b;
		var b2 = other.b;
		var len = this.length < other.length ? this.length : other.length;
		var _g = 0;
		var _g1 = len;
		while(_g < _g1) {
			var i = _g++;
			if(b1[i] != b2[i]) {
				return b1[i] - b2[i];
			}
		}
		return this.length - other.length;
	}
	,initData: function() {
		if(this.data == null) {
			this.data = new DataView(this.b.buffer,this.b.byteOffset,this.b.byteLength);
		}
	}
	,getDouble: function(pos) {
		if(this.data == null) {
			this.data = new DataView(this.b.buffer,this.b.byteOffset,this.b.byteLength);
		}
		return this.data.getFloat64(pos,true);
	}
	,getFloat: function(pos) {
		if(this.data == null) {
			this.data = new DataView(this.b.buffer,this.b.byteOffset,this.b.byteLength);
		}
		return this.data.getFloat32(pos,true);
	}
	,setDouble: function(pos,v) {
		if(this.data == null) {
			this.data = new DataView(this.b.buffer,this.b.byteOffset,this.b.byteLength);
		}
		this.data.setFloat64(pos,v,true);
	}
	,setFloat: function(pos,v) {
		if(this.data == null) {
			this.data = new DataView(this.b.buffer,this.b.byteOffset,this.b.byteLength);
		}
		this.data.setFloat32(pos,v,true);
	}
	,getUInt16: function(pos) {
		if(this.data == null) {
			this.data = new DataView(this.b.buffer,this.b.byteOffset,this.b.byteLength);
		}
		return this.data.getUint16(pos,true);
	}
	,setUInt16: function(pos,v) {
		if(this.data == null) {
			this.data = new DataView(this.b.buffer,this.b.byteOffset,this.b.byteLength);
		}
		this.data.setUint16(pos,v,true);
	}
	,getInt32: function(pos) {
		if(this.data == null) {
			this.data = new DataView(this.b.buffer,this.b.byteOffset,this.b.byteLength);
		}
		return this.data.getInt32(pos,true);
	}
	,setInt32: function(pos,v) {
		if(this.data == null) {
			this.data = new DataView(this.b.buffer,this.b.byteOffset,this.b.byteLength);
		}
		this.data.setInt32(pos,v,true);
	}
	,getInt64: function(pos) {
		return new haxe__$Int64__$_$_$Int64(this.getInt32(pos + 4),this.getInt32(pos));
	}
	,setInt64: function(pos,v) {
		this.setInt32(pos,v.low);
		this.setInt32(pos + 4,v.high);
	}
	,getString: function(pos,len,encoding) {
		if(pos < 0 || len < 0 || pos + len > this.length) {
			throw haxe_Exception.thrown(haxe_io_Error.OutsideBounds);
		}
		if(encoding == null) {
			encoding = haxe_io_Encoding.UTF8;
		}
		var s = "";
		var b = this.b;
		var i = pos;
		var max = pos + len;
		switch(encoding._hx_index) {
		case 0:
			while(i < max) {
				var c = b[i++];
				if(c < 128) {
					if(c == 0) {
						break;
					}
					s += String.fromCodePoint(c);
				} else if(c < 224) {
					var code = (c & 63) << 6 | b[i++] & 127;
					s += String.fromCodePoint(code);
				} else if(c < 240) {
					var c2 = b[i++];
					var code1 = (c & 31) << 12 | (c2 & 127) << 6 | b[i++] & 127;
					s += String.fromCodePoint(code1);
				} else {
					var c21 = b[i++];
					var c3 = b[i++];
					var u = (c & 15) << 18 | (c21 & 127) << 12 | (c3 & 127) << 6 | b[i++] & 127;
					s += String.fromCodePoint(u);
				}
			}
			break;
		case 1:
			while(i < max) {
				var c = b[i++] | b[i++] << 8;
				s += String.fromCodePoint(c);
			}
			break;
		}
		return s;
	}
	,readString: function(pos,len) {
		return this.getString(pos,len);
	}
	,toString: function() {
		return this.getString(0,this.length);
	}
	,toHex: function() {
		var s_b = "";
		var chars = [];
		var str = "0123456789abcdef";
		var _g = 0;
		var _g1 = str.length;
		while(_g < _g1) {
			var i = _g++;
			chars.push(HxOverrides.cca(str,i));
		}
		var _g = 0;
		var _g1 = this.length;
		while(_g < _g1) {
			var i = _g++;
			var c = this.b[i];
			s_b += String.fromCodePoint(chars[c >> 4]);
			s_b += String.fromCodePoint(chars[c & 15]);
		}
		return s_b;
	}
	,getData: function() {
		return this.b.bufferValue;
	}
	,__class__: haxe_io_Bytes
};
var haxe_io_BytesBuffer = function() {
	this.pos = 0;
	this.size = 0;
};
$hxClasses["haxe.io.BytesBuffer"] = haxe_io_BytesBuffer;
haxe_io_BytesBuffer.__name__ = "haxe.io.BytesBuffer";
haxe_io_BytesBuffer.prototype = {
	buffer: null
	,view: null
	,u8: null
	,pos: null
	,size: null
	,get_length: function() {
		return this.pos;
	}
	,addByte: function(byte) {
		if(this.pos == this.size) {
			this.grow(1);
		}
		this.view.setUint8(this.pos++,byte);
	}
	,add: function(src) {
		if(this.pos + src.length > this.size) {
			this.grow(src.length);
		}
		if(this.size == 0) {
			return;
		}
		var sub = new Uint8Array(src.b.buffer,src.b.byteOffset,src.length);
		this.u8.set(sub,this.pos);
		this.pos += src.length;
	}
	,addString: function(v,encoding) {
		this.add(haxe_io_Bytes.ofString(v,encoding));
	}
	,addInt32: function(v) {
		if(this.pos + 4 > this.size) {
			this.grow(4);
		}
		this.view.setInt32(this.pos,v,true);
		this.pos += 4;
	}
	,addInt64: function(v) {
		if(this.pos + 8 > this.size) {
			this.grow(8);
		}
		this.view.setInt32(this.pos,v.low,true);
		this.view.setInt32(this.pos + 4,v.high,true);
		this.pos += 8;
	}
	,addFloat: function(v) {
		if(this.pos + 4 > this.size) {
			this.grow(4);
		}
		this.view.setFloat32(this.pos,v,true);
		this.pos += 4;
	}
	,addDouble: function(v) {
		if(this.pos + 8 > this.size) {
			this.grow(8);
		}
		this.view.setFloat64(this.pos,v,true);
		this.pos += 8;
	}
	,addBytes: function(src,pos,len) {
		if(pos < 0 || len < 0 || pos + len > src.length) {
			throw haxe_Exception.thrown(haxe_io_Error.OutsideBounds);
		}
		if(this.pos + len > this.size) {
			this.grow(len);
		}
		if(this.size == 0) {
			return;
		}
		var sub = new Uint8Array(src.b.buffer,src.b.byteOffset + pos,len);
		this.u8.set(sub,this.pos);
		this.pos += len;
	}
	,grow: function(delta) {
		var req = this.pos + delta;
		var nsize = this.size == 0 ? 16 : this.size;
		while(nsize < req) nsize = nsize * 3 >> 1;
		var nbuf = new ArrayBuffer(nsize);
		var nu8 = new Uint8Array(nbuf);
		if(this.size > 0) {
			nu8.set(this.u8);
		}
		this.size = nsize;
		this.buffer = nbuf;
		this.u8 = nu8;
		this.view = new DataView(this.buffer);
	}
	,getBytes: function() {
		if(this.size == 0) {
			return new haxe_io_Bytes(new ArrayBuffer(0));
		}
		var b = new haxe_io_Bytes(this.buffer);
		b.length = this.pos;
		return b;
	}
	,__class__: haxe_io_BytesBuffer
	,__properties__: {get_length:"get_length"}
};
var haxe_io_Encoding = $hxEnums["haxe.io.Encoding"] = { __ename__:"haxe.io.Encoding",__constructs__:null
	,UTF8: {_hx_name:"UTF8",_hx_index:0,__enum__:"haxe.io.Encoding",toString:$estr}
	,RawNative: {_hx_name:"RawNative",_hx_index:1,__enum__:"haxe.io.Encoding",toString:$estr}
};
haxe_io_Encoding.__constructs__ = [haxe_io_Encoding.UTF8,haxe_io_Encoding.RawNative];
haxe_io_Encoding.__empty_constructs__ = [haxe_io_Encoding.UTF8,haxe_io_Encoding.RawNative];
var haxe_io_Eof = function() {
};
$hxClasses["haxe.io.Eof"] = haxe_io_Eof;
haxe_io_Eof.__name__ = "haxe.io.Eof";
haxe_io_Eof.prototype = {
	toString: function() {
		return "Eof";
	}
	,__class__: haxe_io_Eof
};
var haxe_io_Error = $hxEnums["haxe.io.Error"] = { __ename__:"haxe.io.Error",__constructs__:null
	,Blocked: {_hx_name:"Blocked",_hx_index:0,__enum__:"haxe.io.Error",toString:$estr}
	,Overflow: {_hx_name:"Overflow",_hx_index:1,__enum__:"haxe.io.Error",toString:$estr}
	,OutsideBounds: {_hx_name:"OutsideBounds",_hx_index:2,__enum__:"haxe.io.Error",toString:$estr}
	,Custom: ($_=function(e) { return {_hx_index:3,e:e,__enum__:"haxe.io.Error",toString:$estr,__params__:function(){ return [this.e];}}; },$_._hx_name="Custom",$_)
};
haxe_io_Error.__constructs__ = [haxe_io_Error.Blocked,haxe_io_Error.Overflow,haxe_io_Error.OutsideBounds,haxe_io_Error.Custom];
haxe_io_Error.__empty_constructs__ = [haxe_io_Error.Blocked,haxe_io_Error.Overflow,haxe_io_Error.OutsideBounds];
var haxe_io_FPHelper = function() { };
$hxClasses["haxe.io.FPHelper"] = haxe_io_FPHelper;
haxe_io_FPHelper.__name__ = "haxe.io.FPHelper";
haxe_io_FPHelper._i32ToFloat = function(i) {
	var sign = 1 - (i >>> 31 << 1);
	var e = i >> 23 & 255;
	if(e == 255) {
		if((i & 8388607) == 0) {
			if(sign > 0) {
				return Infinity;
			} else {
				return -Infinity;
			}
		} else {
			return NaN;
		}
	}
	var m = e == 0 ? (i & 8388607) << 1 : i & 8388607 | 8388608;
	return sign * m * Math.pow(2,e - 150);
};
haxe_io_FPHelper._i64ToDouble = function(lo,hi) {
	var sign = 1 - (hi >>> 31 << 1);
	var e = hi >> 20 & 2047;
	if(e == 2047) {
		if(lo == 0 && (hi & 1048575) == 0) {
			if(sign > 0) {
				return Infinity;
			} else {
				return -Infinity;
			}
		} else {
			return NaN;
		}
	}
	var m = 2.220446049250313e-16 * ((hi & 1048575) * 4294967296. + (lo >>> 31) * 2147483648. + (lo & 2147483647));
	if(e == 0) {
		m *= 2.0;
	} else {
		m += 1.0;
	}
	return sign * m * Math.pow(2,e - 1023);
};
haxe_io_FPHelper._floatToI32 = function(f) {
	if(f == 0) {
		return 0;
	}
	var af = f < 0 ? -f : f;
	var exp = Math.floor(Math.log(af) / 0.6931471805599453);
	if(exp > 127) {
		return 2139095040;
	} else {
		if(exp <= -127) {
			exp = -127;
			af *= 7.1362384635298e+44;
		} else {
			af = (af / Math.pow(2,exp) - 1.0) * 8388608;
		}
		return (f < 0 ? -2147483648 : 0) | exp + 127 << 23 | Math.round(af);
	}
};
haxe_io_FPHelper._doubleToI64 = function(v) {
	var i64 = haxe_io_FPHelper.i64tmp;
	if(v == 0) {
		i64.low = 0;
		i64.high = 0;
	} else if(!isFinite(v)) {
		i64.low = 0;
		i64.high = v > 0 ? 2146435072 : -1048576;
	} else {
		var av = v < 0 ? -v : v;
		var exp = Math.floor(Math.log(av) / 0.6931471805599453);
		if(exp > 1023) {
			i64.low = -1;
			i64.high = 2146435071;
		} else {
			if(exp <= -1023) {
				exp = -1023;
				av /= 2.2250738585072014e-308;
			} else {
				av = av / Math.pow(2,exp) - 1.0;
			}
			var sig = Math.round(av * 4503599627370496.);
			var sig_l = sig | 0;
			var sig_h = sig / 4294967296.0 | 0;
			i64.low = sig_l;
			i64.high = (v < 0 ? -2147483648 : 0) | exp + 1023 << 20 | sig_h;
		}
	}
	return i64;
};
haxe_io_FPHelper.i32ToFloat = function(i) {
	haxe_io_FPHelper.helper.setInt32(0,i,true);
	return haxe_io_FPHelper.helper.getFloat32(0,true);
};
haxe_io_FPHelper.floatToI32 = function(f) {
	haxe_io_FPHelper.helper.setFloat32(0,f,true);
	return haxe_io_FPHelper.helper.getInt32(0,true);
};
haxe_io_FPHelper.i64ToDouble = function(low,high) {
	haxe_io_FPHelper.helper.setInt32(0,low,true);
	haxe_io_FPHelper.helper.setInt32(4,high,true);
	return haxe_io_FPHelper.helper.getFloat64(0,true);
};
haxe_io_FPHelper.doubleToI64 = function(v) {
	var i64 = haxe_io_FPHelper.i64tmp;
	haxe_io_FPHelper.helper.setFloat64(0,v,true);
	i64.low = haxe_io_FPHelper.helper.getInt32(0,true);
	i64.high = haxe_io_FPHelper.helper.getInt32(4,true);
	return i64;
};
var haxe_io_Path = function(path) {
	switch(path) {
	case ".":case "..":
		this.dir = path;
		this.file = "";
		return;
	}
	var c1 = path.lastIndexOf("/");
	var c2 = path.lastIndexOf("\\");
	if(c1 < c2) {
		this.dir = HxOverrides.substr(path,0,c2);
		path = HxOverrides.substr(path,c2 + 1,null);
		this.backslash = true;
	} else if(c2 < c1) {
		this.dir = HxOverrides.substr(path,0,c1);
		path = HxOverrides.substr(path,c1 + 1,null);
	} else {
		this.dir = null;
	}
	var cp = path.lastIndexOf(".");
	if(cp != -1) {
		this.ext = HxOverrides.substr(path,cp + 1,null);
		this.file = HxOverrides.substr(path,0,cp);
	} else {
		this.ext = null;
		this.file = path;
	}
};
$hxClasses["haxe.io.Path"] = haxe_io_Path;
haxe_io_Path.__name__ = "haxe.io.Path";
haxe_io_Path.withoutExtension = function(path) {
	var s = new haxe_io_Path(path);
	s.ext = null;
	return s.toString();
};
haxe_io_Path.withoutDirectory = function(path) {
	var s = new haxe_io_Path(path);
	s.dir = null;
	return s.toString();
};
haxe_io_Path.directory = function(path) {
	var s = new haxe_io_Path(path);
	if(s.dir == null) {
		return "";
	}
	return s.dir;
};
haxe_io_Path.extension = function(path) {
	var s = new haxe_io_Path(path);
	if(s.ext == null) {
		return "";
	}
	return s.ext;
};
haxe_io_Path.withExtension = function(path,ext) {
	var s = new haxe_io_Path(path);
	s.ext = ext;
	return s.toString();
};
haxe_io_Path.join = function(paths) {
	var _g = [];
	var _g1 = 0;
	while(_g1 < paths.length) {
		var v = paths[_g1];
		++_g1;
		if(v != null && v != "") {
			_g.push(v);
		}
	}
	if(_g.length == 0) {
		return "";
	}
	var path = _g[0];
	var _g1 = 1;
	var _g2 = _g.length;
	while(_g1 < _g2) {
		var i = _g1++;
		path = haxe_io_Path.addTrailingSlash(path);
		path += _g[i];
	}
	return haxe_io_Path.normalize(path);
};
haxe_io_Path.normalize = function(path) {
	var slash = "/";
	path = path.split("\\").join(slash);
	if(path == slash) {
		return slash;
	}
	var target = [];
	var _g = 0;
	var _g1 = path.split(slash);
	while(_g < _g1.length) {
		var token = _g1[_g];
		++_g;
		if(token == ".." && target.length > 0 && target[target.length - 1] != "..") {
			target.pop();
		} else if(token == "") {
			if(target.length > 0 || HxOverrides.cca(path,0) == 47) {
				target.push(token);
			}
		} else if(token != ".") {
			target.push(token);
		}
	}
	var tmp = target.join(slash);
	var acc_b = "";
	var colon = false;
	var slashes = false;
	var _g_offset = 0;
	var _g_s = tmp;
	while(_g_offset < _g_s.length) {
		var s = _g_s;
		var index = _g_offset++;
		var c = s.charCodeAt(index);
		if(c >= 55296 && c <= 56319) {
			c = c - 55232 << 10 | s.charCodeAt(index + 1) & 1023;
		}
		var c1 = c;
		if(c1 >= 65536) {
			++_g_offset;
		}
		var c2 = c1;
		switch(c2) {
		case 47:
			if(!colon) {
				slashes = true;
			} else {
				var i = c2;
				colon = false;
				if(slashes) {
					acc_b += "/";
					slashes = false;
				}
				acc_b += String.fromCodePoint(i);
			}
			break;
		case 58:
			acc_b += ":";
			colon = true;
			break;
		default:
			var i1 = c2;
			colon = false;
			if(slashes) {
				acc_b += "/";
				slashes = false;
			}
			acc_b += String.fromCodePoint(i1);
		}
	}
	return acc_b;
};
haxe_io_Path.addTrailingSlash = function(path) {
	if(path.length == 0) {
		return "/";
	}
	var c1 = path.lastIndexOf("/");
	var c2 = path.lastIndexOf("\\");
	if(c1 < c2) {
		if(c2 != path.length - 1) {
			return path + "\\";
		} else {
			return path;
		}
	} else if(c1 != path.length - 1) {
		return path + "/";
	} else {
		return path;
	}
};
haxe_io_Path.removeTrailingSlashes = function(path) {
	_hx_loop1: while(true) {
		var _g = HxOverrides.cca(path,path.length - 1);
		if(_g == null) {
			break;
		} else {
			switch(_g) {
			case 47:case 92:
				path = HxOverrides.substr(path,0,-1);
				break;
			default:
				break _hx_loop1;
			}
		}
	}
	return path;
};
haxe_io_Path.isAbsolute = function(path) {
	if(StringTools.startsWith(path,"/")) {
		return true;
	}
	if(path.charAt(1) == ":") {
		return true;
	}
	if(StringTools.startsWith(path,"\\\\")) {
		return true;
	}
	return false;
};
haxe_io_Path.unescape = function(path) {
	var regex = new EReg("-x([0-9][0-9])","g");
	return regex.map(path,function(regex) {
		var code = Std.parseInt(regex.matched(1));
		return String.fromCodePoint(code);
	});
};
haxe_io_Path.escape = function(path,allowSlashes) {
	if(allowSlashes == null) {
		allowSlashes = false;
	}
	var regex = allowSlashes ? new EReg("[^A-Za-z0-9_/\\\\\\.]","g") : new EReg("[^A-Za-z0-9_\\.]","g");
	return regex.map(path,function(v) {
		return "-x" + HxOverrides.cca(v.matched(0),0);
	});
};
haxe_io_Path.prototype = {
	dir: null
	,file: null
	,ext: null
	,backslash: null
	,toString: function() {
		return (this.dir == null ? "" : this.dir + (this.backslash ? "\\" : "/")) + this.file + (this.ext == null ? "" : "." + this.ext);
	}
	,__class__: haxe_io_Path
};
var haxe_io_UInt8Array = {};
haxe_io_UInt8Array.__properties__ = {get_view:"get_view",get_length:"get_length"};
haxe_io_UInt8Array._new = function(elements) {
	return new Uint8Array(elements);
};
haxe_io_UInt8Array.get_length = function(this1) {
	return this1.length;
};
haxe_io_UInt8Array.get_view = function(this1) {
	return this1;
};
haxe_io_UInt8Array.get = function(this1,index) {
	return this1[index];
};
haxe_io_UInt8Array.set = function(this1,index,value) {
	return this1[index] = value;
};
haxe_io_UInt8Array.sub = function(this1,begin,length) {
	return this1.subarray(begin,length == null ? this1.length : begin + length);
};
haxe_io_UInt8Array.subarray = function(this1,begin,end) {
	return this1.subarray(begin,end);
};
haxe_io_UInt8Array.getData = function(this1) {
	return this1;
};
haxe_io_UInt8Array.fromData = function(d) {
	return d;
};
haxe_io_UInt8Array.fromArray = function(a,pos,length) {
	if(pos == null) {
		pos = 0;
	}
	if(length == null) {
		length = a.length - pos;
	}
	if(pos < 0 || length < 0 || pos + length > a.length) {
		throw haxe_Exception.thrown(haxe_io_Error.OutsideBounds);
	}
	if(pos == 0 && length == a.length) {
		return new Uint8Array(a);
	}
	var i = new Uint8Array(a.length);
	var _g = 0;
	var _g1 = length;
	while(_g < _g1) {
		var idx = _g++;
		i[idx] = a[idx + pos];
	}
	return i;
};
haxe_io_UInt8Array.fromBytes = function(bytes,bytePos,length) {
	if(bytePos == null) {
		bytePos = 0;
	}
	if(length == null) {
		length = bytes.length - bytePos;
	}
	return new Uint8Array(bytes.b.bufferValue,bytePos,length);
};
var haxe_iterators_ArrayIterator = function(array) {
	this.current = 0;
	this.array = array;
};
$hxClasses["haxe.iterators.ArrayIterator"] = haxe_iterators_ArrayIterator;
haxe_iterators_ArrayIterator.__name__ = "haxe.iterators.ArrayIterator";
haxe_iterators_ArrayIterator.prototype = {
	array: null
	,current: null
	,hasNext: function() {
		return this.current < this.array.length;
	}
	,next: function() {
		return this.array[this.current++];
	}
	,__class__: haxe_iterators_ArrayIterator
};
var haxe_iterators_ArrayKeyValueIterator = function(array) {
	this.current = 0;
	this.array = array;
};
$hxClasses["haxe.iterators.ArrayKeyValueIterator"] = haxe_iterators_ArrayKeyValueIterator;
haxe_iterators_ArrayKeyValueIterator.__name__ = "haxe.iterators.ArrayKeyValueIterator";
haxe_iterators_ArrayKeyValueIterator.prototype = {
	current: null
	,array: null
	,hasNext: function() {
		return this.current < this.array.length;
	}
	,next: function() {
		return { value : this.array[this.current], key : this.current++};
	}
	,__class__: haxe_iterators_ArrayKeyValueIterator
};
var haxe_iterators_DynamicAccessIterator = function(access) {
	this.access = access;
	this.keys = Reflect.fields(access);
	this.index = 0;
};
$hxClasses["haxe.iterators.DynamicAccessIterator"] = haxe_iterators_DynamicAccessIterator;
haxe_iterators_DynamicAccessIterator.__name__ = "haxe.iterators.DynamicAccessIterator";
haxe_iterators_DynamicAccessIterator.prototype = {
	access: null
	,keys: null
	,index: null
	,hasNext: function() {
		return this.index < this.keys.length;
	}
	,next: function() {
		return this.access[this.keys[this.index++]];
	}
	,__class__: haxe_iterators_DynamicAccessIterator
};
var haxe_iterators_DynamicAccessKeyValueIterator = function(access) {
	this.access = access;
	this.keys = Reflect.fields(access);
	this.index = 0;
};
$hxClasses["haxe.iterators.DynamicAccessKeyValueIterator"] = haxe_iterators_DynamicAccessKeyValueIterator;
haxe_iterators_DynamicAccessKeyValueIterator.__name__ = "haxe.iterators.DynamicAccessKeyValueIterator";
haxe_iterators_DynamicAccessKeyValueIterator.prototype = {
	access: null
	,keys: null
	,index: null
	,hasNext: function() {
		return this.index < this.keys.length;
	}
	,next: function() {
		var key = this.keys[this.index++];
		return { value : this.access[key], key : key};
	}
	,__class__: haxe_iterators_DynamicAccessKeyValueIterator
};
var haxe_iterators_MapKeyValueIterator = function(map) {
	this.map = map;
	this.keys = map.keys();
};
$hxClasses["haxe.iterators.MapKeyValueIterator"] = haxe_iterators_MapKeyValueIterator;
haxe_iterators_MapKeyValueIterator.__name__ = "haxe.iterators.MapKeyValueIterator";
haxe_iterators_MapKeyValueIterator.prototype = {
	map: null
	,keys: null
	,hasNext: function() {
		return this.keys.hasNext();
	}
	,next: function() {
		var key = this.keys.next();
		return { value : this.map.get(key), key : key};
	}
	,__class__: haxe_iterators_MapKeyValueIterator
};
var haxe_iterators_RestIterator = function(args) {
	this.current = 0;
	this.args = args;
};
$hxClasses["haxe.iterators.RestIterator"] = haxe_iterators_RestIterator;
haxe_iterators_RestIterator.__name__ = "haxe.iterators.RestIterator";
haxe_iterators_RestIterator.prototype = {
	args: null
	,current: null
	,hasNext: function() {
		return this.current < this.args.length;
	}
	,next: function() {
		return this.args[this.current++];
	}
	,__class__: haxe_iterators_RestIterator
};
var haxe_iterators_RestKeyValueIterator = function(args) {
	this.current = 0;
	this.args = args;
};
$hxClasses["haxe.iterators.RestKeyValueIterator"] = haxe_iterators_RestKeyValueIterator;
haxe_iterators_RestKeyValueIterator.__name__ = "haxe.iterators.RestKeyValueIterator";
haxe_iterators_RestKeyValueIterator.prototype = {
	args: null
	,current: null
	,hasNext: function() {
		return this.current < this.args.length;
	}
	,next: function() {
		return { key : this.current, value : this.args[this.current++]};
	}
	,__class__: haxe_iterators_RestKeyValueIterator
};
var haxe_iterators_StringIterator = function(s) {
	this.offset = 0;
	this.s = s;
};
$hxClasses["haxe.iterators.StringIterator"] = haxe_iterators_StringIterator;
haxe_iterators_StringIterator.__name__ = "haxe.iterators.StringIterator";
haxe_iterators_StringIterator.prototype = {
	offset: null
	,s: null
	,hasNext: function() {
		return this.offset < this.s.length;
	}
	,next: function() {
		return this.s.charCodeAt(this.offset++);
	}
	,__class__: haxe_iterators_StringIterator
};
var haxe_iterators_StringIteratorUnicode = function(s) {
	this.offset = 0;
	this.s = s;
};
$hxClasses["haxe.iterators.StringIteratorUnicode"] = haxe_iterators_StringIteratorUnicode;
haxe_iterators_StringIteratorUnicode.__name__ = "haxe.iterators.StringIteratorUnicode";
haxe_iterators_StringIteratorUnicode.unicodeIterator = function(s) {
	return new haxe_iterators_StringIteratorUnicode(s);
};
haxe_iterators_StringIteratorUnicode.prototype = {
	offset: null
	,s: null
	,hasNext: function() {
		return this.offset < this.s.length;
	}
	,next: function() {
		var s = this.s;
		var index = this.offset++;
		var c = s.charCodeAt(index);
		if(c >= 55296 && c <= 56319) {
			c = c - 55232 << 10 | s.charCodeAt(index + 1) & 1023;
		}
		var c1 = c;
		if(c1 >= 65536) {
			this.offset++;
		}
		return c1;
	}
	,__class__: haxe_iterators_StringIteratorUnicode
};
var haxe_iterators_StringKeyValueIterator = function(s) {
	this.offset = 0;
	this.s = s;
};
$hxClasses["haxe.iterators.StringKeyValueIterator"] = haxe_iterators_StringKeyValueIterator;
haxe_iterators_StringKeyValueIterator.__name__ = "haxe.iterators.StringKeyValueIterator";
haxe_iterators_StringKeyValueIterator.prototype = {
	offset: null
	,s: null
	,hasNext: function() {
		return this.offset < this.s.length;
	}
	,next: function() {
		return { key : this.offset, value : this.s.charCodeAt(this.offset++)};
	}
	,__class__: haxe_iterators_StringKeyValueIterator
};
var haxe_macro_Message = $hxEnums["haxe.macro.Message"] = { __ename__:"haxe.macro.Message",__constructs__:null
	,Info: ($_=function(msg,pos) { return {_hx_index:0,msg:msg,pos:pos,__enum__:"haxe.macro.Message",toString:$estr,__params__:function(){ return [this.msg,this.pos];}}; },$_._hx_name="Info",$_)
	,Warning: ($_=function(msg,pos) { return {_hx_index:1,msg:msg,pos:pos,__enum__:"haxe.macro.Message",toString:$estr,__params__:function(){ return [this.msg,this.pos];}}; },$_._hx_name="Warning",$_)
};
haxe_macro_Message.__constructs__ = [haxe_macro_Message.Info,haxe_macro_Message.Warning];
haxe_macro_Message.__empty_constructs__ = [];
var haxe_macro_Context = function() { };
$hxClasses["haxe.macro.Context"] = haxe_macro_Context;
haxe_macro_Context.__name__ = "haxe.macro.Context";
var haxe_macro_StringLiteralKind = $hxEnums["haxe.macro.StringLiteralKind"] = { __ename__:"haxe.macro.StringLiteralKind",__constructs__:null
	,DoubleQuotes: {_hx_name:"DoubleQuotes",_hx_index:0,__enum__:"haxe.macro.StringLiteralKind",toString:$estr}
	,SingleQuotes: {_hx_name:"SingleQuotes",_hx_index:1,__enum__:"haxe.macro.StringLiteralKind",toString:$estr}
};
haxe_macro_StringLiteralKind.__constructs__ = [haxe_macro_StringLiteralKind.DoubleQuotes,haxe_macro_StringLiteralKind.SingleQuotes];
haxe_macro_StringLiteralKind.__empty_constructs__ = [haxe_macro_StringLiteralKind.DoubleQuotes,haxe_macro_StringLiteralKind.SingleQuotes];
var haxe_macro_Constant = $hxEnums["haxe.macro.Constant"] = { __ename__:"haxe.macro.Constant",__constructs__:null
	,CInt: ($_=function(v,s) { return {_hx_index:0,v:v,s:s,__enum__:"haxe.macro.Constant",toString:$estr,__params__:function(){ return [this.v,this.s];}}; },$_._hx_name="CInt",$_)
	,CFloat: ($_=function(f,s) { return {_hx_index:1,f:f,s:s,__enum__:"haxe.macro.Constant",toString:$estr,__params__:function(){ return [this.f,this.s];}}; },$_._hx_name="CFloat",$_)
	,CString: ($_=function(s,kind) { return {_hx_index:2,s:s,kind:kind,__enum__:"haxe.macro.Constant",toString:$estr,__params__:function(){ return [this.s,this.kind];}}; },$_._hx_name="CString",$_)
	,CIdent: ($_=function(s) { return {_hx_index:3,s:s,__enum__:"haxe.macro.Constant",toString:$estr,__params__:function(){ return [this.s];}}; },$_._hx_name="CIdent",$_)
	,CRegexp: ($_=function(r,opt) { return {_hx_index:4,r:r,opt:opt,__enum__:"haxe.macro.Constant",toString:$estr,__params__:function(){ return [this.r,this.opt];}}; },$_._hx_name="CRegexp",$_)
};
haxe_macro_Constant.__constructs__ = [haxe_macro_Constant.CInt,haxe_macro_Constant.CFloat,haxe_macro_Constant.CString,haxe_macro_Constant.CIdent,haxe_macro_Constant.CRegexp];
haxe_macro_Constant.__empty_constructs__ = [];
var haxe_macro_Binop = $hxEnums["haxe.macro.Binop"] = { __ename__:"haxe.macro.Binop",__constructs__:null
	,OpAdd: {_hx_name:"OpAdd",_hx_index:0,__enum__:"haxe.macro.Binop",toString:$estr}
	,OpMult: {_hx_name:"OpMult",_hx_index:1,__enum__:"haxe.macro.Binop",toString:$estr}
	,OpDiv: {_hx_name:"OpDiv",_hx_index:2,__enum__:"haxe.macro.Binop",toString:$estr}
	,OpSub: {_hx_name:"OpSub",_hx_index:3,__enum__:"haxe.macro.Binop",toString:$estr}
	,OpAssign: {_hx_name:"OpAssign",_hx_index:4,__enum__:"haxe.macro.Binop",toString:$estr}
	,OpEq: {_hx_name:"OpEq",_hx_index:5,__enum__:"haxe.macro.Binop",toString:$estr}
	,OpNotEq: {_hx_name:"OpNotEq",_hx_index:6,__enum__:"haxe.macro.Binop",toString:$estr}
	,OpGt: {_hx_name:"OpGt",_hx_index:7,__enum__:"haxe.macro.Binop",toString:$estr}
	,OpGte: {_hx_name:"OpGte",_hx_index:8,__enum__:"haxe.macro.Binop",toString:$estr}
	,OpLt: {_hx_name:"OpLt",_hx_index:9,__enum__:"haxe.macro.Binop",toString:$estr}
	,OpLte: {_hx_name:"OpLte",_hx_index:10,__enum__:"haxe.macro.Binop",toString:$estr}
	,OpAnd: {_hx_name:"OpAnd",_hx_index:11,__enum__:"haxe.macro.Binop",toString:$estr}
	,OpOr: {_hx_name:"OpOr",_hx_index:12,__enum__:"haxe.macro.Binop",toString:$estr}
	,OpXor: {_hx_name:"OpXor",_hx_index:13,__enum__:"haxe.macro.Binop",toString:$estr}
	,OpBoolAnd: {_hx_name:"OpBoolAnd",_hx_index:14,__enum__:"haxe.macro.Binop",toString:$estr}
	,OpBoolOr: {_hx_name:"OpBoolOr",_hx_index:15,__enum__:"haxe.macro.Binop",toString:$estr}
	,OpShl: {_hx_name:"OpShl",_hx_index:16,__enum__:"haxe.macro.Binop",toString:$estr}
	,OpShr: {_hx_name:"OpShr",_hx_index:17,__enum__:"haxe.macro.Binop",toString:$estr}
	,OpUShr: {_hx_name:"OpUShr",_hx_index:18,__enum__:"haxe.macro.Binop",toString:$estr}
	,OpMod: {_hx_name:"OpMod",_hx_index:19,__enum__:"haxe.macro.Binop",toString:$estr}
	,OpAssignOp: ($_=function(op) { return {_hx_index:20,op:op,__enum__:"haxe.macro.Binop",toString:$estr,__params__:function(){ return [this.op];}}; },$_._hx_name="OpAssignOp",$_)
	,OpInterval: {_hx_name:"OpInterval",_hx_index:21,__enum__:"haxe.macro.Binop",toString:$estr}
	,OpArrow: {_hx_name:"OpArrow",_hx_index:22,__enum__:"haxe.macro.Binop",toString:$estr}
	,OpIn: {_hx_name:"OpIn",_hx_index:23,__enum__:"haxe.macro.Binop",toString:$estr}
	,OpNullCoal: {_hx_name:"OpNullCoal",_hx_index:24,__enum__:"haxe.macro.Binop",toString:$estr}
};
haxe_macro_Binop.__constructs__ = [haxe_macro_Binop.OpAdd,haxe_macro_Binop.OpMult,haxe_macro_Binop.OpDiv,haxe_macro_Binop.OpSub,haxe_macro_Binop.OpAssign,haxe_macro_Binop.OpEq,haxe_macro_Binop.OpNotEq,haxe_macro_Binop.OpGt,haxe_macro_Binop.OpGte,haxe_macro_Binop.OpLt,haxe_macro_Binop.OpLte,haxe_macro_Binop.OpAnd,haxe_macro_Binop.OpOr,haxe_macro_Binop.OpXor,haxe_macro_Binop.OpBoolAnd,haxe_macro_Binop.OpBoolOr,haxe_macro_Binop.OpShl,haxe_macro_Binop.OpShr,haxe_macro_Binop.OpUShr,haxe_macro_Binop.OpMod,haxe_macro_Binop.OpAssignOp,haxe_macro_Binop.OpInterval,haxe_macro_Binop.OpArrow,haxe_macro_Binop.OpIn,haxe_macro_Binop.OpNullCoal];
haxe_macro_Binop.__empty_constructs__ = [haxe_macro_Binop.OpAdd,haxe_macro_Binop.OpMult,haxe_macro_Binop.OpDiv,haxe_macro_Binop.OpSub,haxe_macro_Binop.OpAssign,haxe_macro_Binop.OpEq,haxe_macro_Binop.OpNotEq,haxe_macro_Binop.OpGt,haxe_macro_Binop.OpGte,haxe_macro_Binop.OpLt,haxe_macro_Binop.OpLte,haxe_macro_Binop.OpAnd,haxe_macro_Binop.OpOr,haxe_macro_Binop.OpXor,haxe_macro_Binop.OpBoolAnd,haxe_macro_Binop.OpBoolOr,haxe_macro_Binop.OpShl,haxe_macro_Binop.OpShr,haxe_macro_Binop.OpUShr,haxe_macro_Binop.OpMod,haxe_macro_Binop.OpInterval,haxe_macro_Binop.OpArrow,haxe_macro_Binop.OpIn,haxe_macro_Binop.OpNullCoal];
var haxe_macro_Unop = $hxEnums["haxe.macro.Unop"] = { __ename__:"haxe.macro.Unop",__constructs__:null
	,OpIncrement: {_hx_name:"OpIncrement",_hx_index:0,__enum__:"haxe.macro.Unop",toString:$estr}
	,OpDecrement: {_hx_name:"OpDecrement",_hx_index:1,__enum__:"haxe.macro.Unop",toString:$estr}
	,OpNot: {_hx_name:"OpNot",_hx_index:2,__enum__:"haxe.macro.Unop",toString:$estr}
	,OpNeg: {_hx_name:"OpNeg",_hx_index:3,__enum__:"haxe.macro.Unop",toString:$estr}
	,OpNegBits: {_hx_name:"OpNegBits",_hx_index:4,__enum__:"haxe.macro.Unop",toString:$estr}
	,OpSpread: {_hx_name:"OpSpread",_hx_index:5,__enum__:"haxe.macro.Unop",toString:$estr}
};
haxe_macro_Unop.__constructs__ = [haxe_macro_Unop.OpIncrement,haxe_macro_Unop.OpDecrement,haxe_macro_Unop.OpNot,haxe_macro_Unop.OpNeg,haxe_macro_Unop.OpNegBits,haxe_macro_Unop.OpSpread];
haxe_macro_Unop.__empty_constructs__ = [haxe_macro_Unop.OpIncrement,haxe_macro_Unop.OpDecrement,haxe_macro_Unop.OpNot,haxe_macro_Unop.OpNeg,haxe_macro_Unop.OpNegBits,haxe_macro_Unop.OpSpread];
var haxe_macro_EFieldKind = $hxEnums["haxe.macro.EFieldKind"] = { __ename__:"haxe.macro.EFieldKind",__constructs__:null
	,Normal: {_hx_name:"Normal",_hx_index:0,__enum__:"haxe.macro.EFieldKind",toString:$estr}
	,Safe: {_hx_name:"Safe",_hx_index:1,__enum__:"haxe.macro.EFieldKind",toString:$estr}
};
haxe_macro_EFieldKind.__constructs__ = [haxe_macro_EFieldKind.Normal,haxe_macro_EFieldKind.Safe];
haxe_macro_EFieldKind.__empty_constructs__ = [haxe_macro_EFieldKind.Normal,haxe_macro_EFieldKind.Safe];
var haxe_macro_QuoteStatus = $hxEnums["haxe.macro.QuoteStatus"] = { __ename__:"haxe.macro.QuoteStatus",__constructs__:null
	,Unquoted: {_hx_name:"Unquoted",_hx_index:0,__enum__:"haxe.macro.QuoteStatus",toString:$estr}
	,Quoted: {_hx_name:"Quoted",_hx_index:1,__enum__:"haxe.macro.QuoteStatus",toString:$estr}
};
haxe_macro_QuoteStatus.__constructs__ = [haxe_macro_QuoteStatus.Unquoted,haxe_macro_QuoteStatus.Quoted];
haxe_macro_QuoteStatus.__empty_constructs__ = [haxe_macro_QuoteStatus.Unquoted,haxe_macro_QuoteStatus.Quoted];
var haxe_macro_FunctionKind = $hxEnums["haxe.macro.FunctionKind"] = { __ename__:"haxe.macro.FunctionKind",__constructs__:null
	,FAnonymous: {_hx_name:"FAnonymous",_hx_index:0,__enum__:"haxe.macro.FunctionKind",toString:$estr}
	,FNamed: ($_=function(name,inlined) { return {_hx_index:1,name:name,inlined:inlined,__enum__:"haxe.macro.FunctionKind",toString:$estr,__params__:function(){ return [this.name,this.inlined];}}; },$_._hx_name="FNamed",$_)
	,FArrow: {_hx_name:"FArrow",_hx_index:2,__enum__:"haxe.macro.FunctionKind",toString:$estr}
};
haxe_macro_FunctionKind.__constructs__ = [haxe_macro_FunctionKind.FAnonymous,haxe_macro_FunctionKind.FNamed,haxe_macro_FunctionKind.FArrow];
haxe_macro_FunctionKind.__empty_constructs__ = [haxe_macro_FunctionKind.FAnonymous,haxe_macro_FunctionKind.FArrow];
var haxe_macro_ExprDef = $hxEnums["haxe.macro.ExprDef"] = { __ename__:"haxe.macro.ExprDef",__constructs__:null
	,EConst: ($_=function(c) { return {_hx_index:0,c:c,__enum__:"haxe.macro.ExprDef",toString:$estr,__params__:function(){ return [this.c];}}; },$_._hx_name="EConst",$_)
	,EArray: ($_=function(e1,e2) { return {_hx_index:1,e1:e1,e2:e2,__enum__:"haxe.macro.ExprDef",toString:$estr,__params__:function(){ return [this.e1,this.e2];}}; },$_._hx_name="EArray",$_)
	,EBinop: ($_=function(op,e1,e2) { return {_hx_index:2,op:op,e1:e1,e2:e2,__enum__:"haxe.macro.ExprDef",toString:$estr,__params__:function(){ return [this.op,this.e1,this.e2];}}; },$_._hx_name="EBinop",$_)
	,EField: ($_=function(e,field,kind) { return {_hx_index:3,e:e,field:field,kind:kind,__enum__:"haxe.macro.ExprDef",toString:$estr,__params__:function(){ return [this.e,this.field,this.kind];}}; },$_._hx_name="EField",$_)
	,EParenthesis: ($_=function(e) { return {_hx_index:4,e:e,__enum__:"haxe.macro.ExprDef",toString:$estr,__params__:function(){ return [this.e];}}; },$_._hx_name="EParenthesis",$_)
	,EObjectDecl: ($_=function(fields) { return {_hx_index:5,fields:fields,__enum__:"haxe.macro.ExprDef",toString:$estr,__params__:function(){ return [this.fields];}}; },$_._hx_name="EObjectDecl",$_)
	,EArrayDecl: ($_=function(values) { return {_hx_index:6,values:values,__enum__:"haxe.macro.ExprDef",toString:$estr,__params__:function(){ return [this.values];}}; },$_._hx_name="EArrayDecl",$_)
	,ECall: ($_=function(e,params) { return {_hx_index:7,e:e,params:params,__enum__:"haxe.macro.ExprDef",toString:$estr,__params__:function(){ return [this.e,this.params];}}; },$_._hx_name="ECall",$_)
	,ENew: ($_=function(t,params) { return {_hx_index:8,t:t,params:params,__enum__:"haxe.macro.ExprDef",toString:$estr,__params__:function(){ return [this.t,this.params];}}; },$_._hx_name="ENew",$_)
	,EUnop: ($_=function(op,postFix,e) { return {_hx_index:9,op:op,postFix:postFix,e:e,__enum__:"haxe.macro.ExprDef",toString:$estr,__params__:function(){ return [this.op,this.postFix,this.e];}}; },$_._hx_name="EUnop",$_)
	,EVars: ($_=function(vars) { return {_hx_index:10,vars:vars,__enum__:"haxe.macro.ExprDef",toString:$estr,__params__:function(){ return [this.vars];}}; },$_._hx_name="EVars",$_)
	,EFunction: ($_=function(kind,f) { return {_hx_index:11,kind:kind,f:f,__enum__:"haxe.macro.ExprDef",toString:$estr,__params__:function(){ return [this.kind,this.f];}}; },$_._hx_name="EFunction",$_)
	,EBlock: ($_=function(exprs) { return {_hx_index:12,exprs:exprs,__enum__:"haxe.macro.ExprDef",toString:$estr,__params__:function(){ return [this.exprs];}}; },$_._hx_name="EBlock",$_)
	,EFor: ($_=function(it,expr) { return {_hx_index:13,it:it,expr:expr,__enum__:"haxe.macro.ExprDef",toString:$estr,__params__:function(){ return [this.it,this.expr];}}; },$_._hx_name="EFor",$_)
	,EIf: ($_=function(econd,eif,eelse) { return {_hx_index:14,econd:econd,eif:eif,eelse:eelse,__enum__:"haxe.macro.ExprDef",toString:$estr,__params__:function(){ return [this.econd,this.eif,this.eelse];}}; },$_._hx_name="EIf",$_)
	,EWhile: ($_=function(econd,e,normalWhile) { return {_hx_index:15,econd:econd,e:e,normalWhile:normalWhile,__enum__:"haxe.macro.ExprDef",toString:$estr,__params__:function(){ return [this.econd,this.e,this.normalWhile];}}; },$_._hx_name="EWhile",$_)
	,ESwitch: ($_=function(e,cases,edef) { return {_hx_index:16,e:e,cases:cases,edef:edef,__enum__:"haxe.macro.ExprDef",toString:$estr,__params__:function(){ return [this.e,this.cases,this.edef];}}; },$_._hx_name="ESwitch",$_)
	,ETry: ($_=function(e,catches) { return {_hx_index:17,e:e,catches:catches,__enum__:"haxe.macro.ExprDef",toString:$estr,__params__:function(){ return [this.e,this.catches];}}; },$_._hx_name="ETry",$_)
	,EReturn: ($_=function(e) { return {_hx_index:18,e:e,__enum__:"haxe.macro.ExprDef",toString:$estr,__params__:function(){ return [this.e];}}; },$_._hx_name="EReturn",$_)
	,EBreak: {_hx_name:"EBreak",_hx_index:19,__enum__:"haxe.macro.ExprDef",toString:$estr}
	,EContinue: {_hx_name:"EContinue",_hx_index:20,__enum__:"haxe.macro.ExprDef",toString:$estr}
	,EUntyped: ($_=function(e) { return {_hx_index:21,e:e,__enum__:"haxe.macro.ExprDef",toString:$estr,__params__:function(){ return [this.e];}}; },$_._hx_name="EUntyped",$_)
	,EThrow: ($_=function(e) { return {_hx_index:22,e:e,__enum__:"haxe.macro.ExprDef",toString:$estr,__params__:function(){ return [this.e];}}; },$_._hx_name="EThrow",$_)
	,ECast: ($_=function(e,t) { return {_hx_index:23,e:e,t:t,__enum__:"haxe.macro.ExprDef",toString:$estr,__params__:function(){ return [this.e,this.t];}}; },$_._hx_name="ECast",$_)
	,EDisplay: ($_=function(e,displayKind) { return {_hx_index:24,e:e,displayKind:displayKind,__enum__:"haxe.macro.ExprDef",toString:$estr,__params__:function(){ return [this.e,this.displayKind];}}; },$_._hx_name="EDisplay",$_)
	,ETernary: ($_=function(econd,eif,eelse) { return {_hx_index:25,econd:econd,eif:eif,eelse:eelse,__enum__:"haxe.macro.ExprDef",toString:$estr,__params__:function(){ return [this.econd,this.eif,this.eelse];}}; },$_._hx_name="ETernary",$_)
	,ECheckType: ($_=function(e,t) { return {_hx_index:26,e:e,t:t,__enum__:"haxe.macro.ExprDef",toString:$estr,__params__:function(){ return [this.e,this.t];}}; },$_._hx_name="ECheckType",$_)
	,EMeta: ($_=function(s,e) { return {_hx_index:27,s:s,e:e,__enum__:"haxe.macro.ExprDef",toString:$estr,__params__:function(){ return [this.s,this.e];}}; },$_._hx_name="EMeta",$_)
	,EIs: ($_=function(e,t) { return {_hx_index:28,e:e,t:t,__enum__:"haxe.macro.ExprDef",toString:$estr,__params__:function(){ return [this.e,this.t];}}; },$_._hx_name="EIs",$_)
};
haxe_macro_ExprDef.__constructs__ = [haxe_macro_ExprDef.EConst,haxe_macro_ExprDef.EArray,haxe_macro_ExprDef.EBinop,haxe_macro_ExprDef.EField,haxe_macro_ExprDef.EParenthesis,haxe_macro_ExprDef.EObjectDecl,haxe_macro_ExprDef.EArrayDecl,haxe_macro_ExprDef.ECall,haxe_macro_ExprDef.ENew,haxe_macro_ExprDef.EUnop,haxe_macro_ExprDef.EVars,haxe_macro_ExprDef.EFunction,haxe_macro_ExprDef.EBlock,haxe_macro_ExprDef.EFor,haxe_macro_ExprDef.EIf,haxe_macro_ExprDef.EWhile,haxe_macro_ExprDef.ESwitch,haxe_macro_ExprDef.ETry,haxe_macro_ExprDef.EReturn,haxe_macro_ExprDef.EBreak,haxe_macro_ExprDef.EContinue,haxe_macro_ExprDef.EUntyped,haxe_macro_ExprDef.EThrow,haxe_macro_ExprDef.ECast,haxe_macro_ExprDef.EDisplay,haxe_macro_ExprDef.ETernary,haxe_macro_ExprDef.ECheckType,haxe_macro_ExprDef.EMeta,haxe_macro_ExprDef.EIs];
haxe_macro_ExprDef.__empty_constructs__ = [haxe_macro_ExprDef.EBreak,haxe_macro_ExprDef.EContinue];
var haxe_macro_DisplayKind = $hxEnums["haxe.macro.DisplayKind"] = { __ename__:"haxe.macro.DisplayKind",__constructs__:null
	,DKCall: {_hx_name:"DKCall",_hx_index:0,__enum__:"haxe.macro.DisplayKind",toString:$estr}
	,DKDot: {_hx_name:"DKDot",_hx_index:1,__enum__:"haxe.macro.DisplayKind",toString:$estr}
	,DKStructure: {_hx_name:"DKStructure",_hx_index:2,__enum__:"haxe.macro.DisplayKind",toString:$estr}
	,DKMarked: {_hx_name:"DKMarked",_hx_index:3,__enum__:"haxe.macro.DisplayKind",toString:$estr}
	,DKPattern: ($_=function(outermost) { return {_hx_index:4,outermost:outermost,__enum__:"haxe.macro.DisplayKind",toString:$estr,__params__:function(){ return [this.outermost];}}; },$_._hx_name="DKPattern",$_)
};
haxe_macro_DisplayKind.__constructs__ = [haxe_macro_DisplayKind.DKCall,haxe_macro_DisplayKind.DKDot,haxe_macro_DisplayKind.DKStructure,haxe_macro_DisplayKind.DKMarked,haxe_macro_DisplayKind.DKPattern];
haxe_macro_DisplayKind.__empty_constructs__ = [haxe_macro_DisplayKind.DKCall,haxe_macro_DisplayKind.DKDot,haxe_macro_DisplayKind.DKStructure,haxe_macro_DisplayKind.DKMarked];
var haxe_macro_ComplexType = $hxEnums["haxe.macro.ComplexType"] = { __ename__:"haxe.macro.ComplexType",__constructs__:null
	,TPath: ($_=function(p) { return {_hx_index:0,p:p,__enum__:"haxe.macro.ComplexType",toString:$estr,__params__:function(){ return [this.p];}}; },$_._hx_name="TPath",$_)
	,TFunction: ($_=function(args,ret) { return {_hx_index:1,args:args,ret:ret,__enum__:"haxe.macro.ComplexType",toString:$estr,__params__:function(){ return [this.args,this.ret];}}; },$_._hx_name="TFunction",$_)
	,TAnonymous: ($_=function(fields) { return {_hx_index:2,fields:fields,__enum__:"haxe.macro.ComplexType",toString:$estr,__params__:function(){ return [this.fields];}}; },$_._hx_name="TAnonymous",$_)
	,TParent: ($_=function(t) { return {_hx_index:3,t:t,__enum__:"haxe.macro.ComplexType",toString:$estr,__params__:function(){ return [this.t];}}; },$_._hx_name="TParent",$_)
	,TExtend: ($_=function(p,fields) { return {_hx_index:4,p:p,fields:fields,__enum__:"haxe.macro.ComplexType",toString:$estr,__params__:function(){ return [this.p,this.fields];}}; },$_._hx_name="TExtend",$_)
	,TOptional: ($_=function(t) { return {_hx_index:5,t:t,__enum__:"haxe.macro.ComplexType",toString:$estr,__params__:function(){ return [this.t];}}; },$_._hx_name="TOptional",$_)
	,TNamed: ($_=function(n,t) { return {_hx_index:6,n:n,t:t,__enum__:"haxe.macro.ComplexType",toString:$estr,__params__:function(){ return [this.n,this.t];}}; },$_._hx_name="TNamed",$_)
	,TIntersection: ($_=function(tl) { return {_hx_index:7,tl:tl,__enum__:"haxe.macro.ComplexType",toString:$estr,__params__:function(){ return [this.tl];}}; },$_._hx_name="TIntersection",$_)
};
haxe_macro_ComplexType.__constructs__ = [haxe_macro_ComplexType.TPath,haxe_macro_ComplexType.TFunction,haxe_macro_ComplexType.TAnonymous,haxe_macro_ComplexType.TParent,haxe_macro_ComplexType.TExtend,haxe_macro_ComplexType.TOptional,haxe_macro_ComplexType.TNamed,haxe_macro_ComplexType.TIntersection];
haxe_macro_ComplexType.__empty_constructs__ = [];
var haxe_macro_TypeParam = $hxEnums["haxe.macro.TypeParam"] = { __ename__:"haxe.macro.TypeParam",__constructs__:null
	,TPType: ($_=function(t) { return {_hx_index:0,t:t,__enum__:"haxe.macro.TypeParam",toString:$estr,__params__:function(){ return [this.t];}}; },$_._hx_name="TPType",$_)
	,TPExpr: ($_=function(e) { return {_hx_index:1,e:e,__enum__:"haxe.macro.TypeParam",toString:$estr,__params__:function(){ return [this.e];}}; },$_._hx_name="TPExpr",$_)
};
haxe_macro_TypeParam.__constructs__ = [haxe_macro_TypeParam.TPType,haxe_macro_TypeParam.TPExpr];
haxe_macro_TypeParam.__empty_constructs__ = [];
var haxe_macro_Access = $hxEnums["haxe.macro.Access"] = { __ename__:"haxe.macro.Access",__constructs__:null
	,APublic: {_hx_name:"APublic",_hx_index:0,__enum__:"haxe.macro.Access",toString:$estr}
	,APrivate: {_hx_name:"APrivate",_hx_index:1,__enum__:"haxe.macro.Access",toString:$estr}
	,AStatic: {_hx_name:"AStatic",_hx_index:2,__enum__:"haxe.macro.Access",toString:$estr}
	,AOverride: {_hx_name:"AOverride",_hx_index:3,__enum__:"haxe.macro.Access",toString:$estr}
	,ADynamic: {_hx_name:"ADynamic",_hx_index:4,__enum__:"haxe.macro.Access",toString:$estr}
	,AInline: {_hx_name:"AInline",_hx_index:5,__enum__:"haxe.macro.Access",toString:$estr}
	,AMacro: {_hx_name:"AMacro",_hx_index:6,__enum__:"haxe.macro.Access",toString:$estr}
	,AFinal: {_hx_name:"AFinal",_hx_index:7,__enum__:"haxe.macro.Access",toString:$estr}
	,AExtern: {_hx_name:"AExtern",_hx_index:8,__enum__:"haxe.macro.Access",toString:$estr}
	,AAbstract: {_hx_name:"AAbstract",_hx_index:9,__enum__:"haxe.macro.Access",toString:$estr}
	,AOverload: {_hx_name:"AOverload",_hx_index:10,__enum__:"haxe.macro.Access",toString:$estr}
	,AEnum: {_hx_name:"AEnum",_hx_index:11,__enum__:"haxe.macro.Access",toString:$estr}
};
haxe_macro_Access.__constructs__ = [haxe_macro_Access.APublic,haxe_macro_Access.APrivate,haxe_macro_Access.AStatic,haxe_macro_Access.AOverride,haxe_macro_Access.ADynamic,haxe_macro_Access.AInline,haxe_macro_Access.AMacro,haxe_macro_Access.AFinal,haxe_macro_Access.AExtern,haxe_macro_Access.AAbstract,haxe_macro_Access.AOverload,haxe_macro_Access.AEnum];
haxe_macro_Access.__empty_constructs__ = [haxe_macro_Access.APublic,haxe_macro_Access.APrivate,haxe_macro_Access.AStatic,haxe_macro_Access.AOverride,haxe_macro_Access.ADynamic,haxe_macro_Access.AInline,haxe_macro_Access.AMacro,haxe_macro_Access.AFinal,haxe_macro_Access.AExtern,haxe_macro_Access.AAbstract,haxe_macro_Access.AOverload,haxe_macro_Access.AEnum];
var haxe_macro_FieldType = $hxEnums["haxe.macro.FieldType"] = { __ename__:"haxe.macro.FieldType",__constructs__:null
	,FVar: ($_=function(t,e) { return {_hx_index:0,t:t,e:e,__enum__:"haxe.macro.FieldType",toString:$estr,__params__:function(){ return [this.t,this.e];}}; },$_._hx_name="FVar",$_)
	,FFun: ($_=function(f) { return {_hx_index:1,f:f,__enum__:"haxe.macro.FieldType",toString:$estr,__params__:function(){ return [this.f];}}; },$_._hx_name="FFun",$_)
	,FProp: ($_=function(get,set,t,e) { return {_hx_index:2,get:get,set:set,t:t,e:e,__enum__:"haxe.macro.FieldType",toString:$estr,__params__:function(){ return [this.get,this.set,this.t,this.e];}}; },$_._hx_name="FProp",$_)
};
haxe_macro_FieldType.__constructs__ = [haxe_macro_FieldType.FVar,haxe_macro_FieldType.FFun,haxe_macro_FieldType.FProp];
haxe_macro_FieldType.__empty_constructs__ = [];
var haxe_macro_TypeDefKind = $hxEnums["haxe.macro.TypeDefKind"] = { __ename__:"haxe.macro.TypeDefKind",__constructs__:null
	,TDEnum: {_hx_name:"TDEnum",_hx_index:0,__enum__:"haxe.macro.TypeDefKind",toString:$estr}
	,TDStructure: {_hx_name:"TDStructure",_hx_index:1,__enum__:"haxe.macro.TypeDefKind",toString:$estr}
	,TDClass: ($_=function(superClass,interfaces,isInterface,isFinal,isAbstract) { return {_hx_index:2,superClass:superClass,interfaces:interfaces,isInterface:isInterface,isFinal:isFinal,isAbstract:isAbstract,__enum__:"haxe.macro.TypeDefKind",toString:$estr,__params__:function(){ return [this.superClass,this.interfaces,this.isInterface,this.isFinal,this.isAbstract];}}; },$_._hx_name="TDClass",$_)
	,TDAlias: ($_=function(t) { return {_hx_index:3,t:t,__enum__:"haxe.macro.TypeDefKind",toString:$estr,__params__:function(){ return [this.t];}}; },$_._hx_name="TDAlias",$_)
	,TDAbstract: ($_=function(tthis,flags,from,to) { return {_hx_index:4,tthis:tthis,flags:flags,from:from,to:to,__enum__:"haxe.macro.TypeDefKind",toString:$estr,__params__:function(){ return [this.tthis,this.flags,this.from,this.to];}}; },$_._hx_name="TDAbstract",$_)
	,TDField: ($_=function(kind,access) { return {_hx_index:5,kind:kind,access:access,__enum__:"haxe.macro.TypeDefKind",toString:$estr,__params__:function(){ return [this.kind,this.access];}}; },$_._hx_name="TDField",$_)
};
haxe_macro_TypeDefKind.__constructs__ = [haxe_macro_TypeDefKind.TDEnum,haxe_macro_TypeDefKind.TDStructure,haxe_macro_TypeDefKind.TDClass,haxe_macro_TypeDefKind.TDAlias,haxe_macro_TypeDefKind.TDAbstract,haxe_macro_TypeDefKind.TDField];
haxe_macro_TypeDefKind.__empty_constructs__ = [haxe_macro_TypeDefKind.TDEnum,haxe_macro_TypeDefKind.TDStructure];
var haxe_macro_AbstractFlag = $hxEnums["haxe.macro.AbstractFlag"] = { __ename__:"haxe.macro.AbstractFlag",__constructs__:null
	,AbEnum: {_hx_name:"AbEnum",_hx_index:0,__enum__:"haxe.macro.AbstractFlag",toString:$estr}
	,AbFrom: ($_=function(ct) { return {_hx_index:1,ct:ct,__enum__:"haxe.macro.AbstractFlag",toString:$estr,__params__:function(){ return [this.ct];}}; },$_._hx_name="AbFrom",$_)
	,AbTo: ($_=function(ct) { return {_hx_index:2,ct:ct,__enum__:"haxe.macro.AbstractFlag",toString:$estr,__params__:function(){ return [this.ct];}}; },$_._hx_name="AbTo",$_)
};
haxe_macro_AbstractFlag.__constructs__ = [haxe_macro_AbstractFlag.AbEnum,haxe_macro_AbstractFlag.AbFrom,haxe_macro_AbstractFlag.AbTo];
haxe_macro_AbstractFlag.__empty_constructs__ = [haxe_macro_AbstractFlag.AbEnum];
var haxe_macro_Error = function(message,pos,previous) {
	haxe_Exception.call(this,message,previous);
	this.pos = pos;
	this.__skipStack++;
};
$hxClasses["haxe.macro.Error"] = haxe_macro_Error;
haxe_macro_Error.__name__ = "haxe.macro.Error";
haxe_macro_Error.__super__ = haxe_Exception;
haxe_macro_Error.prototype = $extend(haxe_Exception.prototype,{
	pos: null
	,childErrors: null
	,__class__: haxe_macro_Error
});
var haxe_macro_ImportMode = $hxEnums["haxe.macro.ImportMode"] = { __ename__:"haxe.macro.ImportMode",__constructs__:null
	,INormal: {_hx_name:"INormal",_hx_index:0,__enum__:"haxe.macro.ImportMode",toString:$estr}
	,IAsName: ($_=function(alias) { return {_hx_index:1,alias:alias,__enum__:"haxe.macro.ImportMode",toString:$estr,__params__:function(){ return [this.alias];}}; },$_._hx_name="IAsName",$_)
	,IAll: {_hx_name:"IAll",_hx_index:2,__enum__:"haxe.macro.ImportMode",toString:$estr}
};
haxe_macro_ImportMode.__constructs__ = [haxe_macro_ImportMode.INormal,haxe_macro_ImportMode.IAsName,haxe_macro_ImportMode.IAll];
haxe_macro_ImportMode.__empty_constructs__ = [haxe_macro_ImportMode.INormal,haxe_macro_ImportMode.IAll];
var haxe_macro_ExprTools = function() { };
$hxClasses["haxe.macro.ExprTools"] = haxe_macro_ExprTools;
haxe_macro_ExprTools.__name__ = "haxe.macro.ExprTools";
haxe_macro_ExprTools.toString = function(e) {
	return new haxe_macro_Printer().printExpr(e);
};
haxe_macro_ExprTools.iter = function(e,f) {
	var _g = e.expr;
	switch(_g._hx_index) {
	case 0:
		break;
	case 1:
		f(_g.e1);
		f(_g.e2);
		break;
	case 2:
		f(_g.e1);
		f(_g.e2);
		break;
	case 3:
		f(_g.e);
		break;
	case 4:
		f(_g.e);
		break;
	case 5:
		var _gfields = _g.fields;
		var _g1 = 0;
		while(_g1 < _gfields.length) {
			var fd = _gfields[_g1];
			++_g1;
			f(fd.expr);
		}
		break;
	case 6:
		haxe_macro_ExprArrayTools.iter(_g.values,f);
		break;
	case 7:
		f(_g.e);
		haxe_macro_ExprArrayTools.iter(_g.params,f);
		break;
	case 8:
		haxe_macro_ExprArrayTools.iter(_g.params,f);
		break;
	case 9:
		f(_g.e);
		break;
	case 10:
		var _gvars = _g.vars;
		var _g1 = 0;
		while(_g1 < _gvars.length) {
			var v = _gvars[_g1];
			++_g1;
			var e = v.expr;
			if(e != null) {
				f(e);
			}
		}
		break;
	case 11:
		var _gf = _g.f;
		var _g1 = 0;
		var _g2 = _gf.args;
		while(_g1 < _g2.length) {
			var arg = _g2[_g1];
			++_g1;
			var e = arg.value;
			if(e != null) {
				f(e);
			}
		}
		var e = _gf.expr;
		if(e != null) {
			f(e);
		}
		break;
	case 12:
		haxe_macro_ExprArrayTools.iter(_g.exprs,f);
		break;
	case 13:
		f(_g.it);
		f(_g.expr);
		break;
	case 14:
		var _geelse = _g.eelse;
		f(_g.econd);
		f(_g.eif);
		if(_geelse != null) {
			f(_geelse);
		}
		break;
	case 15:
		f(_g.econd);
		f(_g.e);
		break;
	case 16:
		var _gcases = _g.cases;
		var _gedef = _g.edef;
		f(_g.e);
		var _g1 = 0;
		while(_g1 < _gcases.length) {
			var c = _gcases[_g1];
			++_g1;
			haxe_macro_ExprArrayTools.iter(c.values,f);
			var e = c.guard;
			if(e != null) {
				f(e);
			}
			var e1 = c.expr;
			if(e1 != null) {
				f(e1);
			}
		}
		if(_gedef != null && _gedef.expr != null) {
			f(_gedef);
		}
		break;
	case 17:
		var _gcatches = _g.catches;
		f(_g.e);
		var _g1 = 0;
		while(_g1 < _gcatches.length) {
			var c = _gcatches[_g1];
			++_g1;
			f(c.expr);
		}
		break;
	case 18:
		var _ge = _g.e;
		if(_ge != null) {
			f(_ge);
		}
		break;
	case 19:case 20:
		break;
	case 21:
		f(_g.e);
		break;
	case 22:
		f(_g.e);
		break;
	case 23:
		f(_g.e);
		break;
	case 24:
		f(_g.e);
		break;
	case 25:
		var _geelse = _g.eelse;
		f(_g.econd);
		f(_g.eif);
		if(_geelse != null) {
			f(_geelse);
		}
		break;
	case 26:
		f(_g.e);
		break;
	case 27:
		f(_g.e);
		break;
	case 28:
		f(_g.e);
		break;
	}
};
haxe_macro_ExprTools.map = function(e,f) {
	var e1 = e.pos;
	var _g = e.expr;
	var tmp;
	switch(_g._hx_index) {
	case 0:
		tmp = e.expr;
		break;
	case 1:
		tmp = haxe_macro_ExprDef.EArray(f(_g.e1),f(_g.e2));
		break;
	case 2:
		tmp = haxe_macro_ExprDef.EBinop(_g.op,f(_g.e1),f(_g.e2));
		break;
	case 3:
		tmp = haxe_macro_ExprDef.EField(f(_g.e),_g.field,_g.kind);
		break;
	case 4:
		tmp = haxe_macro_ExprDef.EParenthesis(f(_g.e));
		break;
	case 5:
		var _gfields = _g.fields;
		var ret = [];
		var _g1 = 0;
		while(_g1 < _gfields.length) {
			var field = _gfields[_g1];
			++_g1;
			ret.push({ field : field.field, expr : f(field.expr), quotes : field.quotes});
		}
		tmp = haxe_macro_ExprDef.EObjectDecl(ret);
		break;
	case 6:
		tmp = haxe_macro_ExprDef.EArrayDecl(haxe_macro_ExprArrayTools.map(_g.values,f));
		break;
	case 7:
		tmp = haxe_macro_ExprDef.ECall(f(_g.e),haxe_macro_ExprArrayTools.map(_g.params,f));
		break;
	case 8:
		tmp = haxe_macro_ExprDef.ENew(_g.t,haxe_macro_ExprArrayTools.map(_g.params,f));
		break;
	case 9:
		tmp = haxe_macro_ExprDef.EUnop(_g.op,_g.postFix,f(_g.e));
		break;
	case 10:
		var _gvars = _g.vars;
		var ret = [];
		var _g1 = 0;
		while(_g1 < _gvars.length) {
			var v = _gvars[_g1];
			++_g1;
			var e2 = v.expr;
			var v2 = { name : v.name, type : v.type, expr : e2 == null ? null : f(e2)};
			if(v.isFinal != null) {
				v2.isFinal = v.isFinal;
			}
			ret.push(v2);
		}
		tmp = haxe_macro_ExprDef.EVars(ret);
		break;
	case 11:
		var _gkind = _g.kind;
		var _gf = _g.f;
		var ret = [];
		var _g1 = 0;
		var _g2 = _gf.args;
		while(_g1 < _g2.length) {
			var arg = _g2[_g1];
			++_g1;
			var e2 = arg.value;
			ret.push({ name : arg.name, opt : arg.opt, type : arg.type, value : e2 == null ? null : f(e2)});
		}
		tmp = haxe_macro_ExprDef.EFunction(_gkind,{ args : ret, ret : _gf.ret, params : _gf.params, expr : f(_gf.expr)});
		break;
	case 12:
		tmp = haxe_macro_ExprDef.EBlock(haxe_macro_ExprArrayTools.map(_g.exprs,f));
		break;
	case 13:
		tmp = haxe_macro_ExprDef.EFor(f(_g.it),f(_g.expr));
		break;
	case 14:
		var _geelse = _g.eelse;
		tmp = haxe_macro_ExprDef.EIf(f(_g.econd),f(_g.eif),_geelse == null ? null : f(_geelse));
		break;
	case 15:
		tmp = haxe_macro_ExprDef.EWhile(f(_g.econd),f(_g.e),_g.normalWhile);
		break;
	case 16:
		var _ge = _g.e;
		var _gcases = _g.cases;
		var _gedef = _g.edef;
		var ret = [];
		var _g1 = 0;
		while(_g1 < _gcases.length) {
			var c = _gcases[_g1];
			++_g1;
			var e2 = c.expr;
			var tmp1 = e2 == null ? null : f(e2);
			var e3 = c.guard;
			ret.push({ expr : tmp1, guard : e3 == null ? null : f(e3), values : haxe_macro_ExprArrayTools.map(c.values,f)});
		}
		tmp = haxe_macro_ExprDef.ESwitch(f(_ge),ret,_gedef == null || _gedef.expr == null ? _gedef : f(_gedef));
		break;
	case 17:
		var _ge = _g.e;
		var _gcatches = _g.catches;
		var ret = [];
		var _g1 = 0;
		while(_g1 < _gcatches.length) {
			var c = _gcatches[_g1];
			++_g1;
			ret.push({ name : c.name, type : c.type, expr : f(c.expr)});
		}
		tmp = haxe_macro_ExprDef.ETry(f(_ge),ret);
		break;
	case 18:
		var _ge = _g.e;
		tmp = haxe_macro_ExprDef.EReturn(_ge == null ? null : f(_ge));
		break;
	case 19:case 20:
		tmp = e.expr;
		break;
	case 21:
		tmp = haxe_macro_ExprDef.EUntyped(f(_g.e));
		break;
	case 22:
		tmp = haxe_macro_ExprDef.EThrow(f(_g.e));
		break;
	case 23:
		tmp = haxe_macro_ExprDef.ECast(f(_g.e),_g.t);
		break;
	case 24:
		tmp = haxe_macro_ExprDef.EDisplay(f(_g.e),_g.displayKind);
		break;
	case 25:
		tmp = haxe_macro_ExprDef.ETernary(f(_g.econd),f(_g.eif),f(_g.eelse));
		break;
	case 26:
		tmp = haxe_macro_ExprDef.ECheckType(f(_g.e),_g.t);
		break;
	case 27:
		tmp = haxe_macro_ExprDef.EMeta(_g.s,f(_g.e));
		break;
	case 28:
		tmp = haxe_macro_ExprDef.EIs(f(_g.e),_g.t);
		break;
	}
	return { pos : e1, expr : tmp};
};
haxe_macro_ExprTools.getValue = function(e) {
	while(true) {
		var _g = e.expr;
		switch(_g._hx_index) {
		case 0:
			var _gc = _g.c;
			switch(_gc._hx_index) {
			case 0:
				return Std.parseInt(_gc.v);
			case 1:
				return parseFloat(_gc.f);
			case 2:
				return _gc.s;
			case 3:
				switch(_gc.s) {
				case "false":
					return false;
				case "null":
					return null;
				case "true":
					return true;
				default:
					throw haxe_Exception.thrown("Unsupported expression: " + Std.string(e));
				}
				break;
			default:
				throw haxe_Exception.thrown("Unsupported expression: " + Std.string(e));
			}
			break;
		case 2:
			var e1 = haxe_macro_ExprTools.getValue(_g.e1);
			var e2 = haxe_macro_ExprTools.getValue(_g.e2);
			switch(_g.op._hx_index) {
			case 0:
				return e1 + e2;
			case 1:
				return e1 * e2;
			case 2:
				return e1 / e2;
			case 3:
				return e1 - e2;
			case 5:
				return e1 == e2;
			case 6:
				return e1 != e2;
			case 7:
				return e1 > e2;
			case 8:
				return e1 >= e2;
			case 9:
				return e1 < e2;
			case 10:
				return e1 <= e2;
			case 11:
				return e1 & e2;
			case 12:
				return e1 | e2;
			case 13:
				return e1 ^ e2;
			case 14:
				if(e1) {
					return e2;
				} else {
					return false;
				}
				break;
			case 15:
				if(!e1) {
					return e2;
				} else {
					return true;
				}
				break;
			case 16:
				return e1 << e2;
			case 17:
				return e1 >> e2;
			case 18:
				return e1 >>> e2;
			case 19:
				return e1 % e2;
			default:
				throw haxe_Exception.thrown("Unsupported expression: " + Std.string(e));
			}
			break;
		case 4:
			e = _g.e;
			continue;
		case 5:
			var _gfields = _g.fields;
			var obj = { };
			var _g1 = 0;
			while(_g1 < _gfields.length) {
				var field = _gfields[_g1];
				++_g1;
				obj[field.field] = haxe_macro_ExprTools.getValue(field.expr);
			}
			return obj;
		case 6:
			var _gvalues = _g.values;
			var f = haxe_macro_ExprTools.getValue;
			var result = new Array(_gvalues.length);
			var _g2 = 0;
			var _g3 = _gvalues.length;
			while(_g2 < _g3) {
				var i = _g2++;
				result[i] = f(_gvalues[i]);
			}
			return result;
		case 9:
			if(_g.postFix == false) {
				var e11 = haxe_macro_ExprTools.getValue(_g.e);
				switch(_g.op._hx_index) {
				case 2:
					return !e11;
				case 3:
					return -e11;
				case 4:
					return ~e11;
				default:
					throw haxe_Exception.thrown("Unsupported expression: " + Std.string(e));
				}
			} else {
				throw haxe_Exception.thrown("Unsupported expression: " + Std.string(e));
			}
			break;
		case 14:
			var _geelse = _g.eelse;
			if(_geelse == null) {
				throw haxe_Exception.thrown("If statements only have a value if the else clause is defined");
			} else {
				var econd = haxe_macro_ExprTools.getValue(_g.econd);
				if(econd) {
					e = _g.eif;
					continue;
				} else {
					e = _geelse;
					continue;
				}
			}
			break;
		case 21:
			e = _g.e;
			continue;
		case 25:
			var _geelse1 = _g.eelse;
			if(_geelse1 == null) {
				throw haxe_Exception.thrown("If statements only have a value if the else clause is defined");
			} else {
				var econd1 = haxe_macro_ExprTools.getValue(_g.econd);
				if(econd1) {
					e = _g.eif;
					continue;
				} else {
					e = _geelse1;
					continue;
				}
			}
			break;
		case 27:
			e = _g.e;
			continue;
		default:
			throw haxe_Exception.thrown("Unsupported expression: " + Std.string(e));
		}
	}
};
haxe_macro_ExprTools.opt = function(e,f) {
	if(e == null) {
		return null;
	} else {
		return f(e);
	}
};
haxe_macro_ExprTools.opt2 = function(e,f) {
	if(e != null) {
		f(e);
	}
};
var haxe_macro_ExprArrayTools = function() { };
$hxClasses["haxe.macro.ExprArrayTools"] = haxe_macro_ExprArrayTools;
haxe_macro_ExprArrayTools.__name__ = "haxe.macro.ExprArrayTools";
haxe_macro_ExprArrayTools.map = function(el,f) {
	var ret = [];
	var _g = 0;
	while(_g < el.length) {
		var e = el[_g];
		++_g;
		ret.push(f(e));
	}
	return ret;
};
haxe_macro_ExprArrayTools.iter = function(el,f) {
	var _g = 0;
	while(_g < el.length) {
		var e = el[_g];
		++_g;
		f(e);
	}
};
var haxe_macro_Printer = function(tabString) {
	if(tabString == null) {
		tabString = "\t";
	}
	this.tabs = "";
	this.tabString = tabString;
};
$hxClasses["haxe.macro.Printer"] = haxe_macro_Printer;
haxe_macro_Printer.__name__ = "haxe.macro.Printer";
haxe_macro_Printer.prototype = {
	tabs: null
	,tabString: null
	,printUnop: function(op) {
		switch(op._hx_index) {
		case 0:
			return "++";
		case 1:
			return "--";
		case 2:
			return "!";
		case 3:
			return "-";
		case 4:
			return "~";
		case 5:
			return "...";
		}
	}
	,printBinop: function(op) {
		switch(op._hx_index) {
		case 0:
			return "+";
		case 1:
			return "*";
		case 2:
			return "/";
		case 3:
			return "-";
		case 4:
			return "=";
		case 5:
			return "==";
		case 6:
			return "!=";
		case 7:
			return ">";
		case 8:
			return ">=";
		case 9:
			return "<";
		case 10:
			return "<=";
		case 11:
			return "&";
		case 12:
			return "|";
		case 13:
			return "^";
		case 14:
			return "&&";
		case 15:
			return "||";
		case 16:
			return "<<";
		case 17:
			return ">>";
		case 18:
			return ">>>";
		case 19:
			return "%";
		case 20:
			return Std.string(this.printBinop(op.op)) + "=";
		case 21:
			return "...";
		case 22:
			return "=>";
		case 23:
			return "in";
		case 24:
			return "??";
		}
	}
	,escapeString: function(s,delim) {
		return delim + StringTools.replace(StringTools.replace(StringTools.replace(StringTools.replace(StringTools.replace(StringTools.replace(s,"\\","\\\\"),"\n","\\n"),"\t","\\t"),"\r","\\r"),"'","\\'"),"\"","\\\"") + delim;
	}
	,printFormatString: function(s) {
		return this.escapeString(s,"'");
	}
	,printString: function(s) {
		return this.escapeString(s,"\"");
	}
	,printConstant: function(c) {
		switch(c._hx_index) {
		case 0:
			var _gv = c.v;
			var _gs = c.s;
			if(_gs == null) {
				return _gv;
			} else {
				return _gv + _gs;
			}
			break;
		case 1:
			var _gf = c.f;
			var _gs = c.s;
			if(_gs == null) {
				return _gf;
			} else {
				return _gf + _gs;
			}
			break;
		case 2:
			var _gs = c.s;
			var _gkind = c.kind;
			if(_gkind == null) {
				return this.printString(_gs);
			} else if(_gkind._hx_index == 1) {
				return this.printFormatString(_gs);
			} else {
				return this.printString(_gs);
			}
			break;
		case 3:
			return c.s;
		case 4:
			return "~/" + c.r + "/" + c.opt;
		}
	}
	,printTypeParam: function(param) {
		switch(param._hx_index) {
		case 0:
			return this.printComplexType(param.t);
		case 1:
			return this.printExpr(param.e);
		}
	}
	,printTypePath: function(tp) {
		var tmp = (tp.pack.length > 0 ? tp.pack.join(".") + "." : "") + tp.name + (tp.sub != null ? "." + tp.sub : "");
		var tmp1;
		if(tp.params == null) {
			tmp1 = "";
		} else if(tp.params.length > 0) {
			var _this = tp.params;
			var f = $bind(this,this.printTypeParam);
			var result = new Array(_this.length);
			var _g = 0;
			var _g1 = _this.length;
			while(_g < _g1) {
				var i = _g++;
				result[i] = f(_this[i]);
			}
			tmp1 = "<" + result.join(", ") + ">";
		} else {
			tmp1 = "";
		}
		return tmp + tmp1;
	}
	,printComplexType: function(ct) {
		switch(ct._hx_index) {
		case 0:
			return this.printTypePath(ct.p);
		case 1:
			var _gargs = ct.args;
			var _gret = ct.ret;
			var wrapArgumentsInParentheses;
			if(_gargs.length == 1) {
				var _ga = _gargs[0];
				switch(_ga._hx_index) {
				case 0:
					wrapArgumentsInParentheses = false;
					break;
				case 3:
					wrapArgumentsInParentheses = false;
					break;
				case 5:
					wrapArgumentsInParentheses = _ga.t._hx_index == 0 ? false : true;
					break;
				default:
					wrapArgumentsInParentheses = true;
				}
			} else {
				wrapArgumentsInParentheses = true;
			}
			var f = $bind(this,this.printComplexType);
			var result = new Array(_gargs.length);
			var _g = 0;
			var _g1 = _gargs.length;
			while(_g < _g1) {
				var i = _g++;
				result[i] = f(_gargs[i]);
			}
			var argStr = result.join(", ");
			var tmp = _gret._hx_index == 1 ? "(" + Std.string(this.printComplexType(_gret)) + ")" : this.printComplexType(_gret);
			return (wrapArgumentsInParentheses ? "(" + argStr + ")" : argStr) + " -> " + tmp;
		case 2:
			var _gfields = ct.fields;
			var _g = [];
			var _g1 = 0;
			while(_g1 < _gfields.length) {
				var f = _gfields[_g1];
				++_g1;
				_g.push(this.printField(f) + "; ");
			}
			return "{ " + _g.join("") + "}";
		case 3:
			return "(" + this.printComplexType(ct.t) + ")";
		case 4:
			var _gp = ct.p;
			var _gfields = ct.fields;
			var _g = [];
			var _g1 = 0;
			while(_g1 < _gp.length) {
				var t = _gp[_g1];
				++_g1;
				_g.push("> " + Std.string(this.printTypePath(t)) + ", ");
			}
			var types = _g.join("");
			var _g = [];
			var _g1 = 0;
			while(_g1 < _gfields.length) {
				var f = _gfields[_g1];
				++_g1;
				_g.push(this.printField(f) + "; ");
			}
			var fields = _g.join("");
			return "{" + types + fields + "}";
		case 5:
			return "?" + this.printComplexType(ct.t);
		case 6:
			return ct.n + ":" + this.printComplexType(ct.t);
		case 7:
			var _gtl = ct.tl;
			var f = $bind(this,this.printComplexType);
			var result = new Array(_gtl.length);
			var _g = 0;
			var _g1 = _gtl.length;
			while(_g < _g1) {
				var i = _g++;
				result[i] = f(_gtl[i]);
			}
			return result.join(" & ");
		}
	}
	,printMetadata: function(meta) {
		return "@" + meta.name + (meta.params != null && meta.params.length > 0 ? "(" + this.printExprs(meta.params,", ") + ")" : "");
	}
	,printAccess: function(access) {
		switch(access._hx_index) {
		case 0:
			return "public";
		case 1:
			return "private";
		case 2:
			return "static";
		case 3:
			return "override";
		case 4:
			return "dynamic";
		case 5:
			return "inline";
		case 6:
			return "macro";
		case 7:
			return "final";
		case 8:
			return "extern";
		case 9:
			return "abstract";
		case 10:
			return "overload";
		case 11:
			return "enum";
		}
	}
	,printField: function(field) {
		var tmp = field.doc != null && field.doc != "" ? "/**\n" + this.tabs + this.tabString + StringTools.replace(field.doc,"\n","\n" + this.tabs + this.tabString) + "\n" + this.tabs + "**/\n" + this.tabs : "";
		var tmp1;
		if(field.meta != null && field.meta.length > 0) {
			var _this = field.meta;
			var f = $bind(this,this.printMetadata);
			var result = new Array(_this.length);
			var _g = 0;
			var _g1 = _this.length;
			while(_g < _g1) {
				var i = _g++;
				result[i] = f(_this[i]);
			}
			tmp1 = result.join("\n" + this.tabs) + ("\n" + this.tabs);
		} else {
			tmp1 = "";
		}
		var tmp2 = tmp + tmp1;
		var tmp;
		if(field.access != null && field.access.length > 0) {
			var access = field.access;
			var _this;
			if(Lambda.has(access,haxe_macro_Access.AFinal)) {
				var _g = [];
				var _g1 = 0;
				while(_g1 < access.length) {
					var v = access[_g1];
					++_g1;
					if(v._hx_index != 7) {
						_g.push(v);
					}
				}
				_this = _g.concat([haxe_macro_Access.AFinal]);
			} else {
				_this = access;
			}
			var f = $bind(this,this.printAccess);
			var result = new Array(_this.length);
			var _g = 0;
			var _g1 = _this.length;
			while(_g < _g1) {
				var i = _g++;
				result[i] = f(_this[i]);
			}
			tmp = result.join(" ") + " ";
		} else {
			tmp = "";
		}
		var tmp1 = tmp2 + tmp;
		var _g = field.kind;
		var tmp;
		switch(_g._hx_index) {
		case 0:
			tmp = (field.access != null && Lambda.has(field.access,haxe_macro_Access.AFinal) ? "" : "var ") + ("" + field.name) + this.opt(_g.t,$bind(this,this.printComplexType)," : ") + this.opt(_g.e,$bind(this,this.printExpr)," = ");
			break;
		case 1:
			tmp = "function " + field.name + this.printFunction(_g.f);
			break;
		case 2:
			tmp = "var " + field.name + "(" + _g.get + ", " + _g.set + ")" + this.opt(_g.t,$bind(this,this.printComplexType)," : ") + this.opt(_g.e,$bind(this,this.printExpr)," = ");
			break;
		}
		return tmp1 + tmp;
	}
	,printTypeParamDecl: function(tpd) {
		var tmp;
		if(tpd.meta != null && tpd.meta.length > 0) {
			var _this = tpd.meta;
			var f = $bind(this,this.printMetadata);
			var result = new Array(_this.length);
			var _g = 0;
			var _g1 = _this.length;
			while(_g < _g1) {
				var i = _g++;
				result[i] = f(_this[i]);
			}
			tmp = result.join(" ") + " ";
		} else {
			tmp = "";
		}
		var tmp1 = tmp + tpd.name;
		var tmp;
		if(tpd.params != null && tpd.params.length > 0) {
			var _this = tpd.params;
			var f = $bind(this,this.printTypeParamDecl);
			var result = new Array(_this.length);
			var _g = 0;
			var _g1 = _this.length;
			while(_g < _g1) {
				var i = _g++;
				result[i] = f(_this[i]);
			}
			tmp = "<" + result.join(", ") + ">";
		} else {
			tmp = "";
		}
		var tmp2 = tmp1 + tmp;
		var tmp;
		if(tpd.constraints != null && tpd.constraints.length > 0) {
			var _this = tpd.constraints;
			var f = $bind(this,this.printComplexType);
			var result = new Array(_this.length);
			var _g = 0;
			var _g1 = _this.length;
			while(_g < _g1) {
				var i = _g++;
				result[i] = f(_this[i]);
			}
			tmp = ":(" + result.join(" & ") + ")";
		} else {
			tmp = "";
		}
		return tmp2 + tmp + (tpd.defaultType != null ? "=" + this.printComplexType(tpd.defaultType) : "");
	}
	,printFunctionArg: function(arg) {
		return (arg.opt ? "?" : "") + arg.name + this.opt(arg.type,$bind(this,this.printComplexType),":") + this.opt(arg.value,$bind(this,this.printExpr)," = ");
	}
	,printFunction: function(func,kind) {
		var _g = func.args;
		var skipParentheses = _g.length == 1 && (_g[0].type == null && kind == haxe_macro_FunctionKind.FArrow);
		var tmp;
		if(func.params == null) {
			tmp = "";
		} else if(func.params.length > 0) {
			var _this = func.params;
			var f = $bind(this,this.printTypeParamDecl);
			var result = new Array(_this.length);
			var _g = 0;
			var _g1 = _this.length;
			while(_g < _g1) {
				var i = _g++;
				result[i] = f(_this[i]);
			}
			tmp = "<" + result.join(", ") + ">";
		} else {
			tmp = "";
		}
		var tmp1 = tmp + (skipParentheses ? "" : "(");
		var _this = func.args;
		var f = $bind(this,this.printFunctionArg);
		var result = new Array(_this.length);
		var _g = 0;
		var _g1 = _this.length;
		while(_g < _g1) {
			var i = _g++;
			result[i] = f(_this[i]);
		}
		return tmp1 + result.join(", ") + (skipParentheses ? "" : ")") + (kind == haxe_macro_FunctionKind.FArrow ? " ->" : "") + this.opt(func.ret,$bind(this,this.printComplexType),":") + this.opt(func.expr,$bind(this,this.printExpr)," ");
	}
	,printVar: function(v) {
		var s = v.name + this.opt(v.type,$bind(this,this.printComplexType),":") + this.opt(v.expr,$bind(this,this.printExpr)," = ");
		var _g = v.meta;
		if(_g == null) {
			return s;
		} else if(_g.length == 0) {
			return s;
		} else {
			var f = $bind(this,this.printMetadata);
			var result = new Array(_g.length);
			var _g1 = 0;
			var _g2 = _g.length;
			while(_g1 < _g2) {
				var i = _g1++;
				result[i] = f(_g[i]);
			}
			return result.join(" ") + " " + s;
		}
	}
	,printObjectFieldKey: function(of) {
		var _g = of.quotes;
		if(_g == null) {
			return of.field;
		} else {
			switch(_g._hx_index) {
			case 0:
				return of.field;
			case 1:
				return "\"" + of.field + "\"";
			}
		}
	}
	,printObjectField: function(of) {
		return "" + this.printObjectFieldKey(of) + " : " + Std.string(this.printExpr(of.expr));
	}
	,printExpr: function(e) {
		if(e == null) {
			return "#NULL";
		} else {
			var _g = e.expr;
			switch(_g._hx_index) {
			case 0:
				return this.printConstant(_g.c);
			case 1:
				return "" + Std.string(this.printExpr(_g.e1)) + "[" + Std.string(this.printExpr(_g.e2)) + "]";
			case 2:
				return "" + Std.string(this.printExpr(_g.e1)) + " " + this.printBinop(_g.op) + " " + Std.string(this.printExpr(_g.e2));
			case 3:
				var _ge = _g.e;
				var _gfield = _g.field;
				if(_g.kind == haxe_macro_EFieldKind.Safe) {
					return "" + Std.string(this.printExpr(_ge)) + "?." + _gfield;
				} else {
					return "" + Std.string(this.printExpr(_ge)) + "." + _gfield;
				}
				break;
			case 4:
				return "(" + Std.string(this.printExpr(_g.e)) + ")";
			case 5:
				var _gfields = _g.fields;
				var result = new Array(_gfields.length);
				var _g1 = 0;
				var _g2 = _gfields.length;
				while(_g1 < _g2) {
					var i = _g1++;
					result[i] = this.printObjectField(_gfields[i]);
				}
				return "{ " + result.join(", ") + " }";
			case 6:
				return "[" + this.printExprs(_g.values,", ") + "]";
			case 7:
				return "" + Std.string(this.printExpr(_g.e)) + "(" + this.printExprs(_g.params,", ") + ")";
			case 8:
				return "new " + this.printTypePath(_g.t) + "(" + this.printExprs(_g.params,", ") + ")";
			case 9:
				var _gop = _g.op;
				var _ge = _g.e;
				if(_g.postFix) {
					return this.printExpr(_ge) + this.printUnop(_gop);
				} else {
					return this.printUnop(_gop) + this.printExpr(_ge);
				}
				break;
			case 10:
				var _gvars = _g.vars;
				if(_gvars.length == 0) {
					return "var ";
				} else {
					var tmp = (_gvars[0].isStatic ? "static " : "") + (_gvars[0].isFinal ? "final " : "var ");
					var f = $bind(this,this.printVar);
					var result = new Array(_gvars.length);
					var _g1 = 0;
					var _g2 = _gvars.length;
					while(_g1 < _g2) {
						var i = _g1++;
						result[i] = f(_gvars[i]);
					}
					return tmp + result.join(", ");
				}
				break;
			case 11:
				var _gkind = _g.kind;
				var _gf = _g.f;
				if(_gkind == null) {
					return (_gkind != haxe_macro_FunctionKind.FArrow ? "function" : "") + this.printFunction(_gf,_gkind);
				} else if(_gkind._hx_index == 1) {
					return (_gkind.inlined ? "inline " : "") + ("function " + _gkind.name) + this.printFunction(_gf);
				} else {
					return (_gkind != haxe_macro_FunctionKind.FArrow ? "function" : "") + this.printFunction(_gf,_gkind);
				}
				break;
			case 12:
				var _gexprs = _g.exprs;
				if(_gexprs.length == 0) {
					return "{ }";
				} else {
					var old = this.tabs;
					this.tabs += this.tabString;
					var s = "{\n" + this.tabs + this.printExprs(_gexprs,";\n" + this.tabs);
					this.tabs = old;
					return s + (";\n" + this.tabs + "}");
				}
				break;
			case 13:
				return "for (" + this.printExpr(_g.it) + ") " + this.printExpr(_g.expr);
			case 14:
				var _gecond = _g.econd;
				var _geif = _g.eif;
				var _geelse = _g.eelse;
				if(_geelse == null) {
					return "if (" + this.printExpr(_gecond) + ") " + this.printExpr(_geif);
				} else {
					return "if (" + this.printExpr(_gecond) + ") " + this.printExpr(_geif) + " else " + this.printExpr(_geelse);
				}
				break;
			case 15:
				var _gecond = _g.econd;
				var _ge = _g.e;
				if(_g.normalWhile) {
					return "while (" + this.printExpr(_gecond) + ") " + this.printExpr(_ge);
				} else {
					return "do " + this.printExpr(_ge) + " while (" + this.printExpr(_gecond) + ")";
				}
				break;
			case 16:
				var _gcases = _g.cases;
				var _gedef = _g.edef;
				var old = this.tabs;
				this.tabs += this.tabString;
				var s = "switch " + this.printExpr(_g.e) + " {\n" + this.tabs;
				var result = new Array(_gcases.length);
				var _g1 = 0;
				var _g2 = _gcases.length;
				while(_g1 < _g2) {
					var i = _g1++;
					var c = _gcases[i];
					result[i] = "case " + this.printExprs(c.values,", ") + (c.guard != null ? " if (" + this.printExpr(c.guard) + "):" : ":") + (c.expr != null ? this.opt(c.expr,$bind(this,this.printExpr)) + ";" : "");
				}
				var s1 = s + result.join("\n" + this.tabs);
				if(_gedef != null) {
					s1 += "\n" + this.tabs + "default:" + (_gedef.expr == null ? "" : this.printExpr(_gedef) + ";");
				}
				this.tabs = old;
				return s1 + ("\n" + this.tabs + "}");
			case 17:
				var _gcatches = _g.catches;
				var tmp = "try " + this.printExpr(_g.e);
				var result = new Array(_gcatches.length);
				var _g1 = 0;
				var _g2 = _gcatches.length;
				while(_g1 < _g2) {
					var i = _g1++;
					var c = _gcatches[i];
					result[i] = " catch(" + c.name + (c.type == null ? "" : ":" + this.printComplexType(c.type)) + ") " + this.printExpr(c.expr);
				}
				return tmp + result.join("");
			case 18:
				return "return" + this.opt(_g.e,$bind(this,this.printExpr)," ");
			case 19:
				return "break";
			case 20:
				return "continue";
			case 21:
				return "untyped " + this.printExpr(_g.e);
			case 22:
				return "throw " + this.printExpr(_g.e);
			case 23:
				var _ge = _g.e;
				var _gt = _g.t;
				if(_gt != null) {
					return "cast(" + this.printExpr(_ge) + ", " + this.printComplexType(_gt) + ")";
				} else {
					return "cast " + this.printExpr(_ge);
				}
				break;
			case 24:
				return "#DISPLAY(" + this.printExpr(_g.e) + ")";
			case 25:
				return "" + this.printExpr(_g.econd) + " ? " + this.printExpr(_g.eif) + " : " + this.printExpr(_g.eelse);
			case 26:
				return "(" + this.printExpr(_g.e) + " : " + this.printComplexType(_g.t) + ")";
			case 27:
				var _gs = _g.s;
				var _ge = _g.e;
				if(_gs.name == ":implicitReturn") {
					var _gexpr = _ge.expr;
					if(_gexpr._hx_index == 18) {
						return this.printExpr(_gexpr.e);
					} else {
						return this.printMetadata(_gs) + " " + this.printExpr(_ge);
					}
				} else {
					return this.printMetadata(_gs) + " " + this.printExpr(_ge);
				}
				break;
			case 28:
				return "" + this.printExpr(_g.e) + " is " + this.printComplexType(_g.t);
			}
		}
	}
	,printExprs: function(el,sep) {
		var f = $bind(this,this.printExpr);
		var result = new Array(el.length);
		var _g = 0;
		var _g1 = el.length;
		while(_g < _g1) {
			var i = _g++;
			result[i] = f(el[i]);
		}
		return result.join(sep);
	}
	,printExtension: function(tpl,fields) {
		var tmp = "{\n" + this.tabs + ">";
		var f = $bind(this,this.printTypePath);
		var result = new Array(tpl.length);
		var _g = 0;
		var _g1 = tpl.length;
		while(_g < _g1) {
			var i = _g++;
			result[i] = f(tpl[i]);
		}
		var tmp1 = tmp + result.join(",\n" + this.tabs + ">") + ",";
		var tmp;
		if(fields.length > 0) {
			var tmp2 = "\n" + this.tabs;
			var f = $bind(this,this.printField);
			var result = new Array(fields.length);
			var _g = 0;
			var _g1 = fields.length;
			while(_g < _g1) {
				var i = _g++;
				result[i] = f(fields[i]);
			}
			tmp = tmp2 + result.join(";\n" + this.tabs) + ";\n}";
		} else {
			tmp = "\n}";
		}
		return tmp1 + tmp;
	}
	,printStructure: function(fields) {
		if(fields.length == 0) {
			return "{ }";
		} else {
			var tmp = "{\n" + this.tabs;
			var f = $bind(this,this.printField);
			var result = new Array(fields.length);
			var _g = 0;
			var _g1 = fields.length;
			while(_g < _g1) {
				var i = _g++;
				result[i] = f(fields[i]);
			}
			return tmp + result.join(";\n" + this.tabs) + ";\n}";
		}
	}
	,printTypeDefinition: function(t,printPackage) {
		if(printPackage == null) {
			printPackage = true;
		}
		var old = this.tabs;
		this.tabs = this.tabString;
		var str;
		if(t == null) {
			str = "#NULL";
		} else {
			var str1 = (printPackage && t.pack.length > 0 && t.pack[0] != "" ? "package " + t.pack.join(".") + ";\n" : "") + (t.doc != null && t.doc != "" ? "/**\n" + this.tabString + StringTools.replace(t.doc,"\n","\n" + this.tabString) + "\n**/\n" : "");
			var str2;
			if(t.meta != null && t.meta.length > 0) {
				var _this = t.meta;
				var f = $bind(this,this.printMetadata);
				var result = new Array(_this.length);
				var _g = 0;
				var _g1 = _this.length;
				while(_g < _g1) {
					var i = _g++;
					result[i] = f(_this[i]);
				}
				str2 = result.join(" ") + " ";
			} else {
				str2 = "";
			}
			var str3 = str1 + str2 + (t.isExtern ? "extern " : "");
			var _g = t.kind;
			var str1;
			switch(_g._hx_index) {
			case 0:
				var str2 = "enum " + t.name;
				var str4;
				if(t.params != null && t.params.length > 0) {
					var _this = t.params;
					var f = $bind(this,this.printTypeParamDecl);
					var result = new Array(_this.length);
					var _g1 = 0;
					var _g2 = _this.length;
					while(_g1 < _g2) {
						var i = _g1++;
						result[i] = f(_this[i]);
					}
					str4 = "<" + result.join(", ") + ">";
				} else {
					str4 = "";
				}
				var str5 = str2 + str4 + " {\n";
				var _g1 = [];
				var _g2 = 0;
				var _g3 = t.fields;
				while(_g2 < _g3.length) {
					var field = _g3[_g2];
					++_g2;
					var str2 = this.tabs + (field.doc != null && field.doc != "" ? "/**\n" + this.tabs + this.tabString + StringTools.replace(field.doc,"\n","\n" + this.tabs + this.tabString) + "\n" + this.tabs + "**/\n" + this.tabs : "");
					var str4;
					if(field.meta != null && field.meta.length > 0) {
						var _this = field.meta;
						var f = $bind(this,this.printMetadata);
						var result = new Array(_this.length);
						var _g4 = 0;
						var _g5 = _this.length;
						while(_g4 < _g5) {
							var i = _g4++;
							result[i] = f(_this[i]);
						}
						str4 = result.join(" ") + " ";
					} else {
						str4 = "";
					}
					var str6 = str2 + str4;
					var _g6 = field.kind;
					var str7;
					switch(_g6._hx_index) {
					case 0:
						str7 = field.name + this.opt(_g6.t,$bind(this,this.printComplexType),":");
						break;
					case 1:
						str7 = field.name + this.printFunction(_g6.f);
						break;
					case 2:
						throw haxe_Exception.thrown("FProp is invalid for TDEnum.");
					}
					_g1.push(str6 + str7 + ";");
				}
				str1 = str5 + _g1.join("\n") + "\n}";
				break;
			case 1:
				var str2 = "typedef " + t.name;
				var str4;
				if(t.params != null && t.params.length > 0) {
					var _this = t.params;
					var f = $bind(this,this.printTypeParamDecl);
					var result = new Array(_this.length);
					var _g1 = 0;
					var _g2 = _this.length;
					while(_g1 < _g2) {
						var i = _g1++;
						result[i] = f(_this[i]);
					}
					str4 = "<" + result.join(", ") + ">";
				} else {
					str4 = "";
				}
				var str5 = str2 + str4 + " = {\n";
				var _g1 = [];
				var _g2 = 0;
				var _g3 = t.fields;
				while(_g2 < _g3.length) {
					var f = _g3[_g2];
					++_g2;
					_g1.push(this.tabs + this.printField(f) + ";");
				}
				str1 = str5 + _g1.join("\n") + "\n}";
				break;
			case 2:
				var _gsuperClass = _g.superClass;
				var _ginterfaces = _g.interfaces;
				var _gisInterface = _g.isInterface;
				var str2 = (_g.isFinal ? "final " : "") + (_g.isAbstract ? "abstract " : "") + (_gisInterface ? "interface " : "class ") + t.name;
				var str4;
				if(t.params != null && t.params.length > 0) {
					var _this = t.params;
					var f = $bind(this,this.printTypeParamDecl);
					var result = new Array(_this.length);
					var _g1 = 0;
					var _g2 = _this.length;
					while(_g1 < _g2) {
						var i = _g1++;
						result[i] = f(_this[i]);
					}
					str4 = "<" + result.join(", ") + ">";
				} else {
					str4 = "";
				}
				var str5 = str2 + str4 + (_gsuperClass != null ? " extends " + this.printTypePath(_gsuperClass) : "");
				var str2;
				if(_ginterfaces != null) {
					var str4;
					if(_gisInterface) {
						var _g1 = [];
						var _g2 = 0;
						while(_g2 < _ginterfaces.length) {
							var tp = _ginterfaces[_g2];
							++_g2;
							_g1.push(" extends " + this.printTypePath(tp));
						}
						str4 = _g1;
					} else {
						var _g1 = [];
						var _g2 = 0;
						while(_g2 < _ginterfaces.length) {
							var tp = _ginterfaces[_g2];
							++_g2;
							_g1.push(" implements " + this.printTypePath(tp));
						}
						str4 = _g1;
					}
					str2 = str4.join("");
				} else {
					str2 = "";
				}
				var str4 = str5 + str2 + " {\n";
				var _g1 = [];
				var _g2 = 0;
				var _g3 = t.fields;
				while(_g2 < _g3.length) {
					var f = _g3[_g2];
					++_g2;
					_g1.push(this.tabs + this.printFieldWithDelimiter(f));
				}
				str1 = str4 + _g1.join("\n") + "\n}";
				break;
			case 3:
				var _gt = _g.t;
				var str2 = "typedef " + t.name;
				var str4;
				if(t.params != null && t.params.length > 0) {
					var _this = t.params;
					var f = $bind(this,this.printTypeParamDecl);
					var result = new Array(_this.length);
					var _g1 = 0;
					var _g2 = _this.length;
					while(_g1 < _g2) {
						var i = _g1++;
						result[i] = f(_this[i]);
					}
					str4 = "<" + result.join(", ") + ">";
				} else {
					str4 = "";
				}
				var str5 = str2 + str4 + " = ";
				var str2;
				switch(_gt._hx_index) {
				case 2:
					str2 = this.printStructure(_gt.fields);
					break;
				case 4:
					str2 = this.printExtension(_gt.p,_gt.fields);
					break;
				default:
					str2 = this.printComplexType(_gt);
				}
				str1 = str5 + str2 + ";";
				break;
			case 4:
				var _gtthis = _g.tthis;
				var _gflags = _g.flags;
				var _gfrom = _g.from;
				var _gto = _g.to;
				var from = _gfrom == null ? [] : _gfrom.slice();
				var to = _gto == null ? [] : _gto.slice();
				var isEnum = false;
				if(_gflags != null) {
					var _g1 = 0;
					while(_g1 < _gflags.length) {
						var flag = _gflags[_g1];
						++_g1;
						switch(flag._hx_index) {
						case 0:
							isEnum = true;
							break;
						case 1:
							from.push(flag.ct);
							break;
						case 2:
							to.push(flag.ct);
							break;
						}
					}
				}
				var str2 = (isEnum ? "enum " : "") + "abstract " + t.name;
				var str4;
				if(t.params != null && t.params.length > 0) {
					var _this = t.params;
					var f = $bind(this,this.printTypeParamDecl);
					var result = new Array(_this.length);
					var _g1 = 0;
					var _g2 = _this.length;
					while(_g1 < _g2) {
						var i = _g1++;
						result[i] = f(_this[i]);
					}
					str4 = "<" + result.join(", ") + ">";
				} else {
					str4 = "";
				}
				var str5 = str2 + str4 + (_gtthis == null ? "" : "(" + this.printComplexType(_gtthis) + ")");
				var _g1 = [];
				var _g2 = 0;
				while(_g2 < from.length) {
					var f = from[_g2];
					++_g2;
					_g1.push(" from " + this.printComplexType(f));
				}
				var str2 = str5 + _g1.join("");
				var _g1 = [];
				var _g2 = 0;
				while(_g2 < to.length) {
					var f = to[_g2];
					++_g2;
					_g1.push(" to " + this.printComplexType(f));
				}
				var str4 = str2 + _g1.join("") + " {\n";
				var _g1 = [];
				var _g2 = 0;
				var _g3 = t.fields;
				while(_g2 < _g3.length) {
					var f = _g3[_g2];
					++_g2;
					_g1.push(this.tabs + this.printFieldWithDelimiter(f));
				}
				str1 = str4 + _g1.join("\n") + "\n}";
				break;
			case 5:
				var _gkind = _g.kind;
				var _gaccess = _g.access;
				this.tabs = old;
				var str2;
				if(_gaccess != null && _gaccess.length > 0) {
					var f = $bind(this,this.printAccess);
					var result = new Array(_gaccess.length);
					var _g = 0;
					var _g1 = _gaccess.length;
					while(_g < _g1) {
						var i = _g++;
						result[i] = f(_gaccess[i]);
					}
					str2 = result.join(" ") + " ";
				} else {
					str2 = "";
				}
				var str4;
				switch(_gkind._hx_index) {
				case 0:
					str4 = (_gaccess != null && Lambda.has(_gaccess,haxe_macro_Access.AFinal) ? "" : "var ") + ("" + t.name) + this.opt(_gkind.t,$bind(this,this.printComplexType)," : ") + this.opt(_gkind.e,$bind(this,this.printExpr)," = ") + ";";
					break;
				case 1:
					var _gf = _gkind.f;
					var str5 = "function " + t.name + this.printFunction(_gf);
					var _g = _gf.expr;
					str4 = str5 + (_g == null ? ";" : _g.expr._hx_index == 12 ? "" : ";");
					break;
				case 2:
					str4 = "var " + t.name + "(" + _gkind.get + ", " + _gkind.set + ")" + this.opt(_gkind.t,$bind(this,this.printComplexType)," : ") + this.opt(_gkind.e,$bind(this,this.printExpr)," = ") + ";";
					break;
				}
				str1 = str2 + str4;
				break;
			}
			str = str3 + str1;
		}
		this.tabs = old;
		return str;
	}
	,printFieldWithDelimiter: function(f) {
		var tmp = this.printField(f);
		var _g = f.kind;
		var tmp1;
		switch(_g._hx_index) {
		case 0:
			tmp1 = ";";
			break;
		case 1:
			var _gexpr = _g.f.expr;
			tmp1 = _gexpr == null ? ";" : _gexpr.expr._hx_index == 12 ? "" : ";";
			break;
		case 2:
			tmp1 = ";";
			break;
		}
		return tmp + tmp1;
	}
	,opt: function(v,f,prefix) {
		if(prefix == null) {
			prefix = "";
		}
		if(v == null) {
			return "";
		} else {
			return prefix + f(v);
		}
	}
	,printExprWithPositions: function(e) {
		var _gthis = this;
		var buffer_b = "";
		var format4 = function(i) {
			return StringTools.lpad(i == null ? "null" : "" + i," ",4);
		};
		var loop = null;
		loop = function(tabs,e) {
			while(true) {
				var _ge = [e];
				var _gtabs = [tabs];
				var add = (function(_ge,_gtabs) {
					return function(s,p) {
						if(p == null) {
							p = _ge[0].pos;
						}
						var p = _ge[0].pos;
						buffer_b += Std.string("" + format4(p.min) + "-" + format4(p.max) + " " + _gtabs[0] + s + "\n");
					};
				})(_ge,_gtabs);
				var loopI = (function(_gtabs) {
					return function(e) {
						loop(_gtabs[0] + _gthis.tabString,e);
					};
				})(_gtabs);
				var _g = _ge[0].expr;
				switch(_g._hx_index) {
				case 0:
					add(_gthis.printConstant(_g.c));
					break;
				case 1:
					add("EArray");
					loopI(_g.e1);
					loopI(_g.e2);
					break;
				case 2:
					add("EBinop " + _gthis.printBinop(_g.op));
					loopI(_g.e1);
					loopI(_g.e2);
					break;
				case 3:
					var _gkind = _g.kind;
					var kind = _gkind;
					if(_gkind == null) {
						kind = haxe_macro_EFieldKind.Normal;
					}
					add("EField " + _g.field + " (" + $hxEnums[kind.__enum__].__constructs__[kind._hx_index]._hx_name + ")");
					loopI(_g.e);
					break;
				case 4:
					add("EParenthesis");
					loopI(_g.e);
					break;
				case 5:
					var _gfields = _g.fields;
					add("EObjectDecl");
					var _g1 = 0;
					while(_g1 < _gfields.length) {
						var field = _gfields[_g1];
						++_g1;
						add(field.field);
						loopI(field.expr);
					}
					break;
				case 6:
					add("EArrayDecl");
					Lambda.iter(_g.values,loopI);
					break;
				case 7:
					add("ECall");
					loopI(_g.e);
					Lambda.iter(_g.params,loopI);
					break;
				case 8:
					add("ENew " + _gthis.printTypePath(_g.t));
					Lambda.iter(_g.params,loopI);
					break;
				case 9:
					add("EUnop " + _gthis.printUnop(_g.op));
					loopI(_g.e);
					break;
				case 10:
					var _gvars = _g.vars;
					add("EVars");
					var _g2 = 0;
					while(_g2 < _gvars.length) {
						var v = _gvars[_g2];
						++_g2;
						if(v.expr != null) {
							add(v.name);
							loopI(v.expr);
						}
					}
					break;
				case 11:
					var _gf = _g.f;
					add("EFunction");
					if(_gf.expr != null) {
						loopI(_gf.expr);
					}
					break;
				case 12:
					add("EBlock");
					Lambda.iter(_g.exprs,loopI);
					break;
				case 13:
					add("EFor");
					loopI(_g.it);
					loopI(_g.expr);
					break;
				case 14:
					var _geelse = _g.eelse;
					add("EIf");
					loopI(_g.econd);
					loopI(_g.eif);
					if(_geelse != null) {
						loopI(_geelse);
					}
					break;
				case 15:
					add("EWhile");
					loopI(_g.econd);
					loopI(_g.e);
					break;
				case 16:
					var _gcases = _g.cases;
					var _gedef = _g.edef;
					add("ESwitch");
					loopI(_g.e);
					var _g3 = 0;
					while(_g3 < _gcases.length) {
						var c = _gcases[_g3];
						++_g3;
						var _g4 = 0;
						var _g5 = c.values;
						while(_g4 < _g5.length) {
							var pat = _g5[_g4];
							++_g4;
							loop(_gtabs[0] + _gthis.tabString + _gthis.tabString,pat);
						}
						if(c.expr != null) {
							loop(_gtabs[0] + _gthis.tabString + _gthis.tabString + _gthis.tabString,c.expr);
						}
					}
					if(_gedef != null) {
						tabs = _gtabs[0] + _gthis.tabString + _gthis.tabString + _gthis.tabString;
						e = _gedef;
						continue;
					}
					break;
				case 17:
					var _gcatches = _g.catches;
					add("ETry");
					loopI(_g.e);
					var _g6 = 0;
					while(_g6 < _gcatches.length) {
						var c1 = _gcatches[_g6];
						++_g6;
						loop(_gtabs[0] + _gthis.tabString + _gthis.tabString,c1.expr);
					}
					break;
				case 18:
					var _ge1 = _g.e;
					add("EReturn");
					if(_ge1 != null) {
						loopI(_ge1);
					}
					break;
				case 19:
					add("EBreak");
					break;
				case 20:
					add("EContinue");
					break;
				case 21:
					add("EUntyped");
					loopI(_g.e);
					break;
				case 22:
					add("EThrow");
					loopI(_g.e);
					break;
				case 23:
					add("ECast");
					loopI(_g.e);
					break;
				case 24:
					add("EDisplay");
					loopI(_g.e);
					break;
				case 25:
					add("ETernary");
					loopI(_g.econd);
					loopI(_g.eif);
					loopI(_g.eelse);
					break;
				case 26:
					add("ECheckType");
					loopI(_g.e);
					break;
				case 27:
					add("EMeta " + _gthis.printMetadata(_g.s));
					loopI(_g.e);
					break;
				case 28:
					add("EIs");
					loopI(_g.e);
					break;
				}
				return;
			}
		};
		loop("",e);
		return buffer_b;
	}
	,__class__: haxe_macro_Printer
};
var haxe_macro_Type = $hxEnums["haxe.macro.Type"] = { __ename__:"haxe.macro.Type",__constructs__:null
	,TMono: ($_=function(t) { return {_hx_index:0,t:t,__enum__:"haxe.macro.Type",toString:$estr,__params__:function(){ return [this.t];}}; },$_._hx_name="TMono",$_)
	,TEnum: ($_=function(t,params) { return {_hx_index:1,t:t,params:params,__enum__:"haxe.macro.Type",toString:$estr,__params__:function(){ return [this.t,this.params];}}; },$_._hx_name="TEnum",$_)
	,TInst: ($_=function(t,params) { return {_hx_index:2,t:t,params:params,__enum__:"haxe.macro.Type",toString:$estr,__params__:function(){ return [this.t,this.params];}}; },$_._hx_name="TInst",$_)
	,TType: ($_=function(t,params) { return {_hx_index:3,t:t,params:params,__enum__:"haxe.macro.Type",toString:$estr,__params__:function(){ return [this.t,this.params];}}; },$_._hx_name="TType",$_)
	,TFun: ($_=function(args,ret) { return {_hx_index:4,args:args,ret:ret,__enum__:"haxe.macro.Type",toString:$estr,__params__:function(){ return [this.args,this.ret];}}; },$_._hx_name="TFun",$_)
	,TAnonymous: ($_=function(a) { return {_hx_index:5,a:a,__enum__:"haxe.macro.Type",toString:$estr,__params__:function(){ return [this.a];}}; },$_._hx_name="TAnonymous",$_)
	,TDynamic: ($_=function(t) { return {_hx_index:6,t:t,__enum__:"haxe.macro.Type",toString:$estr,__params__:function(){ return [this.t];}}; },$_._hx_name="TDynamic",$_)
	,TLazy: ($_=function(f) { return {_hx_index:7,f:f,__enum__:"haxe.macro.Type",toString:$estr,__params__:function(){ return [this.f];}}; },$_._hx_name="TLazy",$_)
	,TAbstract: ($_=function(t,params) { return {_hx_index:8,t:t,params:params,__enum__:"haxe.macro.Type",toString:$estr,__params__:function(){ return [this.t,this.params];}}; },$_._hx_name="TAbstract",$_)
};
haxe_macro_Type.__constructs__ = [haxe_macro_Type.TMono,haxe_macro_Type.TEnum,haxe_macro_Type.TInst,haxe_macro_Type.TType,haxe_macro_Type.TFun,haxe_macro_Type.TAnonymous,haxe_macro_Type.TDynamic,haxe_macro_Type.TLazy,haxe_macro_Type.TAbstract];
haxe_macro_Type.__empty_constructs__ = [];
var haxe_macro_AnonStatus = $hxEnums["haxe.macro.AnonStatus"] = { __ename__:"haxe.macro.AnonStatus",__constructs__:null
	,AClosed: {_hx_name:"AClosed",_hx_index:0,__enum__:"haxe.macro.AnonStatus",toString:$estr}
	,AOpened: {_hx_name:"AOpened",_hx_index:1,__enum__:"haxe.macro.AnonStatus",toString:$estr}
	,AConst: {_hx_name:"AConst",_hx_index:2,__enum__:"haxe.macro.AnonStatus",toString:$estr}
	,AExtend: ($_=function(tl) { return {_hx_index:3,tl:tl,__enum__:"haxe.macro.AnonStatus",toString:$estr,__params__:function(){ return [this.tl];}}; },$_._hx_name="AExtend",$_)
	,AClassStatics: ($_=function(t) { return {_hx_index:4,t:t,__enum__:"haxe.macro.AnonStatus",toString:$estr,__params__:function(){ return [this.t];}}; },$_._hx_name="AClassStatics",$_)
	,AEnumStatics: ($_=function(t) { return {_hx_index:5,t:t,__enum__:"haxe.macro.AnonStatus",toString:$estr,__params__:function(){ return [this.t];}}; },$_._hx_name="AEnumStatics",$_)
	,AAbstractStatics: ($_=function(t) { return {_hx_index:6,t:t,__enum__:"haxe.macro.AnonStatus",toString:$estr,__params__:function(){ return [this.t];}}; },$_._hx_name="AAbstractStatics",$_)
};
haxe_macro_AnonStatus.__constructs__ = [haxe_macro_AnonStatus.AClosed,haxe_macro_AnonStatus.AOpened,haxe_macro_AnonStatus.AConst,haxe_macro_AnonStatus.AExtend,haxe_macro_AnonStatus.AClassStatics,haxe_macro_AnonStatus.AEnumStatics,haxe_macro_AnonStatus.AAbstractStatics];
haxe_macro_AnonStatus.__empty_constructs__ = [haxe_macro_AnonStatus.AClosed,haxe_macro_AnonStatus.AOpened,haxe_macro_AnonStatus.AConst];
var haxe_macro_ClassKind = $hxEnums["haxe.macro.ClassKind"] = { __ename__:"haxe.macro.ClassKind",__constructs__:null
	,KNormal: {_hx_name:"KNormal",_hx_index:0,__enum__:"haxe.macro.ClassKind",toString:$estr}
	,KTypeParameter: ($_=function(constraints) { return {_hx_index:1,constraints:constraints,__enum__:"haxe.macro.ClassKind",toString:$estr,__params__:function(){ return [this.constraints];}}; },$_._hx_name="KTypeParameter",$_)
	,KModuleFields: ($_=function(module) { return {_hx_index:2,module:module,__enum__:"haxe.macro.ClassKind",toString:$estr,__params__:function(){ return [this.module];}}; },$_._hx_name="KModuleFields",$_)
	,KExpr: ($_=function(expr) { return {_hx_index:3,expr:expr,__enum__:"haxe.macro.ClassKind",toString:$estr,__params__:function(){ return [this.expr];}}; },$_._hx_name="KExpr",$_)
	,KGeneric: {_hx_name:"KGeneric",_hx_index:4,__enum__:"haxe.macro.ClassKind",toString:$estr}
	,KGenericInstance: ($_=function(cl,params) { return {_hx_index:5,cl:cl,params:params,__enum__:"haxe.macro.ClassKind",toString:$estr,__params__:function(){ return [this.cl,this.params];}}; },$_._hx_name="KGenericInstance",$_)
	,KMacroType: {_hx_name:"KMacroType",_hx_index:6,__enum__:"haxe.macro.ClassKind",toString:$estr}
	,KAbstractImpl: ($_=function(a) { return {_hx_index:7,a:a,__enum__:"haxe.macro.ClassKind",toString:$estr,__params__:function(){ return [this.a];}}; },$_._hx_name="KAbstractImpl",$_)
	,KGenericBuild: {_hx_name:"KGenericBuild",_hx_index:8,__enum__:"haxe.macro.ClassKind",toString:$estr}
};
haxe_macro_ClassKind.__constructs__ = [haxe_macro_ClassKind.KNormal,haxe_macro_ClassKind.KTypeParameter,haxe_macro_ClassKind.KModuleFields,haxe_macro_ClassKind.KExpr,haxe_macro_ClassKind.KGeneric,haxe_macro_ClassKind.KGenericInstance,haxe_macro_ClassKind.KMacroType,haxe_macro_ClassKind.KAbstractImpl,haxe_macro_ClassKind.KGenericBuild];
haxe_macro_ClassKind.__empty_constructs__ = [haxe_macro_ClassKind.KNormal,haxe_macro_ClassKind.KGeneric,haxe_macro_ClassKind.KMacroType,haxe_macro_ClassKind.KGenericBuild];
var haxe_macro_FieldKind = $hxEnums["haxe.macro.FieldKind"] = { __ename__:"haxe.macro.FieldKind",__constructs__:null
	,FVar: ($_=function(read,write) { return {_hx_index:0,read:read,write:write,__enum__:"haxe.macro.FieldKind",toString:$estr,__params__:function(){ return [this.read,this.write];}}; },$_._hx_name="FVar",$_)
	,FMethod: ($_=function(k) { return {_hx_index:1,k:k,__enum__:"haxe.macro.FieldKind",toString:$estr,__params__:function(){ return [this.k];}}; },$_._hx_name="FMethod",$_)
};
haxe_macro_FieldKind.__constructs__ = [haxe_macro_FieldKind.FVar,haxe_macro_FieldKind.FMethod];
haxe_macro_FieldKind.__empty_constructs__ = [];
var haxe_macro_VarAccess = $hxEnums["haxe.macro.VarAccess"] = { __ename__:"haxe.macro.VarAccess",__constructs__:null
	,AccNormal: {_hx_name:"AccNormal",_hx_index:0,__enum__:"haxe.macro.VarAccess",toString:$estr}
	,AccNo: {_hx_name:"AccNo",_hx_index:1,__enum__:"haxe.macro.VarAccess",toString:$estr}
	,AccNever: {_hx_name:"AccNever",_hx_index:2,__enum__:"haxe.macro.VarAccess",toString:$estr}
	,AccResolve: {_hx_name:"AccResolve",_hx_index:3,__enum__:"haxe.macro.VarAccess",toString:$estr}
	,AccCall: {_hx_name:"AccCall",_hx_index:4,__enum__:"haxe.macro.VarAccess",toString:$estr}
	,AccInline: {_hx_name:"AccInline",_hx_index:5,__enum__:"haxe.macro.VarAccess",toString:$estr}
	,AccRequire: ($_=function(r,msg) { return {_hx_index:6,r:r,msg:msg,__enum__:"haxe.macro.VarAccess",toString:$estr,__params__:function(){ return [this.r,this.msg];}}; },$_._hx_name="AccRequire",$_)
	,AccCtor: {_hx_name:"AccCtor",_hx_index:7,__enum__:"haxe.macro.VarAccess",toString:$estr}
};
haxe_macro_VarAccess.__constructs__ = [haxe_macro_VarAccess.AccNormal,haxe_macro_VarAccess.AccNo,haxe_macro_VarAccess.AccNever,haxe_macro_VarAccess.AccResolve,haxe_macro_VarAccess.AccCall,haxe_macro_VarAccess.AccInline,haxe_macro_VarAccess.AccRequire,haxe_macro_VarAccess.AccCtor];
haxe_macro_VarAccess.__empty_constructs__ = [haxe_macro_VarAccess.AccNormal,haxe_macro_VarAccess.AccNo,haxe_macro_VarAccess.AccNever,haxe_macro_VarAccess.AccResolve,haxe_macro_VarAccess.AccCall,haxe_macro_VarAccess.AccInline,haxe_macro_VarAccess.AccCtor];
var haxe_macro_MethodKind = $hxEnums["haxe.macro.MethodKind"] = { __ename__:"haxe.macro.MethodKind",__constructs__:null
	,MethNormal: {_hx_name:"MethNormal",_hx_index:0,__enum__:"haxe.macro.MethodKind",toString:$estr}
	,MethInline: {_hx_name:"MethInline",_hx_index:1,__enum__:"haxe.macro.MethodKind",toString:$estr}
	,MethDynamic: {_hx_name:"MethDynamic",_hx_index:2,__enum__:"haxe.macro.MethodKind",toString:$estr}
	,MethMacro: {_hx_name:"MethMacro",_hx_index:3,__enum__:"haxe.macro.MethodKind",toString:$estr}
};
haxe_macro_MethodKind.__constructs__ = [haxe_macro_MethodKind.MethNormal,haxe_macro_MethodKind.MethInline,haxe_macro_MethodKind.MethDynamic,haxe_macro_MethodKind.MethMacro];
haxe_macro_MethodKind.__empty_constructs__ = [haxe_macro_MethodKind.MethNormal,haxe_macro_MethodKind.MethInline,haxe_macro_MethodKind.MethDynamic,haxe_macro_MethodKind.MethMacro];
var haxe_macro_TConstant = $hxEnums["haxe.macro.TConstant"] = { __ename__:"haxe.macro.TConstant",__constructs__:null
	,TInt: ($_=function(i) { return {_hx_index:0,i:i,__enum__:"haxe.macro.TConstant",toString:$estr,__params__:function(){ return [this.i];}}; },$_._hx_name="TInt",$_)
	,TFloat: ($_=function(s) { return {_hx_index:1,s:s,__enum__:"haxe.macro.TConstant",toString:$estr,__params__:function(){ return [this.s];}}; },$_._hx_name="TFloat",$_)
	,TString: ($_=function(s) { return {_hx_index:2,s:s,__enum__:"haxe.macro.TConstant",toString:$estr,__params__:function(){ return [this.s];}}; },$_._hx_name="TString",$_)
	,TBool: ($_=function(b) { return {_hx_index:3,b:b,__enum__:"haxe.macro.TConstant",toString:$estr,__params__:function(){ return [this.b];}}; },$_._hx_name="TBool",$_)
	,TNull: {_hx_name:"TNull",_hx_index:4,__enum__:"haxe.macro.TConstant",toString:$estr}
	,TThis: {_hx_name:"TThis",_hx_index:5,__enum__:"haxe.macro.TConstant",toString:$estr}
	,TSuper: {_hx_name:"TSuper",_hx_index:6,__enum__:"haxe.macro.TConstant",toString:$estr}
};
haxe_macro_TConstant.__constructs__ = [haxe_macro_TConstant.TInt,haxe_macro_TConstant.TFloat,haxe_macro_TConstant.TString,haxe_macro_TConstant.TBool,haxe_macro_TConstant.TNull,haxe_macro_TConstant.TThis,haxe_macro_TConstant.TSuper];
haxe_macro_TConstant.__empty_constructs__ = [haxe_macro_TConstant.TNull,haxe_macro_TConstant.TThis,haxe_macro_TConstant.TSuper];
var haxe_macro_ModuleType = $hxEnums["haxe.macro.ModuleType"] = { __ename__:"haxe.macro.ModuleType",__constructs__:null
	,TClassDecl: ($_=function(c) { return {_hx_index:0,c:c,__enum__:"haxe.macro.ModuleType",toString:$estr,__params__:function(){ return [this.c];}}; },$_._hx_name="TClassDecl",$_)
	,TEnumDecl: ($_=function(e) { return {_hx_index:1,e:e,__enum__:"haxe.macro.ModuleType",toString:$estr,__params__:function(){ return [this.e];}}; },$_._hx_name="TEnumDecl",$_)
	,TTypeDecl: ($_=function(t) { return {_hx_index:2,t:t,__enum__:"haxe.macro.ModuleType",toString:$estr,__params__:function(){ return [this.t];}}; },$_._hx_name="TTypeDecl",$_)
	,TAbstract: ($_=function(a) { return {_hx_index:3,a:a,__enum__:"haxe.macro.ModuleType",toString:$estr,__params__:function(){ return [this.a];}}; },$_._hx_name="TAbstract",$_)
};
haxe_macro_ModuleType.__constructs__ = [haxe_macro_ModuleType.TClassDecl,haxe_macro_ModuleType.TEnumDecl,haxe_macro_ModuleType.TTypeDecl,haxe_macro_ModuleType.TAbstract];
haxe_macro_ModuleType.__empty_constructs__ = [];
var haxe_macro_FieldAccess = $hxEnums["haxe.macro.FieldAccess"] = { __ename__:"haxe.macro.FieldAccess",__constructs__:null
	,FInstance: ($_=function(c,params,cf) { return {_hx_index:0,c:c,params:params,cf:cf,__enum__:"haxe.macro.FieldAccess",toString:$estr,__params__:function(){ return [this.c,this.params,this.cf];}}; },$_._hx_name="FInstance",$_)
	,FStatic: ($_=function(c,cf) { return {_hx_index:1,c:c,cf:cf,__enum__:"haxe.macro.FieldAccess",toString:$estr,__params__:function(){ return [this.c,this.cf];}}; },$_._hx_name="FStatic",$_)
	,FAnon: ($_=function(cf) { return {_hx_index:2,cf:cf,__enum__:"haxe.macro.FieldAccess",toString:$estr,__params__:function(){ return [this.cf];}}; },$_._hx_name="FAnon",$_)
	,FDynamic: ($_=function(s) { return {_hx_index:3,s:s,__enum__:"haxe.macro.FieldAccess",toString:$estr,__params__:function(){ return [this.s];}}; },$_._hx_name="FDynamic",$_)
	,FClosure: ($_=function(c,cf) { return {_hx_index:4,c:c,cf:cf,__enum__:"haxe.macro.FieldAccess",toString:$estr,__params__:function(){ return [this.c,this.cf];}}; },$_._hx_name="FClosure",$_)
	,FEnum: ($_=function(e,ef) { return {_hx_index:5,e:e,ef:ef,__enum__:"haxe.macro.FieldAccess",toString:$estr,__params__:function(){ return [this.e,this.ef];}}; },$_._hx_name="FEnum",$_)
};
haxe_macro_FieldAccess.__constructs__ = [haxe_macro_FieldAccess.FInstance,haxe_macro_FieldAccess.FStatic,haxe_macro_FieldAccess.FAnon,haxe_macro_FieldAccess.FDynamic,haxe_macro_FieldAccess.FClosure,haxe_macro_FieldAccess.FEnum];
haxe_macro_FieldAccess.__empty_constructs__ = [];
var haxe_macro_TypedExprDef = $hxEnums["haxe.macro.TypedExprDef"] = { __ename__:"haxe.macro.TypedExprDef",__constructs__:null
	,TConst: ($_=function(c) { return {_hx_index:0,c:c,__enum__:"haxe.macro.TypedExprDef",toString:$estr,__params__:function(){ return [this.c];}}; },$_._hx_name="TConst",$_)
	,TLocal: ($_=function(v) { return {_hx_index:1,v:v,__enum__:"haxe.macro.TypedExprDef",toString:$estr,__params__:function(){ return [this.v];}}; },$_._hx_name="TLocal",$_)
	,TArray: ($_=function(e1,e2) { return {_hx_index:2,e1:e1,e2:e2,__enum__:"haxe.macro.TypedExprDef",toString:$estr,__params__:function(){ return [this.e1,this.e2];}}; },$_._hx_name="TArray",$_)
	,TBinop: ($_=function(op,e1,e2) { return {_hx_index:3,op:op,e1:e1,e2:e2,__enum__:"haxe.macro.TypedExprDef",toString:$estr,__params__:function(){ return [this.op,this.e1,this.e2];}}; },$_._hx_name="TBinop",$_)
	,TField: ($_=function(e,fa) { return {_hx_index:4,e:e,fa:fa,__enum__:"haxe.macro.TypedExprDef",toString:$estr,__params__:function(){ return [this.e,this.fa];}}; },$_._hx_name="TField",$_)
	,TTypeExpr: ($_=function(m) { return {_hx_index:5,m:m,__enum__:"haxe.macro.TypedExprDef",toString:$estr,__params__:function(){ return [this.m];}}; },$_._hx_name="TTypeExpr",$_)
	,TParenthesis: ($_=function(e) { return {_hx_index:6,e:e,__enum__:"haxe.macro.TypedExprDef",toString:$estr,__params__:function(){ return [this.e];}}; },$_._hx_name="TParenthesis",$_)
	,TObjectDecl: ($_=function(fields) { return {_hx_index:7,fields:fields,__enum__:"haxe.macro.TypedExprDef",toString:$estr,__params__:function(){ return [this.fields];}}; },$_._hx_name="TObjectDecl",$_)
	,TArrayDecl: ($_=function(el) { return {_hx_index:8,el:el,__enum__:"haxe.macro.TypedExprDef",toString:$estr,__params__:function(){ return [this.el];}}; },$_._hx_name="TArrayDecl",$_)
	,TCall: ($_=function(e,el) { return {_hx_index:9,e:e,el:el,__enum__:"haxe.macro.TypedExprDef",toString:$estr,__params__:function(){ return [this.e,this.el];}}; },$_._hx_name="TCall",$_)
	,TNew: ($_=function(c,params,el) { return {_hx_index:10,c:c,params:params,el:el,__enum__:"haxe.macro.TypedExprDef",toString:$estr,__params__:function(){ return [this.c,this.params,this.el];}}; },$_._hx_name="TNew",$_)
	,TUnop: ($_=function(op,postFix,e) { return {_hx_index:11,op:op,postFix:postFix,e:e,__enum__:"haxe.macro.TypedExprDef",toString:$estr,__params__:function(){ return [this.op,this.postFix,this.e];}}; },$_._hx_name="TUnop",$_)
	,TFunction: ($_=function(tfunc) { return {_hx_index:12,tfunc:tfunc,__enum__:"haxe.macro.TypedExprDef",toString:$estr,__params__:function(){ return [this.tfunc];}}; },$_._hx_name="TFunction",$_)
	,TVar: ($_=function(v,expr) { return {_hx_index:13,v:v,expr:expr,__enum__:"haxe.macro.TypedExprDef",toString:$estr,__params__:function(){ return [this.v,this.expr];}}; },$_._hx_name="TVar",$_)
	,TBlock: ($_=function(el) { return {_hx_index:14,el:el,__enum__:"haxe.macro.TypedExprDef",toString:$estr,__params__:function(){ return [this.el];}}; },$_._hx_name="TBlock",$_)
	,TFor: ($_=function(v,e1,e2) { return {_hx_index:15,v:v,e1:e1,e2:e2,__enum__:"haxe.macro.TypedExprDef",toString:$estr,__params__:function(){ return [this.v,this.e1,this.e2];}}; },$_._hx_name="TFor",$_)
	,TIf: ($_=function(econd,eif,eelse) { return {_hx_index:16,econd:econd,eif:eif,eelse:eelse,__enum__:"haxe.macro.TypedExprDef",toString:$estr,__params__:function(){ return [this.econd,this.eif,this.eelse];}}; },$_._hx_name="TIf",$_)
	,TWhile: ($_=function(econd,e,normalWhile) { return {_hx_index:17,econd:econd,e:e,normalWhile:normalWhile,__enum__:"haxe.macro.TypedExprDef",toString:$estr,__params__:function(){ return [this.econd,this.e,this.normalWhile];}}; },$_._hx_name="TWhile",$_)
	,TSwitch: ($_=function(e,cases,edef) { return {_hx_index:18,e:e,cases:cases,edef:edef,__enum__:"haxe.macro.TypedExprDef",toString:$estr,__params__:function(){ return [this.e,this.cases,this.edef];}}; },$_._hx_name="TSwitch",$_)
	,TTry: ($_=function(e,catches) { return {_hx_index:19,e:e,catches:catches,__enum__:"haxe.macro.TypedExprDef",toString:$estr,__params__:function(){ return [this.e,this.catches];}}; },$_._hx_name="TTry",$_)
	,TReturn: ($_=function(e) { return {_hx_index:20,e:e,__enum__:"haxe.macro.TypedExprDef",toString:$estr,__params__:function(){ return [this.e];}}; },$_._hx_name="TReturn",$_)
	,TBreak: {_hx_name:"TBreak",_hx_index:21,__enum__:"haxe.macro.TypedExprDef",toString:$estr}
	,TContinue: {_hx_name:"TContinue",_hx_index:22,__enum__:"haxe.macro.TypedExprDef",toString:$estr}
	,TThrow: ($_=function(e) { return {_hx_index:23,e:e,__enum__:"haxe.macro.TypedExprDef",toString:$estr,__params__:function(){ return [this.e];}}; },$_._hx_name="TThrow",$_)
	,TCast: ($_=function(e,m) { return {_hx_index:24,e:e,m:m,__enum__:"haxe.macro.TypedExprDef",toString:$estr,__params__:function(){ return [this.e,this.m];}}; },$_._hx_name="TCast",$_)
	,TMeta: ($_=function(m,e1) { return {_hx_index:25,m:m,e1:e1,__enum__:"haxe.macro.TypedExprDef",toString:$estr,__params__:function(){ return [this.m,this.e1];}}; },$_._hx_name="TMeta",$_)
	,TEnumParameter: ($_=function(e1,ef,index) { return {_hx_index:26,e1:e1,ef:ef,index:index,__enum__:"haxe.macro.TypedExprDef",toString:$estr,__params__:function(){ return [this.e1,this.ef,this.index];}}; },$_._hx_name="TEnumParameter",$_)
	,TEnumIndex: ($_=function(e1) { return {_hx_index:27,e1:e1,__enum__:"haxe.macro.TypedExprDef",toString:$estr,__params__:function(){ return [this.e1];}}; },$_._hx_name="TEnumIndex",$_)
	,TIdent: ($_=function(s) { return {_hx_index:28,s:s,__enum__:"haxe.macro.TypedExprDef",toString:$estr,__params__:function(){ return [this.s];}}; },$_._hx_name="TIdent",$_)
};
haxe_macro_TypedExprDef.__constructs__ = [haxe_macro_TypedExprDef.TConst,haxe_macro_TypedExprDef.TLocal,haxe_macro_TypedExprDef.TArray,haxe_macro_TypedExprDef.TBinop,haxe_macro_TypedExprDef.TField,haxe_macro_TypedExprDef.TTypeExpr,haxe_macro_TypedExprDef.TParenthesis,haxe_macro_TypedExprDef.TObjectDecl,haxe_macro_TypedExprDef.TArrayDecl,haxe_macro_TypedExprDef.TCall,haxe_macro_TypedExprDef.TNew,haxe_macro_TypedExprDef.TUnop,haxe_macro_TypedExprDef.TFunction,haxe_macro_TypedExprDef.TVar,haxe_macro_TypedExprDef.TBlock,haxe_macro_TypedExprDef.TFor,haxe_macro_TypedExprDef.TIf,haxe_macro_TypedExprDef.TWhile,haxe_macro_TypedExprDef.TSwitch,haxe_macro_TypedExprDef.TTry,haxe_macro_TypedExprDef.TReturn,haxe_macro_TypedExprDef.TBreak,haxe_macro_TypedExprDef.TContinue,haxe_macro_TypedExprDef.TThrow,haxe_macro_TypedExprDef.TCast,haxe_macro_TypedExprDef.TMeta,haxe_macro_TypedExprDef.TEnumParameter,haxe_macro_TypedExprDef.TEnumIndex,haxe_macro_TypedExprDef.TIdent];
haxe_macro_TypedExprDef.__empty_constructs__ = [haxe_macro_TypedExprDef.TBreak,haxe_macro_TypedExprDef.TContinue];
var js_Boot = function() { };
$hxClasses["js.Boot"] = js_Boot;
js_Boot.__name__ = "js.Boot";
js_Boot.isClass = function(o) {
	return o.__name__;
};
js_Boot.isInterface = function(o) {
	return o.__isInterface__;
};
js_Boot.isEnum = function(e) {
	return e.__ename__;
};
js_Boot.getClass = function(o) {
	if(o == null) {
		return null;
	} else if(((o) instanceof Array)) {
		return Array;
	} else {
		var cl = o.__class__;
		if(cl != null) {
			return cl;
		}
		var name = js_Boot.__nativeClassName(o);
		if(name != null) {
			return js_Boot.__resolveNativeClass(name);
		}
		return null;
	}
};
js_Boot.__string_rec = function(o,s) {
	if(o == null) {
		return "null";
	}
	if(s.length >= 5) {
		return "<...>";
	}
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) {
		t = "object";
	}
	switch(t) {
	case "function":
		return "<function>";
	case "object":
		if(o.__enum__) {
			var e = $hxEnums[o.__enum__];
			var con = e.__constructs__[o._hx_index];
			var n = con._hx_name;
			if(o.__params__) {
				s = s + "\t";
				var params = o.__params__();
				var _g = 0;
				var _g1 = params.length;
				while(true) {
					if(!(_g < _g1)) {
						break;
					}
					var i = (function($this) {
						var $r;
						_g = _g + 1;
						$r = _g - 1;
						return $r;
					}(this));
					params[i] = js_Boot.__string_rec(params[i],s);
				}
				return (n == null ? "null" : "" + n) + "(" + params.join(",") + ")";
			} else {
				return n;
			}
		}
		if(((o) instanceof Array)) {
			var str = "[";
			s += "\t";
			var _g = 0;
			var _g1 = o.length;
			while(_g < _g1) {
				var i = _g++;
				str += (i > 0 ? "," : "") + js_Boot.__string_rec(o[i],s);
			}
			str += "]";
			return str;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( _g ) {
			haxe_NativeStackTrace.lastError = _g;
			return "???";
		}
		if(tostr != null && tostr != Object.toString && typeof(tostr) == "function") {
			var s2 = o.toString();
			if(s2 != "[object Object]") {
				return s2;
			}
		}
		var str = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		var k = null;
		for( k in o ) {
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str.length != 2) {
			str += ", \n";
		}
		str += s + k + " : " + js_Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += "\n" + s + "}";
		return str;
	case "string":
		return o;
	default:
		return String(o);
	}
};
js_Boot.__interfLoop = function(cc,cl) {
	while(true) {
		if(cc == null) {
			return false;
		}
		if(cc == cl) {
			return true;
		}
		var intf = cc.__interfaces__;
		if(intf != null) {
			var _g = 0;
			var _g1 = intf.length;
			while(_g < _g1) {
				var i = _g++;
				var i1 = intf[i];
				if(i1 == cl || js_Boot.__interfLoop(i1,cl)) {
					return true;
				}
			}
		}
		cc = cc.__super__;
	}
};
js_Boot.__instanceof = function(o,cl) {
	if(cl == null) {
		return false;
	}
	switch(cl) {
	case Array:
		return ((o) instanceof Array);
	case Bool:
		return typeof(o) == "boolean";
	case Dynamic:
		return o != null;
	case Float:
		return typeof(o) == "number";
	case Int:
		if(typeof(o) == "number") {
			return ((o | 0) === o);
		} else {
			return false;
		}
		break;
	case String:
		return typeof(o) == "string";
	default:
		if(o != null) {
			if(typeof(cl) == "function") {
				if(js_Boot.__downcastCheck(o,cl)) {
					return true;
				}
			} else if(typeof(cl) == "object" && js_Boot.__isNativeObj(cl)) {
				if(((o) instanceof cl)) {
					return true;
				}
			}
		} else {
			return false;
		}
		if(cl == Class ? o.__name__ != null : false) {
			return true;
		}
		if(cl == Enum ? o.__ename__ != null : false) {
			return true;
		}
		return o.__enum__ != null ? $hxEnums[o.__enum__] == cl : false;
	}
};
js_Boot.__downcastCheck = function(o,cl) {
	if(!((o) instanceof cl)) {
		if(cl.__isInterface__) {
			return js_Boot.__interfLoop(js_Boot.getClass(o),cl);
		} else {
			return false;
		}
	} else {
		return true;
	}
};
js_Boot.__implements = function(o,iface) {
	return js_Boot.__interfLoop(js_Boot.getClass(o),iface);
};
js_Boot.__cast = function(o,t) {
	if(o == null || js_Boot.__instanceof(o,t)) {
		return o;
	} else {
		throw haxe_Exception.thrown("Cannot cast " + Std.string(o) + " to " + Std.string(t));
	}
};
js_Boot.__toStr = null;
js_Boot.__nativeClassName = function(o) {
	var name = js_Boot.__toStr.call(o).slice(8,-1);
	if(name == "Object" || name == "Function" || name == "Math" || name == "JSON") {
		return null;
	}
	return name;
};
js_Boot.__isNativeObj = function(o) {
	return js_Boot.__nativeClassName(o) != null;
};
js_Boot.__resolveNativeClass = function(name) {
	return $global[name];
};
var js_Browser = function() { };
$hxClasses["js.Browser"] = js_Browser;
js_Browser.__name__ = "js.Browser";
js_Browser.__properties__ = {get_supported:"get_supported",get_self:"get_self"};
js_Browser.get_self = function() {
	return $global;
};
js_Browser.get_supported = function() {
	if(typeof(window) != "undefined" && typeof(window.location) != "undefined") {
		return typeof(window.location.protocol) == "string";
	} else {
		return false;
	}
};
js_Browser.getLocalStorage = function() {
	try {
		var s = window.localStorage;
		s.getItem("");
		if(s.length == 0) {
			var key = "_hx_" + Math.random();
			s.setItem(key,key);
			s.removeItem(key);
		}
		return s;
	} catch( _g ) {
		haxe_NativeStackTrace.lastError = _g;
		return null;
	}
};
js_Browser.getSessionStorage = function() {
	try {
		var s = window.sessionStorage;
		s.getItem("");
		if(s.length == 0) {
			var key = "_hx_" + Math.random();
			s.setItem(key,key);
			s.removeItem(key);
		}
		return s;
	} catch( _g ) {
		haxe_NativeStackTrace.lastError = _g;
		return null;
	}
};
js_Browser.createXMLHttpRequest = function() {
	if(typeof XMLHttpRequest != "undefined") {
		return new XMLHttpRequest();
	}
	if(typeof ActiveXObject != "undefined") {
		return new ActiveXObject("Microsoft.XMLHTTP");
	}
	throw haxe_Exception.thrown("Unable to create XMLHttpRequest object.");
};
js_Browser.alert = function(v) {
	window.alert(Std.string(v));
};
var js_Lib = function() { };
$hxClasses["js.Lib"] = js_Lib;
js_Lib.__name__ = "js.Lib";
js_Lib.__properties__ = {get_undefined:"get_undefined"};
js_Lib.debug = function() {
	debugger;
};
js_Lib.dynamicImport = function($module) {
	return import($module);
};
js_Lib.alert = function(v) {
	alert(js_Boot.__string_rec(v,""));
};
js_Lib.eval = function(code) {
	return eval(code);
};
js_Lib.get_undefined = function() {
	return undefined;
};
js_Lib.rethrow = function() {
};
js_Lib.getOriginalException = function() {
	return null;
};
js_Lib.getNextHaxeUID = function() {
	return $global.$haxeUID++;
};
var js_html__$CanvasElement_CanvasUtil = function() { };
$hxClasses["js.html._CanvasElement.CanvasUtil"] = js_html__$CanvasElement_CanvasUtil;
js_html__$CanvasElement_CanvasUtil.__name__ = "js.html._CanvasElement.CanvasUtil";
js_html__$CanvasElement_CanvasUtil.getContextWebGL = function(canvas,attribs) {
	var ctx = canvas.getContext("webgl",attribs);
	if(ctx != null) {
		return ctx;
	}
	var ctx = canvas.getContext("experimental-webgl",attribs);
	if(ctx != null) {
		return ctx;
	}
	return null;
};
var js_lib__$ArrayBuffer_ArrayBufferCompat = function() { };
$hxClasses["js.lib._ArrayBuffer.ArrayBufferCompat"] = js_lib__$ArrayBuffer_ArrayBufferCompat;
js_lib__$ArrayBuffer_ArrayBufferCompat.__name__ = "js.lib._ArrayBuffer.ArrayBufferCompat";
js_lib__$ArrayBuffer_ArrayBufferCompat.sliceImpl = function(begin,end) {
	var u = new Uint8Array(this,begin,end == null ? null : end - begin);
	var resultArray = new Uint8Array(u.byteLength);
	resultArray.set(u);
	return resultArray.buffer;
};
var js_lib_HaxeIterator = function(jsIterator) {
	this.jsIterator = jsIterator;
	this.lastStep = jsIterator.next();
};
$hxClasses["js.lib.HaxeIterator"] = js_lib_HaxeIterator;
js_lib_HaxeIterator.__name__ = "js.lib.HaxeIterator";
js_lib_HaxeIterator.iterator = function(jsIterator) {
	return new js_lib_HaxeIterator(jsIterator);
};
js_lib_HaxeIterator.prototype = {
	jsIterator: null
	,lastStep: null
	,hasNext: function() {
		return !this.lastStep.done;
	}
	,next: function() {
		var v = this.lastStep.value;
		this.lastStep = this.jsIterator.next();
		return v;
	}
	,__class__: js_lib_HaxeIterator
};
var js_lib_HaxeKeyValueIterator = function(jsIterator) {
	this.jsIterator = jsIterator;
	this.lastStep = jsIterator.next();
};
$hxClasses["js.lib.HaxeKeyValueIterator"] = js_lib_HaxeKeyValueIterator;
js_lib_HaxeKeyValueIterator.__name__ = "js.lib.HaxeKeyValueIterator";
js_lib_HaxeKeyValueIterator.keyValueIterator = function(jsIterator) {
	return new js_lib_HaxeKeyValueIterator(jsIterator);
};
js_lib_HaxeKeyValueIterator.prototype = {
	jsIterator: null
	,lastStep: null
	,hasNext: function() {
		return !this.lastStep.done;
	}
	,next: function() {
		var v = this.lastStep.value;
		this.lastStep = this.jsIterator.next();
		return { key : v[0], value : v[1]};
	}
	,__class__: js_lib_HaxeKeyValueIterator
};
var js_lib_KeyValue = {};
js_lib_KeyValue.__properties__ = {get_value:"get_value",get_key:"get_key"};
js_lib_KeyValue.get_key = function(this1) {
	return this1[0];
};
js_lib_KeyValue.get_value = function(this1) {
	return this1[1];
};
var js_lib_ObjectEntry = {};
js_lib_ObjectEntry.__properties__ = {get_value:"get_value",get_key:"get_key"};
js_lib_ObjectEntry.get_key = function(this1) {
	return this1[0];
};
js_lib_ObjectEntry.get_value = function(this1) {
	return this1[1];
};
var js_lib_SetKeyValueIterator = function(set) {
	this.index = 0;
	this.set = set;
	this.values = new js_lib_HaxeIterator(set.values());
};
$hxClasses["js.lib.SetKeyValueIterator"] = js_lib_SetKeyValueIterator;
js_lib_SetKeyValueIterator.__name__ = "js.lib.SetKeyValueIterator";
js_lib_SetKeyValueIterator.prototype = {
	set: null
	,values: null
	,index: null
	,hasNext: function() {
		return !this.values.lastStep.done;
	}
	,next: function() {
		var tmp = this.index++;
		var _this = this.values;
		var v = _this.lastStep.value;
		_this.lastStep = _this.jsIterator.next();
		return { key : tmp, value : v};
	}
	,__class__: js_lib_SetKeyValueIterator
};
var js_node_ChildProcess = require("child_process");
var js_node_DnsErrorCode = require("dns");
var js_node_Dns = require("dns");
var js_node_Fs = require("fs");
var js_node_Http = require("http");
var js_node_Https = require("https");
var js_node_KeyValue = {};
js_node_KeyValue.__properties__ = {get_value:"get_value",get_key:"get_key"};
js_node_KeyValue.get_key = function(this1) {
	return this1[0];
};
js_node_KeyValue.get_value = function(this1) {
	return this1[1];
};
var js_node_Module = require("module");
var js_node_Path = require("path");
var js_node_events_EventEmitter = require("events").EventEmitter;
var js_node_Stream = require("stream");
var js_node_Timers = require("timers");
var js_node_Tls = require("tls");
var js_node_Util = require("util");
var js_node_buffer_Buffer = require("buffer").Buffer;
var js_node_buffer__$Buffer_Helper = function() { };
$hxClasses["js.node.buffer._Buffer.Helper"] = js_node_buffer__$Buffer_Helper;
js_node_buffer__$Buffer_Helper.__name__ = "js.node.buffer._Buffer.Helper";
js_node_buffer__$Buffer_Helper.bytesOfBuffer = function(b) {
	var o = Object.create(haxe_io_Bytes.prototype);
	o.length = b.byteLength;
	o.b = b;
	b.bufferValue = b;
	b.hxBytes = o;
	b.bytes = b;
	return o;
};
var js_node_buffer__$Buffer_BufferModule = require("buffer");
var js_node_console_Console = require("console").Console;
var js_node_stream_Readable = require("stream").Readable;
var js_node_stream_Writable = require("stream").Writable;
var js_node_http_Agent = require("http").Agent;
var js_node_http_ClientRequest = require("http").ClientRequest;
var js_node_http_IncomingMessage = require("http").IncomingMessage;
var js_node_net_Server = require("net").Server;
var js_node_http_Server = require("http").Server;
var js_node_http_ServerResponse = require("http").ServerResponse;
var js_node_https_Agent = require("https").Agent;
var js_node_tls_Server = require("tls").Server;
var js_node_https_Server = require("https").Server;
var js_node_stream_Duplex = require("stream").Duplex;
var js_node_net_Socket = require("net").Socket;
var js_node_stream_WritableNewOptionsAdapter = {};
js_node_stream_WritableNewOptionsAdapter.from = function(options) {
	if(!Object.prototype.hasOwnProperty.call(options,"final")) {
		Object.defineProperty(options,"final",{ get : function() {
			return options.final_;
		}});
	}
	return options;
};
var js_node_tls_TLSSocket = require("tls").TLSSocket;
var js_node_url_URL = require("url").URL;
var js_node_url_URLSearchParams = require("url").URLSearchParams;
var js_node_url_URLSearchParamsEntry = {};
js_node_url_URLSearchParamsEntry.__properties__ = {get_value:"get_value",get_name:"get_name"};
js_node_url_URLSearchParamsEntry._new = function(name,value) {
	return [name,value];
};
js_node_url_URLSearchParamsEntry.get_name = function(this1) {
	return this1[0];
};
js_node_url_URLSearchParamsEntry.get_value = function(this1) {
	return this1[1];
};
var logging_ILogAdaptor = function() { };
$hxClasses["logging.ILogAdaptor"] = logging_ILogAdaptor;
logging_ILogAdaptor.__name__ = "logging.ILogAdaptor";
logging_ILogAdaptor.__isInterface__ = true;
logging_ILogAdaptor.prototype = {
	get_config: null
	,config: null
	,processLogData: null
	,__class__: logging_ILogAdaptor
	,__properties__: {get_config:"get_config"}
};
var logging_ILogLineFormatter = function() { };
$hxClasses["logging.ILogLineFormatter"] = logging_ILogLineFormatter;
logging_ILogLineFormatter.__name__ = "logging.ILogLineFormatter";
logging_ILogLineFormatter.__isInterface__ = true;
logging_ILogLineFormatter.prototype = {
	format: null
	,formatObject: null
	,__class__: logging_ILogLineFormatter
};
var logging_LogManager = function() {
	this._shouldLogWarnings = null;
	this._shouldLogData = null;
	this._shouldLogDebug = null;
	this._started = false;
	this.StartDelay = 50;
	this._adaptors = [];
	this._queue = [];
};
$hxClasses["logging.LogManager"] = logging_LogManager;
logging_LogManager.__name__ = "logging.LogManager";
logging_LogManager.__properties__ = {get_instance:"get_instance"};
logging_LogManager.instance = null;
logging_LogManager.get_instance = function() {
	if(logging_LogManager._instance == null) {
		logging_LogManager._instance = new logging_LogManager();
	}
	return logging_LogManager._instance;
};
logging_LogManager.prototype = {
	_queue: null
	,_adaptors: null
	,StartDelay: null
	,_started: null
	,start: function() {
		var _gthis = this;
		if(this._started == true) {
			return;
		}
		this._started = true;
		haxe_Timer.delay(function() {
			if(_gthis._adaptors.length == 0) {
				_gthis._adaptors.push(new logging_adaptors_NullLogAdaptor());
			}
			_gthis.processQueue();
		},this.StartDelay);
	}
	,log: function(data) {
		this._queue.push(data);
		this.processQueue();
	}
	,processQueue: function() {
		if(this._adaptors.length == 0) {
			return;
		}
		while(this._queue.length > 0) {
			var data = this._queue.shift();
			this.processLogData(data);
		}
	}
	,_shouldLogDebug: null
	,shouldLogDebug: null
	,get_shouldLogDebug: function() {
		if(this._shouldLogDebug != null) {
			return this._shouldLogDebug;
		}
		this._shouldLogDebug = this.willRespondToLevel("Debug");
		return this._shouldLogDebug;
	}
	,_shouldLogData: null
	,shouldLogData: null
	,get_shouldLogData: function() {
		if(this._shouldLogData != null) {
			return this._shouldLogData;
		}
		this._shouldLogData = this.willRespondToLevel("Data");
		return this._shouldLogData;
	}
	,_shouldLogWarnings: null
	,shouldLogWarnings: null
	,get_shouldLogWarnings: function() {
		if(this._shouldLogWarnings != null) {
			return this._shouldLogWarnings;
		}
		this._shouldLogWarnings = this.willRespondToLevel("Warning");
		return this._shouldLogWarnings;
	}
	,willRespondToLevel: function(level) {
		var willRespond = false;
		var _g = 0;
		var _g1 = this._adaptors;
		while(_g < _g1.length) {
			var a = _g1[_g];
			++_g;
			if(a.get_config().disabled) {
				continue;
			}
			if(a.get_config().levels == null) {
				willRespond = true;
				continue;
			}
			if(a.get_config().levels.indexOf(level) != -1) {
				willRespond = true;
				break;
			}
		}
		return willRespond;
	}
	,processLogData: function(data) {
		var _g = 0;
		var _g1 = this._adaptors;
		while(_g < _g1.length) {
			var a = _g1[_g];
			++_g;
			var allow = !a.get_config().disabled;
			if(allow && a.get_config().levels != null) {
				if(a.get_config().levels.indexOf(data.level) == -1) {
					allow = false;
				}
			}
			if(allow && data.ref != null && a.get_config().packages != null) {
				var _g2 = 0;
				var _g3 = a.get_config().packages;
				while(_g2 < _g3.length) {
					var p = _g3[_g2];
					++_g2;
					if(!StringTools.startsWith(data.ref,p)) {
						allow = false;
						break;
					}
				}
			}
			if(allow == true) {
				a.processLogData(data);
			}
		}
	}
	,addAdaptor: function(adaptor) {
		if(adaptor.get_config().formatter == null) {
			adaptor.get_config().formatter = new logging_formatters_DefaultFormatter();
		}
		this._adaptors.push(adaptor);
		this._shouldLogDebug = null;
		this._shouldLogWarnings = null;
		this.start();
	}
	,clearAdaptors: function() {
		this._adaptors = [];
		this._adaptors.push(new logging_adaptors_NullLogAdaptor());
	}
	,__class__: logging_LogManager
	,__properties__: {get_shouldLogWarnings:"get_shouldLogWarnings",get_shouldLogData:"get_shouldLogData",get_shouldLogDebug:"get_shouldLogDebug"}
};
var logging_adaptors_NullLogAdaptor = function() {
	this._config = { };
};
$hxClasses["logging.adaptors.NullLogAdaptor"] = logging_adaptors_NullLogAdaptor;
logging_adaptors_NullLogAdaptor.__name__ = "logging.adaptors.NullLogAdaptor";
logging_adaptors_NullLogAdaptor.__interfaces__ = [logging_ILogAdaptor];
logging_adaptors_NullLogAdaptor.prototype = {
	_config: null
	,config: null
	,get_config: function() {
		return this._config;
	}
	,processLogData: function(data) {
	}
	,__class__: logging_adaptors_NullLogAdaptor
	,__properties__: {get_config:"get_config"}
};
var logging_formatters_DefaultFormatter = function() {
};
$hxClasses["logging.formatters.DefaultFormatter"] = logging_formatters_DefaultFormatter;
logging_formatters_DefaultFormatter.__name__ = "logging.formatters.DefaultFormatter";
logging_formatters_DefaultFormatter.__interfaces__ = [logging_ILogLineFormatter];
logging_formatters_DefaultFormatter.prototype = {
	format: function(data,buffer) {
		buffer.b = (buffer.b += Std.string(data.timestamp)) + " > ";
		buffer.b = (buffer.b += Std.string(StringTools.rpad((js_Boot.__cast(data.level , String)).toUpperCase()," ",11))) + " > ";
		if(data.ref != null) {
			buffer.b = (buffer.b += Std.string(data.ref)) + " > ";
		}
		if(data.instanceId != null) {
			buffer.b = (buffer.b += Std.string(data.instanceId)) + " > ";
		}
		if(data.message != null) {
			buffer.b += Std.string(data.message);
		}
	}
	,formatObject: function(obj) {
		if(obj == null) {
			return "";
		}
		var _g = Type.typeof(obj);
		if(_g._hx_index == 6) {
			if(_g.c == haxe_ds_StringMap) {
				var o = { };
				var sm = js_Boot.__cast(obj , haxe_ds_StringMap);
				var h = sm.h;
				var _g_keys = Object.keys(h);
				var _g_length = _g_keys.length;
				var _g_current = 0;
				while(_g_current < _g_length) {
					var key = _g_keys[_g_current++];
					o[key] = sm.h[key];
				}
				return JSON.stringify(o);
			}
		}
		if(obj == null) {
			return "null";
		} else {
			return Std.string(obj);
		}
	}
	,__class__: logging_formatters_DefaultFormatter
};
var mysql_MySqlError = function(name,message) {
	this.name = name;
	this.message = message;
};
$hxClasses["mysql.MySqlError"] = mysql_MySqlError;
mysql_MySqlError.__name__ = "mysql.MySqlError";
mysql_MySqlError.prototype = {
	name: null
	,message: null
	,__class__: mysql_MySqlError
};
var mysql_MySqlResult = function(connection,data) {
	this.affectedRows = null;
	this.lastInsertId = null;
	this.connection = connection;
	this.data = data;
};
$hxClasses["mysql.MySqlResult"] = mysql_MySqlResult;
mysql_MySqlResult.__name__ = "mysql.MySqlResult";
mysql_MySqlResult.prototype = {
	connection: null
	,data: null
	,lastInsertId: null
	,affectedRows: null
	,__class__: mysql_MySqlResult
};
var mysql_externs_nodejs_Connection = require("mysql2").Connection;
var mysql_externs_nodejs_MySql2 = require("mysql2");
var mysql_impl_DatabaseConnectionBase = function(details) {
	this._cachedCalls = [];
	this.replayQueriesOnReconnection = false;
	this.autoReconnectIntervalMS = 1000;
	this.autoReconnect = false;
	this.connectionDetails = null;
	this.connectionDetails = details;
	if(this.connectionDetails.port == null) {
		this.connectionDetails.port = 3306;
	}
};
$hxClasses["mysql.impl.DatabaseConnectionBase"] = mysql_impl_DatabaseConnectionBase;
mysql_impl_DatabaseConnectionBase.__name__ = "mysql.impl.DatabaseConnectionBase";
mysql_impl_DatabaseConnectionBase.prototype = {
	connectionDetails: null
	,autoReconnect: null
	,autoReconnectIntervalMS: null
	,replayQueriesOnReconnection: null
	,open: function() {
		var _gthis = this;
		return thenshim_Promise._new(function(resolve,reject) {
			var c = js_Boot.getClass(_gthis);
			reject(new mysql_MySqlError("not implemented","function \"" + c.__name__ + "::open\" not implemented"));
		});
	}
	,exec: function(sql) {
		var _gthis = this;
		return thenshim_Promise._new(function(resolve,reject) {
			var c = js_Boot.getClass(_gthis);
			reject(new mysql_MySqlError("not implemented","function \"" + c.__name__ + "::exec\" not implemented"));
		});
	}
	,get: function(sql,param) {
		var _gthis = this;
		return thenshim_Promise._new(function(resolve,reject) {
			var c = js_Boot.getClass(_gthis);
			reject(new mysql_MySqlError("not implemented","function \"" + c.__name__ + "::get\" not implemented"));
		});
	}
	,query: function(sql,param) {
		var _gthis = this;
		return thenshim_Promise._new(function(resolve,reject) {
			var c = js_Boot.getClass(_gthis);
			reject(new mysql_MySqlError("not implemented","function \"" + c.__name__ + "::query\" not implemented"));
		});
	}
	,all: function(sql,param) {
		var _gthis = this;
		return thenshim_Promise._new(function(resolve,reject) {
			var c = js_Boot.getClass(_gthis);
			reject(new mysql_MySqlError("not implemented","function \"" + c.__name__ + "::all\" not implemented"));
		});
	}
	,close: function() {
	}
	,checkForDisconnection: function(error,call,sql,param,resolve,reject) {
		if(!this.autoReconnect) {
			return false;
		}
		var isDisconnectedError = false;
		if(error.toLowerCase() == "can't add new command when connection is in closed state") {
			isDisconnectedError = true;
		} else if(error.toLowerCase().indexOf("failed to send packet") != -1) {
			isDisconnectedError = true;
		}
		if(isDisconnectedError) {
			this.cacheCall({ call : call, sql : sql, param : param, resolve : resolve, reject : reject});
			haxe_Timer.delay($bind(this,this.attemptReconnect),this.autoReconnectIntervalMS);
			return true;
		}
		return false;
	}
	,_cachedCalls: null
	,cacheCall: function(item) {
		if(!this.replayQueriesOnReconnection) {
			return;
		}
		this._cachedCalls.push(item);
	}
	,attemptReconnect: function() {
		var _gthis = this;
		thenshim_Promise.then(this.open(),function(_) {
			_gthis.replayCachedCalls(_gthis._cachedCalls);
		},function(error) {
			return haxe_Timer.delay($bind(_gthis,_gthis.attemptReconnect),_gthis.autoReconnectIntervalMS);
		});
	}
	,replayCachedCalls: function(cachedCalls) {
		var _gthis = this;
		if(cachedCalls.length == 0) {
			return;
		}
		var item = cachedCalls.shift();
		switch(item.call._hx_index) {
		case 0:
			thenshim_Promise.then(this.exec(item.sql),function(result) {
				item.resolve(result);
				_gthis.replayCachedCalls(cachedCalls);
			},function(error) {
				item.reject(error);
				_gthis.replayCachedCalls(cachedCalls);
			});
			break;
		case 1:
			thenshim_Promise.then(this.get(item.sql,item.param),function(result) {
				item.resolve(result);
				_gthis.replayCachedCalls(cachedCalls);
			},function(error) {
				item.reject(error);
				_gthis.replayCachedCalls(cachedCalls);
			});
			break;
		case 2:
			thenshim_Promise.then(this.query(item.sql,item.param),function(result) {
				item.resolve(result);
				_gthis.replayCachedCalls(cachedCalls);
			},function(error) {
				item.reject(error);
				_gthis.replayCachedCalls(cachedCalls);
			});
			break;
		case 3:
			thenshim_Promise.then(this.all(item.sql,item.param),function(result) {
				item.resolve(result);
				_gthis.replayCachedCalls(cachedCalls);
			},function(error) {
				item.reject(error);
				_gthis.replayCachedCalls(cachedCalls);
			});
			break;
		}
	}
	,__class__: mysql_impl_DatabaseConnectionBase
};
var mysql_impl__$DatabaseConnectionBase_CacheCall = $hxEnums["mysql.impl._DatabaseConnectionBase.CacheCall"] = { __ename__:"mysql.impl._DatabaseConnectionBase.CacheCall",__constructs__:null
	,CALL_EXEC: {_hx_name:"CALL_EXEC",_hx_index:0,__enum__:"mysql.impl._DatabaseConnectionBase.CacheCall",toString:$estr}
	,CALL_GET: {_hx_name:"CALL_GET",_hx_index:1,__enum__:"mysql.impl._DatabaseConnectionBase.CacheCall",toString:$estr}
	,CALL_QUERY: {_hx_name:"CALL_QUERY",_hx_index:2,__enum__:"mysql.impl._DatabaseConnectionBase.CacheCall",toString:$estr}
	,CALL_ALL: {_hx_name:"CALL_ALL",_hx_index:3,__enum__:"mysql.impl._DatabaseConnectionBase.CacheCall",toString:$estr}
};
mysql_impl__$DatabaseConnectionBase_CacheCall.__constructs__ = [mysql_impl__$DatabaseConnectionBase_CacheCall.CALL_EXEC,mysql_impl__$DatabaseConnectionBase_CacheCall.CALL_GET,mysql_impl__$DatabaseConnectionBase_CacheCall.CALL_QUERY,mysql_impl__$DatabaseConnectionBase_CacheCall.CALL_ALL];
mysql_impl__$DatabaseConnectionBase_CacheCall.__empty_constructs__ = [mysql_impl__$DatabaseConnectionBase_CacheCall.CALL_EXEC,mysql_impl__$DatabaseConnectionBase_CacheCall.CALL_GET,mysql_impl__$DatabaseConnectionBase_CacheCall.CALL_QUERY,mysql_impl__$DatabaseConnectionBase_CacheCall.CALL_ALL];
var mysql_impl_nodejs_DatabaseConnection = function(details) {
	this._nativeConnection = null;
	mysql_impl_DatabaseConnectionBase.call(this,details);
};
$hxClasses["mysql.impl.nodejs.DatabaseConnection"] = mysql_impl_nodejs_DatabaseConnection;
mysql_impl_nodejs_DatabaseConnection.__name__ = "mysql.impl.nodejs.DatabaseConnection";
mysql_impl_nodejs_DatabaseConnection.__super__ = mysql_impl_DatabaseConnectionBase;
mysql_impl_nodejs_DatabaseConnection.prototype = $extend(mysql_impl_DatabaseConnectionBase.prototype,{
	_nativeConnection: null
	,open: function() {
		var _gthis = this;
		return thenshim_Promise._new(function(resolve,reject) {
			var _this = mysql_impl_nodejs_DatabaseConnection.log;
			var data = { host : _gthis.connectionDetails.host, user : _gthis.connectionDetails.user, password : _gthis.connectionDetails.pass, database : _gthis.connectionDetails.database, rowsAsArray : false};
			logging_LogManager.get_instance().log({ timestamp : HxOverrides.dateStr(new Date()), level : "Debug", message : "creating connection:", data : data, ref : _this._ref, instanceId : _this._instanceId});
			_gthis._nativeConnection = mysql_externs_nodejs_MySql2.createConnection({ host : _gthis.connectionDetails.host, user : _gthis.connectionDetails.user, password : _gthis.connectionDetails.pass, database : _gthis.connectionDetails.database, rowsAsArray : false});
			_gthis._nativeConnection.connect(function(error) {
				if(error != null) {
					reject(new mysql_MySqlError("Error",error.message));
					return;
				}
				resolve(new mysql_MySqlResult(_gthis,true));
			});
		});
	}
	,exec: function(sql) {
		var _gthis = this;
		return thenshim_Promise._new(function(resolve,reject) {
			var _this = mysql_impl_nodejs_DatabaseConnection.log;
			logging_LogManager.get_instance().log({ timestamp : HxOverrides.dateStr(new Date()), level : "Data", message : "exec:", data : sql, ref : _this._ref, instanceId : _this._instanceId});
			_gthis._nativeConnection.execute(sql,function(error,rows,fields) {
				if(error != null) {
					if(!_gthis.checkForDisconnection(error.message,mysql_impl__$DatabaseConnectionBase_CacheCall.CALL_EXEC,sql,null,resolve,reject)) {
						reject(new mysql_MySqlError("Error",error.message));
					}
					return;
				}
				var result = null;
				if(((rows) instanceof Array)) {
					result = rows[0];
				} else {
					result = rows;
				}
				var mysqlResult = new mysql_MySqlResult(_gthis,true);
				if(result != null) {
					mysqlResult.affectedRows = result.affectedRows;
					mysqlResult.lastInsertId = result.insertId;
				}
				resolve(mysqlResult);
			});
		});
	}
	,get: function(sql,param) {
		var _gthis = this;
		return thenshim_Promise._new(function(resolve,reject) {
			var _this = mysql_impl_nodejs_DatabaseConnection.log;
			logging_LogManager.get_instance().log({ timestamp : HxOverrides.dateStr(new Date()), level : "Data", message : "get:", data : [sql,param], ref : _this._ref, instanceId : _this._instanceId});
			_gthis._nativeConnection.execute(sql,_gthis.params(param),function(error,rows,fields) {
				if(error != null) {
					if(!_gthis.checkForDisconnection(error.message,mysql_impl__$DatabaseConnectionBase_CacheCall.CALL_GET,sql,param,resolve,reject)) {
						reject(new mysql_MySqlError("Error",error.message));
					}
					return;
				}
				var result = null;
				if(((rows) instanceof Array)) {
					result = rows[0];
				} else {
					result = rows;
				}
				_gthis.convertBuffersToBytes(rows);
				var mysqlResult = new mysql_MySqlResult(_gthis,result);
				if(result != null) {
					mysqlResult.affectedRows = result.affectedRows;
					mysqlResult.lastInsertId = result.insertId;
				}
				resolve(mysqlResult);
			});
		});
	}
	,query: function(sql,param) {
		var _gthis = this;
		return thenshim_Promise._new(function(resolve,reject) {
			var _this = mysql_impl_nodejs_DatabaseConnection.log;
			logging_LogManager.get_instance().log({ timestamp : HxOverrides.dateStr(new Date()), level : "Data", message : "query:", data : [sql,param], ref : _this._ref, instanceId : _this._instanceId});
			_gthis._nativeConnection.query(sql,_gthis.params(param),function(error,rows,fields) {
				if(error != null) {
					if(!_gthis.checkForDisconnection(error.message,mysql_impl__$DatabaseConnectionBase_CacheCall.CALL_QUERY,sql,param,resolve,reject)) {
						reject(new mysql_MySqlError("Error",error.message));
					}
					return;
				}
				_gthis.convertBuffersToBytes(rows);
				resolve(new mysql_MySqlResult(_gthis,rows));
			});
		});
	}
	,all: function(sql,param) {
		var _gthis = this;
		return thenshim_Promise._new(function(resolve,reject) {
			var _this = mysql_impl_nodejs_DatabaseConnection.log;
			logging_LogManager.get_instance().log({ timestamp : HxOverrides.dateStr(new Date()), level : "Data", message : "all:", data : [sql,param], ref : _this._ref, instanceId : _this._instanceId});
			_gthis._nativeConnection.execute(sql,_gthis.params(param),function(error,rows,fields) {
				if(error != null) {
					if(!_gthis.checkForDisconnection(error.message,mysql_impl__$DatabaseConnectionBase_CacheCall.CALL_ALL,sql,param,resolve,reject)) {
						reject(new mysql_MySqlError("Error",error.message));
					}
					return;
				}
				if(rows == null) {
					resolve(new mysql_MySqlResult(_gthis,[]));
				}
				_gthis.convertBuffersToBytes(rows);
				resolve(new mysql_MySqlResult(_gthis,rows));
			});
		});
	}
	,close: function() {
		this._nativeConnection.end();
	}
	,params: function(param) {
		var _g = Type.typeof(param);
		switch(_g._hx_index) {
		case 0:
			return null;
		case 6:
			if(_g.c == Array) {
				return param;
			} else {
				return [param];
			}
			break;
		default:
			return [param];
		}
	}
	,convertBuffersToBytes: function(data) {
		if(((data) instanceof Array)) {
			var array = data;
			var _g = 0;
			while(_g < array.length) {
				var item = array[_g];
				++_g;
				this.convertBuffersToBytes(item);
			}
		} else {
			var _g = 0;
			var _g1 = Reflect.fields(data);
			while(_g < _g1.length) {
				var f = _g1[_g];
				++_g;
				var v = Reflect.field(data,f);
				if(((v) instanceof js_node_buffer_Buffer)) {
					var buffer = v;
					var bytes = js_node_buffer__$Buffer_Helper.bytesOfBuffer(buffer);
					data[f] = bytes;
				}
			}
		}
	}
	,__class__: mysql_impl_nodejs_DatabaseConnection
});
var node_buffer_Buffer = require("buffer").Buffer;
var node_$html_$parser_Node = require("node-html-parser").Node;
var node_$html_$parser_HTMLElement = require("node-html-parser").HTMLElement;
var node_$html_$parser_NodeType = require("node-html-parser").NodeType;
var promises_PromiseUtils = function() { };
$hxClasses["promises.PromiseUtils"] = promises_PromiseUtils;
promises_PromiseUtils.__name__ = "promises.PromiseUtils";
promises_PromiseUtils.runSequentially = function(promises,failFast) {
	if(failFast == null) {
		failFast = true;
	}
	return thenshim_Promise._new(function(resolve,reject) {
		var results = [];
		promises_PromiseUtils._runSequentially(promises.slice(),failFast,results,resolve,reject);
	});
};
promises_PromiseUtils.runAll = function(promises,failFast,excludeFailures) {
	if(excludeFailures == null) {
		excludeFailures = false;
	}
	if(failFast == null) {
		failFast = false;
	}
	return thenshim_Promise._new(function(resolve,reject) {
		if(promises.length == 0) {
			resolve([]);
			return;
		}
		var results = [];
		var count = promises.length;
		var _g = 0;
		while(_g < promises.length) {
			var fn = promises[_g];
			++_g;
			var p = fn();
			thenshim_Promise.then(p,function(result) {
				count -= 1;
				results.push(result);
				if(count == 0) {
					resolve(results);
				}
			},function(e) {
				count -= 1;
				if(!excludeFailures) {
					results.push(e);
				}
				if(failFast == true) {
					reject(e);
				} else if(count == 0) {
					resolve(results);
				}
			});
		}
	});
};
promises_PromiseUtils.runAllMapped = function(promises,failFast,excludeFailures) {
	if(excludeFailures == null) {
		excludeFailures = false;
	}
	if(failFast == null) {
		failFast = false;
	}
	return thenshim_Promise._new(function(resolve,reject) {
		var results = new haxe_ds_StringMap();
		if(promises.length == 0) {
			resolve(results);
			return;
		}
		var count = promises.length;
		var _g = 0;
		while(_g < promises.length) {
			var item = promises[_g];
			++_g;
			var fn = item.promise;
			var id = [item.id];
			var p = fn();
			thenshim_Promise.then(p,(function(id) {
				return function(result) {
					count -= 1;
					results.h[id[0]] = result;
					if(count == 0) {
						resolve(results);
					}
				};
			})(id),(function(id) {
				return function(e) {
					count -= 1;
					if(!excludeFailures) {
						results.h[id[0]] = e;
					}
					if(failFast == true) {
						reject(e);
					} else if(count == 0) {
						resolve(results);
					}
				};
			})(id));
		}
	});
};
promises_PromiseUtils._runSequentially = function(list,failFast,results,resolve,reject) {
	if(list.length == 0) {
		resolve(results);
		return;
	}
	var fn = list.shift();
	var p = fn();
	thenshim_Promise.then(p,function(result) {
		results.push(result);
		promises_PromiseUtils._runSequentially(list,failFast,results,resolve,reject);
	},function(e) {
		if(failFast == true) {
			reject(e);
		} else {
			results.push(e);
			promises_PromiseUtils._runSequentially(list,failFast,results,resolve,reject);
		}
	});
};
promises_PromiseUtils.wait = function(amountMS) {
	return thenshim_Promise._new(function(resolve,reject) {
		haxe_Timer.delay(function() {
			resolve(true);
		},amountMS);
	});
};
promises_PromiseUtils.promisify = function(param) {
	return thenshim_Promise._new(function(resolve,_) {
		resolve(param);
	});
};
var queues_IQueue = function() { };
$hxClasses["queues.IQueue"] = queues_IQueue;
queues_IQueue.__name__ = "queues.IQueue";
queues_IQueue.__isInterface__ = true;
queues_IQueue.prototype = {
	get_name: null
	,set_name: null
	,get_onMessage: null
	,set_onMessage: null
	,config: null
	,start: null
	,stop: null
	,enqueue: null
	,requeue: null
	,__class__: queues_IQueue
	,__properties__: {set_onMessage:"set_onMessage",get_onMessage:"get_onMessage",set_name:"set_name",get_name:"get_name"}
};
var queues_NonQueue = function() {
	this._name = null;
	this.items = [];
};
$hxClasses["queues.NonQueue"] = queues_NonQueue;
queues_NonQueue.__name__ = "queues.NonQueue";
queues_NonQueue.__interfaces__ = [queues_IQueue];
queues_NonQueue.prototype = {
	items: null
	,_name: null
	,get_name: function() {
		return this._name;
	}
	,set_name: function(value) {
		this._name = value;
		return value;
	}
	,_onMessage: null
	,get_onMessage: function() {
		return this._onMessage;
	}
	,set_onMessage: function(value) {
		this._onMessage = value;
		this.processQueue();
		return value;
	}
	,config: function(config) {
	}
	,start: function() {
		return thenshim_Promise._new(function(resolve,reject) {
			resolve(true);
		});
	}
	,stop: function() {
		return thenshim_Promise._new(function(resolve,reject) {
			resolve(true);
		});
	}
	,enqueue: function(item) {
		this.items.push(item);
		this.processQueue();
	}
	,requeue: function(item,delay) {
		var _gthis = this;
		if(delay == null || delay == 0) {
			this.enqueue(item);
		} else {
			haxe_Timer.delay(function() {
				_gthis.enqueue(item);
			},delay);
		}
	}
	,processQueue: function() {
		var _gthis = this;
		if(this._onMessage == null || this.items.length == 0) {
			return;
		}
		var item = this.items.shift();
		thenshim_Promise.then(this._onMessage(item),function(success) {
			_gthis.processQueue();
		},function(error) {
			_gthis.processQueue();
		});
	}
	,__class__: queues_NonQueue
	,__properties__: {set_onMessage:"set_onMessage",get_onMessage:"get_onMessage",set_name:"set_name",get_name:"get_name"}
};
var queues_SimpleQueue = function() {
	this._processingItem = false;
	this._name = null;
	this.items = [];
};
$hxClasses["queues.SimpleQueue"] = queues_SimpleQueue;
queues_SimpleQueue.__name__ = "queues.SimpleQueue";
queues_SimpleQueue.__interfaces__ = [queues_IQueue];
queues_SimpleQueue.prototype = {
	items: null
	,_name: null
	,get_name: function() {
		return this._name;
	}
	,set_name: function(value) {
		this._name = value;
		return value;
	}
	,_onMessage: null
	,get_onMessage: function() {
		return this._onMessage;
	}
	,set_onMessage: function(value) {
		this._onMessage = value;
		this.processQueue();
		return value;
	}
	,config: function(config) {
	}
	,start: function() {
		return thenshim_Promise._new(function(resolve,reject) {
			resolve(true);
		});
	}
	,stop: function() {
		return thenshim_Promise._new(function(resolve,reject) {
			resolve(true);
		});
	}
	,enqueue: function(item) {
		this.items.push(item);
		if(this.items.length == 1) {
			this.processQueue();
		}
	}
	,requeue: function(item,delay) {
		var _gthis = this;
		if(delay == null || delay == 0) {
			this.enqueue(item);
		} else {
			haxe_Timer.delay(function() {
				_gthis.enqueue(item);
			},delay);
		}
	}
	,_processingItem: null
	,processQueue: function() {
		var _gthis = this;
		if(this._onMessage == null || this.items.length == 0) {
			return;
		}
		if(this._processingItem) {
			return;
		}
		this._processingItem = true;
		var item = this.items.shift();
		thenshim_Promise.then(this._onMessage(item),function(success) {
			_gthis._processingItem = false;
			_gthis.processQueue();
		},function(error) {
			_gthis._processingItem = false;
			_gthis.processQueue();
		});
	}
	,__class__: queues_SimpleQueue
	,__properties__: {set_onMessage:"set_onMessage",get_onMessage:"get_onMessage",set_name:"set_name",get_name:"get_name"}
};
var safety_SafetyException = function(message,previous,native) {
	haxe_Exception.call(this,message,previous,native);
	this.__skipStack++;
};
$hxClasses["safety.SafetyException"] = safety_SafetyException;
safety_SafetyException.__name__ = "safety.SafetyException";
safety_SafetyException.__super__ = haxe_Exception;
safety_SafetyException.prototype = $extend(haxe_Exception.prototype,{
	__class__: safety_SafetyException
});
var safety_NullPointerException = function(message,previous,native) {
	safety_SafetyException.call(this,message,previous,native);
	this.__skipStack++;
};
$hxClasses["safety.NullPointerException"] = safety_NullPointerException;
safety_NullPointerException.__name__ = "safety.NullPointerException";
safety_NullPointerException.__super__ = safety_SafetyException;
safety_NullPointerException.prototype = $extend(safety_SafetyException.prototype,{
	__class__: safety_NullPointerException
});
var sys_FileSystem = function() { };
$hxClasses["sys.FileSystem"] = sys_FileSystem;
sys_FileSystem.__name__ = "sys.FileSystem";
sys_FileSystem.exists = function(path) {
	try {
		js_node_Fs.accessSync(path);
		return true;
	} catch( _g ) {
		haxe_NativeStackTrace.lastError = _g;
		return false;
	}
};
sys_FileSystem.rename = function(path,newPath) {
	js_node_Fs.renameSync(path,newPath);
};
sys_FileSystem.stat = function(path) {
	return js_node_Fs.statSync(path);
};
sys_FileSystem.fullPath = function(relPath) {
	try {
		return js_node_Fs.realpathSync(relPath);
	} catch( _g ) {
		haxe_NativeStackTrace.lastError = _g;
		return null;
	}
};
sys_FileSystem.absolutePath = function(relPath) {
	if(haxe_io_Path.isAbsolute(relPath)) {
		return relPath;
	}
	return js_node_Path.resolve(relPath);
};
sys_FileSystem.isDirectory = function(path) {
	try {
		return js_node_Fs.statSync(path).isDirectory();
	} catch( _g ) {
		haxe_NativeStackTrace.lastError = _g;
		return false;
	}
};
sys_FileSystem.createDirectory = function(path) {
	try {
		js_node_Fs.mkdirSync(path);
	} catch( _g ) {
		haxe_NativeStackTrace.lastError = _g;
		var _g1 = haxe_Exception.caught(_g).unwrap();
		if(_g1.code == "ENOENT") {
			sys_FileSystem.createDirectory(js_node_Path.dirname(path));
			js_node_Fs.mkdirSync(path);
		} else {
			var stat;
			try {
				stat = js_node_Fs.statSync(path);
			} catch( _g2 ) {
				throw _g1;
			}
			if(!stat.isDirectory()) {
				throw _g1;
			}
		}
	}
};
sys_FileSystem.deleteFile = function(path) {
	js_node_Fs.unlinkSync(path);
};
sys_FileSystem.deleteDirectory = function(path) {
	if(sys_FileSystem.exists(path)) {
		var _g = 0;
		var _g1 = js_node_Fs.readdirSync(path);
		while(_g < _g1.length) {
			var file = _g1[_g];
			++_g;
			var curPath = path + "/" + file;
			if(sys_FileSystem.isDirectory(curPath)) {
				sys_FileSystem.deleteDirectory(curPath);
			} else {
				js_node_Fs.unlinkSync(curPath);
			}
		}
		js_node_Fs.rmdirSync(path);
	}
};
sys_FileSystem.readDirectory = function(path) {
	return js_node_Fs.readdirSync(path);
};
var sys_db_Connection = function() { };
$hxClasses["sys.db.Connection"] = sys_db_Connection;
sys_db_Connection.__name__ = "sys.db.Connection";
sys_db_Connection.__isInterface__ = true;
sys_db_Connection.prototype = {
	request: null
	,close: null
	,escape: null
	,quote: null
	,addValue: null
	,lastInsertId: null
	,dbName: null
	,startTransaction: null
	,commit: null
	,rollback: null
	,__class__: sys_db_Connection
};
var sys_db_Mysql = function() { };
$hxClasses["sys.db.Mysql"] = sys_db_Mysql;
sys_db_Mysql.__name__ = "sys.db.Mysql";
sys_db_Mysql.connect = function(params) {
	throw new haxe_exceptions_NotImplementedException("Not implemented for this platform",null,{ fileName : "sys/db/Mysql.hx", lineNumber : 34, className : "sys.db.Mysql", methodName : "connect"});
};
var sys_db_ResultSet = function() { };
$hxClasses["sys.db.ResultSet"] = sys_db_ResultSet;
sys_db_ResultSet.__name__ = "sys.db.ResultSet";
sys_db_ResultSet.__isInterface__ = true;
sys_db_ResultSet.prototype = {
	get_length: null
	,get_nfields: null
	,length: null
	,nfields: null
	,hasNext: null
	,next: null
	,results: null
	,getResult: null
	,getIntResult: null
	,getFloatResult: null
	,getFieldsNames: null
	,__class__: sys_db_ResultSet
	,__properties__: {get_nfields:"get_nfields",get_length:"get_length"}
};
var sys_io_File = function() { };
$hxClasses["sys.io.File"] = sys_io_File;
sys_io_File.__name__ = "sys.io.File";
sys_io_File.append = function(path,binary) {
	if(binary == null) {
		binary = true;
	}
	return new sys_io_FileOutput(js_node_Fs.openSync(path,"a"));
};
sys_io_File.write = function(path,binary) {
	if(binary == null) {
		binary = true;
	}
	return new sys_io_FileOutput(js_node_Fs.openSync(path,"w"));
};
sys_io_File.read = function(path,binary) {
	if(binary == null) {
		binary = true;
	}
	return new sys_io_FileInput(js_node_Fs.openSync(path,"r"));
};
sys_io_File.getContent = function(path) {
	return js_node_Fs.readFileSync(path,{ encoding : "utf8"});
};
sys_io_File.saveContent = function(path,content) {
	js_node_Fs.writeFileSync(path,content);
};
sys_io_File.getBytes = function(path) {
	return js_node_buffer__$Buffer_Helper.bytesOfBuffer(js_node_Fs.readFileSync(path));
};
sys_io_File.saveBytes = function(path,bytes) {
	var data = bytes.b;
	js_node_Fs.writeFileSync(path,js_node_buffer_Buffer.from(data.buffer,data.byteOffset,bytes.length));
};
sys_io_File.update = function(path,binary) {
	if(binary == null) {
		binary = true;
	}
	return new sys_io_FileOutput(js_node_Fs.openSync(path,"r+"));
};
sys_io_File.copy = function(srcPath,dstPath) {
	var src = js_node_Fs.openSync(srcPath,"r");
	var stat = js_node_Fs.fstatSync(src);
	var dst = js_node_Fs.openSync(dstPath,"w",stat.mode);
	var bytesRead;
	var pos = 0;
	while(true) {
		bytesRead = js_node_Fs.readSync(src,sys_io_File.copyBuf,0,65536,pos);
		if(!(bytesRead > 0)) {
			break;
		}
		js_node_Fs.writeSync(dst,sys_io_File.copyBuf,0,bytesRead);
		pos += bytesRead;
	}
	js_node_Fs.closeSync(src);
	js_node_Fs.closeSync(dst);
};
var sys_io_FileInput = function(fd) {
	this.hasReachedEof = false;
	this.fd = fd;
	this.pos = 0;
};
$hxClasses["sys.io.FileInput"] = sys_io_FileInput;
sys_io_FileInput.__name__ = "sys.io.FileInput";
sys_io_FileInput.__super__ = haxe_io_Input;
sys_io_FileInput.prototype = $extend(haxe_io_Input.prototype,{
	fd: null
	,pos: null
	,hasReachedEof: null
	,throwEof: function() {
		this.hasReachedEof = true;
		throw haxe_Exception.thrown(new haxe_io_Eof());
	}
	,readByte: function() {
		var buf = js_node_buffer_Buffer.alloc(1);
		var bytesRead;
		try {
			bytesRead = js_node_Fs.readSync(this.fd,buf,0,1,this.pos);
		} catch( _g ) {
			haxe_NativeStackTrace.lastError = _g;
			var _g1 = haxe_Exception.caught(_g).unwrap();
			if(_g1.code == "EOF") {
				this.hasReachedEof = true;
				throw haxe_Exception.thrown(new haxe_io_Eof());
			}
			throw haxe_Exception.thrown(haxe_io_Error.Custom(_g1));
		}
		if(bytesRead == 0) {
			this.hasReachedEof = true;
			throw haxe_Exception.thrown(new haxe_io_Eof());
		}
		this.pos++;
		return buf[0];
	}
	,readBytes: function(s,pos,len) {
		var data = s.b;
		var buf = js_node_buffer_Buffer.from(data.buffer,data.byteOffset,s.length);
		var bytesRead;
		try {
			bytesRead = js_node_Fs.readSync(this.fd,buf,pos,len,this.pos);
		} catch( _g ) {
			haxe_NativeStackTrace.lastError = _g;
			var _g1 = haxe_Exception.caught(_g).unwrap();
			if(_g1.code == "EOF") {
				this.hasReachedEof = true;
				throw haxe_Exception.thrown(new haxe_io_Eof());
			}
			throw haxe_Exception.thrown(haxe_io_Error.Custom(_g1));
		}
		if(bytesRead == 0) {
			this.hasReachedEof = true;
			throw haxe_Exception.thrown(new haxe_io_Eof());
		}
		this.pos += bytesRead;
		return bytesRead;
	}
	,close: function() {
		js_node_Fs.closeSync(this.fd);
	}
	,seek: function(p,pos) {
		this.hasReachedEof = false;
		switch(pos._hx_index) {
		case 0:
			this.pos = p;
			break;
		case 1:
			this.pos += p;
			break;
		case 2:
			this.pos = js_node_Fs.fstatSync(this.fd).size + p;
			break;
		}
	}
	,tell: function() {
		return this.pos;
	}
	,eof: function() {
		return this.hasReachedEof;
	}
	,__class__: sys_io_FileInput
});
var sys_io_FileOutput = function(fd) {
	this.fd = fd;
	this.pos = 0;
};
$hxClasses["sys.io.FileOutput"] = sys_io_FileOutput;
sys_io_FileOutput.__name__ = "sys.io.FileOutput";
sys_io_FileOutput.__super__ = haxe_io_Output;
sys_io_FileOutput.prototype = $extend(haxe_io_Output.prototype,{
	fd: null
	,pos: null
	,writeByte: function(b) {
		var buf = js_node_buffer_Buffer.alloc(1);
		buf[0] = b;
		js_node_Fs.writeSync(this.fd,buf,0,1,this.pos);
		this.pos++;
	}
	,writeBytes: function(s,pos,len) {
		var data = s.b;
		var buf = js_node_buffer_Buffer.from(data.buffer,data.byteOffset,s.length);
		var wrote = js_node_Fs.writeSync(this.fd,buf,pos,len,this.pos);
		this.pos += wrote;
		return wrote;
	}
	,close: function() {
		js_node_Fs.closeSync(this.fd);
	}
	,seek: function(p,pos) {
		switch(pos._hx_index) {
		case 0:
			this.pos = p;
			break;
		case 1:
			this.pos += p;
			break;
		case 2:
			this.pos = js_node_Fs.fstatSync(this.fd).size + p;
			break;
		}
	}
	,tell: function() {
		return this.pos;
	}
	,__class__: sys_io_FileOutput
});
var sys_io_FileSeek = $hxEnums["sys.io.FileSeek"] = { __ename__:"sys.io.FileSeek",__constructs__:null
	,SeekBegin: {_hx_name:"SeekBegin",_hx_index:0,__enum__:"sys.io.FileSeek",toString:$estr}
	,SeekCur: {_hx_name:"SeekCur",_hx_index:1,__enum__:"sys.io.FileSeek",toString:$estr}
	,SeekEnd: {_hx_name:"SeekEnd",_hx_index:2,__enum__:"sys.io.FileSeek",toString:$estr}
};
sys_io_FileSeek.__constructs__ = [sys_io_FileSeek.SeekBegin,sys_io_FileSeek.SeekCur,sys_io_FileSeek.SeekEnd];
sys_io_FileSeek.__empty_constructs__ = [sys_io_FileSeek.SeekBegin,sys_io_FileSeek.SeekCur,sys_io_FileSeek.SeekEnd];
var systems_DatabaseSystem = function(_universe) {
	this.reverse = [];
	this.event_cache = [];
	this.watches = [];
	this.updating = false;
	this.inserting = false;
	this.poll_times = new haxe_ds_EnumValueMap();
	this.polls = new haxe_ds_EnumValueMap();
	this.connected = false;
	ecs_System.call(this,_universe);
	this.dbevents = this.universe.families.get(1);
	this.table2136a94390b838cdff652db2cbb1a2d7 = this.universe.components.getTable(2);
};
$hxClasses["systems.DatabaseSystem"] = systems_DatabaseSystem;
systems_DatabaseSystem.__name__ = "systems.DatabaseSystem";
systems_DatabaseSystem.__super__ = ecs_System;
systems_DatabaseSystem.prototype = $extend(ecs_System.prototype,{
	connected: null
	,polls: null
	,poll_times: null
	,inserting: null
	,updating: null
	,db: null
	,watches: null
	,connected_time: null
	,event_cache: null
	,reverse: null
	,onEnabled: function() {
		var keys = Main.keys.mysql;
		this.db = db_DatabaseFactory.get_instance().createDatabase("mysql",{ database : keys.database, host : keys.host, user : keys.user, pass : keys.pass});
		this.db.setProperty("autoReconnect",true);
		this.db.setProperty("autoReconnectInterval",5000);
		this.db.setProperty("replayQueriesOnReconnection",true);
		this.connected_time = new Date().getTime() - util_Duration.fromString("8hrs");
	}
	,insert: function(table,value,callback) {
		thenshim_Promise.then(thenshim_Promise.then(this.db.table(table),function(result) {
			return result.table.add(value);
		}),function(result) {
			callback(database_Callback.Success("Inserted"));
		},function(error) {
			callback(database_Callback.Error("Insert failed",error));
		});
	}
	,connect: function() {
		var _gthis = this;
		thenshim_Promise.then(this.db.connect(),function(state) {
			if(state.data) {
				_gthis.connected = true;
				_gthis.connected_time = new Date().getTime();
				haxe_Log.trace("Database connected",{ fileName : "src/systems/DatabaseSystem.hx", lineNumber : 72, className : "systems.DatabaseSystem", methodName : "connect"});
			} else {
				_gthis.connected = false;
				_gthis.connected_time -= util_Duration.fromString("5hrs");
				haxe_Log.trace("Database not connected",{ fileName : "src/systems/DatabaseSystem.hx", lineNumber : 76, className : "systems.DatabaseSystem", methodName : "connect"});
			}
		},function(err) {
			haxe_Log.trace(err,{ fileName : "src/systems/DatabaseSystem.hx", lineNumber : 78, className : "systems.DatabaseSystem", methodName : "connect"});
		});
	}
	,update: function(_) {
		var _gthis = this;
		if(new Date().getTime() - this.connected_time > util_Duration.fromString("5hrs")) {
			this.connected_time = new Date().getTime();
			this.connected = false;
			this.connect();
		}
		if(!this.connected) {
			return;
		}
		var this1 = this.polls;
		var _g_keys = this1.keys();
		while(_g_keys.hasNext()) {
			var key = _g_keys.next();
			var _g_value = this1.get(key);
			var now = new Date().getTime();
			var last_sent = this.poll_times.get(key);
			var diff = now - last_sent;
			if(diff > _g_value) {
				this.poll_times.set(key,now);
				var entity = util_EcsTools.get_universe().createEntity();
				util_EcsTools.get_universe().components.set(entity,2,key);
				var ecsEntCompFlags = util_EcsTools.get_universe().components.flags[ecs_Entity.id(entity)];
				var ecsTmpFamily = util_EcsTools.get_universe().families.get(1);
				if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
					ecsTmpFamily.add(entity);
				}
			}
		}
		var _this = this.dbevents;
		var _set = _this.entities;
		var _active = _this.isActive();
		var _g_idx = _set.size() - 1;
		while(_active && _g_idx >= 0) {
			var entity = _set.getDense(_g_idx--);
			var event = this.table2136a94390b838cdff652db2cbb1a2d7.get(entity);
			if(event._hx_index == 13) {
				var _gevent = event.event;
				if(!this.polls.exists(_gevent)) {
					this.polls.set(_gevent,event.ms);
					this.poll_times.set(_gevent,0);
					haxe_Log.trace("Saved poll " + $hxEnums[_gevent.__enum__].__constructs__[_gevent._hx_index]._hx_name,{ fileName : "src/systems/DatabaseSystem.hx", lineNumber : 109, className : "systems.DatabaseSystem", methodName : "update"});
				}
			} else {
				this.reverse.push(event);
			}
			this.universe.deleteEntity(entity);
		}
		var _g = 0;
		var _g1 = this.reverse.length;
		while(_g < _g1) {
			++_g;
			var event = this.reverse.pop();
			switch(event._hx_index) {
			case 0:
				var callback = [event.callback];
				var query = "SELECT * FROM `" + event.table + "` WHERE " + event.field + " LIKE '%" + event.value + "%'";
				thenshim_Promise.then(this.db.raw(query),(function(callback) {
					return function(result) {
						if(result != null) {
							callback[0](database_Callback.Records(result.data));
						} else {
							callback[0](database_Callback.Error("No data",result.data));
						}
					};
				})(callback),(function() {
					return function(err) {
						haxe_Log.trace(err,{ fileName : "src/systems/DatabaseSystem.hx", lineNumber : 193, className : "systems.DatabaseSystem", methodName : "update"});
					};
				})());
				break;
			case 1:
				var _gby_value = event.by_value;
				var callback1 = [event.callback];
				var query1 = ["SELECT * FROM `" + event.table + "` WHERE " + event.by_column + " = '" + (_gby_value == null ? "null" : Std.string(_gby_value)) + "' AND " + event.field + " LIKE '%" + event.value + "%'"];
				thenshim_Promise.then(this.db.raw(query1[0]),(function(callback) {
					return function(result) {
						if(result != null) {
							callback[0](database_Callback.Records(result.data));
						} else {
							callback[0](database_Callback.Error("No data",result.data));
						}
					};
				})(callback1),(function(query) {
					return function(err) {
						haxe_Log.trace(query[0],{ fileName : "src/systems/DatabaseSystem.hx", lineNumber : 204, className : "systems.DatabaseSystem", methodName : "update"});
						haxe_Log.trace(err,{ fileName : "src/systems/DatabaseSystem.hx", lineNumber : 205, className : "systems.DatabaseSystem", methodName : "update"});
					};
				})(query1));
				break;
			case 2:
				var value = [event.value];
				var callback2 = [event.callback];
				thenshim_Promise.then(thenshim_Promise.then(this.db.table(event.table),(function(value) {
					return function(result) {
						return result.table.add(value[0]);
					};
				})(value)),(function(callback) {
					return function(res) {
						callback[0](database_Callback.Success("Inserted",res.data));
					};
				})(callback2),(function(value) {
					return function(err) {
						if(err.message != null && err.message.indexOf("DUPLICATE_DATA") != -1) {
							return;
						} else {
							haxe_Log.trace(value[0],{ fileName : "src/systems/DatabaseSystem.hx", lineNumber : 133, className : "systems.DatabaseSystem", methodName : "update"});
							haxe_Log.trace(err,{ fileName : "src/systems/DatabaseSystem.hx", lineNumber : 134, className : "systems.DatabaseSystem", methodName : "update"});
						}
					};
				})(value));
				break;
			case 3:
				var value1 = [event.value];
				var query2 = [event.query];
				var callback3 = [event.callback];
				if(this.updating) {
					var entity = util_EcsTools.get_universe().createEntity();
					util_EcsTools.get_universe().components.set(entity,2,event);
					var ecsEntCompFlags = util_EcsTools.get_universe().components.flags[ecs_Entity.id(entity)];
					var ecsTmpFamily = util_EcsTools.get_universe().families.get(1);
					if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
						ecsTmpFamily.add(entity);
					}
					continue;
				}
				this.updating = true;
				thenshim_Promise.then(thenshim_Promise.then(this.db.table(event.table),(function(query,value) {
					return function(result) {
						return result.table.update(query[0],value[0]);
					};
				})(query2,value1)),(function(callback) {
					return function(res) {
						_gthis.updating = false;
						callback[0](database_Callback.Success("Updated"));
					};
				})(callback3),(function(query,value) {
					return function(err) {
						haxe_Log.trace(err,{ fileName : "src/systems/DatabaseSystem.hx", lineNumber : 149, className : "systems.DatabaseSystem", methodName : "update"});
						haxe_Log.trace(Query.queryExprToSql(query[0]),{ fileName : "src/systems/DatabaseSystem.hx", lineNumber : 150, className : "systems.DatabaseSystem", methodName : "update"});
						haxe_Log.trace(value[0].debugString(),{ fileName : "src/systems/DatabaseSystem.hx", lineNumber : 151, className : "systems.DatabaseSystem", methodName : "update"});
						_gthis.updating = false;
					};
				})(query2,value1));
				break;
			case 5:
				var query3 = [event.query];
				var value2 = [event.value];
				var callback4 = [event.callback];
				var parse_key = this.parseKey(event.key);
				var column = [parse_key.column];
				thenshim_Promise.then(thenshim_Promise.then(thenshim_Promise.then(this.db.table(event.table),(function(query) {
					return function(result) {
						return result.table.findOne(query[0]);
					};
				})(query3)),(function(column,value,query) {
					return function(result) {
						_gthis.updating = true;
						if(result.data == null) {
							return result.table.add(value[0]);
						} else {
							if(column[0] != null) {
								value[0].field(column[0],result.data.field(column[0]));
							}
							if(value[0].hasField("id")) {
								value[0].removeField("id");
							}
							return result.table.update(query[0],value[0]);
						}
					};
				})(column,value2,query3)),(function(callback) {
					return function(result) {
						if(result.data.hasField("____status")) {
							var tmp = haxe_Log.trace;
							var tmp1 = result.data.field("____status");
							tmp("result null " + (tmp1 == null ? "null" : Std.string(tmp1)),{ fileName : "src/systems/DatabaseSystem.hx", lineNumber : 272, className : "systems.DatabaseSystem", methodName : "update"});
							return;
						}
						_gthis.updating = false;
						haxe_Log.trace("unblock",{ fileName : "src/systems/DatabaseSystem.hx", lineNumber : 277, className : "systems.DatabaseSystem", methodName : "update"});
						if(callback[0] != null) {
							callback[0](database_Callback.Success("Successfully updated record",result.data));
						}
					};
				})(callback4),(function(callback,value) {
					return function(err) {
						_gthis.updating = false;
						haxe_Log.trace("unblock",{ fileName : "src/systems/DatabaseSystem.hx", lineNumber : 283, className : "systems.DatabaseSystem", methodName : "update"});
						haxe_Log.trace(value[0],{ fileName : "src/systems/DatabaseSystem.hx", lineNumber : 284, className : "systems.DatabaseSystem", methodName : "update"});
						haxe_Log.trace(err,{ fileName : "src/systems/DatabaseSystem.hx", lineNumber : 285, className : "systems.DatabaseSystem", methodName : "update"});
						haxe_Log.trace(err.message,{ fileName : "src/systems/DatabaseSystem.hx", lineNumber : 286, className : "systems.DatabaseSystem", methodName : "update"});
						if(callback[0] != null) {
							callback[0](database_Callback.Error("Failed",err));
						}
					};
				})(callback4,value2));
				break;
			case 6:
				this.db.createTable(event.name,event.columns);
				break;
			case 7:
				var query4 = [event.query];
				var callback5 = [event.callback];
				thenshim_Promise.then(thenshim_Promise.then(this.db.table(event.table),(function(query) {
					return function(result) {
						return result.table.findOne(query[0]);
					};
				})(query4)),(function(callback) {
					return function(result) {
						if(result != null) {
							callback[0](database_Callback.Record(result.data));
						} else {
							callback[0](database_Callback.Error("No data",result.data));
						}
					};
				})(callback5),(function() {
					return function(err) {
						haxe_Log.trace(err,{ fileName : "src/systems/DatabaseSystem.hx", lineNumber : 163, className : "systems.DatabaseSystem", methodName : "update"});
					};
				})());
				break;
			case 8:
				var query5 = [event.query];
				var callback6 = [event.callback];
				thenshim_Promise.then(thenshim_Promise.then(this.db.table(event.table),(function(query) {
					return function(result) {
						return result.table.find(query[0]);
					};
				})(query5)),(function(callback) {
					return function(result) {
						if(result != null) {
							callback[0](database_Callback.Records(result.data));
						} else {
							callback[0](database_Callback.Error("No data",result.data));
						}
					};
				})(callback6),(function() {
					return function(err) {
						haxe_Log.trace(err,{ fileName : "src/systems/DatabaseSystem.hx", lineNumber : 173, className : "systems.DatabaseSystem", methodName : "update"});
					};
				})());
				break;
			case 9:
				var callback7 = [event.callback];
				thenshim_Promise.then(thenshim_Promise.then(this.db.table(event.table),(function() {
					return function(result) {
						return result.table.all();
					};
				})()),(function(callback) {
					return function(result) {
						if(result != null) {
							callback[0](database_Callback.Records(result.data));
						} else {
							callback[0](database_Callback.Error("No data",result.data));
						}
					};
				})(callback7),(function() {
					return function(err) {
						haxe_Log.trace(err,{ fileName : "src/systems/DatabaseSystem.hx", lineNumber : 183, className : "systems.DatabaseSystem", methodName : "update"});
					};
				})());
				break;
			case 10:
				var column1 = [event.column];
				var value3 = [event.value];
				var callback8 = [event.callback];
				this.getTable(event.table,(function(callback,value,column) {
					return function(result) {
						var record = new db_Record();
						record.field(column[0],value[0]);
						thenshim_Promise.then(result.table.delete(record),(function(callback) {
							return function(succ) {
								if(succ.itemsAffected == 0) {
									callback[0](database_Callback.Error("Failed to delete"));
								} else {
									callback[0](database_Callback.Success("Successfully deleted",succ.data));
								}
							};
						})(callback),(function(callback) {
							return function(err) {
								callback[0](database_Callback.Error("Failed",err));
								haxe_Log.trace(err == null ? "null" : Std.string(err),{ fileName : "src/systems/DatabaseSystem.hx", lineNumber : 220, className : "systems.DatabaseSystem", methodName : "update"});
							};
						})(callback));
					};
				})(callback8,value3,column1),(function(callback) {
					return function(err) {
						haxe_Log.trace(err,{ fileName : "src/systems/DatabaseSystem.hx", lineNumber : 223, className : "systems.DatabaseSystem", methodName : "update"});
						callback[0](database_Callback.Error("Failed",err));
					};
				})(callback8));
				break;
			case 11:
				var value4 = [event.value];
				var callback9 = [event.callback];
				this.getTable(event.table,(function(callback,value) {
					return function(result) {
						thenshim_Promise.then(result.table.delete(value[0]),(function(callback) {
							return function(succ) {
								if(succ.itemsAffected == null || succ.itemsAffected == 0) {
									callback[0](database_Callback.Error("Failed to delete"));
								} else {
									callback[0](database_Callback.Success("Successfully deleted",succ.data));
								}
							};
						})(callback),(function(callback) {
							return function(err) {
								callback[0](database_Callback.Error("Failed",err));
								haxe_Log.trace(err == null ? "null" : Std.string(err),{ fileName : "src/systems/DatabaseSystem.hx", lineNumber : 237, className : "systems.DatabaseSystem", methodName : "update"});
							};
						})(callback));
					};
				})(callback9,value4),(function(callback) {
					return function(err) {
						haxe_Log.trace(err,{ fileName : "src/systems/DatabaseSystem.hx", lineNumber : 240, className : "systems.DatabaseSystem", methodName : "update"});
						callback[0](database_Callback.Error("Failed",err));
					};
				})(callback9));
				break;
			default:
				haxe_Log.trace("" + $hxEnums[event.__enum__].__constructs__[event._hx_index]._hx_name + " not implemented",{ fileName : "src/systems/DatabaseSystem.hx", lineNumber : 295, className : "systems.DatabaseSystem", methodName : "update"});
			}
		}
	}
	,parseKey: function(value) {
		var key = null;
		var column = null;
		if(value.indexOf(":") != -1) {
			var split = value.split(":");
			key = split[1];
			column = split[0];
		} else {
			key = value;
		}
		return { key : key, column : column};
	}
	,getTable: function(name,succ,err) {
		thenshim_Promise.then(this.db.table(name),succ,err);
	}
	,dbevents: null
	,table2136a94390b838cdff652db2cbb1a2d7: null
	,__class__: systems_DatabaseSystem
});
var systems_MessageRouter = function(_universe) {
	ecs_System.call(this,_universe);
	this.messages = this.universe.families.get(3);
	this.table87a8f92f715c03d0822a55d9b93a210d = this.universe.components.getTable(5);
	this.tabled1cd3067ebd0108e92f1425a40ea7b45 = this.universe.components.getTable(1);
};
$hxClasses["systems.MessageRouter"] = systems_MessageRouter;
systems_MessageRouter.__name__ = "systems.MessageRouter";
systems_MessageRouter.__super__ = ecs_System;
systems_MessageRouter.prototype = $extend(ecs_System.prototype,{
	update: function(_) {
		var _this = this.messages;
		var _set = _this.entities;
		var _active = _this.isActive();
		var _g_idx = _set.size() - 1;
		while(_active && _g_idx >= 0) {
			var entity = _set.getDense(_g_idx--);
			var command = this.table87a8f92f715c03d0822a55d9b93a210d.get(entity);
			var message = this.tabled1cd3067ebd0108e92f1425a40ea7b45.get(entity);
			if(command != "new_message") {
				continue;
			}
			this.universe.deleteEntity(entity);
			var channel = message.channel;
			var entity1 = util_EcsTools.get_universe().createEntity();
			util_EcsTools.get_universe().components.set(entity1,5,"rate_limit");
			util_EcsTools.get_universe().components.set(entity1,1,message);
			var ecsEntCompFlags = util_EcsTools.get_universe().components.flags[ecs_Entity.id(entity1)];
			var ecsTmpFamily = util_EcsTools.get_universe().families.get(3);
			if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
				ecsTmpFamily.add(entity1);
			}
			var ecsTmpFamily1 = util_EcsTools.get_universe().families.get(4);
			if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily1.componentsMask)) {
				ecsTmpFamily1.add(entity1);
			}
			var ecsTmpFamily2 = util_EcsTools.get_universe().families.get(5);
			if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily2.componentsMask)) {
				ecsTmpFamily2.add(entity1);
			}
			var ecsTmpFamily3 = util_EcsTools.get_universe().families.get(0);
			if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily3.componentsMask)) {
				ecsTmpFamily3.add(entity1);
			}
			var entity2 = util_EcsTools.get_universe().createEntity();
			util_EcsTools.get_universe().components.set(entity2,5,"scam_prevention");
			util_EcsTools.get_universe().components.set(entity2,1,message);
			var ecsEntCompFlags1 = util_EcsTools.get_universe().components.flags[ecs_Entity.id(entity2)];
			var ecsTmpFamily4 = util_EcsTools.get_universe().families.get(3);
			if(bits_Bits.areSet(ecsEntCompFlags1,ecsTmpFamily4.componentsMask)) {
				ecsTmpFamily4.add(entity2);
			}
			var ecsTmpFamily5 = util_EcsTools.get_universe().families.get(4);
			if(bits_Bits.areSet(ecsEntCompFlags1,ecsTmpFamily5.componentsMask)) {
				ecsTmpFamily5.add(entity2);
			}
			var ecsTmpFamily6 = util_EcsTools.get_universe().families.get(5);
			if(bits_Bits.areSet(ecsEntCompFlags1,ecsTmpFamily6.componentsMask)) {
				ecsTmpFamily6.add(entity2);
			}
			var ecsTmpFamily7 = util_EcsTools.get_universe().families.get(0);
			if(bits_Bits.areSet(ecsEntCompFlags1,ecsTmpFamily7.componentsMask)) {
				ecsTmpFamily7.add(entity2);
			}
			var entity3 = util_EcsTools.get_universe().createEntity();
			util_EcsTools.get_universe().components.set(entity3,5,"keyword_tracker");
			util_EcsTools.get_universe().components.set(entity3,1,message);
			var ecsEntCompFlags2 = util_EcsTools.get_universe().components.flags[ecs_Entity.id(entity3)];
			var ecsTmpFamily8 = util_EcsTools.get_universe().families.get(3);
			if(bits_Bits.areSet(ecsEntCompFlags2,ecsTmpFamily8.componentsMask)) {
				ecsTmpFamily8.add(entity3);
			}
			var ecsTmpFamily9 = util_EcsTools.get_universe().families.get(4);
			if(bits_Bits.areSet(ecsEntCompFlags2,ecsTmpFamily9.componentsMask)) {
				ecsTmpFamily9.add(entity3);
			}
			var ecsTmpFamily10 = util_EcsTools.get_universe().families.get(5);
			if(bits_Bits.areSet(ecsEntCompFlags2,ecsTmpFamily10.componentsMask)) {
				ecsTmpFamily10.add(entity3);
			}
			var ecsTmpFamily11 = util_EcsTools.get_universe().families.get(0);
			if(bits_Bits.areSet(ecsEntCompFlags2,ecsTmpFamily11.componentsMask)) {
				ecsTmpFamily11.add(entity3);
			}
			if(channel.id == "1234544675264925788") {
				var entity4 = util_EcsTools.get_universe().createEntity();
				util_EcsTools.get_universe().components.set(entity4,5,"suggestion_box");
				util_EcsTools.get_universe().components.set(entity4,1,message);
				var ecsEntCompFlags3 = util_EcsTools.get_universe().components.flags[ecs_Entity.id(entity4)];
				var ecsTmpFamily12 = util_EcsTools.get_universe().families.get(3);
				if(bits_Bits.areSet(ecsEntCompFlags3,ecsTmpFamily12.componentsMask)) {
					ecsTmpFamily12.add(entity4);
				}
				var ecsTmpFamily13 = util_EcsTools.get_universe().families.get(4);
				if(bits_Bits.areSet(ecsEntCompFlags3,ecsTmpFamily13.componentsMask)) {
					ecsTmpFamily13.add(entity4);
				}
				var ecsTmpFamily14 = util_EcsTools.get_universe().families.get(5);
				if(bits_Bits.areSet(ecsEntCompFlags3,ecsTmpFamily14.componentsMask)) {
					ecsTmpFamily14.add(entity4);
				}
				var ecsTmpFamily15 = util_EcsTools.get_universe().families.get(0);
				if(bits_Bits.areSet(ecsEntCompFlags3,ecsTmpFamily15.componentsMask)) {
					ecsTmpFamily15.add(entity4);
				}
			}
			switch(channel.type) {
			case 0:
				this.guildTextChannel(message);
				break;
			case 11:
				this.publicThreadChannel(message);
				break;
			default:
			}
		}
	}
	,publicThreadChannel: function(message) {
		if(StringTools.startsWith(message.content,"[showcase]")) {
			haxe_Log.trace("Author: " + message.author.username,{ fileName : "src/systems/MessageRouter.hx", lineNumber : 40, className : "systems.MessageRouter", methodName : "publicThreadChannel"});
			var entity = util_EcsTools.get_universe().createEntity();
			util_EcsTools.get_universe().components.set(entity,5,"showcase");
			util_EcsTools.get_universe().components.set(entity,1,message);
			var ecsEntCompFlags = util_EcsTools.get_universe().components.flags[ecs_Entity.id(entity)];
			var ecsTmpFamily = util_EcsTools.get_universe().families.get(3);
			if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
				ecsTmpFamily.add(entity);
			}
			var ecsTmpFamily = util_EcsTools.get_universe().families.get(4);
			if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
				ecsTmpFamily.add(entity);
			}
			var ecsTmpFamily = util_EcsTools.get_universe().families.get(5);
			if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
				ecsTmpFamily.add(entity);
			}
			var ecsTmpFamily = util_EcsTools.get_universe().families.get(0);
			if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
				ecsTmpFamily.add(entity);
			}
		}
		var entity = util_EcsTools.get_universe().createEntity();
		util_EcsTools.get_universe().components.set(entity,5,"thread_count");
		util_EcsTools.get_universe().components.set(entity,1,message);
		var ecsEntCompFlags = util_EcsTools.get_universe().components.flags[ecs_Entity.id(entity)];
		var ecsTmpFamily = util_EcsTools.get_universe().families.get(3);
		if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
			ecsTmpFamily.add(entity);
		}
		var ecsTmpFamily = util_EcsTools.get_universe().families.get(4);
		if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
			ecsTmpFamily.add(entity);
		}
		var ecsTmpFamily = util_EcsTools.get_universe().families.get(5);
		if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
			ecsTmpFamily.add(entity);
		}
		var ecsTmpFamily = util_EcsTools.get_universe().families.get(0);
		if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
			ecsTmpFamily.add(entity);
		}
	}
	,guildTextChannel: function(message) {
		var channel = message.channel;
		if(channel.id == "162664383082790912" && !message.system) {
			var entity = util_EcsTools.get_universe().createEntity();
			util_EcsTools.get_universe().components.set(entity,5,"showcase_message");
			util_EcsTools.get_universe().components.set(entity,1,message);
			var ecsEntCompFlags = util_EcsTools.get_universe().components.flags[ecs_Entity.id(entity)];
			var ecsTmpFamily = util_EcsTools.get_universe().families.get(3);
			if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
				ecsTmpFamily.add(entity);
			}
			var ecsTmpFamily = util_EcsTools.get_universe().families.get(4);
			if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
				ecsTmpFamily.add(entity);
			}
			var ecsTmpFamily = util_EcsTools.get_universe().families.get(5);
			if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
				ecsTmpFamily.add(entity);
			}
			var ecsTmpFamily = util_EcsTools.get_universe().families.get(0);
			if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
				ecsTmpFamily.add(entity);
			}
		}
		if(StringTools.startsWith(message.content,"!run")) {
			haxe_Log.trace("here",{ fileName : "src/systems/MessageRouter.hx", lineNumber : 54, className : "systems.MessageRouter", methodName : "guildTextChannel"});
			var _ecsTmpEntity = this.universe.createEntity();
			this.universe.components.set(_ecsTmpEntity,0,"!run");
			this.universe.components.set(_ecsTmpEntity,1,message);
			var ecsEntCompFlags = this.universe.components.flags[ecs_Entity.id(_ecsTmpEntity)];
			var ecsTmpFamily = this.universe.families.get(0);
			if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
				ecsTmpFamily.add(_ecsTmpEntity);
			}
			var ecsTmpFamily = this.universe.families.get(3);
			if(bits_Bits.areSet(ecsEntCompFlags,ecsTmpFamily.componentsMask)) {
				ecsTmpFamily.add(_ecsTmpEntity);
			}
		}
	}
	,messages: null
	,table87a8f92f715c03d0822a55d9b93a210d: null
	,tabled1cd3067ebd0108e92f1425a40ea7b45: null
	,__class__: systems_MessageRouter
});
var thenshim_PromiseFactory = function() { };
$hxClasses["thenshim.PromiseFactory"] = thenshim_PromiseFactory;
thenshim_PromiseFactory.__name__ = "thenshim.PromiseFactory";
thenshim_PromiseFactory.__isInterface__ = true;
thenshim_PromiseFactory.prototype = {
	make: null
	,asResolved: null
	,asRejected: null
	,__class__: thenshim_PromiseFactory
};
var thenshim_js_JSPromiseFactory = function() {
};
$hxClasses["thenshim.js.JSPromiseFactory"] = thenshim_js_JSPromiseFactory;
thenshim_js_JSPromiseFactory.__name__ = "thenshim.js.JSPromiseFactory";
thenshim_js_JSPromiseFactory.__interfaces__ = [thenshim_PromiseFactory];
thenshim_js_JSPromiseFactory.prototype = {
	make: function(executor) {
		return new Promise(executor);
	}
	,asResolved: function(object) {
		return Promise.resolve(object);
	}
	,asRejected: function(reason) {
		return Promise.reject(reason);
	}
	,__class__: thenshim_js_JSPromiseFactory
};
var thenshim_Promise = {};
thenshim_Promise._new = function(executor) {
	return thenshim_Promise.factory.make(executor);
};
thenshim_Promise.resolve = function(object) {
	return thenshim_Promise.factory.asResolved(object);
};
thenshim_Promise.reject = function(reason) {
	return thenshim_Promise.factory.asRejected(reason);
};
thenshim_Promise.then = function(this1,onFulfilled,onRejected) {
	return this1.then(onFulfilled,onRejected);
};
var thenshim_Thenable = function() { };
$hxClasses["thenshim.Thenable"] = thenshim_Thenable;
thenshim_Thenable.__name__ = "thenshim.Thenable";
thenshim_Thenable.__isInterface__ = true;
thenshim_Thenable.prototype = {
	then: null
	,__class__: thenshim_Thenable
};
var thenshim_ThenableCallback = {};
thenshim_ThenableCallback.toJSPromiseHandler = function(this1) {
	return this1;
};
var util_DiscordUtil = function() { };
$hxClasses["util.DiscordUtil"] = util_DiscordUtil;
util_DiscordUtil.__name__ = "util.DiscordUtil";
util_DiscordUtil.setCommandPermission = function(command,permissions,succ,fail) {
	command.permissions.set({ guild : Main.guild_id, command : command.id, permissions : permissions}).then(function(_) {
		if(succ != null) {
			succ();
		}
		haxe_Log.trace("Updated permissions for " + command.name,{ fileName : "src/util/DiscordUtil.hx", lineNumber : 24, className : "util.DiscordUtil", methodName : "setCommandPermission"});
	},function(err) {
		if(fail != null) {
			fail(err);
		}
		haxe_Log.trace(err,{ fileName : "src/util/DiscordUtil.hx", lineNumber : 29, className : "util.DiscordUtil", methodName : "setCommandPermission"});
		haxe_Log.trace("Failed to update permissions for " + command.name,{ fileName : "src/util/DiscordUtil.hx", lineNumber : 30, className : "util.DiscordUtil", methodName : "setCommandPermission"});
	});
};
util_DiscordUtil.reactionTracker = function(message,track,time) {
	if(time == null) {
		time = -1;
	}
	var filter = function(reaction,user) {
		if(reaction.emoji.name == "✅") {
			return true;
		}
		if(reaction.emoji.name == "❎") {
			return true;
		}
		reaction.remove();
		return false;
	};
	if(time == -1) {
		time = 172800000;
	}
	message.react("✅").then(null,function(err) {
		haxe_Log.trace(err,{ fileName : "src/util/DiscordUtil.hx", lineNumber : 53, className : "util.DiscordUtil", methodName : "reactionTracker"});
		$global.console.dir(err);
	}).then(function(_) {
		message.react("❎").then(null,function(err) {
			haxe_Log.trace(err,{ fileName : "src/util/DiscordUtil.hx", lineNumber : 57, className : "util.DiscordUtil", methodName : "reactionTracker"});
			$global.console.dir(err);
		}).then(function(_) {
			var collector = message.createReactionCollector({ filter : filter, time : time});
			var _g = track;
			var collector1 = collector;
			collector.on("collect",function(collected,user) {
				_g(collector1,collected,user);
			});
		});
	});
};
util_DiscordUtil.getChannel = function(channel_id,callback) {
	Main.client.channels.fetch(channel_id).then(callback,function(err) {
		haxe_Log.trace(err,{ fileName : "src/util/DiscordUtil.hx", lineNumber : 68, className : "util.DiscordUtil", methodName : "getChannel"});
		$global.console.dir(err);
	});
};
var util_Duration = {};
util_Duration._new = function(value) {
	return value;
};
util_Duration.gt = null;
util_Duration.gtequalto = null;
util_Duration.lt = null;
util_Duration.ltequalto = null;
util_Duration.equality = null;
util_Duration.gtfloat = null;
util_Duration.gtequaltofloat = null;
util_Duration.ltfloat = null;
util_Duration.ltequaltofloat = null;
util_Duration.equalityFloat = null;
util_Duration.addition = null;
util_Duration.fromString = function(input) {
	var time = 0.;
	var sec_regex = new EReg("([0-9]+)[ ]?(s|sec|secs)\\b","gi");
	if(sec_regex.match(input)) {
		var num = parseFloat(sec_regex.matched(1));
		time = num * 1000;
	}
	var min_regex = new EReg("([0-9]+)[ ]?(m|min|mins)\\b","gi");
	if(min_regex.match(input)) {
		var num = parseFloat(min_regex.matched(1));
		time = num * 60000;
	}
	var hour_regex = new EReg("([0-9]+)[ ]?(h|hr|hrs|hours)\\b","gi");
	if(hour_regex.match(input)) {
		var num = parseFloat(hour_regex.matched(1));
		time = num * 3600000;
	}
	var day_regex = new EReg("([0-9]+)[ ]?(d|day|days)\\b","gi");
	if(day_regex.match(input)) {
		var num = parseFloat(day_regex.matched(1));
		time = num * 86400000;
	}
	var week_regex = new EReg("([0-9]+)[ ]?(w|wk|wks|week|weeks)\\b","gi");
	if(week_regex.match(input)) {
		var num = parseFloat(week_regex.matched(1));
		time = num * 604800000;
	}
	var month_regex = new EReg("([0-9]+)[ ]?(mo|mos|mths|month|months)\\b","gi");
	if(month_regex.match(input)) {
		var num = parseFloat(month_regex.matched(1));
		time = num * 2419200000;
	}
	return util_Duration._new(time);
};
var util_EcsTools = function() { };
$hxClasses["util.EcsTools"] = util_EcsTools;
util_EcsTools.__name__ = "util.EcsTools";
util_EcsTools.__properties__ = {set_universe:"set_universe",get_universe:"get_universe"};
util_EcsTools._universe = null;
util_EcsTools.get_universe = function() {
	if(util_EcsTools._universe == null) {
		return Main.universe;
	}
	return util_EcsTools._universe;
};
util_EcsTools.set_universe = function(value) {
	return util_EcsTools._universe = value;
};
var util_Random = function() { };
$hxClasses["util.Random"] = util_Random;
util_Random.__name__ = "util.Random";
util_Random.bool = function() {
	return Math.random() < 0.5;
};
util_Random.int = function(from,to) {
	return from + Math.floor((to - from + 1) * Math.random());
};
util_Random.float = function(from,to) {
	return from + (to - from) * Math.random();
};
util_Random.string = function(length,charactersToUse) {
	if(charactersToUse == null) {
		charactersToUse = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	}
	var str = "";
	var _g = 0;
	while(_g < length) {
		++_g;
		str += charactersToUse.charAt(Math.floor((charactersToUse.length - 1 + 1) * Math.random()));
	}
	return str;
};
util_Random.date = function(earliest,latest) {
	var from = earliest.getTime();
	return new Date(from + (latest.getTime() - from) * Math.random());
};
util_Random.fromArray = function(arr) {
	if(arr != null && arr.length > 0) {
		return arr[Math.floor((arr.length - 1 + 1) * Math.random())];
	} else {
		return null;
	}
};
util_Random.shuffle = function(arr) {
	if(arr != null) {
		var _g = 0;
		var _g1 = arr.length;
		while(_g < _g1) {
			var i = _g++;
			var j = Math.floor((arr.length - 1 + 1) * Math.random());
			var a = arr[i];
			var b = arr[j];
			arr[i] = b;
			arr[j] = a;
		}
	}
	return arr;
};
util_Random.fromIterable = function(it) {
	if(it != null) {
		var arr = Lambda.array(it);
		if(arr != null && arr.length > 0) {
			return arr[Math.floor((arr.length - 1 + 1) * Math.random())];
		} else {
			return null;
		}
	} else {
		return null;
	}
};
util_Random.enumConstructor = function(e) {
	if(e != null) {
		var arr = e.__empty_constructs__.slice();
		if(arr != null && arr.length > 0) {
			return arr[Math.floor((arr.length - 1 + 1) * Math.random())];
		} else {
			return null;
		}
	} else {
		return null;
	}
};
var vm2_NodeVM = require("vm2").NodeVM;
var vm2_VMScript = require("vm2").VMScript;
function $getIterator(o) { if( o instanceof Array ) return new haxe_iterators_ArrayIterator(o); else return o.iterator(); }
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $global.$haxeUID++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = m.bind(o); o.hx__closures__[m.__id__] = f; } return f; }
$global.$haxeUID |= 0;
if(typeof(performance) != "undefined" ? typeof(performance.now) == "function" : false) {
	HxOverrides.now = performance.now.bind(performance);
}
$hxClasses["Math"] = Math;
if( String.fromCodePoint == null ) String.fromCodePoint = function(c) { return c < 0x10000 ? String.fromCharCode(c) : String.fromCharCode((c>>10)+0xD7C0)+String.fromCharCode((c&0x3FF)+0xDC00); }
Object.defineProperty(String.prototype,"__class__",{ value : $hxClasses["String"] = String, enumerable : false, writable : true});
String.__name__ = "String";
$hxClasses["Array"] = Array;
Array.__name__ = "Array";
Date.prototype.__class__ = $hxClasses["Date"] = Date;
Date.__name__ = "Date";
var Int = { };
var Dynamic = { };
var Float = Number;
var Bool = Boolean;
var Class = { };
var Enum = { };
js_Boot.__toStr = ({ }).toString;
if(ArrayBuffer.prototype.slice == null) {
	ArrayBuffer.prototype.slice = js_lib__$ArrayBuffer_ArrayBufferCompat.sliceImpl;
}
DateTools.DAY_SHORT_NAMES = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
DateTools.DAY_NAMES = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
DateTools.MONTH_SHORT_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
DateTools.MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
DateTools.DAYS_OF_MONTH = [31,28,31,30,31,30,31,31,30,31,30,31];
EReg.escapeRe = new RegExp("[.*+?^${}()|[\\]\\\\]","g");
Main.logged_in = false;
Main.registered_commands = new haxe_ds_StringMap();
Main.commands_active = false;
Main.connected = false;
Main.dm_help_tracking = new haxe_ds_StringMap();
Main.active_systems = new haxe_ds_StringMap();
Main.guild_id = "162395145352904705";
CommandPermission.admin = 8;
CommandPermission.supermod = 4;
CommandPermission.everyone = 1024 | 2048;
haxe_SysTools.winMetaCharacters = [32,40,41,37,33,94,34,60,62,38,124,10,13,44,59];
StringTools.winMetaCharacters = haxe_SysTools.winMetaCharacters;
StringTools.MIN_SURROGATE_CODE_POINT = 65536;
bits_BitsData.CELL_SIZE = 32;
commands_HelpType.run = "run";
commands_HelpType.rtfm = "rtfm";
commands_HelpType.notify = "notify";
commands_HelpType.helppls = "helppls";
commands_HelpType.helppls_dm = "helppls_dm";
commands_PollTime.fifteen = 900000;
commands_PollTime.thirty = 1800000;
commands_PollTime.one_hour = 3600000;
commands_PollTime.four_hours = 14400000;
commands_PollTime.eight_hours = 28800000;
commands_PollTime.twelve_hours = 43200000;
commands_PollTime.one_day = 86400000;
commands_PollTime.three_days = 259200000;
commands_PollTime.five_days = 432000000;
commands_PollTime.one_week = 604800000;
commands_PollTime.two_weeks = 1210000000;
commands_types_Duration.minute = 60000;
commands_types_Duration.hour = 3600000;
commands_types_Duration.day = 86400000;
commands_types_Duration.week = 604800000;
commands_types_Duration.month = 2419200000;
components_TextCommand.mention = "!mention";
components_TextCommand.run = "!run";
database_types_DBEmoji.__meta__ = { fields : { author_id : { crecord : null}, author_tag : { crecord : null}, name : { crecord : null}, url : { crecord : null}, description : { crecord : null}, timestamp : { record : null}, id : { record : null}}};
database_types_DBQuote.__meta__ = { fields : { author_id : { crecord : null}, author_tag : { crecord : null}, title : { crecord : null}, description : { crecord : null}, timestamp : { record : null}, id : { record : null}}};
database_types_DBRateLimit.__meta__ = { fields : { user_id : { crecord : null}, user_tag : { crecord : null}, mod_id : { crecord : null}, mod_tag : { crecord : null}, count : { crecord : null}, time : { crecord : null}, reason : { record : null}, silenced : { record : null}, created : { record : null}, id : { record : null}}};
database_types_DBReminder.__meta__ = { fields : { id : { record : null}, author_id : { crecord : null}, content : { crecord : null}, duration : { crecord : null}, channel_id : { crecord : null}, is_thread : { crecord : null}, sent : { record : null}, personal : { record : null}, thread_reply : { record : null}, timestamp : { record : null}}};
database_types_DBSnippet.__meta__ = { fields : { author_id : { crecord : null}, title : { crecord : null}, url : { crecord : null}, description : { crecord : null}, timestamp : { record : null}, snippet_id : { record : null}}};
db_DatabaseFactory._instance = null;
db_DatabaseFactory.MYSQL = "mysql";
db_mysql_MySqlDataTypeMapper._instance = null;
logging_Logger._uniqueIds = null;
db_mysql_MySqlDatabase.log = new logging_Logger(db_mysql_MySqlDatabase,null,true);
db_mysql_MySqlTable.log = new logging_Logger(db_mysql_MySqlTable,null,true);
db_mysql_Utils.SQL_TABLE_EXISTS = "SELECT * FROM information_schema.TABLES WHERE TABLE_SCHEMA=? AND TABLE_NAME=?;";
db_mysql_Utils.SQL_LIST_TABLES_AND_FIELDS = "SELECT * FROM information_schema.columns\r\n                                                           WHERE table_schema = ?\r\n                                                           ORDER BY table_name,ordinal_position;";
ecs_Entity.none = ecs_Entity._new(-1);
ecs_ds_Unit.unit = ecs_ds_Unit._new();
haxe_Int32._mul = Math.imul != null ? Math.imul : function(a,b) {
	return a * (b & 65535) + (a * (b >>> 16) << 16 | 0) | 0;
};
haxe_io_FPHelper.i64tmp = new haxe__$Int64__$_$_$Int64(0,0);
haxe_io_FPHelper.LN2 = 0.6931471805599453;
haxe_io_FPHelper.helper = new DataView(new ArrayBuffer(8));
haxe_io_UInt8Array.BYTES_PER_ELEMENT = 1;
logging_LogManager._instance = null;
mysql_impl_nodejs_DatabaseConnection.log = new logging_Logger(mysql_impl_nodejs_DatabaseConnection,null,true);
sys_io_File.copyBufLen = 65536;
sys_io_File.copyBuf = js_node_buffer_Buffer.alloc(65536);
thenshim_Promise.factory = new thenshim_js_JSPromiseFactory();
util_Duration.minute = 60000;
util_Duration.hour = 3600000;
util_Duration.day = 86400000;
util_Duration.week = 604800000;
util_Duration.month = 2419200000;
Main.main();
})(typeof window != "undefined" ? window : typeof global != "undefined" ? global : typeof self != "undefined" ? self : this);

//# sourceMappingURL=main.js.map