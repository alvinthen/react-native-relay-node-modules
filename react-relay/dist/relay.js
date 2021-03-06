/**
 * Relay v0.6.0
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("React"), require("ReactDOM"));
	else if(typeof define === 'function' && define.amd)
		define(["React", "ReactDOM"], factory);
	else if(typeof exports === 'object')
		exports["Relay"] = factory(require("React"), require("ReactDOM"));
	else
		root["Relay"] = factory(root["React"], root["ReactDOM"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_33__, __WEBPACK_EXTERNAL_MODULE_227__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule Relay
	 * @typechecks
	 * 
	 */

	'use strict';

	var _extends = __webpack_require__(8)['default'];

	var RelayDefaultNetworkLayer = __webpack_require__(118);
	var RelayPublic = __webpack_require__(130);

	// By default, assume that GraphQL is served at `/graphql` on the same domain.
	// $FlowFixMe(>=0.16.0)
	RelayPublic.injectNetworkLayer(new RelayDefaultNetworkLayer('/graphql'));

	module.exports = _extends({}, RelayPublic, {
	  // Expose the default network layer to allow convenient re-configuration.
	  DefaultNetworkLayer: RelayDefaultNetworkLayer
	});

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";

	exports["default"] = function (instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	};

	exports.__esModule = true;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 */

	'use strict';

	/**
	 * Use invariant() to assert state which your program assumes to be true.
	 *
	 * Provide sprintf-style format (only %s is supported) and arguments
	 * to provide information about what broke and what you were
	 * expecting.
	 *
	 * The invariant message will be stripped in production, but the invariant
	 * will remain to ensure logic does not differ in production.
	 */

	function invariant(condition, format, a, b, c, d, e, f) {
	  if (true) {
	    if (format === undefined) {
	      throw new Error('invariant requires an error message argument');
	    }
	  }

	  if (!condition) {
	    var error;
	    if (format === undefined) {
	      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
	    } else {
	      var args = [a, b, c, d, e, f];
	      var argIndex = 0;
	      error = new Error(format.replace(/%s/g, function () {
	        return args[argIndex++];
	      }));
	      error.name = 'Invariant Violation';
	    }

	    error.framesToPop = 1; // we don't care about invariant's own frame
	    throw error;
	  }
	}

	module.exports = invariant;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule RelayQuery
	 * 
	 * @typechecks
	 */

	'use strict';

	var _classCallCheck = __webpack_require__(1)['default'];

	var _inherits = __webpack_require__(5)['default'];

	var _extends = __webpack_require__(8)['default'];

	var _Object$freeze = __webpack_require__(39)['default'];

	var QueryBuilder = __webpack_require__(17);

	var RelayConnectionInterface = __webpack_require__(7);
	var RelayFragmentReference = __webpack_require__(34);

	var RelayMetaRoute = __webpack_require__(21);
	var RelayProfiler = __webpack_require__(4);
	var RelayRouteFragment = __webpack_require__(79);

	var areEqual = __webpack_require__(106);
	var callsFromGraphQL = __webpack_require__(55);
	var callsToGraphQL = __webpack_require__(80);
	var generateRQLFieldAlias = __webpack_require__(152);
	var invariant = __webpack_require__(2);
	var serializeRelayQueryCall = __webpack_require__(38);
	var shallowEqual = __webpack_require__(72);
	var stableStringify = __webpack_require__(87);

	// TODO: replace once #6525923 is resolved

	// conditional field calls/values
	var IF = 'if';
	var UNLESS = 'unless';
	var TRUE = 'true';
	var FALSE = 'false';
	var SKIP = 'skip';
	var INCLUDE = 'include';

	var QUERY_ID_PREFIX = 'q';
	var REF_PARAM_PREFIX = 'ref_';

	var _nextQueryID = 0;

	var DEFAULT_FRAGMENT_METADATA = {
	  isDeferred: false,
	  isContainerFragment: false
	};
	var EMPTY_DIRECTIVES = [];
	var EMPTY_CALLS = [];

	if (true) {
	  _Object$freeze(EMPTY_CALLS);
	  _Object$freeze(EMPTY_DIRECTIVES);
	}

	/**
	 * @internal
	 *
	 * Queries in Relay are represented as trees. Possible nodes include the root,
	 * fields, and fragments. Fields can have children, or they can be leaf nodes.
	 * Root and fragment nodes must always have children.
	 *
	 * `RelayQueryNode` provides access to information such as the field name,
	 * generated alias, sub-fields, and call values.
	 *
	 * Nodes are immutable; query modification is supported via `clone`:
	 *
	 * ```
	 * var next = prev.clone(prev.getChildren().filter(f => ...));
	 * ```
	 *
	 * Note: Mediating access to actual query nodes is necessary so that we can
	 * replace the current mutable GraphQL nodes with an immutable query
	 * representation. This class *must not* mutate the underlying `concreteNode`.
	 * Instead, use an instance variable (see `clone()`).
	 *
	 * TODO (#6937314): RelayQueryNode support for toJSON/fromJSON
	 */

	var RelayQueryNode = (function () {
	  RelayQueryNode.create = function create(concreteNode, route, variables) {
	    var node = createNode(concreteNode, route, variables);
	    !(node instanceof RelayQueryNode) ?  true ? invariant(false, 'RelayQueryNode.create(): ' + 'Expected a GraphQL fragment, mutation, or query.') : invariant(false) : undefined;
	    return node;
	  };

	  /**
	   * @private
	   *
	   * Base class for all node types, must not be directly instantiated.
	   */

	  function RelayQueryNode(concreteNode, route, variables) {
	    _classCallCheck(this, RelayQueryNode);

	    !(this.constructor.name !== 'RelayQueryNode') ?  true ? invariant(false, 'RelayQueryNode: Abstract class cannot be instantiated.') : invariant(false) : undefined;
	    this.__concreteNode__ = concreteNode;
	    this.__route__ = route;
	    this.__variables__ = variables;

	    // lazily computed properties
	    this.__calls__ = null;
	    this.__children__ = null;
	    this.__fieldMap__ = null;
	    this.__hasDeferredDescendant__ = null;
	    this.__hasValidatedConnectionCalls__ = null;
	    this.__serializationKey__ = null;
	    this.__storageKey__ = null;
	  }

	  /**
	   * @internal
	   *
	   * Wraps access to query root nodes.
	   */

	  RelayQueryNode.prototype.isGenerated = function isGenerated() {
	    return false;
	  };

	  RelayQueryNode.prototype.isRefQueryDependency = function isRefQueryDependency() {
	    return false;
	  };

	  RelayQueryNode.prototype.isScalar = function isScalar() {
	    return false;
	  };

	  RelayQueryNode.prototype.clone = function clone(children) {
	    if (this.isScalar()) {
	      // Compact new children *after* this check, for consistency.
	      !(children.length === 0) ?  true ? invariant(false, 'RelayQueryNode: Cannot add children to scalar field `%s`.', this instanceof RelayQueryField ? this.getSchemaName() : null) : invariant(false) : undefined;
	      return this;
	    }

	    var prevChildren = this.getChildren();
	    var nextChildren = cloneChildren(prevChildren, children);

	    if (!nextChildren.length) {
	      return null;
	    } else if (nextChildren === prevChildren) {
	      return this;
	    }

	    var clone = RelayQueryNode.create(this.__concreteNode__, this.__route__, this.__variables__);
	    clone.__children__ = nextChildren;
	    clone.__calls__ = this.__calls__;
	    clone.__serializationKey__ = this.__serializationKey__;
	    clone.__storageKey__ = this.__storageKey__;

	    return clone;
	  };

	  RelayQueryNode.prototype.getChildren = function getChildren() {
	    var _this = this;

	    var children = this.__children__;
	    if (!children) {
	      (function () {
	        var nextChildren = [];
	        var concreteChildren = _this.__concreteNode__.children;
	        if (concreteChildren) {
	          concreteChildren.forEach(function (concreteChild) {
	            if (concreteChild == null) {
	              return;
	            }
	            var node = createNode(concreteChild, _this.__route__, _this.__variables__);
	            if (node && node.isIncluded()) {
	              nextChildren.push(node);
	            }
	          });
	        }
	        _this.__children__ = nextChildren;
	        children = nextChildren;
	      })();
	    }
	    return children;
	  };

	  RelayQueryNode.prototype.isIncluded = function isIncluded() {
	    // Bail out early since most nodes won't have directives
	    if (!this.__concreteNode__.directives) {
	      return true;
	    }
	    return this.getDirectives().every(function (directive) {
	      if (directive.name === SKIP) {
	        return !directive.arguments.some(function (arg) {
	          return arg.name === IF && !!arg.value;
	        });
	      } else if (directive.name === INCLUDE) {
	        return !directive.arguments.some(function (arg) {
	          return arg.name === IF && !arg.value;
	        });
	      }
	      return true;
	    });
	  };

	  RelayQueryNode.prototype.getDirectives = function getDirectives() {
	    var _this2 = this;

	    var concreteDirectives = this.__concreteNode__.directives;
	    if (concreteDirectives) {
	      return this.__concreteNode__.directives.map(function (directive) {
	        return {
	          name: directive.name,
	          arguments: callsFromGraphQL(directive.arguments, _this2.__variables__)
	        };
	      });
	    }
	    return EMPTY_DIRECTIVES;
	  };

	  RelayQueryNode.prototype.getField = function getField(field) {
	    return this.getFieldByStorageKey(field.getStorageKey());
	  };

	  RelayQueryNode.prototype.getFieldByStorageKey = function getFieldByStorageKey(storageKey) {
	    var fieldMap = this.__fieldMap__;
	    if (!fieldMap) {
	      fieldMap = {};
	      var child;
	      var children = this.getChildren();
	      for (var ii = 0; ii < children.length; ii++) {
	        child = children[ii];
	        if (child instanceof RelayQueryField) {
	          fieldMap[child.getStorageKey()] = child;
	        }
	      }
	      this.__fieldMap__ = fieldMap;
	    }
	    return fieldMap[storageKey];
	  };

	  RelayQueryNode.prototype.getType = function getType() {
	    return this.__concreteNode__.type;
	  };

	  RelayQueryNode.prototype.getRoute = function getRoute() {
	    return this.__route__;
	  };

	  RelayQueryNode.prototype.getVariables = function getVariables() {
	    return this.__variables__;
	  };

	  RelayQueryNode.prototype.hasDeferredDescendant = function hasDeferredDescendant() {
	    var hasDeferredDescendant = this.__hasDeferredDescendant__;
	    if (hasDeferredDescendant == null) {
	      hasDeferredDescendant = !this.isScalar() && this.getChildren().some(function (child) {
	        return child.hasDeferredDescendant();
	      });
	      this.__hasDeferredDescendant__ = hasDeferredDescendant;
	    }
	    return hasDeferredDescendant;
	  };

	  RelayQueryNode.prototype.isAbstract = function isAbstract() {
	    throw new Error('RelayQueryNode: Abstract function cannot be called.');
	  };

	  RelayQueryNode.prototype.isRequisite = function isRequisite() {
	    return false;
	  };

	  /**
	   * Determine if `this` and `that` are deeply equal.
	   */

	  RelayQueryNode.prototype.equals = function equals(that) {
	    var thisChildren = this.getChildren();
	    var thatChildren = that.getChildren();

	    return thisChildren === thatChildren || thisChildren.length === thatChildren.length && thisChildren.every(function (c, ii) {
	      return c.equals(thatChildren[ii]);
	    });
	  };

	  /**
	   * Performs a fast comparison of whether `this` and `that` represent identical
	   * query nodes. Returns true only if the concrete nodes, routes, and variables
	   * are all the same.
	   *
	   * Note that it is possible that this method can return false in cases where
	   * `equals` would return true. This can happen when the concrete nodes are
	   * different but structurally identical, or when the route/variables are
	   * different but do not have an effect on the structure of the query.
	   */

	  RelayQueryNode.prototype.isEquivalent = function isEquivalent(that) {
	    return this.__concreteNode__ === that.__concreteNode__ && this.__route__ === that.__route__ && shallowEqual(this.__variables__, that.__variables__);
	  };

	  RelayQueryNode.prototype.createNode = function createNode(concreteNode) {
	    return RelayQueryNode.create(concreteNode, this.__route__, this.__variables__);
	  };

	  RelayQueryNode.prototype.getConcreteQueryNode = function getConcreteQueryNode() {
	    return this.__concreteNode__;
	  };

	  return RelayQueryNode;
	})();

	var RelayQueryRoot = (function (_RelayQueryNode) {
	  _inherits(RelayQueryRoot, _RelayQueryNode);

	  /**
	   * Helper to construct a new root query with the given attributes and 'empty'
	   * route/variables.
	   */

	  RelayQueryRoot.build = function build(name, fieldName, value, children, metadata, type) {
	    var nextChildren = children ? children.filter(function (child) {
	      return !!child;
	    }) : [];
	    var batchCallVariable = QueryBuilder.getBatchCallVariable(value);
	    var identifyingArgValue = undefined;
	    if (batchCallVariable) {
	      identifyingArgValue = batchCallVariable;
	    } else if (Array.isArray(value)) {
	      identifyingArgValue = value.map(QueryBuilder.createCallValue);
	    } else if (value) {
	      identifyingArgValue = QueryBuilder.createCallValue(value);
	    }
	    var concreteRoot = QueryBuilder.createQuery({
	      fieldName: fieldName,
	      identifyingArgValue: identifyingArgValue,
	      metadata: metadata,
	      name: name,
	      type: type
	    });
	    var root = new RelayQueryRoot(concreteRoot, RelayMetaRoute.get('$RelayQuery'), {});
	    root.__children__ = nextChildren;
	    return root;
	  };

	  RelayQueryRoot.create = function create(concreteNode, route, variables) {
	    var query = QueryBuilder.getQuery(concreteNode);
	    !query ?  true ? invariant(false, 'RelayQueryRoot.create(): Expected a GraphQL `query { ... }`, got: %s', concreteNode) : invariant(false) : undefined;
	    return new RelayQueryRoot(query, route, variables);
	  };

	  function RelayQueryRoot(concreteNode, route, variables) {
	    _classCallCheck(this, RelayQueryRoot);

	    _RelayQueryNode.call(this, concreteNode, route, variables);
	    this.__batchCall__ = undefined;
	    this.__id__ = undefined;
	    this.__identifyingArg__ = undefined;
	    this.__storageKey__ = undefined;

	    // Ensure IDs are generated in the order that queries are created
	    this.getID();
	  }

	  /**
	   * @internal
	   *
	   * Abstract base class for mutations and subscriptions.
	   */

	  RelayQueryRoot.prototype.getName = function getName() {
	    var name = this.__concreteNode__.name;
	    if (!name) {
	      name = this.getID();
	      this.__concreteNode__.name = name;
	    }
	    return name;
	  };

	  RelayQueryRoot.prototype.getID = function getID() {
	    var id = this.__id__;
	    if (id == null) {
	      id = QUERY_ID_PREFIX + _nextQueryID++;
	      this.__id__ = id;
	    }
	    return id;
	  };

	  RelayQueryRoot.prototype.getBatchCall = function getBatchCall() {
	    var batchCall = this.__batchCall__;
	    if (batchCall === undefined) {
	      var concreteCalls = this.__concreteNode__.calls;
	      if (concreteCalls) {
	        var callArg = concreteCalls[0] && concreteCalls[0].value;
	        if (callArg != null && !Array.isArray(callArg) && callArg.kind === 'BatchCallVariable') {
	          batchCall = {
	            refParamName: REF_PARAM_PREFIX + callArg.sourceQueryID,
	            sourceQueryID: callArg.sourceQueryID,
	            sourceQueryPath: callArg.jsonPath
	          };
	        }
	      }
	      batchCall = batchCall || null;
	      this.__batchCall__ = batchCall;
	    }
	    return batchCall;
	  };

	  RelayQueryRoot.prototype.getCallsWithValues = function getCallsWithValues() {
	    var calls = this.__calls__;
	    if (!calls) {
	      var concreteCalls = this.__concreteNode__.calls;
	      if (concreteCalls) {
	        calls = callsFromGraphQL(concreteCalls, this.__variables__);
	      } else {
	        calls = EMPTY_CALLS;
	      }
	      this.__calls__ = calls;
	    }
	    return calls;
	  };

	  RelayQueryRoot.prototype.getFieldName = function getFieldName() {
	    return this.__concreteNode__.fieldName;
	  };

	  RelayQueryRoot.prototype.getIdentifyingArg = function getIdentifyingArg() {
	    var _this3 = this;

	    var identifyingArg = this.__identifyingArg__;
	    if (!identifyingArg) {
	      (function () {
	        var metadata = _this3.__concreteNode__.metadata;
	        var identifyingArgName = metadata.identifyingArgName;
	        if (identifyingArgName != null) {
	          identifyingArg = _this3.getCallsWithValues().find(function (c) {
	            return c.name === identifyingArgName;
	          });
	          if (identifyingArg && metadata.identifyingArgType != null) {
	            identifyingArg.type = metadata.identifyingArgType;
	          }
	          _this3.__identifyingArg__ = identifyingArg;
	        }
	      })();
	    }
	    return identifyingArg;
	  };

	  RelayQueryRoot.prototype.getStorageKey = function getStorageKey() {
	    var _this4 = this;

	    var storageKey = this.__storageKey__;
	    if (!storageKey) {
	      (function () {
	        var args = _this4.getCallsWithValues();
	        var identifyingArg = _this4.getIdentifyingArg();
	        if (identifyingArg) {
	          args = args.filter(function (arg) {
	            return arg !== identifyingArg;
	          });
	        }
	        var field = RelayQueryField.build({
	          fieldName: _this4.getFieldName(),
	          calls: args,
	          type: _this4.getType()
	        });
	        storageKey = field.getStorageKey();
	        _this4.__storageKey__ = storageKey;
	      })();
	    }
	    return storageKey;
	  };

	  RelayQueryRoot.prototype.hasDeferredDescendant = function hasDeferredDescendant() {
	    return this.isDeferred() || _RelayQueryNode.prototype.hasDeferredDescendant.call(this);
	  };

	  RelayQueryRoot.prototype.isAbstract = function isAbstract() {
	    return !!this.__concreteNode__.metadata.isAbstract;
	  };

	  RelayQueryRoot.prototype.isDeferred = function isDeferred() {
	    return !!this.__concreteNode__.isDeferred;
	  };

	  RelayQueryRoot.prototype.isPlural = function isPlural() {
	    return !!this.__concreteNode__.metadata.isPlural;
	  };

	  RelayQueryRoot.prototype.equals = function equals(that) {
	    if (this === that) {
	      return true;
	    }
	    if (!(that instanceof RelayQueryRoot)) {
	      return false;
	    }
	    if (!areEqual(this.getBatchCall(), that.getBatchCall())) {
	      return false;
	    }
	    if (this.getFieldName() !== that.getFieldName() || !areEqual(this.getCallsWithValues(), that.getCallsWithValues())) {
	      return false;
	    }
	    return _RelayQueryNode.prototype.equals.call(this, that);
	  };

	  return RelayQueryRoot;
	})(RelayQueryNode);

	var RelayQueryOperation = (function (_RelayQueryNode2) {
	  _inherits(RelayQueryOperation, _RelayQueryNode2);

	  function RelayQueryOperation(concreteNode, route, variables) {
	    _classCallCheck(this, RelayQueryOperation);

	    _RelayQueryNode2.call(this, concreteNode, route, variables);
	    !(this.constructor.name !== 'RelayQueryOperation') ?  true ? invariant(false, 'RelayQueryOperation: Abstract class cannot be instantiated.') : invariant(false) : undefined;
	  }

	  /**
	   * @internal
	   *
	   * Represents a GraphQL mutation.
	   */

	  RelayQueryOperation.prototype.getName = function getName() {
	    return this.__concreteNode__.name;
	  };

	  RelayQueryOperation.prototype.getResponseType = function getResponseType() {
	    return this.__concreteNode__.responseType;
	  };

	  RelayQueryOperation.prototype.getType = function getType() {
	    return this.getResponseType();
	  };

	  RelayQueryOperation.prototype.getInputType = function getInputType() {
	    var inputType = this.__concreteNode__.metadata.inputType;
	    !inputType ?  true ? invariant(false, 'RelayQuery: Expected operation `%s` to be annotated with the type of ' + 'its argument. Either the babel transform was configured incorrectly, ' + 'or the schema failed to define an argument for this mutation.', this.getCall().name) : invariant(false) : undefined;
	    return inputType;
	  };

	  RelayQueryOperation.prototype.getCall = function getCall() {
	    var calls = this.__calls__;
	    if (!calls) {
	      var concreteCalls = this.__concreteNode__.calls;
	      if (concreteCalls) {
	        calls = callsFromGraphQL(concreteCalls, this.__variables__);
	      } else {
	        calls = EMPTY_CALLS;
	      }
	      this.__calls__ = calls;
	    }
	    return calls[0];
	  };

	  RelayQueryOperation.prototype.getCallVariableName = function getCallVariableName() {
	    if (!this.__callVariableName__) {
	      var concreteCalls = this.__concreteNode__.calls;
	      var callVariable = concreteCalls && QueryBuilder.getCallVariable(concreteCalls[0].value);
	      !callVariable ?  true ? invariant(false, 'RelayQuery: Expected mutation to have a single argument.') : invariant(false) : undefined;
	      this.__callVariableName__ = callVariable.callVariableName;
	    }
	    return this.__callVariableName__;
	  };

	  /**
	   * Mutations and subscriptions must have a concrete type due to the need for
	   * requisite top-level fields.
	   */

	  RelayQueryOperation.prototype.isAbstract = function isAbstract() {
	    return false;
	  };

	  return RelayQueryOperation;
	})(RelayQueryNode);

	var RelayQueryMutation = (function (_RelayQueryOperation) {
	  _inherits(RelayQueryMutation, _RelayQueryOperation);

	  function RelayQueryMutation() {
	    _classCallCheck(this, RelayQueryMutation);

	    _RelayQueryOperation.apply(this, arguments);
	  }

	  /**
	   * @internal
	   *
	   * Represents a GraphQL subscription.
	   */

	  /**
	   * Helper to construct a new mutation with the given attributes and 'empty'
	   * route/variables.
	   */

	  RelayQueryMutation.build = function build(name, responseType, callName, callValue, children, metadata) {
	    var nextChildren = children ? children.filter(function (child) {
	      return !!child;
	    }) : [];
	    var concreteMutation = QueryBuilder.createMutation({
	      calls: [QueryBuilder.createCall(callName, QueryBuilder.createCallVariable('input'))],
	      metadata: metadata,
	      name: name,
	      responseType: responseType
	    });
	    var mutation = new RelayQueryMutation(concreteMutation, RelayMetaRoute.get('$RelayQuery'), { input: callValue || '' });
	    mutation.__children__ = nextChildren;
	    return mutation;
	  };

	  RelayQueryMutation.prototype.equals = function equals(that) {
	    if (this === that) {
	      return true;
	    }
	    if (!(that instanceof RelayQueryMutation)) {
	      return false;
	    }
	    if (!areEqual(this.getResponseType(), that.getResponseType())) {
	      return false;
	    }
	    if (!areEqual(this.getCall(), that.getCall())) {
	      return false;
	    }
	    return _RelayQueryOperation.prototype.equals.call(this, that);
	  };

	  return RelayQueryMutation;
	})(RelayQueryOperation);

	var RelayQuerySubscription = (function (_RelayQueryOperation2) {
	  _inherits(RelayQuerySubscription, _RelayQueryOperation2);

	  function RelayQuerySubscription() {
	    _classCallCheck(this, RelayQuerySubscription);

	    _RelayQueryOperation2.apply(this, arguments);
	  }

	  /**
	   * @internal
	   *
	   * Wraps access to query fragments.
	   */

	  RelayQuerySubscription.create = function create(concreteNode, route, variables) {
	    var subscription = QueryBuilder.getSubscription(concreteNode);
	    !subscription ?  true ? invariant(false, 'RelayQuerySubscription.create(): ' + 'Expected a GraphQL `subscription { ... }`, got: %s', concreteNode) : invariant(false) : undefined;
	    return new RelayQuerySubscription(concreteNode, route, variables);
	  };

	  RelayQuerySubscription.prototype.getPublishedPayloadType = function getPublishedPayloadType() {
	    return this.getResponseType();
	  };

	  RelayQuerySubscription.prototype.equals = function equals(that) {
	    if (this === that) {
	      return true;
	    }
	    if (!(that instanceof RelayQuerySubscription)) {
	      return false;
	    }
	    if (!areEqual(this.getPublishedPayloadType(), that.getPublishedPayloadType())) {
	      return false;
	    }
	    if (!areEqual(this.getCall(), that.getCall())) {
	      return false;
	    }
	    return _RelayQueryOperation2.prototype.equals.call(this, that);
	  };

	  return RelayQuerySubscription;
	})(RelayQueryOperation);

	var RelayQueryFragment = (function (_RelayQueryNode3) {
	  _inherits(RelayQueryFragment, _RelayQueryNode3);

	  /**
	   * Helper to construct a new fragment with the given attributes and 'empty'
	   * route/variables.
	   */

	  RelayQueryFragment.build = function build(name, type, children, metadata) {
	    var nextChildren = children ? children.filter(function (child) {
	      return !!child;
	    }) : [];
	    var concreteFragment = QueryBuilder.createFragment({
	      name: name,
	      type: type,
	      metadata: metadata
	    });
	    var fragment = new RelayQueryFragment(concreteFragment, RelayMetaRoute.get('$RelayQuery'), {}, {
	      isDeferred: !!(metadata && metadata.isDeferred),
	      isContainerFragment: !!(metadata && metadata.isContainerFragment)
	    });
	    fragment.__children__ = nextChildren;
	    return fragment;
	  };

	  RelayQueryFragment.create = function create(concreteNode, route, variables, metadata) {
	    var fragment = QueryBuilder.getFragment(concreteNode);
	    !fragment ?  true ? invariant(false, 'RelayQueryFragment.create(): ' + 'Expected a GraphQL `fragment { ... }`, got: %s', concreteNode) : invariant(false) : undefined;
	    return createMemoizedFragment(fragment, route, variables, metadata || DEFAULT_FRAGMENT_METADATA);
	  };

	  function RelayQueryFragment(concreteNode, route, variables, metadata) {
	    _classCallCheck(this, RelayQueryFragment);

	    _RelayQueryNode3.call(this, concreteNode, route, variables);
	    this.__fragmentID__ = null;
	    // NOTE: `this.__hash__` gets set to null when cloning.
	    this.__hash__ = concreteNode.hash;
	    this.__metadata__ = metadata || DEFAULT_FRAGMENT_METADATA;
	  }

	  /**
	   * @internal
	   *
	   * Wraps access to query fields.
	   */

	  RelayQueryFragment.prototype.getDebugName = function getDebugName() {
	    return this.__concreteNode__.name;
	  };

	  /**
	   * The "concrete hash" for a fragment is used to statically identify fragments
	   * that are structurally identical. This should only be called on fragments
	   * that have not been cloned (i.e. have not undergone any "transformers").
	   */

	  RelayQueryFragment.prototype.getConcreteFragmentHash = function getConcreteFragmentHash() {
	    var hash = this.__hash__;
	    !(hash != null) ?  true ? invariant(false, 'RelayQueryFragment.getConcreteFragmentHash(): ' + 'Cannot be called on a cloned fragment.') : invariant(false) : undefined;
	    return hash;
	  };

	  /**
	   * Checks whether a fragment has a concrete fragment hash. Generally, this is
	   * not necessary (e.g. fragments that are created by containers or mutations).
	   *
	   * Only fragments that are constructed by the `babel-relay-plugin` or by
	   * `QueryBuilder.createFragment` will have concrete hashes. Fragments that
	   * are the result of cloning an existing fragment with new children do not
	   * have concrete hashes.
	   */

	  RelayQueryFragment.prototype.hasConcreteFragmentHash = function hasConcreteFragmentHash() {
	    return this.__hash__ != null;
	  };

	  /**
	   * Returns an identifier for a fragment that is unique for any combination of
	   * concrete fragment, route name, and variables. This is used for memoizing
	   * traversals or communicating the status of fetching deferred fragments.
	   *
	   * NOTE: Two fragments with the same fragment ID may have different children
	   *       if one of them has been cloned with new children.
	   */

	  RelayQueryFragment.prototype.getFragmentID = function getFragmentID() {
	    var fragmentID = this.__fragmentID__;
	    if (!fragmentID) {
	      fragmentID = generateRQLFieldAlias(this.__concreteNode__.hash + '.' + this.__route__.name + '.' + stableStringify(this.__variables__));
	      this.__fragmentID__ = fragmentID;
	    }
	    return fragmentID;
	  };

	  RelayQueryFragment.prototype.isAbstract = function isAbstract() {
	    return !!this.__concreteNode__.metadata.isAbstract;
	  };

	  RelayQueryFragment.prototype.isDeferred = function isDeferred() {
	    return this.__metadata__.isDeferred;
	  };

	  RelayQueryFragment.prototype.isPlural = function isPlural() {
	    var metadata = this.__concreteNode__.metadata;
	    return !!(metadata.isPlural || // FB Printer
	    metadata.plural) // OSS Printer from `@relay`
	    ;
	  };

	  RelayQueryFragment.prototype.cloneAsPlainFragment = function cloneAsPlainFragment() {
	    return createMemoizedFragment(this.__concreteNode__, this.__route__, this.__variables__, DEFAULT_FRAGMENT_METADATA);
	  };

	  RelayQueryFragment.prototype.isContainerFragment = function isContainerFragment() {
	    return this.__metadata__.isContainerFragment;
	  };

	  RelayQueryFragment.prototype.hasDeferredDescendant = function hasDeferredDescendant() {
	    return this.isDeferred() || _RelayQueryNode3.prototype.hasDeferredDescendant.call(this);
	  };

	  RelayQueryFragment.prototype.clone = function clone(children) {
	    var clone = _RelayQueryNode3.prototype.clone.call(this, children);
	    if (clone !== this && clone instanceof RelayQueryFragment) {
	      clone.__hash__ = null;
	      clone.__metadata__ = _extends({}, this.__metadata__);
	    }
	    return clone;
	  };

	  RelayQueryFragment.prototype.equals = function equals(that) {
	    if (this === that) {
	      return true;
	    }
	    if (!(that instanceof RelayQueryFragment)) {
	      return false;
	    }
	    if (this.getType() !== that.getType()) {
	      return false;
	    }
	    return _RelayQueryNode3.prototype.equals.call(this, that);
	  };

	  return RelayQueryFragment;
	})(RelayQueryNode);

	var RelayQueryField = (function (_RelayQueryNode4) {
	  _inherits(RelayQueryField, _RelayQueryNode4);

	  RelayQueryField.create = function create(concreteNode, route, variables) {
	    var field = QueryBuilder.getField(concreteNode);
	    !field ?  true ? invariant(false, 'RelayQueryField.create(): Expected a GraphQL field, got: %s', concreteNode) : invariant(false) : undefined;
	    return new RelayQueryField(field, route, variables);
	  };

	  /**
	   * Helper to construct a new field with the given attributes and 'empty'
	   * route/variables.
	   */

	  RelayQueryField.build = function build(_ref) {
	    var alias = _ref.alias;
	    var calls = _ref.calls;
	    var children = _ref.children;
	    var fieldName = _ref.fieldName;
	    var metadata = _ref.metadata;
	    var type = _ref.type;
	    return (function () {
	      var nextChildren = children ? children.filter(function (child) {
	        return !!child;
	      }) : [];
	      var concreteField = QueryBuilder.createField({
	        alias: alias,
	        calls: calls ? callsToGraphQL(calls) : null,
	        fieldName: fieldName,
	        metadata: metadata,
	        type: type
	      });
	      var field = new RelayQueryField(concreteField, RelayMetaRoute.get('$RelayQuery'), {});
	      field.__children__ = nextChildren;
	      return field;
	    })();
	  };

	  function RelayQueryField(concreteNode, route, variables) {
	    _classCallCheck(this, RelayQueryField);

	    _RelayQueryNode4.call(this, concreteNode, route, variables);
	    this.__debugName__ = undefined;
	    this.__isRefQueryDependency__ = false;
	    this.__rangeBehaviorKey__ = undefined;
	    this.__shallowHash__ = undefined;
	  }

	  RelayQueryField.prototype.isAbstract = function isAbstract() {
	    return !!this.__concreteNode__.metadata.isAbstract;
	  };

	  RelayQueryField.prototype.isFindable = function isFindable() {
	    return !!this.__concreteNode__.metadata.isFindable;
	  };

	  RelayQueryField.prototype.isGenerated = function isGenerated() {
	    return !!this.__concreteNode__.metadata.isGenerated;
	  };

	  RelayQueryField.prototype.isConnection = function isConnection() {
	    return !!this.__concreteNode__.metadata.isConnection;
	  };

	  RelayQueryField.prototype.isPlural = function isPlural() {
	    return !!this.__concreteNode__.metadata.isPlural;
	  };

	  RelayQueryField.prototype.isRefQueryDependency = function isRefQueryDependency() {
	    return this.__isRefQueryDependency__;
	  };

	  RelayQueryField.prototype.isRequisite = function isRequisite() {
	    return !!this.__concreteNode__.metadata.isRequisite;
	  };

	  RelayQueryField.prototype.isScalar = function isScalar() {
	    var concreteChildren = this.__concreteNode__.children;
	    return (!this.__children__ || this.__children__.length === 0) && (!concreteChildren || concreteChildren.length === 0);
	  };

	  RelayQueryField.prototype.getDebugName = function getDebugName() {
	    var _this5 = this;

	    var debugName = this.__debugName__;
	    if (!debugName) {
	      (function () {
	        debugName = _this5.getSchemaName();
	        var printedCoreArgs = undefined;
	        _this5.getCallsWithValues().forEach(function (arg) {
	          if (_this5._isCoreArg(arg)) {
	            printedCoreArgs = printedCoreArgs || [];
	            printedCoreArgs.push(serializeRelayQueryCall(arg));
	          }
	        });
	        if (printedCoreArgs) {
	          debugName += printedCoreArgs.sort().join('');
	        }
	        _this5.__debugName__ = debugName;
	      })();
	    }
	    return debugName;
	  };

	  /**
	   * The canonical name for the referenced field in the schema.
	   */

	  RelayQueryField.prototype.getSchemaName = function getSchemaName() {
	    return this.__concreteNode__.fieldName;
	  };

	  /**
	   * A string representing the range behavior eligible arguments associated with
	   * this field. Arguments will be sorted.
	   *
	   * Non-core arguments (like connection and identifying arguments) are dropped.
	   *   `field(first: 10, foo: "bar", baz: "bat")` => `'baz(bat).foo(bar)'`
	   *   `username(name: "steve")`                  => `''`
	   */

	  RelayQueryField.prototype.getRangeBehaviorKey = function getRangeBehaviorKey() {
	    var _this6 = this;

	    !this.isConnection() ?  true ? invariant(false, 'RelayQueryField: Range behavior keys are associated exclusively with ' + 'connection fields. `getRangeBehaviorKey()` was called on the ' + 'non-connection field `%s`.', this.getSchemaName()) : invariant(false) : undefined;
	    var rangeBehaviorKey = this.__rangeBehaviorKey__;
	    if (rangeBehaviorKey == null) {
	      (function () {
	        var printedCoreArgs = [];
	        _this6.getCallsWithValues().forEach(function (arg) {
	          if (_this6._isCoreArg(arg)) {
	            printedCoreArgs.push(serializeRelayQueryCall(arg));
	          }
	        });
	        rangeBehaviorKey = printedCoreArgs.sort().join('').slice(1);
	        _this6.__rangeBehaviorKey__ = rangeBehaviorKey;
	      })();
	    }
	    return rangeBehaviorKey;
	  };

	  /**
	   * The name for the field when serializing the query or interpreting query
	   * responses from the server. The serialization key is derived from
	   * all calls/values and hashed for compactness.
	   *
	   * Given the GraphQL
	   *   `field(first: 10, foo: "bar", baz: "bat")`, or
	   *   `field(baz: "bat", foo: "bar", first: 10)`
	   *
	   * ...the following serialization key will be produced:
	   *   `generateRQLFieldAlias('field.bar(bat).first(10).foo(bar)')`
	   */

	  RelayQueryField.prototype.getSerializationKey = function getSerializationKey() {
	    var serializationKey = this.__serializationKey__;
	    if (!serializationKey) {
	      serializationKey = generateRQLFieldAlias(this.getSchemaName() + this.getCallsWithValues().map(serializeRelayQueryCall).sort().join(''));
	      this.__serializationKey__ = serializationKey;
	    }
	    return serializationKey;
	  };

	  /**
	   * Returns a hash of the field name and all argument values.
	   */

	  RelayQueryField.prototype.getShallowHash = function getShallowHash() {
	    var shallowHash = this.__shallowHash__;
	    if (!shallowHash) {
	      this.__shallowHash__ = shallowHash = this.getSchemaName() + serializeCalls(this.getCallsWithValues());
	    }
	    return shallowHash;
	  };

	  /**
	   * The name which Relay internals can use to reference this field, without
	   * collisions.
	   *
	   * Given the GraphQL
	   *   `field(first: 10, foo: "bar", baz: "bat")`, or
	   *   `field(baz: "bat", foo: "bar", first: 10)`
	   *
	   * ...the following storage key will be produced:
	   *   `'field{bar:"bat",foo:"bar"}'`
	   */

	  RelayQueryField.prototype.getStorageKey = function getStorageKey() {
	    var _this7 = this;

	    var storageKey = this.__storageKey__;
	    if (!storageKey) {
	      this.__storageKey__ = storageKey = this.getSchemaName() + serializeCalls(this.getCallsWithValues().filter(function (call) {
	        return _this7._isCoreArg(call);
	      }));
	    }
	    return storageKey;
	  };

	  /**
	   * The name by which this field's results should be made available to the
	   * application.
	   */

	  RelayQueryField.prototype.getApplicationName = function getApplicationName() {
	    var concreteNode = this.__concreteNode__;
	    return concreteNode.alias || concreteNode.fieldName;
	  };

	  RelayQueryField.prototype.getInferredRootCallName = function getInferredRootCallName() {
	    return this.__concreteNode__.metadata.inferredRootCallName;
	  };

	  RelayQueryField.prototype.getInferredPrimaryKey = function getInferredPrimaryKey() {
	    return this.__concreteNode__.metadata.inferredPrimaryKey;
	  };

	  RelayQueryField.prototype.getCallsWithValues = function getCallsWithValues() {
	    var calls = this.__calls__;
	    if (!calls) {
	      var concreteCalls = this.__concreteNode__.calls;
	      if (concreteCalls) {
	        calls = callsFromGraphQL(concreteCalls, this.__variables__);
	      } else {
	        calls = EMPTY_CALLS;
	      }
	      this.__calls__ = calls;
	    }
	    return calls;
	  };

	  RelayQueryField.prototype.getCallType = function getCallType(callName) {
	    var concreteCalls = this.__concreteNode__.calls;
	    var concreteCall = concreteCalls && concreteCalls.filter(function (call) {
	      return call.name === callName;
	    })[0];
	    if (concreteCall) {
	      return concreteCall.metadata.type;
	    }
	  };

	  RelayQueryField.prototype.equals = function equals(that) {
	    if (this === that) {
	      return true;
	    }
	    if (!(that instanceof RelayQueryField)) {
	      return false;
	    }
	    if (this.getSchemaName() !== that.getSchemaName() || this.getApplicationName() !== that.getApplicationName() || !areEqual(this.getCallsWithValues(), that.getCallsWithValues())) {
	      return false;
	    }
	    return _RelayQueryNode4.prototype.equals.call(this, that);
	  };

	  RelayQueryField.prototype.cloneAsRefQueryDependency = function cloneAsRefQueryDependency() {
	    var field = new RelayQueryField(this.__concreteNode__, this.__route__, this.__variables__);
	    field.__children__ = [];
	    field.__isRefQueryDependency__ = true;
	    return field;
	  };

	  RelayQueryField.prototype.cloneFieldWithCalls = function cloneFieldWithCalls(children, calls) {
	    if (this.isScalar()) {
	      // Compact new children *after* this check, for consistency.
	      !(children.length === 0) ?  true ? invariant(false, 'RelayQueryField: Cannot add children to scalar fields.') : invariant(false) : undefined;
	    }

	    // use `clone()` if call values do not change
	    if (areEqual(this.getCallsWithValues(), calls)) {
	      var clone = this.clone(children);
	      return clone;
	    }

	    var nextChildren = cloneChildren(this.getChildren(), children);
	    if (!nextChildren.length) {
	      return null;
	    }

	    var field = new RelayQueryField(this.__concreteNode__, this.__route__, this.__variables__);
	    field.__children__ = nextChildren;
	    field.__calls__ = calls;

	    return field;
	  };

	  /**
	   * The following types of arguments are non-core:
	   * - Range calls such as `first` or `find` on connections.
	   * - Conditionals when the field is present.
	   */

	  RelayQueryField.prototype._isCoreArg = function _isCoreArg(arg) {
	    return(
	      // `name(if:true)`, `name(unless:false)`, and `name` are equivalent.
	      !(arg.name === IF && String(arg.value) === TRUE) && !(arg.name === UNLESS && String(arg.value) === FALSE) &&
	      // Connection arguments can be stripped out.
	      !(this.isConnection() && RelayConnectionInterface.isConnectionCall(arg))
	    );
	  };

	  return RelayQueryField;
	})(RelayQueryNode);

	function createNode(_x, _x2, _x3) {
	  var _again = true;

	  _function: while (_again) {
	    var concreteNode = _x,
	        route = _x2,
	        variables = _x3;
	    _again = false;

	    !(typeof concreteNode === 'object' && concreteNode !== null) ?  true ? invariant(false, 'RelayQueryNode: Expected a GraphQL object created with `Relay.QL`, got' + '`%s`.', concreteNode) : invariant(false) : undefined;
	    var kind = concreteNode.kind;
	    var type = RelayQueryNode;
	    if (kind === 'Field') {
	      type = RelayQueryField;
	    } else if (kind === 'Fragment') {
	      type = RelayQueryFragment;
	    } else if (kind === 'FragmentReference') {
	      type = RelayQueryFragment;
	      var fragment = QueryBuilder.getFragment(concreteNode.fragment);
	      // TODO #9171213: Reference directives should override fragment directives
	      if (fragment) {
	        return createMemoizedFragment(fragment, route, {}, {
	          isDeferred: false,
	          isContainerFragment: true
	        });
	      }
	    } else if (kind === 'Query') {
	      type = RelayQueryRoot;
	    } else if (kind === 'Mutation') {
	      type = RelayQueryMutation;
	    } else if (kind === 'Subscription') {
	      type = RelayQuerySubscription;
	    } else if (concreteNode instanceof RelayRouteFragment) {
	      var fragment = concreteNode.getFragmentForRoute(route);
	      if (fragment) {
	        // may be null if no value was defined for this route.
	        _x = fragment;
	        _x2 = route;
	        _x3 = variables;
	        _again = true;
	        kind = type = fragment = fragment = undefined;
	        continue _function;
	      }
	      return null;
	    } else if (concreteNode instanceof RelayFragmentReference) {
	      var fragment = concreteNode.getFragment(variables);
	      var fragmentVariables = concreteNode.getVariables(route, variables);
	      if (fragment) {
	        // the fragment may be null when `if` or `unless` conditions are not met.
	        return createMemoizedFragment(fragment, route, fragmentVariables, {
	          isDeferred: concreteNode.isDeferred(),
	          isContainerFragment: concreteNode.isContainerFragment()
	        });
	      }
	      return null;
	    } else {}
	    return new type(concreteNode, route, variables);
	  }
	}

	/**
	 * Memoizes the `RelayQueryFragment` equivalent of a given GraphQL fragment
	 * for the given route, variables, and deferred status.
	 */
	function createMemoizedFragment(concreteFragment, route, variables, metadata) {
	  var cacheKey = route.name + ':' + stableStringify(variables) + ':' + stableStringify(metadata);
	  var fragment = concreteFragment.__cachedFragment__;
	  var fragmentCacheKey = concreteFragment.__cacheKey__;
	  if (!fragment || fragmentCacheKey !== cacheKey) {
	    fragment = new RelayQueryFragment(concreteFragment, route, variables, metadata);
	    concreteFragment.__cachedFragment__ = fragment;
	    concreteFragment.__cacheKey__ = cacheKey;
	  }
	  return fragment;
	}

	/**
	 * Compacts new children and compares them to the previous children.
	 * - If all items are equal, returns previous array
	 * - If any items differ, returns new array
	 */
	function cloneChildren(prevChildren, nextChildren) {
	  var children = [];
	  var isSameChildren = true;

	  var prevIndex = 0;
	  for (var ii = 0; ii < nextChildren.length; ii++) {
	    var child = nextChildren[ii];
	    if (child) {
	      children.push(child);
	      isSameChildren = isSameChildren && child === prevChildren[prevIndex++];
	    }
	  }

	  if (isSameChildren && children.length === prevChildren.length) {
	    return prevChildren;
	  } else {
	    return children;
	  }
	}

	/**
	 * Creates an opaque serialization of calls.
	 */
	function serializeCalls(calls) {
	  if (calls.length) {
	    var _ret6 = (function () {
	      var callMap = {};
	      calls.forEach(function (call) {
	        callMap[call.name] = call.value;
	      });
	      return {
	        v: stableStringify(callMap)
	      };
	    })();

	    if (typeof _ret6 === 'object') return _ret6.v;
	  } else {
	    return '';
	  }
	}

	RelayProfiler.instrumentMethods(RelayQueryNode.prototype, {
	  clone: '@RelayQueryNode.prototype.clone',
	  equals: '@RelayQueryNode.prototype.equals',
	  getChildren: '@RelayQueryNode.prototype.getChildren',
	  getDirectives: '@RelayQueryNode.prototype.getDirectives',
	  hasDeferredDescendant: '@RelayQueryNode.prototype.hasDeferredDescendant',
	  getFieldByStorageKey: '@RelayQueryNode.prototype.getFieldByStorageKey'
	});

	RelayProfiler.instrumentMethods(RelayQueryField.prototype, {
	  getStorageKey: '@RelayQueryField.prototype.getStorageKey',
	  getSerializationKey: '@RelayQueryField.prototype.getSerializationKey'
	});

	module.exports = {
	  Field: RelayQueryField,
	  Fragment: RelayQueryFragment,
	  Mutation: RelayQueryMutation,
	  Node: RelayQueryNode,
	  Operation: RelayQueryOperation,
	  Root: RelayQueryRoot,
	  Subscription: RelayQuerySubscription
	};
	// for flow

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule RelayProfiler
	 * @typechecks
	 * 
	 */

	'use strict';

	var emptyFunction = __webpack_require__(70);
	var forEachObject = __webpack_require__(9);
	var removeFromArray = __webpack_require__(214);

	var aggregateHandlersByName = {
	  '*': []
	};
	var profileHandlersByName = {
	  '*': []
	};

	var NOT_INVOKED = {};
	var defaultProfiler = { stop: emptyFunction };
	var shouldInstrument = function shouldInstrument(name) {
	  if (true) {
	    return true;
	  }
	  return name.charAt(0) !== '@';
	};

	/**
	 * @public
	 *
	 * Instruments methods to allow profiling various parts of Relay. Profiling code
	 * in Relay consists of three steps:
	 *
	 *  - Instrument the function to be profiled.
	 *  - Attach handlers to the instrumented function.
	 *  - Run the code which triggers the handlers.
	 *
	 * Handlers attached to instrumented methods are called with an instrumentation
	 * name and a callback that must be synchronously executed:
	 *
	 *   instrumentedMethod.attachHandler(function(name, callback) {
	 *     const start = performance.now();
	 *     callback();
	 *     console.log('Duration', performance.now() - start);
	 *   });
	 *
	 * Handlers for profiles consist of callbacks for `onStart` and `onStop`:
	 *
	 *   const start;
	 *   RelayProfiler.attachProfileHandler('profileName', {
	 *     onStart: function(name, state) {
	 *       start = performance.now();
	 *     },
	 *     onStop: function(name, state) {
	 *       console.log('Duration', performance.now() - start);
	 *     }
	 *   });
	 *
	 * In order to reduce the impact on performance in production, instrumented
	 * methods and profilers with names that begin with `@` will only be measured
	 * if `__DEV__` is true. This should be used for very hot functions.
	 */
	var RelayProfiler = {

	  /**
	   * Instruments methods on a class or object. This re-assigns the method in
	   * order to preserve function names in stack traces (which are detected by
	   * modern debuggers via heuristics). Example usage:
	   *
	   *   const RelayStore = { primeCache: function() {...} };
	   *   RelayProfiler.instrumentMethods(RelayStore, {
	   *     primeCache: 'RelayStore.primeCache'
	   *   });
	   *
	   *   RelayStore.primeCache.attachHandler(...);
	   *
	   * As a result, the methods will be replaced by wrappers that provide the
	   * `attachHandler` and `detachHandler` methods.
	   */
	  instrumentMethods: function instrumentMethods(object, names) {
	    forEachObject(names, function (name, key) {
	      object[key] = RelayProfiler.instrument(name, object[key]);
	    });
	  },

	  /**
	   * Wraps the supplied function with one that provides the `attachHandler` and
	   * `detachHandler` methods. Example usage:
	   *
	   *   const printRelayQuery =
	   *     RelayProfiler.instrument('printRelayQuery', printRelayQuery);
	   *
	   *   printRelayQuery.attachHandler(...);
	   *
	   * NOTE: The instrumentation assumes that no handlers are attached or detached
	   * in the course of executing another handler.
	   */
	  instrument: function instrument(name, originalFunction) {
	    if (!shouldInstrument(name)) {
	      originalFunction.attachHandler = emptyFunction;
	      originalFunction.detachHandler = emptyFunction;
	      return originalFunction;
	    }
	    if (!aggregateHandlersByName.hasOwnProperty(name)) {
	      aggregateHandlersByName[name] = [];
	    }
	    var catchallHandlers = aggregateHandlersByName['*'];
	    var aggregateHandlers = aggregateHandlersByName[name];
	    var handlers = [];
	    var contexts = [];
	    var invokeHandlers = function invokeHandlers() {
	      var context = contexts[contexts.length - 1];
	      if (context[0]) {
	        context[0]--;
	        catchallHandlers[context[0]](name, invokeHandlers);
	      } else if (context[1]) {
	        context[1]--;
	        aggregateHandlers[context[1]](name, invokeHandlers);
	      } else if (context[2]) {
	        context[2]--;
	        handlers[context[2]](name, invokeHandlers);
	      } else {
	        context[5] = originalFunction.apply(context[3], context[4]);
	      }
	    };
	    var instrumentedCallback = function instrumentedCallback() {
	      var returnValue = undefined;
	      if (aggregateHandlers.length === 0 && handlers.length === 0 && catchallHandlers.length == 0) {
	        returnValue = originalFunction.apply(this, arguments);
	      } else {
	        contexts.push([catchallHandlers.length, aggregateHandlers.length, handlers.length, this, arguments, NOT_INVOKED]);
	        invokeHandlers();
	        var context = contexts.pop();
	        returnValue = context[5];
	        if (returnValue === NOT_INVOKED) {
	          throw new Error('RelayProfiler: Handler did not invoke original function.');
	        }
	      }
	      return returnValue;
	    };
	    instrumentedCallback.attachHandler = function (handler) {
	      handlers.push(handler);
	    };
	    instrumentedCallback.detachHandler = function (handler) {
	      removeFromArray(handlers, handler);
	    };
	    instrumentedCallback.displayName = '(instrumented ' + name + ')';
	    return instrumentedCallback;
	  },

	  /**
	   * Attaches a handler to all methods instrumented with the supplied name.
	   *
	   *   function createRenderer() {
	   *     return RelayProfiler.instrument('render', function() {...});
	   *   }
	   *   const renderA = createRenderer();
	   *   const renderB = createRenderer();
	   *
	   *   // Only profiles `renderA`.
	   *   renderA.attachHandler(...);
	   *
	   *   // Profiles both `renderA` and `renderB`.
	   *   RelayProfiler.attachAggregateHandler('render', ...);
	   *
	   */
	  attachAggregateHandler: function attachAggregateHandler(name, handler) {
	    if (shouldInstrument(name)) {
	      if (!aggregateHandlersByName.hasOwnProperty(name)) {
	        aggregateHandlersByName[name] = [];
	      }
	      aggregateHandlersByName[name].push(handler);
	    }
	  },

	  /**
	   * Detaches a handler attached via `attachAggregateHandler`.
	   */
	  detachAggregateHandler: function detachAggregateHandler(name, handler) {
	    if (shouldInstrument(name)) {
	      if (aggregateHandlersByName.hasOwnProperty(name)) {
	        removeFromArray(aggregateHandlersByName[name], handler);
	      }
	    }
	  },

	  /**
	   * Instruments profiling for arbitrarily asynchronous code by a name.
	   *
	   *   const timerProfiler = RelayProfiler.profile('timeout');
	   *   setTimeout(function() {
	   *     timerProfiler.stop();
	   *   }, 1000);
	   *
	   *   RelayProfiler.attachProfileHandler('timeout', ...);
	   *
	   * Arbitrary state can also be passed into `profile` as a second argument. The
	   * attached profile handlers will receive this as the second argument.
	   */
	  profile: function profile(name, state) {
	    var hasCatchAllHandlers = profileHandlersByName['*'].length > 0;
	    var hasNamedHandlers = profileHandlersByName.hasOwnProperty(name);
	    if (hasNamedHandlers || hasCatchAllHandlers) {
	      var _ret = (function () {
	        var profileHandlers = hasNamedHandlers && hasCatchAllHandlers ? profileHandlersByName[name].concat(profileHandlersByName['*']) : hasNamedHandlers ? profileHandlersByName[name] : profileHandlersByName['*'];
	        var stopHandlers = undefined;
	        for (var ii = profileHandlers.length - 1; ii >= 0; ii--) {
	          var profileHandler = profileHandlers[ii];
	          var stopHandler = profileHandler(name, state);
	          stopHandlers = stopHandlers || [];
	          stopHandlers.unshift(stopHandler);
	        }
	        return {
	          v: {
	            stop: function stop() {
	              if (stopHandlers) {
	                stopHandlers.forEach(function (stopHandler) {
	                  return stopHandler();
	                });
	              }
	            }
	          }
	        };
	      })();

	      if (typeof _ret === 'object') return _ret.v;
	    }
	    return defaultProfiler;
	  },

	  /**
	   * Attaches a handler to profiles with the supplied name. You can also
	   * attach to the special name '*' which is a catch all.
	   */
	  attachProfileHandler: function attachProfileHandler(name, handler) {
	    if (shouldInstrument(name)) {
	      if (!profileHandlersByName.hasOwnProperty(name)) {
	        profileHandlersByName[name] = [];
	      }
	      profileHandlersByName[name].push(handler);
	    }
	  },

	  /**
	   * Detaches a handler attached via `attachProfileHandler`.
	   */
	  detachProfileHandler: function detachProfileHandler(name, handler) {
	    if (shouldInstrument(name)) {
	      if (profileHandlersByName.hasOwnProperty(name)) {
	        removeFromArray(profileHandlersByName[name], handler);
	      }
	    }
	  }

	};

	module.exports = RelayProfiler;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _Object$create = __webpack_require__(170)["default"];

	var _Object$setPrototypeOf = __webpack_require__(172)["default"];

	exports["default"] = function (subClass, superClass) {
	  if (typeof superClass !== "function" && superClass !== null) {
	    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
	  }

	  subClass.prototype = _Object$create(superClass && superClass.prototype, {
	    constructor: {
	      value: subClass,
	      enumerable: false,
	      writable: true,
	      configurable: true
	    }
	  });
	  if (superClass) _Object$setPrototypeOf ? _Object$setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	};

	exports.__esModule = true;

/***/ },
/* 6 */
/***/ function(module, exports) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule GraphQLStoreDataHandler
	 * 
	 * @typechecks
	 */

	'use strict';

	var METADATA_KEYS = {
	  __dataID__: true,
	  __range__: true,
	  __resolvedFragmentMap__: true,
	  __resolvedFragmentMapGeneration__: true,
	  __status__: true
	};

	/**
	 * Utility functions for working with data stored in GraphQLStore.
	 *
	 * @internal
	 */
	var GraphQLStoreDataHandler = {
	  /**
	   * Returns the id that can be used to reference the given node in
	   * the store.
	   */
	  getID: function getID(node) {
	    return node.__dataID__;
	  },

	  /**
	   * Returns a pointer object containing a `__dataID__` property for the node
	   * corresponding to the given id.
	   */
	  createPointerWithID: function createPointerWithID(dataID) {
	    return { __dataID__: dataID };
	  },

	  /**
	   * Checks whether the given ID was created on the client, as opposed to an ID
	   * that's understood by the server as well.
	   */
	  isClientID: function isClientID(dataID) {
	    return dataID.substring(0, 7) === 'client:';
	  },

	  /**
	   * Checks whether the given key is a valid metadata key.
	   */
	  isMetadataKey: function isMetadataKey(key) {
	    return METADATA_KEYS[key] || false;
	  }
	};

	module.exports = GraphQLStoreDataHandler;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule RelayConnectionInterface
	 */

	'use strict';

	module.exports = __webpack_require__(126);

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _Object$assign = __webpack_require__(59)["default"];

	exports["default"] = _Object$assign || function (target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i];

	    for (var key in source) {
	      if (Object.prototype.hasOwnProperty.call(source, key)) {
	        target[key] = source[key];
	      }
	    }
	  }

	  return target;
	};

	exports.__esModule = true;

/***/ },
/* 9 */
/***/ function(module, exports) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @typechecks
	 */

	'use strict';

	var hasOwnProperty = Object.prototype.hasOwnProperty;

	/**
	 * Executes the provided `callback` once for each enumerable own property in the
	 * object. The `callback` is invoked with three arguments:
	 *
	 *  - the property value
	 *  - the property name
	 *  - the object being traversed
	 *
	 * Properties that are added after the call to `forEachObject` will not be
	 * visited by `callback`. If the values of existing properties are changed, the
	 * value passed to `callback` will be the value at the time `forEachObject`
	 * visits them. Properties that are deleted before being visited are not
	 * visited.
	 *
	 * @param {?object} object
	 * @param {function} callback
	 * @param {*} context
	 */
	function forEachObject(object, callback, context) {
	  for (var name in object) {
	    if (hasOwnProperty.call(object, name)) {
	      callback.call(context, object[name], name, object);
	    }
	  }
	}

	module.exports = forEachObject;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(181), __esModule: true };

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2014-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 */

	'use strict';

	var emptyFunction = __webpack_require__(70);

	/**
	 * Similar to invariant but only logs a warning if the condition is not met.
	 * This can be used to log issues in development environments in critical
	 * paths. Removing the logging code for production environments will keep the
	 * same logic and follow the same code paths.
	 */

	var warning = emptyFunction;

	if (true) {
	  warning = function (condition, format) {
	    for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
	      args[_key - 2] = arguments[_key];
	    }

	    if (format === undefined) {
	      throw new Error('`warning(condition, format, ...args)` requires a warning ' + 'message argument');
	    }

	    if (format.indexOf('Failed Composite propType: ') === 0) {
	      return; // Ignore CompositeComponent proptype check.
	    }

	    if (!condition) {
	      var argIndex = 0;
	      var message = 'Warning: ' + format.replace(/%s/g, function () {
	        return args[argIndex++];
	      });
	      if (typeof console !== 'undefined') {
	        console.error(message);
	      }
	      try {
	        // --- Welcome to debugging React ---
	        // This error was thrown as a convenience so that you can use this stack
	        // to find the callsite that caused this warning to fire.
	        throw new Error(message);
	      } catch (x) {}
	    }
	  };
	}

	module.exports = warning;

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule RelayNodeInterface
	 */

	'use strict';

	module.exports = __webpack_require__(128);

/***/ },
/* 13 */
/***/ function(module, exports) {

	var core = module.exports = {version: '1.2.6'};
	if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ },
/* 14 */
/***/ function(module, exports) {

	var $Object = Object;
	module.exports = {
	  create:     $Object.create,
	  getProto:   $Object.getPrototypeOf,
	  isEnum:     {}.propertyIsEnumerable,
	  getDesc:    $Object.getOwnPropertyDescriptor,
	  setDesc:    $Object.defineProperty,
	  setDescs:   $Object.defineProperties,
	  getKeys:    $Object.keys,
	  getNames:   $Object.getOwnPropertyNames,
	  getSymbols: $Object.getOwnPropertySymbols,
	  each:       [].forEach
	};

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	var store  = __webpack_require__(193)('wks')
	  , uid    = __webpack_require__(104)
	  , Symbol = __webpack_require__(44).Symbol;
	module.exports = function(name){
	  return store[name] || (store[name] =
	    Symbol && Symbol[name] || (Symbol || uid)('Symbol.' + name));
	};

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 */

	'use strict';

	module.exports = __webpack_require__(217);

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule QueryBuilder
	 * 
	 * @typechecks
	 */

	'use strict';

	var _Object$freeze = __webpack_require__(39)['default'];

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var RelayNodeInterface = __webpack_require__(12);

	var base62 = __webpack_require__(47);
	var invariant = __webpack_require__(2);

	var EMPTY_CALLS = [];
	var EMPTY_CHILDREN = [];
	var EMPTY_DIRECTIVES = [];
	var EMPTY_METADATA = {};

	if (true) {
	  _Object$freeze(EMPTY_CALLS);
	  _Object$freeze(EMPTY_CHILDREN);
	  _Object$freeze(EMPTY_DIRECTIVES);
	  _Object$freeze(EMPTY_METADATA);
	}

	/**
	 * @internal
	 *
	 * Helper methods for constructing concrete query objects.
	 */
	var QueryBuilder = {
	  createBatchCallVariable: function createBatchCallVariable(sourceQueryID, jsonPath) {
	    return {
	      kind: 'BatchCallVariable',
	      sourceQueryID: sourceQueryID,
	      jsonPath: jsonPath
	    };
	  },

	  createCall: function createCall(name, value, type) {
	    return {
	      kind: 'Call',
	      name: name,
	      metadata: {
	        type: type || null
	      },
	      value: value
	    };
	  },

	  createCallValue: function createCallValue(callValue) {
	    return {
	      kind: 'CallValue',
	      callValue: callValue
	    };
	  },

	  createCallVariable: function createCallVariable(callVariableName) {
	    return {
	      kind: 'CallVariable',
	      callVariableName: callVariableName
	    };
	  },

	  createField: function createField(partialField) {
	    var partialMetadata = partialField.metadata || EMPTY_METADATA;
	    return {
	      alias: partialField.alias,
	      calls: partialField.calls || EMPTY_CALLS,
	      children: partialField.children || EMPTY_CHILDREN,
	      directives: partialField.directives || EMPTY_DIRECTIVES,
	      fieldName: partialField.fieldName,
	      kind: 'Field',
	      metadata: {
	        inferredRootCallName: partialMetadata.inferredRootCallName,
	        inferredPrimaryKey: partialMetadata.inferredPrimaryKey,
	        isConnection: !!partialMetadata.isConnection,
	        isFindable: !!partialMetadata.isFindable,
	        isGenerated: !!partialMetadata.isGenerated,
	        isPlural: !!partialMetadata.isPlural,
	        isRequisite: !!partialMetadata.isRequisite,
	        isAbstract: !!partialMetadata.isAbstract
	      },
	      type: partialField.type
	    };
	  },

	  createFragment: function createFragment(partialFragment) {
	    var metadata = partialFragment.metadata || EMPTY_METADATA;
	    return {
	      children: partialFragment.children || EMPTY_CHILDREN,
	      directives: partialFragment.directives || EMPTY_DIRECTIVES,
	      hash: createClientFragmentHash(),
	      kind: 'Fragment',
	      metadata: {
	        isAbstract: !!metadata.isAbstract,
	        plural: !!metadata.plural },
	      // match the `@relay` argument name
	      name: partialFragment.name,
	      type: partialFragment.type
	    };
	  },

	  createFragmentReference: function createFragmentReference(fragment) {
	    return {
	      kind: 'FragmentReference',
	      fragment: fragment
	    };
	  },

	  createMutation: function createMutation(partialMutation) {
	    var metadata = partialMutation.metadata || EMPTY_METADATA;
	    return {
	      calls: partialMutation.calls || EMPTY_CALLS,
	      children: partialMutation.children || EMPTY_CHILDREN,
	      directives: partialMutation.directives || EMPTY_DIRECTIVES,
	      kind: 'Mutation',
	      metadata: {
	        inputType: metadata.inputType
	      },
	      name: partialMutation.name,
	      responseType: partialMutation.responseType
	    };
	  },

	  createQuery: function createQuery(partialQuery) {
	    var metadata = partialQuery.metadata || EMPTY_METADATA;
	    var calls = [];
	    var identifyingArgName = metadata.identifyingArgName;
	    if (identifyingArgName == null && RelayNodeInterface.isNodeRootCall(partialQuery.fieldName)) {
	      identifyingArgName = RelayNodeInterface.ID;
	    }
	    if (identifyingArgName != null) {
	      !(partialQuery.identifyingArgValue != null) ?  true ? invariant(false, 'QueryBuilder.createQuery(): An argument value is required for ' + 'query `%s(%s: ???)`.', partialQuery.fieldName, identifyingArgName) : invariant(false) : undefined;
	      calls = [QueryBuilder.createCall(identifyingArgName, partialQuery.identifyingArgValue)];
	    }
	    return {
	      calls: calls,
	      children: partialQuery.children || EMPTY_CHILDREN,
	      directives: partialQuery.directives || EMPTY_DIRECTIVES,
	      fieldName: partialQuery.fieldName,
	      isDeferred: !!(partialQuery.isDeferred || metadata.isDeferred),
	      kind: 'Query',
	      metadata: {
	        identifyingArgName: identifyingArgName,
	        identifyingArgType: metadata.identifyingArgType,
	        isAbstract: !!metadata.isAbstract,
	        isPlural: !!metadata.isPlural
	      },
	      name: partialQuery.name,
	      type: partialQuery.type
	    };
	  },

	  createSubscription: function createSubscription(partialSubscription) {
	    var metadata = partialSubscription.metadata || EMPTY_METADATA;
	    return {
	      calls: partialSubscription.calls || EMPTY_CALLS,
	      children: partialSubscription.children || EMPTY_CHILDREN,
	      directives: partialSubscription.directives || EMPTY_DIRECTIVES,
	      kind: 'Subscription',
	      metadata: {
	        inputType: metadata.inputType
	      },
	      name: partialSubscription.name,
	      responseType: partialSubscription.responseType
	    };
	  },

	  getBatchCallVariable: function getBatchCallVariable(node) {
	    if (isConcreteKind(node, 'BatchCallVariable')) {
	      return node;
	    }
	  },

	  getCallVariable: function getCallVariable(node) {
	    if (isConcreteKind(node, 'CallVariable')) {
	      return node;
	    }
	  },

	  getField: function getField(node) {
	    if (isConcreteKind(node, 'Field')) {
	      return node;
	    }
	  },

	  getFragment: function getFragment(node) {
	    if (isConcreteKind(node, 'Fragment')) {
	      return node;
	    }
	  },

	  getFragmentReference: function getFragmentReference(node) {
	    if (isConcreteKind(node, 'FragmentReference')) {
	      return node;
	    }
	  },

	  getMutation: function getMutation(node) {
	    if (isConcreteKind(node, 'Mutation')) {
	      return node;
	    }
	  },

	  getQuery: function getQuery(node) {
	    if (isConcreteKind(node, 'Query')) {
	      return node;
	    }
	  },

	  getSubscription: function getSubscription(node) {
	    if (isConcreteKind(node, 'Subscription')) {
	      return node;
	    }
	  }
	};

	var clientFragmentCount = 0;

	/**
	 * Hashes for fragments printed by `babel-relay-plugin` are encoded in Base64.
	 * Hashes for fragments created on the client are namespaced with `_` (which is
	 * not in the Base64 character set).
	 *
	 * NOTE: Unlike the hashes printed by `babel-relay-plugin`, hashes created on
	 *       the client are not cross-VM safe. (For example, if we ever want to
	 *       persist concrete nodes to disk, these hashes should be stripped and
	 *       re-generated on each client.)
	 */
	function createClientFragmentHash() {
	  return '_' + base62(clientFragmentCount++);
	}

	function isConcreteKind(node, kind) {
	  return typeof node === 'object' && node !== null && node.kind === kind;
	}

	module.exports = QueryBuilder;

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule RelayQueryVisitor
	 * 
	 * @typechecks
	 */

	'use strict';

	var _classCallCheck = __webpack_require__(1)['default'];

	var RelayQuery = __webpack_require__(3);

	/**
	 * @internal
	 *
	 * Base class for traversing a Relay Query.
	 *
	 * Subclasses can optionally implement methods to customize the traversal:
	 *
	 * - `visitField(field, state)`: Called for each field.
	 * - `visitFragment(fragment, state)`: Called for each fragment.
	 * - `visitQuery(fragment, state)`: Called for the top level query.
	 *
	 * A `state` variable is passed along to all callbacks and can be used to
	 * accumulate data while traversing (effectively passing data back up the tree),
	 * or modify the behavior of later callbacks (effectively passing data down the
	 * tree).
	 *
	 * There are two additional methods for controlling the traversal:
	 *
	 * - `traverse(parent, state)`: Visits all children of `parent`. Subclasses
	 *   may override in order to short-circuit traversal. Note that
	 *   `visit{Field,Fragment,Query}` are //not// called on `parent`, as it will
	 *   already have been visited by the time this method is called.
	 * - `visit(child, state)`: Processes the `child` node, calling the appropriate
	 *   `visit{Field,Fragment,Query}` method based on the node type.
	 *
	 * By convention, each of the callback methods returns the visited node. This is
	 * used by the `RelayQueryTransform` subclass to implement mapping and filtering
	 * behavior, but purely-visitor subclases do not need to follow this convention.
	 *
	 * @see RelayQueryTransform
	 */

	var RelayQueryVisitor = (function () {
	  function RelayQueryVisitor() {
	    _classCallCheck(this, RelayQueryVisitor);
	  }

	  RelayQueryVisitor.prototype.visit = function visit(node, nextState) {
	    if (node instanceof RelayQuery.Field) {
	      return this.visitField(node, nextState);
	    } else if (node instanceof RelayQuery.Fragment) {
	      return this.visitFragment(node, nextState);
	    } else if (node instanceof RelayQuery.Root) {
	      return this.visitRoot(node, nextState);
	    }
	  };

	  RelayQueryVisitor.prototype.traverse = function traverse(node, nextState) {
	    var _this = this;

	    if (!node.isScalar()) {
	      this.traverseChildren(node, nextState, function (child) {
	        _this.visit(child, nextState);
	      });
	    }
	    return node;
	  };

	  RelayQueryVisitor.prototype.traverseChildren = function traverseChildren(node, nextState, callback) {
	    var children = node.getChildren();
	    for (var _index = 0; _index < children.length; _index++) {
	      callback(children[_index], _index, children);
	    }
	  };

	  RelayQueryVisitor.prototype.visitField = function visitField(node, nextState) {
	    return this.traverse(node, nextState);
	  };

	  RelayQueryVisitor.prototype.visitFragment = function visitFragment(node, nextState) {
	    return this.traverse(node, nextState);
	  };

	  RelayQueryVisitor.prototype.visitRoot = function visitRoot(node, nextState) {
	    return this.traverse(node, nextState);
	  };

	  return RelayQueryVisitor;
	})();

	module.exports = RelayQueryVisitor;

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _Array$from = __webpack_require__(89)["default"];

	exports["default"] = function (arr) {
	  if (Array.isArray(arr)) {
	    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

	    return arr2;
	  } else {
	    return _Array$from(arr);
	  }
	};

	exports.__esModule = true;

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule GraphQLFragmentPointer
	 * 
	 * @typechecks
	 */

	'use strict';

	var _classCallCheck = __webpack_require__(1)['default'];

	var GraphQLStoreDataHandler = __webpack_require__(6);
	var RelayQuery = __webpack_require__(3);

	var invariant = __webpack_require__(2);
	var shallowEqual = __webpack_require__(72);

	/**
	 * Fragment pointers encapsulate the fetched data for a fragment reference. They
	 * are opaque tokens that are used by Relay containers to read data that is then
	 * passed to the underlying React component.
	 */

	var GraphQLFragmentPointer = (function () {

	  /**
	   * Creates a valid prop value to be passed into the top-level Relay container.
	   */

	  GraphQLFragmentPointer.createForRoot = function createForRoot(store, query) {
	    var fragment = getRootFragment(query);
	    if (!fragment) {
	      return null;
	    }
	    var concreteFragmentHash = fragment.getConcreteFragmentHash();
	    var storageKey = query.getStorageKey();
	    var identifyingArg = query.getIdentifyingArg();
	    var identifyingArgValue = identifyingArg && identifyingArg.value || null;
	    if (Array.isArray(identifyingArgValue)) {
	      var rootFragment = fragment; // for Flow
	      return identifyingArgValue.map(function (singleIdentifyingArgValue) {
	        var dataID = store.getDataID(storageKey, singleIdentifyingArgValue);
	        if (!dataID) {
	          return null;
	        }
	        var pointer = GraphQLStoreDataHandler.createPointerWithID(dataID);
	        pointer[concreteFragmentHash] = new GraphQLFragmentPointer([dataID], rootFragment);
	        return pointer;
	      });
	    }
	    !(typeof identifyingArgValue === 'string' || identifyingArgValue == null) ?  true ? invariant(false, 'GraphQLFragmentPointer: Value for the argument to `%s` on query `%s` ' + 'should be a string, but it was set to `%s`. Check that the value is a ' + 'string.', query.getFieldName(), query.getName(), identifyingArgValue) : invariant(false) : undefined;
	    var dataIDOrIDs = store.getDataID(storageKey, identifyingArgValue);
	    if (!dataIDOrIDs) {
	      return null;
	    }
	    var result = {};
	    // TODO(t7765591): Throw if `fragment` is not optional.
	    var fragmentPointer = new GraphQLFragmentPointer(dataIDOrIDs, fragment);
	    result[concreteFragmentHash] = fragmentPointer;
	    return result;
	  };

	  function GraphQLFragmentPointer(dataIDOrIDs, fragment) {
	    _classCallCheck(this, GraphQLFragmentPointer);

	    var isArray = Array.isArray(dataIDOrIDs);
	    var isPlural = fragment.isPlural();
	    !(isArray === isPlural) ?  true ? invariant(false, 'GraphQLFragmentPointer: Wrong plurality, %s supplied with %s fragment.', isArray ? 'array of data IDs' : 'single data ID', isPlural ? 'plural' : 'non-plural') : invariant(false) : undefined;

	    this._dataIDOrIDs = dataIDOrIDs;
	    this._fragment = fragment;
	  }

	  /**
	   * Get the data ID for a singular query fragment.
	   */

	  GraphQLFragmentPointer.prototype.getDataID = function getDataID() {
	    !!Array.isArray(this._dataIDOrIDs) ?  true ? invariant(false, 'GraphQLFragmentPointer.getDataID(): Bad call for plural fragment.') : invariant(false) : undefined;
	    return this._dataIDOrIDs;
	  };

	  /**
	   * Get the data ID for a plural query fragment.
	   */

	  GraphQLFragmentPointer.prototype.getDataIDs = function getDataIDs() {
	    !Array.isArray(this._dataIDOrIDs) ?  true ? invariant(false, 'GraphQLFragmentPointer.getDataIDs(): Bad call for non-plural fragment.') : invariant(false) : undefined;
	    return this._dataIDOrIDs;
	  };

	  GraphQLFragmentPointer.prototype.getFragment = function getFragment() {
	    return this._fragment;
	  };

	  GraphQLFragmentPointer.prototype.equals = function equals(that) {
	    return shallowEqual(this._dataIDOrIDs, that._dataIDOrIDs) && this._fragment.isEquivalent(that._fragment);
	  };

	  /**
	   * @unstable
	   *
	   * For debugging only, do not rely on this for comparing values at runtime.
	   * Instead, use `pointer.getFragment().getFragmentID()`.
	   */

	  GraphQLFragmentPointer.prototype.toString = function toString() {
	    return 'GraphQLFragmentPointer(ids: ' + JSON.stringify(this._dataIDOrIDs) + ', fragment: `' + this.getFragment().getDebugName() + ', params: ' + JSON.stringify(this._fragment.getVariables()) + ')';
	  };

	  return GraphQLFragmentPointer;
	})();

	function getRootFragment(query) {
	  var batchCall = query.getBatchCall();
	  if (batchCall) {
	     true ?  true ? invariant(false, 'Queries supplied at the root cannot have batch call variables. Query ' + '`%s` has a batch call variable, `%s`.', query.getName(), batchCall.refParamName) : invariant(false) : undefined;
	  }
	  var fragment;
	  query.getChildren().forEach(function (child) {
	    if (child instanceof RelayQuery.Fragment) {
	      !!fragment ?  true ? invariant(false, 'Queries supplied at the root should contain exactly one fragment ' + '(e.g. `${Component.getFragment(\'...\')}`). Query `%s` contains ' + 'more than one fragment.', query.getName()) : invariant(false) : undefined;
	      fragment = child;
	    } else if (child instanceof RelayQuery.Field) {
	      !child.isGenerated() ?  true ? invariant(false, 'Queries supplied at the root should contain exactly one fragment ' + 'and no fields. Query `%s` contains a field, `%s`. If you need to ' + 'fetch fields, declare them in a Relay container.', query.getName(), child.getSchemaName()) : invariant(false) : undefined;
	    }
	  });
	  return fragment;
	}

	module.exports = GraphQLFragmentPointer;

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule RelayMetaRoute
	 * 
	 * @typechecks
	 */

	'use strict';

	/**
	 * Meta route based on the real route; provides access to the route name in
	 * queries.
	 */

	var _classCallCheck = __webpack_require__(1)['default'];

	var RelayMetaRoute = (function () {
	  function RelayMetaRoute(name) {
	    _classCallCheck(this, RelayMetaRoute);

	    Object.defineProperty(this, 'name', {
	      enumerable: true,
	      value: name,
	      writable: false
	    });
	  }

	  RelayMetaRoute.get = function get(name) {
	    return cache[name] || (cache[name] = new RelayMetaRoute(name));
	  };

	  return RelayMetaRoute;
	})();

	var cache = {};

	module.exports = RelayMetaRoute;

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	var global    = __webpack_require__(44)
	  , core      = __webpack_require__(13)
	  , ctx       = __webpack_require__(30)
	  , PROTOTYPE = 'prototype';

	var $export = function(type, name, source){
	  var IS_FORCED = type & $export.F
	    , IS_GLOBAL = type & $export.G
	    , IS_STATIC = type & $export.S
	    , IS_PROTO  = type & $export.P
	    , IS_BIND   = type & $export.B
	    , IS_WRAP   = type & $export.W
	    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
	    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE]
	    , key, own, out;
	  if(IS_GLOBAL)source = name;
	  for(key in source){
	    // contains in native
	    own = !IS_FORCED && target && key in target;
	    if(own && key in exports)continue;
	    // export native or passed
	    out = own ? target[key] : source[key];
	    // prevent global pollution for namespaces
	    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
	    // bind timers to global for call from export context
	    : IS_BIND && own ? ctx(out, global)
	    // wrap global constructors for prevent change them in library
	    : IS_WRAP && target[key] == out ? (function(C){
	      var F = function(param){
	        return this instanceof C ? new C(param) : C(param);
	      };
	      F[PROTOTYPE] = C[PROTOTYPE];
	      return F;
	    // make static versions for prototype methods
	    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
	    if(IS_PROTO)(exports[PROTOTYPE] || (exports[PROTOTYPE] = {}))[key] = out;
	  }
	};
	// type bitmap
	$export.F = 1;  // forced
	$export.G = 2;  // global
	$export.S = 4;  // static
	$export.P = 8;  // proto
	$export.B = 16; // bind
	$export.W = 32; // wrap
	module.exports = $export;

/***/ },
/* 23 */
/***/ function(module, exports) {

	module.exports = {};

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var asap = __webpack_require__(88);

	function noop() {}

	// States:
	//
	// 0 - pending
	// 1 - fulfilled with _value
	// 2 - rejected with _value
	// 3 - adopted the state of another promise, _value
	//
	// once the state is no longer pending (0) it is immutable

	// All `_` prefixed properties will be reduced to `_{random number}`
	// at build time to obfuscate them and discourage their use.
	// We don't use symbols or Object.defineProperty to fully hide them
	// because the performance isn't good enough.


	// to avoid using try/catch inside critical functions, we
	// extract them to here.
	var LAST_ERROR = null;
	var IS_ERROR = {};
	function getThen(obj) {
	  try {
	    return obj.then;
	  } catch (ex) {
	    LAST_ERROR = ex;
	    return IS_ERROR;
	  }
	}

	function tryCallOne(fn, a) {
	  try {
	    return fn(a);
	  } catch (ex) {
	    LAST_ERROR = ex;
	    return IS_ERROR;
	  }
	}
	function tryCallTwo(fn, a, b) {
	  try {
	    fn(a, b);
	  } catch (ex) {
	    LAST_ERROR = ex;
	    return IS_ERROR;
	  }
	}

	module.exports = Promise;

	function Promise(fn) {
	  if (typeof this !== 'object') {
	    throw new TypeError('Promises must be constructed via new');
	  }
	  if (typeof fn !== 'function') {
	    throw new TypeError('not a function');
	  }
	  this._45 = 0;
	  this._81 = 0;
	  this._65 = null;
	  this._54 = null;
	  if (fn === noop) return;
	  doResolve(fn, this);
	}
	Promise._10 = null;
	Promise._97 = null;
	Promise._61 = noop;

	Promise.prototype.then = function(onFulfilled, onRejected) {
	  if (this.constructor !== Promise) {
	    return safeThen(this, onFulfilled, onRejected);
	  }
	  var res = new Promise(noop);
	  handle(this, new Handler(onFulfilled, onRejected, res));
	  return res;
	};

	function safeThen(self, onFulfilled, onRejected) {
	  return new self.constructor(function (resolve, reject) {
	    var res = new Promise(noop);
	    res.then(resolve, reject);
	    handle(self, new Handler(onFulfilled, onRejected, res));
	  });
	};
	function handle(self, deferred) {
	  while (self._81 === 3) {
	    self = self._65;
	  }
	  if (Promise._10) {
	    Promise._10(self);
	  }
	  if (self._81 === 0) {
	    if (self._45 === 0) {
	      self._45 = 1;
	      self._54 = deferred;
	      return;
	    }
	    if (self._45 === 1) {
	      self._45 = 2;
	      self._54 = [self._54, deferred];
	      return;
	    }
	    self._54.push(deferred);
	    return;
	  }
	  handleResolved(self, deferred);
	}

	function handleResolved(self, deferred) {
	  asap(function() {
	    var cb = self._81 === 1 ? deferred.onFulfilled : deferred.onRejected;
	    if (cb === null) {
	      if (self._81 === 1) {
	        resolve(deferred.promise, self._65);
	      } else {
	        reject(deferred.promise, self._65);
	      }
	      return;
	    }
	    var ret = tryCallOne(cb, self._65);
	    if (ret === IS_ERROR) {
	      reject(deferred.promise, LAST_ERROR);
	    } else {
	      resolve(deferred.promise, ret);
	    }
	  });
	}
	function resolve(self, newValue) {
	  // Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
	  if (newValue === self) {
	    return reject(
	      self,
	      new TypeError('A promise cannot be resolved with itself.')
	    );
	  }
	  if (
	    newValue &&
	    (typeof newValue === 'object' || typeof newValue === 'function')
	  ) {
	    var then = getThen(newValue);
	    if (then === IS_ERROR) {
	      return reject(self, LAST_ERROR);
	    }
	    if (
	      then === self.then &&
	      newValue instanceof Promise
	    ) {
	      self._81 = 3;
	      self._65 = newValue;
	      finale(self);
	      return;
	    } else if (typeof then === 'function') {
	      doResolve(then.bind(newValue), self);
	      return;
	    }
	  }
	  self._81 = 1;
	  self._65 = newValue;
	  finale(self);
	}

	function reject(self, newValue) {
	  self._81 = 2;
	  self._65 = newValue;
	  if (Promise._97) {
	    Promise._97(self, newValue);
	  }
	  finale(self);
	}
	function finale(self) {
	  if (self._45 === 1) {
	    handle(self, self._54);
	    self._54 = null;
	  }
	  if (self._45 === 2) {
	    for (var i = 0; i < self._54.length; i++) {
	      handle(self, self._54[i]);
	    }
	    self._54 = null;
	  }
	}

	function Handler(onFulfilled, onRejected, promise){
	  this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
	  this.onRejected = typeof onRejected === 'function' ? onRejected : null;
	  this.promise = promise;
	}

	/**
	 * Take a potentially misbehaving resolver function and make sure
	 * onFulfilled and onRejected are only called once.
	 *
	 * Makes no guarantees about asynchrony.
	 */
	function doResolve(fn, promise) {
	  var done = false;
	  var res = tryCallTwo(fn, function (value) {
	    if (done) return;
	    done = true;
	    resolve(promise, value);
	  }, function (reason) {
	    if (done) return;
	    done = true;
	    reject(promise, reason);
	  })
	  if (!done && res === IS_ERROR) {
	    done = true;
	    reject(promise, LAST_ERROR);
	  }
	}


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Promise = __webpack_require__(16);

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule RelayNetworkLayer
	 * @typechecks
	 * 
	 */

	'use strict';

	var RelayProfiler = __webpack_require__(4);

	var invariant = __webpack_require__(2);

	var injectedNetworkLayer;

	/**
	 * @internal
	 *
	 * `RelayNetworkLayer` provides a method to inject custom network behavior.
	 */
	var RelayNetworkLayer = {
	  injectNetworkLayer: function injectNetworkLayer(networkLayer) {
	    injectedNetworkLayer = networkLayer;
	  },

	  sendMutation: function sendMutation(mutationRequest) {
	    var networkLayer = getCurrentNetworkLayer();
	    var promise = networkLayer.sendMutation(mutationRequest);
	    if (promise) {
	      Promise.resolve(promise).done();
	    }
	  },

	  sendQueries: function sendQueries(queryRequests) {
	    var networkLayer = getCurrentNetworkLayer();
	    var promise = networkLayer.sendQueries(queryRequests);
	    if (promise) {
	      Promise.resolve(promise).done();
	    }
	  },

	  supports: function supports() {
	    var networkLayer = getCurrentNetworkLayer();
	    return networkLayer.supports.apply(networkLayer, arguments);
	  }
	};

	function getCurrentNetworkLayer() {
	  !injectedNetworkLayer ?  true ? invariant(false, 'RelayNetworkLayer: Use `injectNetworkLayer` to configure a network layer.') : invariant(false) : undefined;
	  return injectedNetworkLayer;
	}

	RelayProfiler.instrumentMethods(RelayNetworkLayer, {
	  sendMutation: 'RelayNetworkLayer.sendMutation',
	  sendQueries: 'RelayNetworkLayer.sendQueries'
	});

	module.exports = RelayNetworkLayer;

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule RelayQueryPath
	 * 
	 * @typechecks
	 */

	'use strict';

	var _classCallCheck = __webpack_require__(1)['default'];

	var _extends = __webpack_require__(8)['default'];

	var GraphQLStoreDataHandler = __webpack_require__(6);

	var RelayNodeInterface = __webpack_require__(12);
	var RelayQuery = __webpack_require__(3);

	var invariant = __webpack_require__(2);

	var ID = RelayNodeInterface.ID;
	var NODE_TYPE = RelayNodeInterface.NODE_TYPE;
	var TYPENAME = RelayNodeInterface.TYPENAME;

	var idField = RelayQuery.Field.build({
	  fieldName: ID,
	  type: 'String'
	});
	var typeField = RelayQuery.Field.build({
	  fieldName: TYPENAME,
	  type: 'String'
	});

	/**
	 * @internal
	 *
	 * Represents the path (root plus fields) within a query that fetched a
	 * particular node. Each step of the path may represent a root query (for
	 * refetchable nodes) or the field path from the nearest refetchable node.
	 */

	var RelayQueryPath = (function () {
	  function RelayQueryPath(node, parent) {
	    _classCallCheck(this, RelayQueryPath);

	    if (node instanceof RelayQuery.Root) {
	      !!parent ?  true ? invariant(false, 'RelayQueryPath: Root paths may not have a parent.') : invariant(false) : undefined;
	      this._name = node.getName();
	    } else {
	      !parent ?  true ? invariant(false, 'RelayQueryPath: A parent is required for field paths.') : invariant(false) : undefined;
	      this._name = parent.getName();
	    }
	    this._node = node;
	    this._parent = parent;
	  }

	  /**
	   * Returns true if this is a root path (the node is a root node with an ID),
	   * false otherwise.
	   */

	  RelayQueryPath.prototype.isRootPath = function isRootPath() {
	    return !this._parent;
	  };

	  /**
	   * Gets the parent path, throwing if it does not exist. Use `!isRootPath()`
	   * to check if there is a parent.
	   */

	  RelayQueryPath.prototype.getParent = function getParent() {
	    var parent = this._parent;
	    !parent ?  true ? invariant(false, 'RelayQueryPath.getParent(): Cannot get the parent of a root path.') : invariant(false) : undefined;
	    return parent;
	  };

	  /**
	   * Helper to get the name of the root query node.
	   */

	  RelayQueryPath.prototype.getName = function getName() {
	    return this._name;
	  };

	  /**
	   * Gets a new path that describes how to access the given `node` via the
	   * current path. Returns a new, root path if `dataID` is provided and
	   * refetchable, otherwise returns an extension of the current path.
	   */

	  RelayQueryPath.prototype.getPath = function getPath(node, dataID) {
	    if (GraphQLStoreDataHandler.isClientID(dataID)) {
	      return new RelayQueryPath(node, this);
	    } else {
	      var root = RelayQuery.Root.build(this.getName(), RelayNodeInterface.NODE, dataID, [idField, typeField], { identifyingArgName: RelayNodeInterface.ID }, NODE_TYPE);
	      return new RelayQueryPath(root);
	    }
	  };

	  /**
	   * Returns a new root query that follows only the fields in this path and then
	   * appends the specified field/fragment at the node reached by the path.
	   *
	   * The query also includes any ID fields along the way.
	   */

	  RelayQueryPath.prototype.getQuery = function getQuery(appendNode) {
	    var node = this._node;
	    var path = this;
	    var child = appendNode;
	    while (node instanceof RelayQuery.Field || node instanceof RelayQuery.Fragment) {
	      var idFieldName = node instanceof RelayQuery.Field ? node.getInferredPrimaryKey() : ID;
	      if (idFieldName) {
	        child = node.clone([child, node.getFieldByStorageKey(idFieldName), node.getFieldByStorageKey(TYPENAME)]);
	      } else {
	        child = node.clone([child]);
	      }
	      path = path._parent;
	      !path ?  true ? invariant(false, 'RelayQueryPath.getQuery(): Expected a parent path.') : invariant(false) : undefined;
	      node = path._node;
	    }
	    !child ?  true ? invariant(false, 'RelayQueryPath: Expected a leaf node.') : invariant(false) : undefined;
	    !(node instanceof RelayQuery.Root) ?  true ? invariant(false, 'RelayQueryPath: Expected a root node.') : invariant(false) : undefined;
	    var metadata = _extends({}, node.getConcreteQueryNode().metadata);
	    var identifyingArg = node.getIdentifyingArg();
	    if (identifyingArg && identifyingArg.name != null) {
	      metadata.identifyingArgName = identifyingArg.name;
	    }
	    return RelayQuery.Root.build(this.getName(), node.getFieldName(), identifyingArg && identifyingArg.value || null, [child, node.getFieldByStorageKey(ID), node.getFieldByStorageKey(TYPENAME)], metadata, node.getType());
	  };

	  return RelayQueryPath;
	})();

	module.exports = RelayQueryPath;

/***/ },
/* 27 */
/***/ function(module, exports) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule RelayRecordState
	 * 
	 * @typechecks
	 */

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var RelayRecordState = {
	  /**
	   * Record exists (either fetched from the server or produced by a local,
	   * optimistic update).
	   */
	  EXISTENT: 'EXISTENT',

	  /**
	   * Record is known not to exist (either as the result of a mutation, or
	   * because the server returned `null` when queried for the record).
	   */
	  NONEXISTENT: 'NONEXISTENT',

	  /**
	   * Record State is unknown because it has not yet been fetched from the
	   * server.
	   */
	  UNKNOWN: 'UNKNOWN'
	};

	module.exports = RelayRecordState;

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule forEachRootCallArg
	 * @typechecks
	 * 
	 */

	'use strict';

	var invariant = __webpack_require__(2);

	/**
	 * @internal
	 *
	 * Iterates over the identifying arguments in the supplied root call.
	 * If the identifying value is null or undefined, the supplied callback will be
	 * invoked once.
	 */
	function forEachRootCallArg(query, callback) {
	  !!query.getBatchCall() ?  true ? invariant(false, 'forEachRootCallArg(): Cannot iterate over batch call variables.') : invariant(false) : undefined;
	  function each(identifyingArgValue, fn) {
	    if (Array.isArray(identifyingArgValue)) {
	      identifyingArgValue.forEach(function (value) {
	        return each(value, fn);
	      });
	    } else if (identifyingArgValue == null) {
	      fn(identifyingArgValue);
	    } else {
	      !(typeof identifyingArgValue === 'string' || typeof identifyingArgValue === 'number') ?  true ? invariant(false, 'Relay: Expected arguments to root field `%s` to each be strings/' + 'numbers, got `%s`.', query.getFieldName(), JSON.stringify(identifyingArgValue)) : invariant(false) : undefined;
	      fn('' + identifyingArgValue);
	    }
	  }
	  var identifyingArg = query.getIdentifyingArg();
	  var identifyingArgValue = identifyingArg && identifyingArg.value || null;
	  each(identifyingArgValue, callback);
	}

	module.exports = forEachRootCallArg;

/***/ },
/* 29 */
/***/ function(module, exports) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule isCompatibleRelayFragmentType
	 * 
	 * @typechecks
	 */

	/**
	 * @internal
	 *
	 * Determine if the given fragment's type is compatible with the given record
	 * type. The types are considered compatible if they exactly match or in the
	 * following cases:
	 * - Types are not recorded for optimistic records; if the record type is null
	 *   it is assumed to be compatible with the fragment.
	 * - Abstract fragments are assumed to be compatible with all types; being more
	 *   precise would require access to the full schema inheritance hierarchy.
	 */
	'use strict';

	function isCompatibleRelayFragmentType(fragment, recordType) {
	  return recordType === fragment.getType() || !recordType || fragment.isAbstract();
	}

	module.exports = isCompatibleRelayFragmentType;

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	// optional / simple context binding
	var aFunction = __webpack_require__(183);
	module.exports = function(fn, that, length){
	  aFunction(fn);
	  if(that === undefined)return fn;
	  switch(length){
	    case 1: return function(a){
	      return fn.call(that, a);
	    };
	    case 2: return function(a, b){
	      return fn.call(that, a, b);
	    };
	    case 3: return function(a, b, c){
	      return fn.call(that, a, b, c);
	    };
	  }
	  return function(/* ...args */){
	    return fn.apply(that, arguments);
	  };
	};

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	var $          = __webpack_require__(14)
	  , createDesc = __webpack_require__(98);
	module.exports = __webpack_require__(42) ? function(object, key, value){
	  return $.setDesc(object, key, createDesc(1, value));
	} : function(object, key, value){
	  object[key] = value;
	  return object;
	};

/***/ },
/* 32 */
/***/ function(module, exports) {

	module.exports = function(it){
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

/***/ },
/* 33 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_33__;

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule RelayFragmentReference
	 * @typechecks
	 * 
	 */

	'use strict';

	var _classCallCheck = __webpack_require__(1)['default'];

	var _extends = __webpack_require__(8)['default'];

	var QueryBuilder = __webpack_require__(17);

	var forEachObject = __webpack_require__(9);
	var invariant = __webpack_require__(2);
	var warning = __webpack_require__(11);

	/**
	 * @internal
	 *
	 * RelayFragmentReference is the return type of fragment composition:
	 *
	 *   fragment on Foo {
	 *     ${Child.getFragment('bar', {baz: variables.qux})}
	 *   }
	 *
	 * Whereas a fragment defines a sub-query's structure, a fragment reference is
	 * a particular instantiation of the fragment as it is composed within a query
	 * or another fragment. It encodes the source fragment, initial variables, and
	 * a mapping from variables in the composing query's (or fragment's) scope to
	 * variables in the fragment's scope.
	 *
	 * The variable mapping is represented by `variableMapping`, a dictionary that
	 * maps from names of variables in the parent scope to variables that exist in
	 * the fragment. Example:
	 *
	 * ```
	 * // Fragment:
	 * var Container = Relay.createContainer(..., {
	 *   initialVariables: {
	 *     private: 'foo',
	 *     public: 'bar',
	 *     variable: null,
	 *   },
	 *   fragments: {
	 *     foo: ...
	 *   }
	 * });
	 *
	 * // Reference:
	 * ${Container.getQuery(
	 *   'foo',
	 *   // Variable Mapping:
	 *   {
	 *     public: 'BAR',
	 *     variable: variables.source,
	 *   }
	 * )}
	 * ```
	 *
	 * When evaluating the referenced fragment, `$public` will be overridden with
	 * `'Bar'`. The value of `$variable` will become the value of `$source` in the
	 * outer scope. This is analagous to:
	 *
	 * ```
	 * function inner(private = 'foo', public = 'bar', variable) {}
	 * function outer(source) {
	 *   inner(public = 'BAR', variable = source);
	 * }
	 * ```
	 *
	 * Where the value of the inner `variable` depends on how `outer` is called.
	 *
	 * The `prepareVariables` function allows for variables to be modified based on
	 * the runtime environment or route name.
	 */

	var RelayFragmentReference = (function () {
	  RelayFragmentReference.createForContainer = function createForContainer(fragmentGetter, initialVariables, variableMapping, prepareVariables) {
	    var reference = new RelayFragmentReference(fragmentGetter, initialVariables, variableMapping, prepareVariables);
	    reference._isContainerFragment = true;
	    return reference;
	  };

	  function RelayFragmentReference(fragmentGetter, initialVariables, variableMapping, prepareVariables) {
	    _classCallCheck(this, RelayFragmentReference);

	    this._initialVariables = initialVariables || {};
	    this._fragment = undefined;
	    this._fragmentGetter = fragmentGetter;
	    this._isContainerFragment = false;
	    this._isDeferred = false;
	    this._variableMapping = variableMapping;
	    this._prepareVariables = prepareVariables;
	  }

	  /**
	   * Mark this usage of the fragment as deferred.
	   */

	  RelayFragmentReference.prototype.defer = function defer() {
	    this._isDeferred = true;
	    return this;
	  };

	  /**
	   * Mark this fragment for inclusion only if the given variable is truthy.
	   */

	  RelayFragmentReference.prototype['if'] = function _if(value) {
	    var callVariable = QueryBuilder.getCallVariable(value);
	    !callVariable ?  true ? invariant(false, 'RelayFragmentReference: Invalid value `%s` supplied to `if()`. ' + 'Expected a variable.', callVariable) : invariant(false) : undefined;
	    this._addCondition(function (variables) {
	      return !!variables[callVariable.callVariableName];
	    });
	    return this;
	  };

	  /**
	   * Mark this fragment for inclusion only if the given variable is falsy.
	   */

	  RelayFragmentReference.prototype.unless = function unless(value) {
	    var callVariable = QueryBuilder.getCallVariable(value);
	    !callVariable ?  true ? invariant(false, 'RelayFragmentReference: Invalid value `%s` supplied to `unless()`. ' + 'Expected a variable.', callVariable) : invariant(false) : undefined;
	    this._addCondition(function (variables) {
	      return !variables[callVariable.callVariableName];
	    });
	    return this;
	  };

	  /**
	   * @private
	   */

	  RelayFragmentReference.prototype._getFragment = function _getFragment() {
	    var fragment = this._fragment;
	    if (fragment == null) {
	      fragment = this._fragmentGetter();
	      this._fragment = fragment;
	    }
	    return fragment;
	  };

	  /**
	   * Get the referenced fragment if all conditions are met.
	   */

	  RelayFragmentReference.prototype.getFragment = function getFragment(variables) {
	    // determine if the variables match the supplied if/unless conditions
	    var conditions = this._conditions;
	    if (conditions && !conditions.every(function (cb) {
	      return cb(variables);
	    })) {
	      return null;
	    }
	    return this._getFragment();
	  };

	  /**
	   * Get the variables to pass to the referenced fragment, accounting for
	   * initial values, overrides, and route-specific variables.
	   */

	  RelayFragmentReference.prototype.getVariables = function getVariables(route, variables) {
	    var _this = this;

	    var innerVariables = _extends({}, this._initialVariables);

	    // map variables from outer -> inner scope
	    var variableMapping = this._variableMapping;
	    if (variableMapping) {
	      forEachObject(variableMapping, function (value, name) {
	        var callVariable = QueryBuilder.getCallVariable(value);
	        if (callVariable) {
	          value = variables[callVariable.callVariableName];
	        }
	        if (value === undefined) {
	           true ? warning(false, 'RelayFragmentReference: Variable `%s` is undefined in fragment ' + '`%s`.', name, _this._getFragment().name) : undefined;
	        } else {
	          innerVariables[name] = value;
	        }
	      });
	    }

	    var prepareVariables = this._prepareVariables;
	    if (prepareVariables) {
	      innerVariables = prepareVariables(innerVariables, route);
	    }

	    return innerVariables;
	  };

	  RelayFragmentReference.prototype.isContainerFragment = function isContainerFragment() {
	    return this._isContainerFragment;
	  };

	  RelayFragmentReference.prototype.isDeferred = function isDeferred() {
	    return this._isDeferred;
	  };

	  RelayFragmentReference.prototype._addCondition = function _addCondition(condition) {
	    var conditions = this._conditions;
	    if (!conditions) {
	      conditions = [];
	      this._conditions = conditions;
	    }
	    conditions.push(condition);
	  };

	  return RelayFragmentReference;
	})();

	module.exports = RelayFragmentReference;

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule RelayPropTypes
	 * 
	 * @typechecks
	 */

	'use strict';

	var _require = __webpack_require__(33);

	var PropTypes = _require.PropTypes;

	var isRelayContainer = __webpack_require__(85);
	var sprintf = __webpack_require__(110);

	var RelayPropTypes = {
	  Container: function Container(props, propName, componentName) {
	    var component = props[propName];
	    if (component == null) {
	      return new Error(sprintf('Required prop `%s` was not specified in `%s`.', propName, componentName));
	    } else if (!isRelayContainer(component)) {
	      return new Error(sprintf('Invalid prop `%s` supplied to `%s`, expected a RelayContainer.', propName, componentName));
	    }
	    return null;
	  },

	  QueryConfig: PropTypes.shape({
	    name: PropTypes.string.isRequired,
	    params: PropTypes.object.isRequired,
	    queries: PropTypes.object.isRequired,
	    uri: PropTypes.object
	  })
	};

	module.exports = RelayPropTypes;

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule RelayStore
	 * @typechecks
	 * 
	 */

	'use strict';

	var GraphQLFragmentPointer = __webpack_require__(20);

	var RelayMutationTransaction = __webpack_require__(51);
	var RelayQuery = __webpack_require__(3);
	var RelayQueryResultObservable = __webpack_require__(134);
	var RelayStoreData = __webpack_require__(37);

	var forEachRootCallArg = __webpack_require__(28);
	var readRelayQueryData = __webpack_require__(86);

	var storeData = RelayStoreData.getDefaultInstance();
	var queryRunner = storeData.getQueryRunner();
	var queuedStore = storeData.getQueuedStore();

	/**
	 * @public
	 *
	 * RelayStore is a caching layer that records GraphQL response data and enables
	 * resolving and subscribing to queries.
	 *
	 * === onReadyStateChange ===
	 *
	 * Whenever Relay sends a request for data via GraphQL, an "onReadyStateChange"
	 * callback can be supplied. This callback is called one or more times with a
	 * `readyState` object with the following properties:
	 *
	 *   aborted: Whether the request was aborted.
	 *   done: Whether all response data has been fetched.
	 *   error: An error in the event of a failure, or null if none.
	 *   ready: Whether the queries are at least partially resolvable.
	 *   stale: When resolvable during `forceFetch`, whether data is stale.
	 *
	 * If the callback is invoked with `aborted`, `done`, or a non-null `error`, the
	 * callback will never be called again. Example usage:
	 *
	 *  function onReadyStateChange(readyState) {
	 *    if (readyState.aborted) {
	 *      // Request was aborted.
	 *    } else if (readyState.error) {
	 *      // Failure occurred.
	 *    } else if (readyState.ready) {
	 *      // Queries are at least partially resolvable.
	 *      if (readyState.done) {
	 *        // Queries are completely resolvable.
	 *      }
	 *    }
	 *  }
	 *
	 */
	var RelayStore = {

	  /**
	   * Primes the store by sending requests for any missing data that would be
	   * required to satisfy the supplied set of queries.
	   */
	  primeCache: function primeCache(querySet, callback) {
	    return queryRunner.run(querySet, callback);
	  },

	  /**
	   * Forces the supplied set of queries to be fetched and written to the store.
	   * Any data that previously satisfied the queries will be overwritten.
	   */
	  forceFetch: function forceFetch(querySet, callback) {
	    return queryRunner.forceFetch(querySet, callback);
	  },

	  /**
	   * Reads query data anchored at the supplied data ID.
	   */
	  read: function read(node, dataID, options) {
	    return readRelayQueryData(storeData, node, dataID, options).data;
	  },

	  /**
	   * Reads query data anchored at the supplied data IDs.
	   */
	  readAll: function readAll(node, dataIDs, options) {
	    return dataIDs.map(function (dataID) {
	      return readRelayQueryData(storeData, node, dataID, options).data;
	    });
	  },

	  /**
	   * Reads query data, where each element in the result array corresponds to a
	   * root call argument. If the root call has no arguments, the result array
	   * will contain exactly one element.
	   */
	  readQuery: function readQuery(root, options) {
	    var storageKey = root.getStorageKey();
	    var results = [];
	    forEachRootCallArg(root, function (identifyingArgValue) {
	      var data;
	      var dataID = queuedStore.getDataID(storageKey, identifyingArgValue);
	      if (dataID != null) {
	        data = RelayStore.read(root, dataID, options);
	      }
	      results.push(data);
	    });
	    return results;
	  },

	  /**
	   * Reads and subscribes to query data anchored at the supplied data ID. The
	   * returned observable emits updates as the data changes over time.
	   */
	  observe: function observe(fragment, dataID) {
	    var fragmentPointer = new GraphQLFragmentPointer(fragment.isPlural() ? [dataID] : dataID, fragment);
	    return new RelayQueryResultObservable(storeData, fragmentPointer);
	  },

	  applyUpdate: function applyUpdate(mutation, callbacks) {
	    return storeData.getMutationQueue().createTransaction(mutation, callbacks);
	  },

	  update: function update(mutation, callbacks) {
	    this.applyUpdate(mutation, callbacks).commit();
	  }
	};

	module.exports = RelayStore;

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule RelayStoreData
	 * 
	 * @typechecks
	 */

	'use strict';

	var _classCallCheck = __webpack_require__(1)['default'];

	var _Object$keys = __webpack_require__(10)['default'];

	var GraphQLQueryRunner = __webpack_require__(111);
	var GraphQLStoreChangeEmitter = __webpack_require__(113);
	var GraphQLStoreDataHandler = __webpack_require__(6);
	var GraphQLStoreRangeUtils = __webpack_require__(114);
	var RelayChangeTracker = __webpack_require__(76);

	var RelayConnectionInterface = __webpack_require__(7);

	var RelayGarbageCollector = __webpack_require__(119);
	var RelayMutationQueue = __webpack_require__(123);

	var RelayNodeInterface = __webpack_require__(12);
	var RelayPendingQueryTracker = __webpack_require__(129);
	var RelayProfiler = __webpack_require__(4);
	var RelayQuery = __webpack_require__(3);
	var RelayQueryTracker = __webpack_require__(135);
	var RelayQueryWriter = __webpack_require__(136);
	var RelayRecordStore = __webpack_require__(138);

	var forEachObject = __webpack_require__(9);
	var invariant = __webpack_require__(2);
	var generateForceIndex = __webpack_require__(83);
	var readRelayDiskCache = __webpack_require__(159);
	var warning = __webpack_require__(11);
	var writeRelayQueryPayload = __webpack_require__(165);
	var writeRelayUpdatePayload = __webpack_require__(166);

	var CLIENT_MUTATION_ID = RelayConnectionInterface.CLIENT_MUTATION_ID;
	var NODE_TYPE = RelayNodeInterface.NODE_TYPE;

	// The source of truth for application data.
	var _instance;

	/**
	 * @internal
	 *
	 * Wraps the data caches and associated metadata tracking objects used by
	 * GraphQLStore/RelayStore.
	 */

	var RelayStoreData = (function () {

	  /**
	   * Get the data set backing actual Relay operations. Used in GraphQLStore.
	   */

	  RelayStoreData.getDefaultInstance = function getDefaultInstance() {
	    if (!_instance) {
	      _instance = new RelayStoreData();
	    }
	    return _instance;
	  };

	  function RelayStoreData() {
	    _classCallCheck(this, RelayStoreData);

	    var cachedRecords = {};
	    var cachedRootCallMap = {};
	    var queuedRecords = {};
	    var records = {};
	    var rootCallMap = {};
	    var nodeRangeMap = {};

	    var _createRecordCollection = createRecordCollection({
	      cachedRecords: cachedRecords,
	      cachedRootCallMap: cachedRootCallMap,
	      cacheWriter: null,
	      queuedRecords: queuedRecords,
	      nodeRangeMap: nodeRangeMap,
	      records: records,
	      rootCallMap: rootCallMap
	    });

	    var cachedStore = _createRecordCollection.cachedStore;
	    var queuedStore = _createRecordCollection.queuedStore;
	    var recordStore = _createRecordCollection.recordStore;

	    var rangeData = new GraphQLStoreRangeUtils();

	    this._cacheManager = null;
	    this._cachedRecords = cachedRecords;
	    this._cachedRootCallMap = cachedRootCallMap;
	    this._cachedStore = cachedStore;
	    this._changeEmitter = new GraphQLStoreChangeEmitter(rangeData);
	    this._mutationQueue = new RelayMutationQueue(this);
	    this._nodeRangeMap = nodeRangeMap;
	    this._pendingQueryTracker = new RelayPendingQueryTracker(this);
	    this._queryRunner = new GraphQLQueryRunner(this);
	    this._queryTracker = new RelayQueryTracker();
	    this._queuedRecords = queuedRecords;
	    this._queuedStore = queuedStore;
	    this._records = records;
	    this._recordStore = recordStore;
	    this._rangeData = rangeData;
	    this._rootCallMap = rootCallMap;
	  }

	  /**
	   * Creates a garbage collector for this instance. After initialization all
	   * newly added DataIDs will be registered in the created garbage collector.
	   * This will show a warning if data has already been added to the instance.
	   */

	  RelayStoreData.prototype.initializeGarbageCollector = function initializeGarbageCollector(scheduler) {
	    !!this._garbageCollector ?  true ? invariant(false, 'RelayStoreData: Garbage collector is already initialized.') : invariant(false) : undefined;
	    var shouldInitialize = this._isStoreDataEmpty();
	     true ? warning(shouldInitialize, 'RelayStoreData: Garbage collection can only be initialized when no ' + 'data is present.') : undefined;
	    if (shouldInitialize) {
	      this._garbageCollector = new RelayGarbageCollector(this, scheduler);
	    }
	  };

	  /**
	   * Sets/clears the cache manager that is used to cache changes written to
	   * the store.
	   */

	  RelayStoreData.prototype.injectCacheManager = function injectCacheManager(cacheManager) {
	    var _createRecordCollection2 = createRecordCollection({
	      cachedRecords: this._cachedRecords,
	      cachedRootCallMap: this._cachedRootCallMap,
	      cacheWriter: cacheManager ? cacheManager.getQueryWriter() : null,
	      queuedRecords: this._queuedRecords,
	      nodeRangeMap: this._nodeRangeMap,
	      records: this._records,
	      rootCallMap: this._rootCallMap
	    });

	    var cachedStore = _createRecordCollection2.cachedStore;
	    var queuedStore = _createRecordCollection2.queuedStore;
	    var recordStore = _createRecordCollection2.recordStore;

	    this._cacheManager = cacheManager;
	    this._cachedStore = cachedStore;
	    this._queuedStore = queuedStore;
	    this._recordStore = recordStore;
	  };

	  RelayStoreData.prototype.clearCacheManager = function clearCacheManager() {
	    var _createRecordCollection3 = createRecordCollection({
	      cachedRecords: this._cachedRecords,
	      cachedRootCallMap: this._cachedRootCallMap,
	      cacheWriter: null,
	      queuedRecords: this._queuedRecords,
	      nodeRangeMap: this._nodeRangeMap,
	      records: this._records,
	      rootCallMap: this._rootCallMap
	    });

	    var cachedStore = _createRecordCollection3.cachedStore;
	    var queuedStore = _createRecordCollection3.queuedStore;
	    var recordStore = _createRecordCollection3.recordStore;

	    this._cacheManager = null;
	    this._cachedStore = cachedStore;
	    this._queuedStore = queuedStore;
	    this._recordStore = recordStore;
	  };

	  RelayStoreData.prototype.hasCacheManager = function hasCacheManager() {
	    return !!this._cacheManager;
	  };

	  /**
	   * Returns whether a given record is affected by an optimistic update.
	   */

	  RelayStoreData.prototype.hasOptimisticUpdate = function hasOptimisticUpdate(dataID) {
	    dataID = this.getRangeData().getCanonicalClientID(dataID);
	    return this.getQueuedStore().hasOptimisticUpdate(dataID);
	  };

	  /**
	   * Returns a list of client mutation IDs for queued mutations whose optimistic
	   * updates are affecting the record corresponding the given dataID. Returns
	   * null if the record isn't affected by any optimistic updates.
	   */

	  RelayStoreData.prototype.getClientMutationIDs = function getClientMutationIDs(dataID) {
	    dataID = this.getRangeData().getCanonicalClientID(dataID);
	    return this.getQueuedStore().getClientMutationIDs(dataID);
	  };

	  /**
	   * Reads data for queries incrementally from disk cache.
	   * It calls onSuccess when all the data has been loaded into memory.
	   * It calls onFailure when some data is unabled to be satisfied from disk.
	   */

	  RelayStoreData.prototype.readFromDiskCache = function readFromDiskCache(queries, callbacks) {
	    var _this = this;

	    var cacheManager = this._cacheManager;
	    !cacheManager ?  true ? invariant(false, 'RelayStoreData: `readFromDiskCache` should only be called when cache ' + 'manager is available.') : invariant(false) : undefined;
	    var changeTracker = new RelayChangeTracker();
	    var profile = RelayProfiler.profile('RelayStoreData.readFromDiskCache');
	    readRelayDiskCache(queries, this._queuedStore, this._cachedRecords, this._cachedRootCallMap, cacheManager, changeTracker, {
	      onSuccess: function onSuccess() {
	        _this._handleChangedAndNewDataIDs(changeTracker.getChangeSet());
	        profile.stop();
	        callbacks.onSuccess && callbacks.onSuccess();
	      },
	      onFailure: function onFailure() {
	        _this._handleChangedAndNewDataIDs(changeTracker.getChangeSet());
	        profile.stop();
	        callbacks.onFailure && callbacks.onFailure();
	      }
	    });
	  };

	  /**
	   * Write the results of a query into the base record store.
	   */

	  RelayStoreData.prototype.handleQueryPayload = function handleQueryPayload(query, response, forceIndex) {
	    var profiler = RelayProfiler.profile('RelayStoreData.handleQueryPayload');
	    var changeTracker = new RelayChangeTracker();
	    var writer = new RelayQueryWriter(this._recordStore, this._queryTracker, changeTracker, {
	      forceIndex: forceIndex,
	      updateTrackedQueries: true
	    });
	    writeRelayQueryPayload(writer, query, response);
	    this._handleChangedAndNewDataIDs(changeTracker.getChangeSet());
	    profiler.stop();
	  };

	  /**
	   * Write the results of an update into the base record store.
	   */

	  RelayStoreData.prototype.handleUpdatePayload = function handleUpdatePayload(operation, payload, _ref) {
	    var configs = _ref.configs;
	    var isOptimisticUpdate = _ref.isOptimisticUpdate;

	    var profiler = RelayProfiler.profile('RelayStoreData.handleUpdatePayload');
	    var changeTracker = new RelayChangeTracker();
	    var store;
	    if (isOptimisticUpdate) {
	      var clientMutationID = payload[CLIENT_MUTATION_ID];
	      !(typeof clientMutationID === 'string') ?  true ? invariant(false, 'RelayStoreData.handleUpdatePayload(): Expected optimistic payload ' + 'to have a valid `%s`.', CLIENT_MUTATION_ID) : invariant(false) : undefined;
	      store = this.getRecordStoreForOptimisticMutation(clientMutationID);
	    } else {
	      store = this._getRecordStoreForMutation();
	    }
	    var writer = new RelayQueryWriter(store, this._queryTracker, changeTracker, {
	      forceIndex: generateForceIndex(),
	      isOptimisticUpdate: isOptimisticUpdate,
	      updateTrackedQueries: false
	    });
	    writeRelayUpdatePayload(writer, operation, payload, { configs: configs, isOptimisticUpdate: isOptimisticUpdate });
	    this._handleChangedAndNewDataIDs(changeTracker.getChangeSet());
	    profiler.stop();
	  };

	  /**
	   * Given a query fragment and a data ID, returns a root query that applies
	   * the fragment to the object specified by the data ID.
	   */

	  RelayStoreData.prototype.buildFragmentQueryForDataID = function buildFragmentQueryForDataID(fragment, dataID) {
	    if (GraphQLStoreDataHandler.isClientID(dataID)) {
	      var path = this._queuedStore.getPathToRecord(this._rangeData.getCanonicalClientID(dataID));
	      !path ?  true ? invariant(false, 'RelayStoreData.buildFragmentQueryForDataID(): Cannot refetch ' + 'record `%s` without a path.', dataID) : invariant(false) : undefined;
	      return path.getQuery(fragment);
	    }
	    // Fragment fields cannot be spread directly into the root because they
	    // may not exist on the `Node` type.
	    return RelayQuery.Root.build(fragment.getDebugName() || 'UnknownQuery', RelayNodeInterface.NODE, dataID, [fragment], { identifyingArgName: RelayNodeInterface.ID }, NODE_TYPE);
	  };

	  RelayStoreData.prototype.getNodeData = function getNodeData() {
	    return this._records;
	  };

	  RelayStoreData.prototype.getQueuedData = function getQueuedData() {
	    return this._queuedRecords;
	  };

	  RelayStoreData.prototype.clearQueuedData = function clearQueuedData() {
	    var _this2 = this;

	    forEachObject(this._queuedRecords, function (_, key) {
	      delete _this2._queuedRecords[key];
	      _this2._changeEmitter.broadcastChangeForID(key);
	    });
	  };

	  RelayStoreData.prototype.getCachedData = function getCachedData() {
	    return this._cachedRecords;
	  };

	  RelayStoreData.prototype.getGarbageCollector = function getGarbageCollector() {
	    return this._garbageCollector;
	  };

	  RelayStoreData.prototype.getMutationQueue = function getMutationQueue() {
	    return this._mutationQueue;
	  };

	  /**
	   * Get the record store with only the cached and base data (no queued data).
	   */

	  RelayStoreData.prototype.getCachedStore = function getCachedStore() {
	    return this._cachedStore;
	  };

	  /**
	   * Get the record store with full data (cached, base, queued).
	   */

	  RelayStoreData.prototype.getQueuedStore = function getQueuedStore() {
	    return this._queuedStore;
	  };

	  /**
	   * Get the record store with only the base data (no queued/cached data).
	   */

	  RelayStoreData.prototype.getRecordStore = function getRecordStore() {
	    return this._recordStore;
	  };

	  RelayStoreData.prototype.getQueryTracker = function getQueryTracker() {
	    return this._queryTracker;
	  };

	  RelayStoreData.prototype.getQueryRunner = function getQueryRunner() {
	    return this._queryRunner;
	  };

	  RelayStoreData.prototype.getChangeEmitter = function getChangeEmitter() {
	    return this._changeEmitter;
	  };

	  RelayStoreData.prototype.getRangeData = function getRangeData() {
	    return this._rangeData;
	  };

	  RelayStoreData.prototype.getPendingQueryTracker = function getPendingQueryTracker() {
	    return this._pendingQueryTracker;
	  };

	  /**
	   * @deprecated
	   *
	   * Used temporarily by GraphQLStore, but all updates to this object are now
	   * handled through a `RelayRecordStore` instance.
	   */

	  RelayStoreData.prototype.getRootCallData = function getRootCallData() {
	    return this._rootCallMap;
	  };

	  RelayStoreData.prototype._isStoreDataEmpty = function _isStoreDataEmpty() {
	    return _Object$keys(this._records).length === 0 && _Object$keys(this._queuedRecords).length === 0 && _Object$keys(this._cachedRecords).length === 0;
	  };

	  /**
	   * Given a ChangeSet, broadcasts changes for updated DataIDs
	   * and registers new DataIDs with the garbage collector.
	   */

	  RelayStoreData.prototype._handleChangedAndNewDataIDs = function _handleChangedAndNewDataIDs(changeSet) {
	    var _this3 = this;

	    var updatedDataIDs = _Object$keys(changeSet.updated);
	    updatedDataIDs.forEach(function (id) {
	      return _this3._changeEmitter.broadcastChangeForID(id);
	    });
	    if (this._garbageCollector) {
	      var createdDataIDs = _Object$keys(changeSet.created);
	      var garbageCollector = this._garbageCollector;
	      createdDataIDs.forEach(function (dataID) {
	        return garbageCollector.register(dataID);
	      });
	    }
	  };

	  RelayStoreData.prototype._getRecordStoreForMutation = function _getRecordStoreForMutation() {
	    var records = this._records;
	    var rootCallMap = this._rootCallMap;

	    return new RelayRecordStore({ records: records }, { rootCallMap: rootCallMap }, this._nodeRangeMap, this._cacheManager ? this._cacheManager.getMutationWriter() : null);
	  };

	  RelayStoreData.prototype.getRecordStoreForOptimisticMutation = function getRecordStoreForOptimisticMutation(clientMutationID) {
	    var cachedRecords = this._cachedRecords;
	    var cachedRootCallMap = this._cachedRootCallMap;
	    var rootCallMap = this._rootCallMap;
	    var queuedRecords = this._queuedRecords;
	    var records = this._records;

	    return new RelayRecordStore({ cachedRecords: cachedRecords, queuedRecords: queuedRecords, records: records }, { cachedRootCallMap: cachedRootCallMap, rootCallMap: rootCallMap }, this._nodeRangeMap, null, // don't cache optimistic data
	    clientMutationID);
	  };

	  return RelayStoreData;
	})();

	function createRecordCollection(_ref2) {
	  var cachedRecords = _ref2.cachedRecords;
	  var cachedRootCallMap = _ref2.cachedRootCallMap;
	  var cacheWriter = _ref2.cacheWriter;
	  var queuedRecords = _ref2.queuedRecords;
	  var nodeRangeMap = _ref2.nodeRangeMap;
	  var records = _ref2.records;
	  var rootCallMap = _ref2.rootCallMap;

	  return {
	    queuedStore: new RelayRecordStore({ cachedRecords: cachedRecords, queuedRecords: queuedRecords, records: records }, { cachedRootCallMap: cachedRootCallMap, rootCallMap: rootCallMap }, nodeRangeMap),
	    cachedStore: new RelayRecordStore({ cachedRecords: cachedRecords, records: records }, { cachedRootCallMap: cachedRootCallMap, rootCallMap: rootCallMap }, nodeRangeMap, cacheWriter),
	    recordStore: new RelayRecordStore({ records: records }, { rootCallMap: rootCallMap }, nodeRangeMap, cacheWriter)
	  };
	}

	RelayProfiler.instrumentMethods(RelayStoreData.prototype, {
	  handleQueryPayload: 'RelayStoreData.prototype.handleQueryPayload',
	  handleUpdatePayload: 'RelayStoreData.prototype.handleUpdatePayload'
	});

	module.exports = RelayStoreData;

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule serializeRelayQueryCall
	 * @typechecks
	 * 
	 */

	'use strict';

	var flattenArray = __webpack_require__(209);

	/**
	 * @internal
	 *
	 * Serializes a query "call" (a legacy combination of field and argument value).
	 */
	function serializeRelayQueryCall(call) {
	  var value = call.value;

	  var valueString;
	  if (Array.isArray(value)) {
	    valueString = flattenArray(value).map(sanitizeCallValue).join(',');
	  } else if (value != null) {
	    valueString = sanitizeCallValue(value);
	  } else {
	    valueString = '';
	  }
	  return '.' + call.name + '(' + valueString + ')';
	}

	function sanitizeCallValue(value) {
	  if (value == null) {
	    return '';
	  }
	  // Special case for FB GraphQL to resolve ambiguity around "empty" arguments.
	  if (value === '') {
	    return '\ ';
	  }
	  if (typeof value !== 'string') {
	    value = JSON.stringify(value);
	  }
	  value = value.replace(/[)(}{><,.\\]/g, '\\$&');
	  // Works around a bug in Legacy GraphQL, see Task #7599025.
	  if (/ $/.test(value)) {
	    value += ' ';
	  }
	  return value.replace(/^( *)(.*?)( *)$/, function (_, prefix, body, suffix) {
	    return '\\ '.repeat(prefix.length) + body + '\\ '.repeat(suffix.length);
	  });
	}

	module.exports = serializeRelayQueryCall;

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(180), __esModule: true };

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(32);
	module.exports = function(it){
	  if(!isObject(it))throw TypeError(it + ' is not an object!');
	  return it;
	};

/***/ },
/* 41 */
/***/ function(module, exports) {

	// 7.2.1 RequireObjectCoercible(argument)
	module.exports = function(it){
	  if(it == undefined)throw TypeError("Can't call method on  " + it);
	  return it;
	};

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	// Thank's IE8 for his funny defineProperty
	module.exports = !__webpack_require__(43)(function(){
	  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ },
/* 43 */
/***/ function(module, exports) {

	module.exports = function(exec){
	  try {
	    return !!exec();
	  } catch(e){
	    return true;
	  }
	};

/***/ },
/* 44 */
/***/ function(module, exports) {

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global = module.exports = typeof window != 'undefined' && window.Math == Math
	  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
	if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $at  = __webpack_require__(194)(true);

	// 21.1.3.27 String.prototype[@@iterator]()
	__webpack_require__(63)(String, 'String', function(iterated){
	  this._t = String(iterated); // target
	  this._i = 0;                // next index
	// 21.1.5.2.1 %StringIteratorPrototype%.next()
	}, function(){
	  var O     = this._t
	    , index = this._i
	    , point;
	  if(index >= O.length)return {value: undefined, done: true};
	  point = $at(O, index);
	  this._i += point.length;
	  return {value: point, done: false};
	});

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @typechecks
	 * 
	 */

	'use strict';

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var Promise = __webpack_require__(16);

	/**
	 * Deferred provides a Promise-like API that exposes methods to resolve and
	 * reject the Promise. It is most useful when converting non-Promise code to use
	 * Promises.
	 *
	 * If you want to export the Promise without exposing access to the resolve and
	 * reject methods, you should export `getPromise` which returns a Promise with
	 * the same semantics excluding those methods.
	 */

	var Deferred = (function () {
	  function Deferred() {
	    var _this = this;

	    _classCallCheck(this, Deferred);

	    this._settled = false;
	    this._promise = new Promise(function (resolve, reject) {
	      _this._resolve = resolve;
	      _this._reject = reject;
	    });
	  }

	  Deferred.prototype.getPromise = function getPromise() {
	    return this._promise;
	  };

	  Deferred.prototype.resolve = function resolve(value) {
	    this._settled = true;
	    this._resolve(value);
	  };

	  Deferred.prototype.reject = function reject(reason) {
	    this._settled = true;
	    this._reject(reason);
	  };

	  Deferred.prototype.then = function then() {
	    return Promise.prototype.then.apply(this._promise, arguments);
	  };

	  Deferred.prototype.done = function done() {
	    Promise.prototype.done.apply(this._promise, arguments);
	  };

	  Deferred.prototype.isSettled = function isSettled() {
	    return this._settled;
	  };

	  return Deferred;
	})();

	module.exports = Deferred;

/***/ },
/* 47 */
/***/ function(module, exports) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * 
	 */

	'use strict';

	var BASE62 = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

	function base62(number) {
	  if (!number) {
	    return '0';
	  }
	  var string = '';
	  while (number > 0) {
	    string = BASE62[number % 62] + string;
	    number = Math.floor(number / 62);
	  }
	  return string;
	}

	module.exports = base62;

/***/ },
/* 48 */
/***/ function(module, exports) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 */

	'use strict';

	var hasOwnProperty = Object.prototype.hasOwnProperty;

	/**
	 * Executes the provided `callback` once for each enumerable own property in the
	 * object and constructs a new object from the results. The `callback` is
	 * invoked with three arguments:
	 *
	 *  - the property value
	 *  - the property name
	 *  - the object being traversed
	 *
	 * Properties that are added after the call to `mapObject` will not be visited
	 * by `callback`. If the values of existing properties are changed, the value
	 * passed to `callback` will be the value at the time `mapObject` visits them.
	 * Properties that are deleted before being visited are not visited.
	 *
	 * @grep function objectMap()
	 * @grep function objMap()
	 *
	 * @param {?object} object
	 * @param {function} callback
	 * @param {*} context
	 * @return {?object}
	 */
	function mapObject(object, callback, context) {
	  if (!object) {
	    return null;
	  }
	  var result = {};
	  for (var name in object) {
	    if (hasOwnProperty.call(object, name)) {
	      result[name] = callback.call(context, object[name], name, object);
	    }
	  }
	  return result;
	}

	module.exports = mapObject;

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * 
	 */

	'use strict';

	var Promise = __webpack_require__(16);

	var resolvedPromise = Promise.resolve();

	/**
	 * An alternative to setImmediate based on Promise.
	 */
	function resolveImmediate(callback) {
	  resolvedPromise.then(callback)['catch'](throwNext);
	}

	function throwNext(error) {
	  setTimeout(function () {
	    throw error;
	  }, 0);
	}

	module.exports = resolveImmediate;

/***/ },
/* 50 */
/***/ function(module, exports) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule GraphQLMutatorConstants
	 * @typechecks
	 */

	'use strict';

	var GraphQLMutatorConstants = {
	  APPEND: 'append',
	  PREPEND: 'prepend',
	  REMOVE: 'remove',

	  NODE_DELETE_HANDLER: 'node_delete',
	  RANGE_ADD_HANDLER: 'range_add',
	  RANGE_DELETE_HANDLER: 'range_delete',

	  HANDLER_TYPES: {},

	  OPTIMISTIC_UPDATE: 'optimistic',
	  SERVER_UPDATE: 'server',
	  POLLER_UPDATE: 'poller',

	  UPDATE_TYPES: {},

	  RANGE_OPERATIONS: {}
	};

	GraphQLMutatorConstants.HANDLER_TYPES[GraphQLMutatorConstants.NODE_DELETE_HANDLER] = true;
	GraphQLMutatorConstants.HANDLER_TYPES[GraphQLMutatorConstants.RANGE_ADD_HANDLER] = true;
	GraphQLMutatorConstants.HANDLER_TYPES[GraphQLMutatorConstants.RANGE_DELETE_HANDLER] = true;

	GraphQLMutatorConstants.UPDATE_TYPES[GraphQLMutatorConstants.OPTIMISTIC_UPDATE] = true;
	GraphQLMutatorConstants.UPDATE_TYPES[GraphQLMutatorConstants.SERVER_UPDATE] = true;
	GraphQLMutatorConstants.UPDATE_TYPES[GraphQLMutatorConstants.POLLER_UPDATE] = true;

	GraphQLMutatorConstants.RANGE_OPERATIONS[GraphQLMutatorConstants.APPEND] = true;
	GraphQLMutatorConstants.RANGE_OPERATIONS[GraphQLMutatorConstants.PREPEND] = true;
	GraphQLMutatorConstants.RANGE_OPERATIONS[GraphQLMutatorConstants.REMOVE] = true;

	module.exports = GraphQLMutatorConstants;

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule RelayMutationTransaction
	 * @typechecks
	 * 
	 */

	'use strict';

	var _classCallCheck = __webpack_require__(1)['default'];

	var RelayMutationTransactionStatus = __webpack_require__(77);

	var invariant = __webpack_require__(2);

	/**
	 * @internal
	 */

	var RelayMutationTransaction = (function () {
	  function RelayMutationTransaction(mutationQueue, id) {
	    _classCallCheck(this, RelayMutationTransaction);

	    this._id = id;
	    this._mutationQueue = mutationQueue;
	  }

	  RelayMutationTransaction.prototype.commit = function commit() {
	    var status = this.getStatus();
	    !(status === RelayMutationTransactionStatus.UNCOMMITTED) ?  true ? invariant(false, 'RelayMutationTransaction: Only transactions with status `UNCOMMITTED` ' + 'can be comitted.') : invariant(false) : undefined;

	    this._mutationQueue.commit(this._id);
	  };

	  RelayMutationTransaction.prototype.recommit = function recommit() {
	    var status = this.getStatus();
	    !(status === RelayMutationTransactionStatus.COMMIT_FAILED || status === RelayMutationTransactionStatus.COLLISION_COMMIT_FAILED) ?  true ? invariant(false, 'RelayMutationTransaction: Only transaction with status ' + '`COMMIT_FAILED` or `COLLISION_COMMIT_FAILED` can be comitted.') : invariant(false) : undefined;

	    this._mutationQueue.commit(this._id);
	  };

	  RelayMutationTransaction.prototype.rollback = function rollback() {
	    var status = this.getStatus();
	    !(status === RelayMutationTransactionStatus.UNCOMMITTED || status === RelayMutationTransactionStatus.COMMIT_FAILED || status === RelayMutationTransactionStatus.COLLISION_COMMIT_FAILED) ?  true ? invariant(false, 'RelayMutationTransaction: Only transactions with status `UNCOMMITTED` ' + '`COMMIT_FAILED` or `COLLISION_COMMIT_FAILED` can be rolledback.') : invariant(false) : undefined;

	    this._mutationQueue.rollback(this._id);
	  };

	  RelayMutationTransaction.prototype.getError = function getError() {
	    return this._mutationQueue.getError(this._id);
	  };

	  RelayMutationTransaction.prototype.getStatus = function getStatus() {
	    return this._mutationQueue.getStatus(this._id);
	  };

	  return RelayMutationTransaction;
	})();

	module.exports = RelayMutationTransaction;

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule RelayQueryTransform
	 * 
	 * @typechecks
	 */

	'use strict';

	var _inherits = __webpack_require__(5)['default'];

	var _classCallCheck = __webpack_require__(1)['default'];

	var RelayQueryVisitor = __webpack_require__(18);

	/**
	 * @internal
	 *
	 * `RelayQueryTransform` is a `RelayQueryVisitor` subclass that simplifies the
	 * process of traversing, filtering, or transforming a Relay Query.
	 *
	 * The traversal is a map operation from `RelayQuery` nodes to nodes. The
	 * default implementation traverses all nodes and maps each one to its
	 * original value (ie. a no-op).
	 *
	 * Just like `RelayQueryVisitor`, subclasses of `RelayQueryTransform` can
	 * optionally implement methods to customize the traversal and mapping of
	 * different RelayQuery node types:
	 *
	 * - `visitField(field, state)`: Returns the new value for the visited field, or
	 *   `null` to remove it from the output.
	 * - `visitFragment(fragment, state)`: Returns the new value for the visited
	 *   fragment, or `null` to remove it from the output.
	 * - `visitQuery(fragment, state)`: Returns the new value for the top-level
	 *   query, or `null` to transform the entire query out of existence.
	 *
	 * There are two additional methods for controlling the traversal:
	 *
	 * - `traverse(parent, state)`: Returns a cloned copy of the parent node after
	 *   processing all of its children. Does not clone if nothing changed.
	 * - `visit(child, state)`: Processes the child node, calling the appropriate
	 *   `visit{Field,Fragment,Root` method based on the node type.
	 *
	 * All of these methods may return the original node in order to leave it
	 * intact.
	 *
	 * @see RelayQueryVisitor
	 */

	var RelayQueryTransform = (function (_RelayQueryVisitor) {
	  _inherits(RelayQueryTransform, _RelayQueryVisitor);

	  function RelayQueryTransform() {
	    _classCallCheck(this, RelayQueryTransform);

	    _RelayQueryVisitor.apply(this, arguments);
	  }

	  RelayQueryTransform.prototype.traverse = function traverse(node, nextState) {
	    var _this = this;

	    if (node.isScalar()) {
	      return node;
	    }
	    var nextChildren = undefined;
	    this.traverseChildren(node, nextState, function (child, index, children) {
	      var prevChild = children[index];
	      var nextChild = _this.visit(prevChild, nextState);
	      if (nextChild !== prevChild) {
	        nextChildren = nextChildren || children.slice(0, index);
	      }
	      if (nextChildren && nextChild) {
	        nextChildren.push(nextChild);
	      }
	    });
	    if (nextChildren) {
	      if (!nextChildren.length) {
	        return null;
	      }
	      return node.clone(nextChildren);
	    }
	    return node;
	  };

	  return RelayQueryTransform;
	})(RelayQueryVisitor);

	module.exports = RelayQueryTransform;

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Promise = __webpack_require__(16);

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule RelayTaskScheduler
	 * @typechecks
	 * 
	 */

	'use strict';

	var invariant = __webpack_require__(2);

	var queue = [];
	var schedule;
	var running = false;

	/**
	 * Task scheduler used by Relay internals. Each task is a synchronous unit of
	 * work that can be deferred by an injected scheduler function. For example,
	 * an injected scheduler can defer each task to the next animation frame:
	 *
	 *   RelayTaskScheduler.injectScheduler(function(executeTask) {
	 *     // This function will be invoked whenever a task is enqueued. It will not
	 *     // be invoked again until `executeTask` has been invoked. Also, invoking
	 *     // `executeTask` more than once is an error.
	 *     requestAnimationFrame(executeTask);
	 *   });
	 *
	 * By default, the next task is executed synchronously after the previous one is
	 * finished. An injected scheduler using `setImmediate` can alter this behavior.
	 */
	var RelayTaskScheduler = {
	  /**
	   * @public
	   *
	   * Injects a scheduling function that is invoked with a callback that will
	   * execute the next unit of work. The callback will return a promise that
	   * resolves with a new callback when the next unit of work is available.
	   */
	  injectScheduler: function injectScheduler(injectedScheduler) {
	    schedule = injectedScheduler;
	  },

	  /**
	   * @internal
	   *
	   * Enqueues one or more callbacks that each represent a synchronous unit of
	   * work that can be scheduled to be executed at a later time.
	   *
	   * The return value of each callback will be passed in as an argument to the
	   * next callback. If one of the callbacks throw an error, the execution will
	   * be aborted and the returned promise be rejected with the thrown error.
	   * Otherwise, the returned promise will be resolved with the return value of
	   * the last callback. For example:
	   *
	   *   RelayTaskScheduler.enqueue(
	   *     function() {
	   *       return 'foo';
	   *     },
	   *     function(foo) {
	   *       return 'bar';
	   *     }
	   *   ).then(
	   *     function(bar) {
	   *       // ...
	   *     }
	   *   );
	   *
	   *   RelayTaskScheduler.enqueue(
	   *     function() {
	   *       return 'foo';
	   *     },
	   *     function(foo) {
	   *       throw new Error();
	   *     },
	   *     function() {
	   *       // Never executed.
	   *     }
	   *   ).catch(
	   *     function(error) {}
	   *   );
	    */
	  enqueue: function enqueue() {
	    for (var _len = arguments.length, callbacks = Array(_len), _key = 0; _key < _len; _key++) {
	      callbacks[_key] = arguments[_key];
	    }

	    var promise = new Promise(function (resolve, reject) {
	      var nextIndex = 0;
	      var error = null;
	      function enqueueNext(value) {
	        if (error) {
	          reject(error);
	          return;
	        }
	        if (nextIndex >= callbacks.length) {
	          resolve(value);
	        } else {
	          queue.push(function () {
	            enqueueNext((function () {
	              var nextCallback = callbacks[nextIndex++];
	              try {
	                value = nextCallback(value);
	              } catch (e) {
	                error = e;
	                value = undefined;
	              }
	              return value;
	            })());
	          });
	        }
	      }
	      enqueueNext(undefined);
	    });
	    scheduleIfNecessary();
	    return promise;
	  }
	};

	function scheduleIfNecessary() {
	  if (running) {
	    return;
	  }
	  if (queue.length) {
	    running = true;
	    var executeTask = createTaskExecutor(queue.shift());
	    if (schedule) {
	      schedule(executeTask);
	    } else {
	      executeTask();
	    }
	  } else {
	    running = false;
	  }
	}

	function createTaskExecutor(callback) {
	  var invoked = false;
	  return function () {
	    !!invoked ?  true ? invariant(false, 'RelayTaskScheduler: Tasks can only be executed once.') : invariant(false) : undefined;
	    invoked = true;
	    invokeWithinScopedQueue(callback);
	    running = false;
	    scheduleIfNecessary();
	  };
	}

	function invokeWithinScopedQueue(callback) {
	  var originalQueue = queue;
	  queue = [];
	  try {
	    callback();
	  } finally {
	    Array.prototype.unshift.apply(originalQueue, queue);
	    queue = originalQueue;
	  }
	}

	module.exports = RelayTaskScheduler;

/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule buildRQL
	 * 
	 * @typechecks
	 */

	'use strict';

	var _extends = __webpack_require__(8)['default'];

	var _toConsumableArray = __webpack_require__(19)['default'];

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var Map = __webpack_require__(69);
	var QueryBuilder = __webpack_require__(17);

	var RelayProfiler = __webpack_require__(4);

	var filterObject = __webpack_require__(208);
	var invariant = __webpack_require__(2);
	var mapObject = __webpack_require__(48);

	// Cache results of executing fragment query builders.
	var fragmentCache = new Map();

	// Cache results of executing component-specific route query builders.
	var queryCache = new Map();

	function isDeprecatedCallWithArgCountGreaterThan(nodeBuilder, count) {
	  var argLength = nodeBuilder.length;
	  if (true) {
	    var mockImpl = nodeBuilder;
	    while (mockImpl && mockImpl._getMockImplementation) {
	      mockImpl = mockImpl._getMockImplementation();
	    }
	    if (mockImpl) {
	      argLength = mockImpl.length;
	    }
	  }
	  return argLength > count;
	}

	/**
	 * @internal
	 *
	 * Builds a static node representation using a supplied query or fragment
	 * builder. This is used for routes, containers, and mutations.
	 *
	 * If the supplied fragment builder produces an invalid node (e.g. the wrong
	 * node type), these will return `undefined`. This is not to be confused with
	 * a return value of `null`, which may result from the lack of a node.
	 */
	var buildRQL = {
	  Fragment: function Fragment(fragmentBuilder, values) {
	    var node = fragmentCache.get(fragmentBuilder);
	    if (!node) {
	      var variables = toVariables(values);
	      !!isDeprecatedCallWithArgCountGreaterThan(fragmentBuilder, 1) ?  true ? invariant(false, 'Relay.QL: Deprecated usage detected. If you are trying to define a ' + 'fragment, use `variables => Relay.QL`.') : invariant(false) : undefined;
	      node = fragmentBuilder(variables);
	      fragmentCache.set(fragmentBuilder, node);
	    }
	    if (node) {
	      return QueryBuilder.getFragment(node);
	    }
	  },

	  Query: function Query(queryBuilder, Component, queryName, values) {
	    var componentCache = queryCache.get(queryBuilder);
	    var node = undefined;
	    if (!componentCache) {
	      componentCache = new Map();
	      queryCache.set(queryBuilder, componentCache);
	    } else {
	      node = componentCache.get(Component);
	    }
	    if (!node) {
	      var _variables = toVariables(values);
	      !!isDeprecatedCallWithArgCountGreaterThan(queryBuilder, 2) ?  true ? invariant(false, 'Relay.QL: Deprecated usage detected. If you are trying to define a ' + 'query, use `(Component, variables) => Relay.QL`.') : invariant(false) : undefined;
	      if (isDeprecatedCallWithArgCountGreaterThan(queryBuilder, 0)) {
	        node = queryBuilder(Component, _variables);
	      } else {
	        node = queryBuilder(Component, _variables);
	        var query = QueryBuilder.getQuery(node);
	        if (query) {
	          (function () {
	            var hasFragment = false;
	            var hasScalarFieldsOnly = true;
	            if (query.children) {
	              query.children.forEach(function (child) {
	                if (child) {
	                  hasFragment = hasFragment || child.kind === 'Fragment';
	                  hasScalarFieldsOnly = hasScalarFieldsOnly && child.kind === 'Field' && (!child.children || child.children.length === 0);
	                }
	              });
	            }
	            if (!hasFragment) {
	              var children = query.children ? [].concat(_toConsumableArray(query.children)) : [];
	              !hasScalarFieldsOnly ?  true ? invariant(false, 'Relay.QL: Expected query `%s` to be empty. For example, use ' + '`node(id: $id)`, not `node(id: $id) { ... }`.', query.fieldName) : invariant(false) : undefined;
	              var fragmentVariables = filterObject(_variables, function (_, name) {
	                return Component.hasVariable(name);
	              });
	              children.push(Component.getFragment(queryName, fragmentVariables));
	              node = _extends({}, query, {
	                children: children
	              });
	            }
	          })();
	        }
	      }
	      componentCache.set(Component, node);
	    }
	    if (node) {
	      return QueryBuilder.getQuery(node) || undefined;
	    }
	    return null;
	  }
	};

	function toVariables(variables) // ConcreteCallVariable should flow into mixed
	{
	  return mapObject(variables, function (_, name) {
	    return QueryBuilder.createCallVariable(name);
	  });
	}

	RelayProfiler.instrumentMethods(buildRQL, {
	  Fragment: 'buildRQL.Fragment',
	  Query: 'buildRQL.Query'
	});

	module.exports = buildRQL;

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule callsFromGraphQL
	 * 
	 * @typechecks
	 */

	'use strict';

	var invariant = __webpack_require__(2);

	/**
	 * @internal
	 *
	 * Convert from GraphQL call nodes to plain object `{name,value}` calls.
	 */
	function callsFromGraphQL(concreteCalls, variables) {
	  // $FlowIssue: ConcreteCall should flow into CallOrDirective
	  var callsOrDirectives = concreteCalls;
	  var orderedCalls = [];
	  for (var ii = 0; ii < callsOrDirectives.length; ii++) {
	    var _callsOrDirectives$ii = callsOrDirectives[ii];
	    var name = _callsOrDirectives$ii.name;
	    var value = _callsOrDirectives$ii.value;

	    if (value != null) {
	      if (Array.isArray(value)) {
	        value = value.map(function (arg) {
	          return getCallVaue(arg, variables);
	        });
	      } else if (value.kind === 'BatchCallVariable') {
	        // Batch calls are handled separately
	        value = null;
	      } else {
	        value = getCallVaue(value, variables);
	      }
	    }
	    orderedCalls.push({ name: name, value: value });
	  }
	  return orderedCalls;
	}

	function getCallVaue(value, variables) {
	  if (value.kind === 'CallValue') {
	    return value.callValue;
	  } else {
	    var variableName = value.callVariableName;
	    !variables.hasOwnProperty(variableName) ?  true ? invariant(false, 'callsFromGraphQL(): Expected a declared value for variable, `$%s`.', variableName) : invariant(false) : undefined;
	    return variables[variableName];
	  }
	}

	module.exports = callsFromGraphQL;

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule flattenRelayQuery
	 * 
	 * @typechecks
	 */

	'use strict';

	var _inherits = __webpack_require__(5)['default'];

	var _classCallCheck = __webpack_require__(1)['default'];

	var _Array$from = __webpack_require__(89)['default'];

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	var Map = __webpack_require__(69);
	var RelayProfiler = __webpack_require__(4);

	var RelayQueryVisitor = __webpack_require__(18);

	var sortTypeFirst = __webpack_require__(161);

	/**
	 * @internal
	 *
	 * `flattenRelayQuery(query)` returns a clone of `query` with fields inside of
	 * fragments recursively flattened into the nearest ancestor field.
	 *
	 * The result can be null if `node` only contains empty fragments or fragments
	 * that only contain empty fragments.
	 */
	function flattenRelayQuery(node, options) {
	  var flattener = new RelayQueryFlattener(options && options.shouldRemoveFragments);
	  var state = {
	    node: node,
	    type: node.getType(),
	    flattenedFieldMap: new Map(),
	    flattenedFragmentMap: new Map()
	  };
	  flattener.traverse(node, state);
	  return toQuery(node, state);
	}

	function toQuery(node, _ref) {
	  var flattenedFieldMap = _ref.flattenedFieldMap;
	  var flattenedFragmentMap = _ref.flattenedFragmentMap;

	  var children = [];
	  var aliases = _Array$from(flattenedFieldMap.keys()).sort(sortTypeFirst);
	  aliases.forEach(function (alias) {
	    var field = flattenedFieldMap.get(alias);
	    if (field) {
	      children.push(toQuery(field.node, field));
	    }
	  });
	  _Array$from(flattenedFragmentMap.keys()).forEach(function (type) {
	    var fragment = flattenedFragmentMap.get(type);
	    if (fragment) {
	      children.push(toQuery(fragment.node, fragment));
	    }
	  });
	  return node.clone(children);
	}

	var RelayQueryFlattener = (function (_RelayQueryVisitor) {
	  _inherits(RelayQueryFlattener, _RelayQueryVisitor);

	  function RelayQueryFlattener(shouldRemoveFragments) {
	    _classCallCheck(this, RelayQueryFlattener);

	    _RelayQueryVisitor.call(this);
	    this._shouldRemoveFragments = !!shouldRemoveFragments;
	  }

	  RelayQueryFlattener.prototype.visitFragment = function visitFragment(node, state) {
	    var type = node.getType();
	    if (this._shouldRemoveFragments || type === state.type) {
	      this.traverse(node, state);
	      return;
	    }
	    var flattenedFragment = state.flattenedFragmentMap.get(type);
	    if (!flattenedFragment) {
	      flattenedFragment = {
	        node: node,
	        type: type,
	        flattenedFieldMap: new Map(),
	        flattenedFragmentMap: new Map()
	      };
	      state.flattenedFragmentMap.set(type, flattenedFragment);
	    }
	    this.traverse(node, flattenedFragment);
	  };

	  RelayQueryFlattener.prototype.visitField = function visitField(node, state) {
	    var hash = node.getShallowHash();
	    var flattenedField = state.flattenedFieldMap.get(hash);
	    if (!flattenedField) {
	      flattenedField = {
	        node: node,
	        type: node.getType(),
	        flattenedFieldMap: new Map(),
	        flattenedFragmentMap: new Map()
	      };
	      state.flattenedFieldMap.set(hash, flattenedField);
	    }
	    this.traverse(node, flattenedField);
	  };

	  return RelayQueryFlattener;
	})(RelayQueryVisitor);

	module.exports = RelayProfiler.instrument('flattenRelayQuery', flattenRelayQuery);

/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule generateClientID
	 * @typechecks
	 */

	'use strict';

	var crc32 = __webpack_require__(107);
	var performanceNow = __webpack_require__(213);

	var _clientID = 1;
	var _prefix = 'client:' + crc32('' + performanceNow());

	/**
	 * Generate a unique clientID for GraphQL data objects that do not already have
	 * an ID or their ID = null
	 *
	 * @internal
	 */
	function generateClientID() {
	  return _prefix + _clientID++;
	}

	module.exports = generateClientID;

/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule printRelayQuery
	 */

	'use strict';

	module.exports = __webpack_require__(158);

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(177), __esModule: true };

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _Object$defineProperty = __webpack_require__(171)["default"];

	exports["default"] = function (obj, key, value) {
	  if (key in obj) {
	    _Object$defineProperty(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }

	  return obj;
	};

	exports.__esModule = true;

/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _getIterator = __webpack_require__(168)["default"];

	var _isIterable = __webpack_require__(169)["default"];

	exports["default"] = (function () {
	  function sliceIterator(arr, i) {
	    var _arr = [];
	    var _n = true;
	    var _d = false;
	    var _e = undefined;

	    try {
	      for (var _i = _getIterator(arr), _s; !(_n = (_s = _i.next()).done); _n = true) {
	        _arr.push(_s.value);

	        if (i && _arr.length === i) break;
	      }
	    } catch (err) {
	      _d = true;
	      _e = err;
	    } finally {
	      try {
	        if (!_n && _i["return"]) _i["return"]();
	      } finally {
	        if (_d) throw _e;
	      }
	    }

	    return _arr;
	  }

	  return function (arr, i) {
	    if (Array.isArray(arr)) {
	      return arr;
	    } else if (_isIterable(Object(arr))) {
	      return sliceIterator(arr, i);
	    } else {
	      throw new TypeError("Invalid attempt to destructure non-iterable instance");
	    }
	  };
	})();

	exports.__esModule = true;

/***/ },
/* 62 */
/***/ function(module, exports) {

	var hasOwnProperty = {}.hasOwnProperty;
	module.exports = function(it, key){
	  return hasOwnProperty.call(it, key);
	};

/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var LIBRARY        = __webpack_require__(189)
	  , $export        = __webpack_require__(22)
	  , redefine       = __webpack_require__(100)
	  , hide           = __webpack_require__(31)
	  , has            = __webpack_require__(62)
	  , Iterators      = __webpack_require__(23)
	  , $iterCreate    = __webpack_require__(187)
	  , setToStringTag = __webpack_require__(64)
	  , getProto       = __webpack_require__(14).getProto
	  , ITERATOR       = __webpack_require__(15)('iterator')
	  , BUGGY          = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
	  , FF_ITERATOR    = '@@iterator'
	  , KEYS           = 'keys'
	  , VALUES         = 'values';

	var returnThis = function(){ return this; };

	module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED){
	  $iterCreate(Constructor, NAME, next);
	  var getMethod = function(kind){
	    if(!BUGGY && kind in proto)return proto[kind];
	    switch(kind){
	      case KEYS: return function keys(){ return new Constructor(this, kind); };
	      case VALUES: return function values(){ return new Constructor(this, kind); };
	    } return function entries(){ return new Constructor(this, kind); };
	  };
	  var TAG        = NAME + ' Iterator'
	    , DEF_VALUES = DEFAULT == VALUES
	    , VALUES_BUG = false
	    , proto      = Base.prototype
	    , $native    = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
	    , $default   = $native || getMethod(DEFAULT)
	    , methods, key;
	  // Fix native
	  if($native){
	    var IteratorPrototype = getProto($default.call(new Base));
	    // Set @@toStringTag to native iterators
	    setToStringTag(IteratorPrototype, TAG, true);
	    // FF fix
	    if(!LIBRARY && has(proto, FF_ITERATOR))hide(IteratorPrototype, ITERATOR, returnThis);
	    // fix Array#{values, @@iterator}.name in V8 / FF
	    if(DEF_VALUES && $native.name !== VALUES){
	      VALUES_BUG = true;
	      $default = function values(){ return $native.call(this); };
	    }
	  }
	  // Define iterator
	  if((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])){
	    hide(proto, ITERATOR, $default);
	  }
	  // Plug for library
	  Iterators[NAME] = $default;
	  Iterators[TAG]  = returnThis;
	  if(DEFAULT){
	    methods = {
	      values:  DEF_VALUES  ? $default : getMethod(VALUES),
	      keys:    IS_SET      ? $default : getMethod(KEYS),
	      entries: !DEF_VALUES ? $default : getMethod('entries')
	    };
	    if(FORCED)for(key in methods){
	      if(!(key in proto))redefine(proto, key, methods[key]);
	    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
	  }
	  return methods;
	};

/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	var def = __webpack_require__(14).setDesc
	  , has = __webpack_require__(62)
	  , TAG = __webpack_require__(15)('toStringTag');

	module.exports = function(it, tag, stat){
	  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
	};

/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.13 ToObject(argument)
	var defined = __webpack_require__(41);
	module.exports = function(it){
	  return Object(defined(it));
	};

/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	var classof   = __webpack_require__(90)
	  , ITERATOR  = __webpack_require__(15)('iterator')
	  , Iterators = __webpack_require__(23);
	module.exports = __webpack_require__(13).getIteratorMethod = function(it){
	  if(it != undefined)return it[ITERATOR]
	    || it['@@iterator']
	    || Iterators[classof(it)];
	};

/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(199);
	var Iterators = __webpack_require__(23);
	Iterators.NodeList = Iterators.HTMLCollection = Iterators.Array;

/***/ },
/* 68 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 */

	/* jslint unused:false */

	"use strict";

	if (global.ErrorUtils) {
	  module.exports = global.ErrorUtils;
	} else {
	  var ErrorUtils = {
	    applyWithGuard: function (callback, context, args, onError, name) {
	      return callback.apply(context, args);
	    },
	    guard: function (callback, name) {
	      return callback;
	    }
	  };

	  module.exports = ErrorUtils;
	}
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 */

	'use strict';

	module.exports = __webpack_require__(173);

/***/ },
/* 70 */
/***/ function(module, exports) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 */

	"use strict";

	function makeEmptyFunction(arg) {
	  return function () {
	    return arg;
	  };
	}

	/**
	 * This function accepts and discards inputs; it has no side effects. This is
	 * primarily useful idiomatically for overridable function endpoints which
	 * always need to be callable, since JS lacks a null-call idiom ala Cocoa.
	 */
	function emptyFunction() {}

	emptyFunction.thatReturns = makeEmptyFunction;
	emptyFunction.thatReturnsFalse = makeEmptyFunction(false);
	emptyFunction.thatReturnsTrue = makeEmptyFunction(true);
	emptyFunction.thatReturnsNull = makeEmptyFunction(null);
	emptyFunction.thatReturnsThis = function () {
	  return this;
	};
	emptyFunction.thatReturnsArgument = function (arg) {
	  return arg;
	};

	module.exports = emptyFunction;

/***/ },
/* 71 */
/***/ function(module, exports) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * 
	 */

	"use strict";

	var nullthrows = function (x) {
	  if (x != null) {
	    return x;
	  }
	  throw new Error("Got unexpected null or undefined");
	};

	module.exports = nullthrows;

/***/ },
/* 72 */
/***/ function(module, exports) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @typechecks
	 * 
	 */

	'use strict';

	var hasOwnProperty = Object.prototype.hasOwnProperty;

	/**
	 * Performs equality by iterating through keys on an object and returning false
	 * when any key has values which are not strictly equal between the arguments.
	 * Returns true when the values of all keys are strictly equal.
	 */
	function shallowEqual(objA, objB) {
	  if (objA === objB) {
	    return true;
	  }

	  if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
	    return false;
	  }

	  var keysA = Object.keys(objA);
	  var keysB = Object.keys(objB);

	  if (keysA.length !== keysB.length) {
	    return false;
	  }

	  // Test for A's keys different from B.
	  for (var i = 0; i < keysA.length; i++) {
	    if (!hasOwnProperty.call(objB, keysA[i]) || objA[keysA[i]] !== objB[keysA[i]]) {
	      return false;
	    }
	  }

	  return true;
	}

	module.exports = shallowEqual;

/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule DliteFetchModeConstants
	 * @typechecks
	 */

	'use strict';

	var keyMirror = __webpack_require__(211);

	var DliteFetchModeConstants = keyMirror({
	  FETCH_MODE_CLIENT: null,
	  FETCH_MODE_PRELOAD: null,
	  FETCH_MODE_REFETCH: null
	});

	module.exports = DliteFetchModeConstants;

/***/ },
/* 74 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule GraphQLRange
	 * @typechecks
	 */

	'use strict';

	var _classCallCheck = __webpack_require__(1)['default'];

	var _defineProperty = __webpack_require__(60)['default'];

	var _extends = __webpack_require__(8)['default'];

	var _slicedToArray = __webpack_require__(61)['default'];

	var _toConsumableArray = __webpack_require__(19)['default'];

	var GraphQLMutatorConstants = __webpack_require__(50);
	var GraphQLSegment = __webpack_require__(112);
	var GraphQLStoreDataHandler = __webpack_require__(6);
	var RelayConnectionInterface = __webpack_require__(7);

	var forEachObject = __webpack_require__(9);
	var invariant = __webpack_require__(2);
	var serializeRelayQueryCall = __webpack_require__(38);
	var warning = __webpack_require__(11);

	var END_CURSOR = RelayConnectionInterface.END_CURSOR;
	var HAS_NEXT_PAGE = RelayConnectionInterface.HAS_NEXT_PAGE;
	var HAS_PREV_PAGE = RelayConnectionInterface.HAS_PREV_PAGE;
	var START_CURSOR = RelayConnectionInterface.START_CURSOR;

	/**
	 * @param {array<object>} queryCalls
	 * @return {object}
	 */
	function callsArrayToObject(queryCalls) {
	  var calls = {};
	  for (var ii = 0; ii < queryCalls.length; ii++) {
	    if (RelayConnectionInterface.isConnectionCall(queryCalls[ii])) {
	      var _queryCalls$ii = queryCalls[ii];
	      var name = _queryCalls$ii.name;
	      var value = _queryCalls$ii.value;

	      // assuming that range calls will only have a single argument
	      if (Array.isArray(value) && value.length) {
	        value = value[0];
	      }
	      // Ignore the whole call when the value is null
	      if (value === null) {
	        continue;
	      }
	      calls[name] = value;
	    }
	  }
	  // update first and last call values to be numbers
	  if (calls.first) {
	    !!isNaN(calls.first) ?  true ? invariant(false, 'GraphQLRange: Expected `first` argument to be a number, got ' + '`%s`.', calls.first) : invariant(false) : undefined;
	    calls.first = +calls.first;
	  } else if (calls.last) {
	    !!isNaN(calls.last) ?  true ? invariant(false, 'GraphQLRange: Expected `last` argument to be a number, got ' + '`%s`.', calls.last) : invariant(false) : undefined;
	    calls.last = +calls.last;
	  }
	  return calls;
	}

	/**
	 * Returns whether this is currently a set of static calls that GraphQLRange
	 * supports. Static calls define ranges that do not change over a period
	 * of time, given the same set of arguments.
	 *
	 * @param {object} calls
	 * @return {?boolean}
	 */
	function isStaticCall(calls) {
	  return calls.hasOwnProperty('surrounds') || calls.hasOwnProperty('find');
	}

	/**
	 * Returns whether this is currently a set of calls that GraphQLRange
	 * supports
	 *
	 * @param {object} calls
	 * @return {boolean}
	 */
	function isValidRangeCall(calls) {
	  var hasFirst = calls.hasOwnProperty('first');
	  var hasLast = calls.hasOwnProperty('last');

	  // Currently only supports: first(), after().first(), last(), before().last()
	  // before().first(), after().last(), after().before().first(), and
	  // after().before().last()
	  // first() can never be called with last().
	  return (hasFirst || hasLast) && !(hasFirst && hasLast);
	}

	/**
	 * Returns whether the call values are supported by GraphQLRange
	 *
	 * @param {object} calls
	 * @return {boolean}
	 */
	function isValidRangeCallValues(calls) {
	  return calls.hasOwnProperty('first') && calls.first > 0 || calls.hasOwnProperty('last') && calls.last > 0;
	}

	/**
	 * Validates edge to ensure it has all the fields needed to be store properly.
	 *
	 * @param {object} edge
	 */
	function validateEdge(edge) {
	  !(GraphQLStoreDataHandler.getID(edge) !== undefined) ?  true ? invariant(false, 'GraphQLStore: `edge` must have a data id') : invariant(false) : undefined;
	  !(edge.node !== undefined) ?  true ? invariant(false, 'GraphQLStore: `edge` must have `node` field') : invariant(false) : undefined;
	}

	/**
	 * @param {array<object>} edges
	 */
	function validateEdges(edges) {
	  edges.forEach(validateEdge);
	}

	/**
	 * A range represents an ordered set of edges. Methods are provided for adding
	 * edges (`appendEdge`, `prependEdge`, `addItems`) and removing them
	 * (`removeEdgeWithID`).
	 *
	 * Within a range, each contiguous group of edges is modeled using a
	 * `GraphQLSegment`, but this is an implementation detail that `GraphQLRange`
	 * hides from its callers.
	 *
	 * Ranges model GraphQL connections, which are the means of traversing from a
	 * node to a set of associated objects; for example, in the following query the
	 * "friends" connection produces a range containing edges that lead to the
	 * requested friend nodes:
	 *
	 *     node(4) {
	 *       friends.first(2) {
	 *         edges {
	 *           node {
	 *             id,
	 *             name,
	 *           },
	 *         },
	 *       },
	 *     }
	 *
	 * @see `GraphQLSegment`
	 * @see "Connections" in https://fburl.com/graphql-connections
	 * @internal
	 */

	var GraphQLRange = (function () {
	  function GraphQLRange() {
	    _classCallCheck(this, GraphQLRange);

	    this.reset();
	  }

	  /**
	   * @param {array<object>} calls
	   * @return {string}
	   */

	  GraphQLRange.prototype.reset = function reset() {
	    // List of segments where each segment is a continuous chunk.
	    // There are gaps in between the segments. The first segment in the list
	    // should be cursors beginning at the top of the range (i.e. first(N)).
	    // The last segment in the list should be cursors at the bottom of
	    // the range (i.e. last(N)).
	    this._orderedSegments = [new GraphQLSegment(), new GraphQLSegment()];

	    // GraphQLRange nodes can also support static queries like surrounds,
	    // find, whose contents won't ever change for a given set of arguments.
	    // Store these queries' results in this map, since you can't do first()
	    // or last() queries on these ranges.
	    this._staticQueriesMap = {};

	    this._hasFirst = false;
	    this._hasLast = false;
	  };

	  /**
	   * @param {number} index
	   */

	  GraphQLRange.prototype._resetSegment = function _resetSegment(index) {
	    !(index >= 0 && index < this._orderedSegments.length) ?  true ? invariant(false, 'cannot reset non-existent segment') : invariant(false) : undefined;
	    this._orderedSegments[index] = new GraphQLSegment();
	  };

	  /**
	   * @param {string} cursor
	   * @return {?number}
	   */

	  GraphQLRange.prototype._getSegmentIndexByCursor = function _getSegmentIndexByCursor(cursor) {
	    // TODO: revisit if we end up having too many segments
	    for (var ii = 0; ii < this._orderedSegments.length; ii++) {
	      if (this._orderedSegments[ii].containsEdgeWithCursor(cursor)) {
	        return ii;
	      }
	    }
	    return null;
	  };

	  /**
	   * @param {string} id
	   * @return {?number}
	   */

	  GraphQLRange.prototype._getSegmentIndexByID = function _getSegmentIndexByID(id) {
	    // TODO: revisit if we end up having too many segments
	    for (var ii = 0; ii < this._orderedSegments.length; ii++) {
	      if (this._orderedSegments[ii].containsEdgeWithID(id)) {
	        return ii;
	      }
	    }
	    return null;
	  };

	  /**
	   * Add edges' data into the static queries map for the query calls,
	   * overwriting any previously existing data for these calls.
	   * @param {array<object>} queryCalls
	   * @param {array} edges
	   */

	  GraphQLRange.prototype._addStaticEdges = function _addStaticEdges(queryCalls, edges) {
	    var calls = _callsToString(queryCalls);
	    var edgeIDsToStore = [];
	    var cursorsToStore = [];

	    for (var ii = 0; ii < edges.length; ii++) {
	      var edge = edges[ii];
	      edgeIDsToStore.push(GraphQLStoreDataHandler.getID(edge));
	      cursorsToStore.push(edge.cursor);
	    }

	    this._staticQueriesMap[calls] = {
	      edgeIDs: edgeIDsToStore,
	      cursors: cursorsToStore
	    };
	  };

	  /**
	   * Add edges into the range based on the query calls. New edges will replace
	   * previous edges in the range.
	   * @param {array<object>} queryCalls
	   * @param {array} edges
	   * @param {object} pageInfo
	   */

	  GraphQLRange.prototype.addItems = function addItems(queryCalls, edges, pageInfo) {
	    validateEdges(edges);
	    var calls = callsArrayToObject(queryCalls);
	    var segmentCount, segmentIndex;

	    if (isStaticCall(calls)) {
	      this._addStaticEdges(queryCalls, edges);
	      return;
	    }

	    if (!isValidRangeCall(calls)) {
	      console.error('GraphQLRange currently only handles first(<count>), ' + 'after(<cursor>).first(<count>), last(<count>), ' + 'before(<cursor>).last(<count>), before(<cursor>).first(<count>), ' + 'and after(<cursor>).last(<count>)');
	      return;
	    }

	    // Skip the update if cursors are invalid
	    if (calls.before === null || calls.after === null) {
	      console.error('GraphQLRange received null as a cursor.');
	      return;
	    }

	    if (calls.first) {
	      // before().first() calls can produce gaps
	      if (calls.before && !calls.after) {
	        // make a new segment if there is a gap
	        if (pageInfo[HAS_NEXT_PAGE] === true) {
	          if (this._getSegmentIndexByCursor(calls.before) === 0) {
	            this._orderedSegments.unshift(new GraphQLSegment());
	          }
	          // When there is a gap from before().first() query, this is the same
	          // as just storing a first().
	          this._addAfterFirstItems(edges, pageInfo[HAS_NEXT_PAGE], undefined, calls.before);
	        } else {
	          // Since there is no gap, we can stitch into the beginning
	          // of existing segment
	          this._addBeforeLastItems(edges, pageInfo[HAS_PREV_PAGE], calls.before);
	        }
	      } else {
	        // These elements are added from paging to extend the the range.
	        if (!calls.after) {
	          segmentIndex = 0;
	          segmentCount = this.getFirstSegment().getCount();
	          if (segmentCount && (calls.first > segmentCount || edges.length > segmentCount) && !this.getFirstSegment().getFirstCursor()) {
	            // this is a range for which we don't have a cursor, and we've
	            // fetched more data by increasing the `first(N)` variable; we
	            // blow away and replace the first segment in order to side-step
	            // issues where the order of IDs in the range may change between
	            // queries
	            this._resetSegment(segmentIndex);
	          }
	        }
	        this._addAfterFirstItems(edges, pageInfo[HAS_NEXT_PAGE], calls.after, calls.before);
	      }
	    } else if (calls.last) {
	      // after().last() calls can produce gaps
	      if (calls.after && !calls.before) {
	        // make a new segment if there is a gap
	        if (pageInfo[HAS_PREV_PAGE] === true) {
	          if (this._getSegmentIndexByCursor(calls.after) === this._orderedSegments.length - 1) {
	            this._orderedSegments.push(new GraphQLSegment());
	          }
	          // When there is a gap from after().last() query, this is the same as
	          // just storing a last().
	          this._addBeforeLastItems(edges, pageInfo[HAS_PREV_PAGE], undefined, calls.after);
	        } else {
	          // Since there is no gap, we can stitch to the end
	          // of existing segment
	          this._addAfterFirstItems(edges, pageInfo[HAS_NEXT_PAGE], calls.after);
	        }
	      } else {
	        // These elements are added from paging to extend the the range.
	        if (!calls.before) {
	          segmentIndex = this._orderedSegments.length - 1;
	          segmentCount = this.getLastSegment().getCount();
	          if (segmentCount && (calls.last > segmentCount || edges.length > segmentCount) && !this.getLastSegment().getLastCursor()) {
	            // this is a range for which we don't have a cursor, and we've
	            // fetched more data by increasing the `last(N)` variable; we
	            // blow away and replace the last segment in order to side-step
	            // issues where the order of IDs in the range may change between
	            // queries
	            this._resetSegment(segmentIndex);
	          }
	        }
	        this._addBeforeLastItems(edges, pageInfo[HAS_PREV_PAGE], calls.before, calls.after);
	      }
	    }
	  };

	  /**
	   * @return {GraphQLSegment}
	   */

	  GraphQLRange.prototype.getFirstSegment = function getFirstSegment() {
	    return this._orderedSegments[0];
	  };

	  /**
	   * @return {GraphQLSegment}
	   */

	  GraphQLRange.prototype.getLastSegment = function getLastSegment() {
	    return this._orderedSegments[this._orderedSegments.length - 1];
	  };

	  /**
	   * Tries to concat segments at segmentIndex and segmentIndex + 1.
	   * This is an all or nothing operation.
	   * If concat is successful, we'll remove the segment at segmentIndex + 1
	   * from the orderedSegments after all elements has been added to the segment
	   * at segmentIndex.
	   * If concat is unsuccessful, nothing will be changed.
	   * @param {number} segmentIndex
	   */

	  GraphQLRange.prototype._concatSegments = function _concatSegments(segmentIndex) {
	    !(segmentIndex + 1 < this._orderedSegments.length && segmentIndex >= 0) ?  true ? invariant(false, 'GraphQLRange cannot concat segments outside the range ' + 'of orderedSegments') : invariant(false) : undefined;
	    var firstSegment = this._orderedSegments[segmentIndex];
	    var secondSegment = this._orderedSegments[segmentIndex + 1];
	    if (firstSegment.concatSegment(secondSegment)) {
	      this._orderedSegments.splice(segmentIndex + 1, 1);
	    } else {
	      console.warn('GraphQLRange was unable to concat segment %d and segment %d', segmentIndex, segmentIndex + 1);
	    }
	  };

	  /**
	   * Adds the edge to the front of the range. New edge will replace previous
	   * edge that have the same id.
	   * @param {object} edge
	   */

	  GraphQLRange.prototype.prependEdge = function prependEdge(edge) {
	    validateEdge(edge);
	    this._hasFirst = true;
	    this._removeEdgeIfApplicable(edge);
	    var segment = this.getFirstSegment();
	    segment.prependEdge(edge);
	  };

	  /**
	   * Adds the edge to the end of the range. New edge will replace previous
	   * edge that have the same id.
	   * @param {object} edge
	   */

	  GraphQLRange.prototype.appendEdge = function appendEdge(edge) {
	    validateEdge(edge);
	    this._hasLast = true;
	    this._removeEdgeIfApplicable(edge);
	    var segment = this.getLastSegment();
	    segment.appendEdge(edge);
	  };

	  /**
	   * Removes edge in range if it matches id in input edge.
	   * @param {object} edge
	   */

	  GraphQLRange.prototype._removeEdgeIfApplicable = function _removeEdgeIfApplicable(edge) {
	    var id = GraphQLStoreDataHandler.getID(edge);
	    var index = this._getSegmentIndexByID(id);
	    if (index != null) {
	      this._orderedSegments[index].removeEdge(id);
	    }
	  };

	  /**
	   * Remove any edges in the range if it matches any of the ids in the input.
	   * This function is used to prevent us from adding any id that already exist
	   * in the range.
	   *
	   * @param {array} edges
	   */

	  GraphQLRange.prototype._removeEdgesIfApplicable = function _removeEdgesIfApplicable(edges) {
	    for (var ii = 0; ii < edges.length; ii++) {
	      this._removeEdgeIfApplicable(edges[ii]);
	    }
	  };

	  /**
	   * Add items into the correct segment with the cursor. If no cursor
	   * is present, items are added to the very first segment.
	   *
	   * @param {array} edges
	   * @param {boolean} hasNextPage
	   * @param {?string} afterCursor
	   * @param {?string} beforeCursor
	   */

	  GraphQLRange.prototype._addAfterFirstItems = function _addAfterFirstItems(edges, hasNextPage, afterCursor, beforeCursor) {
	    var segment;
	    var segmentIndex;
	    var lastCursor;
	    if (afterCursor !== undefined) {
	      segmentIndex = this._getSegmentIndexByCursor(afterCursor);
	      if (segmentIndex == null) {
	         true ? warning(false, 'GraphQLRange cannot find a segment that has the cursor: %s', afterCursor) : undefined;
	        return;
	      }
	      segment = this._orderedSegments[segmentIndex];
	      lastCursor = segment.getLastCursor();
	      if (lastCursor !== afterCursor) {
	        edges = this._reconcileAfterFirstEdges(segment, edges, afterCursor);
	        afterCursor = lastCursor;
	        if (!edges) {
	          return;
	        }
	      }
	    } else {
	      segmentIndex = 0;
	      segment = this._orderedSegments[segmentIndex];
	      lastCursor = segment.getLastCursor();
	      if (lastCursor !== undefined) {
	        edges = this._reconcileAfterFirstEdges(segment, edges);
	        afterCursor = lastCursor;
	        if (!edges) {
	          return;
	        }
	      }
	    }
	    if (beforeCursor !== undefined) {
	      if (segmentIndex === this._orderedSegments.length - 1) {
	        console.warn('GraphQLRange cannot add because there is no next segment');
	        return;
	      } else if (this._orderedSegments[segmentIndex + 1].getFirstCursor() !== beforeCursor) {
	         true ? warning(false, 'GraphQLRange cannot add because beforeCursor does not match first ' + 'cursor of the next segment') : undefined;
	        return;
	      }
	    }

	    if (afterCursor === undefined) {
	      this._hasFirst = true;
	    }

	    this._removeEdgesIfApplicable(edges);
	    segment.addEdgesAfterCursor(edges, afterCursor);
	    if (!hasNextPage) {
	      if (beforeCursor !== undefined) {
	        // If we have a beforeCursor and there is no next page,
	        // then there is no gap between the current segment and the next.
	        // We can concat the two segments when there is no gap.
	        this._concatSegments(segmentIndex);
	      } else {
	        this._hasLast = true;
	        // If this segment already has the last element, we don't
	        // need any segments after this.
	        this._orderedSegments.splice(segmentIndex + 1, this._orderedSegments.length - 1 - segmentIndex);
	      }
	    }
	  };

	  /**
	   * In the case the cursor does not correspond last cursor,
	   * walk through the edges to see if we can trim edges to
	   * only those after the last cursor. Returns undefined when
	   * the input cannot be reconciled.
	   *
	   * @param {GraphQLSegment} segment
	   * @param {array} edges
	   * @param {?string} cursor
	   * @return {?array} trimmed edges
	   */

	  GraphQLRange.prototype._reconcileAfterFirstEdges = function _reconcileAfterFirstEdges(segment, edges, cursor) {
	    var metadata = segment.getMetadataAfterCursor(edges.length + 1, cursor);
	    var edgeIDs = metadata.edgeIDs;
	    if (edgeIDs.length > edges.length) {
	      // Already have more edges than the input.
	      return undefined;
	    }

	    for (var ii = 0; ii < edgeIDs.length; ii++) {
	      if (edgeIDs[ii] !== GraphQLStoreDataHandler.getID(edges[ii])) {
	         true ? warning(false, 'Relay was unable to reconcile edges on a connection. This most ' + 'likely occurred while trying to handle a server response that ' + 'includes connection edges with nodes that lack an `id` field.') : undefined;
	        return undefined;
	      }
	    }
	    return edges.slice(edgeIDs.length);
	  };

	  /**
	   * Add items into the correct segment with the cursor. If no cursor
	   * is present, items are added to the very last segment.
	   * @param {array} edges
	   * @param {boolean} hasPrevPage
	   * @param {?string} beforeCursor
	   * @param {?string} afterCursor
	   */

	  GraphQLRange.prototype._addBeforeLastItems = function _addBeforeLastItems(edges, hasPrevPage, beforeCursor, afterCursor) {
	    var segment;
	    var segmentIndex;
	    var firstCursor;
	    if (beforeCursor !== undefined) {
	      segmentIndex = this._getSegmentIndexByCursor(beforeCursor);
	      if (segmentIndex == null) {
	         true ? warning(false, 'GraphQLRange cannot find a segment that has the cursor: %s', beforeCursor) : undefined;
	        return;
	      }
	      segment = this._orderedSegments[segmentIndex];
	      firstCursor = segment.getFirstCursor();
	      if (firstCursor !== beforeCursor) {
	        edges = this._reconcileBeforeLastEdges(segment, edges, beforeCursor);
	        beforeCursor = firstCursor;
	        if (!edges) {
	          return;
	        }
	      }
	    } else {
	      segmentIndex = this._orderedSegments.length - 1;
	      segment = this._orderedSegments[segmentIndex];
	      firstCursor = segment.getFirstCursor();
	      if (firstCursor !== undefined) {
	        edges = this._reconcileBeforeLastEdges(segment, edges, beforeCursor);
	        beforeCursor = firstCursor;
	        if (!edges) {
	          return;
	        }
	      }
	    }

	    if (afterCursor !== undefined) {
	      if (segmentIndex === 0) {
	        console.warn('GraphQLRange cannot add because there is no previous segment');
	        return;
	      } else if (this._orderedSegments[segmentIndex - 1].getLastCursor() !== afterCursor) {
	         true ? warning(false, 'GraphQLRange cannot add because afterCursor does not match last ' + 'cursor of the previous segment') : undefined;
	        return;
	      }
	    }

	    if (beforeCursor === undefined) {
	      this._hasLast = true;
	    }

	    this._removeEdgesIfApplicable(edges);
	    segment.addEdgesBeforeCursor(edges, beforeCursor);
	    if (!hasPrevPage) {
	      if (afterCursor !== undefined) {
	        // If we have an afterCursor and there is no previous page,
	        // then there is no gap between the current segment and the previous.
	        // We can concat the two segments when there is no gap.
	        this._concatSegments(segmentIndex - 1);
	      } else {
	        this._hasFirst = true;
	        // If this segment already has the first element, we don't
	        // need any segments before this.
	        this._orderedSegments.splice(0, segmentIndex);
	      }
	    }
	  };

	  /**
	   * In the case the cursor does not correspond first cursor,
	   * walk through the edges to see if we can trim edges to
	   * only those before the first cursor. Returns undefined when
	   * the input cannot be reconciled.
	   *
	   * @param {GraphQLSegment} segment
	   * @param {array} edges
	   * @param {?string} cursor
	   * @return {?array} trimmed edges
	   */

	  GraphQLRange.prototype._reconcileBeforeLastEdges = function _reconcileBeforeLastEdges(segment, edges, cursor) {
	    var metadata = segment.getMetadataBeforeCursor(edges.length + 1, cursor);
	    var edgeIDs = metadata.edgeIDs;
	    if (edgeIDs.length > edges.length) {
	      // Already have more edges than the input.
	      return undefined;
	    }

	    for (var ii = 1; ii <= edgeIDs.length; ii++) {
	      if (edgeIDs[edgeIDs.length - ii] !== GraphQLStoreDataHandler.getID(edges[edges.length - ii])) {
	         true ? warning(false, 'Relay was unable to reconcile edges on a connection. This most ' + 'likely occurred while trying to handle a server response that ' + 'includes connection edges with nodes that lack an `id` field.') : undefined;
	        return undefined;
	      }
	    }
	    return edges.slice(0, edges.length - edgeIDs.length);
	  };

	  /**
	   * Removes an edge from this range such that the edge will never be reachable
	   * regardless of the client session. This is used by delete mutations.
	   *
	   * @param {string} id
	   */

	  GraphQLRange.prototype.removeEdgeWithID = function removeEdgeWithID(id) {
	    for (var ii = 0; ii < this._orderedSegments.length; ii++) {
	      this._orderedSegments[ii].removeAllEdges(id);
	    }
	  };

	  /**
	   * @param {array<object>} queryCalls
	   * @param {?object} optimisticData
	   * @return {object} includes fields: requestedEdgeIDs, diffCalls
	   */

	  GraphQLRange.prototype.retrieveRangeInfoForQuery = function retrieveRangeInfoForQuery(queryCalls, optimisticData) {
	    var calls = callsArrayToObject(queryCalls);

	    if (isStaticCall(calls)) {
	      return this._retrieveRangeInfoForStaticCalls(queryCalls);
	    }

	    // Convert to name => true, so we can test for whether the key exists
	    // without comparing to undefined
	    if (!isValidRangeCall(calls)) {
	      console.error('GraphQLRange currently only handles first(<count>), ' + 'after(<cursor>).first(<count>), last(<count>), ' + 'before(<cursor>).last(<count>), before(<cursor>).first(<count>), ' + 'and after(<cursor>).last(<count>)');
	      return {
	        requestedEdgeIDs: [],
	        diffCalls: [],
	        pageInfo: RelayConnectionInterface.getDefaultPageInfo()
	      };
	    }
	    if (calls.first && calls.before || calls.last && calls.after) {
	      // TODO #7556678: add support for first/before and last/after
	      return {
	        requestedEdgeIDs: [],
	        diffCalls: [],
	        pageInfo: RelayConnectionInterface.getDefaultPageInfo()
	      };
	    }
	    if (!isValidRangeCallValues(calls)) {
	      console.error('GraphQLRange only supports first(<count>) or last(<count>) ' + 'where count is greater than 0');
	      return {
	        requestedEdgeIDs: [],
	        diffCalls: [],
	        pageInfo: RelayConnectionInterface.getDefaultPageInfo()
	      };
	    }
	    if (calls.first) {
	      return this._retrieveRangeInfoForFirstQuery(queryCalls, optimisticData);
	    } else if (calls.last) {
	      return this._retrieveRangeInfoForLastQuery(queryCalls, optimisticData);
	    }
	  };

	  /**
	   * @param {array<object>} queryCalls
	   * @return {object} includes fields: requestedEdgeIDs, diffCalls
	   */

	  GraphQLRange.prototype._retrieveRangeInfoForStaticCalls = function _retrieveRangeInfoForStaticCalls(queryCalls) {
	    var calls = _callsToString(queryCalls);
	    var storedInfo = this._staticQueriesMap[calls];

	    if (storedInfo) {
	      var _pageInfo;

	      return {
	        requestedEdgeIDs: storedInfo.edgeIDs,
	        diffCalls: [],
	        pageInfo: (_pageInfo = {}, _defineProperty(_pageInfo, START_CURSOR, storedInfo.cursors[0]), _defineProperty(_pageInfo, END_CURSOR, storedInfo.cursors[storedInfo.cursors.length - 1]), _defineProperty(_pageInfo, HAS_NEXT_PAGE, true), _defineProperty(_pageInfo, HAS_PREV_PAGE, true), _pageInfo)
	      };
	    }

	    // if we don't have the data for this static call already,
	    // return empty arrays with the corresponding diffCalls
	    return {
	      requestedEdgeIDs: [],
	      diffCalls: queryCalls,
	      pageInfo: RelayConnectionInterface.getDefaultPageInfo()
	    };
	  };

	  /**
	   * @param {array<object>} queryCalls
	   * @param {?object} optimisticData
	   * @return {object} includes fields: requestedEdgeIDs, diffCalls
	   */

	  GraphQLRange.prototype._retrieveRangeInfoForFirstQuery = function _retrieveRangeInfoForFirstQuery(queryCalls, optimisticData) {
	    var appendEdgeIDs = [];
	    var prependEdgeIDs = [];
	    var deleteIDs = [];
	    if (optimisticData) {
	      appendEdgeIDs = optimisticData[GraphQLMutatorConstants.APPEND] || [];
	      prependEdgeIDs = optimisticData[GraphQLMutatorConstants.PREPEND] || [];
	      deleteIDs = optimisticData[GraphQLMutatorConstants.REMOVE] || [];
	    }

	    var calls = callsArrayToObject(queryCalls);
	    var countNeeded = calls.first + deleteIDs.length;
	    var segment;
	    var segmentIndex;
	    var pageInfo = _extends({}, RelayConnectionInterface.getDefaultPageInfo());

	    var afterCursor = calls.after;
	    if (afterCursor !== undefined) {
	      segmentIndex = this._getSegmentIndexByCursor(afterCursor);
	      if (segmentIndex == null) {
	        console.warn('GraphQLRange cannot find a segment that has the cursor: ' + afterCursor);
	        return {
	          requestedEdgeIDs: [],
	          diffCalls: [],
	          pageInfo: pageInfo
	        };
	      }
	      segment = this._orderedSegments[segmentIndex];
	    } else {
	      var prependEdgesCount = prependEdgeIDs.length;
	      countNeeded -= prependEdgesCount;

	      segmentIndex = 0;
	      segment = this._orderedSegments[segmentIndex];
	    }

	    var requestedMetadata = segment.getMetadataAfterCursor(countNeeded, afterCursor);
	    var requestedEdgeIDs = requestedMetadata.edgeIDs;
	    var requestedCursors = requestedMetadata.cursors;
	    var diffCalls = [];
	    if (requestedCursors.length) {
	      pageInfo[START_CURSOR] = requestedCursors[0];
	      pageInfo[END_CURSOR] = requestedCursors[requestedCursors.length - 1];
	    }
	    var lastID = requestedEdgeIDs[requestedEdgeIDs.length - 1];
	    // Only requested segment that does not include very last item from
	    // the range can have next page and diff calls
	    if (!this._hasLast || segmentIndex !== this._orderedSegments.length - 1 || lastID && lastID !== segment.getLastID()) {
	      pageInfo[HAS_NEXT_PAGE] = true;
	      if (requestedEdgeIDs.length < countNeeded) {
	        countNeeded -= requestedEdgeIDs.length;
	        var lastCursor = segment.getLastCursor();
	        // If segment has null cursors, retrieve whole range.
	        if (lastCursor === null) {
	          diffCalls.push({ name: 'first', value: calls.first });
	        } else {
	          if (lastCursor !== undefined) {
	            diffCalls.push({ name: 'after', value: lastCursor });
	          }
	          // If this is not the last segment, we should not request edges
	          // that would overlap the first element of the next segment.
	          if (segmentIndex !== this._orderedSegments.length - 1) {
	            var nextSegment = this._orderedSegments[segmentIndex + 1];
	            var firstCursor = nextSegment.getFirstCursor();
	            if (firstCursor !== undefined) {
	              diffCalls.push({ name: 'before', value: firstCursor });
	            }
	          }
	          diffCalls.push({ name: 'first', value: countNeeded });
	        }
	      }
	    }

	    if (optimisticData) {
	      if (prependEdgeIDs.length && !calls.after) {
	        requestedEdgeIDs = prependEdgeIDs.concat(requestedEdgeIDs);
	      }
	      if (appendEdgeIDs.length && !pageInfo[HAS_NEXT_PAGE]) {
	        requestedEdgeIDs = requestedEdgeIDs.concat(appendEdgeIDs);
	      }
	      if (deleteIDs.length) {
	        requestedEdgeIDs = requestedEdgeIDs.filter(function (edgeID) {
	          return deleteIDs.indexOf(edgeID) == -1;
	        });
	      }
	      if (requestedEdgeIDs.length > calls.first) {
	        requestedEdgeIDs = requestedEdgeIDs.slice(0, calls.first);
	      }
	    }

	    return {
	      requestedEdgeIDs: requestedEdgeIDs,
	      diffCalls: diffCalls,
	      pageInfo: pageInfo
	    };
	  };

	  /**
	   * @param {array<object>} queryCalls
	   * @param {?object} optimisticData
	   * @return {object} includes fields: requestedEdgeIDs, diffCalls
	   */

	  GraphQLRange.prototype._retrieveRangeInfoForLastQuery = function _retrieveRangeInfoForLastQuery(queryCalls, optimisticData) {
	    var appendEdgeIDs = [];
	    var prependEdgeIDs = [];
	    var deleteIDs = [];
	    if (optimisticData) {
	      appendEdgeIDs = optimisticData[GraphQLMutatorConstants.APPEND] || [];
	      prependEdgeIDs = optimisticData[GraphQLMutatorConstants.PREPEND] || [];
	      deleteIDs = optimisticData[GraphQLMutatorConstants.REMOVE] || [];
	    }
	    var calls = callsArrayToObject(queryCalls);
	    var countNeeded = calls.last + deleteIDs.length;
	    var segment;
	    var segmentIndex;
	    var pageInfo = _extends({}, RelayConnectionInterface.getDefaultPageInfo());

	    var beforeCursor = calls.before;
	    if (beforeCursor !== undefined) {
	      segmentIndex = this._getSegmentIndexByCursor(beforeCursor);
	      if (segmentIndex == null) {
	        console.warn('GraphQLRange cannot find a segment that has the cursor: ' + beforeCursor);
	        return {
	          requestedEdgeIDs: [],
	          diffCalls: [],
	          pageInfo: pageInfo
	        };
	      }
	      segment = this._orderedSegments[segmentIndex];
	    } else {
	      var appendEdgesCount = appendEdgeIDs.length;
	      countNeeded -= appendEdgesCount;

	      segmentIndex = this._orderedSegments.length - 1;
	      segment = this._orderedSegments[segmentIndex];
	    }

	    var requestedMetadata = segment.getMetadataBeforeCursor(countNeeded, beforeCursor);
	    var requestedEdgeIDs = requestedMetadata.edgeIDs;
	    var requestedCursors = requestedMetadata.cursors;
	    var diffCalls = [];
	    if (requestedCursors.length) {
	      pageInfo[START_CURSOR] = requestedCursors[0];
	      pageInfo[END_CURSOR] = requestedCursors[requestedCursors.length - 1];
	    }
	    var firstID = requestedEdgeIDs[0];
	    // Only requested segment that does not include very first item from
	    // the range can have next page and diff calls
	    if (!this._hasFirst || segmentIndex !== 0 || firstID && firstID !== segment.getFirstID()) {
	      pageInfo[HAS_PREV_PAGE] = true;
	      if (requestedEdgeIDs.length < countNeeded) {
	        countNeeded -= requestedEdgeIDs.length;
	        var firstCursor = segment.getFirstCursor();
	        // If segment has null cursors, retrieve whole range.
	        if (firstCursor === null) {
	          diffCalls.push({ name: 'last', value: calls.last });
	        } else {
	          if (firstCursor !== undefined) {
	            diffCalls.push({ name: 'before', value: firstCursor });
	          }
	          // If this is not the first segment, we should not request edges
	          // that would overlap the last element of the previous segment.
	          if (segmentIndex !== 0) {
	            var prevSegment = this._orderedSegments[segmentIndex - 1];
	            var lastCursor = prevSegment.getLastCursor();
	            if (lastCursor !== undefined) {
	              diffCalls.push({ name: 'after', value: lastCursor });
	            }
	          }
	          diffCalls.push({ name: 'last', value: countNeeded });
	        }
	      }
	    }

	    if (optimisticData) {
	      if (appendEdgeIDs.length && !calls.before) {
	        requestedEdgeIDs = requestedEdgeIDs.concat(appendEdgeIDs);
	      }
	      if (prependEdgeIDs.length && !pageInfo[HAS_PREV_PAGE]) {
	        requestedEdgeIDs = prependEdgeIDs.concat(requestedEdgeIDs);
	      }
	      if (deleteIDs.length) {
	        requestedEdgeIDs = requestedEdgeIDs.filter(function (edgeID) {
	          return deleteIDs.indexOf(edgeID) == -1;
	        });
	      }
	      if (requestedEdgeIDs.length > calls.last) {
	        var length = requestedEdgeIDs.length;
	        requestedEdgeIDs = requestedEdgeIDs.slice(length - calls.last, length);
	      }
	    }

	    return {
	      requestedEdgeIDs: requestedEdgeIDs,
	      diffCalls: diffCalls,
	      pageInfo: pageInfo
	    };
	  };

	  GraphQLRange.fromJSON = function fromJSON(descriptor) {
	    var _descriptor = _slicedToArray(descriptor, 4);

	    var hasFirst = _descriptor[0];
	    var hasLast = _descriptor[1];
	    var staticQueriesMap = _descriptor[2];
	    var orderedSegments = _descriptor[3];

	    var range = new GraphQLRange();
	    range._hasFirst = hasFirst;
	    range._hasLast = hasLast;
	    range._staticQueriesMap = staticQueriesMap;
	    range._orderedSegments = orderedSegments.map(function (descriptor) {
	      return GraphQLSegment.fromJSON(descriptor);
	    });
	    return range;
	  };

	  GraphQLRange.prototype.toJSON = function toJSON() {
	    return [this._hasFirst, this._hasLast, this._staticQueriesMap, this._orderedSegments];
	  };

	  GraphQLRange.prototype.__debug = function __debug() {
	    return {
	      orderedSegments: this._orderedSegments
	    };
	  };

	  GraphQLRange.prototype.getEdgeIDs = function getEdgeIDs() {
	    var edgeIDs = [];
	    this._orderedSegments.forEach(function (segment) {
	      edgeIDs.push.apply(edgeIDs, _toConsumableArray(segment.getEdgeIDs()));
	    });
	    forEachObject(this._staticQueriesMap, function (query) {
	      edgeIDs.push.apply(edgeIDs, _toConsumableArray(query.edgeIDs));
	    });
	    return edgeIDs;
	  };

	  return GraphQLRange;
	})();

	function _callsToString(calls) {
	  return calls.map(function (call) {
	    return serializeRelayQueryCall(call).substring(1);
	  }).join(',');
	}

	module.exports = GraphQLRange;

/***/ },
/* 75 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule GraphQLStoreQueryResolver
	 * @typechecks
	 * 
	 */

	'use strict';

	var _classCallCheck = __webpack_require__(1)['default'];

	var _slicedToArray = __webpack_require__(61)['default'];

	var _Object$keys = __webpack_require__(10)['default'];

	var RelayProfiler = __webpack_require__(4);

	var filterExclusiveKeys = __webpack_require__(149);
	var readRelayQueryData = __webpack_require__(86);
	var recycleNodesInto = __webpack_require__(160);

	/**
	 * @internal
	 *
	 * Resolves data from fragment pointers.
	 *
	 * The supplied `callback` will be invoked whenever data returned by the last
	 * invocation to `resolve` has changed.
	 */

	var GraphQLStoreQueryResolver = (function () {
	  function GraphQLStoreQueryResolver(storeData, fragmentPointer, callback) {
	    _classCallCheck(this, GraphQLStoreQueryResolver);

	    this.reset();
	    this._callback = callback;
	    this._fragmentPointer = fragmentPointer;
	    this._resolver = null;
	    this._storeData = storeData;
	  }

	  /**
	   * Resolves plural fragments.
	   */

	  /**
	   * Resets the resolver's internal state such that future `resolve()` results
	   * will not be `===` to previous results, and unsubscribes any subscriptions.
	   */

	  GraphQLStoreQueryResolver.prototype.reset = function reset() {
	    if (this._resolver) {
	      this._resolver.reset();
	    }
	  };

	  GraphQLStoreQueryResolver.prototype.resolve = function resolve(fragmentPointer) {
	    var resolver = this._resolver;
	    if (!resolver) {
	      resolver = this._fragmentPointer.getFragment().isPlural() ? new GraphQLStorePluralQueryResolver(this._storeData, this._callback) : new GraphQLStoreSingleQueryResolver(this._storeData, this._callback);
	      this._resolver = resolver;
	    }
	    return resolver.resolve(fragmentPointer);
	  };

	  return GraphQLStoreQueryResolver;
	})();

	var GraphQLStorePluralQueryResolver = (function () {
	  function GraphQLStorePluralQueryResolver(storeData, callback) {
	    _classCallCheck(this, GraphQLStorePluralQueryResolver);

	    this.reset();
	    this._callback = callback;
	    this._storeData = storeData;
	  }

	  /**
	   * Resolves non-plural fragments.
	   */

	  GraphQLStorePluralQueryResolver.prototype.reset = function reset() {
	    if (this._resolvers) {
	      this._resolvers.forEach(function (resolver) {
	        return resolver.reset();
	      });
	    }
	    this._resolvers = [];
	    this._results = [];
	  };

	  /**
	   * Resolves a plural fragment pointer into an array of records.
	   *
	   * If the data, order, and number of resolved records has not changed since
	   * the last call to `resolve`, the same array will be returned. Otherwise, a
	   * new array will be returned.
	   */

	  GraphQLStorePluralQueryResolver.prototype.resolve = function resolve(fragmentPointer) {
	    var prevResults = this._results;
	    var nextResults;

	    var nextIDs = fragmentPointer.getDataIDs();
	    var prevLength = prevResults.length;
	    var nextLength = nextIDs.length;
	    var resolvers = this._resolvers;

	    // Ensure that we have exactly `nextLength` resolvers.
	    while (resolvers.length < nextLength) {
	      resolvers.push(new GraphQLStoreSingleQueryResolver(this._storeData, this._callback));
	    }
	    while (resolvers.length > nextLength) {
	      resolvers.pop().reset();
	    }

	    // Allocate `nextResults` if and only if results have changed.
	    if (prevLength !== nextLength) {
	      nextResults = [];
	    }
	    for (var ii = 0; ii < nextLength; ii++) {
	      var nextResult = resolvers[ii].resolve(fragmentPointer, nextIDs[ii]);
	      if (nextResults || ii >= prevLength || nextResult !== prevResults[ii]) {
	        nextResults = nextResults || prevResults.slice(0, ii);
	        nextResults.push(nextResult);
	      }
	    }

	    if (nextResults) {
	      this._results = nextResults;
	    }
	    return this._results;
	  };

	  return GraphQLStorePluralQueryResolver;
	})();

	var GraphQLStoreSingleQueryResolver = (function () {
	  function GraphQLStoreSingleQueryResolver(storeData, callback) {
	    _classCallCheck(this, GraphQLStoreSingleQueryResolver);

	    this.reset();
	    this._callback = callback;
	    this._garbageCollector = storeData.getGarbageCollector();
	    this._storeData = storeData;
	    this._subscribedIDs = {};
	  }

	  GraphQLStoreSingleQueryResolver.prototype.reset = function reset() {
	    if (this._subscription) {
	      this._subscription.remove();
	    }
	    this._hasDataChanged = false;
	    this._fragment = null;
	    this._result = null;
	    this._resultID = null;
	    this._subscription = null;
	    this._updateGarbageCollectorSubscriptionCount({});
	    this._subscribedIDs = {};
	  };

	  /**
	   * Resolves data for a single fragment pointer.
	   *
	   * NOTE: `nextPluralID` should only be passed by the plural query resolver.
	   */

	  GraphQLStoreSingleQueryResolver.prototype.resolve = function resolve(fragmentPointer, nextPluralID) {
	    var nextFragment = fragmentPointer.getFragment();
	    var prevFragment = this._fragment;

	    var nextID = nextPluralID || fragmentPointer.getDataID();
	    var prevID = this._resultID;
	    var nextResult;
	    var prevResult = this._result;
	    var subscribedIDs;

	    if (prevFragment != null && prevID != null && this._getCanonicalID(prevID) === this._getCanonicalID(nextID)) {
	      if (prevID !== nextID || this._hasDataChanged || !nextFragment.isEquivalent(prevFragment)) {
	        var _resolveFragment2 = this._resolveFragment(nextFragment, nextID);

	        // same canonical ID,
	        // but the data, call(s), route, and/or variables have changed

	        var _resolveFragment22 = _slicedToArray(_resolveFragment2, 2);

	        nextResult = _resolveFragment22[0];
	        subscribedIDs = _resolveFragment22[1];

	        nextResult = recycleNodesInto(prevResult, nextResult);
	      } else {
	        // same id, route, variables, and data
	        nextResult = prevResult;
	      }
	    } else {
	      var _resolveFragment3 = this._resolveFragment(nextFragment, nextID);

	      // Pointer has a different ID or is/was fake data.

	      var _resolveFragment32 = _slicedToArray(_resolveFragment3, 2);

	      nextResult = _resolveFragment32[0];
	      subscribedIDs = _resolveFragment32[1];
	    }

	    // update subscriptions whenever results change
	    if (prevResult !== nextResult) {
	      if (this._subscription) {
	        this._subscription.remove();
	        this._subscription = null;
	      }
	      if (subscribedIDs) {
	        // always subscribe to the root ID
	        subscribedIDs[nextID] = true;
	        var changeEmitter = this._storeData.getChangeEmitter();
	        this._subscription = changeEmitter.addListenerForIDs(_Object$keys(subscribedIDs), this._handleChange.bind(this));
	        this._updateGarbageCollectorSubscriptionCount(subscribedIDs);
	        this._subscribedIDs = subscribedIDs;
	      }
	      this._resultID = nextID;
	      this._result = nextResult;
	    }

	    this._hasDataChanged = false;
	    this._fragment = nextFragment;

	    return this._result;
	  };

	  /**
	   * Ranges publish events for the entire range, not the specific view of that
	   * range. For example, if "client:1" is a range, the event is on "client:1",
	   * not "client:1_first(5)".
	   */

	  GraphQLStoreSingleQueryResolver.prototype._getCanonicalID = function _getCanonicalID(id) {
	    return this._storeData.getRangeData().getCanonicalClientID(id);
	  };

	  GraphQLStoreSingleQueryResolver.prototype._handleChange = function _handleChange() {
	    if (!this._hasDataChanged) {
	      this._hasDataChanged = true;
	      this._callback();
	    }
	  };

	  GraphQLStoreSingleQueryResolver.prototype._resolveFragment = function _resolveFragment(fragment, dataID) {
	    var _readRelayQueryData = readRelayQueryData(this._storeData, fragment, dataID);

	    var data = _readRelayQueryData.data;
	    var dataIDs = _readRelayQueryData.dataIDs;

	    return [data, dataIDs];
	  };

	  /**
	   * Updates bookkeeping about the number of subscribers on each record.
	   */

	  GraphQLStoreSingleQueryResolver.prototype._updateGarbageCollectorSubscriptionCount = function _updateGarbageCollectorSubscriptionCount(nextDataIDs) {
	    var _this = this;

	    if (this._garbageCollector) {
	      (function () {
	        var garbageCollector = _this._garbageCollector;
	        var rangeData = _this._storeData.getRangeData();

	        var prevDataIDs = _this._subscribedIDs;

	        var _filterExclusiveKeys = filterExclusiveKeys(prevDataIDs, nextDataIDs);

	        var _filterExclusiveKeys2 = _slicedToArray(_filterExclusiveKeys, 2);

	        var removed = _filterExclusiveKeys2[0];
	        var added = _filterExclusiveKeys2[1];

	        // Note: the same canonical ID may appear in both removed and added: in
	        // that case, it would have been:
	        // - previous: canonical ID ref count is incremented
	        // - current: canonical ID is incremented *and* decremented
	        // In both cases the next ref count change is +1.
	        added.forEach(function (id) {
	          id = rangeData.getCanonicalClientID(id);
	          garbageCollector.incrementReferenceCount(id);
	        });
	        removed.forEach(function (id) {
	          id = rangeData.getCanonicalClientID(id);
	          garbageCollector.decrementReferenceCount(id);
	        });
	      })();
	    }
	  };

	  return GraphQLStoreSingleQueryResolver;
	})();

	RelayProfiler.instrumentMethods(GraphQLStoreQueryResolver.prototype, {
	  resolve: 'GraphQLStoreQueryResolver.resolve'
	});

	module.exports = GraphQLStoreQueryResolver;

/***/ },
/* 76 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule RelayChangeTracker
	 * 
	 * @typechecks
	 */

	'use strict';

	var _classCallCheck = __webpack_require__(1)['default'];

	var _Object$freeze = __webpack_require__(39)['default'];

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	/**
	 * @internal
	 *
	 * Keeps track of records that have been created or updated; used primarily to
	 * record changes during the course of a `write` operation.
	 */

	var RelayChangeTracker = (function () {
	  function RelayChangeTracker() {
	    _classCallCheck(this, RelayChangeTracker);

	    this._created = {};
	    this._updated = {};
	  }

	  /**
	   * Record the creation of a record.
	   */

	  RelayChangeTracker.prototype.createID = function createID(recordID) {
	    this._created[recordID] = true;
	  };

	  /**
	   * Record an update to a record.
	   */

	  RelayChangeTracker.prototype.updateID = function updateID(recordID) {
	    if (!this._created.hasOwnProperty(recordID)) {
	      this._updated[recordID] = true;
	    }
	  };

	  /**
	   * Determine if the record has any changes (was created or updated).
	   */

	  RelayChangeTracker.prototype.hasChange = function hasChange(recordID) {
	    return !!(this._updated[recordID] || this._created[recordID]);
	  };

	  /**
	   * Determine if the record was created.
	   */

	  RelayChangeTracker.prototype.isNewRecord = function isNewRecord(recordID) {
	    return !!this._created[recordID];
	  };

	  /**
	   * Get the ids of records that were created/updated.
	   */

	  RelayChangeTracker.prototype.getChangeSet = function getChangeSet() {
	    if (true) {
	      return {
	        created: _Object$freeze(this._created),
	        updated: _Object$freeze(this._updated)
	      };
	    }
	    return {
	      created: this._created,
	      updated: this._updated
	    };
	  };

	  return RelayChangeTracker;
	})();

	module.exports = RelayChangeTracker;

/***/ },
/* 77 */
/***/ function(module, exports) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule RelayMutationTransactionStatus
	 * @typechecks
	 * 
	 */

	'use strict';

	var RelayMutationTransactionStatus = {
	  /**
	   * Transaction hasn't yet been sent to the server. Client has an optimistic
	   * update applied if the mutation defined one. Transaction can be committed or
	   * rolledback.
	   */
	  UNCOMMITTED: 'UNCOMMITTED',

	  /**
	   * Transaction was committed but another transaction with the same collision
	   * key is pending, so the transaction has been queued to send to the server.
	   */
	  COMMIT_QUEUED: 'COMMIT_QUEUED',

	  /**
	   * Transaction was queued for commit but another transaction with the same
	   * collision queue failed to commit. All transactions in the collision
	   * queue, including this one, have been failed as well. Transaction can be
	   * recommitted or rolledback.
	   */
	  COLLISION_COMMIT_FAILED: 'COLLISION_COMMIT_FAILED',

	  /**
	   * Transaction was sent to the server for comitting and a response is awaited.
	   */
	  COMMITTING: 'COMMITTING',

	  /**
	   * Transaction was sent to the server for comitting but was failed.
	   */
	  COMMIT_FAILED: 'COMMIT_FAILED'
	};

	module.exports = RelayMutationTransactionStatus;

/***/ },
/* 78 */
/***/ function(module, exports) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule RelayMutationType
	 * @typechecks
	 * 
	 */

	'use strict';

	var RelayMutationType = {
	  FIELDS_CHANGE: 'FIELDS_CHANGE',
	  NODE_DELETE: 'NODE_DELETE',
	  RANGE_ADD: 'RANGE_ADD',
	  RANGE_DELETE: 'RANGE_DELETE',
	  REQUIRED_CHILDREN: 'REQUIRED_CHILDREN'
	};

	module.exports = RelayMutationType;

/***/ },
/* 79 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule RelayRouteFragment
	 * 
	 * @typechecks
	 */

	'use strict';

	var _classCallCheck = __webpack_require__(1)['default'];

	/**
	 * Represents a query fragment that is conditional upon the active route as a
	 * function that returns either a literal fragment or a fragment reference.
	 *
	 * Example GraphQL:
	 *
	 * ```
	 * Node {
	 *   ${(route) => matchRoute(route, ...)}
	 * }
	 * ```
	 */

	var RelayRouteFragment = (function () {
	  function RelayRouteFragment(builder) {
	    _classCallCheck(this, RelayRouteFragment);

	    this._builder = builder;
	  }

	  /**
	   * Returns the query fragment that matches the given route, if any.
	   */

	  RelayRouteFragment.prototype.getFragmentForRoute = function getFragmentForRoute(route) {
	    return this._builder(route);
	  };

	  return RelayRouteFragment;
	})();

	module.exports = RelayRouteFragment;

/***/ },
/* 80 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule callsToGraphQL
	 * 
	 * @typechecks
	 */

	'use strict';

	var QueryBuilder = __webpack_require__(17);

	/**
	 * @internal
	 *
	 * Convert from plain object `{name, value}` calls to GraphQL call nodes.
	 */
	function callsToGraphQL(calls) {
	  return calls.map(function (_ref) {
	    var name = _ref.name;
	    var value = _ref.value;

	    var concreteValue = null;
	    if (Array.isArray(value)) {
	      concreteValue = value.map(QueryBuilder.createCallValue);
	    } else if (value != null) {
	      concreteValue = QueryBuilder.createCallValue(value);
	    }
	    return QueryBuilder.createCall(name, concreteValue);
	  });
	}

	module.exports = callsToGraphQL;

/***/ },
/* 81 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule fromGraphQL
	 * 
	 */

	'use strict';

	var RelayQuery = __webpack_require__(3);
	var RelayMetaRoute = __webpack_require__(21);

	var invariant = __webpack_require__(2);

	/**
	 * @internal
	 *
	 * Converts GraphQL nodes to RelayQuery nodes.
	 */
	var fromGraphQL = {
	  Field: (function (_Field) {
	    function Field(_x) {
	      return _Field.apply(this, arguments);
	    }

	    Field.toString = function () {
	      return _Field.toString();
	    };

	    return Field;
	  })(function (query) {
	    var node = createNode(query, RelayQuery.Field);
	    !(node instanceof RelayQuery.Field) ?  true ? invariant(false, 'fromGraphQL.Field(): Expected a GraphQL field node.') : invariant(false) : undefined;
	    return node;
	  }),
	  Fragment: (function (_Fragment) {
	    function Fragment(_x2) {
	      return _Fragment.apply(this, arguments);
	    }

	    Fragment.toString = function () {
	      return _Fragment.toString();
	    };

	    return Fragment;
	  })(function (query) {
	    var node = createNode(query, RelayQuery.Fragment);
	    !(node instanceof RelayQuery.Fragment) ?  true ? invariant(false, 'fromGraphQL.Field(): Expected a GraphQL fragment node.') : invariant(false) : undefined;
	    return node;
	  }),
	  Query: function Query(query) {
	    var node = createNode(query, RelayQuery.Root);
	    !(node instanceof RelayQuery.Root) ?  true ? invariant(false, 'fromGraphQL.Operation(): Expected a root node.') : invariant(false) : undefined;
	    return node;
	  },
	  Operation: (function (_Operation) {
	    function Operation(_x3) {
	      return _Operation.apply(this, arguments);
	    }

	    Operation.toString = function () {
	      return _Operation.toString();
	    };

	    return Operation;
	  })(function (query) {
	    var node = createNode(query, RelayQuery.Operation);
	    !(node instanceof RelayQuery.Operation) ?  true ? invariant(false, 'fromGraphQL.Operation(): Expected a mutation/subscription node.') : invariant(false) : undefined;
	    return node;
	  })
	};

	function createNode(query, desiredType) {
	  var variables = {};
	  var route = RelayMetaRoute.get('$fromGraphQL');
	  return desiredType.create(query, route, variables);
	}

	module.exports = fromGraphQL;

/***/ },
/* 82 */
/***/ function(module, exports) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule generateClientEdgeID
	 * 
	 * @typechecks
	 */

	'use strict';

	/**
	 * Generate an edge client id for edges on connections based on the range it
	 * belongs to and the node it contains.
	 *
	 * @internal
	 */
	function generateClientEdgeID(rangeID, nodeID) {
	  return 'client:' + rangeID + ':' + nodeID;
	}

	module.exports = generateClientEdgeID;

/***/ },
/* 83 */
/***/ function(module, exports) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule generateForceIndex
	 * 
	 * @typechecks
	 */

	'use strict';

	var _index = 1;

	/**
	 * Generate a new force index used to write GraphQL data in the store. A new
	 * force index can be used to overwrite previous ranges.
	 *
	 * @internal
	 */
	function generateForceIndex() {
	  return _index++;
	}

	module.exports = generateForceIndex;

/***/ },
/* 84 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule getRelayQueries
	 * 
	 */

	'use strict';

	var _Object$keys = __webpack_require__(10)['default'];

	var Map = __webpack_require__(69);

	var RelayMetaRoute = __webpack_require__(21);
	var RelayProfiler = __webpack_require__(4);
	var RelayQuery = __webpack_require__(3);

	var buildRQL = __webpack_require__(54);
	var invariant = __webpack_require__(2);
	var stableStringify = __webpack_require__(87);
	var warning = __webpack_require__(11);

	var queryCache = new Map();

	/**
	 * @internal
	 *
	 * `getRelayQueries` retrieves all queries for a component given a route.
	 */
	function getRelayQueries(Component, route) {
	  if (!queryCache.has(Component)) {
	    queryCache.set(Component, {});
	  }
	  var cacheKey = route.name + ':' + stableStringify(route.params);
	  var cache = queryCache.get(Component);
	  if (cache.hasOwnProperty(cacheKey)) {
	    return cache[cacheKey];
	  }
	  var querySet = {};
	  Component.getFragmentNames().forEach(function (fragmentName) {
	    querySet[fragmentName] = null;
	  });
	  _Object$keys(route.queries).forEach(function (queryName) {
	    if (!Component.hasFragment(queryName)) {
	       true ? warning(false, 'Relay.QL: query `%s.queries.%s` is invalid, expected fragment ' + '`%s.fragments.%s` to be defined.', route.name, queryName, Component.displayName, queryName) : undefined;
	      return;
	    }
	    var queryBuilder = route.queries[queryName];
	    if (queryBuilder) {
	      var concreteQuery = buildRQL.Query(queryBuilder, Component, queryName, route.params);
	      !(concreteQuery !== undefined) ?  true ? invariant(false, 'Relay.QL: query `%s.queries.%s` is invalid, a typical query is ' + 'defined using: () => Relay.QL`query { ... }`.', route.name, queryName) : invariant(false) : undefined;
	      if (concreteQuery) {
	        var rootQuery = RelayQuery.Root.create(concreteQuery, RelayMetaRoute.get(route.name), route.params);
	        var identifyingArg = rootQuery.getIdentifyingArg();
	        if (!identifyingArg || identifyingArg.value !== undefined) {
	          querySet[queryName] = rootQuery;
	          return;
	        }
	      }
	    }
	    querySet[queryName] = null;
	  });
	  cache[cacheKey] = querySet;
	  return querySet;
	}

	module.exports = RelayProfiler.instrument('Relay.getQueries', getRelayQueries);

/***/ },
/* 85 */
/***/ function(module, exports) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule isRelayContainer
	 * 
	 * @typechecks
	 */

	'use strict';

	function isRelayContainer(component) {
	  return !!(component && component.getFragmentNames && component.getFragment && component.hasFragment && component.hasVariable);
	}

	module.exports = isRelayContainer;

/***/ },
/* 86 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule readRelayQueryData
	 * 
	 * @typechecks
	 */

	'use strict';

	var _inherits = __webpack_require__(5)['default'];

	var _classCallCheck = __webpack_require__(1)['default'];

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	var GraphQLFragmentPointer = __webpack_require__(20);
	var GraphQLStoreDataHandler = __webpack_require__(6);

	var RelayConnectionInterface = __webpack_require__(7);

	var RelayProfiler = __webpack_require__(4);
	var RelayQuery = __webpack_require__(3);
	var RelayQueryVisitor = __webpack_require__(18);
	var RelayRecordState = __webpack_require__(27);

	var callsFromGraphQL = __webpack_require__(55);
	var callsToGraphQL = __webpack_require__(80);
	var invariant = __webpack_require__(2);
	var isCompatibleRelayFragmentType = __webpack_require__(29);
	var validateRelayReadQuery = __webpack_require__(164);

	var EDGES = RelayConnectionInterface.EDGES;
	var PAGE_INFO = RelayConnectionInterface.PAGE_INFO;

	var METADATA_KEYS = ['__status__', '__resolvedFragmentMapGeneration__'];

	/**
	 * @internal
	 *
	 * Retrieves data from the `RelayStore`.
	 */
	function readRelayQueryData(storeData, queryNode, dataID, options) {
	  var reader = new RelayStoreReader(storeData, options);
	  var data = reader.retrieveData(queryNode, dataID);

	  // We validate only after retrieving the data, to give our `invariant`
	  // checks below a chance to fail fast.
	  validateRelayReadQuery(queryNode, options);

	  return data;
	}

	var RelayStoreReader = (function (_RelayQueryVisitor) {
	  _inherits(RelayStoreReader, _RelayQueryVisitor);

	  function RelayStoreReader(storeData, options) {
	    _classCallCheck(this, RelayStoreReader);

	    _RelayQueryVisitor.call(this);
	    this._rangeData = storeData.getRangeData();
	    this._recordStore = storeData.getQueuedStore();
	    this._traverseFragmentReferences = options && options.traverseFragmentReferences || false;
	    this._traverseGeneratedFields = options && options.traverseGeneratedFields || false;
	  }

	  /**
	   * Checks that `parent` either has range calls on it or does not contain either
	   * `page_info` or `edges` fields. This enforcement intentionally transcends
	   * traverseFragmentReferences boundaries.
	   */

	  /**
	   * Runs `queryNode` against the data in `dataID` and returns the result.
	   */

	  RelayStoreReader.prototype.retrieveData = function retrieveData(queryNode, dataID) {
	    var result = {
	      data: undefined,
	      dataIDs: {}
	    };
	    var rangeData = this._rangeData.parseRangeClientID(dataID);
	    var status = this._recordStore.getRecordState(rangeData ? rangeData.dataID : dataID);
	    if (status === RelayRecordState.EXISTENT) {
	      var state = {
	        componentDataID: null,
	        data: undefined,
	        parent: null,
	        rangeInfo: null,
	        seenDataIDs: result.dataIDs,
	        storeDataID: dataID
	      };
	      this.visit(queryNode, state);
	      result.data = state.data;
	    } else if (status === RelayRecordState.NONEXISTENT) {
	      result.data = null;
	    }
	    return result;
	  };

	  RelayStoreReader.prototype.visitField = function visitField(node, state) {
	    // Check for range client IDs (eg. `someID_first(25)`) and unpack if
	    // present, overriding `state`.
	    this._handleRangeInfo(node, state);

	    if (!node.isScalar() || node.isGenerated()) {
	      // Make sure we return at least the __dataID__.
	      getDataObject(state);
	    }

	    if (node.isGenerated() && !this._traverseGeneratedFields) {
	      return;
	    }
	    var rangeInfo = state.rangeInfo;
	    if (rangeInfo && node.getSchemaName() === EDGES) {
	      this._readEdges(node, rangeInfo, state);
	    } else if (rangeInfo && node.getSchemaName() === PAGE_INFO) {
	      this._readPageInfo(node, rangeInfo, state);
	    } else if (node.isScalar()) {
	      this._readScalar(node, state);
	    } else if (node.isPlural()) {
	      this._readPlural(node, state);
	    } else if (node.isConnection()) {
	      this._readConnection(node, state);
	    } else {
	      this._readLinkedField(node, state);
	    }
	    state.seenDataIDs[state.storeDataID] = true;
	  };

	  RelayStoreReader.prototype.visitFragment = function visitFragment(node, state) {
	    var dataID = getComponentDataID(state);
	    if (node.isContainerFragment() && !this._traverseFragmentReferences) {
	      state.seenDataIDs[dataID] = true;
	      var fragmentPointer = new GraphQLFragmentPointer(node.isPlural() ? [dataID] : dataID, node);
	      this._setDataValue(state, fragmentPointer.getFragment().getConcreteFragmentHash(), fragmentPointer);
	    } else if (isCompatibleRelayFragmentType(node, this._recordStore.getType(dataID))) {
	      this.traverse(node, state);
	    }
	  };

	  RelayStoreReader.prototype._readScalar = function _readScalar(node, state) {
	    var storageKey = node.getStorageKey();
	    var field = this._recordStore.getField(state.storeDataID, storageKey);
	    if (field === undefined) {
	      return;
	    } else if (field === null && !state.data) {
	      state.data = null;
	    } else {
	      this._setDataValue(state, node.getApplicationName(), Array.isArray(field) ? field.slice() : field);
	    }
	  };

	  RelayStoreReader.prototype._readPlural = function _readPlural(node, state) {
	    var _this = this;

	    var storageKey = node.getStorageKey();
	    var dataIDs = this._recordStore.getLinkedRecordIDs(state.storeDataID, storageKey);
	    if (dataIDs) {
	      var applicationName = node.getApplicationName();
	      var previousData = getDataValue(state, applicationName);
	      var nextData = dataIDs.map(function (dataID, ii) {
	        var data;
	        if (previousData instanceof Object) {
	          data = previousData[ii];
	        }
	        var nextState = {
	          componentDataID: null,
	          data: data,
	          parent: node,
	          rangeInfo: null,
	          seenDataIDs: state.seenDataIDs,
	          storeDataID: dataID
	        };
	        node.getChildren().forEach(function (child) {
	          return _this.visit(child, nextState);
	        });
	        return nextState.data;
	      });
	      this._setDataValue(state, applicationName, nextData);
	    }
	  };

	  RelayStoreReader.prototype._readConnection = function _readConnection(node, state) {
	    var applicationName = node.getApplicationName();
	    var storageKey = node.getStorageKey();
	    var calls = node.getCallsWithValues();
	    var dataID = this._recordStore.getLinkedRecordID(state.storeDataID, storageKey);
	    if (!dataID) {
	      return;
	    }
	    enforceRangeCalls(node);
	    var metadata = this._recordStore.getRangeMetadata(dataID, calls);
	    var nextState = {
	      componentDataID: this._getConnectionClientID(node, dataID),
	      data: getDataValue(state, applicationName),
	      parent: node,
	      rangeInfo: metadata && calls.length ? metadata : null,
	      seenDataIDs: state.seenDataIDs,
	      storeDataID: dataID
	    };
	    this.traverse(node, nextState);
	    this._setDataValue(state, applicationName, nextState.data);
	  };

	  RelayStoreReader.prototype._readEdges = function _readEdges(node, rangeInfo, state) {
	    var _this2 = this;

	    var previousData = getDataValue(state, EDGES);
	    var edges = rangeInfo.filteredEdges.map(function (edgeData, ii) {
	      var data;
	      if (previousData instanceof Object) {
	        data = previousData[ii];
	      }
	      var nextState = {
	        componentDataID: null,
	        data: data,
	        parent: node,
	        rangeInfo: null,
	        seenDataIDs: state.seenDataIDs,
	        storeDataID: edgeData.edgeID
	      };
	      _this2.traverse(node, nextState);
	      return nextState.data;
	    });
	    this._setDataValue(state, EDGES, edges);
	  };

	  RelayStoreReader.prototype._readPageInfo = function _readPageInfo(node, rangeInfo, state) {
	    var _this3 = this;

	    var pageInfo = rangeInfo.pageInfo;

	    !pageInfo ?  true ? invariant(false, 'readRelayQueryData(): Missing field, `%s`.', PAGE_INFO) : invariant(false) : undefined;
	    var info = pageInfo; // for Flow
	    var nextData;

	    // Page info comes from the range metadata, so we do a custom traversal here
	    // which is simpler than passing through page-info-related state as a hint
	    // for the normal traversal.
	    var read = function read(child) {
	      if (child instanceof RelayQuery.Fragment) {
	        if (child.isContainerFragment() && !_this3._traverseFragmentReferences) {
	          var fragmentPointer = new GraphQLFragmentPointer(getComponentDataID(state), child);
	          nextData = nextData || {};
	          var concreteFragmentHash = fragmentPointer.getFragment().getConcreteFragmentHash();
	          nextData[concreteFragmentHash] = fragmentPointer;
	        } else {
	          child.getChildren().forEach(read);
	        }
	      } else {
	        var field = child;
	        if (!field.isGenerated() || _this3._traverseGeneratedFields) {
	          nextData = nextData || {};
	          nextData[field.getApplicationName()] = info[field.getStorageKey()];
	        }
	      }
	    };
	    node.getChildren().forEach(read);

	    this._setDataValue(state, PAGE_INFO, nextData);
	  };

	  RelayStoreReader.prototype._readLinkedField = function _readLinkedField(node, state) {
	    var storageKey = node.getStorageKey();
	    var applicationName = node.getApplicationName();
	    var dataID = this._recordStore.getLinkedRecordID(state.storeDataID, storageKey);
	    if (dataID == null) {
	      this._setDataValue(state, applicationName, dataID);
	      return;
	    }
	    var nextState = {
	      componentDataID: null,
	      data: getDataValue(state, applicationName),
	      parent: node,
	      rangeInfo: null,
	      seenDataIDs: state.seenDataIDs,
	      storeDataID: dataID
	    };
	    var status = this._recordStore.getRecordState(dataID);
	    if (status === RelayRecordState.EXISTENT) {
	      // Make sure we return at least the __dataID__.
	      getDataObject(nextState);
	    }
	    this.traverse(node, nextState);
	    this._setDataValue(state, applicationName, nextState.data);
	  };

	  /**
	   * Assigns `value` to the property of `state.data` identified by `key`.
	   *
	   * Pre-populates `state` with a suitable `data` object if needed, and copies
	   * over any metadata fields, if present.
	   */

	  RelayStoreReader.prototype._setDataValue = function _setDataValue(state, key, value) {
	    var _this4 = this;

	    var data = getDataObject(state); // ensure __dataID__
	    if (value === undefined) {
	      return;
	    }
	    data[key] = value;

	    // Copy metadata like `__resolvedFragmentMapGeneration__` and `__status__`.
	    METADATA_KEYS.forEach(function (metadataKey) {
	      var metadataValue = _this4._recordStore.getField(state.storeDataID, metadataKey);
	      if (metadataValue != null) {
	        data[metadataKey] = metadataValue;
	      }
	    });
	  };

	  /**
	   * Obtains a client ID (eg. `someDataID_first(10)`) for the connection
	   * identified by `connectionID`. If there are no range calls on the supplied
	   * `node`, then a call-less connection ID (eg. `someDataID`) will be returned
	   * instead.
	   */

	  RelayStoreReader.prototype._getConnectionClientID = function _getConnectionClientID(node, connectionID) {
	    var calls = node.getCallsWithValues();
	    if (!RelayConnectionInterface.hasRangeCalls(calls)) {
	      return connectionID;
	    }
	    return this._rangeData.getClientIDForRangeWithID(callsToGraphQL(calls), {}, connectionID);
	  };

	  /**
	   * Checks to see if we have a range client ID (eg. `someID_first(25)`), and if
	   * so, unpacks the range metadata, stashing it into (and overriding) `state`.
	   */

	  RelayStoreReader.prototype._handleRangeInfo = function _handleRangeInfo(node, state) {
	    var rangeData = this._rangeData.parseRangeClientID(state.storeDataID);
	    if (rangeData != null) {
	      state.componentDataID = state.storeDataID;
	      state.storeDataID = rangeData.dataID;
	      state.rangeInfo = this._recordStore.getRangeMetadata(state.storeDataID, callsFromGraphQL(rangeData.calls, rangeData.callValues));
	    }
	  };

	  return RelayStoreReader;
	})(RelayQueryVisitor);

	function enforceRangeCalls(parent) {
	  if (!parent.__hasValidatedConnectionCalls__) {
	    var calls = parent.getCallsWithValues();
	    if (!RelayConnectionInterface.hasRangeCalls(calls)) {
	      rangeCallEnforcer.traverse(parent, parent);
	    }
	    parent.__hasValidatedConnectionCalls__ = true;
	  }
	}

	var RelayRangeCallEnforcer = (function (_RelayQueryVisitor2) {
	  _inherits(RelayRangeCallEnforcer, _RelayQueryVisitor2);

	  function RelayRangeCallEnforcer() {
	    _classCallCheck(this, RelayRangeCallEnforcer);

	    _RelayQueryVisitor2.apply(this, arguments);
	  }

	  RelayRangeCallEnforcer.prototype.visitField = function visitField(node, parent) {
	    var schemaName = node.getSchemaName();
	    !(schemaName !== EDGES && schemaName !== PAGE_INFO) ?  true ? invariant(false, 'readRelayQueryData(): The field `%s` is a connection. Fields `%s` and ' + '`%s` cannot be fetched without a `first`, `last` or `find` argument.', parent.getApplicationName(), EDGES, PAGE_INFO) : invariant(false) : undefined;
	  };

	  return RelayRangeCallEnforcer;
	})(RelayQueryVisitor);

	var rangeCallEnforcer = new RelayRangeCallEnforcer();

	/**
	 * Returns the component-specific DataID stored in `state`, falling back to the
	 * generic "store" DataID.
	 *
	 * For most nodes, the generic "store" DataID can be used for both reading out
	 * of the store and writing into the result object that will be passed back to
	 * the component. For connections with range calls on them the "store" and
	 * "component" ID will be different because the component needs a special
	 * client-ID that encodes the range calls.
	 */
	function getComponentDataID(state) {
	  if (state.componentDataID != null) {
	    return state.componentDataID;
	  } else {
	    return state.storeDataID;
	  }
	}

	/**
	 * Retrieves `state.data`, initializing it if necessary.
	 */
	function getDataObject(state) {
	  var data = state.data;
	  if (!data) {
	    var pointer = GraphQLStoreDataHandler.createPointerWithID(getComponentDataID(state));
	    data = state.data = pointer;
	  }
	  !(data instanceof Object) ?  true ? invariant(false, 'readRelayQueryData(): Unable to read field on non-object.') : invariant(false) : undefined;
	  return data;
	}

	/**
	 * Looks up the value identified by `key` in `state.data`.
	 *
	 * Pre-populates `state` with a suitable `data` objects if needed.
	 */
	function getDataValue(state, key) {
	  var data = getDataObject(state);
	  return data[key];
	}

	module.exports = RelayProfiler.instrument('readRelayQueryData', readRelayQueryData);

/***/ },
/* 87 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule stableStringify
	 * 
	 */

	'use strict';

	var _Object$keys = __webpack_require__(10)['default'];

	function isObject(value) {
	  return value !== null && Object.prototype.toString.call(value) === '[object Object]';
	}

	/**
	 * Simple recursive stringifier that handles basic objects (does not handle
	 * corner cases such as circular references) and produces a JSON-like
	 * serialization suitable for use as a cache key or other similar internal
	 * book-keeping detail.
	 *
	 * Sample input:
	 *
	 *     var object = {
	 *       top2: {
	 *         middle: {
	 *           inner: [1, 'foo', ['bar', 2]],
	 *           other: false,
	 *         },
	 *       },
	 *       top1: [
	 *         {first: true},
	 *         {first: false},
	 *         'random',
	 *       ],
	 *       misc: true,
	 *       extra: null,
	 *     };
	 *
	 * Sample output (some whitespace added for clarity):
	 *
	 *    {
	 *      extra:null,
	 *      misc:true,
	 *      top1:[0:{first:true},1:{first:false},2:"random"],
	 *      top2:{middle:{inner:[0:1,1:"foo",2:[0:"bar",1:2]],other:false}}
	 *    }
	 */
	function stableStringify(input) {
	  var inputIsArray = Array.isArray(input);
	  var inputIsObject = isObject(input);
	  if (inputIsArray || inputIsObject) {
	    var keys = _Object$keys(input);
	    if (keys.length) {
	      var result = [];
	      keys.sort();

	      for (var i = 0; i < keys.length; i++) {
	        var key = keys[i];
	        var value = input[key];
	        if (isObject(value) || Array.isArray(value)) {
	          value = stableStringify(value);
	        } else {
	          value = JSON.stringify(value);
	        }
	        result.push(key + ':' + value);
	      }

	      if (inputIsArray) {
	        return '[' + result.join(',') + ']';
	      } else {
	        return '{' + result.join(',') + '}';
	      }
	    }
	  }
	  return JSON.stringify(input);
	}

	module.exports = stableStringify;

/***/ },
/* 88 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {"use strict";

	// Use the fastest means possible to execute a task in its own turn, with
	// priority over other events including IO, animation, reflow, and redraw
	// events in browsers.
	//
	// An exception thrown by a task will permanently interrupt the processing of
	// subsequent tasks. The higher level `asap` function ensures that if an
	// exception is thrown by a task, that the task queue will continue flushing as
	// soon as possible, but if you use `rawAsap` directly, you are responsible to
	// either ensure that no exceptions are thrown from your task, or to manually
	// call `rawAsap.requestFlush` if an exception is thrown.
	module.exports = rawAsap;
	function rawAsap(task) {
	    if (!queue.length) {
	        requestFlush();
	        flushing = true;
	    }
	    // Equivalent to push, but avoids a function call.
	    queue[queue.length] = task;
	}

	var queue = [];
	// Once a flush has been requested, no further calls to `requestFlush` are
	// necessary until the next `flush` completes.
	var flushing = false;
	// `requestFlush` is an implementation-specific method that attempts to kick
	// off a `flush` event as quickly as possible. `flush` will attempt to exhaust
	// the event queue before yielding to the browser's own event loop.
	var requestFlush;
	// The position of the next task to execute in the task queue. This is
	// preserved between calls to `flush` so that it can be resumed if
	// a task throws an exception.
	var index = 0;
	// If a task schedules additional tasks recursively, the task queue can grow
	// unbounded. To prevent memory exhaustion, the task queue will periodically
	// truncate already-completed tasks.
	var capacity = 1024;

	// The flush function processes all tasks that have been scheduled with
	// `rawAsap` unless and until one of those tasks throws an exception.
	// If a task throws an exception, `flush` ensures that its state will remain
	// consistent and will resume where it left off when called again.
	// However, `flush` does not make any arrangements to be called again if an
	// exception is thrown.
	function flush() {
	    while (index < queue.length) {
	        var currentIndex = index;
	        // Advance the index before calling the task. This ensures that we will
	        // begin flushing on the next task the task throws an error.
	        index = index + 1;
	        queue[currentIndex].call();
	        // Prevent leaking memory for long chains of recursive calls to `asap`.
	        // If we call `asap` within tasks scheduled by `asap`, the queue will
	        // grow, but to avoid an O(n) walk for every task we execute, we don't
	        // shift tasks off the queue after they have been executed.
	        // Instead, we periodically shift 1024 tasks off the queue.
	        if (index > capacity) {
	            // Manually shift all values starting at the index back to the
	            // beginning of the queue.
	            for (var scan = 0, newLength = queue.length - index; scan < newLength; scan++) {
	                queue[scan] = queue[scan + index];
	            }
	            queue.length -= index;
	            index = 0;
	        }
	    }
	    queue.length = 0;
	    index = 0;
	    flushing = false;
	}

	// `requestFlush` is implemented using a strategy based on data collected from
	// every available SauceLabs Selenium web driver worker at time of writing.
	// https://docs.google.com/spreadsheets/d/1mG-5UYGup5qxGdEMWkhP6BWCz053NUb2E1QoUTU16uA/edit#gid=783724593

	// Safari 6 and 6.1 for desktop, iPad, and iPhone are the only browsers that
	// have WebKitMutationObserver but not un-prefixed MutationObserver.
	// Must use `global` instead of `window` to work in both frames and web
	// workers. `global` is a provision of Browserify, Mr, Mrs, or Mop.
	var BrowserMutationObserver = global.MutationObserver || global.WebKitMutationObserver;

	// MutationObservers are desirable because they have high priority and work
	// reliably everywhere they are implemented.
	// They are implemented in all modern browsers.
	//
	// - Android 4-4.3
	// - Chrome 26-34
	// - Firefox 14-29
	// - Internet Explorer 11
	// - iPad Safari 6-7.1
	// - iPhone Safari 7-7.1
	// - Safari 6-7
	if (typeof BrowserMutationObserver === "function") {
	    requestFlush = makeRequestCallFromMutationObserver(flush);

	// MessageChannels are desirable because they give direct access to the HTML
	// task queue, are implemented in Internet Explorer 10, Safari 5.0-1, and Opera
	// 11-12, and in web workers in many engines.
	// Although message channels yield to any queued rendering and IO tasks, they
	// would be better than imposing the 4ms delay of timers.
	// However, they do not work reliably in Internet Explorer or Safari.

	// Internet Explorer 10 is the only browser that has setImmediate but does
	// not have MutationObservers.
	// Although setImmediate yields to the browser's renderer, it would be
	// preferrable to falling back to setTimeout since it does not have
	// the minimum 4ms penalty.
	// Unfortunately there appears to be a bug in Internet Explorer 10 Mobile (and
	// Desktop to a lesser extent) that renders both setImmediate and
	// MessageChannel useless for the purposes of ASAP.
	// https://github.com/kriskowal/q/issues/396

	// Timers are implemented universally.
	// We fall back to timers in workers in most engines, and in foreground
	// contexts in the following browsers.
	// However, note that even this simple case requires nuances to operate in a
	// broad spectrum of browsers.
	//
	// - Firefox 3-13
	// - Internet Explorer 6-9
	// - iPad Safari 4.3
	// - Lynx 2.8.7
	} else {
	    requestFlush = makeRequestCallFromTimer(flush);
	}

	// `requestFlush` requests that the high priority event queue be flushed as
	// soon as possible.
	// This is useful to prevent an error thrown in a task from stalling the event
	// queue if the exception handled by Node.js’s
	// `process.on("uncaughtException")` or by a domain.
	rawAsap.requestFlush = requestFlush;

	// To request a high priority event, we induce a mutation observer by toggling
	// the text of a text node between "1" and "-1".
	function makeRequestCallFromMutationObserver(callback) {
	    var toggle = 1;
	    var observer = new BrowserMutationObserver(callback);
	    var node = document.createTextNode("");
	    observer.observe(node, {characterData: true});
	    return function requestCall() {
	        toggle = -toggle;
	        node.data = toggle;
	    };
	}

	// The message channel technique was discovered by Malte Ubl and was the
	// original foundation for this library.
	// http://www.nonblocking.io/2011/06/windownexttick.html

	// Safari 6.0.5 (at least) intermittently fails to create message ports on a
	// page's first load. Thankfully, this version of Safari supports
	// MutationObservers, so we don't need to fall back in that case.

	// function makeRequestCallFromMessageChannel(callback) {
	//     var channel = new MessageChannel();
	//     channel.port1.onmessage = callback;
	//     return function requestCall() {
	//         channel.port2.postMessage(0);
	//     };
	// }

	// For reasons explained above, we are also unable to use `setImmediate`
	// under any circumstances.
	// Even if we were, there is another bug in Internet Explorer 10.
	// It is not sufficient to assign `setImmediate` to `requestFlush` because
	// `setImmediate` must be called *by name* and therefore must be wrapped in a
	// closure.
	// Never forget.

	// function makeRequestCallFromSetImmediate(callback) {
	//     return function requestCall() {
	//         setImmediate(callback);
	//     };
	// }

	// Safari 6.0 has a problem where timers will get lost while the user is
	// scrolling. This problem does not impact ASAP because Safari 6.0 supports
	// mutation observers, so that implementation is used instead.
	// However, if we ever elect to use timers in Safari, the prevalent work-around
	// is to add a scroll event listener that calls for a flush.

	// `setTimeout` does not call the passed callback if the delay is less than
	// approximately 7 in web workers in Firefox 8 through 18, and sometimes not
	// even then.

	function makeRequestCallFromTimer(callback) {
	    return function requestCall() {
	        // We dispatch a timeout with a specified delay of 0 for engines that
	        // can reliably accommodate that request. This will usually be snapped
	        // to a 4 milisecond delay, but once we're flushing, there's no delay
	        // between events.
	        var timeoutHandle = setTimeout(handleTimer, 0);
	        // However, since this timer gets frequently dropped in Firefox
	        // workers, we enlist an interval handle that will try to fire
	        // an event 20 times per second until it succeeds.
	        var intervalHandle = setInterval(handleTimer, 50);

	        function handleTimer() {
	            // Whichever timer succeeds will cancel both timers and
	            // execute the callback.
	            clearTimeout(timeoutHandle);
	            clearInterval(intervalHandle);
	            callback();
	        }
	    };
	}

	// This is for `asap.js` only.
	// Its name will be periodically randomized to break any code that depends on
	// its existence.
	rawAsap.makeRequestCallFromTimer = makeRequestCallFromTimer;

	// ASAP was originally a nextTick shim included in Q. This was factored out
	// into this ASAP package. It was later adapted to RSVP which made further
	// amendments. These decisions, particularly to marginalize MessageChannel and
	// to capture the MutationObserver implementation in a closure, were integrated
	// back into ASAP proper.
	// https://github.com/tildeio/rsvp.js/blob/cddf7232546a9cf858524b75cde6f9edf72620a7/lib/rsvp/asap.js

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 89 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(174), __esModule: true };

/***/ },
/* 90 */
/***/ function(module, exports, __webpack_require__) {

	// getting tag from 19.1.3.6 Object.prototype.toString()
	var cof = __webpack_require__(91)
	  , TAG = __webpack_require__(15)('toStringTag')
	  // ES3 wrong here
	  , ARG = cof(function(){ return arguments; }()) == 'Arguments';

	module.exports = function(it){
	  var O, T, B;
	  return it === undefined ? 'Undefined' : it === null ? 'Null'
	    // @@toStringTag case
	    : typeof (T = (O = Object(it))[TAG]) == 'string' ? T
	    // builtinTag case
	    : ARG ? cof(O)
	    // ES3 arguments fallback
	    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
	};

/***/ },
/* 91 */
/***/ function(module, exports) {

	var toString = {}.toString;

	module.exports = function(it){
	  return toString.call(it).slice(8, -1);
	};

/***/ },
/* 92 */
/***/ function(module, exports, __webpack_require__) {

	var ctx         = __webpack_require__(30)
	  , call        = __webpack_require__(95)
	  , isArrayIter = __webpack_require__(94)
	  , anObject    = __webpack_require__(40)
	  , toLength    = __webpack_require__(103)
	  , getIterFn   = __webpack_require__(66);
	module.exports = function(iterable, entries, fn, that){
	  var iterFn = getIterFn(iterable)
	    , f      = ctx(fn, that, entries ? 2 : 1)
	    , index  = 0
	    , length, step, iterator;
	  if(typeof iterFn != 'function')throw TypeError(iterable + ' is not iterable!');
	  // fast case for arrays with default iterator
	  if(isArrayIter(iterFn))for(length = toLength(iterable.length); length > index; index++){
	    entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
	  } else for(iterator = iterFn.call(iterable); !(step = iterator.next()).done; ){
	    call(iterator, f, step.value, entries);
	  }
	};

/***/ },
/* 93 */
/***/ function(module, exports, __webpack_require__) {

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var cof = __webpack_require__(91);
	module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
	  return cof(it) == 'String' ? it.split('') : Object(it);
	};

/***/ },
/* 94 */
/***/ function(module, exports, __webpack_require__) {

	// check on default Array iterator
	var Iterators  = __webpack_require__(23)
	  , ITERATOR   = __webpack_require__(15)('iterator')
	  , ArrayProto = Array.prototype;

	module.exports = function(it){
	  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
	};

/***/ },
/* 95 */
/***/ function(module, exports, __webpack_require__) {

	// call something on iterator step with safe closing on error
	var anObject = __webpack_require__(40);
	module.exports = function(iterator, fn, value, entries){
	  try {
	    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
	  // 7.4.6 IteratorClose(iterator, completion)
	  } catch(e){
	    var ret = iterator['return'];
	    if(ret !== undefined)anObject(ret.call(iterator));
	    throw e;
	  }
	};

/***/ },
/* 96 */
/***/ function(module, exports) {

	module.exports = function(done, value){
	  return {value: value, done: !!done};
	};

/***/ },
/* 97 */
/***/ function(module, exports, __webpack_require__) {

	// most Object methods by ES6 should accept primitives
	var $export = __webpack_require__(22)
	  , core    = __webpack_require__(13)
	  , fails   = __webpack_require__(43);
	module.exports = function(KEY, exec){
	  var fn  = (core.Object || {})[KEY] || Object[KEY]
	    , exp = {};
	  exp[KEY] = exec(fn);
	  $export($export.S + $export.F * fails(function(){ fn(1); }), 'Object', exp);
	};

/***/ },
/* 98 */
/***/ function(module, exports) {

	module.exports = function(bitmap, value){
	  return {
	    enumerable  : !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable    : !(bitmap & 4),
	    value       : value
	  };
	};

/***/ },
/* 99 */
/***/ function(module, exports, __webpack_require__) {

	var redefine = __webpack_require__(100);
	module.exports = function(target, src){
	  for(var key in src)redefine(target, key, src[key]);
	  return target;
	};

/***/ },
/* 100 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(31);

/***/ },
/* 101 */
/***/ function(module, exports) {

	module.exports = function(it, Constructor, name){
	  if(!(it instanceof Constructor))throw TypeError(name + ": use the 'new' operator!");
	  return it;
	};

/***/ },
/* 102 */
/***/ function(module, exports) {

	// 7.1.4 ToInteger
	var ceil  = Math.ceil
	  , floor = Math.floor;
	module.exports = function(it){
	  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
	};

/***/ },
/* 103 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.15 ToLength
	var toInteger = __webpack_require__(102)
	  , min       = Math.min;
	module.exports = function(it){
	  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
	};

/***/ },
/* 104 */
/***/ function(module, exports) {

	var id = 0
	  , px = Math.random();
	module.exports = function(key){
	  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
	};

/***/ },
/* 105 */
/***/ function(module, exports) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 */

	'use strict';

	var canUseDOM = !!(typeof window !== 'undefined' && window.document && window.document.createElement);

	/**
	 * Simple, lightweight module assisting with the detection and context of
	 * Worker. Helps avoid circular dependencies and allows code to reason about
	 * whether or not they are in a Worker, even if they never include the main
	 * `ReactWorker` dependency.
	 */
	var ExecutionEnvironment = {

	  canUseDOM: canUseDOM,

	  canUseWorkers: typeof Worker !== 'undefined',

	  canUseEventListeners: canUseDOM && !!(window.addEventListener || window.attachEvent),

	  canUseViewport: canUseDOM && !!window.screen,

	  isInWorker: !canUseDOM // For now, this is true - might change in the future.

	};

	module.exports = ExecutionEnvironment;

/***/ },
/* 106 */
/***/ function(module, exports) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * 
	 */

	'use strict';

	var aStackPool = [];
	var bStackPool = [];

	/**
	 * Checks if two values are equal. Values may be primitives, arrays, or objects.
	 * Returns true if both arguments have the same keys and values.
	 *
	 * @see http://underscorejs.org
	 * @copyright 2009-2013 Jeremy Ashkenas, DocumentCloud Inc.
	 * @license MIT
	 */
	function areEqual(a, b) {
	  var aStack = aStackPool.length ? aStackPool.pop() : [];
	  var bStack = bStackPool.length ? bStackPool.pop() : [];
	  var result = eq(a, b, aStack, bStack);
	  aStack.length = 0;
	  bStack.length = 0;
	  aStackPool.push(aStack);
	  bStackPool.push(bStack);
	  return result;
	}

	function eq(a, b, aStack, bStack) {
	  if (a === b) {
	    // Identical objects are equal. `0 === -0`, but they aren't identical.
	    return a !== 0 || 1 / a == 1 / b;
	  }
	  if (a == null || b == null) {
	    // a or b can be `null` or `undefined`
	    return false;
	  }
	  if (typeof a != 'object' || typeof b != 'object') {
	    return false;
	  }
	  var objToStr = Object.prototype.toString;
	  var className = objToStr.call(a);
	  if (className != objToStr.call(b)) {
	    return false;
	  }
	  switch (className) {
	    case '[object String]':
	      return a == String(b);
	    case '[object Number]':
	      return isNaN(a) || isNaN(b) ? false : a == Number(b);
	    case '[object Date]':
	    case '[object Boolean]':
	      return +a == +b;
	    case '[object RegExp]':
	      return a.source == b.source && a.global == b.global && a.multiline == b.multiline && a.ignoreCase == b.ignoreCase;
	  }
	  // Assume equality for cyclic structures.
	  var length = aStack.length;
	  while (length--) {
	    if (aStack[length] == a) {
	      return bStack[length] == b;
	    }
	  }
	  aStack.push(a);
	  bStack.push(b);
	  var size = 0;
	  // Recursively compare objects and arrays.
	  if (className === '[object Array]') {
	    size = a.length;
	    if (size !== b.length) {
	      return false;
	    }
	    // Deep compare the contents, ignoring non-numeric properties.
	    while (size--) {
	      if (!eq(a[size], b[size], aStack, bStack)) {
	        return false;
	      }
	    }
	  } else {
	    if (a.constructor !== b.constructor) {
	      return false;
	    }
	    if (a.hasOwnProperty('valueOf') && b.hasOwnProperty('valueOf')) {
	      return a.valueOf() == b.valueOf();
	    }
	    var keys = Object.keys(a);
	    if (keys.length != Object.keys(b).length) {
	      return false;
	    }
	    for (var i = 0; i < keys.length; i++) {
	      if (!eq(a[keys[i]], b[keys[i]], aStack, bStack)) {
	        return false;
	      }
	    }
	  }
	  aStack.pop();
	  bStack.pop();
	  return true;
	}

	module.exports = areEqual;

/***/ },
/* 107 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * 
	 */

	"use strict";

	function crc32(str) {
	  /* jslint bitwise: true */
	  var crc = -1;
	  for (var i = 0, len = str.length; i < len; i++) {
	    crc = crc >>> 8 ^ table[(crc ^ str.charCodeAt(i)) & 0xFF];
	  }
	  return ~crc;
	}

	var table = [0x00000000, 0x77073096, 0xEE0E612C, 0x990951BA, 0x076DC419, 0x706AF48F, 0xE963A535, 0x9E6495A3, 0x0EDB8832, 0x79DCB8A4, 0xE0D5E91E, 0x97D2D988, 0x09B64C2B, 0x7EB17CBD, 0xE7B82D07, 0x90BF1D91, 0x1DB71064, 0x6AB020F2, 0xF3B97148, 0x84BE41DE, 0x1ADAD47D, 0x6DDDE4EB, 0xF4D4B551, 0x83D385C7, 0x136C9856, 0x646BA8C0, 0xFD62F97A, 0x8A65C9EC, 0x14015C4F, 0x63066CD9, 0xFA0F3D63, 0x8D080DF5, 0x3B6E20C8, 0x4C69105E, 0xD56041E4, 0xA2677172, 0x3C03E4D1, 0x4B04D447, 0xD20D85FD, 0xA50AB56B, 0x35B5A8FA, 0x42B2986C, 0xDBBBC9D6, 0xACBCF940, 0x32D86CE3, 0x45DF5C75, 0xDCD60DCF, 0xABD13D59, 0x26D930AC, 0x51DE003A, 0xC8D75180, 0xBFD06116, 0x21B4F4B5, 0x56B3C423, 0xCFBA9599, 0xB8BDA50F, 0x2802B89E, 0x5F058808, 0xC60CD9B2, 0xB10BE924, 0x2F6F7C87, 0x58684C11, 0xC1611DAB, 0xB6662D3D, 0x76DC4190, 0x01DB7106, 0x98D220BC, 0xEFD5102A, 0x71B18589, 0x06B6B51F, 0x9FBFE4A5, 0xE8B8D433, 0x7807C9A2, 0x0F00F934, 0x9609A88E, 0xE10E9818, 0x7F6A0DBB, 0x086D3D2D, 0x91646C97, 0xE6635C01, 0x6B6B51F4, 0x1C6C6162, 0x856530D8, 0xF262004E, 0x6C0695ED, 0x1B01A57B, 0x8208F4C1, 0xF50FC457, 0x65B0D9C6, 0x12B7E950, 0x8BBEB8EA, 0xFCB9887C, 0x62DD1DDF, 0x15DA2D49, 0x8CD37CF3, 0xFBD44C65, 0x4DB26158, 0x3AB551CE, 0xA3BC0074, 0xD4BB30E2, 0x4ADFA541, 0x3DD895D7, 0xA4D1C46D, 0xD3D6F4FB, 0x4369E96A, 0x346ED9FC, 0xAD678846, 0xDA60B8D0, 0x44042D73, 0x33031DE5, 0xAA0A4C5F, 0xDD0D7CC9, 0x5005713C, 0x270241AA, 0xBE0B1010, 0xC90C2086, 0x5768B525, 0x206F85B3, 0xB966D409, 0xCE61E49F, 0x5EDEF90E, 0x29D9C998, 0xB0D09822, 0xC7D7A8B4, 0x59B33D17, 0x2EB40D81, 0xB7BD5C3B, 0xC0BA6CAD, 0xEDB88320, 0x9ABFB3B6, 0x03B6E20C, 0x74B1D29A, 0xEAD54739, 0x9DD277AF, 0x04DB2615, 0x73DC1683, 0xE3630B12, 0x94643B84, 0x0D6D6A3E, 0x7A6A5AA8, 0xE40ECF0B, 0x9309FF9D, 0x0A00AE27, 0x7D079EB1, 0xF00F9344, 0x8708A3D2, 0x1E01F268, 0x6906C2FE, 0xF762575D, 0x806567CB, 0x196C3671, 0x6E6B06E7, 0xFED41B76, 0x89D32BE0, 0x10DA7A5A, 0x67DD4ACC, 0xF9B9DF6F, 0x8EBEEFF9, 0x17B7BE43, 0x60B08ED5, 0xD6D6A3E8, 0xA1D1937E, 0x38D8C2C4, 0x4FDFF252, 0xD1BB67F1, 0xA6BC5767, 0x3FB506DD, 0x48B2364B, 0xD80D2BDA, 0xAF0A1B4C, 0x36034AF6, 0x41047A60, 0xDF60EFC3, 0xA867DF55, 0x316E8EEF, 0x4669BE79, 0xCB61B38C, 0xBC66831A, 0x256FD2A0, 0x5268E236, 0xCC0C7795, 0xBB0B4703, 0x220216B9, 0x5505262F, 0xC5BA3BBE, 0xB2BD0B28, 0x2BB45A92, 0x5CB36A04, 0xC2D7FFA7, 0xB5D0CF31, 0x2CD99E8B, 0x5BDEAE1D, 0x9B64C2B0, 0xEC63F226, 0x756AA39C, 0x026D930A, 0x9C0906A9, 0xEB0E363F, 0x72076785, 0x05005713, 0x95BF4A82, 0xE2B87A14, 0x7BB12BAE, 0x0CB61B38, 0x92D28E9B, 0xE5D5BE0D, 0x7CDCEFB7, 0x0BDBDF21, 0x86D3D2D4, 0xF1D4E242, 0x68DDB3F8, 0x1FDA836E, 0x81BE16CD, 0xF6B9265B, 0x6FB077E1, 0x18B74777, 0x88085AE6, 0xFF0F6A70, 0x66063BCA, 0x11010B5C, 0x8F659EFF, 0xF862AE69, 0x616BFFD3, 0x166CCF45, 0xA00AE278, 0xD70DD2EE, 0x4E048354, 0x3903B3C2, 0xA7672661, 0xD06016F7, 0x4969474D, 0x3E6E77DB, 0xAED16A4A, 0xD9D65ADC, 0x40DF0B66, 0x37D83BF0, 0xA9BCAE53, 0xDEBB9EC5, 0x47B2CF7F, 0x30B5FFE9, 0xBDBDF21C, 0xCABAC28A, 0x53B39330, 0x24B4A3A6, 0xBAD03605, 0xCDD70693, 0x54DE5729, 0x23D967BF, 0xB3667A2E, 0xC4614AB8, 0x5D681B02, 0x2A6F2B94, 0xB40BBE37, 0xC30C8EA1, 0x5A05DF1B, 0x2D02EF8D];

	if (global.Int32Array !== undefined) {
	  table = new Int32Array(table);
	}

	module.exports = crc32;
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 108 */
/***/ function(module, exports) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * 
	 * @typechecks
	 */

	'use strict';

	var hasOwnProperty = Object.prototype.hasOwnProperty;

	/**
	 * Executes the provided `callback` once for each enumerable own property in the
	 * object until it finds one where callback returns a falsy value. If such a
	 * property is found, `everyObject` immediately returns false. Otherwise, it
	 * returns true.
	 *
	 * The `callback` is invoked with three arguments:
	 *
	 *  - the property value
	 *  - the property name
	 *  - the object being traversed
	 *
	 * Properties that are added after the call to `everyObject` will not be
	 * visited by `callback`. If the values of existing properties are changed, the
	 * value passed to `callback` will be the value at the time `everyObject`
	 * visits them. Properties that are deleted before being visited are not
	 * visited.
	 */
	function everyObject(object, callback, context) {
	  for (var name in object) {
	    if (hasOwnProperty.call(object, name)) {
	      if (!callback.call(context, object[name], name, object)) {
	        return false;
	      }
	    }
	  }
	  return true;
	}

	module.exports = everyObject;

/***/ },
/* 109 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 */

	'use strict';

	// This hopefully supports the React Native case, which is already bringing along
	// its own fetch polyfill. That should exist on `global`. If that doesn't exist
	// then we'll try to polyfill, which might not work correctly in all environments.
	if (global.fetch) {
	  module.exports = global.fetch.bind(global);
	} else {
	  module.exports = __webpack_require__(216);
	}
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 110 */
/***/ function(module, exports) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @typechecks
	 */

	/**
	 * Simple function for formatting strings.
	 *
	 * Replaces placeholders with values passed as extra arguments
	 *
	 * @param {string} format the base string
	 * @param ...args the values to insert
	 * @return {string} the replaced string
	 */
	"use strict";

	function sprintf(format) {
	  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	    args[_key - 1] = arguments[_key];
	  }

	  var index = 0;
	  return format.replace(/%s/g, function (match) {
	    return args[index++];
	  });
	}

	module.exports = sprintf;

/***/ },
/* 111 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule GraphQLQueryRunner
	 * @typechecks
	 * 
	 */

	'use strict';

	var _classCallCheck = __webpack_require__(1)['default'];

	var _toConsumableArray = __webpack_require__(19)['default'];

	var _Object$keys = __webpack_require__(10)['default'];

	var DliteFetchModeConstants = __webpack_require__(73);

	var RelayNetworkLayer = __webpack_require__(25);
	var RelayProfiler = __webpack_require__(4);

	var RelayTaskScheduler = __webpack_require__(53);

	var checkRelayQueryData = __webpack_require__(144);
	var diffRelayQuery = __webpack_require__(147);
	var everyObject = __webpack_require__(108);
	var flattenSplitRelayQueries = __webpack_require__(151);
	var forEachObject = __webpack_require__(9);
	var generateForceIndex = __webpack_require__(83);
	var invariant = __webpack_require__(2);
	var mapObject = __webpack_require__(48);
	var resolveImmediate = __webpack_require__(49);
	var someObject = __webpack_require__(215);
	var splitDeferredRelayQueries = __webpack_require__(162);
	var warning = __webpack_require__(11);

	/**
	 * This is the high-level entry point for sending queries to the GraphQL
	 * endpoint. It provides methods for scheduling queries (`run`), force-fetching
	 * queries (ie. ignoring the cache; `forceFetch`).
	 *
	 * In order to send minimal queries and avoid re-retrieving data,
	 * `GraphQLQueryRunner` maintains a registry of pending (in-flight) queries, and
	 * "subtracts" those from any new queries that callers enqueue.
	 *
	 * @internal
	 */

	var GraphQLQueryRunner = (function () {
	  function GraphQLQueryRunner(storeData) {
	    _classCallCheck(this, GraphQLQueryRunner);

	    this._storeData = storeData;
	  }

	  /**
	   * Fetches data required to resolve a set of queries. See the `RelayStore`
	   * module for documentation on the callback.
	   *
	   * Fetch mode must be a value in `DliteFetchModeConstants`.
	   */

	  GraphQLQueryRunner.prototype.run = function run(querySet, callback, fetchMode) {
	    var _this = this;

	    fetchMode = fetchMode || DliteFetchModeConstants.FETCH_MODE_CLIENT;
	    var profiler = fetchMode === DliteFetchModeConstants.FETCH_MODE_REFETCH ? RelayProfiler.profile('GraphQLQueryRunner.forceFetch') : RelayProfiler.profile('GraphQLQueryRunner.primeCache');

	    var diffQueries = [];
	    if (fetchMode === DliteFetchModeConstants.FETCH_MODE_CLIENT) {
	      forEachObject(querySet, function (query) {
	        if (query) {
	          diffQueries.push.apply(diffQueries, _toConsumableArray(diffRelayQuery(query, _this._storeData.getRecordStore(), _this._storeData.getQueryTracker())));
	        }
	      });
	    } else {
	      forEachObject(querySet, function (query) {
	        if (query) {
	          diffQueries.push(query);
	        }
	      });
	    }

	    return runQueries(this._storeData, diffQueries, callback, fetchMode, profiler);
	  };

	  /**
	   * Ignores the cache and fetches data required to resolve a set of queries.
	   * Uses the data we get back from the server to overwrite data in the cache.
	   *
	   * Even though we're ignoring the cache, we will still invoke the callback
	   * immediately with `ready: true` if `querySet` can be resolved by the cache.
	   */

	  GraphQLQueryRunner.prototype.forceFetch = function forceFetch(querySet, callback) {
	    var fetchMode = DliteFetchModeConstants.FETCH_MODE_REFETCH;
	    var profiler = RelayProfiler.profile('GraphQLQueryRunner.forceFetch');
	    var queries = [];
	    forEachObject(querySet, function (query) {
	      query && queries.push(query);
	    });

	    return runQueries(this._storeData, queries, callback, fetchMode, profiler);
	  };

	  return GraphQLQueryRunner;
	})();

	function hasItems(map) {
	  return !!_Object$keys(map).length;
	}

	function splitAndFlattenQueries(queries) {
	  if (!RelayNetworkLayer.supports('defer')) {
	    if (true) {
	      queries.forEach(function (query) {
	         true ? warning(!query.hasDeferredDescendant(), 'Relay: Query `%s` contains a deferred fragment (e.g. ' + '`getFragment(\'foo\').defer()`) which is not supported by the ' + 'default network layer. This query will be sent without deferral.', query.getName()) : undefined;
	      });
	    }
	    return queries;
	  }

	  var flattenedQueries = [];
	  queries.forEach(function (query) {
	    return flattenedQueries.push.apply(flattenedQueries, _toConsumableArray(flattenSplitRelayQueries(splitDeferredRelayQueries(query))));
	  });
	  return flattenedQueries;
	}

	function runQueries(storeData, queries, callback, fetchMode, profiler) {
	  var readyState = {
	    aborted: false,
	    done: false,
	    error: null,
	    ready: false,
	    stale: false
	  };
	  var scheduled = false;
	  function setReadyState(partial) {
	    if (readyState.aborted) {
	      return;
	    }
	    if (readyState.done || readyState.error) {
	      !partial.aborted ?  true ? invariant(false, 'GraphQLQueryRunner: Unexpected ready state change.') : invariant(false) : undefined;
	      return;
	    }
	    readyState = {
	      aborted: partial.aborted != null ? partial.aborted : readyState.aborted,
	      done: partial.done != null ? partial.done : readyState.done,
	      error: partial.error != null ? partial.error : readyState.error,
	      ready: partial.ready != null ? partial.ready : readyState.ready,
	      stale: partial.stale != null ? partial.stale : readyState.stale
	    };
	    if (scheduled) {
	      return;
	    }
	    scheduled = true;
	    resolveImmediate(function () {
	      scheduled = false;
	      callback(readyState);
	    });
	  }

	  var remainingFetchMap = {};
	  var remainingRequiredFetchMap = {};

	  function onResolved(pendingFetch) {
	    var pendingQuery = pendingFetch.getQuery();
	    var pendingQueryID = pendingQuery.getID();
	    delete remainingFetchMap[pendingQueryID];
	    if (!pendingQuery.isDeferred()) {
	      delete remainingRequiredFetchMap[pendingQueryID];
	    }

	    if (hasItems(remainingRequiredFetchMap)) {
	      return;
	    }

	    if (someObject(remainingFetchMap, function (query) {
	      return query.isResolvable();
	    })) {
	      // The other resolvable query will resolve imminently and call
	      // `setReadyState` instead.
	      return;
	    }

	    if (hasItems(remainingFetchMap)) {
	      setReadyState({ done: false, ready: true, stale: false });
	    } else {
	      setReadyState({ done: true, ready: true, stale: false });
	    }
	  }

	  function onRejected(pendingFetch, error) {
	    setReadyState({ error: error });

	    var pendingQuery = pendingFetch.getQuery();
	    var pendingQueryID = pendingQuery.getID();
	    delete remainingFetchMap[pendingQueryID];
	    if (!pendingQuery.isDeferred()) {
	      delete remainingRequiredFetchMap[pendingQueryID];
	    }
	  }

	  function canResolve(fetch) {
	    return checkRelayQueryData(storeData.getQueuedStore(), fetch.getQuery());
	  }

	  RelayTaskScheduler.enqueue(function () {
	    var forceIndex = fetchMode === DliteFetchModeConstants.FETCH_MODE_REFETCH ? generateForceIndex() : null;

	    splitAndFlattenQueries(queries).forEach(function (query) {
	      var pendingFetch = storeData.getPendingQueryTracker().add({ query: query, fetchMode: fetchMode, forceIndex: forceIndex, storeData: storeData });
	      var queryID = query.getID();
	      remainingFetchMap[queryID] = pendingFetch;
	      if (!query.isDeferred()) {
	        remainingRequiredFetchMap[queryID] = pendingFetch;
	      }
	      pendingFetch.getResolvedPromise().then(onResolved.bind(null, pendingFetch), onRejected.bind(null, pendingFetch));
	    });

	    if (!hasItems(remainingFetchMap)) {
	      setReadyState({ done: true, ready: true });
	    } else {
	      if (!hasItems(remainingRequiredFetchMap)) {
	        setReadyState({ ready: true });
	      } else {
	        setReadyState({ ready: false });
	        resolveImmediate(function () {
	          if (storeData.hasCacheManager()) {
	            var requiredQueryMap = mapObject(remainingRequiredFetchMap, function (value) {
	              return value.getQuery();
	            });
	            storeData.readFromDiskCache(requiredQueryMap, {
	              onSuccess: function onSuccess() {
	                if (hasItems(remainingRequiredFetchMap)) {
	                  setReadyState({ ready: true, stale: true });
	                }
	              }
	            });
	          } else {
	            if (everyObject(remainingRequiredFetchMap, canResolve)) {
	              if (hasItems(remainingRequiredFetchMap)) {
	                setReadyState({ ready: true, stale: true });
	              }
	            }
	          }
	        });
	      }
	    }
	    // Stop profiling when queries have been sent to the network layer.
	    profiler.stop();
	  }).done();

	  return {
	    abort: function abort() {
	      setReadyState({ aborted: true });
	    }
	  };
	}

	module.exports = GraphQLQueryRunner;

/***/ },
/* 112 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule GraphQLSegment
	 * @typechecks
	 */

	'use strict';

	var _classCallCheck = __webpack_require__(1)['default'];

	var _slicedToArray = __webpack_require__(61)['default'];

	var _Object$assign = __webpack_require__(59)['default'];

	var _Object$keys = __webpack_require__(10)['default'];

	var GraphQLStoreDataHandler = __webpack_require__(6);

	/**
	 * Represents one contiguous segment of edges within a `GraphQLRange`. Has
	 * methods for adding/removing edges (`appendEdge`, `prependEdge`, `removeEdge`)
	 * and working with cursors (`getFirstCursor`, `getLastCursor` etc)
	 *
	 * Edges are never actually deleted from segments; they are merely marked as
	 * being deleted. As such, `GraphQLSegment` offers both a `getCount` method
	 * (returning the number of non-deleted edges) and a `getLength` method (which
	 * returns the total number, including deleted edges).
	 *
	 * Used mostly as an implementation detail internal to `GraphQLRange`.
	 *
	 * @internal
	 */

	var GraphQLSegment = (function () {
	  function GraphQLSegment() {
	    _classCallCheck(this, GraphQLSegment);

	    // We use a map rather than an array because indices can become negative
	    // when prepending.
	    this._indexToMetadataMap = {};

	    // We keep track of past indices to ensure we can delete them completely.
	    this._idToIndicesMap = {};
	    this._cursorToIndexMap = {};

	    this._count = 0;
	    this._minIndex = null;
	    this._maxIndex = null;
	  }

	  /**
	   * @param {string} cursor
	   * @return {?number}
	   */

	  GraphQLSegment.prototype._getIndexForCursor = function _getIndexForCursor(cursor) {
	    return this._cursorToIndexMap[cursor];
	  };

	  /**
	   * @param {string} id
	   * @return {?number}
	   */

	  GraphQLSegment.prototype._getIndexForID = function _getIndexForID(id) {
	    var indices = this._idToIndicesMap[id];
	    return indices && indices[0];
	  };

	  /**
	   * @return {?string} cursor for first non-deleted edge
	   */

	  GraphQLSegment.prototype.getFirstCursor = function getFirstCursor() {
	    if (this.getLength()) {
	      for (var ii = this._minIndex; ii <= this._maxIndex; ii++) {
	        var metadata = this._indexToMetadataMap[ii];
	        if (!metadata.deleted) {
	          return metadata.cursor;
	        }
	      }
	    }
	  };

	  /**
	   * @return {?string} cursor for last non-deleted edge
	   */

	  GraphQLSegment.prototype.getLastCursor = function getLastCursor() {
	    if (this.getLength()) {
	      for (var ii = this._maxIndex; ii >= this._minIndex; ii--) {
	        var metadata = this._indexToMetadataMap[ii];
	        if (!metadata.deleted) {
	          return metadata.cursor;
	        }
	      }
	    }
	  };

	  /**
	   * @return {?string} id for first non-deleted edge
	   */

	  GraphQLSegment.prototype.getFirstID = function getFirstID() {
	    if (this.getLength()) {
	      for (var ii = this._minIndex; ii <= this._maxIndex; ii++) {
	        var metadata = this._indexToMetadataMap[ii];
	        if (!metadata.deleted) {
	          return metadata.edgeID;
	        }
	      }
	    }
	  };

	  /**
	   * @return {?string} id for last non-deleted edge
	   */

	  GraphQLSegment.prototype.getLastID = function getLastID() {
	    if (this.getLength()) {
	      for (var ii = this._maxIndex; ii >= this._minIndex; ii--) {
	        var metadata = this._indexToMetadataMap[ii];
	        if (!metadata.deleted) {
	          return metadata.edgeID;
	        }
	      }
	    }
	  };

	  /**
	   * @param {number} index
	   * @return {?object} Returns the not-deleted edge at index
	   */

	  GraphQLSegment.prototype._getEdgeAtIndex = function _getEdgeAtIndex(index) {
	    var edge = this._indexToMetadataMap[index];
	    return edge && !edge.deleted ? edge : null;
	  };

	  /**
	   * Returns whether there is a non-deleted edge for id
	   * @param {string} id
	   * @return {boolean}
	   */

	  GraphQLSegment.prototype.containsEdgeWithID = function containsEdgeWithID(id) {
	    var index = this._getIndexForID(id);
	    if (index === undefined) {
	      return false;
	    }
	    return !!this._getEdgeAtIndex(index);
	  };

	  /**
	   * Returns whether there is a non-deleted edge for cursor
	   * @param {string} cursor
	   * @return {boolean}
	   */

	  GraphQLSegment.prototype.containsEdgeWithCursor = function containsEdgeWithCursor(cursor) {
	    var index = this._getIndexForCursor(cursor);
	    if (index === undefined) {
	      return false;
	    }
	    return !!this._getEdgeAtIndex(index);
	  };

	  /**
	   * Returns up to count number of ids and cursors that is after input cursor
	   * @param {number} count
	   * @param {?string} cursor
	   * @return {object} object with arrays of ids and cursors
	   */

	  GraphQLSegment.prototype.getMetadataAfterCursor = function getMetadataAfterCursor(count, cursor) {
	    if (!this.getLength()) {
	      return {
	        edgeIDs: [],
	        cursors: []
	      };
	    }
	    var currentIndex = this._minIndex;
	    if (cursor) {
	      var index = this._getIndexForCursor(cursor);
	      if (index === undefined) {
	        console.warn('This segment does not have a cursor %s', cursor);
	        return {
	          edgeIDs: [],
	          cursors: []
	        };
	      }
	      currentIndex = index + 1;
	    }
	    var total = 0;
	    var edgeIDs = [];
	    var cursors = [];

	    while (currentIndex <= this._maxIndex && total < count) {
	      var metadata = this._indexToMetadataMap[currentIndex];
	      if (!metadata.deleted) {
	        edgeIDs.push(metadata.edgeID);
	        cursors.push(metadata.cursor);
	        total++;
	      }
	      currentIndex++;
	    }
	    return {
	      edgeIDs: edgeIDs,
	      cursors: cursors
	    };
	  };

	  /**
	   * Returns up to count number of ids and cursors that is before index
	   * @param {number} count
	   * @param {?string} cursor
	   * @return {object} object with arrays of ids and cursors
	   */

	  GraphQLSegment.prototype.getMetadataBeforeCursor = function getMetadataBeforeCursor(count, cursor) {
	    if (!this.getLength()) {
	      return {
	        edgeIDs: [],
	        cursors: []
	      };
	    }
	    var currentIndex = this._maxIndex;
	    if (cursor) {
	      var index = this._getIndexForCursor(cursor);
	      if (index === undefined) {
	        console.warn('This segment does not have a cursor %s', cursor);
	        return {
	          edgeIDs: [],
	          cursors: []
	        };
	      }
	      currentIndex = index - 1;
	    }
	    var total = 0;
	    var edgeIDs = [];
	    var cursors = [];
	    while (currentIndex >= this._minIndex && total < count) {
	      var metadata = this._indexToMetadataMap[currentIndex];
	      if (!metadata.deleted) {
	        edgeIDs.push(metadata.edgeID);
	        cursors.push(metadata.cursor);
	        total++;
	      }
	      currentIndex--;
	    }

	    // Reverse edges because larger index were added first
	    return {
	      edgeIDs: edgeIDs.reverse(),
	      cursors: cursors.reverse()
	    };
	  };

	  /**
	   * @param {object} edge
	   * @param {number} index
	   */

	  GraphQLSegment.prototype._addEdgeAtIndex = function _addEdgeAtIndex(edge, index) {
	    var edgeID = GraphQLStoreDataHandler.getID(edge);
	    var cursor = edge.cursor;

	    var idIndex = this._getIndexForID(edgeID);
	    // If the id is has an index and is not deleted
	    if (idIndex !== undefined && this._getEdgeAtIndex(idIndex)) {
	      console.warn('Attempted to add an ID already in GraphQLSegment: %s', edgeID);
	      return;
	    }

	    if (this.getLength() === 0) {
	      this._minIndex = index;
	      this._maxIndex = index;
	    } else if (this._minIndex == index + 1) {
	      this._minIndex = index;
	    } else if (this._maxIndex == index - 1) {
	      this._maxIndex = index;
	    } else {
	      console.warn('Attempted to add noncontiguous index to GraphQLSegment: ' + index + ' to ' + ('(' + this._minIndex + ', ' + this._maxIndex + ')'));

	      return;
	    }

	    this._indexToMetadataMap[index] = {
	      edgeID: edgeID,
	      cursor: cursor,
	      deleted: false
	    };
	    this._idToIndicesMap[edgeID] = this._idToIndicesMap[edgeID] || [];
	    this._idToIndicesMap[edgeID].unshift(index);
	    this._count++;

	    if (cursor) {
	      this._cursorToIndexMap[cursor] = index;
	    }
	  };

	  /**
	   * @param {object} edge should have cursor and a node with id
	   */

	  GraphQLSegment.prototype.prependEdge = function prependEdge(edge) {
	    this._addEdgeAtIndex(edge, this._minIndex !== null ? this._minIndex - 1 : 0);
	  };

	  /**
	   * @param {object} edge should have cursor and a node with id
	   */

	  GraphQLSegment.prototype.appendEdge = function appendEdge(edge) {
	    this._addEdgeAtIndex(edge, this._maxIndex !== null ? this._maxIndex + 1 : 0);
	  };

	  /**
	   * Mark the currently valid edge with given id to be deleted.
	   *
	   * @param {string} id the id of the edge to be removed
	   */

	  GraphQLSegment.prototype.removeEdge = function removeEdge(id) {
	    var index = this._getIndexForID(id);
	    if (index === undefined) {
	      console.warn('Attempted to remove edge with ID that was never in GraphQLSegment: ' + id);
	      return;
	    }
	    var data = this._indexToMetadataMap[index];
	    if (data.deleted) {
	      console.warn('Attempted to remove edge with ID that was already removed: ' + id);
	      return;
	    }
	    data.deleted = true;
	    this._count--;
	  };

	  /**
	   * Mark all edges with given id to be deleted. This is used by
	   * delete mutations to ensure both the current and past edges are no longer
	   * accessible.
	   *
	   * @param {string} id the id of the edge to be removed
	   */

	  GraphQLSegment.prototype.removeAllEdges = function removeAllEdges(id) {
	    var indices = this._idToIndicesMap[id];
	    if (!indices) {
	      return;
	    }
	    for (var ii = 0; ii < indices.length; ii++) {
	      var data = this._indexToMetadataMap[indices[ii]];
	      if (!data.deleted) {
	        data.deleted = true;
	        this._count--;
	      }
	    }
	  };

	  /**
	   * @param {array} edges
	   * @param {?string} cursor
	   */

	  GraphQLSegment.prototype.addEdgesAfterCursor = function addEdgesAfterCursor(edges, cursor) {
	    // Default adding after with no cursor to -1
	    // So the first element in the segment is stored at index 0
	    var index = -1;
	    if (cursor) {
	      index = this._getIndexForCursor(cursor);
	      if (index === undefined) {
	        console.warn('This segment does not have a cursor %s', cursor);
	        return;
	      }
	    }

	    while (this._maxIndex !== null && index < this._maxIndex) {
	      var data = this._indexToMetadataMap[index + 1];
	      // Skip over elements that have been deleted
	      // so we can add new edges on the end.
	      if (data.deleted) {
	        index++;
	      } else {
	        console.warn('Attempted to do an overwrite to GraphQLSegment: ' + 'last index is ' + this._maxIndex + ' trying to add edges before ' + index);
	        return;
	      }
	    }

	    var startIndex = index + 1;
	    for (var ii = 0; ii < edges.length; ii++) {
	      var edge = edges[ii];
	      this._addEdgeAtIndex(edge, startIndex + ii);
	    }
	  };

	  /**
	   * @param {array} edges - should be in increasing order of index
	   * @param {?string} cursor
	   */

	  GraphQLSegment.prototype.addEdgesBeforeCursor = function addEdgesBeforeCursor(edges, cursor) {
	    // Default adding before with no cursor to 1
	    // So the first element in the segment is stored at index 0
	    var index = 1;
	    if (cursor) {
	      index = this._getIndexForCursor(cursor);
	      if (index === undefined) {
	        console.warn('This segment does not have a cursor %s', cursor);
	        return;
	      }
	    }

	    while (this._minIndex !== null && index > this._minIndex) {
	      var data = this._indexToMetadataMap[index - 1];
	      // Skip over elements that have been deleted
	      // so we can add new edges in the front.
	      if (data.deleted) {
	        index--;
	      } else {
	        console.warn('Attempted to do an overwrite to GraphQLSegment: ' + 'first index is ' + this._minIndex + ' trying to add edges after ' + index);
	        return;
	      }
	    }

	    // Edges must be added in reverse order since the
	    // segment must be continuous at all times.
	    var startIndex = index - 1;
	    for (var ii = 0; ii < edges.length; ii++) {
	      // Iterates from edges.length - 1 to 0
	      var edge = edges[edges.length - ii - 1];
	      this._addEdgeAtIndex(edge, startIndex - ii);
	    }
	  };

	  /**
	   * This is the total length of the segment including the deleted edges.
	   * Non-zero length guarantees value max and min indices.
	   * DO NOT USE THIS TO DETERMINE THE TOTAL NUMBER OF EDGES; use `getCount`
	   * instead.
	   * @return {number}
	   */

	  GraphQLSegment.prototype.getLength = function getLength() {
	    if (this._minIndex === null && this._maxIndex === null) {
	      return 0;
	    }

	    return this._maxIndex - this._minIndex + 1;
	  };

	  /**
	   * Returns the total number of non-deleted edges in the segment.
	   *
	   * @return {number}
	   */

	  GraphQLSegment.prototype.getCount = function getCount() {
	    return this._count;
	  };

	  /**
	   * In the event of a failed `concatSegment` operation, rollback internal
	   * properties to their former values.
	   *
	   * @param {object} cursorRollbackMap
	   * @param {object} idRollbackMap
	   * @param {object} counters
	   */

	  GraphQLSegment.prototype._rollback = function _rollback(cursorRollbackMap, idRollbackMap, counters) {
	    _Object$assign(this._cursorToIndexMap, cursorRollbackMap);
	    _Object$assign(this._idToIndicesMap, idRollbackMap);

	    // no need to reset _indexToMetadataMap; resetting counters is enough
	    this._count = counters.count;
	    this._maxIndex = counters.maxIndex;
	    this._minIndex = counters.minIndex;
	  };

	  /**
	   * @return {object} Captured counter state.
	   */

	  GraphQLSegment.prototype._getCounterState = function _getCounterState() {
	    return {
	      count: this._count,
	      maxIndex: this._maxIndex,
	      minIndex: this._minIndex
	    };
	  };

	  /**
	   * Copies over content of the input segment and add to the current
	   * segment.
	   * @param {GraphQLSegment} segment - the segment to be copied over
	   * @return {boolean} whether or not we successfully concatenated the segments
	   */

	  GraphQLSegment.prototype.concatSegment = function concatSegment(segment) {
	    if (!segment.getLength()) {
	      return true;
	    }
	    var idRollbackMap = {};
	    var cursorRollbackMap = {};
	    var counterState = this._getCounterState();
	    var newEdges = segment._indexToMetadataMap;
	    for (var ii = segment._minIndex; ii <= segment._maxIndex; ii++) {
	      var index;
	      if (this.getLength()) {
	        index = this._maxIndex + 1;
	      } else {
	        index = 0;
	        this._minIndex = 0;
	      }
	      this._maxIndex = index;

	      var newEdge = newEdges[ii];
	      var idIndex = this._getIndexForID(newEdge.edgeID);
	      if (!idRollbackMap.hasOwnProperty(newEdge.edgeID)) {
	        if (this._idToIndicesMap[newEdge.edgeID]) {
	          idRollbackMap[newEdge.edgeID] = this._idToIndicesMap[newEdge.edgeID].slice();
	        } else {
	          idRollbackMap[newEdge.edgeID] = undefined;
	        }
	      }
	      // Check for id collision. Can't have same id twice
	      if (idIndex !== undefined) {
	        var idEdge = this._indexToMetadataMap[idIndex];
	        if (idEdge.deleted && !newEdge.deleted) {
	          // We want to map to most recent edge. Only write to the front of map
	          // if existing edge with id is deleted or have an older deletion
	          // time.
	          this._idToIndicesMap[newEdge.edgeID].unshift(index);
	        } else if (!newEdge.deleted) {
	          console.warn('Attempt to concat an ID already in GraphQLSegment: %s', newEdge.edgeID);
	          this._rollback(cursorRollbackMap, idRollbackMap, counterState);
	          return false;
	        } else {
	          // We want to keep track of past edges as well. Write these indices
	          // to the end of the array.
	          this._idToIndicesMap[newEdge.edgeID] = this._idToIndicesMap[newEdge.edgeID] || [];
	          this._idToIndicesMap[newEdge.edgeID].push(index);
	        }
	      } else {
	        this._idToIndicesMap[newEdge.edgeID] = this._idToIndicesMap[newEdge.edgeID] || [];
	        this._idToIndicesMap[newEdge.edgeID].unshift(index);
	      }
	      var cursorIndex = this._getIndexForCursor(newEdge.cursor);
	      // Check for cursor collision. Can't have same cursor twice
	      if (cursorIndex !== undefined) {
	        var cursorEdge = this._indexToMetadataMap[cursorIndex];
	        if (cursorEdge.deleted && !newEdge.deleted) {
	          // We want to map to most recent edge. Only write in the cursor map if
	          // existing edge with cursor is deleted or have and older deletion
	          // time.
	          cursorRollbackMap[newEdge.cursor] = this._cursorToIndexMap[newEdge.cursor];
	          this._cursorToIndexMap[newEdge.cursor] = index;
	        } else if (!newEdge.deleted) {
	          console.warn('Attempt to concat a cursor already in GraphQLSegment: %s', newEdge.cursor);
	          this._rollback(cursorRollbackMap, idRollbackMap, counterState);
	          return false;
	        }
	      } else if (newEdge.cursor) {
	        cursorRollbackMap[newEdge.cursor] = this._cursorToIndexMap[newEdge.cursor];
	        this._cursorToIndexMap[newEdge.cursor] = index;
	      }
	      if (!newEdge.deleted) {
	        this._count++;
	      }
	      this._indexToMetadataMap[index] = _Object$assign({}, newEdge);
	    }

	    return true;
	  };

	  GraphQLSegment.prototype.toJSON = function toJSON() {
	    return [this._indexToMetadataMap, this._idToIndicesMap, this._cursorToIndexMap, this._minIndex, this._maxIndex, this._count];
	  };

	  GraphQLSegment.fromJSON = function fromJSON(descriptor) {
	    var _descriptor = _slicedToArray(descriptor, 6);

	    var indexToMetadataMap = _descriptor[0];
	    var idToIndicesMap = _descriptor[1];
	    var cursorToIndexMap = _descriptor[2];
	    var minIndex = _descriptor[3];
	    var maxIndex = _descriptor[4];
	    var count = _descriptor[5];

	    var segment = new GraphQLSegment();
	    segment._indexToMetadataMap = indexToMetadataMap;
	    segment._idToIndicesMap = idToIndicesMap;
	    segment._cursorToIndexMap = cursorToIndexMap;
	    segment._minIndex = minIndex;
	    segment._maxIndex = maxIndex;
	    segment._count = count;
	    return segment;
	  };

	  GraphQLSegment.prototype.__debug = function __debug() {
	    return {
	      metadata: this._indexToMetadataMap,
	      idToIndices: this._idToIndicesMap,
	      cursorToIndex: this._cursorToIndexMap
	    };
	  };

	  /**
	   * Returns a list of all IDs that were registered for this segment. Including
	   * edges that were deleted.
	   */

	  GraphQLSegment.prototype.getEdgeIDs = function getEdgeIDs() {
	    return _Object$keys(this._idToIndicesMap);
	  };

	  return GraphQLSegment;
	})();

	module.exports = GraphQLSegment;

/***/ },
/* 113 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule GraphQLStoreChangeEmitter
	 * @typechecks
	 * 
	 */

	'use strict';

	var _classCallCheck = __webpack_require__(1)['default'];

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	var ErrorUtils = __webpack_require__(68);

	var resolveImmediate = __webpack_require__(49);

	/**
	 * Asynchronous change emitter for nodes stored in the Relay cache.
	 *
	 * Changes are produced by `RelayStoreData` after writing query and mutation
	 * payloads into the store and consumed by `GraphQLStoreQueryResolver`, which
	 * subscribes to all records that are part of an active query result set.
	 *
	 * @internal
	 */

	var GraphQLStoreChangeEmitter = (function () {
	  function GraphQLStoreChangeEmitter(rangeData) {
	    _classCallCheck(this, GraphQLStoreChangeEmitter);

	    this._batchUpdate = function (callback) {
	      return callback();
	    };
	    this._executingIDs = {};
	    this._rangeData = rangeData;
	    this._scheduledIDs = null;
	    this._subscribers = [];
	  }

	  GraphQLStoreChangeEmitter.prototype.addListenerForIDs = function addListenerForIDs(ids, callback) {
	    var _this = this;

	    var subscribedIDs = ids.map(function (id) {
	      return _this._getBroadcastID(id);
	    });
	    var index = this._subscribers.length;
	    this._subscribers.push({ subscribedIDs: subscribedIDs, callback: callback });
	    return {
	      remove: function remove() {
	        delete _this._subscribers[index];
	      }
	    };
	  };

	  GraphQLStoreChangeEmitter.prototype.broadcastChangeForID = function broadcastChangeForID(id) {
	    var _this2 = this;

	    var scheduledIDs = this._scheduledIDs;
	    if (scheduledIDs == null) {
	      resolveImmediate(function () {
	        return _this2._processBroadcasts();
	      });
	      scheduledIDs = this._scheduledIDs = {};
	    }
	    // Record index of the last subscriber so we do not later unintentionally
	    // invoke callbacks that were subscribed after this broadcast.
	    scheduledIDs[this._getBroadcastID(id)] = this._subscribers.length - 1;
	  };

	  GraphQLStoreChangeEmitter.prototype.injectBatchingStrategy = function injectBatchingStrategy(batchStrategy) {
	    this._batchUpdate = batchStrategy;
	  };

	  GraphQLStoreChangeEmitter.prototype._processBroadcasts = function _processBroadcasts() {
	    var _this3 = this;

	    if (this._scheduledIDs) {
	      this._executingIDs = this._scheduledIDs;
	      this._scheduledIDs = null;
	      this._batchUpdate(function () {
	        return _this3._processSubscribers();
	      });
	    }
	  };

	  /**
	   * Exposed for profiling reasons.
	   * @private
	   */

	  GraphQLStoreChangeEmitter.prototype._processSubscribers = function _processSubscribers() {
	    var _this4 = this;

	    this._subscribers.forEach(function (subscriber, subscriberIndex) {
	      return _this4._processSubscriber(subscriber, subscriberIndex);
	    });
	  };

	  GraphQLStoreChangeEmitter.prototype._processSubscriber = function _processSubscriber(_ref, subscriberIndex) {
	    var subscribedIDs = _ref.subscribedIDs;
	    var callback = _ref.callback;

	    for (var broadcastID in this._executingIDs) {
	      if (this._executingIDs.hasOwnProperty(broadcastID)) {
	        var broadcastIndex = this._executingIDs[broadcastID];
	        if (broadcastIndex < subscriberIndex) {
	          // Callback was subscribed after this particular broadcast.
	          break;
	        }
	        if (subscribedIDs.indexOf(broadcastID) >= 0) {
	          ErrorUtils.applyWithGuard(callback, null, null, null, 'GraphQLStoreChangeEmitter');
	          break;
	        }
	      }
	    }
	  };

	  /**
	   * Ranges publish events for the entire range, not the specific view of that
	   * range. For example, if "client:1" is a range, the event is on "client:1",
	   * not "client:1_first(5)".
	   */

	  GraphQLStoreChangeEmitter.prototype._getBroadcastID = function _getBroadcastID(id) {
	    return this._rangeData.getCanonicalClientID(id);
	  };

	  return GraphQLStoreChangeEmitter;
	})();

	module.exports = GraphQLStoreChangeEmitter;

/***/ },
/* 114 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule GraphQLStoreRangeUtils
	 * @typechecks
	 */

	'use strict';

	var _classCallCheck = __webpack_require__(1)['default'];

	var callsFromGraphQL = __webpack_require__(55);
	var serializeRelayQueryCall = __webpack_require__(38);

	/**
	 * Utilities used by GraphQLStore for storing ranges
	 *
	 * GraphQLStore stores all of the parts of a range in a single GraphQLRange
	 * object. For example, `node(4808495){friends.first(5){id,name}}` might be
	 * stored similar to this (pseudo-code):
	 *
	 *   "4808495": {
	 *     "friends": { __dataID__: "client:1" }
	 *   },
	 *   "client:1": {
	 *     "nodes": new GraphQLRange(...) // all friends, not just the first 5
	 *   }
	 *
	 * and when that query is run, the store would return a result pointing at
	 * a specific part of the range, encoded into the data ID:
	 *
	 * {
	 *   "4808495": {
	 *     "friends": { __dataID__: "client:1_first(5)" }
	 *   }
	 * }
	 *
	 * That "client:1_first(5)" ID can then be used to query for the first 5
	 * friends.
	 *
	 * @internal
	 */

	var GraphQLStoreRangeUtils = (function () {
	  function GraphQLStoreRangeUtils() {
	    _classCallCheck(this, GraphQLStoreRangeUtils);

	    this._rangeData = {};
	    this._rangeDataKeyMap = {};
	  }

	  /**
	   * Returns a token that can be parsed using parseRangeClientID to recover
	   * the attributes needed to retrieve the corresponding items from a
	   * GraphQLRange.
	   *
	   * @param {array<*>} calls
	   * @param {object} callValues
	   * @param {string} dataID
	   * @return {string}
	   */

	  GraphQLStoreRangeUtils.prototype.getClientIDForRangeWithID = function getClientIDForRangeWithID(calls, callValues, dataID) {
	    var callsAsString = callsFromGraphQL(calls, callValues).map(function (call) {
	      return serializeRelayQueryCall(call).substring(1);
	    }).join(',');
	    var key = dataID + '_' + callsAsString;
	    var edge = this._rangeData[key];
	    if (!edge) {
	      this._rangeData[key] = {
	        dataID: dataID,
	        calls: calls,
	        callValues: callValues
	      };
	      var rangeDataKeys = this._rangeDataKeyMap[dataID];
	      if (!rangeDataKeys) {
	        this._rangeDataKeyMap[dataID] = rangeDataKeys = [];
	      }
	      rangeDataKeys.push(key);
	    }
	    return key;
	  };

	  /**
	   * Parses an ID back into its data ID and calls
	   *
	   * @param {string} rangeSpecificClientID
	   * @return {?object}
	   */

	  GraphQLStoreRangeUtils.prototype.parseRangeClientID = function parseRangeClientID(rangeSpecificClientID) {
	    return this._rangeData[rangeSpecificClientID] || null;
	  };

	  /**
	   * If given the client id for a range view, returns the canonical client id
	   * for the entire range. e.g. converts "client:1_first(5)" to "client:1".
	   * Otherwise returns the input.
	   *
	   * @param {string} dataID
	   * @return {string}
	   */

	  GraphQLStoreRangeUtils.prototype.getCanonicalClientID = function getCanonicalClientID(dataID) {
	    return this._rangeData[dataID] ? this._rangeData[dataID].dataID : dataID;
	  };

	  GraphQLStoreRangeUtils.prototype.removeRecord = function removeRecord(dataID) {
	    var _this = this;

	    var rangeDataKeys = this._rangeDataKeyMap[dataID];
	    if (rangeDataKeys) {
	      rangeDataKeys.forEach(function (key) {
	        delete _this._rangeData[key];
	      });
	      delete this._rangeDataKeyMap[dataID];
	    }
	  };

	  return GraphQLStoreRangeUtils;
	})();

	module.exports = GraphQLStoreRangeUtils;

/***/ },
/* 115 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule RelayContainer
	 * @typechecks
	 * 
	 */

	'use strict';

	var _inherits = __webpack_require__(5)['default'];

	var _classCallCheck = __webpack_require__(1)['default'];

	var _extends = __webpack_require__(8)['default'];

	var _Object$keys = __webpack_require__(10)['default'];

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var ErrorUtils = __webpack_require__(68);
	var GraphQLFragmentPointer = __webpack_require__(20);
	var GraphQLStoreDataHandler = __webpack_require__(6);
	var GraphQLStoreQueryResolver = __webpack_require__(75);
	var React = __webpack_require__(33);
	var RelayContainerComparators = __webpack_require__(116);
	var RelayContainerProxy = __webpack_require__(117);
	var RelayFragmentReference = __webpack_require__(34);

	var RelayMetaRoute = __webpack_require__(21);
	var RelayMutationTransaction = __webpack_require__(51);
	var RelayPropTypes = __webpack_require__(35);
	var RelayProfiler = __webpack_require__(4);
	var RelayQuery = __webpack_require__(3);
	var RelayStore = __webpack_require__(36);
	var RelayStoreData = __webpack_require__(37);
	var unstable_batchedUpdates = __webpack_require__(143);

	var buildRQL = __webpack_require__(54);

	var forEachObject = __webpack_require__(9);
	var invariant = __webpack_require__(2);
	var nullthrows = __webpack_require__(71);
	var prepareRelayContainerProps = __webpack_require__(156);
	var shallowEqual = __webpack_require__(72);
	var warning = __webpack_require__(11);
	var isReactComponent = __webpack_require__(155);

	var containerContextTypes = {
	  route: RelayPropTypes.QueryConfig.isRequired
	};

	var storeData = RelayStoreData.getDefaultInstance();

	storeData.getChangeEmitter().injectBatchingStrategy(unstable_batchedUpdates);

	/**
	 * @public
	 *
	 * RelayContainer is a higher order component that provides the ability to:
	 *
	 *  - Encode data dependencies using query fragments that are parameterized by
	 *    routes and variables.
	 *  - Manipulate variables via methods on `this.props.relay`.
	 *  - Automatically subscribe to data changes.
	 *  - Avoid unnecessary updates if data is unchanged.
	 *  - Propagate the `route` via context (available on `this.props.relay`).
	 *
	 */
	function createContainerComponent(Component, spec) {
	  var componentName = Component.displayName || Component.name;
	  var containerName = 'Relay(' + componentName + ')';

	  var fragments = spec.fragments;
	  var fragmentNames = _Object$keys(fragments);
	  var initialVariables = spec.initialVariables || {};
	  var prepareVariables = spec.prepareVariables;

	  var RelayContainer = (function (_React$Component) {
	    _inherits(RelayContainer, _React$Component);

	    function RelayContainer(props, context) {
	      _classCallCheck(this, RelayContainer);

	      _React$Component.call(this, props, context);

	      var route = context.route;

	      !(route && typeof route.name === 'string') ?  true ? invariant(false, 'RelayContainer: `%s` was rendered without a valid route. Make sure ' + 'the route is valid, and make sure that it is correctly set on the ' + 'parent component\'s context (e.g. using <RelayRootContainer>).', containerName) : invariant(false) : undefined;

	      var self = this;
	      self.forceFetch = this.forceFetch.bind(this);
	      self.getPendingTransactions = this.getPendingTransactions.bind(this);
	      self.hasFragmentData = this.hasFragmentData.bind(this);
	      self.hasOptimisticUpdate = this.hasOptimisticUpdate.bind(this);
	      self.setVariables = this.setVariables.bind(this);

	      this._deferredSubscriptions = null;
	      this._didShowFakeDataWarning = false;
	      this._fragmentPointers = {};
	      this._hasStaleQueryData = false;
	      this._queryResolvers = {};

	      this.mounted = true;
	      this.pending = null;
	      this.state = {
	        variables: {},
	        queryData: {}
	      };
	    }

	    /**
	     * Requests an update to variables. This primes the cache for the new
	     * variables and notifies the caller of changes via the callback. As data
	     * becomes ready, the component will be updated.
	     */

	    RelayContainer.prototype.setVariables = function setVariables(partialVariables, callback) {
	      this._runVariables(partialVariables, callback, false);
	    };

	    /**
	     * Requests an update to variables. Unlike `setVariables`, this forces data
	     * to be fetched and written for the supplied variables. Any data that
	     * previously satisfied the queries will be overwritten.
	     */

	    RelayContainer.prototype.forceFetch = function forceFetch(partialVariables, callback) {
	      this._runVariables(partialVariables, callback, true);
	    };

	    /**
	     * Creates a query for each of the component's fragments using the given
	     * variables, and fragment pointers that can be used to resolve the results
	     * of those queries. The fragment pointers are of the same shape as the
	     * `_fragmentPointers` property.
	     */

	    RelayContainer.prototype._createQuerySetAndFragmentPointers = function _createQuerySetAndFragmentPointers(variables) {
	      var _this = this;

	      var fragmentPointers = {};
	      var querySet = {};
	      fragmentNames.forEach(function (fragmentName) {
	        var fragment = getFragment(fragmentName, _this.context.route, variables);
	        var queryData = _this.state.queryData[fragmentName];
	        if (!fragment || queryData == null) {
	          return;
	        }

	        var fragmentPointer;
	        if (fragment.isPlural()) {
	          !Array.isArray(queryData) ?  true ? invariant(false, 'RelayContainer: Invalid queryData for `%s`, expected an array ' + 'of records because the corresponding fragment is plural.', fragmentName) : invariant(false) : undefined;
	          var dataIDs = [];
	          queryData.forEach(function (data, ii) {
	            var dataID = GraphQLStoreDataHandler.getID(data);
	            if (dataID) {
	              querySet[fragmentName + ii] = storeData.buildFragmentQueryForDataID(fragment, dataID);
	              dataIDs.push(dataID);
	            }
	          });
	          if (dataIDs.length) {
	            fragmentPointer = new GraphQLFragmentPointer(dataIDs, fragment);
	          }
	        } else {
	          /* $FlowFixMe(>=0.19.0) - queryData is mixed but getID expects Object
	           */
	          var dataID = GraphQLStoreDataHandler.getID(queryData);
	          if (dataID) {
	            fragmentPointer = new GraphQLFragmentPointer(dataID, fragment);
	            querySet[fragmentName] = storeData.buildFragmentQueryForDataID(fragment, dataID);
	          }
	        }

	        fragmentPointers[fragmentName] = fragmentPointer;
	      });
	      return { fragmentPointers: fragmentPointers, querySet: querySet };
	    };

	    RelayContainer.prototype._runVariables = function _runVariables(partialVariables, callback, forceFetch) {
	      var _this2 = this;

	      var lastVariables = this.state.variables;
	      var prevVariables = this.pending ? this.pending.variables : lastVariables;
	      var nextVariables = mergeVariables(prevVariables, partialVariables);

	      this.pending && this.pending.request.abort();

	      var completeProfiler = RelayProfiler.profile('RelayContainer.setVariables', {
	        containerName: containerName,
	        nextVariables: nextVariables
	      });

	      // If variables changed or we are force-fetching, we need to build a new
	      // set of queries that includes the updated variables. Because the pending
	      // fetch is always canceled, always initiate a new fetch.
	      var querySet = {};
	      var fragmentPointers = null;
	      if (forceFetch || !shallowEqual(nextVariables, lastVariables)) {
	        var _createQuerySetAndFragmentPointers2 = this._createQuerySetAndFragmentPointers(nextVariables);

	        querySet = _createQuerySetAndFragmentPointers2.querySet;
	        fragmentPointers = _createQuerySetAndFragmentPointers2.fragmentPointers;
	      }

	      var onReadyStateChange = ErrorUtils.guard(function (readyState) {
	        var aborted = readyState.aborted;
	        var done = readyState.done;
	        var error = readyState.error;
	        var ready = readyState.ready;

	        var isComplete = aborted || done || error;
	        if (isComplete && _this2.pending === current) {
	          _this2.pending = null;
	        }
	        var partialState;
	        if (ready && fragmentPointers) {
	          // Only update query data if variables changed. Otherwise, `querySet`
	          // and `fragmentPointers` will be empty, and `nextVariables` will be
	          // equal to `lastVariables`.
	          _this2._fragmentPointers = fragmentPointers;
	          _this2._updateQueryResolvers();
	          var queryData = _this2._getQueryData(_this2.props);
	          partialState = { variables: nextVariables, queryData: queryData };
	        } else {
	          partialState = {};
	        }
	        var mounted = _this2.mounted;
	        if (mounted) {
	          var updateProfiler = RelayProfiler.profile('RelayContainer.update');
	          unstable_batchedUpdates(function () {
	            _this2.setState(partialState, function () {
	              updateProfiler.stop();
	              if (isComplete) {
	                completeProfiler.stop();
	              }
	            });
	            if (callback) {
	              callback.call(_this2.refs.component || null, _extends({}, readyState, { mounted: mounted }));
	            }
	          });
	        } else {
	          if (callback) {
	            callback(_extends({}, readyState, { mounted: mounted }));
	          }
	          if (isComplete) {
	            completeProfiler.stop();
	          }
	        }
	      }, 'RelayContainer.onReadyStateChange');

	      var current = {
	        variables: nextVariables,
	        request: forceFetch ? RelayStore.forceFetch(querySet, onReadyStateChange) : RelayStore.primeCache(querySet, onReadyStateChange)
	      };
	      this.pending = current;
	    };

	    /**
	     * Determine if the supplied record reflects an optimistic update.
	     */

	    RelayContainer.prototype.hasOptimisticUpdate = function hasOptimisticUpdate(record) {
	      var dataID = GraphQLStoreDataHandler.getID(record);
	      !(dataID != null) ?  true ? invariant(false, 'RelayContainer.hasOptimisticUpdate(): Expected a record in `%s`.', componentName) : invariant(false) : undefined;
	      return storeData.hasOptimisticUpdate(dataID);
	    };

	    /**
	     * Returns the pending mutation transactions affecting the given record.
	     */

	    RelayContainer.prototype.getPendingTransactions = function getPendingTransactions(record) {
	      var dataID = GraphQLStoreDataHandler.getID(record);
	      !(dataID != null) ?  true ? invariant(false, 'RelayContainer.getPendingTransactions(): Expected a record in `%s`.', componentName) : invariant(false) : undefined;
	      var mutationIDs = storeData.getClientMutationIDs(dataID);
	      if (!mutationIDs) {
	        return null;
	      }
	      var mutationQueue = storeData.getMutationQueue();
	      return mutationIDs.map(function (id) {
	        return mutationQueue.getTransaction(id);
	      });
	    };

	    /**
	     * Checks if data for a deferred fragment is ready. This method should
	     * *always* be called before rendering a child component whose fragment was
	     * deferred (unless that child can handle null or missing data).
	     */

	    RelayContainer.prototype.hasFragmentData = function hasFragmentData(fragmentReference, record) {
	      if (!storeData.getPendingQueryTracker().hasPendingQueries()) {
	        // nothing can be missing => must have data
	        return true;
	      }
	      // convert builder -> fragment in order to get the fragment's name
	      var dataID = GraphQLStoreDataHandler.getID(record);
	      !(dataID != null) ?  true ? invariant(false, 'RelayContainer.hasFragmentData(): Second argument is not a valid ' + 'record. For `<%s X={this.props.X} />`, use ' + '`this.props.hasFragmentData(%s.getFragment(\'X\'), this.props.X)`.', componentName, componentName) : invariant(false) : undefined;
	      var fragment = getDeferredFragment(fragmentReference, this.context, this.state.variables);
	      !(fragment instanceof RelayQuery.Fragment) ?  true ? invariant(false, 'RelayContainer.hasFragmentData(): First argument is not a valid ' + 'fragment. Ensure that there are no failing `if` or `unless` ' + 'conditions.') : invariant(false) : undefined;
	      return storeData.getCachedStore().hasDeferredFragmentData(dataID, fragment.getFragmentID());
	    };

	    RelayContainer.prototype.componentWillMount = function componentWillMount() {
	      if (this.context.route.useMockData) {
	        return;
	      }
	      var variables = getVariablesWithPropOverrides(spec, this.props, initialVariables);
	      this._updateFragmentPointers(this.props, this.context.route, variables);
	      this._updateQueryResolvers();
	      var queryData = this._getQueryData(this.props);

	      this.setState({
	        variables: variables,
	        queryData: queryData
	      });
	    };

	    RelayContainer.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps, nextContext) {
	      var _this3 = this;

	      var _nullthrows = nullthrows(nextContext);

	      var route = _nullthrows.route;

	      if (route.useMockData) {
	        return;
	      }
	      this.setState(function (state) {
	        var variables = getVariablesWithPropOverrides(spec, nextProps, resetPropOverridesForVariables(spec, nextProps, state.variables));
	        _this3._updateFragmentPointers(nextProps, route, variables);
	        _this3._updateQueryResolvers();
	        return {
	          variables: variables,
	          queryData: _this3._getQueryData(nextProps)
	        };
	      });
	    };

	    RelayContainer.prototype.componentWillUnmount = function componentWillUnmount() {
	      // A guarded error in mounting might prevent initialization of resolvers.
	      if (this._queryResolvers) {
	        forEachObject(this._queryResolvers, function (queryResolver) {
	          return queryResolver && queryResolver.reset();
	        });
	      }

	      if (this._deferredSubscriptions) {
	        forEachObject(this._deferredSubscriptions, function (sub) {
	          return sub.dispose();
	        });
	      }
	      this._deferredSubscriptions = null;

	      this._fragmentPointers = {};
	      this._queryResolvers = {};

	      var pending = this.pending;
	      if (pending) {
	        pending.request.abort();
	        this.pending = null;
	      }
	      this.mounted = false;
	    };

	    RelayContainer.prototype._updateQueryResolvers = function _updateQueryResolvers() {
	      var _this4 = this;

	      var fragmentPointers = this._fragmentPointers;
	      var queryResolvers = this._queryResolvers;
	      fragmentNames.forEach(function (fragmentName) {
	        var fragmentPointer = fragmentPointers[fragmentName];
	        var queryResolver = queryResolvers[fragmentName];
	        if (!fragmentPointer) {
	          if (queryResolver) {
	            queryResolver.reset();
	            queryResolvers[fragmentName] = null;
	          }
	        } else if (!queryResolver) {
	          queryResolver = new GraphQLStoreQueryResolver(storeData, fragmentPointer, _this4._handleFragmentDataUpdate.bind(_this4));
	          queryResolvers[fragmentName] = queryResolver;
	        }
	      });
	    };

	    RelayContainer.prototype._handleFragmentDataUpdate = function _handleFragmentDataUpdate() {
	      var queryData = this._getQueryData(this.props);
	      var updateProfiler = RelayProfiler.profile('RelayContainer.handleFragmentDataUpdate');
	      this.setState({ queryData: queryData }, updateProfiler.stop);
	    };

	    RelayContainer.prototype._updateFragmentPointers = function _updateFragmentPointers(props, route, variables) {
	      var _this5 = this;

	      var fragmentPointers = this._fragmentPointers;
	      fragmentNames.forEach(function (fragmentName) {
	        var propValue = props[fragmentName];
	         true ? warning(propValue !== undefined, 'RelayContainer: Expected query `%s` to be supplied to `%s` as ' + 'a prop from the parent. Pass an explicit `null` if this is ' + 'intentional.', fragmentName, componentName) : undefined;
	        if (!propValue) {
	          fragmentPointers[fragmentName] = null;
	          return;
	        }
	        var fragment = getFragment(fragmentName, route, variables);
	        var concreteFragmentHash = fragment.getConcreteFragmentHash();
	        var dataIDOrIDs = undefined;

	        if (fragment.isPlural()) {
	          // Plural fragments require the prop value to be an array of fragment
	          // pointers, which are merged into a single fragment pointer to pass
	          // to the query resolver `resolve`.
	          !Array.isArray(propValue) ?  true ? invariant(false, 'RelayContainer: Invalid prop `%s` supplied to `%s`, expected an ' + 'array of records because the corresponding fragment is plural.', fragmentName, componentName) : invariant(false) : undefined;
	          if (propValue.length) {
	            dataIDOrIDs = propValue.reduce(function (acc, item, ii) {
	              var eachFragmentPointer = item[concreteFragmentHash];
	              !eachFragmentPointer ?  true ? invariant(false, 'RelayContainer: Invalid prop `%s` supplied to `%s`, ' + 'expected element at index %s to have query data.', fragmentName, componentName, ii) : invariant(false) : undefined;
	              return acc.concat(eachFragmentPointer.getDataIDs());
	            }, []);
	          } else {
	            // An empty plural fragment cannot be observed; the empty array prop
	            // can be passed as-is to the component.
	            dataIDOrIDs = null;
	          }
	        } else {
	          !!Array.isArray(propValue) ?  true ? invariant(false, 'RelayContainer: Invalid prop `%s` supplied to `%s`, expected a ' + 'single record because the corresponding fragment is not plural.', fragmentName, componentName) : invariant(false) : undefined;
	          var fragmentPointer = propValue[concreteFragmentHash];
	          if (fragmentPointer) {
	            dataIDOrIDs = fragmentPointer.getDataID();
	          } else {
	            // TODO: Throw when we have mock data validation, #6332949.
	            dataIDOrIDs = null;
	            if (true) {
	              if (!route.useMockData && !_this5._didShowFakeDataWarning) {
	                _this5._didShowFakeDataWarning = true;
	                 true ? warning(false, 'RelayContainer: Expected prop `%s` supplied to `%s` to ' + 'be data fetched by Relay. This is likely an error unless ' + 'you are purposely passing in mock data that conforms to ' + 'the shape of this component\'s fragment.', fragmentName, componentName) : undefined;
	              }
	            }
	          }
	        }
	        fragmentPointers[fragmentName] = dataIDOrIDs ? new GraphQLFragmentPointer(dataIDOrIDs, fragment) : null;
	      });
	      if (true) {
	        // If a fragment pointer is null, warn if it was found on another prop.
	        fragmentNames.forEach(function (fragmentName) {
	          if (fragmentPointers[fragmentName]) {
	            return;
	          }
	          var fragment = getFragment(fragmentName, route, variables);
	          var concreteFragmentHash = fragment.getConcreteFragmentHash();
	          _Object$keys(props).forEach(function (propName) {
	             true ? warning(fragmentPointers[propName] || !props[propName] || !props[propName][concreteFragmentHash], 'RelayContainer: Expected record data for prop `%s` on `%s`, ' + 'but it was instead on prop `%s`. Did you misspell a prop or ' + 'pass record data into the wrong prop?', fragmentName, componentName, propName) : undefined;
	          });
	        });
	      }
	    };

	    RelayContainer.prototype._getQueryData = function _getQueryData(props) {
	      var _this6 = this;

	      var queryData = {};
	      var fragmentPointers = this._fragmentPointers;
	      forEachObject(this._queryResolvers, function (queryResolver, propName) {
	        var propValue = props[propName];
	        var fragmentPointer = fragmentPointers[propName];

	        if (!propValue || !fragmentPointer) {
	          // Clear any subscriptions since there is no data.
	          queryResolver && queryResolver.reset();
	          // Allow mock data to pass through without modification.
	          queryData[propName] = propValue;
	        } else {
	          queryData[propName] = queryResolver.resolve(fragmentPointer);
	        }
	        if (_this6.state.queryData.hasOwnProperty(propName) && queryData[propName] !== _this6.state.queryData[propName]) {
	          _this6._hasStaleQueryData = true;
	        }
	      });
	      return queryData;
	    };

	    RelayContainer.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps, nextState, nextContext) {
	      // Flag indicating that query data changed since previous render.
	      if (this._hasStaleQueryData) {
	        this._hasStaleQueryData = false;
	        return true;
	      }

	      if (this.context.route !== nextContext.route) {
	        return true;
	      }

	      var fragmentPointers = this._fragmentPointers;
	      return !RelayContainerComparators.areNonQueryPropsEqual(fragments, this.props, nextProps) || fragmentPointers && !RelayContainerComparators.areQueryResultsEqual(fragmentPointers, this.state.queryData, nextState.queryData) || !RelayContainerComparators.areQueryVariablesEqual(this.state.variables, nextState.variables);
	    };

	    RelayContainer.prototype.render = function render() {
	      var relayProps = {
	        forceFetch: this.forceFetch,
	        getPendingTransactions: this.getPendingTransactions,
	        hasFragmentData: this.hasFragmentData,
	        hasOptimisticUpdate: this.hasOptimisticUpdate,
	        route: this.context.route,
	        setVariables: this.setVariables,
	        variables: this.state.variables
	      };
	      return React.createElement(Component, _extends({}, this.props, this.state.queryData, prepareRelayContainerProps(relayProps, this), {
	        ref: isReactComponent(Component) ? 'component' : null
	      }));
	    };

	    return RelayContainer;
	  })(React.Component);

	  function getFragment(fragmentName, route, variables) {
	    var fragmentBuilder = fragments[fragmentName];
	    !fragmentBuilder ?  true ? invariant(false, 'RelayContainer: Expected `%s` to have a query fragment named `%s`.', containerName, fragmentName) : invariant(false) : undefined;
	    var fragment = buildContainerFragment(containerName, fragmentName, fragmentBuilder, initialVariables);
	    // TODO: Allow routes without names, #7856965.
	    var metaRoute = RelayMetaRoute.get(route.name);
	    if (prepareVariables) {
	      variables = prepareVariables(variables, metaRoute);
	    }
	    return RelayQuery.Fragment.create(fragment, metaRoute, variables);
	  }

	  initializeProfiler(RelayContainer);
	  RelayContainer.contextTypes = containerContextTypes;
	  RelayContainer.displayName = containerName;
	  RelayContainerProxy.proxyMethods(RelayContainer, Component);

	  return RelayContainer;
	}

	/**
	 * TODO: Stop allowing props to override variables, #7856288.
	 */
	function getVariablesWithPropOverrides(spec, props, variables) {
	  var initialVariables = spec.initialVariables;
	  if (initialVariables) {
	    var mergedVariables;
	    for (var key in initialVariables) {
	      if (key in props) {
	        mergedVariables = mergedVariables || _extends({}, variables);
	        mergedVariables[key] = props[key];
	      }
	    }
	    variables = mergedVariables || variables;
	  }
	  return variables;
	}

	/**
	 * Compare props and variables and reset the internal query variables if outside
	 * query variables change the component.
	 *
	 * TODO: Stop allowing props to override variables, #7856288.
	 */
	function resetPropOverridesForVariables(spec, props, variables) {
	  var initialVariables = spec.initialVariables;
	  for (var key in initialVariables) {
	    if (key in props && props[key] != variables[key]) {
	      return initialVariables;
	    }
	  }
	  return variables;
	}

	function initializeProfiler(RelayContainer) {
	  RelayProfiler.instrumentMethods(RelayContainer.prototype, {
	    componentWillMount: 'RelayContainer.prototype.componentWillMount',
	    componentWillReceiveProps: 'RelayContainer.prototype.componentWillReceiveProps',
	    shouldComponentUpdate: 'RelayContainer.prototype.shouldComponentUpdate'
	  });
	}

	/**
	 * Merges a partial update into a set of variables. If no variables changed, the
	 * same object is returned. Otherwise, a new object is returned.
	 */
	function mergeVariables(currentVariables, partialVariables) {
	  if (partialVariables) {
	    for (var key in partialVariables) {
	      if (currentVariables[key] !== partialVariables[key]) {
	        return _extends({}, currentVariables, partialVariables);
	      }
	    }
	  }
	  return currentVariables;
	}

	/**
	 * Wrapper around `buildRQL.Fragment` with contextual error messages.
	 */
	function buildContainerFragment(containerName, fragmentName, fragmentBuilder, variables) {
	  var fragment = buildRQL.Fragment(fragmentBuilder, variables);
	  !fragment ?  true ? invariant(false, 'Relay.QL defined on container `%s` named `%s` is not a valid fragment. ' + 'A typical fragment is defined using: Relay.QL`fragment on Type {...}`', containerName, fragmentName) : invariant(false) : undefined;
	  return fragment;
	}

	function getDeferredFragment(fragmentReference, context, variables) {
	  var route = RelayMetaRoute.get(context.route.name);
	  var concreteFragment = fragmentReference.getFragment(variables);
	  var concreteVariables = fragmentReference.getVariables(route, variables);
	  return RelayQuery.Fragment.create(concreteFragment, route, concreteVariables, {
	    isDeferred: true,
	    isContainerFragment: fragmentReference.isContainerFragment()
	  });
	}

	/**
	 * Creates a lazy Relay container. The actual container is created the first
	 * time a container is being constructed by React's rendering engine.
	 */
	function create(Component, spec) {
	  var componentName = Component.displayName || Component.name;
	  var containerName = 'Relay(' + componentName + ')';

	  var fragments = spec.fragments;
	  !(typeof fragments === 'object' && fragments) ?  true ? invariant(false, 'Relay.createContainer(%s, ...): Missing `fragments`, which is expected ' + 'to be an object mapping from `propName` to: () => Relay.QL`...`', componentName) : invariant(false) : undefined;
	  var fragmentNames = _Object$keys(fragments);
	  var initialVariables = spec.initialVariables || {};
	  var prepareVariables = spec.prepareVariables;

	  var Container;
	  function ContainerConstructor(props, context) {
	    if (!Container) {
	      Container = createContainerComponent(Component, spec);
	    }
	    return new Container(props, context);
	  }

	  ContainerConstructor.getFragmentNames = function () {
	    return fragmentNames;
	  };
	  ContainerConstructor.hasFragment = function (fragmentName) {
	    return !!fragments[fragmentName];
	  };
	  ContainerConstructor.hasVariable = function (variableName) {
	    return Object.prototype.hasOwnProperty.call(initialVariables, variableName);
	  };

	  /**
	   * Retrieves a reference to the fragment by name. An optional second argument
	   * can be supplied to override the component's default variables.
	   */
	  ContainerConstructor.getFragment = function (fragmentName, variableMapping) {
	    var fragmentBuilder = fragments[fragmentName];
	    if (!fragmentBuilder) {
	       true ?  true ? invariant(false, '%s.getFragment(): `%s` is not a valid fragment name. Available ' + 'fragments names: %s', containerName, fragmentName, fragmentNames.map(function (name) {
	        return '`' + name + '`';
	      }).join(', ')) : invariant(false) : undefined;
	    }
	    !(typeof fragmentBuilder === 'function') ?  true ? invariant(false, 'RelayContainer: Expected `%s.fragments.%s` to be a function returning ' + 'a fragment. Example: `%s: () => Relay.QL`fragment on ...`', containerName, fragmentName, fragmentName) : invariant(false) : undefined;
	    return RelayFragmentReference.createForContainer(function () {
	      return buildContainerFragment(containerName, fragmentName, fragmentBuilder, initialVariables);
	    }, initialVariables, variableMapping, prepareVariables);
	  };

	  ContainerConstructor.contextTypes = containerContextTypes;
	  ContainerConstructor.displayName = containerName;
	  ContainerConstructor.moduleName = null;

	  return ContainerConstructor;
	}

	module.exports = { create: create };

/***/ },
/* 116 */
/***/ function(module, exports) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule RelayContainerComparators
	 * 
	 * @typechecks
	 */

	'use strict';

	/**
	 * Compares `objectA` and `objectB` using the provided `isEqual` function.
	 *
	 * If a `filter` object is provided, only its keys will be checked during
	 * comparison.
	 */
	function compareObjects(isEqual, objectA, objectB, filter) {
	  var key;

	  // Test for A's keys different from B.
	  for (key in objectA) {
	    if (filter && !filter.hasOwnProperty(key)) {
	      continue;
	    }

	    if (objectA.hasOwnProperty(key) && (!objectB.hasOwnProperty(key) || !isEqual(objectA[key], objectB[key], key))) {
	      return false;
	    }
	  }
	  // Test for B's keys missing from A.
	  for (key in objectB) {
	    if (filter && !filter.hasOwnProperty(key)) {
	      continue;
	    }

	    if (objectB.hasOwnProperty(key) && !objectA.hasOwnProperty(key)) {
	      return false;
	    }
	  }
	  return true;
	}

	function isScalarAndEqual(valueA, valueB) {
	  return valueA === valueB && (valueA === null || typeof valueA !== 'object');
	}

	function isQueryDataEqual(fragmentPointers, currProp, nextProp, propName) {
	  return(
	    // resolved data did not change
	    fragmentPointers[propName] && currProp === nextProp ||
	    // otherwise compare fake data
	    isScalarAndEqual(currProp, nextProp)
	  );
	}

	function isNonQueryPropEqual(fragments, currProp, nextProp, propName) {
	  return(
	    // ignore props with fragments (instead resolved values are compared)
	    fragments.hasOwnProperty(propName) ||
	    // otherwise props must be scalar and === in order to skip
	    isScalarAndEqual(currProp, nextProp)
	  );
	}

	/**
	 * Relay-aware comparators for props and state provide a reasonable default
	 * implementation of `shouldComponentUpdate`.
	 */
	var RelayContainerComparators = {
	  areQueryResultsEqual: function areQueryResultsEqual(fragmentPointers, prevQueryData, nextQueryData) {
	    return compareObjects(isQueryDataEqual.bind(null, fragmentPointers), prevQueryData, nextQueryData);
	  },

	  areNonQueryPropsEqual: function areNonQueryPropsEqual(fragments, props, nextProps) {
	    return compareObjects(isNonQueryPropEqual.bind(null, fragments), props, nextProps);
	  },

	  areQueryVariablesEqual: function areQueryVariablesEqual(variables, nextVariables) {
	    return compareObjects(isScalarAndEqual, variables, nextVariables);
	  }
	};

	module.exports = RelayContainerComparators;

/***/ },
/* 117 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule RelayContainerProxy
	 */

	'use strict';

	module.exports = __webpack_require__(127);

/***/ },
/* 118 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var _classCallCheck = __webpack_require__(1)['default'];

	var _extends = __webpack_require__(8)['default'];

	var Promise = __webpack_require__(16);

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule RelayDefaultNetworkLayer
	 * @typechecks
	 * 
	 */

	'use strict';

	var fetch = __webpack_require__(109);
	var fetchWithRetries = __webpack_require__(207);

	var RelayDefaultNetworkLayer = (function () {
	  // InitWithRetries

	  function RelayDefaultNetworkLayer(uri, init) {
	    _classCallCheck(this, RelayDefaultNetworkLayer);

	    this._uri = uri;
	    this._init = _extends({}, init);

	    // Bind instance methods to facilitate reuse when creating custom network
	    // layers.
	    var self = this;
	    self.sendMutation = this.sendMutation.bind(this);
	    self.sendQueries = this.sendQueries.bind(this);
	    self.supports = this.supports.bind(this);
	  }

	  /**
	   * Rejects HTTP responses with a status code that is not >= 200 and < 300.
	   * This is done to follow the internal behavior of `fetchWithRetries`.
	   */

	  RelayDefaultNetworkLayer.prototype.sendMutation = function sendMutation(request) {
	    return this._sendMutation(request).then(function (result) {
	      return result.json();
	    }).then(function (payload) {
	      if (payload.hasOwnProperty('errors')) {
	        var error = new Error('Server request for mutation `' + request.getDebugName() + '` ' + 'failed for the following reasons:\n\n' + formatRequestErrors(request, payload.errors));
	        error.source = payload;
	        request.reject(error);
	      } else {
	        request.resolve({ response: payload.data });
	      }
	    })['catch'](function (error) {
	      return request.reject(error);
	    });
	  };

	  RelayDefaultNetworkLayer.prototype.sendQueries = function sendQueries(requests) {
	    var _this = this;

	    return Promise.all(requests.map(function (request) {
	      return _this._sendQuery(request).then(function (result) {
	        return result.json();
	      }).then(function (payload) {
	        if (payload.hasOwnProperty('errors')) {
	          var error = new Error('Server request for query `' + request.getDebugName() + '` ' + 'failed for the following reasons:\n\n' + formatRequestErrors(request, payload.errors));
	          error.source = payload;
	          request.reject(error);
	        } else if (!payload.hasOwnProperty('data')) {
	          request.reject(new Error('Server response was missing for query `' + request.getDebugName() + '`.'));
	        } else {
	          request.resolve({ response: payload.data });
	        }
	      })['catch'](function (error) {
	        return request.reject(error);
	      });
	    }));
	  };

	  RelayDefaultNetworkLayer.prototype.supports = function supports() {
	    // Does not support the only defined option, "defer".
	    return false;
	  };

	  /**
	   * Sends a POST request with optional files.
	   */

	  RelayDefaultNetworkLayer.prototype._sendMutation = function _sendMutation(request) {
	    var init;
	    var files = request.getFiles();
	    if (files) {
	      if (!global.FormData) {
	        throw new Error('Uploading files without `FormData` not supported.');
	      }
	      var formData = new FormData();
	      formData.append('query', request.getQueryString());
	      formData.append('variables', JSON.stringify(request.getVariables()));
	      for (var filename in files) {
	        if (files.hasOwnProperty(filename)) {
	          formData.append(filename, files[filename]);
	        }
	      }
	      init = _extends({}, this._init, {
	        body: formData,
	        method: 'POST'
	      });
	    } else {
	      init = _extends({}, this._init, {
	        body: JSON.stringify({
	          query: request.getQueryString(),
	          variables: request.getVariables()
	        }),
	        headers: _extends({}, this._init.headers, {
	          'Accept': '*/*',
	          'Content-Type': 'application/json'
	        }),
	        method: 'POST'
	      });
	    }
	    return fetch(this._uri, init).then(throwOnServerError);
	  };

	  /**
	   * Sends a POST request and retries if the request fails or times out.
	   */

	  RelayDefaultNetworkLayer.prototype._sendQuery = function _sendQuery(request) {
	    return fetchWithRetries(this._uri, _extends({}, this._init, {
	      body: JSON.stringify({
	        query: request.getQueryString(),
	        variables: request.getVariables()
	      }),
	      headers: _extends({}, this._init.headers, {
	        'Accept': '*/*',
	        'Content-Type': 'application/json'
	      }),
	      method: 'POST'
	    }));
	  };

	  return RelayDefaultNetworkLayer;
	})();

	function throwOnServerError(response) {
	  if (response.status >= 200 && response.status < 300) {
	    return response;
	  } else {
	    throw response;
	  }
	}

	/**
	 * Formats an error response from GraphQL server request.
	 */
	function formatRequestErrors(request, errors) {
	  var CONTEXT_BEFORE = 20;
	  var CONTEXT_LENGTH = 60;

	  var queryLines = request.getQueryString().split('\n');
	  return errors.map(function (_ref, ii) {
	    var locations = _ref.locations;
	    var message = _ref.message;

	    var prefix = ii + 1 + '. ';
	    var indent = ' '.repeat(prefix.length);

	    //custom errors thrown in graphql-server may not have locations
	    var locationMessage = locations ? '\n' + locations.map(function (_ref2) {
	      var column = _ref2.column;
	      var line = _ref2.line;

	      var queryLine = queryLines[line - 1];
	      var offset = Math.min(column - 1, CONTEXT_BEFORE);
	      return [queryLine.substr(column - 1 - offset, CONTEXT_LENGTH), ' '.repeat(offset) + '^^^'].map(function (messageLine) {
	        return indent + messageLine;
	      }).join('\n');
	    }).join('\n') : '';

	    return prefix + message + locationMessage;
	  }).join('\n');
	}

	module.exports = RelayDefaultNetworkLayer;
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 119 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule RelayGarbageCollector
	 * 
	 * @typechecks
	 */

	'use strict';

	var _classCallCheck = __webpack_require__(1)['default'];

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	var GraphQLRange = __webpack_require__(74);
	var GraphQLStoreDataHandler = __webpack_require__(6);

	var RelayQueryPath = __webpack_require__(26);

	var forEachObject = __webpack_require__(9);
	var invariant = __webpack_require__(2);

	/**
	 * @internal
	 *
	 * Provides methods to track the number of references to registered records and
	 * remove un-referenced records from Relay's cache.
	 */

	var RelayGarbageCollector = (function () {
	  function RelayGarbageCollector(storeData, scheduler) {
	    _classCallCheck(this, RelayGarbageCollector);

	    this._activeHoldCount = 0;
	    this._collectionQueue = [];
	    this._isCollecting = false;
	    this._refCounts = {};
	    this._scheduler = scheduler;
	    this._storeData = storeData;
	  }

	  RelayGarbageCollector.prototype.register = function register(dataID) {
	    if (!this._refCounts.hasOwnProperty(dataID)) {
	      this._refCounts[dataID] = 0;
	    }
	  };

	  RelayGarbageCollector.prototype.incrementReferenceCount = function incrementReferenceCount(dataID) {
	    !this._refCounts.hasOwnProperty(dataID) ?  true ? invariant(false, 'RelayGarbageCollector: must register `%s` before referencing.', dataID) : invariant(false) : undefined;
	    this._refCounts[dataID]++;
	  };

	  RelayGarbageCollector.prototype.decrementReferenceCount = function decrementReferenceCount(dataID) {
	    !this._refCounts.hasOwnProperty(dataID) ?  true ? invariant(false, 'RelayGarbageCollector: must register `%s` before dereferencing.', dataID) : invariant(false) : undefined;
	    !(this._refCounts[dataID] > 0) ?  true ? invariant(false, 'RelayGarbageCollector: cannot decrease references below zero for `%s`.', dataID) : invariant(false) : undefined;
	    this._refCounts[dataID]--;
	  };

	  /**
	   * Notify the collector that GC should be put on hold/paused. The hold can be
	   * released by calling the returned callback.
	   *
	   * Example use cases:
	   * - In-flight queries may have been diffed against cached records that are
	   *   unreferenced and eligible for GC. If these records were collected there
	   *   would be insufficient data in the cache to render.
	   * - There may be a gap between a query response being processed and rendering
	   *   the component that initiated the fetch. If records were collected there
	   *   would be insufficient data in the cache to render.
	   */

	  RelayGarbageCollector.prototype.acquireHold = function acquireHold() {
	    var _this = this;

	    var isReleased = false;
	    this._activeHoldCount++;
	    return {
	      release: function release() {
	        !!isReleased ?  true ? invariant(false, 'RelayGarbageCollector: hold can only be released once.') : invariant(false) : undefined;
	        !(_this._activeHoldCount > 0) ?  true ? invariant(false, 'RelayGarbageCollector: cannot decrease hold count below zero.') : invariant(false) : undefined;
	        isReleased = true;
	        _this._activeHoldCount--;
	        if (_this._activeHoldCount === 0) {
	          _this._scheduleCollection();
	        }
	      }
	    };
	  };

	  /**
	   * Schedules a collection starting at the given record.
	   */

	  RelayGarbageCollector.prototype.collectFromNode = function collectFromNode(dataID) {
	    if (this._refCounts[dataID] === 0) {
	      this._collectionQueue.push(dataID);
	      this._scheduleCollection();
	    }
	  };

	  /**
	   * Schedules a collection for any currently unreferenced records.
	   */

	  RelayGarbageCollector.prototype.collect = function collect() {
	    var _this2 = this;

	    forEachObject(this._refCounts, function (refCount, dataID) {
	      if (refCount === 0) {
	        _this2._collectionQueue.push(dataID);
	      }
	    });
	    this._scheduleCollection();
	  };

	  RelayGarbageCollector.prototype._scheduleCollection = function _scheduleCollection() {
	    var _this3 = this;

	    if (this._isCollecting || this._activeHoldCount || !this._collectionQueue.length) {
	      // already scheduled, active hold, or nothing to do
	      return;
	    }
	    this._isCollecting = true;

	    var cachedRecords = this._storeData.getCachedData();
	    var freshRecords = this._storeData.getNodeData();
	    this._scheduler(function () {
	      // handle async scheduling
	      if (_this3._activeHoldCount || !_this3._collectionQueue.length) {
	        return _this3._isCollecting = false;
	      }

	      var dataID = undefined;
	      var refCount = undefined;
	      // find the next record to collect
	      do {
	        dataID = _this3._collectionQueue.shift();
	        refCount = _this3._refCounts[dataID];
	      } while (dataID && refCount === undefined || refCount > 0);
	      var cachedRecord = cachedRecords[dataID];
	      if (cachedRecord) {
	        _this3._traverseRecord(cachedRecord);
	      }
	      var freshRecord = freshRecords[dataID];
	      if (freshRecord) {
	        _this3._traverseRecord(freshRecord);
	      }
	      _this3._collectRecord(dataID);

	      // only allow new collections to be scheduled once the current one
	      // is complete
	      return _this3._isCollecting = !!_this3._collectionQueue.length;
	    });
	  };

	  RelayGarbageCollector.prototype._traverseRecord = function _traverseRecord(record) {
	    var _this4 = this;

	    forEachObject(record, function (value, storageKey) {
	      if (value instanceof RelayQueryPath) {
	        return;
	      } else if (value instanceof GraphQLRange) {
	        value.getEdgeIDs().forEach(function (id) {
	          return _this4._collectionQueue.push(id);
	        });
	      } else if (Array.isArray(value)) {
	        value.forEach(function (item) {
	          if (typeof item === 'object' && item !== null) {
	            var linkedID = GraphQLStoreDataHandler.getID(item);
	            if (linkedID) {
	              _this4._collectionQueue.push(linkedID);
	            }
	          }
	        });
	      } else if (typeof value === 'object' && value !== null) {
	        var linkedID = GraphQLStoreDataHandler.getID(value);
	        if (linkedID) {
	          _this4._collectionQueue.push(linkedID);
	        }
	      }
	    });
	  };

	  RelayGarbageCollector.prototype._collectRecord = function _collectRecord(dataID) {
	    this._storeData.getQueryTracker().untrackNodesForID(dataID);
	    this._storeData.getQueuedStore().removeRecord(dataID);
	    this._storeData.getRangeData().removeRecord(dataID);
	    delete this._refCounts[dataID];
	  };

	  return RelayGarbageCollector;
	})();

	module.exports = RelayGarbageCollector;

/***/ },
/* 120 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule RelayInternals
	 * 
	 */

	'use strict';

	var RelayNetworkLayer = __webpack_require__(25);
	var RelayStoreData = __webpack_require__(37);

	var flattenRelayQuery = __webpack_require__(56);
	var printRelayQuery = __webpack_require__(58);

	/**
	 * This module contains internal Relay modules that we expose for development
	 * tools. They should be considered private APIs.
	 *
	 * @internal
	 */
	var RelayInternals = {
	  NetworkLayer: RelayNetworkLayer,
	  DefaultStoreData: RelayStoreData.getDefaultInstance(),
	  flattenRelayQuery: flattenRelayQuery,
	  printRelayQuery: printRelayQuery
	};

	module.exports = RelayInternals;

/***/ },
/* 121 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule RelayMutation
	 * @typechecks
	 * 
	 */

	'use strict';

	var _classCallCheck = __webpack_require__(1)['default'];

	var _extends = __webpack_require__(8)['default'];

	var _Object$keys = __webpack_require__(10)['default'];

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var RelayFragmentReference = __webpack_require__(34);

	var RelayStore = __webpack_require__(36);

	var buildRQL = __webpack_require__(54);

	var forEachObject = __webpack_require__(9);
	var fromGraphQL = __webpack_require__(81);
	var invariant = __webpack_require__(2);
	var warning = __webpack_require__(11);

	/**
	 * @public
	 *
	 * RelayMutation is the base class for modeling mutations of data.
	 */

	var RelayMutation = (function () {
	  function RelayMutation(props) {
	    _classCallCheck(this, RelayMutation);

	    this._didShowFakeDataWarning = false;
	    this._resolveProps(props);
	  }

	  /**
	   * Wrapper around `buildRQL.Fragment` with contextual error messages.
	   */

	  /**
	   * Each mutation has a server name which is used by clients to communicate the
	   * type of mutation that should be executed on the server.
	   */

	  RelayMutation.prototype.getMutation = function getMutation() {
	     true ?  true ? invariant(false, '%s: Expected abstract method `getMutation` to be implemented.', this.constructor.name) : invariant(false) : undefined;
	  };

	  /**
	   * "Fat queries" represent a predetermined set of fields that may change as a
	   * result of a mutation, and which should therefore be queried in order to get
	   * a consistent view of the data after performing a mutation. In practice, we
	   * query for a subset of those fields because we intersect the fat query with
	   * the tracked query we have for a given node (ie. the pieces of data we've
	   * previously queried for and have therefore written to the store).
	   *
	   * Fat queries can be written like normal graphql queries with one main
	   * exception: fat queries use childless non-scalar fields to indicate that
	   * anything under that field may change. For example, the fat query for
	   * feedback_like contains the field `like_sentence` with no child fields.
	   * This means that any field below `like_sentence` may change as a result of
	   * feedback_like.
	   *
	   * When adding a fat query, consider *all* of the data that might change as a
	   * result of the mutation - not just data that we currently use in Relay. We
	   * don't need to worry about overfetching here (this query is never executed
	   * on its own; the infrastructure always intersects it with what is actually
	   * needed), and if we omit fields here we might get odd consistency behavior
	   * in the future when we add new views or modify existing ones.
	   */

	  RelayMutation.prototype.getFatQuery = function getFatQuery() {
	     true ?  true ? invariant(false, '%s: Expected abstract method `getFatQuery` to be implemented.', this.constructor.name) : invariant(false) : undefined;
	  };

	  /**
	   * These configurations are used to generate the query for the mutation to be
	   * sent to the server and to correctly write the server's response into the
	   * client store.
	   *
	   * Possible configuration types:
	   *
	   * -  FIELDS_CHANGE provides configuration for mutation fields.
	   *    {
	   *      type: RelayMutationType.FIELDS_CHANGE;
	   *      fieldIDs: {[fieldName: string]: DataID | Array<DataID>};
	   *    }
	   *    where fieldIDs map `fieldName`s from the fatQuery to a DataID or
	   *    array of DataIDs to be updated in the store.
	   *
	   * -  RANGE_ADD provides configuration for adding a new edge to a range.
	   *    {
	   *      type: RelayMutationType.RANGE_ADD;
	   *      parentName: string;
	   *      parentID: string;
	   *      connectionName: string;
	   *      edgeName: string;
	   *      rangeBehaviors:
	   *        {[call: string]: GraphQLMutatorConstants.RANGE_OPERATIONS};
	   *    }
	   *    where `parentName` is the field in the fatQuery that contains the range,
	   *    `parentID` is the DataID of `parentName` in the store, `connectionName`
	   *    is the name of the range, `edgeName` is the name of the key in server
	   *    response that contains the newly created edge, `rangeBehaviors` maps
	   *    stringified representation of calls on the connection to
	   *    GraphQLMutatorConstants.RANGE_OPERATIONS.
	   *
	   * -  NODE_DELETE provides configuration for deleting a node and the
	   *    corresponding edge from a range.
	   *    {
	   *      type: RelayMutationType.NODE_DELETE;
	   *      parentName: string;
	   *      parentID: string;
	   *      connectionName: string;
	   *      deletedIDFieldName: string;
	   *    }
	   *    where `parentName`, `parentID` and `connectionName` refer to the same
	   *    things as in RANGE_ADD, `deletedIDFieldName` is the name of the key in
	   *    the server response that contains the DataID of the deleted node.
	   *
	   * -  RANGE_DELETE provides configuration for deleting an edge from a range
	   *    but doesn't delete the node.
	   *    {
	   *      type: RelayMutationType.RANGE_DELETE;
	   *      parentName: string;
	   *      parentID: string;
	   *      connectionName: string;
	   *      deletedIDFieldName: string;
	   *      pathToConnection: Array<string>;
	   *    }
	   *    where `parentName`, `parentID`, `connectionName` and
	   *    `deletedIDFieldName` refer to the same things as in NODE_DELETE,
	   *    `pathToConnection` provides a path from `parentName` to
	   *    `connectionName`.
	   *
	   * -  REQUIRED_CHILDREN is used to append additional children (fragments or
	   *    fields) to the mutation query. Any data fetched as a result of these
	   *    children is not written to the client store. Please avoid using this.
	   *    {
	   *      type: RelayMutationType.REQUIRED_CHILDREN;
	   *      children: Array<RelayQuery.Node>;
	   *    }
	   */

	  RelayMutation.prototype.getConfigs = function getConfigs() {
	     true ?  true ? invariant(false, '%s: Expected abstract method `getConfigs` to be implemented.', this.constructor.name) : invariant(false) : undefined;
	  };

	  /**
	   * These variables form the "input" to the mutation query sent to the server.
	   */

	  RelayMutation.prototype.getVariables = function getVariables() {
	     true ?  true ? invariant(false, '%s: Expected abstract method `getVariables` to be implemented.', this.constructor.name) : invariant(false) : undefined;
	  };

	  /**
	   * These will be sent along with the mutation query to the server.
	   */

	  RelayMutation.prototype.getFiles = function getFiles() {
	    return null;
	  };

	  /**
	   * When a request is sent to the server, mutations can optionally construct an
	   * optimistic response that has the same shape as the server response payload.
	   * This optimistic response is used to pre-emptively update the client cache
	   * to simulate an instantaneous response.
	   *
	   * The optimistic response may be a subset or superset of the actual response
	   * payload. It can be a subset if certain fields are impossible to create on
	   * the client (and if views are expected to handle the data inconsistency). It
	   * can be a superset of the actual response payload if certain fields that are
	   * affected have not been queried by the client, yet.
	   */

	  RelayMutation.prototype.getOptimisticResponse = function getOptimisticResponse() {
	    return null;
	  };

	  /**
	   * Optional. Similar to `getConfig`, this is used to create the query
	   * corresponding to the `optimisticResponse`. If not provided, the query
	   * will be inferred from the optimistic response. Most subclasses shouldn't
	   * need to extend this method.
	   */

	  RelayMutation.prototype.getOptimisticConfigs = function getOptimisticConfigs() {
	    return null;
	  };

	  /**
	   * An optional collision key allows a mutation to identify itself with other
	   * mutations that affect the same fields. Mutations with the same collision
	   * are sent to the server serially and in-order to avoid unpredictable and
	   * potentially incorrect behavior.
	   */

	  RelayMutation.prototype.getCollisionKey = function getCollisionKey() {
	    return null;
	  };

	  RelayMutation.prototype._resolveProps = function _resolveProps(props) {
	    var _this = this;

	    var fragments = this.constructor.fragments;
	    var initialVariables = this.constructor.initialVariables || {};

	    var resolvedProps = _extends({}, props);
	    forEachObject(fragments, function (fragmentBuilder, fragmentName) {
	      var propValue = props[fragmentName];
	       true ? warning(propValue !== undefined, 'RelayMutation: Expected data for fragment `%s` to be supplied to ' + '`%s` as a prop. Pass an explicit `null` if this is intentional.', fragmentName, _this.constructor.name) : undefined;

	      if (!propValue) {
	        return;
	      }

	      var fragment = fromGraphQL.Fragment(buildMutationFragment(_this.constructor.name, fragmentName, fragmentBuilder, initialVariables));
	      var concreteFragmentHash = fragment.getConcreteFragmentHash();

	      if (fragment.isPlural()) {
	        !Array.isArray(propValue) ?  true ? invariant(false, 'RelayMutation: Invalid prop `%s` supplied to `%s`, expected an ' + 'array of records because the corresponding fragment is plural.', fragmentName, _this.constructor.name) : invariant(false) : undefined;
	        var dataIDs = propValue.reduce(function (acc, item, ii) {
	          var eachFragmentPointer = item[concreteFragmentHash];
	          !eachFragmentPointer ?  true ? invariant(false, 'RelayMutation: Invalid prop `%s` supplied to `%s`, ' + 'expected element at index %s to have query data.', fragmentName, _this.constructor.name, ii) : invariant(false) : undefined;
	          return acc.concat(eachFragmentPointer.getDataIDs());
	        }, []);

	        resolvedProps[fragmentName] = RelayStore.readAll(fragment, dataIDs);
	      } else {
	        !!Array.isArray(propValue) ?  true ? invariant(false, 'RelayMutation: Invalid prop `%s` supplied to `%s`, expected a ' + 'single record because the corresponding fragment is not plural.', fragmentName, _this.constructor.name) : invariant(false) : undefined;
	        var fragmentPointer = propValue[concreteFragmentHash];
	        if (fragmentPointer) {
	          var dataID = fragmentPointer.getDataID();
	          resolvedProps[fragmentName] = RelayStore.read(fragment, dataID);
	        } else {
	          if (true) {
	            if (!_this._didShowFakeDataWarning) {
	              _this._didShowFakeDataWarning = true;
	               true ? warning(false, 'RelayMutation: Expected prop `%s` supplied to `%s` to ' + 'be data fetched by Relay. This is likely an error unless ' + 'you are purposely passing in mock data that conforms to ' + 'the shape of this mutation\'s fragment.', fragmentName, _this.constructor.name) : undefined;
	            }
	          }
	        }
	      }
	    });
	    this.props = resolvedProps;
	  };

	  RelayMutation.getFragment = function getFragment(fragmentName, variableMapping) {
	    var _this2 = this;

	    // TODO: Unify fragment API for containers and mutations, #7860172.
	    var fragments = this.fragments;
	    var fragmentBuilder = fragments[fragmentName];
	    if (!fragmentBuilder) {
	       true ?  true ? invariant(false, '%s.getFragment(): `%s` is not a valid fragment name. Available ' + 'fragments names: %s', this.name, fragmentName, _Object$keys(fragments).map(function (name) {
	        return '`' + name + '`';
	      }).join(', ')) : invariant(false) : undefined;
	    }

	    var initialVariables = this.initialVariables || {};
	    var prepareVariables = this.prepareVariables;

	    return RelayFragmentReference.createForContainer(function () {
	      return buildMutationFragment(_this2.name, fragmentName, fragmentBuilder, initialVariables);
	    }, initialVariables, variableMapping, prepareVariables);
	  };

	  return RelayMutation;
	})();

	function buildMutationFragment(mutationName, fragmentName, fragmentBuilder, variables) {
	  var fragment = buildRQL.Fragment(fragmentBuilder, variables);
	  !fragment ?  true ? invariant(false, 'Relay.QL defined on mutation `%s` named `%s` is not a valid fragment. ' + 'A typical fragment is defined using: Relay.QL`fragment on Type {...}`', mutationName, fragmentName) : invariant(false) : undefined;
	  return fragment;
	}

	module.exports = RelayMutation;

	/* $FlowIssue(>=0.20.0) #9410317 */

/***/ },
/* 122 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule RelayMutationQuery
	 * @typechecks
	 * 
	 */

	'use strict';

	var _toConsumableArray = __webpack_require__(19)['default'];

	var GraphQLStoreDataHandler = __webpack_require__(6);
	var RelayConnectionInterface = __webpack_require__(7);

	var RelayMetaRoute = __webpack_require__(21);
	var RelayMutationType = __webpack_require__(78);
	var RelayNodeInterface = __webpack_require__(12);
	var RelayQuery = __webpack_require__(3);

	var flattenRelayQuery = __webpack_require__(56);
	var forEachObject = __webpack_require__(9);
	var nullthrows = __webpack_require__(71);
	var inferRelayFieldsFromData = __webpack_require__(153);
	var intersectRelayQuery = __webpack_require__(154);
	var invariant = __webpack_require__(2);

	var CLIENT_MUTATION_ID = RelayConnectionInterface.CLIENT_MUTATION_ID;
	var ANY_TYPE = RelayNodeInterface.ANY_TYPE;
	var ID = RelayNodeInterface.ID;
	var TYPENAME = RelayNodeInterface.TYPENAME;

	/**
	 * @internal
	 *
	 * Constructs query fragments that are sent with mutations, which should ensure
	 * that any records changed as a result of mutations are brought up-to-date.
	 *
	 * The fragments are a minimal subset created by intersecting the "fat query"
	 * (fields that a mutation declares may have changed) with the "tracked query"
	 * (fields representing data previously queried and written into the store).
	 */
	var RelayMutationQuery = {
	  /**
	   * Accepts a mapping from field names to data IDs. The field names must exist
	   * as top-level fields in the fat query. These top-level fields are used to
	   * re-fetch any data that has changed for records identified by the data IDs.
	   *
	   * The supplied mapping may contain multiple field names. In addition, each
	   * field name may map to an array of data IDs if the field is plural.
	   */
	  buildFragmentForFields: function buildFragmentForFields(_ref) {
	    var fatQuery = _ref.fatQuery;
	    var fieldIDs = _ref.fieldIDs;
	    var tracker = _ref.tracker;

	    var mutatedFields = [];
	    forEachObject(fieldIDs, function (dataIDOrIDs, fieldName) {
	      var fatField = getFieldFromFatQuery(fatQuery, fieldName);
	      var dataIDs = [].concat(dataIDOrIDs);
	      var trackedChildren = [];
	      dataIDs.forEach(function (dataID) {
	        trackedChildren.push.apply(trackedChildren, _toConsumableArray(tracker.getTrackedChildrenForID(dataID)));
	      });
	      var trackedField = fatField.clone(trackedChildren);
	      if (trackedField) {
	        var mutationField = intersectRelayQuery(trackedField, fatField);
	        if (mutationField) {
	          mutatedFields.push(mutationField);
	        }
	      }
	    });
	    return buildMutationFragment(fatQuery, mutatedFields);
	  },

	  /**
	   * Creates a fragment used to update any data as a result of a mutation that
	   * deletes an edge from a connection. The primary difference between this and
	   * `createForFields` is whether or not the connection edges are re-fetched.
	   *
	   * `connectionName`
	   *   Name of the connection field from which the edge is being deleted.
	   *
	   * `parentID`
	   *   ID of the parent record containing the connection which may have metadata
	   *   that needs to be re-fetched.
	   *
	   * `parentName`
	   *   Name of the top-level field in the fat query that corresponds to the
	   *   parent record.
	   */
	  buildFragmentForEdgeDeletion: function buildFragmentForEdgeDeletion(_ref2) {
	    var fatQuery = _ref2.fatQuery;
	    var connectionName = _ref2.connectionName;
	    var parentID = _ref2.parentID;
	    var parentName = _ref2.parentName;
	    var tracker = _ref2.tracker;

	    var fatParent = getFieldFromFatQuery(fatQuery, parentName);
	    var mutatedFields = [];
	    var trackedParent = fatParent.clone(tracker.getTrackedChildrenForID(parentID));
	    if (trackedParent) {
	      var filterUnterminatedRange = function filterUnterminatedRange(node) {
	        return node.getSchemaName() === connectionName;
	      };
	      var mutatedField = intersectRelayQuery(trackedParent, fatParent, filterUnterminatedRange);
	      if (mutatedField) {
	        mutatedFields.push(mutatedField);
	      }
	    }
	    return buildMutationFragment(fatQuery, mutatedFields);
	  },

	  /**
	   * Creates a fragment used to fetch data necessary to insert a new edge into
	   * an existing connection.
	   *
	   * `connectionName`
	   *   Name of the connection field into which the edge is being inserted.
	   *
	   * `parentID`
	   *   ID of the parent record containing the connection which may have metadata
	   *   that needs to be re-fetched.
	   *
	   * `edgeName`
	   *   Name of the top-level field in the fat query that corresponds to the
	   *   newly inserted edge.
	   *
	   * `parentName`
	   *   Name of the top-level field in the fat query that corresponds to the
	   *   parent record. If not supplied, metadata on the parent record and any
	   *   connections without entries in `rangeBehaviors` will not be updated.
	   */
	  buildFragmentForEdgeInsertion: function buildFragmentForEdgeInsertion(_ref3) {
	    var fatQuery = _ref3.fatQuery;
	    var connectionName = _ref3.connectionName;
	    var parentID = _ref3.parentID;
	    var edgeName = _ref3.edgeName;
	    var parentName = _ref3.parentName;
	    var rangeBehaviors = _ref3.rangeBehaviors;
	    var tracker = _ref3.tracker;

	    var trackedChildren = tracker.getTrackedChildrenForID(parentID);

	    var mutatedFields = [];
	    var trackedConnections = [];
	    trackedChildren.forEach(function (trackedChild) {
	      trackedConnections.push.apply(trackedConnections, _toConsumableArray(findDescendantFields(trackedChild, connectionName)));
	    });

	    if (trackedConnections.length) {
	      var keysWithoutRangeBehavior = {};
	      var mutatedEdgeFields = [];
	      trackedConnections.forEach(function (trackedConnection) {
	        var trackedEdges = findDescendantFields(trackedConnection, 'edges');
	        if (!trackedEdges.length) {
	          return;
	        }
	        if (trackedConnection.getRangeBehaviorKey() in rangeBehaviors) {
	          // Include edges from all connections that exist in `rangeBehaviors`.
	          // This may add duplicates, but they will eventually be flattened.
	          trackedEdges.forEach(function (trackedEdge) {
	            mutatedEdgeFields.push.apply(mutatedEdgeFields, _toConsumableArray(trackedEdge.getChildren()));
	          });
	        } else {
	          // If the connection is not in `rangeBehaviors`, re-fetch it.
	          keysWithoutRangeBehavior[trackedConnection.getShallowHash()] = true;
	        }
	      });
	      if (mutatedEdgeFields.length) {
	        mutatedFields.push(buildEdgeField(parentID, edgeName, mutatedEdgeFields));
	      }

	      // TODO: Do this even if there are no tracked connections.
	      if (parentName != null) {
	        var fatParent = getFieldFromFatQuery(fatQuery, parentName);
	        var trackedParent = fatParent.clone(trackedChildren);
	        if (trackedParent) {
	          var filterUnterminatedRange = function filterUnterminatedRange(node) {
	            return !keysWithoutRangeBehavior.hasOwnProperty(node.getShallowHash());
	          };
	          var mutatedParent = intersectRelayQuery(trackedParent, fatParent, filterUnterminatedRange);
	          if (mutatedParent) {
	            mutatedFields.push(mutatedParent);
	          }
	        }
	      }
	    }
	    return buildMutationFragment(fatQuery, mutatedFields);
	  },

	  /**
	   * Creates a fragment used to fetch the given optimistic response.
	   */
	  buildFragmentForOptimisticUpdate: function buildFragmentForOptimisticUpdate(_ref4) {
	    var response = _ref4.response;
	    var fatQuery = _ref4.fatQuery;

	    // Silences RelayQueryNode being incompatible with sub-class RelayQueryField
	    // A detailed error description is available in #7635477
	    var mutatedFields = inferRelayFieldsFromData(response);
	    return buildMutationFragment(fatQuery, mutatedFields);
	  },

	  /**
	   * Creates a RelayQuery.Mutation used to fetch the given optimistic response.
	   */
	  buildQueryForOptimisticUpdate: function buildQueryForOptimisticUpdate(_ref5) {
	    var fatQuery = _ref5.fatQuery;
	    var mutation = _ref5.mutation;
	    var response = _ref5.response;
	    var tracker = _ref5.tracker;

	    var children = [nullthrows(RelayMutationQuery.buildFragmentForOptimisticUpdate({
	      response: response,
	      fatQuery: fatQuery,
	      tracker: tracker
	    }))];
	    return RelayQuery.Mutation.build('OptimisticQuery', fatQuery.getType(), mutation.calls[0].name, null, children, mutation.metadata);
	  },

	  /**
	   * Creates a RelayQuery.Mutation for the given config. See type
	   * `MutationConfig` and the `buildFragmentForEdgeInsertion`,
	   * `buildFragmentForEdgeDeletion` and `buildFragmentForFields` methods above
	   * for possible configs.
	   */
	  buildQuery: function buildQuery(_ref6) {
	    var configs = _ref6.configs;
	    var fatQuery = _ref6.fatQuery;
	    var input = _ref6.input;
	    var mutationName = _ref6.mutationName;
	    var mutation = _ref6.mutation;
	    var tracker = _ref6.tracker;
	    return (function () {
	      var children = [RelayQuery.Field.build({
	        fieldName: CLIENT_MUTATION_ID,
	        type: 'String',
	        metadata: { isRequisite: true }
	      })];

	      configs.forEach(function (config) {
	        switch (config.type) {
	          case RelayMutationType.REQUIRED_CHILDREN:
	            children = children.concat(config.children.map(function (child) {
	              return RelayQuery.Fragment.create(child, RelayMetaRoute.get('$buildQuery'), {});
	            }));
	            break;

	          case RelayMutationType.RANGE_ADD:
	            children.push(RelayMutationQuery.buildFragmentForEdgeInsertion({
	              connectionName: config.connectionName,
	              edgeName: config.edgeName,
	              fatQuery: fatQuery,
	              parentID: config.parentID,
	              parentName: config.parentName,
	              rangeBehaviors: sanitizeRangeBehaviors(config.rangeBehaviors),
	              tracker: tracker
	            }));
	            break;

	          case RelayMutationType.RANGE_DELETE:
	          case RelayMutationType.NODE_DELETE:
	            children.push(RelayMutationQuery.buildFragmentForEdgeDeletion({
	              connectionName: config.connectionName,
	              fatQuery: fatQuery,
	              parentID: config.parentID,
	              parentName: config.parentName,
	              tracker: tracker
	            }));
	            children.push(RelayQuery.Field.build({
	              fieldName: config.deletedIDFieldName,
	              type: 'String'
	            }));
	            break;

	          case RelayMutationType.FIELDS_CHANGE:
	            children.push(RelayMutationQuery.buildFragmentForFields({
	              fatQuery: fatQuery,
	              fieldIDs: config.fieldIDs,
	              tracker: tracker
	            }));
	            break;
	        }
	      });

	      return RelayQuery.Mutation.build(mutationName, fatQuery.getType(), mutation.calls[0].name, input, children.filter(function (child) {
	        return child != null;
	      }), mutation.metadata);
	    })();
	  }
	};

	function getFieldFromFatQuery(fatQuery, fieldName) {
	  var field = fatQuery.getFieldByStorageKey(fieldName);
	  !field ?  true ? invariant(false, 'RelayMutationQuery: Invalid field name on fat query, `%s`.', fieldName) : invariant(false) : undefined;
	  return field;
	}

	function buildMutationFragment(fatQuery, fields) {
	  var fragment = RelayQuery.Fragment.build('MutationQuery', fatQuery.getType(), fields);
	  if (fragment) {
	    !(fragment instanceof RelayQuery.Fragment) ?  true ? invariant(false, 'RelayMutationQuery: Expected a fragment.') : invariant(false) : undefined;
	    return fragment;
	  }
	  return null;
	}

	function buildEdgeField(parentID, edgeName, edgeFields) {
	  var fields = [RelayQuery.Field.build({
	    fieldName: 'cursor',
	    type: 'String'
	  }), RelayQuery.Field.build({
	    fieldName: TYPENAME,
	    type: 'String'
	  })];
	  if (RelayConnectionInterface.EDGES_HAVE_SOURCE_FIELD && !GraphQLStoreDataHandler.isClientID(parentID)) {
	    fields.push(RelayQuery.Field.build({
	      fieldName: 'source',
	      type: ANY_TYPE,
	      children: [RelayQuery.Field.build({
	        fieldName: ID,
	        type: 'String'
	      }), RelayQuery.Field.build({
	        fieldName: TYPENAME,
	        type: 'String'
	      })]
	    }));
	  }
	  fields.push.apply(fields, edgeFields);
	  var edgeField = flattenRelayQuery(RelayQuery.Field.build({
	    fieldName: edgeName,
	    type: ANY_TYPE,
	    children: fields
	  }));
	  !(edgeField instanceof RelayQuery.Field) ?  true ? invariant(false, 'RelayMutationQuery: Expected a field.') : invariant(false) : undefined;
	  return edgeField;
	}

	function sanitizeRangeBehaviors(rangeBehaviors) {
	  // Prior to 0.4.1 you would have to specify the args in your range behaviors
	  // in the same order they appeared in your query. From 0.4.1 onward, args in a
	  // range behavior key must be in alphabetical order.
	  var unsortedKeys = undefined;
	  forEachObject(rangeBehaviors, function (value, key) {
	    if (key !== '') {
	      var keyParts = key
	      // Remove the last parenthesis
	      .slice(0, -1)
	      // Slice on unescaped parentheses followed immediately by a `.`
	      .split(/\)\./);
	      var sortedKey = keyParts.sort().join(').') + (keyParts.length ? ')' : '');
	      if (sortedKey !== key) {
	        unsortedKeys = unsortedKeys || [];
	        unsortedKeys.push(key);
	      }
	    }
	  });
	  if (unsortedKeys) {
	     true ?  true ? invariant(false, 'RelayMutation: To define a range behavior key without sorting ' + 'the arguments alphabetically is disallowed as of Relay 0.5.1. Please ' + 'sort the argument names of the range behavior key%s `%s`%s.', unsortedKeys.length === 1 ? '' : 's', unsortedKeys.length === 1 ? unsortedKeys[0] : unsortedKeys.length === 2 ? unsortedKeys[0] + '` and `' + unsortedKeys[1] : unsortedKeys.slice(0, -1).join('`, `'), unsortedKeys.length > 2 ? ', and `' + unsortedKeys.slice(-1) + '`' : '') : invariant(false) : undefined;
	  }
	  return rangeBehaviors;
	}

	/**
	 * Finds all direct and indirect child fields of `node` with the given
	 * field name.
	 */
	function findDescendantFields(rootNode, fieldName) {
	  var fields = [];
	  function traverse(node) {
	    if (node instanceof RelayQuery.Field) {
	      if (node.getSchemaName() === fieldName) {
	        fields.push(node);
	        return;
	      }
	    }
	    if (node === rootNode || node instanceof RelayQuery.Fragment) {
	      // Search fragments and the root node for matching fields, but skip
	      // descendant non-matching fields.
	      node.getChildren().forEach(function (child) {
	        return traverse(child);
	      });
	    }
	  }
	  traverse(rootNode);
	  return fields;
	}

	module.exports = RelayMutationQuery;

	/* Previously each element of configs had the type mixed, which meant
	 * that they couldn't be used in configs.forEach without being
	 * inspected at runtime. I think this is probably a good use case for
	 * disjoin unions (flowtype.org/blog/2015/07/03/Disjoint-Unions.html)
	 */

/***/ },
/* 123 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule RelayMutationQueue
	 * 
	 * @typechecks
	 */

	'use strict';

	var _classCallCheck = __webpack_require__(1)['default'];

	var _extends = __webpack_require__(8)['default'];

	var _defineProperty = __webpack_require__(60)['default'];

	var ErrorUtils = __webpack_require__(68);
	var QueryBuilder = __webpack_require__(17);
	var RelayConnectionInterface = __webpack_require__(7);
	var RelayMutationQuery = __webpack_require__(122);
	var RelayMutationRequest = __webpack_require__(124);
	var RelayMutationTransaction = __webpack_require__(51);
	var RelayMutationTransactionStatus = __webpack_require__(77);
	var RelayNetworkLayer = __webpack_require__(25);

	var base62 = __webpack_require__(47);
	var flattenRelayQuery = __webpack_require__(56);
	var fromGraphQL = __webpack_require__(81);
	var invariant = __webpack_require__(2);
	var nullthrows = __webpack_require__(71);
	var resolveImmediate = __webpack_require__(49);

	var CLIENT_MUTATION_ID = RelayConnectionInterface.CLIENT_MUTATION_ID;

	var transactionIDCounter = 0;

	/**
	 * @internal
	 *
	 * Coordinates execution of concurrent mutations, including application and
	 * rollback of optimistic payloads and enqueueing mutations with the same
	 * collision key.
	 */

	var RelayMutationQueue = (function () {
	  function RelayMutationQueue(storeData) {
	    _classCallCheck(this, RelayMutationQueue);

	    this._collisionQueueMap = {};
	    this._pendingTransactionMap = {};
	    this._queue = [];
	    this._storeData = storeData;
	    this._willBatchRefreshQueuedData = false;
	  }

	  /**
	   * @private
	   */

	  RelayMutationQueue.prototype.createTransaction = function createTransaction(mutation, callbacks) {
	    var id = base62(transactionIDCounter++);
	    var mutationTransaction = new RelayMutationTransaction(this, id);
	    var transaction = new PendingTransaction({
	      id: id,
	      mutation: mutation,
	      mutationTransaction: mutationTransaction,
	      onFailure: callbacks && callbacks.onFailure,
	      onSuccess: callbacks && callbacks.onSuccess
	    });
	    this._pendingTransactionMap[id] = transaction;
	    this._queue.push(transaction);
	    this._handleOptimisticUpdate(transaction);

	    return mutationTransaction;
	  };

	  RelayMutationQueue.prototype.getTransaction = function getTransaction(id) {
	    return this._get(id).mutationTransaction;
	  };

	  RelayMutationQueue.prototype.getError = function getError(id) {
	    return this._get(id).error;
	  };

	  RelayMutationQueue.prototype.getStatus = function getStatus(id) {
	    return this._get(id).status;
	  };

	  RelayMutationQueue.prototype.commit = function commit(id) {
	    var transaction = this._get(id);
	    var collisionKey = transaction.getCollisionKey();
	    var collisionQueue = collisionKey && this._collisionQueueMap[collisionKey];
	    if (collisionQueue) {
	      collisionQueue.push(transaction);
	      transaction.status = RelayMutationTransactionStatus.COMMIT_QUEUED;
	      transaction.error = null;
	      return;
	    }
	    if (collisionKey) {
	      this._collisionQueueMap[collisionKey] = [transaction];
	    }
	    this._handleCommit(transaction);
	  };

	  RelayMutationQueue.prototype.rollback = function rollback(id) {
	    var transaction = this._get(id);
	    this._handleRollback(transaction);
	  };

	  RelayMutationQueue.prototype._get = function _get(id) {
	    var transaction = this._pendingTransactionMap[id];
	    !transaction ?  true ? invariant(false, 'RelayMutationQueue: `%s` is not a valid pending transaction ID.', id) : invariant(false) : undefined;
	    return transaction;
	  };

	  RelayMutationQueue.prototype._handleOptimisticUpdate = function _handleOptimisticUpdate(transaction) {
	    var optimisticResponse = transaction.getOptimisticResponse();
	    var optimisticQuery = transaction.getOptimisticQuery(this._storeData);
	    if (optimisticResponse && optimisticQuery) {
	      var configs = transaction.getOptimisticConfigs() || transaction.getConfigs();
	      this._storeData.handleUpdatePayload(optimisticQuery, optimisticResponse, {
	        configs: configs,
	        isOptimisticUpdate: true
	      });
	    }
	  };

	  RelayMutationQueue.prototype._handleCommitFailure = function _handleCommitFailure(transaction, error) {
	    var status = error ? RelayMutationTransactionStatus.COMMIT_FAILED : RelayMutationTransactionStatus.COLLISION_COMMIT_FAILED;
	    transaction.status = status;
	    transaction.error = error;

	    var shouldRollback = true;
	    var onFailure = transaction.onFailure;
	    if (onFailure) {
	      var preventAutoRollback = function preventAutoRollback() {
	        shouldRollback = false;
	      };
	      ErrorUtils.applyWithGuard(onFailure, null, [transaction.mutationTransaction, preventAutoRollback], null, 'RelayMutationTransaction:onCommitFailure');
	    }

	    if (error) {
	      this._failCollisionQueue(transaction);
	    }

	    // Might have already been rolled back via `onFailure`.
	    if (shouldRollback && this._pendingTransactionMap.hasOwnProperty(transaction.id)) {
	      this._handleRollback(transaction);
	    }
	    this._batchRefreshQueuedData();
	  };

	  RelayMutationQueue.prototype._handleCommitSuccess = function _handleCommitSuccess(transaction, response) {
	    this._advanceCollisionQueue(transaction);
	    this._clearPendingTransaction(transaction);

	    this._refreshQueuedData();
	    this._storeData.handleUpdatePayload(transaction.getQuery(this._storeData), response[transaction.getCallName()], {
	      configs: transaction.getConfigs(),
	      isOptimisticUpdate: false
	    });

	    var onSuccess = transaction.onSuccess;
	    if (onSuccess) {
	      ErrorUtils.applyWithGuard(onSuccess, null, [response], null, 'RelayMutationTransaction:onCommitSuccess');
	    }
	  };

	  RelayMutationQueue.prototype._handleCommit = function _handleCommit(transaction) {
	    var _this = this;

	    transaction.status = RelayMutationTransactionStatus.COMMITTING;
	    transaction.error = null;

	    var request = new RelayMutationRequest(transaction.getQuery(this._storeData), transaction.getFiles());
	    RelayNetworkLayer.sendMutation(request);

	    request.getPromise().done(function (result) {
	      return _this._handleCommitSuccess(transaction, result.response);
	    }, function (error) {
	      return _this._handleCommitFailure(transaction, error);
	    });
	  };

	  RelayMutationQueue.prototype._handleRollback = function _handleRollback(transaction) {
	    this._clearPendingTransaction(transaction);
	    this._batchRefreshQueuedData();
	  };

	  RelayMutationQueue.prototype._clearPendingTransaction = function _clearPendingTransaction(transaction) {
	    delete this._pendingTransactionMap[transaction.id];
	    this._queue = this._queue.filter(function (tx) {
	      return tx !== transaction;
	    });
	  };

	  RelayMutationQueue.prototype._advanceCollisionQueue = function _advanceCollisionQueue(transaction) {
	    var collisionKey = transaction.getCollisionKey();
	    if (collisionKey) {
	      var collisionQueue = nullthrows(this._collisionQueueMap[collisionKey]);
	      // Remove the transaction that called this function.
	      collisionQueue.shift();

	      if (collisionQueue.length) {
	        this._handleCommit(collisionQueue[0]);
	      } else {
	        delete this._collisionQueueMap[collisionKey];
	      }
	    }
	  };

	  RelayMutationQueue.prototype._failCollisionQueue = function _failCollisionQueue(transaction) {
	    var _this2 = this;

	    var collisionKey = transaction.getCollisionKey();
	    if (collisionKey) {
	      var collisionQueue = nullthrows(this._collisionQueueMap[collisionKey]);
	      // Remove the transaction that called this function.
	      collisionQueue.shift();
	      collisionQueue.forEach(function (transaction) {
	        return _this2._handleCommitFailure(transaction, null);
	      });
	      delete this._collisionQueueMap[collisionKey];
	    }
	  };

	  RelayMutationQueue.prototype._batchRefreshQueuedData = function _batchRefreshQueuedData() {
	    var _this3 = this;

	    if (!this._willBatchRefreshQueuedData) {
	      this._willBatchRefreshQueuedData = true;
	      resolveImmediate(function () {
	        _this3._willBatchRefreshQueuedData = false;
	        _this3._refreshQueuedData();
	      });
	    }
	  };

	  RelayMutationQueue.prototype._refreshQueuedData = function _refreshQueuedData() {
	    var _this4 = this;

	    this._storeData.clearQueuedData();
	    this._queue.forEach(function (transaction) {
	      return _this4._handleOptimisticUpdate(transaction);
	    });
	  };

	  return RelayMutationQueue;
	})();

	var PendingTransaction = (function () {
	  function PendingTransaction(transactionData) {
	    _classCallCheck(this, PendingTransaction);

	    this.error = null;
	    this.id = transactionData.id;
	    this.mutation = transactionData.mutation;
	    this.mutationTransaction = transactionData.mutationTransaction;
	    this.onFailure = transactionData.onFailure;
	    this.onSuccess = transactionData.onSuccess;
	    this.status = RelayMutationTransactionStatus.UNCOMMITTED;
	  }

	  PendingTransaction.prototype.getCallName = function getCallName() {
	    if (!this._callName) {
	      this._callName = this.getMutationNode().calls[0].name;
	    }
	    return this._callName;
	  };

	  PendingTransaction.prototype.getCollisionKey = function getCollisionKey() {
	    if (this._collisionKey === undefined) {
	      this._collisionKey = this.mutation.getCollisionKey() || null;
	    }
	    return this._collisionKey;
	  };

	  PendingTransaction.prototype.getConfigs = function getConfigs() {
	    if (!this._configs) {
	      this._configs = this.mutation.getConfigs();
	    }
	    return this._configs;
	  };

	  PendingTransaction.prototype.getFatQuery = function getFatQuery() {
	    if (!this._fatQuery) {
	      this._fatQuery = nullthrows(flattenRelayQuery(fromGraphQL.Fragment(this.mutation.getFatQuery()), { shouldRemoveFragments: true }));
	    }
	    return this._fatQuery;
	  };

	  PendingTransaction.prototype.getFiles = function getFiles() {
	    if (this._files === undefined) {
	      this._files = this.mutation.getFiles() || null;
	    }
	    return this._files;
	  };

	  PendingTransaction.prototype.getInputVariable = function getInputVariable() {
	    if (!this._inputVariable) {
	      var inputVariable = _extends({}, this.mutation.getVariables(), _defineProperty({}, CLIENT_MUTATION_ID, this.id));
	      this._inputVariable = inputVariable;
	    }
	    return this._inputVariable;
	  };

	  PendingTransaction.prototype.getMutationNode = function getMutationNode() {
	    if (!this._mutationNode) {
	      var mutationNode = QueryBuilder.getMutation(this.mutation.getMutation());
	      !mutationNode ?  true ? invariant(false, 'RelayMutation: Expected `getMutation` to return a mutation created ' + 'with Relay.QL`mutation { ... }`.') : invariant(false) : undefined;
	      this._mutationNode = mutationNode;
	    }
	    return this._mutationNode;
	  };

	  PendingTransaction.prototype.getOptimisticConfigs = function getOptimisticConfigs() {
	    if (this._optimisticConfigs === undefined) {
	      this._optimisticConfigs = this.mutation.getOptimisticConfigs() || null;
	    }
	    return this._optimisticConfigs;
	  };

	  PendingTransaction.prototype.getOptimisticQuery = function getOptimisticQuery(storeData) {
	    if (this._optimisticQuery === undefined) {
	      var optimisticResponse = this.getOptimisticResponse();
	      if (optimisticResponse) {
	        var optimisticConfigs = this.getOptimisticConfigs();
	        if (optimisticConfigs) {
	          this._optimisticQuery = RelayMutationQuery.buildQuery({
	            configs: optimisticConfigs,
	            fatQuery: this.getFatQuery(),
	            input: this.getInputVariable(),
	            mutationName: this.mutation.constructor.name,
	            mutation: this.getMutationNode(),
	            tracker: storeData.getQueryTracker()
	          });
	        } else {
	          this._optimisticQuery = RelayMutationQuery.buildQueryForOptimisticUpdate({
	            response: optimisticResponse,
	            fatQuery: this.getFatQuery(),
	            mutation: this.getMutationNode(),
	            tracker: storeData.getQueryTracker()
	          });
	        }
	      } else {
	        this._optimisticQuery = null;
	      }
	    }
	    return this._optimisticQuery;
	  };

	  PendingTransaction.prototype.getOptimisticResponse = function getOptimisticResponse() {
	    if (this._optimisticResponse === undefined) {
	      var optimisticResponse = this.mutation.getOptimisticResponse() || null;
	      if (optimisticResponse) {
	        optimisticResponse[CLIENT_MUTATION_ID] = this.id;
	      }
	      this._optimisticResponse = optimisticResponse;
	    }
	    return this._optimisticResponse;
	  };

	  PendingTransaction.prototype.getQuery = function getQuery(storeData) {
	    if (!this._query) {
	      this._query = RelayMutationQuery.buildQuery({
	        configs: this.getConfigs(),
	        fatQuery: this.getFatQuery(),
	        input: this.getInputVariable(),
	        mutationName: this.getMutationNode().name,
	        mutation: this.getMutationNode(),
	        tracker: storeData.getQueryTracker()
	      });
	    }
	    return this._query;
	  };

	  return PendingTransaction;
	})();

	module.exports = RelayMutationQueue;

	// Lazily computed and memoized private properties

/***/ },
/* 124 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule RelayMutationRequest
	 * @typechecks
	 * 
	 */

	'use strict';

	var _inherits = __webpack_require__(5)['default'];

	var _classCallCheck = __webpack_require__(1)['default'];

	var Deferred = __webpack_require__(46);

	var printRelayQuery = __webpack_require__(58);

	/**
	 * @internal
	 *
	 * Instances of these are made available via `RelayNetworkLayer.sendMutation`.
	 */

	var RelayMutationRequest = (function (_Deferred) {
	  _inherits(RelayMutationRequest, _Deferred);

	  function RelayMutationRequest(mutation, files) {
	    _classCallCheck(this, RelayMutationRequest);

	    _Deferred.call(this);
	    this._mutation = mutation;
	    this._printedQuery = null;
	    this._files = files;
	  }

	  /**
	   * @public
	   *
	   * Gets a string name used to refer to this request for printing debug output.
	   */

	  RelayMutationRequest.prototype.getDebugName = function getDebugName() {
	    return this._mutation.getName();
	  };

	  /**
	   * @public
	   *
	   * Gets an optional map from name to File objects.
	   */

	  RelayMutationRequest.prototype.getFiles = function getFiles() {
	    return this._files;
	  };

	  /**
	   * @public
	   *
	   * Gets the variables used by the mutation. These variables should be
	   * serialized and sent in the GraphQL request.
	   */

	  RelayMutationRequest.prototype.getVariables = function getVariables() {
	    var printedQuery = this._printedQuery;
	    if (!printedQuery) {
	      printedQuery = printRelayQuery(this._mutation);
	      this._printedQuery = printedQuery;
	    }
	    return printedQuery.variables;
	  };

	  /**
	   * @public
	   *
	   * Gets a string representation of the GraphQL mutation.
	   */

	  RelayMutationRequest.prototype.getQueryString = function getQueryString() {
	    var printedQuery = this._printedQuery;
	    if (!printedQuery) {
	      printedQuery = printRelayQuery(this._mutation);
	      this._printedQuery = printedQuery;
	    }
	    return printedQuery.text;
	  };

	  /**
	   * @public
	   * @unstable
	   */

	  RelayMutationRequest.prototype.getMutation = function getMutation() {
	    return this._mutation;
	  };

	  return RelayMutationRequest;
	})(Deferred);

	module.exports = RelayMutationRequest;

/***/ },
/* 125 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule RelayMutationTracker
	 * 
	 * @typechecks
	 */

	// Maintains a map from the client id to the server id of
	// optimistically added nodes
	'use strict';

	var GraphQLStoreDataHandler = __webpack_require__(6);

	var clientIDToServerIDMap = {};

	// For node-create mutations, maintains an index of the mutation to the
	// client ID of an optimistically created node (if it exists).
	var mutationIDToClientNodeIDMap = {};

	// For mutations that have errors, maintains a two-directional index of the
	// mutation and node with an error.
	var clientMutationIDToErrorNodeID = {};
	var clientNodeIDToErrorMutationID = {};

	/**
	 * @internal
	 *
	 * Records the client ID and error status of mutations as well as maintaining
	 * a mapping of optimistic client IDs to server IDs.
	 */
	var RelayMutationTracker = {

	  /**
	   * Checks if the given id represents an object only known on the client side
	   * or not. In this case, it is both a client id and does not have a
	   * corresponding mapping in the client server id map.
	   */
	  isClientOnlyID: function isClientOnlyID(dataID) {
	    return GraphQLStoreDataHandler.isClientID(dataID) && !clientIDToServerIDMap[dataID];
	  },

	  /**
	   * Updates the map from the client id to the server id for optimistically
	   * added nodes.
	   */
	  updateClientServerIDMap: function updateClientServerIDMap(clientID, serverID) {
	    clientIDToServerIDMap[clientID] = serverID;
	  },

	  /**
	   * Gets the serverID (if one exists) for a given clientID
	   */
	  getServerIDForClientID: function getServerIDForClientID(clientID) {
	    return clientIDToServerIDMap[clientID] || null;
	  },

	  /**
	   * Record the root node ID associated with the mutation.
	   */
	  putClientIDForMutation: function putClientIDForMutation(clientID, clientMutationID) {
	    mutationIDToClientNodeIDMap[clientMutationID] = clientID;

	    // if an error exists for this mutation ID, remove the error on the previous
	    // client ID and 'move' the error on the new client ID
	    var errorNodeID = RelayMutationTracker.getErrorNodeForMutation(clientMutationID);
	    if (errorNodeID) {
	      RelayMutationTracker.deleteMutationForErrorNode(errorNodeID);
	      RelayMutationTracker.putErrorNodeForMutation(clientID, clientMutationID);
	    }
	  },

	  /**
	   * Get the root record ID associated with the muation.
	   */
	  getClientIDForMutation: function getClientIDForMutation(clientMutationID) {
	    return mutationIDToClientNodeIDMap[clientMutationID];
	  },

	  /**
	   * Delete the root record ID associated with the mutation.
	   */
	  deleteClientIDForMutation: function deleteClientIDForMutation(clientMutationID) {
	    delete mutationIDToClientNodeIDMap[clientMutationID];
	  },

	  /**
	   * Record that an error occurred while creating the given (client) record ID.
	   */
	  putErrorNodeForMutation: function putErrorNodeForMutation(clientID, clientMutationID) {
	    clientNodeIDToErrorMutationID[clientID] = clientMutationID;
	    clientMutationIDToErrorNodeID[clientMutationID] = clientID;
	  },

	  /**
	   * Find the failed mutation that created the given (client) record ID,
	   * if any.
	   */
	  getMutationForErrorNode: function getMutationForErrorNode(clientID) {
	    return clientNodeIDToErrorMutationID[clientID];
	  },

	  /**
	   * Find the (client) ID of the record associated with the given mutation,
	   * if any.
	   */
	  getErrorNodeForMutation: function getErrorNodeForMutation(clientMutationID) {
	    return clientMutationIDToErrorNodeID[clientMutationID];
	  },

	  deleteMutationForErrorNode: function deleteMutationForErrorNode(clientID) {
	    delete clientNodeIDToErrorMutationID[clientID];
	  },

	  deleteErrorNodeForMutation: function deleteErrorNodeForMutation(clientMutationID) {
	    delete clientMutationIDToErrorNodeID[clientMutationID];
	  }
	};

	module.exports = RelayMutationTracker;

/***/ },
/* 126 */
/***/ function(module, exports) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule RelayOSSConnectionInterface
	 * @typechecks
	 * 
	 */

	'use strict';

	var CONNECTION_CALLS = {
	  'after': true,
	  'before': true,
	  'find': true,
	  'first': true,
	  'last': true,
	  'surrounds': true
	};
	var REQUIRED_RANGE_CALLS = {
	  'find': true,
	  'first': true,
	  'last': true
	};

	/**
	 * @internal
	 *
	 * Defines logic relevant to the informal "Connection" GraphQL interface.
	 */
	var RelayOSSConnectionInterface = {
	  CLIENT_MUTATION_ID: 'clientMutationId',
	  CURSOR: 'cursor',
	  EDGES: 'edges',
	  END_CURSOR: 'endCursor',
	  HAS_NEXT_PAGE: 'hasNextPage',
	  HAS_PREV_PAGE: 'hasPreviousPage',
	  NODE: 'node',
	  PAGE_INFO: 'pageInfo',
	  START_CURSOR: 'startCursor',

	  /**
	   * Whether `edges` fields are expected to have `source` fields.
	   */
	  EDGES_HAVE_SOURCE_FIELD: false,

	  /**
	   * Checks whether a call exists strictly to encode which parts of a connection
	   * to fetch. Fields that only differ by connection call values should have the
	   * same identity.
	   */
	  isConnectionCall: function isConnectionCall(call) {
	    return CONNECTION_CALLS.hasOwnProperty(call.name);
	  },

	  /**
	   * Checks whether a set of calls on a connection supply enough information to
	   * fetch the range fields (i.e. `edges` and `page_info`).
	   */
	  hasRangeCalls: function hasRangeCalls(calls) {
	    return calls.some(function (call) {
	      return REQUIRED_RANGE_CALLS.hasOwnProperty(call.name);
	    });
	  },

	  /**
	   * Gets a default record representing a connection's `PAGE_INFO`.
	   */
	  getDefaultPageInfo: function getDefaultPageInfo() {
	    var pageInfo = {};
	    pageInfo[RelayOSSConnectionInterface.START_CURSOR] = undefined;
	    pageInfo[RelayOSSConnectionInterface.END_CURSOR] = undefined;
	    pageInfo[RelayOSSConnectionInterface.HAS_NEXT_PAGE] = false;
	    pageInfo[RelayOSSConnectionInterface.HAS_PREV_PAGE] = false;
	    return pageInfo;
	  }
	};

	module.exports = RelayOSSConnectionInterface;

/***/ },
/* 127 */
/***/ function(module, exports) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule RelayOSSContainerProxy
	 * @typechecks
	 * 
	 */

	/**
	 * This feature is deprecated and unavailable in open source.
	 */
	'use strict';

	var RelayOSSContainerProxy = {
	  proxyMethods: function proxyMethods(RelayContainer, Component) {}
	};

	module.exports = RelayOSSContainerProxy;

/***/ },
/* 128 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule RelayOSSNodeInterface
	 * @typechecks
	 * 
	 */

	'use strict';

	var forEachRootCallArg = __webpack_require__(28);
	var generateClientID = __webpack_require__(57);
	var invariant = __webpack_require__(2);

	/**
	 * @internal
	 *
	 * Defines logic relevant to the informal "Node" GraphQL interface.
	 */
	var RelayOSSNodeInterface = {
	  ANY_TYPE: '__any',
	  ID: 'id',
	  NODE: 'node',
	  NODE_TYPE: 'Node',
	  NODES: 'nodes',
	  TYPENAME: '__typename',

	  isNodeRootCall: function isNodeRootCall(fieldName) {
	    return fieldName === RelayOSSNodeInterface.NODE || fieldName === RelayOSSNodeInterface.NODES;
	  },

	  getResultsFromPayload: function getResultsFromPayload(store, query, payload) {
	    var results = [];

	    var rootBatchCall = query.getBatchCall();
	    if (rootBatchCall) {
	      getPayloadRecords(query, payload).forEach(function (result) {
	        if (typeof result !== 'object' || !result) {
	          return;
	        }
	        var dataID = result[RelayOSSNodeInterface.ID];
	        !(dataID != null) ?  true ? invariant(false, 'RelayOSSNodeInterface.getResultsFromPayload(): Unable to write ' + 'result with no `%s` field for query, `%s`.', RelayOSSNodeInterface.ID, query.getName()) : invariant(false) : undefined;
	        results.push({ dataID: dataID, result: result });
	      });
	    } else {
	      var records;
	      var ii;

	      (function () {
	        records = getPayloadRecords(query, payload);
	        ii = 0;

	        var storageKey = query.getStorageKey();
	        forEachRootCallArg(query, function (identifyingArgValue) {
	          var result = records[ii++];
	          var dataID = store.getDataID(storageKey, identifyingArgValue);
	          if (dataID == null) {
	            var payloadID = typeof result === 'object' && result ? result[RelayOSSNodeInterface.ID] : null;
	            if (payloadID != null) {
	              dataID = payloadID;
	            } else {
	              dataID = generateClientID();
	            }
	          }
	          store.putDataID(storageKey, identifyingArgValue, dataID);
	          results.push({ dataID: dataID, result: result });
	        });
	      })();
	    }

	    return results;
	  }
	};

	function getPayloadRecords(query, payload) {
	  var fieldName = query.getFieldName();
	  var identifyingArg = query.getIdentifyingArg();
	  var identifyingArgValue = identifyingArg && identifyingArg.value || null;
	  var records = payload[fieldName];
	  if (!query.getBatchCall()) {
	    if (Array.isArray(identifyingArgValue)) {
	      !Array.isArray(records) ?  true ? invariant(false, 'RelayOSSNodeInterface: Expected payload for root field `%s` to be ' + 'an array with %s results, instead received a single non-array result.', fieldName, identifyingArgValue.length) : invariant(false) : undefined;
	      !(records.length === identifyingArgValue.length) ?  true ? invariant(false, 'RelayOSSNodeInterface: Expected payload for root field `%s` to be ' + 'an array with %s results, instead received an array with %s results.', fieldName, identifyingArgValue.length, records.length) : invariant(false) : undefined;
	    } else if (Array.isArray(records)) {
	       true ?  true ? invariant(false, 'RelayOSSNodeInterface: Expected payload for root field `%s` to be ' + 'a single non-array result, instead received an array with %s results.', fieldName, records.length) : invariant(false) : undefined;
	    }
	  }
	  return Array.isArray(records) ? records : [records];
	}

	module.exports = RelayOSSNodeInterface;

/***/ },
/* 129 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _classCallCheck = __webpack_require__(1)['default'];

	var _Object$keys = __webpack_require__(10)['default'];

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var Promise = __webpack_require__(16);

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule RelayPendingQueryTracker
	 * @typechecks
	 * 
	 */

	'use strict';

	var Deferred = __webpack_require__(46);
	var DliteFetchModeConstants = __webpack_require__(73);
	var PromiseMap = __webpack_require__(206);

	var RelayTaskScheduler = __webpack_require__(53);

	var containsRelayQueryRootCall = __webpack_require__(145);
	var everyObject = __webpack_require__(108);
	var fetchRelayQuery = __webpack_require__(148);
	var invariant = __webpack_require__(2);
	var subtractRelayQuery = __webpack_require__(163);

	/**
	 * @internal
	 *
	 * Tracks pending (in-flight) queries.
	 *
	 * In order to send minimal queries and avoid re-retrieving data,
	 * `RelayPendingQueryTracker` maintains a registry of pending queries, and
	 * "subtracts" those from any new queries that callers enqueue.
	 */

	var RelayPendingQueryTracker = (function () {
	  function RelayPendingQueryTracker(storeData) {
	    _classCallCheck(this, RelayPendingQueryTracker);

	    this._pendingFetchMap = {};
	    this._preloadQueryMap = new PromiseMap();
	    this._storeData = storeData;
	  }

	  /**
	   * @private
	   */

	  /**
	   * Used by `GraphQLQueryRunner` to enqueue new queries.
	   */

	  RelayPendingQueryTracker.prototype.add = function add(params) {
	    return new PendingFetch(params, {
	      pendingFetchMap: this._pendingFetchMap,
	      preloadQueryMap: this._preloadQueryMap,
	      storeData: this._storeData
	    });
	  };

	  RelayPendingQueryTracker.prototype.hasPendingQueries = function hasPendingQueries() {
	    return hasItems(this._pendingFetchMap);
	  };

	  /**
	   * Clears all pending query tracking. Does not cancel the queries themselves.
	   */

	  RelayPendingQueryTracker.prototype.resetPending = function resetPending() {
	    this._pendingFetchMap = {};
	  };

	  RelayPendingQueryTracker.prototype.resolvePreloadQuery = function resolvePreloadQuery(queryID, result) {
	    this._preloadQueryMap.resolveKey(queryID, result);
	  };

	  RelayPendingQueryTracker.prototype.rejectPreloadQuery = function rejectPreloadQuery(queryID, error) {
	    this._preloadQueryMap.rejectKey(queryID, error);
	  };

	  return RelayPendingQueryTracker;
	})();

	var PendingFetch = (function () {
	  function PendingFetch(_ref, _ref2) {
	    var fetchMode = _ref.fetchMode;
	    var forceIndex = _ref.forceIndex;
	    var query = _ref.query;
	    var pendingFetchMap = _ref2.pendingFetchMap;
	    var preloadQueryMap = _ref2.preloadQueryMap;
	    var storeData = _ref2.storeData;
	    return (function () {
	      _classCallCheck(this, PendingFetch);

	      var queryID = query.getID();
	      this._dependents = [];
	      this._forceIndex = forceIndex;
	      this._pendingDependencyMap = {};
	      this._pendingFetchMap = pendingFetchMap;
	      this._preloadQueryMap = preloadQueryMap;
	      this._query = query;
	      this._resolvedDeferred = new Deferred();
	      this._resolvedSubtractedQuery = false;
	      this._storeData = storeData;

	      var subtractedQuery;
	      if (fetchMode === DliteFetchModeConstants.FETCH_MODE_PRELOAD) {
	        subtractedQuery = query;
	        this._fetchSubtractedQueryPromise = this._preloadQueryMap.get(queryID);
	      } else {
	        subtractedQuery = this._subtractPending(query);
	        this._fetchSubtractedQueryPromise = subtractedQuery ? fetchRelayQuery(subtractedQuery) : Promise.resolve();
	      }

	      this._fetchedSubtractedQuery = !subtractedQuery;
	      this._errors = [];

	      if (subtractedQuery) {
	        this._pendingFetchMap[queryID] = {
	          fetch: this,
	          query: subtractedQuery
	        };
	        this._fetchSubtractedQueryPromise.done(this._handleSubtractedQuerySuccess.bind(this, subtractedQuery), this._handleSubtractedQueryFailure.bind(this, subtractedQuery));
	      } else {
	        this._markSubtractedQueryAsResolved();
	      }
	    }).apply(this, arguments);
	  }

	  /**
	   * A pending query is resolvable if it is already resolved or will be resolved
	   * imminently (i.e. its subtracted query and the subtracted queries of all its
	   * pending dependencies have been fetched).
	   */

	  PendingFetch.prototype.isResolvable = function isResolvable() {
	    if (this._fetchedSubtractedQuery) {
	      return everyObject(this._pendingDependencyMap, function (pendingDependency) {
	        return pendingDependency._fetchedSubtractedQuery;
	      });
	      // Pending dependencies further down the graph either don't affect the
	      // result or are already in `_pendingDependencyMap`.
	    }
	    return false;
	  };

	  PendingFetch.prototype.getQuery = function getQuery() {
	    return this._query;
	  };

	  PendingFetch.prototype.getResolvedPromise = function getResolvedPromise() {
	    return this._resolvedDeferred.getPromise();
	  };

	  /**
	   * Subtracts all pending queries from the supplied `query` and returns the
	   * resulting difference. The difference can be null if the entire query is
	   * pending.
	   *
	   * If any pending queries were subtracted, they will be added as dependencies
	   * and the query will only resolve once the subtracted query and all
	   * dependencies have resolved.
	   *
	   * This, combined with our use of diff queries (see `diffRelayQuery`) means
	   * that we only go to the server for things that are not in (or not on their
	   * way to) the cache (`RelayRecordStore`).
	   */

	  PendingFetch.prototype._subtractPending = function _subtractPending(query) {
	    var _this = this;

	    everyObject(this._pendingFetchMap, function (pending) {
	      // Stop if the entire query is subtracted.
	      if (!query) {
	        return false;
	      }
	      if (containsRelayQueryRootCall(pending.query, query)) {
	        var subtractedQuery = subtractRelayQuery(query, pending.query);
	        if (subtractedQuery !== query) {
	          query = subtractedQuery;
	          _this._addPendingDependency(pending.fetch);
	        }
	      }
	      return true;
	    });
	    return query;
	  };

	  PendingFetch.prototype._addPendingDependency = function _addPendingDependency(pendingFetch) {
	    var queryID = pendingFetch.getQuery().getID();
	    this._pendingDependencyMap[queryID] = pendingFetch;
	    pendingFetch._addDependent(this);
	  };

	  PendingFetch.prototype._addDependent = function _addDependent(pendingFetch) {
	    this._dependents.push(pendingFetch);
	  };

	  PendingFetch.prototype._handleSubtractedQuerySuccess = function _handleSubtractedQuerySuccess(subtractedQuery, result) {
	    var _this2 = this;

	    this._fetchedSubtractedQuery = true;

	    RelayTaskScheduler.enqueue(function () {
	      var response = result.response;
	      !(response && typeof response === 'object') ?  true ? invariant(false, 'RelayPendingQueryTracker: Expected response to be an object, got ' + '`%s`.', response ? typeof response : response) : invariant(false) : undefined;
	      _this2._storeData.handleQueryPayload(subtractedQuery, response, _this2._forceIndex);
	    }).done(this._markSubtractedQueryAsResolved.bind(this), this._markAsRejected.bind(this));
	  };

	  PendingFetch.prototype._handleSubtractedQueryFailure = function _handleSubtractedQueryFailure(subtractedQuery, error) {
	    this._markAsRejected(error);
	  };

	  PendingFetch.prototype._markSubtractedQueryAsResolved = function _markSubtractedQueryAsResolved() {
	    var queryID = this.getQuery().getID();
	    delete this._pendingFetchMap[queryID];

	    this._resolvedSubtractedQuery = true;
	    this._updateResolvedDeferred();

	    this._dependents.forEach(function (dependent) {
	      return dependent._markDependencyAsResolved(queryID);
	    });
	  };

	  PendingFetch.prototype._markAsRejected = function _markAsRejected(error) {
	    var queryID = this.getQuery().getID();
	    delete this._pendingFetchMap[queryID];

	    console.warn(error.message);

	    this._errors.push(error);
	    this._updateResolvedDeferred();

	    this._dependents.forEach(function (dependent) {
	      return dependent._markDependencyAsRejected(queryID, error);
	    });
	  };

	  PendingFetch.prototype._markDependencyAsResolved = function _markDependencyAsResolved(dependencyQueryID) {
	    delete this._pendingDependencyMap[dependencyQueryID];

	    this._updateResolvedDeferred();
	  };

	  PendingFetch.prototype._markDependencyAsRejected = function _markDependencyAsRejected(dependencyQueryID, error) {
	    delete this._pendingDependencyMap[dependencyQueryID];

	    this._errors.push(error);
	    this._updateResolvedDeferred();

	    // Dependencies further down the graph are either not affected or informed
	    // by `dependencyQueryID`.
	  };

	  PendingFetch.prototype._updateResolvedDeferred = function _updateResolvedDeferred() {
	    if (this._isSettled() && !this._resolvedDeferred.isSettled()) {
	      if (this._errors.length) {
	        this._resolvedDeferred.reject(this._errors[0]);
	      } else {
	        this._resolvedDeferred.resolve(undefined);
	      }
	    }
	  };

	  PendingFetch.prototype._isSettled = function _isSettled() {
	    return this._errors.length > 0 || this._resolvedSubtractedQuery && !hasItems(this._pendingDependencyMap);
	  };

	  return PendingFetch;
	})();

	function hasItems(map) {
	  return !!_Object$keys(map).length;
	}

	exports.PendingFetch = PendingFetch;

	module.exports = RelayPendingQueryTracker;

	// Asynchronous mapping from preload query IDs to results.

	/**
	 * Error(s) in fetching/handleUpdate-ing its or one of its pending
	 * dependency's subtracted query. There may be more than one error. However,
	 * `_resolvedDeferred` is rejected with the earliest encountered error.
	 */
	// babel-eslint issue

/***/ },
/* 130 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule RelayPublic
	 * @typechecks
	 * 
	 */

	'use strict';

	var RelayContainer = __webpack_require__(115);
	var RelayMutation = __webpack_require__(121);
	var RelayNetworkLayer = __webpack_require__(25);
	var RelayPropTypes = __webpack_require__(35);
	var RelayQL = __webpack_require__(131);
	var RelayRootContainer = __webpack_require__(141);
	var RelayRoute = __webpack_require__(142);
	var RelayStore = __webpack_require__(36);
	var RelayTaskScheduler = __webpack_require__(53);
	var RelayInternals = __webpack_require__(120);

	var createRelayQuery = __webpack_require__(146);
	var getRelayQueries = __webpack_require__(84);
	var isRelayContainer = __webpack_require__(85);

	if (typeof global.__REACT_DEVTOOLS_GLOBAL_HOOK__ !== 'undefined') {
	  global.__REACT_DEVTOOLS_GLOBAL_HOOK__._relayInternals = RelayInternals;
	}

	/**
	 * Relay contains the set of public methods used to initialize and orchestrate
	 * a React application that uses GraphQL to declare data dependencies.
	 */
	var RelayPublic = {
	  Mutation: RelayMutation,
	  PropTypes: RelayPropTypes,
	  QL: RelayQL,
	  RootContainer: RelayRootContainer,
	  Route: RelayRoute,
	  Store: RelayStore,

	  createContainer: RelayContainer.create,
	  createQuery: createRelayQuery,
	  getQueries: getRelayQueries,
	  injectNetworkLayer: RelayNetworkLayer.injectNetworkLayer,
	  injectTaskScheduler: RelayTaskScheduler.injectScheduler,
	  isContainer: isRelayContainer
	};

	module.exports = RelayPublic;
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 131 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule RelayQL
	 * @typechecks
	 * 
	 */

	'use strict';

	var _Object$assign = __webpack_require__(59)['default'];

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	var QueryBuilder = __webpack_require__(17);
	var RelayFragmentReference = __webpack_require__(34);
	var RelayRouteFragment = __webpack_require__(79);

	var invariant = __webpack_require__(2);

	/**
	 * @public
	 *
	 * This is a tag function used with template strings to provide the facade of a
	 * runtime GraphQL parser. Example usage:
	 *
	 *   Relay.QL`fragment on User { name }`
	 *
	 * In actuality, a Babel transform parses these tag templates and replaces it
	 * with an internal representation of the query structure.
	 */
	function RelayQL(strings) {
	   true ?  true ? invariant(false, 'RelayQL: Unexpected invocation at runtime. Either the Babel transform ' + 'was not set up, or it failed to identify this call site. Make sure it ' + 'is being used verbatim as `Relay.QL`.') : invariant(false) : undefined;
	}

	/**
	 * Private helper methods used by the transformed code.
	 */
	_Object$assign(RelayQL, {
	  __frag: function __frag(substitution) {
	    if (typeof substitution === 'function') {
	      // Route conditional fragment, e.g. `${route => matchRoute(route, ...)}`.
	      return new RelayRouteFragment(substitution);
	    }
	    if (substitution != null) {
	      !(substitution instanceof RelayFragmentReference || QueryBuilder.getFragment(substitution) || QueryBuilder.getFragmentReference(substitution)) ?  true ? invariant(false, 'RelayQL: Invalid fragment composition, use ' + '`${Child.getFragment(\'name\')}`.') : invariant(false) : undefined;
	    }
	    return substitution;
	  },
	  __var: function __var(expression) {
	    var variable = QueryBuilder.getCallVariable(expression);
	    if (variable) {
	       true ?  true ? invariant(false, 'RelayQL: Invalid argument `%s` supplied via template substitution. ' + 'Instead, use an inline variable (e.g. `comments(count: $count)`).', variable.callVariableName) : invariant(false) : undefined;
	    }
	    return QueryBuilder.createCallValue(expression);
	  },
	  __varDEPRECATED: function __varDEPRECATED(expression) {
	    var variable = QueryBuilder.getCallVariable(expression);
	    if (variable) {
	       true ?  true ? invariant(false, 'RelayQL: Invalid argument `%s` supplied via template substitution. ' + 'Instead, use an inline variable (e.g. `comments(count: $count)`).', variable.callVariableName) : invariant(false) : undefined;
	    }
	    return expression;
	  }
	});

	module.exports = RelayQL;

/***/ },
/* 132 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule RelayQueryConfig
	 * 
	 * @typechecks
	 */

	'use strict';

	var _classCallCheck = __webpack_require__(1)['default'];

	var _extends = __webpack_require__(8)['default'];

	var _Object$freeze = __webpack_require__(39)['default'];

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var invariant = __webpack_require__(2);

	/**
	 * Configures the root queries and initial variables that define the context in
	 * which the top-level component's fragments are requested. This is meant to be
	 * subclassed, of which instances are supplied to `RelayRootContainer`.
	 */

	var RelayQueryConfig = (function () {
	  function RelayQueryConfig(initialVariables) {
	    _classCallCheck(this, RelayQueryConfig);

	    !(this.constructor !== RelayQueryConfig) ?  true ? invariant(false, 'RelayQueryConfig: Abstract class cannot be instantiated.') : invariant(false) : undefined;

	    Object.defineProperty(this, 'name', {
	      enumerable: true,
	      value: this.constructor.routeName,
	      writable: false
	    });
	    Object.defineProperty(this, 'params', {
	      enumerable: true,
	      value: this.prepareVariables(_extends({}, initialVariables)) || {},
	      writable: false
	    });
	    Object.defineProperty(this, 'queries', {
	      enumerable: true,
	      value: _extends({}, this.constructor.queries),
	      writable: false
	    });

	    if (true) {
	      _Object$freeze(this.params);
	      _Object$freeze(this.queries);
	    }
	  }

	  /**
	   * Provides an opportunity to perform additional logic on the variables.
	   * Child class should override this function to perform custom logic.
	   */

	  RelayQueryConfig.prototype.prepareVariables = function prepareVariables(prevVariables) {
	    return prevVariables;
	  };

	  return RelayQueryConfig;
	})();

	module.exports = RelayQueryConfig;

	// TODO: Deprecate `routeName`, #8478719.

/***/ },
/* 133 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule RelayQueryRequest
	 * @typechecks
	 * 
	 */

	'use strict';

	var _inherits = __webpack_require__(5)['default'];

	var _classCallCheck = __webpack_require__(1)['default'];

	var Deferred = __webpack_require__(46);

	var printRelayQuery = __webpack_require__(58);

	/**
	 * @internal
	 *
	 * Instances of these are made available via `RelayNetworkLayer.sendQueries`.
	 */

	var RelayQueryRequest = (function (_Deferred) {
	  _inherits(RelayQueryRequest, _Deferred);

	  function RelayQueryRequest(query) {
	    _classCallCheck(this, RelayQueryRequest);

	    _Deferred.call(this);
	    this._printedQuery = null;
	    this._query = query;
	  }

	  /**
	   * @public
	   *
	   * Gets a string name used to refer to this request for printing debug output.
	   */

	  RelayQueryRequest.prototype.getDebugName = function getDebugName() {
	    return this._query.getName();
	  };

	  /**
	   * @public
	   *
	   * Gets a unique identifier for this query. These identifiers are useful for
	   * assigning response payloads to their corresponding queries when sent in a
	   * single GraphQL request.
	   */

	  RelayQueryRequest.prototype.getID = function getID() {
	    return this._query.getID();
	  };

	  /**
	   * @public
	   *
	   * Gets the variables used by the query. These variables should be serialized
	   * and sent in the GraphQL request.
	   */

	  RelayQueryRequest.prototype.getVariables = function getVariables() {
	    var printedQuery = this._printedQuery;
	    if (!printedQuery) {
	      printedQuery = printRelayQuery(this._query);
	      this._printedQuery = printedQuery;
	    }
	    return printedQuery.variables;
	  };

	  /**
	   * @public
	   *
	   * Gets a string representation of the GraphQL query.
	   */

	  RelayQueryRequest.prototype.getQueryString = function getQueryString() {
	    var printedQuery = this._printedQuery;
	    if (!printedQuery) {
	      printedQuery = printRelayQuery(this._query);
	      this._printedQuery = printedQuery;
	    }
	    return printedQuery.text;
	  };

	  /**
	   * @public
	   * @unstable
	   */

	  RelayQueryRequest.prototype.getQuery = function getQuery() {
	    return this._query;
	  };

	  return RelayQueryRequest;
	})(Deferred);

	module.exports = RelayQueryRequest;

/***/ },
/* 134 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule RelayQueryResultObservable
	 * @typechecks
	 * 
	 */

	'use strict';

	var _classCallCheck = __webpack_require__(1)['default'];

	var GraphQLFragmentPointer = __webpack_require__(20);
	var GraphQLStoreQueryResolver = __webpack_require__(75);

	var invariant = __webpack_require__(2);

	/**
	 * An Rx Observable representing the results of a fragment in the local cache.
	 * Subscribers are notified as follows:
	 *
	 * `onNext`: Called with the latest results of a fragment. Results may be `null`
	 * if the data was marked as deleted or `undefined` if the fragment was either
	 * not fetched or evicted from the cache. Note that required fields may be
	 * missing if the fragment was not fetched with `Relay.Store.primeCache` or
	 * `Relay.Store.forceFetch` before creating a subscription.
	 * - Called synchronously on `subscribe()`.
	 * - Called whenever the results of the fragment change.
	 *
	 * `onError`: Currently not called. In the future this may be used to indicate
	 * that required data for the fragment has not been fetched or was evicted
	 * from the cache.
	 *
	 * `onCompleted`: Not called.
	 *
	 * @see http://reactivex.io/documentation/observable.html
	 */

	var RelayQueryResultObservable = (function () {
	  function RelayQueryResultObservable(storeData, fragmentPointer) {
	    _classCallCheck(this, RelayQueryResultObservable);

	    this._data = undefined;
	    this._fragmentPointer = fragmentPointer;
	    this._queryResolver = null;
	    this._storeData = storeData;
	    this._subscriptionCallbacks = [];
	    this._subscriptionCount = 0;
	  }

	  RelayQueryResultObservable.prototype.subscribe = function subscribe(callbacks) {
	    var _this = this;

	    this._subscriptionCount++;
	    var subscriptionIndex = this._subscriptionCallbacks.length;
	    var subscription = {
	      dispose: function dispose() {
	        !_this._subscriptionCallbacks[subscriptionIndex] ?  true ? invariant(false, 'RelayQueryResultObservable: Subscriptions may only be disposed once.') : invariant(false) : undefined;
	        delete _this._subscriptionCallbacks[subscriptionIndex];
	        _this._subscriptionCount--;
	        if (_this._subscriptionCount === 0) {
	          _this._unobserve();
	        }
	      }
	    };
	    this._subscriptionCallbacks.push(callbacks);

	    if (this._subscriptionCount === 1) {
	      this._resolveData(this._observe());
	    }
	    this._fire(callbacks);

	    return subscription;
	  };

	  RelayQueryResultObservable.prototype._observe = function _observe() {
	    var _this2 = this;

	    !!this._queryResolver ?  true ? invariant(false, 'RelayQueryResultObservable: Initialized twice.') : invariant(false) : undefined;
	    var queryResolver = new GraphQLStoreQueryResolver(this._storeData, this._fragmentPointer, function () {
	      return _this2._onUpdate(queryResolver);
	    });
	    this._queryResolver = queryResolver;
	    return queryResolver;
	  };

	  RelayQueryResultObservable.prototype._unobserve = function _unobserve() {
	    if (this._queryResolver) {
	      this._data = undefined;
	      this._queryResolver.reset();
	      this._queryResolver = null;
	    }
	  };

	  RelayQueryResultObservable.prototype._onUpdate = function _onUpdate(queryResolver) {
	    var _this3 = this;

	    this._resolveData(queryResolver);
	    this._subscriptionCallbacks.forEach(function (callbacks) {
	      return _this3._fire(callbacks);
	    });
	  };

	  RelayQueryResultObservable.prototype._fire = function _fire(callbacks) {
	    callbacks.onNext && callbacks.onNext(this._data);
	  };

	  RelayQueryResultObservable.prototype._resolveData = function _resolveData(queryResolver) {
	    var data = queryResolver.resolve(this._fragmentPointer);
	    !!Array.isArray(data) ?  true ? invariant(false, 'RelayQueryResultObservable: Plural fragments are not supported.') : invariant(false) : undefined;
	    this._data = data;
	  };

	  return RelayQueryResultObservable;
	})();

	module.exports = RelayQueryResultObservable;

/***/ },
/* 135 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule RelayQueryTracker
	 * 
	 * @typechecks
	 */

	'use strict';

	var _classCallCheck = __webpack_require__(1)['default'];

	var _toConsumableArray = __webpack_require__(19)['default'];

	var GraphQLStoreDataHandler = __webpack_require__(6);

	var RelayNodeInterface = __webpack_require__(12);
	var RelayQuery = __webpack_require__(3);

	var invariant = __webpack_require__(2);

	var TYPE = '__type__';

	var RelayQueryTracker = (function () {
	  function RelayQueryTracker() {
	    _classCallCheck(this, RelayQueryTracker);

	    this._trackedNodesByID = {};
	  }

	  RelayQueryTracker.prototype.trackNodeForID = function trackNodeForID(node, dataID, path) {
	    // Non-refetchable nodes are tracked via their nearest-refetchable parent
	    // (except for root call nodes)
	    if (GraphQLStoreDataHandler.isClientID(dataID)) {
	      !path ?  true ? invariant(false, 'RelayQueryTracker.trackNodeForID(): Expected `path` for client ID, ' + '`%s`.', dataID) : invariant(false) : undefined;
	      if (!path.isRootPath()) {
	        return;
	      }
	    }
	    // Don't track `__type__` fields
	    if (node instanceof RelayQuery.Field && node.getSchemaName() === TYPE) {
	      return;
	    }

	    this._trackedNodesByID[dataID] = this._trackedNodesByID[dataID] || {
	      trackedNodes: [],
	      isMerged: false
	    };
	    this._trackedNodesByID[dataID].trackedNodes.push(node);
	    this._trackedNodesByID[dataID].isMerged = false;
	  };

	  /**
	   * Get the children that are tracked for the given `dataID`, if any.
	   */

	  RelayQueryTracker.prototype.getTrackedChildrenForID = function getTrackedChildrenForID(dataID) {
	    var trackedNodesByID = this._trackedNodesByID[dataID];
	    if (!trackedNodesByID) {
	      return [];
	    }
	    var isMerged = trackedNodesByID.isMerged;
	    var trackedNodes = trackedNodesByID.trackedNodes;

	    if (!isMerged) {
	      (function () {
	        var trackedChildren = [];
	        trackedNodes.forEach(function (trackedQuery) {
	          trackedChildren.push.apply(trackedChildren, _toConsumableArray(trackedQuery.getChildren()));
	        });
	        trackedNodes.length = 0;
	        trackedNodesByID.isMerged = true;
	        var containerNode = RelayQuery.Fragment.build('RelayQueryTracker', RelayNodeInterface.NODE_TYPE, trackedChildren);
	        if (containerNode) {
	          trackedNodes.push(containerNode);
	        }
	      })();
	    }
	    var trackedNode = trackedNodes[0];
	    if (trackedNode) {
	      return trackedNode.getChildren();
	    }
	    return [];
	  };

	  /**
	   * Removes all nodes that are tracking the given DataID from the
	   * query-tracker.
	   */

	  RelayQueryTracker.prototype.untrackNodesForID = function untrackNodesForID(dataID) {
	    delete this._trackedNodesByID[dataID];
	  };

	  return RelayQueryTracker;
	})();

	module.exports = RelayQueryTracker;

/***/ },
/* 136 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule RelayQueryWriter
	 * 
	 * @typechecks
	 */

	'use strict';

	var _inherits = __webpack_require__(5)['default'];

	var _classCallCheck = __webpack_require__(1)['default'];

	var _extends = __webpack_require__(8)['default'];

	var RelayQuery = __webpack_require__(3);

	var RelayConnectionInterface = __webpack_require__(7);
	var RelayNodeInterface = __webpack_require__(12);

	var RelayQueryVisitor = __webpack_require__(18);
	var RelayRecordState = __webpack_require__(27);

	var generateClientEdgeID = __webpack_require__(82);
	var generateClientID = __webpack_require__(57);
	var invariant = __webpack_require__(2);
	var isCompatibleRelayFragmentType = __webpack_require__(29);
	var warning = __webpack_require__(11);

	var ANY_TYPE = RelayNodeInterface.ANY_TYPE;
	var ID = RelayNodeInterface.ID;
	var TYPENAME = RelayNodeInterface.TYPENAME;
	var EDGES = RelayConnectionInterface.EDGES;
	var NODE = RelayConnectionInterface.NODE;
	var PAGE_INFO = RelayConnectionInterface.PAGE_INFO;

	/**
	 * @internal
	 *
	 * Helper for writing the result of one or more queries/operations into the
	 * store, updating tracked queries, and recording changed record IDs.
	 */

	var RelayQueryWriter = (function (_RelayQueryVisitor) {
	  _inherits(RelayQueryWriter, _RelayQueryVisitor);

	  function RelayQueryWriter(store, queryTracker, changeTracker, options) {
	    _classCallCheck(this, RelayQueryWriter);

	    _RelayQueryVisitor.call(this);
	    this._changeTracker = changeTracker;
	    this._forceIndex = options && options.forceIndex ? options.forceIndex : 0;
	    this._isOptimisticUpdate = !!(options && options.isOptimisticUpdate);
	    this._store = store;
	    this._queryTracker = queryTracker;
	    this._updateTrackedQueries = !!(options && options.updateTrackedQueries);
	  }

	  RelayQueryWriter.prototype.getRecordStore = function getRecordStore() {
	    return this._store;
	  };

	  RelayQueryWriter.prototype.getRecordTypeName = function getRecordTypeName(node, recordID, payload) {
	    if (this._isOptimisticUpdate) {
	      // Optimistic queries are inferred and fields have a generic 'any' type.
	      return null;
	    }
	    var typeName = payload[TYPENAME];
	    if (typeName == null && !node.isAbstract()) {
	      typeName = node.getType();
	    }
	     true ? warning(typeName && typeName !== ANY_TYPE, 'RelayQueryWriter: Could not find a type name for record `%s`.', recordID) : undefined;
	    return typeName || null;
	  };

	  /**
	   * Traverses a query and payload in parallel, writing the results into the
	   * store.
	   */

	  RelayQueryWriter.prototype.writePayload = function writePayload(node, recordID, responseData, path) {
	    var _this = this;

	    var state = {
	      nodeID: null,
	      path: path,
	      recordID: recordID,
	      responseData: responseData
	    };

	    if (node instanceof RelayQuery.Field && !node.isScalar()) {
	      // for non-scalar fields, the recordID is the parent
	      node.getChildren().forEach(function (child) {
	        _this.visit(child, state);
	      });
	      return;
	    }

	    this.visit(node, state);
	  };

	  /**
	   * Records are "created" whenever an entry did not previously exist for the
	   * `recordID`, including cases when a `recordID` is created with a null value.
	   */

	  RelayQueryWriter.prototype.recordCreate = function recordCreate(recordID) {
	    this._changeTracker.createID(recordID);
	  };

	  /**
	   * Records are "updated" if any field changes (including being set to null).
	   * Updates are not recorded for newly created records.
	   */

	  RelayQueryWriter.prototype.recordUpdate = function recordUpdate(recordID) {
	    this._changeTracker.updateID(recordID);
	  };

	  /**
	   * Determine if the record was created or updated by this write operation.
	   */

	  RelayQueryWriter.prototype.hasChangeToRecord = function hasChangeToRecord(recordID) {
	    return this._changeTracker.hasChange(recordID);
	  };

	  /**
	   * Determine if the record was created by this write operation.
	   */

	  RelayQueryWriter.prototype.isNewRecord = function isNewRecord(recordID) {
	    return this._changeTracker.isNewRecord(recordID);
	  };

	  /**
	   * Helper to create a record and the corresponding notification.
	   */

	  RelayQueryWriter.prototype.createRecordIfMissing = function createRecordIfMissing(node, recordID, typeName, path) {
	    var recordState = this._store.getRecordState(recordID);
	    if (recordState !== RelayRecordState.EXISTENT) {
	      this._store.putRecord(recordID, typeName, path);
	      this.recordCreate(recordID);
	    }
	    if (this.isNewRecord(recordID) || this._updateTrackedQueries) {
	      this._queryTracker.trackNodeForID(node, recordID, path);
	    }
	  };

	  RelayQueryWriter.prototype.visitRoot = function visitRoot(root, state) {
	    var path = state.path;
	    var recordID = state.recordID;
	    var responseData = state.responseData;

	    var recordState = this._store.getRecordState(recordID);

	    // GraphQL should never return undefined for a field
	    if (responseData == null) {
	      !(responseData !== undefined) ?  true ? invariant(false, 'RelayQueryWriter: Unexpectedly encountered `undefined` in payload. ' + 'Cannot set root record `%s` to undefined.', recordID) : invariant(false) : undefined;
	      this._store.deleteRecord(recordID);
	      if (recordState === RelayRecordState.EXISTENT) {
	        this.recordUpdate(recordID);
	      }
	      return;
	    }
	    !(typeof responseData === 'object' && responseData !== null) ?  true ? invariant(false, 'RelayQueryWriter: Cannot update record `%s`, expected response to be ' + 'an array or object.', recordID) : invariant(false) : undefined;
	    if (recordState !== RelayRecordState.EXISTENT) {
	      var typeName = this.getRecordTypeName(root, recordID, responseData);
	      this._store.putRecord(recordID, typeName, path);
	      this.recordCreate(recordID);
	    }
	    if (this.isNewRecord(recordID) || this._updateTrackedQueries) {
	      this._queryTracker.trackNodeForID(root, recordID, path);
	    }
	    this.traverse(root, state);
	  };

	  RelayQueryWriter.prototype.visitFragment = function visitFragment(fragment, state) {
	    var recordID = state.recordID;

	    if (fragment.isDeferred()) {
	      this._store.setHasDeferredFragmentData(recordID, fragment.getFragmentID());
	      this.recordUpdate(recordID);
	    }
	    // Skip fragments that do not match the record's concrete type. Fragments
	    // cannot be skipped for optimistic writes because optimistically created
	    // records *may* have a default `Node` type.
	    if (this._isOptimisticUpdate || isCompatibleRelayFragmentType(fragment, this._store.getType(recordID))) {
	      var _path = state.path.getPath(fragment, recordID);
	      this.traverse(fragment, _extends({}, state, {
	        path: _path
	      }));
	    }
	  };

	  RelayQueryWriter.prototype.visitField = function visitField(field, state) {
	    var recordID = state.recordID;
	    var responseData = state.responseData;

	    !(this._store.getRecordState(recordID) === RelayRecordState.EXISTENT) ?  true ? invariant(false, 'RelayQueryWriter: Cannot update a non-existent record, `%s`.', recordID) : invariant(false) : undefined;
	    !(typeof responseData === 'object' && responseData !== null) ?  true ? invariant(false, 'RelayQueryWriter: Cannot update record `%s`, expected response to be ' + 'an object.', recordID) : invariant(false) : undefined;

	    // handle missing data
	    var fieldData = responseData[field.getSerializationKey()];
	    if (fieldData === undefined) {
	      return;
	    }
	    if (fieldData === null) {
	      this._store.deleteField(recordID, field.getStorageKey());
	      this.recordUpdate(recordID);
	      return;
	    }

	    if (field.isScalar()) {
	      this._writeScalar(field, state, recordID, fieldData);
	    } else if (field.isConnection()) {
	      this._writeConnection(field, state, recordID, fieldData);
	    } else if (field.isPlural()) {
	      this._writePluralLink(field, state, recordID, fieldData);
	    } else {
	      this._writeLink(field, state, recordID, fieldData);
	    }
	  };

	  /**
	   * Writes the value for a 'scalar' field such as `id` or `name`. The response
	   * data is expected to be scalar values or arrays of scalar values.
	   */

	  RelayQueryWriter.prototype._writeScalar = function _writeScalar(field, state, recordID, nextValue) {
	    var storageKey = field.getStorageKey();
	    var prevValue = this._store.getField(recordID, storageKey);

	    // always update the store to ensure the value is present in the appropriate
	    // data sink (records/queuedRecords), but only record an update if the value
	    // changed.
	    this._store.putField(recordID, storageKey, nextValue);

	    // TODO: Flow: `nextValue` is an array, array indexing should work
	    if (Array.isArray(prevValue) && Array.isArray(nextValue) && prevValue.length === nextValue.length && prevValue.every(function (prev, ii) {
	      return prev === nextValue[ii];
	    })) {
	      return;
	    } else if (prevValue === nextValue) {
	      return;
	    }
	    this.recordUpdate(recordID);
	  };

	  /**
	   * Writes data for connection fields such as `news_feed` or `friends`. The
	   * response data is expected to be array of edge objects.
	   */

	  RelayQueryWriter.prototype._writeConnection = function _writeConnection(field, state, recordID, connectionData) {
	    // Each unique combination of filter calls is stored in its own
	    // generated record (ex: `field.orderby(x)` results are separate from
	    // `field.orderby(y)` results).
	    var storageKey = field.getStorageKey();
	    var connectionID = this._store.getLinkedRecordID(recordID, storageKey) || generateClientID();

	    var connectionRecordState = this._store.getRecordState(connectionID);
	    var hasEdges = !!(field.getFieldByStorageKey(EDGES) || connectionData != null && typeof connectionData === 'object' && connectionData[EDGES]);
	    var path = state.path.getPath(field, connectionID);
	    // always update the store to ensure the value is present in the appropriate
	    // data sink (records/queuedRecords), but only record an update if the value
	    // changed.
	    this._store.putRecord(connectionID, null, path);
	    this._store.putLinkedRecordID(recordID, storageKey, connectionID);
	    // record the create/update only if something changed
	    if (connectionRecordState !== RelayRecordState.EXISTENT) {
	      this.recordUpdate(recordID);
	      this.recordCreate(connectionID);
	    }
	    if (this.isNewRecord(connectionID) || this._updateTrackedQueries) {
	      this._queryTracker.trackNodeForID(field, connectionID, path);
	    }

	    // Only create a range if `edges` field is present
	    // Overwrite an existing range only if the new force index is greater
	    if (hasEdges && (!this._store.hasRange(connectionID) || this._forceIndex && this._forceIndex > this._store.getRangeForceIndex(connectionID))) {
	      this._store.putRange(connectionID, field.getCallsWithValues(), this._forceIndex);
	      this.recordUpdate(connectionID);
	    }

	    var connectionState = {
	      nodeID: null,
	      path: path,
	      recordID: connectionID,
	      responseData: connectionData
	    };
	    this._traverseConnection(field, field, connectionState);
	  };

	  /**
	   * Recurse through connection subfields and write their results. This is
	   * necessary because handling an `edges` field also requires information about
	   * the parent connection field (see `_writeEdges`).
	   */

	  RelayQueryWriter.prototype._traverseConnection = function _traverseConnection(connection, // the parent connection
	  node, // the parent connection or an intermediary fragment
	  state) {
	    var _this2 = this;

	    node.getChildren().forEach(function (child) {
	      if (child instanceof RelayQuery.Field) {
	        if (child.getSchemaName() === EDGES) {
	          _this2._writeEdges(connection, child, state);
	        } else if (child.getSchemaName() !== PAGE_INFO) {
	          // Page info is handled by the range
	          // Otherwise, write metadata fields normally (ex: `count`)
	          _this2.visit(child, state);
	        }
	      } else {
	        // Fragment case, recurse keeping track of parent connection
	        _this2._traverseConnection(connection, child, state);
	      }
	    });
	  };

	  /**
	   * Update a connection with newly fetched edges.
	   */

	  RelayQueryWriter.prototype._writeEdges = function _writeEdges(connection, edges, state) {
	    var _this3 = this;

	    var connectionID = state.recordID;
	    var connectionData = state.responseData;

	    !(typeof connectionData === 'object' && connectionData !== null) ?  true ? invariant(false, 'RelayQueryWriter: Cannot write edges for malformed connection `%s` on ' + 'record `%s`, expected the response to be an object.', connection.getDebugName(), connectionID) : invariant(false) : undefined;
	    var edgesData = connectionData[EDGES];

	    // Validate response data.
	    if (edgesData == null) {
	       true ? warning(false, 'RelayQueryWriter: Cannot write edges for connection `%s` on record ' + '`%s`, expected a response for field `edges`.', connection.getDebugName(), connectionID) : undefined;
	      return;
	    }
	    !Array.isArray(edgesData) ?  true ? invariant(false, 'RelayQueryWriter: Cannot write edges for connection `%s` on record ' + '`%s`, expected `edges` to be an array.', connection.getDebugName(), connectionID) : invariant(false) : undefined;

	    var rangeCalls = connection.getCallsWithValues();
	    !RelayConnectionInterface.hasRangeCalls(rangeCalls) ?  true ? invariant(false, 'RelayQueryWriter: Cannot write edges for connection `%s` on record ' + '`%s` without `first`, `last`, or `find` argument.', connection.getDebugName(), connectionID) : invariant(false) : undefined;
	    var rangeInfo = this._store.getRangeMetadata(connectionID, rangeCalls);
	    !rangeInfo ?  true ? invariant(false, 'RelayQueryWriter: Expected a range to exist for connection field `%s` ' + 'on record `%s`.', connection.getDebugName(), connectionID) : invariant(false) : undefined;
	    var fetchedEdgeIDs = [];
	    var filteredEdges = rangeInfo.filteredEdges;
	    var isUpdate = false;
	    var nextIndex = 0;
	    // Traverse connection edges, reusing existing edges if they exist
	    edgesData.forEach(function (edgeData) {
	      // validate response data
	      if (edgeData == null) {
	        return;
	      }
	      !(typeof edgeData === 'object' && edgeData) ?  true ? invariant(false, 'RelayQueryWriter: Cannot write edge for connection field `%s` on ' + 'record `%s`, expected an object.', connection.getDebugName(), connectionID) : invariant(false) : undefined;

	      var nodeData = edgeData[NODE];
	      if (nodeData == null) {
	        return;
	      }

	      !(typeof nodeData === 'object') ?  true ? invariant(false, 'RelayQueryWriter: Expected node to be an object for field `%s` on ' + 'record `%s`.', connection.getDebugName(), connectionID) : invariant(false) : undefined;

	      // For consistency, edge IDs are calculated from the connection & node ID.
	      // A node ID is only generated if the node does not have an id and
	      // there is no existing edge.
	      var prevEdge = filteredEdges[nextIndex++];
	      var nodeID = nodeData && nodeData[ID] || prevEdge && _this3._store.getLinkedRecordID(prevEdge.edgeID, NODE) || generateClientID();
	      // TODO: Flow: `nodeID` is `string`
	      var edgeID = generateClientEdgeID(connectionID, nodeID);
	      var path = state.path.getPath(edges, edgeID);
	      _this3.createRecordIfMissing(edges, edgeID, null, path);
	      fetchedEdgeIDs.push(edgeID);

	      // Write data for the edge, using `nodeID` as the id for direct descendant
	      // `node` fields. This is necessary for `node`s that do not have an `id`,
	      // which would cause the generated ID here to not match the ID generated
	      // in `_writeLink`.
	      _this3.traverse(edges, {
	        nodeID: nodeID,
	        path: path,
	        recordID: edgeID,
	        responseData: edgeData
	      });
	      isUpdate = isUpdate || _this3.hasChangeToRecord(edgeID);
	    });

	    var pageInfo = connectionData[PAGE_INFO] || RelayConnectionInterface.getDefaultPageInfo();
	    this._store.putRangeEdges(connectionID, rangeCalls, pageInfo, fetchedEdgeIDs);

	    // Only broadcast an update to the range if an edge was added/changed.
	    // Node-level changes will broadcast at the node ID.
	    if (isUpdate) {
	      this.recordUpdate(connectionID);
	    }
	  };

	  /**
	   * Writes a plural linked field such as `actors`. The response data is
	   * expected to be an array of item objects. These fields are similar to
	   * connections, but do not support range calls such as `first` or `after`.
	   */

	  RelayQueryWriter.prototype._writePluralLink = function _writePluralLink(field, state, recordID, fieldData) {
	    var _this4 = this;

	    var storageKey = field.getStorageKey();
	    !Array.isArray(fieldData) ?  true ? invariant(false, 'RelayQueryWriter: Expected array data for field `%s` on record `%s`.', field.getDebugName(), recordID) : invariant(false) : undefined;

	    var prevLinkedIDs = this._store.getLinkedRecordIDs(recordID, storageKey);
	    var nextLinkedIDs = [];
	    var isUpdate = !prevLinkedIDs;
	    var nextIndex = 0;
	    fieldData.forEach(function (nextRecord) {
	      // validate response data
	      if (nextRecord == null) {
	        return;
	      }
	      !(typeof nextRecord === 'object' && nextRecord) ?  true ? invariant(false, 'RelayQueryWriter: Expected elements for plural field `%s` to be ' + 'objects.', storageKey) : invariant(false) : undefined;

	      // Reuse existing generated IDs if the node does not have its own `id`.
	      // TODO: Flow: `nextRecord` is asserted as typeof === 'object'
	      var prevLinkedID = prevLinkedIDs && prevLinkedIDs[nextIndex];
	      var nextLinkedID = nextRecord[ID] || prevLinkedID || generateClientID();
	      nextLinkedIDs.push(nextLinkedID);

	      var path = state.path.getPath(field, nextLinkedID);
	      var typeName = _this4.getRecordTypeName(field, nextLinkedID, nextRecord);
	      _this4.createRecordIfMissing(field, nextLinkedID, typeName, path);
	      isUpdate = isUpdate || nextLinkedID !== prevLinkedID || _this4.isNewRecord(nextLinkedID);

	      _this4.traverse(field, {
	        nodeID: null, // never propagate `nodeID` past the first linked field
	        path: path,
	        recordID: nextLinkedID,
	        responseData: nextRecord
	      });
	      isUpdate = isUpdate || _this4.hasChangeToRecord(nextLinkedID);
	      nextIndex++;
	    });

	    this._store.putLinkedRecordIDs(recordID, storageKey, nextLinkedIDs);

	    // Check if length has changed
	    isUpdate = isUpdate || !prevLinkedIDs || prevLinkedIDs.length !== nextLinkedIDs.length;

	    // Only broadcast a list-level change if a record was changed/added
	    if (isUpdate) {
	      this.recordUpdate(recordID);
	    }
	  };

	  /**
	   * Writes a link from one record to another, for example linking the `viewer`
	   * record to the `actor` record in the query `viewer { actor }`. The `field`
	   * variable is the field being linked (`actor` in the example).
	   */

	  RelayQueryWriter.prototype._writeLink = function _writeLink(field, state, recordID, fieldData) {
	    var nodeID = state.nodeID;

	    var storageKey = field.getStorageKey();
	    !(typeof fieldData === 'object' && fieldData !== null) ?  true ? invariant(false, 'RelayQueryWriter: Expected data for non-scalar field `%s` on record ' + '`%s` to be an object.', field.getDebugName(), recordID) : invariant(false) : undefined;

	    // Prefer the actual `id` if present, otherwise generate one (if an id
	    // was already generated it is reused). `node`s within a connection are
	    // a special case as the ID used here must match the one generated prior to
	    // storing the parent `edge`.
	    // TODO: Flow: `fieldData` is asserted as typeof === 'object'
	    var prevLinkedID = this._store.getLinkedRecordID(recordID, storageKey);
	    var nextLinkedID = field.getSchemaName() === NODE && nodeID || fieldData[ID] || prevLinkedID || generateClientID();

	    var path = state.path.getPath(field, nextLinkedID);
	    var typeName = this.getRecordTypeName(field, nextLinkedID, fieldData);
	    this.createRecordIfMissing(field, nextLinkedID, typeName, path);
	    // always update the store to ensure the value is present in the appropriate
	    // data sink (record/queuedRecords), but only record an update if the value
	    // changed.
	    this._store.putLinkedRecordID(recordID, storageKey, nextLinkedID);
	    if (prevLinkedID !== nextLinkedID || this.isNewRecord(nextLinkedID)) {
	      this.recordUpdate(recordID);
	    }

	    this.traverse(field, {
	      nodeID: null,
	      path: path,
	      recordID: nextLinkedID,
	      responseData: fieldData
	    });
	  };

	  return RelayQueryWriter;
	})(RelayQueryVisitor);

	module.exports = RelayQueryWriter;

/***/ },
/* 137 */
/***/ function(module, exports) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule RelayRecordStatusMap
	 * 
	 * @typechecks
	 */

	'use strict';
	/**
	 * Record might contain data from optimistic update.
	 */
	var OPTIMISTIC_MASK = 0x01;
	/**
	 * Record was part of a mutation that resulted in an error.
	 */
	var ERROR_MASK = 0x02;

	function set(status, value, mask) {
	  status = status || 0;
	  if (value) {
	    return status | mask;
	  } else {
	    return status & ~mask;
	  }
	}

	function check(status, mask) {
	  return ((status || 0) & mask) != 0;
	}
	/**
	 * A set of functions for modifying `__status__` on records inside of
	 * RelayStore.
	 */
	var RelayRecordStatusMap = {
	  setOptimisticStatus: function setOptimisticStatus(status, value) {
	    return set(status, value, OPTIMISTIC_MASK);
	  },

	  isOptimisticStatus: function isOptimisticStatus(status) {
	    return check(status, OPTIMISTIC_MASK);
	  },

	  setErrorStatus: function setErrorStatus(status, value) {
	    return set(status, value, ERROR_MASK);
	  },

	  isErrorStatus: function isErrorStatus(status) {
	    return check(status, ERROR_MASK);
	  }
	};

	module.exports = RelayRecordStatusMap;

/***/ },
/* 138 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule RelayRecordStore
	 * 
	 * @typechecks
	 */

	'use strict';

	var _classCallCheck = __webpack_require__(1)['default'];

	var _Object$keys = __webpack_require__(10)['default'];

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	var GraphQLMutatorConstants = __webpack_require__(50);
	var GraphQLRange = __webpack_require__(74);
	var GraphQLStoreDataHandler = __webpack_require__(6);
	var RelayConnectionInterface = __webpack_require__(7);

	var RelayNodeInterface = __webpack_require__(12);

	var RelayRecordStatusMap = __webpack_require__(137);

	var forEachObject = __webpack_require__(9);
	var invariant = __webpack_require__(2);
	var warning = __webpack_require__(11);

	var CURSOR = RelayConnectionInterface.CURSOR;
	var NODE = RelayConnectionInterface.NODE;

	var EMPTY = '';
	var FILTER_CALLS = '__filterCalls__';
	var FORCE_INDEX = '__forceIndex__';
	var RANGE = '__range__';
	var RESOLVED_FRAGMENT_MAP = '__resolvedFragmentMap__';
	var RESOLVED_FRAGMENT_MAP_GENERATION = '__resolvedFragmentMapGeneration__';
	var PATH = '__path__';
	var APPEND = GraphQLMutatorConstants.APPEND;
	var PREPEND = GraphQLMutatorConstants.PREPEND;
	var REMOVE = GraphQLMutatorConstants.REMOVE;

	/**
	 * @internal
	 *
	 * `RelayRecordStore` is the central repository for all data fetched by the
	 * client. Data is stored as a map of IDs to Records. Records are maps of
	 * field names to values.
	 *
	 * TODO: #6584253 Mediate access to node/cached/queued data via RelayRecordStore
	 */

	var RelayRecordStore = (function () {
	  function RelayRecordStore(records, rootCallMaps, nodeConnectionMap, cacheWriter, clientMutationID) {
	    _classCallCheck(this, RelayRecordStore);

	    this._cacheWriter = cacheWriter;
	    this._cachedRecords = records.cachedRecords;
	    this._cachedRootCallMap = rootCallMaps && rootCallMaps.cachedRootCallMap || {};
	    this._clientMutationID = clientMutationID;
	    this._queuedRecords = records.queuedRecords;
	    this._nodeConnectionMap = nodeConnectionMap || {};
	    this._records = records.records;
	    this._rootCallMap = rootCallMaps && rootCallMaps.rootCallMap || {};
	    this._storage = [];
	    if (this._queuedRecords) {
	      this._storage.push(this._queuedRecords);
	    }
	    if (this._records) {
	      this._storage.push(this._records);
	    }
	    if (this._cachedRecords) {
	      this._storage.push(this._cachedRecords);
	    }
	  }

	  /**
	   * Filter calls to only those that specify conditions on the returned results
	   * (ex: `orderby(TOP_STORIES)`), removing generic calls (ex: `first`, `find`).
	   */

	  /**
	   * Get the data ID associated with a storage key (and optionally an
	   * identifying argument value) for a root query.
	   */

	  RelayRecordStore.prototype.getDataID = function getDataID(storageKey, identifyingArgValue) {
	    if (RelayNodeInterface.isNodeRootCall(storageKey)) {
	      !(identifyingArgValue != null) ?  true ? invariant(false, 'RelayRecordStore.getDataID(): Argument to `%s()` ' + 'cannot be null or undefined.', storageKey) : invariant(false) : undefined;
	      return identifyingArgValue;
	    }
	    if (identifyingArgValue == null) {
	      identifyingArgValue = EMPTY;
	    }
	    if (this._rootCallMap.hasOwnProperty(storageKey) && this._rootCallMap[storageKey].hasOwnProperty(identifyingArgValue)) {
	      return this._rootCallMap[storageKey][identifyingArgValue];
	    } else if (this._cachedRootCallMap.hasOwnProperty(storageKey)) {
	      return this._cachedRootCallMap[storageKey][identifyingArgValue];
	    }
	  };

	  /**
	   * Associate a data ID with a storage key (and optionally an identifying
	   * argument value) for a root query.
	   */

	  RelayRecordStore.prototype.putDataID = function putDataID(storageKey, identifyingArgValue, dataID) {
	    if (RelayNodeInterface.isNodeRootCall(storageKey)) {
	      !(identifyingArgValue != null) ?  true ? invariant(false, 'RelayRecordStore.putDataID(): Argument to `%s()` ' + 'cannot be null or undefined.', storageKey) : invariant(false) : undefined;
	      return;
	    }
	    if (identifyingArgValue == null) {
	      identifyingArgValue = EMPTY;
	    }
	    this._rootCallMap[storageKey] = this._rootCallMap[storageKey] || {};
	    this._rootCallMap[storageKey][identifyingArgValue] = dataID;
	    if (this._cacheWriter) {
	      this._cacheWriter.writeRootCall(storageKey, identifyingArgValue, dataID);
	    }
	  };

	  /**
	   * Returns the status of the record stored at `dataID`.
	   */

	  RelayRecordStore.prototype.getRecordState = function getRecordState(dataID) {
	    var record = this._getRecord(dataID);
	    if (record === null) {
	      return 'NONEXISTENT';
	    } else if (record === undefined) {
	      return 'UNKNOWN';
	    }
	    return 'EXISTENT';
	  };

	  /**
	   * Create an empty record at `dataID` if a record does not already exist.
	   */

	  RelayRecordStore.prototype.putRecord = function putRecord(dataID, typeName, path) {
	    var target = this._queuedRecords || this._records;
	    var prevRecord = target[dataID];
	    if (prevRecord) {
	      if (target === this._queuedRecords) {
	        this._setClientMutationID(prevRecord);
	      }
	      return;
	    }
	    var nextRecord = {
	      __dataID__: dataID,
	      __typename: typeName
	    };
	    if (target === this._queuedRecords) {
	      this._setClientMutationID(nextRecord);
	    }
	    if (GraphQLStoreDataHandler.isClientID(dataID)) {
	      !path ?  true ? invariant(false, 'RelayRecordStore.putRecord(): Expected a path for non-refetchable ' + 'record `%s`.', dataID) : invariant(false) : undefined;
	      nextRecord[PATH] = path;
	    }
	    target[dataID] = nextRecord;
	    var cacheWriter = this._cacheWriter;
	    if (!this._queuedRecords && cacheWriter) {
	      cacheWriter.writeField(dataID, '__dataID__', dataID, typeName);
	    }
	  };

	  /**
	   * Returns the path to a non-refetchable record.
	   */

	  RelayRecordStore.prototype.getPathToRecord = function getPathToRecord(dataID) {
	    var path = this._getField(dataID, PATH);
	    return path;
	  };

	  /**
	   * Returns whether a given record is affected by an optimistic update.
	   */

	  RelayRecordStore.prototype.hasOptimisticUpdate = function hasOptimisticUpdate(dataID) {
	    !this._queuedRecords ?  true ? invariant(false, 'RelayRecordStore.hasOptimisticUpdate(): Optimistic updates require ' + 'queued records.') : invariant(false) : undefined;
	    return this._queuedRecords.hasOwnProperty(dataID);
	  };

	  /**
	   * Returns a list of client mutation IDs for queued mutations whose optimistic
	   * updates are affecting the record corresponding the given dataID. Returns
	   * null if the record isn't affected by any optimistic updates.
	   */

	  RelayRecordStore.prototype.getClientMutationIDs = function getClientMutationIDs(dataID) {
	    !this._queuedRecords ?  true ? invariant(false, 'RelayRecordStore.getClientMutationIDs(): Optimistic updates require ' + 'queued records.') : invariant(false) : undefined;
	    var record = this._queuedRecords[dataID];
	    return record ? record.__mutationIDs__ : null;
	  };

	  /**
	   * Returns whether an error occurred during a mutation affecting the
	   * given (queued) record.
	   */

	  RelayRecordStore.prototype.hasMutationError = function hasMutationError(dataID) {
	    if (this._queuedRecords) {
	      var record = this._queuedRecords[dataID];
	      return !!(record && RelayRecordStatusMap.isErrorStatus(record.__status__));
	    }
	    return false;
	  };

	  /**
	   * Sets the mutation status of a queued record to the given value.
	   */

	  RelayRecordStore.prototype.setMutationErrorStatus = function setMutationErrorStatus(dataID, hasError) {
	    !this._queuedRecords ?  true ? invariant(false, 'RelayRecordStore.setMutationErrorStatus(): Can only set the ' + 'mutation status of queued records.') : invariant(false) : undefined;
	    var record = this._queuedRecords[dataID];
	    !record ?  true ? invariant(false, 'RelayRecordStore.setMutationErrorStatus(): Expected record `%s` to ' + 'exist before settings its mutation error status.', dataID) : invariant(false) : undefined;
	    record.__status__ = RelayRecordStatusMap.setErrorStatus(record.__status__, hasError);
	  };

	  /**
	   * Check whether a given record has received data for a deferred fragment.
	   */

	  RelayRecordStore.prototype.hasDeferredFragmentData = function hasDeferredFragmentData(dataID, fragmentID) {
	    var resolvedFragmentMap = this._getField(dataID, RESOLVED_FRAGMENT_MAP);
	    !(typeof resolvedFragmentMap === 'object' || resolvedFragmentMap == null) ?  true ? invariant(false, 'RelayRecordStore.hasDeferredFragmentData(): Expected the map of ' + 'resolved deferred fragments associated with record `%s` to be null or ' + 'an object. Found a(n) `%s`.', dataID, typeof resolvedFragmentMap) : invariant(false) : undefined;
	    return !!(resolvedFragmentMap && resolvedFragmentMap[fragmentID]);
	  };

	  /**
	   * Mark a given record as having received data for a deferred fragment.
	   */

	  RelayRecordStore.prototype.setHasDeferredFragmentData = function setHasDeferredFragmentData(dataID, fragmentID) {
	    var record = this._getRecord(dataID);
	    !record ?  true ? invariant(false, 'RelayRecordStore.setHasDeferredFragmentData(): Expected record `%s` ' + 'to exist before marking it as having received data for the deferred ' + 'fragment with id `%s`.', dataID, fragmentID) : invariant(false) : undefined;
	    var resolvedFragmentMap = record[RESOLVED_FRAGMENT_MAP];
	    if (typeof resolvedFragmentMap !== 'object' || !resolvedFragmentMap) {
	      resolvedFragmentMap = {};
	    }
	    resolvedFragmentMap[fragmentID] = true;
	    record[RESOLVED_FRAGMENT_MAP] = resolvedFragmentMap;
	    if (typeof record[RESOLVED_FRAGMENT_MAP_GENERATION] === 'number') {
	      record[RESOLVED_FRAGMENT_MAP_GENERATION]++;
	    } else {
	      record[RESOLVED_FRAGMENT_MAP_GENERATION] = 0;
	    }
	  };

	  /**
	   * Delete the record at `dataID`, setting its value to `null`.
	   */

	  RelayRecordStore.prototype.deleteRecord = function deleteRecord(dataID) {
	    var target = this._queuedRecords || this._records;
	    target[dataID] = null;

	    // Remove any links for this record
	    if (!this._queuedRecords) {
	      delete this._nodeConnectionMap[dataID];
	      if (this._cacheWriter) {
	        this._cacheWriter.writeNode(dataID, null);
	      }
	    }
	  };

	  RelayRecordStore.prototype.getType = function getType(dataID) {
	    // `__typename` property is typed as `string`
	    return this._getField(dataID, '__typename');
	  };

	  /**
	   * Returns the value of the field for the given dataID.
	   */

	  RelayRecordStore.prototype.getField = function getField(dataID, storageKey) {
	    return this._getField(dataID, storageKey);
	  };

	  /**
	   * Sets the value of a scalar field.
	   */

	  RelayRecordStore.prototype.putField = function putField(dataID, storageKey, value) {
	    var record = this._getRecordForWrite(dataID);
	    !record ?  true ? invariant(false, 'RelayRecordStore.putField(): Expected record `%s` to exist before ' + 'writing field `%s`.', dataID, storageKey) : invariant(false) : undefined;
	    record[storageKey] = value;
	    if (!this._queuedRecords && this._cacheWriter) {
	      var typeName = record.__typename;
	      this._cacheWriter.writeField(dataID, storageKey, value, typeName);
	    }
	  };

	  /**
	   * Clears the value of a field by setting it to null/undefined.
	   */

	  RelayRecordStore.prototype.deleteField = function deleteField(dataID, storageKey) {
	    var record = this._getRecordForWrite(dataID);
	    !record ?  true ? invariant(false, 'RelayRecordStore.deleteField(): Expected record `%s` to exist before ' + 'deleting field `%s`.', dataID, storageKey) : invariant(false) : undefined;
	    record[storageKey] = null;
	    if (!this._queuedRecords && this._cacheWriter) {
	      this._cacheWriter.writeField(dataID, storageKey, null);
	    }
	  };

	  /**
	   * Returns the Data ID of a linked record (eg the ID of the `address` record
	   * in `actor{address}`).
	   */

	  RelayRecordStore.prototype.getLinkedRecordID = function getLinkedRecordID(dataID, storageKey) {
	    var field = this._getField(dataID, storageKey);
	    if (field == null) {
	      return field;
	    }
	    !(typeof field === 'object' && field !== null && !Array.isArray(field)) ?  true ? invariant(false, 'RelayRecordStore.getLinkedRecordID(): Expected field `%s` for record ' + '`%s` to have a linked record.', storageKey, dataID) : invariant(false) : undefined;
	    return field.__dataID__;
	  };

	  /**
	   * Creates/updates a link between two records via the given field.
	   */

	  RelayRecordStore.prototype.putLinkedRecordID = function putLinkedRecordID(parentID, storageKey, recordID) {
	    var parent = this._getRecordForWrite(parentID);
	    !parent ?  true ? invariant(false, 'RelayRecordStore.putLinkedRecordID(): Expected record `%s` to exist ' + 'before linking to record `%s`.', parentID, recordID) : invariant(false) : undefined;
	    var record = this._getRecord(recordID);
	    !record ?  true ? invariant(false, 'RelayRecordStore.putLinkedRecordID(): Expected record `%s` to exist ' + 'before linking from record `%s`.', recordID, parentID) : invariant(false) : undefined;
	    var fieldValue = {
	      __dataID__: recordID
	    };
	    parent[storageKey] = fieldValue;
	    if (!this._queuedRecords && this._cacheWriter) {
	      this._cacheWriter.writeField(parentID, storageKey, fieldValue);
	    }
	  };

	  /**
	   * Returns an array of Data ID for a plural linked field (eg the actor IDs of
	   * the `likers` in `story{likers}`).
	   */

	  RelayRecordStore.prototype.getLinkedRecordIDs = function getLinkedRecordIDs(dataID, storageKey) {
	    var field = this._getField(dataID, storageKey);
	    if (field == null) {
	      return field;
	    }
	    !Array.isArray(field) ?  true ? invariant(false, 'RelayRecordStore.getLinkedRecordIDs(): Expected field `%s` for ' + 'record `%s` to have an array of linked records.', storageKey, dataID) : invariant(false) : undefined;
	    return field.map(function (item, ii) {
	      !(typeof item === 'object' && item.__dataID__) ?  true ? invariant(false, 'RelayRecordStore.getLinkedRecordIDs(): Expected element at index %s ' + 'in field `%s` for record `%s` to be a linked record.', ii, storageKey, dataID) : invariant(false) : undefined;
	      return item.__dataID__;
	    });
	  };

	  /**
	   * Creates/updates a one-to-many link between records via the given field.
	   */

	  RelayRecordStore.prototype.putLinkedRecordIDs = function putLinkedRecordIDs(parentID, storageKey, recordIDs) {
	    var _this = this;

	    var parent = this._getRecordForWrite(parentID);
	    !parent ?  true ? invariant(false, 'RelayRecordStore.putLinkedRecordIDs(): Expected record `%s` to exist ' + 'before linking records.', parentID) : invariant(false) : undefined;
	    var records = recordIDs.map(function (recordID) {
	      var record = _this._getRecord(recordID);
	      !record ?  true ? invariant(false, 'RelayRecordStore.putLinkedRecordIDs(): Expected record `%s` to ' + 'exist before linking from `%s`.', recordID, parentID) : invariant(false) : undefined;
	      return {
	        __dataID__: recordID
	      };
	    });
	    parent[storageKey] = records;
	    if (!this._queuedRecords && this._cacheWriter) {
	      this._cacheWriter.writeField(parentID, storageKey, records);
	    }
	  };

	  /**
	   * Gets the connectionIDs for all the connections that contain the given
	   * record as a `node`, or null if the record does not appear as a `node` in
	   * any connection.
	   */

	  RelayRecordStore.prototype.getConnectionIDsForRecord = function getConnectionIDsForRecord(dataID) {
	    var connectionIDs = this._nodeConnectionMap[dataID];
	    if (connectionIDs) {
	      return _Object$keys(connectionIDs);
	    }
	    return null;
	  };

	  /**
	   * Gets the connectionIDs for all variations of calls for the given base
	   * schema name (Ex: `posts.orderby(recent)` and `posts.orderby(likes)`).
	   */

	  RelayRecordStore.prototype.getConnectionIDsForField = function getConnectionIDsForField(dataID, schemaName) {
	    // ignore queued records because not all range fields may be present there
	    var record = this._records[dataID];
	    if (record == null) {
	      return record;
	    }
	    var connectionIDs;
	    forEachObject(record, function (datum, key) {
	      if (datum && getFieldNameFromKey(key) === schemaName) {
	        var dataID = datum.__dataID__;
	        if (dataID) {
	          connectionIDs = connectionIDs || [];
	          connectionIDs.push(dataID);
	        }
	      }
	    });
	    return connectionIDs;
	  };

	  /**
	   * Get the force index associated with the range at `connectionID`.
	   */

	  RelayRecordStore.prototype.getRangeForceIndex = function getRangeForceIndex(connectionID) {
	    var forceIndex = this._getField(connectionID, FORCE_INDEX);
	    if (forceIndex === null) {
	      return -1;
	    }
	    // __forceIndex__ can only be a number
	    return forceIndex || 0;
	  };

	  /**
	   * Get the condition calls that were used to fetch the given connection.
	   * Ex: for a field `photos.orderby(recent)`, this would be
	   * [{name: 'orderby', value: 'recent'}]
	   */

	  RelayRecordStore.prototype.getRangeFilterCalls = function getRangeFilterCalls(connectionID) {
	    return this._getField(connectionID, FILTER_CALLS);
	  };

	  /**
	   * Returns range information for the given connection field:
	   * - `filteredEdges`: any edges already fetched for the given `calls`.
	   * - `diffCalls`: an array of calls describing the difference
	   *   between the given `calls` and already fetched data. Includes conditional
	   *   calls (`orderby`) and range/offset calls (`first`, `after`).
	   * - `filterCalls`: the subset of `calls` that are condition calls
	   *   (`orderby`).
	   */

	  RelayRecordStore.prototype.getRangeMetadata = function getRangeMetadata(connectionID, calls) {
	    var _this2 = this;

	    if (connectionID == null) {
	      return connectionID;
	    }
	    var range = this._getField(connectionID, RANGE);
	    if (range == null) {
	      if (range === null) {
	         true ? warning(false, 'RelayRecordStore.getRangeMetadata(): Expected range to exist if ' + '`edges` has been fetched.') : undefined;
	      }
	      return undefined;
	    }
	    var filterCalls = getFilterCalls(calls);
	    // Edges can only be fetched if a range call (first/last/find) is given.
	    // Otherwise return diffCalls/filterCalls with empty edges.
	    if (calls.length === filterCalls.length) {
	      return {
	        diffCalls: calls,
	        filterCalls: filterCalls,
	        pageInfo: undefined,
	        requestedEdgeIDs: [],
	        filteredEdges: []
	      };
	    }
	    var queuedRecord = this._queuedRecords ? this._queuedRecords[connectionID] : null;

	    var _range$retrieveRangeInfoForQuery = range.retrieveRangeInfoForQuery(calls, queuedRecord);

	    var diffCalls = _range$retrieveRangeInfoForQuery.diffCalls;
	    var pageInfo = _range$retrieveRangeInfoForQuery.pageInfo;
	    var requestedEdgeIDs = _range$retrieveRangeInfoForQuery.requestedEdgeIDs;

	    if (diffCalls && diffCalls.length) {
	      diffCalls = filterCalls.concat(diffCalls);
	    } else {
	      diffCalls = [];
	    }
	    var filteredEdges;
	    if (requestedEdgeIDs) {
	      filteredEdges = requestedEdgeIDs.map(function (edgeID) {
	        return {
	          edgeID: edgeID,
	          nodeID: _this2.getLinkedRecordID(edgeID, NODE)
	        };
	      }).filter(function (edge) {
	        return _this2._getRecord(edge.nodeID);
	      });
	    } else {
	      filteredEdges = [];
	    }
	    return {
	      diffCalls: diffCalls,
	      filterCalls: filterCalls,
	      pageInfo: pageInfo,
	      requestedEdgeIDs: requestedEdgeIDs,
	      filteredEdges: filteredEdges
	    };
	  };

	  /**
	   * Creates a range at `dataID` with an optional `forceIndex`.
	   */

	  RelayRecordStore.prototype.putRange = function putRange(connectionID, calls, forceIndex) {
	    !!this._queuedRecords ?  true ? invariant(false, 'RelayRecordStore.putRange(): Cannot create a queued range.') : invariant(false) : undefined;
	    var record = this._getRecord(connectionID);
	    !record ?  true ? invariant(false, 'RelayRecordStore.putRange(): Expected record `%s` to exist before ' + 'adding a range.', connectionID) : invariant(false) : undefined;
	    var range = new GraphQLRange();
	    var filterCalls = getFilterCalls(calls);
	    forceIndex = forceIndex || 0;
	    record.__filterCalls__ = filterCalls;
	    record.__forceIndex__ = forceIndex;
	    record.__range__ = range;

	    var cacheWriter = this._cacheWriter;
	    if (!this._queuedRecords && cacheWriter) {
	      cacheWriter.writeField(connectionID, FILTER_CALLS, filterCalls);
	      cacheWriter.writeField(connectionID, FORCE_INDEX, forceIndex);
	      cacheWriter.writeField(connectionID, RANGE, range);
	    }
	  };

	  /**
	   * Returns whether there is a range at `connectionID`.
	   */

	  RelayRecordStore.prototype.hasRange = function hasRange(connectionID) {
	    return !!this._getField(connectionID, RANGE);
	  };

	  /**
	   * Adds newly fetched edges to a range.
	   */

	  RelayRecordStore.prototype.putRangeEdges = function putRangeEdges(connectionID, calls, pageInfo, edges) {
	    var _this3 = this;

	    var range = this._getField(connectionID, RANGE);
	    !range ?  true ? invariant(false, 'RelayRecordStore.putRangeEdges(): Expected record `%s` to exist and ' + 'have a range.', connectionID) : invariant(false) : undefined;
	    var edgesData = [];
	    edges.forEach(function (edgeID) {
	      var edgeData = _this3._getRangeEdgeData(edgeID);
	      edgesData.push(edgeData);
	      _this3._addConnectionForNode(connectionID, edgeData.node.__dataID__);
	    });
	    range.addItems(calls, edgesData, pageInfo);
	    if (!this._queuedRecords && this._cacheWriter) {
	      this._cacheWriter.writeField(connectionID, RANGE, range);
	    }
	  };

	  /**
	   * Prepend, append, or delete edges to/from a range.
	   */

	  RelayRecordStore.prototype.applyRangeUpdate = function applyRangeUpdate(connectionID, edgeID, operation) {
	    if (this._queuedRecords) {
	      this._applyOptimisticRangeUpdate(connectionID, edgeID, operation);
	    } else {
	      this._applyServerRangeUpdate(connectionID, edgeID, operation);
	    }
	  };

	  /**
	   * Completely removes the record identified by `dataID` from the store
	   */

	  RelayRecordStore.prototype.removeRecord = function removeRecord(dataID) {
	    delete this._records[dataID];
	    if (this._queuedRecords) {
	      delete this._queuedRecords[dataID];
	    }
	    if (this._cachedRecords) {
	      delete this._cachedRecords[dataID];
	    }
	    delete this._nodeConnectionMap[dataID];
	  };

	  /**
	   * Get edge data in a format compatibile with `GraphQLRange`.
	   * TODO: change `GraphQLRange` to accept `(edgeID, cursor, nodeID)` tuple
	   */

	  RelayRecordStore.prototype._getRangeEdgeData = function _getRangeEdgeData(edgeID) {
	    var nodeID = this.getLinkedRecordID(edgeID, NODE);
	    !nodeID ?  true ? invariant(false, 'RelayRecordStore: Expected edge `%s` to have a `node` record.', edgeID) : invariant(false) : undefined;
	    return {
	      __dataID__: edgeID,
	      cursor: this.getField(edgeID, CURSOR),
	      node: {
	        __dataID__: nodeID
	      }
	    };
	  };

	  RelayRecordStore.prototype._applyOptimisticRangeUpdate = function _applyOptimisticRangeUpdate(connectionID, edgeID, operation) {
	    !this._queuedRecords ?  true ? invariant(false, 'RelayRecordStore: Expected queued records to exist for optimistic ' + '`%s` update to record `%s`.', operation, connectionID) : invariant(false) : undefined;
	    var record = this._queuedRecords[connectionID];
	    if (!record) {
	      // $FlowIssue: this fails with:
	      // "property `append/prepend/remove` not found in object literal"
	      record = { __dataID__: connectionID };
	      this._queuedRecords[connectionID] = record;
	    }
	    this._setClientMutationID(record);
	    var queue = record[operation];
	    if (!queue) {
	      queue = [];
	      record[operation] = queue;
	    }
	    if (operation === PREPEND) {
	      queue.unshift(edgeID);
	    } else {
	      queue.push(edgeID);
	    }
	  };

	  RelayRecordStore.prototype._applyServerRangeUpdate = function _applyServerRangeUpdate(connectionID, edgeID, operation) {
	    !this._records ?  true ? invariant(false, 'RelayRecordStore: Expected base records to exist for `%s` update to ' + 'record `%s`.', operation, connectionID) : invariant(false) : undefined;
	    var range = this._getField(connectionID, RANGE);
	    !range ?  true ? invariant(false, 'RelayRecordStore: Cannot apply `%s` update to non-existent record `%s`.', operation, connectionID) : invariant(false) : undefined;
	    if (operation === REMOVE) {
	      range.removeEdgeWithID(edgeID);
	      var nodeID = this.getLinkedRecordID(edgeID, 'node');
	      if (nodeID) {
	        this._removeConnectionForNode(connectionID, nodeID);
	      }
	    } else {
	      var edgeData = this._getRangeEdgeData(edgeID);
	      this._addConnectionForNode(connectionID, edgeData.node.__dataID__);
	      if (operation === APPEND) {
	        range.appendEdge(this._getRangeEdgeData(edgeID));
	      } else {
	        // prepend
	        range.prependEdge(this._getRangeEdgeData(edgeID));
	      }
	    }
	    if (this._cacheWriter) {
	      this._cacheWriter.writeField(connectionID, RANGE, range);
	    }
	  };

	  /**
	   * Record that the node is contained in the connection.
	   */

	  RelayRecordStore.prototype._addConnectionForNode = function _addConnectionForNode(connectionID, nodeID) {
	    var connectionMap = this._nodeConnectionMap[nodeID];
	    if (!connectionMap) {
	      connectionMap = {};
	      this._nodeConnectionMap[nodeID] = connectionMap;
	    }
	    connectionMap[connectionID] = true;
	  };

	  /**
	   * Record that the given node is no longer part of the connection.
	   */

	  RelayRecordStore.prototype._removeConnectionForNode = function _removeConnectionForNode(connectionID, nodeID) {
	    var connectionMap = this._nodeConnectionMap[nodeID];
	    if (connectionMap) {
	      delete connectionMap[connectionID];
	      if (_Object$keys(connectionMap).length === 0) {
	        delete this._nodeConnectionMap[nodeID];
	      }
	    }
	  };

	  /**
	   * Gets the first version of the record from the available caches.
	   */

	  RelayRecordStore.prototype._getRecord = function _getRecord(dataID) {
	    if (this._queuedRecords && this._queuedRecords.hasOwnProperty(dataID)) {
	      return this._queuedRecords[dataID];
	    } else if (this._records.hasOwnProperty(dataID)) {
	      return this._records[dataID];
	    } else if (this._cachedRecords) {
	      return this._cachedRecords[dataID];
	    }
	  };

	  /**
	   * If the record is in the store, gets or creates a version of the record
	   * in the store being used for writes.
	   */

	  RelayRecordStore.prototype._getRecordForWrite = function _getRecordForWrite(dataID) {
	    // Cannot write to non-existent records, so ensure the record exists first.
	    // Returning null/undefined allows for local invariant checks at call sites
	    // with specific error messaging.
	    var record = this._getRecord(dataID);
	    if (!record) {
	      return record;
	    }
	    // Create an empty version of the record in the writable store if it does
	    // not already exist there.
	    var source = this._queuedRecords || this._records;
	    if (!source[dataID]) {
	      record = source[dataID] = {
	        __dataID__: dataID
	      };
	    }
	    if (source === this._queuedRecords) {
	      this._setClientMutationID(record);
	    }
	    return record;
	  };

	  /**
	   * Get the value of the field from the first version of the record for which
	   * the field is defined, returning `null` if the record has been deleted or
	   * `undefined` if the record has not been fetched.
	   */

	  RelayRecordStore.prototype._getField = function _getField(dataID, storageKey) {
	    var storage = this._storage;
	    for (var ii = 0; ii < storage.length; ii++) {
	      var record = storage[ii][dataID];
	      if (record === null) {
	        return null;
	      } else if (record && record.hasOwnProperty(storageKey)) {
	        return record[storageKey];
	      }
	    }
	    return undefined;
	  };

	  /**
	   * Injects the client mutation id associated with the record store instance
	   * into the given record.
	   */

	  RelayRecordStore.prototype._setClientMutationID = function _setClientMutationID(record) {
	    var clientMutationID = this._clientMutationID;
	    !clientMutationID ?  true ? invariant(false, 'RelayRecordStore: _clientMutationID cannot be null/undefined.') : invariant(false) : undefined;
	    var mutationIDs = record.__mutationIDs__ || [];
	    if (mutationIDs.indexOf(clientMutationID) === -1) {
	      mutationIDs.push(clientMutationID);
	      record.__mutationIDs__ = mutationIDs;
	    }
	    record.__status__ = RelayRecordStatusMap.setOptimisticStatus(0, true);
	  };

	  return RelayRecordStore;
	})();

	function getFilterCalls(calls) {
	  return calls.filter(function (call) {
	    return !RelayConnectionInterface.isConnectionCall(call);
	  });
	}

	/**
	 * Returns the field name based on the object key used to store the data in
	 * nodeData. It returns the field name without any calls. For example, the
	 * field name for 'profile_picture{size:"50"}' will be 'profile_picture'
	 */
	function getFieldNameFromKey(key) {
	  // This is based on the GraphQL spec for what constitutes a valid field name.
	  return key.split(/(?![_A-Za-z][_0-9A-Za-z]*)/, 1)[0];
	}

	module.exports = RelayRecordStore;

/***/ },
/* 139 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule RelayRefQueryDescriptor
	 * 
	 * @typechecks
	 */

	'use strict';

	var _classCallCheck = __webpack_require__(1)['default'];

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	/**
	 * @internal
	 *
	 * Represents a node that will eventually become a "ref query".
	 *
	 * Includes the `nodePath` (ancestor nodes) that can be used to construct an
	 * appropriate the JSONPath for the query.
	 *
	 * @see splitDeferredRelayQueries
	 */

	var RelayRefQueryDescriptor = function RelayRefQueryDescriptor(node, nodePath) {
	  _classCallCheck(this, RelayRefQueryDescriptor);

	  this.node = node;
	  this.nodePath = nodePath;
	};

	module.exports = RelayRefQueryDescriptor;

/***/ },
/* 140 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule RelayRenderer
	 * @typechecks
	 * 
	 */

	'use strict';

	var _inherits = __webpack_require__(5)['default'];

	var _classCallCheck = __webpack_require__(1)['default'];

	var _extends = __webpack_require__(8)['default'];

	var GraphQLFragmentPointer = __webpack_require__(20);
	var React = __webpack_require__(33);

	var RelayPropTypes = __webpack_require__(35);
	var RelayStore = __webpack_require__(36);
	var RelayStoreData = __webpack_require__(37);

	var StaticContainer = __webpack_require__(224);

	var getRelayQueries = __webpack_require__(84);
	var invariant = __webpack_require__(2);
	var mapObject = __webpack_require__(48);

	var PropTypes = React.PropTypes;

	/**
	 * @public
	 *
	 * RelayRenderer renders a container and query config after fulfilling its data
	 * dependencies. Precise rendering behavior is configured via the `render` prop
	 * which takes a callback.
	 *
	 * The container created using `Relay.createContainer` must be supplied via the
	 * `Container` prop, and the query configuration that conforms to the shape of a
	 * `RelayQueryConfig` must be supplied via the `queryConfig` prop.
	 *
	 * === Render Callback ===
	 *
	 * The `render` callback is called with an object with the following properties:
	 *
	 *   props: ?Object
	 *     If present, sufficient data is ready to render the container. This object
	 *     must be spread into the container using the spread attribute operator. If
	 *     absent, there is insufficient data to render the container.
	 *
	 *   done: boolean
	 *     Whether all data dependencies have been fulfilled. If `props` is present
	 *     but `done` is false, then sufficient data is ready to render, but some
	 *     data dependencies have not yet been fulfilled.
	 *
	 *   error: ?Error
	 *     If present, an error occurred while fulfilling data dependencies. If
	 *     `props` and `error` are both present, then sufficient data is ready to
	 *     render, but an error occurred while fulfilling deferred dependencies.
	 *
	 *   retry: ?Function
	 *     A function that can be called to re-attempt to fulfill data dependencies.
	 *     This property is only present if an `error` has occurred.
	 *
	 *   stale: boolean
	 *     When `forceFetch` is enabled, a request is always made to fetch updated
	 *     data. However, if all data dependencies can be immediately fulfilled, the
	 *     `props` property will be present. In this case, `stale` will be true.
	 *
	 * The `render` callback can return `undefined` to continue rendering the last
	 * view rendered (e.g. when transitioning from one `queryConfig` to another).
	 *
	 * If a `render` callback is not supplied, the default behavior is to render the
	 * container if data is available, the existing view if one exists, or nothing.
	 *
	 * === Refs ===
	 *
	 * References to elements rendered by the `render` callback can be obtained by
	 * using the React `ref` prop. For example:
	 *
	 *   <FooComponent {...props} ref={handleFooRef} />
	 *
	 *   function handleFooRef(component) {
	 *     // Invoked when `<FooComponent>` is mounted or unmounted. When mounted,
	 *     // `component` will be the component. When unmounted, `component` will
	 *     // be null.
	 *   }
	 *
	 */

	var RelayRenderer = (function (_React$Component) {
	  _inherits(RelayRenderer, _React$Component);

	  function RelayRenderer(props, context) {
	    _classCallCheck(this, RelayRenderer);

	    _React$Component.call(this, props, context);
	    this.mounted = true;
	    this.state = this._runQueries(this.props);
	  }

	  RelayRenderer.prototype.getChildContext = function getChildContext() {
	    return { route: this.props.queryConfig };
	  };

	  /**
	   * @private
	   */

	  RelayRenderer.prototype._runQueries = function _runQueries(_ref) {
	    var _this = this;

	    var Component = _ref.Component;
	    var forceFetch = _ref.forceFetch;
	    var queryConfig = _ref.queryConfig;

	    var querySet = getRelayQueries(Component, queryConfig);
	    var onReadyStateChange = function onReadyStateChange(readyState) {
	      if (!_this.mounted) {
	        _this._handleReadyStateChange(_extends({}, readyState, { mounted: false }));
	        return;
	      }
	      var _state = _this.state;
	      var pendingRequest = _state.pendingRequest;
	      var props = _state.renderArgs.props;

	      if (request !== pendingRequest) {
	        // Ignore (abort) ready state if we have a new pending request.
	        return;
	      }
	      if (readyState.aborted || readyState.done || readyState.error) {
	        pendingRequest = null;
	      }
	      if (readyState.ready && !props) {
	        props = _extends({}, queryConfig.params, mapObject(querySet, createFragmentPointerForRoot));
	      }
	      _this.setState({
	        activeComponent: Component,
	        activeQueryConfig: queryConfig,
	        pendingRequest: pendingRequest,
	        readyState: _extends({}, readyState, { mounted: true }),
	        renderArgs: {
	          done: readyState.done,
	          error: readyState.error,
	          props: props,
	          retry: _this.state.renderArgs.retry,
	          stale: readyState.stale
	        }
	      });
	    };

	    var request = forceFetch ? RelayStore.forceFetch(querySet, onReadyStateChange) : RelayStore.primeCache(querySet, onReadyStateChange);

	    return {
	      activeComponent: this.state ? this.state.activeComponent : null,
	      activeQueryConfig: this.state ? this.state.activeQueryConfig : null,
	      pendingRequest: request,
	      readyState: null,
	      renderArgs: {
	        done: false,
	        error: null,
	        props: null,
	        retry: this._retry.bind(this),
	        stale: false
	      }
	    };
	  };

	  /**
	   * Returns whether or not the view should be updated during the current render
	   * pass. This is false between invoking `Relay.Store.{primeCache,forceFetch}`
	   * and the first invocation of the `onReadyStateChange` callback if there is
	   * an actively rendered component and query configuration.
	   *
	   * @private
	   */

	  RelayRenderer.prototype._shouldUpdate = function _shouldUpdate() {
	    var _state2 = this.state;
	    var activeComponent = _state2.activeComponent;
	    var activeQueryConfig = _state2.activeQueryConfig;

	    return (!activeComponent || this.props.Component === activeComponent) && (!activeQueryConfig || this.props.queryConfig === activeQueryConfig);
	  };

	  /**
	   * @private
	   */

	  RelayRenderer.prototype._retry = function _retry() {
	    var readyState = this.state.readyState;

	    !(readyState && readyState.error) ?  true ? invariant(false, 'RelayRenderer: You tried to call `retry`, but the last request did ' + 'not fail. You can only call this when the last request has failed.') : invariant(false) : undefined;
	    this.setState(this._runQueries(this.props));
	  };

	  RelayRenderer.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
	    if (nextProps.Component !== this.props.Component || nextProps.queryConfig !== this.props.queryConfig || nextProps.forceFetch && !this.props.forceFetch) {
	      if (this.state.pendingRequest) {
	        this.state.pendingRequest.abort();
	      }
	      this.setState(this._runQueries(nextProps));
	    }
	  };

	  RelayRenderer.prototype.componentDidUpdate = function componentDidUpdate(prevProps, prevState) {
	    // `prevState` should exist; the truthy check is for Flow soundness.
	    var readyState = this.state.readyState;

	    if (readyState) {
	      if (!prevState || readyState !== prevState.readyState) {
	        this._handleReadyStateChange(readyState);
	      }
	    }
	  };

	  /**
	   * @private
	   */

	  RelayRenderer.prototype._handleReadyStateChange = function _handleReadyStateChange(readyState) {
	    var onReadyStateChange = this.props.onReadyStateChange;

	    if (onReadyStateChange) {
	      onReadyStateChange(readyState);
	    }
	  };

	  RelayRenderer.prototype.componentWillUnmount = function componentWillUnmount() {
	    if (this.state.pendingRequest) {
	      this.state.pendingRequest.abort();
	    }
	    this.mounted = false;
	  };

	  RelayRenderer.prototype.render = function render() {
	    var children = undefined;
	    var shouldUpdate = this._shouldUpdate();
	    if (shouldUpdate) {
	      var _props = this.props;
	      var _Component = _props.Component;
	      var _render = _props.render;
	      var _renderArgs = this.state.renderArgs;

	      if (_render) {
	        children = _render(_renderArgs);
	      } else if (_renderArgs.props) {
	        children = React.createElement(_Component, _renderArgs.props);
	      }
	    }
	    if (children === undefined) {
	      children = null;
	      shouldUpdate = false;
	    }
	    return React.createElement(
	      StaticContainer,
	      { shouldUpdate: shouldUpdate },
	      children
	    );
	  };

	  return RelayRenderer;
	})(React.Component);

	function createFragmentPointerForRoot(query) {
	  return query ? GraphQLFragmentPointer.createForRoot(RelayStoreData.getDefaultInstance().getQueuedStore(), query) : null;
	}

	RelayRenderer.propTypes = {
	  Component: RelayPropTypes.Container,
	  forceFetch: PropTypes.bool,
	  onReadyStateChange: PropTypes.func,
	  queryConfig: RelayPropTypes.QueryConfig.isRequired,
	  render: PropTypes.func
	};

	RelayRenderer.childContextTypes = {
	  route: RelayPropTypes.QueryConfig.isRequired
	};

	module.exports = RelayRenderer;

/***/ },
/* 141 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule RelayRootContainer
	 * @typechecks
	 * 
	 */

	'use strict';

	var React = __webpack_require__(33);

	var RelayPropTypes = __webpack_require__(35);

	var RelayRenderer = __webpack_require__(140);

	var PropTypes = React.PropTypes;

	/**
	 * @public
	 *
	 * RelayRootContainer sends requests for data required to render the supplied
	 * `Component` and `route`. The `Component` must be a container created using
	 * `Relay.createContainer`.
	 *
	 * === Render Callbacks ===
	 *
	 * Whenever the RelayRootContainer renders, one of three render callback props
	 * are invoked depending on whether data is being loaded, can be resolved, or if
	 * an error is incurred.
	 *
	 *  ReactDOM.render(
	 *    <RelayRootContainer
	 *      Component={FooComponent}
	 *      route={fooRoute}
	 *      renderLoading={function() {
	 *        return <View>Loading...</View>;
	 *      }}
	 *      renderFetched={function(data) {
	 *        // Must spread `data` into <FooComponent>.
	 *        return <FooComponent {...data} />;
	 *      }}
	 *      renderFailure={function(error) {
	 *        return <View>Error: {error.message}</View>;
	 *      }}
	 *    />,
	 *    ...
	 *  );
	 *
	 * If a callback is not supplied, it has a default behavior:
	 *
	 *  - Without `renderFetched`, `Component` will be rendered with fetched data.
	 *  - Without `renderFailure`, an error will render to null.
	 *  - Without `renderLoading`, the existing view will continue to render. If
	 *    this is the initial mount (with no existing view), renders to null.
	 *
	 * In addition, supplying a `renderLoading` that returns undefined has the same
	 * effect as not supplying the callback. (Usually, an undefined return value is
	 * an error in React).
	 *
	 * === Refs ===
	 *
	 * References to elements rendered by any of these callbacks can be obtained by
	 * using the React `ref` prop. For example:
	 *
	 *   <FooComponent {...data} ref={handleFooRef} />
	 *
	 *   function handleFooRef(component) {
	 *     // Invoked when `<FooComponent>` is mounted or unmounted. When mounted,
	 *     // `component` will be the component. When unmounted, `component` will
	 *     // be null.
	 *   }
	 *
	 */
	function RelayRootContainer(_ref) {
	  var Component = _ref.Component;
	  var forceFetch = _ref.forceFetch;
	  var onReadyStateChange = _ref.onReadyStateChange;
	  var renderFailure = _ref.renderFailure;
	  var renderFetched = _ref.renderFetched;
	  var renderLoading = _ref.renderLoading;
	  var route = _ref.route;

	  return React.createElement(RelayRenderer, {
	    Component: Component,
	    forceFetch: forceFetch,
	    onReadyStateChange: onReadyStateChange,
	    queryConfig: route,
	    render: function (_ref2) {
	      var done = _ref2.done;
	      var error = _ref2.error;
	      var props = _ref2.props;
	      var retry = _ref2.retry;
	      var stale = _ref2.stale;

	      if (error) {
	        if (renderFailure) {
	          return renderFailure(error, retry);
	        }
	      } else if (props) {
	        if (renderFetched) {
	          return renderFetched(props, { done: done, stale: stale });
	        } else {
	          return React.createElement(Component, props);
	        }
	      } else {
	        if (renderLoading) {
	          return renderLoading();
	        }
	      }
	      return undefined;
	    }
	  });
	}

	RelayRootContainer.propTypes = {
	  Component: RelayPropTypes.Container,
	  forceFetch: PropTypes.bool,
	  onReadyStateChange: PropTypes.func,
	  renderFailure: PropTypes.func,
	  renderFetched: PropTypes.func,
	  renderLoading: PropTypes.func,
	  route: RelayPropTypes.QueryConfig.isRequired
	};

	RelayRootContainer.childContextTypes = {
	  route: RelayPropTypes.QueryConfig.isRequired
	};

	module.exports = RelayRootContainer;

/***/ },
/* 142 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule RelayRoute
	 * 
	 * @typechecks
	 */

	'use strict';

	var _inherits = __webpack_require__(5)['default'];

	var _classCallCheck = __webpack_require__(1)['default'];

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var RelayQueryConfig = __webpack_require__(132);

	var forEachObject = __webpack_require__(9);
	var invariant = __webpack_require__(2);

	var createURI = function createURI() {
	  return null;
	};

	/**
	 * Describes the root queries, param definitions and other metadata for a given
	 * path (URI).
	 */

	var RelayRoute = (function (_RelayQueryConfig) {
	  _inherits(RelayRoute, _RelayQueryConfig);

	  function RelayRoute(initialVariables, uri) {
	    _classCallCheck(this, RelayRoute);

	    _RelayQueryConfig.call(this, initialVariables);
	    var constructor = this.constructor;
	    var routeName = constructor.routeName;
	    var path = constructor.path;

	    !(constructor !== RelayRoute) ?  true ? invariant(false, 'RelayRoute: Abstract class cannot be instantiated.') : invariant(false) : undefined;
	    !routeName ?  true ? invariant(false, '%s: Subclasses of RelayRoute must define a `routeName`.', constructor.name || '<<anonymous>>') : invariant(false) : undefined;

	    if (!uri && path) {
	      uri = createURI(constructor, this.params);
	    }

	    Object.defineProperty(this, 'uri', {
	      enumerable: true,
	      value: uri,
	      writable: false
	    });
	  }

	  RelayRoute.prototype.prepareVariables = function prepareVariables(prevVariables) {
	    var _constructor = this.constructor;
	    var paramDefinitions = _constructor.paramDefinitions;
	    var prepareParams = _constructor.prepareParams;
	    var routeName = _constructor.routeName;

	    var params = prevVariables;
	    if (prepareParams) {
	      /* $FlowFixMe(>=0.17.0) - params is ?Tv but prepareParams expects Tv */
	      params = prepareParams(params);
	    }
	    forEachObject(paramDefinitions, function (paramDefinition, paramName) {
	      if (params) {
	        if (params.hasOwnProperty(paramName)) {
	          return;
	        } else {
	          // Backfill param so that a call variable is created for it.
	          params[paramName] = undefined;
	        }
	      }
	      !!paramDefinition.required ?  true ? invariant(false, 'RelayRoute: Missing required parameter `%s` in `%s`. Check the ' + 'supplied params or URI.', paramName, routeName) : invariant(false) : undefined;
	    });
	    return params;
	  };

	  RelayRoute.injectURICreator = function injectURICreator(creator) {
	    createURI = creator;
	  };

	  return RelayRoute;
	})(RelayQueryConfig);

	module.exports = RelayRoute;

/***/ },
/* 143 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule RelayUnstableBatchedUpdates
	 * 
	 * @typechecks
	 */

	'use strict';

	var ReactDOM = __webpack_require__(227);

	module.exports = ReactDOM.unstable_batchedUpdates;

/***/ },
/* 144 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule checkRelayQueryData
	 * 
	 * @typechecks
	 */

	'use strict';

	var _inherits = __webpack_require__(5)['default'];

	var _classCallCheck = __webpack_require__(1)['default'];

	var RelayConnectionInterface = __webpack_require__(7);

	var RelayProfiler = __webpack_require__(4);

	var RelayQueryVisitor = __webpack_require__(18);
	var RelayRecordState = __webpack_require__(27);

	var forEachRootCallArg = __webpack_require__(28);
	var isCompatibleRelayFragmentType = __webpack_require__(29);

	var EDGES = RelayConnectionInterface.EDGES;
	var PAGE_INFO = RelayConnectionInterface.PAGE_INFO;

	/**
	 * @internal
	 *
	 * Traverses a query and data in the record store to determine whether we have
	 * enough data to satisfy the query.
	 */
	function checkRelayQueryData(store, query) {

	  var checker = new RelayQueryChecker(store);

	  var state = {
	    dataID: undefined,
	    rangeInfo: undefined,
	    result: true
	  };

	  checker.visit(query, state);
	  return state.result;
	}

	var RelayQueryChecker = (function (_RelayQueryVisitor) {
	  _inherits(RelayQueryChecker, _RelayQueryVisitor);

	  function RelayQueryChecker(store) {
	    _classCallCheck(this, RelayQueryChecker);

	    _RelayQueryVisitor.call(this);
	    this._store = store;
	  }

	  /**
	   * Skip visiting children if result is already false.
	   */

	  RelayQueryChecker.prototype.traverse = function traverse(node, state) {
	    var children = node.getChildren();
	    for (var ii = 0; ii < children.length; ii++) {
	      if (!state.result) {
	        return;
	      }
	      this.visit(children[ii], state);
	    }
	  };

	  RelayQueryChecker.prototype.visitRoot = function visitRoot(root, state) {
	    var _this = this;

	    var nextState;
	    var storageKey = root.getStorageKey();
	    forEachRootCallArg(root, function (identifyingArgValue) {
	      var dataID = _this._store.getDataID(storageKey, identifyingArgValue);
	      if (dataID == null) {
	        state.result = false;
	      } else {
	        nextState = {
	          dataID: dataID,
	          rangeInfo: undefined,
	          result: true
	        };
	        _this.traverse(root, nextState);
	        state.result = state.result && nextState.result;
	      }
	    });
	  };

	  RelayQueryChecker.prototype.visitFragment = function visitFragment(fragment, state) {
	    var dataID = state.dataID;
	    // The dataID check is for Flow; it must be non-null to have gotten here.
	    if (dataID && isCompatibleRelayFragmentType(fragment, this._store.getType(dataID))) {
	      this.traverse(fragment, state);
	    }
	  };

	  RelayQueryChecker.prototype.visitField = function visitField(field, state) {
	    var dataID = state.dataID;
	    var recordState = dataID && this._store.getRecordState(dataID);
	    if (recordState === RelayRecordState.UNKNOWN) {
	      state.result = false;
	      return;
	    } else if (recordState === RelayRecordState.NONEXISTENT) {
	      return;
	    }
	    var rangeInfo = state.rangeInfo;
	    if (rangeInfo && field.getSchemaName() === EDGES) {
	      this._checkEdges(field, state);
	    } else if (rangeInfo && field.getSchemaName() === PAGE_INFO) {
	      this._checkPageInfo(field, state);
	    } else if (field.isScalar()) {
	      this._checkScalar(field, state);
	    } else if (field.isPlural()) {
	      this._checkPlural(field, state);
	    } else if (field.isConnection()) {
	      this._checkConnection(field, state);
	    } else {
	      this._checkLinkedField(field, state);
	    }
	  };

	  RelayQueryChecker.prototype._checkScalar = function _checkScalar(field, state) {
	    var fieldData = state.dataID && this._store.getField(state.dataID, field.getStorageKey());
	    if (fieldData === undefined) {
	      state.result = false;
	    }
	  };

	  RelayQueryChecker.prototype._checkPlural = function _checkPlural(field, state) {
	    var dataIDs = state.dataID && this._store.getLinkedRecordIDs(state.dataID, field.getStorageKey());
	    if (dataIDs === undefined) {
	      state.result = false;
	      return;
	    }
	    if (dataIDs) {
	      for (var ii = 0; ii < dataIDs.length; ii++) {
	        if (!state.result) {
	          break;
	        }
	        var nextState = {
	          dataID: dataIDs[ii],
	          rangeInfo: undefined,
	          result: true
	        };
	        this.traverse(field, nextState);
	        state.result = nextState.result;
	      }
	    }
	  };

	  RelayQueryChecker.prototype._checkConnection = function _checkConnection(field, state) {
	    var calls = field.getCallsWithValues();
	    var dataID = state.dataID && this._store.getLinkedRecordID(state.dataID, field.getStorageKey());
	    if (dataID === undefined) {
	      state.result = false;
	      return;
	    }
	    var nextState = {
	      dataID: dataID,
	      rangeInfo: null, // Flow rejects `undefined` here
	      result: true
	    };
	    var metadata = this._store.getRangeMetadata(dataID, calls);
	    if (metadata) {
	      nextState.rangeInfo = metadata;
	    }
	    this.traverse(field, nextState);
	    state.result = state.result && nextState.result;
	  };

	  RelayQueryChecker.prototype._checkEdges = function _checkEdges(field, state) {
	    var rangeInfo = state.rangeInfo;
	    if (!rangeInfo) {
	      state.result = false;
	      return;
	    }
	    if (rangeInfo.diffCalls.length) {
	      state.result = false;
	      return;
	    }
	    var edges = rangeInfo.filteredEdges;
	    for (var ii = 0; ii < edges.length; ii++) {
	      if (!state.result) {
	        break;
	      }
	      var nextState = {
	        dataID: edges[ii].edgeID,
	        rangeInfo: undefined,
	        result: true
	      };
	      this.traverse(field, nextState);
	      state.result = nextState.result;
	    }
	  };

	  RelayQueryChecker.prototype._checkPageInfo = function _checkPageInfo(field, state) {
	    var rangeInfo = state.rangeInfo;
	    if (!rangeInfo || !rangeInfo.pageInfo) {
	      state.result = false;
	      return;
	    }
	  };

	  RelayQueryChecker.prototype._checkLinkedField = function _checkLinkedField(field, state) {
	    var dataID = state.dataID && this._store.getLinkedRecordID(state.dataID, field.getStorageKey());
	    if (dataID === undefined) {
	      state.result = false;
	      return;
	    }
	    if (dataID) {
	      var nextState = {
	        dataID: dataID,
	        rangeInfo: undefined,
	        result: true
	      };
	      this.traverse(field, nextState);
	      state.result = state.result && nextState.result;
	    }
	  };

	  return RelayQueryChecker;
	})(RelayQueryVisitor);

	module.exports = RelayProfiler.instrument('checkRelayQueryData', checkRelayQueryData);

/***/ },
/* 145 */
/***/ function(module, exports) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule containsRelayQueryRootCall
	 * @typechecks
	 * 
	 */

	/**
	 * @internal
	 *
	 * Compares two query root nodes and returns true if the nodes fetched by
	 * `thisRoot` would be a superset of the nodes fetched by `thatRoot`.
	 */
	'use strict';

	function containsRelayQueryRootCall(thisRoot, thatRoot) {
	  if (thisRoot === thatRoot) {
	    return true;
	  }
	  if (getCanonicalName(thisRoot.getFieldName()) !== getCanonicalName(thatRoot.getFieldName())) {
	    return false;
	  }
	  var thisIdentifyingArg = thisRoot.getIdentifyingArg();
	  var thatIdentifyingArg = thatRoot.getIdentifyingArg();
	  var thisValue = thisIdentifyingArg && thisIdentifyingArg.value || null;
	  var thatValue = thatIdentifyingArg && thatIdentifyingArg.value || null;
	  if (thisValue == null && thatValue == null) {
	    return true;
	  }
	  if (thisValue == null || thatValue == null) {
	    return false;
	  }
	  if (Array.isArray(thisValue)) {
	    var thisArray = thisValue;
	    if (Array.isArray(thatValue)) {
	      return thatValue.every(function (eachValue) {
	        return thisArray.indexOf(eachValue) >= 0;
	      });
	    } else {
	      return thisValue.indexOf(thatValue) >= 0;
	    }
	  } else {
	    if (Array.isArray(thatValue)) {
	      return thatValue.every(function (eachValue) {
	        return eachValue === thisValue;
	      });
	    } else {
	      return thatValue === thisValue;
	    }
	  }
	}

	var canonicalRootCalls = {
	  'nodes': 'node',
	  'usernames': 'username'
	};

	/**
	 * @private
	 *
	 * This is required to support legacy versions of GraphQL.
	 */
	function getCanonicalName(name) {
	  if (canonicalRootCalls.hasOwnProperty(name)) {
	    return canonicalRootCalls[name];
	  }
	  return name;
	}

	module.exports = containsRelayQueryRootCall;

/***/ },
/* 146 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule createRelayQuery
	 * @typechecks
	 * 
	 */

	'use strict';

	var RelayMetaRoute = __webpack_require__(21);
	var RelayQuery = __webpack_require__(3);

	var invariant = __webpack_require__(2);

	function createRelayQuery(node, variables) {
	  !(typeof variables === 'object' && variables != null && !Array.isArray(variables)) ?  true ? invariant(false, 'Relay.Query: Expected `variables` to be an object.') : invariant(false) : undefined;
	  return RelayQuery.Root.create(node, RelayMetaRoute.get('$createRelayQuery'), variables);
	}

	module.exports = createRelayQuery;

/***/ },
/* 147 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule diffRelayQuery
	 * 
	 * @typechecks
	 */

	'use strict';

	var _classCallCheck = __webpack_require__(1)['default'];

	var GraphQLStoreDataHandler = __webpack_require__(6);
	var RelayConnectionInterface = __webpack_require__(7);
	var RelayNodeInterface = __webpack_require__(12);
	var RelayProfiler = __webpack_require__(4);
	var RelayQuery = __webpack_require__(3);
	var RelayQueryPath = __webpack_require__(26);

	var forEachRootCallArg = __webpack_require__(28);
	var invariant = __webpack_require__(2);
	var isCompatibleRelayFragmentType = __webpack_require__(29);
	var warning = __webpack_require__(11);

	var ID = RelayNodeInterface.ID;
	var NODE_TYPE = RelayNodeInterface.NODE_TYPE;
	var TYPENAME = RelayNodeInterface.TYPENAME;
	var EDGES = RelayConnectionInterface.EDGES;
	var NODE = RelayConnectionInterface.NODE;
	var PAGE_INFO = RelayConnectionInterface.PAGE_INFO;

	var idField = RelayQuery.Field.build({
	  fieldName: ID,
	  metadata: {
	    isRequisite: true
	  },
	  type: 'String'
	});
	var typeField = RelayQuery.Field.build({
	  fieldName: TYPENAME,
	  metadata: {
	    isRequisite: true
	  },
	  type: 'String'
	});
	var nodeWithID = RelayQuery.Field.build({
	  fieldName: RelayNodeInterface.NODE,
	  children: [idField, typeField],
	  type: NODE_TYPE
	});

	/**
	 * @internal
	 *
	 * Computes the difference between the data requested in `root` and the data
	 * available in `store`. It returns a minimal set of queries that will fulfill
	 * the difference, or an empty array if the query can be resolved locally.
	 */
	function diffRelayQuery(root, store, tracker) {
	  var path = new RelayQueryPath(root);
	  var queries = [];

	  var visitor = new RelayDiffQueryBuilder(store, tracker);
	  var rootIdentifyingArg = root.getIdentifyingArg();
	  var rootIdentifyingArgValue = rootIdentifyingArg && rootIdentifyingArg.value || null;
	  var isPluralCall = Array.isArray(rootIdentifyingArgValue) && rootIdentifyingArgValue.length > 1;
	  var metadata = undefined;
	  if (rootIdentifyingArg != null) {
	    metadata = {};
	    metadata.identifyingArgName = rootIdentifyingArg.name;
	    if (rootIdentifyingArg.type != null) {
	      metadata.identifyingArgType = rootIdentifyingArg.type;
	    }
	  }
	  var fieldName = root.getFieldName();
	  var storageKey = root.getStorageKey();
	  forEachRootCallArg(root, function (identifyingArgValue) {
	    var nodeRoot;
	    if (isPluralCall) {
	      !(identifyingArgValue != null) ?  true ? invariant(false, 'diffRelayQuery(): Unexpected null or undefined value in root call ' + 'argument array for query, `%s(...).', fieldName) : invariant(false) : undefined;
	      nodeRoot = RelayQuery.Root.build(root.getName(), fieldName, [identifyingArgValue], root.getChildren(), metadata, root.getType());
	    } else {
	      // Reuse `root` if it only maps to one result.
	      nodeRoot = root;
	    }

	    // The whole query must be fetched if the root dataID is unknown.
	    var dataID = store.getDataID(storageKey, identifyingArgValue);
	    if (dataID == null) {
	      queries.push(nodeRoot);
	      return;
	    }

	    // Diff the current dataID
	    var scope = makeScope(dataID);
	    var diffOutput = visitor.visit(nodeRoot, path, scope);
	    var diffNode = diffOutput ? diffOutput.diffNode : null;
	    if (diffNode) {
	      !(diffNode instanceof RelayQuery.Root) ?  true ? invariant(false, 'diffRelayQuery(): Expected result to be a root query.') : invariant(false) : undefined;
	      queries.push(diffNode);
	    }
	  });
	  return queries.concat(visitor.getSplitQueries());
	}

	/**
	 * @internal
	 *
	 * A transform for (node + store) -> (diff + tracked queries). It is analagous
	 * to `RelayQueryTransform` with the main differences as follows:
	 * - there is no `state` (which allowed for passing data up and down the tree).
	 * - data is passed down via `scope`, which flows from a parent field down
	 *   through intermediary fragments to the nearest child field.
	 * - data is passed up via the return type `{diffNode, trackedNode}`, where:
	 *   - `diffNode`: subset of the input that could not diffed out
	 *   - `trackedNode`: subset of the input that must be tracked
	 *
	 * The provided `tracker` is updated whenever the traversal of a node results
	 * in a `trackedNode` being created. New top-level queries are not returned
	 * up the tree, and instead are available via `getSplitQueries()`.
	 */

	var RelayDiffQueryBuilder = (function () {
	  function RelayDiffQueryBuilder(store, tracker) {
	    _classCallCheck(this, RelayDiffQueryBuilder);

	    this._store = store;
	    this._splitQueries = [];
	    this._tracker = tracker;
	  }

	  /**
	   * Helper to construct a plain scope for the given `dataID`.
	   */

	  RelayDiffQueryBuilder.prototype.splitQuery = function splitQuery(root) {
	    this._splitQueries.push(root);
	  };

	  RelayDiffQueryBuilder.prototype.getSplitQueries = function getSplitQueries() {
	    return this._splitQueries;
	  };

	  RelayDiffQueryBuilder.prototype.visit = function visit(node, path, scope) {
	    if (node instanceof RelayQuery.Field) {
	      return this.visitField(node, path, scope);
	    } else if (node instanceof RelayQuery.Fragment) {
	      return this.visitFragment(node, path, scope);
	    } else if (node instanceof RelayQuery.Root) {
	      return this.visitRoot(node, path, scope);
	    }
	  };

	  RelayDiffQueryBuilder.prototype.visitRoot = function visitRoot(node, path, scope) {
	    return this.traverse(node, path, scope);
	  };

	  RelayDiffQueryBuilder.prototype.visitFragment = function visitFragment(node, path, scope) {
	    return this.traverse(node, path, scope);
	  };

	  /**
	   * Diffs the field conditionally based on the `scope` from the nearest
	   * ancestor field.
	   */

	  RelayDiffQueryBuilder.prototype.visitField = function visitField(node, path, _ref) {
	    var connectionField = _ref.connectionField;
	    var dataID = _ref.dataID;
	    var edgeID = _ref.edgeID;
	    var rangeInfo = _ref.rangeInfo;

	    // special case when inside a connection traversal
	    if (connectionField && rangeInfo) {
	      if (edgeID) {
	        // When traversing a specific connection edge only look at `edges`
	        if (node.getSchemaName() === EDGES) {
	          return this.diffConnectionEdge(connectionField, node, // edge field
	          path.getPath(node, edgeID), edgeID, rangeInfo);
	        } else {
	          return null;
	        }
	      } else {
	        // When traversing connection metadata fields, edges/page_info are
	        // only kept if there are range extension calls. Other fields fall
	        // through to regular diffing.
	        if (node.getSchemaName() === EDGES || node.getSchemaName() === PAGE_INFO) {
	          return rangeInfo.diffCalls.length > 0 ? {
	            diffNode: node,
	            trackedNode: null
	          } : null;
	        }
	      }
	    }

	    // default field diffing algorithm
	    if (node.isScalar()) {
	      return this.diffScalar(node, dataID);
	    } else if (node.isGenerated()) {
	      return {
	        diffNode: node,
	        trackedNode: null
	      };
	    } else if (node.isConnection()) {
	      return this.diffConnection(node, path, dataID);
	    } else if (node.isPlural()) {
	      return this.diffPluralLink(node, path, dataID);
	    } else {
	      return this.diffLink(node, path, dataID);
	    }
	  };

	  /**
	   * Visit all the children of the given `node` and merge their results.
	   */

	  RelayDiffQueryBuilder.prototype.traverse = function traverse(node, path, scope) {
	    var _this = this;

	    var diffNode = undefined;
	    var diffChildren = undefined;
	    var trackedNode = undefined;
	    var trackedChildren = undefined;
	    var hasDiffField = false;
	    var hasTrackedField = false;

	    node.getChildren().forEach(function (child) {
	      if (child instanceof RelayQuery.Field) {
	        var diffOutput = _this.visitField(child, path, scope);
	        var diffChild = diffOutput ? diffOutput.diffNode : null;
	        var trackedChild = diffOutput ? diffOutput.trackedNode : null;

	        // Diff uses child nodes and keeps requisite fields
	        if (diffChild) {
	          diffChildren = diffChildren || [];
	          diffChildren.push(diffChild);
	          hasDiffField = hasDiffField || !diffChild.isGenerated();
	        } else if (child.isRequisite() && !scope.rangeInfo) {
	          // The presence of `rangeInfo` indicates that we are traversing
	          // connection metadata fields, in which case `visitField` will ensure
	          // that `edges` and `page_info` are kept when necessary. The requisite
	          // check alone could cause these fields to be added back when not
	          // needed.
	          //
	          // Example: `friends.first(3) {count, edges {...}, page_info {...} }
	          // If all `edges` were fetched but `count` is unfetched, the diff
	          // should be `friends.first(3) {count}` and not include `page_info`.
	          diffChildren = diffChildren || [];
	          diffChildren.push(child);
	        }
	        // Tracker uses tracked children and keeps requisite fields
	        if (trackedChild) {
	          trackedChildren = trackedChildren || [];
	          trackedChildren.push(trackedChild);
	          hasTrackedField = hasTrackedField || !trackedChild.isGenerated();
	        } else if (child.isRequisite()) {
	          trackedChildren = trackedChildren || [];
	          trackedChildren.push(child);
	        }
	      } else if (child instanceof RelayQuery.Fragment) {
	        var isCompatibleType = isCompatibleRelayFragmentType(child, _this._store.getType(scope.dataID));
	        if (isCompatibleType) {
	          var diffOutput = _this.traverse(child, path, scope);
	          var diffChild = diffOutput ? diffOutput.diffNode : null;
	          var trackedChild = diffOutput ? diffOutput.trackedNode : null;

	          if (diffChild) {
	            diffChildren = diffChildren || [];
	            diffChildren.push(diffChild);
	            hasDiffField = true;
	          }
	          if (trackedChild) {
	            trackedChildren = trackedChildren || [];
	            trackedChildren.push(trackedChild);
	            hasTrackedField = true;
	          }
	        } else {
	          // Non-matching fragment types are similar to requisite fields:
	          // they don't need to be diffed against and should only be included
	          // if something *else* is missing from the node.
	          diffChildren = diffChildren || [];
	          diffChildren.push(child);
	        }
	      }
	    });

	    // Only return diff/tracked node if there are non-generated fields
	    if (diffChildren && hasDiffField) {
	      diffNode = node.clone(diffChildren);
	    }
	    if (trackedChildren && hasTrackedField) {
	      trackedNode = node.clone(trackedChildren);
	    }
	    // Record tracked nodes. Fragments can be skipped because these will
	    // always be composed into, and therefore tracked by, their nearest
	    // non-fragment parent.
	    if (trackedNode && !(trackedNode instanceof RelayQuery.Fragment)) {
	      this._tracker.trackNodeForID(trackedNode, scope.dataID, path);
	    }

	    return {
	      diffNode: diffNode,
	      trackedNode: trackedNode
	    };
	  };

	  /**
	   * Diff a scalar field such as `name` or `id`.
	   */

	  RelayDiffQueryBuilder.prototype.diffScalar = function diffScalar(field, dataID) {
	    if (this._store.getField(dataID, field.getStorageKey()) === undefined) {
	      return {
	        diffNode: field,
	        trackedNode: null
	      };
	    }
	    return null;
	  };

	  /**
	   * Diff a field-of-fields such as `profile_picture {...}`. Returns early if
	   * the field has not been fetched, otherwise the result of traversal.
	   */

	  RelayDiffQueryBuilder.prototype.diffLink = function diffLink(field, path, dataID) {
	    var nextDataID = this._store.getLinkedRecordID(dataID, field.getStorageKey());
	    if (nextDataID === undefined) {
	      return {
	        diffNode: field,
	        trackedNode: null
	      };
	    }
	    if (nextDataID === null) {
	      return null;
	    }

	    return this.traverse(field, path.getPath(field, nextDataID), makeScope(nextDataID));
	  };

	  /**
	   * Diffs a non-connection plural field against each of the fetched items.
	   * Note that scalar plural fields are handled by `_diffScalar`.
	   */

	  RelayDiffQueryBuilder.prototype.diffPluralLink = function diffPluralLink(field, path, dataID) {
	    var _this2 = this;

	    var linkedIDs = this._store.getLinkedRecordIDs(dataID, field.getStorageKey());
	    if (linkedIDs === undefined) {
	      // not fetched
	      return {
	        diffNode: field,
	        trackedNode: null
	      };
	    } else if (linkedIDs === null || linkedIDs.length === 0) {
	      // empty array means nothing to fetch
	      return null;
	    } else if (field.getInferredRootCallName() === NODE) {
	      // The items in this array are fetchable and may have been filled in
	      // from other sources, so check them all. For example, `Story{actors}`
	      // is an array (but not a range), and the Actors in that array likely
	      // had data fetched for them elsewhere (like `viewer(){actor}`).
	      var hasSplitQueries = false;
	      linkedIDs.forEach(function (itemID) {
	        var itemState = _this2.traverse(field, path.getPath(field, itemID), makeScope(itemID));
	        if (itemState) {
	          // If any child was tracked then `field` will also be tracked
	          hasSplitQueries = hasSplitQueries || !!itemState.trackedNode || !!itemState.diffNode;
	          // split diff nodes into root queries
	          if (itemState.diffNode) {
	            _this2.splitQuery(buildRoot(itemID, itemState.diffNode.getChildren(), path.getName(), field.getType()));
	          }
	        }
	      });
	      // if sub-queries are split then this *entire* field will be tracked,
	      // therefore we don't need to merge the `trackedNode` from each item
	      if (hasSplitQueries) {
	        return {
	          diffNode: null,
	          trackedNode: field
	        };
	      }
	    } else {
	      // The items in this array are not fetchable by ID, so nothing else
	      // could have fetched additional data for individual items. Therefore,
	      // we only need to diff the first record to figure out which fields have
	      // previously been fetched.
	      var sampleItemID = linkedIDs[0];
	      return this.traverse(field, path.getPath(field, sampleItemID), makeScope(sampleItemID));
	    }
	    return null;
	  };

	  /**
	   * Diff a connection field such as `news_feed.first(3)`. Returns early if
	   * the range has not been fetched or the entire range has already been
	   * fetched. Otherwise the diff output is a clone of `field` with updated
	   * after/first and before/last calls.
	   */

	  RelayDiffQueryBuilder.prototype.diffConnection = function diffConnection(field, path, dataID) {
	    var _this3 = this;

	    var store = this._store;
	    var connectionID = store.getLinkedRecordID(dataID, field.getStorageKey());
	    var rangeInfo = store.getRangeMetadata(connectionID, field.getCallsWithValues());
	    // Keep the field if the connection is unfetched
	    if (connectionID === undefined) {
	      return {
	        diffNode: field,
	        trackedNode: null
	      };
	    }
	    // Skip if the connection is deleted.
	    if (connectionID === null) {
	      return null;
	    }
	    // If metadata fields but not edges are fetched, diff as a normal field.
	    // In practice, `rangeInfo` is `undefined` if unfetched, `null` if the
	    // connection was deleted (in which case `connectionID` is null too).
	    if (rangeInfo == null) {
	      return this.traverse(field, path.getPath(field, connectionID), makeScope(connectionID));
	    }
	    var diffCalls = rangeInfo.diffCalls;
	    var filteredEdges = rangeInfo.filteredEdges;

	    // check existing edges for missing fields
	    var hasSplitQueries = false;
	    filteredEdges.forEach(function (edge) {
	      // Flow loses type information in closures
	      if (rangeInfo && connectionID) {
	        var scope = {
	          connectionField: field,
	          dataID: connectionID,
	          edgeID: edge.edgeID,
	          rangeInfo: rangeInfo
	        };
	        var diffOutput = _this3.traverse(field, path.getPath(field, edge.edgeID), scope);
	        // If any edges were missing data (resulting in a split query),
	        // then the entire original connection field must be tracked.
	        if (diffOutput) {
	          hasSplitQueries = hasSplitQueries || !!diffOutput.trackedNode;
	        }
	      }
	    });

	    // Scope has null `edgeID` to skip looking at `edges` fields.
	    var scope = {
	      connectionField: field,
	      dataID: connectionID,
	      edgeID: null,
	      rangeInfo: rangeInfo
	    };
	    // diff non-`edges` fields such as `count`
	    var diffOutput = this.traverse(field, path.getPath(field, connectionID), scope);
	    var diffNode = diffOutput ? diffOutput.diffNode : null;
	    var trackedNode = diffOutput ? diffOutput.trackedNode : null;
	    if (diffCalls.length && diffNode instanceof RelayQuery.Field) {
	      diffNode = diffNode.cloneFieldWithCalls(diffNode.getChildren(), diffCalls);
	    }
	    // if a sub-query was split, then we must track the entire field, which will
	    // be a superset of the `trackedNode` from traversing any metadata fields.
	    // Example:
	    // dataID: `4`
	    // node: `friends.first(3)`
	    // diffNode: null
	    // splitQueries: `node(friend1) {...}`, `node(friend2) {...}`
	    //
	    // In this case the two fetched `node` queries do not reflect the fact that
	    // `friends.first(3)` were fetched for item `4`, so `friends.first(3)` has
	    // to be tracked as-is.
	    if (hasSplitQueries) {
	      trackedNode = field;
	    }

	    return {
	      diffNode: diffNode,
	      trackedNode: trackedNode
	    };
	  };

	  /**
	   * Diff an `edges` field for the edge rooted at `edgeID`, splitting a new
	   * root query to fetch any missing data (via a `node(id)` root if the
	   * field is refetchable or a `...{connection.find(id){}}` query if the
	   * field is not refetchable).
	   */

	  RelayDiffQueryBuilder.prototype.diffConnectionEdge = function diffConnectionEdge(connectionField, edgeField, path, edgeID, rangeInfo) {
	    var nodeID = this._store.getLinkedRecordID(edgeID, NODE);
	    if (!nodeID || GraphQLStoreDataHandler.isClientID(nodeID)) {
	       true ? warning(false, 'RelayDiffQueryBuilder: connection `node{*}` can only be refetched ' + 'if the node is refetchable by `id`. Cannot refetch data for field ' + '`%s`.', connectionField.getStorageKey()) : undefined;
	      return null;
	    }

	    var hasSplitQueries = false;
	    var diffOutput = this.traverse(edgeField, path.getPath(edgeField, edgeID), makeScope(edgeID));
	    var diffNode = diffOutput ? diffOutput.diffNode : null;
	    var trackedNode = diffOutput ? diffOutput.trackedNode : null;

	    if (diffNode) {
	      var _splitNodeAndEdgesFields = splitNodeAndEdgesFields(diffNode);

	      var diffEdgesField = _splitNodeAndEdgesFields.edges;
	      var diffNodeField = _splitNodeAndEdgesFields.node;

	      // split missing `node` fields into a `node(id)` root query
	      if (diffNodeField) {
	        hasSplitQueries = true;
	        var nodeField = edgeField.getFieldByStorageKey('node');
	        !nodeField ?  true ? invariant(false, 'RelayDiffQueryBuilder: expected a `node` field for connection `%s`.', connectionField.getSchemaName()) : invariant(false) : undefined;
	        this.splitQuery(buildRoot(nodeID, diffNodeField.getChildren(), path.getName(), nodeField.getType()));
	      }

	      // split missing `edges` fields into a `connection.find(id)` query
	      // if `find` is supported, otherwise warn
	      if (diffEdgesField) {
	        if (connectionField.isFindable()) {
	          diffEdgesField = diffEdgesField.clone(diffEdgesField.getChildren().concat(nodeWithID));
	          var connectionFind = connectionField.cloneFieldWithCalls([diffEdgesField], rangeInfo.filterCalls.concat({ name: 'find', value: nodeID }));
	          if (connectionFind) {
	            hasSplitQueries = true;
	            // current path has `parent`, `connection`, `edges`; pop to parent
	            var connectionParent = path.getParent().getParent();
	            this.splitQuery(connectionParent.getQuery(connectionFind));
	          }
	        } else {
	           true ? warning(false, 'RelayDiffQueryBuilder: connection `edges{*}` fields can only be ' + 'refetched if the connection supports the `find` call. Cannot ' + 'refetch data for field `%s`.', connectionField.getStorageKey()) : undefined;
	        }
	      }
	    }

	    // Connection edges will never return diff nodes; instead missing fields
	    // are fetched by new root queries. Tracked nodes are returned if either
	    // a child field was tracked or missing fields were split into a new query.
	    // The returned `trackedNode` is never tracked directly: instead it serves
	    // as an indicator to `diffConnection` that the entire connection field must
	    // be tracked.
	    return {
	      diffNode: null,
	      trackedNode: hasSplitQueries ? edgeField : trackedNode
	    };
	  };

	  return RelayDiffQueryBuilder;
	})();

	function makeScope(dataID) {
	  return {
	    connectionField: null,
	    dataID: dataID,
	    edgeID: null,
	    rangeInfo: null
	  };
	}

	/**
	 * Returns a clone of the input with `edges` and `node` sub-fields split into
	 * separate `edges` and `node` roots. Example:
	 *
	 * Input:
	 * edges {
	 *   edge_field,
	 *   node {
	 *     a,
	 *     b
	 *   },
	 *   ${
	 *     Fragment {
	 *       edge_field_2,
	 *       node {
	 *         c
	 *       }
	 *     }
	 *   }
	 * }
	 *
	 * Output:
	 * node:
	 *   edges {
	 *     a,      // flattened
	 *     b,      // flattend
	 *     ${
	 *       Fragment {
	 *         c  // flattened
	 *       }
	 *     }
	 *   }
	 * edges:
	 *   edges {
	 *     edge_field,
	 *     ${
	 *       Fragment {
	 *         edge_field_2
	 *       }
	 *     }
	 *   }
	 */
	function splitNodeAndEdgesFields(edgeOrFragment) {
	  var children = edgeOrFragment.getChildren();
	  var edgeChildren = [];
	  var hasNodeChild = false;
	  var nodeChildren = [];
	  var hasEdgeChild = false;
	  for (var ii = 0; ii < children.length; ii++) {
	    var child = children[ii];
	    if (child instanceof RelayQuery.Field) {
	      if (child.getSchemaName() === NODE) {
	        var subFields = child.getChildren();
	        nodeChildren = nodeChildren.concat(subFields);
	        // can skip if `node` only has an `id` field
	        hasNodeChild = hasNodeChild || subFields.length !== 1 || !(subFields[0] instanceof RelayQuery.Field) ||
	        /* $FlowFixMe(>=0.13.0) - subFields[0] needs to be in a local for Flow to
	         * narrow its type, otherwise Flow thinks its a RelayQueryNode without
	         * method `getSchemaName`
	         */
	        subFields[0].getSchemaName() !== 'id';
	      } else {
	        edgeChildren.push(child);
	        hasEdgeChild = hasEdgeChild || !child.isRequisite();
	      }
	    } else if (child instanceof RelayQuery.Fragment) {
	      var _splitNodeAndEdgesFields2 = splitNodeAndEdgesFields(child);

	      var edges = _splitNodeAndEdgesFields2.edges;
	      var node = _splitNodeAndEdgesFields2.node;

	      if (edges) {
	        edgeChildren.push(edges);
	        hasEdgeChild = true;
	      }
	      if (node) {
	        nodeChildren.push(node);
	        hasNodeChild = true;
	      }
	    }
	  }
	  return {
	    edges: hasEdgeChild ? edgeOrFragment.clone(edgeChildren) : null,
	    node: hasNodeChild ? edgeOrFragment.clone(nodeChildren) : null
	  };
	}

	function buildRoot(rootID, nodes, name, type) {
	  var children = [idField, typeField];
	  var fields = [];
	  nodes.forEach(function (node) {
	    if (node instanceof RelayQuery.Field) {
	      fields.push(node);
	    } else {
	      children.push(node);
	    }
	  });
	  children.push(RelayQuery.Fragment.build('diffRelayQuery', type, fields));

	  return RelayQuery.Root.build(name, NODE, rootID, children, { identifyingArgName: RelayNodeInterface.ID }, NODE_TYPE);
	}

	module.exports = RelayProfiler.instrument('diffRelayQuery', diffRelayQuery);

/***/ },
/* 148 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Promise = __webpack_require__(16);

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule fetchRelayQuery
	 * @typechecks
	 * 
	 */

	'use strict';

	var RelayNetworkLayer = __webpack_require__(25);
	var RelayProfiler = __webpack_require__(4);
	var RelayQueryRequest = __webpack_require__(133);

	var resolveImmediate = __webpack_require__(49);

	var queue = null;

	/**
	 * @internal
	 *
	 * Schedules the supplied `query` to be sent to the server.
	 *
	 * This is a low-level transport API; application code should use higher-level
	 * interfaces exposed by RelayContainer for retrieving data transparently via
	 * queries defined on components.
	 */
	function fetchRelayQuery(query) {
	  if (!queue) {
	    (function () {
	      queue = [];
	      var currentQueue = queue;
	      resolveImmediate(function () {
	        queue = null;
	        profileQueue(currentQueue);
	        processQueue(currentQueue);
	      });
	    })();
	  }
	  var request = new RelayQueryRequest(query);
	  queue.push(request);
	  return request.getPromise();
	}

	function processQueue(currentQueue) {
	  RelayNetworkLayer.sendQueries(currentQueue);
	}

	/**
	 * Profiles time from request to receiving the first server response.
	 */
	function profileQueue(currentQueue) {
	  // TODO #8783781: remove aggregate `fetchRelayQuery` profiler
	  var firstResultProfiler = RelayProfiler.profile('fetchRelayQuery');
	  currentQueue.forEach(function (query) {
	    var profiler = RelayProfiler.profile('fetchRelayQuery.query');
	    var onSettle = function onSettle() {
	      profiler.stop();
	      if (firstResultProfiler) {
	        firstResultProfiler.stop();
	        firstResultProfiler = null;
	      }
	    };
	    query.getPromise().done(onSettle, onSettle);
	  });
	}

	module.exports = fetchRelayQuery;

/***/ },
/* 149 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule filterExclusiveKeys
	 * @typechecks
	 * 
	 */

	'use strict';

	var _Object$keys = __webpack_require__(10)['default'];

	var hasOwnProperty = Object.prototype.hasOwnProperty;

	/**
	 * Returns two arrays of keys that contain each object's exclusive keys.
	 */
	function filterExclusiveKeys(a, b) {
	  var keysA = a ? _Object$keys(a) : [];
	  var keysB = b ? _Object$keys(b) : [];

	  if (keysA.length === 0 || keysB.length === 0) {
	    return [keysA, keysB];
	  }
	  return [keysA.filter(function (key) {
	    return !hasOwnProperty.call(b, key);
	  }), keysB.filter(function (key) {
	    return !hasOwnProperty.call(a, key);
	  })];
	}

	module.exports = filterExclusiveKeys;

/***/ },
/* 150 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule findRelayQueryLeaves
	 * 
	 * @typechecks
	 */

	'use strict';

	var _inherits = __webpack_require__(5)['default'];

	var _classCallCheck = __webpack_require__(1)['default'];

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	var RelayConnectionInterface = __webpack_require__(7);

	var RelayQueryVisitor = __webpack_require__(18);
	var RelayRecordState = __webpack_require__(27);

	var isCompatibleRelayFragmentType = __webpack_require__(29);

	var EDGES = RelayConnectionInterface.EDGES;
	var PAGE_INFO = RelayConnectionInterface.PAGE_INFO;

	/**
	 * @internal
	 *
	 * Traverses a query and data in the record store to determine if there are
	 * additional nodes that needs to be read from disk cache. If it  ncounters
	 * a node that is not in `cachedRecords`, it will queued that node by adding it
	 * into the `pendingNodes` list. If it encounters a node that was already read
	 * but still missing data, then it will short circuit the evaluation since
	 * there is no way for us to satisfy this query even with additional data from
	 * disk cache and resturn
	 */
	function findRelayQueryLeaves(store, cachedRecords, queryNode, dataID, path, rangeCalls) {
	  var finder = new RelayQueryLeavesFinder(store, cachedRecords);

	  var state = {
	    dataID: dataID,
	    missingData: false,
	    path: path,
	    rangeCalls: rangeCalls,
	    rangeInfo: undefined
	  };
	  finder.visit(queryNode, state);
	  return {
	    missingData: state.missingData,
	    pendingNodes: finder.getPendingNodes()
	  };
	}

	var RelayQueryLeavesFinder = (function (_RelayQueryVisitor) {
	  _inherits(RelayQueryLeavesFinder, _RelayQueryVisitor);

	  function RelayQueryLeavesFinder(store) {
	    var cachedRecords = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	    _classCallCheck(this, RelayQueryLeavesFinder);

	    _RelayQueryVisitor.call(this);
	    this._store = store;
	    this._cachedRecords = cachedRecords;
	    this._pendingNodes = {};
	  }

	  RelayQueryLeavesFinder.prototype.getPendingNodes = function getPendingNodes() {
	    return this._pendingNodes;
	  };

	  /**
	   * Skip visiting children if missingData is already false.
	   */

	  RelayQueryLeavesFinder.prototype.traverse = function traverse(node, state) {
	    var children = node.getChildren();
	    for (var ii = 0; ii < children.length; ii++) {
	      if (state.missingData) {
	        return;
	      }
	      this.visit(children[ii], state);
	    }
	  };

	  RelayQueryLeavesFinder.prototype.visitFragment = function visitFragment(fragment, state) {
	    var dataID = state.dataID;
	    var recordState = this._store.getRecordState(dataID);
	    if (recordState === RelayRecordState.UNKNOWN) {
	      this._handleMissingData(fragment, state);
	      return;
	    } else if (recordState === RelayRecordState.NONEXISTENT) {
	      return;
	    }

	    if (isCompatibleRelayFragmentType(fragment, this._store.getType(dataID))) {
	      this.traverse(fragment, state);
	    }
	  };

	  RelayQueryLeavesFinder.prototype.visitField = function visitField(field, state) {
	    var dataID = state.dataID;
	    var recordState = this._store.getRecordState(dataID);
	    if (recordState === RelayRecordState.UNKNOWN) {
	      this._handleMissingData(field, state);
	      return;
	    } else if (recordState === RelayRecordState.NONEXISTENT) {
	      return;
	    }

	    if (state.rangeCalls && !state.rangeInfo) {
	      var metadata = this._store.getRangeMetadata(dataID, state.rangeCalls);
	      if (metadata) {
	        state.rangeInfo = metadata;
	      }
	    }
	    var rangeInfo = state.rangeInfo;
	    if (rangeInfo && field.getSchemaName() === EDGES) {
	      this._visitEdges(field, state);
	    } else if (rangeInfo && field.getSchemaName() === PAGE_INFO) {
	      this._visitPageInfo(field, state);
	    } else if (field.isScalar()) {
	      this._visitScalar(field, state);
	    } else if (field.isPlural()) {
	      this._visitPlural(field, state);
	    } else if (field.isConnection()) {
	      this._visitConnection(field, state);
	    } else {
	      this._visitLinkedField(field, state);
	    }
	  };

	  RelayQueryLeavesFinder.prototype._visitScalar = function _visitScalar(field, state) {
	    var fieldData = this._store.getField(state.dataID, field.getStorageKey());
	    if (fieldData === undefined) {
	      this._handleMissingData(field, state);
	    }
	  };

	  RelayQueryLeavesFinder.prototype._visitPlural = function _visitPlural(field, state) {
	    var dataIDs = this._store.getLinkedRecordIDs(state.dataID, field.getStorageKey());
	    if (dataIDs === undefined) {
	      this._handleMissingData(field, state);
	      return;
	    }
	    if (dataIDs) {
	      for (var ii = 0; ii < dataIDs.length; ii++) {
	        if (state.missingData) {
	          break;
	        }
	        var nextState = {
	          dataID: dataIDs[ii],
	          missingData: false,
	          path: state.path.getPath(field, dataIDs[ii]),
	          rangeCalls: undefined,
	          rangeInfo: undefined
	        };
	        this.traverse(field, nextState);
	        state.missingData = nextState.missingData;
	      }
	    }
	  };

	  RelayQueryLeavesFinder.prototype._visitConnection = function _visitConnection(field, state) {
	    var calls = field.getCallsWithValues();
	    var dataID = this._store.getLinkedRecordID(state.dataID, field.getStorageKey());
	    if (dataID === undefined) {
	      this._handleMissingData(field, state);
	      return;
	    }
	    if (dataID) {
	      var nextState = {
	        dataID: dataID,
	        missingData: false,
	        path: state.path.getPath(field, dataID),
	        rangeCalls: calls,
	        rangeInfo: null
	      };
	      var metadata = this._store.getRangeMetadata(dataID, calls);
	      if (metadata) {
	        nextState.rangeInfo = metadata;
	      }
	      this.traverse(field, nextState);
	      state.missingData = state.missingData || nextState.missingData;
	    }
	  };

	  RelayQueryLeavesFinder.prototype._visitEdges = function _visitEdges(field, state) {
	    var rangeInfo = state.rangeInfo;
	    // Doesn't have  `__range__` loaded
	    if (!rangeInfo) {
	      this._handleMissingData(field, state);
	      return;
	    }
	    if (rangeInfo.diffCalls.length) {
	      state.missingData = true;
	      return;
	    }
	    var edgeIDs = rangeInfo.requestedEdgeIDs;
	    for (var ii = 0; ii < edgeIDs.length; ii++) {
	      if (state.missingData) {
	        break;
	      }
	      var nextState = {
	        dataID: edgeIDs[ii],
	        missingData: false,
	        path: state.path.getPath(field, edgeIDs[ii]),
	        rangeCalls: undefined,
	        rangeInfo: undefined
	      };
	      this.traverse(field, nextState);
	      state.missingData = state.missingData || nextState.missingData;
	    }
	  };

	  RelayQueryLeavesFinder.prototype._visitPageInfo = function _visitPageInfo(field, state) {
	    var rangeInfo = state.rangeInfo;

	    if (!rangeInfo || !rangeInfo.pageInfo) {
	      this._handleMissingData(field, state);
	      return;
	    }
	  };

	  RelayQueryLeavesFinder.prototype._visitLinkedField = function _visitLinkedField(field, state) {
	    var dataID = this._store.getLinkedRecordID(state.dataID, field.getStorageKey());
	    if (dataID === undefined) {
	      this._handleMissingData(field, state);
	      return;
	    }
	    if (dataID) {
	      var nextState = {
	        dataID: dataID,
	        missingData: false,
	        path: state.path.getPath(field, dataID),
	        rangeCalls: undefined,
	        rangeInfo: undefined
	      };
	      this.traverse(field, nextState);
	      state.missingData = state.missingData || nextState.missingData;
	    }
	  };

	  RelayQueryLeavesFinder.prototype._handleMissingData = function _handleMissingData(node, state) {
	    var dataID = state.dataID;
	    if (this._cachedRecords.hasOwnProperty(dataID)) {
	      // We have read data for this `dataID` from disk, but
	      // we still don't have data for the relevant field.
	      state.missingData = true;
	    } else {
	      // Store node in `pendingNodes` because we have not read data for
	      // this `dataID` from disk.
	      this._pendingNodes[dataID] = this._pendingNodes[dataID] || [];
	      this._pendingNodes[dataID].push({
	        node: node,
	        path: state.path,
	        rangeCalls: state.rangeCalls
	      });
	    }
	  };

	  return RelayQueryLeavesFinder;
	})(RelayQueryVisitor);

	module.exports = findRelayQueryLeaves;

/***/ },
/* 151 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule flattenSplitRelayQueries
	 * 
	 * @typechecks
	 */

	/**
	 * Flattens the nested structure returned by `splitDeferredRelayQueries`.
	 *
	 * Right now our internals discard the information about the relationship
	 * between the queries that is encoded in the nested structure.
	 *
	 * @internal
	 */
	'use strict';

	var _toConsumableArray = __webpack_require__(19)['default'];

	function flattenSplitRelayQueries(splitQueries) {
	  var flattenedQueries = [];
	  var queue = [splitQueries];
	  while (queue.length) {
	    splitQueries = queue.shift();
	    var _splitQueries = splitQueries;
	    var required = _splitQueries.required;
	    var deferred = _splitQueries.deferred;

	    if (required) {
	      flattenedQueries.push(required);
	    }
	    if (deferred.length) {
	      queue.push.apply(queue, _toConsumableArray(deferred));
	    }
	  }
	  return flattenedQueries;
	}

	module.exports = flattenSplitRelayQueries;

/***/ },
/* 152 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule generateRQLFieldAlias
	 * @typechecks
	 */

	'use strict';

	var base62 = __webpack_require__(47);
	var crc32 = __webpack_require__(107);

	var PREFIX = '_';

	/**
	 * Sanitizes a stringified GraphQL field (including any calls and their values)
	 * to produce a valid alias.
	 *
	 * This is used to auto-alias fields in generated queries, so that developers
	 * composing multiple components together don't have to worry about collisions
	 * between components requesting the same fields. (Explicit aliases are only
	 * needed within a single component when it uses the same field multiple times,
	 * in order to differentiate these fields in the props).
	 *
	 * @internal
	 *
	 * @param {string} input
	 * @return {string}
	 */
	function generateRQLFieldAlias(input) {
	  // Field names with no calls can be used as aliases without encoding
	  var index = input.indexOf('.');
	  if (index === -1) {
	    return input;
	  }

	  return PREFIX + input.substr(0, index) + base62(Math.abs(crc32(input)));
	}

	module.exports = generateRQLFieldAlias;

/***/ },
/* 153 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule inferRelayFieldsFromData
	 * @typechecks
	 * 
	 */

	'use strict';

	var _Object$keys = __webpack_require__(10)['default'];

	var GraphQLStoreDataHandler = __webpack_require__(6);
	var RelayConnectionInterface = __webpack_require__(7);
	var RelayNodeInterface = __webpack_require__(12);
	var RelayQuery = __webpack_require__(3);

	var forEachObject = __webpack_require__(9);
	var invariant = __webpack_require__(2);
	var warning = __webpack_require__(11);

	var ARGUMENTS = /^(\w+)(?:\((.+?)\))?$/;
	var ARGUMENT_NAME = /(\w+)(?=\s*:)/;
	var DEPRECATED_CALLS = /^\w+(?:\.\w+\(.*?\))+$/;
	var DEPRECATED_CALL = /^(\w+)\((.*?)\)$/;
	var NODE = RelayConnectionInterface.NODE;
	var EDGES = RelayConnectionInterface.EDGES;
	var ANY_TYPE = RelayNodeInterface.ANY_TYPE;
	var ID = RelayNodeInterface.ID;

	var idField = RelayQuery.Field.build({
	  fieldName: ID,
	  type: 'String'
	});
	var cursorField = RelayQuery.Field.build({
	  fieldName: 'cursor',
	  type: 'String'
	});

	/**
	 * @internal
	 *
	 * Given a record-like object, infers fields that could be used to fetch them.
	 * Properties that are fetched via fields with arguments can be encoded by
	 * serializing the arguments in property keys.
	 */
	function inferRelayFieldsFromData(data) {
	  var fields = [];
	  forEachObject(data, function (value, key) {
	    if (!GraphQLStoreDataHandler.isMetadataKey(key)) {
	      fields.push(inferField(value, key));
	    }
	  });
	  return fields;
	}

	function inferField(value, key) {
	  var metadata = {
	    isPlural: false
	  };
	  var children = undefined;
	  if (Array.isArray(value)) {
	    var element = value[0];
	    if (element && typeof element === 'object') {
	      children = inferRelayFieldsFromData(element);
	    } else {
	      children = [];
	    }
	    metadata.isPlural = true;
	  } else if (typeof value === 'object' && value !== null) {
	    children = inferRelayFieldsFromData(value);
	  } else {
	    children = [];
	  }
	  if (key === NODE) {
	    children.push(idField);
	  } else if (key === EDGES) {
	    children.push(cursorField);
	  }
	  return buildField(key, children, metadata);
	}

	function buildField(key, children, metadata) {
	  var fieldName = key;
	  var calls = null;
	  if (DEPRECATED_CALLS.test(key)) {
	     true ? warning(false, 'inferRelayFieldsFromData(): Encountered an optimistic payload with ' + 'a deprecated field call string, `%s`. Use valid GraphQL OSS syntax.', key) : undefined;
	    var parts = key.split('.');
	    if (parts.length > 1) {
	      fieldName = parts.shift();
	      calls = parts.map(function (callString) {
	        var captures = callString.match(DEPRECATED_CALL);
	        !captures ?  true ? invariant(false, 'inferRelayFieldsFromData(): Malformed data key, `%s`.', key) : invariant(false) : undefined;
	        var value = captures[2].split(',');
	        return {
	          name: captures[1],
	          value: value.length === 1 ? value[0] : value
	        };
	      });
	    }
	  } else {
	    var captures = key.match(ARGUMENTS);
	    !captures ?  true ? invariant(false, 'inferRelayFieldsFromData(): Malformed data key, `%s`.', key) : invariant(false) : undefined;
	    fieldName = captures[1];
	    if (captures[2]) {
	      try {
	        (function () {
	          // Relay does not currently have a GraphQL argument parser, so...
	          var args = JSON.parse('{' + captures[2].replace(ARGUMENT_NAME, '"$1"') + '}');
	          calls = _Object$keys(args).map(function (name) {
	            return { name: name, value: args[name] };
	          });
	        })();
	      } catch (error) {
	         true ?  true ? invariant(false, 'inferRelayFieldsFromData(): Malformed or unsupported data key, ' + '`%s`. Only booleans, strings, and numbers are currenly supported, ' + 'and commas are required. Parse failure reason was `%s`.', key, error.message) : invariant(false) : undefined;
	      }
	    }
	  }
	  return RelayQuery.Field.build({
	    calls: calls,
	    children: children,
	    fieldName: fieldName,
	    metadata: metadata,
	    type: ANY_TYPE
	  });
	}

	module.exports = inferRelayFieldsFromData;

/***/ },
/* 154 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule intersectRelayQuery
	 * @typechecks
	 * 
	 */

	'use strict';

	var _inherits = __webpack_require__(5)['default'];

	var _classCallCheck = __webpack_require__(1)['default'];

	var RelayConnectionInterface = __webpack_require__(7);
	var RelayQuery = __webpack_require__(3);
	var RelayQueryTransform = __webpack_require__(52);

	var invariant = __webpack_require__(2);

	/**
	 * @internal
	 *
	 * `intersectRelayQuery(subjectNode, patternNode)` returns a node with fields in
	 * `subjectNode` that also exist in `patternNode`. `patternNode` is expected to
	 * be flattened (and not contain fragments).
	 *
	 * If any field in `patternNode` is unterminated (i.e. has no sub-fields), we
	 * treat the field as though it contains every descendant sub-field.
	 *
	 * If `filterUnterminatedRange` is supplied, it will be invoked with any fields
	 * from `subjectNode` that are connections and unterminated in `patternNode`. If
	 * it returns true, the `edges` and `page_info` fields will be filtered out.
	 */
	function intersectRelayQuery(subjectNode, patternNode, filterUnterminatedRange) {
	  filterUnterminatedRange = filterUnterminatedRange || returnsFalse;
	  var visitor = new RelayQueryIntersector(filterUnterminatedRange);
	  return visitor.traverse(subjectNode, patternNode);
	}

	var RelayQueryIntersector = (function (_RelayQueryTransform) {
	  _inherits(RelayQueryIntersector, _RelayQueryTransform);

	  function RelayQueryIntersector(filterUnterminatedRange) {
	    _classCallCheck(this, RelayQueryIntersector);

	    _RelayQueryTransform.call(this);
	    this._filterUnterminatedRange = filterUnterminatedRange;
	  }

	  /**
	   * @private
	   */

	  RelayQueryIntersector.prototype.traverse = function traverse(subjectNode, patternNode) {
	    var _this = this;

	    if (subjectNode.isScalar()) {
	      // Since `patternNode` exists, `subjectNode` must be in the intersection.
	      return subjectNode;
	    }
	    if (!hasChildren(patternNode)) {
	      if (subjectNode instanceof RelayQuery.Field && subjectNode.isConnection() && this._filterUnterminatedRange(subjectNode)) {
	        return filterRangeFields(subjectNode);
	      }
	      // Unterminated `patternNode` is the same as containing every descendant
	      // sub-field, so `subjectNode` must be in the intersection.
	      return subjectNode;
	    }
	    return subjectNode.clone(subjectNode.getChildren().map(function (subjectChild) {
	      if (subjectChild instanceof RelayQuery.Fragment) {
	        return _this.visit(subjectChild, patternNode);
	      }
	      if (subjectChild instanceof RelayQuery.Field) {
	        var schemaName = subjectChild.getSchemaName();
	        var patternChild;
	        var patternChildren = patternNode.getChildren();
	        for (var ii = 0; ii < patternChildren.length; ii++) {
	          var child = patternChildren[ii];
	          !(child instanceof RelayQuery.Field) ?  true ? invariant(false, 'intersectRelayQuery(): Nodes in `patternNode` must be fields.') : invariant(false) : undefined;
	          if (child.getSchemaName() === schemaName) {
	            patternChild = child;
	            break;
	          }
	        }
	        if (patternChild) {
	          return _this.visit(subjectChild, patternChild);
	        }
	      }
	      return null;
	    }));
	  };

	  return RelayQueryIntersector;
	})(RelayQueryTransform);

	var RelayQueryRangeFilter = (function (_RelayQueryTransform2) {
	  _inherits(RelayQueryRangeFilter, _RelayQueryTransform2);

	  function RelayQueryRangeFilter() {
	    _classCallCheck(this, RelayQueryRangeFilter);

	    _RelayQueryTransform2.apply(this, arguments);
	  }

	  RelayQueryRangeFilter.prototype.visitField = function visitField(node) {
	    var schemaName = node.getSchemaName();
	    if (schemaName === RelayConnectionInterface.EDGES || schemaName === RelayConnectionInterface.PAGE_INFO) {
	      return null;
	    } else {
	      return node;
	    }
	  };

	  return RelayQueryRangeFilter;
	})(RelayQueryTransform);

	var rangeFilter = new RelayQueryRangeFilter();
	function filterRangeFields(node) {
	  return rangeFilter.traverse(node, undefined);
	}

	function returnsFalse() {
	  return false;
	}

	function hasChildren(node) {
	  return !node.getChildren().every(isGenerated);
	}

	function isGenerated(node) {
	  return node.isGenerated();
	}

	module.exports = intersectRelayQuery;

/***/ },
/* 155 */
/***/ function(module, exports) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule isReactComponent
	 * @typechecks
	 * 
	 */

	'use strict';

	/**
	 * @internal
	 *
	 * Helper for checking if this is a React Component
	 * created with React.Component or React.createClass().
	 */
	function isReactComponent(component) {
	  return !!(component && component.prototype && component.prototype.isReactComponent);
	}

	module.exports = isReactComponent;

/***/ },
/* 156 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule prepareRelayContainerProps
	 */

	'use strict';

	module.exports = __webpack_require__(157);

/***/ },
/* 157 */
/***/ function(module, exports) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule prepareRelayOSSContainerProps
	 * @typechecks
	 * 
	 */

	'use strict';

	/**
	 * @internal
	 *
	 * Provides an opportunity for Relay to fork how RelayContainer props are spread
	 * into the inner component.
	 */
	function prepareRelayOSSContainerProps(relayProps) {
	  return { relay: relayProps };
	}

	module.exports = prepareRelayOSSContainerProps;

/***/ },
/* 158 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule printRelayOSSQuery
	 * @typechecks
	 * 
	 */

	'use strict';

	var _toConsumableArray = __webpack_require__(19)['default'];

	var RelayProfiler = __webpack_require__(4);
	var RelayQuery = __webpack_require__(3);

	var base62 = __webpack_require__(47);
	var forEachObject = __webpack_require__(9);
	var invariant = __webpack_require__(2);
	var mapObject = __webpack_require__(48);

	/**
	 * @internal
	 *
	 * `printRelayOSSQuery(query)` returns a string representation of the query. The
	 * supplied `node` must be flattened (and not contain fragments).
	 */
	function printRelayOSSQuery(node) {
	  var printerState = {
	    fragmentCount: 0,
	    fragmentNameByID: {},
	    fragmentNameByText: {},
	    fragmentTexts: [],
	    variableCount: 0,
	    variableMap: {}
	  };
	  var queryText = null;
	  if (node instanceof RelayQuery.Root) {
	    queryText = printRoot(node, printerState);
	  } else if (node instanceof RelayQuery.Mutation) {
	    queryText = printMutation(node, printerState);
	  } else {
	    // NOTE: `node` shouldn't be a field or fragment except for debugging. There
	    // is no guarantee that it would be a valid server request if printed.
	    if (node instanceof RelayQuery.Fragment) {
	      queryText = printFragment(node, printerState);
	    } else if (node instanceof RelayQuery.Field) {
	      queryText = printField(node, printerState);
	    }
	  }
	  !queryText ?  true ? invariant(false, 'printRelayOSSQuery(): Unsupported node type.') : invariant(false) : undefined;
	  return {
	    text: [queryText].concat(_toConsumableArray(printerState.fragmentTexts)).join(' '),
	    variables: mapObject(printerState.variableMap, function (variable) {
	      return variable.value;
	    })
	  };
	}

	function printRoot(node, printerState) {
	  !!node.getBatchCall() ?  true ? invariant(false, 'printRelayOSSQuery(): Deferred queries are not supported.') : invariant(false) : undefined;
	  var identifyingArg = node.getIdentifyingArg();
	  var identifyingArgName = identifyingArg && identifyingArg.name || null;
	  var identifyingArgType = identifyingArg && identifyingArg.type || null;
	  var identifyingArgValue = identifyingArg && identifyingArg.value || null;
	  var fieldName = node.getFieldName();
	  if (identifyingArgValue != null) {
	    !identifyingArgName ?  true ? invariant(false, 'printRelayOSSQuery(): Expected an argument name for root field `%s`.', fieldName) : invariant(false) : undefined;
	    var rootArgString = printArgument(identifyingArgName, identifyingArgValue, identifyingArgType, printerState);
	    if (rootArgString) {
	      fieldName += '(' + rootArgString + ')';
	    }
	  }
	  // Note: children must be traversed before printing variable definitions
	  var children = printChildren(node, printerState);
	  var queryString = node.getName() + printVariableDefinitions(printerState);
	  fieldName += printDirectives(node);

	  return 'query ' + queryString + '{' + fieldName + children + '}';
	}

	function printMutation(node, printerState) {
	  var call = node.getCall();
	  var inputString = printArgument(node.getCallVariableName(), call.value, node.getInputType(), printerState);
	  !inputString ?  true ? invariant(false, 'printRelayOSSQuery(): Expected mutation `%s` to have a value for `%s`.', node.getName(), node.getCallVariableName()) : invariant(false) : undefined;
	  // Note: children must be traversed before printing variable definitions
	  var children = printChildren(node, printerState);
	  var mutationString = node.getName() + printVariableDefinitions(printerState);
	  var fieldName = call.name + '(' + inputString + ')';

	  return 'mutation ' + mutationString + '{' + fieldName + children + '}';
	}

	function printVariableDefinitions(printerState) {
	  var argStrings = null;
	  forEachObject(printerState.variableMap, function (variable, variableID) {
	    argStrings = argStrings || [];
	    argStrings.push('$' + variableID + ':' + variable.type);
	  });
	  if (argStrings) {
	    return '(' + argStrings.join(',') + ')';
	  }
	  return '';
	}

	function printFragment(node, printerState) {
	  var directives = printDirectives(node);
	  return 'fragment ' + node.getDebugName() + ' on ' + node.getType() + directives + printChildren(node, printerState);
	}

	function printInlineFragment(node, printerState) {
	  if (!node.getChildren().length) {
	    return null;
	  }
	  var fragmentNameByID = printerState.fragmentNameByID;
	  var fragmentNameByText = printerState.fragmentNameByText;
	  var fragmentTexts = printerState.fragmentTexts;

	  // Try not to print the same fragment more than once by using a cheap lookup
	  // using the fragment ID. (This will only work for fragments that have not
	  // been cloned with new children.)
	  var fragmentID = node.hasConcreteFragmentHash() ? node.getFragmentID() : null;

	  var fragmentName = undefined;
	  if (fragmentID != null && fragmentNameByID.hasOwnProperty(fragmentID)) {
	    fragmentName = fragmentNameByID[fragmentID];
	  } else {
	    // Never re-print a fragment that is identical when printed to a previously
	    // printed fragment. Instead, re-use that previous fragment's name.
	    var _fragmentText = node.getType() + printDirectives(node) + printChildren(node, printerState);
	    if (fragmentNameByText.hasOwnProperty(_fragmentText)) {
	      fragmentName = fragmentNameByText[_fragmentText];
	    } else {
	      fragmentName = 'F' + base62(printerState.fragmentCount++);
	      if (fragmentID != null) {
	        fragmentNameByID[fragmentID] = fragmentName;
	      }
	      fragmentNameByText[_fragmentText] = fragmentName;
	      fragmentTexts.push('fragment ' + fragmentName + ' on ' + _fragmentText);
	    }
	  }
	  return '...' + fragmentName;
	}

	function printField(node, printerState) {
	  !(node instanceof RelayQuery.Field) ?  true ? invariant(false, 'printRelayOSSQuery(): Query must be flattened before printing.') : invariant(false) : undefined;
	  var schemaName = node.getSchemaName();
	  var serializationKey = node.getSerializationKey();
	  var callsWithValues = node.getCallsWithValues();
	  var fieldString = schemaName;
	  var argStrings = null;
	  if (callsWithValues.length) {
	    callsWithValues.forEach(function (_ref) {
	      var name = _ref.name;
	      var value = _ref.value;

	      var argString = printArgument(name, value, node.getCallType(name), printerState);
	      if (argString) {
	        argStrings = argStrings || [];
	        argStrings.push(argString);
	      }
	    });
	    if (argStrings) {
	      fieldString += '(' + argStrings.join(',') + ')';
	    }
	  }
	  var directives = printDirectives(node);
	  return (serializationKey !== schemaName ? serializationKey + ':' : '') + fieldString + directives + printChildren(node, printerState);
	}

	function printChildren(node, printerState) {
	  var children = undefined;
	  var fragments = undefined;
	  node.getChildren().forEach(function (node) {
	    if (node instanceof RelayQuery.Field) {
	      children = children || [];
	      children.push(printField(node, printerState));
	    } else {
	      !(node instanceof RelayQuery.Fragment) ?  true ? invariant(false, 'printRelayOSSQuery(): expected child node to be a `Field` or ' + '`Fragment`, got `%s`.', node.constructor.name) : invariant(false) : undefined;
	      var printedFragment = printInlineFragment(node, printerState);
	      if (printedFragment && !(fragments && fragments.hasOwnProperty(printedFragment))) {
	        fragments = fragments || {};
	        fragments[printedFragment] = true;
	        children = children || [];
	        children.push(printedFragment);
	      }
	    }
	  });
	  if (!children) {
	    return '';
	  }
	  return '{' + children.join(',') + '}';
	}

	function printDirectives(node) {
	  var directiveStrings = undefined;
	  node.getDirectives().forEach(function (directive) {
	    var dirString = '@' + directive.name;
	    if (directive.arguments.length) {
	      dirString += '(' + directive.arguments.map(printDirective).join(',') + ')';
	    }
	    directiveStrings = directiveStrings || [];
	    directiveStrings.push(dirString);
	  });
	  if (!directiveStrings) {
	    return '';
	  }
	  return ' ' + directiveStrings.join(' ');
	}

	function printDirective(_ref2) {
	  var name = _ref2.name;
	  var value = _ref2.value;

	  !(typeof value === 'boolean' || typeof value === 'number' || typeof value === 'string') ?  true ? invariant(false, 'printRelayOSSQuery(): Relay only supports directives with scalar values ' + '(boolean, number, or string), got `%s: %s`.', name, value) : invariant(false) : undefined;
	  return name + ':' + JSON.stringify(value);
	}

	function printArgument(name, value, type, printerState) {
	  if (value == null) {
	    return value;
	  }
	  var stringValue = undefined;
	  if (type != null) {
	    var _variableID = createVariable(name, value, type, printerState);
	    stringValue = '$' + _variableID;
	  } else {
	    stringValue = JSON.stringify(value);
	  }
	  return name + ':' + stringValue;
	}

	function createVariable(name, value, type, printerState) {
	  var variableID = name + '_' + base62(printerState.variableCount++);
	  printerState.variableMap[variableID] = {
	    type: type,
	    value: value
	  };
	  return variableID;
	}

	module.exports = RelayProfiler.instrument('printRelayQuery', printRelayOSSQuery);

/***/ },
/* 159 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule readRelayDiskCache
	 * 
	 * @typechecks
	 */

	'use strict';

	var _classCallCheck = __webpack_require__(1)['default'];

	var GraphQLStoreDataHandler = __webpack_require__(6);
	var RelayChangeTracker = __webpack_require__(76);

	var RelayQuery = __webpack_require__(3);
	var RelayQueryPath = __webpack_require__(26);

	var findRelayQueryLeaves = __webpack_require__(150);

	var forEachObject = __webpack_require__(9);
	var forEachRootCallArg = __webpack_require__(28);
	var invariant = __webpack_require__(2);
	var isEmpty = __webpack_require__(210);

	/**
	 * @internal
	 *
	 * Retrieves data for a query from disk into `cachedRecords` in RelayStore.
	 */
	function readRelayDiskCache(queries, store, cachedRecords, cachedRootCallMap, cacheManager, changeTracker, callbacks) {
	  var reader = new RelayCacheReader(store, cachedRecords, cachedRootCallMap, cacheManager, changeTracker, callbacks);

	  reader.read(queries);
	}

	var RelayCacheReader = (function () {
	  function RelayCacheReader(store, cachedRecords, cachedRootCallMap, cacheManager, changeTracker, callbacks) {
	    _classCallCheck(this, RelayCacheReader);

	    this._store = store;
	    this._cachedRecords = cachedRecords;
	    this._cachedRootCallMap = cachedRootCallMap;
	    this._cacheManager = cacheManager;
	    this._callbacks = callbacks;
	    this._changeTracker = changeTracker;

	    this._hasFailed = false;
	    this._pendingNodes = {};
	    this._pendingRoots = {};
	  }

	  RelayCacheReader.prototype.read = function read(queries) {
	    var _this = this;

	    forEachObject(queries, function (query) {
	      if (_this._hasFailed) {
	        return;
	      }
	      if (query) {
	        (function () {
	          var storageKey = query.getStorageKey();
	          forEachRootCallArg(query, function (identifyingArgValue) {
	            if (_this._hasFailed) {
	              return;
	            }
	            identifyingArgValue = identifyingArgValue || '';
	            _this._visitRoot(storageKey, identifyingArgValue, query);
	          });
	        })();
	      }
	    });

	    if (this._isDone()) {
	      this._callbacks.onSuccess && this._callbacks.onSuccess();
	    }
	  };

	  RelayCacheReader.prototype._visitRoot = function _visitRoot(storageKey, identifyingArgValue, query) {
	    var dataID = this._store.getDataID(storageKey, identifyingArgValue);
	    if (dataID == null) {
	      if (this._cachedRootCallMap.hasOwnProperty(storageKey) && this._cachedRootCallMap[storageKey].hasOwnProperty(identifyingArgValue)) {
	        // Already attempted to read this root from cache.
	        this._handleFailed();
	      } else {
	        this._queueRoot(storageKey, identifyingArgValue, query);
	      }
	    } else {
	      this._visitNode(dataID, {
	        node: query,
	        path: new RelayQueryPath(query),
	        rangeCalls: undefined
	      });
	    }
	  };

	  RelayCacheReader.prototype._queueRoot = function _queueRoot(storageKey, identifyingArgValue, query) {
	    var _this2 = this;

	    var rootKey = storageKey + '*' + identifyingArgValue;
	    if (this._pendingRoots.hasOwnProperty(rootKey)) {
	      this._pendingRoots[rootKey].push(query);
	    } else {
	      this._pendingRoots[rootKey] = [query];
	      this._cacheManager.readRootCall(storageKey, identifyingArgValue, function (error, value) {
	        if (_this2._hasFailed) {
	          return;
	        }
	        if (error) {
	          _this2._handleFailed();
	          return;
	        }
	        var roots = _this2._pendingRoots[rootKey];
	        delete _this2._pendingRoots[rootKey];

	        _this2._cachedRootCallMap[storageKey] = _this2._cachedRootCallMap[storageKey] || {};
	        _this2._cachedRootCallMap[storageKey][identifyingArgValue] = value;
	        if (_this2._cachedRootCallMap[storageKey][identifyingArgValue] == null) {
	          // Read from cache and we still don't have valid `dataID`.
	          _this2._handleFailed();
	        } else {
	          (function () {
	            var dataID = value;
	            roots.forEach(function (root) {
	              if (_this2._hasFailed) {
	                return;
	              }
	              _this2._visitNode(dataID, {
	                node: root,
	                path: new RelayQueryPath(root),
	                rangeCalls: undefined
	              });
	            });
	          })();
	        }
	        if (_this2._isDone()) {
	          _this2._callbacks.onSuccess && _this2._callbacks.onSuccess();
	        }
	      });
	    }
	  };

	  RelayCacheReader.prototype._visitNode = function _visitNode(dataID, pendingItem) {
	    var _this3 = this;

	    var _findRelayQueryLeaves = findRelayQueryLeaves(this._store, this._cachedRecords, pendingItem.node, dataID, pendingItem.path, pendingItem.rangeCalls);

	    var missingData = _findRelayQueryLeaves.missingData;
	    var pendingNodes = _findRelayQueryLeaves.pendingNodes;

	    if (missingData) {
	      this._handleFailed();
	      return;
	    }
	    forEachObject(pendingNodes, function (pendingItems, dataID) {
	      _this3._queueNode(dataID, pendingItems);
	    });
	  };

	  RelayCacheReader.prototype._queueNode = function _queueNode(dataID, pendingItems) {
	    var _this4 = this;

	    if (this._pendingNodes.hasOwnProperty(dataID)) {
	      var _pendingNodes$dataID;

	      (_pendingNodes$dataID = this._pendingNodes[dataID]).push.apply(_pendingNodes$dataID, pendingItems);
	    } else {
	      this._pendingNodes[dataID] = pendingItems;
	      this._cacheManager.readNode(dataID, function (error, value) {
	        if (_this4._hasFailed) {
	          return;
	        }
	        if (error) {
	          _this4._handleFailed();
	          return;
	        }
	        if (value && GraphQLStoreDataHandler.isClientID(dataID)) {
	          value.__path__ = pendingItems[0].path;
	        }
	        // Mark records as created/updated as necessary. Note that if the
	        // record is known to be deleted in the store then it will have been
	        // been marked as created already. Further, it does not need to be
	        // updated since no additional data can be read about a deleted node.
	        var recordState = _this4._store.getRecordState(dataID);
	        if (recordState === 'UNKNOWN' && value !== undefined) {
	          // Mark as created if the store did not have a value but disk cache
	          // did (either a known value or known deletion).
	          _this4._changeTracker.createID(dataID);
	        } else if (recordState === 'EXISTENT' && value != null) {
	          // Mark as updated only if a record exists in both the store and
	          // disk cache.
	          _this4._changeTracker.updateID(dataID);
	        }
	        _this4._cachedRecords[dataID] = value;
	        var items = _this4._pendingNodes[dataID];
	        delete _this4._pendingNodes[dataID];
	        if (_this4._cachedRecords[dataID] === undefined) {
	          // We are out of luck if disk doesn't have the node either.
	          _this4._handleFailed();
	        } else {
	          items.forEach(function (item) {
	            if (_this4._hasFailed) {
	              return;
	            }
	            _this4._visitNode(dataID, item);
	          });
	        }
	        if (_this4._isDone()) {
	          _this4._callbacks.onSuccess && _this4._callbacks.onSuccess();
	        }
	      });
	    }
	  };

	  RelayCacheReader.prototype._isDone = function _isDone() {
	    return isEmpty(this._pendingRoots) && isEmpty(this._pendingNodes) && !this._hasFailed;
	  };

	  RelayCacheReader.prototype._handleFailed = function _handleFailed() {
	    !!this._hasFailed ?  true ? invariant(false, 'RelayStoreReader: Query set already failed') : invariant(false) : undefined;

	    this._hasFailed = true;
	    this._callbacks.onFailure && this._callbacks.onFailure();
	  };

	  return RelayCacheReader;
	})();

	module.exports = readRelayDiskCache;

/***/ },
/* 160 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule recycleNodesInto
	 * @typechecks
	 * 
	 */

	'use strict';

	var _Object$keys = __webpack_require__(10)['default'];

	var GraphQLFragmentPointer = __webpack_require__(20);

	/**
	 * Recycles subtrees from `prevData` by replacing equal subtrees in `nextData`.
	 */
	function recycleNodesInto(prevData, nextData) {
	  if (typeof prevData !== 'object' || !prevData || typeof nextData !== 'object' || !nextData) {
	    return nextData;
	  }
	  var canRecycle = false;
	  if (prevData instanceof GraphQLFragmentPointer) {
	    canRecycle = nextData instanceof GraphQLFragmentPointer && nextData.equals(prevData);
	  } else {
	    var isPrevArray = Array.isArray(prevData);
	    var isNextArray = Array.isArray(nextData);
	    if (isPrevArray && isNextArray) {
	      // Assign local variables to preserve Flow type refinement.
	      var prevArray = prevData;
	      var nextArray = nextData;
	      canRecycle = nextArray.reduce(function (wasEqual, nextItem, ii) {
	        nextArray[ii] = recycleNodesInto(prevArray[ii], nextItem);
	        return wasEqual && nextArray[ii] === prevArray[ii];
	      }, true) && prevArray.length === nextArray.length;
	    } else if (!isPrevArray && !isNextArray) {
	      // Assign local variables to preserve Flow type refinement.
	      var prevObject = prevData;
	      var nextObject = nextData;
	      var prevKeys = _Object$keys(prevObject);
	      var nextKeys = _Object$keys(nextObject);
	      canRecycle = nextKeys.reduce(function (wasEqual, key) {
	        var nextValue = nextObject[key];
	        nextObject[key] = recycleNodesInto(prevObject[key], nextValue);
	        return wasEqual && nextObject[key] === prevObject[key];
	      }, true) && prevKeys.length === nextKeys.length;
	    }
	  }
	  return canRecycle ? prevData : nextData;
	}

	module.exports = recycleNodesInto;

/***/ },
/* 161 */
/***/ function(module, exports) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule sortTypeFirst
	 * @typechecks
	 * 
	 */

	'use strict';

	var TYPE = '__type__';

	function sortTypeFirst(a, b) {
	  if (a === b) {
	    return 0;
	  }
	  if (a === TYPE) {
	    return -1;
	  }
	  if (b === TYPE) {
	    return 1;
	  }
	  return 0;
	}

	module.exports = sortTypeFirst;

/***/ },
/* 162 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule splitDeferredRelayQueries
	 * 
	 * @typechecks
	 */

	'use strict';

	var _inherits = __webpack_require__(5)['default'];

	var _classCallCheck = __webpack_require__(1)['default'];

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	var QueryBuilder = __webpack_require__(17);
	var RelayNodeInterface = __webpack_require__(12);
	var RelayProfiler = __webpack_require__(4);
	var RelayQuery = __webpack_require__(3);
	var RelayQueryTransform = __webpack_require__(52);
	var RelayRefQueryDescriptor = __webpack_require__(139);

	var invariant = __webpack_require__(2);

	/**
	 * Traverse `node` splitting off deferred query fragments into separate queries.
	 *
	 * @internal
	 */
	function splitDeferredRelayQueries(node) {
	  var splitter = new GraphQLSplitDeferredQueries();
	  var splitQueries = {
	    __nodePath__: [],
	    __parent__: null,
	    __refQuery__: null,
	    deferred: [],
	    required: null
	  };
	  splitter.visit(node, splitQueries);

	  return buildQueries(splitQueries);
	}

	/**
	 * Returns the requisite siblings of `node`, but filters any non-requisite
	 * children of those siblings.
	 */
	function getRequisiteSiblings(node, parent) {
	  // Get the requisite siblings.
	  var siblings = parent.getChildren().filter(function (child) {
	    return child !== node && child instanceof RelayQuery.Field && child.isRequisite();
	  });

	  // Filter the non-requisite children from those siblings.
	  return siblings.map(function (sibling) {
	    var children = sibling.getChildren().filter(function (child) {
	      return child instanceof RelayQuery.Field && child.isRequisite();
	    });
	    var clone = sibling.clone(children);
	    !clone ?  true ? invariant(false, 'splitDeferredRelayQueries(): Unexpected non-scalar, requisite field.') : invariant(false) : undefined;
	    return clone;
	  });
	}

	/**
	 * Traverse the parent chain of `node` wrapping it at each level until it is
	 * either:
	 *
	 * - wrapped in a RelayQuery.Root node
	 * - wrapped in a non-root node that can be split off in a "ref query" (ie. a
	 *   root call with a ref param that references another query)
	 *
	 * Additionally ensures that any requisite sibling fields are embedded in each
	 * layer of the wrapper.
	 */
	function wrapNode(node, nodePath) {
	  for (var ii = nodePath.length - 1; ii >= 0; ii--) {
	    var _parent = nodePath[ii];
	    if (_parent instanceof RelayQuery.Field && _parent.getInferredRootCallName()) {
	      // We can make a "ref query" at this point, so stop wrapping.
	      return new RelayRefQueryDescriptor(node, nodePath.slice(0, ii + 1));
	    }

	    var siblings = getRequisiteSiblings(node, _parent);
	    var children = [node].concat(siblings);

	    // Cast here because we know that `clone` will never return `null` (because
	    // we always give it at least one child).
	    node = _parent.clone(children);
	  }
	  !(node instanceof RelayQuery.Root) ?  true ? invariant(false, 'splitDeferredRelayQueries(): Cannot build query without a root node.') : invariant(false) : undefined;
	  var identifyingArg = node.getIdentifyingArg();
	  var identifyingArgName = identifyingArg && identifyingArg.name || null;
	  var identifyingArgValue = identifyingArg && identifyingArg.value || null;
	  var metadata = {
	    identifyingArgName: identifyingArgName,
	    isDeferred: true
	  };
	  return RelayQuery.Root.build(node.getName(), node.getFieldName(), identifyingArgValue, node.getChildren(), metadata, node.getType());
	}

	/**
	 * Returns `true` if `node` is considered "empty", which means that it contains
	 * no non-generated fields, and no ref query dependencies.
	 */
	function isEmpty(node) {
	  if (node.isScalar()) {
	    return node.isGenerated() && !node.isRefQueryDependency();
	  } else {
	    return node.getChildren().every(isEmpty);
	  }
	}

	/**
	 * Mutates and returns a nested `SplitQueries` structure, updating any deferred
	 * "ref queries" to actually reference their contexts.
	 */
	function buildQueries(splitQueries) {
	  if (splitQueries.required && isEmpty(splitQueries.required)) {
	    splitQueries.required = null;
	  }
	  splitQueries.deferred = splitQueries.deferred.map(function (nestedSplitQueries) {
	    var descriptor = nestedSplitQueries.__refQuery__;
	    if (descriptor) {
	      // Wrap the ref query node with a reference to the required query that is
	      // its context.
	      var context = splitQueries.required;
	      if (!context) {
	        // Traverse upwards looking for context.
	        var parentSplitQueries = splitQueries;
	        while (parentSplitQueries.__parent__) {
	          context = parentSplitQueries.__parent__.required;
	          if (context) {
	            break;
	          }
	          parentSplitQueries = parentSplitQueries.__parent__;
	        }
	      }
	      !context ?  true ? invariant(false, 'splitDeferredRelayQueries(): Expected a context root query.') : invariant(false) : undefined;
	      nestedSplitQueries.required = createRefQuery(descriptor, context);
	    }

	    return buildQueries(nestedSplitQueries);
	  });
	  return splitQueries;
	}

	/**
	 * Wraps `descriptor` in a new top-level ref query.
	 */
	function createRefQuery(descriptor, context) {
	  var node = descriptor.node;
	  !(node instanceof RelayQuery.Field || node instanceof RelayQuery.Fragment) ?  true ? invariant(false, 'splitDeferredRelayQueries(): Ref query requires a field or fragment.') : invariant(false) : undefined;

	  // Build up JSONPath.
	  var jsonPath = ['$', '*'];
	  var parent = undefined;
	  for (var ii = 0; ii < descriptor.nodePath.length; ii++) {
	    parent = descriptor.nodePath[ii];
	    if (parent instanceof RelayQuery.Field) {
	      jsonPath.push(parent.getSerializationKey());
	      if (parent.isPlural()) {
	        jsonPath.push('*');
	      }
	    }
	  }
	  !(jsonPath.length > 2) ?  true ? invariant(false, 'splitDeferredRelayQueries(): Ref query requires a complete path.') : invariant(false) : undefined;
	  var field = parent; // Flow
	  var primaryKey = field.getInferredPrimaryKey();
	  !primaryKey ?  true ? invariant(false, 'splitDeferredRelayQueries(): Ref query requires a primary key.') : invariant(false) : undefined;
	  jsonPath.push(primaryKey);

	  // Create the wrapper root query.
	  var root = RelayQuery.Root.build(context.getName(), RelayNodeInterface.NODES, QueryBuilder.createBatchCallVariable(context.getID(), jsonPath.join('.')), [node], {
	    identifyingArgName: RelayNodeInterface.ID,
	    isDeferred: true
	  }, RelayNodeInterface.NODE_TYPE);

	  var result = root; // Flow
	  return result;
	}

	/**
	 * Traverses an input query, updating the passed in `SplitQueries` state object
	 * to contain a nested structure representing the required and deferred portions
	 * of the input query.
	 */

	var GraphQLSplitDeferredQueries = (function (_RelayQueryTransform) {
	  _inherits(GraphQLSplitDeferredQueries, _RelayQueryTransform);

	  function GraphQLSplitDeferredQueries() {
	    _classCallCheck(this, GraphQLSplitDeferredQueries);

	    _RelayQueryTransform.apply(this, arguments);
	  }

	  GraphQLSplitDeferredQueries.prototype.visitField = function visitField(node, splitQueries) {
	    if (!node.hasDeferredDescendant()) {
	      return node;
	    }

	    splitQueries.__nodePath__.push(node);
	    var result = this.traverse(node, splitQueries);
	    splitQueries.__nodePath__.pop();

	    if (result && node.getInferredRootCallName()) {
	      (function () {
	        // The node is a ref query dependency; mark it as one.
	        var key = node.getInferredPrimaryKey();
	        var children = result.getChildren().map(function (child) {
	          if (child instanceof RelayQuery.Field && child.getSchemaName() === key) {
	            return child.cloneAsRefQueryDependency();
	          } else {
	            return child;
	          }
	        });
	        result = result.clone(children);
	      })();
	    }

	    return result;
	  };

	  GraphQLSplitDeferredQueries.prototype.visitFragment = function visitFragment(node, splitQueries) {
	    if (!node.getChildren().length) {
	      return null;
	    }

	    if (node.isDeferred()) {
	      var nodePath = splitQueries.__nodePath__;
	      var _deferred = {
	        __nodePath__: nodePath,
	        __parent__: splitQueries,
	        __refQuery__: null,
	        deferred: [],
	        required: null
	      };
	      var result = this.traverse(node, _deferred);
	      if (result) {
	        var wrapped = wrapNode(result, nodePath);
	        if (wrapped instanceof RelayQuery.Root) {
	          _deferred.required = wrapped;
	        } else if (wrapped instanceof RelayRefQueryDescriptor) {
	          // for Flow
	          _deferred.__refQuery__ = wrapped;
	        }
	      }
	      if (result || _deferred.deferred.length) {
	        splitQueries.deferred.push(_deferred);
	      }
	      return null;
	    } else if (node.hasDeferredDescendant()) {
	      return this.traverse(node, splitQueries);
	    } else {
	      return node;
	    }
	  };

	  GraphQLSplitDeferredQueries.prototype.visitRoot = function visitRoot(node, splitQueries) {
	    if (!node.hasDeferredDescendant()) {
	      splitQueries.required = node;
	      return node;
	    } else {
	      splitQueries.__nodePath__.push(node);
	      var result = this.traverse(node, splitQueries);
	      splitQueries.__nodePath__.pop();
	      splitQueries.required = result;
	      return result;
	    }
	  };

	  return GraphQLSplitDeferredQueries;
	})(RelayQueryTransform);

	module.exports = RelayProfiler.instrument('splitDeferredRelayQueries', splitDeferredRelayQueries);

/***/ },
/* 163 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule subtractRelayQuery
	 * 
	 * @typechecks
	 */

	'use strict';

	var _inherits = __webpack_require__(5)['default'];

	var _classCallCheck = __webpack_require__(1)['default'];

	var RelayProfiler = __webpack_require__(4);
	var RelayQuery = __webpack_require__(3);
	var RelayQueryTransform = __webpack_require__(52);

	var areEqual = __webpack_require__(106);
	var invariant = __webpack_require__(2);

	/**
	 * @internal
	 *
	 * `subtractRelayQuery(minuend, subtrahend)` returns a new query
	 * that matches the structure of `minuend`, minus any fields which also
	 * occur in `subtrahend`. Returns null if all fields can be subtracted,
	 * `minuend` if no fields can be subtracted, and a new query otherwise.
	 */
	function subtractRelayQuery(minuend, subtrahend) {
	  var visitor = new RelayQuerySubtractor();
	  var state = {
	    isEmpty: true,
	    subtrahend: subtrahend
	  };
	  var diff = visitor.visit(minuend, state);
	  if (!state.isEmpty) {
	    !(diff instanceof RelayQuery.Root) ?  true ? invariant(false, 'subtractRelayQuery(): Expected a subtracted query root.') : invariant(false) : undefined;
	    return diff;
	  }
	  return null;
	}

	var RelayQuerySubtractor = (function (_RelayQueryTransform) {
	  _inherits(RelayQuerySubtractor, _RelayQueryTransform);

	  function RelayQuerySubtractor() {
	    _classCallCheck(this, RelayQuerySubtractor);

	    _RelayQueryTransform.apply(this, arguments);
	  }

	  /**
	   * Determine if the subtree is effectively 'empty'; all non-metadata sub-fields
	   * have been removed.
	   */

	  RelayQuerySubtractor.prototype.visitRoot = function visitRoot(node, state) {
	    var subtrahend = state.subtrahend;

	    !(subtrahend instanceof RelayQuery.Root) ?  true ? invariant(false, 'subtractRelayQuery(): Cannot subtract a non-root node from a root.') : invariant(false) : undefined;
	    if (!canSubtractRoot(node, subtrahend)) {
	      state.isEmpty = false;
	      return node;
	    }
	    return this._subtractChildren(node, state);
	  };

	  RelayQuerySubtractor.prototype.visitFragment = function visitFragment(node, state) {
	    return this._subtractChildren(node, state);
	  };

	  RelayQuerySubtractor.prototype.visitField = function visitField(node, state) {
	    var diff;
	    if (node.isScalar()) {
	      diff = this._subtractScalar(node, state);
	    } else if (node.isConnection()) {
	      diff = this._subtractConnection(node, state);
	    } else {
	      diff = this._subtractField(node, state);
	    }
	    if (diff && (diff.isRequisite() || !state.isEmpty)) {
	      return diff;
	    }
	    return null;
	  };

	  RelayQuerySubtractor.prototype._subtractScalar = function _subtractScalar(node, state) {
	    var subField = state.subtrahend.getField(node);

	    if (subField && !node.isRequisite()) {
	      return null;
	    }
	    state.isEmpty = isEmptyField(node);
	    return node;
	  };

	  RelayQuerySubtractor.prototype._subtractConnection = function _subtractConnection(node, state) {
	    var subtrahendRanges = getMatchingRangeFields(node, state.subtrahend);

	    if (!subtrahendRanges.length) {
	      state.isEmpty = isEmptyField(node);
	      return node;
	    }

	    var diff = node;
	    var fieldState;
	    for (var ii = 0; ii < subtrahendRanges.length; ii++) {
	      fieldState = {
	        isEmpty: true,
	        subtrahend: subtrahendRanges[ii]
	      };
	      diff = this._subtractChildren(diff, fieldState);
	      state.isEmpty = fieldState.isEmpty;
	      if (!diff) {
	        break;
	      }
	    }
	    return diff;
	  };

	  /**
	   * Subtract a non-scalar/range field.
	   */

	  RelayQuerySubtractor.prototype._subtractField = function _subtractField(node, state) {
	    var subField = state.subtrahend.getField(node);

	    if (!subField) {
	      state.isEmpty = isEmptyField(node);
	      return node;
	    }

	    var fieldState = {
	      isEmpty: true,
	      subtrahend: subField
	    };
	    var diff = this._subtractChildren(node, fieldState);
	    state.isEmpty = fieldState.isEmpty;
	    return diff;
	  };

	  /**
	   * Subtracts any RelayQuery.Node that contains subfields.
	   */

	  RelayQuerySubtractor.prototype._subtractChildren = function _subtractChildren(node, state) {
	    var _this = this;

	    return node.clone(node.getChildren().map(function (child) {
	      var childState = {
	        isEmpty: true,
	        subtrahend: state.subtrahend
	      };
	      var diff = _this.visit(child, childState);
	      state.isEmpty = state.isEmpty && childState.isEmpty;
	      return diff;
	    }));
	  };

	  return RelayQuerySubtractor;
	})(RelayQueryTransform);

	function isEmptyField(node) {
	  if (node instanceof RelayQuery.Field && node.isScalar()) {
	    // Note: product-specific hacks use aliased cursors/ids to poll for data.
	    // Without the alias check these queries would be considered empty.
	    return node.isRequisite() && !node.isRefQueryDependency() && node.getApplicationName() === node.getSchemaName();
	  } else {
	    return node.getChildren().every(isEmptyField);
	  }
	}

	/**
	 * Determine if the two queries have the same root field and identifying arg.
	 */
	function canSubtractRoot(min, sub) {
	  var minIdentifyingCall = min.getIdentifyingArg();
	  var subIdentifyingCall = sub.getIdentifyingArg();
	  return min.getFieldName() === sub.getFieldName() && areEqual(minIdentifyingCall, subIdentifyingCall);
	}

	/**
	 * Find all subfields that may overlap with the range rooted at `node`.
	 */
	function getMatchingRangeFields(node, subtrahend) {
	  return subtrahend.getChildren().filter(function (child) {
	    return child instanceof RelayQuery.Field && canSubtractField(node, child);
	  });
	}

	/**
	 * Determine if `minField` is a subset of the range specified by `subField`
	 * such that they can be subtracted.
	 */
	function canSubtractField(minField, subField) {
	  if (minField.getSchemaName() !== subField.getSchemaName()) {
	    return false;
	  }
	  var minArgs = minField.getCallsWithValues();
	  var subArgs = subField.getCallsWithValues();
	  if (minArgs.length !== subArgs.length) {
	    return false;
	  }
	  return minArgs.every(function (minArg, ii) {
	    var subArg = subArgs[ii];
	    if (subArg == null) {
	      return false;
	    }
	    if (minArg.name !== subArg.name) {
	      return false;
	    }
	    if (minArg.name === 'first' || minArg.name === 'last') {
	      /* $FlowFixMe(>=0.13.0)
	       *
	       * subArg and minArg are of type 'Call' (defined in RelayQueryField) which
	       * specifies that its 'value' property is nullable. This code assumes that
	       * it is not, however, and Flow points out that it may produce
	       * `parseInt('undefined')`.
	       */
	      return parseInt('' + minArg.value, 10) <= parseInt('' + subArg.value, 10);
	    }
	    return areEqual(minArg.value, subArg.value);
	  });
	}

	module.exports = RelayProfiler.instrument('subtractRelayQuery', subtractRelayQuery);

/***/ },
/* 164 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule validateRelayReadQuery
	 * 
	 * @typechecks
	 */

	'use strict';

	var _inherits = __webpack_require__(5)['default'];

	var _classCallCheck = __webpack_require__(1)['default'];

	var RelayQueryVisitor = __webpack_require__(18);

	var emptyFunction = __webpack_require__(70);

	var validateRelayReadQuery = emptyFunction;

	if (true) {
	  // Wrap in an IIFE to avoid unwanted function hoisting.
	  (function () {
	    /**
	     * @internal
	     *
	     * `validateRelayReadQuery` is a `__DEV__`-only validator that checks that a
	     * query used to read data from `RelayStore` is well-formed. Validation
	     * problems are reported via `console.error`.
	     *
	     * At the moment, "well-formed" means that the query does not contain
	     * duplicate aliases.
	     */
	    validateRelayReadQuery = function validateRelayReadQuery(queryNode, options) {
	      var validator = new RelayStoreReadValidator(options);
	      validator.visit(queryNode, {
	        children: {},
	        hash: null
	      });
	    };

	    /**
	     * Returns the nested AliasMap for `node`, initializing if it necessary.
	     */
	    function getAliasMap(node, parentAliasMap) {
	      var applicationName = node.getApplicationName();
	      var hash = node.getShallowHash();
	      var children = parentAliasMap.children;

	      if (!children.hasOwnProperty(applicationName)) {
	        children[applicationName] = {
	          children: {},
	          hash: hash
	        };
	      } else if (children[applicationName].hash !== hash) {
	        console.error('`%s` is used as an alias more than once. Please use unique aliases.', applicationName);
	      }
	      return children[applicationName];
	    }

	    var RelayStoreReadValidator = (function (_RelayQueryVisitor) {
	      _inherits(RelayStoreReadValidator, _RelayQueryVisitor);

	      function RelayStoreReadValidator(options) {
	        _classCallCheck(this, RelayStoreReadValidator);

	        _RelayQueryVisitor.call(this);
	        this._traverseFragmentReferences = options && options.traverseFragmentReferences || false;
	      }

	      RelayStoreReadValidator.prototype.visitField = function visitField(node, parentAliasMap) {
	        var aliasMap = getAliasMap(node, parentAliasMap);

	        if (node.isGenerated()) {
	          return;
	        } else if (node.isScalar()) {
	          return;
	        } else if (node.isPlural()) {
	          this._readPlural(node, aliasMap);
	        } else {
	          // No special handling needed for connections, edges, page_info etc.
	          this._readLinkedField(node, aliasMap);
	        }
	      };

	      RelayStoreReadValidator.prototype.visitFragment = function visitFragment(node, aliasMap) {
	        if (this._traverseFragmentReferences || !node.isContainerFragment()) {
	          this.traverse(node, aliasMap);
	        }
	      };

	      RelayStoreReadValidator.prototype._readPlural = function _readPlural(node, aliasMap) {
	        var _this = this;

	        node.getChildren().forEach(function (child) {
	          return _this.visit(child, aliasMap);
	        });
	      };

	      RelayStoreReadValidator.prototype._readLinkedField = function _readLinkedField(node, aliasMap) {
	        aliasMap = getAliasMap(node, aliasMap);
	        this.traverse(node, aliasMap);
	      };

	      return RelayStoreReadValidator;
	    })(RelayQueryVisitor);
	  })();
	}

	module.exports = validateRelayReadQuery;

/***/ },
/* 165 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule writeRelayQueryPayload
	 * 
	 * @typechecks
	 */

	/**
	 * @internal
	 *
	 * Traverses a query and payload in parallel, writing the results into the
	 * store.
	 */
	'use strict';

	var RelayNodeInterface = __webpack_require__(12);
	var RelayProfiler = __webpack_require__(4);

	var RelayQueryPath = __webpack_require__(26);
	function writeRelayQueryPayload(writer, query, payload) {
	  var store = writer.getRecordStore();
	  var path = new RelayQueryPath(query);

	  RelayNodeInterface.getResultsFromPayload(store, query, payload).forEach(function (_ref) {
	    var dataID = _ref.dataID;
	    var result = _ref.result;

	    writer.writePayload(query, dataID, result, path);
	  });
	}

	module.exports = RelayProfiler.instrument('writeRelayQueryPayload', writeRelayQueryPayload);

/***/ },
/* 166 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule writeRelayUpdatePayload
	 * 
	 * @typechecks
	 */

	'use strict';

	var _defineProperty = __webpack_require__(60)['default'];

	var _extends = __webpack_require__(8)['default'];

	var GraphQLMutatorConstants = __webpack_require__(50);
	var RelayConnectionInterface = __webpack_require__(7);

	var RelayMutationTracker = __webpack_require__(125);
	var RelayMutationType = __webpack_require__(78);
	var RelayNodeInterface = __webpack_require__(12);
	var RelayQuery = __webpack_require__(3);
	var RelayQueryPath = __webpack_require__(26);

	var RelayProfiler = __webpack_require__(4);
	var RelayRecordState = __webpack_require__(27);

	var generateClientEdgeID = __webpack_require__(82);
	var generateClientID = __webpack_require__(57);
	var invariant = __webpack_require__(2);
	var serializeRelayQueryCall = __webpack_require__(38);
	var warning = __webpack_require__(11);

	// TODO: Replace with enumeration for possible config types.
	/* OperationConfig was originally typed such that each property had the type
	 * mixed.  Mixed is safer than any, but that safety comes from Flow forcing you
	 * to inspect a mixed value at runtime before using it.  However these mixeds
	 * are ending up everywhere and are not being inspected */
	var CLIENT_MUTATION_ID = RelayConnectionInterface.CLIENT_MUTATION_ID;
	var EDGES = RelayConnectionInterface.EDGES;
	var ANY_TYPE = RelayNodeInterface.ANY_TYPE;
	var ID = RelayNodeInterface.ID;
	var NODE = RelayNodeInterface.NODE;
	var NODE_TYPE = RelayNodeInterface.NODE_TYPE;
	var APPEND = GraphQLMutatorConstants.APPEND;
	var PREPEND = GraphQLMutatorConstants.PREPEND;
	var REMOVE = GraphQLMutatorConstants.REMOVE;

	var EDGES_FIELD = RelayQuery.Field.build({
	  fieldName: EDGES,
	  type: ANY_TYPE,
	  metadata: { isPlural: true }
	});
	var IGNORED_KEYS = _defineProperty({
	  error: true
	}, CLIENT_MUTATION_ID, true);
	var STUB_CURSOR_ID = 'client:cursor';

	/**
	 * @internal
	 *
	 * Applies the results of an update operation (mutation/subscription) to the
	 * store.
	 */
	function writeRelayUpdatePayload(writer, operation, payload, _ref) {
	  var configs = _ref.configs;
	  var isOptimisticUpdate = _ref.isOptimisticUpdate;

	  configs.forEach(function (config) {
	    switch (config.type) {
	      case RelayMutationType.NODE_DELETE:
	        handleNodeDelete(writer, payload, config);
	        break;
	      case RelayMutationType.RANGE_ADD:
	        handleRangeAdd(writer, payload, operation, config, isOptimisticUpdate);
	        break;
	      case RelayMutationType.RANGE_DELETE:
	        handleRangeDelete(writer, payload, config);
	        break;
	      case RelayMutationType.FIELDS_CHANGE:
	      case RelayMutationType.REQUIRED_CHILDREN:
	        break;
	      default:
	        console.error('Expected a valid mutation handler type, got `%s`.', config.type);
	    }
	  });

	  handleMerge(writer, payload, operation);
	}

	/**
	 * Handles the payload for a node deletion mutation, reading the ID of the node
	 * to delete from the payload based on the config and then deleting references
	 * to the node.
	 */
	function handleNodeDelete(writer, payload, config) {
	  var recordIDs = payload[config.deletedIDFieldName];
	  if (!recordIDs) {
	    // for some mutations, deletions don't always occur so if there's no field
	    // in the payload, carry on
	    return;
	  }

	  if (Array.isArray(recordIDs)) {
	    recordIDs.forEach(function (id) {
	      deleteRecord(writer, id);
	    });
	  } else {
	    deleteRecord(writer, recordIDs);
	  }
	}

	/**
	 * Deletes the record from the store, also removing any references to the node
	 * from any ranges that contain it (along with the containing edges).
	 */
	function deleteRecord(writer, recordID) {
	  var store = writer.getRecordStore();
	  // skip if already deleted
	  var status = store.getRecordState(recordID);
	  if (status === RelayRecordState.NONEXISTENT) {
	    return;
	  }

	  // Delete the node from any ranges it may be a part of
	  var connectionIDs = store.getConnectionIDsForRecord(recordID);
	  if (connectionIDs) {
	    connectionIDs.forEach(function (connectionID) {
	      var edgeID = generateClientEdgeID(connectionID, recordID);
	      store.applyRangeUpdate(connectionID, edgeID, REMOVE);
	      writer.recordUpdate(edgeID);
	      writer.recordUpdate(connectionID);
	      // edges are never nodes, so this will not infinitely recurse
	      deleteRecord(writer, edgeID);
	    });
	  }

	  // delete the node
	  store.deleteRecord(recordID);
	  writer.recordUpdate(recordID);
	}

	/**
	 * Handles merging the results of the mutation/subscription into the store,
	 * updating each top-level field in the data according the fetched
	 * fields/fragments.
	 */
	function handleMerge(writer, payload, operation) {
	  var store = writer.getRecordStore();

	  // because optimistic payloads may not contain all fields, we loop over
	  // the data that is present and then have to recurse the query to find
	  // the matching fields.
	  //
	  // TODO #7167718: more efficient mutation/subscription writes
	  for (var fieldName in payload) {
	    if (!payload.hasOwnProperty(fieldName)) {
	      continue;
	    }
	    var payloadData = payload[fieldName]; // #9357395
	    if (typeof payloadData !== 'object' || payloadData == null) {
	      continue;
	    }
	    // if the field is an argument-less root call, determine the corresponding
	    // root record ID
	    var rootID = store.getDataID(fieldName);
	    // check for valid data (has an ID or is an array) and write the field
	    if (ID in payloadData || rootID || Array.isArray(payloadData)) {
	      mergeField(writer, fieldName, payloadData, operation);
	    }
	  }
	}

	/**
	 * Merges the results of a single top-level field into the store.
	 */
	function mergeField(writer, fieldName, payload, operation) {
	  // don't write mutation/subscription metadata fields
	  if (fieldName in IGNORED_KEYS) {
	    return;
	  }
	  if (Array.isArray(payload)) {
	    payload.forEach(function (item) {
	      if (typeof item === 'object' && item != null && !Array.isArray(item)) {
	        if (getString(item, ID)) {
	          mergeField(writer, fieldName, item, operation);
	        }
	      }
	    });
	    return;
	  }
	  // reassign to preserve type information in below closure
	  var payloadData = payload;

	  var store = writer.getRecordStore();
	  var recordID = getString(payloadData, ID);
	  var path = undefined;

	  if (recordID != null) {
	    path = new RelayQueryPath(RelayQuery.Root.build('writeRelayUpdatePayload', NODE, recordID, null, { identifyingArgName: ID }, NODE_TYPE));
	  } else {
	    recordID = store.getDataID(fieldName);
	    // Root fields that do not accept arguments
	    path = new RelayQueryPath(RelayQuery.Root.build('writeRelayUpdatePayload', fieldName, null, null, null, ANY_TYPE));
	  }
	  !recordID ?  true ? invariant(false, 'writeRelayUpdatePayload(): Expected a record ID in the response payload ' + 'supplied to update the store.') : invariant(false) : undefined;

	  // write the results for only the current field, for every instance of that
	  // field in any subfield/fragment in the query.
	  var handleNode = function handleNode(node) {
	    node.getChildren().forEach(function (child) {
	      if (child instanceof RelayQuery.Fragment) {
	        handleNode(child);
	      } else if (child instanceof RelayQuery.Field && child.getSerializationKey() === fieldName) {
	        // for flow: types are lost in closures
	        if (path && recordID) {
	          var typeName = writer.getRecordTypeName(child, recordID, payloadData);
	          // ensure the record exists and then update it
	          writer.createRecordIfMissing(child, recordID, typeName, path);
	          writer.writePayload(child, recordID, payloadData, path);
	        }
	      }
	    });
	  };
	  handleNode(operation);
	}

	/**
	 * Handles the payload for a range addition. The configuration specifies:
	 * - which field in the payload contains data for the new edge
	 * - the list of fetched ranges to which the edge should be added
	 * - whether to append/prepend to each of those ranges
	 */
	function handleRangeAdd(writer, payload, operation, config, isOptimisticUpdate) {
	  var clientMutationID = getString(payload, CLIENT_MUTATION_ID);
	  !clientMutationID ?  true ? invariant(false, 'writeRelayUpdatePayload(): Expected operation `%s` to have a `%s`.', operation.getName(), CLIENT_MUTATION_ID) : invariant(false) : undefined;
	  var store = writer.getRecordStore();

	  // Extracts the new edge from the payload
	  var edge = getObject(payload, config.edgeName);
	  var edgeNode = edge && getObject(edge, NODE);
	  if (!edge || !edgeNode) {
	     true ? warning(false, 'writeRelayUpdatePayload(): Expected response payload to include the ' + 'newly created edge `%s` and its `node` field. Did you forget to ' + 'update the `RANGE_ADD` mutation config?', config.edgeName) : undefined;
	    return;
	  }

	  // Extract the id of the node with the connection that we are adding to.
	  var connectionParentID = config.parentID;
	  if (!connectionParentID) {
	    var edgeSource = getObject(edge, 'source');
	    if (edgeSource) {
	      connectionParentID = getString(edgeSource, ID);
	    }
	  }
	  !connectionParentID ?  true ? invariant(false, 'writeRelayUpdatePayload(): Cannot insert edge without a configured ' + '`parentID` or a `%s.source.id` field.', config.edgeName) : invariant(false) : undefined;

	  var nodeID = getString(edgeNode, ID) || generateClientID();
	  var cursor = edge.cursor || STUB_CURSOR_ID;
	  var edgeData = _extends({}, edge, {
	    cursor: cursor,
	    node: _extends({}, edgeNode, {
	      id: nodeID
	    })
	  });

	  // add the node to every connection for this field
	  var connectionIDs = store.getConnectionIDsForField(connectionParentID, config.connectionName);
	  if (connectionIDs) {
	    connectionIDs.forEach(function (connectionID) {
	      return addRangeNode(writer, operation, config, connectionID, nodeID, edgeData);
	    });
	  }

	  if (isOptimisticUpdate) {
	    // optimistic updates need to record the generated client ID for
	    // a to-be-created node
	    RelayMutationTracker.putClientIDForMutation(nodeID, clientMutationID);
	  } else {
	    // non-optimistic updates check for the existence of a generated client
	    // ID (from the above `if` clause) and link the client ID to the actual
	    // server ID.
	    var clientNodeID = RelayMutationTracker.getClientIDForMutation(clientMutationID);
	    if (clientNodeID) {
	      RelayMutationTracker.updateClientServerIDMap(clientNodeID, nodeID);
	      RelayMutationTracker.deleteClientIDForMutation(clientMutationID);
	    }
	  }
	}

	/**
	 * Writes the node data for the given field to the store and prepends/appends
	 * the node to the given connection.
	 */
	function addRangeNode(writer, operation, config, connectionID, nodeID, edgeData) {
	  var store = writer.getRecordStore();
	  var filterCalls = store.getRangeFilterCalls(connectionID);
	  var rangeBehavior = filterCalls ? getRangeBehavior(config.rangeBehaviors, filterCalls) : null;

	  // no range behavior specified for this combination of filter calls
	  if (!rangeBehavior) {
	    return;
	  }

	  var edgeID = generateClientEdgeID(connectionID, nodeID);
	  var path = store.getPathToRecord(connectionID);
	  !path ?  true ? invariant(false, 'writeRelayUpdatePayload(): Expected a path for connection record, `%s`.', connectionID) : invariant(false) : undefined;
	  path = path.getPath(EDGES_FIELD, edgeID);

	  // create the edge record
	  var typeName = writer.getRecordTypeName(EDGES_FIELD, edgeID, edgeData);
	  writer.createRecordIfMissing(EDGES_FIELD, edgeID, typeName, path);

	  // write data for all `edges` fields
	  // TODO #7167718: more efficient mutation/subscription writes
	  var hasEdgeField = false;
	  var handleNode = function handleNode(node) {
	    node.getChildren().forEach(function (child) {
	      if (child instanceof RelayQuery.Fragment) {
	        handleNode(child);
	      } else if (child instanceof RelayQuery.Field && child.getSchemaName() === config.edgeName) {
	        hasEdgeField = true;
	        if (path) {
	          writer.writePayload(child, edgeID, edgeData, path);
	        }
	      }
	    });
	  };
	  handleNode(operation);

	  !hasEdgeField ?  true ? invariant(false, 'writeRelayUpdatePayload(): Expected mutation query to include the ' + 'relevant edge field, `%s`.', config.edgeName) : invariant(false) : undefined;

	  // append/prepend the item to the range.
	  if (rangeBehavior in GraphQLMutatorConstants.RANGE_OPERATIONS) {
	    store.applyRangeUpdate(connectionID, edgeID, rangeBehavior);
	    if (writer.hasChangeToRecord(edgeID)) {
	      writer.recordUpdate(connectionID);
	    }
	  } else {
	    console.error('writeRelayUpdatePayload(): invalid range operation `%s`, valid ' + 'options are `%s` or `%s`.', rangeBehavior, APPEND, PREPEND);
	  }
	}

	/**
	 * Handles the payload for a range edge deletion, which removes the edge from
	 * a specified range but does not delete the node for that edge. The config
	 * specifies the path within the payload that contains the connection ID.
	 */
	function handleRangeDelete(writer, payload, config) {
	  var maybeRecordID = getString(payload, config.deletedIDFieldName);
	  !(maybeRecordID != null) ?  true ? invariant(false, 'writeRelayUpdatePayload(): Missing ID for deleted record at field `%s`.', config.deletedIDFieldName) : invariant(false) : undefined;
	  var recordID = maybeRecordID; // Flow loses type refinements in closures

	  // Extract the id of the node with the connection that we are deleting from.
	  var store = writer.getRecordStore();
	  var connectionName = config.pathToConnection.pop();
	  var connectionParentID = getIDFromPath(store, config.pathToConnection, payload);
	  // Restore pathToConnection to its original state
	  config.pathToConnection.push(connectionName);
	  if (!connectionParentID) {
	    return;
	  }

	  var connectionIDs = store.getConnectionIDsForField(connectionParentID, connectionName);
	  if (connectionIDs) {
	    connectionIDs.forEach(function (connectionID) {
	      deleteRangeEdge(writer, connectionID, recordID);
	    });
	  }
	}

	/**
	 * Removes an edge from a connection without modifying the node data.
	 */
	function deleteRangeEdge(writer, connectionID, nodeID) {
	  var store = writer.getRecordStore();
	  var edgeID = generateClientEdgeID(connectionID, nodeID);
	  store.applyRangeUpdate(connectionID, edgeID, REMOVE);

	  deleteRecord(writer, edgeID);
	  if (writer.hasChangeToRecord(edgeID)) {
	    writer.recordUpdate(connectionID);
	  }
	}

	/**
	 * Return the action (prepend/append) to use when adding an item to
	 * the range with the specified calls.
	 *
	 * Ex:
	 * rangeBehaviors: `{'orderby(recent)': 'append'}`
	 * calls: `[{name: 'orderby', value: 'recent'}]`
	 *
	 * Returns `'append'`
	 */
	function getRangeBehavior(rangeBehaviors, calls) {
	  var call = calls.map(serializeRelayQueryCall).sort().join('').slice(1);
	  return rangeBehaviors[call] || null;
	}

	/**
	 * Given a payload of data and a path of fields, extracts the `id` of the node
	 * specified by the path.
	 *
	 * Example:
	 * path: ['root', 'field']
	 * data: {root: {field: {id: 'xyz'}}}
	 *
	 * Returns:
	 * 'xyz'
	 */
	function getIDFromPath(store, path, payload) {
	  // We have a special case for the path for root nodes without ids like
	  // ['viewer']. We try to match it up with something in the root call mapping
	  // first.
	  if (path.length === 1) {
	    var rootCallID = store.getDataID(path[0]);
	    if (rootCallID) {
	      return rootCallID;
	    }
	  }
	  var payloadItem = path.reduce(function (payloadItem, step) {
	    return payloadItem ? getObject(payloadItem, step) : null;
	  }, payload);
	  if (payloadItem) {
	    var id = getString(payloadItem, ID);
	    !(id != null) ?  true ? invariant(false, 'writeRelayUpdatePayload(): Expected `%s.id` to be a string.', path.join('.')) : invariant(false) : undefined;
	    return id;
	  }
	  return null;
	}

	function getString(payload, field) {
	  var value = payload[field];
	  // Coerce numbers to strings for backwards compatibility.
	  if (typeof value === 'number') {
	     true ? warning(false, 'writeRelayUpdatePayload(): Expected `%s` to be a string, got the ' + 'number `%s`.', field, value) : undefined;
	    value = '' + value;
	  }
	  !(value == null || typeof value === 'string') ?  true ? invariant(false, 'writeRelayUpdatePayload(): Expected `%s` to be a string, got `%s`.', field, JSON.stringify(value)) : invariant(false) : undefined;
	  return value;
	}

	function getObject(payload, field) {
	  var value = payload[field];
	  !(value == null || typeof value === 'object' && !Array.isArray(value)) ?  true ? invariant(false, 'writeRelayUpdatePayload(): Expected `%s` to be an object, got `%s`.', field, JSON.stringify(value)) : invariant(false) : undefined;
	  return value;
	}

	module.exports = RelayProfiler.instrument('writeRelayUpdatePayload', writeRelayUpdatePayload);

/***/ },
/* 167 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	// rawAsap provides everything we need except exception management.
	var rawAsap = __webpack_require__(88);
	// RawTasks are recycled to reduce GC churn.
	var freeTasks = [];
	// We queue errors to ensure they are thrown in right order (FIFO).
	// Array-as-queue is good enough here, since we are just dealing with exceptions.
	var pendingErrors = [];
	var requestErrorThrow = rawAsap.makeRequestCallFromTimer(throwFirstError);

	function throwFirstError() {
	    if (pendingErrors.length) {
	        throw pendingErrors.shift();
	    }
	}

	/**
	 * Calls a task as soon as possible after returning, in its own event, with priority
	 * over other events like animation, reflow, and repaint. An error thrown from an
	 * event will not interrupt, nor even substantially slow down the processing of
	 * other events, but will be rather postponed to a lower priority event.
	 * @param {{call}} task A callable object, typically a function that takes no
	 * arguments.
	 */
	module.exports = asap;
	function asap(task) {
	    var rawTask;
	    if (freeTasks.length) {
	        rawTask = freeTasks.pop();
	    } else {
	        rawTask = new RawTask();
	    }
	    rawTask.task = task;
	    rawAsap(rawTask);
	}

	// We wrap tasks with recyclable task objects.  A task object implements
	// `call`, just like a function.
	function RawTask() {
	    this.task = null;
	}

	// The sole purpose of wrapping the task is to catch the exception and recycle
	// the task object after its single use.
	RawTask.prototype.call = function () {
	    try {
	        this.task.call();
	    } catch (error) {
	        if (asap.onerror) {
	            // This hook exists purely for testing purposes.
	            // Its name will be periodically randomized to break any code that
	            // depends on its existence.
	            asap.onerror(error);
	        } else {
	            // In a web browser, exceptions are not fatal. However, to avoid
	            // slowing down the queue of pending tasks, we rethrow the error in a
	            // lower priority turn.
	            pendingErrors.push(error);
	            requestErrorThrow();
	        }
	    } finally {
	        this.task = null;
	        freeTasks[freeTasks.length] = this;
	    }
	};


/***/ },
/* 168 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(175), __esModule: true };

/***/ },
/* 169 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(176), __esModule: true };

/***/ },
/* 170 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(178), __esModule: true };

/***/ },
/* 171 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(179), __esModule: true };

/***/ },
/* 172 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(182), __esModule: true };

/***/ },
/* 173 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(205);
	__webpack_require__(45);
	__webpack_require__(67);
	__webpack_require__(200);
	module.exports = __webpack_require__(13).Map;

/***/ },
/* 174 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(45);
	__webpack_require__(198);
	module.exports = __webpack_require__(13).Array.from;

/***/ },
/* 175 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(67);
	__webpack_require__(45);
	module.exports = __webpack_require__(196);

/***/ },
/* 176 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(67);
	__webpack_require__(45);
	module.exports = __webpack_require__(197);

/***/ },
/* 177 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(201);
	module.exports = __webpack_require__(13).Object.assign;

/***/ },
/* 178 */
/***/ function(module, exports, __webpack_require__) {

	var $ = __webpack_require__(14);
	module.exports = function create(P, D){
	  return $.create(P, D);
	};

/***/ },
/* 179 */
/***/ function(module, exports, __webpack_require__) {

	var $ = __webpack_require__(14);
	module.exports = function defineProperty(it, key, desc){
	  return $.setDesc(it, key, desc);
	};

/***/ },
/* 180 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(202);
	module.exports = __webpack_require__(13).Object.freeze;

/***/ },
/* 181 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(203);
	module.exports = __webpack_require__(13).Object.keys;

/***/ },
/* 182 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(204);
	module.exports = __webpack_require__(13).Object.setPrototypeOf;

/***/ },
/* 183 */
/***/ function(module, exports) {

	module.exports = function(it){
	  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
	  return it;
	};

/***/ },
/* 184 */
/***/ function(module, exports) {

	module.exports = function(){ /* empty */ };

/***/ },
/* 185 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $            = __webpack_require__(14)
	  , hide         = __webpack_require__(31)
	  , redefineAll  = __webpack_require__(99)
	  , ctx          = __webpack_require__(30)
	  , strictNew    = __webpack_require__(101)
	  , defined      = __webpack_require__(41)
	  , forOf        = __webpack_require__(92)
	  , $iterDefine  = __webpack_require__(63)
	  , step         = __webpack_require__(96)
	  , ID           = __webpack_require__(104)('id')
	  , $has         = __webpack_require__(62)
	  , isObject     = __webpack_require__(32)
	  , setSpecies   = __webpack_require__(192)
	  , DESCRIPTORS  = __webpack_require__(42)
	  , isExtensible = Object.isExtensible || isObject
	  , SIZE         = DESCRIPTORS ? '_s' : 'size'
	  , id           = 0;

	var fastKey = function(it, create){
	  // return primitive with prefix
	  if(!isObject(it))return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
	  if(!$has(it, ID)){
	    // can't set id to frozen object
	    if(!isExtensible(it))return 'F';
	    // not necessary to add id
	    if(!create)return 'E';
	    // add missing object id
	    hide(it, ID, ++id);
	  // return object id with prefix
	  } return 'O' + it[ID];
	};

	var getEntry = function(that, key){
	  // fast case
	  var index = fastKey(key), entry;
	  if(index !== 'F')return that._i[index];
	  // frozen object case
	  for(entry = that._f; entry; entry = entry.n){
	    if(entry.k == key)return entry;
	  }
	};

	module.exports = {
	  getConstructor: function(wrapper, NAME, IS_MAP, ADDER){
	    var C = wrapper(function(that, iterable){
	      strictNew(that, C, NAME);
	      that._i = $.create(null); // index
	      that._f = undefined;      // first entry
	      that._l = undefined;      // last entry
	      that[SIZE] = 0;           // size
	      if(iterable != undefined)forOf(iterable, IS_MAP, that[ADDER], that);
	    });
	    redefineAll(C.prototype, {
	      // 23.1.3.1 Map.prototype.clear()
	      // 23.2.3.2 Set.prototype.clear()
	      clear: function clear(){
	        for(var that = this, data = that._i, entry = that._f; entry; entry = entry.n){
	          entry.r = true;
	          if(entry.p)entry.p = entry.p.n = undefined;
	          delete data[entry.i];
	        }
	        that._f = that._l = undefined;
	        that[SIZE] = 0;
	      },
	      // 23.1.3.3 Map.prototype.delete(key)
	      // 23.2.3.4 Set.prototype.delete(value)
	      'delete': function(key){
	        var that  = this
	          , entry = getEntry(that, key);
	        if(entry){
	          var next = entry.n
	            , prev = entry.p;
	          delete that._i[entry.i];
	          entry.r = true;
	          if(prev)prev.n = next;
	          if(next)next.p = prev;
	          if(that._f == entry)that._f = next;
	          if(that._l == entry)that._l = prev;
	          that[SIZE]--;
	        } return !!entry;
	      },
	      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
	      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
	      forEach: function forEach(callbackfn /*, that = undefined */){
	        var f = ctx(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3)
	          , entry;
	        while(entry = entry ? entry.n : this._f){
	          f(entry.v, entry.k, this);
	          // revert to the last existing entry
	          while(entry && entry.r)entry = entry.p;
	        }
	      },
	      // 23.1.3.7 Map.prototype.has(key)
	      // 23.2.3.7 Set.prototype.has(value)
	      has: function has(key){
	        return !!getEntry(this, key);
	      }
	    });
	    if(DESCRIPTORS)$.setDesc(C.prototype, 'size', {
	      get: function(){
	        return defined(this[SIZE]);
	      }
	    });
	    return C;
	  },
	  def: function(that, key, value){
	    var entry = getEntry(that, key)
	      , prev, index;
	    // change existing entry
	    if(entry){
	      entry.v = value;
	    // create new entry
	    } else {
	      that._l = entry = {
	        i: index = fastKey(key, true), // <- index
	        k: key,                        // <- key
	        v: value,                      // <- value
	        p: prev = that._l,             // <- previous entry
	        n: undefined,                  // <- next entry
	        r: false                       // <- removed
	      };
	      if(!that._f)that._f = entry;
	      if(prev)prev.n = entry;
	      that[SIZE]++;
	      // add to index
	      if(index !== 'F')that._i[index] = entry;
	    } return that;
	  },
	  getEntry: getEntry,
	  setStrong: function(C, NAME, IS_MAP){
	    // add .keys, .values, .entries, [@@iterator]
	    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
	    $iterDefine(C, NAME, function(iterated, kind){
	      this._t = iterated;  // target
	      this._k = kind;      // kind
	      this._l = undefined; // previous
	    }, function(){
	      var that  = this
	        , kind  = that._k
	        , entry = that._l;
	      // revert to the last existing entry
	      while(entry && entry.r)entry = entry.p;
	      // get next entry
	      if(!that._t || !(that._l = entry = entry ? entry.n : that._t._f)){
	        // or finish the iteration
	        that._t = undefined;
	        return step(1);
	      }
	      // return step by kind
	      if(kind == 'keys'  )return step(0, entry.k);
	      if(kind == 'values')return step(0, entry.v);
	      return step(0, [entry.k, entry.v]);
	    }, IS_MAP ? 'entries' : 'values' , !IS_MAP, true);

	    // add [@@species], 23.1.2.2, 23.2.2.2
	    setSpecies(NAME);
	  }
	};

/***/ },
/* 186 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $              = __webpack_require__(14)
	  , global         = __webpack_require__(44)
	  , $export        = __webpack_require__(22)
	  , fails          = __webpack_require__(43)
	  , hide           = __webpack_require__(31)
	  , redefineAll    = __webpack_require__(99)
	  , forOf          = __webpack_require__(92)
	  , strictNew      = __webpack_require__(101)
	  , isObject       = __webpack_require__(32)
	  , setToStringTag = __webpack_require__(64)
	  , DESCRIPTORS    = __webpack_require__(42);

	module.exports = function(NAME, wrapper, methods, common, IS_MAP, IS_WEAK){
	  var Base  = global[NAME]
	    , C     = Base
	    , ADDER = IS_MAP ? 'set' : 'add'
	    , proto = C && C.prototype
	    , O     = {};
	  if(!DESCRIPTORS || typeof C != 'function' || !(IS_WEAK || proto.forEach && !fails(function(){
	    new C().entries().next();
	  }))){
	    // create collection constructor
	    C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER);
	    redefineAll(C.prototype, methods);
	  } else {
	    C = wrapper(function(target, iterable){
	      strictNew(target, C, NAME);
	      target._c = new Base;
	      if(iterable != undefined)forOf(iterable, IS_MAP, target[ADDER], target);
	    });
	    $.each.call('add,clear,delete,forEach,get,has,set,keys,values,entries'.split(','),function(KEY){
	      var IS_ADDER = KEY == 'add' || KEY == 'set';
	      if(KEY in proto && !(IS_WEAK && KEY == 'clear'))hide(C.prototype, KEY, function(a, b){
	        if(!IS_ADDER && IS_WEAK && !isObject(a))return KEY == 'get' ? undefined : false;
	        var result = this._c[KEY](a === 0 ? 0 : a, b);
	        return IS_ADDER ? this : result;
	      });
	    });
	    if('size' in proto)$.setDesc(C.prototype, 'size', {
	      get: function(){
	        return this._c.size;
	      }
	    });
	  }

	  setToStringTag(C, NAME);

	  O[NAME] = C;
	  $export($export.G + $export.W + $export.F, O);

	  if(!IS_WEAK)common.setStrong(C, NAME, IS_MAP);

	  return C;
	};

/***/ },
/* 187 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $              = __webpack_require__(14)
	  , descriptor     = __webpack_require__(98)
	  , setToStringTag = __webpack_require__(64)
	  , IteratorPrototype = {};

	// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
	__webpack_require__(31)(IteratorPrototype, __webpack_require__(15)('iterator'), function(){ return this; });

	module.exports = function(Constructor, NAME, next){
	  Constructor.prototype = $.create(IteratorPrototype, {next: descriptor(1, next)});
	  setToStringTag(Constructor, NAME + ' Iterator');
	};

/***/ },
/* 188 */
/***/ function(module, exports, __webpack_require__) {

	var ITERATOR     = __webpack_require__(15)('iterator')
	  , SAFE_CLOSING = false;

	try {
	  var riter = [7][ITERATOR]();
	  riter['return'] = function(){ SAFE_CLOSING = true; };
	  Array.from(riter, function(){ throw 2; });
	} catch(e){ /* empty */ }

	module.exports = function(exec, skipClosing){
	  if(!skipClosing && !SAFE_CLOSING)return false;
	  var safe = false;
	  try {
	    var arr  = [7]
	      , iter = arr[ITERATOR]();
	    iter.next = function(){ safe = true; };
	    arr[ITERATOR] = function(){ return iter; };
	    exec(arr);
	  } catch(e){ /* empty */ }
	  return safe;
	};

/***/ },
/* 189 */
/***/ function(module, exports) {

	module.exports = true;

/***/ },
/* 190 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.1 Object.assign(target, source, ...)
	var $        = __webpack_require__(14)
	  , toObject = __webpack_require__(65)
	  , IObject  = __webpack_require__(93);

	// should work with symbols and should have deterministic property order (V8 bug)
	module.exports = __webpack_require__(43)(function(){
	  var a = Object.assign
	    , A = {}
	    , B = {}
	    , S = Symbol()
	    , K = 'abcdefghijklmnopqrst';
	  A[S] = 7;
	  K.split('').forEach(function(k){ B[k] = k; });
	  return a({}, A)[S] != 7 || Object.keys(a({}, B)).join('') != K;
	}) ? function assign(target, source){ // eslint-disable-line no-unused-vars
	  var T     = toObject(target)
	    , $$    = arguments
	    , $$len = $$.length
	    , index = 1
	    , getKeys    = $.getKeys
	    , getSymbols = $.getSymbols
	    , isEnum     = $.isEnum;
	  while($$len > index){
	    var S      = IObject($$[index++])
	      , keys   = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S)
	      , length = keys.length
	      , j      = 0
	      , key;
	    while(length > j)if(isEnum.call(S, key = keys[j++]))T[key] = S[key];
	  }
	  return T;
	} : Object.assign;

/***/ },
/* 191 */
/***/ function(module, exports, __webpack_require__) {

	// Works with __proto__ only. Old v8 can't work with null proto objects.
	/* eslint-disable no-proto */
	var getDesc  = __webpack_require__(14).getDesc
	  , isObject = __webpack_require__(32)
	  , anObject = __webpack_require__(40);
	var check = function(O, proto){
	  anObject(O);
	  if(!isObject(proto) && proto !== null)throw TypeError(proto + ": can't set as prototype!");
	};
	module.exports = {
	  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
	    function(test, buggy, set){
	      try {
	        set = __webpack_require__(30)(Function.call, getDesc(Object.prototype, '__proto__').set, 2);
	        set(test, []);
	        buggy = !(test instanceof Array);
	      } catch(e){ buggy = true; }
	      return function setPrototypeOf(O, proto){
	        check(O, proto);
	        if(buggy)O.__proto__ = proto;
	        else set(O, proto);
	        return O;
	      };
	    }({}, false) : undefined),
	  check: check
	};

/***/ },
/* 192 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var core        = __webpack_require__(13)
	  , $           = __webpack_require__(14)
	  , DESCRIPTORS = __webpack_require__(42)
	  , SPECIES     = __webpack_require__(15)('species');

	module.exports = function(KEY){
	  var C = core[KEY];
	  if(DESCRIPTORS && C && !C[SPECIES])$.setDesc(C, SPECIES, {
	    configurable: true,
	    get: function(){ return this; }
	  });
	};

/***/ },
/* 193 */
/***/ function(module, exports, __webpack_require__) {

	var global = __webpack_require__(44)
	  , SHARED = '__core-js_shared__'
	  , store  = global[SHARED] || (global[SHARED] = {});
	module.exports = function(key){
	  return store[key] || (store[key] = {});
	};

/***/ },
/* 194 */
/***/ function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(102)
	  , defined   = __webpack_require__(41);
	// true  -> String#at
	// false -> String#codePointAt
	module.exports = function(TO_STRING){
	  return function(that, pos){
	    var s = String(defined(that))
	      , i = toInteger(pos)
	      , l = s.length
	      , a, b;
	    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
	    a = s.charCodeAt(i);
	    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
	      ? TO_STRING ? s.charAt(i) : a
	      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
	  };
	};

/***/ },
/* 195 */
/***/ function(module, exports, __webpack_require__) {

	// to indexed object, toObject with fallback for non-array-like ES3 strings
	var IObject = __webpack_require__(93)
	  , defined = __webpack_require__(41);
	module.exports = function(it){
	  return IObject(defined(it));
	};

/***/ },
/* 196 */
/***/ function(module, exports, __webpack_require__) {

	var anObject = __webpack_require__(40)
	  , get      = __webpack_require__(66);
	module.exports = __webpack_require__(13).getIterator = function(it){
	  var iterFn = get(it);
	  if(typeof iterFn != 'function')throw TypeError(it + ' is not iterable!');
	  return anObject(iterFn.call(it));
	};

/***/ },
/* 197 */
/***/ function(module, exports, __webpack_require__) {

	var classof   = __webpack_require__(90)
	  , ITERATOR  = __webpack_require__(15)('iterator')
	  , Iterators = __webpack_require__(23);
	module.exports = __webpack_require__(13).isIterable = function(it){
	  var O = Object(it);
	  return O[ITERATOR] !== undefined
	    || '@@iterator' in O
	    || Iterators.hasOwnProperty(classof(O));
	};

/***/ },
/* 198 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var ctx         = __webpack_require__(30)
	  , $export     = __webpack_require__(22)
	  , toObject    = __webpack_require__(65)
	  , call        = __webpack_require__(95)
	  , isArrayIter = __webpack_require__(94)
	  , toLength    = __webpack_require__(103)
	  , getIterFn   = __webpack_require__(66);
	$export($export.S + $export.F * !__webpack_require__(188)(function(iter){ Array.from(iter); }), 'Array', {
	  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
	  from: function from(arrayLike/*, mapfn = undefined, thisArg = undefined*/){
	    var O       = toObject(arrayLike)
	      , C       = typeof this == 'function' ? this : Array
	      , $$      = arguments
	      , $$len   = $$.length
	      , mapfn   = $$len > 1 ? $$[1] : undefined
	      , mapping = mapfn !== undefined
	      , index   = 0
	      , iterFn  = getIterFn(O)
	      , length, result, step, iterator;
	    if(mapping)mapfn = ctx(mapfn, $$len > 2 ? $$[2] : undefined, 2);
	    // if object isn't iterable or it's array with default iterator - use simple case
	    if(iterFn != undefined && !(C == Array && isArrayIter(iterFn))){
	      for(iterator = iterFn.call(O), result = new C; !(step = iterator.next()).done; index++){
	        result[index] = mapping ? call(iterator, mapfn, [step.value, index], true) : step.value;
	      }
	    } else {
	      length = toLength(O.length);
	      for(result = new C(length); length > index; index++){
	        result[index] = mapping ? mapfn(O[index], index) : O[index];
	      }
	    }
	    result.length = index;
	    return result;
	  }
	});


/***/ },
/* 199 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var addToUnscopables = __webpack_require__(184)
	  , step             = __webpack_require__(96)
	  , Iterators        = __webpack_require__(23)
	  , toIObject        = __webpack_require__(195);

	// 22.1.3.4 Array.prototype.entries()
	// 22.1.3.13 Array.prototype.keys()
	// 22.1.3.29 Array.prototype.values()
	// 22.1.3.30 Array.prototype[@@iterator]()
	module.exports = __webpack_require__(63)(Array, 'Array', function(iterated, kind){
	  this._t = toIObject(iterated); // target
	  this._i = 0;                   // next index
	  this._k = kind;                // kind
	// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
	}, function(){
	  var O     = this._t
	    , kind  = this._k
	    , index = this._i++;
	  if(!O || index >= O.length){
	    this._t = undefined;
	    return step(1);
	  }
	  if(kind == 'keys'  )return step(0, index);
	  if(kind == 'values')return step(0, O[index]);
	  return step(0, [index, O[index]]);
	}, 'values');

	// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
	Iterators.Arguments = Iterators.Array;

	addToUnscopables('keys');
	addToUnscopables('values');
	addToUnscopables('entries');

/***/ },
/* 200 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var strong = __webpack_require__(185);

	// 23.1 Map Objects
	__webpack_require__(186)('Map', function(get){
	  return function Map(){ return get(this, arguments.length > 0 ? arguments[0] : undefined); };
	}, {
	  // 23.1.3.6 Map.prototype.get(key)
	  get: function get(key){
	    var entry = strong.getEntry(this, key);
	    return entry && entry.v;
	  },
	  // 23.1.3.9 Map.prototype.set(key, value)
	  set: function set(key, value){
	    return strong.def(this, key === 0 ? 0 : key, value);
	  }
	}, strong, true);

/***/ },
/* 201 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.3.1 Object.assign(target, source)
	var $export = __webpack_require__(22);

	$export($export.S + $export.F, 'Object', {assign: __webpack_require__(190)});

/***/ },
/* 202 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.5 Object.freeze(O)
	var isObject = __webpack_require__(32);

	__webpack_require__(97)('freeze', function($freeze){
	  return function freeze(it){
	    return $freeze && isObject(it) ? $freeze(it) : it;
	  };
	});

/***/ },
/* 203 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.14 Object.keys(O)
	var toObject = __webpack_require__(65);

	__webpack_require__(97)('keys', function($keys){
	  return function keys(it){
	    return $keys(toObject(it));
	  };
	});

/***/ },
/* 204 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.3.19 Object.setPrototypeOf(O, proto)
	var $export = __webpack_require__(22);
	$export($export.S, 'Object', {setPrototypeOf: __webpack_require__(191).set});

/***/ },
/* 205 */
/***/ function(module, exports) {

	

/***/ },
/* 206 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * 
	 */

	/**
	 * A map of asynchronous values that can be get or set in any order. Unlike a
	 * normal map, setting the value for a particular key more than once throws.
	 * Also unlike a normal map, a key can either be resolved or rejected.
	 */
	'use strict';

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var Deferred = __webpack_require__(46);

	var invariant = __webpack_require__(2);

	var PromiseMap = (function () {
	  function PromiseMap() {
	    _classCallCheck(this, PromiseMap);

	    this._deferred = {};
	  }

	  PromiseMap.prototype.get = function get(key) {
	    return getDeferred(this._deferred, key).getPromise();
	  };

	  PromiseMap.prototype.resolveKey = function resolveKey(key, value) {
	    var entry = getDeferred(this._deferred, key);
	    !!entry.isSettled() ?  true ? invariant(false, 'PromiseMap: Already settled `%s`.', key) : invariant(false) : undefined;
	    entry.resolve(value);
	  };

	  PromiseMap.prototype.rejectKey = function rejectKey(key, reason) {
	    var entry = getDeferred(this._deferred, key);
	    !!entry.isSettled() ?  true ? invariant(false, 'PromiseMap: Already settled `%s`.', key) : invariant(false) : undefined;
	    entry.reject(reason);
	  };

	  return PromiseMap;
	})();

	function getDeferred(entries, key) {
	  if (!entries.hasOwnProperty(key)) {
	    entries[key] = new Deferred();
	  }
	  return entries[key];
	}

	module.exports = PromiseMap;

/***/ },
/* 207 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @typechecks
	 * 
	 */

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

	var ExecutionEnvironment = __webpack_require__(105);
	var Promise = __webpack_require__(16);

	var sprintf = __webpack_require__(110);
	var fetch = __webpack_require__(109);
	var warning = __webpack_require__(11);

	var DEFAULT_TIMEOUT = 15000;
	var DEFAULT_RETRIES = [1000, 3000];

	/**
	 * Makes a POST request to the server with the given data as the payload.
	 * Automatic retries are done based on the values in `retryDelays`.
	 */
	function fetchWithRetries(uri, initWithRetries) {
	  var _ref = initWithRetries || {};

	  var fetchTimeout = _ref.fetchTimeout;
	  var retryDelays = _ref.retryDelays;

	  var init = _objectWithoutProperties(_ref, ['fetchTimeout', 'retryDelays']);

	  var _fetchTimeout = fetchTimeout != null ? fetchTimeout : DEFAULT_TIMEOUT;
	  var _retryDelays = retryDelays != null ? retryDelays : DEFAULT_RETRIES;

	  var requestsAttempted = 0;
	  var requestStartTime = 0;
	  return new Promise(function (resolve, reject) {
	    /**
	     * Sends a request to the server that will timeout after `fetchTimeout`.
	     * If the request fails or times out a new request might be scheduled.
	     */
	    function sendTimedRequest() {
	      requestsAttempted++;
	      requestStartTime = Date.now();
	      var isRequestAlive = true;
	      var request = fetch(uri, init);
	      var requestTimeout = setTimeout(function () {
	        isRequestAlive = false;
	        if (shouldRetry(requestsAttempted)) {
	           true ? warning(false, 'fetchWithRetries: HTTP timeout, retrying.') : undefined;
	          retryRequest();
	        } else {
	          reject(new Error(sprintf('fetchWithRetries(): Failed to get response from server, ' + 'tried %s times.', requestsAttempted)));
	        }
	      }, _fetchTimeout);

	      request.then(function (response) {
	        clearTimeout(requestTimeout);
	        if (isRequestAlive) {
	          // We got a response, we can clear the timeout.
	          if (response.status >= 200 && response.status < 300) {
	            // Got a response code that indicates success, resolve the promise.
	            resolve(response);
	          } else if (shouldRetry(requestsAttempted)) {
	            // Fetch was not successful, retrying.
	            // TODO(#7595849): Only retry on transient HTTP errors.
	             true ?  true ? warning(false, 'fetchWithRetries: HTTP error, retrying.') : undefined : undefined, retryRequest();
	          } else {
	            // Request was not successful, giving up.
	            var error = new Error(sprintf('fetchWithRetries(): Still no successful response after ' + '%s retries, giving up.', requestsAttempted));
	            error.response = response;
	            reject(error);
	          }
	        }
	      })['catch'](function (error) {
	        clearTimeout(requestTimeout);
	        if (shouldRetry(requestsAttempted)) {
	          retryRequest();
	        } else {
	          reject(error);
	        }
	      });
	    }

	    /**
	     * Schedules another run of sendTimedRequest based on how much time has
	     * passed between the time the last request was sent and now.
	     */
	    function retryRequest() {
	      var retryDelay = _retryDelays[requestsAttempted - 1];
	      var retryStartTime = requestStartTime + retryDelay;
	      // Schedule retry for a configured duration after last request started.
	      setTimeout(sendTimedRequest, retryStartTime - Date.now());
	    }

	    /**
	     * Checks if another attempt should be done to send a request to the server.
	     */
	    function shouldRetry(attempt) {
	      return ExecutionEnvironment.canUseDOM && attempt <= _retryDelays.length;
	    }

	    sendTimedRequest();
	  });
	}

	module.exports = fetchWithRetries;

/***/ },
/* 208 */
/***/ function(module, exports) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 */

	'use strict';

	var hasOwnProperty = Object.prototype.hasOwnProperty;

	/**
	 * Executes the provided `callback` once for each enumerable own property in the
	 * object and constructs a new object of all the values for which `callback`
	 * returns a true value. The `callback` is invoked with three arguments:
	 *
	 *  - the property value
	 *  - the property name
	 *  - the object being traversed
	 *
	 * Properties that are added after the call to `filterObject` will not be
	 * visited by `callback`. If the values of existing properties are changed, the
	 * value passed to `callback` will be the value at the time `filterObject`
	 * visits them. Properties that are deleted before being visited are not
	 * visited.
	 *
	 * @grep function objectFilter()
	 * @grep function objFilter()
	 *
	 * @param {?object} object
	 * @param {function} callback
	 * @param {*} context
	 * @return {?object}
	 */
	function filterObject(object, callback, context) {
	  if (!object) {
	    return null;
	  }
	  var result = {};
	  for (var name in object) {
	    if (hasOwnProperty.call(object, name) && callback.call(context, object[name], name, object)) {
	      result[name] = object[name];
	    }
	  }
	  return result;
	}

	module.exports = filterObject;

/***/ },
/* 209 */
/***/ function(module, exports) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @typechecks
	 * 
	 */

	/**
	 * Returns a flattened array that represents the DFS traversal of the supplied
	 * input array. For example:
	 *
	 *   var deep = ["a", ["b", "c"], "d", {"e": [1, 2]}, [["f"], "g"]];
	 *   var flat = flattenArray(deep);
	 *   console.log(flat);
	 *   > ["a", "b", "c", "d", {"e": [1, 2]}, "f", "g"];
	 *
	 * @see https://github.com/jonschlinkert/arr-flatten
	 * @copyright 2014-2015 Jon Schlinkert
	 * @license MIT
	 */
	"use strict";

	function flattenArray(array) {
	  var result = [];
	  flatten(array, result);
	  return result;
	}

	function flatten(array, result) {
	  var length = array.length;
	  var ii = 0;

	  while (length--) {
	    var current = array[ii++];
	    if (Array.isArray(current)) {
	      flatten(current, result);
	    } else {
	      result.push(current);
	    }
	  }
	}

	module.exports = flattenArray;

/***/ },
/* 210 */
/***/ function(module, exports) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 */

	/*eslint-disable no-unused-vars */

	/**
	 * Mimics empty from PHP.
	 */
	'use strict';

	function isEmpty(obj) {
	  if (Array.isArray(obj)) {
	    return obj.length === 0;
	  } else if (typeof obj === 'object') {
	    for (var i in obj) {
	      return false;
	    }
	    return true;
	  } else {
	    return !obj;
	  }
	}

	module.exports = isEmpty;

/***/ },
/* 211 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @typechecks static-only
	 */

	'use strict';

	var invariant = __webpack_require__(2);

	/**
	 * Constructs an enumeration with keys equal to their value.
	 *
	 * For example:
	 *
	 *   var COLORS = keyMirror({blue: null, red: null});
	 *   var myColor = COLORS.blue;
	 *   var isColorValid = !!COLORS[myColor];
	 *
	 * The last line could not be performed if the values of the generated enum were
	 * not equal to their keys.
	 *
	 *   Input:  {key1: val1, key2: val2}
	 *   Output: {key1: key1, key2: key2}
	 *
	 * @param {object} obj
	 * @return {object}
	 */
	var keyMirror = function (obj) {
	  var ret = {};
	  var key;
	  !(obj instanceof Object && !Array.isArray(obj)) ?  true ? invariant(false, 'keyMirror(...): Argument must be an object.') : invariant(false) : undefined;
	  for (key in obj) {
	    if (!obj.hasOwnProperty(key)) {
	      continue;
	    }
	    ret[key] = key;
	  }
	  return ret;
	};

	module.exports = keyMirror;

/***/ },
/* 212 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @typechecks
	 */

	'use strict';

	var ExecutionEnvironment = __webpack_require__(105);

	var performance;

	if (ExecutionEnvironment.canUseDOM) {
	  performance = window.performance || window.msPerformance || window.webkitPerformance;
	}

	module.exports = performance || {};

/***/ },
/* 213 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @typechecks
	 */

	'use strict';

	var performance = __webpack_require__(212);

	var performanceNow;

	/**
	 * Detect if we can use `window.performance.now()` and gracefully fallback to
	 * `Date.now()` if it doesn't exist. We need to support Firefox < 15 for now
	 * because of Facebook's testing infrastructure.
	 */
	if (performance.now) {
	  performanceNow = function () {
	    return performance.now();
	  };
	} else {
	  performanceNow = function () {
	    return Date.now();
	  };
	}

	module.exports = performanceNow;

/***/ },
/* 214 */
/***/ function(module, exports) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @typechecks
	 * 
	 */

	/**
	 * Removes an element from an array.
	 */
	"use strict";

	function removeFromArray(array, element) {
	  var index = array.indexOf(element);
	  if (index !== -1) {
	    array.splice(index, 1);
	  }
	}

	module.exports = removeFromArray;

/***/ },
/* 215 */
/***/ function(module, exports) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * 
	 * @typechecks
	 */

	'use strict';

	var hasOwnProperty = Object.prototype.hasOwnProperty;

	/**
	 * Executes the provided `callback` once for each enumerable own property in the
	 * object until it finds one where callback returns a truthy value. If such a
	 * property is found, `someObject` immediately returns true. Otherwise, it
	 * returns false.
	 *
	 * The `callback` is invoked with three arguments:
	 *
	 *  - the property value
	 *  - the property name
	 *  - the object being traversed
	 *
	 * Properties that are added after the call to `someObject` will not be
	 * visited by `callback`. If the values of existing properties are changed, the
	 * value passed to `callback` will be the value at the time `someObject`
	 * visits them. Properties that are deleted before being visited are not
	 * visited.
	 */
	function someObject(object, callback, context) {
	  for (var name in object) {
	    if (hasOwnProperty.call(object, name)) {
	      if (callback.call(context, object[name], name, object)) {
	        return true;
	      }
	    }
	  }
	  return false;
	}

	module.exports = someObject;

/***/ },
/* 216 */
/***/ function(module, exports, __webpack_require__) {

	// the whatwg-fetch polyfill installs the fetch() function
	// on the global object (window or self)
	//
	// Return that as the export for use in Webpack, Browserify etc.
	__webpack_require__(226);
	module.exports = self.fetch.bind(self);


/***/ },
/* 217 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(221)


/***/ },
/* 218 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Promise = __webpack_require__(24);

	module.exports = Promise;
	Promise.prototype.done = function (onFulfilled, onRejected) {
	  var self = arguments.length ? this.then.apply(this, arguments) : this;
	  self.then(null, function (err) {
	    setTimeout(function () {
	      throw err;
	    }, 0);
	  });
	};


/***/ },
/* 219 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	//This file contains the ES6 extensions to the core Promises/A+ API

	var Promise = __webpack_require__(24);

	module.exports = Promise;

	/* Static Functions */

	var TRUE = valuePromise(true);
	var FALSE = valuePromise(false);
	var NULL = valuePromise(null);
	var UNDEFINED = valuePromise(undefined);
	var ZERO = valuePromise(0);
	var EMPTYSTRING = valuePromise('');

	function valuePromise(value) {
	  var p = new Promise(Promise._61);
	  p._81 = 1;
	  p._65 = value;
	  return p;
	}
	Promise.resolve = function (value) {
	  if (value instanceof Promise) return value;

	  if (value === null) return NULL;
	  if (value === undefined) return UNDEFINED;
	  if (value === true) return TRUE;
	  if (value === false) return FALSE;
	  if (value === 0) return ZERO;
	  if (value === '') return EMPTYSTRING;

	  if (typeof value === 'object' || typeof value === 'function') {
	    try {
	      var then = value.then;
	      if (typeof then === 'function') {
	        return new Promise(then.bind(value));
	      }
	    } catch (ex) {
	      return new Promise(function (resolve, reject) {
	        reject(ex);
	      });
	    }
	  }
	  return valuePromise(value);
	};

	Promise.all = function (arr) {
	  var args = Array.prototype.slice.call(arr);

	  return new Promise(function (resolve, reject) {
	    if (args.length === 0) return resolve([]);
	    var remaining = args.length;
	    function res(i, val) {
	      if (val && (typeof val === 'object' || typeof val === 'function')) {
	        if (val instanceof Promise && val.then === Promise.prototype.then) {
	          while (val._81 === 3) {
	            val = val._65;
	          }
	          if (val._81 === 1) return res(i, val._65);
	          if (val._81 === 2) reject(val._65);
	          val.then(function (val) {
	            res(i, val);
	          }, reject);
	          return;
	        } else {
	          var then = val.then;
	          if (typeof then === 'function') {
	            var p = new Promise(then.bind(val));
	            p.then(function (val) {
	              res(i, val);
	            }, reject);
	            return;
	          }
	        }
	      }
	      args[i] = val;
	      if (--remaining === 0) {
	        resolve(args);
	      }
	    }
	    for (var i = 0; i < args.length; i++) {
	      res(i, args[i]);
	    }
	  });
	};

	Promise.reject = function (value) {
	  return new Promise(function (resolve, reject) {
	    reject(value);
	  });
	};

	Promise.race = function (values) {
	  return new Promise(function (resolve, reject) {
	    values.forEach(function(value){
	      Promise.resolve(value).then(resolve, reject);
	    });
	  });
	};

	/* Prototype Methods */

	Promise.prototype['catch'] = function (onRejected) {
	  return this.then(null, onRejected);
	};


/***/ },
/* 220 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Promise = __webpack_require__(24);

	module.exports = Promise;
	Promise.prototype['finally'] = function (f) {
	  return this.then(function (value) {
	    return Promise.resolve(f()).then(function () {
	      return value;
	    });
	  }, function (err) {
	    return Promise.resolve(f()).then(function () {
	      throw err;
	    });
	  });
	};


/***/ },
/* 221 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(24);
	__webpack_require__(218);
	__webpack_require__(220);
	__webpack_require__(219);
	__webpack_require__(222);
	__webpack_require__(223);


/***/ },
/* 222 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// This file contains then/promise specific extensions that are only useful
	// for node.js interop

	var Promise = __webpack_require__(24);
	var asap = __webpack_require__(167);

	module.exports = Promise;

	/* Static Functions */

	Promise.denodeify = function (fn, argumentCount) {
	  if (
	    typeof argumentCount === 'number' && argumentCount !== Infinity
	  ) {
	    return denodeifyWithCount(fn, argumentCount);
	  } else {
	    return denodeifyWithoutCount(fn);
	  }
	}

	var callbackFn = (
	  'function (err, res) {' +
	  'if (err) { rj(err); } else { rs(res); }' +
	  '}'
	);
	function denodeifyWithCount(fn, argumentCount) {
	  var args = [];
	  for (var i = 0; i < argumentCount; i++) {
	    args.push('a' + i);
	  }
	  var body = [
	    'return function (' + args.join(',') + ') {',
	    'var self = this;',
	    'return new Promise(function (rs, rj) {',
	    'var res = fn.call(',
	    ['self'].concat(args).concat([callbackFn]).join(','),
	    ');',
	    'if (res &&',
	    '(typeof res === "object" || typeof res === "function") &&',
	    'typeof res.then === "function"',
	    ') {rs(res);}',
	    '});',
	    '};'
	  ].join('');
	  return Function(['Promise', 'fn'], body)(Promise, fn);
	}
	function denodeifyWithoutCount(fn) {
	  var fnLength = Math.max(fn.length - 1, 3);
	  var args = [];
	  for (var i = 0; i < fnLength; i++) {
	    args.push('a' + i);
	  }
	  var body = [
	    'return function (' + args.join(',') + ') {',
	    'var self = this;',
	    'var args;',
	    'var argLength = arguments.length;',
	    'if (arguments.length > ' + fnLength + ') {',
	    'args = new Array(arguments.length + 1);',
	    'for (var i = 0; i < arguments.length; i++) {',
	    'args[i] = arguments[i];',
	    '}',
	    '}',
	    'return new Promise(function (rs, rj) {',
	    'var cb = ' + callbackFn + ';',
	    'var res;',
	    'switch (argLength) {',
	    args.concat(['extra']).map(function (_, index) {
	      return (
	        'case ' + (index) + ':' +
	        'res = fn.call(' + ['self'].concat(args.slice(0, index)).concat('cb').join(',') + ');' +
	        'break;'
	      );
	    }).join(''),
	    'default:',
	    'args[argLength] = cb;',
	    'res = fn.apply(self, args);',
	    '}',
	    
	    'if (res &&',
	    '(typeof res === "object" || typeof res === "function") &&',
	    'typeof res.then === "function"',
	    ') {rs(res);}',
	    '});',
	    '};'
	  ].join('');

	  return Function(
	    ['Promise', 'fn'],
	    body
	  )(Promise, fn);
	}

	Promise.nodeify = function (fn) {
	  return function () {
	    var args = Array.prototype.slice.call(arguments);
	    var callback =
	      typeof args[args.length - 1] === 'function' ? args.pop() : null;
	    var ctx = this;
	    try {
	      return fn.apply(this, arguments).nodeify(callback, ctx);
	    } catch (ex) {
	      if (callback === null || typeof callback == 'undefined') {
	        return new Promise(function (resolve, reject) {
	          reject(ex);
	        });
	      } else {
	        asap(function () {
	          callback.call(ctx, ex);
	        })
	      }
	    }
	  }
	}

	Promise.prototype.nodeify = function (callback, ctx) {
	  if (typeof callback != 'function') return this;

	  this.then(function (value) {
	    asap(function () {
	      callback.call(ctx, null, value);
	    });
	  }, function (err) {
	    asap(function () {
	      callback.call(ctx, err);
	    });
	  });
	}


/***/ },
/* 223 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Promise = __webpack_require__(24);

	module.exports = Promise;
	Promise.enableSynchronous = function () {
	  Promise.prototype.isPending = function() {
	    return this.getState() == 0;
	  };

	  Promise.prototype.isFulfilled = function() {
	    return this.getState() == 1;
	  };

	  Promise.prototype.isRejected = function() {
	    return this.getState() == 2;
	  };

	  Promise.prototype.getValue = function () {
	    if (this._81 === 3) {
	      return this._65.getValue();
	    }

	    if (!this.isFulfilled()) {
	      throw new Error('Cannot get a value of an unfulfilled promise.');
	    }

	    return this._65;
	  };

	  Promise.prototype.getReason = function () {
	    if (this._81 === 3) {
	      return this._65.getReason();
	    }

	    if (!this.isRejected()) {
	      throw new Error('Cannot get a rejection reason of a non-rejected promise.');
	    }

	    return this._65;
	  };

	  Promise.prototype.getState = function () {
	    if (this._81 === 3) {
	      return this._65.getState();
	    }
	    if (this._81 === -1 || this._81 === -2) {
	      return 0;
	    }

	    return this._81;
	  };
	};

	Promise.disableSynchronous = function() {
	  Promise.prototype.isPending = undefined;
	  Promise.prototype.isFulfilled = undefined;
	  Promise.prototype.isRejected = undefined;
	  Promise.prototype.getValue = undefined;
	  Promise.prototype.getReason = undefined;
	  Promise.prototype.getState = undefined;
	};


/***/ },
/* 224 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 */

	module.exports = __webpack_require__(225);


/***/ },
/* 225 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule StaticContainer.react
	 * @typechecks
	 * 
	 */

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var React = __webpack_require__(33);

	/**
	 * Renders static content efficiently by allowing React to short-circuit the
	 * reconciliation process. This component should be used when you know that a
	 * subtree of components will never need to be updated.
	 *
	 *   var someValue = ...; // We know for certain this value will never change.
	 *   return (
	 *     <StaticContainer>
	 *       <MyComponent value={someValue} />
	 *     </StaticContainer>
	 *   );
	 *
	 * Typically, you will not need to use this component and should opt for normal
	 * React reconciliation.
	 */

	var StaticContainer = (function (_React$Component) {
	  _inherits(StaticContainer, _React$Component);

	  function StaticContainer() {
	    _classCallCheck(this, StaticContainer);

	    _get(Object.getPrototypeOf(StaticContainer.prototype), 'constructor', this).apply(this, arguments);
	  }

	  _createClass(StaticContainer, [{
	    key: 'shouldComponentUpdate',
	    value: function shouldComponentUpdate(nextProps) {
	      return !!nextProps.shouldUpdate;
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var child = this.props.children;
	      if (child === null || child === false) {
	        return null;
	      }
	      return React.Children.only(child);
	    }
	  }]);

	  return StaticContainer;
	})(React.Component);

	module.exports = StaticContainer;

/***/ },
/* 226 */
/***/ function(module, exports) {

	(function(self) {
	  'use strict';

	  if (self.fetch) {
	    return
	  }

	  function normalizeName(name) {
	    if (typeof name !== 'string') {
	      name = String(name)
	    }
	    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
	      throw new TypeError('Invalid character in header field name')
	    }
	    return name.toLowerCase()
	  }

	  function normalizeValue(value) {
	    if (typeof value !== 'string') {
	      value = String(value)
	    }
	    return value
	  }

	  function Headers(headers) {
	    this.map = {}

	    if (headers instanceof Headers) {
	      headers.forEach(function(value, name) {
	        this.append(name, value)
	      }, this)

	    } else if (headers) {
	      Object.getOwnPropertyNames(headers).forEach(function(name) {
	        this.append(name, headers[name])
	      }, this)
	    }
	  }

	  Headers.prototype.append = function(name, value) {
	    name = normalizeName(name)
	    value = normalizeValue(value)
	    var list = this.map[name]
	    if (!list) {
	      list = []
	      this.map[name] = list
	    }
	    list.push(value)
	  }

	  Headers.prototype['delete'] = function(name) {
	    delete this.map[normalizeName(name)]
	  }

	  Headers.prototype.get = function(name) {
	    var values = this.map[normalizeName(name)]
	    return values ? values[0] : null
	  }

	  Headers.prototype.getAll = function(name) {
	    return this.map[normalizeName(name)] || []
	  }

	  Headers.prototype.has = function(name) {
	    return this.map.hasOwnProperty(normalizeName(name))
	  }

	  Headers.prototype.set = function(name, value) {
	    this.map[normalizeName(name)] = [normalizeValue(value)]
	  }

	  Headers.prototype.forEach = function(callback, thisArg) {
	    Object.getOwnPropertyNames(this.map).forEach(function(name) {
	      this.map[name].forEach(function(value) {
	        callback.call(thisArg, value, name, this)
	      }, this)
	    }, this)
	  }

	  function consumed(body) {
	    if (body.bodyUsed) {
	      return Promise.reject(new TypeError('Already read'))
	    }
	    body.bodyUsed = true
	  }

	  function fileReaderReady(reader) {
	    return new Promise(function(resolve, reject) {
	      reader.onload = function() {
	        resolve(reader.result)
	      }
	      reader.onerror = function() {
	        reject(reader.error)
	      }
	    })
	  }

	  function readBlobAsArrayBuffer(blob) {
	    var reader = new FileReader()
	    reader.readAsArrayBuffer(blob)
	    return fileReaderReady(reader)
	  }

	  function readBlobAsText(blob) {
	    var reader = new FileReader()
	    reader.readAsText(blob)
	    return fileReaderReady(reader)
	  }

	  var support = {
	    blob: 'FileReader' in self && 'Blob' in self && (function() {
	      try {
	        new Blob();
	        return true
	      } catch(e) {
	        return false
	      }
	    })(),
	    formData: 'FormData' in self,
	    arrayBuffer: 'ArrayBuffer' in self
	  }

	  function Body() {
	    this.bodyUsed = false


	    this._initBody = function(body) {
	      this._bodyInit = body
	      if (typeof body === 'string') {
	        this._bodyText = body
	      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
	        this._bodyBlob = body
	      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
	        this._bodyFormData = body
	      } else if (!body) {
	        this._bodyText = ''
	      } else if (support.arrayBuffer && ArrayBuffer.prototype.isPrototypeOf(body)) {
	        // Only support ArrayBuffers for POST method.
	        // Receiving ArrayBuffers happens via Blobs, instead.
	      } else {
	        throw new Error('unsupported BodyInit type')
	      }

	      if (!this.headers.get('content-type')) {
	        if (typeof body === 'string') {
	          this.headers.set('content-type', 'text/plain;charset=UTF-8')
	        } else if (this._bodyBlob && this._bodyBlob.type) {
	          this.headers.set('content-type', this._bodyBlob.type)
	        }
	      }
	    }

	    if (support.blob) {
	      this.blob = function() {
	        var rejected = consumed(this)
	        if (rejected) {
	          return rejected
	        }

	        if (this._bodyBlob) {
	          return Promise.resolve(this._bodyBlob)
	        } else if (this._bodyFormData) {
	          throw new Error('could not read FormData body as blob')
	        } else {
	          return Promise.resolve(new Blob([this._bodyText]))
	        }
	      }

	      this.arrayBuffer = function() {
	        return this.blob().then(readBlobAsArrayBuffer)
	      }

	      this.text = function() {
	        var rejected = consumed(this)
	        if (rejected) {
	          return rejected
	        }

	        if (this._bodyBlob) {
	          return readBlobAsText(this._bodyBlob)
	        } else if (this._bodyFormData) {
	          throw new Error('could not read FormData body as text')
	        } else {
	          return Promise.resolve(this._bodyText)
	        }
	      }
	    } else {
	      this.text = function() {
	        var rejected = consumed(this)
	        return rejected ? rejected : Promise.resolve(this._bodyText)
	      }
	    }

	    if (support.formData) {
	      this.formData = function() {
	        return this.text().then(decode)
	      }
	    }

	    this.json = function() {
	      return this.text().then(JSON.parse)
	    }

	    return this
	  }

	  // HTTP methods whose capitalization should be normalized
	  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']

	  function normalizeMethod(method) {
	    var upcased = method.toUpperCase()
	    return (methods.indexOf(upcased) > -1) ? upcased : method
	  }

	  function Request(input, options) {
	    options = options || {}
	    var body = options.body
	    if (Request.prototype.isPrototypeOf(input)) {
	      if (input.bodyUsed) {
	        throw new TypeError('Already read')
	      }
	      this.url = input.url
	      this.credentials = input.credentials
	      if (!options.headers) {
	        this.headers = new Headers(input.headers)
	      }
	      this.method = input.method
	      this.mode = input.mode
	      if (!body) {
	        body = input._bodyInit
	        input.bodyUsed = true
	      }
	    } else {
	      this.url = input
	    }

	    this.credentials = options.credentials || this.credentials || 'omit'
	    if (options.headers || !this.headers) {
	      this.headers = new Headers(options.headers)
	    }
	    this.method = normalizeMethod(options.method || this.method || 'GET')
	    this.mode = options.mode || this.mode || null
	    this.referrer = null

	    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
	      throw new TypeError('Body not allowed for GET or HEAD requests')
	    }
	    this._initBody(body)
	  }

	  Request.prototype.clone = function() {
	    return new Request(this)
	  }

	  function decode(body) {
	    var form = new FormData()
	    body.trim().split('&').forEach(function(bytes) {
	      if (bytes) {
	        var split = bytes.split('=')
	        var name = split.shift().replace(/\+/g, ' ')
	        var value = split.join('=').replace(/\+/g, ' ')
	        form.append(decodeURIComponent(name), decodeURIComponent(value))
	      }
	    })
	    return form
	  }

	  function headers(xhr) {
	    var head = new Headers()
	    var pairs = xhr.getAllResponseHeaders().trim().split('\n')
	    pairs.forEach(function(header) {
	      var split = header.trim().split(':')
	      var key = split.shift().trim()
	      var value = split.join(':').trim()
	      head.append(key, value)
	    })
	    return head
	  }

	  Body.call(Request.prototype)

	  function Response(bodyInit, options) {
	    if (!options) {
	      options = {}
	    }

	    this.type = 'default'
	    this.status = options.status
	    this.ok = this.status >= 200 && this.status < 300
	    this.statusText = options.statusText
	    this.headers = options.headers instanceof Headers ? options.headers : new Headers(options.headers)
	    this.url = options.url || ''
	    this._initBody(bodyInit)
	  }

	  Body.call(Response.prototype)

	  Response.prototype.clone = function() {
	    return new Response(this._bodyInit, {
	      status: this.status,
	      statusText: this.statusText,
	      headers: new Headers(this.headers),
	      url: this.url
	    })
	  }

	  Response.error = function() {
	    var response = new Response(null, {status: 0, statusText: ''})
	    response.type = 'error'
	    return response
	  }

	  var redirectStatuses = [301, 302, 303, 307, 308]

	  Response.redirect = function(url, status) {
	    if (redirectStatuses.indexOf(status) === -1) {
	      throw new RangeError('Invalid status code')
	    }

	    return new Response(null, {status: status, headers: {location: url}})
	  }

	  self.Headers = Headers;
	  self.Request = Request;
	  self.Response = Response;

	  self.fetch = function(input, init) {
	    return new Promise(function(resolve, reject) {
	      var request
	      if (Request.prototype.isPrototypeOf(input) && !init) {
	        request = input
	      } else {
	        request = new Request(input, init)
	      }

	      var xhr = new XMLHttpRequest()

	      function responseURL() {
	        if ('responseURL' in xhr) {
	          return xhr.responseURL
	        }

	        // Avoid security warnings on getResponseHeader when not allowed by CORS
	        if (/^X-Request-URL:/m.test(xhr.getAllResponseHeaders())) {
	          return xhr.getResponseHeader('X-Request-URL')
	        }

	        return;
	      }

	      xhr.onload = function() {
	        var status = (xhr.status === 1223) ? 204 : xhr.status
	        if (status < 100 || status > 599) {
	          reject(new TypeError('Network request failed'))
	          return
	        }
	        var options = {
	          status: status,
	          statusText: xhr.statusText,
	          headers: headers(xhr),
	          url: responseURL()
	        }
	        var body = 'response' in xhr ? xhr.response : xhr.responseText;
	        resolve(new Response(body, options))
	      }

	      xhr.onerror = function() {
	        reject(new TypeError('Network request failed'))
	      }

	      xhr.open(request.method, request.url, true)

	      if (request.credentials === 'include') {
	        xhr.withCredentials = true
	      }

	      if ('responseType' in xhr && support.blob) {
	        xhr.responseType = 'blob'
	      }

	      request.headers.forEach(function(value, name) {
	        xhr.setRequestHeader(name, value)
	      })

	      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit)
	    })
	  }
	  self.fetch.polyfill = true
	})(typeof self !== 'undefined' ? self : this);


/***/ },
/* 227 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_227__;

/***/ }
/******/ ])
});
;