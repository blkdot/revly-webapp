import { platformObject } from 'data/platformList';
import { CSSProperties } from 'react';

export const renderPlatformValue = (platform: string[]) => (
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
      style={{ '--color': platformObject[v.value].color } as CSSProperties}
      src={
        platformObject[v.value].srcNoBg ||
        platformObject[v.value].srcWhite ||
        platformObject[v.value].src
      }
      alt={v.value}
    />
    {v.value.charAt(0).toUpperCase() + v.value.slice(1)}
  </div>
);
