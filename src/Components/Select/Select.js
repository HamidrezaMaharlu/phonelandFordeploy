import React from 'react';
import classes from './Select.module.scss';

export const Select = ({classname,value,name, label, options, error, ...rest}) => {
    return (
        <div className={`${classes.formGroup} ${classname}`}>
            <label htmlFor={name}>{label}</label>
            <select value={value} name={name} id={name} {...rest} className="form-control">
                <option value="default">انتخاب کنید</option>
                {options.map(option => (
                    <option key={option.id} value={option.id} style={{backgroundColor:`${option.hex}`}}>
                        {option["name-fa"]}
                    </option>
                ))}
            </select>
            {error && <div className="">{error}</div>}
        </div>
    );
};

