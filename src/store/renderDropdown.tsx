import { Switch } from 'assets/icons';
import { platformObject } from 'data/platformList';
import { CheckboxKit, RadioKit } from 'kits';
import { CSSProperties, ReactNode } from 'react';
import Columns from 'assets/images/columns.svg';

export const renderPlatformValue = (platform: string[]) => {
  if (platform.length === 0) {
    return (
      <div className='menu__platform-selected'>
        <img src={Columns} alt='columns' />
        <div className='platform-join'>Platform</div>
      </div>
    );
  }
  return (
    <div className='menu__platform-selected'>
      <div className='children-extra'>
        {platform.map((plat) => (
          <span key={plat}>
            <img
              className='planning-platform'
              style={{ '--color': platformObject[plat].color, height: '100%' } as CSSProperties}
              src={
                platformObject[plat].srcNoBg ||
                platformObject[plat].srcWhite ||
                platformObject[plat].src
              }
              alt={plat}
            />
          </span>
        ))}
      </div>
      <div className='platform-join'>
        {platform.map((plat) => plat.charAt(0).toUpperCase() + plat.slice(1)).join(', ')}
      </div>
    </div>
  );
};

export const renderPlatformOption = (
  v: any,
  platform: string[],
  handleChange: (v: string) => void
) => (
  <div
    key={v.value}
    className={`__item-select menu__platform-select ${platform.includes(v.value)}`}
    onClick={() => handleChange(v.value)}
    tabIndex={-1}
    role='presentation'
  >
    <img
      className='planning-platform'
      style={{ '--color': platformObject[v.value]?.color } as CSSProperties}
      src={
        platformObject[v.value]?.srcNoBg ||
        platformObject[v.value]?.srcWhite ||
        platformObject[v.value]?.src
      }
      alt={v.value}
    />
    {(v.value || '').charAt(0).toUpperCase() + (v.value || '').slice(1)}
  </div>
);

export const renderSimpleValue = (items: string[], icon?: ReactNode, title?: string) => {
  if (items.length === 0) {
    return (
      <div className='menu__platform-selected'>
        {icon}
        <div className='platform-join'>{title || 'No item selected'}</div>
      </div>
    );
  }
  return (
    <div className='menu__platform-selected'>
      {icon}
      <div className='platform-join'>
        {items.map((v) => v.charAt(0).toUpperCase() + v.slice(1)).join(', ')}
      </div>
    </div>
  );
};

export const renderSimpleRadioOption = (
  v: string,
  items: string[],
  handleChange: (v: string) => void
) => (
  <div
    key={v}
    className='__item-select menu__platform-select'
    onClick={() => handleChange(v)}
    tabIndex={-1}
    role='presentation'
  >
    <RadioKit checked={items.includes(v)} />
    <span className={`competition-status ${v}`}>{v.charAt(0).toUpperCase() + v.slice(1)}</span>
  </div>
);

export const renderSimpleCheckboxOption = (
  v: string,
  items: string[],
  handleChange: (v: string) => void
) => (
  <div
    key={v}
    className='__item-select menu__platform-select'
    onClick={() => handleChange(v)}
    tabIndex={-1}
    role='presentation'
  >
    <CheckboxKit checked={items.includes(v)} />
    <span className={`competition-status ${v}`}>{v.charAt(0).toUpperCase() + v.slice(1)}</span>
  </div>
);

export const renderFilterRadioOption = (
  v: { value: string; text: string },
  items: string[],
  handleChange: (v: string) => void
) => (
  <div
    key={v.value}
    className='__item-select menu__platform-select'
    onClick={() => handleChange(v.value)}
    tabIndex={-1}
    role='presentation'
  >
    <RadioKit checked={items.includes(v.value)} />
    <span className={`competition-status ${v.value}`}>
      {v.value.charAt(0).toUpperCase() + v.value.slice(1)}
    </span>
  </div>
);

export const renderFilterCheckboxOption = (
  v: { value: string; text: string },
  items: string[],
  handleChange: (v: string) => void
) => (
  <div
    key={v.value}
    className='__item-select menu__platform-select'
    onClick={() => handleChange(v.value)}
    tabIndex={-1}
    role='presentation'
  >
    <CheckboxKit checked={items.includes(v.value)} />
    <span className={`competition-status ${v.value}`}>
      {v.value.charAt(0).toUpperCase() + v.value.slice(1)}
    </span>
  </div>
);
