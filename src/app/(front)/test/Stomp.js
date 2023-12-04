'use client'
import {Client} from '@stomp/stompjs';
import {useCallback, useEffect, useMemo, useReducer, useRef, useState} from "react";
import {Button, Input, Space} from "antd";

const destination = '/topic/a';
const msg = 'hello';

function reducer(state, action) {
    if (action) {
        return [...state, action]
    }
}

export default function Stomp() {
    const [state, dispatch] = useReducer(reducer, [], r => r);
    const clientRef = useRef(null);
    const onSend = () => {
        if (clientRef.current && clientRef.current.connected) {
            clientRef.current.publish({destination: destination, body: msg, headers: {priority: '9'}});
        }
    };
    const onActivete = () => {
        if (clientRef.current) {
            clientRef.current.activate()
        }
    }
    const onDeactivete = () => {
        if (clientRef.current) {
            clientRef.current.deactivate()
        }
    }
    const subscribe = () => {
        if (clientRef.current && clientRef.current.connected) {
            clientRef.current.subscribe(destination, (message) => {
                let m = '';
                let d = new Date().toLocaleTimeString();
                if (message.body) {
                    m = d + 'got message with body ' + message.body
                } else {
                    m = d + 'got empty message';
                }
                dispatch(m)
            });
        }
    }
    const unsubscribe = () => {
        if (clientRef.current && clientRef.current.connected) {
            clientRef.current.unsubscribe()
        }
    }
    useEffect(() => {
        // console.log(Client);
        if (!clientRef.current) {
            clientRef.current = new Client({
                brokerURL: 'ws://localhost:8080/portfolio?token=df12sda&username=fenda1',
                connectHeaders: {
                    login: 'user',
                    passcode: 'password',
                    username: 'fenda1',
                },
                debug: function (str) {
                    console.log("debug:", str);
                },
                onConnect: function (frame) {
                    console.log(JSON.stringify(frame));

                },
                // reconnectDelay: 5000,
                // heartbeatIncoming: 4000,
                // heartbeatOutgoing: 4000,
            });
        }

        return () => {
            if (clientRef.current.connected) {
                clientRef.current.deactivate();
            }
        }
    }, []);
    return (
        <div>
            <div className={'d1'}>
                {state.map(e => <div key={Math.random() + (new Date()).toLocaleTimeString()}>{e}</div>)}
            </div>
            <Space>
                <Button onClick={onActivete}>activete</Button>
                <Button onClick={onDeactivete}>deactivete</Button>
                <Button onClick={subscribe}>subscribe</Button>
                <Button onClick={unsubscribe}>unsubscribe</Button>
                <Button onClick={onSend}>send</Button>
            </Space>
            <style jsx>{`
              .d1 {
                width: 100%;
                height: 300px;
                border: 1px solid red;
                overflow: auto;
              }
            `}</style>
        </div>
    );
}