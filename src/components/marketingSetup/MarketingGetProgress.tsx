import { addDays, isAfter, isSameDay } from 'date-fns';
import { useAtom } from 'jotai';
import { FormControlLabelKit, RadioKit, SpinnerKit } from 'kits';
import { FC, useEffect, useState } from 'react';
import { vendorsAtom } from '../../store/vendorsAtom';
import { AudienceStep } from './getProgress/steps/AudienceStep';
import { DiscountedItemsStep } from './getProgress/steps/DiscountedItemsStep';
import { DurationStep } from './getProgress/steps/DurationStep';
import { PlatformStep } from './getProgress/steps/PlatformStep';
import { RecurrenceStep } from './getProgress/steps/RecurrenceStep';
import { TypeStep } from './getProgress/steps/TypeStep';
import './MarketingSetup.scss';

const GetProgress: FC<{
  progressData: any;
}> = ({ progressData }) => {
  const {
    selected,
    getPlatform,
    platform,
    handleCategoryDataChange,
    setBranch,
    branch,
    menu,
    setMenu,
    setDiscountPercentage,
    discountPercentage,
    setMinOrder,
    minOrder,
    itemMenu,
    setItemMenu,
    getDiscountMovType,
    categoryData,
    categoryDataList,
    filteredCategoryData,
    setFilteredCategoryData,
    category,
    setChecked,
    checked,
    duration,
    setDuration,
    endingDate,
    onChange,
    setEndingDate,
    times,
    setTimes,
    typeSchedule,
    setTypeSchedule,
    targetAudience,
    setTargetAudience,
    setEveryWeek,
    everyWeek,
    days,
    setCustomisedDay,
    customisedDay,
    disableWeekends,
    startingDate,
    setStartingDate,
    setSmRule,
    setHeatmapData,
    heatmapData,
    links,
    categoryLoading,
    setCategorySearch,
    categorySearch,
  } = progressData;

  useEffect(() => {
    if (!isAfter(endingDate, startingDate) && !isSameDay(endingDate, startingDate)) {
      setEndingDate(new Date(addDays(startingDate, 1)));
    }
  }, [startingDate, endingDate]);

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
  const [vendors] = useAtom(vendorsAtom);
  const { display } = vendors;

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

  const [menuChanged, setMenuChanged] = useState('');

  useEffect(() => {
    if (selected === 2) {
      setDiscountPercentage('');
      setMinOrder('');
    }
    setMenuChanged(menu);
  }, [menu, itemMenu]);

  if (selected === 1) {
    return (
      <PlatformStep
        index={selected}
        branch={branch}
        getPlatform={getPlatform}
        setBranch={setBranch}
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
        setMinOrder={setMinOrder}
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
};

export default GetProgress;
