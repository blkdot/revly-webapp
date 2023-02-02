import { Slider } from '@mui/material';
import { pascalCase } from 'change-case';
import { TypographyKit } from 'kits';
import { TbArrowRightCircle } from 'react-icons/tb';

const RangeSelector = (props: any) => {
  const { min, max, label, onChange, values, step } = props;

  return (
    <div>
      <TypographyKit variant='h6'>
        {pascalCase(label)} range selector [{values[0]} <TbArrowRightCircle /> {values[1]}]
      </TypographyKit>
      <Slider
        min={min}
        max={max}
        step={step ?? 1}
        value={values}
        onChange={(_, v) => onChange(v)}
        valueLabelDisplay='auto'
      />
    </div>
  );
};

export default RangeSelector;
