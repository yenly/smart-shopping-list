import { NavLink } from 'react-router-dom';
/** @jsx jsx */
import { jsx } from 'theme-ui';

const Navigation = () => {
  return (
    <nav>
      <NavLink to="/list" sx={{ variant: 'links.nav' }}>
        List
      </NavLink>
      <NavLink to="/add" sx={{ variant: 'links.nav' }}>
        Add item
      </NavLink>
    </nav>
  );
};

export default Navigation;
