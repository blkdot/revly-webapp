import React, { useEffect, useState } from 'react';

import './Menu.scss';

import iccategory from '../../../assets/images/ic_menu-category.png';
import icbranch from '../../../assets/images/ic_menu-branch.png';
import icitem from '../../../assets/images/ic_menu-item.png';
import icplatform from '../../../assets/images/ic_select_platform.png';

import MenuDropdown from './menuDropdown/MenuDropdown';
import MenuTable from './menuTable/MenuTable';

// import useApi from '../../../hooks/useApi';
import { useUserAuth } from '../../../contexts/AuthContext';
import useVendors from '../../../hooks/useVendors';
import useApi from '../../../hooks/useApi';
import { useAlert } from '../../../hooks/useAlert';

const platformList = [
  { name: 'deliveroo', label: 'Deliveroo' },
  { name: 'talabat', label: 'Talabat' },
];

const Menu = () => {
  const [category] = useState([]);
  const [branch] = useState([]);
  const [platform, setPlatform] = useState({ name: 'deliveroo', label: 'Deliveroo' });
  const { triggerAlertWithMessageError } = useAlert('error');
  const [data, setData] = useState([
    {
      id: 1,
      name: 'Name',
      price: '20.15',
      category: 'Category',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit',
    },
    {
      id: 2,
      name: 'Pame',
      price: '21.15',
      category: 'Category',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit',
    },
    {
      id: 3,
      name: 'Pame',
      price: '21.15',
      category: 'Category',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit',
      image: icitem,
    },
    {
      id: 4,
      name: 'Pame',
      price: '21.15',
      category: 'Category',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit',
      image: icitem,
    },
    {
      id: 5,
      name: 'Pame',
      price: '21.15',
      category: 'Category',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit',
      image: icitem,
    },
    {
      id: 6,
      name: 'Pame',
      price: '21.15',
      category: 'Category',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit',
      image: icitem,
    },
    {
      id: 7,
      name: 'Pame',
      price: '21.15',
      category: 'Category',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit',
      image: icitem,
    },
  ]);
  const { getMenu } = useApi();
  const { vendors } = useVendors();
  const { user } = useUserAuth();

  const getMenuData = async () => {
    try {
      const res = getMenu(
        { master_email: user.email, access_token: user.accessToken, vendor: vendors },
        platform.name,
      );

      if (!res.menu_items) {
        throw new Error('');
      }
      setData(res.menu_items);
    } catch (err) {
      triggerAlertWithMessageError('Error while retrieving data');
    }
  };

  useEffect(() => {
    getMenuData();
  }, []);

  const handleSelectChange = (e) => {
    setPlatform(e.target.value);
  };

  return (
    <div className="menu">
      <div className="__select-block">
        <div className="__select">
          <MenuDropdown
            onChange={handleSelectChange}
            startIcon={
              <img
                src={iccategory}
                alt="category"
                style={{ position: 'relative', bottom: '5px' }}
              />
            }
            items={category}
            label="All Categories"
          />
        </div>
        <div className="__select">
          <MenuDropdown
            onChange={handleSelectChange}
            startIcon={
              <img src={icbranch} alt="category" style={{ position: 'relative', bottom: '2px' }} />
            }
            items={branch}
            label="Select a branch"
          />
        </div>
        <div className="__select">
          <MenuDropdown
            onChange={handleSelectChange}
            startIcon={<img width={25} height={25} src={icplatform} alt="category" />}
            items={platformList}
            label="Select a Platform"
          />
        </div>
      </div>
      <div className="__table-block">
        <MenuTable data={data} />
      </div>
    </div>
  );
};

export default Menu;
