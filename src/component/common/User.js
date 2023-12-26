'use client'
import {useContext, useMemo, useState} from "react";
import {Avatar, Button, Dropdown, message, Modal, Tooltip} from "antd";
import {UserOutlined} from "@ant-design/icons";
import Login from "@/component/common/Login";
import Link from "next/link";
import {GlobalContext} from "@/app/(front)/component/globalContext";
import {useRouter} from "next/navigation";
import {logout} from "@/app/_func/client";

export default function User() {
    const {userInfo, updateUserInfo} = useContext(GlobalContext);
    const {user, anchor, client} = userInfo;
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const userAvatar = useMemo(() => {
        return <Avatar icon={<UserOutlined/>} style={{marginLeft: 10, 'cursor': 'pointer'}}/>
    }, []);
    return (
        <>
            {!user && <Tooltip placement="right" title={"未登录"} arrow={true}>
                <div onClick={() => setLoginModalOpen(true)}>
                    {userAvatar}
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
                    <Login onSuccess={(user) => {
                        setLoginModalOpen(false);
                        updateUserInfo({action: 'replace', data: user});
                    }}/>
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
                                    <Link href={user.userType === 3 ? '/user/client' : '/user/anchor'}>
                                        <Button>用户中心</Button>
                                    </Link>
                                )
                            },
                            {
                                key: '2',
                                label: (
                                    <Button danger onClick={() => {
                                        logout(() => {
                                            updateUserInfo({action: 'replace', data: null});
                                            message.success("已退出登录")
                                        });
                                    }}>退出登录</Button>
                                )
                            }
                        ]
                    }}
                >
                    {userAvatar}
                </Dropdown>
            }
        </>
    );
}