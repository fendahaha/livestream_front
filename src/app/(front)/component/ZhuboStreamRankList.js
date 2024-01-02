'use client'
import styles from "@/app/(front)/component/ZhuboStreamRankList.module.css";
import ZhuboStreamList from "@/app/(front)/component/ZhuboStreamList";
import MyEmpty from "@/component/ant_common";
import ZhuboRankList from "@/app/(front)/component/ZhuboRankList";
import {useEffect, useRef, useState} from "react";
import {Client} from "@stomp/stompjs";
import {wsPrefix} from "@/util/requestUtil";
import {MessageUtil, PageType} from "@/util/commonUtil";
import {get_anchors, get_rank_anchors} from "@/app/_func/client";

export default function ZhuboStreamRankList({anchors, rank_anchors}) {
    const [firstUpdate, setFirstUpdate] = useState(false);
    const [anchorList, setAnchorList] = useState(anchors);
    const [rankAnchorList, setRankAnchorList] = useState(rank_anchors);
    const [onlineAnchorsUpdate, setOnlineAnchorsUpdate] = useState(new Date().getTime());
    const stompClientRef = useRef(null);
    useEffect(() => {
        const destinationTopic = "/topic/homePage";
        if (!stompClientRef.current) {
            stompClientRef.current = new Client({
                brokerURL: `${wsPrefix}?&pageType=${PageType.Home}`,
                connectionTimeout: 10 * 1000,
                reconnectDelay: 5 * 1000,
                heartbeatIncoming: 10 * 1000,
                heartbeatOutgoing: 5 * 1000,
                debug: (str) => console.log("debug:", str),
            });
            stompClientRef.current.onConnect = function (frame) {
                stompClientRef.current.subscribe(destinationTopic, (message) => {
                    const messageObj = JSON.parse(message.body);
                    if (messageObj.type === MessageUtil.pageMessage) {
                        let data = JSON.parse(messageObj.data);
                        if (data === 'OnlineAnchorsUpdate') {
                            setFirstUpdate(true);
                            setOnlineAnchorsUpdate(new Date().getTime());
                        }
                    }
                });
            }
            stompClientRef.current.activate();
        }
        return () => {
            if (stompClientRef.current) {
                stompClientRef.current.deactivate();
                stompClientRef.current = null;
            }
        }
    }, []);
    useEffect(() => {
        if (firstUpdate) {
            console.log(1);
            get_anchors().then(r => {
                setAnchorList(r)
            })
            get_rank_anchors().then(r => {
                setRankAnchorList(r)
            })
        }
    }, [firstUpdate, onlineAnchorsUpdate])
    return (
        <div>
            <div className={styles.layout}>
                <div className={styles.left}>
                    {anchors.length ?
                        <div className={styles.anchor_list}>
                            <ZhuboStreamList list={anchorList}/>
                        </div>
                        : <MyEmpty/>
                    }
                </div>
                <div className={styles.right}>
                    {rank_anchors.length ? <ZhuboRankList list={rankAnchorList}/>
                        : <MyEmpty/>}
                </div>
            </div>
        </div>
    );
}