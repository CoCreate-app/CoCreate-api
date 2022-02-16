const crud = require('@cocreate/crud-client')
const socketClient = require('@cocreate/socket-client')
let socket = new socketClient("ws");

crud.setSocket(socket);

var api = ( ()=> {
  return {
  	send_response: (wsManager, socket, obj, send_response) => {
    	console.log(send_response, " Response Sent")
	    wsManager.send(socket, send_response, obj)
	},
	  
	handleError: (wsManager, socket, type, error, module_id)=>{
		const response = {
			'object': 'error',
			'data':error || error.response || error.response.data || error.response.body || error.message || error,
		};
		wsManager.send(socket, module_id, { type, response })
	},

	getOrg: async (config, module) =>{

		socket.create({
			namespace: config["organization_id"],
			room: null,
			host: config["host"]
		})

		let org = await crud.readDocument({
	        collection: "organizations",
	        name:"name",
	        document_id: config["organization_id"],
	        apiKey: config["apiKey"],
		    organization_id: config["organization_id"]
	    });

	    try{
			org = org["data"];
		}catch(e){
			console.log(module," Error GET ORG  in : ",e);
			return false;
		}
		return org;
	},

	getOrgInRoutesbyHostname : async (config, hostname) =>{
 		var socket_config = {
  		    "config": {
  		        "apiKey": config["config"]["apiKey"],
  		        "organization_Id": config["config"]["organization_id"],
  		    },
  		    "prefix": "ws",
  		    "host": "server.cocreate.app:8088"
  		};
  		
		socket.create({
			namespace: socket_config.config.organization_Id,
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
		console.log("data2 ===",data2)
	
		var org = data2["data"][0]

		var socket_config = {
			"config": {
				"apiKey": org["apiKey"],
				"organization_Id": org["_id"].toString(),
			},
			"prefix": "ws",
			"host": "server.cocreate.app:8088"
		}

		//other connection
		socket.create({
		  	namespace: socket_config.config.organization_Id,
			room: null,
			host: socket_config.host
		})

	    // socket.setGlobalScope(socket_config.config.organization_id)
		let myOrg = await crud.readDocumentList({
			collection: "organizations",
			operator: {
				filters: [{
					name: '_id',
					operator: "$eq",
					value: [org["_id"].toString()]
				}],
				orders: [],
				startIndex: 0,
				search: { type: 'or', value: []}
			},
	         is_collection: false,
	         apiKey: org["apiKey"],
		     organization_id: org["_id"]
		});
	    let result = {'row':myOrg,'socket_config':socket_config};
	    return result;
	 }  
	
  }
})();

module.exports = api;