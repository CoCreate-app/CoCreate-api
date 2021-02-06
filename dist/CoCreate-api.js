(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["api"] = factory();
	else
		root["CoCreate"] = root["CoCreate"] || {}, root["CoCreate"]["api"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/CoCreate-api.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/CoCreate-api.js":
/*!*****************************!*\
  !*** ./src/CoCreate-api.js ***!
  \*****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\nfunction _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }\n\nvar CoCreateApi = {\n  modules: {},\n  add: function add(_ref) {\n    var name = _ref.name,\n        module = _ref.module;\n    this.register(name, module);\n  },\n  register: function register(name, m_instance) {\n    var self = this;\n\n    if (typeof this.modules[name] === 'undefined') {\n      this.modules[name] = m_instance;\n      CoCreate.socket.listen(name, function (data) {\n        self.__responseProcess(name, data);\n      }); //. register actions\n\n      if (Array.isArray(m_instance['actions'])) {\n        m_instance['actions'].forEach(function (action) {\n          if (typeof m_instance[\"action_\".concat(action)] !== 'function') {\n            m_instance[\"action_\".concat(action)] = function (element) {\n              self.__commonAction(m_instance.id, action, element);\n            };\n          }\n\n          CoCreate.actions.add({\n            action: action,\n            endEvent: action,\n            callback: function callback(btn) {\n              m_instance[\"action_\".concat(action)](btn);\n            }\n          });\n        });\n      }\n    }\n  },\n  __responseProcess: function __responseProcess(m_name, data) {\n    var type = data.type,\n        response = data.response;\n    var m_instance = this.modules[m_name];\n\n    if (type && response && m_instance) {\n      if (typeof m_instance[\"render_\".concat(type)] === 'function') {\n        m_instance[\"render_\".concat(type)](response);\n      }\n\n      this.render(type, response);\n      document.dispatchEvent(new CustomEvent(type, {\n        detail: {\n          data: response\n        }\n      }));\n    }\n  },\n  __commonAction: function __commonAction(id, action, element) {\n    var container = element.closest(\"form\") || document;\n    var data = CoCreateApi.getFormData(id, action, container);\n    CoCreateApi.send(id, action, data);\n  },\n  getFormData: function getFormData(m_name, action, container) {\n    var mainAttr = \"data-\".concat(m_name);\n    var self = this;\n    var elements = container.querySelectorAll(\"[\".concat(mainAttr, \"]\"));\n    var data = {};\n    elements.forEach(function (element) {\n      var name = element.getAttribute(mainAttr);\n      var array_name = element.getAttribute(mainAttr + \"_array\");\n\n      var value = self.__getElValue(element);\n\n      if (!name) return;\n\n      if (action) {\n        var re = new RegExp(\"^\".concat(action, \".\"), 'i');\n\n        if (re.test(name)) {\n          name = name.replace(re, \"\");\n        } else {\n          return;\n        }\n      }\n\n      if (array_name) {\n        if (!data[name]) {\n          data[name] = [];\n        }\n\n        data[name].push(self.getFormData(m_name, array_name, element));\n      } else if (value != null) {\n        data[name] = value;\n      }\n    });\n    var keys = Object.keys(data);\n    keys.forEach(function (k) {\n      if (k.split('.').length > 1) {\n        var newData = self.__createObject(data[k], k);\n\n        delete data[k];\n        data = Object.assign(data, newData);\n      }\n    });\n    return data;\n  },\n  __getElValue: function __getElValue(element) {\n    var value = null;\n\n    if (typeof element.value !== \"undefined\") {\n      switch (element.type.toLocaleLowerCase()) {\n        case 'checkbox':\n          if (element.checked) {\n            value = element.value;\n          }\n\n          break;\n\n        default:\n          value = element.value;\n          break;\n      }\n    } else {\n      value = element.getAttribute('value');\n    }\n\n    return value;\n  },\n  __createObject: function __createObject(data, path) {\n    if (!path) return data;\n    var keys = path.split('.');\n    var newObject = data;\n\n    for (var i = keys.length - 1; i >= 0; i--) {\n      newObject = _defineProperty({}, keys[i], newObject);\n    }\n\n    return newObject;\n  },\n  send: function send(module, action, data) {\n    CoCreate.socket.send(module, {\n      type: action,\n      data: data\n    });\n  },\n  render: function render(action, data) {\n    CoCreate.render.render(\"[data-template_id=\\\"\".concat(action, \"\\\"]\"), data);\n  }\n};\n/* harmony default export */ __webpack_exports__[\"default\"] = (CoCreateApi);//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9Db0NyZWF0ZS5hcGkvLi9zcmMvQ29DcmVhdGUtYXBpLmpzP2ZjZjQiXSwibmFtZXMiOlsiQ29DcmVhdGVBcGkiLCJtb2R1bGVzIiwiYWRkIiwibmFtZSIsIm1vZHVsZSIsInJlZ2lzdGVyIiwibV9pbnN0YW5jZSIsInNlbGYiLCJDb0NyZWF0ZSIsInNvY2tldCIsImxpc3RlbiIsImRhdGEiLCJfX3Jlc3BvbnNlUHJvY2VzcyIsIkFycmF5IiwiaXNBcnJheSIsImZvckVhY2giLCJhY3Rpb24iLCJlbGVtZW50IiwiX19jb21tb25BY3Rpb24iLCJpZCIsImFjdGlvbnMiLCJlbmRFdmVudCIsImNhbGxiYWNrIiwiYnRuIiwibV9uYW1lIiwidHlwZSIsInJlc3BvbnNlIiwicmVuZGVyIiwiZG9jdW1lbnQiLCJkaXNwYXRjaEV2ZW50IiwiQ3VzdG9tRXZlbnQiLCJkZXRhaWwiLCJjb250YWluZXIiLCJjbG9zZXN0IiwiZ2V0Rm9ybURhdGEiLCJzZW5kIiwibWFpbkF0dHIiLCJlbGVtZW50cyIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJnZXRBdHRyaWJ1dGUiLCJhcnJheV9uYW1lIiwidmFsdWUiLCJfX2dldEVsVmFsdWUiLCJyZSIsIlJlZ0V4cCIsInRlc3QiLCJyZXBsYWNlIiwicHVzaCIsImtleXMiLCJPYmplY3QiLCJrIiwic3BsaXQiLCJsZW5ndGgiLCJuZXdEYXRhIiwiX19jcmVhdGVPYmplY3QiLCJhc3NpZ24iLCJ0b0xvY2FsZUxvd2VyQ2FzZSIsImNoZWNrZWQiLCJwYXRoIiwibmV3T2JqZWN0IiwiaSJdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsSUFBTUEsV0FBVyxHQUFHO0FBQ25CQyxTQUFPLEVBQUUsRUFEVTtBQUduQkMsS0FBRyxFQUFFLG1CQUF5QjtBQUFBLFFBQWZDLElBQWUsUUFBZkEsSUFBZTtBQUFBLFFBQVRDLE1BQVMsUUFBVEEsTUFBUztBQUM3QixTQUFLQyxRQUFMLENBQWNGLElBQWQsRUFBb0JDLE1BQXBCO0FBQ0EsR0FMa0I7QUFPbkJDLFVBQVEsRUFBRSxrQkFBU0YsSUFBVCxFQUFlRyxVQUFmLEVBQTJCO0FBQ3BDLFFBQU1DLElBQUksR0FBRyxJQUFiOztBQUNBLFFBQUksT0FBTyxLQUFLTixPQUFMLENBQWFFLElBQWIsQ0FBUCxLQUE4QixXQUFsQyxFQUErQztBQUM5QyxXQUFLRixPQUFMLENBQWFFLElBQWIsSUFBcUJHLFVBQXJCO0FBRUFFLGNBQVEsQ0FBQ0MsTUFBVCxDQUFnQkMsTUFBaEIsQ0FBdUJQLElBQXZCLEVBQTZCLFVBQUNRLElBQUQsRUFBVTtBQUN0Q0osWUFBSSxDQUFDSyxpQkFBTCxDQUF1QlQsSUFBdkIsRUFBNkJRLElBQTdCO0FBQ0EsT0FGRCxFQUg4QyxDQU85Qzs7QUFFQSxVQUFJRSxLQUFLLENBQUNDLE9BQU4sQ0FBY1IsVUFBVSxDQUFDLFNBQUQsQ0FBeEIsQ0FBSixFQUEwQztBQUN6Q0Esa0JBQVUsQ0FBQyxTQUFELENBQVYsQ0FBc0JTLE9BQXRCLENBQThCLFVBQUNDLE1BQUQsRUFBWTtBQUN6QyxjQUFJLE9BQU9WLFVBQVUsa0JBQVdVLE1BQVgsRUFBakIsS0FBMEMsVUFBOUMsRUFBMEQ7QUFDekRWLHNCQUFVLGtCQUFXVSxNQUFYLEVBQVYsR0FBaUMsVUFBU0MsT0FBVCxFQUFrQjtBQUNsRFYsa0JBQUksQ0FBQ1csY0FBTCxDQUFvQlosVUFBVSxDQUFDYSxFQUEvQixFQUFtQ0gsTUFBbkMsRUFBMkNDLE9BQTNDO0FBQ0EsYUFGRDtBQUdBOztBQUNEVCxrQkFBUSxDQUFDWSxPQUFULENBQWlCbEIsR0FBakIsQ0FBcUI7QUFDcEJjLGtCQUFNLEVBQUVBLE1BRFk7QUFFcEJLLG9CQUFRLEVBQUVMLE1BRlU7QUFHcEJNLG9CQUFRLEVBQUUsa0JBQUNDLEdBQUQsRUFBUztBQUNsQmpCLHdCQUFVLGtCQUFXVSxNQUFYLEVBQVYsQ0FBK0JPLEdBQS9CO0FBQ0E7QUFMbUIsV0FBckI7QUFPQSxTQWJEO0FBY0E7QUFDRDtBQUNELEdBbkNrQjtBQXFDbkJYLG1CQUFpQixFQUFFLDJCQUFTWSxNQUFULEVBQWlCYixJQUFqQixFQUF1QjtBQUFBLFFBQ2xDYyxJQURrQyxHQUNoQmQsSUFEZ0IsQ0FDbENjLElBRGtDO0FBQUEsUUFDNUJDLFFBRDRCLEdBQ2hCZixJQURnQixDQUM1QmUsUUFENEI7QUFFekMsUUFBTXBCLFVBQVUsR0FBRyxLQUFLTCxPQUFMLENBQWF1QixNQUFiLENBQW5COztBQUVBLFFBQUlDLElBQUksSUFBSUMsUUFBUixJQUFvQnBCLFVBQXhCLEVBQW9DO0FBRW5DLFVBQUssT0FBT0EsVUFBVSxrQkFBV21CLElBQVgsRUFBakIsS0FBd0MsVUFBN0MsRUFBeUQ7QUFDeERuQixrQkFBVSxrQkFBV21CLElBQVgsRUFBVixDQUE2QkMsUUFBN0I7QUFDQTs7QUFFRCxXQUFLQyxNQUFMLENBQVlGLElBQVosRUFBa0JDLFFBQWxCO0FBRUFFLGNBQVEsQ0FBQ0MsYUFBVCxDQUF1QixJQUFJQyxXQUFKLENBQWdCTCxJQUFoQixFQUFzQjtBQUM1Q00sY0FBTSxFQUFFO0FBQ1BwQixjQUFJLEVBQUVlO0FBREM7QUFEb0MsT0FBdEIsQ0FBdkI7QUFLQTtBQUNELEdBdkRrQjtBQXlEbkJSLGdCQUFjLEVBQUUsd0JBQVNDLEVBQVQsRUFBYUgsTUFBYixFQUFxQkMsT0FBckIsRUFBOEI7QUFDN0MsUUFBTWUsU0FBUyxHQUFHZixPQUFPLENBQUNnQixPQUFSLENBQWdCLE1BQWhCLEtBQTJCTCxRQUE3QztBQUNBLFFBQUlqQixJQUFJLEdBQUdYLFdBQVcsQ0FBQ2tDLFdBQVosQ0FBd0JmLEVBQXhCLEVBQTRCSCxNQUE1QixFQUFxQ2dCLFNBQXJDLENBQVg7QUFDQWhDLGVBQVcsQ0FBQ21DLElBQVosQ0FBaUJoQixFQUFqQixFQUFxQkgsTUFBckIsRUFBNkJMLElBQTdCO0FBQ0EsR0E3RGtCO0FBZ0VuQnVCLGFBQVcsRUFBRyxxQkFBU1YsTUFBVCxFQUFpQlIsTUFBakIsRUFBeUJnQixTQUF6QixFQUFtQztBQUNoRCxRQUFNSSxRQUFRLGtCQUFXWixNQUFYLENBQWQ7QUFDQSxRQUFNakIsSUFBSSxHQUFHLElBQWI7QUFDQSxRQUFNOEIsUUFBUSxHQUFHTCxTQUFTLENBQUNNLGdCQUFWLFlBQStCRixRQUEvQixPQUFqQjtBQUVBLFFBQUl6QixJQUFJLEdBQUcsRUFBWDtBQUNBMEIsWUFBUSxDQUFDdEIsT0FBVCxDQUFpQixVQUFBRSxPQUFPLEVBQUk7QUFDM0IsVUFBSWQsSUFBSSxHQUFHYyxPQUFPLENBQUNzQixZQUFSLENBQXFCSCxRQUFyQixDQUFYO0FBQ0EsVUFBSUksVUFBVSxHQUFHdkIsT0FBTyxDQUFDc0IsWUFBUixDQUFxQkgsUUFBUSxHQUFHLFFBQWhDLENBQWpCOztBQUNBLFVBQUlLLEtBQUssR0FBR2xDLElBQUksQ0FBQ21DLFlBQUwsQ0FBa0J6QixPQUFsQixDQUFaOztBQUVBLFVBQUksQ0FBQ2QsSUFBTCxFQUFXOztBQUVYLFVBQUlhLE1BQUosRUFBWTtBQUNYLFlBQUkyQixFQUFFLEdBQUcsSUFBSUMsTUFBSixZQUFlNUIsTUFBZixRQUEwQixHQUExQixDQUFUOztBQUNBLFlBQUkyQixFQUFFLENBQUNFLElBQUgsQ0FBUTFDLElBQVIsQ0FBSixFQUFtQjtBQUNsQkEsY0FBSSxHQUFHQSxJQUFJLENBQUMyQyxPQUFMLENBQWFILEVBQWIsRUFBaUIsRUFBakIsQ0FBUDtBQUNBLFNBRkQsTUFFTztBQUNOO0FBQ0E7QUFDRDs7QUFFRCxVQUFJSCxVQUFKLEVBQWdCO0FBQ2YsWUFBSSxDQUFDN0IsSUFBSSxDQUFDUixJQUFELENBQVQsRUFBaUI7QUFDaEJRLGNBQUksQ0FBQ1IsSUFBRCxDQUFKLEdBQWEsRUFBYjtBQUNBOztBQUNEUSxZQUFJLENBQUNSLElBQUQsQ0FBSixDQUFXNEMsSUFBWCxDQUFnQnhDLElBQUksQ0FBQzJCLFdBQUwsQ0FBaUJWLE1BQWpCLEVBQXlCZ0IsVUFBekIsRUFBcUN2QixPQUFyQyxDQUFoQjtBQUNBLE9BTEQsTUFLTyxJQUFJd0IsS0FBSyxJQUFJLElBQWIsRUFBbUI7QUFDekI5QixZQUFJLENBQUNSLElBQUQsQ0FBSixHQUFhc0MsS0FBYjtBQUNBO0FBQ0QsS0F4QkQ7QUEwQkEsUUFBSU8sSUFBSSxHQUFHQyxNQUFNLENBQUNELElBQVAsQ0FBWXJDLElBQVosQ0FBWDtBQUVBcUMsUUFBSSxDQUFDakMsT0FBTCxDQUFhLFVBQUNtQyxDQUFELEVBQU87QUFDbkIsVUFBSUEsQ0FBQyxDQUFDQyxLQUFGLENBQVEsR0FBUixFQUFhQyxNQUFiLEdBQXNCLENBQTFCLEVBQTZCO0FBQzVCLFlBQUlDLE9BQU8sR0FBRzlDLElBQUksQ0FBQytDLGNBQUwsQ0FBb0IzQyxJQUFJLENBQUN1QyxDQUFELENBQXhCLEVBQTZCQSxDQUE3QixDQUFkOztBQUNBLGVBQU92QyxJQUFJLENBQUN1QyxDQUFELENBQVg7QUFFQXZDLFlBQUksR0FBR3NDLE1BQU0sQ0FBQ00sTUFBUCxDQUFjNUMsSUFBZCxFQUFvQjBDLE9BQXBCLENBQVA7QUFDQTtBQUNELEtBUEQ7QUFRQSxXQUFPMUMsSUFBUDtBQUNBLEdBM0drQjtBQTZHbkIrQixjQUFZLEVBQUUsc0JBQVN6QixPQUFULEVBQWtCO0FBQy9CLFFBQUl3QixLQUFLLEdBQUcsSUFBWjs7QUFDQSxRQUFJLE9BQU94QixPQUFPLENBQUN3QixLQUFmLEtBQXlCLFdBQTdCLEVBQTBDO0FBQ3pDLGNBQVF4QixPQUFPLENBQUNRLElBQVIsQ0FBYStCLGlCQUFiLEVBQVI7QUFDQyxhQUFLLFVBQUw7QUFDQyxjQUFJdkMsT0FBTyxDQUFDd0MsT0FBWixFQUFxQjtBQUNwQmhCLGlCQUFLLEdBQUd4QixPQUFPLENBQUN3QixLQUFoQjtBQUNBOztBQUNEOztBQUNEO0FBQ0NBLGVBQUssR0FBR3hCLE9BQU8sQ0FBQ3dCLEtBQWhCO0FBQ0E7QUFSRjtBQVVBLEtBWEQsTUFXTztBQUNOQSxXQUFLLEdBQUd4QixPQUFPLENBQUNzQixZQUFSLENBQXFCLE9BQXJCLENBQVI7QUFDQTs7QUFFRCxXQUFPRSxLQUFQO0FBQ0EsR0EvSGtCO0FBaUluQmEsZ0JBQWMsRUFBRSx3QkFBVTNDLElBQVYsRUFBZ0IrQyxJQUFoQixFQUFzQjtBQUNyQyxRQUFJLENBQUNBLElBQUwsRUFBVyxPQUFPL0MsSUFBUDtBQUVYLFFBQUlxQyxJQUFJLEdBQUdVLElBQUksQ0FBQ1AsS0FBTCxDQUFXLEdBQVgsQ0FBWDtBQUNBLFFBQUlRLFNBQVMsR0FBR2hELElBQWhCOztBQUVBLFNBQUssSUFBS2lELENBQUMsR0FBR1osSUFBSSxDQUFDSSxNQUFMLEdBQWMsQ0FBNUIsRUFBK0JRLENBQUMsSUFBSSxDQUFwQyxFQUF1Q0EsQ0FBQyxFQUF4QyxFQUE0QztBQUMzQ0QsZUFBUyx1QkFBS1gsSUFBSSxDQUFDWSxDQUFELENBQVQsRUFBZUQsU0FBZixDQUFUO0FBQ0E7O0FBQ0QsV0FBT0EsU0FBUDtBQUNBLEdBM0lrQjtBQTZJbkJ4QixNQUFJLEVBQUcsY0FBUy9CLE1BQVQsRUFBaUJZLE1BQWpCLEVBQXlCTCxJQUF6QixFQUE4QjtBQUNwQ0gsWUFBUSxDQUFDQyxNQUFULENBQWdCMEIsSUFBaEIsQ0FBcUIvQixNQUFyQixFQUE2QjtBQUFDcUIsVUFBSSxFQUFFVCxNQUFQO0FBQWVMLFVBQUksRUFBSkE7QUFBZixLQUE3QjtBQUNBLEdBL0lrQjtBQWlKbkJnQixRQUFNLEVBQUUsZ0JBQVNYLE1BQVQsRUFBaUJMLElBQWpCLEVBQXVCO0FBQzlCSCxZQUFRLENBQUNtQixNQUFULENBQWdCQSxNQUFoQiwrQkFBNkNYLE1BQTdDLFVBQXlETCxJQUF6RDtBQUNBO0FBbkprQixDQUFwQjtBQXNKZVgsMEVBQWYiLCJmaWxlIjoiLi9zcmMvQ29DcmVhdGUtYXBpLmpzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgQ29DcmVhdGVBcGkgPSB7XG5cdG1vZHVsZXM6IHsgfSxcblx0XG5cdGFkZDogZnVuY3Rpb24oe25hbWUsIG1vZHVsZX0pIHtcblx0XHR0aGlzLnJlZ2lzdGVyKG5hbWUsIG1vZHVsZSlcdFxuXHR9LFxuXHRcblx0cmVnaXN0ZXI6IGZ1bmN0aW9uKG5hbWUsIG1faW5zdGFuY2UpIHtcblx0XHRjb25zdCBzZWxmID0gdGhpcztcblx0XHRpZiAodHlwZW9mIHRoaXMubW9kdWxlc1tuYW1lXSA9PT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdHRoaXMubW9kdWxlc1tuYW1lXSA9IG1faW5zdGFuY2U7XG5cdFx0XHRcblx0XHRcdENvQ3JlYXRlLnNvY2tldC5saXN0ZW4obmFtZSwgKGRhdGEpID0+IHtcblx0XHRcdFx0c2VsZi5fX3Jlc3BvbnNlUHJvY2VzcyhuYW1lLCBkYXRhKTtcblx0XHRcdH0pXG5cdFx0XHRcblx0XHRcdC8vLiByZWdpc3RlciBhY3Rpb25zXG5cdFx0XHRcblx0XHRcdGlmIChBcnJheS5pc0FycmF5KG1faW5zdGFuY2VbJ2FjdGlvbnMnXSkpIHtcblx0XHRcdFx0bV9pbnN0YW5jZVsnYWN0aW9ucyddLmZvckVhY2goKGFjdGlvbikgPT4ge1xuXHRcdFx0XHRcdGlmICh0eXBlb2YgbV9pbnN0YW5jZVtgYWN0aW9uXyR7YWN0aW9ufWBdICE9PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRcdFx0XHRtX2luc3RhbmNlW2BhY3Rpb25fJHthY3Rpb259YF0gPSBmdW5jdGlvbihlbGVtZW50KSB7XG5cdFx0XHRcdFx0XHRcdHNlbGYuX19jb21tb25BY3Rpb24obV9pbnN0YW5jZS5pZCwgYWN0aW9uLCBlbGVtZW50KVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0gXG5cdFx0XHRcdFx0Q29DcmVhdGUuYWN0aW9ucy5hZGQoe1xuXHRcdFx0XHRcdFx0YWN0aW9uOiBhY3Rpb24sXG5cdFx0XHRcdFx0XHRlbmRFdmVudDogYWN0aW9uLFxuXHRcdFx0XHRcdFx0Y2FsbGJhY2s6IChidG4pID0+IHtcblx0XHRcdFx0XHRcdFx0bV9pbnN0YW5jZVtgYWN0aW9uXyR7YWN0aW9ufWBdKGJ0bik7XG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdH0pXG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxuXHRcblx0X19yZXNwb25zZVByb2Nlc3M6IGZ1bmN0aW9uKG1fbmFtZSwgZGF0YSkge1xuXHRcdGNvbnN0IHt0eXBlLCByZXNwb25zZX0gPSBkYXRhO1xuXHRcdGNvbnN0IG1faW5zdGFuY2UgPSB0aGlzLm1vZHVsZXNbbV9uYW1lXVxuXHRcdFxuXHRcdGlmICh0eXBlICYmIHJlc3BvbnNlICYmIG1faW5zdGFuY2UpIHtcblx0XHRcblx0XHRcdGlmICggdHlwZW9mIG1faW5zdGFuY2VbYHJlbmRlcl8ke3R5cGV9YF0gPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdFx0bV9pbnN0YW5jZVtgcmVuZGVyXyR7dHlwZX1gXShyZXNwb25zZSk7XG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdHRoaXMucmVuZGVyKHR5cGUsIHJlc3BvbnNlKTtcblx0XHRcdFxuXHRcdFx0ZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQodHlwZSwge1xuXHRcdFx0XHRkZXRhaWw6IHtcblx0XHRcdFx0XHRkYXRhOiByZXNwb25zZVxuXHRcdFx0XHR9XG5cdFx0XHR9KSlcblx0XHR9XG5cdH0sXG5cdFxuXHRfX2NvbW1vbkFjdGlvbjogZnVuY3Rpb24oaWQsIGFjdGlvbiwgZWxlbWVudCkge1xuXHRcdGNvbnN0IGNvbnRhaW5lciA9IGVsZW1lbnQuY2xvc2VzdChcImZvcm1cIikgfHwgZG9jdW1lbnQ7XG5cdFx0bGV0IGRhdGEgPSBDb0NyZWF0ZUFwaS5nZXRGb3JtRGF0YShpZCwgYWN0aW9uLCAgY29udGFpbmVyKTtcblx0XHRDb0NyZWF0ZUFwaS5zZW5kKGlkLCBhY3Rpb24sIGRhdGEpO1xuXHR9LFxuXHRcblx0XG5cdGdldEZvcm1EYXRhIDogZnVuY3Rpb24obV9uYW1lLCBhY3Rpb24sIGNvbnRhaW5lcil7XG5cdFx0Y29uc3QgbWFpbkF0dHIgPSBgZGF0YS0ke21fbmFtZX1gO1xuXHRcdGNvbnN0IHNlbGYgPSB0aGlzO1xuXHRcdGNvbnN0IGVsZW1lbnRzID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoYFske21haW5BdHRyfV1gKTtcblxuXHRcdGxldCBkYXRhID0ge31cblx0XHRlbGVtZW50cy5mb3JFYWNoKGVsZW1lbnQgPT4ge1xuXHRcdFx0bGV0IG5hbWUgPSBlbGVtZW50LmdldEF0dHJpYnV0ZShtYWluQXR0cik7XG5cdFx0XHRsZXQgYXJyYXlfbmFtZSA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKG1haW5BdHRyICsgXCJfYXJyYXlcIik7XG5cdFx0XHRsZXQgdmFsdWUgPSBzZWxmLl9fZ2V0RWxWYWx1ZShlbGVtZW50KTtcblx0XHRcdFxuXHRcdFx0aWYgKCFuYW1lKSByZXR1cm5cblxuXHRcdFx0aWYgKGFjdGlvbikge1xuXHRcdFx0XHRsZXQgcmUgPSBuZXcgUmVnRXhwKGBeJHthY3Rpb259LmAsICdpJyk7XG5cdFx0XHRcdGlmIChyZS50ZXN0KG5hbWUpKSB7XG5cdFx0XHRcdFx0bmFtZSA9IG5hbWUucmVwbGFjZShyZSwgXCJcIik7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdGlmIChhcnJheV9uYW1lKSB7XG5cdFx0XHRcdGlmICghZGF0YVtuYW1lXSkge1xuXHRcdFx0XHRcdGRhdGFbbmFtZV0gPSBbXTtcblx0XHRcdFx0fVxuXHRcdFx0XHRkYXRhW25hbWVdLnB1c2goc2VsZi5nZXRGb3JtRGF0YShtX25hbWUsIGFycmF5X25hbWUsIGVsZW1lbnQpKTtcblx0XHRcdH0gZWxzZSBpZiAodmFsdWUgIT0gbnVsbCkge1xuXHRcdFx0XHRkYXRhW25hbWVdID0gdmFsdWU7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0XG5cdFx0bGV0IGtleXMgPSBPYmplY3Qua2V5cyhkYXRhKVxuXHRcdFxuXHRcdGtleXMuZm9yRWFjaCgoaykgPT4ge1xuXHRcdFx0aWYgKGsuc3BsaXQoJy4nKS5sZW5ndGggPiAxKSB7XG5cdFx0XHRcdGxldCBuZXdEYXRhID0gc2VsZi5fX2NyZWF0ZU9iamVjdChkYXRhW2tdLCBrKTtcblx0XHRcdFx0ZGVsZXRlIGRhdGFba11cblx0XHRcdFx0XG5cdFx0XHRcdGRhdGEgPSBPYmplY3QuYXNzaWduKGRhdGEsIG5ld0RhdGEpO1xuXHRcdFx0fVxuXHRcdH0pXG5cdFx0cmV0dXJuIGRhdGE7XG5cdH0sXG5cdFxuXHRfX2dldEVsVmFsdWU6IGZ1bmN0aW9uKGVsZW1lbnQpIHtcblx0XHRsZXQgdmFsdWUgPSBudWxsO1xuXHRcdGlmICh0eXBlb2YgZWxlbWVudC52YWx1ZSAhPT0gXCJ1bmRlZmluZWRcIikge1xuXHRcdFx0c3dpdGNoIChlbGVtZW50LnR5cGUudG9Mb2NhbGVMb3dlckNhc2UoKSkge1xuXHRcdFx0XHRjYXNlICdjaGVja2JveCc6XG5cdFx0XHRcdFx0aWYgKGVsZW1lbnQuY2hlY2tlZCkge1xuXHRcdFx0XHRcdFx0dmFsdWUgPSBlbGVtZW50LnZhbHVlXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdHZhbHVlID0gZWxlbWVudC52YWx1ZTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0dmFsdWUgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgndmFsdWUnKTtcblx0XHR9XG5cdFx0XG5cdFx0cmV0dXJuIHZhbHVlO1xuXHR9LFxuXHRcblx0X19jcmVhdGVPYmplY3Q6IGZ1bmN0aW9uIChkYXRhLCBwYXRoKSB7XG5cdFx0aWYgKCFwYXRoKSByZXR1cm4gZGF0YTtcblx0XHRcblx0XHRsZXQga2V5cyA9IHBhdGguc3BsaXQoJy4nKVxuXHRcdGxldCBuZXdPYmplY3QgPSBkYXRhO1xuXG5cdFx0Zm9yICh2YXIgIGkgPSBrZXlzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG5cdFx0XHRuZXdPYmplY3QgPSB7W2tleXNbaV1dOiBuZXdPYmplY3R9XHRcdFx0XHRcblx0XHR9XG5cdFx0cmV0dXJuIG5ld09iamVjdDtcblx0fSxcblx0XG5cdHNlbmQgOiBmdW5jdGlvbihtb2R1bGUsIGFjdGlvbiwgZGF0YSl7IFxuXHRcdENvQ3JlYXRlLnNvY2tldC5zZW5kKG1vZHVsZSwge3R5cGU6IGFjdGlvbiwgZGF0YX0pO1xuXHR9LFxuXHRcblx0cmVuZGVyOiBmdW5jdGlvbihhY3Rpb24sIGRhdGEpIHtcblx0XHRDb0NyZWF0ZS5yZW5kZXIucmVuZGVyKGBbZGF0YS10ZW1wbGF0ZV9pZD1cIiR7YWN0aW9ufVwiXWAsIGRhdGEpO1xuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IENvQ3JlYXRlQXBpOyJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/CoCreate-api.js\n");

/***/ })

/******/ })["default"];
});