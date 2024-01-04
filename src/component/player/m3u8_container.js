"use client"
import {useCallback, useEffect, useRef, useState} from "react";
import {message} from "antd";
import {MyLoading} from "@/component/player/common";
import Script from "next/script";
import {useMyLocale} from "@/component/context/localeContext";

export default function M3u8Container({url, param}) {
    const {getDict} = useMyLocale('Room');
    const streamUrl = `${url}.m3u8?${param}`;
    const videoRef = useRef(null);
    const [scriptLoading, setScriptLoading] = useState(true);
    const hlsRef = useRef(null);
    const hlsClientRef = useRef(null);
    const [shouldReplay, setShouldReplay] = useState(false);
    const create_hlsClient = useCallback((Hls) => {
        const hlsClient = new Hls({debug: false});
        hlsClient.on(Hls.Events.MEDIA_ATTACHED, function () {
            console.log('video and hls.js are now bound together !');
        });
        hlsClient.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
            console.log('manifest loaded, found ' + data.levels.length + ' quality level');
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
                        message.warning(getDict('anchor_offline'), 5);
                        // hlsClient.destroy();
                        setShouldReplay(true);
                        break;
                    default:
                        // cannot recover
                        // hlsClient.destroy();
                        setShouldReplay(true);
                        break;
                }
            }
        });
        hlsClient.loadSource(streamUrl);
        hlsClient.attachMedia(videoRef.current);
        const destroy = () => {
            if (hlsClient) {
                hlsClient.destroy();
            }
        };
        return {hlsClient, destroy}
    }, [getDict, streamUrl]);
    useEffect(() => {
        if (!scriptLoading) {
            if (videoRef.current) {
                const Hls = hlsRef.current
                if (Hls.isSupported()) {
                    const {hlsClient, destroy} = create_hlsClient(Hls);
                    hlsClientRef.current = hlsClient;
                    return destroy;
                } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
                    // This will run in native HLS support like Safari
                    videoRef.current.src = streamUrl;
                    videoRef.current.addEventListener('loadedmetadata', function () {
                        message.info("loadedmetadata")
                        try {
                            // videoRef.current.play();
                        } catch (error) {
                            console.log(error);
                        }
                    });
                }
            }
        }
    }, [scriptLoading]);
    useEffect(() => {
        if (shouldReplay) {
            const timeout_id = setTimeout(() => {
                console.log("restarting...");
                setShouldReplay(false);
                if (hlsClientRef.current) {
                    hlsClientRef.current.destroy();
                }
                const Hls = hlsRef.current
                const {hlsClient, destroy} = create_hlsClient(Hls);
                hlsClientRef.current = hlsClient;
            }, 1000 * 5)
            return () => clearTimeout(timeout_id)
        }
    }, [create_hlsClient, shouldReplay, streamUrl]);

    return (
        <>
            <Script src={'https://cdnjs.cloudflare.com/ajax/libs/hls.js/1.4.14/hls.min.js'}
                    strategy={"afterInteractive"}
                    onReady={() => {
                        if (Hls) {
                            hlsRef.current = Hls
                            setScriptLoading(false)
                        }
                    }}
            />
            <div style={{width: '100%', height: '100%', position: 'relative',}}>
                <MyLoading isLoading={scriptLoading}/>
                <video ref={videoRef} controls autoPlay muted playsInline style={{width: '100%', height: '100%',}}/>
            </div>
        </>
    );
}