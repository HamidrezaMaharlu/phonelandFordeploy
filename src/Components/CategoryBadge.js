import React from 'react';
import {Badge} from "react-bootstrap";

export function CategoryBadge({onClick,children,className}) {
    return (
        <h3><Badge className={className} onClick={onClick} pill bg="secondary">{children}</Badge></h3>
    );
}

