import * as React from 'react';

const Container = ({ children }) => {
  return (
    <div className="mn-max-w-6xl mn-mx-auto mn-px-2 sm:mn-px-6 mn-py-2">
      {children}
    </div>
  );
};

export default Container;
