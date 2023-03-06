import { Arrow } from 'assets/icons';
import selectedVendors from 'components/restaurantDropdown/selectedVendors';
import { useAtom } from 'jotai';
import { ButtonKit, InputKit, RadioKit, TooltipKit } from 'kits';
import { FC, useState } from 'react';
import { branchAtom } from 'store/marketingSetupAtom';
import Chart from '../../../assets/images/chart.svg';
import Graph from '../../../assets/images/graph.svg';
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

const BidingStep: FC<{
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
      Number(stateTemp.content[3].value.toString().replace('AED ', '')) &&
      stateBranchTemp.content.every((arr) => Number(arr[1].value.toString().replace('AED ', '')))
    ) {
      return false;
    }
    return true;
  };
  const [budget, setBudget] = useState('total');
  const onChange = (e) => {
    setBudget(e.target.value);
    stateBranchTemp.content.forEach((arr, index) => {
      stateBranchTemp.content[index][1].value = 'AED 0';
    });
    stateTemp.content[3].value = 'AED 0';
    setStateBranch({ ...stateBranchTemp });
    setStateAdverts({ ...stateTemp });
  };

  return (
    <div className='adverts-step'>
      <div className='adverts-step_top'>
        <p>4. Setup your advert biding</p>
        <span>Set a biding for each branch</span>
        <div className='advert-total-budget'>
          <div className='advert-title-icon'>
            <span>
              <img src={Graph} alt='Graph' />
            </span>
            <p>Budget usage per Advert</p>
            <TooltipKit
              onClick={(e) => e.stopPropagation()}
              interactive={1}
              id='table-tooltip'
              placement='right'
              arrow
              title='Budget usage per Advert'
            >
              <img className='table-header-tooltip' src={TooltipIcon} alt='tooltip icon' />
            </TooltipKit>
            <div className='adverts-title-radio'>
              <RadioKit checked={budget === 'total'} value='total' onChange={onChange} />
            </div>
          </div>
          <div className='advert-input biding'>
            <InputKit
              onChange={(e) => {
                setBudget('total');
                stateTemp.content[3].value = `AED ${e.target.value || 0}`;
                stateBranchTemp.content.forEach((arr, index) => {
                  stateBranchTemp.content[index][1].value = `AED ${parseFloat(
                    Number(e.target.value / stateBranchTemp.content.length).toFixed(2)
                  )}`;
                });
                setStateBranch({ ...stateBranchTemp });
                setStateAdverts({ ...stateTemp });
              }}
              value={Number(stateTemp.content[3].value.toString().replace('AED ', '')) || ''}
              type='number'
              placeholder='e.g. AED 20.00'
            />
            <div className='adverts-average'>
              <div>
                <p>AED 2.40</p>
                <span>Average in UAE</span>
              </div>
              <div>
                <p>AED 1.40</p>
                <span>Minimum in UAE</span>
              </div>
              <div>
                <p>AED 3.40</p>
                <span>Maximum in UAE</span>
              </div>
            </div>
          </div>
        </div>
        <div className='advert-budget-usage'>
          <div className='advert-title-icon'>
            <span>
              <img className='no-filter' src={Chart} alt='Chart' />
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
                      stateBranchTemp.content[index][1].value = `AED ${e.target.value || 0}`;
                      const value = Number(
                        stateBranchTemp.content
                          .reduce((a, b) => [
                            { title: '', value: '' },
                            { title: '', value: '' },
                            {
                              title: '',
                              value:
                                Number(a[1].value.toString().replace('AED ', '')) +
                                Number(b[1].value.toString().replace('AED ', '')),
                            },
                          ])[1]
                          .value.toString()
                          .replace('AED ', '')
                      );
                      stateTemp.content[3].value = `AED ${value}`;
                      setStateBranch({ ...stateBranchTemp });
                      setStateAdverts({ ...stateTemp });
                    }}
                    value={
                      Number(
                        stateBranchTemp.content[index][1].value.toString().replace('AED ', '')
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
            setStep('budget');
            stateBranchTemp.content.forEach((arr, index) => {
              stateBranchTemp.content[index][1].value = '';
            });
            setStateBranch({ ...stateBranchTemp });
          }}
          className='adverts-cancel'
          variant='contained'
        >
          Back
        </ButtonKit>
        <ButtonKit
          onClick={() => {
            setStep('congrats');
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

export default BidingStep;
