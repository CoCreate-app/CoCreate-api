
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
	
	"pre_.getBalanceBtn": function(data) {
		console.log(data);
	},
	pre_balanceTransactionBtn: function(data) {
		console.log(data);
	},
	pre_preTesting: function(data) {
		console.log(data)
	},
	
	action_preTesting: function(element) {
		
	}
}


CoCreateApi.register(CoCreateStripe.id, CoCreateStripe);