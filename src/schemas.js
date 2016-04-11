export const func = {
  'isFunction': true,
  'faker': {
    'type': 'function'
  }
};

export const element = {
  'type': 'object',
  'isReactElement': true,
  'faker': {
    'type': 'element'
  }
};

export const node = {
  'oneOf': [
    {
      'type': 'array',
      'items': {
        'oneOf': [
          { 'type': 'number' },
          { 'type': 'string' },
          element
        ]
      }
    },
    { 'type': 'number' },
    { 'type': 'string' },
    element
  ]
};
