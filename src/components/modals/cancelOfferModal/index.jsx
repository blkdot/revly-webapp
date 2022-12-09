import React from 'react';
import Modal from 'react-modal';
import BaseIcon from '../../../assets/icons/BaseIcon';

const customStyles = {
  overlay: {
    background: '#212B36',
    opacity: '0.9',
    backdropFilter: 'blur(6.5px)',
    zIndex: 10000,
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '480px',
    height: '270px',
    background: '#FFFFFF',
    boxShadow: '-40px 40px 80px -8px rgba(0, 0, 0, 0.24)',
    borderRadius: '16px',
    border: 'none',
    overflow: 'hidden',
  },
};

const CancelOfferModal = ({ modalIsOpen, setIsOpen, cancelOffer, platform }) => {
  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <div>
      <Modal isOpen={modalIsOpen} style={customStyles} contentLabel="Cancel Offer">
        <div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              padding: '24px',
              gap: '16px',
              width: '480px',
              height: '72px',
            }}
          >
            <BaseIcon />
            <span
              style={{
                fontFamily: 'Public Sans',
                fontStyle: 'normal',
                fontWeight: '600',
                fontSize: '16px',
                lineHeight: '24px',
                color: '#212B36',
              }}
            >
              Are you sure you want to delete this offer ?
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              padding: '24px',
              gap: '16px',
              width: '480px',
              height: '72px',
            }}
          >
            <p
              style={{
                width: '416px',
                height: '72px',
                fontFamily: 'Public Sans',
                fontStyle: 'normal',
                fontWeight: '400',
                fontSize: '16px',
                lineHeight: '24px',
                color: '#637381',
              }}
            >
              This offer will be cancelled on {platform} and metrics as well as KPIs will be saved
              and made available through Revly.
            </p>
          </div>
          <div style={{ display: 'flex', marginTop: '36px', justifyContent: 'flex-end' }}>
            <button
              style={{
                marginRight: '10px',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '11px 22px',
                background: '#FF4842',
                boxShadow: '0px 8px 16px rgba(255, 72, 66, 0.24)',
                borderRadius: '31px',
                fontFamily: 'Public Sans',
                fontStyle: 'normal',
                fontWeight: '700',
                fontSize: '15px',
                lineHeight: '26px',
                color: '#FFFFFF',
                border: 'none',
                cursor: 'pointer',
              }}
              type="button"
              onClick={cancelOffer}
            >
              Yes, Cancel this Offer
            </button>
            <button
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '11px 22px',
                border: '1px solid rgba(145, 158, 171, 0.32)',
                borderRadius: '31px',
                cursor: 'pointer',
              }}
              type="button"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CancelOfferModal;
