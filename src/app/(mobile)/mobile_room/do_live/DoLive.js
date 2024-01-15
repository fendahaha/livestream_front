'use client'
import React, {useMemo, useRef, useState} from "react";
import {whip_url} from "@/util/webrtcUtil";
import styles from "./DoLive.module.css";
import {Button} from "antd";
import {imagePrefix} from "@/util/requestUtil";
import {Messages, SendButton} from "../_component/messages";
import {useRoomStomp} from "../_component/roomStompUtil";
import {CloseOutlined, WifiOutlined} from "@ant-design/icons";
import {useWebRTCPublish} from "@/app/(mobile)/mobile_room/do_live/util";
import Link from "next/link";

const LiveButton = ({isPublishing, isPublished, publish, stop}) => {
    const button = useMemo(() => {
        if (isPublishing) {
            return <Button type={'primary'} loading={true}>
                publishing...
            </Button>
        } else if (isPublished) {
            return (
                <>
                    <Button type={'primary'} danger onClick={stop}>Stop</Button>
                    <span style={{color: '#1677ff'}}><WifiOutlined spin={true}/></span>
                </>
            )
        } else {
            return <Button type={'primary'} onClick={publish}>
                Publish
            </Button>
        }
    }, [isPublished, isPublishing, publish, stop])
    return button
}
export default function DoLive({anchor, anchorUser, room, streamUrl, streamParam, topic}) {
    const [danmuRef, giftRef, chatMessages, giftMessages, sendChatMessage, sendGiftMessage,
        onlineUserUpdateSign, setOnlineUserUpdateSign
    ] = useRoomStomp(room.roomUuid, topic, anchorUser.userUuid, anchorUser.userName,
        anchorUser?.userUuid, anchorUser?.userName, anchorUser?.userType);
    const [url, setUrl] = useState(whip_url('live', room.streamName, room.roomUuid))
    const videoRef = useRef(null);
    const {isPublishing, isPublished, publish, stop} = useWebRTCPublish(videoRef, url)
    return (
        <div className={styles.main}>
            <div className={styles.video_container} style={{zIndex: 1}}>
                <video autoPlay controls={false} playsInline muted ref={videoRef}
                       className={`${styles.video} ${isPublished ? styles.show : ''}`}/>
            </div>
            <div className={styles.anchor_info} style={{zIndex: 2}}>
                <img src={`${imagePrefix}/${anchorUser.userAvatar}`} alt={''}
                     className={styles.anchor_info_avatar}/>
                <span className={styles.anchor_info_name}>{anchorUser.userName}</span>
                <LiveButton isPublishing={isPublishing} isPublished={isPublished}
                            publish={publish} stop={stop}/>
            </div>
            <div className={styles.buttons2} style={{zIndex: 4}}>
                <span className={`${styles.button} ${styles.close}`}>
                    <Link href={'/mobile'}>
                        <CloseOutlined/>
                    </Link>
                </span>
            </div>
            {isPublished ?
                <div className={styles.messages} style={{zIndex: 3}}>
                    <Messages data={chatMessages}/>
                    <SendButton send={sendChatMessage}/>
                </div>
                : ''}
        </div>
    );
}