import { ButtonKit, InputKit, RadioKit, TooltipKit } from 'kits';
import { FC, useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { branchAtom, endingDateAtom, startingDateAtom, timesAtom } from 'store/marketingSetupAtom';
import { getBidRecommendations, triggerAds } from 'api';
import { useUser } from 'contexts';
import selectedVendors from 'components/restaurantDropdown/selectedVendors';
import LodaingButtonKit from 'kits/loadingButton/LoadingButtonKit';
import { format } from 'date-fns';
import { useAlert } from 'hooks';
import Graph from '../../../assets/images/graph.svg';
import Chart from '../../../assets/images/chart.svg';
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
  typeScheduleArr: any;
}> = ({ setStep, stateAdverts, setStateAdverts, stateBranch, setStateBranch, typeScheduleArr }) => {
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
  const user = useUser();
  const [minAverageMax, setMinAverageMax] = useState({
    average_bid: 0,
    high_bid: 0,
    low_bid: 0,
  });
  const getBid = async () => {
    const data = await getBidRecommendations('deliveroo', {
      master_email: user.email,
      access_token: user.token,
      chain_id: String(branchVendors.vendorsObj.deliveroo[0].chain_id),
      chain_drn_id: String(branchVendors.vendorsObj.deliveroo[0].metadata.org_id),
      vendors: branchVendors.vendorsObj.deliveroo,
    });
    setMinAverageMax(data.data);
  };
  useEffect(() => {
    getBid();
  }, []);
  const [loading, setLoading] = useState(false);
  const [startingDate] = useAtom(startingDateAtom);
  const [endingDate] = useAtom(endingDateAtom);
  const [times] = useAtom(timesAtom);
  const { triggerAlertWithMessageError } = useAlert();

  const handleSubmit = async () => {
    setLoading(true);
    await triggerAds('deliveroo', {
      master_email: user.email,
      access_token: user.token,
      chain_id: String(branchVendors.vendorsObj.deliveroo[0].chain_id),
      vendors: branchVendors.vendorsObj.deliveroo,
      bid: Number(stateAdverts.content[3].value.toString().replace('AED ', '')) || 0,
      budget: Number(stateAdverts.content[0].value.toString().replace('AED ', '')) || 0,
      type_schedule: typeScheduleArr.find((obj) => obj.title === stateAdverts.content[2].value)
        .type,
      start_date: format(new Date(startingDate), 'yyyy-MM-dd'),
      end_date: format(new Date(endingDate), 'yyyy-MM-dd'),
      start_hour: [format(new Date(times[0].startTime), 'HH:mm')],
      end_hour: [format(new Date(times[0].endTime), 'HH:mm')],
      chain_drn_id: String(branchVendors.vendorsObj.deliveroo[0].metadata.org_id),
    })
      .then(() => {
        setStep('congrats');
        setLoading(false);
      })
      .catch((error) => {
        triggerAlertWithMessageError(error.message);
        setLoading(false);
      });
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
                  stateBranchTemp.content[index][1].value = `AED ${
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
              value={Number(stateTemp.content[3].value.toString().replace('AED ', '')) || ''}
              type='number'
              placeholder='e.g. AED 20.00'
            />
            <div className='adverts-average'>
              <div>
                <p>AED {minAverageMax.average_bid}</p>
                <span>Average in UAE</span>
              </div>
              <div>
                <p>AED {minAverageMax.low_bid}</p>
                <span>Minimum in UAE</span>
              </div>
              <div>
                <p>AED {minAverageMax.high_bid}</p>
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
                            {
                              title: '',
                              value:
                                Number(a[1].value.toString().replace('AED ', '')) +
                                Number(b[1].value.toString().replace('AED ', '')),
                            },
                            { title: '', value: '' },
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
            stateTemp.content[3].value = '';
            setStateAdverts({ ...stateTemp });
            setStateBranch({ ...stateBranchTemp });
          }}
          className='adverts-cancel'
          variant='contained'
        >
          Back
        </ButtonKit>
        <LodaingButtonKit
          loading={loading}
          onClick={handleSubmit}
          disabled={getDisabled()}
          className='adverts-continue'
          variant='contained'
        >
          Launch
        </LodaingButtonKit>
      </div>
    </div>
  );
};

export default BidingStep;
