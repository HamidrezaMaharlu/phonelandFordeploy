import React, {useEffect} from 'react';
import classes from "./Product.module.scss"
import {GetProduct} from "../../api/index";
import {useLoaderData} from "react-router-dom";
import {ProductImageSlider,Select,Button,Input,TabContainer} from "../../Components/index";
import {json} from "react-router-dom";
import {convertNumber} from "../../utils/utils";
import {Controller, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {sellCardSchema} from "../../validations/sellCardValidation";
import {useDispatch} from "react-redux";
import {addBasket, calculate} from "../../store/basketSlice";
import {toast} from "react-toastify";

export function Product() {
    const dispatch = useDispatch()
    const {register, handleSubmit, formState: {errors, isValid}, reset, control} = useForm({
        mode: 'onChange',
        resolver: yupResolver(sellCardSchema)
    });
    const product = useLoaderData()


    function handleBasket(formData) {
        const color = product.colors.find(item => item.id === formData.color)
        const guarantee = product.guarantees.find(item => item.id === formData.guarantees)
        const basket = {
            thumbnail: product.thumbnail,
            "product-name-fa": product["product-name-fa"],
            price: product.price,
            colors: color,
            guarantees: guarantee,
            amount: formData.quantity,
            id: product.id + color["name-en"],
            productId:product.id
        }
        if (basket.amount > product.count) {
            toast.error("تعداد انتخاب شده بیشتر از موجودی میباشد")
            return
        }
        dispatch(addBasket(basket))
        dispatch(calculate())
        reset()
        toast.success("محصول به سبد خرید اضافه گردید")
    }
    useEffect(() => {
        document.title = 'فونلند | انتخاب محصول';
    }, []);

    return (
        <>
            <div className={classes.container}>
                <div className={classes.productContainer}>
                    <div className={classes.slider}>
                        <ProductImageSlider productImages={product}/>
                    </div>
                    <div className={classes.description}>
                        <h1>{product['product-name-fa']}</h1>
                        <h3>{product['product-name-en']}</h3>
                        <hr/>
                        <div className={classes.joditText}>
                            <div dangerouslySetInnerHTML={{__html: product?.description.fa}}/>
                        </div>
                    </div>
                    <div className={classes.sell}>
                        <form onSubmit={handleSubmit(handleBasket)}>
                            {product && <Controller
                                name="guarantees"
                                control={control}
                                render={({field}) => <Select {...field} classname={classes.gurantee}
                                                             label="انتخاب گارانتی:" name="guarantees"
                                                             options={product?.guarantees}/>}/>}
                            {product && <Controller
                                name="color"
                                control={control}
                                render={({field}) => <Select {...field} classname={classes.color} label="انتخاب رنگ:"
                                                             name="color"
                                                             options={product?.colors}/>}/>}
                            <Input validation={{...register("quantity")}} label="تعداد" name="quantity" type="number"
                                   className={classes.quantity} error={errors.quantity?.message}/>
                            <hr/>
                            <div className={classes.sellCard}>
                                {product.count > 0 ? <p>✔️موجود در انبار فونلند</p> : <p>❌عدم موجودی</p>}
                                <div className={classes.price}>
                                    <p className={`IRANSans ${+product.price["amount-discount"] ? classes.underline : ""}`}>{convertNumber(product.price.amount)}</p>
                                    {+product.price["amount-discount"] ?
                                        <p className={`IRANSans`}>{convertNumber(product.price.amount - product.price["amount-discount"])}</p> : ""}
                                    <p className={`IRANSans`}>تومان</p>
                                </div>
                            </div>
                            <hr/>
                            <div className={classes.btn}>
                                <Button type="submit" disabled={!isValid||+product.count===0}>افزودن به سبد</Button>
                            </div>
                        </form>
                    </div>
                </div>
                <div className={classes.tabSection}>
                    <TabContainer descriptionText={product.description.fa} technicalText={product.properties}
                                  commentText={product.comments}/>
                </div>
            </div>
        </>
    )
}



export async function getProductLoader({params}) {
    try {
        const res = await GetProduct(params.productId)
        if (res.status === 200) {
            return res.data
        }
    } catch (e) {
        throw json({message: e.message}, {status: e.status})
    }

}