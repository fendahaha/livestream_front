import styles from "./page.module.css";
import {FixWidthDiv} from "@/component/common/WidthDiv";

const test_data = [
    {'id': 1, 'bg': '/event/bg_basketball.jpg', 'icon': '/event/icon_basketball.svg'},
    {'id': 12, 'bg': '/event/bg_soccer.jpg', 'icon': '/event/icon_soccer.svg'},
    {'id': 13, 'bg': '/event/bg_soccer.jpg', 'icon': '/event/icon_soccer.svg'},
    {'id': 14, 'bg': '/event/bg_basketball.jpg', 'icon': '/event/icon_basketball.svg'},
    {'id': 15, 'bg': '/event/bg_basketball.jpg', 'icon': '/event/icon_basketball.svg'},
    {'id': 16, 'bg': '/event/bg_basketball.jpg', 'icon': '/event/icon_basketball.svg'},
    {'id': 17, 'bg': '/event/bg_soccer.jpg', 'icon': '/event/icon_soccer.svg'},
    {'id': 18, 'bg': '/event/bg_soccer.jpg', 'icon': '/event/icon_soccer.svg'},
    {'id': 19, 'bg': '/event/bg_basketball.jpg', 'icon': '/event/icon_basketball.svg'},
    {'id': 10, 'bg': '/event/bg_basketball.jpg', 'icon': '/event/icon_basketball.svg'},
    {'id': 21, 'bg': '/event/bg_soccer.jpg', 'icon': '/event/icon_soccer.svg'},
    {'id': 31, 'bg': '/event/bg_basketball.jpg', 'icon': '/event/icon_basketball.svg'},
    {'id': 41, 'bg': '/event/bg_basketball.jpg', 'icon': '/event/icon_basketball.svg'},
    {'id': 51, 'bg': '/event/bg_soccer.jpg', 'icon': '/event/icon_soccer.svg'},
    {'id': 61, 'bg': '/event/bg_soccer.jpg', 'icon': '/event/icon_soccer.svg'},
    {'id': 71, 'bg': '/event/bg_basketball.jpg', 'icon': '/event/icon_basketball.svg'},
];

export default function IndexPage() {
    return (
        <FixWidthDiv>
            <div className={styles.event_list}>
                {test_data.map(e => {
                    return (
                        <div className={styles.event} key={e.id}>
                            <a href={''} className={styles.event_link}>
                                <div className={styles.room}>
                                    <img src={e.bg} alt={""} className={styles.room_background}/>
                                    <div className={styles.room_info}>
                                        <div className={styles.room_info_title}>
                                            <img src={e.icon} alt={""}/>
                                            <span>asdkas djabd</span>
                                        </div>
                                        <div className={styles.room_info_online_user}>
                                            <img src={'/event/icon_people.svg'} alt={''}/>
                                            <span>23K</span>
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.teams}>
                                    <div className={styles.team}>Lazio</div>
                                    <div className={styles.team}>Cagliari</div>
                                </div>
                            </a>
                        </div>
                    )
                })}
                {/*<div className={styles.event}>*/}
                {/*    <a href={''} className={styles.event_link}>*/}
                {/*        <div className={styles.room}>*/}
                {/*            <img src={"/event/bg_basketball.jpg"} alt={""} className={styles.room_background}/>*/}
                {/*            <div className={styles.room_info}>*/}
                {/*                <div className={styles.room_info_title}>*/}
                {/*                    <img src={"/event/icon_basketball.svg"} alt={""}/>*/}
                {/*                    <span>asdkas djabd</span>*/}
                {/*                </div>*/}
                {/*                <div className={styles.room_info_online_user}>*/}
                {/*                    <img src={'/event/icon_people.svg'} alt={''}/>*/}
                {/*                    <span>23K</span>*/}
                {/*                </div>*/}
                {/*            </div>*/}
                {/*        </div>*/}
                {/*        <div className={styles.teams}>*/}
                {/*            <div className={styles.team}>Lazio</div>*/}
                {/*            <div className={styles.team}>Cagliari</div>*/}
                {/*        </div>*/}
                {/*    </a>*/}
                {/*</div>*/}
            </div>
        </FixWidthDiv>
    )
}