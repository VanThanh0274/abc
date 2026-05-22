
import styles from './style.module.css';
import Link from 'next/link';
const blogPosts = [
  {
    title: 'CHĂM SÓC MẮT CẬN THỊ ĐÚNG CÁCH ĐỂ KHÔNG BỊ TĂNG ĐỘ',
    date: '29/10/2022',
    author: 'IDLONG',
    img: '/images/blog/blog0.png',
    excerpt:
      'Cách chăm sóc mắt cận thị đúng cách để không tăng độ... Theo các nhà nghiên cứu, bệnh cận thị thường xuất phát từ hai nguyên nhân chính là di truyền hoặc lối sống…',
  },
  {
    title: 'TOP THỰC PHẨM TỐT CHO MẮT',
    date: '29/10/2022',
    author: 'IDLONG',
    img: '/images/blog/blog2.jpg',
    excerpt:
      '10 thực phẩm tốt cho mắt... Việc bổ sung các thực phẩm dinh dưỡng cho mắt cần được quan tâm nhiều hơn...',
  },
  {
    title: 'QUY TẮC 20-20-20 NGĂN NGỪA CHỨNG MỎI MẮT',
    date: '29/10/2022',
    author: 'IDLONG',
    img: '/images/blog/blog3.png',
    excerpt:
      'Thời gian sử dụng màn hình là một vấn đề lớn... Bạn có thể dành nhiều giờ để nhìn vào màn hình...',
  },
  {
    title: 'QUY TRÌNH BẢO HÀNH & ĐỔI TRẢ',
    date: '29/10/2022',
    author: 'IDLONG',
    img: '/images/blog/blog4.png',
    excerpt:
      'Các sản phẩm kính râm, gọng kính cận... được đổi mới trong vòng 12 tháng với các lỗi…',
  },
  {
    title: 'CHỌN KÍNH THEO KHUÔN MẶT',
    date: '29/10/2022',
    author: 'IDLONG',
    img: '/images/blog/blog5.jpg',
    excerpt:
      'Không chỉ là sản phẩm sức khoẻ... Một gọng kính phù hợp sẽ giúp bạn khoe khéo léo lợi thế...',
  },
];

export default function Blog() {
    return (
        <div>
            <div>
                {blogPosts.map((post, index) => (
                    <div className={styles.blogItem} key={index}>
                        <Link href="/blog/cham-soc-mat" className={styles.title}>{post.title}</Link>
                        <div className={styles.meta}>
                            <span>
                                POSTED ON <a href="">{post.date}</a> BY <a href="">{post.author}</a>
                            </span>
                        </div>
                        <div className={styles.blogItemMain}>
                            <div className={styles.blogItemLeft}>
                                <img src={post.img} alt={post.title} />
                                <p>{post.date.split('/')[0]} Th10</p>
                            </div>
                            <div className={styles.blogItemRight}>
                                <p>{post.excerpt}</p>
                                <Link href="/blog/cham-soc" className={styles.readMore}>CONTINUE READING</Link>
                            </div>
                        </div>
                        <div className={styles.blogItemBottom}>
                            <span>Posted in <Link href="/blog">Blog</Link></span>
                            <Link href="/blog/cham-soc-mat">Leave a comment</Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}