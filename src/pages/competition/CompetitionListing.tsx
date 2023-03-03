import { pascalCase } from 'change-case';
import Competitor from 'components/competitor/Competitor';
import FilterBranch from 'components/filter/filterBranch/FilterBranch';
import FilterDropdown from 'components/filter/filterDropdown/FilterDropdown';
import useTableContentFormatter from 'components/tableRevly/tableContentFormatter/useTableContentFormatter';
import TableRevlyNew from 'components/tableRevly/TableRevlyNew';
import { useDates, useUser } from 'contexts';
import { platformObject } from 'data/platformList';
import { useAlert, useApi, useVendors } from 'hooks';
import { useAtom } from 'jotai';
import { ContainerKit, PaperKit } from 'kits';
import DescriptionTitle from 'kits/title/DescriptionTitle'; // TODO: add to kits export
import MainTitle from 'kits/title/MainTitle'; // TODO: add to kits export
import { useCallback, useEffect, useMemo, useState } from 'react';
import AreaIcon from '../../assets/images/area.svg';
import Columns from '../../assets/images/columns.svg';
import Iccuisine from '../../assets/images/ic_cuisine.png';
import TimeSlotIcon from '../../assets/images/ic_timeslot.png';
import TooltipIcon from '../../assets/images/tooltip-ic.svg';
import './Competition.scss';
import {
  competitionBranchSelectedAtom,
  competitionSelectedPlatformAtom,
} from './CompetitionStoreAtom';

let fnDelays = null;
let fnDelaysDropdown = null;

const timeSlotObj = {
  'Throughout Day': 'Throughout Day',
  'Breakfast (04:00 - 11:00)': 'Breakfast',
  'Lunch (11:00 - 14:00)': 'Lunch',
  'Interpeak (14:00 - 17:00)': 'Interpeak',
  'Dinner (17:00 - 00:00)': 'Dinner',
  'Late night (00:00 - 04:00)': 'Late Night',
};

const headersAlert = (cuisine: string) => [
  {
    id: 'name',
    numeric: false,
    disablePadding: true,
    label: 'Competitor',
  },
  {
    id: 'discount_type',
    numeric: false,
    disablePadding: true,
    label: 'Listing in "Offers"',
  },
  {
    id: 'cuisine',
    numeric: false,
    disablePadding: true,
    label: `Listing in "${cuisine ? `${cuisine} Cuisine` : 'Cuisine'}"`,
  },
  {
    id: 'cuisine_and_discount_type',
    numeric: false,
    disablePadding: true,
    label: `Listing in "Offers"x"${cuisine ? `${cuisine} Cuisine` : 'Cuisine'}"`,
  },
];

