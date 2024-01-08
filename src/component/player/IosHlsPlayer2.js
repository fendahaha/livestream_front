import {useRef, useState} from "react";
import {message} from "antd";
import styles from "./FlvContainer.module.css";
import {VideoLoading} from "./FlvContainer";

export default function IosHlsPlayer2({url, param}) {
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
            />
        </div>
    );
}