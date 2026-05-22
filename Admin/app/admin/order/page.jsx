'use client'

import { useEffect, useState } from 'react'
import styles from './order.module.css'
import ReactPaginate from 'react-paginate';
import { CreateVanchuyen, FilterOrder, GetallOrder, Getorderbyid, Getvanchuyen, UpdateState, Updatevanchuyen } from '../../../services/admin/order'
import { FaEye } from "react-icons/fa";
import { toast } from 'react-toastify'

function getStatusClass(status) {
  switch (status) {
    case 'Chờ xác nhận':
      return 'status-waiting'
    case 'Đang giao':
      return 'status-shipping'
    case 'Hoàn thành':
      return 'status-completed'
    case 'Chờ giao':
      return 'status-chogiao'
    default:
      return ''
  }
}

export default function Order() {
  const [activeIndex, setActiveIndex] = useState("Tất cả");

  const handleClick = async (index) => {
    setActiveIndex(index);
    settranghientai(0);
    setinputSearch('');
    setstateSearch(false);
    let datafilter;
    if (index !== "Tất cả") {
      datafilter = await FilterOrder(index, "", 1, 10);
    }
    else {
      datafilter = await GetallOrder((1), 10)
    }

    setlistOrder(datafilter.data);
    settongtrang(datafilter.total)
  };
  const [listOrder, setlistOrder] = useState([])
  const [donhang, setdonhang] = useState({});
  const [vanchuyen, setvanchuyen] = useState(null);
  const [showDetail, setShowDetail] = useState(false)
  const [stateOrder, setstateOrder] = useState(null);
  const [ngaygiao, setngaygiao] = useState(null);
  const [mavandon, setmavandon] = useState("");
  const [donviVC, setdonviVC] = useState("")
  const [idorder, setidorder] = useState(0)
  const [mvd, setmvd] = useState("");

  const [tongtrang, settongtrang] = useState(0);
  const [tranghientai, settranghientai] = useState(0);
  const [inputSearch, setinputSearch] = useState("");
  const [stateSearch,setstateSearch]= useState(false);

  const handleSearch = async (keyword) => {
    settranghientai(0)
    setinputSearch(keyword)
    const datafilter = await FilterOrder(activeIndex!=="Tất cả" ? activeIndex : "", keyword, 1, 10);
    setlistOrder(datafilter.data);
    settongtrang(datafilter.total)
    setstateSearch(true);


  }

  useEffect(() => {

    document.title = "Quản lý đơn hàng"

    const fetchdata = async (pageNumber) => {
      let datafilter
      if (activeIndex !== "Tất cả") {
        datafilter = await FilterOrder(
          activeIndex,
          stateSearch ? inputSearch : "",
          pageNumber + 1,
          10
        );
      } else {
        datafilter = await GetallOrder(pageNumber + 1, 10);
      }
      setlistOrder(datafilter.data);
      settongtrang(datafilter.total);
    }
    fetchdata(tranghientai)
  }, [tranghientai,activeIndex,stateSearch])

  const handlePageClick = (event) => {
    settranghientai(event.selected);
    console.log(event.selected);
    

  };




  const xacnhan = async () => {
    await UpdateState("Chờ giao", idorder);
    toast.success("Đã xác nhân đơn hàng")

  }
  const giaohang = async () => {
    var obj = {
      mavandon: mavandon,
      mahd: idorder,
      donvivanchuyen: donviVC,
      ngaygiao: ngaygiao,
      ngaynhan: ngaygiao,
      trangthai: "Đang giao"
    }
    await CreateVanchuyen(obj)
    await UpdateState("Đang giao", idorder);
    toast.success("Đang giao")
  }
  const hoanthanh = async () => {
    try {
      const a = vanchuyen?.mavandon;
      await UpdateState("Hoàn thành", idorder);

      await Updatevanchuyen(a);


      toast.success("Hoàn thành")
    } catch (error) {
      toast.error("Đã xảy ra lỗi");
      console.log(error);

    }


  }


  return (
    <div className={styles['order-page']}>
      <h1 className={styles['order-title']}>Quản lý đơn hàng</h1>

      <div className={styles['order-search']}>
        <input
          type="text"
          placeholder="Tìm theo mã, tên khách, số điện thoại..."
          className={styles['search-input']}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      <div className={styles.buttonContainer}>
        <button
          onClick={() => handleClick("Tất cả")}
          className={`${styles.customButton} ${activeIndex === "Tất cả" ? styles.active : ''
            }`}
        >
          Tất cả
        </button>
        <button
          onClick={() => handleClick("Chờ xác nhận")}
          className={`${styles.customButton} ${activeIndex === "Chờ xác nhận" ? styles.active : ''
            }`}
        >
          Chờ xác nhận
        </button>

        <button
          onClick={() => handleClick("Chờ giao")}
          className={`${styles.customButton} ${activeIndex === "Chờ giao" ? styles.active : ''
            }`}
        >
          Chờ giao
        </button>

        <button
          onClick={() => handleClick("Đang giao")}
          className={`${styles.customButton} ${activeIndex === "Đang giao" ? styles.active : ''
            }`}
        >
          Đang giao
        </button>

        <button
          onClick={() => handleClick("Hoàn thành")}
          className={`${styles.customButton} ${activeIndex === "Hoàn thành" ? styles.active : ''
            }`}
        >
          Hoàn thành
        </button>
      </div>

      <div className={styles['order-table-container']}>
        <table className={styles['order-table']}>
          <thead>
            <tr>
              <th>Mã</th>
              <th>Khách hàng</th>
              <th>Số điện thoại</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {listOrder.map((itemoder, index) => (
              <tr key={index}>
                <td>{itemoder.mahd}</td>
                <td>{itemoder.ten}</td>
                <td>{itemoder.sdt}</td>
                <td>{itemoder.tongtien.toLocaleString('vi-VN')} đ</td>
                <td>
                  <span className={`${styles['status-badge']} ${styles[getStatusClass(itemoder.trangthai)]}`}>
                    {itemoder.trangthai}
                  </span>
                </td>
                <td>
                  <button className={styles['view-button']} onClick={async () => {
                    setShowDetail(true)
                    setstateOrder(itemoder.trangthai)
                    setidorder(itemoder.mahd);
                    const dataorder = await Getorderbyid(itemoder.mahd)
                    setdonhang(dataorder)
                    const dataVC = await Getvanchuyen(itemoder.mahd);
                    setvanchuyen(dataVC);



                  }}>
                    <FaEye size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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

      {/* Chi tiết đơn hàng modal */}
      {showDetail && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <div className={styles.left}>
              <button className={styles.closeButton} onClick={() => setShowDetail(false)}>
                x
              </button>
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
                  {
                    (donhang.listjson_chitiet || []).map((item) => (
                      <tr key={item.masp}>
                        <td>{item.masp}</td>
                        <td>
                          <img src={`http://localhost:5273/images/product/${item.anh}`} alt="" className={styles.productImg} />
                        </td>
                        <td>{item.ten}</td>
                        <td>{item.soluong}</td>
                        <td>{item.giaban.toLocaleString('vi-VN')} đ</td>
                        <td>{(item.giaban * item.soluong).toLocaleString("vi-VN")} đ</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            <div className={styles.right}>
              <p>Họ tên: {donhang.ten}</p>
              <p>SĐT: {donhang.sdt}</p>
              <p>Email: {donhang.email}</p>
              <p>Địa chỉ: {donhang.ghichu}</p>
              <p>Ngày đặt {donhang.thoigian}</p>

              {/* {(stateOrder === "Chờ xác nhận") && (
                <div className={styles.inputGroup}>
                  <label>Ngày giao:</label>
                  <input type="date" />
                </div>
              )
              } */}
              {
                (stateOrder !== "Chờ xác nhận" && (
                  <>
                    <div className={styles.inputGroup}>
                      <label>Ngày giao: {vanchuyen?.ngaygiao}</label>
                      <input type="date" onChange={(e) => setngaygiao(e.target.value)} />
                    </div>
                    <div className={styles.inputGroup}>
                      <label>Mã vận đơn:</label>
                      <input type="text" value={vanchuyen?.mavandon} onChange={(e) => setmavandon(e.target.value)} />
                    </div>

                    <div className={styles.inputGroup}>
                      <label>Đơn vị vận chuyển:</label>
                      <input type="text" value={vanchuyen?.donvivanchuyen} onChange={(e) => setdonviVC(e.target.value)} />
                    </div>
                  </>
                ))
              }
              <p>Phí vận chuyển: 30.000 đ</p>
              <p>Tổng tiền sản phẩm: {((donhang?.tongtien) || 0).toLocaleString("vi-VN")} đ</p>

              {stateOrder === 'Chờ xác nhận' && (
                <button
                  className={styles.confirmButton}
                  onClick={xacnhan}
                >
                  Xác nhận
                </button>
              )}

              {stateOrder === 'Chờ giao' && (
                <button
                  className={styles.confirmButton}
                  onClick={giaohang}
                >
                  Giao hàng
                </button>
              )}

              {stateOrder === 'Đang giao' && (
                <button
                  className={styles.confirmButton}
                  onClick={hoanthanh}
                >
                  Hoàn thành
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
