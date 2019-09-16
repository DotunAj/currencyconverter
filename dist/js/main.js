/******/ (function(modules) { // webpackBootstrap
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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/idb/build/esm/chunk.js":
/*!*********************************************!*\
  !*** ./node_modules/idb/build/esm/chunk.js ***!
  \*********************************************/
/*! exports provided: a, b, c, d, e */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"a\", function() { return wrap; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"b\", function() { return addTraps; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"c\", function() { return instanceOfAny; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"d\", function() { return reverseTransformCache; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"e\", function() { return unwrap; });\nconst instanceOfAny = (object, constructors) => constructors.some(c => object instanceof c);\n\nlet idbProxyableTypes;\r\nlet cursorAdvanceMethods;\r\n// This is a function to prevent it throwing up in node environments.\r\nfunction getIdbProxyableTypes() {\r\n    return idbProxyableTypes ||\r\n        (idbProxyableTypes = [IDBDatabase, IDBObjectStore, IDBIndex, IDBCursor, IDBTransaction]);\r\n}\r\n// This is a function to prevent it throwing up in node environments.\r\nfunction getCursorAdvanceMethods() {\r\n    return cursorAdvanceMethods || (cursorAdvanceMethods = [\r\n        IDBCursor.prototype.advance,\r\n        IDBCursor.prototype.continue,\r\n        IDBCursor.prototype.continuePrimaryKey,\r\n    ]);\r\n}\r\nconst cursorRequestMap = new WeakMap();\r\nconst transactionDoneMap = new WeakMap();\r\nconst transactionStoreNamesMap = new WeakMap();\r\nconst transformCache = new WeakMap();\r\nconst reverseTransformCache = new WeakMap();\r\nfunction promisifyRequest(request) {\r\n    const promise = new Promise((resolve, reject) => {\r\n        const unlisten = () => {\r\n            request.removeEventListener('success', success);\r\n            request.removeEventListener('error', error);\r\n        };\r\n        const success = () => {\r\n            resolve(wrap(request.result));\r\n            unlisten();\r\n        };\r\n        const error = () => {\r\n            reject(request.error);\r\n            unlisten();\r\n        };\r\n        request.addEventListener('success', success);\r\n        request.addEventListener('error', error);\r\n    });\r\n    promise.then((value) => {\r\n        // Since cursoring reuses the IDBRequest (*sigh*), we cache it for later retrieval\r\n        // (see wrapFunction).\r\n        if (value instanceof IDBCursor) {\r\n            cursorRequestMap.set(value, request);\r\n        }\r\n        // Catching to avoid \"Uncaught Promise exceptions\"\r\n    }).catch(() => { });\r\n    // This mapping exists in reverseTransformCache but doesn't doesn't exist in transformCache. This\r\n    // is because we create many promises from a single IDBRequest.\r\n    reverseTransformCache.set(promise, request);\r\n    return promise;\r\n}\r\nfunction cacheDonePromiseForTransaction(tx) {\r\n    // Early bail if we've already created a done promise for this transaction.\r\n    if (transactionDoneMap.has(tx))\r\n        return;\r\n    const done = new Promise((resolve, reject) => {\r\n        const unlisten = () => {\r\n            tx.removeEventListener('complete', complete);\r\n            tx.removeEventListener('error', error);\r\n            tx.removeEventListener('abort', error);\r\n        };\r\n        const complete = () => {\r\n            resolve();\r\n            unlisten();\r\n        };\r\n        const error = () => {\r\n            reject(tx.error);\r\n            unlisten();\r\n        };\r\n        tx.addEventListener('complete', complete);\r\n        tx.addEventListener('error', error);\r\n        tx.addEventListener('abort', error);\r\n    });\r\n    // Cache it for later retrieval.\r\n    transactionDoneMap.set(tx, done);\r\n}\r\nlet idbProxyTraps = {\r\n    get(target, prop, receiver) {\r\n        if (target instanceof IDBTransaction) {\r\n            // Special handling for transaction.done.\r\n            if (prop === 'done')\r\n                return transactionDoneMap.get(target);\r\n            // Polyfill for objectStoreNames because of Edge.\r\n            if (prop === 'objectStoreNames') {\r\n                return target.objectStoreNames || transactionStoreNamesMap.get(target);\r\n            }\r\n            // Make tx.store return the only store in the transaction, or undefined if there are many.\r\n            if (prop === 'store') {\r\n                return receiver.objectStoreNames[1] ?\r\n                    undefined : receiver.objectStore(receiver.objectStoreNames[0]);\r\n            }\r\n        }\r\n        // Else transform whatever we get back.\r\n        return wrap(target[prop]);\r\n    },\r\n    has(target, prop) {\r\n        if (target instanceof IDBTransaction && (prop === 'done' || prop === 'store'))\r\n            return true;\r\n        return prop in target;\r\n    },\r\n};\r\nfunction addTraps(callback) {\r\n    idbProxyTraps = callback(idbProxyTraps);\r\n}\r\nfunction wrapFunction(func) {\r\n    // Due to expected object equality (which is enforced by the caching in `wrap`), we\r\n    // only create one new func per func.\r\n    // Edge doesn't support objectStoreNames (booo), so we polyfill it here.\r\n    if (func === IDBDatabase.prototype.transaction &&\r\n        !('objectStoreNames' in IDBTransaction.prototype)) {\r\n        return function (storeNames, ...args) {\r\n            const tx = func.call(unwrap(this), storeNames, ...args);\r\n            transactionStoreNamesMap.set(tx, storeNames.sort ? storeNames.sort() : [storeNames]);\r\n            return wrap(tx);\r\n        };\r\n    }\r\n    // Cursor methods are special, as the behaviour is a little more different to standard IDB. In\r\n    // IDB, you advance the cursor and wait for a new 'success' on the IDBRequest that gave you the\r\n    // cursor. It's kinda like a promise that can resolve with many values. That doesn't make sense\r\n    // with real promises, so each advance methods returns a new promise for the cursor object, or\r\n    // undefined if the end of the cursor has been reached.\r\n    if (getCursorAdvanceMethods().includes(func)) {\r\n        return function (...args) {\r\n            // Calling the original function with the proxy as 'this' causes ILLEGAL INVOCATION, so we use\r\n            // the original object.\r\n            func.apply(unwrap(this), args);\r\n            return wrap(cursorRequestMap.get(this));\r\n        };\r\n    }\r\n    return function (...args) {\r\n        // Calling the original function with the proxy as 'this' causes ILLEGAL INVOCATION, so we use\r\n        // the original object.\r\n        return wrap(func.apply(unwrap(this), args));\r\n    };\r\n}\r\nfunction transformCachableValue(value) {\r\n    if (typeof value === 'function')\r\n        return wrapFunction(value);\r\n    // This doesn't return, it just creates a 'done' promise for the transaction,\r\n    // which is later returned for transaction.done (see idbObjectHandler).\r\n    if (value instanceof IDBTransaction)\r\n        cacheDonePromiseForTransaction(value);\r\n    if (instanceOfAny(value, getIdbProxyableTypes()))\r\n        return new Proxy(value, idbProxyTraps);\r\n    // Return the same value back if we're not going to transform it.\r\n    return value;\r\n}\r\nfunction wrap(value) {\r\n    // We sometimes generate multiple promises from a single IDBRequest (eg when cursoring), because\r\n    // IDB is weird and a single IDBRequest can yield many responses, so these can't be cached.\r\n    if (value instanceof IDBRequest)\r\n        return promisifyRequest(value);\r\n    // If we've already transformed this value before, reuse the transformed value.\r\n    // This is faster, but it also provides object equality.\r\n    if (transformCache.has(value))\r\n        return transformCache.get(value);\r\n    const newValue = transformCachableValue(value);\r\n    // Not all types are transformed.\r\n    // These may be primitive types, so they can't be WeakMap keys.\r\n    if (newValue !== value) {\r\n        transformCache.set(value, newValue);\r\n        reverseTransformCache.set(newValue, value);\r\n    }\r\n    return newValue;\r\n}\r\nconst unwrap = (value) => reverseTransformCache.get(value);\n\n\n\n\n//# sourceURL=webpack:///./node_modules/idb/build/esm/chunk.js?");

/***/ }),

