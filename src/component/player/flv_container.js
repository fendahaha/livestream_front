'use client'
import {useEffect, useRef} from "react";
import Script from "next/script";
import flv from "flv.js";

export default function FlvContainer({url, style}) {
    const videoRef = useRef(null);
    useEffect(() => {
        if (flv.isSupported()) {
            const flvPlayer = flv.createPlayer({
                type: 'flv',
                url: url,
                isLive: true,
                enableStashBuffer: false
            });
            flvPlayer.attachMediaElement(videoRef.current);
            flvPlayer.load();
            flvPlayer.play();

            return () => {
                flvPlayer.destroy();
            };
        }

    }, [url]);
    return (
        <div style={style}>
            <video ref={videoRef} controls style={{width: '100%', 'height': '100%'}} muted autoPlay/>
        </div>
    )
}