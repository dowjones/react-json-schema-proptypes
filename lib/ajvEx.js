'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ajv = require('ajv');

var _ajv2 = _interopRequireDefault(_ajv);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ajv = (0, _ajv2.default)({ errorDataPath: 'property' });
function safeEscapeQuotes(str) {
    return str.replace(/\\([\s\S])|(')/g, "\\$1$2").replace(/\\([\s\S])|(")/g, "\\$1$2"); // escape only if not escaped already
}
ajv.addKeyword('deprecated', { inline: function inline(it, keyword, schema) {
        var op = schema ? 'console && console.warn && console.warn(\'Property "' + it.schemaPath.replace(/^\.properties\./, '') + '" was deprecated on: ' + schema.deprecatedOn + '. Recommended alternative is: "' + safeEscapeQuotes(schema.description) + '".\')' : '';
        return op + ' || 1';
    } });
exports.default = ajv;