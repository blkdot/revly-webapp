// TODO: fix all linter problem
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import CardKit from '../../kits/card/CardKit';
import CardContentKit from '../../kits/cardContent/CardContentKit';
import PaperKit from '../../kits/paper/PaperKit';
import SkeletonKit from '../../kits/skeleton/SkeletonKit';
import TypographyKit from '../../kits/typography/TypographyKit';
import './Widget.scss';

const Widget = () => (
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

export default Widget;
