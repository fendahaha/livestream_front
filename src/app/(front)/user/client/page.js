'use client'
import {FixWidthDiv} from "@/component/common/WidthDiv";
import {Spin, Tabs} from "antd";
import Tab1 from "@/app/(front)/user/client/tab1";
import {useContext, useEffect, useState} from "react";
import {clientBackendFetch} from "@/util/requestUtil";
import {GlobalContext} from "@/component/context/globalContext";
import {useMyLocale} from "@/component/context/localeContext";

export default function Component() {
    const {getDict} = useMyLocale('ClientUserPage', 'tabs');
    const {user, updateUser} = useContext(GlobalContext);
    const [client, setClient] = useState(null);
    useEffect(() => {
        clientBackendFetch.getJson(`/client/${user?.userUuid}`)
            .then(r => r?.data)
            .then(r => setClient(r));
    }, [user?.userUuid]);
    const items = [
        {
            label: getDict('tabLabel1'),
            key: 1,
            children: <Tab1 clientInfo={client}/>,
        },
    ];
    return (
        <FixWidthDiv>
            <div>
                {client ?
                    <Tabs tabPosition={'left'} size={'large'} items={items}/>
                    : <div style={{textAlign: 'center'}}><Spin/></div>
                }
            </div>
        </FixWidthDiv>
    );
}