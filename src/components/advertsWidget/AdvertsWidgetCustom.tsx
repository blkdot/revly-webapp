import { SkeletonKit } from 'kits';
import { FC } from 'react'

const AdvertsWidgetCustom: FC<{
  title: string;
  content: any;
}> = ({ title, content }) => (
  <div className='adverts-widget-custom_wrapper'>
    <p>{title}</p>
    <div className='adverts-widget-custom_content'>
      {content.map((obj) => <div key={obj.title}>
        <p>{obj.title}</p>
        {
          !obj.value ? <SkeletonKit /> : <span>
            {obj.value}
          </span>
        }
      </div>)}
    </div>
  </div>
)

export default AdvertsWidgetCustom