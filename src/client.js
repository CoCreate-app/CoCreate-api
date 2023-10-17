/*globals CustomEvent, config*/
import { getAttributes, getValueFromObject, dotNotationToObject } from "@cocreate/utils";
import observer from "@cocreate/observer";
import socket from "@cocreate/socket-client";
import action from '@cocreate/actions';
import { render } from '@cocreate/render';
import '@cocreate/element-prototype';

const CoCreateApi = {
    components: {},

    init: function ({ name, endPoints, options }) {
        this.register({ name, endPoints, options });
        if (options.socket !== false && !socket.sockets.size)
            socket.create({ prefix: 'api' });
    },

    register: function ({ name, endPoints, options }) {
        const self = this;
        if (typeof this.components[name] === 'undefined') {
            this.components[name] = { name, endPoints, options };

            socket.listen(name, (data) => {
                self.__response(name, data);
            });

            for (const endPoint of Object.keys(endPoints)) {
                let functions = endPoints[endPoint]
                if (typeof functions.request !== 'function') {
                    functions.request = self.__request;
                }
                action.init({
                    name: endPoint,
                    endEvent: endPoint,
                    callback: (data) => {
                        let params
                        const element = data.element
                        let form = element.closest('form') || document
                        const selector = `[${name}^="${endPoint}."]`
                        let el = form.querySelector(selector)
                        if (!el) return
                        params = self.parseParams({ name, element: el })
                        if (params) {
                            functions.request({ name, ...params, element, form, type: 'action' })
                        }
                    },
                });
            }

            const inputEvent = (element) => {
                const self = this
                element.addEventListener('input', (e) => {
                    if (element.hasAttribute(name)) {
                        let params = self.parseParams({ name, element })
                        if (params) {
                            if (!e.detail || e.detail && e.detail.skip != true) {
                                endPoints[params.endPoint].request({ name, ...params, element, type: 'input' })
                            }
                        }
                    }
                });
            }

            let elements = document.querySelectorAll(`[${name}]`)
            for (let element of elements) {
                let params = this.parseParams({ name, element })
                if (params) {
                    endPoints[params.endPoint].request({ name, ...params, element, type: 'onload' })
                    inputEvent(element)
                }
            }

            observer.init({
                name: `${name}NodeObserver`,
                observe: ['addedNodes'],
                target: `[${name}]`,
                callback: function (mutation) {
                    let params = self.parseParams({ name, element: mutation.target })
                    if (params) {
                        endPoints[params.endPoint].request({ name, ...params, element: mutation.target, type: 'nodeObserver' });
                        inputEvent(mutation.target)
                    }
                }
            });

            observer.init({
                name: `${name}AttributeObserver`,
                observe: ['attributes'],
                attributeName: [name],
                callback: function (mutation) {
                    let params = self.parseParams({ name, element: mutation.target })
                    if (params) {
                        endPoints[params.endPoint].request({ name, ...params, element: mutation.target, type: 'attributeObserver' });
                    }
                }
            });
        }
    },

    __request: async function ({ name, endPoint, element }) {
        let form = element.closest('form');
        let data = await this.getData({ name, endPoint, form });
        this.send(name, endPoint, data[endPoint]);
    },

    __response: function (name, data) {
        const { endPoint, response } = data;
        const component = this.components[name];
        const functions = component.endPoints[endPoint]
        if (functions.listen !== false) {
            if (typeof functions.response === 'function') {
                functions.response(response);
            } else
                this.setData({ name, endPoint, data })

            document.dispatchEvent(new CustomEvent(endPoint, {
                detail: {
                    data: response
                }
            }));
        }
    },

    send: function (name, endPoint, data) {
        let method = name + '.' + endPoint
        socket.send({ method, endPoint, data, broadcastBrowser: false });
    },

    parseParams: function ({ name, endPoint, element }) {
        let attribute = element.getAttribute(name)
        if (!attribute)
            return false

        let dotNotation = attribute
        let params = attribute.split('.')
        endPoint = params[0]
        let key = params[1]
        return { endPoint, key, dotNotation, params }

    },


    getData: async function ({ name, endPoint, element, form }) {
        const data = {}
        const selector = `[${name}^="${endPoint}."]`
        let elements
        if (form)
            elements = form.querySelectorAll(selector);
        if (!elements || elements.length == 0)
            elements = [element]
        for (let el of elements) {
            if (!el || el.closest('[template]')) continue
            let attribute = el.getAttribute(name)
            if (attribute)
                data[attribute] = await el.getValue()
        }

        return dotNotationToObject(data);
    },

    setData: function ({ name, endPoint, data, form }) {
        const selector = `[${name}^="${endPoint}."]`
        if (!form)
            form = document;
        let elements = form.querySelectorAll(selector);
        if (!elements || elements.length == 0) return

        for (let el of elements) {
            let attribute = el.getAttribute(name)
            if (attribute) {
                if (el.hasAttribute('actions')) continue;
                let templateid = el.getAttribute('template_id')
                if (templateid) {
                    let items = document.querySelectorAll(`[templateid="${templateid}"]`)
                    for (let item of items)
                        item.remove()
                    render({
                        selector: `[template="${templateid}"]`,
                        data
                    });
                } else {
                    let value = getValueFromObject(data, attribute);
                    el.setValue(value);
                }
            }
        }

    }

};

export default CoCreateApi;