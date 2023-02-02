import { ButtonKit, PaperKit, TypographyKit } from 'kits';
import CloseIcon from '../../../assets/images/ic_close.png';
import filterOffersData from '../../../data/filterOffersData';
import FilterDropdown from '../filterDropdown/FilterDropdown';
import './FilterMore.scss';

const FilterMore = (props: any) => {
  const { onClose, onChangeMultipleSelect, filters } = props;

  return (
    <PaperKit onClick={(e) => e.stopPropagation()} className='marketing-paper filter-paper'>
      <div>
        <TypographyKit>More Filters</TypographyKit>
        <img
          role='presentation'
          tabIndex={-1}
          onClick={() => onClose()}
          src={CloseIcon}
          alt='close icon'
        />
      </div>
      <TypographyKit variant='subtitle'>
        Proin ut tellus elit nunc, vel, lacinia consectetur condimentum id. Cursus magna massa
        vivamus risus.
      </TypographyKit>
      <div className='filter-more'>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ marginTop: '0.5rem', width: '100%' }}>
            <FilterDropdown
              items={filterOffersData.status}
              values={filters.status}
              onChange={onChangeMultipleSelect('status')}
              label='Status'
              style={{ width: '100%' }}
            />
          </div>
          <div style={{ marginTop: '0.5rem' }}>
            <FilterDropdown
              items={filterOffersData.days}
              values={filters.days}
              onChange={onChangeMultipleSelect('days')}
              label='Days'
            />
          </div>
        </div>
      </div>
      <div>
        <ButtonKit variant='contained'>Confirme and Filter</ButtonKit>
        <ButtonKit variant='outlined' onClick={() => onClose()}>
          Cancel
        </ButtonKit>
      </div>
    </PaperKit>
  );
};

export default FilterMore;
