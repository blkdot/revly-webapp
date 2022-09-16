import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { updateProfile } from 'firebase/auth';

import './SignUp.scss';

import { useUserAuth } from '../../contexts/AuthContext';
import { useAlert } from '../../hooks/useAlert';
import { firebaseCodeError } from '../../data/firebaseCodeError';

import CardKit from '../../kits/card/CardKit';
import SignUpForm from '../../components/forms/authForm/signUpForm/SignUpForm';

const SignUp = () => {
  const [value, setValue] = useState({
    email: '',
    password: '',
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
    setValue({ ...value, [k]: v });
  };

  const isDisabled = () =>
    !value.email || !value.password || processing || !value.fname || !value.lname || !value.isAgree;

  return (
    <div className="signup">
      <div className="signup-cover">
        <img src="/images/cover.png" alt="cover" width={300} />
      </div>
      <CardKit className="card-signup" variant="outlined">
        <h2>Sign up</h2>

        <SignUpForm
          onChangeEmail={handleChange('email')}
          onChangeFName={handleChange('fname')}
          onChangeLName={handleChange('lname')}
          onChangeRestoName={handleChange('restoName')}
          onChangePassword={handleChange('password')}
          onChangeAgree={handleChange('isAgree')}
          errorFName={errorData.fname}
          errorLName={errorData.lname}
          errorRestoName={errorData.restoName}
          errorEmail={errorData.email}
          errorPassword={errorData.password}
          onSubmit={handleSubmit}
          disabled={isDisabled()}
        />

        <p style={{ marginTop: '2rem' }}>
          Already have an account yet? <Link to="/"> Sign in.</Link>
        </p>
      </CardKit>
    </div>
  );
};

export default SignUp;
