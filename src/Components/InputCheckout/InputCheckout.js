import React from 'react';
import classes from './InputCheckout.module.scss';

export const InputCheckout = ({className,error,name, label, type, value,validation, ...rest}) => {
    return (
        <div className={`${classes.formGroup} ${className}`} >
            <label htmlFor={name}>{label}</label>
            <input id={name} type={type} name={name} {...rest} {...validation}/>
            {error && <div className={classes.error}>{error}</div>}
        </div>
    );
};

