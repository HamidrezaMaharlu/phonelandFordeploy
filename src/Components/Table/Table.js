import React from "react";
import TableHeader from "./TableHeader";
import TableBody from "./TableBody";
import "./Table.scss"
import {convertNumber} from "../../utils/utils";

export const Table = ({columns, sortColumn, onSort, data, tfoot}) => {
    return (
        <table className="table table-striped table-hover mt-2 myTable">
            <TableHeader columns={columns} sortColumn={sortColumn} onSort={onSort}/>
            <TableBody columns={columns} data={data}/>
            {tfoot &&
                <tfoot className="table-secondary text-center">
                <tr>
                    <td>جمع کل</td>
                    <td></td>
                    <td className="IRANSansTable">{convertNumber(tfoot.totalPrice)}</td>
                    <td></td>
                    <td className="IRANSansTable">{tfoot.totalAmount}</td>
                    <td></td>
                </tr>
                </tfoot>
            }
        </table>
    );
};

