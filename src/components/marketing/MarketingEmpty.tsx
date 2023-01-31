import Widget from '../widget/WidgetEmpty';
import './Marketing.scss';

const MarketingEmpty = () => (
  <div className='block'>
    <div className='cardsWrapper marketing'>
      {[1, 2].map((f) => (
        <Widget key={f} />
      ))}
    </div>
  </div>
);

export default MarketingEmpty;
