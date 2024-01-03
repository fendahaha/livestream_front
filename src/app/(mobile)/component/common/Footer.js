'use client'
import styles from './Footer.module.css';
import {HeartOutlined, YoutubeOutlined} from "@ant-design/icons";

export default function Footer() {
    return (
        <div className={styles.footer}>
            <a href={'/mobile'}>
                <div className={`${styles.item} ${styles.active}`}>
                <span className={styles.icon}>
                    <YoutubeOutlined/>
                </span>
                    <span className={styles.text}>
                    Home
                </span>
                </div>
            </a>

            <a href={''}>
                <div className={`${styles.item}`}>
                <span className={styles.icon}>
                    <HeartOutlined/>
                </span>
                    <span className={styles.text}>
                    Home
                </span>
                </div>
            </a>
        </div>
    );
}