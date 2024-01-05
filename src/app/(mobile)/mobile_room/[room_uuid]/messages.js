import styles from './messages.module.css';
import {Input} from "antd";
import {SendOutlined} from "@ant-design/icons";
import './message.css';
import {useState} from "react";

export function Message({msg}) {
    return (
        <div className={styles.message_layout}>
            <span className={styles.message_level}>V1</span>
            <span className={styles.message_name}>I am Nat</span>
            <span className={styles.message_time}>16:47</span>
            :
            <span className={styles.message_msg}>{msg}</span>
        </div>
    )
}

export function Messages() {
    return (
        <div className={styles.messages}>
            <Message msg={4}/>
            <Message msg={3}/>
            <Message msg={2}/>
            <Message msg={1}/>
        </div>
    );
}

export function SendButton() {
    const props = {
        showCount: true,
        count: {
            max: 50,
            exceedFormatter: (value, {max}) => {
                return value.substring(0, max)
            }
        },
        onPressEnter: (e) => {
            console.log(e.target.value);
        },
        // value: value,
        onChange: (e) => {

        }
    }
    return (
        <div className={styles.sendButton}>
            <div className={styles.sendButtonInput}>
                <Input placeholder="Borderless" bordered={false} {...props}/>
            </div>
            <SendOutlined className={styles.sendButtonIcon}/>
        </div>
    )
}

