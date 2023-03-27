import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import MovingIcon from '@mui/icons-material/Moving';
import { endOfMonth, format, getYear, parseISO } from 'date-fns';
import { enUS } from 'date-fns/locale';
import dayjs from 'dayjs';
import { useDate } from 'hooks';
import { CardContentKit, CardKit, PaperKit, SkeletonKit, TooltipKit, TypographyKit } from 'kits';
import { FC } from 'react';
import TooltipIcon from '../../assets/images/tooltip-ic.svg';
import './Widget.scss';

const Widget: FC<{
  title: string;
  setTable: (value: string) => void;
  table: string;
  link: string;
  metricsbeforePeriod: any;
  metricsafterPeriod: any;
  loading: boolean;
  links: { title: string; link: string; tooltip?: string }[];
  tooltip?: string;
}> = ({
  title,
  setTable,
  table,
  metricsbeforePeriod,
  metricsafterPeriod,
  loading,
  links,
  link,
  tooltip,
}) => {
  const { date } = useDate();
  const { afterPeriod, titleafterPeriod } = date;
  const startDate = parseISO(afterPeriod.startDate as string);
  const endDate = parseISO(afterPeriod.endDate as string);
  const startLocal = startDate.toLocaleDateString();
  const endLocal = endDate.toLocaleDateString();
  const startGetDate = startDate.getDate();
  const endGetDate = endDate.getDate();

  const procent = () => {
    if (Object.keys(metricsbeforePeriod).length > 0 && Object.keys(metricsafterPeriod).length > 0) {
      if (Number(metricsafterPeriod.all[link]) === 0) {
        return 0;
      }

      if (
        !Number.isNaN(
          parseFloat(
            (metricsbeforePeriod.all[link] / (metricsafterPeriod.all[link] / 100) - 100).toFixed(0)
          )
        )
      ) {
        return parseFloat(
          (metricsbeforePeriod.all[link] / (metricsafterPeriod.all[link] / 100) - 100).toFixed(0)
        );
      }
      return 0;
    }
    return 0;
  };

  const getafterPeriod = () => {
    if (titleafterPeriod === 'custom') {
      if (startLocal === endLocal) {
        return `${dayjs(afterPeriod.startDate).format('DD/MM')}`;
      }
      if (
        startGetDate === 1 &&
        endGetDate === endOfMonth(parseISO(afterPeriod.startDate as string)).getDate()
      ) {
        return `${format(parseISO(afterPeriod.startDate as string), 'LLL', {
          locale: enUS,
        })}  -  ${getYear(parseISO(afterPeriod.startDate as string))}`;
      }

      return `${dayjs(afterPeriod.startDate).format('DD/MM')} - ${dayjs(afterPeriod.endDate).format(
        'DD/MM'
      )}`;
    }

    return `${titleafterPeriod}`;
  };

  const renderMetrics = () => {
    if (metricsbeforePeriod.all?.[link]) {
      const value = parseFloat(metricsbeforePeriod.all?.[link].toFixed(1)).toLocaleString('en-US');
      switch (link) {
        case 'average_basket':
        case 'accrued_discounts':
        case 'revenue':
        case 'profit':
        case 'accrued_ads':
          return (
            <p>
              AED <span>{value}</span>
            </p>
          );
        case 'roas':
          return (
            <div>
              <p>
                <span>{value}</span> AED
              </p>{' '}
              <span>for every 1 AED spent on Ads</span>
            </div>
          );
        case 'roi':
          return (
            <div>
              <p>
                <span>{value}</span> AED
              </p>{' '}
              <span>for every 1 AED spent on Discounts and Ads</span>
            </div>
          );
        default:
          return value;
      }
    }

    return '-';
  };
  const getActiveLinkWidth = (index: number, type: string) => {
    const tableLink = document.querySelectorAll('.table-link')[index] as HTMLElement;
    tableLink.scrollIntoView();
    if (type === 'scroll') {
      return tableLink.offsetLeft - tableLink.scrollLeft;
    }
    return tableLink?.clientWidth;
  };

  const changeLink = () => {
    setTable(link);
    const tableLinks = document.querySelector('.table-links') as HTMLElement;
    tableLinks?.style.setProperty(
      '--length',
      `${getActiveLinkWidth(
        links.findIndex((obj: { title: string; link: string }) => obj.title === title),
        'width'
      )}px`
    );
    tableLinks?.style.setProperty(
      '--left',
      `${getActiveLinkWidth(
        links.findIndex((obj: { title: string; link: string }) => obj.title === title),
        'scroll'
      )}px`
    );
  };
  return (
    <CardKit className={`card_wrapper ${table === link && 'active'}`} onClick={changeLink}>
      <CardContentKit>
        {tooltip && (
          <TooltipKit
            onClick={(e) => e.stopPropagation()}
            interactive={1}
            id='table-tooltip'
            placement='right'
            arrow
            title={tooltip}
          >
            <img
              className='table-header-tooltip dashboard-tooltip'
              src={TooltipIcon}
              alt='tooltip icon'
            />
          </TooltipKit>
        )}
        <TypographyKit
          component='div'
          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <div>
            <TypographyKit variant='subtitle2' className='card-typography' component='div'>
              {title}
            </TypographyKit>
            {loading ? (
              <SkeletonKit
                width={110}
                height={34}
                style={{ margin: '10px 0 0 0', transform: 'scale(1)' }}
              />
            ) : (
              <TypographyKit
                variant='h3'
                className={`card-typography ${(link === 'roi' || link === 'roas') && 'card-roi'}`}
              >
                {renderMetrics()}
              </TypographyKit>
            )}
          </div>
        </TypographyKit>
        <div className='card_bottom'>
          {loading ? (
            <SkeletonKit width={60} height={30} />
          ) : (
            <div style={{ margin: 0 }} className='card_bottom'>
              <PaperKit
                className={`icon-paper ${procent() > 0 && 'increased'} ${
                  procent() < 0 && 'decreased'
                }`}
              >
                {procent() === 0 ? (
                  <ArrowRightAltIcon />
                ) : (
                  <MovingIcon className={procent() > 0 ? 'increased' : 'decreased'} />
                )}
              </PaperKit>
              <TypographyKit
                sx={{ lineHeight: 0 }}
                className={`card-procent ${procent() > 0 && 'increased'} ${
                  procent() < 0 && 'decreased'
                }`}
                variant='body2'
              >
                {procent() > 0 ? `+${procent()}%` : `${procent()}%`}
              </TypographyKit>
            </div>
          )}
          <TypographyKit className='card-week' variant='body3'>
            than {getafterPeriod()}
          </TypographyKit>
        </div>
      </CardContentKit>
    </CardKit>
  );
};
Widget.defaultProps = {
  tooltip: '',
};
export default Widget;
