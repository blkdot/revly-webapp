import { BoxKit, TypographyKit } from 'kits';
import { FC, ReactNode, useEffect } from 'react';
import Arrow from '../../../assets/images/arrow.svg';

const TableLink: FC<{
  links: { link: string; title: string; tooltip?: string }[];
  link: string;
  filters: ReactNode;
  setLink: (v: string) => void;
  setOpenedFilter: (v: boolean) => void;
}> = ({ links, setLink, link, filters, setOpenedFilter }) => {
  const getActiveLinkWidth = (index: number, type: string) => {
    const tableLink = document.querySelectorAll('.table-link')[index] as HTMLElement;
    tableLink.scrollIntoView();
    if (type === 'scroll') {
      return tableLink.offsetLeft - tableLink.scrollLeft;
    }
    return tableLink?.clientWidth;
  };
  const changeLink = (name: string, index: number) => {
    setLink(name);
    const tableLinks = document.querySelector('.table-links') as HTMLElement;
    tableLinks?.style.setProperty('--length', `${getActiveLinkWidth(index, 'width')}px`);
    tableLinks?.style.setProperty('--left', `${getActiveLinkWidth(index, 'scroll')}px`);
  };
  useEffect(() => {
    const tableLinks = document.querySelector('.table-links') as HTMLElement;
    tableLinks?.style.setProperty('--length', `${getActiveLinkWidth(links.findIndex((obj) => obj.link === link), 'width')}px`);
    tableLinks?.style.setProperty('--left', `${getActiveLinkWidth(links.findIndex((obj) => obj.link === link), 'scroll')}px`);
  }, []);
  return (
    <div className='table-paper-top'>
      <div style={{ display: 'flex' }}>
        <BoxKit className='table-links'>
          {links.map((obj: { title: string; link: string }, index: number) => (
            <TypographyKit
              key={obj.link}
              className={`table-link ${link === obj.link && 'active'}`}
              onClick={() => changeLink(obj.link, index)}
            >
              {obj.title}
            </TypographyKit>
          ))}
        </BoxKit>
        <BoxKit className='table-arrow-links'>
          <img
            tabIndex={-1}
            role='presentation'
            className={
              links.findIndex((obj: { title: string; link: string }) => link === obj.link) > 0
                ? 'active'
                : ''
            }
            onClick={() =>
              changeLink(
                links[
                  links.findIndex((obj: { title: string; link: string }) => link === obj.link) - 1
                ].link,
                links.findIndex((obj: { title: string; link: string }) => link === obj.link) - 1
              )
            }
            src={Arrow}
            alt='left-arrow'
          />
          <img
            tabIndex={-1}
            role='presentation'
            className={
              links.findIndex((obj: { title: string; link: string }) => link === obj.link) <
              links.length - 1
                ? 'active'
                : ''
            }
            onClick={() =>
              changeLink(
                links[
                  links.findIndex((obj: { title: string; link: string }) => link === obj.link) + 1
                ].link,
                links.findIndex((obj: { title: string; link: string }) => link === obj.link) + 1
              )
            }
            src={Arrow}
            alt='right-arrow'
          />
        </BoxKit>
      </div>
      {filters ? (
        <BoxKit onClick={() => setOpenedFilter(true)} className='table-filter'>
          <span />
          <p>Filters</p>
        </BoxKit>
      ) : (
        ''
      )}
    </div>
  );
};

export default TableLink;
