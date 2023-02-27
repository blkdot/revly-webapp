import { ButtonKit, InputKit } from 'kits';
import { FC } from 'react';
import { Arrow } from 'assets/icons';
import selectedVendors from 'components/restaurantDropdown/selectedVendors';
import Wallet from '../../../../assets/images/wallet.svg';
import List from '../../../../assets/images/list.svg';

type stateType = {
  title: string;
  content: {
    title: string;
    value: string | number;
  }[];
};

type stateBranchType = {
  title: string;
  content: {
    title: string;
    value: string | number;
  }[][];
};

const BudgetStep: FC<{
  setStep: (value: string) => void;
  stateAdverts: stateType;
  setStateAdverts: (stateType) => void;
  stateBranch: stateBranchType;
  setStateBranch: (stateBranchType) => void;
  setOpened: (value: boolean) => void;
  step: string;
  branchVendors: any;
}> = ({
  setStep,
  stateAdverts,
  setStateAdverts,
  stateBranch,
  setStateBranch,
  setOpened,
  step,
  branchVendors,
}) => {
  const stateTemp = { ...stateAdverts };
  const stateBranchTemp = { ...stateBranch };
  return (
    <div className={`adverts-step ${step || ''}`}>
      <div className='top'>
        <p>3. Setup your Adverts budgets</p>
        <span>
          Set a budget for all your selected branches , we will adjust this advert on your platform
          throughout the selected duration to get you the best value on your spent budget
        </span>
        <div className='advert-total-budget'>
          <div className='advert-title-icon'>
            <span>
              <img className='no-filter' src={Wallet} alt='Wallet' />
            </span>
            <p>Total budget</p>
          </div>
          <div className='advert-input'>
            <InputKit
              onChange={(e) => {
                stateTemp.content.find((obj) => obj.title === 'Total budget').value = `AED ${
                  e.target.value || 0
                }`;
                setStateAdverts({ ...stateTemp });
              }}
              type='number'
              placeholder='e.g. AED 20.00'
            />
          </div>
        </div>
        <div className='advert-budget-usage'>
          <div className='advert-title-icon'>
            <span>
              <img className='no-filter' src={List} alt='List' />
            </span>
            <p>Budget usage per branch</p>
          </div>
          <div className='advert-branches-budget'>
            {selectedVendors('name', branchVendors.display).map((name, index) => (
              <div key={name}>
                <p>{name}</p>
                <div className='advert-input'>
                  <InputKit
                    onChange={(e) => {
                      stateBranchTemp.content[index].find(
                        (obj) => obj.title === 'Branch budget'
                      ).value = `AED ${e.target.value || 0}`;
                      setStateBranch({ ...stateBranchTemp });
                    }}
                    type='number'
                    placeholder='e.g. AED 20.00'
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className='buttons'>
        <ButtonKit onClick={() => setOpened(false)} className='cancel' variant='contained'>
          Cancel
        </ButtonKit>
        <ButtonKit
          onClick={() => {
            setStep('budget');
          }}
          disabled
          className='continue'
          variant='contained'
        >
          Continue <Arrow />
        </ButtonKit>
      </div>
    </div>
  );
};

export default BudgetStep;
