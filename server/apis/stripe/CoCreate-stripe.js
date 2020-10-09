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
			this.wsManager.on(this.module_id, (socket, data) => this.sendStripe(socket, data));
		}
	}

	async sendStripe(socket, data) {
        let type = data['type'];
        const stripe = require('stripe')('sk_test_4eC39HqLyjWDarjtT1zdp7dc');
        switch (type) {
            case 'stripeGetBalance':
                this.stripeGetBalance(socket, type, stripe); break;
            case 'stripeBalanceTranscation':
                await this.stripeBalanceTranscation(socket, type, stripe); break;
            case 'stripeListCustomers':
                await this.stripeListCustomers(socket, type, stripe); break;
        }
	}
	
	stripeGetBalance (socket, type, stripe) {
        stripe.balance.retrieve((err, balance) => {
            if (!err && balance) {
              utils.send_response(this.wsManager,socket,{"type":type,"response":balance},this.module_id)
            } else if (err) {
              utils.send_response(this.wsManager,socket,{"type":type,"response":0},this.module_id)
            }
          });
	}
	
	async stripeBalanceTranscation(socket, type, stripe) {
        const balanceTransaction = await stripe.balanceTransactions.retrieve(
          'txn_1032HU2eZvKYlo2CEPtcnUvl'
        );
        utils.send_response(this.wsManager,socket,{"test":type,"response":balanceTransaction},this.module_id)
	}
	
	async stripeListCustomers(socket, type, stripe) {
        const customers = await stripe.customers.list({limit: 20});
        utils.send_response(this.wsManager,socket,{"type":type,"response":customers}, this.module_id)
	}
	
}//end Class 
module.exports = CoCreateStripe;
