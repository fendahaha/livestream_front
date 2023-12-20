'use client'
import styles from './room.module.css';
import FlvContainer from "@/component/player/flv_container";
import ChatSendButton from "@/component/chat/ChatSendButton";
import {ChatMsgs} from "@/component/chat/chatMsgs";
import {useCallback, useContext, useEffect, useReducer, useRef, useState} from "react";
import {Client} from "@stomp/stompjs";
import {FendaDanmu} from "@/app/(front)/room/[room_uuid]/BarrageMessages";
import {MyTabs} from "@/app/(front)/room/[room_uuid]/tabs";
import {OnlineUsers} from "@/app/(front)/room/[room_uuid]/onlineUser";
import {v4} from "uuid";
import {clientBackendFetch, streamServer, wsPrefix} from "@/util/requestUtil";
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
    createChatMessage(data) {
        return {
            id: v4(),
            type: this.chatMessage,
            data: data,
            time: this.currDate()
        }
    },
    createGiftMessage(data) {
        return {
            id: v4(),
            type: this.giftMessage,
            data: data,
            time: this.currDate()
        }
    },
    createSystemMessage(data) {
        return {
            id: v4(),
            type: this.systemMessage,
            data: data,
            time: this.currDate()
        }
    }
}

const useStomp = (destinationTopic, user, anchor) => {
    const [chatMessages, dispatchChatMessages] = useReducer(
        (state, action) => {
            let _new = [action, ...state];
            if (_new.length >= 200) {
                _new = _new.slice(0, 200)
            }
            return _new
        },
        [],
        r => r
    );
    const [giftMessages, dispatchGiftMessages] = useReducer(
        (state, action) => {
            let _new = [action, ...state];
            if (_new.length >= 200) {
                _new = _new.slice(0, 200)
            }
            return _new
        },
        [],
        r => r
    );
    const [systemMessages, dispatchSystemMessages] = useReducer(
        (state, action) => {
            let _new = [action, ...state];
            if (_new.length >= 200) {
                _new = _new.slice(0, 200)
            }
            return _new
        },
        [],
        r => r
    );
    const stompClientRef = useRef(null);
    const danmuRef = useRef(null);
    const giftRef = useRef(null);
    const sendMessage = useCallback((msg) => {
        if (user) {
            if (stompClientRef.current && stompClientRef.current.connected) {
                let headers = {anchorUuid: anchor.anchorUuid, anchorName: anchor.user.userName}
                stompClientRef.current.publish({
                    destination: destinationTopic,
                    body: JSON.stringify(msg),
                    headers: headers
                });
                return true
            }
        } else {
            message.info("please log in");
        }
    }, [destinationTopic, user, anchor]);
    const sendChatMessage = useCallback((msg) => sendMessage(MessageUtil.createChatMessage(msg)), [sendMessage]);
    const sendGiftMessage = useCallback((msg) => sendMessage(MessageUtil.createGiftMessage(msg)), [sendMessage]);
    const sendSystemMessage = useCallback((msg) => sendMessage(MessageUtil.createSystemMessage(msg)), [sendMessage]);

    useEffect(() => {
        if (!stompClientRef.current) {
            stompClientRef.current = new Client({
                brokerURL: `${wsPrefix}`,
                connectHeaders: {
                    // passcode: 'password',
                    user: user ? JSON.stringify(user) : null,
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
                reconnectDelay: 5000,
                // heartbeatIncoming: 4000,
                // heartbeatOutgoing: 4000,
            });
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
                    if (messageObj.type === MessageUtil.systemMessage) {
                        dispatchSystemMessages(messageObj)
                    }
                });
                stompClientRef.current.subscribe("/user/queue/person", (message) => {
                    console.log(message.body);
                    message.info(message.body);
                });
            }
            stompClientRef.current.onWebSocketClose = function (evt) {
                console.log("onWebSocketClose: 远程主机连接断开");
            }
            if (stompClientRef.current && !stompClientRef.current.connected) {
                stompClientRef.current.activate();
            }
        }
        return () => {
            if (stompClientRef.current) {
                stompClientRef.current.deactivate();
                stompClientRef.current = null;
            }
        }
    }, [destinationTopic, user]);
    return [danmuRef, giftRef, chatMessages, giftMessages, systemMessages, sendChatMessage, sendGiftMessage, sendSystemMessage]
}

const query = (room_uuid) => {
    return clientBackendFetch.formPostJson("/anchor/query", {room_uuid}).then(r => {
        if (r && r.data) {
            return r.data
        }
    })
}

export default function Room({uuid}) {
    const {user} = useContext(GlobalContext);
    const [anchor, setAnchor] = useState(null);
    const [streamUrl, setStreamUrl] = useState(null);
    useEffect(() => {
        if (!anchor) {
            query(uuid).then(anchor => {
                setAnchor(anchor);
                console.log(anchor);
                if (anchor?.room?.streamAddress) {
                    let s = `${streamServer}${anchor?.room?.streamAddress}.flv?${anchor.room.streamParam}`;
                    setStreamUrl(s);
                }
            })
        }
    }, [anchor, uuid]);
    const [danmuRef, giftRef, chatMessages, giftMessages, systemMessages, sendChatMessage, sendGiftMessage, sendSystemMessage] = useStomp(`/topic/${uuid}`, user, anchor);
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
                            <Gifts send={sendGiftMessage}/>
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
                            <ChatSendButton handSend={sendChatMessage}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}