var CoCreateXXX = function() {
	this.endPoint = 'xxx';
	this.mainAttribute = 'data-xxx';
	this.actions = [
		'xxxCreateRequest',
		'xxxRender'
	];
	
	CoCreateApiSocket.call(this);
};

CoCreateXXX.prototype = Object.create(CoCreateApiSocket.prototype);
CoCreateXXX.prototype.constructor = CoCreateXXX;

CoCreateXXX.prototype = Object.assign(CoCreateXXX.prototype, {

	prexxxCreateRequest: function (data) {
		console.log('prefix----', data)
	},
	
	actionxxxCreateRequest: function(element) {
		let data = this.getFormData(element);
		this.sendData('xxxCreateRequest', [data]);
	},

	actionxxxRender: function(element, data) {
		//. data
		CoCreateRender.render('[data-template_id=abc1]',{
			render2: data
		});
		console.log('second action', data);
	}
})


const cocreateXXXInstance = new CoCreateXXX();

cocreateXXXInstance.actions.forEach((action) => {
	if (cocreateXXXInstance['action' + action]) {
		CoCreateAction.registerEvent(action, cocreateXXXInstance['action' + action], cocreateXXXInstance, action);
	}
})