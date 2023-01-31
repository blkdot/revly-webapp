import { NavLink } from 'react-router-dom';
import ButtonKit from '../../kits/button/ButtonKit';
import './Navlink.scss';

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
