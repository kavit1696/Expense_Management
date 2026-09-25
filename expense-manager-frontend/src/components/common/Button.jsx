import React from 'react';
import PropTypes from 'prop-types';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseClass = 'btn';
  const variants = {
    primary: 'btn-primary',
    outline: 'btn-outline',
    danger: 'btn-danger',
    ghost: 'btn-ghost',
  };

  return (
    <button className={`${baseClass} ${variants[variant] || variants.primary} ${className}`} {...props}>
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'outline', 'danger', 'ghost']),
  className: PropTypes.string,
};

export default Button;
