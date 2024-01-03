"use client"
import {useEffect, useRef} from "react";
import Hls from "hls.js";
import {message} from "antd";

export default function M3u8Container({url}) {
    const videoRef = useRef(null);

    useEffect(() => {
        if (videoRef.current) {
            if (Hls.isSupported()) {
                let config = {
                    debug: true,
                }
                let hlsClient = new Hls(config);
                hlsClient.on(Hls.Events.MEDIA_ATTACHED, function () {
                    console.log('video and hls.js are now bound together !');
                });
                hlsClient.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
                    try {
                        // videoRef.current.play();
                    } catch (error) {
                        console.log(error);
                    }
                    console.log(
                        'manifest loaded, found ' + data.levels.length + ' quality level',
                    );
                });
                hlsClient.on(Hls.Events.ERROR, function (event, data) {
                    let errorType = data.type;
                    let errorDetails = data.details;
                    let errorFatal = data.fatal;
                    if (data.fatal) {
                        switch (data.type) {
                            case Hls.ErrorTypes.MEDIA_ERROR:
                                console.log('fatal media error encountered, try to recover');
                                hlsClient.recoverMediaError();
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
                                hlsClient.destroy();
                                break;
                        }
                    }
                });
                hlsClient.loadSource(url);
                hlsClient.attachMedia(videoRef.current);
                return () => {
                    if (hlsClient) {
                        hlsClient.destroy();
                    }
                };
            } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
                // This will run in native HLS support like Safari
                videoRef.current.src = url;
                videoRef.current.addEventListener('loadedmetadata', function () {
                    message.info("loadedmetadata")
                });
            }
        }
    }, [url]);

    return (
        <div style={{width: '100%', height: '100%', position: 'relative',}}>
            <video ref={videoRef} controls autoPlay muted playsInline style={{width: '100%', height: '100%',}}/>
        </div>
    );
}