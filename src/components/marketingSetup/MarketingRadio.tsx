import { BoxKit, CheckboxKit, RadioKit } from 'kits';

const MarketingRadio = ({
  title,
  subtitle,
  icon,
  className,
  disabled,
  checkbox,
  onChange,
  state,
}: any) => {
  const getButton = () => {
    if (checkbox) {
      return (
        <CheckboxKit
          onChange={(e) => {
            onChange(e);
          }}
          value={title}
          checked={state.indexOf(title) > -1}
        />
      );
    }
    return (
      <RadioKit
        onChange={(e) => {
          onChange(e, true);
        }}
        value={title}
        checked={state.indexOf(title) > -1}
      />
    );
  };
  return (
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
      {!disabled ? getButton() : ''}
    </BoxKit>
  );
};

export default MarketingRadio;
