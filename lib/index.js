'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _ValidationJs = require('./Validation.js');

var _ValidationJs2 = _interopRequireDefault(_ValidationJs);

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

exports.Validation = _ValidationJs2['default'];
exports.Joi = _joi2['default'];
exports['default'] = _ValidationJs2['default'];