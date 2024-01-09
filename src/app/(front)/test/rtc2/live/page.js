'use client'
import {FixWidthDiv} from "@/component/common/WidthDiv";
import styles from './page.module.css';
import {useEffect, useRef, useState} from "react";
import {Button, Spin} from "antd";

export default function Component() {
    const url = "https://172.21.74.92:1990/rtc/v1/whip/?app=live&stream=7ad3ab11857348ac9a0e9e1481a40085&token=52360f8449a149fab46739a890d65a6b";
    const videoRef = useRef(null);
    const pcRef = useRef(null);
    const streamRef = useRef(null);
    useEffect(() => {
        if (!pcRef.current) {
            let pc = new RTCPeerConnection(null);
            let stream = new MediaStream();
            pcRef.current = pc;
            streamRef.current = stream;
        }
    }, []);
    const publish = async () => {
        const constraints = {
            audio: true,
            video: {
                // width: {ideal: 320, max: 576}
            }
        };
        const pc = pcRef.current;
        const videoStream = streamRef.current;
        pc.addTransceiver("audio", {direction: "sendonly"});
        pc.addTransceiver("video", {direction: "sendonly"});
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        stream.getTracks().forEach(function (track) {
            pc.addTrack(track);
            videoStream.addTrack(track);
        });
        videoRef.current.srcObject = stream;
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        const answer = await new Promise(function (resolve, reject) {
            console.log("Generated offer: ", offer);

            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                if (xhr.readyState !== xhr.DONE) return;
                if (xhr.status !== 200 && xhr.status !== 201) return reject(xhr);
                const data = xhr.responseText;
                console.log("Got answer: ", data);
                return data.code ? reject(xhr) : resolve(data);
            }
            xhr.open('POST', url, true);
            xhr.setRequestHeader('Content-type', 'application/sdp');
            xhr.send(offer.sdp);
        });
        await pc.setRemoteDescription(
            new RTCSessionDescription({type: 'answer', sdp: answer})
        );
    }

    return (
        <FixWidthDiv>
            <Spin spinning={false}>
                <div>
                    <video autoPlay controls playsInline muted ref={videoRef} className={styles.video}/>
                </div>
                <div className={styles.buttons}>
                    <Button type='primary' onClick={publish}>publish</Button>
                </div>
            </Spin>
        </FixWidthDiv>
    );
}