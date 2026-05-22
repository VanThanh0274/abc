'use client';
import Blogmenu from '../../../components/Blog/blogmenu';
import styles from './style.module.css';
export default function BlogLayout({ children }) {
  // const pathname = usePathname();
  // const hideHeaderFooter = pathname === '/introduce';
  return (
    <>
      <div className={styles.content}>

        <div className={styles.left}>
          {children}
        </div>

        <Blogmenu/>

      </div>
      
      
    </>
  );
}