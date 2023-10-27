import React, { useContext, useEffect, useReducer, useState } from 'react';

import Card from '../UI/Card/Card';
import classes from './Login.module.css';
import Button from '../UI/Button/Button';
import AuthContext from '../../store/auth-context';

const reducer = (state, action) => {
  if (action.type === 'USER_INPUT') {
    return {
      value: action.val,
      isValid: action.val.includes('@')
    }

  }
  if (action.type === 'USER_BLUR') {
    return {
      value: state.value,
      isValid: state.value.includes('@')
    }
  }
  return { value: '', isvalid: false }

}

const passwordReducer = (state, action) => {
  if (action.type === 'PASSWORD') {
    return {
      passwordValue: action.val,
      passwordIsValid: action.val.trim().length > 6
    }
  }
  if (action.type === 'PASSWORD_BLUR') {
    return {
      passwordValue: state.passwordValue,
      passwordIsValid: state.passwordValue.trim().length > 6
    }
  }
  return { passwordValue: '', passwordIsValid: null }
}

const Login = (props) => {
  // const [enteredEmail, setEnteredEmail] = useState('');
  // const [emailIsValid, setEmailIsValid] = useState();
  const [emailState, despatchEmail] = useReducer(reducer, {
    value: '',
    isValid: null
  })
  // const [enteredPassword, setEnteredPassword] = useState('');
  // const [passwordIsValid, setPasswordIsValid] = useState();

  const [passwordState, despatchPassword] = useReducer(passwordReducer, {
    passwordValue: '',
    passwordIsValid: null
  })
  const [formIsValid, setFormIsValid] = useState(false);

  const ctx = useContext(AuthContext)

  // const { isValid: EmailIsValid } = emailState
  // const { passwordIsValid: PasswordIsValid } = passwordState

  useEffect(() => {

    const identifier = setTimeout(() => {
      console.log('Checking form validity')
      setFormIsValid(
        emailState.isValid && passwordState.passwordIsValid
      );
    }, 500);

    return () => {
      console.log('CLEANUP')
      clearTimeout(identifier)
    }

  }, [emailState.isValid, passwordState.passwordIsValid])


  const emailChangeHandler = (event) => {
    despatchEmail({ type: 'USER_INPUT', val: event.target.value })

    // setFormIsValid(
    //   emailState.isValid && passwordState.passwordIsValid
    // )
  };

  const passwordChangeHandler = (event) => {
    despatchPassword({ type: 'PASSWORD', val: event.target.value })
    // setEnteredPassword(event.target.value);

    // setFormIsValid(
    //   emailState.isValid && passwordState.passwordIsValid
    // )
  };

  const validateEmailHandler = () => {
    // setEmailIsValid(emailState.value.includes('@'));
    despatchEmail({ type: 'USER_BLUR' })
  };

  const validatePasswordHandler = () => {
    despatchPassword({ type: 'PASSWORD_BLUR' })
    // setPasswordIsValid(enteredPassword.trim().length > 6);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    ctx.onLogin(emailState.value, passwordState.passwordValue);
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <div
          className={`${classes.control} 
          ${emailState.isValid === false ? classes.invalid : ''
            }`}
        >
          <label htmlFor="email">E-Mail</label>
          <input
            type="email"
            id="email"
            value={emailState.value}
            onChange={emailChangeHandler}
            onBlur={validateEmailHandler}
          />
        </div>
        <div
          className={`${classes.control} ${passwordState.passwordIsValid === false ? classes.invalid : ''
            }`}
        >
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={passwordState.passwordValue}
            onChange={passwordChangeHandler}
            onBlur={validatePasswordHandler}
          />
        </div>
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn} disabled={!formIsValid}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
