var expect = require('chai').expect;
var createPropTypes = require('..');

describe('createPropTypes', function() {
  var schema, validators;

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
    var schema = "";
    var createPropTypesFn = function() { createPropTypes(schema) };
    expect(createPropTypesFn).to.throw(TypeError, "Schema must be of type 'object'");
  });

  it ('throws if json schema\'s type is not "object"', function() {
    var schema = {
      type: "string"
    };
    var createPropTypesFn = function() { createPropTypes(schema) };
    expect(createPropTypesFn).to.throw(Error, "Schema must define an object type (currently: string)");
  });

  it('creates a proptype validator for each prop', function() {
    Object.keys(schema.properties).forEach(function(propKey) {
      expect(validators[propKey]).to.be.defined;
      expect(validators[propKey]).to.be.a('function');
    });
  });

  it('exposes the schema that it is using to validate', function() {
    var propTypes = createPropTypes(schema);
    expect(propTypes.__schema).to.equal(schema);
  });

  it('hides the schema from enumerable properties', function() {
    var propTypes = createPropTypes(schema);
    expect(Object.keys(propTypes)).to.eql(["id"]);
  });

  describe('validator', function() {
    it('validates correctly based on the property it references', function() {
      var propTypes = createPropTypes(schema);
      expect(propTypes["id"]({ id: 15 }, "id")).to.be.an.instanceOf(Error);
      expect(propTypes["id"]({ id: "hello" }, "id")).to.be.a('null');
    });

    it('respects required properties', function() {
      var propTypes = createPropTypes({
        type: "object",
        required: ["a"],
        properties: {
          a: { type: "string" },
          b: { type: "string" }
        }
      });

      expect(propTypes.a({}, "a")).to.be.an.instanceOf(Error);
      expect(propTypes.b({}, "b")).to.be.a('null');
    })
  });
});
