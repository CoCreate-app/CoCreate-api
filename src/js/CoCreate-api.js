var CoCreateApiSocket = function() {
	this.init();
};

CoCreateApiSocket.prototype = {

	init: function() {
		let self = this;
		
		CoCreateSocket.listen(this.endPoint, (data) => {
			console.log("ResponseSocket", data)
			self.resultProcess(data);
		})
	},
	
	resultProcess: function(data) {
		const {type, response} = data;
		
		if (type && response) {

			if (this['pre' + type]) {
				this['pre' + type].call(this, response);
			}

			document.dispatchEvent(new CustomEvent(type, {
				detail: {
					data: response
				}
			}))
		}
	},
	
	// validateKeysJson: function(json, rules) {
	// 	let keys_json = Object.keys(json);
	// 	keys_json.forEach((key) => {
	// 		const index = rules.indexOf(key);
	// 		if(index != -1) {
	// 			rules.splice(index, 1);
	// 		}
	// 	});
	// 	if(rules.length ) {
	// 		throw "Requires the following "+ rules.toString();
	// 	}
	// },
	
	getFormData : function(btn){
		const mainAttr = this.mainAttribute;
		const container = btn.closest("form") || document;
		let inputs = container.querySelectorAll(`[${mainAttr}]`);
		let data = {}
		inputs.forEach(input => {
			const name = input.getAttribute(mainAttr);
			if( name.indexOf('[]') != -1 ){
				if( typeof data[name] == 'undefined' ){
					data[name] = []
				}
				switch (input.getAttribute('type').toLocaleLowerCase()) {
					case 'checkbox':
						if(input.checked)
							data[name].push(input.value)    
						break;
					default:
						data[input.getAttribute(mainAttr)].push(input.value)
				}
			}
			else 
				data[input.getAttribute(mainAttr)] = input.value;
		});
		return data;
	},
	
	sendData: function(type, data){ 
		console.log(".... Sending Request Socket to endPint ["+this.endPoint+"].....");
		CoCreateSocket.send(this.endPoint, {type, data});
	},
	
	/**
	 * @param object : data object
	 * @param attributeName : data attribute name of input <- object key
	 * @param addInfo : additional selector of input
	 * @param parentInfo : parent selector of input
	 */
	// objToAtt: function(object, attributeName, addInfo = "", parentInfo = "") {
	// 	let inputs = document.querySelectorAll(`${parentInfo} [data-${attributeName}]${addInfo}, ${parentInfo} [name]${addInfo}`);
	// 	for (let input of inputs) {
	// 		let key;
	// 		key = input.dataset[attributeName];
	// 		if (!key) key = input.getAttribute("name");
	// 		let type = input.getAttribute("type");
	// 		if (type == "button" || type == "submit" || type == "reset") continue;
	// 		if (type == "radio" && key in object) input.checked = object[key] == input.getAttribute("value") ? true : false;
	// 		else if (type == "checkbox" && key in object) input.checked = (object[key] == input.getAttribute("value")) || (Array.isArray(object[key]) && object[key].includes(input.getAttribute("value"))) ? true : false; // checked value = on
	// 		else if (key in object)
	// 			if (input.tagName == "input" || input.tagName == "textarea")input.value = object[key];
	// 			else input.innerHTML = object[key];
	// 	}
	// }
}