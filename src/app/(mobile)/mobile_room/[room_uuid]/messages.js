import styles from './_css/messages.module.css';
import {Input} from "antd";
import {SendOutlined} from "@ant-design/icons";
import './_css/message.css';
import {useState} from "react";

function Message({msg}) {
    return (
        <div className={styles.message_layout}>
            <span className={styles.message_level}>V1</span>
            <span className={styles.message_name}>I am Nat</span>
            <span className={styles.message_time}>16:47</span>
            :
            <span className={styles.message_msg}>{msg.data}</span>
        </div>
    )
}

export function Messages({data}) {
    return (
        <div className={styles.messages}>
            {data.map(e => <Message msg={e} key={e.id}/>)}
        </div>
    );
}

export function SendButton({send}) {
    const [value, setValue] = useState('');
    const handSend = () => {
        if (value.trim()) {
            if (send(value.trim())) {
                setValue('');
            }
        }
    }
    const props = {
        showCount: true,
        count: {
            max: 50,
            exceedFormatter: (value, {max}) => {
                return value.substring(0, max)
            }
        },
        onPressEnter: (e) => {
            handSend()
        },
        value: value,
        onChange: (e) => {
            setValue(e.target.value);
        }
    }
    return (
        <div className={`${styles.sendButton} send_button`}>
            <div className={styles.sendButtonInput}>
                <Input placeholder="Borderless" bordered={false} {...props}/>
            </div>
            <SendOutlined className={styles.sendButtonIcon} onClick={handSend}/>
        </div>
    )
}

