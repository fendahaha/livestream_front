import {useRef} from "react";

export default function IosHlsPlayer({url, param}) {
    const streamUrl = `${url}.m3u8?${param}`;
    const videoRef = useRef(null);
    return (
        <div style={{width: '100%', height: '100%', position: 'relative'}}>
            <video ref={videoRef} controls autoPlay muted playsInline style={{width: '100%', height: '100%',}}
                   src={streamUrl}/>
        </div>
    );
}