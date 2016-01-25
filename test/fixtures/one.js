var modify = require('../../');

module.exports = modify('es2015', {
	// nameDrops: false,
	'transform-react-jsx': { jsxPragma:'h' },
	'transform-es2015-typeof-symbol': { loose:true }
});
