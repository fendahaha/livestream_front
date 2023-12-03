'use client'
import styles from "./Header.module.css";
import Link from "next/link";
import {usePathname} from "next/navigation";

const test_data = [
    {'href': '/', 'name': 'home'},
    {'href': '/event', 'name': 'event'},
    {'href': '/tv', 'name': 'tv'},
    {'href': '/follow', 'name': 'follow'},
    {'href': '/adasd', 'name': 'asdasda'},
];

export default function Header({navs = test_data}) {
    const pathname = usePathname();
    return (
        <div className={styles.header}>
            <div>
                <div className={styles.content}>
                    <div className={styles.left}>
                        <img src={"/logo.svg"} alt={"logo"} className={styles.logo}/>
                    </div>
                    <div className={styles.middle}>
                        <ul className={styles.navs}>
                            {navs.map(e => {
                                return (
                                    <li key={e.name} className={e.href === pathname ? styles.active : ''}>
                                        <Link href={e.href} className={styles.nav}>
                                            {e.name}
                                        </Link>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                    <div className={styles.right}>
                        <label className={styles.search}>
                            <input type={'text'} name={'search'} id={"search"}/>
                            <span className={styles.button}>search</span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
}