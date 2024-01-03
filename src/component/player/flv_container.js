'use client'
import {useEffect, useRef, useState} from "react";
import {message} from "antd";
import {useMyLocale} from "@/component/context/localeContext";
import Script from "next/script";

export default function FlvContainer({url}) {
    const {getDict} = useMyLocale('Room');
    const videoRef = useRef(null);
    const flvPlayerRef = useRef(null);
    const [isStreamOnline, setIsStreamOnline] = useState(true);
    useEffect(() => {
        if (flvjs.isSupported()) {
            const flvPlayer = flvjs.createPlayer({
                type: 'flv',
                url: url,
                isLive: true,
                enableStashBuffer: false,
                // withCredentials: true,
                cors: true,
            });
            flvPlayer.attachMediaElement(videoRef.current);
            flvPlayer.on(flvjs.Events.ERROR, (errorType, errorInfo) => {
                console.log(errorType, errorInfo);
                message.warning(getDict('anchor_offline'), 5);
                setIsStreamOnline(false);
            });
            flvPlayerRef.current = flvPlayer;
            flvPlayer.load();
            flvPlayer.play();

            return () => {
                flvPlayer.destroy();
            };
        } else {
            message.info('flv is not supported');
        }
    }, [url]);
    useEffect(() => {
        if (!isStreamOnline) {
            flvPlayerRef.current.unload();
            flvPlayerRef.current.load();
            flvPlayerRef.current.play();
            setIsStreamOnline(true);
        }
    }, [isStreamOnline]);
    return (
        <div style={{
            width: '100%', height: '100%', position: 'relative',
        }}>
            <Script src={'https://cdnjs.cloudflare.com/ajax/libs/flv.js/1.6.2/flv.min.js'}
                    strategy={'beforeInteractive'}/>
            <video ref={videoRef} controls autoPlay muted style={{width: '100%', height: '100%',}}/>
        </div>
    )
}