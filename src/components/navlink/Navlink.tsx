import { NavLink } from 'react-router-dom';

import './Navlink.scss';

import ButtonKit from '../../kits/button/ButtonKit';

const Navlink = (props: any) => {
  const { children, title, path, ...rest } = props;

  return (
    <NavLink to={path} {...rest}>
      <ButtonKit className='navbar-button-kit'>
        {children}
        <span>{title}</span>
      </ButtonKit>
    </NavLink>
  );
};

export default Navlink;
