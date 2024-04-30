package util;

#if !macro
import ecs.System;
import ecs.Entity;
import ecs.Universe;
#else
import haxe.macro.Expr;
import haxe.macro.Context;
using haxe.macro.TypeTools;
#end

class EcsTools {
	#if !macro
	static var _universe:Universe;
	public static var universe(get, set):Universe;

	static function get_universe() {
		if (_universe == null) {
			return Main.universe;
		}
		return _universe;
	}

	static function set_universe(value) {
		return _universe = value;
	}
	#end

	public static macro function delete(self:ExprOf<System>, entity:ExprOf<Entity>):ExprOf<Entity> {
		return macro @:pos(self.pos) $self.universe.deleteEntity(entity);
	}

	public static macro function set(components:Array<Expr>):ExprOf<Entity> {
		var block = [macro var entity = EcsTools.universe.createEntity()];
		var arr = [macro entity];
		for (comp in components) {
			arr.push(macro @:pos(comp.pos) $comp);
		}

		block.push(macro @:pos(components[0].pos) EcsTools.universe.setComponents($a{arr}));
		block.push(macro entity);
		return macro @:pos(components[0].pos) $b{block};
	}

	public static macro function addWithBaseType(components:Array<Expr>):ExprOf<Entity> {
		var block = [macro var entity = universe.createEntity()];
		var arr = [macro entity];
		for (key => comp in components) {
			var type = Context.typeof(comp);
			var is_class = type.getName() == 'TInst';
			if (!is_class) {
				arr.push(macro @:pos(comp.pos) $comp);
				continue;
			}

			try {
				var type_b = TypeTools.toComplexType(TInst(type.getClass().superClass.t, type.getClass().superClass.params));
				switch (comp.expr) {
					case ENew(t, params):
						block.push(macro @:pos(comp.pos) var __tmp_remap = $comp);
						arr.push(macro @:pos(comp.pos) __tmp_remap);
						arr.push(macro @:pos(comp.pos) (__tmp_remap : $type_b));
					default:
						arr.push(macro @:pos(comp.pos) $comp);
						arr.push(macro @:pos(comp.pos) ($comp : $type_b));
				}
			} catch (e) {
				Context.error(e.message, comp.pos);
			}
		}
		block.push(macro @:pos(components[0].pos) universe.setComponents($a{arr}));
		block.push(macro entity);
		return macro @:pos(components[0].pos) $b{block};
	}
}
