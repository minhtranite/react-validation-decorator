import React from 'react';
import Joi from 'joi';
import Filter from 'lodash.filter';
import Result from 'lodash.result';
import ObjectPath from 'object-path';
import Merge from 'lodash.merge';
import CloneDeep from 'lodash.clonedeep';
import StartsWith from 'lodash.startswith';

const Validation = (ComposedComponent) => {
  return class ValidationComponent extends ComposedComponent {
    constructor(props, context) {
      super(props, context);
      this.state.validation = {
        dirty: [],
        errors: [],
        value: null
      };
    }

    validate = (path, callback) => {
      let validationValue = CloneDeep(Result(this, 'validationValue', this.state));
      if (typeof validationValue === 'object' && validationValue.hasOwnProperty('validation')) {
        delete validationValue.validation;
      }
      let validationSchema = Result(this, 'validationSchema');
      let validationOptions = Merge({
        abortEarly: false,
        allowUnknown: true
      }, Result(this, 'validationOptions', {}));
      Joi.validate(validationValue, validationSchema, validationOptions, (error, value) => {
        let validation = ObjectPath.get(this.state, 'validation', {});
        validation.errors = (error && error.details) ? error.details : [];
        validation.value = value;
        let pushDirty = (p, dirtyArr = []) => {
          if (p && dirtyArr.indexOf(p) === -1) {
            dirtyArr.push(p);
          }
          let pArr = p.split('.');
          if (pArr.length > 1) {
            pArr.splice(-1, 1);
            pushDirty(pArr.join('.'), dirtyArr);
          }
        };
        pushDirty(path, validation.dirty);
        if (callback) {
          this.setState({
            validation: validation
          }, callback);
        } else {
          this.setState({
            validation: validation
          });
        }
      });
    };

    handleValidation = (path) => {
      return (e) => {
        e.preventDefault();
        this.validate(path);
      };
    };

    isValid = (path) => {
      let errors = ObjectPath.get(this.state, 'validation.errors', []);
      if (path) {
        errors = Filter(errors, (error) => (error.path === path || StartsWith(error.path, path + '.')));
      }
      return errors.length === 0;
    };

    isDirty = (path) => {
      let dirty = ObjectPath.get(this.state, 'validation.dirty', []);
      if (path) {
        dirty = Filter(dirty, (d) => d === path);
      }
      return dirty.length !== 0;
    };

    getValidationMessages = (path) => {
      let errors = ObjectPath.get(this.state, 'validation.errors', []);
      if (path) {
        errors = Filter(errors, (error) => (error.path === path || StartsWith(error.path, path + '.')));
      }
      return errors;
    };

    getValidationValue = () => {
      return CloneDeep(ObjectPath.get(this.state, 'validation.value'));
    };

    resetValidation = (callback) => {
      if (callback) {
        this.setState({
          validation: {
            dirty: [],
            errors: [],
            value: null
          }
        }, callback);
      } else {
        this.setState({
          validation: {
            dirty: [],
            errors: [],
            value: null
          }
        });
      }
    };

    getValidationClassName = (path, successClass = 'has-success', errorClass = 'has-error', defaultClass = 'form-group') => {
      let className = [defaultClass];
      if (this.isValid(path) && this.isDirty(path)) {
        className.push(successClass);
      }
      if (!this.isValid(path) && this.isDirty(path)) {
        className.push(errorClass);
      }
      return className.join(' ');
    };

    renderValidationMessages = (path, className = 'help-block', onlyFirst = true) => {
      let errors = this.getValidationMessages(path);
      if (errors.length !== 0 && this.isDirty(path)) {
        errors = onlyFirst ? [errors[0]] : errors;
        let html = errors.map(function (error, index) {
          return (<div key={error.path + index}>{error.message}</div>);
        });
        return (<div className={className}>{html}</div>);
      }
      return null;
    };

    updateState = function (newState, callback) {
      let state = this.state;
      let stateModel = ObjectPath(state);
      for (let property in newState) {
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
  };
};

export default Validation;
