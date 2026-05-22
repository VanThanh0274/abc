"use client";
import Image from "next/image";

export default function Homecenter() {
    return (
        <>
            <div className="brand">
                <img src="/images/brand1.png" alt="" />
                <img src="/images/brand2.jpg" alt="" />
                <img src="images/brand3.jpg" alt="" />
                <img src="/images/brand4.png" alt="" />
                <img src="/images/brand5.jpeg" alt="" />
            </div>

            <div className="intro">
                <div className="intro1">
                    <div className="intro-text">
                        <p style={{ margin: 0, fontSize: "14px", color: "#575757" }}>
                            DESMON - CHUỖI CỬA HÀNG KÍNH MẮT UY TÍN TẠI QUY NHƠN
                        </p>
                        <h3>TÀI SẢN LỚN NHẤT CỦA DOANH NGHIỆP LÀ KHÁCH HÀNG</h3>
                        <i>
                            Kính mắt DESMON – Trải nghiệm chất lượng kính mắt theo tiêu chuẩn quốc tế
                        </i>
                        <p>
                            Với 15 năm kinh nghiệm trên thị trường kính mắt Việt, DESMON tự hào là đơn vị
                            cung cấp các sản phẩm và dịch vụ về kính mắt uy tín tại Việt Nam. Các sản phẩm
                            được tuyển chọn kỹ lưỡng, đạt độ tinh xảo và chất lượng cao, hướng đến trải
                            nghiệm tốt nhất cho khách hàng.
                        </p>
                        <p>
                            Là một sản phẩm về sức khoẻ con người, chúng tôi “kinh doanh dựa trên sự tử tế”
                            lấy khách hàng là trọng tâm, không ngừng thay đổi cải tiến sản phẩm cũng như
                            dịch vụ đi kèm. Ngoài ra, hệ thống kỹ thuật viên giàu kinh nghiệm, trang thiết
                            bị máy móc hiện đại cùng dịch vụ tư vấn tận tâm giúp DESMON trở thành địa chỉ
                            tin cậy đồng hành cùng hàng triệu khách hàng Việt.
                        </p>
                    </div>

                    <div className="intro-img">
                        <img src="/images/intro.png" alt="Giới thiệu DESMON" />
                    </div>
                </div>
            </div>

            <div className="row-brand">
                <div className="row-brand1">
                    <div className="col-1-brand">
                        <img src="/images/col1.png" alt="Mẫu mã đa dạng" />
                        <p style={{ textAlign: "center", color: "#ff5c00" }}>MẪU MÃ ĐA DẠNG</p>
                        <p style={{ textAlign: "center" }}>
                            Thấu hiểu thị hiếu khách hàng, mẫu mã của DESMON đa dạng, phù hợp với nhiều yêu cầu khác nhau.
                        </p>
                    </div>

                    <div className="col-1-brand">
                        <img src="/images/col-2.png" alt="Chất lượng đi đầu" />
                        <p style={{ textAlign: "center", color: "#ff5c00" }}>CHẤT LƯỢNG ĐI ĐẦU</p>
                        <p style={{ textAlign: "center" }}>
                            Các sản phẩm được chọn lựa kỹ lưỡng, độ tinh xảo cao đi cùng chuyên viên kinh nghiệm và máy móc tiên tiến, hiện đại.
                        </p>
                    </div>

                    <div className="col-1-brand">
                        <img src="/images/col-3.png" alt="Giá cả hợp lý" />
                        <p style={{ textAlign: "center", color: "#ff5c00" }}>GIÁ CẢ HỢP LÝ</p>
                        <p style={{ textAlign: "center" }}>
                            Mức giá cạnh tranh tương xứng với chất lượng, nhiều chương trình ưu đãi và chế độ bảo hành hậu mãi.
                        </p>
                    </div>
                </div>
            </div>

            <div className="dangki">
                <div className="dangki1">
                    <div className="col-1-dk">
                        <img src="/images/dki-1024x514.jpg" alt="" style={{ width: "100%" }} className="anhlaysrc" />
                    </div>

                    <div className="col-2-dki">

                        <div className="gt-dki">
                            <p style={{ margin: "2px" }}>ĐẶT TRƯỚC DỊCH VỤ</p>
                            <label for="">ĐĂNG KÝ KHÁM MẮT</label>
                            <p>
                                Quý khách hàng vui lòng đăng ký dịch vụ khám mắt trước 30
                                <br />
                                phút để được phục vụ tốt nhất.
                            </p>
                        </div>
                        <div className="input-dki">
                            <input type="text" placeholder="Họ và tên" />
                            <input type="text" placeholder="Số điện thoại" />
                            <select name="" id="">
                                <option value="#">Chọn thời gian khám</option>
                            </select>
                            <button type="submit"> ĐĂNG KÍ KHÁM</button>
                        </div>
                    </div>
                </div>

            </div>

            <div className="doi-tac">
                <div className="doi-tac-center">
                    <p>
                        <span>ĐỐI TÁC HÀNG ĐẦU</span>
                    </p>
                    <img src="/images/doitac5.png" alt="" />
                    <img src="/images/doitac4.png" alt="" />
                    <img src="/images/doitac1.png" alt="" />
                    <img src="/images/doitac2.jpg" alt="" />
                    <img src="/images/doitac3.jpg" alt="" />
                </div>
            </div>

        </>
    );
}