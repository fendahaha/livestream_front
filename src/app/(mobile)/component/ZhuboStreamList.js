'use client'
import styles from "./ZhuboStreamList.module.css";
import Link from "next/link";
import {imagePrefix} from "@/util/requestUtil";
import {ImagesModal} from "@/app/(front)/component/ZhuboOfflineCover";

export default function ZhuboStreamList({list}) {
    const items = list.map(e => {
        let isOnlineClass = e.online ? styles.online : styles.offline;
        return (
            <div className={styles.item} key={e.room_uuid}>
                <div className={isOnlineClass}>
                    <img src={`${imagePrefix}/${e.avatar}`} alt={""} className={styles.item_img}/>
                    <div className={styles.item_info}>
                        <div className={styles.status}></div>
                        <div className={styles.zhubo}>
                            <img src={"/country/tw.svg"} alt={""} className={styles.zhubo_icon}/>
                            <span className={styles.zhubo_name}>{e.name}</span>
                        </div>
                    </div>
                    {e.online ?
                        <Link className={styles.live_link} href={`/mobile_room/${e.room_uuid}`}>
                            <div className={styles.live_link_button}>go to live</div>
                        </Link>
                        :
                        <ImagesModal userUuid={e.user_uuid}>
                            <div className={styles.offline_cover}/>
                        </ImagesModal>
                    }
                </div>
            </div>
        )
    })
    return (
        <>
            {items}
            {/*<div className={styles.item}>*/}
            {/*    <div className={styles.offline}>*/}
            {/*        <img src={"/zb/zb1.png"} alt={""} className={styles.item_img}/>*/}
            {/*        <div className={styles.item_info}>*/}
            {/*            <div className={styles.status}></div>*/}
            {/*            <div className={styles.anchor1}>*/}
            {/*                <img src={"/country/tw.svg"} alt={""} className={styles.zhubo_icon}/>*/}
            {/*                <span className={styles.zhubo_name}>adsadsad</span>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*        <div className={styles.offline_cover}></div>*/}
            {/*    </div>*/}
            {/*</div>*/}

            {/*<div className={styles.item}>*/}
            {/*    <div className={styles.online}>*/}
            {/*        <img src={"/zb/zb1.png"} alt={""} className={styles.item_img}/>*/}
            {/*        <div className={styles.item_info}>*/}
            {/*            <div className={styles.status}></div>*/}
            {/*            <div className={styles.anchor1}>*/}
            {/*                <img src={"/country/tw.svg"} alt={""} className={styles.zhubo_icon}/>*/}
            {/*                <span className={styles.zhubo_name}>adsadsad</span>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*        <a className={styles.live_link} href={""}>*/}
            {/*            <div className={styles.live_link_button}>go to live</div>*/}
            {/*        </a>*/}
            {/*    </div>*/}
            {/*</div>*/}
        </>
    );
}