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

    /**
     * TODO: Implement Enhanced API Configuration Handling
     * 
     * Description:
     * - Implement functionality to dynamically handle API configurations, supporting both complete and base URL endpoints with automatic method-based path appending.
     * - Enable dynamic generation of query parameters from a designated object (`stripe` in the examples) when `query` is true.
     * 
     * Requirements:
     * 1. Dynamic Endpoint Handling:
     *    - Check if the endpoint configuration is a complete URL or a base URL.
     *    - If the `method` derived path is not already included in the endpoint, append it dynamically.
     *    Example:
     *    `{ "method": "stripe.accounts.retrieve", "endpoint": "https://api.stripe.com", "query": true, "stripe": { "acct": "acct_123", "name": "John Doe" } }`
     *    `{ "method": "stripe.accounts.retrieve", "endpoint": "https://api.stripe.com/accounts/retrieve", "query": true, "stripe": { "acct": "acct_123", "name": "John Doe" } }`
     *    - Develop logic to parse the `method` and check against the endpoint. If necessary, append the appropriate API method segment.
     * 
     * 2. Query Parameter Handling:
     *    - Dynamically construct and append query parameters from the `stripe` object if `query` is true. Ensure proper URL-encoding of keys and values.
     * 
     * 3. Security:
     *    - Use the `method` for permission checks, ensuring that each API request complies with security protocols.
     * 
     * 4. Testing:
     *    - Test both scenarios where the endpoint may or may not include the method path to ensure the dynamic construction works correctly.
     *    - Ensure that all query parameters are correctly formatted and appended.
     * 
     * Notes:
     * - Consider utility functions for parsing and modifying URLs, as well as for encoding parameters.
     * - Maintain clear and detailed documentation for each part of the implementation to assist future development and troubleshooting.
     */
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
                    let value = getValueFromObject(data[name], key);
                    elements[i].setValue(value);
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