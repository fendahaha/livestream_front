'use client'
import styles from "./Header.module.css";
import Link from "next/link";
import {usePathname} from "next/navigation";
import Search from "antd/es/input/Search";
import User from "@/component/common/User";
import LanguageChange from "@/component/common/LanguageChange";

const test_data = [
    {'href': '/', 'name': 'home'},
    {'href': '/event', 'name': 'event'},
    {'href': '/tv', 'name': 'tv'},
    {'href': '/follow', 'name': 'follow'},
];

export default function Header({navs = test_data}) {
    const pathname = usePathname();
    return (
        <div className={styles.header}>
            <div>
                <div className={styles.content}>
                    <div className={styles.left}>
                        <Link href={'/'}>
                            <img src={"/static/logo.svg"} alt={"logo"} className={styles.logo}/>
                        </Link>
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
                        <Search
                            placeholder="input search text"
                            allowClear
                            onSearch={(d) => console.log(d)}
                            style={{width: 200}}
                        />
                        <User/>
                        <LanguageChange/>
                    </div>
                </div>
            </div>
        </div>
    );
}