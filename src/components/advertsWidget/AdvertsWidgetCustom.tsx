import { FC, ReactNode } from 'react';

const AdvertsWidgetCustom: FC<{
  title: string;
  content: ReactNode;
}> = ({ title, content }) => (
  <div className='adverts-widget-custom_wrapper'>
    <p>{title}</p>
    {content}
  </div>
);

export default AdvertsWidgetCustom;
