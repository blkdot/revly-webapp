import icdeliveroo from '../../assets/images/deliveroo-favicon.webp';
import Kuwait from '../../assets/images/Kuwait.png';
import Qatar from '../../assets/images/Qatar.png';
import ictalabat from '../../assets/images/talabat-favicon.png';
import UAE from '../../assets/images/UAE.png';
import FormcontrolKit from '../../kits/formcontrol/FormcontrolKit';
import InputLabelKit from '../../kits/inputlabel/InputLabelKit';
import ListItemTextKit from '../../kits/listItemtext/ListItemTextKit';
import MenuItemKit from '../../kits/menuItem/MenuItemKit';
import OutlindeInputKit from '../../kits/outlindeInput/OutlindeInputKit';
import SelectKit from '../../kits/select/SelectKit';
import './CompetitionDropdown.scss';

const CompetitionDropdown = (props: any) => {
  const {
    className,
    title,
    rows,
    renderOptions,
    select,
    icon,
    setRow,
    multiple,
    onChange,
    id,
    renderValue,
    type,
    widthPaper,
    heightPaper,
  } = props;
  const ITEM_HEIGHT = heightPaper || 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      id,
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: widthPaper || 250,
      },
    },
  };

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    if (setRow) {
      setRow(value);
    }
  };

  const getFlag = (name) => {
    if (name === 'UAE') {
      return UAE;
    }
    if (name === 'Kuwait') {
      return Kuwait;
    }
    return Qatar;
  };

  const renderSelectOption = (arr) =>
    arr?.map((name) =>
      renderOptions ? (
        renderOptions(name)
      ) : (
        <MenuItemKit key={name} value={name}>
          {title === 'Country' ? <img className="flag-img" src={getFlag(name)} alt={name} /> : ''}
          {type === 'platform' ? (
            <img
              className="flag-img"
              src={name === 'deliveroo' ? icdeliveroo : ictalabat}
              alt={name}
            />
          ) : (
            ''
          )}
          <ListItemTextKit primary={name} />
        </MenuItemKit>
      ),
    );

  return (
    <div className={`restaurant-dropdown_wrapper ${className}`}>
      <FormcontrolKit sx={{ m: 1, width: 250 }}>
        <InputLabelKit
          className="restaurant-dropdown-input competition-dropdown"
          id="demo-multiple-checkbox-label"
        >
          {icon ? <img src={icon} alt="Select Icon" /> : ''}
          {title}
        </InputLabelKit>
        <SelectKit
          required
          multiple={multiple}
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          value={select === undefined ? '' : select}
          onChange={onChange || handleChange}
          input={<OutlindeInputKit label={title} />}
          renderValue={(selected) =>
            renderValue ? (
              renderValue(selected)
            ) : (
              <div className="country-wrapper">
                {title === 'Country' ? (
                  <img className="flag-img" src={getFlag(selected)} alt={selected} />
                ) : (
                  ''
                )}
                {type === 'platform' ? (
                  <img
                    src={selected === 'deliveroo' ? icdeliveroo : ictalabat}
                    width={24}
                    height={24}
                    style={{ objectFit: 'contain' }}
                    alt="icon"
                  />
                ) : (
                  ''
                )}
                {selected}
              </div>
            )
          }
          MenuProps={MenuProps}
        >
          {renderSelectOption(rows)}
        </SelectKit>
      </FormcontrolKit>
    </div>
  );
};

export default CompetitionDropdown;
