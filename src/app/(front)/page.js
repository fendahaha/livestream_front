import Slider from "@/app/(front)/component/Slider";
import styles from "./page.module.css";
import ZhuboStreamList from "@/app/(front)/component/ZhuboStreamList";
import ZhuboRankList from "@/app/(front)/component/ZhuboRankList";
import {FixWidthDiv} from "@/component/common/WidthDiv";
import {nodeBackendFetch} from "@/util/requestUtil";

const test_data = ['/nav/nav1.jpg', '/nav/nav2.jpg', '/nav/nav3.jpg'];

const get_anchors = async () => {
    const list = await nodeBackendFetch.postJson("/anchor/allAnchors").then(r => {
        if (r && r.data) {
            return r.data
        }
    })
    return list ? list : []
}
export default async function Home() {
    const anchors = await get_anchors();
    return (
        <div>
            <FixWidthDiv>
                <div>
                    <Slider items={test_data}/>
                </div>
                <div className={styles.layout}>
                    <div className={styles.left}>
                        <ZhuboStreamList list={anchors}/>
                    </div>
                    <div className={styles.right}>
                        <ZhuboRankList/>
                    </div>
                </div>
            </FixWidthDiv>
        </div>
    )
}
