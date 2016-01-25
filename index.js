var path = require('path'),
	relative = require('require-relative');

function babelRequire(type, name, relativeTo, log) {
	var mod;
	if (!name.match(/^babel-(preset|plugin)-/)) {
		try {
			mod = req('babel-'+type+'-'+name, relativeTo);
		} catch(err) {}
	}
	return mod || req(name, relativeTo);
}

function req(name, relativeTo) {
	return relativeTo ? relative(name, relativeTo) : require(name);
}

module.exports = function(preset, modifications) {
	modifications = modifications || {};
	var nameDrops = modifications.nameDrops!==false;

	if (typeof preset==='string') {
		if (!preset.match(/(^babel-preset-|\/)/)) {
			try {
				preset = relative.resolve('babel-preset-'+preset);
			} catch(err) {
				console.log(err);
			}
		}
		if (!preset) {
			preset = require.resolve(preset);
		}
	}

	var originalConfig = require(preset),
		pathRoot = path.dirname(preset),
		config = {};
	for (var key in originalConfig) {
		if (originalConfig.hasOwnProperty(key)) {
			config[key] = originalConfig[key];
		}
	}
	var plugins = config.plugins = (config.plugins || []).slice();

	function getPlugin(name) {
		var mod;
		try {
			mod = babelRequire('plugin', name, pathRoot);
		} catch(err) {}
		if (!mod) {
			try {
				mod = babelRequire('plugin', name);
			} catch(err2) {}
		}
		return mod;
	}

	function isSameName(a, b) {
		if (typeof a!=='string' || typeof b!=='string') return false;
		return a.replace(/^babel-plugin-/i, '').toLowerCase() === b.replace(/^babel-plugin-/i, '').toLowerCase();
	}

	function indexOf(list, name) {
		var mod = getPlugin(name);
		if (!mod && process.env.NODE_ENV==='development') {
			console.warn('no module found for: '+name);
		}
		for (var i=0; i<list.length; i++) {
			var p = Array.isArray(list[i]) ? list[i][0] : list[i];
			if ((mod && p===mod) || isSameName(p, name) || (p._original_name && isSameName(p._original_name, name))) {
				return i;
			}
		}
		return -1;
	}

	Object.keys(modifications).forEach(function(key) {
		if (key==='nameDrops') return;

		var value = modifications[key],
			index = indexOf(plugins, key);
		if (value===false) {
			if (index<0 && process.env.NODE_ENV==='development') {
				console.warn(key+' not found', __dirname);
			}
			plugins.splice(index, 1);
		}
		else {
			var p = getPlugin(key);
			if (nameDrops) {
				p._original_name = key;
			}
			if (value!==true) {
				p = [p].concat(value);
			}
			if (index<0) {
				plugins.push(p);
			}
			else {
				plugins[index] = p;
			}
		}
	});

	return config;
};
