const crud = require('@cocreate/crud-client')
const CoCreateSocketClient = require('@cocreate/socket-client')
let socket = new CoCreateSocketClient("ws");

crud.setSocket(socket);

var api = ( ()=> {
  return {
  	send_response : (wsManager,socket,obj,send_response) => {
    	console.log("Response   TO-> "+send_response)
	    wsManager.send(socket, send_response, obj)
	},
	  
	 handleError : (wsManager,socket, type, error,module_id)=>{
	      const response = {
	        'object': 'error',
	        'data':error || error.response || error.response.data || error.response.body || error.message || error,
	      };
	      wsManager.send(socket, module_id, { type, response })
	      //send_response(wsManager, socket, { type, response }, module_id);
	},
	getOrg : async (config, module) =>{
	 	console.log("config WS utils==== ",config)

		socket.create({
			namespace: config["organization_id"],
			room: null,
			host: "server.cocreate.app:8088"
		})
	    const event = "getOrg";
	    
	    
	    console.log("Org_id => ",config["organization_id"])
	    
	    let org_row = await crud.readDocument({
	        collection: "organizations",
	        name:"name",
	        document_id: config["organization_id"],
	        event,
	        apiKey: config["apiKey"],
		    organization_id: '5de0387b12e200ea63204d6c'
	    });

	    try{
			org_row = org_row["data"];
		  }catch(e){
			  console.log(module," Error GET ORG  in : ",e);
			return false;
		  }
		 return org_row;
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
		  				// orders: [],
		  				// startIndex: 0,
		  				// search: { type: 'or', value: []}
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
			        // "securityKey": org["securityKey"],
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
	
  } // 
})();

module.exports = api;