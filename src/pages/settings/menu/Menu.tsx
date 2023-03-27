import { getMenu } from 'api';
import { PageHeader } from 'components';
import SimpleDropdown from 'components/simpleDropdown/SimpleDropdown';
import useTableContentFormatter from 'components/tableRevly/tableContentFormatter/useTableContentFormatter';
import TableRevlyNew from 'components/tableRevly/TableRevlyNew';
import { usePlatform, useUser } from 'contexts';
import { useAlert } from 'hooks';
import { useAtom } from 'jotai';
import { ContainerKit, FormControlLabelKit } from 'kits';
import { useEffect, useState } from 'react';
import { branchAtom, platformAtom } from 'store/marketingSetupAtom';
import { renderPlatformOption, renderPlatformValue } from 'store/renderDropdown';
import CheckboxKit from '../../../kits/checkbox/CheckboxKit';
import SettingsTopInputs from '../component/SettingsTopInputs';
import './Menu.scss';
import VendorsDropdownMenu from './menuDropdown/VendorsDropdownMenu';

const Menu = () => {
  const [categoryList, setCategoryList] = useState([]);
  const [category, setCategory] = useState([]);
  const [platformList, setPlatformList] = useState([]);
  const [platform, setPlatform] = useAtom(platformAtom);
  const [filteredCategoryData, setFilteredCategoryData] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const { userPlatformData } = usePlatform();
  const { triggerAlertWithMessageError } = useAlert();
  const [branch] = useAtom(branchAtom);
  const user = useUser();

  const getMenuData = async (vendor, platforms) => {
    setLoading(true);
    try {
      const res = await getMenu(
        {
          master_email: user.email,
          access_token: user.token,
          vendor: vendor[platform[0]][0] || {},
        },
        platforms[0]
      );

      const resp = Object.keys(res.data.menu_items || {})
        .map((v) => res.data.menu_items[v])
        .map((k) => Object.keys(k).map((el) => k[el]))
        .flat();

      setCategoryList(res.data.categories || []);
      setData(
        resp.map((obj) => ({
          ...obj,
          item_name: obj.name || obj.item_name,
          item_category: obj.category || obj.category_name,
          item_price: obj.price || obj.unit_price,
        }))
      );
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setData([]);
      triggerAlertWithMessageError('Error while retrieving data');
    }
  };
  useEffect(() => {
    if (userPlatformData) {
      const pl = userPlatformData.platforms;
      const list = Object.keys(pl)
        .map((v) => {
          if (pl[v].find((obj) => obj.active)) {
            return {
              value: v,
              registered: true,
            };
          }
          return {
            value: v,
            registered: false,
          };
        })
        .filter((k) => k.registered === true);

      setPlatform([list[0]?.value]);
      setPlatformList(list);
    }
  }, [userPlatformData]);

  useEffect(() => {
    if ((branch.vendorsObj?.[platform[0]] || []).length) {
      getMenuData(branch.vendorsObj, platform);
    }
  }, [branch, platform]);

  const handleSelectChangePlatform = (value) => {
    setPlatform([value]);
  };

  const handleCategoryChange = (e, value) => {
    if (e.target.checked) {
      category.push(value);
    } else {
      category.splice(
        category.findIndex((c) => c === value),
        1
      );
    }
    if (category.length > 0) {
      const arr = category
        .map((v) => data.filter((k) => k.category === v || k.category_name === v))
        .flat();
      setFilteredCategoryData(arr);
    } else {
      setFilteredCategoryData([]);
    }
    setCategory([...category]);
  };
  const { renderSimpleRow, renderSimpleRowSkeleton, renderCurrency } = useTableContentFormatter();
  const headers = [
    {
      id: 'item_name',
      numeric: false,
      disablePadding: false,
      label: 'Item name',
    },
    {
      id: 'item_category',
      numeric: false,
      disablePadding: false,
      label: 'Item category ',
    },
    {
      id: 'item_price',
      numeric: false,
      disablePadding: false,
      label: 'Item price',
    },
  ];

  const /* A map of functions that will be used to render the cells. */
    cellTemplatesObject = {
      item_name: renderSimpleRow,
      item_category: renderSimpleRow,
      item_price: renderCurrency,
    };
  const renderRowsByHeader = (r) =>
    headers.reduce(
      (acc, cur) => ({
        ...acc,
        [cur.id]: cellTemplatesObject[cur.id](r, cur),
        id: r.item_id || r.id,
        data: r,
      }),
      {}
    );
  const cellTemplatesObjectLoading = {
    item_name: renderSimpleRowSkeleton,
    item_category: renderSimpleRowSkeleton,
    item_price: renderSimpleRowSkeleton,
  };
  const renderRowsByHeaderLoading = (r) =>
    headers.reduce(
      (acc, cur) => ({
        ...acc,
        [cur.id]: cellTemplatesObjectLoading[cur.id](cur),
        id: r,
      }),
      {}
    );

  const renderDropdowns = () => (
    <div className='__select-block'>
      <div className='__select vendor'>
        <SimpleDropdown
          items={categoryList}
          selected={category}
          renderOption={(v) => (
            <FormControlLabelKit
              key={v}
              onChange={(e) => handleCategoryChange(e, v)}
              control={<CheckboxKit checked={category.indexOf(v) > -1} />}
              label={v}
            />
          )}
        />
      </div>
      <div className='__select vendor'>
        <VendorsDropdownMenu />
      </div>
      <div className='__select vendor'>
        <SimpleDropdown
          renderValue={() => renderPlatformValue(platform)}
          items={platformList}
          selected={platform}
          renderOption={(v) => renderPlatformOption(v, platform, handleSelectChangePlatform)}
        />
      </div>
    </div>
  );
  return (
    <div className='wrapper'>
      <SettingsTopInputs />
      <ContainerKit className='menu'>
        <PageHeader
          title='Settings - Menu'
          description='View your menu across all platforms and branches.'
          extra={renderDropdowns()}
        />
        <div className='__table-block'>
          <TableRevlyNew
            renderCustomSkelton={[0, 1, 2, 3, 4, 5].map(renderRowsByHeaderLoading)}
            isLoading={loading}
            headers={headers}
            rows={(filteredCategoryData.length > 0 ? filteredCategoryData : data).map(
              renderRowsByHeader
            )}
            className='onboarding-table'
          />
        </div>
      </ContainerKit>
    </div>
  );
};

export default Menu;
