import chai from 'chai';
import * as schema from '../src/schemas'
import createPropTypes from '../src';
import React from 'react';


const expect = chai.expect;

const element = React.createElement('li', null, 'Text Content');

describe('schemas', () => {
  describe('array', () => {
    it('returns a schema that validates an array', () => {
      
      const componentSchema = { 
        type: 'object', 
        properties: {
          array: schema.array()
        }
      };

      const propTypes = createPropTypes( componentSchema );

      expect(propTypes.array({array: []}, 'array')).to.eq(null);
      expect(propTypes.array({array: false}, 'array')).to.be.an.instanceOf(Error);
      expect(propTypes.array({array: 1}, 'array')).to.be.an.instanceOf(Error);
      expect(propTypes.array({array: {}}, 'array')).to.be.an.instanceOf(Error);
      expect(propTypes.array({array: 'string'}, 'array')).to.be.an.instanceOf(Error);
    });
  });

  describe('boolean', () => {
    it('returns a schema that validates a boolean', () => {
      
      const componentSchema = { 
        type: 'object', 
        properties: {
          boolean: schema.boolean()
        }
      };

      const propTypes = createPropTypes( componentSchema );

      expect(propTypes.boolean({boolean: false}, 'boolean')).to.eq(null);
      expect(propTypes.boolean({boolean: []}, 'boolean')).to.be.an.instanceOf(Error);
      expect(propTypes.boolean({boolean: 1}, 'boolean')).to.be.an.instanceOf(Error);
      expect(propTypes.boolean({boolean: {}}, 'boolean')).to.be.an.instanceOf(Error);
      expect(propTypes.boolean({boolean: 'string'}, 'boolean')).to.be.an.instanceOf(Error);
    });
  });

  describe('number', () => {
    it('returns a schema that validates a number', () => {
      
      const componentSchema = { 
        type: 'object', 
        properties: {
          number: schema.number()
        }
      };

      const propTypes = createPropTypes( componentSchema );

      expect(propTypes.number({number: 1}, 'number')).to.eq(null);
      expect(propTypes.number({number: []}, 'number')).to.be.an.instanceOf(Error);
      expect(propTypes.number({number: false}, 'number')).to.be.an.instanceOf(Error);
      expect(propTypes.number({number: {}}, 'number')).to.be.an.instanceOf(Error);
      expect(propTypes.number({number: 'string'}, 'number')).to.be.an.instanceOf(Error);
    });
  });

  describe('object', () => {
    it('returns a schema that validates a object', () => {
      
      const componentSchema = { 
        type: 'object', 
        properties: {
          object: schema.object()
        }
      };

      const propTypes = createPropTypes( componentSchema );

      expect(propTypes.object({object: {}}, 'object')).to.eq(null);
      expect(propTypes.object({object: []}, 'object')).to.be.an.instanceOf(Error);
      expect(propTypes.object({object: false}, 'object')).to.be.an.instanceOf(Error);
      expect(propTypes.object({object: 1}, 'object')).to.be.an.instanceOf(Error);
      expect(propTypes.object({object: 'string'}, 'object')).to.be.an.instanceOf(Error);
    });
  });


  describe('string', () => {
    it('returns a schema that validates a string', () => {
      
      const componentSchema = { 
        type: 'object', 
        properties: {
          string: schema.string()
        }
      };

      const propTypes = createPropTypes( componentSchema );

      expect(propTypes.string({string: 'string'}, 'string')).to.eq(null);
      expect(propTypes.string({string: []}, 'string')).to.be.an.instanceOf(Error);
      expect(propTypes.string({string: false}, 'string')).to.be.an.instanceOf(Error);
      expect(propTypes.string({string: 1}, 'string')).to.be.an.instanceOf(Error);
      expect(propTypes.string({string: {}}, 'string')).to.be.an.instanceOf(Error);
    });
  });


  describe('element', () => {
    it('returns a schema that validates a react element', () => {
      
      const componentSchema = { 
        type: 'object', 
        properties: {
          element: schema.element()
        }
      };

      const propTypes = createPropTypes( componentSchema );
      var child = React.createElement('li', null, 'Text Content');


      expect(propTypes.element({element: element}, 'element')).to.eq(null);
      expect(propTypes.element({element: {}}, 'element')).to.be.an.instanceOf(Error);
      expect(propTypes.element({element: []}, 'element')).to.be.an.instanceOf(Error);
      expect(propTypes.element({element: false}, 'element')).to.be.an.instanceOf(Error);
      expect(propTypes.element({element: 1}, 'element')).to.be.an.instanceOf(Error);
      expect(propTypes.element({element: 'string'}, 'element')).to.be.an.instanceOf(Error);
    });
  });

  describe('node', () => {
    it('returns a schema that validates a react node', () => {
      
      const componentSchema = { 
        type: 'object', 
        properties: {
          node: schema.node()
        }
      };

      const propTypes = createPropTypes( componentSchema );
      var child = React.createElement('li', null, 'Text Content');


      expect(propTypes.node({node: 'string'}, 'node')).to.eq(null);
      expect(propTypes.node({node: element}, 'node')).to.eq(null);
      expect(propTypes.node({node: []}, 'node')).to.eq(null);
      expect(propTypes.node({node: 1}, 'node')).to.eq(null);
      expect(propTypes.node({node: [element] }, 'node')).to.eq(null);
      expect(propTypes.node({node: [1] }, 'node')).to.eq(null);
      expect(propTypes.node({node: [ element, 1, 'string' ]}, 'node')).to.eq(null);
      expect(propTypes.node({node: false}, 'node')).to.be.an.instanceOf(Error);
      expect(propTypes.node({node: {}}, 'node')).to.be.an.instanceOf(Error);
    });
  });
})