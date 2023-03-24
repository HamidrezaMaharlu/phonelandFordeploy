import React, {useEffect} from 'react';
import classes from "./WhishList.module.scss";

export function WishList() {
    useEffect(() => {
        document.title = 'فونلند | علاقه مندی ها';
    }, []);
    return (
        <div className={classes.wishlist}>
            wishlist Page
        </div>
    );
}

