import {useEffect, useRef, useState} from "react";
import {useRtcPlay, whep_url} from "@/util/webrtcUtil";
import styles from "./WebRtcPlayer.module.css";
import {VideoLoading} from "@/component/player/FlvContainer";


function Muted({onClick}) {
    return (
        <div className={styles.muted} onClick={onClick}>
            click to Unmute
        </div>
    )
}

export default function WebRtcPlayer({streamName}) {
    const [url, setUrl] = useState(whep_url('live', streamName))
    const videoRef = useRef(null);
    const {isPlaying, isPlayed, play, stop} = useRtcPlay(url, videoRef);

    const [canplay, setCanplay] = useState(false);
    const [showMuted, setShowMuted] = useState(false);
    const cancelMute = () => {
        videoRef.current.muted = false;
        videoRef.current.play().then(() => setShowMuted(false))
    }
    const playCounts = useRef(0);
    useEffect(() => {
        if (playCounts.current === 0) {
            playCounts.current += 1;
            play();
            return ()=>{
                console.log("stop");
                stop();
            }
        }
    }, [stop]);
    return (
        <div style={{width: '100%', height: '100%', position: 'relative'}}>
            <video autoPlay={false} controls={false} playsInline muted={false} ref={videoRef} className={styles.video}
                   onCanPlay={() => {
                       setCanplay(true);
                       videoRef.current.play().catch((error) => {
                           console.error("用户未交互，无法播放：", error);
                           videoRef.current.muted = true
                           videoRef.current.play();
                           setShowMuted(true)
                       });
                   }}
            />
            {canplay ? '' : <VideoLoading/>}
            {showMuted ? <Muted onClick={cancelMute}/> : ''}
        </div>
    );
}