import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import MovingIcon from '@mui/icons-material/Moving';
import { endOfMonth, format, getYear, parseISO } from 'date-fns';
import { enUS } from 'date-fns/locale';
import dayjs from 'dayjs';
import { useDate } from 'hooks';
import { CardContentKit, CardKit, PaperKit, SkeletonKit, TypographyKit } from 'kits';
import { FC } from 'react';
import './Widget.scss';

const Widget: FC<{
  title: any;
  setTable: any;
  table: any;
  metricsbeforePeriod: any;
  metricsafterPeriod: any;
  loading: any;
  links: any;
}> = ({ title, setTable, table, metricsbeforePeriod, metricsafterPeriod, loading, links }) => {
  const { date } = useDate();
  const { afterPeriod, titleafterPeriod } = date;
  const startDate = parseISO(afterPeriod.startDate);
  const endDate = parseISO(afterPeriod.endDate);
  const startLocal = startDate.toLocaleDateString();
  const endLocal = endDate.toLocaleDateString();
  const startGetDate = startDate.getDate();
  const endGetDate = endDate.getDate();

  const procent = () => {
    if (metricsbeforePeriod && metricsafterPeriod) {
      if (Number(metricsafterPeriod.all[title]) === 0) {
        return 0;
      }

      return parseFloat(
        (metricsbeforePeriod.all[title] / (metricsafterPeriod.all[title] / 100) - 100).toFixed(0)
      );
    }
    return 0;
  };
  const getTitle = (): any => {
    if (title === 'n_orders') {
      return 'Orders';
    }
    if (title === 'average_basket') {
      return 'Avg. basket';
    }
    if (title === 'accrued_discounts') {
      return 'Accrued discount';
    }
    if (title === 'profit') {
      return 'Net revenue';
    }
    if (title === 'roi') {
      return 'ROI';
    }
    return title;
  };
  const getafterPeriod = () => {
    if (titleafterPeriod === 'custom') {
      if (startLocal === endLocal) {
        return `${dayjs(afterPeriod.startDate).format('DD/MM')}`;
      }
      if (
        startGetDate === 1 &&
        endGetDate === endOfMonth(parseISO(afterPeriod.startDate)).getDate()
      ) {
        return `${format(parseISO(afterPeriod.startDate), 'LLL', {
          locale: enUS,
        })}  -  ${getYear(parseISO(afterPeriod.startDate))}`;
      }

      return `${dayjs(afterPeriod.startDate).format('DD/MM')} - ${dayjs(afterPeriod.endDate).format(
        'DD/MM'
      )}`;
    }

    return `${titleafterPeriod}`;
  };

  const renderMetrics = () => {
    if (metricsbeforePeriod.all?.[title]) {
      const value = parseFloat(metricsbeforePeriod.all[title].toFixed(1)).toLocaleString('en-US');
      switch (title) {
        case 'average_basket':
        case 'accrued_discounts':
        case 'revenue':
        case 'profit':
          return `AED ${value}`;
        default:
          return value;
      }
    }

    return '-';
  };
  const getActiveLinkWidth = (index: number, type: string) => {
    const tableLink = document.querySelectorAll('.table-link')[index] as HTMLElement;

    if (type === 'scroll') {
      return tableLink.offsetLeft - tableLink.scrollLeft;
    }
    return tableLink?.clientWidth;
  };

  const changeLink = () => {
    setTable(getTitle());
    const tableLinks = document.querySelector('.table-links') as HTMLElement;
    tableLinks?.style.setProperty(
      '--length',
      `${getActiveLinkWidth(
        links.findIndex((t) => t === getTitle()),
        'width'
      )}px`
    );
    tableLinks?.style.setProperty(
      '--left',
      `${getActiveLinkWidth(
        links.findIndex((t) => t === getTitle()),
        'scroll'
      )}px`
    );
  };
  return (
    <CardKit className={`card_wrapper ${table === title ? 'active' : ''}`} onClick={changeLink}>
      <CardContentKit>
        <TypographyKit
          component='div'
          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <div>
            <TypographyKit
              style={{ textTransform: 'capitalize' }}
              variant='subtitle2'
              className='card-typography'
              component='div'
            >
              {getTitle()}
            </TypographyKit>
            {loading ? (
              <SkeletonKit
                width={110}
                height={34}
                style={{ margin: '10px 0 0 0', transform: 'scale(1)' }}
              />
            ) : (
              <TypographyKit variant='h3' className='card-typography'>
                {renderMetrics()}
                {getTitle() === 'roi' && metricsbeforePeriod.all[title] && ' %'}
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
                className={`icon-paper ${procent() > 0 ? 'increased' : ''} ${
                  procent() < 0 ? 'decreased' : ''
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
                className={`card-procent ${procent() > 0 ? 'increased' : ''} ${
                  procent() < 0 ? 'decreased' : ''
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

export default Widget;
