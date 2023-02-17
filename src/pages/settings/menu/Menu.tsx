import useTableContentFormatter from 'components/tableRevly/tableContentFormatter/useTableContentFormatter';
import TableRevlyNew from 'components/tableRevly/TableRevlyNew';
import { useUserAuth } from 'contexts';
import { useAlert, useApi, usePlatform } from 'hooks';
import useVendors, { type TVendorsArr } from 'hooks/useVendors';
import { useEffect, useState } from 'react';
import icdeliveroo from '../../../assets/images/deliveroo-favicon.webp';
import icbranch from '../../../assets/images/ic_menu-branch.png';
import iccategory from '../../../assets/images/ic_menu-category.png';
import icplatform from '../../../assets/images/ic_select_platform.png';
import ictalabat from '../../../assets/images/talabat-favicon.png';
import CheckboxKit from '../../../kits/checkbox/CheckboxKit';
import ListItemTextKit from '../../../kits/listItemtext/ListItemTextKit';
import MenuItemKit from '../../../kits/menuItem/MenuItemKit';
import './Menu.scss';
import MenuDropdown from './menuDropdown/MenuDropdown';
import MenuTable from './menuTable/MenuTable';

const Menu = () => {
  const [categoryList, setCategoryList] = useState([]);
  const [category, setCategory] = useState([]);
  const [platformList, setPlatformList] = useState([]);
  const [platform, setPlatform] = useState('');
  const [filteredCategoryData, setFilteredCategoryData] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const { userPlatformData } = usePlatform();
  const { triggerAlertWithMessageError } = useAlert();
  const { getMenu } = useApi();
  const { vendors } = useVendors();
  const { vendorsArr: vendorList } = vendors;
  const [branch, setBranch] = useState<string | TVendorsArr>('');
  const { user } = useUserAuth();

  const getMenuData = async (vendor, platforms) => {
    setLoading(true);
    try {
      const res = await getMenu(
        { master_email: user.email, access_token: user.accessToken, vendor: vendor || [] },
        platforms
      );

      const resp = Object.keys(res.data.menu_items || {})
        .map((v) => res.data.menu_items[v])
        .map((k) => Object.keys(k).map((el) => k[el]))
        .flat();

      setCategoryList(res.data.categories || []);
      setData(resp.map((obj) => ({
        ...obj,
        item_name: obj.name || obj.item_name,
        item_category: obj.category || obj.category_name,
        item_price: obj.price || obj.unit_price,
      })));
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
              name: v,
              registered: true,
            };
          }
          return {
            name: v,
            registered: false,
          };
        })
        .filter((k) => k.registered === true);

      setPlatform(list[0].name);
      setPlatformList(list);
    }
  }, [userPlatformData]);

  useEffect(() => {
    if (vendorList && vendorList.length) {
      const ve = vendorList?.filter((v) => v.platform === platform);
      setBranch(ve[0] || '');
    }
  }, [vendorList, platform]);

  useEffect(() => {
    if (branch) {
      getMenuData(branch, platform);
    }
  }, [branch, platform]);

  const handleSelectChange = (e, set) => {
    set(e.target.value);
  };

  const handleCategoryChange = (e) => {
    const { value } = e.target;
    if (value.length > 0) {
      const arr = value
        .map((v) => data.filter((k) => k.category === v || k.category_name === v))
        .flat();
      setFilteredCategoryData(arr);
    } else {
      setFilteredCategoryData([]);
    }
    setCategory(value);
  };
  const { renderSimpleRow, renderSimpleRowSkeleton, renderCurrency } =
    useTableContentFormatter();
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

  return (
    <div className='menu'>
      <div className='__select-block'>
        <div className='__select'>
          <MenuDropdown
            onChange={handleCategoryChange}
            startIcon={
              <img
                src={iccategory}
                alt='category'
                style={{ position: 'relative', bottom: '5px' }}
              />
            }
            value={category}
            multiple
            renderValue={(selected) => selected.join(', ')}
            items={categoryList}
            label='All Categories'
            renderOption={(v) => (
              <MenuItemKit key={v} value={v}>
                <CheckboxKit checked={category.indexOf(v) > -1} />
                <ListItemTextKit primary={v} />
              </MenuItemKit>
            )}
          />
        </div>
        <div className='__select'>
          <MenuDropdown
            onChange={(e) => handleSelectChange(e, setBranch)}
            startIcon={
              <img src={icbranch} alt='category' style={{ position: 'relative', bottom: '2px' }} />
            }
            items={vendorList?.filter((v) => v.platform === platform)}
            label='Select a branch'
            value={branch}
            renderOption={(v) => (
              <MenuItemKit key={v.vendor_id} value={v}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <img
                    src={v.platform === 'deliveroo' ? icdeliveroo : ictalabat}
                    width={24}
                    height={24}
                    style={{ objectFit: 'contain' }}
                    alt='icon'
                  />
                  <ListItemTextKit primary={v.data.vendor_name} />
                </div>
              </MenuItemKit>
            )}
          />
        </div>
        <div className='__select'>
          <MenuDropdown
            onChange={(e) => handleSelectChange(e, setPlatform)}
            startIcon={<img width={25} height={25} src={icplatform} alt='category' />}
            items={platformList}
            label='Select a Platform'
            value={platform}
            renderOption={(v) => (
              <MenuItemKit key={v.name} value={v.name}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    textTransform: 'capitalize',
                  }}
                >
                  <img
                    src={v.name === 'deliveroo' ? icdeliveroo : ictalabat}
                    width={24}
                    height={24}
                    style={{ objectFit: 'contain' }}
                    alt='icon'
                  />
                  <ListItemTextKit primary={v.name} />
                </div>
              </MenuItemKit>
            )}
          />
        </div>
      </div>
      <div className='__table-block'>
        <TableRevlyNew
          renderCustomSkelton={[0, 1, 2, 3, 4, 5].map(renderRowsByHeaderLoading)}
          isLoading={loading}
          headers={headers}
          rows={(filteredCategoryData.length > 0 ? filteredCategoryData : data).map(renderRowsByHeader)}
          className='onboarding-table'
        />
      </div>
    </div>
  );
};

export default Menu;
