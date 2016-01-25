var path = require('path'),
	modify = require('../../');

module.exports = modify(path.resolve(__dirname+'/one'), {
	// nameDrops: false,
	'transform-es2015-typeof-symbol': false,
	'transform-react-jsx': { jsxPragma:'z' },
});
