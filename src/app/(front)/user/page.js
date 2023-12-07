'use client'
import {FixWidthDiv} from "@/component/common/WidthDiv";
import {Tabs} from "antd";
import Tab1 from "@/app/(front)/user/tab1";

export default function Component() {
    const items = [
        {
            label: '基本信息',
            key: 1,
            children: <Tab1/>,
        },
        {
            label: '基本信息2',
            key: 2,
            children: '2',
        }
    ];
    return (
        <FixWidthDiv>
            <div>
                <Tabs
                    tabPosition={'left'}
                    size={'large'}
                    items={items}
                />
            </div>
        </FixWidthDiv>
    );
}