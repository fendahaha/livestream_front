'use client'
import {FixWidthDiv} from "@/component/common/WidthDiv";
import {Spin, Tabs} from "antd";
import Tab1 from "@/app/(front)/user/client/tab1";
import {useContext, useEffect, useState} from "react";
import {clientBackendFetch} from "@/util/requestUtil";
import {GlobalContext} from "@/app/(front)/component/globalContext";

export default function Component() {
    const {userInfo, updateUserInfo} = useContext(GlobalContext);
    const {user} = userInfo;
    const [client, setClient] = useState(null);
    useEffect(() => {
        clientBackendFetch.getJson(`/client/${user?.userUuid}`)
            .then(r => r?.data)
            .then(r => setClient(r));
    }, [user?.userUuid]);
    const items = [
        {
            label: '基本信息',
            key: 1,
            children: <Tab1 clientInfo={client}/>,
        },
        // {
        //     label: '充值',
        //     key: 2,
        //     children: '2',
        // }
    ];
    return (
        <FixWidthDiv>
            <div>
                {client && <Tabs
                    tabPosition={'left'}
                    size={'large'}
                    items={items}
                />}
                {!client && <div style={{textAlign: 'center'}}><Spin/></div>}
            </div>
        </FixWidthDiv>
    );
}