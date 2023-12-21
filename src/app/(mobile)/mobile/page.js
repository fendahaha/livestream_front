import {MyCarousel} from "@/app/(front)/component/Slider";
import styles from './page.module.css';
import {get_anchors} from "@/app/_func/server";
import ZhuboStreamList from "@/app/(front)/component/ZhuboStreamList";

const test_data = [
    {img: '/nav/nav1.jpg', link: ''},
    {img: '/nav/nav2.jpg', link: ''},
    {img: '/nav/nav3.jpg', link: ''},
];
export default async function Component() {
    const anchors = await get_anchors();
    return (
        <div>
            <MyCarousel data={test_data}/>
            <div className={styles.anchor_list}>
                <ZhuboStreamList list={anchors}/>
            </div>
        </div>
    );
}