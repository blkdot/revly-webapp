import React from 'react';
import { Slider } from '@mui/material';
import { pascalCase } from 'change-case';
import { TbArrowRightCircle } from 'react-icons/tb';
import TypographyKit from '../../kits/typography/TypographyKit';

const RangeSelector = (props) => {
  const { min, max, label, onChange, values, step } = props;

  return (
    <div>
      <TypographyKit variant="h6">
        {pascalCase(label)} range selector [{values[0]} <TbArrowRightCircle /> {values[1]}]
      </TypographyKit>
      <Slider
        min={min}
        max={max}
        step={step ?? 1}
        value={values}
        onChange={(_, v) => onChange(v)}
        valueLabelDisplay="auto"
      />
    </div>
  );
};

export default RangeSelector;
