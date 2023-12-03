import Slider from "@/app/(front)/component/Slider";
import styles from "./page.module.css";
import ZhuboStreamList from "@/app/(front)/component/ZhuboStreamList";
import ZhuboRankList from "@/app/(front)/component/ZhuboRankList";

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
                    <ZhuboRankList/>
                </div>
            </div>
        </div>
    )
}
