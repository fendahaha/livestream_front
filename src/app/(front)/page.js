import {MyCarousel} from "@/app/(front)/component/Slider";
import {FixWidthDiv} from "@/component/common/WidthDiv";
import {get_anchors, get_rank_anchors} from "@/app/_func/server";
import ZhuboStreamRankList from "@/app/(front)/component/ZhuboStreamRankList";

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
                <ZhuboStreamRankList anchors={anchors} rank_anchors={rank_anchors}/>
            </FixWidthDiv>
        </div>
    )
}
