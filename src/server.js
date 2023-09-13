const CRUD = require('@cocreate/crud-client')
const socketClient = require('@cocreate/socket-client')
let socket = new socketClient("ws");

crud.setSocket(socket);

var api = (() => {
    return {
        send_response: (wsManager, socket, obj, send_response) => {
            wsManager.send(socket, send_response, obj)
        },

        handleError: (wsManager, socket, action, error, component) => {
            const response = {
                'object': 'error',
                'data': error || error.response || error.response.data || error.response.body || error.message || error,
            };
            wsManager.send(socket, component, { action, response })
        },

        getOrg: async (config, component) => {

            socket.create({
                namespace: config["organization_id"],
                room: null,
                host: config["host"]
            })

            let org = await crud.send({
                method: 'read.object',
                array: "organizations",
                key: config["key"],
                organization_id: config["organization_id"],
                object: {
                    _id: config["organization_id"]
                }

            });

            if (!org || !org.object && !org.object[0]) {
                console.log(component, " Error GET ORG  in : ", e);
                return false;
            }

            return org.object[0];
        },

        getOrgInRoutesbyHostname: async (config, hostname) => {
            var socket_config = {
                "config": {
                    "key": config["config"]["key"],
                    "organization_id": config["config"]["organization_id"],
                },
                "prefix": "ws",
                "host": "server.cocreate.app:8088"
            };

            socket.create({
                namespace: socket_config.config.organization_id,
                room: null,
                host: socket_config.host
            })

            let data2 = await crud.send({
                method: 'read.object',
                array: "organizations",
                object: {
                    $filter: {
                        query: [{
                            key: 'host',
                            operator: "$in",
                            value: [hostname]
                        }],
                    },
                },
                key: config["config"]["key"],
                organization_id: config["config"]["organization_id"]
            });

            var org = data2.object[0]

            var socket_config = {
                "config": {
                    "key": org["key"],
                    "organization_id": org["_id"].toString(),
                },
                "prefix": "ws",
                "host": "server.cocreate.app:8088"
            }

            //other connection
            socket.create({
                namespace: socket_config.config.organization_id,
                room: null,
                host: socket_config.host
            })

            let myOrg = await crud.send({
                method: 'read.object',
                array: "organizations",
                key: org["key"],
                organization_id: org["_id"],
                object: {
                    _id: org["_id"]
                }
            });
            let result = { 'row': myOrg, 'socket_config': socket_config };
            return result;
        }

    }
})();

module.exports = api;