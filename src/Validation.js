import React from 'react';
import Joi from 'joi';
import Filter from 'lodash.filter';
import ObjectPath from 'object-path';

const Validation = (ComposedComponent) => {
  class ValidationComponent extends ComposedComponent {
    constructor(props) {
      super(props);
      this.state.validation = {
        dirty: [],
        errors: [],
        value: null
      };
    }

    validate = (path) => {
      Joi.validate(this.state, this.schema, {
        abortEarly: false,
        convert: false,
        allowUnknown: true
      }, (error, value) => {
        let validation = ObjectPath.get(this.state, 'validation', {});
        validation.errors = (error && error.details) ? error.details : [];
        validation.value = value;
        if (path && validation.dirty.indexOf(path) === -1) {
          validation.dirty.push(path);
        }
        this.setState({
          validation: validation
        });
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
        errors = Filter(errors, (error) => error.path === path);
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
        errors = Filter(errors, (error) => error.path === path);
      }
      return errors;
    };

    getValidationValue = () => {
      return ObjectPath.get(this.state, 'validation.value');
    };

    resetValidation = () => {
      this.setState({
        validation: {
          dirty: [],
          errors: [],
          value: null
        }
      });
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

    renderValidationMessages = (path, className = 'help-block') => {
      let errors = this.getValidationMessages(path);
      if (errors.length !== 0 && this.isDirty(path)) {
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
  }
  return ValidationComponent;
};

export default Validation;
