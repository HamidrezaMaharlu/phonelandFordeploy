import React, {useEffect, useState} from 'react';
import classes from "./ModalCategory.module.scss";
import {Input,Button,FileUpload} from "../index";
import {UploadImage} from "../../api";
import {IMG} from "../../config/urlConfig";
import {toast} from "react-toastify";
import {AddCategory, EditCategory} from "../../api";
import {useDispatch} from "react-redux";
import {clearCategory} from "../../store/categorySlice";


export function ModalCategory({editMode, setEditMode, productData, setShowModal}) {
    const dispatch = useDispatch()
    const [fileObj, setFileObj] = useState([])
    const [imageUrls, setImageUrls] = useState([]);

    function handleFileChange(productImages) {
        const files = Array.from(productImages);
        setFileObj(prevState => [...prevState, ...files])
        const urls = files.map(file => URL.createObjectURL(file));
        setImageUrls(prevState => [...prevState, ...urls]);
    }

    useEffect(() => {
        return () => {
            imageUrls.forEach(url => URL.revokeObjectURL(url));
        };
    }, [imageUrls]);

    function handleRemove(url) {
        setImageUrls(imageUrls.filter(item => item !== url))
    }

    async function handleSave(e) {
        e.preventDefault()
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

        let arrOfResults = await Promise.all(uploadedImages);
        if (arrOfResults.length > 0) formData.icon = arrOfResults[0]
        if (editMode) {
            formData.id = productData.id
            try {
                const res = await EditCategory(formData)
                setFormData({
                    "name-en": productData?.["name-en"] || "",
                    "name-fa": productData?.["name-fa"] || "",
                    "icon": productData?.icon || "",
                })
                res.status === 200 && toast.success("برند با موفقیت ویرایش گردید")
                setShowModal(false)
                setEditMode(false)
                dispatch(clearCategory())
            } catch (e) {
                toast.error(e.message)
            }
        } else {
            try {
                const res = await AddCategory(formData)
                setFormData({
                    "name-en": productData?.["name-en"] || "",
                    "name-fa": productData?.["name-fa"] || "",
                    "icon": productData?.icon || "",
                })
                res.status === 201 && toast.success("برند با موفقیت اضافه گردید")
                setShowModal(false)
                dispatch(clearCategory())
            } catch (e) {
                toast.error(e.message)
            }
        }
    }


    const [formData, setFormData] = useState({
        "name-en": productData?.["name-en"] || "",
        "name-fa": productData?.["name-fa"] || "",
        "icon": productData?.icon || "",
    })


    return (
        <div className={classes.modal}>
            <div className={classes["modal-content"]}>
                <div className={classes.closeContainer}>
                    <p onClick={() => {
                        setShowModal(false)
                        setEditMode(false)
                    }}
                       className={classes.close}>&times;</p>
                </div>
                <form onSubmit={handleSave}>
                    <div >
                        <div>
                            <Input required type="text" label="نام برند(فارسی)" value={formData["name-fa"]}
                                   onChange={e => setFormData(prevState => ({
                                       ...prevState,
                                       "name-fa": e.target.value
                                   }))}/>
                        </div>
                        <div>
                            <Input required type="text" label="نام برند(انگلیسی)"
                                   value={formData["name-en"]}
                                   onChange={e => setFormData(prevState => ({
                                       ...prevState,
                                       "name-en": e.target.value
                                   }))}/>
                        </div>
                    </div>
                    <hr/>
                    <div>

                        <FileUpload handleChange={handleFileChange} products={imageUrls}
                                    handleRemove={handleRemove}/>

                        {editMode && <div className={classes.icon}>
                            <img src={IMG + "/files/" + formData.icon} alt={"product"}/>
                        </div>}
                    </div>
                    <hr/>
                    <Button type="submit">ذخیره</Button>
                </form>
            </div>
        </div>
    );
}

