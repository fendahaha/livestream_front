'use client'
import styles from './page.module.css';
// import FlvContainer from "@/component/pl ayer/flv_container";
import ChatSendButton from "@/component/chat/ChatSendButton";
import {ChatMsgs} from "@/component/chat/ChatMsgs";
import {useCallback, useEffect, useReducer, useRef} from "react";
import {Client} from "@stomp/stompjs";
import {FendaDanmu} from "@/app/(front)/room/BarrageMessages";
import {MyTabs} from "@/app/(front)/room/tabs";
import {OnlineUsers} from "@/app/(front)/room/onlineUser";

const room_id = 'room_463111343';
const user_id = 'user_877629347';
const destination = `/topic/${room_id}`;
const streamId = '';

const test_data = ['hello', 'hi', '你好', 'adasd', 'dadad', 'efdads', 'rfda', 'tfdad', 'gfdad', '3eda', 'rfda', '3feda', 'gfd', '6yt5grfed', 'tgr', 'i8juyhtg', 'gfd', 'ygf', 'mnhgf', '23efgb', '6tf']
const test_data2 = ['hello', 'hi', '你好'];

const useStomp = (destinationTopic) => {
    const [messages, dispatchMessages] = useReducer(
        (state, action) => {
            let _new = [action, ...state];
            if (_new.length >= 200) {
                _new = _new.slice(0, 200)
            }
            return _new
        },
        [...test_data2],
        r => r
    );
    const stompClientRef = useRef(null);
    const danmuRef = useRef(null);
    const sendMsg = useCallback((msg) => {
        if (stompClientRef.current && stompClientRef.current.connected) {
            let headers = {priority: '9'}
            stompClientRef.current.publish({destination: destination, body: msg, headers: headers});
            return true
        }
    });
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
                stompClientRef.current.subscribe(destinationTopic, (message) => {
                    if (danmuRef.current?.addMessage) {
                        try {
                            danmuRef.current.addMessage(message.body)
                        } catch (e) {
                            console.log(e);
                        }
                    }
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
    return [messages, sendMsg, danmuRef]
}

export default function Component() {
    const [messages, sendMsg, danmuRef] = useStomp(destination);
    return (
        <div className={styles.container}>
            <div className={styles.layout1}>
                <div className={styles.layout1_left}>
                    <div className={styles.layout2}>
                        <div className={styles.layout2_top}>
                            <span className={styles.zhubo_info_title}> 可可愛愛沒有腦袋</span>
                        </div>
                        <div className={styles.layout2_middle}>
                            {/*<FlvContainer url={'http://localhost:8080/live/livestream.flv'}*/}
                            {/*              style={{'width': '100%', 'height': '100%', 'border': '1px solid red'}}/>*/}
                            <div className={styles.danmu_container}>
                                <FendaDanmu ref={danmuRef}/>
                            </div>
                        </div>
                        <div className={styles.layout2_bottom}></div>
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
                                            children: <ChatMsgs msgs={messages}/>,
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
                            <ChatSendButton handSend={sendMsg}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}