(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(["./client"], function(CoCreateApi) {
        	return factory(CoCreateApi)
        });
    } else if (typeof module === 'object' && module.exports) {
      const CoCreateApi = require("./server.js")
      module.exports = factory(CoCreateApi);
    } else {
        root.returnExports = factory(root["./client.js"]);
  }
}(typeof self !== 'undefined' ? self : this, function (CoCreateApi) {
  return CoCreateApi;
}));