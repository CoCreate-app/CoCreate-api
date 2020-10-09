'use strict'
var utils= require('../utils');

class CoCreateXXX {
	constructor(wsManager) {
		this.wsManager = wsManager;
		this.init();
		
	}
	
	init() {
		if (this.wsManager) {
			this.wsManager.on('xxx',		(socket, data) => this.sendXXX(socket, data));
		}
	}
	async sendXXX(socket, data) {
	    let that = this;
	    let send_response ='xxx';
        let type = data['type'];

        switch (type) {
            case 'CreateCustomerBtn':
                this.CreateCustomer(socket, type, {});
                break;
        }
        
	}// end sendStripe
	
	CreateCustomer(socket, type, param1) {
    	///... Get result by processing
    	var result = {};
        utils.send_response(this.wsManager, socket, {"type":type,"response":result}, this.module_id)
	}
	
}//end Class 
module.exports = CoCreateXXX;