/***/ "./node_modules/idb/build/esm/index.js":
/*!*********************************************!*\
  !*** ./node_modules/idb/build/esm/index.js ***!
  \*********************************************/
/*! exports provided: unwrap, wrap, openDB, deleteDB */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"openDB\", function() { return openDB; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"deleteDB\", function() { return deleteDB; });\n/* harmony import */ var _chunk_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./chunk.js */ \"./node_modules/idb/build/esm/chunk.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"unwrap\", function() { return _chunk_js__WEBPACK_IMPORTED_MODULE_0__[\"e\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"wrap\", function() { return _chunk_js__WEBPACK_IMPORTED_MODULE_0__[\"a\"]; });\n\n\n\n\n/**\r\n * Open a database.\r\n *\r\n * @param name Name of the database.\r\n * @param version Schema version.\r\n * @param callbacks Additional callbacks.\r\n */\r\nfunction openDB(name, version, { blocked, upgrade, blocking } = {}) {\r\n    const request = indexedDB.open(name, version);\r\n    const openPromise = Object(_chunk_js__WEBPACK_IMPORTED_MODULE_0__[\"a\"])(request);\r\n    if (upgrade) {\r\n        request.addEventListener('upgradeneeded', (event) => {\r\n            upgrade(Object(_chunk_js__WEBPACK_IMPORTED_MODULE_0__[\"a\"])(request.result), event.oldVersion, event.newVersion, Object(_chunk_js__WEBPACK_IMPORTED_MODULE_0__[\"a\"])(request.transaction));\r\n        });\r\n    }\r\n    if (blocked)\r\n        request.addEventListener('blocked', () => blocked());\r\n    if (blocking)\r\n        openPromise.then(db => db.addEventListener('versionchange', blocking));\r\n    return openPromise;\r\n}\r\n/**\r\n * Delete a database.\r\n *\r\n * @param name Name of the database.\r\n */\r\nfunction deleteDB(name, { blocked } = {}) {\r\n    const request = indexedDB.deleteDatabase(name);\r\n    if (blocked)\r\n        request.addEventListener('blocked', () => blocked());\r\n    return Object(_chunk_js__WEBPACK_IMPORTED_MODULE_0__[\"a\"])(request).then(() => undefined);\r\n}\n\nconst readMethods = ['get', 'getKey', 'getAll', 'getAllKeys', 'count'];\r\nconst writeMethods = ['put', 'add', 'delete', 'clear'];\r\nconst cachedMethods = new Map();\r\nfunction getMethod(target, prop) {\r\n    if (!(target instanceof IDBDatabase &&\r\n        !(prop in target) &&\r\n        typeof prop === 'string'))\r\n        return;\r\n    if (cachedMethods.get(prop))\r\n        return cachedMethods.get(prop);\r\n    const targetFuncName = prop.replace(/FromIndex$/, '');\r\n    const useIndex = prop !== targetFuncName;\r\n    const isWrite = writeMethods.includes(targetFuncName);\r\n    if (\r\n    // Bail if the target doesn't exist on the target. Eg, getAll isn't in Edge.\r\n    !(targetFuncName in (useIndex ? IDBIndex : IDBObjectStore).prototype) ||\r\n        !(isWrite || readMethods.includes(targetFuncName)))\r\n        return;\r\n    const method = async function (storeName, ...args) {\r\n        // isWrite ? 'readwrite' : undefined gzipps better, but fails in Edge :(\r\n        const tx = this.transaction(storeName, isWrite ? 'readwrite' : 'readonly');\r\n        let target = tx.store;\r\n        if (useIndex)\r\n            target = target.index(args.shift());\r\n        const returnVal = target[targetFuncName](...args);\r\n        if (isWrite)\r\n            await tx.done;\r\n        return returnVal;\r\n    };\r\n    cachedMethods.set(prop, method);\r\n    return method;\r\n}\r\nObject(_chunk_js__WEBPACK_IMPORTED_MODULE_0__[\"b\"])(oldTraps => ({\r\n    get: (target, prop, receiver) => getMethod(target, prop) || oldTraps.get(target, prop, receiver),\r\n    has: (target, prop) => !!getMethod(target, prop) || oldTraps.has(target, prop),\r\n}));\n\n\n\n\n//# sourceURL=webpack:///./node_modules/idb/build/esm/index.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var idb__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! idb */ \"./node_modules/idb/build/esm/index.js\");\n\r\nconst baseCurrency = document.querySelector(\"#base-currency\");\r\nconst toCurrency = document.querySelector(\"#to-currency\");\r\nconst baseAmountInput = document.querySelector(\"#from-amount\");\r\nconst toAmountInput = document.querySelector(\"#to-amount\");\r\nconst convertButton = document.querySelector(\".convert\");\r\nconst toast = document.querySelector(\".toast-msg\");\r\nconst loader = document.querySelector(\".loader\");\r\nlet showingConversion = false;\r\n\r\nif (navigator.serviceWorker) {\r\n  window.addEventListener(\"load\", () => {\r\n    navigator.serviceWorker\r\n      .register(\"./sw.js\")\r\n      .then(reg => {\r\n        if (!navigator.serviceWorker.controller) return;\r\n\r\n        if (reg.waiting) {\r\n          updateServiceWorker(reg.waiting);\r\n          return;\r\n        }\r\n\r\n        if (reg.installing) {\r\n          trackSwInstalling(reg.installing);\r\n          return;\r\n        }\r\n\r\n        reg.addEventListener(\"updatefound\", () => {\r\n          trackSwInstalling(reg.installing);\r\n        });\r\n      })\r\n      .catch(err => {\r\n        console.log(err);\r\n      });\r\n  });\r\n}\r\n\r\nlet refreshing = false;\r\nnavigator.serviceWorker.addEventListener(\"controllerchange\", () => {\r\n  if (refreshing) return;\r\n  window.location.reload();\r\n  refreshing = true;\r\n});\r\n\r\n//Function to track service Worker installing process\r\nfunction trackSwInstalling(worker) {\r\n  worker.addEventListener(\"statechange\", () => {\r\n    if (worker.state === \"installed\") {\r\n      updateServiceWorker(worker);\r\n    }\r\n  });\r\n}\r\n\r\n//Function that automatically updates worker when a new version ships\r\nfunction updateServiceWorker(worker) {\r\n  worker.postMessage({ action: \"skipWaiting\" });\r\n}\r\n\r\n/* const dbPromise = idb.open(\"c-currency\", 1, upgradeDb => {\r\n  const keyVal = upgradeDb.createObjectStore(\"currencies\", { keyPath: \"id\" });\r\n  const rates = upgradeDb.createObjectStore(\"rates\");\r\n}); */\r\n\r\nconst dbPromise = Object(idb__WEBPACK_IMPORTED_MODULE_0__[\"openDB\"])(\"c-currency\", 1, {\r\n  upgrade(db) {\r\n    // Create a store of objects\r\n    const store = db.createObjectStore(\"currencies\", {\r\n      // The 'id' property of the object will be the key.\r\n      keyPath: \"id\"\r\n    });\r\n    const rates = db.createObjectStore(\"rates\");\r\n  }\r\n});\r\n\r\nfetch(\r\n  \"https://free.currencyconverterapi.com/api/v5/currencies?&apiKey=5c042a37b70558e478bc\"\r\n)\r\n  .then(res => {\r\n    return res.json();\r\n  })\r\n  .then(data => {\r\n    //generate and display html and\r\n    const currencies = Object.values(data.results);\r\n    const html = generateHtml(currencies);\r\n    displayHtml(html);\r\n    //populate the idb database with currency data\r\n    dbPromise.then(db => {\r\n      if (!db) return;\r\n      const tx = db.transaction(\"currencies\", \"readwrite\");\r\n      currencies.forEach(currency => {\r\n        tx.store.put(currency);\r\n      });\r\n    });\r\n  })\r\n  .catch(() => {\r\n    //if everything goes south currency data will be gotten from idb\r\n    dbPromise.then(db => {\r\n      if (!db) return;\r\n      const tx = db.transaction(\"currencies\");\r\n      tx.store.getAll().then(currencies => {\r\n        if (currencies.length === 0) {\r\n          //Implement UX for when there is no currency data in the idb\r\n          toast.classList.add(\"active\");\r\n          return;\r\n        }\r\n        //Only run if there is data in the db\r\n        html = generateHtml(currencies);\r\n        displayHtml(html);\r\n      });\r\n    });\r\n  });\r\n\r\n//function to generate the html for the select option\r\nfunction generateHtml(stuffs) {\r\n  return stuffs\r\n    .map(stuff => {\r\n      return `\r\n        <option value=\"${stuff.id}\">${stuff.id} - ${stuff.currencyName}</option>\r\n        `;\r\n    })\r\n    .sort()\r\n    .join(\" \");\r\n}\r\n\r\n//function to add the html of the select option to the DOM\r\nfunction displayHtml(html) {\r\n  baseCurrency.innerHTML = html;\r\n  toCurrency.innerHTML = html;\r\n  baseCurrency.querySelector('[value=\"USD\"]').selected = true;\r\n  toCurrency.querySelector('[value=\"NGN\"]').selected = true;\r\n}\r\n\r\n//function that does the major convertion from one currency to another\r\nfunction convertCalculation(rate, amount) {\r\n  const rateArr = Object.values(rate);\r\n  return rateArr[0].val * amount;\r\n}\r\n\r\n//functon that handles the click event of the convertion button\r\nfunction handleClick() {\r\n  startLoader();\r\n  let from = baseCurrency.value;\r\n  let to = toCurrency.value;\r\n  const fromAmount = baseAmountInput.value;\r\n  let query = `${from}_${to}`;\r\n  let convertUrl = new URL(\r\n    `https://free.currencyconverterapi.com/api/v5/convert?q=${from}_${to}&compact=ultra?&apiKey=5c042a37b70558e478bc`\r\n  );\r\n  toAmountInput.value = \"\";\r\n  //Fetch the rate\r\n  //Covert from one currency to another with fetched rate\r\n  //Stored rate in idb for offline usage\r\n  //TODO: Make the app first check the idb before fetching and look for a way to give the idb age\r\n  fetch(convertUrl)\r\n    .then(res => {\r\n      return res.json();\r\n    })\r\n    .then(data => {\r\n      // Loader for the converting action\r\n      stopLoader();\r\n      toAmountInput.value = `${convertCalculation(\r\n        data.results,\r\n        fromAmount\r\n      )}${to}`;\r\n      dbPromise.then(db => {\r\n        if (!db) return;\r\n        let tx = db.transaction(\"rates\", \"readwrite\");\r\n        tx.store.put(data, `${from}_${to}`);\r\n      });\r\n    })\r\n    .catch(err => {\r\n      //When offline get the rate from idb\r\n      dbPromise.then(db => {\r\n        if (!db) return;\r\n        let tx = db.transaction(\"rates\");\r\n        tx.store\r\n          .openCursor()\r\n          .then(function doAgain(cursor) {\r\n            if (!cursor) return;\r\n            if (cursor.key === query) {\r\n              toAmountInput.value = `${convertCalculation(\r\n                cursor.value.results,\r\n                fromAmount\r\n              )}${to}`;\r\n              showingConversion = true;\r\n              return;\r\n            }\r\n            return cursor.continue().then(doAgain);\r\n          })\r\n          .then(() => {\r\n            //UX for when the rates are not found in the idb\r\n            if (!showingConversion) {\r\n              console.log(\"yeah\");\r\n              toastHandler();\r\n            }\r\n            stopLoader();\r\n            showingConversion = false;\r\n          });\r\n      });\r\n    });\r\n}\r\n\r\n//Function to slide in toast msg\r\nfunction toastHandler() {\r\n  toast.classList.add(\"active\");\r\n  setTimeout(() => {\r\n    toast.classList.remove(\"active\");\r\n  }, 3000);\r\n}\r\n\r\nfunction startLoader() {\r\n  loader.classList.remove(\"display-none\");\r\n  convertButton.classList.add(\"display-none\");\r\n}\r\n\r\nfunction stopLoader() {\r\n  loader.classList.add(\"display-none\");\r\n  convertButton.classList.remove(\"display-none\");\r\n}\r\n\r\nconvertButton.addEventListener(\"click\", handleClick);\r\n\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ })

/******/ });