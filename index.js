var ajv = require('ajv')();

function getPropError(propName, errors) {
  for(var i = 0; i < errors.length; i++) {
    if(errors[i].dataPath === '.' + propName)
      return errors[i];
  }

  return null;
}

module.exports = function(schema) {
  if (typeof schema !== "object") throw new TypeError("Schema must be of type 'object'");
  if (schema.type !== "object") throw new Error("Schema must define an object type (currently: " + schema.type + ")");

  // Creates a new prototype chain with the schema applied to it.
  // This hides the schema from React but exposes the validators correctly.
  var PropTypes = function() {};
  PropTypes.prototype.__schema = schema;
  var propTypes = new PropTypes();

  if (schema.properties) {
    var validate = ajv.compile(schema);

    Object.keys(schema.properties).forEach(function(prop) {
      propTypes[prop] = function(props, propName, componentName) {
        var valid = validate(props);
        if (valid) return null;

        var propError = getPropError(propName, validate.errors);
        if (!propError) return null;

        return new Error("'" + propName + "' " + propError.message + ', found ' + JSON.stringify(props[propName]) + ' instead. Check propTypes of component ' + componentName);
      }
    });
  }

  return propTypes;
}
