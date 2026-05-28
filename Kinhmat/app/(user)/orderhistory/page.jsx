"use client"
import Link from 'next/link';
import styles from './style.module.css';
import { GetListorder_byid } from '../../../services/order';
import { useEffect, useState } from 'react';
import { Getiduser } from '../../../services/auth';
import { imgURLlocal } from '../../../assets/localhostimg';
// import { useEffect } from 'react';
function History() {
    return (
        <div className={styles.orderItem}>
            <div className={styles.stateorder}>
                <Link href='/Home'>Desmon</Link>
                <span>Hoàn thành</span>
            </div>
            <div className={styles.productDetail}>
                <div className={styles.productInfo}>
                    <img src="/images/product0.jpg" alt="M20D Helmet" className={styles.productImage} />
                    <div className={styles.textInfo}>
                        <span className={styles.productName}>M20D</span>
                        <span className={styles.productCategory}>Phân loại: Vàng, L</span>
                        <span className={styles.productQuantity}>Số lượng: 2</span>
                    </div>
                </div>
                <div className={styles.productPrice}>
                    <span className={styles.unitPrice}>77.250 ₫</span>
                </div>
            </div>
            <div className={styles.orderSummary}>
                <div className={styles.totalAmount}>
                    <span>Thành tiền:</span>
                    <span className={styles.totalPrice}>257.504 ₫</span>
                </div>
                <div className={styles.actionButtons}>
                    <button className={styles.reorderButton}>Mua lại</button>
                    <button className={styles.detailButton}>Xem chi tiết</button>
                </div>
            </div>
        </div>
    )
}
export default function Order_history() {

    const [listorder, setListorder] = useState([]);
    const render = async () => {
        const logdata = await GetListorder_byid(Getiduser());
        setListorder(logdata);
        console.log(logdata);

    }
    useEffect(() => {
        document.title="Lịch sử mua hàng";
        render();
    }, []);

    return (
        <div className={styles.history}>
            <div className={styles.historyCenter}>
                {/* Order Item 1 - Example from your image */}
                {
                    listorder.map(list => (
                        <div className={styles.orderItem}>
                            <div className={styles.stateorder}>
                                <Link href='/Home'>Desmon</Link>
                                <span>{list.trangthai}</span>
                            </div>

                            {(list.listjson_chitiet || []).map(item => (
                                <div className={styles.productDetail}>
                                    <div className={styles.productInfo}>
                                        <img src={`${imgURLlocal()}${item.anh}`} alt="M20D Helmet" className={styles.productImage} />
                                        <div className={styles.textInfo}>
                                            <span className={styles.productName}>{(item.ten)}</span>
                                            {/* <span className={styles.productCategory}>Phân loại: Vàng, L</span> */}
                                            <span className={styles.productQuantity}>Số lượng: {(item.soluong)}</span>
                                        </div>
                                    </div>
                                    <div className={styles.productPrice}>
                                        <span className={styles.unitPrice}>{(item.giaban)}</span>
                                    </div>
                                </div>
                            ))}


                            <div className={styles.orderSummary}>
                                <div className={styles.deliveryInfo}>
                                    <span className={styles.deliveryTitle}>Địa chỉ nhận hàng:</span>
                                    <span className={styles.deliveryName}>{list.ten} - {list.sdt}</span>
                                    <span className={styles.deliveryAddress}>{list.diachi}</span>
                                </div>
                                <div className={styles.summaryActionsGroup}>
                                    <div className={styles.totalAmount}>
                                        <span>Thành tiền:</span>
                                        <span className={styles.totalPrice}>{list.tongtien}</span>
                                    </div>
                                    <div className={styles.actionButtons}>
                                        <button className={styles.reorderButton}>Mua lại</button>
                                        <button className={styles.detailButton}>Xem chi tiết</button>
                                    </div>
                                </div>
                            </div>


                        </div>
                    ))
                }

            </div>
        </div>
    )
}
