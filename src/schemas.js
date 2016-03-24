export function array(): Object {
  const schema = {
    'type': 'array'
  };
  return schema;
}

export function boolean(): Object {
  const schema = {
    'type': 'boolean'
  };
  return schema;
}

export function number(): Object {
  const schema = {
    'type': 'number'
  };
  return schema;
}

export function object(): Object {
  const schema = {
    'type': 'object'
  };
  return schema;
}

export function string(): Object {
  const schema = {
    'type': 'string'
  };
  return schema;
}

export function element(): Object {
  const schema = {
    'type': 'object',
    'isReactElement': true
  };
  return schema;
}

export function node(): Object {
  const schema = {
    'oneOf': [
      { 
        'type': 'array',
        'items': {
          'oneOf': [
            element(),
            number(),
            string()
          ]
        }
      },
      element(),
      number(),
      string()
    ]
  };
  return schema;
}
