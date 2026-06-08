'use client';

import { getAllCategory } from '../../../services/admin/category';
import { getAllSupplier } from '../../../services/admin/supplier';
import { Createproduct, GetallProduct, Uploadimage, Getbyidproduct, Updateproduct, SearchProduct } from '../../../services/admin/product';
import { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Search, Plus, X, Glasses, Image, ArrowUpFromLine, Pencil, Trash2 } from 'lucide-react';
import ExportButton from '../../../components/admin/ExportButton';
import { exportToExcel } from '../../../utils/exportExcel';
import { COLUMNS_KINHMAT } from '../../../utils/exportConfigs';

function validate(input, content) {
    if (input.toString().trim() === '') {
        toast.error(content);
        return false;
    }
    return true;
}

export default function Products() {
    const [showModal, setShowModal] = useState(false);
    const [listproduct, setlistproduct] = useState([]);
    const [listdanhmuc, setlistdanhmuc] = useState([]);
    const [listnhacungcap, setlistnhacungcap] = useState([]);
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
        trangthai: 1,
    });

    const [error, seterror] = useState({
        ten: false,
        soluong: false,
        giaban: false,
        gianhap: false,
    });

    const [isEditMode, setIsEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const [stateSearch, setstateSearch] = useState(false);
    const [inputSearch, setinputSearch] = useState("");
    const [exportLoading, setExportLoading] = useState(false);

    // Xuất trang hiện tại
    const handleExportCurrentPage = () => {
        exportToExcel(listproduct, COLUMNS_KINHMAT, 'SanPham_TrangHienTai', 'Sản Phẩm');
    };

    // Xuất tất cả sản phẩm
    const handleExportAll = async () => {
        try {
            setExportLoading(true);
            let allData = [];
            if (stateSearch) {
                const res = await SearchProduct(inputSearch, 1, 9999);
                allData = res?.data || [];
            } else {
                const res = await GetallProduct(1, 9999);
                allData = res?.data || [];
            }
            exportToExcel(allData, COLUMNS_KINHMAT, 'SanPham_TatCa', 'Sản Phẩm');
        } catch (e) {
            console.error(e);
            toast.error('Lỗi xuất Excel!');
        } finally {
            setExportLoading(false);
        }
    };

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
    };

    const handlePageClick = (event) => {
        settranghientai(event.selected);
    };

    const handleSave = async () => {
        try {
            if (!isEditMode && !selectedFile) {
                toast.error('Vui lòng chọn ảnh sản phẩm trước!');
                return;
            }
            if (!validate(product.ten, 'Tên sản phẩm trống!')) return;
            if (!validate(product.mota, 'Mô tả trống!')) return;
            if (!validate(product.soluong, 'Số lượng không hợp lệ!')) return;
            if (!validate(product.giaban, 'Giá bán không hợp lệ!')) return;
            if (!validate(product.gianhap, 'Giá nhập không hợp lệ!')) return;

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
                toast.success('Cập nhật sản phẩm thành công!');
            } else {
                await Createproduct(newProduct);
                toast.success('Thêm sản phẩm thành công!');
            }

            handleCloseModal();
            const reset = await GetallProduct(tranghientai + 1, 7);
            setlistproduct(reset.data || []);
            settongtrang(reset.total || 0);
        } catch (error) {
            toast.error('Lỗi khi lưu sản phẩm. Vui lòng thử lại!');
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
            toast.error('Lỗi khi lấy thông tin sản phẩm!');
        }
    };

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
        settranghientai(0);
        try {
            const res_search = await SearchProduct(kinhmat, 1, 7);
            setlistproduct(res_search.data || []);
            settongtrang(res_search.total || 0);
            setstateSearch(true);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        document.title = "Quản lý sản phẩm | Kính Mắt Luxury";
        const fetchdata = async (pageNumber) => {
            try {
                const resdm = await getAllCategory();
                setlistdanhmuc(resdm || []);

                const resncc = await getAllSupplier();
                setlistnhacungcap(resncc || []);

                if (stateSearch) {
                    const res_search = await SearchProduct(inputSearch, (pageNumber + 1), 7);
                    setlistproduct(res_search.data || []);
                    settongtrang(res_search.total || 0);
                } else {
                    const res = await GetallProduct((pageNumber + 1), 7);
                    setlistproduct(res.data || []);
                    settongtrang(res.total || 0);
                }
            } catch (e) {
                console.error(e);
            }
        };
        fetchdata(tranghientai);
    }, [tranghientai, stateSearch, inputSearch]);

    return (
        <div className="space-y-8 font-sans text-gray-800">
            {/* Title Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-gray-200 pb-6 gap-4">
                <div>
                    <div className="flex items-center gap-2 text-brand-gold text-xs font-bold uppercase tracking-widest mb-1.5">
                        <Sparkles className="text-sm" /> Catalog Database
                    </div>
                    <h1 className="text-3xl font-extrabold font-heading text-brand-dark tracking-wide">
                        Quản Lý Sản Phẩm
                    </h1>
                </div>
            </div>

            {/* Actions Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white border border-gray-150 p-4 rounded-2xl shadow-md">
                {/* Search input */}
                <div className="relative flex items-center max-w-sm w-full">
                    <span className="absolute left-4 text-gray-400"><Search className="text-base" /></span>
                    <input 
                        type="text" 
                        placeholder="Tìm kiếm sản phẩm..." 
                        onChange={(e) => {
                            handleSearch(e.target.value);
                            setinputSearch(e.target.value);
                        }}
                        className="w-full bg-gray-50 hover:bg-gray-100/50 focus:bg-white border border-gray-200 focus:border-brand-gold/60 rounded-xl py-2.5 pl-12 pr-4 text-sm font-medium outline-none transition-all duration-150 text-gray-900 placeholder-gray-400 focus:ring-1 focus:ring-brand-gold/30"
                    />
                </div>

                {/* Add Product Button */}
                <div className="flex items-center gap-3">
                    <motion.button 
                        onClick={() => {
                            setIsEditMode(false);
                            setShowModal(true);
                        }}
                        className="inline-flex items-center gap-2 py-2.5 px-5 rounded-xl text-black font-heading font-bold text-xs tracking-widest bg-gradient-to-r from-brand-gold via-[#e8d7c0] to-brand-gold-hover hover:brightness-110 active:brightness-95 transition-all duration-150 cursor-pointer shadow-lg shadow-brand-gold/15 flex-shrink-0"
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                    >
                        <Plus className="text-sm font-bold" />
                        <span>THÊM SẢN PHẨM</span>
                    </motion.button>
                    <ExportButton
                        label="Xuất Excel"
                        loading={exportLoading}
                        options={[
                            { label: 'Xuất trang hiện tại', onClick: handleExportCurrentPage },
                            { label: 'Xuất tất cả sản phẩm', onClick: handleExportAll },
                        ]}
                    />
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-white border border-gray-150 rounded-2xl overflow-hidden shadow-md">
                <table className="w-full text-left border-collapse text-sm">
                    <thead>
                        <tr className="border-b border-gray-150 bg-gray-50/50 text-gray-500 font-bold uppercase tracking-wider text-xs">
                            <th className="p-4 sm:p-5">STT</th>
                            <th className="p-4 sm:p-5">Ảnh</th>
                            <th className="p-4 sm:p-5">Tên Sản Phẩm</th>
                            <th className="p-4 sm:p-5">Danh Mục</th>
                            <th className="p-4 sm:p-5">Giá Bán</th>
                            <th className="p-4 sm:p-5">Tồn Kho</th>
                            <th className="p-4 sm:p-5">Kiểu Dáng</th>
                            <th className="p-4 sm:p-5">Chất Liệu</th>
                            <th className="p-4 sm:p-5 text-right">Hành Động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-150 font-medium text-gray-750">
                        {listproduct.map((item, index) => (
                            <tr key={item.id} className="hover:bg-gray-50/30 transition duration-150">
                                <td className="p-4 sm:p-5 text-gray-400">{(tranghientai * 7) + index + 1}</td>
                                <td className="p-4 sm:p-5">
                                    <div className="w-16 h-10 rounded-lg overflow-hidden bg-gray-50 border border-gray-200 flex items-center justify-center flex-shrink-0">
                                        <img loading="lazy" 
                                            src={`http://localhost:5273/images/product/${item.anh || 'default.jpg'}`} 
                                            alt={item.ten} 
                                            className="h-8 w-auto object-contain p-0.5"
                                        />
                                    </div>
                                </td>
                                <td className="p-4 sm:p-5 text-brand-dark font-semibold flex items-center gap-2">
                                    <Glasses className="text-brand-gold text-base flex-shrink-0" />
                                    <span className="truncate max-w-[150px]">{item.ten}</span>
                                </td>
                                <td className="p-4 sm:p-5 text-gray-600">{item.danhmuc}</td>
                                <td className="p-4 sm:p-5 text-brand-gold font-bold">{(item.giaban || 0).toLocaleString("vi-VN")}đ</td>
                                <td className="p-4 sm:p-5">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                        item.soluong > 5 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                                    }`}>
                                        {item.soluong} chiếc
                                    </span>
                                </td>
                                <td className="p-4 sm:p-5 text-gray-600">{item.kieudang}</td>
                                <td className="p-4 sm:p-5 text-gray-600">{item.chatlieu}</td>
                                <td className="p-4 sm:p-5 text-right space-x-2">
                                    <button 
                                        onClick={() => handleclickEdit(item.id)}
                                        className="p-2 bg-brand-gold/10 hover:bg-brand-gold/25 text-brand-gold rounded-lg transition-colors cursor-pointer outline-none"
                                        title="Chỉnh sửa"
                                    >
                                        <Pencil className="text-base" />
                                    </button>
                                    <button 
                                        className="p-2 bg-red-500/10 hover:bg-red-500/25 text-red-650 rounded-lg transition-colors cursor-pointer outline-none"
                                        title="Xóa"
                                    >
                                        <Trash2 className="text-base" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {listproduct.length === 0 && (
                            <tr>
                                <td colSpan="9" className="p-8 text-center text-gray-400 font-sans">
                                    Không có dữ liệu sản phẩm kính mắt.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {tongtrang > 1 && (
                <div className="flex justify-center pt-2">
                    <ReactPaginate
                        breakLabel="..."
                        nextLabel=">"
                        onPageChange={handlePageClick}
                        pageRangeDisplayed={3}
                        pageCount={tongtrang}
                        previousLabel="<"
                        renderOnZeroPageCount={null}
                        containerClassName="pagination flex items-center gap-1.5 list-none select-none text-xs font-semibold font-heading"
                        pageLinkClassName="w-8 h-8 rounded-lg flex items-center justify-center border border-gray-200 text-gray-500 hover:border-brand-gold hover:text-brand-gold transition duration-150"
                        previousLinkClassName="w-8 h-8 rounded-lg flex items-center justify-center border border-gray-200 text-gray-500 hover:border-brand-gold hover:text-brand-gold transition duration-150"
                        nextLinkClassName="w-8 h-8 rounded-lg flex items-center justify-center border border-gray-200 text-gray-500 hover:border-brand-gold hover:text-brand-gold transition duration-150"
                        activeLinkClassName="!border-brand-gold !bg-brand-gold !text-white shadow-md shadow-brand-gold/15"
                        forcePage={tranghientai}
                    />
                </div>
            )}

            {/* Product Add / Edit Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
                        <motion.div 
                            className="bg-white border border-gray-200 rounded-3xl shadow-2xl p-6 sm:p-8 max-w-4xl w-full relative z-10 max-h-[90vh] overflow-y-auto space-y-6"
                            initial={{ opacity: 0, scale: 0.97, y: 15 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.97, y: 15 }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                        >
                            {/* Close Modal button */}
                            <button 
                                onClick={handleCloseModal}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition duration-150 outline-none cursor-pointer"
                                title="Đóng"
                            >
                                <X className="text-lg" />
                            </button>

                            {/* Title */}
                            <div>
                                <span className="text-[9px] font-bold tracking-widest text-brand-gold uppercase block mb-1">
                                    {isEditMode ? "Update Product" : "New Product"}
                                </span>
                                <h3 className="text-xl font-extrabold font-heading text-brand-dark tracking-wide">
                                    {isEditMode ? 'Chỉnh Sửa Kính Mắt' : 'Thêm Sản Phẩm Kính Mới'}
                                </h3>
                            </div>

                            {/* Main Form Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start text-sm font-medium text-gray-700">
                                
                                {/* Left Side: Image upload preview (4 Columns) */}
                                <div className="md:col-span-4 space-y-4">
                                    <label className="text-xs font-semibold text-brand-gold tracking-wide uppercase block">Ảnh sản phẩm</label>
                                    
                                    <div className="bg-gray-50 border-2 border-dashed border-gray-200 hover:border-brand-gold/40 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition duration-150 h-64 relative group">
                                        <input 
                                            type="file" 
                                            accept="image/*" 
                                            onChange={handleFileChange} 
                                            className="absolute inset-0 opacity-0 cursor-pointer z-20"
                                        />
                                        
                                        {previewSrc ? (
                                            <div className="h-full w-full flex items-center justify-center">
                                                <img loading="lazy" src={previewSrc} alt="Preview" className="max-h-48 w-auto object-contain p-1 transform group-hover:scale-102 transition duration-300" />
                                            </div>
                                        ) : (
                                            <div className="space-y-3 text-gray-400">
                                                <Image className="text-3xl text-gray-400 mx-auto" />
                                                <div className="space-y-1">
                                                    <span className="text-xs font-bold text-gray-600 block">Kéo thả hoặc tải ảnh lên</span>
                                                    <span className="text-[10px] block">Định dạng JPG, PNG, WEBP</span>
                                                </div>
                                                <span className="inline-flex items-center gap-1 text-[9px] font-bold tracking-widest text-brand-gold uppercase bg-brand-gold/10 border border-brand-gold/20 px-2 py-0.5 rounded">
                                                    <ArrowUpFromLine /> Tải ảnh
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Right Side: Other attributes (8 Columns) */}
                                <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    
                                    {/* Product Name */}
                                    <div className="space-y-1.5 sm:col-span-2">
                                        <label className="text-xs font-semibold text-brand-gold tracking-wide uppercase">Tên sản phẩm</label>
                                        <input 
                                            type="text" 
                                            name="ten"
                                            placeholder="Tên kính mắt (ví dụ: Kính Ray-ban RB3025)"
                                            value={product.ten}
                                            onChange={handleInputChange}
                                            className="w-full bg-gray-50 hover:bg-gray-100/50 focus:bg-white border border-gray-200 focus:border-brand-gold/60 rounded-xl py-3 px-4 text-sm font-medium outline-none transition-all duration-150 text-gray-900 placeholder-gray-450 focus:ring-1 focus:ring-brand-gold/30"
                                        />
                                    </div>

                                    {/* Category Dropdown */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-brand-gold tracking-wide uppercase">Danh mục</label>
                                        <div className="relative flex items-center">
                                            <select 
                                                id="danhmuc" 
                                                value={selectDanhmuc} 
                                                onChange={handleselect}
                                                className="w-full bg-gray-50 border border-gray-200 focus:border-brand-gold/60 rounded-xl py-3 px-4 text-sm font-medium outline-none transition-all duration-150 text-gray-900 cursor-pointer appearance-none focus:ring-1 focus:ring-brand-gold/30"
                                            >
                                                {listdanhmuc.map((dm) => (
                                                    <option key={dm.ma} value={dm.ma} className="bg-white text-gray-950">
                                                        {dm.tendanhmuc}
                                                    </option>
                                                ))}
                                            </select>
                                            <div className="absolute right-4 pointer-events-none border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-500"></div>
                                        </div>
                                    </div>

                                    {/* Quantity */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-brand-gold tracking-wide uppercase">Số lượng tồn kho</label>
                                        <input 
                                            type="number" 
                                            name="soluong" 
                                            placeholder="0" 
                                            disabled={true}
                                            value={product.soluong}
                                            className="w-full bg-gray-100 border border-gray-200 rounded-xl py-3 px-4 text-sm font-medium outline-none text-gray-500 cursor-not-allowed"
                                        />
                                        <p className="text-[10px] text-gray-500 italic">* Số lượng tự động cập nhật từ Phiếu nhập kho</p>
                                    </div>

                                    {/* Cost Price */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-brand-gold tracking-wide uppercase">Giá nhập gần nhất</label>
                                        <input 
                                            type="number" 
                                            name="gianhap" 
                                            placeholder="0" 
                                            disabled={true}
                                            value={product.gianhap}
                                            className="w-full bg-gray-100 border border-gray-200 rounded-xl py-3 px-4 text-sm font-medium outline-none text-gray-500 cursor-not-allowed"
                                        />
                                        <p className="text-[10px] text-gray-500 italic">* Giá nhập tự động lấy từ Hóa đơn nhập gần nhất</p>
                                    </div>

                                    {/* Sell Price */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-brand-gold tracking-wide uppercase">Giá bán niêm yết</label>
                                        <input 
                                            type="number" 
                                            name="giaban" 
                                            placeholder="Giá bán lẻ (đ)" 
                                            onChange={handleInputChange} 
                                            value={product.giaban}
                                            className="w-full bg-gray-50 hover:bg-gray-100/50 focus:bg-white border border-gray-200 focus:border-brand-gold/60 rounded-xl py-3 px-4 text-sm font-medium outline-none transition-all duration-150 text-gray-900 placeholder-gray-455 focus:ring-1 focus:ring-brand-gold/30"
                                        />
                                    </div>

                                    {/* Promotion classification */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-brand-gold tracking-wide uppercase">Nhóm sản phẩm</label>
                                        <div className="relative flex items-center">
                                            <select 
                                                name="gioithieu" 
                                                value={product.gioithieu} 
                                                onChange={handleInputChange}
                                                className="w-full bg-gray-50 border border-gray-200 focus:border-brand-gold/60 rounded-xl py-3 px-4 text-sm font-medium outline-none transition-all duration-150 text-gray-900 cursor-pointer appearance-none focus:ring-1 focus:ring-brand-gold/30"
                                            >
                                                <option value="Sản phẩm mới" className="bg-white text-gray-950">Sản phẩm mới</option>
                                                <option value="Kính chính hãng" className="bg-white text-gray-950">Kính chính hãng</option>
                                                <option value="Sản phẩm giá rẻ" className="bg-white text-gray-950">Sản phẩm giá rẻ</option>
                                                <option value="Kính thời trang" className="bg-white text-gray-950">Kính thời trang</option>
                                            </select>
                                            <div className="absolute right-4 pointer-events-none border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-500"></div>
                                        </div>
                                    </div>

                                    {/* Material */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-brand-gold tracking-wide uppercase">Chất liệu gọng kính</label>
                                        <div className="relative flex items-center">
                                            <select 
                                                name="chatlieu" 
                                                value={product.chatlieu} 
                                                onChange={handleInputChange}
                                                className="w-full bg-gray-50 border border-gray-200 focus:border-brand-gold/60 rounded-xl py-3 px-4 text-sm font-medium outline-none transition-all duration-150 text-gray-900 cursor-pointer appearance-none focus:ring-1 focus:ring-brand-gold/30"
                                            >
                                                <option value="" disabled className="bg-white text-gray-400">Chọn chất liệu</option>
                                                <option value="Nhựa Acetate" className="bg-white text-gray-950">Nhựa Acetate</option>
                                                <option value="Nhựa TR90" className="bg-white text-gray-950">Nhựa TR90</option>
                                                <option value="Nhựa Ultem" className="bg-white text-gray-950">Nhựa Ultem</option>
                                                <option value="Hợp kim" className="bg-white text-gray-950">Hợp kim</option>
                                                <option value="Titanium" className="bg-white text-gray-950">Titanium</option>
                                                <option value="Nhựa dẻo" className="bg-white text-gray-950">Nhựa dẻo</option>
                                                <option value="Gỗ" className="bg-white text-gray-950">Gỗ</option>
                                                <option value="Khác" className="bg-white text-gray-950">Khác</option>
                                            </select>
                                            <div className="absolute right-4 pointer-events-none border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-500"></div>
                                        </div>
                                    </div>

                                    {/* Shape style */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-brand-gold tracking-wide uppercase">Kiểu dáng</label>
                                        <div className="relative flex items-center">
                                            <select 
                                                name="kieudang" 
                                                value={product.kieudang} 
                                                onChange={handleInputChange}
                                                className="w-full bg-gray-50 border border-gray-200 focus:border-brand-gold/60 rounded-xl py-3 px-4 text-sm font-medium outline-none transition-all duration-150 text-gray-900 cursor-pointer appearance-none focus:ring-1 focus:ring-brand-gold/30"
                                            >
                                                <option value="" disabled className="bg-white text-gray-400">Chọn kiểu dáng</option>
                                                <option value="Vuông" className="bg-white text-gray-950">Vuông</option>
                                                <option value="Tròn" className="bg-white text-gray-950">Tròn</option>
                                                <option value="Mắt mèo" className="bg-white text-gray-950">Mắt mèo</option>
                                                <option value="Đa giác" className="bg-white text-gray-950">Đa giác</option>
                                                <option value="Phi công (Aviator)" className="bg-white text-gray-950">Phi công (Aviator)</option>
                                                <option value="Chữ nhật" className="bg-white text-gray-950">Chữ nhật</option>
                                                <option value="Oval" className="bg-white text-gray-950">Oval</option>
                                                <option value="Nửa gọng" className="bg-white text-gray-950">Nửa gọng</option>
                                                <option value="Không gọng" className="bg-white text-gray-950">Không gọng</option>
                                                <option value="Khác" className="bg-white text-gray-950">Khác</option>
                                            </select>
                                            <div className="absolute right-4 pointer-events-none border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-500"></div>
                                        </div>
                                    </div>

                                    {/* Origin */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-brand-gold tracking-wide uppercase">Thương hiệu / Xuất xứ</label>
                                        <div className="relative flex items-center">
                                            <select 
                                                name="xuatxu" 
                                                value={product.xuatxu} 
                                                onChange={handleInputChange}
                                                className="w-full bg-gray-50 border border-gray-200 focus:border-brand-gold/60 rounded-xl py-3 px-4 text-sm font-medium outline-none transition-all duration-150 text-gray-900 cursor-pointer appearance-none focus:ring-1 focus:ring-brand-gold/30"
                                            >
                                                <option value="" disabled className="bg-white text-gray-400">Chọn thương hiệu / NCC</option>
                                                {listnhacungcap.map((ncc) => (
                                                    <option key={ncc.id} value={ncc.tenncc} className="bg-white text-gray-950">
                                                        {ncc.tenncc}
                                                    </option>
                                                ))}
                                                <option value="Khác" className="bg-white text-gray-950">Khác</option>
                                            </select>
                                            <div className="absolute right-4 pointer-events-none border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-500"></div>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div className="space-y-1.5 sm:col-span-2">
                                        <label className="text-xs font-semibold text-brand-gold tracking-wide uppercase">Mô tả tóm tắt</label>
                                        <input 
                                            type="text" 
                                            name="mota" 
                                            placeholder="Mô tả tóm tắt tính năng sản phẩm..." 
                                            onChange={handleInputChange} 
                                            value={product.mota}
                                            className="w-full bg-gray-50 hover:bg-gray-100/50 focus:bg-white border border-gray-200 focus:border-brand-gold/60 rounded-xl py-3 px-4 text-sm font-medium outline-none transition-all duration-150 text-gray-900 placeholder-gray-455 focus:ring-1 focus:ring-brand-gold/30"
                                        />
                                    </div>

                                </div>

                            </div>

                            {/* Buttons actions */}
                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-150">
                                <motion.button 
                                    onClick={handleSave}
                                    className="py-3 px-10 rounded-xl text-black font-heading font-bold text-xs tracking-widest bg-gradient-to-r from-brand-gold via-[#e8d7c0] to-brand-gold-hover hover:brightness-110 active:brightness-95 transition-all duration-150 cursor-pointer shadow-lg shadow-brand-gold/15"
                                    whileHover={{ scale: 1.015 }}
                                    whileTap={{ scale: 0.985 }}
                                >
                                    {isEditMode ? 'CẬP NHẬT' : 'LƯU SẢN PHẨM'}
                                </motion.button>
                                <button 
                                    onClick={handleCloseModal}
                                    className="py-3 px-6 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-gray-800 transition duration-150 cursor-pointer"
                                >
                                    HỦY
                                </button>
                            </div>

                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </div>
    );
}
