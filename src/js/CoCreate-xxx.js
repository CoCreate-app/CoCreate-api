var CoCreateXXX = function() {
	this.endPoint = 'xxx';
	this.mainAttribute = 'data-xxx';
	CoCreateApiSocket.call(this);
	
	this.actions = [
		'xxxCreateRequest',
		'xxxRender'
	];
};

CoCreateXXX.prototype = Object.create(CoCreateApiSocket.prototype);
CoCreateXXX.prototype.constructor = CoCreateXXX;

CoCreateXXX.prototype = Object.assign(CoCreateXXX.prototype, {

	prexxxCreateRequest: function (data) {
		console.log('prefix----', data)
	},
	
	actionxxxCreateRequest: function(element, data) {
		this.sendData('xxxCreateRequest', {name: 'jin', description: 'okay'});	
	},

	actionxxxRender: function(element, data) {
		//. data
		console.log('second action', data, element);
	}
})


const cocreateXXXInstance = new CoCreateXXX();

cocreateXXXInstance.actions.forEach((action) => {
	if (cocreateXXXInstance['action' + action]) {
		CoCreateAction.registerEvent(action, cocreateXXXInstance['action' + action], cocreateXXXInstance, action);
	}
})