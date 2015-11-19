import AJV from 'ajv';
const ajv = AJV();

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
  const PropTypes = function() {};
  PropTypes.prototype.__schema = schema;
  const propTypes = new PropTypes();

  if (schema.properties) {
    const validate = ajv.compile(schema);

    for (let prop in schema.properties) {
      propTypes[prop] = function(props, propName, componentName) {
        const valid = validate(props);
        if (valid) return null;

        const propError = getPropError(propName, validate.errors);
        if (!propError) return null;

        return new Error("'" + propName + "' " + propError.message + ', found ' + JSON.stringify(props[propName]) + ' instead. Check propTypes of component ' + componentName);
      };
    }
  }

  return propTypes;
};
