/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["CoCreateApi"] = factory();
	else
		root["CoCreateApi"] = factory();
})(this, function() {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/CoCreate-api.js":
/*!*****************************!*\
  !*** ./src/CoCreate-api.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => __WEBPACK_DEFAULT_EXPORT__\n/* harmony export */ });\nfunction _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }\n\nvar CoCreateApi = {\n  modules: {},\n  register: function register(name, m_instance) {\n    var self = this;\n\n    if (typeof this.modules[name] === 'undefined') {\n      this.modules[name] = m_instance;\n      CoCreateSocket.listen(name, function (data) {\n        self.__responseProcess(name, data);\n      }); //. register actions\n\n      if (Array.isArray(m_instance['actions'])) {\n        m_instance['actions'].forEach(function (action) {\n          if (typeof m_instance[\"action_\".concat(action)] !== 'function') {\n            m_instance[\"action_\".concat(action)] = function (element) {\n              self.__commonAction(m_instance.id, action, element);\n            };\n          }\n\n          CoCreateAction.registerEvent(action, m_instance[\"action_\".concat(action)], m_instance, action);\n        });\n      }\n    }\n  },\n  __responseProcess: function __responseProcess(m_name, data) {\n    var type = data.type,\n        response = data.response;\n    var m_instance = this.modules[m_name];\n\n    if (type && response && m_instance) {\n      if (typeof m_instance[\"render_\".concat(type)] === 'function') {\n        m_instance[\"render_\".concat(type)](response);\n      }\n\n      this.render(type, response);\n      document.dispatchEvent(new CustomEvent(type, {\n        detail: {\n          data: response\n        }\n      }));\n    }\n  },\n  __commonAction: function __commonAction(id, action, element) {\n    var container = element.closest(\"form\") || document;\n    var data = CoCreateApi.getFormData(id, action, container);\n    CoCreateApi.send(id, action, data);\n  },\n  getFormData: function getFormData(m_name, action, container) {\n    var mainAttr = \"data-\".concat(m_name);\n    var self = this;\n    var elements = container.querySelectorAll(\"[\".concat(mainAttr, \"]\"));\n    var data = {};\n    elements.forEach(function (element) {\n      var name = element.getAttribute(mainAttr);\n      var array_name = element.getAttribute(mainAttr + \"_array\");\n\n      var value = self.__getElValue(element);\n\n      if (!name) return;\n\n      if (action) {\n        var re = new RegExp(\"^\".concat(action, \".\"), 'i');\n\n        if (re.test(name)) {\n          name = name.replace(re, \"\");\n        } else {\n          return;\n        }\n      }\n\n      if (array_name) {\n        if (!data[name]) {\n          data[name] = [];\n        }\n\n        data[name].push(self.getFormData(m_name, array_name, element));\n      } else if (value != null) {\n        data[name] = value;\n      }\n    });\n    var keys = Object.keys(data);\n    keys.forEach(function (k) {\n      if (k.split('.').length > 1) {\n        var newData = self.__createObject(data[k], k);\n\n        delete data[k];\n        data = Object.assign(data, newData);\n      }\n    });\n    return data;\n  },\n  __getElValue: function __getElValue(element) {\n    var value = null;\n\n    if (typeof element.value !== \"undefined\") {\n      switch (element.type.toLocaleLowerCase()) {\n        case 'checkbox':\n          if (element.checked) {\n            value = element.value;\n          }\n\n          break;\n\n        default:\n          value = element.value;\n          break;\n      }\n    } else {\n      value = element.getAttribute('value');\n    }\n\n    return value;\n  },\n  __createObject: function __createObject(data, path) {\n    if (!path) return data;\n    var keys = path.split('.');\n    var newObject = data;\n\n    for (var i = keys.length - 1; i >= 0; i--) {\n      newObject = _defineProperty({}, keys[i], newObject);\n    }\n\n    return newObject;\n  },\n  send: function send(module, action, data) {\n    CoCreateSocket.send(module, {\n      type: action,\n      data: data\n    });\n  },\n  render: function render(action, data) {\n    CoCreateRender.render(\"[data-template_id=\\\"\".concat(action, \"\\\"]\"), data);\n  }\n};\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (CoCreatApi);//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9Db0NyZWF0ZUFwaS8uL3NyYy9Db0NyZWF0ZS1hcGkuanM/ZmNmNCJdLCJuYW1lcyI6WyJDb0NyZWF0ZUFwaSIsIm1vZHVsZXMiLCJyZWdpc3RlciIsIm5hbWUiLCJtX2luc3RhbmNlIiwic2VsZiIsIkNvQ3JlYXRlU29ja2V0IiwibGlzdGVuIiwiZGF0YSIsIl9fcmVzcG9uc2VQcm9jZXNzIiwiQXJyYXkiLCJpc0FycmF5IiwiZm9yRWFjaCIsImFjdGlvbiIsImVsZW1lbnQiLCJfX2NvbW1vbkFjdGlvbiIsImlkIiwiQ29DcmVhdGVBY3Rpb24iLCJyZWdpc3RlckV2ZW50IiwibV9uYW1lIiwidHlwZSIsInJlc3BvbnNlIiwicmVuZGVyIiwiZG9jdW1lbnQiLCJkaXNwYXRjaEV2ZW50IiwiQ3VzdG9tRXZlbnQiLCJkZXRhaWwiLCJjb250YWluZXIiLCJjbG9zZXN0IiwiZ2V0Rm9ybURhdGEiLCJzZW5kIiwibWFpbkF0dHIiLCJlbGVtZW50cyIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJnZXRBdHRyaWJ1dGUiLCJhcnJheV9uYW1lIiwidmFsdWUiLCJfX2dldEVsVmFsdWUiLCJyZSIsIlJlZ0V4cCIsInRlc3QiLCJyZXBsYWNlIiwicHVzaCIsImtleXMiLCJPYmplY3QiLCJrIiwic3BsaXQiLCJsZW5ndGgiLCJuZXdEYXRhIiwiX19jcmVhdGVPYmplY3QiLCJhc3NpZ24iLCJ0b0xvY2FsZUxvd2VyQ2FzZSIsImNoZWNrZWQiLCJwYXRoIiwibmV3T2JqZWN0IiwiaSIsIm1vZHVsZSIsIkNvQ3JlYXRlUmVuZGVyIiwiQ29DcmVhdEFwaSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsSUFBTUEsV0FBVyxHQUFHO0FBQ25CQyxTQUFPLEVBQUUsRUFEVTtBQUduQkMsVUFBUSxFQUFFLGtCQUFTQyxJQUFULEVBQWVDLFVBQWYsRUFBMkI7QUFDcEMsUUFBTUMsSUFBSSxHQUFHLElBQWI7O0FBQ0EsUUFBSSxPQUFPLEtBQUtKLE9BQUwsQ0FBYUUsSUFBYixD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WSxDQUFELENBQVQsRUFBZUQsU0FBZixDQUFUO0FBQ0E7O0FBQ0QsV0FBT0EsU0FBUDtBQUNBLEdBaklrQjtBQW1JbkJ4QixNQUFJLEVBQUcsY0FBUzBCLE1BQVQsRUFBaUIzQyxNQUFqQixFQUF5QkwsSUFBekIsRUFBOEI7QUFDcENGLGtCQUFjLENBQUN3QixJQUFmLENBQW9CMEIsTUFBcEIsRUFBNEI7QUFBQ3BDLFVBQUksRUFBRVAsTUFBUDtBQUFlTCxVQUFJLEVBQUpBO0FBQWYsS0FBNUI7QUFDQSxHQXJJa0I7QUF1SW5CYyxRQUFNLEVBQUUsZ0JBQVNULE1BQVQsRUFBaUJMLElBQWpCLEVBQXVCO0FBQzlCaUQsa0JBQWMsQ0FBQ25DLE1BQWYsK0JBQTRDVCxNQUE1QyxVQUF3REwsSUFBeEQ7QUFDQTtBQXpJa0IsQ0FBcEI7QUE0SUEsaUVBQWVrRCxVQUFmIiwiZmlsZSI6Ii4vc3JjL0NvQ3JlYXRlLWFwaS5qcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IENvQ3JlYXRlQXBpID0ge1xuXHRtb2R1bGVzOiB7IH0sXG5cdFxuXHRyZWdpc3RlcjogZnVuY3Rpb24obmFtZSwgbV9pbnN0YW5jZSkge1xuXHRcdGNvbnN0IHNlbGYgPSB0aGlzO1xuXHRcdGlmICh0eXBlb2YgdGhpcy5tb2R1bGVzW25hbWVdID09PSAndW5kZWZpbmVkJykge1xuXHRcdFx0dGhpcy5tb2R1bGVzW25hbWVdID0gbV9pbnN0YW5jZTtcblx0XHRcdFxuXHRcdFx0Q29DcmVhdGVTb2NrZXQubGlzdGVuKG5hbWUsIChkYXRhKSA9PiB7XG5cdFx0XHRcdHNlbGYuX19yZXNwb25zZVByb2Nlc3MobmFtZSwgZGF0YSk7XG5cdFx0XHR9KVxuXHRcdFx0XG5cdFx0XHQvLy4gcmVnaXN0ZXIgYWN0aW9uc1xuXHRcdFx0XG5cdFx0XHRpZiAoQXJyYXkuaXNBcnJheShtX2luc3RhbmNlWydhY3Rpb25zJ10pKSB7XG5cdFx0XHRcdG1faW5zdGFuY2VbJ2FjdGlvbnMnXS5mb3JFYWNoKChhY3Rpb24pID0+IHtcblx0XHRcdFx0XHRpZiAodHlwZW9mIG1faW5zdGFuY2VbYGFjdGlvbl8ke2FjdGlvbn1gXSAhPT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0XHRcdFx0bV9pbnN0YW5jZVtgYWN0aW9uXyR7YWN0aW9ufWBdID0gZnVuY3Rpb24oZWxlbWVudCkge1xuXHRcdFx0XHRcdFx0XHRzZWxmLl9fY29tbW9uQWN0aW9uKG1faW5zdGFuY2UuaWQsIGFjdGlvbiwgZWxlbWVudClcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9IFxuXHRcdFx0XHRcdENvQ3JlYXRlQWN0aW9uLnJlZ2lzdGVyRXZlbnQoYWN0aW9uLCBtX2luc3RhbmNlW2BhY3Rpb25fJHthY3Rpb259YF0sIG1faW5zdGFuY2UsIGFjdGlvbik7XG5cdFx0XHRcdH0pXG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxuXHRcblx0X19yZXNwb25zZVByb2Nlc3M6IGZ1bmN0aW9uKG1fbmFtZSwgZGF0YSkge1xuXHRcdGNvbnN0IHt0eXBlLCByZXNwb25zZX0gPSBkYXRhO1xuXHRcdGNvbnN0IG1faW5zdGFuY2UgPSB0aGlzLm1vZHVsZXNbbV9uYW1lXVxuXHRcdFxuXHRcdGlmICh0eXBlICYmIHJlc3BvbnNlICYmIG1faW5zdGFuY2UpIHtcblx0XHRcblx0XHRcdGlmICggdHlwZW9mIG1faW5zdGFuY2VbYHJlbmRlcl8ke3R5cGV9YF0gPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdFx0bV9pbnN0YW5jZVtgcmVuZGVyXyR7dHlwZX1gXShyZXNwb25zZSk7XG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdHRoaXMucmVuZGVyKHR5cGUsIHJlc3BvbnNlKTtcblx0XHRcdFxuXHRcdFx0ZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQodHlwZSwge1xuXHRcdFx0XHRkZXRhaWw6IHtcblx0XHRcdFx0XHRkYXRhOiByZXNwb25zZVxuXHRcdFx0XHR9XG5cdFx0XHR9KSlcblx0XHR9XG5cdH0sXG5cdFxuXHRfX2NvbW1vbkFjdGlvbjogZnVuY3Rpb24oaWQsIGFjdGlvbiwgZWxlbWVudCkge1xuXHRcdGNvbnN0IGNvbnRhaW5lciA9IGVsZW1lbnQuY2xvc2VzdChcImZvcm1cIikgfHwgZG9jdW1lbnQ7XG5cdFx0bGV0IGRhdGEgPSBDb0NyZWF0ZUFwaS5nZXRGb3JtRGF0YShpZCwgYWN0aW9uLCAgY29udGFpbmVyKTtcblx0XHRDb0NyZWF0ZUFwaS5zZW5kKGlkLCBhY3Rpb24sIGRhdGEpO1xuXHR9LFxuXHRcblx0XG5cdGdldEZvcm1EYXRhIDogZnVuY3Rpb24obV9uYW1lLCBhY3Rpb24sIGNvbnRhaW5lcil7XG5cdFx0Y29uc3QgbWFpbkF0dHIgPSBgZGF0YS0ke21fbmFtZX1gO1xuXHRcdGNvbnN0IHNlbGYgPSB0aGlzO1xuXHRcdGNvbnN0IGVsZW1lbnRzID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoYFske21haW5BdHRyfV1gKTtcblxuXHRcdGxldCBkYXRhID0ge31cblx0XHRlbGVtZW50cy5mb3JFYWNoKGVsZW1lbnQgPT4ge1xuXHRcdFx0bGV0IG5hbWUgPSBlbGVtZW50LmdldEF0dHJpYnV0ZShtYWluQXR0cik7XG5cdFx0XHRsZXQgYXJyYXlfbmFtZSA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKG1haW5BdHRyICsgXCJfYXJyYXlcIik7XG5cdFx0XHRsZXQgdmFsdWUgPSBzZWxmLl9fZ2V0RWxWYWx1ZShlbGVtZW50KTtcblx0XHRcdFxuXHRcdFx0aWYgKCFuYW1lKSByZXR1cm5cblxuXHRcdFx0aWYgKGFjdGlvbikge1xuXHRcdFx0XHRsZXQgcmUgPSBuZXcgUmVnRXhwKGBeJHthY3Rpb259LmAsICdpJyk7XG5cdFx0XHRcdGlmIChyZS50ZXN0KG5hbWUpKSB7XG5cdFx0XHRcdFx0bmFtZSA9IG5hbWUucmVwbGFjZShyZSwgXCJcIik7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdGlmIChhcnJheV9uYW1lKSB7XG5cdFx0XHRcdGlmICghZGF0YVtuYW1lXSkge1xuXHRcdFx0XHRcdGRhdGFbbmFtZV0gPSBbXTtcblx0XHRcdFx0fVxuXHRcdFx0XHRkYXRhW25hbWVdLnB1c2goc2VsZi5nZXRGb3JtRGF0YShtX25hbWUsIGFycmF5X25hbWUsIGVsZW1lbnQpKTtcblx0XHRcdH0gZWxzZSBpZiAodmFsdWUgIT0gbnVsbCkge1xuXHRcdFx0XHRkYXRhW25hbWVdID0gdmFsdWU7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0XG5cdFx0bGV0IGtleXMgPSBPYmplY3Qua2V5cyhkYXRhKVxuXHRcdFxuXHRcdGtleXMuZm9yRWFjaCgoaykgPT4ge1xuXHRcdFx0aWYgKGsuc3BsaXQoJy4nKS5sZW5ndGggPiAxKSB7XG5cdFx0XHRcdGxldCBuZXdEYXRhID0gc2VsZi5fX2NyZWF0ZU9iamVjdChkYXRhW2tdLCBrKTtcblx0XHRcdFx0ZGVsZXRlIGRhdGFba11cblx0XHRcdFx0XG5cdFx0XHRcdGRhdGEgPSBPYmplY3QuYXNzaWduKGRhdGEsIG5ld0RhdGEpO1xuXHRcdFx0fVxuXHRcdH0pXG5cdFx0cmV0dXJuIGRhdGE7XG5cdH0sXG5cdFxuXHRfX2dldEVsVmFsdWU6IGZ1bmN0aW9uKGVsZW1lbnQpIHtcblx0XHRsZXQgdmFsdWUgPSBudWxsO1xuXHRcdGlmICh0eXBlb2YgZWxlbWVudC52YWx1ZSAhPT0gXCJ1bmRlZmluZWRcIikge1xuXHRcdFx0c3dpdGNoIChlbGVtZW50LnR5cGUudG9Mb2NhbGVMb3dlckNhc2UoKSkge1xuXHRcdFx0XHRjYXNlICdjaGVja2JveCc6XG5cdFx0XHRcdFx0aWYgKGVsZW1lbnQuY2hlY2tlZCkge1xuXHRcdFx0XHRcdFx0dmFsdWUgPSBlbGVtZW50LnZhbHVlXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdHZhbHVlID0gZWxlbWVudC52YWx1ZTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0dmFsdWUgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgndmFsdWUnKTtcblx0XHR9XG5cdFx0XG5cdFx0cmV0dXJuIHZhbHVlO1xuXHR9LFxuXHRcblx0X19jcmVhdGVPYmplY3Q6IGZ1bmN0aW9uIChkYXRhLCBwYXRoKSB7XG5cdFx0aWYgKCFwYXRoKSByZXR1cm4gZGF0YTtcblx0XHRcblx0XHRsZXQga2V5cyA9IHBhdGguc3BsaXQoJy4nKVxuXHRcdGxldCBuZXdPYmplY3QgPSBkYXRhO1xuXG5cdFx0Zm9yICh2YXIgIGkgPSBrZXlzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG5cdFx0XHRuZXdPYmplY3QgPSB7W2tleXNbaV1dOiBuZXdPYmplY3R9XHRcdFx0XHRcblx0XHR9XG5cdFx0cmV0dXJuIG5ld09iamVjdDtcblx0fSxcblx0XG5cdHNlbmQgOiBmdW5jdGlvbihtb2R1bGUsIGFjdGlvbiwgZGF0YSl7IFxuXHRcdENvQ3JlYXRlU29ja2V0LnNlbmQobW9kdWxlLCB7dHlwZTogYWN0aW9uLCBkYXRhfSk7XG5cdH0sXG5cdFxuXHRyZW5kZXI6IGZ1bmN0aW9uKGFjdGlvbiwgZGF0YSkge1xuXHRcdENvQ3JlYXRlUmVuZGVyLnJlbmRlcihgW2RhdGEtdGVtcGxhdGVfaWQ9XCIke2FjdGlvbn1cIl1gLCBkYXRhKTtcblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBDb0NyZWF0QXBpOyJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/CoCreate-api.js\n");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	// module exports must be returned from runtime so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__("./src/CoCreate-api.js");
/******/ })()
.default;
});