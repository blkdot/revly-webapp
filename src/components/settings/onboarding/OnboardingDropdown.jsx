import FormControlKit from '../../../kits/formcontrol/FormcontrolKit';
import MenuItemKit from '../../../kits/menuItem/MenuItemKit';
import SelectKit from '../../../kits/select/SelectKit';

const OnboardingDropdown = ({ state, setState, rows }) => {
  const handleChange = (event) => {
    setState(event.target.value);
  };

  return (
    <FormControlKit
      className={`onboarding-dropdown ${rows.length === 0 ? 'onboarding-dropdown_skeleton' : ''}`}
      sx={{ m: 1, minWidth: 120 }}
    >
      <SelectKit
        value={state}
        onChange={handleChange}
        displayEmpty
        inputProps={{ 'aria-label': 'Without label' }}
        disabled={!(rows.length > 0)}
      >
        {rows.map((r) => (
          <MenuItemKit value={r} key={r}>
            {r}
          </MenuItemKit>
        ))}
      </SelectKit>
    </FormControlKit>
  );
};

export default OnboardingDropdown;
