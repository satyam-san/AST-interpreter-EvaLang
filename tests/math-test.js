const assert = require('assert');

module.exports = eva => {
	assert.strictEqual(eva.eval(['+', 1, 5]), 6);
	assert.strictEqual(eva.eval(['+', ['+', 2, 3], 5]), 10);
	assert.strictEqual(eva.eval(['*', ['*', 2, 4], 2]), 16);
	assert.strictEqual(eva.eval(['-', ['-', 10, 5], 3]), 2);
	assert.strictEqual(eva.eval(['/', ['/', 10, 5], 5]), 0.4);
	assert.strictEqual(eva.eval(['+', ['-', 5, 3], 10]), 12);
	assert.strictEqual(eva.eval(['-', 2, 3]), -1);
	assert.strictEqual(eva.eval(['/', 5, 2]), 2.5);
};