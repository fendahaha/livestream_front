'use client'
import {FixWidthDiv} from "@/component/common/WidthDiv";
import styles from './page.module.css';
import {Button, Input, Spin} from "antd";
import {useRef, useState} from "react";
import {useRtcPlay, whep_url, whip_url} from "@/util/webrtcUtil";


export default function Component() {
    const [url, setUrl] = useState(whep_url('live', '7ad3ab11857348ac9a0e9e1481a40085'))
    const videoRef = useRef(null);
    const {isPlaying, isPlayed, play, stop} = useRtcPlay(url, videoRef);
    const props = {
        value: url,
        onChange: (e) => setUrl(e.target.value),
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
                    <Button type='primary' onClick={play}>play</Button>
                    <Button type='primary' onClick={stop}>stop</Button>
                </div>
            </Spin>
        </FixWidthDiv>
    );
}