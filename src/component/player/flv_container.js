'use client'
import {useEffect, useRef} from "react";
import flv from "flv.js";

export default function FlvContainer({url}) {
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
        <div>
            <video ref={videoRef} controls style={{width: '800px'}} muted autoPlay/>
        </div>
    )
}