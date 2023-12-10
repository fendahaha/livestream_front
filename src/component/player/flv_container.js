'use client'
import {useEffect, useRef} from "react";
import flv from "flv.js";
import {message} from "antd";

export default function FlvContainer({children, url}) {
    const videoRef = useRef(null);
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
                // alert("主播貌似下播了")
                message.warning("主播貌似下播了", 20)
            });
            flvPlayer.load();
            flvPlayer.play();

            return () => {
                flvPlayer.destroy();
            };
        }

    }, [url]);
    return (
        <div style={{
            width: '100%', height: '100%', border: '1px solid red', position: 'relative',
        }}>
            <video ref={videoRef} controls muted autoPlay style={{
                width: '100%', height: '100%',
            }}/>
        </div>
    )
}