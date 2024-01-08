import {useRef, useState} from "react";
import {message} from "antd";
import styles from "@/component/player/FlvContainer.module.css";
import {VideoLoading} from "@/component/player/FlvContainer";

export default function IosHlsPlayer({url, param}) {
    const streamUrl = `${url}.m3u8?${param}`;
    const videoRef = useRef(null);
    const [canplay, setCanplay] = useState(false);
    const [showMuted, setShowMuted] = useState(false);
    const cancelMute = () => {
        videoRef.current.muted = false;
        videoRef.current.play().then(() => {
            setShowMuted(false);
        })
    }
    return (
        <div style={{width: '100%', height: '100%', position: 'relative'}}>
            <video autoPlay muted={false} playsInline style={{width: '100%', height: '100%',}}
                   ref={videoRef}
                   src={streamUrl}
                   onError={(e) => {
                       message.error(e.toString())
                       videoRef.current.load();
                       videoRef.current.play();
                   }}
                   onCanPlay={() => {
                       setCanplay(true);
                       // message.info('onCanPlay');
                       videoRef.current.play().catch((error) => {
                           // message.error("用户未交互，无法播放：", error);
                           videoRef.current.muted = true;
                           videoRef.current.play();
                           setShowMuted(true);
                       })
                   }}
            />
            {canplay ? '' : <VideoLoading/>}
            {showMuted ?
                <div className={styles.muted} onClick={cancelMute}>
                    click to Unmute
                </div> : ''
            }
        </div>
    );
}