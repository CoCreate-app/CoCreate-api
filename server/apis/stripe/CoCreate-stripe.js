'use strict'
var utils= require('../utils');

class CoCreateStripe {
	constructor(wsManager) {
		this.wsManager = wsManager;
		this.init();
		
	}
	
	init() {
		if (this.wsManager) {
			this.wsManager.on('stripe',		(socket, data) => this.sendXXX(socket, data));
		}
	}
	async sendXXX(socket, data) {
	    let that = this;
	    let send_response ='stripe';
        let type = data['type'];

        switch (type) {
            case 'preTesting':
                utils.send_response(that.wsManager, socket, {"type":type,"response":data.data}, send_response)
                break;
        }
        
	}// end sendStripe
	
}//end Class 
module.exports = CoCreateStripe;
