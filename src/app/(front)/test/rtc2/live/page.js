'use client'
import {FixWidthDiv} from "@/component/common/WidthDiv";
import styles from './page.module.css';
import {useEffect, useRef, useState} from "react";
import {Button, Input, Spin} from "antd";
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
    const props = {
        value: url,
        onChange: (e) => {
            setUrl(e.target.value)
        },
    }
    return (
        <FixWidthDiv>
            <Spin spinning={false}>
                <div>
                    <video autoPlay controls playsInline muted ref={videoRef} className={styles.video}/>
                </div>
                <div>
                    <Input {...props}/>
                </div>
                <div className={styles.buttons}>
                    <Button type='primary' onClick={publish}>publish</Button>
                    <Button type='primary' onClick={stop}>stop</Button>
                </div>
            </Spin>
        </FixWidthDiv>
    );
}