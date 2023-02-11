import api from "@cocreate/api";

const CoCreateExample = {
    name: "example",
    actions: {
        'tokens.create':{},
        create:{	
            realtime: true,		
            request: function (data) {
            }, 
            response: function (data) {

            }, 
        }
    }
};

api.init(CoCreateExample);

export default CoCreateExample;
