"use client";
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getProductbyid } from '../../services/product';
import { toast } from 'react-toastify';

export default function ProductTop() {
  const [quantity, setQuantity] = useState(1);
  const [idcategory, setidcategory] = useState(0);
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [product, setProduct] = useState(null);

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          const data = await getProductbyid(id);
          setProduct(data);
          console.log('Sản phẩm:', data);
          setidcategory(data.madanhmuc)


        } catch (error) {
          console.error('Lỗi khi lấy sản phẩm:', error);
        }
      };
      fetchData();
    }
  }, [id]);

  const decrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const increase = () => {
    setQuantity(quantity + 1);
  };

  const addToCart = () => {
    if (!product) return;

    // Lấy danh sách sản phẩm từ localStorage
    let sanphams = JSON.parse(localStorage.getItem("sanphams")) || [];

    const giaNumber = Number(product.giaban);
    const tong = giaNumber * quantity;

    const sptontai = sanphams.find(item => item.id === product.id);

    if (sptontai) {
      sptontai.soluong += quantity;
      sptontai.tong = sptontai.gia * sptontai.soluong;
      toast.success("Cập nhật số lượng sản phẩm thành công!");
    } else {
      const sp = {
        id: product.id,
        ten: product.ten,
        gia: giaNumber,
        soluong: quantity,
        tong: tong,
        anh: product.anh
      };
      sanphams.push(sp);
      toast.success("Thêm sản phẩm vào giỏ hàng thành công!");
    }


    // Lưu lại vào localStorage
    localStorage.setItem("sanphams", JSON.stringify(sanphams));
    window.dispatchEvent(new Event('localStorageUpdated'));
  };

  return (
    <div>
      <div className="chitiet">
        <div className="chitiet-trai">
          <div className="chitiet-trai-img">
            <img className="anhsp23" src={`http://localhost:5273/images/product/${product?.anh || 'default.jpg'}`} alt="" />
          </div>
          {/* <div className="chitiet-trai-img-21">
            <div><img src="/images/product0.jpg" alt="" /></div>
            <div><img src="/images/product0.jpg" alt="" /></div>
            <div><img src="/images/product0.jpg" alt="" /></div>
            <div><img src="/images/product0.jpg" alt="" /></div>
          </div> */}
        </div>

        <div className="chitiet-phai">
          <div id="namesanpham">
            <h1 id="name">{product?.ten}</h1>
          </div>

          <p><strong style={{ paddingLeft: '10px' }}>THÔNG TIN CƠ BẢN:</strong></p>
          {
            (idcategory === 1 && (
              <ul id="motasanphamtren" className="motasanpham">
                <li> Màu sắc: Nhiều màu </li>
                <li>Chất liệu: {product?.chatlieu}</li>
                <li>Kiểu dáng: {product?.kieudang}</li>
                <li>Phù hợp với nhiều khuôn mặt</li>
                <li>Phù hợp với nhiều lứa tuổi</li>
                <li>Thích hợp làm kính cận, viễn, loạn,…</li>
                <li>Gọng kính thời trang được thiết kế theo xu hướng mắt kính thời trang thế giới hiện nay. Sản phẩm đem đến cảm giác đeo chân thật, không gây khó chịu cho sóng mũi. Đồng thời cũng giúp tôn lên vẻ đẹp của người đeo một cách hoàn hảo.</li>
                <li>Tròng kính cũng giống như tròng kính mát thông thường nhưng được phủ thêm màng lọc có tính năng như tấm rèm, ngăn chặn hay hấp thụ các tia sáng nằm ngang và chỉ cho tia sáng đứng đi qua, bởi vậy người đeo kính không bị chói mắt, hình ảnh sẽ rõ nét và trung thực.</li>
              </ul>
            ))
          }
          {
            (idcategory === 2 && (
              <ul id="motasanphamtren" className="motasanpham">
                <li> Màu sắc: Nhiều màu </li>
                <li>Chất liệu: {product?.chatlieu}</li>
                <li>Kiểu dáng: {product?.kieudang}</li>
                <li>Phù hợp với nhiều khuôn mặt</li>
                <li>Phù hợp với nhiều lứa tuổi</li>
                <li>Thích hợp làm kính cận, viễn, loạn,…</li>
                <li>Kính râm thời trang được thiết kế theo xu hướng mắt kính thời trang thế giới hiện nay. Sản phẩm đem đến cảm giác đeo chân thật, không gây khó chịu cho sóng mũi. Đồng thời cũng giúp tôn lên vẻ đẹp của người đeo một cách hoàn hảo.</li>
                <li>Tròng kính được phủ thêm màng lọc có tính năng như tấm rèm, ngăn chặn hay hấp thụ các tia sáng nằm ngang và chỉ cho tia sáng đứng đi qua, bởi vậy người đeo kính không bị chói mắt, hình ảnh sẽ rõ nét và trung thực.</li>
                <li>Việc di chuyển ngoài trời dưới ánh nắng lâu sẽ tạo điều kiện thuận lợi cho các tia sáng chiếu thẳng vào mắt gây ảnh hưởng đến mắt và cản trở tầm nhìn. Vì vậy nếu đeo kính râm sẽ giúp bạn nhìn rõ, chống chói, giảm mỏi mắt hơn.</li>
              </ul>
            ))
          }
          {
            (idcategory !== 2 && idcategory !== 1 && (
              <ul id="motasanphamtren" className="motasanpham">
                <li> Màu sắc: Nhiều màu </li>
                <li>Chất liệu: {product?.chatlieu}</li>
                <li>Kiểu dáng: {product?.kieudang}</li>
                <li>Hạn chế chói, phản quang</li>
                <li>Hạn chế bám vân tay</li>
                <li>Hạn chế trầy xước</li>
                <li>Hạn chế bám bụi bẩn</li>
                <li> Tính năng phòng chống tia tử ngoại và điện từ bức xạ, bảo về toàn diện mắt của bạn, an toàn hơn và đáng tin cậy hơn. </li>
                <li> Hiệu quả trong việc ngăn chặn ánh sáng xanh </li>
                <li> Bề mặt tròng kính trơn láng, phân tử Polymer, khiến cho bề mặt trọng kính sáng, bóng và cứng.</li>
              </ul>
            ))
          }
          {/* <ul id="motasanphamtren" className="motasanpham">
            <li>Kính râm thời trang được thiết kế theo xu hướng mắt kính thời trang thế giới hiện nay...</li>
            <li>Tròng kính được phủ màng lọc giúp ngăn chặn tia sáng nằm ngang...</li>
            <li>Việc di chuyển ngoài trời sẽ dễ bị chói, kính râm sẽ giúp bạn chống chói, giảm mỏi mắt...</li>
          </ul> */}

          <p>Giá:</p>
          <div className="ghim-gia-dathang">
            <p className="innergia">
              {/* <span style={{ textDecoration: 'line-through' }}>480.000 đ</span> */}
              <span style={{ color: '#F9800E', marginLeft: '8px' }}>
                <span id="price">{product?.giaban.toLocaleString("vi-VN") || '...'}</span> đ
              </span>
            </p>

            <div className="button-soluong">
              <button onClick={decrease}>-</button>
              <input
                type="number"
                id="in-sl"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                min={1}
              />
              <button onClick={increase}>+</button>
            </div>

            <div className="Themgiohang">
              <button type="submit" id="btnthemvaogiohang" onClick={addToCart}>
                THÊM VÀO GIỎ HÀNG
              </button>
            </div>

            <div style={{ height: '30px', clear: 'both' }}></div>

            <div className="Lienhe">
              <strong>LIÊN HỆ ĐẶT HÀNG</strong><br />
              <span>Để có được giá trị tốt nhất thị trường</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
