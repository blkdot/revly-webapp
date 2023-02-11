import { FC } from 'react';
import { CheckboxKit, FormControlKit, ListItemTextKit, MenuItemKit, SelectKit } from 'kits';

const OnboardingDropdown: FC<{
  state: any;
  setState: any;
  rows: any;
}> = ({ state, setState, rows }) => {
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setState(
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  return (
    <FormControlKit
      className={`onboarding-dropdown ${rows.length === 0 ? 'onboarding-dropdown_skeleton' : ''}`}
      sx={{ m: 1, minWidth: 120 }}
    >
      <SelectKit
        value={state}
        onChange={handleChange}
        multiple
        labelId="demo-multiple-checkbox-label"
        id="demo-multiple-checkbox"
        disabled={!(rows.length > 0)}
        renderValue={(selected) => selected.join(', ')}
      >
        {rows.map((r: string) => (
          <MenuItemKit value={r} key={r}>
            <CheckboxKit checked={rows.indexOf(r) > -1}/>
            <ListItemTextKit primary={r} />
          </MenuItemKit>
        ))}
      </SelectKit>
    </FormControlKit>
  );
};

export default OnboardingDropdown;
