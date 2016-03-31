export const element = {
  'type': 'object',
  'isReactElement': true
};

export const func = {
  'isFunction': true
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