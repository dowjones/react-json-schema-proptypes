import AJV from 'ajv';
import React from 'react';

const ajv = AJV({errorDataPath: 'property'}); // restore pre v2.0 behavior

function safeEscapeQuotes(str) {
  return str.replace(/\\([\s\S])|(')/g,"\\$1$2").replace(/\\([\s\S])|(")/g,"\\$1$2"); // escape only if not escaped already
}

ajv.addKeyword('deprecated', { inline: function (it, keyword, schema){
  var op = schema ? `console && console.warn && console.warn('Property "${it.schemaPath.replace(/^\.properties\./, '')}" was deprecated on: ${schema.deprecatedOn}. Recommended alternative is: "${safeEscapeQuotes(schema.description)}".')` : '';
  return `${op} || 1`;
}});

ajv.addKeyword('isReactElement', { compile: function() {
  return React.isValidElement;
}});

export default ajv;