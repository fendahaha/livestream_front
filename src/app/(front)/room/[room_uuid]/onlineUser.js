import React, {useEffect, useState} from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import {Avatar, Divider, List, Skeleton} from 'antd';
import {clientBackendFetch, imagePrefix} from "@/util/requestUtil";

export const OnlineUsers = ({room_uuid, updateSign}) => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const loadMoreData = () => {
        if (loading) {
            return;
        }
        setLoading(true);
        // fetch('https://randomuser.me/api/?results=10&inc=name,gender,email,nat,picture&noinfo')
        //     .then((res) => res.json())
        //     .then((body) => {
        //         setData([...data, ...body.results]);
        //         setLoading(false);
        //     })
        //     .catch(() => {
        //         setLoading(false);
        //     });
        clientBackendFetch.getJson(`/room/${room_uuid}/onlineLoginUsers`)
            .then((body) => {
                let users = body.data.map(e => {
                    return JSON.parse(e)
                })
                setData([...users]);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    };
    useEffect(() => {
        loadMoreData();
    }, [updateSign]);
    return (
        <div
            id="scrollableDiv"
            style={{
                height: '100%',
                overflow: 'auto',
                padding: '0 16px',
                // border: '1px solid rgba(140, 140, 140, 0.35)',
            }}
        >
            <InfiniteScroll
                dataLength={data.length}
                next={loadMoreData}
                hasMore={false}
                loader={
                    <Skeleton
                        avatar
                        paragraph={{
                            rows: 1,
                        }}
                        active
                    />
                }
                endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
                scrollableTarget="scrollableDiv"
            >
                <List
                    dataSource={data}
                    renderItem={(item) => (
                        <List.Item key={item.userUuid}>
                            <List.Item.Meta
                                avatar={<Avatar src={`${imagePrefix}/${item.userAvatar}`}/>}
                                title={<a>{item.userDisplayName}</a>}
                                description={item.userCountry}
                            />
                            <div>{''}</div>
                        </List.Item>
                    )}
                />
            </InfiniteScroll>
        </div>
    );
};