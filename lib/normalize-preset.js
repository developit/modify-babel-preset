var babelCore;
try { babelCore = require('babel-core'); } catch(err) {}

module.exports = function normalizePreset(preset, context, options) {
	if (!context) context = babelCore;

	if (preset && typeof preset==='object' && preset.buildPreset) {
		preset = preset.buildPreset;
	}

	if (typeof preset==='function') {
		preset = preset(context, options || {});
	}

	return preset;
};
