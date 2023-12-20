import {MyCarousel} from "@/app/(front)/component/Slider";
import styles from "./page.module.css";
import ZhuboStreamList from "@/app/(front)/component/ZhuboStreamList";
import ZhuboRankList from "@/app/(front)/component/ZhuboRankList";
import {FixWidthDiv} from "@/component/common/WidthDiv";
import {nodeBackendFetch} from "@/util/requestUtil";

const test_data = [
    {img: '/nav/nav1.jpg', link: ''},
    {img: '/nav/nav2.jpg', link: ''},
    {img: '/nav/nav3.jpg', link: ''},
];

const get_anchors = async () => {
    const list = await nodeBackendFetch.postJson("/anchor/allAnchors").then(r => {
        if (r && r.data) {
            return r.data
        }
    })
    return list ? list : []
}
const get_rank_anchors = async () => {
    const list = await nodeBackendFetch.postJson("/anchor/rank").then(r => {
        if (r && r.data) {
            return r.data
        }
    })
    return list ? list : []
}
export default async function Home() {
    const anchors = await get_anchors();
    const rank_anchors = await get_rank_anchors();
    return (
        <div>
            <FixWidthDiv>
                <div>
                    <MyCarousel data={test_data}/>
                </div>
                <div className={styles.layout}>
                    <div className={styles.left}>
                        <ZhuboStreamList list={anchors}/>
                    </div>
                    <div className={styles.right}>
                        <ZhuboRankList list={rank_anchors}/>
                    </div>
                </div>
            </FixWidthDiv>
        </div>
    )
}
