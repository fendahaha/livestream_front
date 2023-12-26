'use client'
import {FixWidthDiv} from "@/component/common/WidthDiv";
import {Spin, Tabs} from "antd";
import {clientBackendFetch} from "@/util/requestUtil";
import {useContext, useEffect, useState} from "react";
import {GlobalContext} from "@/app/(front)/component/globalContext";
import Tab1 from "@/app/(front)/user/anchor/tab1";
import Tab2 from "@/app/(front)/user/anchor/tab2";
import GiftSendList from "@/app/(front)/user/anchor/GiftSendList";

export default function AnchorPage() {
    const {user, updateUser} = useContext(GlobalContext);
    const [anchor, setAnchor] = useState(null);
    useEffect(() => {
        clientBackendFetch.formPostJson('/anchor/query_by_useruuid', {'user_uuid': user?.userUuid})
            .then(r => r?.data)
            .then(r => setAnchor(r))
    }, [user?.userUuid])
    const items = [
        {
            label: '基本信息',
            key: 1,
            children: anchor ? <Tab1 anchor={anchor}/> : <Spin tip="Loading">
                <div className="content" style={{height: 100}}/>
            </Spin>,
        },
        {
            label: '直播设置',
            key: 2,
            children: anchor ? <Tab2 anchor={anchor}/> : <Spin tip="Loading">
                <div className="content" style={{height: 100}}/>
            </Spin>,
        },
        {
            label: '接受礼物记录',
            key: 3,
            children: <GiftSendList anchor={anchor}/>,
        }
    ];
    return (
        <FixWidthDiv>
            <div>
                {anchor && <Tabs
                    tabPosition={'left'}
                    size={'large'}
                    items={items}
                />}
                {!anchor && <div style={{textAlign: 'center'}}><Spin/></div>}
            </div>
        </FixWidthDiv>
    );
}