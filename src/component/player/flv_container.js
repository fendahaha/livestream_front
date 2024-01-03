'use client'
import {useEffect, useRef, useState} from "react";
import {message, Spin} from "antd";
import {useMyLocale} from "@/component/context/localeContext";
import Script from "next/script";
import styles from './flv_container.module.css';
import {LoadingOutlined} from "@ant-design/icons";

const MyLoading = ({isLoading = true}) => {
    return (
        <>
            {isLoading ?
                <div className={styles.loading}>
                    <LoadingOutlined/>
                </div>
                : ''
            }
        </>
    )
}

export default function FlvContainer({url}) {
    const {getDict} = useMyLocale('Room');
    const [flv, setFlv] = useState(null);
    const [flvLoading, setFlvLoading] = useState(true);
    const videoRef = useRef(null);
    const flvPlayerRef = useRef(null);
    const [shouldReplay, setShouldReplay] = useState(false);
    useEffect(() => {
        if (flv) {
            if (flv.isSupported()) {
                const flvPlayer = flv.createPlayer({
                    type: 'flv',
                    url: url,
                    isLive: true,
                    enableStashBuffer: false,
                    // withCredentials: true,
                    cors: true,
                });
                flvPlayer.attachMediaElement(videoRef.current);
                flvPlayer.on(flv.Events.ERROR, (errorType, errorInfo) => {
                    console.log(errorType, errorInfo);
                    message.warning(getDict('anchor_offline'), 5);
                    setShouldReplay(true);
                });
                flvPlayer.on(flv.Events.MEDIA_INFO,(e)=>{
                    console.log(e);
                })
                flvPlayerRef.current = flvPlayer;
                flvPlayer.load();
                flvPlayer.play();

                return () => {
                    flvPlayer.destroy();
                };
            } else {
                message.info('flv is not supported');
            }
        }
    }, [flv, url]);
    useEffect(() => {
        if (shouldReplay) {
            setShouldReplay(false);
            flvPlayerRef.current.unload();
            flvPlayerRef.current.load();
            flvPlayerRef.current.play();
        }
    }, [shouldReplay]);
    return (
        <>
            <Script src={'https://cdnjs.cloudflare.com/ajax/libs/flv.js/1.6.2/flv.min.js'}
                    strategy={'afterInteractive'}
                    onReady={() => {
                        setFlv(flvjs);
                        setFlvLoading(false);
                    }}
            />
            <div className={styles.video_container}>
                <MyLoading isLoading={flvLoading}/>
                <video ref={videoRef} controls autoPlay muted className={styles.video}/>
            </div>
        </>
    )
}