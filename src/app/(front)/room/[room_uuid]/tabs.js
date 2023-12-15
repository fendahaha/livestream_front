import {useState} from "react";
import styles from './tab.module.css';

export function MyTabs({items}) {
    const [activeKey, setActiveKey] = useState('1');
    return (
        <div className={styles.tabs}>
            <div className={styles.head}>
                {items.map(e => <div key={e.key} className={`${styles.tab} ${activeKey === e.key ? styles.active : ''}`}
                                     onClick={() => setActiveKey(e.key)}>{e.label}</div>)}
            </div>
            <div className={styles.content}>
                {items.map(e => <div key={e.key}
                                     className={`${styles.tab_content} ${activeKey === e.key ? styles.active : ''}`}>
                    {e.children}
                </div>)}
            </div>
        </div>
    )
}