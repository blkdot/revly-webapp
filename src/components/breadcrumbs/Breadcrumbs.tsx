import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

import './Breadcrumbs.scss';

import BreadcrumbsKit from '../../kits/breadcrumbs/BreadcrumbsKit';
import BoxKit from '../../kits/box/BoxKit';
import LinkKit from '../../kits/link/LinkKit';
import TypographyKit from '../../kits/typography/TypographyKit';

const Breadcrumbs = ({ links, activeLast = false }) => {
  const currentLink = links[links.length - 1].name;

  const listDefault = links.map((link) => <LinkItem key={link.name} link={link} />);

  const listActiveLast = links.map((link) => {
    if (link.name !== currentLink) {
      return (
        <div key={link.name}>
          <LinkItem link={link} />
        </div>
      );
    }

    return (
      <div key={link.name}>
        <TypographyKit variant="body2" className="breadcrumbs__active-last">
          {currentLink}
        </TypographyKit>
      </div>
    );
  });

  return (
    <BreadcrumbsKit
      className="breadcrumbs"
      separator={<BoxKit component="span" className="breadcrumbs__box" />}
    >
      {activeLast ? listDefault : listActiveLast}
    </BreadcrumbsKit>
  );
};

const LinkItem = ({ link }) => {
  const { href, name, icon } = link;
  return (
    <LinkKit
      key={name}
      variant="body2"
      component={RouterLink}
      to={href || '#'}
      className="breadcrumbs__link"
    >
      {icon && <BoxKit className="breadcrumbs__link-box">{icon}</BoxKit>}
      {name}
    </LinkKit>
  );
};

export default Breadcrumbs;
