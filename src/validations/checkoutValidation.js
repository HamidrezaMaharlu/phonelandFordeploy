import * as yup from 'yup';
export const checkoutSchema = yup
    .object({
        firstName:yup.string().min(3,"نام باید حداقل 3 واژه باشد").required("تکمیل نام الزامی است."),
        lastName:yup.string().min(3,"نام خانوادگی باید حداقل 3 واژه باشد").required("تکمیل نام خانوادگی الزامی است."),
        phone:yup.string().matches(/^09\d{9}$/,"باید با 09 آغاز شود و 11 رقم باشد").required("تکمیل شماره موبایل الزامی است"),
        email: yup.string().email("ایمیل معتبر وارد نمایید").required("تکمیل نام کاربری الزامی است."),
        city:yup.string().min(2," شهر باید حداقل 3 واژه باشد").required("تکمیل شهر الزامی است."),
        state:yup.string().min(2,"استان باید حداقل 3 واژه باشد").required("تکمیل استان الزامی است."),
        address:yup.string().min(5,"آدرس باید حداقل 3 واژه باشد").required("تکمیل آدرس الزامی است."),
        zip:yup.string().matches(/^\d{10}$/,"باید 10 رقم باشد").required("تکمیل کد پستی الزامی است"),
    })