'use client'
import {useEffect, useRef, useState} from "react";
import {message} from "antd";
import {useMyLocale} from "@/component/context/localeContext";
import Script from "next/script";
import styles from './FlvContainer.module.css';
import {SyncOutlined} from "@ant-design/icons";
import {imagePrefix} from "@/util/requestUtil";

export const VideoLoading = () => {
    const styles = {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        zIndex: 1001,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '40px',
        overflow: 'hidden',
    }
    const styles1 = {
        position: 'absolute',
        width: '100%',
        height: '100%',
        left: 0,
        right: 0,
        zIndex: 1,
        objectFit: 'cover',
        filter: 'blur(3px)',
        transform: 'scale(1.1)',
    }
    const url = `${imagePrefix}/avatar/bc8c30f04b7fe04748b4f3233eb194e52bb06619aacc39b1de7a98f2a4be78a2.png`;
    return (
        <div style={styles}>
            <img style={styles1} src={url} alt={''}/>
            <SyncOutlined spin style={{color: "#3A8CFE", zIndex: 2}}/>
        </div>
    )
}

export default function FlvContainer({url, param}) {
    const {getDict} = useMyLocale('Room');
    const streamUrl = `${url}.flv`;
    const [flv, setFlv] = useState(null);
    const videoRef = useRef(null);
    const flvPlayerRef = useRef(null);
    const [shouldReplay, setShouldReplay] = useState(false);
    const [canplay, setCanplay] = useState(false);
    const [showMuted, setShowMuted] = useState(false);
    const cancelMute = () => {
        videoRef.current.muted = false
        setShowMuted(false);
    }
    useEffect(() => {
        if (flv) {
            if (flv.isSupported()) {
                const config = {
                    lazyLoad: false,
                    autoCleanupSourceBuffer: true,
                    autoCleanupMaxBackwardDuration: 10,
                    autoCleanupMinBackwardDuration: 5,
                };
                const flvPlayer = flv.createPlayer({
                    type: 'flv',
                    url: streamUrl,
                    isLive: true,
                    enableStashBuffer: false,
                    // withCredentials: true,
                    cors: true,
                    hasAudio: true,
                    hasVideo: true,
                });
                flvPlayer.attachMediaElement(videoRef.current);
                flvPlayer.on(flv.Events.ERROR, (errorType, errorInfo, errorMsg) => {
                    console.log(errorType, errorInfo, errorMsg);
                    if (errorType === flv.ErrorTypes.NETWORK_ERROR) {
                        if(errorInfo===flv.ErrorDetails.NETWORK_UNRECOVERABLE_EARLY_EOF){
                            message.warning(getDict('anchor_offline'), 5);
                            setShouldReplay(true);
                        }else{
                            message.error(errorInfo)
                        }
                    }
                });
                flvPlayer.on(flv.Events.MEDIA_INFO, (e) => console.log(e))
                flvPlayerRef.current = flvPlayer;
                flvPlayer.load();

                return () => {
                    flvPlayer.destroy();
                };
            } else {
                message.info('flv is not supported');
            }
        }
    }, [flv, streamUrl]);
    useEffect(() => {
        if (shouldReplay) {
            setShouldReplay(false);
            const flvPlayer = flvPlayerRef.current;
            flvPlayer.unload();
            flvPlayer.load();
            videoRef.current.currentTime = 0;
        }
    }, [shouldReplay]);

    const get_time = () => {
        const date = new Date();
        return `${date.getHours()}:${date.getSeconds()}`
    }
    const log = (event) => console.log(get_time(), event.type, event)
    return (
        <>
            <Script src={'https://cdnjs.cloudflare.com/ajax/libs/flv.js/1.6.2/flv.min.js'}
                    strategy={'afterInteractive'}
                    onReady={() => setFlv(flvjs)}
            />
            <div className={styles.video_container}>
                <video ref={videoRef} controls={false} autoPlay muted={false} playsInline className={styles.video}
                       onCanPlay={() => {
                           setCanplay(true);
                           flvPlayerRef.current.play().catch((error) => {
                               console.error("用户未交互，无法播放：", error);
                               videoRef.current.muted = true
                               flvPlayerRef.current.play();
                               setShowMuted(true)
                           });
                       }}
                       onError={log}
                       onWaiting={log}
                       onPlay={log}
                       onPause={log}
                    // onProgress={log}
                       onPlaying={log}
                />
                {flv && canplay ? '' : <VideoLoading/>}
                {showMuted ?
                    <div className={styles.muted} onClick={cancelMute}>
                        click to Unmute
                    </div> : ''
                }
            </div>
        </>
    )
}