import React from 'react';
import Validation from 'react-validation-decorator';
import Joi from 'joi';

@Validation class Component extends React.Component {
  static propTypes = {
    name: React.PropTypes.string
  };

  validationSchema = Joi.object().keys({
    name: Joi.string().required().label('Name'),
    email: Joi.string().email().required().label('Email').label('Email'),
    age: Joi.number().min(18).required().label('Age'),
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

  handleAgeChange = (e) => {
    this.setState({
      age: e.target.value
    }, () => {
      this.validate('age');
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
      <form autoComplete='off'>
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
        <div className={this.getValidationClassName('age')}>
          <label className='control-label'>Age</label>
          <input type='text' className='form-control'
            value={this.state.age}
            onChange={this.handleAgeChange}/>
          {this.renderValidationMessages('age')}
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

