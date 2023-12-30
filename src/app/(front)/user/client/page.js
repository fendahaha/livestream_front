'use client'
import {FixWidthDiv} from "@/component/common/WidthDiv";
import {Spin, Tabs} from "antd";
import Tab1 from "@/app/(front)/user/client/tab1";
import {useContext, useEffect, useState} from "react";
import {clientBackendFetch} from "@/util/requestUtil";
import {GlobalContext} from "@/component/context/globalContext";

export default function Component() {
    const {user, updateUser} = useContext(GlobalContext);
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
    ];
    return (
        <FixWidthDiv>
            <div>
                {client?
                    <Tabs tabPosition={'left'} size={'large'} items={items}/>
                    :<div style={{textAlign: 'center'}}><Spin/></div>
                }
            </div>
        </FixWidthDiv>
    );
}