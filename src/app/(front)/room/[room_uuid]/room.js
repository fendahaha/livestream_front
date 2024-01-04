'use client'
import styles from './room.module.css';
// import FlvContainer from "@/component/player/flv_container";
import ChatSendButton from "@/component/chat/ChatSendButton";
import {ChatMsgs} from "@/component/chat/chatMsgs";
import React, {useCallback, useContext, useEffect, useReducer, useRef, useState} from "react";
import {Client} from "@stomp/stompjs";
import {FendaDanmu} from "@/app/(front)/room/[room_uuid]/BarrageMessages";
import {MyTabs} from "@/app/(front)/room/[room_uuid]/tabs";
import {OnlineUsers} from "@/app/(front)/room/[room_uuid]/onlineUser";
import {imagePrefix, wsPrefix} from "@/util/requestUtil";
import Gifts from "@/app/(front)/room/[room_uuid]/Gifts";
import {FendaGifts} from "@/app/(front)/room/[room_uuid]/GiftMessages";
import {GlobalContext} from "@/component/context/globalContext";
import {Avatar, message} from "antd";
import {MessageUtil, PageType, userTypeUtil} from "@/util/commonUtil";
import {useMyLocale} from "@/component/context/localeContext";
import {UserOutlined} from "@ant-design/icons";
import {SubscribeButton} from "@/component/subscribeButton";
import M3u8Container from "@/component/player/m3u8_container";

const useStomp = (roomUuid, destinationTopic, anchorUserUuid, anchorUserName, userUuid, userName, userType) => {
    const {getDict} = useMyLocale('Room');
    const [onlineUserUpdateSign, setOnlineUserUpdateSign] = useState(new Date().getTime());
    const [chatMessages, dispatchChatMessages] = useReducer((state, action) => [action, ...state].slice(-200), []);
    const [giftMessages, dispatchGiftMessages] = useReducer((state, action) => [action, ...state].slice(-200), []);
    const stompClientRef = useRef(null);
    const danmuRef = useRef(null);
    const giftRef = useRef(null);
    const sendMessage = useCallback((msg, destination, headers = {}) => {
        if (userUuid) {
            if (stompClientRef.current && stompClientRef.current.connected) {
                let _headers = {
                    anchorUserUuid: anchorUserUuid,
                    anchorUserName: anchorUserName,
                    room_topic: destinationTopic,
                    clientUserUuid: userUuid,
                    clientUserName: userName,
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
            message.info(getDict('please_log_in'));
        }
    }, [anchorUserName, anchorUserUuid, userName, userUuid, destinationTopic]);
    const sendChatMessage = useCallback((msg) => sendMessage(MessageUtil.createChatMessage(msg), destinationTopic), [sendMessage, destinationTopic]);
    const sendGiftMessage = useCallback((msg) => {
        if (userTypeUtil.is_client(userType)) {
            sendMessage(MessageUtil.createGiftMessage(msg), "/app/gift");
        } else {
            message.info(getDict('only_user_send_gift'));
        }
    }, [sendMessage, userType]);

    useEffect(() => {
        if (!stompClientRef.current) {
            let _params = `userUuid=${encodeURIComponent(userUuid)}`
                + `&pageType=${encodeURIComponent(PageType.Room)}`
                + `&roomUuid=${encodeURIComponent(roomUuid)}`;
            stompClientRef.current = new Client({
                brokerURL: `${wsPrefix}?${_params}`,
                // connectHeaders: {passcode: 'password'},
                connectionTimeout: 10 * 1000,
                reconnectDelay: 5 * 1000,
                heartbeatIncoming: 10 * 1000,
                heartbeatOutgoing: 5 * 1000,
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
                    if (messageObj.type === MessageUtil.roomMessage) {
                        let data = JSON.parse(messageObj.data);
                        if (data === 'OnlineUserAdd') {
                            setOnlineUserUpdateSign(new Date().getTime());
                        }
                        if (data === 'OnlineUserDel') {
                            setOnlineUserUpdateSign(new Date().getTime());
                        }
                    }
                });
                if (userUuid) {
                    stompClientRef.current.subscribe("/user/queue/person", (m) => {
                        const m1 = JSON.parse(m.body);
                        if (m1.type === 'error') {
                            message.info(m1.msg);
                        }
                    });
                }
                setOnlineUserUpdateSign(new Date().getTime());
            }
            stompClientRef.current.activate();
        }
        return () => {
            if (stompClientRef.current) {
                stompClientRef.current.deactivate();
                stompClientRef.current = null;
            }
        }
    }, [userUuid, destinationTopic, roomUuid]);
    return [danmuRef, giftRef, chatMessages, giftMessages, sendChatMessage, sendGiftMessage, onlineUserUpdateSign, setOnlineUserUpdateSign]
}

export default function Room({anchor, anchorUser, room, streamUrl, streamParam, topic}) {
    const {getDict} = useMyLocale('Room');
    const {user, updateUser} = useContext(GlobalContext);
    const [danmuRef, giftRef, chatMessages, giftMessages, sendChatMessage, sendGiftMessage, onlineUserUpdateSign, setOnlineUserUpdateSign] = useStomp(room.roomUuid, topic, anchorUser.userUuid, anchorUser.userName, user?.userUuid, user?.userName, user?.userType);
    return (
        <div className={styles.container}>
            <div className={styles.layout1}>
                <div className={styles.layout1_left}>
                    <div className={styles.layout2}>
                        <div className={styles.layout2_top}>
                            <span className={styles.zhubo_info_title}>{anchor?.anchorRemark}</span>
                            <div className={styles.zhubo_info_avatar}>
                                <Avatar icon={<UserOutlined/>} size={50}
                                        src={`${imagePrefix}/${anchorUser.userAvatar}`}/>
                                <SubscribeButton clientUserType={user?.userType}
                                                 clientUserUuid={user?.userUuid}
                                                 anchorUserUuid={anchorUser.userUuid}>
                                    Subscribe
                                </SubscribeButton>
                            </div>
                        </div>
                        <div className={styles.layout2_middle}>
                            {/*{streamUrl ? <FlvContainer url={streamUrl} param={streamParam}/> : ''}*/}
                            {streamUrl ? <M3u8Container url={streamUrl} param={streamParam}/> : ''}
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
                                            label: getDict('tab1'),
                                            children: <ChatMsgs msgs={chatMessages}/>,
                                        },
                                        {
                                            key: '2',
                                            label: getDict('tab2'),
                                            children: <OnlineUsers room_uuid={room.roomUuid}
                                                                   updateSign={onlineUserUpdateSign}/>,
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