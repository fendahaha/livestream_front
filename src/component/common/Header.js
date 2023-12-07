'use client'
import styles from "./Header.module.css";
import Link from "next/link";
import {usePathname, useRouter} from "next/navigation";
import Search from "antd/es/input/Search";
import {Avatar, Button, Dropdown, message, Modal, Tooltip} from "antd";
import {UserOutlined} from "@ant-design/icons";
import {useState} from "react";
import Login from "@/component/common/Login";
import {clientBackendFetch} from "@/util/requestUtil";

const test_data = [
    {'href': '/', 'name': 'home'},
    {'href': '/event', 'name': 'event'},
    {'href': '/tv', 'name': 'tv'},
    {'href': '/follow', 'name': 'follow'},
    {'href': '/adasd', 'name': 'asdasda'},
];

export default function Header({user, navs = test_data}) {
    const [messageApi] = message.useMessage();
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const pathname = usePathname();
    let appRouterInstance = useRouter();
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
                        <Search
                            placeholder="input search text"
                            allowClear
                            onSearch={(d) => console.log(d)}
                            style={{width: 200}}
                        />
                        {!user && <Tooltip placement="right" title={"未登录"} arrow={true}>
                            <div onClick={() => setLoginModalOpen(true)}>
                                <Avatar icon={<UserOutlined/>} style={{marginLeft: 10, 'cursor': 'pointer'}}/>
                            </div>
                            <Modal
                                title=""
                                centered
                                open={loginModalOpen}
                                destroyOnClose={true}
                                footer={null}
                                onOk={() => setLoginModalOpen(false)}
                                onCancel={() => setLoginModalOpen(false)}
                            >
                                <Login onSuccess={() => setLoginModalOpen(false)}/>
                            </Modal>
                        </Tooltip>}
                        {user &&
                            <Dropdown
                                placement="bottomLeft"
                                arrow
                                menu={{
                                    items: [
                                        {
                                            key: '1',
                                            label: (
                                                <Link href={'/user'}>
                                                    <Button>修改资料</Button>
                                                </Link>
                                            )
                                        },
                                        {
                                            key: '2',
                                            label: (
                                                <Button danger onClick={() => {
                                                    clientBackendFetch.post('/user/logout', null)
                                                        .then(res => {
                                                            if (res.status === 200) {
                                                                messageApi.success("已退出登录")
                                                                appRouterInstance.refresh()
                                                            }
                                                        })
                                                }}>退出登录</Button>
                                            )
                                        }
                                    ]
                                }}
                            >
                                <Avatar icon={<UserOutlined/>} style={{marginLeft: 10, 'cursor': 'pointer'}}/>
                            </Dropdown>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}