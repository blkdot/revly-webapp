import { useTheme } from '@mui/material/styles';
import { FormControlKit, MenuItemKit, OutlinedInputKit, SelectKit } from 'kits';

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

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName?.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const MarketingPlaceholderDropdown = ({
  setPersonName,
  personName,
  title,
  names,
  className,
  readOnly,
  handleChange,
}: any) => {
  const theme = useTheme();

  const handleChangeValue = (event) => {
    const {
      target: { value },
    } = event;
    if (setPersonName) {
      setPersonName(value);
    }
  };

  return (
    <div className={`marketing-placeholder-dropdown ${personName ? 'active' : ''} ${className}`}>
      <FormControlKit sx={{ m: 1, width: 300, mt: 3 }}>
        <SelectKit
          readOnly={readOnly}
          displayEmpty
          value={personName || ''}
          onChange={handleChange || handleChangeValue}
          input={<OutlinedInputKit />}
          renderValue={(selected) => <em>{selected || title}</em>}
          MenuProps={MenuProps}
          inputProps={{ 'aria-label': 'Without label' }}
        >
          {names.map((name) => (
            <MenuItemKit key={name} value={name} style={getStyles(name, personName, theme)}>
              {name}
            </MenuItemKit>
          ))}
        </SelectKit>
      </FormControlKit>
    </div>
  );
};

export default MarketingPlaceholderDropdown;
