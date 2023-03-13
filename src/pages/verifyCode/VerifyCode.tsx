import { ArrowBack } from '@mui/icons-material';
import { settingsSave } from 'api';
import { useUserAuth } from 'contexts';
import { auth, logout, updatePhone, verifyPhone } from 'firebase-config';
import { getAuth, sendEmailVerification } from 'firebase/auth';
import { useAlert } from 'hooks';
import { ModalKit } from 'kits';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import VerifyCodeForm from '../../components/forms/verifyCodeForm/VerifyCodeForm';
import Timer from '../../components/timer/Timer';
import './VerifyCode.scss';

const VerifyCode = () => {
  const { isUpdatingPhone, setIsUpdatingPhone } = useUserAuth();
  const [values, setValues] = useState({
    code1: '',
    code2: '',
    code3: '',
    code4: '',
    code5: '',
    code6: '',
  });
  const [error, setError] = useState({
    code1: false,
    code2: false,
    code3: false,
    code4: false,
    code5: false,
    code6: false,
  });
  const [showModal] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isResend, setIsResend] = useState(false);
  const { triggerAlertWithMessageSuccess, triggerAlertWithMessageError } = useAlert();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  const {
    state: { data, prevPath, n, vId: vIdLocal },
  } = useLocation();
  const [vId, setVId] = useState(vIdLocal);
  const handleChangeWithNextField = (e) => {
    const { maxLength, value, name } = e.target;

    const fieldIndex = name.replace('code', '');

    const fieldIntIndex = Number(fieldIndex);

    if (value.length >= maxLength) {
      if (fieldIntIndex < 6) {
        const nextfield = document.querySelector(`input[name=code${fieldIntIndex + 1}]`);

        if (nextfield !== null) {
          (nextfield as any).focus();
        }
      }
    }

    setError({ ...error, [name]: false });
    handleChange(e);
  };
  const onVerify = async () => {
    setLoading(true);
    try {
      const code = Object.keys(values)
        .map((v) => values[v])
        .join('');
      await updatePhone(vId, code);
      if (prevPath === '/signup') {
        await settingsSave({
          master_email: data.email,
          data: {
            restoname: data.restoName.trim(),
            pointOfSale: data.pointOfSale,
            country: data.dial.country,
            dial: data.dial.dialCode,
          },
        });
        await sendEmailVerification(auth.currentUser);
        await logout();
        navigate('/');
        triggerAlertWithMessageSuccess(
          'We sent an email verification to your email, please check it (include spam) before signin'
        );
        return;
      }
      navigate(prevPath);
      triggerAlertWithMessageSuccess('Phone number updated');
    } catch (err) {
      setLoading(false);
      triggerAlertWithMessageError(err.code);
    }
  };

  useEffect(() => {
    if (!isUpdatingPhone) {
      navigate(prevPath);
    }

    return () => setIsUpdatingPhone(false);
  }, [isUpdatingPhone]);

  const handleResend = async () => {
    setIsResend(true);
    try {
      const vIdTemp = await verifyPhone(n.includes('+') ? n : `+${n}`);
      setVId(vIdTemp);
      triggerAlertWithMessageSuccess('Code resent');
    } catch (err) {
      triggerAlertWithMessageError(err.code);
    }
  };

  const onInputBlur = (field) => !values[field] && setError({ ...error, [field]: true });

  if (!isUpdatingPhone) {
    return null;
  }
  const goBack = () => {
    if (prevPath === '/signup') {
      navigate(prevPath);
      getAuth().currentUser.delete();
    } else {
      navigate(prevPath);
    }
  };
  return (
    <ModalKit open={showModal}>
      <div className='verify-code'>
        <p onClick={goBack} tabIndex={-1} role='presentation' onKeyDown={goBack} className='__icon'>
          <ArrowBack fontSize='large' />
        </p>
        <p className='__title'>Please check your phone message!</p>
        <p className='__subtitle'>
          We&apos;ve texted a 6-digit confirmation code to {n.includes('+') ? n : `+${n}`}, please enter the code in below box
          to update your phone number.
        </p>
        <div className='__form'>
          <VerifyCodeForm
            disableVerify={
              Object.keys(values)
                .map((v) => !!values[v])
                .includes(false) || loading
            }
            values={values}
            handleChangeWithNextField={handleChangeWithNextField}
            onVerify={onVerify}
            inputError={error}
            onBlur={onInputBlur}
          />
        </div>
        <div className='__resend-block'>
          Don&apos;t have a code? &nbsp;
          <button disabled={isResend} type='button' aria-label='resend' onClick={handleResend}>
            Resend
          </button>
          &nbsp;
          {isResend && <Timer onEnd={() => setIsResend(false)} />}
        </div>
      </div>
    </ModalKit>
  );
};

export default VerifyCode;
