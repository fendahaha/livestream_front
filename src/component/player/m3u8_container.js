"use client"
import {useEffect, useRef} from "react";
import Hls from "hls.js";

export default function M3u8Container({url}) {
    const videoRef = useRef(null);

    useEffect(() => {
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
            }
        };
    }, [url]);

    return (
        <div>
            <video ref={videoRef} controls style={{width: '800px'}} muted autoPlay/>
        </div>
    );
}