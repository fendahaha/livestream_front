'use client'
import {FixWidthDiv} from "@/component/common/WidthDiv";
import styles from './page.module.css';
import {useCallback, useRef, useState} from "react";
import {Button, Spin} from "antd";
import {negotiate, removeStreamTracks, rtc_publish, stopStreamTracks} from "@/util/webrtcUtil";

export function useRtcPublic() {
    const [isPublishing, setIsPublishing] = useState(false);
    const pcRef = useRef(null);
    const streamRef = useRef(null);
    const publish = useCallback((url) => {
        if (!isPublishing) {
            let pc = new RTCPeerConnection(null);
            let stream = new MediaStream();
            pcRef.current = pc;
            streamRef.current = stream;
            pc.onsignalingstatechange = (event) => {
                console.log('onsignalingstatechange', pc.signalingState);
            }
            pc.onconnectionstatechange = (event) => {
                console.log('onconnectionstatechange', pc.connectionState);
            }
            pc.onnegotiationneeded = (event) => {
                console.log('onnegotiationneeded');
            }
            pc.addTransceiver("audio", {direction: "sendonly"});//InvalidStateError
            pc.addTransceiver("video", {direction: "sendonly"});//InvalidStateError
            const constraints = {
                audio: true,
                video: {
                    // width: {ideal: 320, max: 576}
                }
            };
            let _userMediaStream = null;
            return navigator.mediaDevices.getUserMedia(constraints)
                .then((userMediaStream) => {
                    _userMediaStream = userMediaStream;
                    userMediaStream.getTracks().forEach(function (track) {
                        pc.addTrack(track);
                        stream.addTrack(track);
                    });
                    return negotiate(pc, url);
                }).then(r => {
                    if (r) {
                        setIsPublishing(true);
                    }
                }).catch((reason) => {
                    console.log(reason);
                    pcRef.current = null;
                    streamRef.current = null;
                    stopStreamTracks(_userMediaStream);
                })
        }
    }, [isPublishing]);
    const stop = useCallback(() => {
        if (streamRef.current) {
            stopStreamTracks(streamRef.current);
            removeStreamTracks(streamRef.current);
        }
        if (pcRef.current) {
            pcRef.current.close()
        }
        pcRef.current = null;
        streamRef.current = null;
    }, []);
    return {isPublishing, publish, stop}
}

export default function Component() {
    const url = "https://172.21.74.92:1990/rtc/v1/whip/?app=live&stream=7ad3ab11857348ac9a0e9e1481a40085&token=52360f8449a149fab46739a890d65a6b";
    const videoRef = useRef(null);
    const stopPublishRef = useRef(null);

    const publish = async () => {
        const constraints = {
            audio: true,
            video: {
                // width: {ideal: 320, max: 576}
            }
        };
        const userMediaStream = await navigator.mediaDevices.getUserMedia(constraints);
        const {pc, stream, stopPublish} = rtc_publish(userMediaStream);
        stopPublishRef.current = stopPublish
        videoRef.current.srcObject = stream;
        await negotiate(pc, url);
    }
    const stop = () => {
        if (stopPublishRef.current) {
            stopPublishRef.current();
            stopPublishRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
    }
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