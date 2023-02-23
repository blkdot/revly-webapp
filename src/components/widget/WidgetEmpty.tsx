// TODO: fix all linter problem
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import { CardContentKit, CardKit, PaperKit, SkeletonKit, TypographyKit } from 'kits';
import './Widget.scss';

const WidgetEmpty = () => (
  <CardKit className='card_wrapper'>
    <CardContentKit>
      <TypographyKit
        component='div'
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <TypographyKit
            sx={{ marginBottom: '15px' }}
            variant='subtitle2'
            className='card-typography'
            component='div'
          >
            <SkeletonKit variant='rectangular' width={100} />
          </TypographyKit>
          <TypographyKit variant='h3' className='card-typography'>
            <SkeletonKit variant='rectangular' width={100} />
          </TypographyKit>
          <TypographyKit variant='h3' className='card-typography'>
            <SkeletonKit variant='rectangular' width={100} />
          </TypographyKit>
        </div>
      </TypographyKit>
      <div className='card_bottom'>
        <PaperKit className='icon-paper'>
          <ArrowRightAltIcon />
        </PaperKit>
        <TypographyKit className='card-procent' variant='body2'>
          <SkeletonKit variant='rectangular' width={60} />
        </TypographyKit>
        <TypographyKit className='card-week' variant='body3'>
          <SkeletonKit variant='rectangular' width={60} />
        </TypographyKit>
      </div>
    </CardContentKit>
  </CardKit>
);

export default WidgetEmpty;
