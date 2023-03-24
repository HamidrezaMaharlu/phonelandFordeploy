import {useMatches} from "react-router-dom";
import classes from "./Breadcrumbs.module.scss"

export function Breadcrumbs() {
    let matches = useMatches();
    let crumbs = matches
        // first get rid of any matches that don't have handle and crumb
        .filter((match) => Boolean(match.handle?.crumb))
        // now map them into an array of elements, passing the loader
        // data to each one
        .map((match) => match.handle.crumb(match));

    return (
        <ol className={classes.breadcrumb}>
            {crumbs.map((crumb, index) => (
                <li key={index}>{crumb}</li>
            ))}
        </ol>
    );
}

