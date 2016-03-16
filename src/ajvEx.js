import AJV from 'ajv';
const ajv = AJV();

function safeEscapeQuotes(str) {
  return str.replace(/\\([\s\S])|(')/g,"\\$1$2").replace(/\\([\s\S])|(")/g,"\\$1$2"); // escape only if not escaped already
}

ajv.addKeyword('deprecated', { inline: function (it, keyword, schema, parentSchema){
  var op = schema ? `console.warn('Property "${it.schemaPath.replace(/^\.properties\./, '')}" was deprecated on: ${schema.deprecatedOn}. Recommended alternative is: "${safeEscapeQuotes(schema.description)}".')` : '';
  return `${op} || 1`
}})

export default ajv