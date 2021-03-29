import CoCreateApi from '@cocreate/api'

const CoCreateXXX = {
	id: 'key',
	actions: [
		'renderKey'
	],
	

	action_renderKey: function(element) {
		const container = element.closest("form") || document;
		let data = CoCreate.api.getFormData(this.id, 'renderKey',  container);
		console.log(data)
		CoCreate.api.render('renderKey', {data: data});
	}
}


CoCreateApi.init({
	name: CoCreateXXX.id,
	module: CoCreateXXX
})