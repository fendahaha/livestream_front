'use client'
import React, {useContext, useState} from "react";
import Link from "next/link";
import {CloseOutlined, CrownOutlined, MessageOutlined, QrcodeOutlined, SoundOutlined} from "@ant-design/icons";
import {imagePrefix} from "@/util/requestUtil";
import {useMyLocale} from "@/component/context/localeContext";
import {GlobalContext} from "@/component/context/globalContext";
import {useMobilePageContext} from "@/component/context/PageContext";
import IosHlsPlayer from "@/component/player/IosHlsPlayer";
import FlvContainer from "@/component/player/FlvContainer";
import {SmallScribeButton} from "@/component/subscribeButton";
import {Messages, SendButton} from "./messages";
import styles from './css/Room.module.css';
import {useRoomStomp} from "@/app/(mobile)/mobile_room/_component/roomStompUtil";
import WebRtcPlayer from "@/component/player/WebRtcPlayer";

export default function Room({anchor, anchorUser, room, streamUrl, streamParam, topic}) {
    const {isIos} = useMobilePageContext();
    const {getDict} = useMyLocale('Room');
    const {user, updateUser} = useContext(GlobalContext);
    const [danmuRef, giftRef, chatMessages, giftMessages, sendChatMessage, sendGiftMessage,
        onlineUserUpdateSign, setOnlineUserUpdateSign
    ] = useRoomStomp(room.roomUuid, topic, anchorUser.userUuid, anchorUser.userName, user?.userUuid, user?.userName, user?.userType);
    const [showMessage, setShowMessage] = useState(true);
    return (
        <div className={styles.room}>
            <div className={styles.stream_container}>
                {/*{isIos ? <IosHlsPlayer url={streamUrl} param={streamParam}/> :*/}
                {/*    <FlvContainer url={streamUrl} param={streamParam}/>}*/}
                <WebRtcPlayer streamName={room?.streamName}/>
            </div>
            {/*<div className={styles.stream_infos}>*/}
            {/*    */}
            {/*</div>*/}
            <div className={styles.buttons} style={{zIndex: 2}}>
                <span className={`${styles.button} ${styles.close}`}>
                    <Link href={'/'}>
                        <CloseOutlined/>
                    </Link>
                </span>
                <span className={styles.button} onClick={() => setShowMessage(!showMessage)}>
                    <MessageOutlined/>
                </span>
                <span className={styles.button}>
                    <CrownOutlined/>
                </span>
                <span className={styles.button}>
                    <SoundOutlined/>
                </span>
                <span className={styles.button}>
                    <QrcodeOutlined/>
                </span>
            </div>
            {showMessage ?
                <>
                    <div className={styles.anchor_info} style={{zIndex: 1}}>
                        <img src={`${imagePrefix}/${anchorUser.userAvatar}`} alt={''}
                             className={styles.anchor_info_avatar}/>
                        <span className={styles.anchor_info_name}>{anchorUser.userName}</span>
                        <SmallScribeButton clientUserType={user?.userType}
                                           clientUserUuid={user?.userUuid}
                                           anchorUserUuid={anchorUser?.userUuid}/>
                    </div>
                    <div className={styles.messages}>
                        <Messages data={chatMessages}/>
                        <SendButton send={sendChatMessage}/>
                    </div>
                </>
                : ''
            }
        </div>
    );
}