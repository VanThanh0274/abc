'use client';
import './style.css';

import { CreatCategory, DeleteCategory, getAllCategory, searchCategory, UpdateCategory } from '../../../services/admin/category';

import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { RiDeleteBinLine } from "react-icons/ri";
import { MdEdit } from "react-icons/md";

export default function Danhmuc() {
    const [showModal, setShowModal] = useState(false);
    const [category, setcategory] = useState([]);
    const [isEditmode, setIseditmode] = useState(false);
    const [error, seterror] = useState({ tendanhmuc: false, mota: false })
    const [newcategory, setNewcategory] = useState(
        {
            tendanhmuc: "",
            mota: ""
        }
    )
    const [editId, setEditId] = useState(null);

    const handleSave = async () => {
        const newErrors = {
            tendanhmuc: false,
            mota: false
        }
        if (!newcategory.tendanhmuc.trim()) {
            newErrors.tendanhmuc = true;
        }

        if (!newcategory.mota.trim()) {
            newErrors.mota = true;
        }

        if (newErrors.tendanhmuc || newErrors.mota) {
            seterror(newErrors);
            toast.error("Vui lòng điền đầy đủ thông tin");
            return;
        }

        seterror(newErrors);
        

        try {
            if (editId !== null) {
                // đang sửa
                await UpdateCategory({ ma: editId, ...newcategory });
                toast.success("Sửa thành công");
            } else {
                // đang thêm mới
                await CreatCategory(newcategory);
                toast.success("Thêm thành công");
            }
            const updated = await getAllCategory();
            setcategory(updated);
            setShowModal(false);//đóng form
            setNewcategory({ tendanhmuc: '', mota: '' });
            setEditId(null); // reset trạng thái sửa
        } catch (error) {
            alert("Lưu danh mục thất bại");
            console.error(error);
        }
    };

    const clickDelete = async (id) => {
        await DeleteCategory(id);
        const update = await getAllCategory();
        setcategory(update);
    }

    const clickEdit = async (obj) => {
        setNewcategory({ tendanhmuc: obj.tendanhmuc, mota: obj.mota });
        setEditId(obj.ma); // lưu id để sửa
        setShowModal(true);
        setIseditmode(true);


    }
    const searchdanhmuc = async (danhmuc) => {
        const data = await searchCategory(danhmuc);
        setcategory(data);
    }

    useEffect(() => {
        
        document.title="Quản lý danh mục"

        const fetchData = async () => {
            
            const data = await getAllCategory();
            setcategory(data);
        }
        fetchData();

    }, [])
    return (
        <div>
            <div className="QL-right-category">
                <div className="ql-top">
                    <h1>Danh mục</h1>
                </div>

                <div className="ql-main">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <input type="text" placeholder="Tìm kiếm danh mục" id="input-tk" onChange={(e) => searchdanhmuc(e.target.value)}
                            />

                        </div>
                        <button className="button-them" id="them" onClick={() => setShowModal(true)}>
                            + Thêm danh mục
                        </button>
                    </div>
                    <table className="tables">
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Tên</th>
                                <th>Mô tả</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="table-list">
                            {
                                category.map((item, index) => (
                                    <tr key={item.ma}>
                                        <td>{index + 1}</td>

                                        <td>{item.tendanhmuc}</td>

                                        <td>{item.mota}</td>
                                        <td>


                                            <button id="btnsua" onClick={() => clickEdit(item)}><MdEdit size={19} /></button>
                                            <button id="btnxoa" onClick={() => clickDelete(item.ma)}><RiDeleteBinLine size="19" /></button>
                                        </td>
                                    </tr>
                                ))
                            }

                        </tbody>
                    </table>

                    {/* <div className="list-page">
                        <ul className="list-page1">
                            <li onClick={() => console.log('Trang 1')}>1</li>
                            <li onClick={() => console.log('Trang 2')}>2</li>
                            <li onClick={() => console.log('Trang 3')}>3</li>
                            <li onClick={() => console.log('Trang 4')}>4</li>
                            <li onClick={() => console.log('Trang 5')}>5</li>
                        </ul>
                    </div> */}

                    {/* Table dữ liệu ở đây... */}
                </div>
            </div>
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>{isEditmode ? "Sửa danh mục" : "Thêm danh mục"}</h3>

                        <div className="form-row-category">
                            <label htmlFor="ten">Tên danh mục:</label>
                            <input type="text" name="ten" id="ten" placeholder="Tên danh mục"
                                className={error.tendanhmuc ? 'input-error' : 'input-category'}
                                value={newcategory.tendanhmuc}
                                onChange={(e) => setNewcategory({ ...newcategory, tendanhmuc: e.target.value })} />
                        </div>

                        <div className="form-row-category">
                            <label htmlFor="mota">Mô tả:</label>
                            <input type="text" id="mota" placeholder="Mô tả"
                                className={error.mota ? 'input-error' : 'input-category'}
                                value={newcategory.mota}
                                onChange={(e) => setNewcategory({ ...newcategory, mota: e.target.value })} />
                        </div>


                        <div className="modal-actions">
                            <button onClick={handleSave}>Lưu</button>
                            <button onClick={() => {
                                setShowModal(false);
                                setNewcategory({ tendanhmuc: "", mota: "" })
                                setEditId(null);

                            }}>Hủy</button>
                        </div>
                    </div>

                </div>

            )}
        </div>
    )
}