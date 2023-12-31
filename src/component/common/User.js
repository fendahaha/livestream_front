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
import {useMyLocale} from "@/component/context/localeContext";

export default function User() {
    const {getDict} = useMyLocale('User');
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
        const props = {
            icon: <UserOutlined/>,
            style: {marginLeft: 10, cursor: 'pointer'},
        }
        if (_user?.userAvatar) {
            return <Avatar {...props} src={`${imagePrefix}/${_user?.userAvatar}`}/>
        } else {
            return <Avatar {...props}/>
        }
    }, [_user?.userAvatar]);
    return (
        <>
            {!user && <Tooltip placement="bottom" title={getDict('title')} arrow={true}>
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
                                        <Button block={true}>{dictionary.User.userCenter}</Button>
                                    </Link>
                                )
                            },
                            {
                                key: '2',
                                label: (
                                    <Button danger block={true} onClick={() => {
                                        logout(() => {
                                            updateUser({action: 'replace', data: null});
                                            router.refresh();
                                            message.success(dictionary.User.logoutSuccessMsg);
                                        });
                                    }}>{dictionary.User.logoutButtonText}</Button>
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