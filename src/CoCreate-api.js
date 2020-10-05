const CoCreateApi = {
	modules: { },
	
	register: function(name, m_instance) {
		const self = this;
		if (typeof this.modules[name] === 'undefined') {
			this.modules[name] = m_instance;
			
			CoCreateSocket.listen(name, (data) => {
				self.__responseProcess(name, data);
			})
			
			//. register actions
			
			if (Array.isArray(m_instance['actions'])) {
				m_instance['actions'].forEach((action) => {
					if (typeof m_instance[`action_${action}`] !== 'function') {
						m_instance[`action_${action}`] = function(element) {
							self.__commonAction(m_instance.id, action, element)
						}
					} 
					CoCreateAction.registerEvent(action, m_instance[`action_${action}`], m_instance, action);
				})
			}
		}
	},
	
	__responseProcess: function(m_name, data) {
		const {type, response} = data;
		const m_instance = this.modules[m_name]
		
		if (type && response && m_instance) {
		
			if ( typeof m_instance[`pre_${type}`] === 'function') {
				m_instance[`pre_${type}`](response);
			}
			
			this.render(type, response);
			
			document.dispatchEvent(new CustomEvent(type, {
				detail: {
					data: response
				}
			}))
		}
	},
	
	__commonAction: function(id, action, element) {
		const container = element.closest("form") || document;
		let data = CoCreateApi.getFormData(id, action,  container);
		CoCreateApi.send(id, action, data);
	},
	
	
	getFormData : function(m_name, action, container){
		const mainAttr = `data-${m_name}`;
		const self = this;
		const elements = container.querySelectorAll(`[${mainAttr}]`);

		let data = {}
		elements.forEach(element => {
			let name = element.getAttribute(mainAttr);
			let array_name = element.getAttribute(mainAttr + "_array");
			let value = self.__getElValue(element);
			
			if (!name) return

			if (action) {
				let re = new RegExp(`^${action}.`, 'i');
				if (re.test(name)) {
					name = name.replace(re, "");
				} else {
					return;
				}
			}
			
			if (array_name) {
				if (!data[name]) {
					data[name] = [];
				}
				data[name].push(self.getFormData(m_name, array_name, element));
			} else if (value != null) {
				data[name] = value;
			}
		});
		
		let keys = Object.keys(data)
		
		keys.forEach((k) => {
			if (k.split('.').length > 1) {
				let newData = self.__createObject(data[k], k);
				delete data[k]
				
				data = Object.assign(data, newData);
			}
		})
		return data;
	},
	
	__getElValue: function(element) {
		let value = null;
		if (typeof element.value !== "undefined") {
			switch (element.type.toLocaleLowerCase()) {
				case 'checkbox':
					if (element.checked) {
						value = element.value
					}
					break;
				default:
					value = element.value;
					break;
			}
		} else {
			value = element.getAttribute('value');
		}
		
		return value;
	},
	
	__createObject: function (data, path) {
		if (!path) return data;
		
		let keys = path.split('.')
		let newObject = data;

		for (var  i = keys.length - 1; i >= 0; i--) {
			newObject = {[keys[i]]: newObject}				
		}
		return newObject;
	},
	
	send : function(module, action, data){ 
		CoCreateSocket.send(module, {type: action, data});
	},
	
	render: function(action, data) {
		CoCreateRender.render(`[data-template_id="${action}"]`, data);
	}
}