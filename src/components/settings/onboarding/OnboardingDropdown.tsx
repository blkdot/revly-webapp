import { FC } from 'react';
import { FormControlKit, MenuItemKit, SelectKit } from 'kits';

const OnboardingDropdown: FC<{
  state: any;
  setState: any;
  rows: any;
}> = ({ state, setState, rows }) => {
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
