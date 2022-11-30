/*globals CustomEvent, config*/
import socket from "@cocreate/socket-client";
import CoCreateAction from '@cocreate/actions';
import CoCreateRender from '@cocreate/render';
import '@cocreate/element-prototype';

const CoCreateApi = { 
	components: { },
 
	init: function({name, component}) {
		this.register(name || component.name, component);
		if (!socket.sockets.size)
			socket.create({prefix: 'api'});
	},
	
	register: function(name, component) {
		const self = this;
		if (typeof this.components[name] === 'undefined') {
			this.components[name] = component;

			socket.listen(name, (data) => {
				self.__response(name, data);
			});
			
			for (const [action, functions] of Object.entries(component['actions'])){
				if (typeof functions.request !== 'function') {
					functions.request = self.__request;
				} 
				CoCreateAction.init({
					name: action,
					endEvent: action,
					callback: (element) => {
						functions.request(component.name, action, element);
					},
				});
			}
		}
	},

	__request: function(id, action, element) {
		const form = element.closest("form") || document;
		let data = CoCreateApi.getFormData(id, action,  form);
		CoCreateApi.send(id, action, data);
	},

	__response: function(id, data) {
		const {action, response} = data;
		const component = this.components[id];
		const functions = component.actions[action]
		if (typeof functions.response === 'function') {
			functions.response(response);
		}
		else
			this.render(action, response);
		
		document.dispatchEvent(new CustomEvent(action, {
			detail: {
				data: response
			}
		}));
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
			if (element.getValue)
				value = element.getValue();

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
	
	send: function(component, action, data) { 
		socket.send(component, {action, data, broadcastBrowser: false});
	},
	
	render: function(action, data) {
		CoCreateRender.data({
			selector: `[template_id="${action}"]`, 
			data: data
		});
	},
	
};
                
export default CoCreateApi;