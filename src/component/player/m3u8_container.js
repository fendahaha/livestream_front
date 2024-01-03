"use client"
import {useEffect, useRef} from "react";
import Hls from "hls.js";
import {message} from "antd";
export default function M3u8Container({url}) {
    const videoRef = useRef(null);

    useEffect(() => {
        message.info("m3u8");
        let hls;
        if (videoRef.current) {
            if (Hls.isSupported()) {
                hls = new Hls();
                hls.loadSource(url);
                hls.attachMedia(videoRef.current);
                hls.on(Hls.Events.MANIFEST_PARSED, function () {
                    videoRef.current.play();
                });
            } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
                // This will run in native HLS support like Safari
                videoRef.current.src = url;
                videoRef.current.addEventListener('loadedmetadata', function () {
                    videoRef.current.play();
                });
            }
        }

        return () => {
            if (hls) {
                hls.destroy();
            } else {
                if (videoRef.current) {
                    videoRef.current.stop()
                }
            }
        };
    }, [url]);

    return (
        <div style={{
            width: '100%', height: '100%', position: 'relative',
        }}>
            <video ref={videoRef} controls autoPlay muted style={{width: '100%', height: '100%',}}/>
        </div>
    );
}