import React from 'react';
import classes from './Input.module.scss';

export const Input = ({className,error,name, label, type, value,validation, ...rest}) => {
    return (
        <div className={`${classes.formGroup} ${className}`} >
            <label htmlFor={name}>{label}</label>
            <input value={value} id={name} type={type} name={name} {...rest} {...validation}/>
            {error && <div className={classes.error}>{error}</div>}
        </div>
    );
};

