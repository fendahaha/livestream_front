'use client'
import styles from './Footer.module.css';
import {HeartOutlined, TrophyOutlined, UserOutlined, YoutubeOutlined} from "@ant-design/icons";
import {useLoginUser} from "@/component/context/globalContext";
import {Avatar, Button, message, Modal, Popover, Tooltip} from "antd";
import {useEffect, useMemo, useState} from "react";
import {clientBackendFetch, imagePrefix} from "@/util/requestUtil";
import {useMyLocale} from "@/component/context/localeContext";
import {useRouter} from "next/navigation";
import Login from "@/component/common/Login";
import Link from "next/link";
import {logout} from "@/app/_func/client";
import {userTypeUtil} from "@/util/commonUtil";

export function User() {
    const {getDict} = useMyLocale('User');
    const router = useRouter();
    const {user, updateUser} = useLoginUser();
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const [_user, set_user] = useState(user);
    useEffect(() => {
        if (user?.userUuid) {
            clientBackendFetch.getJson(`/user/${user?.userUuid}`).then(r => {
                set_user(r?.data)
            })
        }
    }, [user?.userUuid]);
    const userAvatar = useMemo(() => {
        const props = {
            icon: <UserOutlined/>,
            style: {cursor: 'pointer'},
        }
        if (_user?.userAvatar) {
            return <Avatar {...props} src={`${imagePrefix}/${_user?.userAvatar}`}/>
        } else {
            return <Avatar {...props}/>
        }
    }, [_user?.userAvatar]);
    const userItem = useMemo(() => {
        return (
            <div className={`${styles.item}`}>
                <span className={styles.icon}>
                    <UserOutlined/>
                </span>
                <span className={styles.text}>
                    User
                </span>
            </div>
        )
    }, []);
    const popoverContent = (
        <div className={styles.popoverContent}>
            {userAvatar}
            <Link href={user?.userType === 3 ? '/user/client' : '/user/anchor'}>
                <Button block={true}>{getDict('userCenter')}</Button>
            </Link>
            <Button danger block={true} onClick={() => {
                logout(() => {
                    updateUser({action: 'replace', data: null});
                    set_user(null);
                    router.refresh();
                    message.success(getDict('logoutSuccessMsg'));
                });
            }}>
                {getDict('logoutButtonText')}
            </Button>
            {userTypeUtil.is_anchor(user?.userType) ?
                <Button type={'primary'} block={true} href={'/mobile_do_live'}>开始直播</Button>
                : ''
            }

        </div>
    );
    return (
        <>
            {!user && <Tooltip placement="bottom" title={getDict('title')} arrow={true}>
                <div onClick={() => setLoginModalOpen(true)}>
                    {userItem}
                </div>
                <Modal
                    width={650}
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
                <Popover content={popoverContent} title="">
                    {userItem}
                </Popover>
            }
        </>
    );
}

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
            <a href={'/mobile/follow'}>
                <div className={`${styles.item}`}>
                    <span className={styles.icon}>
                        <HeartOutlined/>
                    </span>
                    <span className={styles.text}>
                        Follow
                    </span>
                </div>
            </a>
            <a href={''}>
                <div className={`${styles.item}`}>
                    <span className={styles.icon}>
                        <TrophyOutlined/>
                    </span>
                    <span className={styles.text}>
                        Rank
                    </span>
                </div>
            </a>
            <a href={null}>
                <User/>
            </a>
        </div>
    );
}