import {MyCarousel} from "@/app/(front)/component/Slider";
import styles from "./page.module.css";
import ZhuboStreamList from "@/app/(front)/component/ZhuboStreamList";
import ZhuboRankList from "@/app/(front)/component/ZhuboRankList";
import {FixWidthDiv} from "@/component/common/WidthDiv";
import MyEmpty from "@/component/ant_common";
import {get_anchors, get_rank_anchors} from "@/app/_func/server";
import {cookies} from "next/headers";
// export const dynamic = 'force-dynamic'
const test_data = [
    {img: '/nav/nav1.jpg', link: ''},
    {img: '/nav/nav2.jpg', link: ''},
    {img: '/nav/nav3.jpg', link: ''},
];

export default async function Home() {
    const anchors = await get_anchors();
    const rank_anchors = await get_rank_anchors();
    return (
        <div>
            <FixWidthDiv>
                <div>
                    <MyCarousel data={test_data}/>
                </div>
                {/*<p>{new Date().getMilliseconds()}</p>*/}
                <div className={styles.layout}>
                    <div className={styles.left}>
                        {anchors.length ? <div className={styles.anchor_list}><ZhuboStreamList list={anchors}/></div> :
                            <MyEmpty/>}
                    </div>
                    <div className={styles.right}>
                        {rank_anchors.length ? <ZhuboRankList list={rank_anchors}/> : <MyEmpty/>}
                    </div>
                </div>
            </FixWidthDiv>
        </div>
    )
}
