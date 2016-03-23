import chai from 'chai';
import createPropTypes, {getComponentSchema, SchemaSymbol} from '../src';
import 'mocha-sinon';

const expect = chai.expect;

describe('getComponentSchema', () => {
  it('throws if component has no proptypes', () => {
    const component = {displayName: 'test'};
    const findSchema = () => getComponentSchema(component);
    expect(findSchema).to.throw('Component test has no propTypes.');
  });

  it('throws if proptypes is not a valid schema', () => {
    const component = {displayName: 'test', propTypes: {}};
    const findSchema = () => getComponentSchema(component);
    expect(findSchema).to.throw('Component test has no JSON Schema propType definition.');
  });

  it('should not expose deprecated props', () => {

    const component = {displayName: 'test', propTypes: createPropTypes({
        type: 'object',
        properties: {
          "id" : {
            "type" : "string"
          },
          iDoNothing: {
            type: "string",
            deprecated: {
              deprecatedOn: "2012-08-31",
              description: "Please use 'iDoSomething' instead."
            }
          }
        }
      })};
    const schema = getComponentSchema(component);
    expect(schema.properties['iDoNothing']).to.be.undefined;
  });  
});

describe('createPropTypes', function() {
  let schema, validators;

  beforeEach(function() {
    schema = {
      "type" : "object",
      "description" : "PropTypes for some component",
      "properties" : {
        "id" : {
          "type" : "string"
        }
      }
    };

    validators = createPropTypes(schema);
  });

  it('throws if json schema is not an object', function() {
    const schema = "";
    expect(() => createPropTypes(schema))
    .to.throw(TypeError, "Schema must be of type 'object'");
  });

  it ('throws if json schema\'s type is not "object"', function() {
    const schema = {
      type: "string"
    };
    expect(() => createPropTypes(schema))
    .to.throw(Error, "Schema must define an object type (currently: string)");
  });

  it('creates a proptype validator for each prop', function() {
    Object.keys(schema.properties).forEach(function(propKey) {
      expect(validators[propKey]).to.be.defined;
      expect(validators[propKey]).to.be.a('function');
    });
  });

  it('exposes the schema that it is using to validate', function() {
    const propTypes = createPropTypes(schema);
    expect(propTypes[SchemaSymbol]).to.eql(schema);
  });

  it('hides the schema from enumerable properties', function() {
    const propTypes = createPropTypes(schema);
    expect(Object.keys(propTypes)).to.eql(["id"]);
  });

  it('can take existing proptypes as an argument', function() {
    const newSchema = {
      [SchemaSymbol]: schema
    };

    const propTypes = createPropTypes(newSchema);
    expect(Object.keys(propTypes)).to.eql(["id"]);
  });

  it('deep merges multiple schemas together', function() {
    const updates = {
      "properties" : {
        "name" : {
          "type" : "string"
        }
      }
    };

    const propTypes = createPropTypes(schema, updates);
    expect(Object.keys(propTypes)).to.eql(["id", "name"]);
  });

  it('warns on deprecated properties', function() {
    this.sinon.stub(console, 'warn');
    
    const propTypes = createPropTypes({
      type: 'object',
      properties: {
        iDoSomething: {type: "string"},
        iDoNothing: {
          type: "string",
          deprecated: {
            deprecatedOn: "2012-08-31",
            description: "Please use 'iDoSomething' instead."
          }
        }
      }
    });

    expect(propTypes["iDoNothing"]({iDoNothing: "hello"}, "iDoNothing")); // invoke custom validator
    expect(console.warn.calledOnce).to.be.true;
  });

  describe('validator', function() {
    it('validates correctly based on the property it references', function() {
      const propTypes = createPropTypes(schema);
      expect(propTypes["id"]({ id: 15 }, "id")).to.be.an.instanceOf(Error);
      expect(propTypes["id"]({ id: "hello" }, "id")).to.be.a('null');
    });

    it('respects required properties', function() {
      const propTypes = createPropTypes({
        type: "object",
        required: ["a"],
        properties: {
          a: { type: "string" },
          b: { type: "string" }
        }
      });

      expect(propTypes.a({}, "a")).to.be.an.instanceOf(Error);
      expect(propTypes.b({}, "b")).to.be.a('null');
    });

    it('error on deep (nested) validation errors', function() {
      const propTypes = createPropTypes({
        type: 'object',
        properties: {
          a: {
            type: 'object',
            properties: {
              b: { type: 'string' }
            }
          },
          c: { type: 'number' }
        }
      });
      expect(propTypes.a({a: {b: 1}, c: 1}, 'a')).to.be.an.instanceOf(Error);
      expect(propTypes.c({a: {b: '1'}, c: 'dsasd'}, 'c')).to.be.an.instanceOf(Error);
    });
  });
});
