'use client'
import {FixWidthDiv} from "@/component/common/WidthDiv";
import styles from './page.module.css';
import {Button, Spin} from "antd";
import {useRef} from "react";
import {useRtcPlay} from "@/util/webrtcUtil";


export default function Component() {
    const url = "https://172.21.74.92:1990/rtc/v1/whep/?app=live&stream=7ad3ab11857348ac9a0e9e1481a40085&token=52360f8449a149fab46739a890d65a6b";
    const videoRef = useRef(null);
    const {isPlaying, isPlayed, play, stop} = useRtcPlay(url, videoRef);
    return (
        <FixWidthDiv>
            <Spin spinning={false}>
                <div>
                    <video autoPlay controls playsInline muted ref={videoRef} className={styles.video}/>
                </div>
                <div className={styles.buttons}>
                    <Button type='primary' onClick={play}>play</Button>
                    <Button type='primary' onClick={stop}>stop</Button>
                </div>
            </Spin>
        </FixWidthDiv>
    );
}