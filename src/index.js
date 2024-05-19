/*globals CustomEvent, config*/
import { getValueFromObject, dotNotationToObject } from "@cocreate/utils";
import Observer from "@cocreate/observer";
import Socket from "@cocreate/socket-client";
import Actions from '@cocreate/actions';
import { render } from '@cocreate/render';
import '@cocreate/element-prototype';

const CoCreateApi = {
    modules: {},

    init: function (moduleConfig) {
        if (!moduleConfig) {
            let elements = document.querySelectorAll('[api], [module]')
            for (let i = 0; i < elements.length; i++) {
                let name = elements[i].getAttribute('api') || elements[i].getAttribute('module')
                this.register({ name, endPoints: {} });
            }
        } else {
            let { name, endPoints, options } = moduleConfig
            this.register({ name, endPoints, options });
            if (options && options.socket !== false && !Socket.sockets.size)
                Socket.create({ prefix: 'api' });
        }
    },

    register: function ({ name, endPoints, options }) {
        const self = this;
        if (typeof this.modules[name] === 'undefined') {
            this.modules[name] = { name, endPoints, options };

            Socket.listen(name, (data) => {
                self.response(name, data);
            });

            Actions.init({
                name,
                callback: (action) => {
                    action.form = action.form || document
                    self.request({ ...action, type: 'action' })
                }
            });

            const inputEvent = (element) => {
                element.addEventListener('input', (e) => {
                    if (!e.detail || e.detail && e.detail.skip != true) {
                        self.request({ name, element, type: 'input' })
                    }
                });
            }

            let elements = document.querySelectorAll(`[${name}]`)
            for (let i = 0; i < elements.length; i++) {
                inputEvent(elements[i])
                this.request({ name, element: elements[i], type: 'onload' })
            }

            Observer.init({
                name: `${name}NodeObserver`,
                observe: ['addedNodes'],
                target: `[${name}]`,
                callback: function (mutation) {
                    inputEvent(mutation.target)
                    self.request({ name, element: mutation.target, type: 'nodeObserver' })
                }
            });

            Observer.init({
                name: `${name}AttributeObserver`,
                observe: ['attributes'],
                attributeName: [name],
                callback: function (mutation) {
                    self.request({ name, element: mutation.target, type: 'attributeObserver' })
                }
            });
        }
    },


    request: async function (object) {
        if (object.element) {
            if (!object.method)
                object.method = object.element.getAttribute(object.name)
            if (!object.key)
                object.key = object.element.getAttribute(`${object.name}-key`)
            if (!object.event)
                object.event = object.element.getAttribute(`${object.name}-event`)
        }

        if (this.modules[object.name][object.method] && this.modules[object.name][object.method].request)
            this.modules[object.name][object.method].request(object)
        else if (!object.event && object.type === 'action' || object.event && object.event.includes(object.type)) {
            let data = await CoCreateApi.getData(object);
            CoCreateApi.send(object.name, object.method, data);
        }
    },

    response: function (name, data) {
        const method = data.method.substring(name.length + 1);
        if (this.modules[name][method] && this.modules[name][method].response)
            this.modules[name][method].response(data[name])
        else if (data.error) {
            render({
                selector: `[template*='${name}']`,
                data: [{
                    type: name,
                    method,
                    status: 'failed',
                    message: data.error
                }]
            });
        } else {
            CoCreateApi.setData({ name, method, data })

            document.dispatchEvent(new CustomEvent(name, {
                detail: {
                    data: data[name]
                }
            }));
        }
    },

    send: function (name, method, data) {
        Socket.send({ method: name + '.' + method, [name]: data, broadcast: false, broadcastBrowser: false, status: 'await' });
    },

    getData: async function ({ name, method, element, form }) {
        let data = {}

        if (!form && element)
            form = element.closest('form');

        let elements
        if (form)
            elements = form.querySelectorAll(`[${name}="${method}"]:not([${name}-request="false"])`);
        if (!elements || elements.length == 0)
            elements = [element]

        for (let i = 0; i < elements.length; i++) {
            if (!elements[i] || elements[i].closest('[template]'))
                continue
            let key = elements[i].getAttribute(`${name}-key`)
            if (key) {
                data[key] = await elements[i].getValue()
            }

            let endpoint = elements[i].getAttribute('endpoint')
            if (endpoint) {
                data.endpoint = endpoint
            }

            if (elements[i].getAttribute('query') && elements[i].getAttribute('query') !== 'false') {
                data.query = true
            }
        }

        let params = {}, hasParams = false
        for (let i = 0; true; i++) {
            if (`$param[${i}]` in data) {
                params[`$param[${i}]`] = data[`$param[${i}]`]
                delete data[`$param[${i}]`]
                hasParams = true
            } else {
                break;
            }
        }
        data = dotNotationToObject(data);
        if (hasParams)
            data = { ...params, ...data }

        return data
    },

    setData: function ({ name, method, data, form }) {
        if (!form)
            form = document;

        let elements = form.querySelectorAll(`[${name}="${method}"]`);
        if (!elements || elements.length == 0)
            return

        for (let i = 0; i < elements.length; i++) {
            let attribute = elements[i].getAttribute(name)
            if (attribute) {
                if (elements[i].hasAttribute('actions')) continue;
                let templateid = elements[i].getAttribute('template_id')
                if (templateid) {
                    let items = document.querySelectorAll(`[templateid="${templateid}"]`)
                    for (let item of items)
                        item.remove()
                    render({
                        selector: `[template="${templateid}"]`,
                        data
                    });
                } else {
                    let key = elements[i].getAttribute(`${name}-key`)
                    if (key === '{}')
                        elements[i].setValue(data[name])
                    else {
                        let value = getValueFromObject(data[name], key);
                        elements[i].setValue(value);
                    }
                }
            }
        }

    }

};

Observer.init({
    name: `apiNodeObserver`,
    observe: ['addedNodes'],
    target: '[module], [api]',
    callback: function (mutation) {
        let name = mutation.target.getAttribute('api') || mutation.target.getAttribute('module')
        CoCreateApi.register({ name, endPoints: {} });
    }
});

CoCreateApi.init()

export default CoCreateApi;