import {useCallback, useRef, useState} from "react";
import {webRtcServer} from "@/util/requestUtil";

export function whip_url(app, stream, token) {
    return `${webRtcServer}/rtc/v1/whip/?app=${app}&stream=${stream}&token=${token}`
}

export function whep_url(app, stream, token) {
    return `${webRtcServer}/rtc/v1/whep/?app=${app}&stream=${stream}`
}

export function stopStreamTracks(...streams) {
    streams.forEach(stream => {
        stream.getTracks().forEach(t => {
            t.stop()
        })
    })
}

export function removeStreamTracks(...streams) {
    streams.forEach(stream => {
        stream.getTracks().forEach(t => {
            stream.removeTrack(t)
        })
    })
}

async function get_answer2(offer, url) {
    const requestInit = {
        method: 'POST',
        headers: {'Content-type': 'application/sdp'},
        mode: "no-cors",
        body: offer.sdp,
        cache: 'no-store',
    }
    const answer = await fetch(url, requestInit)
        .then((res) => {
            console.log('answer status: ', res.status, typeof res.status);
            console.log([0, 200, 201].includes(res.status));
            if ([0, 200, 201].includes(res.status)) {
                return res.text()
            }
        })
    console.log('answer', answer);
    return answer
}

async function get_answer(offer, url) {
    return await new Promise(function (resolve, reject) {
        console.log("Generated offer: ", offer);

        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            if (xhr.readyState !== xhr.DONE) return;
            if (xhr.status !== 200 && xhr.status !== 201) return reject(xhr);
            const data = xhr.responseText;
            console.log("Got answer: ", data);
            return data.code ? reject(xhr) : resolve(data);
        }
        xhr.open('POST', url, true);
        xhr.setRequestHeader('Content-type', 'application/sdp');
        xhr.send(offer.sdp);
    });
}

export async function negotiate(pc, url) {
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    const answer = await get_answer(offer, url)
    if (answer) {
        await pc.setRemoteDescription(
            new RTCSessionDescription({type: 'answer', sdp: answer})
        );
        return true
    }
}

export function rtc_publish(userMediaStream) {
    let pc = new RTCPeerConnection(null);
    let stream = new MediaStream();
    pc.onsignalingstatechange = (event) => {
        console.log('onsignalingstatechange', pc.signalingState);
    }
    pc.onconnectionstatechange = (event) => {
        console.log('onconnectionstatechange', pc.connectionState);
    }
    pc.onnegotiationneeded = (event) => {
        console.log('onnegotiationneeded');
    }
    pc.addTransceiver("audio", {direction: "sendonly"});//InvalidStateError
    pc.addTransceiver("video", {direction: "sendonly"});//InvalidStateError

    userMediaStream.getTracks().forEach(function (track) {
        pc.addTrack(track);
        stream.addTrack(track);
    });
    const stopPublish = () => {
        if (stream) {
            stopStreamTracks(stream);
            removeStreamTracks(stream);
        }
        if (pc) {
            pc.close()
        }
        pc = null;
        stream = null;
        userMediaStream = null;
    }
    return {pc, stream, stopPublish}
}

