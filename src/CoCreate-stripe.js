
const CoCreateStripe = {
	id: 'stripe',
	actions: [
		'getBalance',
		'balanceTransaction',
		'createCustomer',
		'createCard',
		'listCustomers',
		'preTesting'
	],
	
	render_getBalanceBtn: function(data) {
		console.log(data);
	},
	render_balanceTransactionBtn: function(data) {
		console.log(data);
	},
	render_preTesting: function(data) {
		console.log(data)
	},
	
	action_preTesting: function(element) {
		
	}
}


CoCreateApi.register(CoCreateStripe.id, CoCreateStripe);