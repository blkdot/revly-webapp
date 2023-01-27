import { pascalCase } from 'change-case';
import { AiFillEdit } from 'react-icons/ai';
import ButtonKit from '../../kits/button/ButtonKit';
import SwitchKit from '../../kits/switch/SwitchKit';
import './PlatformSettingsBox.scss';

const PlatformSettingsBox = (props: any) => {
  const { active, src, type, registered, onChangeSwitch, onClick } = props;

  const renderFooter = () => {
    if (!active || !registered) return null;

    return (
      <div className='__footer-action'>
        <ButtonKit onClick={onClick}>
          <AiFillEdit />
          &nbsp;Edit
        </ButtonKit>
      </div>
    );
  };

  return (
    <div className='platform-settings-box'>
      <div className='platform-settings-box__content'>
        <div className='__content__image'>
          <img src={src} alt={type} />
        </div>
        <div className='__content__label'>
          <span>Connect your {pascalCase(type)} account to your Revly account</span>
        </div>
        <div className='__content__switch'>
          <span>{active ? 'Active' : 'Inactive'}</span>
          <SwitchKit checked={active} onChange={({ target }) => onChangeSwitch(target.checked)} />
        </div>
        {renderFooter()}
      </div>
    </div>
  );
};

export default PlatformSettingsBox;
