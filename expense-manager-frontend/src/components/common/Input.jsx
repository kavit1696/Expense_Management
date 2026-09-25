import React from 'react';
import PropTypes from 'prop-types';

const Input = ({ label, error, className = '', containerClass = '', ...props }) => {
    return (
        <div className={`form-group ${containerClass}`}>
            {label && <label className="form-label">{label}</label>}
            <input className={`form-input ${error ? 'border-danger' : ''} ${className}`} {...props} />
            {error && <span className="text-sm text-danger">{error}</span>}
        </div>
    );
};

Input.propTypes = {
    label: PropTypes.string,
    error: PropTypes.string,
    className: PropTypes.string,
    containerClass: PropTypes.string,
};

export default Input;
