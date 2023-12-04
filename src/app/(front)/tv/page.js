import styles from "./page.module.css";
import {FixWidthDiv} from "@/component/common/WidthDiv";

export default function Component() {
    return (
        <FixWidthDiv>
            <div className={styles.list}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map(e => {
                    return (
                        <div className={styles.item} key={e}>
                            <div className={styles.content}>
                                <img src={'/event/icon_THVL1.png'} alt={''} className={styles.bg}/>
                                <div className={styles.cover}></div>
                            </div>
                            <div className={styles.name}>
                                <img src={"/country/tw.svg"} alt={""} className={styles.icon}/>
                                <span>HTV2</span>
                            </div>
                        </div>
                    )
                })}

            </div>
        </FixWidthDiv>
    )
}