import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowBack } from '@mui/icons-material';

import './VerifyCode.scss';

import VerifyCodeForm from '../../components/forms/verifyCodeForm/VerifyCodeForm';
import Timer from '../../components/timer/Timer';

import ModalKit from '../../kits/modal/ModalKit';

import { useAlert } from '../../hooks/useAlert';
import { useUserAuth } from '../../contexts/AuthContext';

const VerifyCode = () => {
  const { updatePhone, verifyPhone, isUpdatingPhone, setIsUpdatingPhone } = useUserAuth();
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
  const [params] = useSearchParams();
  const { triggerAlertWithMessageSuccess, triggerAlertWithMessageError } = useAlert('error');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleChangeWithNextField = (e) => {
    const { maxLength, value, name } = e.target;

    const fieldIndex = name.replace('code', '');

    const fieldIntIndex = Number(fieldIndex);

    if (value.length >= maxLength) {
      if (fieldIntIndex < 6) {
        const nextfield = document.querySelector(`input[name=code${fieldIntIndex + 1}]`);

        if (nextfield !== null) {
          nextfield.focus();
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
      await updatePhone(params.get('vId'), code);
      navigate('/settings');
      triggerAlertWithMessageSuccess('Phone number updated');
    } catch (err) {
      setLoading(false);
      triggerAlertWithMessageError(err.code);
    }
  };

  useEffect(() => {
    if (!isUpdatingPhone) {
      navigate('/settings');
    }

    return () => setIsUpdatingPhone(false);
  }, [isUpdatingPhone]);

  const handleResend = async () => {
    setIsResend(true);
    try {
      const vId = await verifyPhone(`+${params.get('n')}`);
      params.set('vId', vId);
      triggerAlertWithMessageSuccess('Code resent');
    } catch (err) {
      triggerAlertWithMessageError(err.code);
    }
  };

  const onInputBlur = (field) => !values[field] && setError({ ...error, [field]: true });

  if (!isUpdatingPhone) {
    return null;
  }

  return (
    <ModalKit open={showModal}>
      <div className="verify-code">
        <Link to="/settings" className="__icon">
          <ArrowBack fontSize="large" />
        </Link>
        <p className="__title">Please check your phone message!</p>
        <p className="__subtitle">
          We&apos;ve texted a 6-digit confirmation code to +{params.get('n')}, please enter the code
          in below box to update your phone number.
        </p>
        <div className="__form">
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
        <div className="__resend-block">
          Don&apos;t have a code? &nbsp;
          <button disabled={isResend} type="button" aria-label="resend" onClick={handleResend}>
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
