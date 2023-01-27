import { fetchSignInMethodsForEmail, getAuth, updateProfile } from 'firebase/auth';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import './SignUp.scss';

import { useUserAuth } from '../../contexts/AuthContext';
import { firebaseCodeError } from '../../data/firebaseCodeError';
import { useAlert } from '../../hooks/useAlert';

import { verifyEmail } from '../../api/userApi';
import SignUpForm from '../../components/forms/authForm/signUpForm/SignUpForm';
import useApi from '../../hooks/useApi';

const SignUp = () => {
  const [value, setValue] = useState({
    email: '',
    password: '',
    phone: '',
    fname: '',
    lname: '',
    restoName: '',
    dial: { dialCode: '+971', country: 'United Arab Emirates' },
    isAgree: false,
    pointOfSale: '',
  });
  const { settingsSave } = useApi();
  const [processing, setProcessing] = useState(false); // set to true if an API call is running
  const { triggerAlertWithMessageError, triggerAlertWithMessageSuccess } = useAlert();
  const [errorData, setErrorData] = useState<any>({
    email: false,
    password: false,
    fname: false,
    lname: false,
    restoName: false,
    pointOfSale: false,
  });

  const { signUp, verifyPhone, setIsUpdatingPhone, logOut } = useUserAuth();
  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);
    try {
      const credential = await signUp(value.email, value.password);
      await updateProfile(credential.user, {
        displayName: `${value.fname} ${value.lname}`,
      });
      if (value.phone) {
        const newPhoneNumber = `${value.dial.dialCode}${value.phone}`;
        const vId = await verifyPhone(`+${newPhoneNumber}`);
        setIsUpdatingPhone(true);
        navigate(`/verify-code-signup`, {
          state: {
            data: value,
            prevPath: '/signup',
            n: newPhoneNumber,
            vId,
          },
        });
      } else {
        await settingsSave({
          master_email: value.email,
          data: {
            restoname: value.restoName.trim(),
            pointOfSale: value.pointOfSale,
            country: value.dial.country,
            dial: value.dial.dialCode,
          },
        });
        await verifyEmail(value);
        await logOut();
        navigate('/');
        triggerAlertWithMessageSuccess(
          'We sent an email verification to your email, please check it (include spam) before signin'
        );
      }
    } catch (e) {
      const message = firebaseCodeError[e.code] ? firebaseCodeError[e.code].message : e.message;
      const deleteUser = () => {
        getAuth().currentUser.delete();
        localStorage.removeItem('user');
      };
      if (firebaseCodeError[e.code] && firebaseCodeError[e.code].field) {
        setErrorData({ [firebaseCodeError[e.code].field]: true });
      }
      triggerAlertWithMessageError(message);
      setProcessing(false);
      await fetchSignInMethodsForEmail(getAuth(), value.email).then((res) =>
        res.length > 0 ? deleteUser() : null
      );
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
    <div className='signup'>
      <p className='signup__signin-text'>
        Already have an account? &nbsp; <Link to='/'>Sign In</Link>
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
