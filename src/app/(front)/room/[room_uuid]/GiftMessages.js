import {forwardRef, useImperativeHandle, useMemo, useReducer} from "react";
import {imagePrefix} from "@/util/requestUtil";
import styles from "./giftMessages.module.css";

const FendaGiftMessage = ({msg}, ref) => {
    const style = useMemo(() => {
        return {top: msg.top}
    }, [msg]);
    const gift = JSON.parse(msg.messageObj.data);
    return (
        <div style={style} className={styles.gift}>
            <img src={`${imagePrefix}/${gift?.giftImage}`} alt={''} className={styles.icon}/>
            <div className={styles.user}>
                <span>fenda</span>
                <br/>
                <span>{gift?.giftName}</span>
            </div>
            <img src={`${imagePrefix}/${gift?.giftImage}`} alt={''} className={styles.gift_image}/>
        </div>
    )
}

function getTop() {
    return Math.ceil(Math.random() * 10) * 45 + 'px'
}

export const FendaGifts = forwardRef(function FendaDanmu(props, ref) {
    const [msg, dispatchMsg] = useReducer((state, action) => {
        if (state.length >= 200) {
            return [...state.slice(-200), action]
        }
        return [...state, action]
    }, [], r => r);
    useImperativeHandle(ref, () => {
        return {
            addMessage(m) {
                dispatchMsg({messageObj: m, top: getTop()})
            }
        };
    }, []);
    return (
        <div style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            overflow: 'hidden'
        }}>
            {msg.map(e => {
                return <FendaGiftMessage key={e.messageObj.id} msg={e}/>
            })}
        </div>
    )
})