import isPlainObject from 'lodash/isPlainObject';

export default function omitDeprecated(obj, isProperty) {
  var picked = {};
  Object.keys(obj).forEach(function(key) {
    if (isProperty) {
      // if we're inside 'properties', walk deeper only if the property is not deprecated
      if (!isPlainObject(obj[key].deprecated))
        picked[key] = omitDeprecated(obj[key]);
    } else {
      if (key !== 'properties') {
        picked[key] = obj[key]; // shortcircuit non-properties nodes
      } else {
        picked[key] = omitDeprecated(obj[key], true);
      }
    }
  });

  return picked;
}