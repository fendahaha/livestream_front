'use client'
import styles from './room.module.css';
import FlvContainer from "@/component/player/flv_container";
import ChatSendButton from "@/component/chat/ChatSendButton";
import {ChatMsgs} from "@/component/chat/chatMsgs";
import {useCallback, useContext, useEffect, useReducer, useRef} from "react";
import {Client} from "@stomp/stompjs";
import {FendaDanmu} from "@/app/(front)/room/[room_uuid]/BarrageMessages";
import {MyTabs} from "@/app/(front)/room/[room_uuid]/tabs";
import {OnlineUsers} from "@/app/(front)/room/[room_uuid]/onlineUser";
import {v4} from "uuid";
import {wsPrefix} from "@/util/requestUtil";
import Gifts from "@/app/(front)/room/[room_uuid]/Gifts";
import {FendaGifts} from "@/app/(front)/room/[room_uuid]/GiftMessages";
import {GlobalContext} from "@/app/(front)/component/globalContext";
import {message} from "antd";

const MessageUtil = {
    chatMessage: 3,
    giftMessage: 2,
    systemMessage: 1,
    currDate() {
        return new Date().getTime()
    },
    createMessage(type, data) {
        return {
            id: v4(),
            type: type,
            data: data,
            time: this.currDate()
        }
    },
    createChatMessage(data) {
        return this.createMessage(this.chatMessage, data);
    },
    createGiftMessage(data) {
        return this.createMessage(this.giftMessage, data);
    },
    createSystemMessage(data) {
        return this.createMessage(this.systemMessage, data);
    }
}
const useStomp = (destinationTopic, anchorUuid, anchorUserName, clientUuid, clientUserName) => {
    const [chatMessages, dispatchChatMessages] = useReducer((state, action) => [action, ...state].slice(-200), []);
    const [giftMessages, dispatchGiftMessages] = useReducer((state, action) => [action, ...state].slice(-200), []);
    const stompClientRef = useRef(null);
    const danmuRef = useRef(null);
    const giftRef = useRef(null);
    const sendMessage = useCallback((msg, destination, headers = {}) => {
        if (clientUuid) {
            if (stompClientRef.current && stompClientRef.current.connected) {
                let _headers = {
                    anchorUuid: anchorUuid,
                    anchorUserName: anchorUserName,
                    room_topic: destinationTopic,
                    clientUuid: clientUuid,
                    clientUserName: clientUserName,
                }
                try {
                    stompClientRef.current.publish({
                        destination: destination,
                        body: JSON.stringify(msg),
                        headers: {..._headers, ...headers}
                    });
                    return true
                } catch (e) {
                    console.log(e);
                }
            }
        } else {
            message.info("please log in");
        }
    }, [anchorUserName, anchorUuid, clientUserName, clientUuid, destinationTopic]);
    const sendChatMessage = useCallback((msg) => sendMessage(MessageUtil.createChatMessage(msg), destinationTopic), [sendMessage, destinationTopic]);
    const sendGiftMessage = useCallback((msg) => sendMessage(MessageUtil.createGiftMessage(msg), "/app/gift"), [sendMessage]);

    useEffect(() => {
        if (!stompClientRef.current) {
            stompClientRef.current = new Client({
                brokerURL: `${wsPrefix}`,
                connectHeaders: {
                    // passcode: 'password',
                    user: clientUuid ? clientUuid : 'null',
                },
                connectionTimeout: 10 * 1000,
                reconnectDelay: 5 * 1000,
                heartbeatIncoming: 4000,
                heartbeatOutgoing: 4000,
                // debug: (str) => console.log("debug:", str),
            });
            stompClientRef.current.beforeConnect = async () => {
                console.log(`attemp connect stomp ${destinationTopic}`);
            }
            stompClientRef.current.onWebSocketClose = function (evt) {
                console.log("onWebSocketClose: 远程主机连接断开");
            }
            stompClientRef.current.onStompError = function (frame) {
                // Will be invoked in case of error encountered at Broker
                // Bad login/passcode typically will cause an error
                // Complaint brokers will set `message` header with a brief message. Body may contain details.
                // Compliant brokers will terminate the connection after any error
                console.log('Broker reported error: ' + frame.headers['message']);
                console.log('Additional details: ' + frame.body);
            }
            stompClientRef.current.onConnect = function (frame) {
                // console.log(JSON.stringify(frame));
                stompClientRef.current.subscribe(destinationTopic, (message) => {
                    const messageObj = JSON.parse(message.body);
                    if (messageObj.type === MessageUtil.chatMessage) {
                        if (danmuRef.current?.addMessage) {
                            try {
                                danmuRef.current.addMessage(messageObj)
                            } catch (e) {
                                console.log(e);
                            }
                        }
                        dispatchChatMessages(messageObj)
                    }
                    if (messageObj.type === MessageUtil.giftMessage) {
                        if (giftRef.current?.addMessage) {
                            try {
                                giftRef.current.addMessage(messageObj)
                            } catch (e) {
                                console.log(e);
                            }
                        }
                        dispatchGiftMessages(messageObj)
                    }
                });
                if (clientUuid) {
                    stompClientRef.current.subscribe("/user/queue/person", (m) => {
                        const m1 = JSON.parse(m.body);
                        if (m1.type === 'money_not_enough') {
                            message.info("money not enough");
                        }
                    });
                }
            }
            stompClientRef.current.activate();
        }
        return () => {
            if (stompClientRef.current) {
                stompClientRef.current.deactivate();
                stompClientRef.current = null;
            }
        }
    }, [clientUuid, destinationTopic]);
    return [danmuRef, giftRef, chatMessages, giftMessages, sendChatMessage, sendGiftMessage]
}

export default function Room({anchor, anchorUser, room, streamUrl, topic}) {
    const {user} = useContext(GlobalContext);
    const [danmuRef, giftRef, chatMessages, giftMessages, sendChatMessage, sendGiftMessage] = useStomp(topic, anchor.anchorUuid, anchorUser.userName, user?.userUuid, user?.userName);
    return (
        <div className={styles.container}>
            <div className={styles.layout1}>
                <div className={styles.layout1_left}>
                    <div className={styles.layout2}>
                        <div className={styles.layout2_top}>
                            <span className={styles.zhubo_info_title}>{anchor?.anchorRemark}</span>
                        </div>
                        <div className={styles.layout2_middle}>
                            {streamUrl ? <FlvContainer url={streamUrl}/> : ''}
                            <div className={styles.danmu_container}>
                                <FendaDanmu ref={danmuRef}/>
                            </div>
                            <div className={styles.gifts_container}>
                                <FendaGifts ref={giftRef}/>
                            </div>
                        </div>
                        <div className={styles.layout2_bottom}>
                            <Gifts send={(data) => sendGiftMessage(JSON.stringify(data))}/>
                        </div>
                    </div>
                </div>
                <div className={styles.layout1_right}>
                    <div className={styles.layout3}>
                        <div className={styles.layout3_top}>
                            <div style={{height: '100%', overflow: 'auto',}}>
                                <MyTabs items={
                                    [
                                        {
                                            key: '1',
                                            label: 'Tab 1',
                                            children: <ChatMsgs msgs={chatMessages}/>,
                                        },
                                        {
                                            key: '2',
                                            label: 'Tab 2',
                                            children: <OnlineUsers/>,
                                        },
                                    ]
                                }>
                                </MyTabs>
                            </div>
                        </div>
                        <div className={styles.layout3_bottom}>
                            <ChatSendButton handSend={(data) => sendChatMessage(data)}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}