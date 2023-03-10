import { FC } from 'react';
import { CheckboxKit, FormControlKit, ListItemTextKit, MenuItemKit, SelectKit } from 'kits';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
const OnboardingDropdown: FC<{
  state: any;
  handleChange: any;
  rows: any;
}> = ({ state, handleChange, rows }) => (
  <FormControlKit
    className={`onboarding-dropdown ${rows.length === 0 && 'onboarding-dropdown_skeleton'}`}
    sx={{ m: 1, minWidth: 120 }}
  >
    <SelectKit
      value={state}
      onChange={handleChange}
      multiple
      labelId='demo-multiple-checkbox-label'
      id='demo-multiple-checkbox'
      disabled={!(rows.length > 0)}
      renderValue={(selected) => selected.join(', ')}
      MenuProps={MenuProps}
    >
      {rows.map((r: string) => (
        <MenuItemKit value={r} key={r}>
          <CheckboxKit checked={state.indexOf(r) > -1} />
          <ListItemTextKit primary={r} />
        </MenuItemKit>
      ))}
    </SelectKit>
  </FormControlKit>
);

export default OnboardingDropdown;
