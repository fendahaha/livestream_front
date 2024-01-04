import {useRef} from "react";

export default function IosHlsPlayer({url, param}) {
    const streamUrl = `${url}.m3u8?${param}`;
    const videoRef = useRef(null);
    return (
        <div style={{width: '100%', height: '100%', position: 'relative'}}>
            <video controls autoPlay muted playsInline style={{width: '100%', height: '100%',}}
                   ref={videoRef}
                   src={streamUrl}
                   onError={(e) => {
                        console.log(e);
                   }}
            />
        </div>
    );
}