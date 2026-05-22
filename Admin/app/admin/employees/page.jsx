'use client';

import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import styles from './style.module.css'; // Import file CSS
import { GetallProduct } from "../../../services/admin/product"
import { FaEye } from "react-icons/fa";
import { MdEdit } from 'react-icons/md';
import { RiDeleteBinLine } from 'react-icons/ri';
import { apiGetall, apiUpdateRole } from '../../../services/login';
import { toast } from 'react-toastify';

const ITEMS_PER_PAGE = 6; // Số lượng sản phẩm hiển thị trên mỗi trang (được gửi lên API)

export default function ProductsPage() {
  const [listuser, setlistuser] = useState([]);

  const [editRole, setEditRole] = useState('');
  const [editState, setEditState] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setEditRole(user.role);
    setEditState(user.trangthai);
    setShowModal(true);


  };
  const handleSave = async () => {
    try {
      await apiUpdateRole(selectedUser.id, editRole, editState);
      toast.success("Cập nhật thành công!");
      setShowModal(false);
      fetchdata(); // gọi lại API để load danh sách mới
      localStorage.removeItem('token');
    } catch (error) {
      console.error("Cập nhật thất bại", error);
      toast.error("Lỗi cập nhật người dùng");
    }
  }
  const fetchdata = async () => {
    const data = await apiGetall();
    setlistuser(data.data);
    console.log(data);

  }
  useEffect(() => {
    fetchdata();
  }, [])

  return (
    <div className={styles['order-page']}>
      <h1 className={styles['order-title']}>Quản lý người dùng</h1>

      <div className={styles['order-search']}>
        <input
          type="text"
          placeholder="Tìm kiếm"
          className={styles['search-input']}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>



      <div className={styles['order-table-container']}>
        <table className={styles['order-table']}>
          <thead>
            <tr>
              <th>STT</th>
              <th>Username</th>
              <th>Tên</th>
              <th>Quyền</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {
              listuser.map((user, item) => (
                <tr key={item + 1} >
                  <td>{item + 1}</td>
                  <td>{user.username}</td>
                  <td>{user.ten}</td>
                  <td>{user.role}</td>
                  <td>
                    <span
                      className={
                        user.trangthai === 1
                          ? styles.active
                          : styles.locked
                      }
                    >
                      {user.trangthai === 1 ? 'Hoạt động' : 'Khóa'}
                    </span>
                  </td>
                  <td>
                    <button className={styles['view-button']} onClick={() => handleViewUser(user)} >
                      <FaEye size={18} />
                    </button>
                  </td>
                </tr>
              ))
            }


          </tbody>
        </table>
      </div>
      {showModal && selectedUser && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>

            <h2 style={{ margin: "15px 5px" }}>Username: {selectedUser.username}</h2>

            <div className={styles.rowgroup}>
              <label>Quyền:</label>
              <select value={editRole} onChange={(e) => setEditRole(e.target.value)}>
                <option value="Admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>

            <div className={styles.rowgroup}>
              <label>Trạng thái:</label>
              <select value={editState} onChange={(e) => setEditState(e.target.value)}>
                <option value="0">Khóa</option>
                <option value="1">Hoạt động</option>
              </select>
            </div>

            <div className={styles.modalActions}>
              <button onClick={handleSave}>Lưu</button>
              <button onClick={() => setShowModal(false)}>Đóng</button>

            </div>
          </div>
        </div>
      )}

    </div>

  );
}