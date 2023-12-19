'use client'
import {useCallback, useEffect, useReducer, useRef, useState} from "react";
import flv from "flv.js";
import {Button, message} from "antd";

const state = {
    isPlaying: false,
    isDestroyed: true,
    isStreamOnline: false,
};
export default function FlvContainer({url}) {
    const videoRef = useRef(null);
    const flvPlayerRef = useRef(null);
    const [flvPlayerState, setFlvPlayerState] = useReducer((prevState, action) => {
        return {...prevState, ...action}
    }, state, r => r);
    const createPlayer = useCallback(() => {
        const flvPlayer = flv.createPlayer({
            type: 'flv',
            url: url,
            isLive: true,
            enableStashBuffer: false,
            // withCredentials: true,
            cors: true,
        });
        flvPlayer.attachMediaElement(videoRef.current);
        flvPlayer.on(flv.Events.ERROR, (errorType, errorInfo) => {
            console.log(errorType, errorInfo);
            message.warning(`主播貌似下播了`, 20);
            setFlvPlayerState({isPlaying: false, isStreamOnline: false,});
        });
        flvPlayerRef.current = flvPlayer;
        return flvPlayer
    }, [url])
    const flvPlayerAction = (action) => {
        if (flvPlayerRef.current) {
            const flvPlayer = flvPlayerRef.current;
            if (action === 'reload') {
                if (!flvPlayerState.isDestroyed) {
                    flvPlayer.unload();
                    flvPlayer.load();
                }
            }
            if (action === 'play') {
                if (!flvPlayerState.isDestroyed) {
                    flvPlayer.play();
                    setFlvPlayerState({isPlaying: true});
                }
            }
            if (action === 'pause') {
                if (!flvPlayerState.isDestroyed) {
                    flvPlayer.pause();
                    setFlvPlayerState({isPlaying: false});
                }
            }
            if (action === 'replay') {
                if (!flvPlayerState.isDestroyed) {
                    flvPlayer.destroy();
                    setFlvPlayerState({isDestroyed: true});
                }
                createPlayer();
                setFlvPlayerState({isDestroyed: false});
                flvPlayerRef.current.load();
                setFlvPlayerState({isStreamOnline: true});
                flvPlayerRef.current.play();
                setFlvPlayerState({isPlaying: true});
            }
            if (action === 'destroy') {
                if (!flvPlayerState.isDestroyed) {
                    flvPlayer.destroy();
                    setFlvPlayerState({isPlaying: false, isDestroyed: true, isStreamOnline: false});
                }
            }
        }
    };
    useEffect(() => {
        if (flv.isSupported()) {
            const flvPlayer = createPlayer()
            flvPlayer.load();
            flvPlayer.play();
            setFlvPlayerState({isDestroyed: false, isStreamOnline: true, isPlaying: true});
            return () => {
                flvPlayer.destroy();
                setFlvPlayerState({isDestroyed: true, isStreamOnline: false, isPlaying: false,});
            };
        }
    }, [createPlayer, url]);
    useEffect(() => {
        if (!flvPlayerState.isStreamOnline) {
            const interval = setInterval(() => {
                console.log("interval");
                const flvPlayer = createPlayer()
                flvPlayer.load();
                flvPlayer.play();
                setFlvPlayerState({isDestroyed: false, isStreamOnline: true, isPlaying: true});
            }, 1000 * 5);
            return () => clearInterval(interval)
        }
    }, [createPlayer, flvPlayerState.isStreamOnline]);
    return (
        <div style={{
            width: '100%', height: '100%', position: 'relative',
        }}>
            <video ref={videoRef} controls autoPlay style={{
                width: '100%', height: '80%',
            }}/>
            <Button onClick={() => flvPlayerAction('reload')}>reload</Button>
            <Button onClick={() => flvPlayerAction('replay')}>replay</Button>
            <Button onClick={() => flvPlayerAction('play')}>play</Button>
            <Button onClick={() => flvPlayerAction('pause')}>pause</Button>
            <Button onClick={() => flvPlayerAction('destroy')}>destroy</Button>
        </div>
    )
}