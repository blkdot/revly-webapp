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
    dial: '+971',
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
    !value.email ||
    !value.password ||
    processing ||
    !value.fname ||
    !value.lname ||
    !value.isAgree ||
    !value.restoName ||
    !value.phone;

  return (
    <div className="signup">
      <p className="signup__signin-text">
        Already have an account ? &nbsp; <Link to="/">Sign In</Link>
      </p>
      <SignUpForm
        onChangeEmail={handleChange('email')}
        onChangeFName={handleChange('fname')}
        onChangeLName={handleChange('lname')}
        onChangeRestoName={handleChange('restoName')}
        onChangePassword={handleChange('password')}
        onChangePhone={handleChange('phone')}
        onDialChange={handleChange('dial')}
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
  );
};

export default SignUp;
