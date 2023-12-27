'use client'
import styles from "./ZhuboRankList.module.css";
import {imagePrefix} from "@/util/requestUtil";
import Link from "next/link";
import {ImagesModal} from "@/app/(front)/component/ZhuboOfflineCover";

export default function ZhuboRankList({list}) {
    const top = list.slice(0, 3);
    const others = list.slice(3, 8);
    for (let i = 0; i < top.length; i++) {
        let rankClassName = styles.rank1;
        if (i === 1) {
            rankClassName = styles.rank2;
        }
        if (i === 2) {
            rankClassName = styles.rank3;
        }
        top[i]['rank'] = rankClassName;
    }
    for (let i = 0; i < others.length; i++) {
        others[i]['rank'] = `/rank/rank${i + 4}.svg`;
    }
    const s1 = top.map(e => {
        return (
            <span key={e.room_uuid} className={e.rank}>
                {e.online ?
                    <Link className={styles.zhubo} href={`/room/${e.room_uuid}`}>
                        <div className={styles.s1}>
                            <img src={`${imagePrefix}/${e.avatar}`} alt={''} className={styles.avatar}/>
                        </div>
                        <div className={styles.s2}>
                            <img src={'/country/tw.svg'} alt={''} className={styles.country}/>
                            <span className={styles.name}>{e.name}</span>
                        </div>
                        <div className={styles.s3}>32C/23/33</div>
                    </Link>
                    :
                    <ImagesModal userUuid={e.user_uuid}>
                        <div className={`${styles.zhubo} ${e.rank}`}>
                            <div className={styles.s1}>
                                <img src={`${imagePrefix}/${e.avatar}`} alt={''} className={styles.avatar}/>
                            </div>
                            <div className={styles.s2}>
                                <img src={'/country/tw.svg'} alt={''} className={styles.country}/>
                                <span className={styles.name}>{e.name}</span>
                            </div>
                            <div className={styles.s3}>32C/23/33</div>
                        </div>
                    </ImagesModal>
                }
            </span>
        )
    });

    const s2 = others.map(e => {
        return (
            <div className={styles.zb} key={e.room_uuid}>
                {e.online ?
                    <Link className={styles.zb_link} href={`/room/${e.room_uuid}`}>
                        <div className={styles.t1}>
                            <img src={e.rank} alt={''} className={styles.zb_i1}/>
                            <div className={styles.zb_i2}>
                                <img src={`${imagePrefix}/${e.avatar}`} alt={''}/>
                            </div>
                            <div className={styles.zb_i3}>
                                <img src={'/country/tw.svg'} alt={''}/>
                                <span>{e.name}</span>
                            </div>
                        </div>
                        <div className={styles.t2}>32C/24/35</div>
                    </Link>
                    :
                    <ImagesModal userUuid={e.user_uuid}>
                        <div className={styles.zb_link}>
                            <div className={styles.t1}>
                                <img src={e.rank} alt={''} className={styles.zb_i1}/>
                                <div className={styles.zb_i2}>
                                    <img src={`${imagePrefix}/${e.avatar}`} alt={''}/>
                                </div>
                                <div className={styles.zb_i3}>
                                    <img src={'/country/tw.svg'} alt={''}/>
                                    <span>{e.name}</span>
                                </div>
                            </div>
                            <div className={styles.t2}>32C/24/35</div>
                        </div>
                    </ImagesModal>
                }
            </div>
        );
    });
    return (
        <div className={styles.list}>
            <div className={styles.d1}>
                {/*<a href={''}>*/}
                {/*    <div className={`${styles.anchor1} ${styles.rank2}`}>*/}
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
                {/*    <div className={`${styles.anchor1} ${styles.rank1}`}>*/}
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
                {/*    <div className={`${styles.anchor1} ${styles.rank3}`}>*/}
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