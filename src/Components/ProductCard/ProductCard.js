import React from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHeart} from "@fortawesome/free-regular-svg-icons";
import {faPlus, faHeart as fasHeart} from "@fortawesome/free-solid-svg-icons";
import classes from "./ProductCard.module.scss";
import {checkUserExpired, convertNumber, getTokenData} from "../../utils/utils";
import {Link} from "react-router-dom";
import {useDispatch} from "react-redux";
import {addBasket, calculate} from "../../store/basketSlice";
import {toast} from "react-toastify";
import {IMG} from "../../config/urlConfig";
import {UpdateLike} from "../../api";
import {clearProducts} from "../../store/productsSlice";


export function ProductCard({id, name, price, color, image, like, Item}) {
    const dispatch = useDispatch()
    let userId, findUserLikeOrDislike;
    if (checkUserExpired()) {
        const {id} = getTokenData()
        userId = id
    }
    if (like) {
        findUserLikeOrDislike = like.includes(userId)
    }

    function handleAdd(Item, color) {
        const basket = {
            thumbnail: Item.thumbnail,
            price: Item.price,
            "product-name-fa": Item["product-name-fa"],
            colors: color,
            guarantees: Item.guarantees[0],
            amount: 1,
            id: Item.id + color["name-en"],
            productId: Item.id
        }
        dispatch(addBasket(basket))
        dispatch(calculate())
        toast.success("محصول با موفقیت اضافه گردید")
    }

    async function handleLiked(id, like) {
        if (!checkUserExpired()) {
            toast.error("ابتدا وارد سایت شوید")
        } else {
            const newLike = [...like]
            try {
                if (newLike.includes(userId)) {
                    newLike.splice(newLike.indexOf(userId), 1); // remove value if it exists
                    const res = await UpdateLike(id, {likes: newLike})
                    if (res.status === 200) {
                        dispatch(clearProducts())
                    }
                } else {
                    newLike.push(userId); // add value if it doesn't exist
                    const res = await UpdateLike(id, {likes: newLike})
                    if (res.status === 200) {
                        toast("ممنون که  پسندید🎉")
                        dispatch(clearProducts())
                    }
                }
            } catch (e) {
                toast.error(e.message)
            }

        }
    }

    return (
        <div className={classes["product--container"]}>
            <div className={classes.image}>
                <img src={`${IMG}/files/${image || Item.thumbnail}`} alt="samsung"/>
            </div>
            <div className={classes["product--details"]}>
                <Link to={`/product/${id || Item.id}`}><h3>{name || Item["product-name-fa"]}</h3></Link>
                <hr/>
                <p className={"IRANSans"}>{price ? `${convertNumber(price)} تومان` : `${convertNumber(Item.price.amount)} تومان `}</p>
            </div>
            {color && <div className={classes["product--icons"]}>
                {findUserLikeOrDislike ?
                    < FontAwesomeIcon onClick={() => handleLiked(id, like, name, price, color, image,)} icon={fasHeart}
                                      size={"xl"}
                                      color={"#dd4163"}/> :
                    < FontAwesomeIcon onClick={() => handleLiked(id, like, name, price, color, image)} icon={faHeart}
                                      size={"xl"}
                                      color={"#dd4163"}/>
                }
                <FontAwesomeIcon onClick={() => handleAdd(Item, color)} icon={faPlus}
                                 size={"xl"} color={"#dd4163"}/>
                <span style={{backgroundColor: `${color.hex}`}}></span>
            </div>}
        </div>
    );
}

