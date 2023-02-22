import { CardKit } from 'kits';
import { FC } from 'react';
import './AdvertsWidget.scss';

const AdvertsWidget: FC<{
  name: string;
  title: string | number | null;
  src?: string;
}> = ({ name, title, src }) => (
  <CardKit className='advert-widget_card'>
    <div>
      {src ? <img src={src} alt={name} /> : ''}
      <p>{name}</p>
    </div>
    <span>{title === null ? '-' : title}</span>
  </CardKit>
);
AdvertsWidget.defaultProps = {
  src: '',
};
export default AdvertsWidget;
