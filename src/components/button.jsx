import * as React from 'react';

const Button = ({ type = 'button', ...buttonProps }) => (
  <button type={type} {...buttonProps} />
);

export default Button;
