import api from '@cocreate/api'

const CoCreateXXX = {
	id: 'xxx',
	actions: [
		'xxxGetKeysFromBd',
		'xxxRender',
		'xxxCreateCard',
	],
	
	/**
	 * 
	 * CoCreate-xxx action chain
	 * Ex: action name: xxxCreateRequest
	 * 1. call action_xxxCreateRequest() function
	 *   - get the data from form
	 *   - send data and action into server 
	 * 2. Server processing
	 * 3. Received the response from server
	 * 4. If render_xxxCreateRequest function exist, call render_xxxCreateRequest() function
	 * 5. Fire the event for end (event name is xxxCreateRequest)
	 * 6. Run the next action by cocreate-action
	 * 
	 **/
	
	/**
	 * ---------- Render-processing function -----------------
	 * When receive response, these function will call.
	 * 
	 * These functions has name rule
	 * --- rule: render_{actionname}(data) {}
	 * 
	 **/

	render_xxxGetKeysFromBd: function(data) {
		console.log(JSON.stringify(data));
	},

	render_xxxCreateCard: function(data) {
		console.log('Card --- ', data);
	},
	
	
	/**
	 * --------- Action processing function  -----------
	 * These function will call by cocreate-render when click button (data-actions)
	 * 
	 * Action functions has name rule
	 * ---- rule: action_{actionname}(element[, data]) {}
	 * 
	 * Input parameter: 
	 *    element: Dom Element (actioin button)
	 *    data: data from before stage action
	 * 
	 * 
	 **/

	action_xxxRender: function(element, data) {
		//. data rendering by cocreate-render
		api.render(this.id, 'xxxCreateCard', {render2: data});
	},
	
}

api.init({
	name: CoCreateXXX.id,
	module: CoCreateXXX
})

export default CoCreateXXX;