import * as React from 'react';
import { Link } from 'react-router-dom';
import { homeUrl } from '../constants/routes';

const Header = () => {
  return (
    <div className="mn-bg-pink-600 mn-text-white mn-shadow">
      <div className="mn-max-w-6xl mn-mx-auto mn-px-2 sm:mn-px-6 mn-py-2 mn-text-2xl">
        <Link to={homeUrl}>Main App</Link>
      </div>
    </div>
  );
};

export default Header;
