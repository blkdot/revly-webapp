import { BoxKit, TypographyKit, PaperKit, ButtonKit } from 'kits';
import { FC, ReactNode, useEffect, useState } from 'react';
import Arrow from '../../assets/images/arrow.svg';
import CalendarViewIcon from '../../assets/images/calendar_view.svg';
import TableViewIcon from '../../assets/images/table_view.svg';
import './LinkRevly.scss';

const TableLink: FC<{
  viewType?: string;
  links: { link: string; title: string; tooltip?: string }[];
  link: string;
  filters: ReactNode;
  setViewType?: (v: string) => void;
  setLink: (v: string) => void;
  setOpenedFilter: (v: boolean) => void;
}> = ({ viewType, setViewType, links, setLink, link, filters, setOpenedFilter }) => {
  const getActiveLinkWidth = (index: number, type: string) => {
    const tableLink = document.querySelectorAll('.table-link')[index] as HTMLElement;
    if (type === 'scroll') {
      return tableLink.offsetLeft - tableLink.scrollLeft;
    }
    return tableLink?.clientWidth;
  };
  const changeLink = (name: string, index: number) => {
    setLink(name);
    const tableLinks = document.querySelector('.table-links') as HTMLElement;
    const tableLink = document.querySelectorAll('.table-link')[index] as HTMLElement;
    tableLink.scrollIntoView();
    tableLinks?.style.setProperty('--length', `${getActiveLinkWidth(index, 'width')}px`);
    tableLinks?.style.setProperty('--left', `${getActiveLinkWidth(index, 'scroll')}px`);
  };

  useEffect(() => {
    const tableLinks = document.querySelector('.table-links') as HTMLElement;
    tableLinks?.style.setProperty(
      '--length',
      `${getActiveLinkWidth(
        links.findIndex((obj) => obj.link === link),
        'width'
      )}px`
    );
    tableLinks?.style.setProperty(
      '--left',
      `${getActiveLinkWidth(
        links.findIndex((obj) => obj.link === link),
        'scroll'
      )}px`
    );
  }, []);
  return (
    <BoxKit className='competition-box' sx={{ width: '100%' }}>
      <PaperKit className='table-paper' sx={{ width: '100%', mb: 2 }}>
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
          <div style={{ display: 'flex' }}>
            <ButtonKit
              className={`view-option-btn white ${viewType === 'calendar' && 'active'}`}
              onClick={() => setViewType('calendar')}
            >
              <img className='view-icon' src={CalendarViewIcon} alt='' style={{marginRight: '12px'}} />
              Calendar view
            </ButtonKit>
            <ButtonKit
              className={`view-option-btn white ${viewType === 'table' && 'active'}`}
              onClick={() => setViewType('table')}
            >
              <img className='view-icon' src={TableViewIcon} alt='' style={{marginRight: '12px'}} />
              Table view
            </ButtonKit>
            {filters ? (
              <BoxKit onClick={() => setOpenedFilter(true)} className='table-filter'>
                <span />
                <p>Filters</p>
              </BoxKit>
            ) : (
              ''
            )}
          </div>
        </div>
        {filters}
      </PaperKit>
    </BoxKit>
  );
};

export default TableLink;
