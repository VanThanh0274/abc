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
    const [selectedOrder, setSelectedOrder] = useState(null);
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
                    listorder.map((list, index) => (
                        <div key={list.id || index} className={styles.orderItem}>
                            <div className={styles.stateorder}>
                                <span style={{fontWeight: 'bold', color: '#000'}}>Mã đơn: #{list.mahd}</span>
                                <span>{list.trangthai}</span>
                            </div>

                            {(list.listjson_chitiet || []).map((item, idx) => (
                                <div key={item.id || item.masp || idx} className={styles.productDetail}>
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
                                    <div className={styles.totalAmount} style={{flexDirection: 'column', alignItems: 'flex-end', gap: '4px'}}>
                                        <div style={{fontSize: '14px', color: '#666', display: 'flex', gap: '8px', justifyContent: 'flex-end', width: '100%'}}>
                                            <span>Tạm tính (Giá gốc): </span>
                                            <span>{Number((list.listjson_chitiet || []).reduce((acc, item) => acc + (item.giaban || 0) * (item.soluong || 0), 0)).toLocaleString('vi-VN')} đ</span>
                                        </div>
                                        {list.tien_giam > 0 && (
                                        <div style={{fontSize: '14px', color: '#ff4d4f', display: 'flex', gap: '8px', justifyContent: 'flex-end', width: '100%'}}>
                                            <span>Giảm giá: </span>
                                            <span>-{Number(list.tien_giam || 0).toLocaleString('vi-VN')} đ</span>
                                        </div>
                                        )}
                                        <div style={{fontSize: '14px', color: '#666', display: 'flex', gap: '8px', justifyContent: 'flex-end', width: '100%'}}>
                                            <span>Phí vận chuyển: </span>
                                            <span>{Number((list.tongtien || 0) - Math.max(0, (list.listjson_chitiet || []).reduce((acc, item) => acc + (item.giaban || 0) * (item.soluong || 0), 0) - (list.tien_giam || 0))).toLocaleString('vi-VN')} đ</span>
                                        </div>
                                        <div style={{fontSize: '18px', fontWeight: 'bold', display: 'flex', gap: '8px', justifyContent: 'flex-end', width: '100%', marginTop: '4px'}}>
                                            <span>Tổng thanh toán: </span>
                                            <span className={styles.totalPrice}>{Number(list.tongtien || 0).toLocaleString('vi-VN')} đ</span>
                                        </div>
                                    </div>
                                    <div className={styles.actionButtons}>
                                        <button className={styles.reorderButton}>Mua lại</button>
                                        <button className={styles.detailButton} onClick={() => setSelectedOrder(list)}>Xem chi tiết</button>
                                    </div>
                                </div>
                            </div>


                        </div>
                    ))
                }

            {selectedOrder && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999,
                    display: 'flex', justifyContent: 'center', alignItems: 'center'
                }} onClick={() => setSelectedOrder(null)}>
                    <div style={{
                        backgroundColor: '#fff', padding: '20px', borderRadius: '10px',
                        width: '90%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto',
                        position: 'relative', color: '#333'
                    }} onClick={e => e.stopPropagation()}>
                        <button style={{
                            position: 'absolute', top: '10px', right: '15px',
                            background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer'
                        }} onClick={() => setSelectedOrder(null)}>×</button>
                        <h2 style={{marginTop: 0, fontSize: '20px', fontWeight: 'bold'}}>Chi tiết đơn hàng #{selectedOrder.mahd}</h2>
                        <div style={{display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px', marginTop: '15px'}}>
                            <p style={{margin: 0}}><strong>Ngày đặt:</strong> {new Date(selectedOrder.thoigian).toLocaleString('vi-VN')}</p>
                            <p style={{margin: 0}}><strong>Trạng thái:</strong> <span style={{color: '#ff4d4f', fontWeight: 'bold'}}>{selectedOrder.trangthai}</span></p>
                            <hr style={{margin: '10px 0', borderColor: '#eee', borderWidth: '1px'}} />
                            <p style={{margin: 0}}><strong>Khách hàng:</strong> {selectedOrder.ten}</p>
                            <p style={{margin: 0}}><strong>Số điện thoại:</strong> {selectedOrder.sdt}</p>
                            <p style={{margin: 0}}><strong>Địa chỉ:</strong> {selectedOrder.diachi}</p>
                            <p style={{margin: 0}}><strong>Ghi chú:</strong> {selectedOrder.ghichu || 'Không có'}</p>
                            <hr style={{margin: '10px 0', borderColor: '#eee', borderWidth: '1px'}} />
                            <h3 style={{margin: '0 0 10px 0', fontSize: '16px'}}>Sản phẩm</h3>
                            <ul style={{listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px'}}>
                                {(selectedOrder.listjson_chitiet || []).map((item, idx) => (
                                    <li key={idx} style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                                        <img src={`${imgURLlocal()}${item.anh}`} alt="" style={{width: '50px', height: '50px', objectFit: 'contain', border: '1px solid #eee', borderRadius: '5px'}} />
                                        <div style={{flex: 1}}>
                                            <p style={{margin: 0, fontWeight: 'bold'}}>{item.ten}</p>
                                            <p style={{margin: 0, fontSize: '12px', color: '#666'}}>SL: {item.soluong} x {Number(item.giaban).toLocaleString('vi-VN')} đ</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            <hr style={{margin: '10px 0', borderColor: '#eee', borderWidth: '1px'}} />
                            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                <span>Tạm tính (Giá gốc):</span>
                                <span>{Number((selectedOrder.listjson_chitiet || []).reduce((acc, item) => acc + (item.giaban || 0) * (item.soluong || 0), 0)).toLocaleString('vi-VN')} đ</span>
                            </div>
                            {selectedOrder.tien_giam > 0 && (
                            <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '5px'}}>
                                <span>Giảm giá:</span>
                                <span style={{color: '#ff4d4f'}}>-{Number(selectedOrder.tien_giam || 0).toLocaleString('vi-VN')} đ</span>
                            </div>
                            )}
                            <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '5px'}}>
                                <span>Phí vận chuyển:</span>
                                <span style={{color: '#666'}}>{Number((selectedOrder.tongtien || 0) - Math.max(0, (selectedOrder.listjson_chitiet || []).reduce((acc, item) => acc + (item.giaban || 0) * (item.soluong || 0), 0) - (selectedOrder.tien_giam || 0))).toLocaleString('vi-VN')} đ</span>
                            </div>
                            <hr style={{margin: '10px 0', borderColor: '#eee', borderWidth: '1px'}} />
                            <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 'bold', color: '#ff4d4f'}}>
                                <span>Tổng thanh toán:</span>
                                <span>{Number(selectedOrder.tongtien || 0).toLocaleString('vi-VN')} đ</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            </div>
        </div>
    )
}
