import { ButtonLoadingKit, FormControlKit, TextfieldKit } from 'kits';
import './ForgotPasswordForm.scss';

const ForgotPasswordForm = (props: any) => {
  const { onChange, onSubmit, disabled, error, isLoading } = props;

  return (
    <FormControlKit className='forgot-password-form' fullWidth>
      <TextfieldKit
        error={error}
        label='Email address'
        onChange={(e) => onChange(e.target.value)}
        className='forgot-password-form__input'
        fullWidth
      />
      <ButtonLoadingKit
        variant='contained'
        onClick={onSubmit}
        className='forgot-password-form__input'
        disabled={disabled}
        size='large'
        loading={isLoading}
      >
        Send Email
      </ButtonLoadingKit>
    </FormControlKit>
  );
};

export default ForgotPasswordForm;
