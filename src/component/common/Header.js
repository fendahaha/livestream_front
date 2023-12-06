'use client'
import styles from "./Header.module.css";
import Link from "next/link";
import {usePathname} from "next/navigation";
import Search from "antd/es/input/Search";
import {Avatar, Modal, Tooltip} from "antd";
import {UserOutlined} from "@ant-design/icons";
import {useState} from "react";
import Login from "@/app/login/Login";

const test_data = [
    {'href': '/', 'name': 'home'},
    {'href': '/event', 'name': 'event'},
    {'href': '/tv', 'name': 'tv'},
    {'href': '/follow', 'name': 'follow'},
    {'href': '/adasd', 'name': 'asdasda'},
];

export default function Header({navs = test_data}) {
    const [loginModalOpen, setLoginModalOpen] = useState(false);
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
                        {/*<label className={styles.search}>*/}
                        {/*    <input type={'text'} name={'search'} id={"search"}/>*/}
                        {/*    <span className={styles.button}>search</span>*/}
                        {/*</label>*/}
                        <Search
                            placeholder="input search text"
                            allowClear
                            onSearch={(d) => {
                                console.log(d);
                            }}
                            style={{
                                width: 200
                            }}
                        />
                        <Tooltip placement="right" title={""} arrow={true}>
                            {/*<Link href={'/login'}>*/}
                            {/*    <Avatar icon={<UserOutlined/>} style={{marginLeft: 10, 'cursor': 'pointer'}}/>*/}
                            {/*</Link>*/}
                            <div onClick={() => setLoginModalOpen(true)}>
                                <Avatar icon={<UserOutlined/>} style={{marginLeft: 10, 'cursor': 'pointer'}}/>
                            </div>
                            <Modal
                                title=""
                                centered
                                width={800}
                                open={loginModalOpen}
                                destroyOnClose={true}
                                footer={null}
                                onOk={() => setLoginModalOpen(false)}
                                onCancel={() => setLoginModalOpen(false)}
                            >
                                <Login/>
                            </Modal>
                        </Tooltip>
                    </div>
                </div>
            </div>
        </div>
    );
}