const assert = require('assert');
const evaParser = require('./parser/evaParser');

const Environment = require('./Environment');

//Eva interpreter------------------

class Eva {
	//Eva instance (eva object) with global Environment :-----------
	constructor(global = new Environment()) {
		this.global = global;
	}

	//Evaluate Expressions in given Environment :----------------
	eval(exp, env = this.global) {
		//self evaluating expressions :-----------------------
		if (isNumber(exp)) {
			return exp;
		}
		if (isString(exp)) {
			return exp.slice(1, -1);
		}

		//math operations : -------------------------------
		if (exp[0] === '+') {
			return this.eval(exp[1], env) + this.eval(exp[2], env);
		}
		if (exp[0] === '*') {
			return this.eval(exp[1], env) * this.eval(exp[2], env);
		}
		if (exp[0] === '-') {
			return this.eval(exp[1], env) - this.eval(exp[2], env);
		}
		if (exp[0] === '/') {
			return this.eval(exp[1], env) / this.eval(exp[2], env);
		}

		//comaprasin operator :-------------------------
		if (exp[0] === '>') {
			return this.eval(exp[1], env) > this.eval(exp[2], env);
		}
		if (exp[0] === '>=') {
			return this.eval(exp[1], env) >= this.eval(exp[2], env);
		}
		if (exp[0] === '<') {
			return this.eval(exp[1], env) < this.eval(exp[2], env);
		}
		if (exp[0] === '<=') {
			return this.eval(exp[1], env) <= this.eval(exp[2], env);
		}
		if (exp[0] === '=') {
			return this.eval(exp[1], env) === this.eval(exp[2], env);
		}

		//variables :------------
		if (exp[0] === 'var') {
			const [_, name, value] = exp;
			return env.define(name, this.eval(value, env));
		}
		if (isVariableName(exp)) {
			return env.lookup(exp);
		}
		if (exp[0] === 'set') {
			const [_, name, value] = exp;
			return env.assign(name, this.eval(value, env));
		}

		//blocks :--------------
		if (exp[0] === 'begin') {
			const blockEnv = new Environment({}, env);
			return this._evalBlock(exp, blockEnv);
		}

		//if - statements :----------------
		if (exp[0] === 'if') {
			const [_tag, condition, consequent, alternate] = exp;
			if (this.eval(condition, env)) {
				return this.eval(consequent, env);
			}
			else {
				return this.eval(alternate, env);
			}
		}

		//while-loop :----------------
		if (exp[0] === 'while') {
			const [_tag, condition, body] = exp;
			let result;
			while(this.eval(condition, env)) {
				result = this.eval(body, env);
			}
			return result;
		}
		
		throw `Unimplemented : ${JSON.stringify(exp)}`;
	}

	_evalBlock(block, env) {
		let result;
		const [_tag, ...expressions] = block;

		expressions.forEach(exp => {result = this.eval(exp, env);});
		return result;
	}
}

function isNumber(exp) {
	return typeof exp === 'number';
}

function isString(exp) {
	return typeof exp === 'string' && exp[0] === '"' && exp.slice(-1) === '"';
}

function isVariableName(exp) {
	return typeof exp === 'string' && /^[a-zA-Z][a-zA-Z0-9]*$/.test(exp);
}

module.exports = Eva;