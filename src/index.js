/* @flow */
import AJV from 'ajv';
import deepExtend from 'deep-extend';
const ajv = AJV();

export const SchemaSymbol = Symbol();

function name(component) {
  return component.name || component.displayName;
}

function getSchema(schema: Object): Object {
  return schema[SchemaSymbol] || schema;
}

export function getComponentSchema(component: Object): Object {
  if (typeof component.propTypes === 'undefined')
    throw new Error(`Component ${name(component)} has no propTypes.`);

  if (typeof component.propTypes[SchemaSymbol] === 'undefined')
    throw new Error(`Component ${name(component)} has no JSON Schema propType definition.`);

  return component.propTypes[SchemaSymbol];
}

export default function(mainSchema: Object, ...otherSchemas: Array<Object>): Object {
  if (typeof mainSchema !== 'object') {
    throw new TypeError('Schema must be of type \'object\'');
  }

  const schema = deepExtend({}, getSchema(mainSchema), ...otherSchemas.map(getSchema));

  if (schema.type !== 'object') {
    throw new Error(`Schema must define an object type (currently: ${schema.type})`);
  }

  // $FlowIgnore: flow does not support computed property keys yet.
  const propTypes = { [SchemaSymbol]: schema };

  if (schema.properties) {
    const validate = ajv.compile(schema);

    for (let prop in schema.properties) {
      if (schema.properties.hasOwnProperty(prop)) {
        propTypes[prop] = function(props: Object, propName: string, componentName: string): ?Error {
          const valid = validate(props);
          if (valid) return null;

          const propError = validate.errors.find((e: Object): boolean =>
            new RegExp(`^\.${propName}(\.|$)`).test(e.dataPath));
          if (!propError) return null;

          return new Error(`'${propError.dataPath}' ${propError.message}, found ${JSON.stringify(props[propName])} instead. Check propTypes of component ${componentName}`);
        };
      }
    }
  }

  return propTypes;
}
