import _ from "lodash"
import {convertNumber} from "../../utils/utils";
function TableBody({data,columns}) {
    const renderCell = (item, column) => {
        if (column.content) return column.content(item);

        return _.get(item, column.path);
    };

    const createKey = (item, column) => {
        return item.id + (column.path || column.key);
    };
        return (
            <tbody className="text-center">
            {data.map(item => (
                <tr key={item.id}>
                    {columns.map((column,index) => (
                        <td className={index===2?"IRANSansTable":""} key={createKey(item, column)}>
                            {index===2?convertNumber(renderCell(item,column)):renderCell(item, column)}
                        </td>
                    ))}
                </tr>
            ))}
            </tbody>
        );

}

export default TableBody;