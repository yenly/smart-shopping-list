import React from 'react';
import { NavLink } from 'react-router-dom';

const Navigation = () => {
  return (
    <nav>
      <NavLink exact to="/">
        Home
      </NavLink>
      <NavLink to="/list">List</NavLink>
      <NavLink to="/add">Add an item</NavLink>
    </nav>
  );
};

export default Navigation;
