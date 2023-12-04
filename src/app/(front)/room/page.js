import styles from './page.module.css';
import FlvContainer from "@/component/player/flv_container";
import ChatSendButton from "@/component/chat/ChatSendButton";
import ChatMsgs from "@/component/chat/ChatMsgs";


export default function Component() {
    return (
        <div className={styles.container}>
            <div className={styles.layout1}>
                <div className={styles.layout1_left}>
                    <div className={styles.layout2}>
                        <div className={styles.layout2_top}>
                            <span className={styles.zhubo_info_title}> 可可愛愛沒有腦袋</span>
                        </div>
                        <div className={styles.layout2_middle}>
                            {/*<FlvContainer url={'http://localhost:8080/live/livestream.flv'}/>*/}
                        </div>
                        <div className={styles.layout2_bottom}></div>
                    </div>
                </div>
                <div className={styles.layout1_right}>
                    <div className={styles.layout3}>
                        <div className={styles.layout3_top}>
                            <ChatMsgs/>
                        </div>
                        <div className={styles.layout3_bottom}>
                            <ChatSendButton/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}