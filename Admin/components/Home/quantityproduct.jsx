"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getTotalCategory } from "../../services/category";
import Link from "next/link";

export default function Quantityproduct() {
  const [tongKinhCan, setTongKinhCan] = useState(0);
  const [tongKinhRam, setTongKinhRam] = useState(0);
  useEffect(() => {
    const fetchData = async () => {
      const data = await getTotalCategory("Gọng kính");
      const data1 = await getTotalCategory("Kính râm");
      setTongKinhCan(data);
      setTongKinhRam(data1);
      
    }
    fetchData()
  }, [])
  return (
    <div className="sosp1">
      <div className="sosp">

        <div className="kinhram">
          <Image
            src="/images/kinh-ram.png"
            alt="Kính râm"
            width={400}
            height={300}
            style={{ width: "100%", height: "auto" }}
          />
        </div>
        <div className="sosp-kinhram">
          <h2>KÍNH RÂM</h2>
          <p>{tongKinhRam.sl} SẢN PHẨM</p>
          <Link href={`/listproduct?id=${tongKinhRam.id}`}>
            <button className="sosp-kinhram-button">Xem ngay</button>
          </Link>
        </div>

        <div className="kinhcan">
          <Image
            src="/images/Artboard-1-1.png"
            alt="Kính cận"
            width={400}
            height={300}
            style={{ width: "100%", height: "auto" }}
          />
        </div>
        <div className="sosp-kinhcan">
          <h2>KÍNH CẬN</h2>

          <p>{tongKinhCan.sl} SẢN PHẨM</p>
          <Link href={`/listproduct?id=${tongKinhCan.id}`}>
            <button className="sosp-kinhram-button">Xem ngay</button>
          </Link>
        </div>

      </div>
    </div>
  );
}
