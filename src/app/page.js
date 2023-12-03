import Slider from "@/app/component/Slider";
import styles from "./page.module.css";
import ZhuboStreamList from "@/app/component/ZhuboStreamList";

const test_data = ['/nav/nav1.jpg', '/nav/nav2.jpg', '/nav/nav3.jpg'];
export default function Home() {

    return (
        <div>
            <div>
                <Slider items={test_data}/>
            </div>
            <div className={styles.layout}>
                <div className={styles.left}>
                    <ZhuboStreamList/>
                </div>
                <div className={styles.right}>

                </div>
            </div>
        </div>
    )
}