const CompetitionListing = () => {
  const { current } = useDates();
  const { vendors } = useVendors();
  const { chainData } = vendors;
  const user = useUser();
  const [opened, setOpened] = useState(false);
  const [loading, setLoading] = useState(false);
  const [competitionListingData, setCompetitionListingData] = useState([]);
  const { triggerAlertWithMessageError } = useAlert();
  const [queueDropdown, setQueueDropdown] = useState(0);
  const { getRanking, getAreas, getCuisines } = useApi();
  const [areasData, setAreasData] = useState([]);
  const [cuisinesData, setCuisinesData] = useState([]);

  // New filter part
  const [selectedPlatform, setSelectedPlatform] = useAtom(competitionSelectedPlatformAtom);
  const [branchSelected, setBranchSelected] = useAtom(competitionBranchSelectedAtom);
  const [selectedCuisine, setSelectedCuisine] = useState([]);
  const [selectedArea, setSelectedArea] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState([]);

  const branchActive = useMemo(
    () =>
      chainData.find(
        (chain) => chain.vendor_id === branchSelected[0] && chain.platform === selectedPlatform[0]
      ),
    [branchSelected[0], selectedPlatform[0]]
  );

  const Open = () => {
    setOpened(!opened);
    const body = document.querySelector('body');
    if (opened) {
      body.style.overflowY = 'visible';
    } else {
      body.style.overflowY = 'hidden';
    }
  };

  const { renderSimpleRow, renderOrdinalSuffixV3, renderSimpleRowSkeleton } =
    useTableContentFormatter();

  const cellTemplatesObject = {
    name: renderSimpleRow,
    cuisine: renderOrdinalSuffixV3,
    discount_type: renderOrdinalSuffixV3,
    cuisine_and_discount_type: renderOrdinalSuffixV3,
  };

  const renderRowsByHeader = (r) =>
    headersAlert(selectedCuisine[0]).reduce(
      (acc, cur) => ({
        ...acc,
        [cur.id]: cellTemplatesObject?.[cur.id] ? cellTemplatesObject[cur.id](r, cur) : r[cur.id],
        id: r.id,
        data: r,
      }),
      {}
    );

  const cellTemplatesObjectLoading = {
    name: renderSimpleRowSkeleton,
    cuisine: renderSimpleRowSkeleton,
    discount_type: renderSimpleRowSkeleton,
    cuisine_and_discount_type: renderSimpleRowSkeleton,
  };

  const renderRowsByHeaderLoading = (r) =>
    headersAlert(selectedCuisine[0]).reduce(
      (acc, cur) => ({
        ...acc,
        [cur.id]: cellTemplatesObjectLoading[cur.id](cur),
        id: r,
      }),
      {}
    );

  useEffect(() => {
    setSelectedTimeSlot((prev) => (selectedArea[0] === 'Everywhere' ? ['Throughout Day'] : prev));
  }, [selectedArea]);

  useEffect(() => {
    if (!branchSelected[0] && selectedPlatform[0]) {
      const chainDefault = chainData.find((chain) => chain.platform === selectedPlatform[0]);

      if (!chainDefault) {
        setBranchSelected([]);
        return;
      }

      setBranchSelected([String(chainDefault.vendor_id)]);
    }
  }, [chainData, selectedPlatform[0]]);

  const getData = (plat, vend, newCuisine, newArea) => {
    clearTimeout(fnDelays);

    if (!newCuisine) throw new Error();

    fnDelays = setTimeout(async () => {
      setLoading(true);
      try {
        const body = {
          master_email: user.email,
          access_token: user.token,
          vendors: vend || [],
          day_period: timeSlotObj[selectedTimeSlot[0]] || 'All',
          filter_location: newArea,
          filter_offer: 'all_discounts',
          filter_cuisine: newCuisine || '',
          start_date: current.from.format('YYYY-MM-DD'),
          end_date: current.until.format('YYYY-MM-DD'),
        };

        const ranking = await getRanking(body, plat);

        if (!ranking) {
          throw new Error('');
        }

        setCompetitionListingData(ranking.data.data);
        setLoading(false);
      } catch (err) {
        setCompetitionListingData([]);
        setLoading(false);
        triggerAlertWithMessageError('Error while retrieving data');
      }
    }, 250);
  };

  const handleCuisineDataResponse = (cuisines: string[]) => {
    setCuisinesData(cuisines?.sort() || []);

    if (!cuisines || cuisines.length === 0) {
      setSelectedCuisine([]);
      setCuisinesData([]);
      return '';
    }

    setSelectedCuisine([cuisines[0]]);

    return cuisines[0] || '';
  };

  const handleAreasDataResponse = (areas) => {
    setAreasData(areas?.sort());
    setSelectedTimeSlot(['Throughout Day']);

    if (!areas) {
      setSelectedArea(['Everywhere']);
      return 'Everywhere';
    }

    setSelectedArea([areas[0]] || ['Everywhere']);

    setAreasData((prev) => {
      const arr = [...prev];

      const relocateFrom = prev.indexOf('Everywhere');

      const element = arr.splice(relocateFrom, 1)[0];

      arr.splice(0, 0, element);

      return arr;
    });
    return areas[0] || 'Everywhere';
  };

  const getCuisineAndAreas = useCallback(
    async (plat, vend, stack) => {
      clearTimeout(fnDelaysDropdown);

      if (vend && vend?.length === 0) {
        return;
      }

      if (loading) {
        setQueueDropdown((prev) => prev + 1);
        return;
      }

      fnDelaysDropdown = setTimeout(async () => {
        setLoading(true);

        const body = {
          master_email: user.email,
          access_token: user.token,
          vendors: vend || [],
          start_date: current.from.format('YYYY-MM-DD'),
          end_date: current.until.format('YYYY-MM-DD'),
        };

        Promise.all([getCuisines(body, plat), getAreas(body, plat)])
          .then(([cuisineResult, areaResult]) => ({
            cuisines: cuisineResult?.data?.cuisines,
            areas: areaResult?.data?.locations,
          }))
          .then(({ cuisines, areas }) => {
            const newCuisine = handleCuisineDataResponse(cuisines);
            const newArea = handleAreasDataResponse(areas);

            if (stack === queueDropdown) setQueueDropdown(0);

            return { newCuisine, newArea };
          })
          .then(({ newCuisine, newArea }) => {
            getData(selectedPlatform[0], vend, newCuisine, newArea);
          })
          .catch((err) => {
            setLoading(false);
            triggerAlertWithMessageError(err.message);
            setAreasData([]);
            setSelectedCuisine([]);
            setCuisinesData([]);
            setSelectedTimeSlot([]);
            setSelectedArea([]);
          });
      }, 750);
    },
    [selectedPlatform[0]]
  );

  useEffect(() => {
    if (
      selectedPlatform[0] &&
      selectedArea[0] &&
      selectedTimeSlot[0] &&
      selectedCuisine[0] &&
      branchSelected[0]
    ) {
      if (!branchActive) {
        if (chainData.length > 0) {
          const localBranch = chainData.find(
            (chain) =>
              chain.vendor_id === branchSelected[0] && chain.platform === selectedPlatform[0]
          );

          if (!localBranch) {
            setBranchSelected([]);
            return;
          }

          getData(selectedPlatform[0], [localBranch.data], selectedCuisine[0], selectedArea[0]);
        }

        return;
      }

      getData(selectedPlatform[0], [branchActive.data], selectedCuisine[0], selectedArea[0]);
    }
  }, [selectedArea, selectedTimeSlot, selectedCuisine]);

  useEffect(() => {
    if (selectedPlatform[0] && branchSelected[0]) {
      if (!branchActive) {
        if (chainData.length > 0) {
          const localBranch = chainData.find(
            (chain) =>
              chain.vendor_id === branchSelected[0] && chain.platform === selectedPlatform[0]
          );

          if (!localBranch) {
            setBranchSelected([]);
            return;
          }

          getCuisineAndAreas(selectedPlatform[0], [localBranch.data], queueDropdown);
        }

        return;
      }

      getCuisineAndAreas(selectedPlatform[0], [branchActive.data], queueDropdown);
    }
  }, [selectedPlatform, branchSelected, queueDropdown, chainData.length, branchActive]);

  const renderPlatformInsideFilter = (s) => (
    <div key={s}>
      <img src={platformObject[s].src} alt={s} width={30} style={{ verticalAlign: 'middle' }} />
      <span style={{ verticalAlign: 'middle' }}>{pascalCase(s)}</span>
    </div>
  );

  return (
    <div className='wrapper'>
      <ContainerKit>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <MainTitle>Competition - Listing</MainTitle>
            <DescriptionTitle>
              Stay one step ahead of the game by tracking your listing and visibility against your
              competitors.
            </DescriptionTitle>
          </div>
          <div style={{ marginTop: '2rem' }}>
            <Competitor platformList={['deliveroo', 'talabat']} open={Open} opened={opened} />
          </div>
        </div>
        <PaperKit className='competition-paper'>
          <div className='competition-top-input'>
            <div className='dropdowns'>
              <FilterDropdown
                items={[
                  { text: renderPlatformInsideFilter('deliveroo'), value: 'deliveroo' },
                  { text: renderPlatformInsideFilter('talabat'), value: 'talabat' },
                ]}
                values={selectedPlatform}
                onChange={(v) => setSelectedPlatform([v])}
                label='Show all platforms'
                icon={<img src={Columns} alt='Platform' />}
                internalIconOnActive={platformObject}
                maxShowned={1}
                mono
              />
              <FilterBranch
                items={chainData.filter(
                  (chainD) => chainD.platform === selectedPlatform[0] && chainD.is_active
                )}
                values={branchSelected}
                onChange={(v) => setBranchSelected([v])}
                icon={<img src={Columns} alt='Platform' />}
                label='Show all branches'
              />
              <FilterDropdown
                items={
                  cuisinesData.length > 0
                    ? cuisinesData.map((cuisineItem) => ({ value: cuisineItem, text: cuisineItem }))
                    : [{ value: '—', text: '—' }]
                }
                values={selectedCuisine}
                onChange={(v) => setSelectedCuisine([v])}
                label='Show all cuisines'
                maxShowned={1}
                disabled={cuisinesData.length < 1}
                icon={<img src={Iccuisine} alt='Platform' />}
                mono
              />
              <FilterDropdown
                items={
                  areasData.length > 0
                    ? areasData.map((areaItem) => ({ value: areaItem, text: areaItem }))
                    : [{ value: 'Everywhere', text: 'Everywhere' }]
                }
                values={selectedArea}
                onChange={(v) => setSelectedArea([v])}
                label='Show all areas'
                maxShowned={1}
                icon={<img src={AreaIcon} alt='Area' />}
                mono
              />
              <FilterDropdown
                items={
                  selectedArea[0] === 'Everywhere'
                    ? [{ value: 'Throughout Day', text: 'Throughout Day' }]
                    : Object.keys(timeSlotObj).map((timeslot) => ({
                        value: timeslot,
                        text: timeSlotObj[timeslot],
                      }))
                }
                values={selectedTimeSlot}
                onChange={(v) => setSelectedTimeSlot([v])}
                label='Show all slots'
                maxShowned={1}
                icon={<img src={TimeSlotIcon} alt='Slot' />}
                disabled={selectedArea.length < 1}
                mono
              />
            </div>
          </div>
          <div className='competition-tooltip-wrapper'>
            <img src={TooltipIcon} alt='tooltip icon' className='competition-tooltip ' />
            &nbsp;filter by area to be able to select a specific time slot
          </div>
          <TableRevlyNew
            renderCustomSkelton={[0, 1, 2, 3, 4].map(renderRowsByHeaderLoading)}
            isLoading={loading}
            headers={headersAlert(selectedCuisine[0])}
            rows={competitionListingData.map(renderRowsByHeader)}
            className='competition-alerts'
            mainFieldOrdered='name'
            mainOrder='desc'
          />
        </PaperKit>
      </ContainerKit>
    </div>
  );
};

export default CompetitionListing;
