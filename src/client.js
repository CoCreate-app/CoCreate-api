/*globals CustomEvent, config*/
import CoCreateSocket from "@cocreate/socket-client";
import CoCreateAction from '@cocreate/actions';
import CoCreateRender from '@cocreate/render';
import CoCreateElements from '@cocreate/elements';

let socketApi = new CoCreateSocket('api');

const CoCreateApi = { 
	modules: { },
	
	init: function({name, module}) {
		this.register(name, module);
		if (!socketApi.sockets.size)
			socketApi.create(window.config);
	},
	
	register: function(name, m_instance) {
		const self = this;
		if (typeof this.modules[name] === 'undefined') {
			this.modules[name] = m_instance;
			
			socketApi.listen(name, (data) => {
				self.__responseProcess(name, data);
			});
			
			//. register actions
			
			if (Array.isArray(m_instance['actions'])) {
				m_instance['actions'].forEach((action) => {
					if (typeof m_instance[`action_${action}`] !== 'function') {
						m_instance[`action_${action}`] = function(element) {
							self.__commonAction(m_instance.name, action, element);
						};
					} 
					CoCreateAction.init({
						name: action,
						endEvent: action,
						callback: (btn) => {
							m_instance[`action_${action}`](btn);
						},
					});
				});
			}
		}
	},
	
	__responseProcess: function(id, data) {
		const {type, response} = data;
		const m_instance = this.modules[id];
		
		if (type && response && m_instance) {
		
			if ( typeof m_instance[`render_${type}`] === 'function') {
				m_instance[`render_${type}`](response);
			}
			
			this.render(type, response);
			
			document.dispatchEvent(new CustomEvent(type, {
				detail: {
					data: response
				}
			}));
		}
	},
	
	__commonAction: function(id, action, element) {
		const form = element.closest("form") || document;
		let data = CoCreateApi.getFormData(id, action,  form);
		CoCreateApi.send(id, action, data);
	},
	
	
	getFormData: function(id, action, form){
		const mainAttr = id;
		const self = this;
		const elements = form.querySelectorAll(`[${mainAttr}^="${action}."]`);

		let data = {};
		elements.forEach(element => {
			let name = element.getAttribute(mainAttr);
			if (!name) return;
			
			let array_name = element.getAttribute(mainAttr + "_array");

			let value;
			if(element.getValue)
				value = element.getValue(element);
			else
				value = CoCreateElements.getValue(element);

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
				data[name].push(self.getFormData(id, array_name, element));
			} else if (value != null) {
				data[name] = value;
			}
		});
		
		let keys = Object.keys(data);
		let objectData = {};
		keys.forEach((k) => {
			if (k.split('.').length > 1) {
				let newData = self.__createObject(data[k], k);
				delete data[k];
				
				objectData = self.__mergeObject(objectData, newData);
			} else {
				objectData[k] = data[k];
			}
		});
		return objectData;
	},
	
	__mergeObject: function(target, source) {
		target = target || {};
		for (let key of Object.keys(source)) {
			if (source[key] instanceof Object) {
				Object.assign(source[key], this.__mergeObject(target[key], source[key]));
			}
		}
		
		Object.assign(target || {}, source);
		return target;
	},
	
	__createObject: function (data, path) {
		if (!path) return data;
		
		let keys = path.split('.');
		let newObject = data;

		for (var  i = keys.length - 1; i >= 0; i--) {
			newObject = {[keys[i]]: newObject};				
		}
		return newObject;
	},
	
	send : function(module, action, data){ 
		let request_data = this.getCommonParams(data || {});
		request_data = {...request_data, data};
		socketApi.send(module, {type: action, data: request_data});
	},
	
	render: function(action, data) {
		CoCreateRender.data({
			selector: `[template_id="${action}"]`, 
			data: data
		});
	},
	
	getCommonParams: function(info) {
		return {
			"apiKey":           info.apiKey || config.apiKey,
			"organization_id":  info.organization_id || config.organization_Id,
			"host":  info.host || config.host
		};
	}
};
                
export default CoCreateApi;