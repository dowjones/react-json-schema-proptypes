'use strict';

var _ajv = require('ajv');

var _ajv2 = _interopRequireDefault(_ajv);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

var ajv = (0, _ajv2.default)();

function getPropError(propName, errors) {
  for (var i = 0; i < errors.length; i++) {
    if (errors[i].dataPath === '.' + propName) return errors[i];
  }

  return null;
}

module.exports = function (schema) {
  if ((typeof schema === 'undefined' ? 'undefined' : _typeof(schema)) !== "object") throw new TypeError("Schema must be of type 'object'");
  if (schema.type !== "object") throw new Error("Schema must define an object type (currently: " + schema.type + ")");

  // Creates a new prototype chain with the schema applied to it.
  // This hides the schema from React but exposes the validators correctly.
  var PropTypes = function PropTypes() {};
  PropTypes.prototype.__schema = schema;
  var propTypes = new PropTypes();

  if (schema.properties) {
    (function () {
      var validate = ajv.compile(schema);

      for (var prop in schema.properties) {
        propTypes[prop] = function (props, propName, componentName) {
          var valid = validate(props);
          if (valid) return null;

          var propError = getPropError(propName, validate.errors);
          if (!propError) return null;

          return new Error("'" + propName + "' " + propError.message + ', found ' + JSON.stringify(props[propName]) + ' instead. Check propTypes of component ' + componentName);
        };
      }
    })();
  }

  return propTypes;
};