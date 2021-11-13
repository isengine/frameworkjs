
class isView {
	
	constructor(name = null, selector = null) {
		
		// задаем свойства
		
		this.items = {};
		
		if (name === null) {
			
			let items = {};
			
			$("[is-name]").each(function(i){
				//console.log(i);
				let name = $(this).attr("is-name");
				if (!items[name]) {
					items[name] = new isView(name);
				}
			});
			
			this.items = items;
			
			return;
		}
		
		this._data = {};
		//this._items = $("[is-name" + (name !== null ? "=\"" + name + "\"" : "") + "]");
		
		if (selector === null) {
			this._items = $("[is-name=\"" + name + "\"]");
			this._name = name;
		} else if (typeof(selector) === "object") {
			this._items = $(selector);
			this._name = $(selector).attr("is-name");
		} else {
			$(selector).attr("is-name", name);
			this._name = $(selector);
			this._name = name;
		}
		
		//console.log("i", this.items);
		//console.log("_i", this._items);
		
		// заполняем объект данных со всех родителей
		
		let data = {};
		this._items.each(function(){
			
			// здесь должны находить родителя
			// и по родителю записывать в this.items
			// но кроме того, должен быть туда доступ
			// для этого проще создавать внутри items
			// по ключая parent новые экземпляры данного класса
			
			// вложенные данные у родителя
			
			if ($(this).is("[is-data]")) {
				let name = $(this).attr("is-data");
				
				let separator = name.indexOf(":");
				data[name] = separator && separator > 0 ? $(this).attr( name.substring(separator + 1) ) : $(this).html().trim();
				
				//let value = $(this).val();
				//if (!value && value !== 0) {
				//	value = $(this).html().trim();
				//}
				//data[name] = value;
			}
			
			// вложенные данные
			
			$(this).find("[is-data]").each(function(){
				let name = $(this).attr("is-data");
				
				let separator = name.indexOf(":");
				data[name] = separator && separator > 0 ? $(this).attr( name.substring(separator + 1) ) : $(this).html().trim();
				
				//let value = $(this).val();
				//if (!value && value !== 0) {
				//	value = $(this).html().trim();
				//}
				//data[name] = value;
				
			});
			
			// данные из атрибутов у родителя
			
			if ($(this).is("[is-data-from]")) {
				$.each(this.attributes, function(index, attribute) {
					if (attribute.name.indexOf("data-") === 0) {
						let name = attribute.name.substr(5);
						data[name] = attribute.value;
					}
				});
			}
			
			// данные из атрибутов у вложенных элементов
			
			$(this).find("[is-data-from]").each(function(){
				$.each(this.attributes, function(index, attribute) {
					if (attribute.name.indexOf("data-") === 0) {
						let name = attribute.name.substr(5);
						data[name] = attribute.value;
					}
				});
			});
			
		});
		
		this._data = data;
		
		//console.log(this._data);
		
	}
	
	name() {
		return this._name;
	}
	
	data(name = null, value = null) {
		
		// получить данные
		
		if (value !== null) {
			// если value задан, значит мы устанавливаем значения в объекты
			// name должен быть задан
			if (name !== null) {
				this._data[name] = value;
				this.refresh(name);
			}
		} else {
			// если value не задан, значит мы возвращаем значение из объекта
			// если name не задан, значит мы возвращаем все данные
			if (name === null) {
				return this._data;
			}
			// если name задан, возвращаем значение по ключу name
			return this._data[name];
		}
		
	}
	
	value(name, callback) {
		
		// обработать значение данных
		
		let current = this._data[name];
		let result = callback.call(this, current);
		this._data[name] = result;
		this.refresh(name);
		
	}
	
	action(name, type, callback) {
		
		// задать событие
		
		//let selector = "[is-action=\"" + name + "\"]";
		let selector = "[is-name=\"" + this.name() + "\"] [is-action=\"" + name + "\"]";
		
		//$("body").find(this._items).on(type, selector, callback);
		$("body").on(type, selector, callback);
		
	}
	
	refresh(name = null, obj = this) {
		
		// функция обновляет данные
		// если name не задан, значит все данные
		// если name задан, значит данные по ключу name
		
		if (name === null) {
			let parents = this;
			Object.entries(this._data).forEach(function(i){
				parents.refresh(i[0], parents);
			});
			return;
		}
		
		let value = obj.data(name);
		let selector = "[is-data=\"" + name + "\"]";
		
		obj._items.each(function(){
			$(this).find(selector).each(function(){
				
				let separator = name.indexOf(":");
				if (separator && separator > 0) {
					let a = name.substring(separator + 1);
					$(this).attr(a, value);
					if (a === "value") {
						$(this).val(value);
					} else if (a.indexOf("data-") === 0) {
						$(this).data(a.substring(5), value);
					}
				} else {
					$(this).html(value);
				}
				
				//if ($(this).is("[value]")) {
				//	$(this).val(value);
				//	$(this).attr("value", value);
				//} else {
				//	$(this).html(value);
				//}
				
			});
		});
		
	}
	
	clone(name, from, to = null, method = null) {
		
		/*
		*  name - имя-идентификатор родителя
		*  from - селектор объекта, который берется для клонирования
		*  to - селектор контейнера, внутрь которого будет вставлен объект
		*    если не объявлен, то объект будет не вставлен, а возвращен
		*  method - метод, по которому добавляется объект:
		*    append - в конец (по-умолчанию)
		*    prepend - в начало
		*/
		
		let n = new isView(name, $(from).first().clone());
		n._items.attr("is-name", name);
		n._data = this._data;
		n.refresh();
		
		let items = this._items;
		n._items.each(function(){
			items.push(this);
		});
		
		if (to === null) {
			return n._items;
		}
		
		if (method === "prepend") {
			n._items.prependTo($(to));
		} else {
			n._items.appendTo($(to));
		}
		
		//console.log("*this", this);
		//console.log("*c", c);
		//console.log("*c-html", c.html());
		//console.log("*n", n);
		
	}
	
}
