'use client'
import {FixWidthDiv} from "@/component/common/WidthDiv";
import styles from './page.module.css';
import {useRef} from "react";
import {Button, Spin} from "antd";
import {useRtcPublish, useRtcPublish2} from "@/util/webrtcUtil";


export default function Component() {
    const url = "https://172.21.74.92:1990/rtc/v1/whip/?app=live&stream=7ad3ab11857348ac9a0e9e1481a40085&token=52360f8449a149fab46739a890d65a6b";
    const videoRef = useRef(null);
    const {isPublishing, isPublished, publish, stop} = useRtcPublish(url, videoRef);
    return (
        <FixWidthDiv>
            <Spin spinning={false}>
                <div>
                    <video autoPlay controls playsInline muted ref={videoRef} className={styles.video}/>
                </div>
                <div className={styles.buttons}>
                    <Button type='primary' onClick={publish}>publish</Button>
                    <Button type='primary' onClick={stop}>stop</Button>
                </div>
            </Spin>
        </FixWidthDiv>
    );
}