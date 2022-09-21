// TODO: fix all linter problem
import React from 'react';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';

import './Widget.scss';

import TypographyKit from '../../kits/typography/TypographyKit';
import CardContentKit from '../../kits/cardContent/CardContentKit';
import CardKit from '../../kits/card/CardKit';
import PaperKit from '../../kits/paper/PaperKit';
import SkeletonKit from '../../kits/skeleton/SkeletonKit';

const Widget = () => (
  <CardKit className="card_wrapper">
    <CardContentKit>
      <TypographyKit
        component="div"
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <div>
          <TypographyKit
            sx={{ marginBottom: '15px' }}
            variant="subtitle2"
            className="card-typography"
            component="div">
            <SkeletonKit variant="rectangular" width={100} />
          </TypographyKit>
          <TypographyKit variant="h3" className="card-typography">
            <SkeletonKit variant="rectangular" width={100} />
          </TypographyKit>
          <TypographyKit variant="h3" className="card-typography">
            <SkeletonKit variant="rectangular" width={100} />
          </TypographyKit>
        </div>
        <TypographyKit className="card-typography card-icon">
          <SkeletonKit variant="rectangular" width={50} />
          <SkeletonKit variant="rectangular" width={50} />
        </TypographyKit>
      </TypographyKit>
      <div className="card_bottom">
        <PaperKit className="icon-paper">
          <ArrowRightAltIcon />
        </PaperKit>
        <TypographyKit className="card-procent" variant="body2">
          <SkeletonKit variant="rectangular" width={60} />
        </TypographyKit>
        <TypographyKit className="card-week" variant="body3">
          <SkeletonKit variant="rectangular" width={60} />
        </TypographyKit>
      </div>
    </CardContentKit>
  </CardKit>
);

export default Widget;
