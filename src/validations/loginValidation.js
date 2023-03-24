import * as yup from 'yup';

export const loginSchema = yup
    .object({
        username: yup.string().email("ایمیل معتبر وارد نمایید").required("تکمیل نام کاربری الزامی است."),
        password: yup.string()
            .min(8, 'رمز عبور باید حداقل 8 واژه باشد')
            .max(30, 'رمز عبور باید حداکثر 12 واژه باشد')
            .matches(/[a-z]/, 'رمز عبور باید شامل یک حرف کوچک باشد')
            .matches(/[A-Z]/, 'رمز عبور باید شامل یک حرف بزرگ باشد')
            .matches(/[0-9]/, 'رمز عبور باید شامل یک عدد باشد')
            .matches(/[^A-Za-z0-9]/, 'رمز عبور باید شامل یک کاراکتر($%*) باشد')
            .required("تکمیل رمز عبور الزامی است")
    })