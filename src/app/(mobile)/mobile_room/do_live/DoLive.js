'use client'
import {useEffect, useMemo, useRef, useState} from "react";
import {useRtcPublish, whip_url} from "@/util/webrtcUtil";
import styles from "@/app/(mobile)/mobile_room/do_live/DoLive.module.css";
import {Button} from "antd";
import {imagePrefix} from "@/util/requestUtil";
import {SmallScribeButton} from "@/component/subscribeButton";
import {Messages, SendButton} from "@/app/(mobile)/mobile_room/_component/messages";
import {useRoomStomp} from "@/app/(mobile)/mobile_room/_component/roomStompUtil";
import {WifiOutlined} from "@ant-design/icons";

// useEffect(() => {
//     if (navigator.mediaDevices) {
//         navigator.mediaDevices
//             .enumerateDevices()
//             .then((devices) => {
//                 devices.forEach((device) => {
//                     console.log(`${device.kind}: ${device.label} id = ${device.deviceId}`);
//                 });
//             })
//     }
// }, []);
const LiveButton = ({isPublishing, isPublished, publish, stop}) => {
    const [active, setActive] = useState(false);
    useEffect(() => {
        if (isPublishing || isPublished) {
            setActive(true);
        } else {
            setActive(false);
        }
    }, [isPublished, isPublishing])
    return (
        <>
            {active ?
                <>
                    <Button type={'primary'} danger onClick={stop}>Stop</Button>
                    <span style={{color: '#1677ff'}}><WifiOutlined spin={true}/></span>
                </>
                :
                <Button type={'primary'} loading={isPublishing} onClick={publish}>
                    {isPublishing ? 'publishing...' : 'Publish'}
                </Button>
            }
        </>
    )
}
export default function DoLive({anchor, anchorUser, room, streamUrl, streamParam, topic}) {
    const [danmuRef, giftRef, chatMessages, giftMessages, sendChatMessage, sendGiftMessage,
        onlineUserUpdateSign, setOnlineUserUpdateSign
    ] = useRoomStomp(room.roomUuid, topic, anchorUser.userUuid, anchorUser.userName, anchorUser?.userUuid, anchorUser?.userName, anchorUser?.userType);
    const [url, setUrl] = useState(whip_url('live', '7ad3ab11857348ac9a0e9e1481a40085', '52360f8449a149fab46739a890d65a6b'))
    const videoRef = useRef(null);
    const {isPublishing, isPublished, publish, stop} = useRtcPublish(url, videoRef);
    return (
        <div className={styles.main}>
            <div className={styles.video_container} style={{zIndex: 1}}>
                <video autoPlay controls playsInline muted ref={videoRef}
                       className={`${styles.video} ${isPublished ? styles.show : ''}`}/>
            </div>
            <div className={styles.anchor_info} style={{zIndex: 2}}>
                <img src={`${imagePrefix}/${anchorUser.userAvatar}`} alt={''}
                     className={styles.anchor_info_avatar}/>
                <span className={styles.anchor_info_name}>{anchorUser.userName}</span>
                <LiveButton isPublishing={isPublishing} isPublished={isPublished}
                            publish={publish} stop={stop}/>
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