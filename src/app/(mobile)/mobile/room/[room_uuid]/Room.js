'use client'
import {useMyLocale} from "@/component/context/localeContext";
import {useCallback, useContext, useEffect, useReducer, useRef, useState} from "react";
import {GlobalContext} from "@/component/context/globalContext";
import {message} from "antd";
import {MessageUtil, PageType, userTypeUtil} from "@/util/commonUtil";
import {Client} from "@stomp/stompjs";
import {wsPrefix} from "@/util/requestUtil";
import styles from './Room.module.css';
import M3u8Container from "@/component/player/m3u8_container";
import {useRoomPageContext} from "@/component/context/PageContext";
import IosHlsPlayer from "@/component/player/IosHlsPlayer";

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
            stompClientRef.current = new Client({
                brokerURL: `${wsPrefix}?userUuid=${userUuid}&pageType=${PageType.Room}&roomUuid=${roomUuid}`,
                connectHeaders: {
                    // passcode: 'password',
                },
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
export default function Room({anchor, anchorUser, room, streamUrl, topic}) {
    const {isIos} = useRoomPageContext();
    const {getDict} = useMyLocale('Room');
    const {user, updateUser} = useContext(GlobalContext);
    const [danmuRef, giftRef, chatMessages, giftMessages, sendChatMessage, sendGiftMessage, onlineUserUpdateSign, setOnlineUserUpdateSign] = useStomp(room.roomUuid, topic, anchorUser.userUuid, anchorUser.userName, user?.userUuid, user?.userName, user?.userType);
    return (
        <div className={styles.room}>
            <div className={styles.stream_container}>
                {isIos ? <IosHlsPlayer url={streamUrl}/> : <M3u8Container url={streamUrl}/>}
            </div>
        </div>
    );
}