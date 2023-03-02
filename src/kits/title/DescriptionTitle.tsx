import TypographyKit from 'kits/typography/TypographyKit';

import './Title.scss';

const DescriptionTitle: React.FC<{ children: string }> = ({ children }) => (
  <TypographyKit variant='subtitle' className='description-title-kit'>
    {children}
  </TypographyKit>
);

export default DescriptionTitle;
