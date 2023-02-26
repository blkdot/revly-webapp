import { useUser } from 'contexts';
import emailWhitelisted from 'data/whitelisted-email';
import { logout, signIn, verifyCodeEmail } from 'firebase-config';
import { useAlert, useVendors } from 'hooks';
import { useAtom } from 'jotai';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { elligibilityDeliverooAtom } from 'store/eligibilityDeliveroo';
import { vendorsAtom } from 'store/vendorsAtom';
import { firebaseCodeError } from '../../data/firebaseCodeError';
import SignInForm from './form/SignInForm';
import './SignIn.scss';

const SignIn = () => {
  const user = useUser();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [remember, setRemember] = useState(false);
  const [processing, setProcessing] = useState(false);

  const { triggerAlertWithMessageError, triggerAlertWithMessageSuccess } = useAlert();
  const [params] = useSearchParams();
  const { setVendors } = useVendors(true);
  const [, setVendorsAtom] = useAtom(vendorsAtom);
  const [, setEligibilityDeliveroo] = useAtom(elligibilityDeliverooAtom);

  const oobCode = params.get('oobCode');
  const mode = params.get('mode');

  // clear the localStorage
  useEffect(() => {
    const defaultState = {
      vendorsSelected: [],
      vendorsObj: {},
      vendorsArr: [],
      display: {},
      chainObj: {},
      chainData: [],
    };
    localStorage.clear();
    setVendors(defaultState);
    setVendorsAtom(defaultState);
    setEligibilityDeliveroo({});
  }, []);

  // clear the caches
  caches.keys().then((names) => {
    names.forEach((n) => {
      caches.delete(n);
    });
  });

  const verifyEmail = useCallback(
    async (code) => {
      try {
        await verifyCodeEmail(code);
        triggerAlertWithMessageSuccess('Email verified, you can sign in now');
        navigate('/');
      } catch (err) {
        navigate('/');
      }
    },
    [navigate, triggerAlertWithMessageSuccess, verifyCodeEmail]
  );

  useEffect(() => {
    if (oobCode) {
      logout();
      if (mode === 'resetPassword') {
        navigate(`/reset-password?oobCode=${oobCode}`);
      } else if (mode === 'verifyEmail') {
        verifyEmail(oobCode);
      }
    } else if (user) {
      navigate('/dashboard');
    }
  }, [oobCode, mode]);

  const handleSubmit = useCallback(async () => {
    if (!emailWhitelisted.includes(email.toLocaleLowerCase().trim())) {
      triggerAlertWithMessageError('Unauthorized email address');
      return;
    }

    setProcessing(true);
    try {
      const res = await signIn(email, password, remember);

      if (!res.user.emailVerified) {
        await logout();
        setProcessing(false);
        throw new Error(
          'Email not verified, please check your email (include spam) for verification'
        );
      }

      navigate('/dashboard');
    } catch (error) {
      const message = firebaseCodeError[error.code]
        ? firebaseCodeError[error.code].message
        : error.message;

      if (firebaseCodeError[error.code] && firebaseCodeError[error.code].field) {
        if (firebaseCodeError[error.code].field === 'email') {
          setEmailError(true);
        } else if (firebaseCodeError[error.code].field === 'password') {
          setPasswordError(true);
        }
      }

      triggerAlertWithMessageError(message);
      setProcessing(false);
    }
  }, [email, navigate, password, remember, triggerAlertWithMessageError]);

  const onEmailBlur = useCallback(() => setEmailError(!email), [email]);
  const onPasswordBlur = useCallback(() => setPasswordError(!password), [password]);

  return (
    <SignInForm
      email={email}
      emailError={emailError}
      setEmail={setEmail}
      onEmailBlur={onEmailBlur}
      password={password}
      passwordError={passwordError}
      setPassword={setPassword}
      onPasswordBlur={onPasswordBlur}
      remember={remember}
      setRemember={setRemember}
      onSubmit={handleSubmit}
      disabled={!email || !password || processing}
    />
  );
};

export default SignIn;
