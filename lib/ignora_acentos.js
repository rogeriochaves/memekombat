(function(){
	String.prototype.ignora_acentos = function() {

		var str = this;

		var changes = [
		    {b:'A', b2: 'a', 'letters': new RegExp('[AÁÃÅÂÀ]', 'i')},
		    {b:'E', b2: 'e', 'letters': new RegExp('[EÉÊÈ]', 'i')},
			{b:'I', b2: 'i', 'letters': new RegExp('[IÍÎÌ]', 'i')},
			{b:'O', b2: 'o', 'letters': new RegExp('[OÓÔÒÕ]', 'i')},
			{b:'U', b2: 'u', 'letters': new RegExp('[UÚÛÙ]', 'i')},
			{b:'C', b2: 'c', 'letters': new RegExp('[CÇ]', 'i')},
			{b:'N', b2: 'n', 'letters': new RegExp('[NÑ]', 'i')}
		];
		var new_str = [];
		for(var p = str.length; p--;){
			var encontrou = false;
			for(var i = changes.length; i--;) {
				if(str[p] == changes[i].b || str[p] == changes[i].b2) break;
				if(str[p].match(changes[i].letters) != null){
					encontrou = true;
					new_str.push(changes[i].letters.toString().replace('/i', '').replace('/', ''));
					break;
				}
			}
			if(!encontrou) new_str.push(str[p]);
	    }
	    return new_str.reverse().join('');

	};
})();