import AudienceIcon from 'assets/images/ic_audience.png';
import SmRuleIcon from 'assets/images/ic_sm-rule.png';
import SpeakerIcon from 'assets/images/ic_speaker.png';
import {
  BoxKit,
  ButtonKit,
  FormControlLabelKit,
  RadioGroupKit,
  RadioKit,
  TypographyKit,
} from 'kits';
import { FC } from 'react';
import { Subtitle } from './components/Subtitle';

const Audience: FC<{
  index: number;
  plat: any;
  targetAudience: any;
  setTargetAudience: any;
  setSmRule: any;
}> = ({ index, plat, targetAudience, setTargetAudience, setSmRule }) => (
  <div className='left-part-middle'>
    {plat === 'deliveroo' ? (
      <TypographyKit variant='h6'>{index}. Select your target audience</TypographyKit>
    ) : (
      ''
    )}
    <Subtitle />
    {plat === 'deliveroo' ? (
      <BoxKit className='left-part-radio under-textfields active'>
        <div className='radio'>
          <div>
            <span>
              <img style={{ filter: 'none' }} src={AudienceIcon} alt='Audience Icon' />
            </span>
            <div>
              <div>Target Audience</div>
            </div>
          </div>
        </div>
        <div>
          <RadioGroupKit
            className='radio-group-day'
            aria-labelledby='demo-radio-buttons-group-label'
            value={targetAudience}
            onChange={(e) => setTargetAudience(e.target.value)}
            name='radio-buttons-group-days'
          >
            {['All customers', 'New customer', 'Deliveroo plus', 'Inactive customers'].map(
              (day) => (
                <div key={day}>
                  <FormControlLabelKit value={day} control={<RadioKit />} />
                  <span>{day}</span>
                </div>
              )
            )}
          </RadioGroupKit>
        </div>
      </BoxKit>
    ) : (
      ''
    )}
    <ButtonKit
      onClick={() => {
        setSmRule(true);
      }}
      className='another-slot remove'
      variant='contained'
    >
      <img src={SmRuleIcon} alt='Sm Rule' />
      Combine with a smart rule
    </ButtonKit>
    <ButtonKit disabled className='another-slot remove' variant='contained'>
      <img src={SpeakerIcon} alt='Speaker' />
      Combine with Ads
    </ButtonKit>
  </div>
);

// eslint-disable-next-line import/prefer-default-export
export const AudienceStep: FC<{
  index: number;
  platform: any;
  platformData: any;
  display: any;
  targetAudience: any;
  setTargetAudience: any;
  setSmRule: any;
}> = ({ index, platform, platformData, display, targetAudience, setTargetAudience, setSmRule }) => {
  if (Object.keys(display).length > 0) {
    if (platform.length < 2) {
      return (
        <Audience
          index={index}
          plat={platform[0]}
          targetAudience={targetAudience}
          setTargetAudience={setTargetAudience}
          setSmRule={setSmRule}
        />
      );
    }
    return (
      <Audience
        index={index}
        plat='deliveroo'
        targetAudience={targetAudience}
        setTargetAudience={setTargetAudience}
        setSmRule={setSmRule}
      />
    );
  }
  return (
    <Audience
      index={index}
      plat={platformData}
      targetAudience={targetAudience}
      setTargetAudience={setTargetAudience}
      setSmRule={setSmRule}
    />
  );
};
