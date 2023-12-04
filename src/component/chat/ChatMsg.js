import styles from "./ChatMsg.module.css";

export default function ChatMsg({data}) {
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
