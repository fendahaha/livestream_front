'use client'
import {FixWidthDiv} from "@/component/common/WidthDiv";
import styles from './page.module.css';
import Script from "next/script";
import {Button, Spin} from "antd";
import {useEffect, useRef, useState} from "react";

export default function Component() {
    const videoRef = useRef(null);
    const [scriptReady, setScriptReady] = useState(false);
    const sdkRef = useRef(null);
    const url = "https://172.21.74.92:1990/rtc/v1/whep/?app=live&stream=7ad3ab11857348ac9a0e9e1481a40085&token=52360f8449a149fab46739a890d65a6b";
    useEffect(() => {
        if (scriptReady) {
            const sdk = new SrsRtcWhipWhepAsync();
            videoRef.current.srcObject = sdk.stream;
            sdkRef.current = sdk;
        }
    }, [scriptReady]);
    const publish = () => {
        const sdk = sdkRef.current;
        if (sdk) {
            sdk.play(url).then(function(session){
                console.log('sessionid', session.sessionid);
                console.log('simulator', session.simulator + '?drop=1&username=' + session.sessionid);
            }).catch(function (reason) {
                sdk.close();
                console.error(reason);
            });
        }
    }
    return (
        <FixWidthDiv>
            <Script src={'/js/srs.sdk.js'}
                    strategy={'afterInteractive'}
                    onReady={() => setScriptReady(true)}
            />
            <Spin spinning={!scriptReady}>
                <div>
                    <video autoPlay controls playsInline muted ref={videoRef} className={styles.video}/>
                </div>
                <div className={styles.buttons}>
                    <Button type='primary' onClick={publish}>play</Button>
                </div>
            </Spin>
        </FixWidthDiv>
    );
}