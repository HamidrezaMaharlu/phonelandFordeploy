import * as yup from 'yup';
const persianRegex = /[\u0600-\u06FF]/;
export const registerSchema = yup
    .object({
        password: yup.string()
            .min(8, 'رمز عبور باید حداقل 8 واژه باشد')
            .max(30, 'رمز عبور باید حداکثر 12 واژه باشد')
            .matches(/[a-z]/, 'رمز عبور باید شامل یک حرف کوچک باشد')
            .matches(/[A-Z]/, 'رمز عبور باید شامل یک حرف بزرگ باشد')
            .matches(/[0-9]/, 'رمز عبور باید شامل یک عدد باشد')
            .matches(/[^A-Za-z0-9]/, 'رمز عبور باید شامل یک کاراکتر($%*) باشد')
            .test('no-persian', 'رمز عبور نمی تواند شامل حروف فارسی باشد', (value) => {
                    return !persianRegex.test(value);
            })
            .required("تکمیل رمز عبور الزامی است"),
        confirmPassword: yup.string().required('تکرار رمز عبور الزامی است').oneOf([yup.ref('password')], 'با گذرواژه هم خوانی ندارد'),
        firstName: yup.string().min(3, "نام باید حداقل 3 واژه باشد").required("تکمیل نام الزامی است.").matches(/^[\u0600-\u06FF\s]*$/, 'حروف فارسی مجاز است.'),
        lastName: yup.string().min(3, "نام خانوادگی باید حداقل 3 واژه باشد").required("تکمیل نام خانوادگی الزامی است.").matches(/^[\u0600-\u06FF\s]*$/, 'حروف فارسی مجاز است.'),
        phone: yup.string().matches(/^09\d{9}$/, "باید با 09 آغاز شود و 11 رقم باشد").required("تکمیل شماره موبایل الزامی است"),
        email: yup.string().email("ایمیل معتبر وارد نمایید").required("تکمیل ایمیل الزامی است."),
        city: yup.string().min(2, " شهر باید حداقل 2 واژه باشد").required("تکمیل شهر الزامی است.").matches(/^[\u0600-\u06FF\s]*$/, 'حروف فارسی مجاز است.'),
        state: yup.string().min(2, "استان باید حداقل 2 واژه باشد").required("تکمیل استان الزامی است.").matches(/^[\u0600-\u06FF\s]*$/, 'حروف فارسی مجاز است.'),
        address: yup.string().min(5, "آدرس باید حداقل 3 واژه باشد").required("تکمیل آدرس الزامی است."),
        zip: yup.string().matches(/^\d{10}$/, "باید 10 رقم باشد").required("تکمیل کد پستی الزامی است"),
    })