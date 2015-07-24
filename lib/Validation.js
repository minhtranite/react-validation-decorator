'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _get = function get(_x7, _x8, _x9) { var _again = true; _function: while (_again) { var object = _x7, property = _x8, receiver = _x9; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x7 = parent; _x8 = property; _x9 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

var _lodashFilter = require('lodash.filter');

var _lodashFilter2 = _interopRequireDefault(_lodashFilter);

var _lodashResult = require('lodash.result');

var _lodashResult2 = _interopRequireDefault(_lodashResult);

var _objectPath = require('object-path');

var _objectPath2 = _interopRequireDefault(_objectPath);

var _lodashMerge = require('lodash.merge');

var _lodashMerge2 = _interopRequireDefault(_lodashMerge);

var Validation = function Validation(ComposedComponent) {
  return (function (_ComposedComponent) {
    _inherits(ValidationComponent, _ComposedComponent);

    function ValidationComponent(props) {
      var _this = this;

      _classCallCheck(this, ValidationComponent);

      _get(Object.getPrototypeOf(ValidationComponent.prototype), 'constructor', this).call(this, props);

      this.validate = function (path) {
        var validationValue = (0, _lodashResult2['default'])(_this, 'validationValue', _this.state);
        var validationSchema = (0, _lodashResult2['default'])(_this, 'validationSchema');
        var validationOptions = (0, _lodashMerge2['default'])({
          abortEarly: false,
          allowUnknown: true,
          stripUnknown: true
        }, (0, _lodashResult2['default'])(_this, 'validationOptions', {}));
        _joi2['default'].validate(validationValue, validationSchema, validationOptions, function (error, value) {
          var validation = _objectPath2['default'].get(_this.state, 'validation', {});
          validation.errors = error && error.details ? error.details : [];
          validation.value = value;
          var pushDirty = function pushDirty(p) {
            var dirtyArr = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

            if (p && dirtyArr.indexOf(p) === -1) {
              dirtyArr.push(p);
            }
            var pArr = p.split('.');
            if (pArr.length > 1) {
              pArr.splice(-1, 1);
              pushDirty(pArr.join('.'), dirtyArr);
            }
          };
          pushDirty(path, validation.dirty);
          _this.setState({
            validation: validation
          });
        });
      };

      this.handleValidation = function (path) {
        return function (e) {
          e.preventDefault();
          _this.validate(path);
        };
      };

      this.isValid = function (path) {
        var errors = _objectPath2['default'].get(_this.state, 'validation.errors', []);
        if (path) {
          errors = (0, _lodashFilter2['default'])(errors, function (error) {
            return error.path === path;
          });
        }
        return errors.length === 0;
      };

      this.isDirty = function (path) {
        var dirty = _objectPath2['default'].get(_this.state, 'validation.dirty', []);
        if (path) {
          dirty = (0, _lodashFilter2['default'])(dirty, function (d) {
            return d === path;
          });
        }
        return dirty.length !== 0;
      };

      this.getValidationMessages = function (path) {
        var errors = _objectPath2['default'].get(_this.state, 'validation.errors', []);
        if (path) {
          errors = (0, _lodashFilter2['default'])(errors, function (error) {
            return error.path === path;
          });
        }
        return errors;
      };

      this.getValidationValue = function () {
        return _objectPath2['default'].get(_this.state, 'validation.value');
      };

      this.resetValidation = function () {
        _this.setState({
          validation: {
            dirty: [],
            errors: [],
            value: null
          }
        });
      };

      this.getValidationClassName = function (path) {
        var successClass = arguments.length <= 1 || arguments[1] === undefined ? 'has-success' : arguments[1];
        var errorClass = arguments.length <= 2 || arguments[2] === undefined ? 'has-error' : arguments[2];
        var defaultClass = arguments.length <= 3 || arguments[3] === undefined ? 'form-group' : arguments[3];

        var className = [defaultClass];
        if (_this.isValid(path) && _this.isDirty(path)) {
          className.push(successClass);
        }
        if (!_this.isValid(path) && _this.isDirty(path)) {
          className.push(errorClass);
        }
        return className.join(' ');
      };

      this.renderValidationMessages = function (path) {
        var className = arguments.length <= 1 || arguments[1] === undefined ? 'help-block' : arguments[1];
        var onlyFirst = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

        var errors = _this.getValidationMessages(path);
        if (errors.length !== 0 && _this.isDirty(path)) {
          errors = onlyFirst ? [errors[0]] : errors;
          var html = errors.map(function (error, index) {
            return _react2['default'].createElement(
              'div',
              { key: error.path + index },
              error.message
            );
          });
          return _react2['default'].createElement(
            'div',
            { className: className },
            html
          );
        }
        return null;
      };

      this.updateState = function (newState, callback) {
        var state = this.state;
        var stateModel = (0, _objectPath2['default'])(state);
        for (var property in newState) {
          if (newState.hasOwnProperty(property)) {
            stateModel.set(property, newState[property]);
          }
        }
        if (callback) {
          this.setState(state, callback);
        } else {
          this.setState(state);
        }
      };

      this.state.validation = {
        dirty: [],
        errors: [],
        value: null
      };
    }

    return ValidationComponent;
  })(ComposedComponent);
};

exports['default'] = Validation;
module.exports = exports['default'];