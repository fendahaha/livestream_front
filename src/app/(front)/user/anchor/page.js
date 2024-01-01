'use client'
import {FixWidthDiv} from "@/component/common/WidthDiv";
import {Spin, Tabs} from "antd";
import {clientBackendFetch} from "@/util/requestUtil";
import {useContext, useEffect, useState} from "react";
import {GlobalContext} from "@/component/context/globalContext";
import Tab1 from "@/app/(front)/user/anchor/tab1";
import Tab2 from "@/app/(front)/user/anchor/tab2";
import Tab3 from "@/app/(front)/user/anchor/tab3";
import {useMyLocale} from "@/component/context/localeContext";

export default function AnchorPage() {
    const {getDict} = useMyLocale('AnchorUserPage','tabs');
    const {user, updateUser} = useContext(GlobalContext);
    const [anchor, setAnchor] = useState(null);
    useEffect(() => {
        clientBackendFetch.formPostJson('/anchor/query_by_useruuid', {'user_uuid': user?.userUuid})
            .then(r => r?.data)
            .then(r => setAnchor(r))
    }, [user?.userUuid])
    const items = [
        {
            label: getDict('tabLabel1'),
            key: 1,
            children: <Tab1 anchor={anchor}/>,
        },
        {
            label: getDict('tabLabel2'),
            key: 2,
            children: <Tab2 anchor={anchor}/>,
        },
        {
            label: getDict('tabLabel3'),
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