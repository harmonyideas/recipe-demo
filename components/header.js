import React from 'react';
import Link from 'next/link';

const Header = () => {
  return (
    <nav className="navbar navbar-expand border-bottom shadow-sm">
      <div className="container">
        <Link href='/'>
          <a className="navbar-brand">Recipes</a>
        </Link>
      </div>
    </nav>
  );
};

export default Header;
