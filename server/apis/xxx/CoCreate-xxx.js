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
                utils.send_response(that.wsManager, socket, {"type":type,"response":data.data}, send_response)
                break;
        }
        
	}// end sendStripe
	
}//end Class 
module.exports = CoCreateXXX;
