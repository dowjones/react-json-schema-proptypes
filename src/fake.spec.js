import { expect } from 'chai';
import sinon from 'sinon';
import {isValidElement} from 'react';

import {func, element} from './schemas';
import fake from './fake';

describe('faking', () => {
  describe('basic types', () => {
    it('fakes scalars', () => {
      const schema = {
        type: 'object',
        properties: {
          boolean: { type: 'boolean' },
          string: { type: 'string' },
          number: { type: 'number' }
        },
        required: ['boolean', 'string', 'number']
      };

      const faked = fake(schema);

      expect(faked.boolean).to.be.oneOf([true, false]);
      expect(faked.string).to.be.a('string');
      expect(faked.number.toString()).to.match(/\d+/);
    });

    it('respects enums', () => {
      const schema = {
        type: 'object',
        properties: {
          foo: { type: 'string', enum: ['a', 'b']}
        },
        required: ['foo']
      };

      const faked = fake(schema);
      expect(faked.foo).to.be.oneOf(['a', 'b']);
    });

    it('fakes objects', () => {
      const schema = {
        type: 'object',
        properties: {
          struct: {
            type: 'object',
            properties: {
              foo: { type: 'string' }
            },
            required: ['foo']
          }
        },
        required: ['struct']
      };

      const faked = fake(schema);

      expect(faked.struct.foo).to.be.a('string');
    });

    it('fakes arrays', () => {
      const schema = {
        type: 'object',
        properties: {
          array: {
            items: {
              type: 'string'
            },
            minItems: 1
          }
        },
        required: ['array']
      };

      const faked = fake(schema);

      expect(faked.array[0]).to.be.a('string');
    });

    it('fakes arrays of objects', () => {
      const schema = {
        type: 'object',
        properties: {
          array: {
            items: {
              type: 'object',
              properties: {
                foo: { type: 'string'}
              },
              required: ['foo']
            },
            minItems: 1
          }
        },
        required: ['array']
      };

      const faked = fake(schema);

      expect(faked.array[0].foo).to.be.a('string');
    });
  });

  describe('string format', () => {
    it('fakes date-times', () => {
      const schema = {
        type: 'object',
        properties: {
          foo: {
            type: 'string',
            format: 'date-time'
          }
        },
        required: ['foo']
      };

      const faked = fake(schema);
      expect(faked.foo).to.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/);
    });
  });

  describe('functions', () => {
    const schema = {
      type: 'object',
      properties: {
        func: func
      },
      required: ['func']
    };
    const faked = fake(schema);

    beforeEach(() => {
      sinon.spy(console, 'log');
    });

    afterEach(() => {
      console.log.restore(); // eslint-disable-line no-console
    });

    it('fakes a function', () => {
      expect(() => faked.func()).to.not.throw(TypeError);
    });

    it('logs when the fake function is called', () => {
      faked.func();
      expect(console.log).to.be.called; // eslint-disable-line no-console
    });
  });

  describe('elements', () => {
    const schema = {
      type: 'object',
      properties: {
        element: element
      },
      required: ['element']
    };
    const faked = fake(schema);

    it('fakes an element', () => {
      expect(isValidElement(faked.element)).to.be.true;
    });
  });
});
