import styles from "./ChatSendButton.module.css";
import {SendOutlined} from "@ant-design/icons";
import {useRef} from "react";
import {Input} from "antd";

export default function ChatSendButton({handSend}) {
    const msgInputRef = useRef(null);
    const send = () => {
        if (msgInputRef.current) {
            const text = msgInputRef.current.value.trim();
            if (text) {
                let success = handSend(text);
                if (success) {
                    msgInputRef.current.value = '';
                }
            }
        }
    }
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            send()
        }
    }
    return (
        <div className={styles.chat_send_button}>
            <input ref={msgInputRef} type={'text'} onKeyDown={handleKeyDown}/>
            <div className={styles.icon} onClick={send}>
                <SendOutlined/>
            </div>
        </div>
    );
}