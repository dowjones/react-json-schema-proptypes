/* @flow */
import AJV from 'ajv';
const ajv = AJV();

export default function(schema: Object): Object {
  if (typeof schema !== 'object') {
    throw new TypeError('Schema must be of type \'object\'');
  }
  if (schema.type !== 'object') {
    throw new Error(`Schema must define an object type (currently: ${schema.type})`);
  }

  // Creates a new prototype chain with the schema applied to it.
  // This hides the schema from React but exposes the validators correctly.
  const PropTypes = function() {};
  PropTypes.prototype.__schema = schema;
  const propTypes = new PropTypes();

  if (schema.properties) {
    const validate = ajv.compile(schema);

    for (let prop in schema.properties) {
      if (schema.properties.hasOwnProperty(prop)) {
        propTypes[prop] = function(props: Object, propName: string, componentName: string): ?Error {
          const valid = validate(props);
          if (valid) return null;

          const propError = validate.errors.find((e: Object): boolean => e.dataPath === `.${propName}`);
          if (!propError) return null;

          return new Error(`'${propName}' ${propError.message}, found ${JSON.stringify(props[propName])} instead. Check propTypes of component ${componentName}`);
        };
      }
    }
  }

  return propTypes;
}
