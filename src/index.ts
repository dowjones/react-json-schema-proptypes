import * as _ from 'lodash';
import ajv from './ajvEx';
import omitDeprecated from './util';

export const SchemaSymbol = Symbol.for('react-json-schema-proptypes');

function name(component) {
  return component.name || component.displayName;
}

function getSchema(schema: any): any {
  return schema[SchemaSymbol] || schema;
}

export function getComponentSchema(component: any): any {
  if (typeof component.propTypes === 'undefined')
    throw new Error(`Component ${name(component)} has no propTypes.`);

  if (typeof component.propTypes[SchemaSymbol] === 'undefined')
    throw new Error(`Component ${name(component)} has no JSON Schema propType definition.`);

  return omitDeprecated(component.propTypes[SchemaSymbol]);
}

export default function(mainSchema: any, ...otherSchemas: any[]): any {
  if (typeof mainSchema !== 'object') {
    throw new TypeError('Schema must be of type \'object\'');
  }

  const schema: any = _.merge({}, getSchema(mainSchema), ...otherSchemas.map(getSchema));

  if (schema.type !== 'object') {
    throw new Error(`Schema must define an object type (currently: ${schema.type})`);
  }

  const propTypes = { [SchemaSymbol]: schema };

  if (schema.properties) {
    const validate = ajv.compile(schema);

    for (let prop in schema.properties) {
      if (schema.properties.hasOwnProperty(prop)) {
        propTypes[prop] = function(props: any, propName: string, componentName: string): void|Error {
          const valid = validate(props);
          if (valid) return null;

          const propError = validate.errors.find((e: any): boolean =>
            new RegExp(`^\.${propName}(\.|$)`).test(e.dataPath));
          if (!propError) return null;

          return new Error(`'${propError.dataPath}' ${propError.message}, found ${JSON.stringify(props[propName])} instead. Check propTypes of component ${componentName}`);
        };
      }
    }
  }

  return propTypes;
}
