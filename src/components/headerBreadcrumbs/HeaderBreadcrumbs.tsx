import { BoxKit, TypographyKit } from 'kits';
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
