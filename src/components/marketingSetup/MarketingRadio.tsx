import { FC } from 'react';
import { BoxKit, CheckboxKit } from 'kits';

const MarketingRadio: FC<{
  title?: string;
  subtitle?: string;
  icon?: any;
  className?: string;
  disabled?: boolean;
  onChange?: any;
  state?: any;
}> = ({ title, subtitle, icon, className, disabled, onChange, state }) => (
  <BoxKit className={`left-part-radio ${disabled ? 'disabled' : ''} ${!icon ? 'reversed' : ''}`}>
    <div>
      {icon ? (
        <span className={className}>
          <img src={icon} alt='Box Icon' />
        </span>
      ) : (
        ''
      )}
      <div>
        {title}
        {subtitle ? <p>{subtitle}</p> : ''}
      </div>
    </div>
    {!disabled ? (
      <CheckboxKit
        onChange={(e) => {
          onChange(e);
        }}
        value={title}
        checked={state.indexOf(title) > -1}
      />
    ) : (
      ''
    )}
  </BoxKit>
);
MarketingRadio.defaultProps = {
  title: '',
  subtitle: '',
  icon: null,
  className: '',
  disabled: false,
  onChange: null,
  state: null,
};
export default MarketingRadio;
