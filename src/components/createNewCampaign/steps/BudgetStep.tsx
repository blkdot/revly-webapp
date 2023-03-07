import { ButtonKit, InputKit, RadioKit, TooltipKit } from 'kits';
import { FC, useState } from 'react';
import { Arrow } from 'assets/icons';
import { useAtom } from 'jotai';
import { branchAtom } from 'store/marketingSetupAtom';
import selectedVendors from 'components/restaurantDropdown/selectedVendors';
import Wallet from '../../../assets/images/wallet.svg';
import List from '../../../assets/images/list.svg';
import TooltipIcon from '../../../assets/images/tooltip-ic.svg';

type StateType = {
  title: string;
  content: {
    title: string;
    value: string | number;
    disabled?: boolean;
  }[];
};

type StateBranchType = {
  title: string;
  content: {
    title: string;
    value: string | number;
  }[][];
};

const BudgetStep: FC<{
  setStep: (v: string) => void;
  stateAdverts: StateType;
  setStateAdverts: (v: StateType) => void;
  stateBranch: StateBranchType;
  setStateBranch: (v: StateBranchType) => void;
}> = ({ setStep, stateAdverts, setStateAdverts, stateBranch, setStateBranch }) => {
  const stateTemp = { ...stateAdverts };
  const stateBranchTemp = { ...stateBranch };
  const [branchVendors] = useAtom(branchAtom);
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
    <div className='adverts-step'>
      <div className='adverts-step_top'>
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
                setBudget('total');
                stateTemp.content[0].value = `AED ${e.target.value || 0}`;
                stateBranchTemp.content.forEach((arr, index) => {
                  stateBranchTemp.content[index][2].value = `AED ${
                    index + 1 === stateBranchTemp.content.length
                      ? (
                          Number(e.target.value) -
                          Number(
                            Number(e.target.value / stateBranchTemp.content.length).toFixed(2)
                          ) *
                            (stateBranchTemp.content.length - 1)
                        ).toFixed(2)
                      : parseFloat(
                          Number(e.target.value / stateBranchTemp.content.length).toFixed(2)
                        )
                  }`;
                });
                setStateBranch({ ...stateBranchTemp });
                setStateAdverts({ ...stateTemp });
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
                      setBudget('per');
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
      <div className='adverts-buttons'>
        <ButtonKit
          onClick={() => {
            setStep('recurency');
            stateBranchTemp.content = [
              [
                {
                  title: 'Branch Name',
                  value: '',
                },
                {
                  title: 'Bid',
                  value: '',
                },
                {
                  title: 'Branch budget',
                  value: '',
                },
              ],
            ];
            stateTemp.content[0].value = '';
            setStateAdverts({ ...stateTemp });
            setStateBranch({ ...stateBranchTemp });
          }}
          className='adverts-cancel'
          variant='contained'
        >
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
          className='adverts-continue'
          variant='contained'
        >
          Continue <Arrow />
        </ButtonKit>
      </div>
    </div>
  );
};

export default BudgetStep;
