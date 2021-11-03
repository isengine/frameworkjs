
is.Helpers.Sessions = class {

	static setCookie(name, set) {
		document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(set) + "; path=/";
		localStorage[name] = set;
	}

	static getCookie(name = null){
		
		// сборка объекта из строки кук
		
		let array = {};
		document.cookie.split(";").forEach(function(item){
			let key;
			item.split("=").forEach(function(i, k){
				i = decodeURIComponent(i.trim());
				if (k === 0) {
					key = i;
				} else if (
					(name && key === name) ||
					!name
				) {
					array[key] = i;
				}
			});
		});
		
		// создание результата из кук и локального хранилища
		
		let ls = name ? localStorage[name] : localStorage;
		let result = name ? array[name] : array;
		
		// сравнение кук и локального хранилища
		// куки являются приоритетными
		
		if (result !== ls) {
			
			let self = is.Helpers.Sessions;
			
			if (name) {
				
				// обновление по имени
				
				if (!result) {
					self.setCookie(name, ls);
					result = ls;
				} else {
					localStorage[name] = result;
				}
				
			} else {
				
				// обновление по массиву
				
				Object.entries(result).forEach(function(i){
					localStorage[ i[0] ] = i[1];
				});
				Object.entries(ls).forEach(function(i){
					if (!result[ i[0] ]) {
						self.setCookie(i[0], i[1]);
						result[ i[0] ] = i[1];
					}
				});
				
			}
		}
		
		return result;
	}

	static unCookie(name) {
		document.cookie = encodeURIComponent(name) + "=; path=/; max-age=0";
		delete localStorage[name];
	}

}
