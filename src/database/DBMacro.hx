package database;

#if macro
import haxe.macro.Expr;
import haxe.macro.Context;

class DBMacros {
	public static function makeRecord() {
		var call = Context.getLocalClass();
		var cfields = Context.getBuildFields();

		var gblock = [];
		var sblock = [];

		var init_class = 'var p = new ${call.get().name}(';
		var constructor = null;

		var fields = [];

		for (field in cfields) {
			if (field.meta == null) {
				if (field.name == "new") {
					constructor = field;
				}
				continue;
			}
			var id = field.name;
			for (meta in field.meta) {
				if (StringTools.contains(meta.name, 'record')) {
					// getter
					gblock.push(macro _record.field($v{id}, $i{id}));
					// static fromRecord function
					sblock.push(macro var $id = record.field($v{field.name}));
					if (meta.name == 'crecord') {
						init_class += id + ',';
					} else {
						fields.push(field);
					}
				}
			}
		}

		var getter:Field = {
			name: 'get_record',
			kind: FFun({
				args: [],
				expr: macro $b{gblock}
			}),
			pos: Context.currentPos()
		}
		
		gblock.push(macro return _record);
		cfields.push(getter);

		init_class = init_class.substr(0, init_class.length - 1) + ')';
		var exp = Context.parseInlineString(init_class, Context.currentPos());
		sblock.push(macro $exp);

		for (f in fields) {
			var id = f.name;
			sblock.push(macro p.$id = $i{f.name});
		}

		sblock.push(macro return p);
		var from_record:Field = {
			name: 'fromRecord',
			access: [APublic, AStatic],
			kind: FFun({
				args: [
					{
						name: 'record',
						type: TPath({
							pack: ['db'],
							name: 'Record'
						})
					}
				],
				expr: macro $b{sblock}
			}),
			pos: Context.currentPos()
		}

		cfields.push(from_record);
		return cfields;
	}
}
#end