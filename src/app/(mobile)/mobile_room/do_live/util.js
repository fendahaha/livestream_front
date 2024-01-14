import {negotiate, removeStreamTracks, stopStreamTracks, useRtcPublish} from "@/util/webrtcUtil";
import {useCallback, useEffect, useRef, useState} from "react";

export function createPublishRTCPeerConnection() {
    let stream = new MediaStream();
    let pc = new RTCPeerConnection(null);
    pc.addTransceiver("audio", {direction: "recvonly"});
    pc.addTransceiver("video", {direction: "recvonly"});
    pc.ontrack = function (event) {
        stream.addTrack(event.track);
    };
    pc.onsignalingstatechange = (event) => {
        console.log('onsignalingstatechange', pc.signalingState);
    }
    pc.onconnectionstatechange = (event) => {
        console.log('onconnectionstatechange', pc.connectionState);
    }
    pc.onnegotiationneeded = (event) => {
        console.log('onnegotiationneeded');
    }
    return {pc, stream}
}

export function useWebRTCPublish(videoRef, url) {
    const pcRef = useRef(null);
    const [pc_connectionState, setPc_connectionState] = useState('');
    const streamRef = useRef(null);
    const [isPublishing, setIsPublishing] = useState(false);
    const [isPublished, setIsPublished] = useState(false);
    const isPublishingRef = useRef(false);
    const publish = useCallback(() => {
        if (!isPublishingRef.current && !isPublished) {
            isPublishingRef.current = true;
            setIsPublishing(true);
            const {pc, stream} = createPublishRTCPeerConnection();
            pc.addEventListener('connectionstatechange', (event) => {
                console.log('peer connectionState:', pc.connectionState);
                setPc_connectionState(pc.connectionState);
            });
            const constraints = {audio: true, video: true};
            navigator.mediaDevices.getUserMedia(constraints)
                .then((userMediaStream) => {
                    if (userMediaStream?.getTracks) {
                        userMediaStream.getTracks().forEach(function (track) {
                            pc.addTrack(track);
                        });
                        return negotiate(pc, url).then((r) => {
                            if (r) {
                                userMediaStream.getTracks().forEach(function (track) {
                                    stream.addTrack(track);
                                });
                                if (videoRef?.current) {
                                    videoRef.current.srcObject = stream;
                                }
                                pcRef.current = pc;
                                streamRef.current = stream;
                                setIsPublished(true);
                            }
                        }).catch((error) => Promise.reject(error))
                    } else {
                        return Promise.reject(new Error("can't get stream tracks (The camera may be occupied)"))
                    }
                })
                .catch((error) => {
                    console.log('error: ', error.code, error.message, error.name);
                    if (error.name === 'NotAllowedError') {
                        alert("用户拒绝了所有媒体访问请求");
                    } else if (error.name === 'NotFoundError') {
                        alert("找不到满足请求参数的媒体类型");
                    } else if (error.name === 'OverconstrainedError') {
                        alert(error.message);
                    } else if (error.name === 'SecurityError') {
                        alert("设备媒体被禁止(未开启权限？)");
                    } else {
                        alert(error.message);
                    }
                })
                .finally(() => {
                    isPublishingRef.current = false;
                    setIsPublishing(false);
                })
        }
    }, [isPublished, url]);
    const stop = useCallback(() => {
        if (streamRef.current) {
            stopStreamTracks(streamRef.current);
            removeStreamTracks(streamRef.current);
        }
        if (pcRef.current) {
            pcRef.current.close()
        }
        if (videoRef?.current) {
            videoRef.current.srcObject = null;
        }
        pcRef.current = null;
        streamRef.current = null;
        setPc_connectionState(null);
        setIsPublishing(false);
        setIsPublished(false);
    }, []);
    useEffect(() => {
        return () => {
            if (pcRef.current) {
                stop();
            }
        }
    }, []);
    return {pcRef, pc_connectionState, streamRef, isPublishing, isPublished, publish, stop}
}