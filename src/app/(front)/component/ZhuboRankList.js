import styles from "./ZhuboRankList.module.css";

const list1 = [
    {'avatar': '/zb/zb2.png', 'name': '江酱', 'rank': styles.rank2},
    {'avatar': '/zb/zb1.png', 'name': '球球', 'rank': styles.rank1},
    {'avatar': '/zb/zb3.png', 'name': '杨晴', 'rank': styles.rank3},
];
const list2 = [
    {'avatar': '/zb/zb4.png', 'name': '米奇', 'rank': '/rank/rank4.svg'},
    {'avatar': '/zb/zb5.png', 'name': '子瑜', 'rank': '/rank/rank5.svg'},
    {'avatar': '/zb/zb6.png', 'name': '洁西卡', 'rank': '/rank/rank6.svg'},
    {'avatar': '/zb/zb7.png', 'name': '澄澄', 'rank': '/rank/rank7.svg'},
    {'avatar': '/zb/zb8.png', 'name': '艾米丽', 'rank': '/rank/rank8.svg'},
];
export default function ZhuboRankList() {
    const s1 = list1.map(e => {
        return (
            <a href={''} key={e.name}>
                <div className={`${styles.zhubo} ${e.rank}`}>
                    <div className={styles.s1}>
                        <img src={e.avatar} alt={''} className={styles.avatar}/>
                    </div>
                    <div className={styles.s2}>
                        <img src={'/country/tw.svg'} alt={''} className={styles.country}/>
                        <span className={styles.name}>{e.name}</span>
                    </div>
                    <div className={styles.s3}>32C/23/33</div>
                </div>
            </a>
        )
    });

    const s2 = list2.map(e => {
        return (
            <div className={styles.zb} key={e.name}>
                <a href={''} className={styles.zb_link}>
                    <div className={styles.t1}>
                        <img src={e.rank} alt={''} className={styles.zb_i1}/>
                        <div className={styles.zb_i2}>
                            <img src={e.avatar} alt={''}/>
                        </div>
                        <div className={styles.zb_i3}>
                            <img src={'/country/tw.svg'} alt={''}/>
                            <span>{e.name}</span>
                        </div>
                    </div>
                    <div className={styles.t2}>32C/24/35</div>
                </a>
            </div>
        );
    });
    return (
        <div className={styles.list}>
            <div className={styles.d1}>
                {/*<a href={''}>*/}
                {/*    <div className={`${styles.zhubo} ${styles.rank2}`}>*/}
                {/*        <div className={styles.s1}>*/}
                {/*            <img src={'/zb/zb1.png'} alt={''} className={styles.avatar}/>*/}
                {/*        </div>*/}
                {/*        <div className={styles.s2}>*/}
                {/*            <img src={'/country/tw.svg'} alt={''} className={styles.country}/>*/}
                {/*            <span className={styles.name}>球球</span>*/}
                {/*        </div>*/}
                {/*        <div className={styles.s3}>32C/23/33</div>*/}
                {/*    </div>*/}
                {/*</a>*/}

                {/*<a href={''}>*/}
                {/*    <div className={`${styles.zhubo} ${styles.rank1}`}>*/}
                {/*        <div className={styles.s1}>*/}
                {/*            <img src={'/zb/zb1.png'} alt={''} className={styles.avatar}/>*/}
                {/*        </div>*/}
                {/*        <div className={styles.s2}>*/}
                {/*            <img src={'/country/tw.svg'} alt={''} className={styles.country}/>*/}
                {/*            <span className={styles.name}>球球</span>*/}
                {/*        </div>*/}
                {/*        <div className={styles.s3}>32C/23/33</div>*/}
                {/*    </div>*/}
                {/*</a>*/}

                {/*<a href={''}>*/}
                {/*    <div className={`${styles.zhubo} ${styles.rank3}`}>*/}
                {/*        <div className={styles.s1}>*/}
                {/*            <img src={'/zb/zb1.png'} alt={''} className={styles.avatar}/>*/}
                {/*        </div>*/}
                {/*        <div className={styles.s2}>*/}
                {/*            <img src={'/country/tw.svg'} alt={''} className={styles.country}/>*/}
                {/*            <span className={styles.name}>球球</span>*/}
                {/*        </div>*/}
                {/*        <div className={styles.s3}>32C/23/33</div>*/}
                {/*    </div>*/}
                {/*</a>*/}
                {s1}
            </div>

            <div className={styles.d2}>
                {/*<div className={styles.zb}>*/}
                {/*    <a href={''} className={styles.zb_link}>*/}
                {/*        <div className={styles.t1}>*/}
                {/*            <img src={'/rank/rank4.svg'} alt={''} className={styles.zb_i1}/>*/}
                {/*            <div className={styles.zb_i2}>*/}
                {/*                <img src={'/zb/zb2.png'} alt={''}/>*/}
                {/*            </div>*/}
                {/*            <div className={styles.zb_i3}>*/}
                {/*                <img src={'/country/tw.svg'} alt={''}/>*/}
                {/*                <span>艾米丽</span>*/}
                {/*            </div>*/}
                {/*        </div>*/}
                {/*        <div className={styles.t2}>32C/24/35</div>*/}
                {/*    </a>*/}
                {/*</div>*/}
                {s2}
            </div>
        </div>
    );
}