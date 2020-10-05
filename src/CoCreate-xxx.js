
const CoCreateXXX = {
	id: 'xxx',
	actions: [
		'xxxCreateRequest',
		'xxxRender',
		'xxxCreateCard'
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
	 * 4. If pre_xxxCreateRequest function exist, call pre_xxxCreateRequest() function
	 * 5. Fire the event for end (event name is xxxCreateRequest)
	 * 6. Run the next action by cocreate-action
	 * 
	 **/
	
	/**
	 * ---------- Pre-processing function -----------------
	 * When receive response, these function will call.
	 * 
	 * These functions has name rule
	 * --- rule: pre_{actionname}(data) {}
	 * 
	 **/

	pre_xxxCreateRequest: function(data) {
		console.log(JSON.stringify(data));
	},

	pre_xxxCreateCard: function(data) {
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
		CoCreateApi.render(this.id, 'xxxCreateCard', {render2: data});
	}
// END CreacteCard endpoint	
}


CoCreateApi.register(CoCreateXXX.id, CoCreateXXX);