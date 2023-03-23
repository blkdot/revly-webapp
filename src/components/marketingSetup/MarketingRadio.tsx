import { CSSProperties, FC } from 'react';
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
  color?: string;
}> = ({ title, subtitle, icon, className, disabled, onChange, state, radio, color }) => {
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
          <img
            className='planning-platform'
            style={
              {
                '--color': color,
              } as CSSProperties
            }
            src={icon}
            alt='Box Icon'
          />
        )}
        <div>
          {title.charAt(0).toUpperCase() + title.slice(1)}
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
  color: '',
};
export default MarketingRadio;
