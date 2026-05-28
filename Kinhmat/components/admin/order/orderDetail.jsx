'use client'

import styles from './style.module.css'

export default function OrderDetailModal({ isOpen, onClose }) {
  if (!isOpen) return null

  // Dữ liệu cứng
  const orderItems = [
    {
      id: 1,
      name: 'Kính mắt',
      quantity: 1,
      price: 100000,
      total: 100000,
      image: '/images/product/product1.jpg',
    },
  ]

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.left}>
          <button className={styles.closeButton} onClick={onClose}>x</button>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>STT</th>
                <th>Ảnh</th>
                <th>Tên sản phẩm</th>
                <th>Số lượng</th>
                <th>Đơn giá</th>
                <th>Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {orderItems.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>
                    <img src={item.image} alt="" className={styles.productImg} />
                  </td>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>{item.price.toLocaleString('vi-VN')} đ</td>
                  <td>{item.total.toLocaleString('vi-VN')} đ</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.right}>
          <p>Họ tên: Nguyễn Văn A</p>
          <p>SĐT: 0909123456</p>
          <p>Email: email@example.com</p>
          <p>Địa chỉ: 123 Đường ABC, Quận 1</p>
          <p>Ngày đặt hàng: 2024-01-01</p>

          <div className={styles.inputGroup}>
            <label>Ngày giao:</label>
            <input type="date" />
          </div>

          <div className={styles.inputGroup}>
            <label>Mã vận đơn:</label>
            <input type="text" />
          </div>

          <div className={styles.inputGroup}>
            <label>Đơn vị vận chuyển:</label>
            <input type="text" />
          </div>

          <p>Phí vận chuyển: 30.000 đ</p>
          <p>Tổng tiền sản phẩm: 100.000 đ</p>

          <button className={styles.confirmButton}>Xác nhận</button>
        </div>
      </div>
    </div>
  )
}
