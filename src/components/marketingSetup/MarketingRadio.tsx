import { BoxKit, CheckboxKit, RadioKit } from 'kits';

const MarketingRadio = ({ title, subtitle, icon, className, disabled, onChange, state }: any) => (
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

export default MarketingRadio;
