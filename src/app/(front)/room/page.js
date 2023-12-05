'use client'
import styles from './page.module.css';
import FlvContainer from "@/component/player/flv_container";
import ChatSendButton from "@/component/chat/ChatSendButton";
import ChatMsgs from "@/component/chat/ChatMsgs";
import {useEffect, useReducer, useRef, useState} from "react";
import {Client} from "@stomp/stompjs";


function messagesReducer(state, action) {
    return [...state, action]
}

const room_id = 'room_463111343';
const user_id = 'user_877629347';
const destination = `/topic/${room_id}`;
const streamId = '';
const subscribed = {status: false};
export default function Component() {
    const [messages, dispatchMessages] = useReducer(messagesReducer, ['adads', 'adadssa', 'sadas'], r => r);
    const stompClientRef = useRef(null);
    const handleSend = (msg) => {
        if (stompClientRef.current && stompClientRef.current.connected) {
            let headers = {priority: '9'}
            stompClientRef.current.publish({destination: destination, body: msg, headers: headers});
            return true
        }
    }
    useEffect(() => {
        if (!stompClientRef.current) {
            stompClientRef.current = new Client({
                brokerURL: 'ws://localhost:8090/chat?token=df12sda&username=fenda1',
                connectHeaders: {
                    login: 'user',
                    passcode: 'password',
                    username: 'fenda13',
                },
                connectionTimeout: 10 * 1000,
                debug: function (str) {
                    console.log("debug:", str);
                },
                onStompError: function (frame) {
                    // Will be invoked in case of error encountered at Broker
                    // Bad login/passcode typically will cause an error
                    // Complaint brokers will set `message` header with a brief message. Body may contain details.
                    // Compliant brokers will terminate the connection after any error
                    console.log('Broker reported error: ' + frame.headers['message']);
                    console.log('Additional details: ' + frame.body);
                },
                onWebSocketClose: (evt) => {
                    console.log("onWebSocketClose: 远程主机连接断开");
                },
                reconnectDelay: 5000,
                // heartbeatIncoming: 4000,
                // heartbeatOutgoing: 4000,
            });
            stompClientRef.current.onConnect = function (frame) {
                // console.log(JSON.stringify(frame));
                stompClientRef.current.subscribe(destination, (message) => {
                    dispatchMessages(new Date().getTime() + ": " + message.body)
                });
            }
        }
        if (stompClientRef.current && !stompClientRef.current.connected) {
            stompClientRef.current.activate();
        }
        return () => {
            if (stompClientRef.current && stompClientRef.current.connected) {
                stompClientRef.current.deactivate();
                stompClientRef.current = null;
            }
        }
    }, []);
    return (
        <div className={styles.container}>
            <div className={styles.layout1}>
                <div className={styles.layout1_left}>
                    <div className={styles.layout2}>
                        <div className={styles.layout2_top}>
                            <span className={styles.zhubo_info_title}> 可可愛愛沒有腦袋</span>
                        </div>
                        <div className={styles.layout2_middle}>
                            {/*<FlvContainer url={'http://localhost:8080/live/livestream.flv'}/>*/}
                        </div>
                        <div className={styles.layout2_bottom}></div>
                    </div>
                </div>
                <div className={styles.layout1_right}>
                    <div className={styles.layout3}>
                        <div className={styles.layout3_top}>
                            <ChatMsgs msgs={messages}/>
                        </div>
                        <div className={styles.layout3_bottom}>
                            <ChatSendButton handSend={handleSend}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}