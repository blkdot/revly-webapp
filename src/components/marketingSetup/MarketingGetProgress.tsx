/* eslint-disable react-hooks/exhaustive-deps */
import { addDays, isAfter, isSameDay } from 'date-fns';
import { useMarketingSetup } from 'hooks';
import {
  platformAtom,
  selectedAtom,
  linkAtom,
  menuAtom,
  discountPercentageAtom,
  minOrderPercentageAtom,
  durationAtom,
  categoryDataListAtom,
  branchAtom,
  categoryDataAtom,
  startingDateAtom,
  endingDateAtom,
  typeScheduleAtom,
  customisedDayAtom,
  timesAtom,
  everyWeekAtom,
  itemMenuAtom,
  categoryAtom,
  filteredCategoryDataAtom,
  targetAudienceAtom,
  checkedAtom,
  categoryLoadingAtom,
  smRuleAtom,
  categorySearchAtom,
  disabledDateAtom,
  heatmapDataAtom,
  maxOrderPercentageAtom,
} from 'store/marketingSetupAtom';
import { useAtom } from 'jotai';
import { FC, useEffect, useState, ChangeEvent } from 'react';
import { vendorsAtom } from '../../store/vendorsAtom';
import { AudienceStep } from './getProgress/steps/AudienceStep';
import { DiscountedItemsStep } from './getProgress/steps/DiscountedItemsStep';
import { DurationStep } from './getProgress/steps/DurationStep';
import { PlatformStep } from './getProgress/steps/PlatformStep';
import { RecurrenceStep } from './getProgress/steps/RecurrenceStep';
import { TypeStep } from './getProgress/steps/TypeStep';
import './MarketingSetup.scss';

