'use client';
import Image from 'next/image';
import './style.css'; // Đảm bảo bạn có file style.css tương ứng

export default function GioiThieu() {
    return (
        <div>
            <div className="app">
                <div className="menuintro">
                    <div>
                        <Image src="/images/intro/logo.png" alt="Logo" width={200} height={50} />
                    </div>
                    <p>CỬA HÀNG</p>
                </div>

                <div className="div-img gioithieu1">
                    <Image src="/images/intro/gioithieu1.jpg" alt="" width={1920} height={600} style={{ width: '100%', height: 'auto' }} />
                    <h3 id="bold">Bold</h3>
                    <h3 id="likeyou">Like You</h3>
                </div>

                <div className="videogioithieu">
                    <video width="100%" autoPlay loop muted controls>
                        <source src="/images/intro/cut-1-20230818045639-kkb4i.mp4" type="video/mp4" />
                    </video>
                </div>

                <div className="aDreamof">
                    <div className="aDreamof-center">
                        <div className="aDreamof-left">
                            <h3 className="adream1">A Dream of</h3>
                            <h3 className="adream2">Italy</h3>
                        </div>
                        <div className="aDreamof-right">
                            <p>Được thiết kế tại Ý bởi những nghệ nhân có kinh nghiệm...</p>
                            <p>Dù đó là một cặp kính râm thanh lịch...</p>
                        </div>
                    </div>
                </div>

                <div className="aDreamof">
                    <div className="aDreamof-center gioithieuimgcenter">
                        <Image src="/images/intro/gioithieu3.jpg" alt="" width={630} height={570} />
                        <Image src="/images/intro/gioithieu4.jpg" alt="" width={500} height={570} />
                    </div>
                </div>

                <div className="videogioithieu">
                    <video width="100%" autoPlay loop muted controls>
                        <source src="/images/intro/gioithieuvideo2.mp4" type="video/mp4" />
                    </video>
                </div>

                <div style={{ width: '100%' }}>
                    <Image src="/images/intro/gioithieu5.png" alt="" width={1920} height={600} style={{ width: '100%', height: 'auto' }} />
                </div>
            </div>

            <div className="brandworld">
                <div className="brandworld-center">
                    <div className="brandworlds">
                        <div className="Presence">
                            <h3 className="huy1" style={{ fontSize: '70px' }}>A</h3>
                            <h3 className="huy2" style={{ fontSize: '100px' }}>Worldwide</h3>
                            <h3 className="huy3" style={{ fontSize: '80px' }}>Presence</h3>
                        </div>
                        <div className="Presence-img">
                            <Image src="/images/intro/gioithieu6.png" alt="" width={600} height={400} />
                        </div>
                    </div>

                    <div className="brandworlds idol">
                        <Image src="/images/intro/gioithieu8.jpg" alt="" width={485} height={600} style={{ padding: '10px' }} />
                        <Image src="/images/intro/gioithieu9.jpg" alt="" width={485} height={600} style={{ padding: '10px' }} />
                    </div>

                    <div className="brandworlds brand">
                        <div className="brandworlds-left">
                            <h3 className="huy1">Brand</h3>
                            <h3 className="huy2">Ambassador</h3>
                            <h3 className="huy3">Urassaya Sperbund</h3>
                        </div>
                        <div className="brandworlds-right">
                            <p>Gặp gỡ đại sứ thương hiệu mới nhất của chúng tôi từ năm 2022...</p>
                            <p>Được lựa chọn nhờ sự tinh tế trong phong cách và sự quyến rũ...</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="footer">
                <div className="footerabs">
                    <h3 style={{ fontSize: '50px', margin: '10px' }}>Follow Us</h3>
                    <a href="https://www.facebook.com/kinhmatdesmon">F A C E B O O K</a>
                </div>
                <Image src="/images/intro/gioithieufooter.jpg" alt="" width={1920} height={600} />
            </div>
        </div>
    );
}
