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

var _toConsumableArray = require('babel-runtime/helpers/to-consumable-array')['default'];

var RelayProfiler = require('./RelayProfiler');
var RelayQuery = require('./RelayQuery');

var base62 = require('fbjs/lib/base62');
var forEachObject = require('fbjs/lib/forEachObject');
var invariant = require('fbjs/lib/invariant');
var mapObject = require('fbjs/lib/mapObject');

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
  !queryText ? process.env.NODE_ENV !== 'production' ? invariant(false, 'printRelayOSSQuery(): Unsupported node type.') : invariant(false) : undefined;
  return {
    text: [queryText].concat(_toConsumableArray(printerState.fragmentTexts)).join(' '),
    variables: mapObject(printerState.variableMap, function (variable) {
      return variable.value;
    })
  };
}

function printRoot(node, printerState) {
  !!node.getBatchCall() ? process.env.NODE_ENV !== 'production' ? invariant(false, 'printRelayOSSQuery(): Deferred queries are not supported.') : invariant(false) : undefined;
  var identifyingArg = node.getIdentifyingArg();
  var identifyingArgName = identifyingArg && identifyingArg.name || null;
  var identifyingArgType = identifyingArg && identifyingArg.type || null;
  var identifyingArgValue = identifyingArg && identifyingArg.value || null;
  var fieldName = node.getFieldName();
  if (identifyingArgValue != null) {
    !identifyingArgName ? process.env.NODE_ENV !== 'production' ? invariant(false, 'printRelayOSSQuery(): Expected an argument name for root field `%s`.', fieldName) : invariant(false) : undefined;
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
  !inputString ? process.env.NODE_ENV !== 'production' ? invariant(false, 'printRelayOSSQuery(): Expected mutation `%s` to have a value for `%s`.', node.getName(), node.getCallVariableName()) : invariant(false) : undefined;
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
  !(node instanceof RelayQuery.Field) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'printRelayOSSQuery(): Query must be flattened before printing.') : invariant(false) : undefined;
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
      !(node instanceof RelayQuery.Fragment) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'printRelayOSSQuery(): expected child node to be a `Field` or ' + '`Fragment`, got `%s`.', node.constructor.name) : invariant(false) : undefined;
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

  !(typeof value === 'boolean' || typeof value === 'number' || typeof value === 'string') ? process.env.NODE_ENV !== 'production' ? invariant(false, 'printRelayOSSQuery(): Relay only supports directives with scalar values ' + '(boolean, number, or string), got `%s: %s`.', name, value) : invariant(false) : undefined;
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