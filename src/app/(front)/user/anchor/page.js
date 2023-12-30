'use client'
import {FixWidthDiv} from "@/component/common/WidthDiv";
import {Spin, Tabs} from "antd";
import {clientBackendFetch} from "@/util/requestUtil";
import {useContext, useEffect, useState} from "react";
import {GlobalContext} from "@/app/(front)/component/globalContext";
import Tab1 from "@/app/(front)/user/anchor/tab1";
import Tab2 from "@/app/(front)/user/anchor/tab2";
import Tab3 from "@/app/(front)/user/anchor/tab3";

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
            children: <Tab1 anchor={anchor}/>,
        },
        {
            label: '直播设置',
            key: 2,
            children: <Tab2 anchor={anchor}/>,
        },
        {
            label: '打赏记录',
            key: 3,
            children: <Tab3 anchor={anchor}/>,
        }
    ];
    return (
        <FixWidthDiv>
            <div>
                {anchor ?
                    <Tabs tabPosition={'left'} size={'large'} items={items}/>
                    : <div style={{textAlign: 'center'}}><Spin/></div>
                }
            </div>
        </FixWidthDiv>
    );
}