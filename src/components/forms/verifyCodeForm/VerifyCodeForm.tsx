import './VerifyCodeForm.scss';

import ButtonKit from '../../../kits/button/ButtonKit';
import TextfieldKit from '../../../kits/textfield/TextfieldKit';

import onlyNumber from '../../../utlls/input/onlyNumber';

const VerifyCodeForm = (props: any) => {
  const { values, handleChangeWithNextField, onVerify, disableVerify, onBlur, inputError } = props;

  const renderInput = () =>
    Object.keys(values).map((v, i) => (
      <TextfieldKit
        key={v}
        name={`code${i + 1}`}
        onChange={handleChangeWithNextField}
        inputProps={{ maxLength: 1 }}
        autoFocus={i === 0}
        onKeyDown={onlyNumber}
        className="__input"
        onBlur={() => onBlur(v)}
        error={inputError[v]}
      />
    ));

  return (
    <div className="verify-code-form">
      <div className="__input-block">{renderInput()}</div>
      <ButtonKit
        disabled={disableVerify}
        variant="contained"
        size="large"
        onClick={onVerify}
        className="__btn"
      >
        Verify
      </ButtonKit>
    </div>
  );
};

export default VerifyCodeForm;
