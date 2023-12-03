import styles from "./ZhuboStreamList.module.css";

const test_data = [
    {'country': '/country/tw.svg', 'img': '/zb/zb1.png', 'name': 'as', 'is_online': true},
    {'country': '/country/tw.svg', 'img': '/zb/zb2.png', 'name': 'asdadsa', 'is_online': false},
    {'country': '/country/tw.svg', 'img': '/zb/zb3.png', 'name': 'adfaf', 'is_online': true},
    {'country': '/country/tw.svg', 'img': '/zb/zb4.png', 'name': 'adf', 'is_online': false},
    {'country': '/country/tw.svg', 'img': '/zb/zb5.png', 'name': 'afef', 'is_online': false},
    {'country': '/country/tw.svg', 'img': '/zb/zb6.png', 'name': 'afa', 'is_online': false},
    {'country': '/country/tw.svg', 'img': '/zb/zb7.png', 'name': 'adasdasd', 'is_online': false},
    {'country': '/country/tw.svg', 'img': '/zb/zb8.png', 'name': 'adasdad', 'is_online': false},
    {'country': '/country/tw.svg', 'img': '/zb/zb9.png', 'name': 'adasad', 'is_online': true},
    {'country': '/country/tw.svg', 'img': '/zb/zb10.png', 'name': 'adaefsd', 'is_online': true},
    {'country': '/country/tw.svg', 'img': '/zb/zb11.png', 'name': 'adasdfd', 'is_online': true},
    {'country': '/country/tw.svg', 'img': '/zb/zb12.png', 'name': 'adasfr4wd', 'is_online': false},
    {'country': '/country/tw.svg', 'img': '/zb/zb13.png', 'name': 'ada234sd', 'is_online': true},
    {'country': '/country/tw.svg', 'img': '/zb/zb14.png', 'name': 'adasfed', 'is_online': true},
    {'country': '/country/tw.svg', 'img': '/zb/zb15.png', 'name': 'adassdgdd', 'is_online': false},
    {'country': '/country/tw.svg', 'img': '/zb/zb16.png', 'name': 'adassrg4d', 'is_online': false},
    {'country': '/country/tw.svg', 'img': '/zb/zb17.png', 'name': 'adassr3d', 'is_online': true},
    {'country': '/country/tw.svg', 'img': '/zb/zb18.png', 'name': 'adassdfdd', 'is_online': true},
]
export default function ZhuboStreamList({list = test_data}) {
    const items = list.map(e => {
        let isOnlineClass = e.is_online ? styles.online : styles.offline
        return (
            <div className={styles.item} key={e.name}>
                <div className={isOnlineClass}>
                    <img src={e.img} alt={""} className={styles.item_img}/>
                    <div className={styles.item_info}>
                        <div className={styles.status}></div>
                        <div className={styles.zhubo}>
                            <img src={e.country} alt={""} className={styles.zhubo_icon}/>
                            <span className={styles.zhubo_name}>{e.name}</span>
                        </div>
                    </div>
                    {e.is_online ?
                        <a className={styles.live_link} href={""}>
                            <div className={styles.live_link_button}>go to live</div>
                        </a>
                        :
                        <div className={styles.offline_cover}></div>
                    }
                </div>
            </div>
        )
    })
    return (
        <div className={styles.list}>
            {items}
            {/*<div className={styles.item}>*/}
            {/*    <div className={styles.offline}>*/}
            {/*        <img src={"/zb/zb1.png"} alt={""} className={styles.item_img}/>*/}
            {/*        <div className={styles.item_info}>*/}
            {/*            <div className={styles.status}></div>*/}
            {/*            <div className={styles.zhubo}>*/}
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
            {/*            <div className={styles.zhubo}>*/}
            {/*                <img src={"/country/tw.svg"} alt={""} className={styles.zhubo_icon}/>*/}
            {/*                <span className={styles.zhubo_name}>adsadsad</span>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*        <a className={styles.live_link} href={""}>*/}
            {/*            <div className={styles.live_link_button}>go to live</div>*/}
            {/*        </a>*/}
            {/*    </div>*/}
            {/*</div>*/}

        </div>
    );
}