var tv4 = require('tv4');

module.exports = function(schema) {
  if (typeof schema !== "object") throw new TypeError("Schema must be of type 'object'");
  if (schema.type !== "object") throw new Error("Schema must define an object type (currently: " + schema.type + ")");

  // Creates a new prototype chain with the schema applied to it.
  // This hides the schema from React but exposes the validators correctly.
  var PropTypes = function() {};
  PropTypes.prototype.__schema = schema;
  var propTypes = new PropTypes();

  if (schema.properties) {
    Object.keys(schema.properties).forEach(function(prop) {
      propTypes[prop] = function(props, propName, componentName) {
        var validation = tv4.validateResult(props[propName], schema.properties[prop]);
        if (!validation.valid) {
          return new Error(validation.error.message);
        } else {
          return true;
        }
      }
    });
  }

  return propTypes;
}
