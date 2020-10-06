'use strict'
var utils= require('../utils');

class CoCreateStripe {
	constructor(wsManager) {
		this.wsManager = wsManager;
		this.module_id = "stripe";
		this.init();
	}
	
	init() {
		if (this.wsManager) {
			this.wsManager.on(this.moude_id,		(socket, data) => this.sendXXX(socket, data));
		}
	}
	async sendXXX(socket, data) {
	    let that = this;
        let action = data['type'];
        switch (action) {
            case 'CreateCustomer':
                utils.send_response(that.wsManager, socket, {"type":action,"response":data.data}, this.module_id)
                break;
        }
        
	}// end sendStripe
	
}//end Class 
module.exports = CoCreateStripe;
