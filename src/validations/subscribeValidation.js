import * as yup from 'yup';

export const subscribeSchema = yup
    .object({
        subscribe: yup.string().email("ایمیل معتبر وارد نمایید").required("تکمیل پست الکترونیک الزامی است."),
    })