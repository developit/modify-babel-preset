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
			nameDrops: false,
			'transform-react-jsx': true
		});
		expect(out.plugins).to.deep.equal( es2015Preset.plugins.concat(jsx) );
	});

	it('should add values with config', function() {
		var out = modifyBabelPreset('es2015', {
			nameDrops: false,
			'transform-react-jsx': { jsxPragma:'h' }
		});
		expect(out.plugins).to.deep.equal( es2015Preset.plugins.concat([
			[jsx, { jsxPragma:'h' }]
		]) );
	});

	it('should work recursively', function() {
		var one = require('./fixtures/one');

		expect(one.plugins).to.deep.equal( es2015Preset.plugins.concat([
			[jsx, { jsxPragma:'h' }]
		]).map(function(p) {
			if (p===transform || p[0]===transform) {
				return [transform, { loose:true }];
			}
			return p;
		}) );

		var two = require('./fixtures/two');
		two.plugins.forEach(function(p) {
			var f = Array.isArray(p) ? p[0] : p;
			delete p._original_name;
		});

		delete transform._original_name;
		delete jsx._original_name;

		var target = es2015Preset.plugins.concat([
			[jsx, { jsxPragma:'z' }]
		]);
		target.splice(17, 1);
		expect(two.plugins).to.deep.equal(target);
	});
});
