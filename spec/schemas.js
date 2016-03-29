import chai from 'chai';
import * as schema from '../lib/schemas';
import createPropTypes from '../lib';
import React from 'react';


const expect = chai.expect;

const element = React.createElement('li', null, 'Text Content');

describe('schemas', () => {
  describe('element', () => {
    it('is a schema that validates a react element', () => {
      
      const componentSchema = { 
        type: 'object', 
        properties: {
          element: schema.element
        }
      };

      const propTypes = createPropTypes( componentSchema );

      expect(propTypes.element({element: element}, 'element')).to.eq(null);
      expect(propTypes.element({element: {}}, 'element')).to.be.an.instanceOf(Error);
      expect(propTypes.element({element: []}, 'element')).to.be.an.instanceOf(Error);
      expect(propTypes.element({element: false}, 'element')).to.be.an.instanceOf(Error);
      expect(propTypes.element({element: 1}, 'element')).to.be.an.instanceOf(Error);
      expect(propTypes.element({element: 'string'}, 'element')).to.be.an.instanceOf(Error);
    });
  });

  describe('node', () => {
    it('is a schema that validates a react node', () => {
      
      const componentSchema = { 
        type: 'object', 
        properties: {
          node: schema.node
        }
      };

      const propTypes = createPropTypes( componentSchema );

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
});