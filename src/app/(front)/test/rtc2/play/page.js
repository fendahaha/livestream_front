'use client'
import {FixWidthDiv} from "@/component/common/WidthDiv";
import styles from './page.module.css';
import {Button, Spin} from "antd";
import {useEffect, useRef} from "react";
import {negotiate} from "@/util/webrtcUtil";

export default function Component() {
    const url = "https://172.21.74.92:1990/rtc/v1/whep/?app=live&stream=7ad3ab11857348ac9a0e9e1481a40085&token=52360f8449a149fab46739a890d65a6b";
    const videoRef = useRef(null);
    const pcRef = useRef(null);
    const streamRef = useRef(null);
    useEffect(() => {
        if (!pcRef.current) {
            let pc = new RTCPeerConnection(null);
            let stream = new MediaStream();
            pc.ontrack = function (event) {
                stream.addTrack(event.track);
                videoRef.current.srcObject = stream;
            };
            pc.onsignalingstatechange = (event) => {
                console.log('onsignalingstatechange', pc.signalingState);
            }
            pc.onconnectionstatechange = (event) => {
                console.log('onconnectionstatechange', pc.connectionState);
            }
            pc.onnegotiationneeded = (event) => {
                console.log('onnegotiationneeded');
            }
            pcRef.current = pc;
            streamRef.current = stream;
        }
    }, []);
    const play = async () => {
        const pc = pcRef.current;
        const stream = streamRef.current;
        pc.addTransceiver("audio", {direction: "recvonly"});
        pc.addTransceiver("video", {direction: "recvonly"});
        await negotiate(pc, url);
    }
    const stop = () => {

    }
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