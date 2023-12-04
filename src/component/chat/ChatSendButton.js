import styles from "./ChatSendButton.module.css";
import {SendOutlined} from "@ant-design/icons";

export default function ChatSendButton() {
    return (
        <div className={styles.chat_send_button}>
            <input type={'text'} name={'send'}/>
            <div className={styles.icon}>
                <SendOutlined/>
            </div>
        </div>
    );
}