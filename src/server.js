const crud = require('@cocreate/crud-client')
const socketClient = require('@cocreate/socket-client')
let socket = new socketClient("ws");

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
	        document_id: config["organization_id"],
	        apiKey: config["apiKey"],
		    organization_id: config["organization_id"]
	    });

	    try{
			org = org["data"];
		}catch(e){
			console.log(component," Error GET ORG  in : ",e);
			return false;
		}
		return org;
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
	
		let data2 = await crud.readDocumentList({
			collection: "organizations",
			operator: {
				filters: [{
					name: 'domains',
					operator: "$in",
					value: [hostname]
				}],
			},
			is_collection: false,
			apiKey: config["config"]["apiKey"],
			organization_id: config["config"]["organization_id"]
		});

		//let data2 = await crud.listenAsync(eventGetOrg);
		// console.log("data2 ===", data2)
	
		var org = data2["data"][0]

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
			document_id: org["_id"],
			apiKey: org["apiKey"],
			organization_id: org["_id"]
		});
	    let result = {'row':myOrg,'socket_config':socket_config};
	    return result;
	 }  
	
  }
})();

module.exports = api;