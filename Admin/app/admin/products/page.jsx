'use client';
import { getAllCategory } from '../../../services/admin/category';
import { Createproduct, GetallProduct, Uploadimage, Getbyidproduct, Updateproduct, SearchProduct } from '../../../services/admin/product';
import './style.css';
import { useEffect, useState } from 'react';
import { RiDeleteBinLine } from "react-icons/ri";
import { MdEdit } from "react-icons/md";
import ReactPaginate from 'react-paginate';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';

function validate(input,content){
    if(input.toString().trim()===''){
        toast.error(content);
        return false;
    }
    return true;
}
export default function Products() {
    const [showModal, setShowModal] = useState(false);
    const [listproduct, setlistproduct] = useState([]);
    const [listdanhmuc, setlistdanhmuc] = useState([]);
    const [selectDanhmuc, setseclectDanhmuc] = useState(1);

    const [tongtrang, settongtrang] = useState(0);
    const [tranghientai, settranghientai] = useState(0);

    const [previewSrc, setPreviewSrc] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [product, setProduct] = useState({
        ten: '',
        soluong: 0,
        madanhmuc: 0,
        giaban: 0,
        gianhap: 0,
        gioithieu: 'Sản phẩm mới',
        xuatxu: '',
        chatlieu: '',
        kieudang: '',
        mota: '',
        anh: '',
        trangthai: 1, // mặc định là hoạt động
    });

    const [error, seterror] = useState({
        ten: false,
        soluong: false,
        giaban: false,
        gianhap: false,

    })
    // const router = useRouter();
    // const searchParams = useSearchParams();

    const [isEditMode, setIsEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const [stateSearch, setstateSearch] = useState(false);
    const [inputSearch, setinputSearch] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setPreviewSrc(reader.result);
            reader.readAsDataURL(file);
        }
    };


    const handleselect = (e) => {
        const selectedValue = e.target.value;
        setseclectDanhmuc(selectedValue);
        console.log(selectedValue);

    }
    const handlePageClick = (event) => {
        settranghientai(event.selected);

    };
    const handleSave = async () => {
        try {
            const newError = {
                ten: false,
                soluong: false,
                giaban: false,
                gianhap: false,

            }
            if (!isEditMode && !selectedFile) {
                alert('Vui lòng chọn ảnh trước');
                return;
            }
            if (!validate(product.ten,'Tên sản phẩm trống')) {
                return;
            }
            if (!validate(product.mota,'Mô tả trống')) {
                return;
            }
            if (!validate(product.soluong,'Số lượng không hợp lệ')) {
                return;
            }
            if (!validate(product.giaban,'Giá bán không hợp lệ')) {
                return;
            }
            if (!validate(product.gianhap,'Giá nhập không hợp lệ')) {
                return;
            }

            let imageName = product.anh;
            if (selectedFile !== null) {

                const uploadResult = await Uploadimage(selectedFile);
                imageName = uploadResult.url.split('/').pop();
            }

            const newProduct = {
                ...product,
                madanhmuc: parseInt(selectDanhmuc),
                anh: imageName,
            };

            if (isEditMode) {
                await Updateproduct({ id: editId, ...newProduct });
                toast.success('Cập nhật sản phẩm thành công');
            } else {
                await Createproduct(newProduct);
                alert('Thêm sản phẩm thành công');
            }

            setShowModal(false);
            setIsEditMode(false);
            setEditId(null);
            const reset = await GetallProduct(1, 20);
            setlistproduct(reset.data);
        } catch (error) {
            alert('Lỗi khi lưu sản phẩm');
            console.error(error);
        }
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProduct((prev) => ({ ...prev, [name]: value }));
    };
    const handleclickEdit = async (id) => {
        try {
            const productData = await Getbyidproduct(id);

            setProduct({
                ten: productData.ten,
                soluong: productData.soluong,
                madanhmuc: productData.madanhmuc,
                giaban: productData.giaban,
                gianhap: productData.gianhap,
                gioithieu: productData.gioithieu,
                xuatxu: productData.xuatxu,
                chatlieu: productData.chatlieu,
                kieudang: productData.kieudang,
                mota: productData.mota,
                anh: productData.anh,
                trangthai: productData.trangthai
            });
            setseclectDanhmuc(productData.madanhmuc.toString());
            setPreviewSrc(`http://localhost:5273/images/product/${productData.anh}`);
            setIsEditMode(true);
            setEditId(id);
            setShowModal(true);
        } catch (error) {
            console.error('Error fetching product:', error);
            alert('Lỗi khi lấy thông tin sản phẩm');
        }
    }
    const handleCloseModal = () => {
        setShowModal(false);
        setIsEditMode(false);
        setEditId(null);
        setProduct({
            ten: '',
            soluong: 0,
            madanhmuc: 0,
            giaban: 0,
            gianhap: 0,
            gioithieu: 'Sản phẩm mới',
            xuatxu: '',
            chatlieu: '',
            kieudang: '',
            mota: '',
            anh: '',
            trangthai: 1,
        });
        setPreviewSrc(null);
        setSelectedFile(null);
    };
    const handleSearch = async (kinhmat) => {
        settranghientai(0)
        const res_search = await SearchProduct(kinhmat, 1, 7);
        setlistproduct(res_search.data)
        settongtrang(res_search.total)
        setstateSearch(true);


    }

    useEffect(() => {

        document.title = "Quản lý Kính mắt"

        const fetchdata = async (pageNumber) => {
            const res = await GetallProduct((pageNumber + 1), 7);
            const resdm = await getAllCategory();
            const res_search = await SearchProduct(inputSearch, (pageNumber + 1), 7);
            if (stateSearch) {
                setlistproduct(res_search.data);
                settongtrang(res_search.total);
            }
            else if (!stateSearch) {
                setlistproduct(res.data);
                settongtrang(res.total);
            }

            setlistdanhmuc(resdm);


        }
        fetchdata(tranghientai);
    }, [tranghientai])

    return (
        <div >
            {/* <h2>ĐÂY LÀ TRANG QL SẢN PHẨM</h2> */}
            <div className="QL-right-product">
                <div className="ql-top">
                    <h1>Sản phẩm</h1>

                </div>

                <div className="ql-main">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <input type="text" placeholder="Tìm kiếm sản phẩm" id="input-tk"
                                onChange={(e) => {
                                    handleSearch(e.target.value)
                                    setinputSearch(e.target.value)
                                }} />
                            {/* <select className="cbboloc">
                                <option value="Gọng kính">Gọng kính</option>
                                <option value="Kính râm">Kính râm</option>
                                <option value="Tròng kính">Tròng kính</option>
                            </select> */}

                            {/* <button className="btn-loc">Lọc</button> */}
                        </div>
                        <button className="button-them" id="them" onClick={() => setShowModal(true)}>
                            + Thêm sản phẩm
                        </button>
                    </div>
                    <table className="tables">
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Ảnh</th>
                                <th>Tên</th>
                                <th>Danh mục</th>
                                <th>Giá bán</th>
                                <th>Số lượng</th>
                                <th>Kiểu dáng</th>
                                <th>Chất liệu</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="table-list">
                            {
                                listproduct.map((item, index) => (
                                    <tr>
                                        <td>{index + 1}</td>
                                        <td>
                                            <div className="table-list-item">
                                                <img src={`http://localhost:5273/images/product/${item.anh}`} alt="ảnh sản phẩm" />
                                            </div>
                                        </td>
                                        <td>{item.ten}</td>
                                        <td>{item.danhmuc}</td>
                                        <td>{(item.giaban)} đ</td>
                                        <td>{item.soluong}</td>
                                        <td>{item.kieudang}</td>
                                        <td>{item.chatlieu}</td>
                                        <td>
                                            <button id="btnsua" onClick={() => { handleclickEdit(item.id) }}><MdEdit size={19} /></button>
                                            <button id="btnxoa"><RiDeleteBinLine size={19} /></button>
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
                    <ReactPaginate
                        breakLabel="..."
                        nextLabel=">"
                        onPageChange={
                            handlePageClick
                        }
                        pageRangeDisplayed={3}
                        pageCount={tongtrang} // Sử dụng giá trị total từ API (đã là tổng số trang)
                        previousLabel="<"
                        renderOnZeroPageCount={null}
                        containerClassName="pagination"
                        pageLinkClassName="page-num"
                        previousLinkClassName="page-num"
                        nextLinkClassName="page-num"
                        activeLinkClassName="active"
                        forcePage={tranghientai} // Đảm bảo trang hiện tại được highlight đúng
                    />

                    {/* Table dữ liệu ở đây... */}
                </div>
            </div>

            {/* Modal thêm sản phẩm */}
            {showModal && (
                <div className="form">
                    <div className="product-form">
                        <h3>{isEditMode ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}</h3>

                        {/* Ảnh sản phẩm */}
                        <div className="input-img">
                            <input type="file" accept="image/*" onChange={handleFileChange} />
                            {previewSrc && <img src={previewSrc} alt="Preview" width="200" height="200" />}
                        </div>

                        <div className="form-column">
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Tên sản phẩm:</label>
                                    <input type="text"
                                        className={error.ten ? 'input-error' : 'input-product'}
                                        name='ten'
                                        placeholder="Tên sản phẩm"
                                        value={product.ten}
                                        onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                    <label>Danh mục:</label>
                                    <select id="danhmuc" value={selectDanhmuc} onChange={handleselect}>

                                        {

                                            listdanhmuc.map((dm) => (
                                                <option key={dm.ma} value={dm.ma}>
                                                    {dm.tendanhmuc}
                                                </option>

                                            ))
                                        }
                                    </select>
                                </div>

                            </div>



                            <div className="form-row">
                                <div className="form-group">
                                    <label>Số lượng:</label>
                                    <input type="text" name="soluong" placeholder="Số lượng" onChange={handleInputChange} value={product.soluong} />
                                </div>
                                <div className="form-group">
                                    <label>Giá bán:</label>
                                    <input type="text" name="giaban" placeholder="Giá bán" onChange={handleInputChange} value={product.giaban} />
                                </div>

                            </div>



                            <div className="form-row">
                                <div className="form-group">
                                    <label>Giá nhập:</label>
                                    <input type="text" name="gianhap" placeholder="Giá nhập" onChange={handleInputChange} value={product.gianhap} />
                                </div>
                                <div className="form-group">
                                    <label>Giới thiệu:</label>
                                    <select name="gioithieu" value={product.gioithieu} onChange={handleInputChange}>
                                        <option value="Sản phẩm mới">Sản phẩm mới</option>
                                        <option value="Kính chính hãng">Kính chính hãng</option>
                                        <option value="Sản phẩm giá rẻ">Sản phẩm giá rẻ</option>
                                        <option value="Kính thời trang">Kính thời trang</option>
                                    </select>
                                </div>

                            </div>



                            <div className="form-row">
                                <div className="form-group">
                                    <label>Chất liệu:</label>
                                    <input
                                        type="text"
                                        name="chatlieu"
                                        placeholder="Chất liệu"
                                        value={product.chatlieu}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Kiểu dáng:</label>
                                    <input
                                        type="text"
                                        name="kieudang"
                                        placeholder="Kiểu dáng"
                                        value={product.kieudang}
                                        onChange={handleInputChange}
                                    />
                                </div>


                            </div>


                            <div className="form-row">
                                <div className="form-group">
                                    <label>Xuất xứ:</label>
                                    <input
                                        type="text"
                                        name="xuatxu"
                                        placeholder="Xuất xứ"
                                        value={product.xuatxu}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Mô tả:</label>
                                    <input
                                        type="text"
                                        name="mota"
                                        placeholder="Mô tả"
                                        value={product.mota}
                                        onChange={handleInputChange}
                                    />
                                </div>


                            </div>


                        </div>

                        <div className="modal-actionss">
                            <button onClick={handleSave}>{isEditMode ? 'Cập nhật' : 'Lưu'}</button>
                            <button onClick={handleCloseModal}>Hủy</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
