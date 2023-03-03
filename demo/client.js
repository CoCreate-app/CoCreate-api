import api from "@cocreate/api";

const CoCreateExample = {
    name: "example",
    endPoints: {
        'tokens.create':{},
        create: {	
            onload: function (name, endPoint, element) {
            
            },
            input: function (name, endPoint, element) {

            },
            action: function (name, endPoint, element){

            },
            observer: function (name, endPoint, element) {

            },
            request: function (name, endPoint, element) {

            },
            response: function (name, endPoint, element) {

            }, 
            read: true,
            realtime: true,
            save: true,
            update: true,
            listen: true

        }
    }
};

api.init(CoCreateExample);

export default CoCreateExample;
