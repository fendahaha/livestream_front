'use client'
import styles from './GIfts.module.css';
import {Popover} from "antd";
import {clientBackendFetch, imagePrefix} from "@/util/requestUtil";
import {useEffect, useState} from "react";
import {get_all_gifts} from "@/app/_func/client";

const Gift = ({data, send}) => {
    const content = <>
        <div>{data.giftValue}币</div>
        <div>{data.giftName}</div>
    </>;
    return (
        <div className={styles.gift} onClick={() => send(data)}>
            <Popover placement="top" arrow={true} content={content}>
                <img src={`${imagePrefix}/${data.giftImage}`} alt={''} className={styles.background}/>
            </Popover>
        </div>
    )
}
export default function Gifts({send}) {
    const [data, setData] = useState([]);
    useEffect(() => {
        get_all_gifts().then(d => setData(d))
    }, []);
    return (
        <div className={styles.gifts}>
            {data.map(r => {
                return <Gift key={r.id} data={r} send={send}/>
            })}
        </div>
    )
}