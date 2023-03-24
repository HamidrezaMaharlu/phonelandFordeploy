import { useMemo } from 'react';

export default function useKeysWithLengthGreaterThan5(myObject) {
    const keysWithLengthGreaterThan5 = useMemo(() => {
        let result = [];
        Object.keys(myObject).some(key => {
            if (myObject[key].length > 5) {
                result.push(key);
            }
            return result.length >= 3;
        });
        return result;
    }, [myObject]);

    return keysWithLengthGreaterThan5;
}
