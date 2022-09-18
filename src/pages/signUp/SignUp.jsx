import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { updateProfile } from 'firebase/auth';

import './SignUp.scss';

import { useUserAuth } from '../../contexts/AuthContext';
import { useAlert } from '../../hooks/useAlert';
import { firebaseCodeError } from '../../data/firebaseCodeError';

import SignUpForm from '../../components/forms/authForm/signUpForm/SignUpForm';

const SignUp = () => {
  const [value, setValue] = useState({
    email: '',
    password: '',
    phone: '',
    fname: '',
    lname: '',
    restoName: '',
    isAgree: false,
  });
  const [processing, setProcessing] = useState(false); // set to true if an API call is running
  const { showAlert, setAlertMessage } = useAlert();
  const [errorData, setErrorData] = useState({
    email: false,
    password: false,
    fname: false,
    lname: false,
    restoName: false,
  });

  const { signUp } = useUserAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);
    try {
      const credential = await signUp(value.email, value.password);
      await updateProfile(credential.user, {
        displayName: `${value.fname} ${value.lname}`,
      });
      navigate('/check');
    } catch (e) {
      const message = firebaseCodeError[e.code] ? firebaseCodeError[e.code].message : e.message;

      if (message && firebaseCodeError[e.code].field) {
        setErrorData({ [firebaseCodeError[e.code].field]: true });
      }

      setAlertMessage(message);
      showAlert();
      setProcessing(false);
    }
  };

  const handleChange = (k) => (v) => {
    setErrorData({ ...errorData, [k]: false });
    setValue({ ...value, [k]: v });
  };

  const isDisabled = () =>
    !value.email || !value.password || processing || !value.fname || !value.lname || !value.isAgree;

  return (
    <div className="signup">
      <div className="card-signup">
        <p className="card-signup__signin-text">
          Already have an account yet ? <Link to="/"> Sign in</Link>
        </p>

        <div className="card-signup__form">
          <div className="card-signup__form__logo">
            <img src="/images/cover.png" alt="cover" width="200" />
          </div>
          <h2>Sign up</h2>
          <SignUpForm
            onChangeEmail={handleChange('email')}
            onChangeFName={handleChange('fname')}
            onChangeLName={handleChange('lname')}
            onChangeRestoName={handleChange('restoName')}
            onChangePassword={handleChange('password')}
            onChangePhone={handleChange('phone')}
            onChangeAgree={handleChange('isAgree')}
            errorFName={errorData.fname}
            errorLName={errorData.lname}
            errorRestoName={errorData.restoName}
            errorEmail={errorData.email}
            errorPassword={errorData.password}
            onSubmit={handleSubmit}
            disabled={isDisabled()}
          />
        </div>
      </div>
      <div className="signup-cover">
        <h1>Text</h1>
        <h1>Text</h1>
        <h1>Text</h1>
      </div>
    </div>
  );
};

export default SignUp;
