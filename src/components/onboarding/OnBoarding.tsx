import { pascalCase } from 'change-case';
import OnBoardingForm from '../forms/onBoardingForm/OnBoardingForm';

const OnBoarding = ({ platform, formValue, setFormValue }) => {
  const handleChange = (k) => (v) => {
    setFormValue({ ...formValue, [k]: v });
  };

  const renderTitle = () => (
    <span
      className='__form-card__text'
      style={{ fontSize: '16px', fontWeight: 600, color: '#212B36' }}
    >
      Link your{' '}
      <span style={{ color: platform.color, fontSize: '16px' }}>{pascalCase(platform.name)}</span>{' '}
      account to your <span style={{ color: '#4D2681', fontSize: '16px' }}>Revly</span> account.
    </span>
  );

  const renderForm = () => (
    <div>
      <OnBoardingForm
        onChangeEmail={handleChange('email')}
        onChangePassword={handleChange('password')}
        valueMail={formValue.email}
        valuePassword={formValue.password}
        title={renderTitle()}
      />
    </div>
  );

  return <div className='onboarding__form'>{renderForm()}</div>;
};

export default OnBoarding;
