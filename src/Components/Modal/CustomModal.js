import classes from "./CustomModal.module.scss"
import {Input,Select,Button,FileUpload} from "../index";
import JoditEditor from "jodit-react";
import {useEffect, useRef, useState} from "react";
import {IMG} from "../../config/urlConfig";
import {UploadImage,AddProduct,UpdateProduct} from "../../api";
import {toast} from "react-toastify";
import {useDispatch} from "react-redux";
import {clearProducts} from "../../store/productsSlice";

export function CustomModal({editMode, setEditMode, productData, options, setShowModal}) {
    const dispatch = useDispatch();
    const [fileObj, setFileObj] = useState([])
    const [imageUrls, setImageUrls] = useState([]);



    // this function show Images or files when user upload it.but before save it in db.
    function handleFileChange(productImages) {
        const files = Array.from(productImages);
        setFileObj(prevState => [...prevState, ...files])
        const urls = files.map(file => URL.createObjectURL(file));
        setImageUrls(prevState => [...prevState, ...urls]);
    }
    // I use useEffect Hook to clean the side effects of "show uploaded images"  after component dismount.
    useEffect(() => {
        return () => {
            imageUrls.forEach(url => URL.revokeObjectURL(url));
        };
    }, [imageUrls]);

    // remove the image by click
    function handleRemove(url) {
        setImageUrls(imageUrls.filter(item => item !== url))
    }

    // set State for edit mode or add new product
    const [formData, setFormData] = useState({
        "product-name-en": productData?.["product-name-en"] || "",
        "product-name-fa": productData?.["product-name-fa"] || "",
        "price": productData?.price || "",
        "guarantees": productData?.guarantees || [{id: 0}],
        "properties": productData?.properties || [{id: 0}],
        "description": productData?.description || {},
        "count": productData?.count || "",
        "category-id": productData?.["category-id"] || "",
        "colors": productData?.colors || [{id: 0}],
        "images": productData?.images || []
    })


    // Jodit Editor farsi config
    const editorFa = useRef(null);
    const configFa = {
        readonly: false,
        direction: 'rtl',
        minHeight: '300px',
        width: '97%',
        placeholder: 'تایپ کنید...',

    }
    // Jodit Editor english config
    const editorEn = useRef(null);
    const configEn = {
        readonly: false,
        direction: 'ltr',
        minHeight: '300px',
        width: '97%',
    }

    //  change color base on user selection in inputs(name of color and hex)
    const handleInputColorChange = (e, index) => {
        const {name, value} = e.target;
        const list = [...formData.colors];
        list[index][name] = value;
        setFormData(prevState => ({...prevState, colors: list}));
    };

    // remove color
    const handleRemoveColorClick = index => {
        const list = [...formData.colors];
        list.splice(index, 1);
        setFormData(prevState => ({...prevState, colors: list}));
    };

    // add new color row to add new color
    const handleAddColorClick = () => {
        setFormData(prevState => ({...prevState, colors: [...prevState.colors, {id: prevState.colors.length}]}));
    };

    // set new value base on change the guarantee
    const handleInputGuaranteeChange = (e, index) => {
        const {name, value} = e.target;
        const list = [...formData.guarantees];
        list[index][name] = value;
        setFormData(prevState => ({...prevState, guarantees: list}));
    };

    // remove the guarantee
    const handleRemoveGuaranteeClick = index => {
        const list = [...formData.guarantees];
        list.splice(index, 1);
        setFormData(prevState => ({...prevState, guarantees: list}));
    };

    // add new guarantee row
    const handleAddGuaranteeClick = () => {
        setFormData(prevState => ({
            ...prevState,
            guarantees: [...prevState.guarantees, {id: prevState.guarantees.length}]
        }));
    };

    // add or remove Properties dynamically
    const handleInputPropertyChange = (e, index) => {
        const {name, value} = e.target;
        const list = [...formData.properties];
        list[index][name] = value;
        setFormData(prevState => ({...prevState, properties: list}));
    };

    const handleRemovePropertyClick = index => {
        const list = [...formData.properties];
        list.splice(index, 1);
        setFormData(prevState => ({...prevState, properties: list}));
    };

    const handleAddPropertyClick = () => {
        setFormData(prevState => ({
            ...prevState,
            properties: [...prevState.properties, {id: prevState.properties.length}]
        }));
    };

    // submit the form base on the user is in edit mode or add new product
    async function handleSubmit(e) {
        e.preventDefault();
        // first upload the images if we have new file
        const reqConfig = {
            headers: {
                'content-type': 'multipart/form-data',
            }
        };
        let uploadedImages = [];
        if (imageUrls.length > 0) {
            for (const item of fileObj) {
                let formDataImages = new FormData();
                formDataImages.append("image", item);
                try {
                    const res = await UploadImage(formDataImages, reqConfig)
                    uploadedImages.push(res.data.filename)
                } catch (e) {
                    toast.error(e.message)
                }

            }
        }
        // after uploaded and if it's done successfully add it to form data
        let arrOfResults = await Promise.all(uploadedImages);
        formData.images = [...formData.images,...arrOfResults]
        formData.thumbnail = formData.images[0]
        if (!editMode) {
            formData.likes = [];
            formData.comments=[];
            try {
                const res = await AddProduct(formData)
                res.status === 201 && toast.success("محصول با موفقیت اضافه گردید")
                setShowModal(false)
                dispatch(clearProducts())
            } catch (e) {
                toast.error(e.message)
            }
        } else {
            try {
                const combineData= {...productData,...formData,updatedAt:Date.now()}
                delete combineData.id;
                const res = await UpdateProduct(productData?.id, combineData)
                res.status === 200 && toast.success("محصول با موفقیت ویرایش گردید")
                dispatch(clearProducts())
                setShowModal(false)
                setEditMode(false)
            } catch (e) {
                toast.error(e.message)
            }

        }
        setFormData({
            "product-name-en": productData?.["product-name-en"] || "",
            "product-name-fa": productData?.["product-name-fa"] || "",
            "price": productData?.price || "",
            "guarantees": productData?.guarantees || [{id: 0}],
            "properties": productData?.properties || [{id: 0}],
            "description": productData?.description || {},
            "count": productData?.count || "",
            "category-id": productData?.["category-id"] || "",
            "colors": productData?.colors || [{id: 0}],
            "images": productData?.images || []
        })
    }

    return (
        <div className={classes.modal}>
            <div className={classes["modal-content"]}>
                <div className={classes.closeContainer}>
                    <p onClick={() => setShowModal(false)} className={classes.close}>&times;</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className={classes.productName}>
                        <div className={classes.inputContainer}>
                            <Input required type="text" label="نام محصول(فارسی)" value={formData["product-name-fa"]}
                                   onChange={e => setFormData(prevState => ({
                                       ...prevState,
                                       "product-name-fa": e.target.value
                                   }))}/>
                        </div>
                        <div className={classes.inputContainer}>
                            <Input required type="text" label="نام محصول(انگلیسی)"
                                   value={formData["product-name-en"]}
                                   onChange={e => setFormData(prevState => ({
                                       ...prevState,
                                       "product-name-en": e.target.value
                                   }))}/>
                        </div>
                    </div>
                    <hr/>
                    <div className={classes.productName}>
                        <div className={classes.detailContainer}>
                            <label>توضیحات محصول (فارسی) : </label>
                            <JoditEditor
                                ref={editorFa}
                                value={formData?.["description"].fa}
                                config={configFa}
                                tabIndex={1}
                                onBlur={newContent => setFormData(prevState => ({
                                    ...prevState,
                                    description: {...prevState.description, fa: newContent}
                                }))}

                            />
                        </div>
                        <div className={classes.detailContainer}>
                            <label>توضیحات محصول (انگلیسی) : </label>
                            <JoditEditor
                                ref={editorEn}
                                value={formData?.["description"].en}
                                config={configEn}
                                tabIndex={1}
                                onBlur={newContent => setFormData(prevState => ({
                                    ...prevState,
                                    description: {...prevState.description, en: newContent}
                                }))}

                            />
                        </div>
                    </div>
                    <hr/>
                    <div className={classes.productName}>
                        <div className={classes.amount}>
                            <div>
                                <Input required type="number" label="قیمت" value={formData.price?.amount}
                                       min={0} onChange={e => setFormData(prevState => ({
                                    ...prevState,
                                    price: {...prevState.price, amount: e.target.value}
                                }))}/>
                            </div>
                            <div>
                                <Input required type="number" label="تخفیف"
                                       value={formData.price?.["amount-discount"]}
                                       min={0} onChange={e => setFormData(prevState => ({
                                    ...prevState,
                                    price: {...prevState.price, "amount-discount": e.target.value}
                                }))}/>
                            </div>
                            <div>
                                <Input required type="number" label="مقدار" value={formData.count} min={0}
                                       onChange={e => setFormData(prevState => ({
                                           ...prevState,
                                           count: e.target.value
                                       }))}/>
                            </div>
                            <div>
                                <Select label="برند" options={options} value={formData["category-id"]}
                                        onChange={e => setFormData(prevState => ({
                                            ...prevState,
                                            "category-id": e.target.value
                                        }))}/>
                            </div>
                        </div>
                    </div>
                    <hr/>
                    {
                        formData.colors.map((color, index) => (
                            <div className={classes.productName} key={index}>
                                <div className={classes.colorRow}>
                                    <div className={classes.colorText}>
                                        <div>
                                            <Input required value={color?.['name-fa']}
                                                   placeholder={`نام فارسی رنگ ${index + 1} : `} type="text"
                                                   name="name-fa"
                                                   onChange={e => handleInputColorChange(e, index)}/>
                                        </div>
                                        <div>
                                            <Input required value={color?.['name-en']}
                                                   placeholder={`نام انگلیسی رنگ ${index + 1} : `} type="text"
                                                   name="name-en"
                                                   onChange={e => handleInputColorChange(e, index)}/>
                                        </div>
                                        <div>
                                            <Input required className={classes.hex} value={color?.hex}
                                                   placeholder={`کد رنگ ${index + 1} : `} type="color" name="hex"
                                                   onChange={e => handleInputColorChange(e, index)}/>
                                        </div>
                                    </div>

                                    <div>
                                        {
                                            formData.colors.length !== 1 &&
                                            <Button onClick={() => {
                                                handleRemoveColorClick(index)
                                            }}>حذف</Button>
                                        }
                                        {
                                            formData.colors.length - 1 === index &&
                                            <Button className={classes.btn} onClick={handleAddColorClick}> اضافه
                                                کردن</Button>
                                        }
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                    <hr/>
                    {
                        formData.guarantees.map((guarantee, index) => (
                            <div className={classes.productName} key={index}>
                                <div className={classes.guranteeRow}>
                                    <div className={classes.guranteeText}>
                                        <div>
                                            <Input required value={guarantee['name-fa']}
                                                   placeholder={`نام فارسی گارانتی ${index + 1} : `} type="text"
                                                   name={`name-fa`}
                                                   onChange={e => handleInputGuaranteeChange(e, index)}/>
                                        </div>
                                        <div>
                                            <Input required value={guarantee['name-en']}
                                                   placeholder={`نام انگلیسی گارانتی ${index + 1} : `} type="text"
                                                   name={`name-en`}
                                                   onChange={e => handleInputGuaranteeChange(e, index)}/>
                                        </div>
                                    </div>

                                    <div>
                                        {formData.guarantees.length !== 1 &&
                                            <Button onClick={() => {
                                                handleRemoveGuaranteeClick(index);
                                            }
                                            }>حذف</Button>}
                                        {formData.guarantees.length - 1 === index &&
                                            <Button className={classes.btn} onClick={handleAddGuaranteeClick}>اضافه
                                                کردن</Button>}
                                    </div>
                                </div>
                            </div>
                        ))
                    }

                    <hr/>
                    {
                        formData.properties.map((property, index) => (
                            <div className={classes.productName} key={index}>
                                <div className={classes.guranteeRow}>
                                    <div className={classes.guranteeText}>
                                        <div>
                                            <Input required value={property['name-fa']}
                                                   placeholder={`نام فارسی ویژگی ${index + 1} : `} type="text"
                                                   name={`name-fa`} id={`name-fa`}
                                                   onChange={e => handleInputPropertyChange(e, index)}/>
                                        </div>
                                        <div>
                                            <Input required value={property['name-en']}
                                                   placeholder={`نام انگلیسی ویژگی ${index + 1} : `} type="text"
                                                   name={`name-en`} id={`name-en`}
                                                   onChange={e => handleInputPropertyChange(e, index)}/>
                                        </div>
                                        <div>
                                            <Input required value={property.value}
                                                   placeholder={`مقدار ویژگی ${index + 1} : `}
                                                   type="text" name={`value`} id={`value`}
                                                   onChange={e => handleInputPropertyChange(e, index)}/>
                                        </div>
                                    </div>
                                    <div>
                                        {formData.properties.length !== 1 &&
                                            <Button onClick={() => {
                                                handleRemovePropertyClick(index)
                                            }}>حذف</Button>
                                        }
                                        {formData.properties.length - 1 === index &&
                                            <Button className={classes.btn} onClick={handleAddPropertyClick}>اضافه
                                                کردن</Button>
                                        }
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                    <hr/>

                    <div className={classes.imageSection}>
                        <div>
                            {
                                <>
                                    <p> ( توجه : تصویر اول به عنوان thumbnail انتخاب می شود)</p>
                                    <FileUpload handleChange={handleFileChange} products={imageUrls}
                                                handleRemove={handleRemove}/>
                                    <p> تعداد تصویر : {imageUrls.length || 0} </p>
                                </>
                            }
                        </div>
                        <div className={classes.imagesContainer}>
                            {(formData.images).map((url, index) => (
                                <div key={index} className={classes.imgContainer}>
                                    <p className={classes.delete} onClick={() => {
                                        const newFileArray = formData.images.filter(file => file !== url);
                                        setFormData(prevState => ({...prevState, images: newFileArray}));
                                    }}>&times;</p>

                                    {

                                        <img src={IMG + "/files/" + url} alt={"mobile phone"}/>

                                    }
                                </div>
                            ))}
                        </div>
                    </div>

                    <hr/>
                    <Button type="submit">ذخیره</Button>
                </form>
            </div>
        </div>
    );
}

