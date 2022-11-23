const CRUD = require('@cocreate/crud-client')
const socketClient = require('@cocreate/socket-client')
let socket = new socketClient("ws");

let crud
if (CRUD && CRUD.default)
	crud = CRUD.default
else
	crud = CRUD

crud.setSocket(socket);

var api = ( ()=> {
  return {
  	send_response: (wsManager, socket, obj, send_response) => {
	    wsManager.send(socket, send_response, obj)
	},
	  
	handleError: (wsManager, socket, action, error, component) => {
		const response = {
			'object': 'error',
			'data':error || error.response || error.response.data || error.response.body || error.message || error,
		};
		wsManager.send(socket, component, { action, response })
	},

	getOrg: async (config, component) => {

		socket.create({
			namespace: config["organization_id"],
			room: null,
			host: config["host"]
		})

		let org = await crud.readDocument({
	        collection: "organizations",
	        apiKey: config["apiKey"],
		    organization_id: config["organization_id"],
			document: {
				_id: config["organization_id"]
			}

	    });

		if (!org || !org.document && !org.document[0]) {
			console.log(component," Error GET ORG  in : ",e);
			return false;
		}

		return org.document[0];
	},

	getOrgInRoutesbyHostname : async (config, hostname) => {
 		var socket_config = {
  		    "config": {
  		        "apiKey": config["config"]["apiKey"],
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
	
		let data2 = await crud.readDocument({
			collection: "organizations",
			filter: {
				query: [{
					name: 'domains',
					operator: "$in",
					value: [hostname]
				}],
			},
			apiKey: config["config"]["apiKey"],
			organization_id: config["config"]["organization_id"]
		});
	
		var org = data2.document[0]

		var socket_config = {
			"config": {
				"apiKey": org["apiKey"],
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

		let myOrg = await crud.readDocument({
			collection: "organizations",
			apiKey: org["apiKey"],
			organization_id: org["_id"],
			document: {
				_id: org["_id"]
			}
		});
	    let result = {'row':myOrg,'socket_config':socket_config};
	    return result;
	 }  
	
  }
})();

module.exports = api;