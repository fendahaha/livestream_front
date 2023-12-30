'use client'
import {useContext, useEffect, useMemo, useState} from "react";
import {Avatar, Button, Dropdown, message, Modal, Tooltip} from "antd";
import {UserOutlined} from "@ant-design/icons";
import Login from "@/component/common/Login";
import Link from "next/link";
import {GlobalContext} from "@/component/context/globalContext";
import {useRouter} from "next/navigation";
import {logout} from "@/app/_func/client";
import {clientBackendFetch, imagePrefix} from "@/util/requestUtil";

export default function User() {
    const router = useRouter();
    const {user, updateUser} = useContext(GlobalContext);
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const [_user, set_user] = useState(null);
    useEffect(() => {
        clientBackendFetch.getJson(`/user/${user?.userUuid}`).then(r => {
            set_user(r?.data)
        })
    }, [user?.userUuid]);
    const userAvatar = useMemo(() => {
        if (_user?.userAvatar) {
            return <Avatar icon={<UserOutlined/>} style={{marginLeft: 10, 'cursor': 'pointer'}}
                           src={`${imagePrefix}/${_user?.userAvatar}`}/>
        } else {
            return <Avatar icon={<UserOutlined/>} style={{marginLeft: 10, 'cursor': 'pointer'}}/>
        }
    }, [_user?.userAvatar]);


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
                        router.refresh();
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
                                            updateUser({action: 'replace', data: null});
                                            router.refresh();
                                            message.success("已退出登录");
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