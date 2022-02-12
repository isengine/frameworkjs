/*

is-
	name
	data
	data-from
	action

Например

var is.global = {
	"" : {
		"" : "",
		...
	},
	...
}

засунуть функцию в метод и обе обработки тоже в методы
глобальный массив в свойство класса, например this._data
и сделать геттер/сеттер
.set('key:subkey:...', val)
.get('key:subkey:...')

//$('[is-global]').change(function(){
$('[is-global]').each(function(){
$(body).on('change', '[is-global]', function(){
	var name = $(this).attr('is-global');
	var type = $(this).attr('is-value-type');
	
	var key;
	var kfrom = $(this).attr('is-key-from');
	if (kfrom !== undefined) {
		key = $(this).attr('is-key');
	} else {
		key = $(this).attr(kfrom);
		if (key === undefined) {
			key = is.global[name].length;
			// 0 -> 1 | 0,1 -> 2 | ...
		}
	}
	
	var val;
	var vfrom = $(this).attr('is-value-from');
	if (vfrom !== undefined) {
		val = $(this).attr('is-value');
	} else {
		val = $(this).attr(vfrom);
	}
	
	if (type !== undefined) {
		val = (type) val;
	if (type === 'float') {
		val = parseFloat(val);
	if (type === 'int') {
		val = parseInt(val);
	if (type === 'string') {
		val = parseString(val);
		val = "" + val;
	}
	
	is.global[name][key] = val;
	//.set(name + ':' + key, val)
});

<input type="text" value="123" is-global="abc" name="isis" is-key="isis"|is-key-from="name" is-value="isis"|is-value-from="value" is-value-type="string|int|float|...">

is.global = {
	"abc" : {
		"isis" : "123"
		...
}

<input type="text" value="123" is-global="abc" name="isis" is-key="isis"|is-key-from="name" is-value="isis"|is-value-from="value">

is.global = {
	"abc" : {
		"isis" : "..."
		...
}
*/

is.View.Globals = class {
	
	constructor() {
		
		// задаем свойства
		
		this._data = {};
		
		// собираем данные
		
		var fn = this.value;
		var data = this._data;
		
		$("[is-key]").each(function(){
			fn(this, data);
		});
		
	}
	
	data(name = null, value = null) {
		
		// получаем данные
		
	}
	
	action(key, type) {
		
		// задать событие
		// key
		// type: 'change'
		
		var selector = "[is-key=\"" + key + "\"]";
		
		var fn = this.value;
		var data = this._data;
		
		$("body").on(type, selector, function(){
			fn(this, data);
		});
		
	}
	
	value(target, data) {
		
		var e = $(target);
		//console.log(e);
		
		var type = e.attr('is-value-type');
		
		var key = e.attr('is-key');
		if (key === undefined) {
			key = this._data.length;
			// 0 -> 1 | 0,1 -> 2 | ...
		}
		
		/*
		var key;
		var kfrom = e.attr('is-key-from');
		if (kfrom === undefined) {
			key = e.attr('is-key');
		} else {
			key = e.attr(kfrom);
			if (key === undefined) {
				key = this._data.length;
				// 0 -> 1 | 0,1 -> 2 | ...
			}
		}
		*/
		
		var val;
		var vfrom = e.attr('is-value-from');
		var vdata = e.attr('is-value-data')
		
		if (e.attr('is-value-val') !== undefined) {
			val = e.val();
		} else if (vdata !== undefined) {
			val = e.data(vdata);
		} else if (vfrom === undefined) {
			val = e.attr('is-value');
		} else {
			val = e.attr(vfrom);
		}
		
		if (type === 'float') {
			val = parseFloat(val);
		} else if (type === 'int') {
			val = parseInt(val);
		} else if (type === 'string') {
			val = "" + val;
		}
		
		//console.log(key, val);
		
		data[key] = val;
		
	}
	
}
