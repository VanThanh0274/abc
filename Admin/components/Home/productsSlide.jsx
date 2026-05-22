"use client";

import { useEffect, useState } from "react";
import { getProductgioithieu } from "../../services/product";
import Slider from "react-slick";
import Image from "next/image";
import { imgURLlocal } from "../../assets/localhostimg";
import {useRouter} from 'next/navigation'

export default function ProductSlide({gioithieu}) {
    const [list, setlist] = useState([]);
    const Load = async () => {
        const data = await getProductgioithieu(gioithieu);
        setlist(data)
        console.log(data);
        
    }
    const router = useRouter();

    const settings = {
        dots: true,
        infinite: true,
        speed: 300,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
    };
    useEffect(() => {
        Load();
    }, [])
    return (
        <div>
            <div style={{ width: "100%", textAlign: "center" }}>
                <h2 style={{ marginTop: "40px"}}>{gioithieu}</h2>
            </div>
            <div className="slidekinh" style={{ marginTop: '30px' }}>
                <Slider {...settings} className="slidekinh-center" id="slidekinhs">
                    {list.map((products) => (
                        <div style={{ display: 'flex', justifyContent: 'center' }} onClick={() => {router.push(`/products?id=${products.id}`)}}>
                            <div className="huy">
                                <img src={`${imgURLlocal()}${products.anh}`} alt="" width={200} height={200} />
                                <p style={{ textAlign: 'center', fontSize: 14, color: 'rgb(51, 49, 49)' }}>
                                    {products.ten}
                                </p>
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    {/* <span style={{ textDecoration: 'line-through' }}>480.000 đ</span> */}
                                    <span style={{ color: 'rgb(249, 98, 5)', marginLeft: 3 }}>{products.giaban.toLocaleString("vi-VN")} đ</span>
                                </div>
                            </div>
                        </div>
                    ))}


                    
                </Slider>
            </div>

        </div>
    )
}