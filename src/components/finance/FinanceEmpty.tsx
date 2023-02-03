import { SkeletonKit, TypographyKit } from 'kits';
import Widget from '../widget/WidgetEmpty';
import './Finance.scss';

const FinanceEmpty = () => (
  <div className='block'>
    <TypographyKit variant='h4'>
      <SkeletonKit height={50} width={500} />
    </TypographyKit>
    <div className='cardsWrapper finance-wrapper'>
      {[1, 2, 3, 4].map((f) => (
        <Widget key={f} />
      ))}
    </div>
  </div>
);

export default FinanceEmpty;
