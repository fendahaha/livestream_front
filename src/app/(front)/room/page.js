import styles from './page.module.css';
import {SendOutlined} from "@ant-design/icons";

const ChatMsg = ({data}) => {
    return (
        <div className={styles.chat_msg}>
            <span className={styles.chat_msg_userlever}>V1</span>
            <span className={styles.chat_msg_username}>米大可夫君</span>
            <span className={styles.chat_msg_time}>14:57</span>
            <span className={styles.chat_msg_dot}>:</span>
            <span className={styles.chat_msg_msg}> 非法正義 </span>
        </div>
    )
}


export default function Component() {
    return (
        <div className={styles.container}>
            <div className={styles.layout1}>
                <div className={styles.layout1_left}>
                    <div className={styles.live_container}>
                        <div className={styles.zhubo_info}>
                            <span className={styles.zhubo_info_title}> 可可愛愛沒有腦袋</span>
                        </div>
                        <div className={styles.video_container}></div>
                        <div className={styles.stream_list}></div>
                    </div>
                </div>
                <div className={styles.layout1_right}>
                    <div className={styles.chat}>
                        <div className={styles.chat_msgs}>
                            <ChatMsg/>
                            <ChatMsg/>
                            <ChatMsg/>
                            <ChatMsg/>
                            <ChatMsg/>
                            <ChatMsg/>
                            <ChatMsg/>
                            <ChatMsg/>
                            <ChatMsg/>
                            <ChatMsg/>
                            <ChatMsg/>
                            <ChatMsg/>
                            <ChatMsg/>
                            <ChatMsg/>
                        </div>
                        <div className={styles.chat_send}>
                            <div className={styles.chat_send_button}>
                                <input type={'text'} name={'send'}/>
                                <div className={styles.icon}>
                                    <SendOutlined/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}