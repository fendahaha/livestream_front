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

export async function negotiate(pc, url) {
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    const requestInit = {
        method: 'POST',
        headers: {'Content-type': 'application/sdp'},
        mode: "cors",
        body: offer.sdp,
        cache: 'no-store',
    }
    const answer = await fetch(url, requestInit)
        .then((res) => {
            if ([200, 201].includes(res.status)) {
                return res.text()
            }
        })
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