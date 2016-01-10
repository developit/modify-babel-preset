var expect = require('chai').expect,
	modifyBabelPreset = require('..'),
	es2015Preset = require('babel-preset-es2015'),
	transform = require('../node_modules/babel-preset-es2015/node_modules/babel-plugin-transform-es2015-typeof-symbol'),
	jsx = require('babel-plugin-transform-react-jsx');

describe('modify-babel-preset', function() {
	it('should import string presets', function() {
		var out = modifyBabelPreset('babel-preset-es2015');
		expect(out).to.deep.equal(es2015Preset);
	});

	it('should import string presets without babel-preset- prefix', function() {
		var out = modifyBabelPreset('es2015');
		expect(out).to.deep.equal(es2015Preset);
	});

	it('should remove for false values', function() {
		var out = modifyBabelPreset('es2015', {
			'transform-es2015-typeof-symbol': false
		});
		expect(out.plugins).not.to.include(transform);
	});

	it('should add for true values', function() {
		var out = modifyBabelPreset('es2015', {
			'transform-react-jsx': true
		});
		expect(out.plugins).to.deep.equal( es2015Preset.plugins.concat(jsx) );
	});

	it('should add values with config', function() {
		var out = modifyBabelPreset('es2015', {
			'transform-react-jsx': { jsxPragma:'h' }
		});
		expect(out.plugins).to.deep.equal( es2015Preset.plugins.concat([
			[jsx, { jsxPragma:'h' }]
		]) );
	});
});
