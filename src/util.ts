import * as _ from 'lodash';

export default function omitDeprecated(obj: any, isProperty?: boolean) {
  var picked = {};
  Object.keys(obj).forEach(function(key, index) {
    if (isProperty) {
      // if we're inside 'properties', walk deeper only if the property is not deprecated
      if (!_.isPlainObject(obj[key].deprecated))
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