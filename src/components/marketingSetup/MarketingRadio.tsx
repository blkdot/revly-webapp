import { FC } from 'react';
import { BoxKit, CheckboxKit, FormControlLabelKit, RadioKit } from 'kits';

const MarketingRadio: FC<{
  title?: string;
  subtitle?: string;
  icon?: any;
  className?: string;
  disabled?: boolean;
  onChange?: any;
  state?: any;
  radio?: boolean;
}> = ({ title, subtitle, icon, className, disabled, onChange, state, radio }) => {
  const getButton = () => {
    if (radio) {
      return <FormControlLabelKit onChange={onChange} value={title} control={<RadioKit />} />;
    }
    return <CheckboxKit onChange={onChange} value={title} checked={state.indexOf(title) > -1} />;
  };
  return (
    <BoxKit className={`left-part-radio ${disabled && 'disabled'} ${!icon && 'reversed'}`}>
      <div>
        {icon && (
          <span className={className}>
            <img src={icon} alt='Box Icon' />
          </span>
        )}
        <div>
          {title}
          {subtitle && <p>{subtitle}</p>}
        </div>
      </div>
      {!disabled && getButton()}
    </BoxKit>
  );
};
MarketingRadio.defaultProps = {
  title: '',
  subtitle: '',
  icon: null,
  className: '',
  disabled: false,
  onChange: null,
  state: null,
  radio: false,
};
export default MarketingRadio;
