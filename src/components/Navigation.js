import { NavLink, useLocation } from 'react-router-dom';
/** @jsx jsx */
import { jsx } from 'theme-ui';

const Navigation = () => {
  let location = useLocation();

  if (location.pathname === '/') {
    return null;
  }

  return (
    <nav
      sx={{
        border: 'thin',
        borderColor: 'blueDark',
        borderRadius: 'sketchy0',
        background: (theme) => theme.colors.blue,
      }}
    >
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
