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
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const {user, updateUser} = useContext(GlobalContext);
    const userAvatar = useMemo(() => {
        return <Avatar icon={<UserOutlined/>} style={{marginLeft: 10, 'cursor': 'pointer'}}/>
    }, []);
    let router = useRouter();
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
                        updateUser({action: 'replace', data: user});
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
                                        <Button>修改资料</Button>
                                    </Link>
                                )
                            },
                            {
                                key: '2',
                                label: (
                                    <Button danger onClick={() => {
                                        logout(() => {
                                            updateUser({action: 'replace', data: null});
                                            message.success("已退出登录")
                                            router.refresh();
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