import { ButtonKit, InputKit, RadioKit, TooltipKit } from 'kits';
import { FC, useState } from 'react';
import { Arrow } from 'assets/icons';
import selectedVendors from 'components/restaurantDropdown/selectedVendors';
import Wallet from '../../../../assets/images/wallet.svg';
import List from '../../../../assets/images/list.svg';
import TooltipIcon from '../../../../assets/images/tooltip-ic.svg';

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
  step: string;
  branchVendors: any;
}> = ({
  setStep,
  stateAdverts,
  setStateAdverts,
  stateBranch,
  setStateBranch,
  step,
  branchVendors,
}) => {
  const stateTemp = { ...stateAdverts };
  const stateBranchTemp = { ...stateBranch };
  const getDisabled = () => {
    if (
      Number(
        stateTemp.content
          .find((obj) => obj.title === 'Total budget')
          .value.toString()
          .replace('AED ', '')
      ) &&
      stateBranchTemp.content.every((arr) => Number(arr[2].value.toString().replace('AED ', '')))
    ) {
      return false;
    }
    return true;
  };
  const [budget, setBudget] = useState('total');
  const onChange = (e) => {
    setBudget(e.target.value);
    stateBranchTemp.content.forEach((arr, index) => {
      stateBranchTemp.content[index][2].value = 'AED 0';
    });
    stateTemp.content[0].value = 'AED 0';
    setStateBranch({ ...stateBranchTemp });
    setStateAdverts({ ...stateTemp });
  };

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
            <TooltipKit
              onClick={(e) => e.stopPropagation()}
              interactive={1}
              id='table-tooltip'
              placement='right'
              arrow
              title='Total budget'
            >
              <img className='table-header-tooltip' src={TooltipIcon} alt='tooltip icon' />
            </TooltipKit>
            <div className='adverts-title-radio'>
              <RadioKit checked={budget === 'total'} value='total' onChange={onChange} />
            </div>
          </div>
          <div className='advert-input'>
            <InputKit
              onChange={(e) => {
                stateTemp.content[0].value = `AED ${e.target.value || 0}`;
                stateBranchTemp.content.forEach((arr, index) => {
                  stateBranchTemp.content[index][2].value = `AED ${
                    e.target.value / stateBranchTemp.content.length
                  }`;
                });
                setStateBranch({ ...stateBranchTemp });
                setStateAdverts({ ...stateTemp });
                setBudget('total');
              }}
              value={Number(stateTemp.content[0].value.toString().replace('AED ', '')) || ''}
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
            <TooltipKit
              onClick={(e) => e.stopPropagation()}
              interactive={1}
              id='table-tooltip'
              placement='right'
              arrow
              title='Budget usage per branch'
            >
              <img className='table-header-tooltip' src={TooltipIcon} alt='tooltip icon' />
            </TooltipKit>
            <div className='adverts-title-radio'>
              <RadioKit checked={budget === 'per'} value='per' onChange={onChange} />
            </div>
          </div>
          <div className='advert-branches-budget'>
            {selectedVendors('name', branchVendors.display).map((name, index) => (
              <div key={name}>
                <p>{name}</p>
                <div className='advert-input'>
                  <InputKit
                    onChange={(e) => {
                      stateBranchTemp.content[index][2].value = `AED ${e.target.value || 0}`;
                      const value = Number(
                        stateBranchTemp.content
                          .reduce((a, b) => [
                            { title: '', value: '' },
                            { title: '', value: '' },
                            {
                              title: '',
                              value:
                                Number(a[2].value.toString().replace('AED ', '')) +
                                Number(b[2].value.toString().replace('AED ', '')),
                            },
                          ])[2]
                          .value.toString()
                          .replace('AED ', '')
                      );
                      stateTemp.content[0].value = `AED ${value}`;
                      setStateBranch({ ...stateBranchTemp });
                      setStateAdverts({ ...stateTemp });
                      setBudget('per');
                    }}
                    value={
                      Number(
                        stateBranchTemp.content[index][2].value.toString().replace('AED ', '')
                      ) || ''
                    }
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
        <ButtonKit onClick={() => setStep('recurency')} className='cancel' variant='contained'>
          Back
        </ButtonKit>
        <ButtonKit
          onClick={() => {
            setStep('biding');
            stateBranchTemp.content.forEach((arr, index) => {
              stateBranchTemp.content[index][1].value = 'AED 0';
            });
            setStateBranch({ ...stateBranchTemp });
          }}
          disabled={getDisabled()}
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
