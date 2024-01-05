import styles from "./MobileLayout.module.css";
import Footer from "@/app/(mobile)/component/common/Footer";

export default function MobileLayout({children}) {
    return (
        <div className={styles.main}>
            <div className={styles.header}>
                {/*<Header/>*/}
            </div>
            <div className={styles.body}>
                {children}
            </div>
            <div className={styles.footer}>
                <Footer/>
            </div>
        </div>
    );
}