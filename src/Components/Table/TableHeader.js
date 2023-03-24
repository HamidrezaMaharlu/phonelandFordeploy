import React from 'react';

function TableHeader({onSort,columns,sortColumn}) {
    const raiseSort = path => {
        const newSortColumn = {...sortColumn};
        if (newSortColumn.path === path)
            newSortColumn.order = newSortColumn.order === "asc" ? "desc" : "asc";
        else {
            newSortColumn.path = path;
            newSortColumn.order = "asc";
        }
        onSort(newSortColumn);
        console.log(newSortColumn)
    };

    const renderSortIcon = column => {
        if (column.path !== sortColumn.path) return null;
        if (sortColumn.order === "asc") return <i className="fa fa-sort-asc"/>;
        return <i className="fa fa-sort-desc"/>;
    };

    return (
        <thead className="table-dark text-center">
        <tr>
            {columns.map(column => (
                <th
                    className="clickable"
                    key={column.path || column.key}
                    onClick={() => raiseSort(column.path)}
                >
                    {column.label} {renderSortIcon(column)}
                </th>
            ))}
        </tr>
        </thead>
    );

}

export default TableHeader;