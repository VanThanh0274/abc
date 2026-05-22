'use client'

import './style.css'
import { useState } from 'react'
import { filterProduct } from '../../services/product'
import { useRouter } from 'next/navigation'// Đảm bảo đường dẫn đúng

export default function Filterproduct() {
    const router = useRouter();
    const [selectedChatlieu, setSelectedChatlieu] = useState([]);
    const [selectedKieudang, setSelectedKieudang] = useState([]);

    const handleCheckboxChange = (e, setState) => {
        const { checked, value } = e.target;
        setState(prev =>
            checked ? [...prev, value] : prev.filter(item => item !== value)
        );
    };

    const handleFilter = async () => {
        const chatlieuStr = selectedChatlieu.join(',');
        const kieudangStr = selectedKieudang.join(',');

        router.push(`/listproduct?chatlieu=${encodeURIComponent(chatlieuStr)}&kieudang=${encodeURIComponent(kieudangStr)}`)
    };

    return (
        <div>
            <div className="app-left">

                <div className="row-category">
                    <h4>DANH MỤC SẢN PHẨM</h4>
                    <ul>
                        <li><input type="checkbox" /><label>Gọng Kính cận cả viền</label></li>
                        <li><input type="checkbox" /><label>Gọng Kính Cận Giá Rẻ</label></li>
                        <li><input type="checkbox" /><label>Gọng Kính Cận Nửa Viền</label></li>
                        <li><input type="checkbox" /><label>Gọng Kính Gỗ</label></li>
                    </ul>
                </div>

                <div className="row-shape">
                    <h4>KIỂU DÁNG</h4>
                    <ul>
                        {["Chữ nhật", "Lục giác", "Mắt mèo", "Tròn", "Vuông"].map(shape => (
                            <li key={shape}>
                                <input
                                    type="checkbox"
                                    value={shape}
                                    onChange={e => handleCheckboxChange(e, setSelectedKieudang)}
                                />
                                <label>{shape}</label>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="row-material">
                    <h4>CHẤT LIỆU</h4>
                    <ul>
                        {["Kính", "Kim loại", "Nhựa", "Titan"].map(material => (
                            <li key={material}>
                                <input
                                    type="checkbox"
                                    value={material}
                                    onChange={e => handleCheckboxChange(e, setSelectedChatlieu)}
                                />
                                <label>{material}</label>
                            </li>
                        ))}
                    </ul>
                </div>

                <button onClick={handleFilter}>FILTER</button>
            </div>
        </div>
    );
}
