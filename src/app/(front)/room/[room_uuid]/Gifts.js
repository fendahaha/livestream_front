'use client'
import styles from './GIfts.module.css';
import {Popover} from "antd";
import {clientBackendFetch, imagePrefix} from "@/util/requestUtil";
import {useEffect, useState} from "react";


const Gift = ({data, send}) => {
    const content = <>
        <div>{data.giftValue}币</div>
        <div>{data.giftName}</div>
    </>;
    const handleClick = (e) => {
        send(JSON.stringify(data));
    }
    return (
        <div className={styles.gift} onClick={handleClick}>
            <Popover placement="top" arrow={true} content={content}>
                <img src={`${imagePrefix}/${data.giftImage}`} alt={''} className={styles.background}/>
            </Popover>
        </div>
    )
}
const get_data = () => {
    return clientBackendFetch.postJson("/gift/all").then(r => {
        if (r && r.data) {
            return r.data
        }
    })
}
export default function Gifts({send}) {
    const [data, setData] = useState([]);
    useEffect(() => {
        get_data().then(d => setData(d))
    }, []);
    return (
        <div className={styles.gifts}>
            {data.map(r => {
                return <Gift key={r.id} data={r} send={send}/>
            })}
        </div>
    )
}