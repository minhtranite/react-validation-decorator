# React Validation Decorator

Validation decorator for ReactJS base on [joi](https://github.com/hapijs/joi).

[Demo](http://vn38minhtran.github.io/react-validation-decorator)

## Installation

### NPM

```bash
npm install --save react-validation-decorator
```

### Bower

```bash
bower install --save react-validation-decorator
```

## Usage

### With decorator:

```js
import React from 'react';
import {Validation, Joi} from 'react-validation-decorator';

@Validation 
class Component extends React.Component {
  validationSchema = Joi.object().keys({
    name: Joi.string().required().label('Name'),
    email: Joi.string().email().required().label('Email').label('Email'),
    password: Joi.string().min(3).max(30).label('Password'),
    verifyPassword: Joi.string().valid(Joi.ref('password')).options({
      language: {
        any: {
          allowOnly: 'don\'t match'
        }
      }
    }).required().label('Verify Password')
  });

  state = {};

  handleNameChange = (e) => {
    this.setState({
      name: e.target.value
    }, () => {
      this.validate('name');
    });
  };

  handleEmailChange = (e) => {
    this.setState({
      email: e.target.value
    }, () => {
      this.validate('email');
    });
  };

  handlePasswordChange = (e) => {
    this.setState({
      password: e.target.value
    }, () => {
      this.validate('password');
    });
  };

  handleVerifyPasswordChange = (e) => {
    this.setState({
      verifyPassword: e.target.value
    }, () => {
      this.validate('verifyPassword');
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
  };

  render() {
    return (
      <form>
        <div className={this.getValidationClassName('name')}>
          <label className='control-label'>Name</label>
          <input type='text' className='form-control'
            value={this.state.name}
            onChange={this.handleNameChange}/>
          {this.renderValidationMessages('name')}
        </div>
        <div className={this.getValidationClassName('email')}>
          <label className='control-label'>Email</label>
          <input type='text' className='form-control'
            value={this.state.email}
            onChange={this.handleEmailChange}/>
          {this.renderValidationMessages('email')}
        </div>
        <div className={this.getValidationClassName('password')}>
          <label className='control-label'>Password</label>
          <input type='password' className='form-control'
            value={this.state.password}
            onChange={this.handlePasswordChange}/>
          {this.renderValidationMessages('password')}
        </div>
        <div className={this.getValidationClassName('verifyPassword')}>
          <label className='control-label'>Verify Password</label>
          <input type='password' className='form-control'
            value={this.state.verifyPassword}
            onChange={this.handleVerifyPasswordChange}/>
          {this.renderValidationMessages('verifyPassword')}
        </div>
        <button className='btn btn-primary' onClick={this.handleSubmit}
          disabled={!this.isDirty() || !this.isValid()}>Submit
        </button>
        <hr/>
        <h3>State:</h3>
        <pre>{JSON.stringify(this.state, undefined, 4)}</pre>
      </form>
    );
  }
}

export default Component;
```

### Without decorator:

```js
//...
var Component = React.createClass({
  //...
  validationSchema: Joi.object().keys({
    name: Joi.string().required().label('Name'),
    email: Joi.string().email().required().label('Email').label('Email'),
    password: Joi.string().min(3).max(30).label('Password'),
    verifyPassword: Joi.string().valid(Joi.ref('password')).options({
      language: {
        any: {
          allowOnly: 'don\'t match'
        }
      }
    }).required().label('Verify Password')
  }),
  getInitialState: function () {
    return {};
  },
  //...
});

module.exports = Validation(Component);
```

### UMD

```html
<script src="path/to/react-validation-decorator/dist/react-validation-decorator.js"></script>
```

```js
//ES2015
const {Validation, Joi} = window.ReactValidationDecorator;
// Or
var Validation = window.ReactValidationDecorator.Validation;
var Joi = window.ReactValidationDecorator.Joi;
```

## API

### `validationSchema`

- is [Joi](https://github.com/hapijs/joi) schema.
- can be defined as `joi object` or `function`.

```js
// Defined as joi object
validationSchema = Joi.object().keys({
  name: Joi.string().required().label('Name'),
  email: Joi.string().email().required().label('Email').label('Email'),
  password: Joi.string().min(3).max(30).label('Password'),
  verifyPassword: Joi.string().valid(Joi.ref('password')).options({
    language: {
      any: {
        allowOnly: 'don\'t match'
      }
    }
  }).required().label('Verify Password')
});

// Defined as function
validationSchema = () => {
  return Joi.object().keys({
    name: Joi.string().required().label('Name'),
    email: Joi.string().email().required().label('Email').label('Email'),
    password: Joi.string().min(3).max(30).label('Password'),
    verifyPassword: Joi.string().valid(Joi.ref('password')).options({
      language: {
        any: {
          allowOnly: 'don\'t match'
        }
      }
    }).required().label('Verify Password')
  });
};
```

### `validationValue`
- is validation value.
- it is optional, default `validationValue` use `state` as value.

```js
// Defined as object
validationValue = () => {
	return Merge(this.state, this.props); // Sample
};
```

### `validationOptions`
- is [Joi](https://github.com/hapijs/joi#validatevalue-schema-options-callback) options.
- can be defined as `object` or `function`.

```js
// Defined as object
validationOptions = {
  convert: false
};

// Defined as function
validationOptions = () => {
	return {
  	convert: false
  };
}
```

### `validate(path, [callback])`
- Validates `validationValue` using the given `validationSchema`.
- After it called `isDirty(path)` will return `true`.

```js
handleNameChange = (e) => {
  this.setState({
    name: e.target.value
  }, () => {
    this.validate('name');
  });
};
```

### `handleValidation(path)`

### `isValid([path])`

```js
this.isValid('name');
// return true if field name valid other while return false.

this.isValid();
// return true if all fields in schema valid other while return false.
```

### `isDirty([path])`

```js
this.isDirty('name');
// return true if field name dirty other while return false.

this.isDirty();
// return true if any field in schema valid other while return false.
```

### `getValidationMessages([path])`

If `path` is defined return error details of `path` other while return all error details.

### `getValidationValue()`

Return validated value.

### `resetValidation([callback])`

Reset validation.

### `getValidationClassName(path, [successClass, errorClass, defaultClass])`

```js
this.getValidationClassName('name')
// default return: `form-group`
// when name dirty and valid return : `form-group has-success`.
// when name dirty and invalid return: `form-group has-error`

this.getValidationClassName('name', 'valid', 'invalid', 'field')
// default return: `field`
// when name dirty and valid return : `field valid`.
// when name dirty and invalid return: `field invalid`
```

### `renderValidationMessages(path, [className='help-block', onlyFirst=true])`

Render validation messages, if `onlyFirst == false` it will render all messages of `path`.

### `updateState(newState, [callback])`

```js
//...
state = {
	user: {
  	name: 'John',
    age: 30
  }
};
//...

this.updateState({
	'user.name': 'John smith'
})
```

See [object-path](https://github.com/mariocasciaro/object-path).

## Troubleshooting

#### Cannot resolve module 'net' or 'dns':

```js
// webpack.config.js
//...
module.exports = {
//...
node: {
  net: 'mock',
  dns: 'mock'
}
//...
};
//...
```
