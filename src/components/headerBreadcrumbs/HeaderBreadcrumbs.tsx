import BoxKit from '../../kits/box/BoxKit';
import TypographyKit from '../../kits/typography/TypographyKit';
import Breadcrumbs from '../breadcrumbs/Breadcrumbs';

const HeaderBreadcrumbs = ({ heading, links, style }) => (
  <BoxKit sx={{ mb: 5, ...style }}>
    <BoxKit sx={{ display: 'flex', alignItems: 'center' }}>
      <BoxKit sx={{ flexGrow: 1 }}>
        <TypographyKit variant='h4' gutterBottom>
          {heading}
        </TypographyKit>
        <Breadcrumbs links={links} />
      </BoxKit>
    </BoxKit>
  </BoxKit>
);

export default HeaderBreadcrumbs;
