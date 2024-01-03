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
                message.info("Hls.isSupported");
                let config = {
                    debug: true,
                }
                hls = new Hls(config);
                hls.on(Hls.Events.MEDIA_ATTACHED, function () {
                    console.log('video and hls.js are now bound together !');
                });
                hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
                    videoRef.current.play();
                    console.log(
                        'manifest loaded, found ' + data.levels.length + ' quality level',
                    );
                });
                hls.on(Hls.Events.ERROR, function (event, data) {
                    let errorType = data.type;
                    let errorDetails = data.details;
                    let errorFatal = data.fatal;
                    if (data.fatal) {
                        switch (data.type) {
                            case Hls.ErrorTypes.MEDIA_ERROR:
                                console.log('fatal media error encountered, try to recover');
                                hls.recoverMediaError();
                                break;
                            case Hls.ErrorTypes.NETWORK_ERROR:
                                console.error('fatal network error encountered', data);
                                // All retries and media options have been exhausted.
                                // Immediately trying to restart loading could cause loop loading.
                                // Consider modifying loading policies to best fit your asset and network
                                // conditions (manifestLoadPolicy, playlistLoadPolicy, fragLoadPolicy).
                                break;
                            default:
                                // cannot recover
                                hls.destroy();
                                break;
                        }
                    }
                });
                hls.loadSource(url);
                hls.attachMedia(videoRef.current);
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