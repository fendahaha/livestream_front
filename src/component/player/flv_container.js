'use client'
import {useEffect, useRef, useState} from "react";
import flv from "flv.js";
import {message} from "antd";
import {useMyLocale} from "@/component/context/localeContext";

export default function FlvContainer({url}) {
    const {getDict} = useMyLocale('Room');
    const videoRef = useRef(null);
    const flvPlayerRef = useRef(null);
    const [isStreamOnline, setIsStreamOnline] = useState(true);
    useEffect(() => {
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
                setIsStreamOnline(false);
            });
            flvPlayerRef.current = flvPlayer;
            flvPlayer.load();
            flvPlayer.play();

            return () => {
                flvPlayer.destroy();
            };
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
            <video ref={videoRef} controls autoPlay muted style={{width: '100%', height: '100%',}}/>
        </div>
    )
}