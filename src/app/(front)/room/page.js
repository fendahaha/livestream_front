import styles from './page.module.css';
import {FullWidthDiv} from "@/component/common/WidthDiv";

export default function Component() {
    return (
        <FullWidthDiv>
            <div className={styles.layout1}>
                <div className={styles.layout1_left}></div>
                <div className={styles.layout1_right}></div>
            </div>
        </FullWidthDiv>
    );
}