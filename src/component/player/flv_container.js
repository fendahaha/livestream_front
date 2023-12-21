'use client'
import {useEffect, useRef, useState} from "react";
import flv from "flv.js";
import {message} from "antd";

export default function FlvContainer({url}) {
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
                message.warning(`主播貌似下播了`, 10);
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