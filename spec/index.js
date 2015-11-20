import chai from 'chai';
import createPropTypes from '../src';

const expect = chai.expect;

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
    expect(propTypes.__schema).to.eql(schema);
  });

  it('hides the schema from enumerable properties', function() {
    const propTypes = createPropTypes(schema);
    expect(Object.keys(propTypes)).to.eql(["id"]);
  });

  it('can take existing proptypes as an argument', function() {
    const newSchema = {
      __schema: schema
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
  });
});
