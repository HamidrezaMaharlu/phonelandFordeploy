import _ from "lodash";
import classes from "./Pagination.module.scss";

export const Pagination = ({ itemsCount, pageSize, currentPage, onPageChange }) => {
    const pagesCount = Math.ceil(itemsCount / pageSize);
    if (pagesCount === 1) return null;
    const pages = _.range(1, pagesCount + 1);

    return (
        <div className={classes.pageContainer}>
            <ul className={`pagination pagination-lg ${classes.myPage} IRANSans`}>
                {pages.map(page => (
                    <li
                        key={page}
                        className={page === currentPage ? "page-item active" : "page-item"}
                    >
                        <a className="page-link" onClick={() => onPageChange(page)}>
                            {page}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};


