import React from 'react';

export const getCategoryContent = (categoryId, categories = []) => {

  if (!categoryId) {
    return (
      <div className="gioithieu-kinhcan">
  <h1>CHÀO MỪNG ĐẾN VỚI DESMON</h1>
  <p>Hệ thống cửa hàng kính mắt uy tín hàng đầu Việt Nam</p>
  <p className="p-nhieudong">
    DESMON là thương hiệu chuyên cung cấp các sản phẩm kính mắt chính hãng,
    bao gồm gọng kính, tròng kính, kính mát và kính áp tròng với mẫu mã đa dạng,
    phù hợp cho mọi độ tuổi và phong cách.
  </p>
  <p className="p-nhieudong">
    Với phương châm “Chất lượng tạo nên uy tín”, DESMON luôn chú trọng từ khâu
    lựa chọn sản phẩm, tư vấn thị lực đến dịch vụ hậu mãi, mang lại trải nghiệm
    mua sắm an tâm và hài lòng cho khách hàng trên toàn quốc.
  </p>
</div>

    );
  }

  const category = categories.find(cat => cat.ma.toString() === categoryId);
  if (!category) return null;

  const categoryName = category.tendanhmuc.trim().toLowerCase();

  const categoryContents = {
    'gọng kính': (
      <div className="gioithieu-kinhcan">
  <h1>GỌNG KÍNH CẬN THỜI TRANG</h1>
  <p>Đa dạng kiểu dáng – Tôn vinh phong cách cá nhân</p>
  <p className="p-nhieudong">
    Gọng kính tại DESMON được tuyển chọn kỹ lưỡng từ các chất liệu cao cấp
    như titanium, nhựa acetate, hợp kim siêu nhẹ, mang lại cảm giác thoải mái
    khi sử dụng lâu dài.
  </p>
  <p className="p-nhieudong">
    Chúng tôi cung cấp nhiều kiểu dáng từ cổ điển, thanh lịch đến hiện đại,
    cá tính, phù hợp cho học sinh, sinh viên, nhân viên văn phòng và người trung niên.
    Mỗi sản phẩm đều đảm bảo độ bền, tính thẩm mỹ và an toàn cho người sử dụng.
  </p>
</div>

    ),

    'kính mát': (
      <div className="gioithieu-kinhcan">
  <h1>KÍNH MÁT THỜI TRANG</h1>
  <p>Bảo vệ đôi mắt – Khẳng định phong cách</p>
  <p className="p-nhieudong">
    Kính mát tại DESMON không chỉ là phụ kiện thời trang mà còn đóng vai trò
    quan trọng trong việc bảo vệ mắt khỏi tia UV, ánh sáng xanh và chói lóa.
  </p>
  <p className="p-nhieudong">
    Sản phẩm có khả năng chống tia UV400, phân cực chống chói, phù hợp khi
    di chuyển ngoài trời, đi biển, lái xe hoặc du lịch. Mẫu mã đa dạng giúp
    khách hàng dễ dàng lựa chọn theo phong cách riêng.
  </p>
</div>

    ),

    'tròng kính': (
      <div className="gioithieu-kinhcan">
  <h1>TRÒNG KÍNH CHẤT LƯỢNG CAO</h1>
  <p>Giải pháp bảo vệ và cải thiện thị lực toàn diện</p>
  <p className="p-nhieudong">
    Tròng kính tại DESMON được sản xuất từ vật liệu cao cấp, ứng dụng công nghệ
    hiện đại giúp tăng độ sắc nét, hạn chế mỏi mắt và bảo vệ mắt tối ưu.
  </p>
  <p className="p-nhieudong">
    Chúng tôi cung cấp đa dạng loại tròng kính như chống ánh sáng xanh, chống
    tia UV, tròng đổi màu, tròng mỏng nhẹ, phù hợp cho học tập, làm việc và
    sử dụng thiết bị điện tử thường xuyên.
  </p>
</div>

    ),
    'kính râm': (
  <div className="gioithieu-kinhcan">
    <h1>KÍNH DÂM CAO CẤP</h1>
    <p>Cá tính – Thời trang – Bảo vệ đôi mắt tối ưu</p>
    <p className="p-nhieudong">
      Kính dâm tại DESMON là sự kết hợp hoàn hảo giữa yếu tố thời trang
      và công nghệ bảo vệ mắt hiện đại. Thiết kế đa dạng từ thanh lịch,
      tối giản đến mạnh mẽ, cá tính, giúp tôn lên phong cách riêng của
      từng khách hàng.
    </p>
    <p className="p-nhieudong">
      Sản phẩm được trang bị khả năng chống tia UV400, hạn chế chói lóa,
      bảo vệ mắt khi di chuyển ngoài trời, lái xe hoặc hoạt động dưới ánh
      nắng mạnh. Chất liệu cao cấp giúp kính nhẹ, bền, đeo thoải mái trong
      thời gian dài.
    </p>
    <p className="p-nhieudong">
      Kính dâm DESMON phù hợp cho cả nam và nữ, là phụ kiện không thể thiếu
      khi đi du lịch, dạo phố hay tham gia các hoạt động ngoài trời.
    </p>
  </div>
),

    'kính áp tròng': (
      <div className="gioithieu-kinhcan">
  <h1>KÍNH ÁP TRÒNG</h1>
  <p>Tiện lợi – Thẩm mỹ – An toàn</p>
  <p className="p-nhieudong">
    Kính áp tròng tại DESMON là giải pháp tối ưu cho những ai mong muốn sự
    tiện lợi và thẩm mỹ trong sinh hoạt hằng ngày.
  </p>
  <p className="p-nhieudong">
    Sản phẩm được kiểm định chất lượng nghiêm ngặt, độ ẩm cao, dễ đeo,
    giúp giảm khô mắt và tạo cảm giác thoải mái. Ngoài kính áp tròng trong suốt,
    DESMON còn cung cấp kính áp tròng màu với nhiều tone tự nhiên, phù hợp
    cho cả đi làm và đi chơi.
  </p>
</div>


    )
  };

  return categoryContents[categoryName] || (
    <div className="gioithieu-kinhcan">
      <h1>{category.tendanhmuc.toUpperCase()}</h1>
      <p className="p-nhieudong">
        {category.mota || 'Khám phá các sản phẩm đa dạng tại DESMON'}
      </p>
    </div>
  );
};
