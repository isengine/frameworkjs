/*

is-
	name
	data
	data-from
	action

Например

<input type="text" value="123" data-v="123"
	is-key="a:b:c"
	is-value="123"|is-value-from="value"|is-value-data="v"|is-value-get
	is-value-type="string|numeric|..."
>

glob = new is.View.Globals();

glob._data = {
	"a" : {
		"b" : {
			"c" : "123"
			...
}

*/

is.View.Globals = class {
	
	constructor() {
		
		// задаем свойства
		
		this._data = {};
		
		// собираем данные
		
		var t = this;
		
		$("[is-key]").each(function(){
			t.value(this);
		});
		
		$("body").on("change", "[is-key]", function(){
			t.value(this);
		});
		
		//this.set('a:b:c', 'string');
		//this.set('abc', 'string');
		//console.log(this.get('a:b:c'));
		//console.log(this.get('abc'));
		//console.log(this.get('a'));
		
		//console.log(this._data);
		
	}
	
	data(name = null, value = null) {
		
		// получаем данные
		
	}
	
	set(map, value) {
		
		// впоследствии этот метод будет вынесен в хелпер
		// в группу по работе с объектами как
		// inject(map, value)
		
		if (map.indexOf(':') < 0) {
			this._data[map] = value;
			return;
		}
		
		var arrmap = map.split(':');
		var len = Object.keys(arrmap).length;
		var i = 0;
		var data = this._data;
		
		while (len > 0) {
			data[ arrmap[i] ] = len > 1 ? {} : value;
			data = data[ arrmap[i] ];
			i++;
			len--;
		}
		
	}
	
	get(map) {
		
		// впоследствии этот метод будет вынесен в хелпер
		// в группу по работе с объектами как
		// extract(map)
		
		if (map.indexOf(':') < 0) {
			return this._data[map];
		}
		
		var arrmap = map.split(':');
		var len = Object.keys(arrmap).length;
		var i = 0;
		var data = this._data;
		
		while (len > 0) {
			data = data[ arrmap[i] ];
			i++;
			len--;
		}
		
		return data;
		
	}
	
	value(target) {
		
		/*
		* 
		* is-key - устанавливает ключ глобального хранилища
		* 
		* по приоритетам
		* is-value-get - взять значение из jquery val
		* is-value-data - из какого атрибута данных брать значение
		* is-value-from - из какого свойства брать значение
		* 
		* is-value-type - тип взятого значения - numeric/string
		* 
		*/
		
		var e = $(target);
		//console.log(e);
		
		var type = e.attr('is-value-type');
		
		var key = e.attr('is-key');
		if (key === undefined) {
			key = Object.keys(this._data).length;
			// 0 -> 1 | 0,1 -> 2 | ...
		}
		
		var val;
		var vfrom = e.attr('is-value-from');
		var vdata = e.attr('is-value-data');
		
		if (e.attr('is-value-get') !== undefined) {
			val = e.val();
		} else if (vdata !== undefined) {
			val = e.data(vdata);
		} else if (vfrom !== undefined) {
			val = e.attr(vfrom);
		} else {
			val = e.attr('is-value');
		}
		
		if (type === 'numeric') {
			val = parseFloat(val);
		} else if (type === 'string') {
			val = "" + val;
		}
		
		this.set(key, val);
		//this._data[key] = val;
		//console.log(key, val, data);
		//console.log(this._data);
		//console.log(this.get(key));
		
	}
	
}
