import BoxKit from '../../kits/box/BoxKit';
import CheckboxKit from '../../kits/checkbox/CheckboxKit';
import FormControlLabelKit from '../../kits/formControlLabel/FormControlLabel';
import RadioKit from '../../kits/radio/RadioKit';

const MarketingRadio = ({
  title,
  subtitle,
  icon,
  className,
  disabled,
  checkbox,
  setState,
  state,
}: any) => {
  const getButton = () => {
    if (checkbox) {
      return (
        <CheckboxKit
          onChange={(e) => {
            setState(e);
          }}
          value={title}
          checked={state.indexOf(title) > -1}
        />
      );
    }
    return <FormControlLabelKit value={title} control={<RadioKit />} />;
  };
  return (
    <BoxKit className={`left-part-radio ${disabled ? 'disabled' : ''} ${!icon ? 'reversed' : ''}`}>
      <div>
        {icon ? (
          <span className={className}>
            <img src={icon} alt="Box Icon" />
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
