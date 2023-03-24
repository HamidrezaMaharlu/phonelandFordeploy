import React from 'react';
import classes from "./Footer.module.scss";
import {Link} from "react-router-dom";
import Logo from "../../assets/images/logo2-PhotoRoom.png-PhotoRoom.png"

function Footer() {
    return (
        <>
            <div className={classes.footerContent}>

                <div className={classes.aboutUs}>
                    <div>
                        <img src={Logo} alt="logo"/>
                    </div>
                    <p>
                        فونلند با گستره‌ای از برندهای متنوع برای تمام اقشار جامعه، «تجربه‌ی لذت‌بخش یک
                        خرید آسان» را به ارمغان می آورد.
                    </p>
                </div>

                <div className={classes.another}>
                    <strong>اطلاعات</strong>
                    <Link to='#'>درباره ما</Link>
                    <Link to='#'>تماس با ما</Link>
                    <Link to='#'>قوانین و مقررات</Link>
                    <Link to='#'>حریم خصوصی</Link>
                </div>

                <div className={classes.services}>
                    <strong>خدمات مشتریان</strong>
                    <Link to='#'>تخفیف ها</Link>
                    <Link to='#'>سوالات متداول</Link>
                    <Link to='#' >مرجوع کردن کالا</Link>
                </div>

                <div className={classes.help}>
                    <strong>راهنما</strong>

                    <Link to='#'>فرصت شغلی</Link>
                    <Link to='#'>بازاریابی</Link>
                    <Link to='#'>خدمات پس از فروش</Link>
                </div>

                <div className={classes.contactUs}>
                    <strong>تماس با ما</strong>
                    <Link className="IRANSans" to="tel:0938414273">0938414273</Link>
                    <Link className="IRANSans" to="tel:0713666622">0713666622</Link>
                    <Link className="IRANSans"  to="tel:0922999229">0922999229 </Link>
                    <Link to="mailto:test@gmail.com">test@gmail.com</Link>
                </div>

            </div>

            <div className={classes.footerCopyRight}>
                <p>تمامی حقوق برای شرکت فونلند محفوظ است ©️ </p>
            </div>
        </>
    );
}

export default Footer;