/*globals CustomEvent, config*/
import { getValueFromObject, dotNotationToObject} from "@cocreate/utils";
import socket from "@cocreate/socket-client";
import CoCreateAction from '@cocreate/actions';
import CoCreateRender from '@cocreate/render';
import '@cocreate/element-prototype';

const CoCreateApi = { 
	components: {},
 
	init: function({name, actions, realtime}) {
		this.register({name, actions});
		if (!socket.sockets.size)
			socket.create({prefix: 'api'});
		document.addEventListener('input', (e)=> {
			let action = e.target.getAttribute(name)
			if (action) {
				action = action.split('.', 1)
				action = action[0]
				if (actions[action].realtime !== false) {
					if (realtime !== false && actions[action].realtime !== undefined) {
						let functions = actions[action]
						if (typeof functions.request === 'function') {
							functions.request(name, action, e.target)
						}
					}
				}
			}

		})
	},
	
	register: function({name, actions}) {
		const self = this;
		if (typeof this.components[name] === 'undefined') {
			this.components[name] = {name, actions};

			socket.listen(name, (data) => {
				self.__response(name, data);
			});
			
			for (const action of Object.keys(actions)) {
				let functions = actions[action]
				if (typeof functions.request !== 'function') {
					functions.request = self.__request;
				} 
				CoCreateAction.init({
					name: action,
					endEvent: action,
					callback: (element) => {
						functions.request(name, action, element);
					},
				});
			}
		}
	},

	__request: function(name, action, element) {
		let form = element.closest('form');
		let data = this.getData(name, action, form);
		this.send(name, action, data[action]);
	},

	__response: function(name, data) {
		const {action, response} = data;
		const component = this.components[name];
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

	send: function(name, action, data) { 
		socket.send(name, {action, data, broadcastBrowser: false});
	},
	
	render: function(action, data) {
		CoCreateRender.data({
			selector: `[template="${action}"]`, 
			data: data
		});
	},
	
	getData: function(attribute, action, form) {
		let data = {}
		const selector = `[${attribute}^="${action}."]`
		if (!form)
			form = document;
		let elements = form.querySelectorAll(selector);
		if (!elements || elements.length == 0) return
	
		for (let el of elements) {
			let name = el.getAttribute(attribute)
			let value = el.getValue();
			if (name)
				data[name] = value
		}
		return dotNotationToObject(data);
	},

	setData: function(attribute, action, form) {
		const selector = `[${attribute}^="${action}."]`
		if (!form)
			form = document;
		let elements = form.querySelectorAll(selector);
		if (!elements || elements.length == 0) return
	
		for (let el of elements) {
			let name = el.getAttribute(attribute)
			const { isRead, isUpdate, isCrdt } = crud.getAttributes(el);
			if (!name || isRead == "false" || isUpdate == "false" || isCrdt == "true") continue;
			
			if (el.hasAttribute('actions')) continue;

			let value = getValueFromObject({[action]: data}, name);
			el.setValue(value);
		}

	}	
	
};
                
export default CoCreateApi;