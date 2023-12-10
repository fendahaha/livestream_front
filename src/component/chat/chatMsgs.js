import styles from "./ChatMsg.module.css";

export function ChatMsg({data = ''}) {
    return (
        <div className={styles.chat_msg}>
            <span className={styles.chat_msg_userlever}>V1</span>
            <span className={styles.chat_msg_username}>米大可夫君</span>
            <span className={styles.chat_msg_time}>14:57</span>
            <span className={styles.chat_msg_dot}>:</span>
            <span className={styles.chat_msg_msg}> {data} </span>
        </div>
    )
}

export function ChatMsgs({msgs}) {
    return (
        <div style={{
            height: '100%',
            overflow: "auto",
            display: 'flex',
            flexDirection: 'column-reverse',
            padding: '10px 0',
        }}>
            {msgs.map(m => {
                return <ChatMsg key={m.id} data={m.data}/>
            })}
        </div>
    );
}
