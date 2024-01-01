'use client'
import React, {useContext, useEffect, useState} from "react";
import {GlobalContext} from "@/component/context/globalContext";
import {Empty} from "antd";
import {userTypeUtil} from "@/util/commonUtil";
import styles from './follows.module.css';
import {get_client_followed_anchors} from "@/app/_func/client";
import {imagePrefix} from "@/util/requestUtil";
import {ImagesModal} from "@/app/(front)/component/ZhuboOfflineCover";
import {SubscribeContext} from "@/component/subscribeButton";

export function Anchor({anchor}) {
    const {user, room} = anchor
    return (
        <div className={styles.anchor}>
            <div className={`${styles.anchor_item} ${styles.anchor_item_1}`}>
                <img src={`${imagePrefix}/${user.userAvatar}`} alt={''}
                     className={styles.anchor_image}/>
            </div>
            <div className={`${styles.anchor_item} ${styles.anchor_item_2}`}>
                <div className={styles.shadow}></div>
            </div>
            <div className={`${styles.anchor_item} ${styles.anchor_item_3}`}>
                <div className={styles.anchor_name}>
                    <img src={'https://uat.sm88i.net/images/pt/icon_TH_20220829.svg'} alt={user.userCountry}
                         className={styles.country_icon}/>
                    <span>{user.userName}</span>
                </div>
            </div>
            <ImagesModal userUuid={user.userUuid}>
                <div className={styles.anchor_item} style={{zIndex: 4}}></div>
            </ImagesModal>
        </div>
    )
}

export function FollowedAnchors({anchors}) {
    return (
        <div className={styles.anchor_list}>
            {anchors.map(a => <Anchor key={a.id} anchor={a}/>)}
        </div>
    )
}

export default function Follows() {
    const subscribeContext = useContext(SubscribeContext);
    const {user} = useContext(GlobalContext);
    const [anchors, setAnchors] = useState([]);
    useEffect(() => {
        if (user?.userUuid) {
            get_client_followed_anchors(user?.userUuid)
                .then(list => {
                    setAnchors(list);
                })
        } else {
            setAnchors([]);
        }
    }, [user?.userUuid, subscribeContext]);
    return (
        <>
            {user && userTypeUtil.is_client(user?.userType) ?
                <FollowedAnchors anchors={anchors}/>
                : <Empty description={false}/>
            }
        </>
    );
}