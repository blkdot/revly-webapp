import { BaseIcon } from 'assets/icons';
import { ButtonKit } from 'kits';
import LodaingButtonKit from 'kits/loadingButton/LoadingButtonKit';
import { FC } from 'react';

const SwitchDeleteModal: FC<{
  openSwitchDeleteModal: (event: any) => void;
  openedSwitchDeleteModal: boolean;
  onClick: any;
  title: string;
  button: string;
  loading: boolean;
}> = ({ openSwitchDeleteModal, openedSwitchDeleteModal, onClick, title, button, loading }) => (
  <div
    className={`onboarding-delete-modal-overlay ${openedSwitchDeleteModal && 'active'}`}
    tabIndex={-1}
    role='presentation'
    onClick={openSwitchDeleteModal}
  >
    <div
      tabIndex={-1}
      role='presentation'
      onClick={(e) => e.stopPropagation()}
      className='onboarding-delete-modal'
    >
      <div>
        <BaseIcon />
        <p>{title}</p>
      </div>
      <div>
        <LodaingButtonKit onClick={onClick} loading={loading} variant='contained'>
          {button}
        </LodaingButtonKit>
        <ButtonKit variant='outlined' onClick={openSwitchDeleteModal}>
          Close
        </ButtonKit>
      </div>
    </div>
  </div>
);
export default SwitchDeleteModal;
