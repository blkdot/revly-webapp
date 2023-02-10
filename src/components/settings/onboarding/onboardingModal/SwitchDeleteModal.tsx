import { BaseIcon } from 'assets/icons';
import { ButtonKit } from 'kits';
import LodaingButtonKit from 'kits/loadingButton/LoadingButtonKit';
import { FC, useState } from 'react';

const SwitchDeleteModal: FC<{ 
  openSwitchDeleteModal: any;
  setOpenedSwitchDeleteModal: any;
  openedSwitchDeleteModal: any;
  onClick: any;
}> = ({ openSwitchDeleteModal, openedSwitchDeleteModal, setOpenedSwitchDeleteModal, onClick  }) => {
  const [isLoading,setIsLoading] = useState(false);
  const handleClick = async () => {
    setIsLoading(true);
    await onClick();
    setIsLoading(false);
    setOpenedSwitchDeleteModal(!openedSwitchDeleteModal);
  }
  return <div
    className={`onboarding-delete-modal-overlay ${openedSwitchDeleteModal ? 'active' : ''}`}
    tabIndex={-1}
    role='presentation'
    onClick={openSwitchDeleteModal}
  >

    <div className='onboarding-delete-modal'>
      <div>
        <BaseIcon/>
        <p>
          Are you sure you want to delete this branch ?
        </p>
      </div>
      <div>
        <LodaingButtonKit onClick={handleClick} loading={isLoading} variant='contained'>
          Delete this Branch
        </LodaingButtonKit>
        <ButtonKit variant='outlined' onClick={openSwitchDeleteModal}>
          Close
        </ButtonKit>
      </div>
    </div>
  </div>
}
export default SwitchDeleteModal;