export function useRtcPublish(url, videoRef) {
    const [isPublishing, setIsPublishing] = useState(false);
    const [isPublished, setIsPublished] = useState(false);
    const pcRef = useRef(null);
    const streamRef = useRef(null);
    const publish = useCallback(() => {
        if (!isPublishing && !isPublished) {
            setIsPublishing(true);
            let pc = new RTCPeerConnection(null);
            let stream = new MediaStream();
            pcRef.current = pc;
            streamRef.current = stream;
            pc.onsignalingstatechange = (event) => {
                console.log('onsignalingstatechange', pc.signalingState);
            }
            pc.onconnectionstatechange = (event) => {
                console.log('onconnectionstatechange', pc.connectionState);
            }
            pc.onnegotiationneeded = (event) => {
                console.log('onnegotiationneeded');
            }
            pc.addTransceiver("audio", {direction: "sendonly"});//InvalidStateError
            pc.addTransceiver("video", {direction: "sendonly"});//InvalidStateError
            const constraints = {
                audio: true,
                video: {
                    // width: {ideal: 320, max: 576}
                }
            };
            let _userMediaStream = null;
            return navigator.mediaDevices.getUserMedia(constraints)
                .then((userMediaStream) => {
                    _userMediaStream = userMediaStream;
                    if (userMediaStream?.getTracks) {
                        userMediaStream.getTracks().forEach(function (track) {
                            pc.addTrack(track);
                            stream.addTrack(track);
                        });
                        if (videoRef?.current) {
                            videoRef.current.srcObject = stream;
                        }
                        return negotiate(pc, url);
                    } else {
                        alert("The camera may be occupied");
                        throw new Error("The camera may be occupied");
                    }
                }).then(r => {
                    if (r) {
                        setIsPublished(true);
                    }
                }).catch((reason) => {
                    console.log('negotiate error: ', reason);
                    pcRef.current = null;
                    streamRef.current = null;
                    if (_userMediaStream) {
                        stopStreamTracks(_userMediaStream);
                    }
                }).finally(() => {
                    setIsPublishing(false);
                })
        }
    }, [isPublished, isPublishing, url, videoRef]);
    const stop = useCallback(() => {
        if (streamRef.current) {
            stopStreamTracks(streamRef.current);
            removeStreamTracks(streamRef.current);
        }
        if (pcRef.current) {
            pcRef.current.close()
        }
        if(videoRef?.current){
            videoRef.current.srcObject = null;
        }
        pcRef.current = null;
        streamRef.current = null;
        setIsPublishing(false);
        setIsPublished(false);
    }, [videoRef]);
    return {isPublishing, isPublished, publish, stop}
}

export function useRtcPublish2(url, videoRef) {
    const [isPublishing, setIsPublishing] = useState(false);
    const [isPublished, setIsPublished] = useState(false);
    const stopPublishRef = useRef(null);
    const publish = async () => {
        if (!isPublishing && !isPublished) {
            setIsPublishing(true);
            const constraints = {
                audio: true,
                video: {
                    // width: {ideal: 320, max: 576}
                }
            };
            const userMediaStream = await navigator.mediaDevices.getUserMedia(constraints);
            const {pc, stream, stopPublish} = rtc_publish(userMediaStream);
            stopPublishRef.current = stopPublish
            if (videoRef?.current) {
                videoRef.current.srcObject = stream;
            }
            const r = await negotiate(pc, url);
            if (r) {
                setIsPublished(true);
            }
            setIsPublishing(false);
        }
    }
    const stop = () => {
        if (stopPublishRef.current) {
            stopPublishRef.current();
            stopPublishRef.current = null;
        }
        if (videoRef?.current) {
            videoRef.current.srcObject = null;
        }
        setIsPublishing(false);
        setIsPublished(false);
    }
    return {isPublishing, isPublished, publish, stop}
}

export function useRtcPlay(url, videoRef) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isPlayed, setIsPlayed] = useState(false);
    const pcRef = useRef(null);
    const streamRef = useRef(null);
    const play = useCallback(() => {
        if (!isPlaying && !isPlayed) {
            setIsPlaying(true);
            let pc = new RTCPeerConnection(null);
            let stream = new MediaStream();
            pcRef.current = pc;
            streamRef.current = stream;
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
            pc.addTransceiver("audio", {direction: "recvonly"});
            pc.addTransceiver("video", {direction: "recvonly"});
            negotiate(pc, url).then((r) => {
                if (r) {
                    if (videoRef && videoRef.current) {
                        videoRef.current.srcObject = stream;
                    }
                    setIsPlayed(true);
                }
            }).catch((reason) => {
                console.log(reason);
            }).finally(() => {
                setIsPlaying(false);
            })
        }
    }, [isPlayed, isPlaying, url, videoRef])
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
        setIsPlayed(false);
        setIsPlaying(false);
    }, [videoRef])
    return {isPlaying, isPlayed, play, stop}
}
