import * as yup from 'yup';

export const sellCardSchema = yup
    .object({
        guarantees: yup.number().required("انتخاب گارانتی الزامی است."),
        color: yup.number().required("انتخاب رنگ الزامی است."),
        quantity: yup.number()
            .typeError('مقدار وارد شده باید یک عدد باشد')
            .min(1, 'مقدار وارد شده باید بزرگتر از صفر باشد')
            .required('انتخاب تعداد الزامی است.')
    })