const GetProgress: FC = () => {
  const [platform, setPlatform] = useAtom(platformAtom);
  const [selected] = useAtom(selectedAtom);
  const [links] = useAtom(linkAtom);
  const [menu, setMenu] = useAtom(menuAtom);
  const [discountPercentage, setDiscountPercentage] = useAtom(discountPercentageAtom);
  const [minOrder, setMinOrder] = useAtom(minOrderPercentageAtom);
  const [maxOrder, setMaxOrder] = useAtom(maxOrderPercentageAtom);
  const [duration, setDuration] = useAtom(durationAtom);
  const [categoryDataList] = useAtom(categoryDataListAtom);
  const [categoryData, setCategoryData] = useAtom(categoryDataAtom);
  const [startingDate, setStartingDate] = useAtom(startingDateAtom);
  const [endingDate, setEndingDate] = useAtom(endingDateAtom);
  const [typeSchedule, setTypeSchedule] = useAtom(typeScheduleAtom);
  const [branch, setBranch] = useAtom(branchAtom);
  const [customisedDay, setCustomisedDay] = useAtom(customisedDayAtom);
  const [everyWeek, setEveryWeek] = useAtom(everyWeekAtom);
  const [itemMenu, setItemMenu] = useAtom(itemMenuAtom);
  const [category] = useAtom(categoryAtom);
  const [filteredCategoryData, setFilteredCategoryData] = useAtom(filteredCategoryDataAtom);
  const [targetAudience, setTargetAudience] = useAtom(targetAudienceAtom);
  const [times, setTimes] = useAtom(timesAtom);
  const [categorySearch, setCategorySearch] = useAtom(categorySearchAtom);
  const [, setDisabledDate] = useAtom(disabledDateAtom);
  const [heatmapData, setHeatmapData] = useAtom(heatmapDataAtom);

  const [, setSmRule] = useAtom(smRuleAtom);
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const [checked, setChecked] = useAtom(checkedAtom);
  const [categoryLoading] = useAtom(categoryLoadingAtom);

  const [vendors] = useAtom(vendorsAtom);
  const { display } = vendors;

  const { getDiscountMovType, disableWeekends } = useMarketingSetup();

  const [menuChanged, setMenuChanged] = useState('');

  useEffect(() => {
    if (!isAfter(endingDate, startingDate) && !isSameDay(endingDate, startingDate)) {
      setEndingDate(new Date(addDays(startingDate, 1)));
    }
  }, [startingDate, endingDate]);

  const getPlatform = (e) => {
    const { value, checked: checkedRadio } = e.target;

    if (platform.length > 1) {
      if (!checkedRadio) {
        platform.splice(
          platform.findIndex((el) => el === value),
          1
        );
      }
    }

    if (checkedRadio) {
      setPlatform([...platform, value]);
      return;
    }

    setPlatform([...platform]);
  };

  const getWorkWeek = () => {
    if (typeSchedule === 'Work Week') {
      // checking if endingDate eqaul sunday we put monday
      if (new Date(endingDate).getDay() === 0) {
        return new Date(addDays(endingDate, 1));
      }
      // checking if endingDate eqaul saturday we put monday
      if (new Date(endingDate).getDay() === 6) {
        return new Date(addDays(endingDate, 2));
      }
      return endingDate;
    }
    return endingDate;
  };

  const isEndingLimited = () => {
    if (isSameDay(new Date(endingDate), new Date(startingDate))) {
      return true;
    }

    return typeSchedule !== 'Continues Offer' && duration === 'Program the offer duration';
  };

  const handleCategoryDataChange = (e: ChangeEvent<HTMLFormElement>) => {
    const { value } = e.target;
    if (value.length > 0) {
      const arr = value
        .map((v) => category.filter((k) => k.category_name === v || k.category === v))
        .flat();
      if (categorySearch) {
        const filtered = arr.filter((obj) =>
          (obj.name || obj.item_name).toLowerCase().includes(categorySearch.toLowerCase())
        );
        setFilteredCategoryData(filtered);
      } else {
        setFilteredCategoryData(arr);
      }
    } else {
      setFilteredCategoryData([]);
    }
    setCategoryData(value);
  };

  const getMenuActive = () => {
    if (category === null) {
      return true;
    }
    if (Object.keys(display).length === 0) {
      return category.length === 0;
    }
    if (platform.length < 2) {
      return category.length === 0;
    }
    return false;
  };

  const onChange = (newValue, setDate) => {
    setDate(newValue);
    const date = document.querySelectorAll('.date-error');
    const arr = [];
    date.forEach((el) => arr.push(el.children[0].classList.contains('Mui-error')));
    setDisabledDate(arr.every((bool) => bool === false));
  };

  useEffect(() => {
    if (selected === 2) {
      setDiscountPercentage('');
      setMinOrder('');
      setMaxOrder('');
    }
    setMenuChanged(menu);
  }, [menu, itemMenu]);

  if (selected === 1 && branch) {
    return (
      <PlatformStep
        index={selected}
        branch={branch}
        getPlatform={getPlatform}
        platform={platform}
      />
    );
  }
  if (selected === 2) {
    return (
      <TypeStep
        index={selected}
        menu={menu}
        setMenu={setMenu}
        itemMenu={itemMenu}
        discountPercentage={discountPercentage}
        setDiscountPercentage={setDiscountPercentage}
        platform={platform}
        minOrder={minOrder}
        maxOrder={maxOrder}
        setMinOrder={setMinOrder}
        setMaxOrder={setMaxOrder}
        setItemMenu={setItemMenu}
        getDiscountMovType={getDiscountMovType}
        menuChanged={menuChanged}
        getMenuActive={getMenuActive}
        categoryLoading={categoryLoading}
      />
    );
  }
  if (menu === 'Offer on An Item from the Menu') {
    if (selected === 3) {
      return (
        <DiscountedItemsStep
          index={selected}
          checked={checked}
          setChecked={setChecked}
          itemMenu={itemMenu}
          categorySearch={categorySearch}
          handleCategoryDataChange={handleCategoryDataChange}
          categoryDataList={categoryDataList}
          categoryData={categoryData}
          filteredCategoryData={filteredCategoryData}
          menuChanged={menuChanged}
          category={category}
          setCategorySearch={setCategorySearch}
          setFilteredCategoryData={setFilteredCategoryData}
          platform={platform}
        />
      );
    }
    if (selected === 4) {
      return (
        <DurationStep
          index={selected}
          duration={duration}
          setDuration={setDuration}
          endingDate={endingDate}
          setEndingDate={setEndingDate}
          onChange={onChange}
          typeSchedule={typeSchedule}
          setTypeSchedule={setTypeSchedule}
          times={times}
          setTimes={setTimes}
          isEndingLimited={isEndingLimited}
        />
      );
    }
    if (duration === 'Starting Now') {
      if (selected === 5) {
        return (
          <AudienceStep
            index={selected}
            platform={platform}
            targetAudience={targetAudience}
            setTargetAudience={setTargetAudience}
            setSmRule={setSmRule}
          />
        );
      }
    }
    if (duration === 'Program the offer duration') {
      if (selected === 5) {
        if (typeSchedule) {
          return (
            <RecurrenceStep
              index={selected}
              typeSchedule={typeSchedule}
              everyWeek={everyWeek}
              setEveryWeek={setEveryWeek}
              days={days}
              customisedDay={customisedDay}
              setCustomisedDay={setCustomisedDay}
              times={times}
              setTimes={setTimes}
              disableWeekends={disableWeekends}
              startingDate={startingDate}
              setStartingDate={setStartingDate}
              onChange={onChange}
              getWorkWeek={getWorkWeek}
              setEndingDate={setEndingDate}
              isEndingLimited={isEndingLimited}
              heatmapData={heatmapData}
              setHeatmapData={setHeatmapData}
              links={links}
            />
          );
        }
      }
      if (selected === 6) {
        return (
          <AudienceStep
            index={selected}
            platform={platform}
            targetAudience={targetAudience}
            setTargetAudience={setTargetAudience}
            setSmRule={setSmRule}
          />
        );
      }
    }
  }
  if (menu === 'Offer on the whole Menu') {
    if (selected === 3) {
      return (
        <DurationStep
          index={selected}
          duration={duration}
          setDuration={setDuration}
          endingDate={endingDate}
          setEndingDate={setEndingDate}
          onChange={onChange}
          typeSchedule={typeSchedule}
          setTypeSchedule={setTypeSchedule}
          times={times}
          setTimes={setTimes}
          isEndingLimited={isEndingLimited}
        />
      );
    }
    if (duration === 'Starting Now') {
      if (selected === 4) {
        return (
          <AudienceStep
            index={selected}
            platform={platform}
            targetAudience={targetAudience}
            setTargetAudience={setTargetAudience}
            setSmRule={setSmRule}
          />
        );
      }
    }
    if (duration === 'Program the offer duration') {
      if (selected === 4) {
        if (typeSchedule) {
          return (
            <RecurrenceStep
              index={selected}
              typeSchedule={typeSchedule}
              everyWeek={everyWeek}
              setEveryWeek={setEveryWeek}
              days={days}
              customisedDay={customisedDay}
              setCustomisedDay={setCustomisedDay}
              times={times}
              setTimes={setTimes}
              disableWeekends={disableWeekends}
              startingDate={startingDate}
              setStartingDate={setStartingDate}
              onChange={onChange}
              getWorkWeek={getWorkWeek}
              setEndingDate={setEndingDate}
              isEndingLimited={isEndingLimited}
              heatmapData={heatmapData}
              setHeatmapData={setHeatmapData}
              links={links}
            />
          );
        }
      }
      if (selected === 5) {
        return (
          <AudienceStep
            index={selected}
            platform={platform}
            targetAudience={targetAudience}
            setTargetAudience={setTargetAudience}
            setSmRule={setSmRule}
          />
        );
      }
    }
  }

  return null;
};

export default GetProgress;
