import React from 'react';
import classes from "./FileUpload.module.scss";

export function FileUpload({ handleChange,products,handleRemove }) {
    return (
        <div className={classes["image-selector"]}>
             یک عکس را در این کادر قرار دهید یا
            <label>
                یک عکس انتخاب کنید
                <input
                    type="file"
                    className={classes["file-input"]}
                    multiple
                    accept="image/*"
                    onChange={(e) => handleChange(e.target.files)}
                />
            </label>
            {products.length>0? products.map((url,index)=><img alt="product" key={index} height="100" width="100" src={url} id="product-display" onClick={()=>handleRemove(url)} />):<img height="100" width="100" id="product-display" />}
        </div>
    );
}


