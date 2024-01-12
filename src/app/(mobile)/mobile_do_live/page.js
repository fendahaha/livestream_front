'use client'
import styles from './page.module.css';
import {Button} from "antd";
import {useEffect, useMemo, useRef, useState} from "react";
import {useRtcPublish, whip_url} from "@/util/webrtcUtil";

export default function Component() {
    const [url, setUrl] = useState(whip_url('live', '7ad3ab11857348ac9a0e9e1481a40085', '52360f8449a149fab46739a890d65a6b'))
    const videoRef = useRef(null);
    const {isPublishing, isPublished, publish, stop} = useRtcPublish(url, videoRef);
    useEffect(() => {
        if (navigator.mediaDevices) {
            navigator.mediaDevices
                .enumerateDevices()
                .then((devices) => {
                    devices.forEach((device) => {
                        console.log(`${device.kind}: ${device.label} id = ${device.deviceId}`);
                    });
                })
        }
    }, []);
    return (
        <div className={styles.main}>
            <div className={styles.video_container}>
                <video autoPlay controls playsInline muted ref={videoRef} className={styles.video}/>
            </div>
            <div className={styles.buttons}>
                <Button type={'primary'} disabled={(isPublished || isPublishing)} onClick={publish}>Publish</Button>
                <Button type={'primary'} disabled={(!isPublished && !isPublishing)} onClick={stop}>Stop</Button>
            </div>
        </div>
    );
}