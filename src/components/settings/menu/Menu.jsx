import React, { useEffect, useState } from 'react';

import './Menu.scss';

import iccategory from '../../../assets/images/ic_menu-category.png';
import icbranch from '../../../assets/images/ic_menu-branch.png';
import icplatform from '../../../assets/images/ic_select_platform.png';
import icdeliveroo from '../../../assets/images/deliveroo-favicon.webp';
import ictalabat from '../../../assets/images/talabat-favicon.png';

import MenuDropdown from './menuDropdown/MenuDropdown';
import MenuTable from './menuTable/MenuTable';

import ListItemTextKit from '../../../kits/listItemtext/ListItemTextKit';
import CheckboxKit from '../../../kits/checkbox/CheckboxKit';
import MenuItemKit from '../../../kits/menuItem/MenuItemKit';

import { useUserAuth } from '../../../contexts/AuthContext';
import useVendors from '../../../hooks/useVendors';
import useApi from '../../../hooks/useApi';
import { useAlert } from '../../../hooks/useAlert';
import { usePlatform } from '../../../hooks/usePlatform';

const Menu = () => {
  const [categoryList, setCategoryList] = useState([]);
  const [category, setCategory] = useState([]);
  const [platformList, setPlatformList] = useState([]);
  const [platform, setPlatform] = useState('');
  const [filteredCategoryData, setFilteredCategoryData] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const { userPlatformData } = usePlatform();
  const { triggerAlertWithMessageError } = useAlert('error');
  const { getMenu } = useApi();
  const { vendors: vendorsList } = useVendors();
  const [branch, setBranch] = useState('');
  const { user } = useUserAuth();

  const getMenuData = async (vendor, platforms) => {
    setLoading(true);
    try {
      const res = await getMenu(
        { master_email: user.email, access_token: user.accessToken, vendor },
        platforms,
      );

      if (!res.data) {
        throw new Error('');
      }

      const resp = Object.keys(res.data.menu_items)
        .map((v) => res.data.menu_items[v])
        .map((k) => Object.keys(k).map((el) => k[el]))
        .flat();

      setCategoryList(res.data.categories);
      setData(resp);
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
        .map((v) => ({
          name: v,
          registered: pl[v].active,
        }))
        .filter((k) => k.registered === true);

      setPlatform(list[0].name);
      setPlatformList(list);
    }
  }, [userPlatformData]);

  useEffect(() => {
    if (vendorsList.length) {
      const ve = vendorsList.filter((v) => v.platform === platform);
      setBranch(ve[0] || '');
    }
  }, [vendorsList, platform]);

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
      const arr = value.map((v) => data.filter((k) => k.category === v)).flat();
      setFilteredCategoryData(arr);
    } else {
      setFilteredCategoryData([]);
    }
    setCategory(value);
  };

  return (
    <div className="menu">
      <div className="__select-block">
        <div className="__select">
          <MenuDropdown
            onChange={handleCategoryChange}
            startIcon={
              <img
                src={iccategory}
                alt="category"
                style={{ position: 'relative', bottom: '5px' }}
              />
            }
            value={category}
            multiple
            renderValue={(selected) => selected.join(', ')}
            items={categoryList}
            label="All Categories"
            renderOption={(v) => (
              <MenuItemKit key={v} value={v}>
                <CheckboxKit checked={category.indexOf(v) > -1} />
                <ListItemTextKit primary={v} />
              </MenuItemKit>
            )}
          />
        </div>
        <div className="__select">
          <MenuDropdown
            onChange={(e) => handleSelectChange(e, setBranch)}
            startIcon={
              <img src={icbranch} alt="category" style={{ position: 'relative', bottom: '2px' }} />
            }
            items={vendorsList.filter((v) => v.platform === platform)}
            label="Select a branch"
            value={branch}
            renderOption={(v) => (
              <MenuItemKit key={v.vendor_id} value={v}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <img
                    src={v.platform === 'deliveroo' ? icdeliveroo : ictalabat}
                    width={24}
                    height={24}
                    style={{ objectFit: 'contain' }}
                    alt="icon"
                  />
                  <ListItemTextKit primary={v.data.vendor_name} />
                </div>
              </MenuItemKit>
            )}
          />
        </div>
        <div className="__select">
          <MenuDropdown
            onChange={(e) => handleSelectChange(e, setPlatform)}
            startIcon={<img width={25} height={25} src={icplatform} alt="category" />}
            items={platformList}
            label="Select a Platform"
            value={platform}
            renderOption={(v) => (
              <MenuItemKit key={v.name} value={v.name}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    textTransform: 'capitalize',
                  }}>
                  <img
                    src={v.name === 'deliveroo' ? icdeliveroo : ictalabat}
                    width={24}
                    height={24}
                    style={{ objectFit: 'contain' }}
                    alt="icon"
                  />
                  <ListItemTextKit primary={v.name} />
                </div>
              </MenuItemKit>
            )}
          />
        </div>
      </div>
      <div className="__table-block">
        <MenuTable
          data={filteredCategoryData.length > 0 ? filteredCategoryData : data}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default Menu;
