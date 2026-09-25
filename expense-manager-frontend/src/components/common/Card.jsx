import React from 'react';
import PropTypes from 'prop-types';

const Card = ({ children, title, action, className = '' }) => {
    return (
        <div className={`card ${className}`}>
            {(title || action) && (
                <div className="card-header">
                    {title && <h3 className="card-title">{title}</h3>}
                    {action && <div>{action}</div>}
                </div>
            )}
            {children}
        </div>
    );
};

Card.propTypes = {
    children: PropTypes.node.isRequired,
    title: PropTypes.string,
    action: PropTypes.node,
    className: PropTypes.string,
};

export default Card;
