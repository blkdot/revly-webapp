import React, { useState } from 'react';

import PlatformSettingsBox from '../../platformSettingsBox/PlatformSettingsBox';

import imageDeliveroo from '../../../assets/images/deliveroo.png';
import imageTalabat from '../../../assets/images/talabat.png';

const platformList = [
  { src: imageDeliveroo, type: 'deliveroo' },
  { src: imageTalabat, type: 'talabat' },
];
const NewSettingsOnboarding = () => {
  const [values, setValues] = useState({
    deliveroo: { active: false, registered: false },
    talabat: { active: false, registered: false },
  });

  const handleSwitchChange = (k) => (v) => {
    setValues({ ...values, [k]: { ...values[k], active: v } });
  };

  const renderPlatform = () =>
    platformList.map((p) => (
      <PlatformSettingsBox
        key={p.type}
        src={p.src}
        type={p.type}
        onChangeSwitch={handleSwitchChange(p.type)}
        active={values[p.type].active}
      />
    ));

  return <div>{renderPlatform()}</div>;
};

export default NewSettingsOnboarding;
