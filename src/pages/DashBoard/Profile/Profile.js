import React, {useEffect} from 'react';
import classes from "./Profile.module.scss";

export function Profile() {
    useEffect(() => {
        document.title = 'فونلند | پروفایل';
    }, []);
    return (
        <div className={classes.profile}>Profile Page</div>
    );
}

