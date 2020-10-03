import * as React from 'react';
import { Link } from 'react-router-dom';
import { homeUrl } from '../constants/routes';

const Header = () => {
  return (
    <div className="bg-pink-600 text-white shadow">
      <div className="max-w-6xl mx-auto px-2 sm:px-6 py-2 text-2xl">
        <Link to={homeUrl}>Main App</Link>
      </div>
    </div>
  );
};

export default Header;
