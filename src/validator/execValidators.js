'use strict';
var util = require('./util');
var validators = require('./validators');

/**
 * @author Guilherme M Gregio <guilherme@gregio.net>
 */
var exec = {
	constrains: [],
	loggerError: {},
	data: {},
	expressions: []
};

var Validate = {
	validate: function () {
		exec.constrains.forEach(function (constrain) {
			exec.expressions.push(new Expression(constrain));
		});

		exec.expressions.forEach(function (expression) {
			if (!validators.exec(expression)) {
				var param = expression.params[0].replace('$', '');
				exec.loggerError[param] = exec.loggerError[param] || [];
				exec.loggerError[param].push(expression.method);
			}
		});
	}
};

var DataValidator = {
	outErrors: function (error) {
		exec.loggerError = error;

		return this;
	},
	forData: function (data) {
		exec.data = data;

		return Validate;
	}
};

var ConstrainsValidator = {
	using: function (constrains) {
		exec.constrains = constrains;

		return DataValidator;
	}
};

var Expression = function (constrain) {
	var expr = util.expressionToArray(constrain);
	this.method = expr.shift();
	this.params = expr;
	var paramsValue = [];

	this.params.forEach(function (param) {
		if (/^\$/.test(param)) {
			paramsValue.unshift(util.deep(exec.data, param.replace('$', '')));
			return;
		}
		paramsValue.push(param);
	});

	this.paramsValue = paramsValue;
};

module.exports = ConstrainsValidator;