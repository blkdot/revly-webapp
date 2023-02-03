import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import MovingIcon from '@mui/icons-material/Moving';
import { endOfMonth, format, getYear, parseISO } from 'date-fns';
import { enUS } from 'date-fns/locale';
import dayjs from 'dayjs';
import { CardContentKit, CardKit, PaperKit, SkeletonKit, TypographyKit } from 'kits';
import useDate from '../../hooks/useDate';
import './Widget.scss';

const Widget = ({ title, setTable, table, metricsbeforePeriod, metricsafterPeriod, loading }) => {
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
  const getTitle = (): any => {};
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
      return getTitle() === 'roi'
        ? Math.round(metricsbeforePeriod.all[title] * 100)
        : parseFloat(metricsbeforePeriod.all[title].toFixed(1)).toLocaleString('en-US');
    }

    return '-';
  };

  return (
    <CardKit
      className={`card_wrapper ${table === title ? 'active' : ''}`}
      onClick={() => setTable(title)}
    >
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
