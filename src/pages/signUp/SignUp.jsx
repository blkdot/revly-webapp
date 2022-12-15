import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { updateProfile } from 'firebase/auth';

import './SignUp.scss';

import { useUserAuth } from '../../contexts/AuthContext';
import { useAlert } from '../../hooks/useAlert';
import { firebaseCodeError } from '../../data/firebaseCodeError';
import useApi from '../../hooks/useApi';

import SignUpForm from '../../components/forms/authForm/signUpForm/SignUpForm';
import { verifyEmail } from '../../api/userApi';

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
    pointOfSale: '',
  });
  const [processing, setProcessing] = useState(false); // set to true if an API call is running
  const { triggerAlertWithMessageSuccess, triggerAlertWithMessageError } = useAlert('error');
  const [errorData, setErrorData] = useState({
    email: false,
    password: false,
    fname: false,
    lname: false,
    restoName: false,
    pointOfSale: false,
  });
  const { settingsSave } = useApi();

  const { signUp, logOut } = useUserAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);
    try {
      const credential = await signUp(value.email, value.password);
      await updateProfile(credential.user, {
        displayName: `${value.fname} ${value.lname}`,
      });
      await settingsSave({
        master_email: credential.user.email,
        data: {
          restoname: value.restoName.trim(),
          pointOfSale: value.pointOfSale,
        },
      });
      await verifyEmail(value);
      await logOut();
      navigate('/');
      triggerAlertWithMessageSuccess(
        'We sent an email verification to your email, please check it (include spam) before signin',
      );
    } catch (e) {
      const message = firebaseCodeError[e.code] ? firebaseCodeError[e.code].message : e.message;

      if (firebaseCodeError[e.code] && firebaseCodeError[e.code].field) {
        setErrorData({ [firebaseCodeError[e.code].field]: true });
      }

      triggerAlertWithMessageError(message);
      setProcessing(false);
    }
  };

  const handleChange = (k) => (v) => {
    setErrorData({ ...errorData, [k]: false });
    setValue({ ...value, [k]: v });
  };

  const onInputBlur = (e) => {
    if (!value[e]) {
      setErrorData({ ...errorData, [e]: true });
    }
  };

  const isDisabled = () =>
    !value.email ||
    !value.password ||
    processing ||
    !value.fname ||
    !value.lname ||
    !value.isAgree ||
    !value.restoName ||
    !value.pointOfSale;

  return (
    <div className="signup">
      <p className="signup__signin-text">
        Already have an account? &nbsp; <Link to="/">Sign In</Link>
      </p>
      <SignUpForm
        onChangeEmail={handleChange('email')}
        onChangeFName={handleChange('fname')}
        onChangePointOfSales={handleChange('pointOfSale')}
        onChangeLName={handleChange('lname')}
        onChangeRestoName={handleChange('restoName')}
        onChangePassword={handleChange('password')}
        onChangePhone={handleChange('phone')}
        onDialChange={handleChange('dial')}
        onChangeAgree={handleChange('isAgree')}
        onBlur={onInputBlur}
        errorFName={errorData.fname}
        errorLName={errorData.lname}
        errorRestoName={errorData.restoName}
        errorEmail={errorData.email}
        errorPassword={errorData.password}
        errorPointOfSale={errorData.pointOfSale}
        onSubmit={handleSubmit}
        disabled={isDisabled()}
      />
    </div>
  );
};

export default SignUp;
