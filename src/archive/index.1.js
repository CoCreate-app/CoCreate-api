import CoCreateSocket from "@cocreate/socket"
import CoCreateAction from '@cocreate/action'
import CoCreateRender from '@cocreate/render'

let socketApi = new CoCreateSocket('api');

const CoCreateApi = { 
	modules: { },
	
	init: function({name, module}) {
		this.register(name, module)	
	},
	
	register: function(name, m_instance) {
		const self = this;
		if (typeof this.modules[name] === 'undefined') {
			this.modules[name] = m_instance;
			
			socketApi.listen(name, (data) => {
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
					CoCreateAction.init({
						action: action,
						endEvent: action,
						callback: (btn) => {
							m_instance[`action_${action}`](btn);
						},
					})
				})
			}
		}
	},
	
	__responseProcess: function(m_name, data) {
		const {type, response} = data;
		const m_instance = this.modules[m_name]
		
		if (type && response && m_instance) {
		
			if ( typeof m_instance[`render_${type}`] === 'function') {
				m_instance[`render_${type}`](response);
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
		const elements = container.querySelectorAll(`[${mainAttr}^="${action}."]`);

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
		let objectData = {};
		keys.forEach((k) => {
			if (k.split('.').length > 1) {
				let newData = self.__createObject(data[k], k);
				delete data[k]
				
				objectData = self.__mergeObject(objectData, newData);
			} else {
				objectData[k] = data[k];
			}
		})
		return objectData;
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
			if (!value) {
				value = element.innerHTML;
			}
		}
		
		return value;
	},
	
	__mergeObject: function(target, source) {
		target = target || {};
		for (let key of Object.keys(source)) {
			if (source[key] instanceof Object) {
				Object.assign(source[key], this.__mergeObject(target[key], source[key]))
			}
		}
		
		Object.assign(target || {}, source)
		return target
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
		let request_data = this.getCommonParamsExtend(data || {});
		request_data = {...request_data, data};
		socketApi.send(module, {type: action, data: request_data});
	},
	
	render: function(action, data) {
		CoCreateRender.data({
			selector: `[data-template_id="${action}"]`, 
			data: data
		});
	},
	
	createApiSocket: function(host, namespace) {
		if (namespace) {
			socketApi.create({
				namespace: namespace, 
				room: null,
				host: host
			});
			socketApi.setGlobalScope(namespace);
		} else {
			socketApi.create({
				namespace: null, 
				room: null,
				host: host
			});
		}
	},
	
	getCommonParamsExtend: function(info) 
	{
		return {
			"apiKey":           info.apiKey || config.apiKey,
			"securityKey":      info.securityKey || config.securityKey,
			"organization_id":  info.organization_id || config.organization_Id,
		}
	}
}

CoCreateApi.createApiSocket(
	window.config.host ? window.config.host : 'server.cocreate.app',
	window.config.organization_Id
	// window.config.apiKey
	// window.config.securityKey
);

export default CoCreateApi;